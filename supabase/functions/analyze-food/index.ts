// Supabase Edge Function: analyze-food
//
// Receives a base64 food photo from the KuroCal frontend, sends it to the
// Gemini API for nutrition estimation, and returns structured JSON.
//
// GEMINI_API_KEY lives only here (as a Supabase secret) and is never sent
// to or bundled into the React frontend.
//
// Deploy:   supabase functions deploy analyze-food
// Secret:   supabase secrets set GEMINI_API_KEY=your_key_here
// Local:    supabase functions serve analyze-food --env-file supabase/.env

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    description: { type: "STRING" },
    foods: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          portion: { type: "STRING" },
          calories: { type: "NUMBER" },
          protein: { type: "NUMBER" },
          confidence: { type: "STRING", enum: ["high", "medium", "low"] },
        },
        required: ["name", "portion", "calories", "protein", "confidence"],
      },
    },
    totalCalories: { type: "NUMBER" },
    totalProtein: { type: "NUMBER" },
    overallConfidence: { type: "STRING", enum: ["high", "medium", "low"] },
    notes: { type: "STRING" },
  },
  required: ["description", "foods", "totalCalories", "totalProtein", "overallConfidence", "notes"],
};

const PROMPT = `You are a food nutrition estimation assistant.

Analyze the food shown in the image.

Identify each visible food item and estimate its name, portion, calories, and protein, along with a confidence level for that estimate.

Important rules:
- These are estimates, not exact nutritional measurements.
- If portion size is unclear, make a reasonable estimate and clearly lower the confidence for that item instead of guessing a falsely precise number.
- Do not claim the values are medically or scientifically exact.
- Sauces, oil, and hidden ingredients (e.g. inside a soup or mixed dish) should lower confidence rather than being ignored.
- "description" must be one short, friendly sentence describing what the plate looks like (e.g. "Chicken rice with a fried egg and cucumber").
- "notes" must be one short sentence mentioning anything that could affect accuracy (portion uncertainty, sauces, oil, mixed dish, etc).
- If you cannot identify any food in the image at all, return an empty "foods" array, totals of 0, "overallConfidence": "low", and explain why in "notes".

Return ONLY valid JSON matching the provided schema.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "Server is missing a Gemini API key." }, 500);
    }

    let body: { image?: unknown; mimeType?: unknown };
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Request body must be JSON." }, 400);
    }

    const { image, mimeType } = body;
    if (typeof image !== "string" || !image || typeof mimeType !== "string" || !mimeType) {
      return jsonResponse({ error: "Request must include a base64 'image' and its 'mimeType'." }, 400);
    }
    if (!ACCEPTED_MIME_TYPES.includes(mimeType)) {
      return jsonResponse({ error: "Unsupported image type." }, 400);
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: PROMPT }, { inline_data: { mime_type: mimeType, data: image } }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
            thinkingConfig: { thinkingLevel: "LOW" },
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return jsonResponse({ error: "AI analysis failed. Please try again." }, 502);
    }

    const geminiData = await geminiRes.json();
    const text: string | undefined = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return jsonResponse({ error: "AI did not return a result." }, 502);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return jsonResponse({ error: "AI returned an unreadable result." }, 502);
    }

    return jsonResponse(parsed, 200);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "Something went wrong analyzing this photo." }, 500);
  }
});

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
