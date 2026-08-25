import { useState } from "react";
import { Moon, Bell, Trash2, Flame, Drumstick, LogOut, Mail } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { Toggle } from "../components/ui/Toggle";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Bunny } from "../components/mascot/Bunny";

export function SettingsPage() {
  const { settings, updateSettings, resetAllData } = useData();
  const { user, signOut } = useAuth();
  const [calorieGoal, setCalorieGoal] = useState(String(settings.calorieGoal));
  const [proteinGoal, setProteinGoal] = useState(String(settings.proteinGoal));
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const commitCalorieGoal = () => {
    const value = Number(calorieGoal);
    if (!Number.isNaN(value) && value > 0) {
      updateSettings({ calorieGoal: Math.round(value) });
    } else {
      setCalorieGoal(String(settings.calorieGoal));
    }
  };

  const commitProteinGoal = () => {
    const value = Number(proteinGoal);
    if (!Number.isNaN(value) && value > 0) {
      updateSettings({ proteinGoal: Math.round(value) });
    } else {
      setProteinGoal(String(settings.proteinGoal));
    }
  };

  const handleReset = () => {
    resetAllData();
    setCalorieGoal("1800");
    setProteinGoal("100");
    setConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <div className="flex items-center gap-3">
        <Bunny mood="sparkle" className="w-12 h-12" />
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">Settings ♡</h1>
          <p className="text-sm text-[var(--text-soft)] mt-0.5">Make KuroCal fit just for you</p>
        </div>
      </div>

      <section className="rounded-3xl border border-[var(--border-c)] bg-[var(--surface)] p-5 sm:p-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] shrink-0">
            <Mail size={16} />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-[var(--text-main)] text-sm">Signed in as</p>
            <p className="text-xs text-[var(--text-faint)] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setConfirmSignOut(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-c)] px-4 py-2 text-sm font-semibold text-[var(--text-soft)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors"
        >
          <LogOut size={15} /> Sign out
        </button>
      </section>

      <section className="rounded-3xl border border-[var(--border-c)] bg-[var(--surface)] p-5 sm:p-6 flex flex-col gap-5">
        <h2 className="font-display font-bold text-[var(--text-main)]">Daily Goals ✦</h2>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[var(--text-soft)] flex items-center gap-1.5">
            <Flame size={14} /> Daily calorie goal
          </span>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(e.target.value)}
              onBlur={commitCalorieGoal}
              className="w-full rounded-xl border border-[var(--border-c)] bg-[var(--bg-soft)] px-3.5 py-2.5 pr-14 text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] transition-colors"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-faint)] font-medium">kcal</span>
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[var(--text-soft)] flex items-center gap-1.5">
            <Drumstick size={14} /> Daily protein goal
          </span>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={proteinGoal}
              onChange={(e) => setProteinGoal(e.target.value)}
              onBlur={commitProteinGoal}
              className="w-full rounded-xl border border-[var(--border-c)] bg-[var(--bg-soft)] px-3.5 py-2.5 pr-10 text-[var(--text-main)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] transition-colors"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-faint)] font-medium">g</span>
          </div>
        </label>
      </section>

      <section className="rounded-3xl border border-[var(--border-c)] bg-[var(--surface)] p-5 sm:p-6 flex flex-col divide-y divide-[var(--border-c)]">
        <h2 className="font-display font-bold text-[var(--text-main)] pb-4">Preferences ✦</h2>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Moon size={16} />
            </span>
            <div>
              <p className="font-semibold text-[var(--text-main)] text-sm">Dark mode</p>
              <p className="text-xs text-[var(--text-faint)]">Deep purple, easy on the eyes</p>
            </div>
          </div>
          <Toggle checked={settings.darkMode} onChange={(v) => updateSettings({ darkMode: v })} label="Dark mode" />
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Bell size={16} />
            </span>
            <div>
              <p className="font-semibold text-[var(--text-main)] text-sm">Notifications</p>
              <p className="text-xs text-[var(--text-faint)]">Gentle meal reminders</p>
            </div>
          </div>
          <Toggle checked={settings.notifications} onChange={(v) => updateSettings({ notifications: v })} label="Notifications" />
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--warn)]/30 bg-[var(--warn-soft)] p-5 sm:p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-[var(--text-main)] text-sm">Reset all data</p>
          <p className="text-xs text-[var(--text-faint)] mt-0.5">Erases every food entry and setting. This can't be undone.</p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--warn)] text-white font-semibold px-4 py-2 shadow-sm transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Trash2 size={15} /> Reset
        </button>
      </section>

      {resetDone && (
        <p className="text-center text-sm font-semibold text-[var(--primary)]">All clean and fresh again ♡</p>
      )}

      {confirmReset && (
        <ConfirmDialog
          title="Reset everything?"
          description="All your food entries and goals will be permanently deleted."
          confirmLabel="Yes, reset everything"
          danger
          onConfirm={handleReset}
          onCancel={() => setConfirmReset(false)}
        />
      )}

      {confirmSignOut && (
        <ConfirmDialog
          title="Sign out?"
          description="You'll need to sign back in to see your diary again."
          confirmLabel="Yes, sign out"
          onConfirm={() => {
            setConfirmSignOut(false);
            signOut();
          }}
          onCancel={() => setConfirmSignOut(false)}
        />
      )}
    </div>
  );
}
