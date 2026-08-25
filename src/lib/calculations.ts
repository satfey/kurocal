import type { FoodEntry } from "../types";

export function sumCalories(foods: FoodEntry[]): number {
  return foods.reduce((total, f) => total + f.calories, 0);
}

export function sumProtein(foods: FoodEntry[]): number {
  return foods.reduce((total, f) => total + f.protein, 0);
}

export function remainingCalories(total: number, goal: number): number {
  return goal - total;
}

export function progressPercent(total: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((total / goal) * 100));
}

export function formatRemaining(total: number, goal: number): string {
  const remaining = remainingCalories(total, goal);
  if (remaining < 0) return `+${Math.abs(remaining).toLocaleString()} kcal over`;
  return `${remaining.toLocaleString()} kcal left`;
}
