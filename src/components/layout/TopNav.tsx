import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";
import { Bunny } from "../mascot/Bunny";

const LINKS = [
  { to: "/", label: "Today" },
  { to: "/calendar", label: "Calendar" },
  { to: "/history", label: "History" },
];

export function TopNav() {
  return (
    <header className="hidden md:block sticky top-0 z-30 border-b border-[var(--border-c)] bg-[var(--bg)]/85 backdrop-blur-lg">
      <div className="max-w-[1160px] mx-auto flex items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-3">
          <Bunny mood="happy" className="w-10 h-10" />
          <div>
            <h1 className="font-display font-bold text-lg text-[var(--text-main)] leading-none">KuroCal ♡</h1>
            <p className="text-xs text-[var(--text-faint)] mt-0.5">your cute little food diary ✦</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 rounded-full border border-[var(--border-c)] bg-[var(--surface)] p-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-[var(--shadow-cute)]"
                    : "text-[var(--text-soft)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/settings"
          aria-label="Settings"
          className={({ isActive }) =>
            `grid place-items-center w-10 h-10 rounded-full border border-[var(--border-c)] transition-colors ${
              isActive ? "bg-[var(--primary)] text-white" : "bg-[var(--surface)] text-[var(--text-soft)] hover:text-[var(--primary)]"
            }`
          }
        >
          <Settings size={18} />
        </NavLink>
      </div>
    </header>
  );
}
