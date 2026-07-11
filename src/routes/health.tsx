import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import slideHealth from "../assets/slide-health.jpg";
import { PageBackdrop } from "@/components/PageBackdrop";
import { trackAction } from "@/lib/achievements";

export const Route = createFileRoute("/health")({
  component: Health,
  head: () => ({
    meta: [
      { title: "Health — H.E.R.I" },
      { name: "description", content: "Log vitals, track wellness and reach vetted medical professionals in one calm cockpit." },
      { property: "og:title", content: "Health — H.E.R.I" },
      { property: "og:description", content: "Log vitals, track wellness and reach vetted medical professionals in one calm cockpit." },
    ],
    links: [
      { rel: "canonical", href: "/health" },
      { rel: "preload", as: "image", href: slideHealth, fetchpriority: "high" },
    ],
  }),
});

type Entry = { id: string; mood: string; note: string; bp?: string; hr?: string; ts: number };

const professionals = [
  { name: "Dr. Amina Njeri",      specialty: "General Practitioner", city: "Nairobi",  rating: 4.9, next: "Today · 15:30", tele: true  },
  { name: "Dr. Kwame Osei",       specialty: "Cardiology",           city: "Accra",    rating: 4.8, next: "Tomorrow · 09:00", tele: true },
  { name: "Dr. Zola Mbeki",       specialty: "Dermatology",          city: "Cape Town",rating: 4.7, next: "Fri · 11:15", tele: false },
  { name: "Dr. Layla Hassan",     specialty: "Pediatrics",           city: "Cairo",    rating: 5.0, next: "Today · 17:45", tele: true  },
  { name: "Dr. Idris Okafor",     specialty: "Mental Health",        city: "Lagos",    rating: 4.9, next: "Mon · 10:00", tele: true  },
  { name: "Dr. Sipho Dlamini",    specialty: "Sports Medicine",      city: "Durban",   rating: 4.6, next: "Wed · 08:20", tele: false },
];

const emergencyLines = [
  { label: "Ambulance",  number: "999" },
  { label: "Poison hot", number: "0800-720-021" },
  { label: "Mental SOS", number: "1199" },
];

const moods = ["😄 Great", "🙂 Good", "😐 Okay", "😕 Rough", "😣 Unwell"];

const KEY = "heri.health.entries.v1";

function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

function Health() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [mood, setMood] = useState(moods[1]);
  const [note, setNote] = useState("");
  const [bp, setBp] = useState("");
  const [hr, setHr] = useState("");
  const [booked, setBooked] = useState<string | null>(null);
  const [sos, setSos] = useState(false);

  useEffect(() => { setEntries(loadEntries()); trackAction("feature_opened", { feature: "Health" }); }, []);

  const save = () => {
    const e: Entry = { id: crypto.randomUUID?.() ?? String(Date.now()), mood, note, bp, hr, ts: Date.now() };
    const next = [e, ...entries].slice(0, 30);
    setEntries(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    setNote(""); setBp(""); setHr("");
  };

  const activateSOS = () => {
    setSos(true);
    setTimeout(() => setSos(false), 4500);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <PageBackdrop accent="health" />

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl glass-panel px-6 py-10 md:px-12 md:py-14">
        <img src={slideHealth} alt="" aria-hidden="true" loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
        <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary-glow">Module 05</div>
            <h1 className="mt-2 font-display text-3xl md:text-5xl font-semibold leading-tight">
              A calm room for your <span className="text-gradient-electric">wellbeing</span>.
            </h1>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground">
              Log how you feel, keep vitals close, and reach vetted medical professionals — from a quick teleconsult to an SOS with one tap.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={activateSOS}
                className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-8px] shadow-destructive/70 hover:brightness-110 transition"
              >
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Emergency SOS
              </button>
              <a href="#log" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-3 text-sm font-medium hover:bg-accent transition">
                Log a check-in
              </a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Entries", String(entries.length)],
              ["Doctors", String(professionals.length)],
              ["Streak", `${Math.min(entries.length, 30)}d`],
            ].map(([k, v]) => (
              <div key={k} className="glass-panel rounded-2xl p-4 text-center">
                <div className="font-display text-2xl text-gradient-electric">{v}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOS TOAST */}
      {sos && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-2xl border border-destructive/50 bg-destructive/20 px-5 py-3 flex items-center gap-3 animate-[fade-in_0.3s_ease-out]">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
          <div>
            <div className="text-sm font-semibold">SOS broadcast · dispatching nearest responder</div>
            <div className="text-xs text-muted-foreground">Sharing location · ETA 6 min · Contacts notified</div>
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_1.4fr]">
        {/* LOG */}
        <section id="log" className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Daily check-in</h2>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Private · on-device</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`rounded-full px-3 py-1.5 text-xs border transition ${mood === m ? "bg-primary text-primary-foreground border-transparent" : "border-border/60 text-muted-foreground hover:text-foreground"}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Blood pressure</span>
              <input value={bp} onChange={(e) => setBp(e.target.value)} placeholder="120/80" className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Heart rate</span>
              <input value={hr} onChange={(e) => setHr(e.target.value)} placeholder="72 bpm" className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
            </label>
          </div>
          <label className="mt-2 block">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Notes</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Anything on your mind — sleep, meals, symptoms…" className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
          </label>
          <button
            onClick={save}
            className="mt-3 w-full rounded-full bg-gradient-to-r from-primary to-electric px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
          >
            Save check-in
          </button>

          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Recent entries</div>
            {entries.length === 0 ? (
              <div className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border/60 rounded-xl">
                No check-ins yet. Log your first above.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {entries.map((e) => (
                  <div key={e.id} className="rounded-xl border border-border/60 bg-background/40 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{e.mood}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(e.ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground flex gap-3">
                      {e.bp && <span>BP {e.bp}</span>}
                      {e.hr && <span>HR {e.hr}</span>}
                    </div>
                    {e.note && <p className="mt-1 text-xs">{e.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* DIRECTORY + BOOKING */}
        <section className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Medical professionals</h2>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Vetted · Verified</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {professionals.map((p) => {
              const isBooked = booked === p.name;
              return (
                <div key={p.name} className="rounded-xl border border-border/60 bg-background/40 p-4 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-sm font-semibold">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground">{p.specialty} · {p.city}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-signal font-semibold">★ {p.rating}</div>
                      {p.tele && <div className="text-[10px] text-primary-glow">🎥 Tele</div>}
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-muted-foreground">Next: {p.next}</div>
                  <button
                    onClick={() => setBooked(p.name)}
                    disabled={isBooked}
                    className={`mt-3 rounded-full px-3 py-1.5 text-xs font-semibold transition ${isBooked ? "bg-signal/20 text-signal border border-signal/40" : "bg-primary/20 hover:bg-primary/30 text-primary-glow"}`}
                  >
                    {isBooked ? "✓ Booked" : "Book appointment"}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
            <div className="text-[10px] uppercase tracking-widest text-destructive">Emergency lines</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {emergencyLines.map((l) => (
                <a key={l.label} href={`tel:${l.number.replace(/[^0-9]/g, "")}`} className="rounded-lg border border-border/60 bg-background/40 p-3 text-center hover:border-destructive/60 transition">
                  <div className="font-display text-sm">{l.number}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{l.label}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
