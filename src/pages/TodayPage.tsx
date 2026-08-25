import { DayDashboard } from "../components/dashboard/DayDashboard";
import { todayKey, formatFriendlyDate } from "../lib/date";

export function TodayPage() {
  const date = todayKey();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">Hi cutie ♡</h1>
        <p className="text-sm text-[var(--text-soft)] mt-0.5">{formatFriendlyDate(date)}</p>
      </div>
      <DayDashboard date={date} quickAddPrompt="What did you eat today? ♡" />
    </div>
  );
}
