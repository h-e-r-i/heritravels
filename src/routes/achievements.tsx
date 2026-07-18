import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { resetProgress, trackAction, useAchievements, type Milestone } from "@/lib/achievements";
import { destinations } from "@/lib/destinations";
import { LOCATION_EVENT, LOCATION_VISIT_EVENT, readLocation, TWO_DAYS_SECONDS, formatDuration, type LocationState } from "@/lib/location-tracker";
import bgAchievements from "../assets/bg-achievements.jpg";
import { PageBackdrop } from "@/components/PageBackdrop";
import { FriendsPanel } from "@/components/FriendsPanel";

export const Route = createFileRoute("/achievements")({
  component: Achievements,
  head: () => ({
    meta: [
      { title: "Achievements — H.E.R.I" },
      { name: "description", content: "Milestones, journey wings and travel companions — every action in H.E.R.I becomes progress here." },
    ],
    links: [
      { rel: "canonical", href: "/achievements" },
      { rel: "preload", as: "image", href: bgAchievements, fetchpriority: "high" },
    ],
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
  const [loc, setLoc] = useState<LocationState>(() => readLocation());
  const [tab, setTab] = useState<"milestones" | "journey" | "friends">("milestones");

  useEffect(() => {
    const sync = () => setLoc(readLocation());
    window.addEventListener(LOCATION_EVENT, sync);
    window.addEventListener(LOCATION_VISIT_EVENT, sync);
    return () => {
      window.removeEventListener(LOCATION_EVENT, sync);
      window.removeEventListener(LOCATION_VISIT_EVENT, sync);
    };
  }, []);

  const visitedCount = Object.keys(loc.visited).length;
  const inProgress = Object.entries(loc.seconds).filter(([id, s]) => !loc.visited[id] && s > 0).length;
  const journeyPoints = visitedCount * 250;

  const pct = Math.round(((unlockedCount + visitedCount) / (milestones.length + destinations.length)) * 100);
  const grandPoints = totalPoints + journeyPoints;
  const level = 1 + Math.floor(grandPoints / 300);
  const nextLevelPts = level * 300;
  const levelPct = Math.min(100, Math.round((grandPoints / nextLevelPts) * 100));

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <PageBackdrop accent="achievements" />
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Module 03</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">
            Wings of <span className="text-gradient-electric">Excellence</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Milestones, journey wings and companions — every action becomes progress here.</p>
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
            <div className="text-[10px] text-muted-foreground mt-1">{grandPoints} / {nextLevelPts} pts</div>
          </div>
          <Stat label="Points" value={grandPoints.toLocaleString()} tone="text-electric" />
          <Stat label="Badges" value={`${unlockedCount + visitedCount} / ${milestones.length + destinations.length}`} tone="text-primary-glow" />
          <Stat label="Completion" value={`${pct}%`} tone="text-signal" />
        </div>
      </section>

      {/* TABS */}
      <div className="mt-8 flex gap-1 rounded-full border border-border/60 bg-surface/60 p-1 text-xs w-fit">
        {([
          ["milestones", `Milestones (${unlockedCount}/${milestones.length})`],
          ["journey", `Journey Wings (${visitedCount}/${destinations.length})`],
          ["friends", "Companions"],
        ] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-1.5 rounded-full transition ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "milestones" && (
        <section className="mt-6">
          <p className="text-xs text-muted-foreground mb-4">
            Do things across the app — chat with H.E.R.I, plan routes, explore the dashboard — to fill these up.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {milestones.map((m) => {
              const current = Math.min(state.counters[m.action] ?? 0, m.target);
              const p = Math.round((current / m.target) * 100);
              const done = !!state.unlocked[m.id];
              return (
                <div key={m.id} className={`relative rounded-2xl border p-5 transition ${done ? `glass-panel ${rarityStyles[m.rarity]}` : "border-border/60 bg-surface/40"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-4xl" style={{ filter: done ? "none" : "grayscale(1) opacity(0.55)" }}>{m.icon}</div>
                    <span className={`text-[10px] uppercase tracking-[0.2em] rounded-full border px-2 py-0.5 ${rarityStyles[m.rarity]}`}>{m.rarity}</span>
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
                      <div className={`h-full rounded-full transition-all ${done ? "bg-gradient-to-r from-signal to-electric" : "bg-gradient-to-r from-primary to-electric"}`} style={{ width: `${p}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {tab === "journey" && (
        <section className="mt-6">
          <div className="rounded-2xl border border-electric/40 bg-electric/5 p-4 text-sm">
            {loc.enabled
              ? <>H.E.R.I is tracking your position. Spend <b>48h</b> within 25 km of any of the 100 destinations to earn its Journey Wing (+250 pts).</>
              : <>Location tracking is off. Enable it from the <a href="/destinations" className="text-electric underline">Destinations</a> page to earn Journey Wings by physically visiting places.</>}
            <span className="ml-2 text-muted-foreground">· {visitedCount} unlocked · {inProgress} in progress</span>
          </div>

          <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {destinations.map((d) => {
              const secs = loc.seconds[d.id] ?? 0;
              const visited = !!loc.visited[d.id];
              const pctD = Math.min(100, Math.round((secs / TWO_DAYS_SECONDS) * 100));
              return (
                <div key={d.id} className={`rounded-2xl border p-3 ${visited ? "border-signal/60 bg-signal/5" : secs > 0 ? "border-electric/50 bg-electric/5" : "border-border/50 bg-surface/40"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{d.region}</div>
                      <div className="font-display text-sm font-semibold leading-tight">{d.name}</div>
                      <div className="text-[10px] text-muted-foreground">{d.country}</div>
                    </div>
                    <div className="text-xl">{visited ? "🏆" : secs > 0 ? "🛬" : "🌐"}</div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{formatDuration(secs)} / 48h</span>
                      <span>{visited ? "Unlocked" : `${pctD}%`}</span>
                    </div>
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-background/60">
                      <div className={`h-full ${visited ? "bg-signal" : "bg-gradient-to-r from-primary to-electric"}`} style={{ width: `${visited ? 100 : pctD}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {tab === "friends" && (
        <section className="mt-6">
          <FriendsPanel />
        </section>
      )}
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
