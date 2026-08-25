import { ChevronLeft, ChevronRight } from "lucide-react";
import { useData } from "../../context/DataContext";
import { getMonthGrid, monthLabel, toDateKey, todayKey, weekdayShort } from "../../lib/date";
import { sumCalories } from "../../lib/calculations";
import { DayCell } from "./DayCell";

type MonthCalendarProps = {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function MonthCalendar({ year, month, onPrevMonth, onNextMonth }: MonthCalendarProps) {
  const { foodsByDate, settings } = useData();
  const days = getMonthGrid(year, month);
  const today = todayKey();

  return (
    <div className="rounded-3xl border border-[var(--border-c)] bg-[var(--surface)] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="grid place-items-center w-9 h-9 rounded-full text-[var(--text-soft)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="font-display font-bold text-lg text-[var(--text-main)]">{monthLabel(year, month)}</h2>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="grid place-items-center w-9 h-9 rounded-full text-[var(--text-soft)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="text-center text-[11px] font-semibold text-[var(--text-faint)]">
            {weekdayShort(i)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((date) => {
          const dateKey = toDateKey(date);
          const foods = foodsByDate[dateKey] ?? [];
          return (
            <DayCell
              key={dateKey}
              date={date}
              dateKey={dateKey}
              inCurrentMonth={date.getMonth() === month}
              isToday={dateKey === today}
              totalCalories={sumCalories(foods)}
              goal={settings.calorieGoal}
              hasLogs={foods.length > 0}
            />
          );
        })}
      </div>
    </div>
  );
}
