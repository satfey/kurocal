import { useNavigate } from "react-router-dom";

type DayCellProps = {
  date: Date;
  dateKey: string;
  inCurrentMonth: boolean;
  isToday: boolean;
  totalCalories: number;
  goal: number;
  hasLogs: boolean;
};

function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function DayCell({ date, dateKey, inCurrentMonth, isToday, totalCalories, goal, hasLogs }: DayCellProps) {
  const navigate = useNavigate();
  const metGoal = hasLogs && totalCalories >= goal * 0.95 && totalCalories <= goal;
  const overGoal = hasLogs && totalCalories > goal;

  return (
    <button
      type="button"
      onClick={() => navigate(`/day/${dateKey}`)}
      className={`relative aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-0.5 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-cute)] ${
        isToday
          ? "border-[var(--primary)] bg-[var(--primary-soft)] shadow-[0_0_0_3px_var(--primary-soft)]"
          : inCurrentMonth
            ? "border-[var(--border-c)] bg-[var(--surface)] hover:border-[var(--primary)]"
            : "border-transparent bg-transparent opacity-40"
      }`}
    >
      {isToday && (
        <span className="absolute -top-1.5 -right-1.5 text-[var(--accent)] text-sm" aria-hidden="true">
          ♡
        </span>
      )}
      <span className={`text-xs sm:text-sm font-semibold ${isToday ? "text-[var(--primary-dark)]" : "text-[var(--text-main)]"}`}>
        {date.getDate()}
      </span>
      {inCurrentMonth && (
        <span className="text-[10px] sm:text-[11px] leading-none">
          {hasLogs ? (
            <span className={overGoal ? "text-[var(--warn)]" : "text-[var(--text-soft)]"}>{formatCompact(totalCalories)}</span>
          ) : (
            <span className="text-[var(--text-faint)]">♡</span>
          )}
        </span>
      )}
      {metGoal && (
        <span className="absolute bottom-1 text-[9px] text-[var(--primary)]" aria-hidden="true">
          ✦
        </span>
      )}
      {overGoal && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--warn)]" aria-hidden="true" />}
    </button>
  );
}
