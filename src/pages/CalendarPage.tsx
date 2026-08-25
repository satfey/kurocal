import { useState } from "react";
import { MonthCalendar } from "../components/calendar/MonthCalendar";

export function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const goPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">My Food Calendar ♡</h1>
        <p className="text-sm text-[var(--text-soft)] mt-0.5">Tap any day to see what you ate ✦</p>
      </div>

      <MonthCalendar year={year} month={month} onPrevMonth={goPrev} onNextMonth={goNext} />

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--text-soft)] px-2">
        <span className="flex items-center gap-1.5">
          <span className="text-[var(--accent)]">♡</span> today
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-[var(--primary)]">✦</span> goal reached
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--warn)] inline-block" /> over goal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-[var(--text-faint)]">♡</span> no meals logged
        </span>
      </div>
    </div>
  );
}
