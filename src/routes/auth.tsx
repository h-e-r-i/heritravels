import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import heriVideo from "../assets/heri-explainer.mp4.asset.json";
import heriLogo from "../assets/heri-logo.png.asset.json";

const searchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
  mode: z.enum(["signin", "signup"]).optional().catch(undefined),
});

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — H.E.R.I" },
      { name: "description", content: "Sign in or create your H.E.R.I account to unlock your cockpit." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function sanitizeRedirect(raw?: string): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

function AuthPage() {
  const { redirect, mode: initialMode } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const to = sanitizeRedirect(redirect);

  const [mode, setMode] = useState<"signin" | "signup">(initialMode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) navigate({ to, replace: true });
    });
    return () => { active = false; };
  }, [navigate, to]);

  async function handleGoogle() {
    setErr(null); setBusy(true);
    try {
      const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (res.error) { setErr(res.error.message ?? "Google sign-in failed"); setBusy(false); return; }
      if (res.redirected) return; // browser navigates away
      navigate({ to, replace: true });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Google sign-in failed");
      setBusy(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null); setNotice(null); setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: {
            data: { full_name: fullName || undefined },
            emailRedirectTo: window.location.origin + to,
          },
        });
        if (error) throw error;
        if (!data.session) {
          setNotice("Check your inbox to confirm your email, then sign in.");
          setMode("signin");
        } else {
          navigate({ to, replace: true });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to, replace: true });
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={heriVideo.url}
        autoPlay muted loop playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/70 to-background/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(63,220,255,0.15),transparent_60%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 flex items-center gap-3 justify-center">
            <img src={heriLogo.url} alt="H.E.R.I" className="h-12 w-12 rounded-full ring-1 ring-primary/40" />
            <div className="text-center">
              <div className="font-display text-xl font-semibold tracking-wider">H.E.R.I</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Wings of Excellence</div>
            </div>
          </Link>

          <div className="glass-panel rounded-2xl p-7 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-semibold">
                {mode === "signin" ? "Welcome back" : "Create your cockpit"}
              </h1>
              <div className="flex text-xs rounded-full border border-border/60 bg-surface/60 p-1">
                <button onClick={() => setMode("signin")} className={`px-3 py-1 rounded-full transition ${mode === "signin" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Sign in</button>
                <button onClick={() => setMode("signup")} className={`px-3 py-1 rounded-full transition ${mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Sign up</button>
              </div>
            </div>

            <button
              onClick={handleGoogle}
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-3 rounded-full border border-border bg-white text-slate-900 hover:brightness-95 disabled:opacity-60 px-5 py-2.5 text-sm font-semibold transition"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span className="flex-1 h-px bg-border/60" /> or <span className="flex-1 h-px bg-border/60" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Full name</span>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Amina Otieno" />
                </label>
              )}
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" placeholder="you@example.com" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Password</span>
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" placeholder="••••••••" />
              </label>

              {err && <div className="text-xs text-destructive">{err}</div>}
              {notice && <div className="text-xs text-signal">{notice}</div>}

              <button type="submit" disabled={busy}
                className="w-full rounded-full bg-gradient-to-r from-primary to-electric px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110 disabled:opacity-60 transition">
                {busy ? "…" : mode === "signin" ? "Enter cockpit" : "Create account"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              By continuing, you agree to fly responsibly. Karibu.
            </p>
          </div>

          <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground">
            ← Back to cockpit
          </Link>
        </div>
      </div>
    </div>
  );
}
