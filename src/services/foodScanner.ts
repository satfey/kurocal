import { supabase } from "../lib/supabaseClient";
import type { FoodAnalysis } from "../types";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export class FoodScannerError extends Error {}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.slice(result.indexOf(",") + 1);
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function analyzeFoodPhoto(file: File): Promise<FoodAnalysis> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new FoodScannerError("That file type isn't supported. Try a JPEG, PNG, WEBP, or HEIC photo ♡");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new FoodScannerError("That photo is a little too large ♡ Try a smaller one.");
  }

  const base64 = await fileToBase64(file);

  const { data, error } = await supabase.functions.invoke("analyze-food", {
    body: { image: base64, mimeType: file.type },
  });

  if (error || !data || typeof data !== "object" || !Array.isArray((data as FoodAnalysis).foods)) {
    throw new FoodScannerError("Oopsie... I couldn't figure this one out ♡");
  }

  return data as FoodAnalysis;
}
