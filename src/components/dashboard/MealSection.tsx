import type { FoodEntry, Meal } from "../../types";
import { MEAL_META } from "../../lib/meals";
import { FoodItemCard } from "./FoodItemCard";

type MealSectionProps = {
  meal: Meal;
  foods: FoodEntry[];
  onEdit: (food: FoodEntry) => void;
  onDelete: (food: FoodEntry) => void;
};

export function MealSection({ meal, foods, onEdit, onDelete }: MealSectionProps) {
  if (foods.length === 0) return null;
  const meta = MEAL_META[meal];
  const Icon = meta.icon;
  const subtotal = foods.reduce((sum, f) => sum + f.calories, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-6 h-6 rounded-lg" style={{ backgroundColor: `${meta.accent}22`, color: meta.accent }}>
            <Icon size={13} />
          </span>
          <h3 className="font-display font-semibold text-[var(--text-main)]">{meta.label}</h3>
        </div>
        <span className="text-xs text-[var(--text-faint)]">{subtotal} kcal</span>
      </div>
      <div className="flex flex-col gap-2">
        {foods.map((food) => (
          <FoodItemCard key={food.id} food={food} onEdit={() => onEdit(food)} onDelete={() => onDelete(food)} />
        ))}
      </div>
    </div>
  );
}
