import { NavLink } from "react-router-dom";
import { Home, CalendarDays, BarChart3, Settings } from "lucide-react";

const LINKS = [
  { to: "/", label: "Today", icon: Home, end: true },
  { to: "/calendar", label: "Calendar", icon: CalendarDays, end: false },
  { to: "/history", label: "History", icon: BarChart3, end: false },
  { to: "/settings", label: "Settings", icon: Settings, end: false },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--border-c)] bg-[var(--surface)]/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? "text-[var(--primary)]" : "text-[var(--text-faint)]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`grid place-items-center w-9 h-9 rounded-2xl transition-colors ${isActive ? "bg-[var(--primary-soft)]" : ""}`}>
                  <Icon size={19} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
