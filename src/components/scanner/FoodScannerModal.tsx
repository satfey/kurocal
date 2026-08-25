import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Camera, Image as ImageIcon, X } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Bunny } from "../mascot/Bunny";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { analyzeFoodPhoto, FoodScannerError } from "../../services/foodScanner";
import { MEAL_ORDER, MEAL_META } from "../../lib/meals";
import type { ConfidenceLevel, FoodAnalysis, Meal } from "../../types";

type Step = "capture" | "loading" | "result" | "error";

type EditableItem = {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  confidence: ConfidenceLevel;
};

type ConfirmedFood = {
  name: string;
  calories: number;
  protein: number;
  meal: Meal;
  time: string;
  note?: string;
};

type FoodScannerModalProps = {
  onClose: () => void;
  onRequestManual: () => void;
  onConfirm: (items: ConfirmedFood[]) => Promise<void>;
};

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function currentTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function FoodScannerModal({ onClose, onRequestManual, onConfirm }: FoodScannerModalProps) {
  const [step, setStep] = useState<Step>("capture");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [items, setItems] = useState<EditableItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [meal, setMeal] = useState<Meal>("breakfast");
  const [time, setTime] = useState(currentTime());
  const [saving, setSaving] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setErrorMessage("");
    setStep("loading");

    try {
      const result = await analyzeFoodPhoto(file);
      setAnalysis(result);
      setItems(result.foods.map((f) => ({ ...f, id: makeId() })));
      setStep("result");
    } catch (err) {
      setErrorMessage(err instanceof FoodScannerError ? err.message : "Oopsie... I couldn't figure this one out ♡");
      setStep("error");
    }
  };

  const updateItem = (id: string, patch: Partial<EditableItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const resetToCapture = () => {
    setStep("capture");
    setImagePreview(null);
    setAnalysis(null);
    setItems([]);
    setErrorMessage("");
  };

  const totalCalories = items.reduce((sum, it) => sum + (Number(it.calories) || 0), 0);
  const totalProtein = items.reduce((sum, it) => sum + (Number(it.protein) || 0), 0);

  const handleConfirm = async () => {
    if (items.length === 0 || saving) return;
    setSaving(true);
    await onConfirm(
      items.map((it) => ({
        name: it.name.trim() || "Untitled food",
        calories: Math.max(0, Math.round(Number(it.calories) || 0)),
        protein: Math.max(0, Math.round(Number(it.protein) || 0)),
        meal,
        time,
        note: it.portion.trim() ? `${it.portion.trim()} · AI estimate` : "AI estimate",
      }))
    );
    setSaving(false);
  };

  return (
    <Modal title="AI Food Scanner ♡" onClose={onClose}>
      {step === "capture" && (
        <CaptureStep
          onPickCamera={() => cameraInputRef.current?.click()}
          onPickGallery={() => galleryInputRef.current?.click()}
          onManual={onRequestManual}
        />
      )}

      {step === "loading" && <LoadingStep imagePreview={imagePreview} />}

      {step === "result" && analysis && (
        <ResultStep
          description={analysis.description}
          fallbackNote={analysis.notes}
          items={items}
          meal={meal}
          time={time}
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          saving={saving}
          onMealChange={setMeal}
          onTimeChange={setTime}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
          onTryAgain={resetToCapture}
          onConfirm={handleConfirm}
        />
      )}

      {step === "error" && <ErrorStep message={errorMessage} onRetry={resetToCapture} onManual={onRequestManual} />}

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </Modal>
  );
}

function CaptureStep({
  onPickCamera,
  onPickGallery,
  onManual,
}: {
  onPickCamera: () => void;
  onPickGallery: () => void;
  onManual: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="w-full rounded-2xl bg-[var(--primary-soft)] p-4 text-left">
        <p className="text-xs font-bold text-[var(--primary-dark)] mb-1.5">For better estimates ♡</p>
        <ul className="text-xs text-[var(--text-soft)] list-disc list-inside space-y-0.5">
          <li>Make sure your food is clearly visible</li>
          <li>Take the photo from above</li>
          <li>Avoid very dark photos</li>
          <li>Try to include the whole plate</li>
        </ul>
      </div>

      <Bunny mood="sparkle" className="w-24 h-24 animate-float" />
      <p className="font-semibold text-[var(--text-main)]">Take a photo of your food ♡</p>

      <div className="w-full flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onPickCamera}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-display font-bold py-3 shadow-[var(--shadow-cute)] transition-transform hover:scale-[1.01] active:scale-95"
        >
          <Camera size={18} /> Take Photo
        </button>
        <button
          type="button"
          onClick={onPickGallery}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-c)] text-[var(--text-soft)] font-semibold py-3 hover:bg-[var(--bg-soft)] transition-colors"
        >
          <ImageIcon size={18} /> Choose from Gallery
        </button>
      </div>

      <button type="button" onClick={onManual} className="text-xs text-[var(--text-faint)] underline underline-offset-2">
        Enter manually instead
      </button>
    </div>
  );
}

function LoadingStep({ imagePreview }: { imagePreview: string | null }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      {imagePreview && (
        <img src={imagePreview} alt="" className="w-40 h-40 object-cover rounded-2xl border border-[var(--border-c)]" />
      )}
      <Bunny mood="sleepy" className="w-16 h-16 animate-float" />
      <p className="font-semibold text-[var(--text-main)]">Let me take a little peek... ♡</p>
      <div className="flex gap-2 text-[var(--accent)] text-lg" aria-hidden="true">
        <span className="animate-bounce" style={{ animationDelay: "0ms" }}>✦</span>
        <span className="animate-bounce" style={{ animationDelay: "150ms" }}>✧</span>
        <span className="animate-bounce" style={{ animationDelay: "300ms" }}>✦</span>
      </div>
    </div>
  );
}

function ResultStep({
  description,
  fallbackNote,
  items,
  meal,
  time,
  totalCalories,
  totalProtein,
  saving,
  onMealChange,
  onTimeChange,
  onUpdateItem,
  onRemoveItem,
  onTryAgain,
  onConfirm,
}: {
  description: string;
  fallbackNote: string;
  items: EditableItem[];
  meal: Meal;
  time: string;
  totalCalories: number;
  totalProtein: number;
  saving: boolean;
  onMealChange: (meal: Meal) => void;
  onTimeChange: (time: string) => void;
  onUpdateItem: (id: string, patch: Partial<EditableItem>) => void;
  onRemoveItem: (id: string) => void;
  onTryAgain: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <p className="font-display font-bold text-[var(--text-main)]">✨ I found these!</p>
        {description && <p className="text-xs text-[var(--text-soft)] mt-1">{description}</p>}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--text-soft)] text-center py-2">
          {fallbackNote || "I couldn't spot any food in this photo ♡"}
        </p>
      ) : (
        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-0.5">
          {items.map((item) => (
            <FoodEditRow key={item.id} item={item} onChange={(patch) => onUpdateItem(item.id, patch)} onRemove={() => onRemoveItem(item.id)} />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="rounded-2xl bg-[var(--primary-soft)] p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--primary-dark)]">Total</span>
            <span className="font-display font-bold text-[var(--primary-dark)]">
              {totalCalories.toLocaleString()} kcal · {totalProtein}g protein
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Meal">
              <select
                value={meal}
                onChange={(e) => onMealChange(e.target.value as Meal)}
                className={fieldInputClass}
              >
                {MEAL_ORDER.map((m) => (
                  <option key={m} value={m}>
                    {MEAL_META[m].label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Time">
              <input type="time" value={time} onChange={(e) => onTimeChange(e.target.value)} className={fieldInputClass} />
            </Field>
          </div>
        </>
      )}

      <p className="text-[11px] text-[var(--text-faint)] text-center leading-relaxed">
        AI estimates can be imperfect ♡ Actual calories may vary depending on portion size, ingredients and cooking method.
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onTryAgain}
          className="flex-1 rounded-2xl border border-[var(--border-c)] py-2.5 font-semibold text-[var(--text-soft)] hover:bg-[var(--bg-soft)] transition-colors"
        >
          Try again ✦
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={items.length === 0 || saving}
          className="flex-[2] rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-display font-bold py-2.5 shadow-[var(--shadow-cute)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
        >
          {saving ? "Adding ♡" : "♡ Add all to diary"}
        </button>
      </div>
    </div>
  );
}

function FoodEditRow({
  item,
  onChange,
  onRemove,
}: {
  item: EditableItem;
  onChange: (patch: Partial<EditableItem>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-c)] bg-[var(--surface)] p-3.5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          value={item.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="flex-1 min-w-0 font-semibold text-[var(--text-main)] bg-transparent outline-none border-b border-transparent focus:border-[var(--primary)] transition-colors"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.name}`}
          className="grid place-items-center w-7 h-7 rounded-full text-[var(--text-faint)] hover:bg-[var(--warn-soft)] hover:text-[var(--warn)] transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      <input
        value={item.portion}
        onChange={(e) => onChange({ portion: e.target.value })}
        placeholder="portion"
        className="text-xs text-[var(--text-soft)] bg-transparent outline-none"
      />

      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center gap-1.5 rounded-xl bg-[var(--bg-soft)] px-2.5 py-1.5">
          <span className="text-[10px] font-semibold text-[var(--text-faint)] shrink-0">kcal</span>
          <input
            type="number"
            inputMode="numeric"
            value={item.calories}
            onChange={(e) => onChange({ calories: Number(e.target.value) })}
            className="w-full bg-transparent outline-none text-sm font-semibold text-[var(--text-main)]"
          />
        </label>
        <label className="flex items-center gap-1.5 rounded-xl bg-[var(--bg-soft)] px-2.5 py-1.5">
          <span className="text-[10px] font-semibold text-[var(--text-faint)] shrink-0">protein</span>
          <input
            type="number"
            inputMode="numeric"
            value={item.protein}
            onChange={(e) => onChange({ protein: Number(e.target.value) })}
            className="w-full bg-transparent outline-none text-sm font-semibold text-[var(--text-main)]"
          />
        </label>
      </div>

      <ConfidenceBadge level={item.confidence} />
      {item.confidence === "low" && (
        <p className="text-[11px] text-[var(--warn)]">This one is a little tricky to estimate ♡ You may want to adjust the calories.</p>
      )}
    </div>
  );
}

function ErrorStep({ message, onRetry, onManual }: { message: string; onRetry: () => void; onManual: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      <Bunny mood="sleepy" className="w-20 h-20" />
      <p className="font-semibold text-[var(--text-main)]">{message || "Oopsie... I couldn't figure this one out ♡"}</p>
      <div className="w-full flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onRetry}
          className="w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-display font-bold py-3 shadow-[var(--shadow-cute)] transition-transform hover:scale-[1.01] active:scale-95"
        >
          Try another photo
        </button>
        <button
          type="button"
          onClick={onManual}
          className="w-full rounded-2xl border border-[var(--border-c)] py-3 font-semibold text-[var(--text-soft)] hover:bg-[var(--bg-soft)] transition-colors"
        >
          Enter manually
        </button>
      </div>
    </div>
  );
}

const fieldInputClass =
  "w-full rounded-xl border border-[var(--border-c)] bg-[var(--bg-soft)] px-3.5 py-2.5 text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] transition-colors";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[var(--text-soft)]">{label}</span>
      {children}
    </label>
  );
}
