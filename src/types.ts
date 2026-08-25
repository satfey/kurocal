export type Meal = "breakfast" | "lunch" | "dinner" | "snack";

export type FoodEntry = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  meal: Meal;
  time: string;
  note?: string;
};

export type DayLog = {
  date: string; // YYYY-MM-DD
  foods: FoodEntry[];
};

export type UserSettings = {
  calorieGoal: number;
  proteinGoal: number;
  darkMode: boolean;
  notifications: boolean;
};

export type FoodsByDate = Record<string, FoodEntry[]>;
