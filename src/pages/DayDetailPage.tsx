import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { DayDashboard } from "../components/dashboard/DayDashboard";
import { formatFriendlyDate, todayKey } from "../lib/date";

export function DayDetailPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const dateKey = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayKey();
  const isToday = dateKey === todayKey();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate("/calendar")}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text-soft)] hover:text-[var(--primary)] transition-colors"
        >
          <ChevronLeft size={16} /> Back to Calendar
        </button>
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">
          {formatFriendlyDate(dateKey)} {isToday && <span className="text-[var(--accent)] text-lg">· today ♡</span>}
        </h1>
      </div>

      <DayDashboard
        date={dateKey}
        quickAddPrompt={isToday ? "What did you eat today? ♡" : "Add something to this day ♡"}
        diaryTitle="Food diary ✦"
        emptyTitle={isToday ? "Nothing yummy here yet ♡" : "No meals logged on this day ♡"}
        emptySubtitle={isToday ? "Start your diary by adding your first meal!" : "You can still add what you ate ♡"}
      />
    </div>
  );
}
