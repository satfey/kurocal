import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Bunny } from "../components/mascot/Bunny";

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim() || !password) {
      setError("Fill in both fields first ♡");
      return;
    }
    if (password.length < 6) {
      setError("Password needs at least 6 characters ♡");
      return;
    }

    setSubmitting(true);
    const result = mode === "signin" ? await signIn(email.trim(), password) : await signUp(email.trim(), password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    if (mode === "signup") {
      setInfo("Yay, account created! Check your email to confirm, then sign in ♡");
      setMode("signin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <Bunny mood="happy" className="w-20 h-20 animate-float" />
          <h1 className="font-display text-2xl font-bold text-[var(--text-main)] mt-2">KuroCal ♡</h1>
          <p className="text-sm text-[var(--text-soft)] mt-1">your cute little food diary ✦</p>
        </div>

        <div className="rounded-3xl border border-[var(--border-c)] bg-[var(--surface)] shadow-[var(--shadow-cute-lg)] p-6">
          <div className="flex rounded-full bg-[var(--bg-soft)] p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setInfo("");
              }}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                mode === "signin" ? "bg-[var(--primary)] text-white shadow-[var(--shadow-cute)]" : "text-[var(--text-soft)]"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setInfo("");
              }}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                mode === "signup" ? "bg-[var(--primary)] text-white shadow-[var(--shadow-cute)]" : "text-[var(--text-soft)]"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[var(--text-soft)] flex items-center gap-1.5">
                <Mail size={13} /> Email
              </span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[var(--border-c)] bg-[var(--bg-soft)] px-3.5 py-2.5 text-[var(--text-main)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] transition-colors"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[var(--text-soft)] flex items-center gap-1.5">
                <Lock size={13} /> Password
              </span>
              <input
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-[var(--border-c)] bg-[var(--bg-soft)] px-3.5 py-2.5 text-[var(--text-main)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] transition-colors"
              />
            </label>

            {error && <p className="text-sm text-[var(--warn)] -mt-1">{error}</p>}
            {info && <p className="text-sm text-[var(--primary)] -mt-1">{info}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-display font-bold py-3 shadow-[var(--shadow-cute)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
            >
              {submitting ? "One sec ♡" : mode === "signin" ? "♡ Sign in" : "♡ Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--text-faint)] mt-5">
          Your diary syncs privately to your account ✦
        </p>
      </div>
    </div>
  );
}
