import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import heriLogo from "../assets/heri-logo.png.asset.json";

export const Route = createFileRoute("/")({
  component: Cockpit,
});

const missionMetrics = [
  { label: "Places Unlocked", value: "27", sub: "of 195", tone: "text-electric" },
  { label: "Distance Flown", value: "48.2k", sub: "km logged", tone: "text-signal" },
  { label: "Countries", value: "12", sub: "on the map", tone: "text-primary-glow" },
  { label: "Streak", value: "14d", sub: "of exploring", tone: "text-electric" },
];

const liveTiles = [
  {
    tag: "Atmosphere",
    title: "Nairobi",
    reading: "23°C",
    detail: "Partly cloudy · Wind 12 km/h NE · UV 6",
    accent: "from-primary/40 to-electric/10",
  },
  {
    tag: "Flight",
    title: "KQ 100",
    reading: "On time",
    detail: "NBO → LHR · Gate 24 · Boarding 21:40",
    accent: "from-electric/40 to-signal/10",
  },
  {
    tag: "Vitals",
    title: "Body",
    reading: "72 bpm",
    detail: "Resting · SpO₂ 98% · Hydration OK",
    accent: "from-signal/40 to-primary/10",
  },
];

function useTicker() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Cockpit() {
  const now = useTicker();

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:py-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl glass-panel px-6 py-12 md:px-14 md:py-20">
        {/* orbits */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
          <div className="orbit-ring h-[560px] w-[560px] animate-[orbit-spin_60s_linear_infinite]" />
          <div className="orbit-ring absolute h-[380px] w-[380px] animate-[orbit-spin-reverse_45s_linear_infinite]" />
          <div className="orbit-ring absolute h-[220px] w-[220px] animate-[orbit-spin_30s_linear_infinite]" />
        </div>

        <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
              Uplink · {now}
            </div>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-semibold leading-[1.05]">
              Your <span className="text-gradient-electric">copilot</span>
              <br />
              for everywhere.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground">
              H.E.R.I fuses weather, flights, road transport, culture and body
              vitals into one calm cockpit. Karibu — welcome aboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/agent"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-electric px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110 transition"
              >
                Talk to H.E.R.I →
              </Link>
              <Link
                to="/navigator"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-medium hover:bg-accent transition"
              >
                Open Navigator
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full blur-3xl bg-primary/30" />
            <img
              src={heriLogo.url}
              alt="H.E.R.I emblem"
              className="relative h-64 w-64 md:h-80 md:w-80 object-contain animate-[pulse-glow_4s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {missionMetrics.map((m) => (
          <div key={m.label} className="glass-panel rounded-2xl p-5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{m.label}</div>
            <div className={`mt-2 font-display text-3xl font-semibold ${m.tone}`}>{m.value}</div>
            <div className="text-xs text-muted-foreground">{m.sub}</div>
          </div>
        ))}
      </section>

      {/* LIVE TILES */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {liveTiles.map((t) => (
          <div
            key={t.tag}
            className={`glass-panel rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br ${t.accent}`}
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t.tag}</div>
            <div className="mt-1 flex items-baseline justify-between gap-3">
              <div className="font-display text-xl font-semibold">{t.title}</div>
              <div className="font-display text-2xl text-gradient-electric">{t.reading}</div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">{t.detail}</div>
          </div>
        ))}
      </section>

      {/* MODULES */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">Systems online</h2>
        <p className="text-sm text-muted-foreground">Every module of the H.E.R.I platform, one tap away.</p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              to: "/navigator",
              title: "Navigator",
              body: "Weather, flights, routes and bookings on one radar screen.",
              icon: "📡",
            },
            {
              to: "/achievements",
              title: "Achievements",
              body: "Turn every trip into a game — badges, streaks, prizes for cultures explored.",
              icon: "🏆",
            },
            {
              to: "/agent",
              title: "H.E.R.I Agent",
              body: "The AI copilot: weather, culture, health, transport — real answers, fast.",
              icon: "🛰",
            },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="glass-panel group rounded-2xl p-6 transition hover:border-primary/50 hover:-translate-y-0.5"
            >
              <div className="text-3xl">{c.icon}</div>
              <div className="mt-3 font-display text-lg font-semibold">{c.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
              <div className="mt-4 text-xs uppercase tracking-[0.3em] text-primary group-hover:text-electric">
                Enter →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
