import { useMemo } from "react";
import { Flame, Drumstick, Target } from "lucide-react";
import { useData } from "../context/DataContext";
import { getLastNDays, parseDateKey, weekdayShort } from "../lib/date";
import { sumCalories, sumProtein } from "../lib/calculations";
import { WeekChart } from "../components/history/WeekChart";
import { MacroCard } from "../components/dashboard/MacroCard";

export function HistoryPage() {
  const { foodsByDate, settings } = useData();
  const days = useMemo(() => getLastNDays(7), []);

  const dayStats = useMemo(
    () =>
      days.map((key) => {
        const foods = foodsByDate[key] ?? [];
        return {
          key,
          calories: sumCalories(foods),
          protein: sumProtein(foods),
          hasLogs: foods.length > 0,
        };
      }),
    [days, foodsByDate]
  );

  const loggedDays = dayStats.filter((d) => d.hasLogs);
  const avgCalories = loggedDays.length ? Math.round(loggedDays.reduce((s, d) => s + d.calories, 0) / loggedDays.length) : 0;
  const avgProtein = loggedDays.length ? Math.round(loggedDays.reduce((s, d) => s + d.protein, 0) / loggedDays.length) : 0;
  const goalHitDays = dayStats.filter((d) => d.hasLogs && d.calories <= settings.calorieGoal && d.calories >= settings.calorieGoal * 0.85).length;

  const chartData = dayStats.map((d) => ({
    label: weekdayShort(parseDateKey(d.key).getDay()),
    calories: d.calories,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">History ♡</h1>
        <p className="text-sm text-[var(--text-soft)] mt-0.5">This Week ♡</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MacroCard icon={<Flame size={16} />} label="Avg Calories" value={avgCalories ? avgCalories.toLocaleString() : "—"} sublabel="kcal / day" />
        <MacroCard icon={<Drumstick size={16} />} label="Avg Protein" value={avgProtein ? `${avgProtein}g` : "—"} sublabel="per day" />
        <MacroCard icon={<Target size={16} />} label="Goal Hit" value={`${goalHitDays} / 7`} sublabel="days on target" />
      </div>

      <div className="rounded-3xl border border-[var(--border-c)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="font-display font-bold text-[var(--text-main)] mb-4">Calories this week ✦</h2>
        <WeekChart data={chartData} goal={settings.calorieGoal} />
      </div>
    </div>
  );
}
