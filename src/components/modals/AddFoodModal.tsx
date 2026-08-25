import { useState } from "react";
import type { FoodEntry, Meal } from "../../types";
import { Modal } from "../ui/Modal";
import { MEAL_ORDER, MEAL_META } from "../../lib/meals";

type AddFoodModalProps = {
  onClose: () => void;
  onSave: (input: { name: string; calories: number; protein: number; meal: Meal; time: string; note?: string }) => void;
  initial?: FoodEntry;
  defaultMeal?: Meal;
  submitting?: boolean;
};

function currentTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function AddFoodModal({ onClose, onSave, initial, defaultMeal, submitting = false }: AddFoodModalProps) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [calories, setCalories] = useState(initial ? String(initial.calories) : "");
  const [protein, setProtein] = useState(initial ? String(initial.protein) : "");
  const [meal, setMeal] = useState<Meal>(initial?.meal ?? defaultMeal ?? "breakfast");
  const [time, setTime] = useState(initial?.time ?? currentTime());
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const cal = Number(calories);
    const pro = protein.trim() === "" ? 0 : Number(protein);

    if (!trimmedName) {
      setError("Give your food a name first ♡");
      return;
    }
    if (!calories || Number.isNaN(cal) || cal <= 0) {
      setError("Calories should be a positive number ♡");
      return;
    }
    if (Number.isNaN(pro) || pro < 0) {
      setError("Protein should be a positive number ♡");
      return;
    }

    onSave({ name: trimmedName, calories: Math.round(cal), protein: Math.round(pro), meal, time, note: note.trim() || undefined });
  };

  return (
    <Modal title={isEdit ? "Edit food ♡" : "Add food ♡"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Food name">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What did you eat?"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Calories">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g. 350"
              className={inputClass}
            />
          </Field>
          <Field label="Protein (g)">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="e.g. 25"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Meal">
          <div className="grid grid-cols-4 gap-2">
            {MEAL_ORDER.map((m) => {
              const meta = MEAL_META[m];
              const Icon = meta.icon;
              const active = meal === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMeal(m)}
                  className={`flex flex-col items-center gap-1 rounded-2xl py-2.5 border transition-all ${
                    active
                      ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary-dark)] scale-[1.02]"
                      : "border-[var(--border-c)] text-[var(--text-soft)] hover:bg-[var(--bg-soft)]"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-[11px] font-medium">{meta.label}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Time">
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Note (optional)">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. homemade, ate with friends"
            className={inputClass}
          />
        </Field>

        {error && <p className="text-sm text-[var(--warn)] -mt-1">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-display font-bold py-3 shadow-[var(--shadow-cute)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
        >
          {submitting ? "Saving ♡" : isEdit ? "♡ Save changes" : "♡ Add to my diary"}
        </button>
      </form>
    </Modal>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--border-c)] bg-[var(--bg-soft)] px-3.5 py-2.5 text-[var(--text-main)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[var(--text-soft)]">{label}</span>
      {children}
    </label>
  );
}
