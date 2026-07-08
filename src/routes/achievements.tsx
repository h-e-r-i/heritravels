import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { resetProgress, trackAction, useAchievements, type Milestone } from "@/lib/achievements";
import bgAchievements from "../assets/bg-achievements.jpg";

export const Route = createFileRoute("/achievements")({
  component: Achievements,
  head: () => ({
    meta: [
      { title: "Achievements — H.E.R.I" },
      { name: "description", content: "Real progress tracking. Every action in the H.E.R.I cockpit becomes a milestone." },
    ],
    links: [{ rel: "canonical", href: "/achievements" }],
  }),
});

const rarityStyles: Record<Milestone["rarity"], string> = {
  common: "border-border text-muted-foreground",
  rare: "border-primary/60 text-primary-glow",
  epic: "border-electric/70 text-electric",
  legendary: "border-signal/80 text-signal shadow-[0_0_25px_-5px_oklch(0.85_0.14_190_/_0.6)]",
};

const actionLabels: Record<string, string> = {
  chat_sent: "messages sent",
  route_planned: "routes planned",
  city_searched: "cities searched",
  feature_opened: "features opened",
  mode_switched: "travel modes tried",
  navigator_visited: "navigator visits",
};

function Achievements() {
  useEffect(() => { trackAction("achievements_visited"); }, []);
  const { state, totalPoints, unlockedCount, milestones } = useAchievements();

  const pct = Math.round((unlockedCount / milestones.length) * 100);
  const level = 1 + Math.floor(totalPoints / 300);
  const nextLevelPts = level * 300;
  const levelPct = Math.min(100, Math.round((totalPoints / nextLevelPts) * 100));

  const recentUnlocks = milestones
    .filter((m) => state.unlocked[m.id])
    .sort((a, b) => state.unlocked[b.id] - state.unlocked[a.id])
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Module 03</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">
            Wings of <span className="text-gradient-electric">Excellence</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Every action across H.E.R.I turns into real progress here.</p>
        </div>
        <button
          onClick={() => { if (confirm("Reset all achievement progress?")) resetProgress(); }}
          className="rounded-full border border-border/60 bg-surface/60 px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-destructive/60 transition"
        >
          Reset progress
        </button>
      </div>

      {/* HERO STATS */}
      <section className="mt-8 relative overflow-hidden rounded-2xl glass-panel p-6">
        <img src={bgAchievements} alt="" aria-hidden="true" loading="lazy" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="relative grid gap-6 md:grid-cols-4 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Level</div>
            <div className="font-display text-5xl text-gradient-electric">{level}</div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-electric transition-all" style={{ width: `${levelPct}%` }} />
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{totalPoints} / {nextLevelPts} pts</div>
          </div>
          <Stat label="Points" value={totalPoints.toLocaleString()} tone="text-electric" />
          <Stat label="Badges" value={`${unlockedCount} / ${milestones.length}`} tone="text-primary-glow" />
          <Stat label="Completion" value={`${pct}%`} tone="text-signal" />
        </div>
      </section>

      {/* RECENT UNLOCKS */}
      {recentUnlocks.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold mb-3">Recent unlocks</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {recentUnlocks.map((m) => (
              <div key={m.id} className={`glass-panel rounded-2xl p-4 border ${rarityStyles[m.rarity]}`}>
                <div className="text-3xl">{m.icon}</div>
                <div className="mt-2 font-display text-sm font-semibold">{m.name}</div>
                <div className="text-[10px] text-muted-foreground">{new Date(state.unlocked[m.id]).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MILESTONES */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold mb-3">Milestones</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Do things across the app — chat with H.E.R.I, plan routes, explore the dashboard — to fill these up.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {milestones.map((m) => {
            const current = Math.min(state.counters[m.action] ?? 0, m.target);
            const p = Math.round((current / m.target) * 100);
            const done = !!state.unlocked[m.id];
            return (
              <div
                key={m.id}
                className={`relative rounded-2xl border p-5 transition ${
                  done ? `glass-panel ${rarityStyles[m.rarity]}` : "border-border/60 bg-surface/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-4xl" style={{ filter: done ? "none" : "grayscale(1) opacity(0.55)" }}>{m.icon}</div>
                  <span className={`text-[10px] uppercase tracking-[0.2em] rounded-full border px-2 py-0.5 ${rarityStyles[m.rarity]}`}>
                    {m.rarity}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="font-display text-base font-semibold">{m.name}</div>
                  <div className="text-xs text-signal">+{m.points}</div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>{current} / {m.target} {actionLabels[m.action] ?? m.action}</span>
                    <span>{done ? "✓ Unlocked" : `${p}%`}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={`h-full rounded-full transition-all ${done ? "bg-gradient-to-r from-signal to-electric" : "bg-gradient-to-r from-primary to-electric"}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/40 p-4">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-3xl font-semibold ${tone}`}>{value}</div>
    </div>
  );
}
