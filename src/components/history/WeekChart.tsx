type WeekChartProps = {
  data: { label: string; calories: number }[];
  goal: number;
};

export function WeekChart({ data, goal }: WeekChartProps) {
  const max = Math.max(goal, ...data.map((d) => d.calories), 1);

  return (
    <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 px-2">
      {data.map((d) => {
        const heightPct = Math.max(4, (d.calories / max) * 100);
        const over = d.calories > goal;
        return (
          <div key={d.label} className="flex flex-col items-center gap-2 flex-1 h-full">
            <span className="text-[11px] font-semibold text-[var(--text-soft)] h-4">
              {d.calories > 0 ? d.calories.toLocaleString() : ""}
            </span>
            <div className="w-full max-w-9 flex-1 min-h-0 flex items-end rounded-full bg-[var(--ring-track)] overflow-hidden">
              <div
                className={`w-full rounded-full transition-all duration-700 ease-out ${
                  over ? "bg-[var(--warn)]" : "bg-gradient-to-t from-[var(--primary)] to-[var(--accent)]"
                }`}
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className="text-[11px] text-[var(--text-faint)] font-medium">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
