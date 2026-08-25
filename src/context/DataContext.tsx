import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { FoodEntry, FoodsByDate, Meal, UserSettings } from "../types";
import { DEFAULT_SETTINGS } from "../lib/storage";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

type NewFoodInput = {
  name: string;
  calories: number;
  protein: number;
  meal: Meal;
  time: string;
  note?: string;
};

type FoodRow = {
  id: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  meal: string;
  time: string;
  note: string | null;
};

type SettingsRow = {
  calorie_goal: number;
  protein_goal: number;
  dark_mode: boolean;
  notifications: boolean;
};

type DataContextValue = {
  foodsByDate: FoodsByDate;
  settings: UserSettings;
  loading: boolean;
  getFoodsForDate: (date: string) => FoodEntry[];
  addFood: (date: string, input: NewFoodInput) => Promise<void>;
  updateFood: (date: string, id: string, input: NewFoodInput) => Promise<void>;
  deleteFood: (date: string, id: string) => Promise<void>;
  updateSettings: (partial: Partial<UserSettings>) => Promise<void>;
  resetAllData: () => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

function rowToEntry(row: FoodRow): FoodEntry {
  return {
    id: row.id,
    name: row.name,
    calories: row.calories,
    protein: row.protein,
    meal: row.meal as Meal,
    time: row.time,
    note: row.note ?? undefined,
  };
}

function settingsFromRow(row: SettingsRow): UserSettings {
  return {
    calorieGoal: row.calorie_goal,
    proteinGoal: row.protein_goal,
    darkMode: row.dark_mode,
    notifications: row.notifications,
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [foodsByDate, setFoodsByDate] = useState<FoodsByDate>({});
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFoodsByDate({});
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const [foodsRes, settingsRes] = await Promise.all([
        supabase.from("food_entries").select("*").eq("user_id", user.id).order("date").order("time"),
        supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
      ]);

      if (cancelled) return;

      if (foodsRes.data) {
        const grouped: FoodsByDate = {};
        for (const row of foodsRes.data as FoodRow[]) {
          (grouped[row.date] ??= []).push(rowToEntry(row));
        }
        setFoodsByDate(grouped);
      }

      if (settingsRes.data) {
        setSettings(settingsFromRow(settingsRes.data as SettingsRow));
      } else {
        const { data: created } = await supabase
          .from("user_settings")
          .insert({
            user_id: user.id,
            calorie_goal: DEFAULT_SETTINGS.calorieGoal,
            protein_goal: DEFAULT_SETTINGS.proteinGoal,
            dark_mode: DEFAULT_SETTINGS.darkMode,
            notifications: DEFAULT_SETTINGS.notifications,
          })
          .select()
          .single();
        if (!cancelled && created) setSettings(settingsFromRow(created as SettingsRow));
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [settings.darkMode]);

  const getFoodsForDate = (date: string): FoodEntry[] => foodsByDate[date] ?? [];

  const addFood = async (date: string, input: NewFoodInput) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("food_entries")
      .insert({ user_id: user.id, date, ...input })
      .select()
      .single();
    if (error || !data) {
      console.error("addFood failed:", error);
      return;
    }
    const entry = rowToEntry(data as FoodRow);
    setFoodsByDate((prev) => ({ ...prev, [date]: [...(prev[date] ?? []), entry] }));
  };

  const updateFood = async (date: string, id: string, input: NewFoodInput) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("food_entries")
      .update(input)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (error || !data) {
      console.error("updateFood failed:", error);
      return;
    }
    const entry = rowToEntry(data as FoodRow);
    setFoodsByDate((prev) => ({
      ...prev,
      [date]: (prev[date] ?? []).map((f) => (f.id === id ? entry : f)),
    }));
  };

  const deleteFood = async (date: string, id: string) => {
    if (!user) return;
    const { error } = await supabase.from("food_entries").delete().eq("id", id).eq("user_id", user.id);
    if (error) {
      console.error("deleteFood failed:", error);
      return;
    }
    setFoodsByDate((prev) => ({ ...prev, [date]: (prev[date] ?? []).filter((f) => f.id !== id) }));
  };

  const updateSettings = async (partial: Partial<UserSettings>) => {
    if (!user) return;
    const next = { ...settings, ...partial };
    setSettings(next);
    const { error } = await supabase.from("user_settings").upsert({
      user_id: user.id,
      calorie_goal: next.calorieGoal,
      protein_goal: next.proteinGoal,
      dark_mode: next.darkMode,
      notifications: next.notifications,
      updated_at: new Date().toISOString(),
    });
    if (error) console.error("updateSettings failed:", error);
  };

  const resetAllData = async () => {
    if (!user) return;
    await Promise.all([
      supabase.from("food_entries").delete().eq("user_id", user.id),
      supabase.from("user_settings").delete().eq("user_id", user.id),
    ]);
    setFoodsByDate({});
    setSettings(DEFAULT_SETTINGS);
  };

  const value = useMemo<DataContextValue>(
    () => ({
      foodsByDate,
      settings,
      loading,
      getFoodsForDate,
      addFood,
      updateFood,
      deleteFood,
      updateSettings,
      resetAllData,
    }),
    [foodsByDate, settings, loading]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
