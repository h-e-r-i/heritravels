import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/achievements")({
  component: Achievements,
  head: () => ({
    meta: [
      { title: "Achievements — H.E.R.I" },
      { name: "description", content: "Turn exploration into a game. Badges, streaks and prizes for the places you visit." },
    ],
    links: [{ rel: "canonical", href: "/achievements" }],
  }),
});

type Badge = {
  name: string;
  place: string;
  earned: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: string;
  desc: string;
};

const rarityStyles: Record<Badge["rarity"], string> = {
  common: "border-border text-muted-foreground",
  rare: "border-primary/60 text-primary-glow",
  epic: "border-electric/70 text-electric",
  legendary:
    "border-signal/80 text-signal shadow-[0_0_25px_-5px_oklch(0.85_0.14_190_/_0.6)]",
};

const badges: Badge[] = [
  { name: "Mount Kenya Ascent",   place: "Kenya",     earned: true,  rarity: "legendary", icon: "🏔️", desc: "Summit reached above 4,000m." },
  { name: "Serengeti Safari",     place: "Tanzania",  earned: true,  rarity: "epic",      icon: "🦁", desc: "Big Five spotted in one visit." },
  { name: "Zanzibar Sailor",      place: "Zanzibar",  earned: true,  rarity: "rare",      icon: "⛵", desc: "Sailed a traditional dhow at sunset." },
  { name: "Pyramid Explorer",     place: "Egypt",     earned: true,  rarity: "epic",      icon: "🔺", desc: "Visited the Giza plateau." },
  { name: "Cape Point",           place: "S. Africa", earned: true,  rarity: "rare",      icon: "🌊", desc: "Stood where two oceans meet." },
  { name: "Gorilla Whisperer",    place: "Rwanda",    earned: false, rarity: "legendary", icon: "🦍", desc: "Trek to the mountain gorillas." },
  { name: "Sahara Nomad",         place: "Morocco",   earned: false, rarity: "epic",      icon: "🐪", desc: "Overnight under the dunes." },
  { name: "Victoria Falls Roar",  place: "Zambia",    earned: false, rarity: "rare",      icon: "💧", desc: "Feel the mist of Mosi-oa-Tunya." },
  { name: "Nile Source",          place: "Uganda",    earned: false, rarity: "common",    icon: "🚣", desc: "Reach the source at Jinja." },
];

const leaderboard = [
  { rank: 1, name: "Amara N.",    country: "🇰🇪", pts: 4820 },
  { rank: 2, name: "You",         country: "🇺🇬", pts: 3410, you: true },
  { rank: 3, name: "Kwame O.",    country: "🇬🇭", pts: 3105 },
  { rank: 4, name: "Zara M.",     country: "🇹🇿", pts: 2780 },
  { rank: 5, name: "Thabo D.",    country: "🇿🇦", pts: 2410 },
];

function Achievements() {
  const earned = badges.filter((b) => b.earned).length;
  const pct = Math.round((earned / badges.length) * 100);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Module 03</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">
            Wings of <span className="text-gradient-electric">Excellence</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every place you visit becomes a stamp in your journey.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <section className="mt-8 glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Explorer level</div>
            <div className="font-display text-3xl">Skyfarer <span className="text-muted-foreground text-lg">/ V</span></div>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl text-gradient-electric">{earned}<span className="text-muted-foreground text-base"> / {badges.length}</span></div>
            <div className="text-xs text-muted-foreground">Badges collected</div>
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-electric to-signal transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {pct}% complete — next reward at 60%: <span className="text-primary-glow">free tour in Marrakech</span>.
        </div>
      </section>

      {/* Badges */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold mb-3">Badge collection</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((b) => (
            <div
              key={b.name}
              className={`relative rounded-2xl border p-5 transition ${
                b.earned
                  ? `glass-panel ${rarityStyles[b.rarity]} hover:-translate-y-0.5`
                  : "border-border/50 bg-surface/30 text-muted-foreground opacity-70"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-4xl grayscale-0" style={{ filter: b.earned ? "none" : "grayscale(1) opacity(0.6)" }}>
                  {b.icon}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-[0.2em] rounded-full border px-2 py-0.5 ${rarityStyles[b.rarity]}`}
                >
                  {b.rarity}
                </span>
              </div>
              <div className="mt-3 font-display text-base font-semibold">{b.name}</div>
              <div className="text-xs text-muted-foreground">{b.place}</div>
              <p className="mt-2 text-xs text-muted-foreground/80">{b.desc}</p>
              {!b.earned && (
                <div className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">🔒 Locked</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="mt-10 glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Global explorers · this week</h2>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Africa & beyond</span>
        </div>
        <div className="mt-4 divide-y divide-border/40">
          {leaderboard.map((row) => (
            <div
              key={row.rank}
              className={`flex items-center justify-between py-3 ${row.you ? "text-electric" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-lg w-6 text-right">{row.rank}</span>
                <span className="text-xl">{row.country}</span>
                <span className="font-medium">{row.name}</span>
                {row.you && (
                  <span className="text-[10px] uppercase tracking-widest rounded-full border border-electric/60 px-2 py-0.5">
                    You
                  </span>
                )}
              </div>
              <span className="font-display">{row.pts.toLocaleString()} pts</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
