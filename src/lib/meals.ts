import type { Meal } from "../types";
import { Sunrise, Sun, Moon, Cookie } from "lucide-react";

export const MEAL_ORDER: Meal[] = ["breakfast", "lunch", "dinner", "snack"];

export const MEAL_META: Record<Meal, { label: string; icon: typeof Sunrise; accent: string }> = {
  breakfast: { label: "Breakfast", icon: Sunrise, accent: "#f4a86a" },
  lunch: { label: "Lunch", icon: Sun, accent: "#ef4a9c" },
  dinner: { label: "Dinner", icon: Moon, accent: "#8347bd" },
  snack: { label: "Snack", icon: Cookie, accent: "#b98ae5" },
};
