import { Pencil, Trash2 } from "lucide-react";
import type { FoodEntry } from "../../types";
import { MEAL_META } from "../../lib/meals";

type FoodItemCardProps = {
  food: FoodEntry;
  onEdit: () => void;
  onDelete: () => void;
  leaving?: boolean;
};

export function FoodItemCard({ food, onEdit, onDelete, leaving }: FoodItemCardProps) {
  const meta = MEAL_META[food.meal];
  const Icon = meta.icon;

  return (
    <div
      className={`group flex items-center gap-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-c)] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-cute)] ${
        leaving ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <span
        className="grid place-items-center w-10 h-10 shrink-0 rounded-xl"
        style={{ backgroundColor: `${meta.accent}22`, color: meta.accent }}
      >
        <Icon size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[var(--text-main)] truncate">{food.name}</p>
        <p className="text-xs text-[var(--text-faint)]">
          {food.time && <span>{food.time} · </span>}
          {food.calories} kcal · {food.protein}g protein
          {food.note && <span className="italic"> · {food.note}</span>}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${food.name}`}
          className="grid place-items-center w-8 h-8 rounded-full text-[var(--text-soft)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${food.name}`}
          className="grid place-items-center w-8 h-8 rounded-full text-[var(--text-soft)] hover:bg-[var(--warn-soft)] hover:text-[var(--warn)] transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
