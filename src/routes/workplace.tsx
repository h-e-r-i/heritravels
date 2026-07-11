import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import slideWorkplace from "../assets/slide-workplace.jpg";
import { PageBackdrop } from "@/components/PageBackdrop";
import { trackAction } from "@/lib/achievements";

export const Route = createFileRoute("/workplace")({
  component: Workplace,
  head: () => ({
    meta: [
      { title: "Workplace — H.E.R.I" },
      { name: "description", content: "Private channels for your institution — memos, news and announcements gated by an invite code." },
      { property: "og:title", content: "Workplace — H.E.R.I" },
      { property: "og:description", content: "Private channels for your institution — memos, news and announcements gated by an invite code." },
    ],
    links: [
      { rel: "canonical", href: "/workplace" },
      { rel: "preload", as: "image", href: slideWorkplace, fetchpriority: "high" },
    ],
  }),
});

type Post = { id: string; author: string; role: string; kind: "memo" | "news" | "alert"; title: string; body: string; ts: number };
type Session = { workspace: string; code: string; role: string };

const WORKSPACES: Record<string, { name: string; code: string; seed: Post[] }> = {
  "HERI-AVIATION": {
    name: "H.E.R.I Aviation Guild",
    code: "HERI-AVIATION",
    seed: [
      { id: "a1", author: "Captain Otieno", role: "Ops Lead",   kind: "memo",  title: "New pre-flight brief template",   body: "All crews adopt the v3 template from Monday. Sign-off required in the ops portal.", ts: Date.now() - 3600_000 * 3 },
      { id: "a2", author: "Amina Bakari",   role: "HR",         kind: "news",  title: "Wellness week — teleclinic open", body: "Free 15-min consults with Dr. Njeri all week. Book from the Health module.",        ts: Date.now() - 3600_000 * 26 },
      { id: "a3", author: "System",         role: "Automation", kind: "alert", title: "Weather advisory: NBO-JRO",       body: "Convective cells forecast Thu 14:00-18:00. Rebrief flights.",                     ts: Date.now() - 3600_000 * 48 },
    ],
  },
  "NAIROBI-GEN-HOSP": {
    name: "Nairobi General Hospital",
    code: "NAIROBI-GEN-HOSP",
    seed: [
      { id: "b1", author: "Dr. Kwame",      role: "Chief of Staff", kind: "memo",  title: "Ward 4 renovation window", body: "Ward 4 closed for refit Sat-Sun. Elective patients redirected to Ward 2.", ts: Date.now() - 3600_000 * 5 },
      { id: "b2", author: "Nurse Zola",     role: "Head Nurse",     kind: "news",  title: "New paediatric protocols", body: "Updated triage flow published in the intranet. Read before Monday shift.", ts: Date.now() - 3600_000 * 30 },
    ],
  },
};

const SESSION_KEY = "heri.workplace.session.v1";
const POSTS_KEY = (code: string) => `heri.workplace.posts.${code}`;

function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null"); } catch { return null; }
}
function loadPosts(code: string): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(POSTS_KEY(code));
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return WORKSPACES[code]?.seed ?? [];
}

function Workplace() {
  const [session, setSession] = useState<Session | null>(null);
  const [code, setCode] = useState("");
  const [role, setRole] = useState("Team member");
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [kind, setKind] = useState<Post["kind"]>("memo");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [filter, setFilter] = useState<"all" | Post["kind"]>("all");

  useEffect(() => {
    const s = loadSession();
    if (s) { setSession(s); setPosts(loadPosts(s.code)); }
    trackAction("feature_opened", { feature: "Workplace" });
  }, []);

  const join = () => {
    const key = code.trim().toUpperCase();
    const ws = WORKSPACES[key];
    if (!ws) { setError("That invite code isn't recognised. Try HERI-AVIATION or NAIROBI-GEN-HOSP."); return; }
    const s: Session = { workspace: ws.name, code: key, role };
    setSession(s);
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setPosts(loadPosts(key));
    setError(null);
  };

  const leave = () => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const post = () => {
    if (!session || !title.trim()) return;
    const p: Post = { id: crypto.randomUUID?.() ?? String(Date.now()), author: "You", role: session.role, kind, title, body, ts: Date.now() };
    const next = [p, ...posts];
    setPosts(next);
    localStorage.setItem(POSTS_KEY(session.code), JSON.stringify(next));
    setTitle(""); setBody("");
  };

  const visible = filter === "all" ? posts : posts.filter((p) => p.kind === filter);

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <PageBackdrop accent="workplace" />
        <div className="relative overflow-hidden rounded-3xl glass-panel">
          <img src={slideWorkplace} alt="" aria-hidden="true" loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/70 to-background/30" />
          <div className="relative p-8 md:p-12">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary-glow">Module 06</div>
            <h1 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Enter your workspace.</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg">
              Workplaces are private channels for your institution — memos, news and alerts shared only with authorised members. Ask an admin for the invite code.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-[2fr_1fr]">
              <input
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(null); }}
                placeholder="Invite code · e.g. HERI-AVIATION"
                className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
              >
                <option>Team member</option>
                <option>Team lead</option>
                <option>Admin</option>
              </select>
            </div>

            {error && <div className="mt-3 text-xs text-destructive">{error}</div>}

            <button
              onClick={join}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-electric px-6 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
            >
              Join workspace →
            </button>

            <div className="mt-8 text-[10px] uppercase tracking-widest text-muted-foreground">Try a demo</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.values(WORKSPACES).map((w) => (
                <button
                  key={w.code}
                  onClick={() => { setCode(w.code); }}
                  className="rounded-full border border-border/60 bg-surface/60 px-3 py-1.5 text-xs hover:border-primary/60 transition"
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <PageBackdrop accent="workplace" />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary-glow">Workplace · {session.code}</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">{session.workspace}</h1>
          <p className="text-sm text-muted-foreground mt-1">Signed in as <span className="text-foreground font-medium">{session.role}</span> · shared with authorised members only.</p>
        </div>
        <button onClick={leave} className="text-xs rounded-full border border-border/60 px-3 py-1.5 hover:bg-accent transition self-start md:self-auto">Leave workspace</button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        {/* COMPOSE */}
        <section className="glass-panel rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold">Broadcast</h2>
          <div className="mt-3 flex gap-1 rounded-full border border-border/60 bg-surface/60 p-1 text-xs">
            {(["memo", "news", "alert"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`flex-1 rounded-full px-2 py-1.5 capitalize transition ${kind === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {k === "memo" ? "📝 Memo" : k === "news" ? "📰 News" : "⚠️ Alert"}
              </button>
            ))}
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="mt-3 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Details — visible only to workspace members." className="mt-2 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
          <button
            onClick={post}
            disabled={!title.trim()}
            className="mt-3 w-full rounded-full bg-gradient-to-r from-primary to-electric px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-40 transition"
          >
            Post to {session.workspace.split(" ")[0]}
          </button>

          <div className="mt-6 rounded-xl border border-border/60 bg-background/40 p-3 text-xs">
            <div className="text-[10px] uppercase tracking-widest text-primary-glow mb-1">Members ({(session.role === "Admin" ? 42 : 12)})</div>
            <div className="flex -space-x-2">
              {["A","K","Z","N","M","+"].map((s, idx) => (
                <div key={idx} className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold ring-2 ring-background ${
                  idx === 5 ? "bg-surface text-muted-foreground" : "bg-gradient-to-br from-primary to-electric text-primary-foreground"
                }`}>{s}</div>
              ))}
            </div>
          </div>
        </section>

        {/* FEED */}
        <section className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Feed</h2>
            <div className="flex gap-1 rounded-full border border-border/60 bg-surface/60 p-1 text-xs">
              {(["all", "memo", "news", "alert"] as const).map((k) => (
                <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1 rounded-full capitalize transition ${filter === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{k}</button>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {visible.length === 0 && (
              <div className="text-xs text-muted-foreground py-8 text-center border border-dashed border-border/60 rounded-xl">Nothing here yet.</div>
            )}
            {visible.map((p) => (
              <article key={p.id} className="rounded-xl border border-border/60 bg-background/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-electric flex items-center justify-center text-xs font-semibold text-primary-foreground">
                      {p.author[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{p.author} <span className="text-[10px] text-muted-foreground font-normal">· {p.role}</span></div>
                      <div className="text-[10px] text-muted-foreground">{new Date(p.ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5 border ${
                    p.kind === "alert" ? "border-destructive/40 text-destructive bg-destructive/10" :
                    p.kind === "news"  ? "border-signal/40 text-signal bg-signal/10" :
                                         "border-primary/40 text-primary-glow bg-primary/10"
                  }`}>{p.kind}</span>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold">{p.title}</h3>
                {p.body && <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
