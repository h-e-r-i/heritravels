import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import heriLogo from "../assets/heri-logo.png.asset.json";
import bgFlight from "../assets/bg-flight.jpg";
import bgNavigation from "../assets/bg-navigation.jpg";
import bgWeather from "../assets/bg-weather.jpg";
import bgAi from "../assets/bg-ai.jpg";
import bgBooking from "../assets/bg-booking.jpg";
import bgAchievements from "../assets/bg-achievements.jpg";
import slideAirport from "../assets/slide-airport.jpg";
import slideRailway from "../assets/slide-railway.jpg";
import slidePort from "../assets/slide-port.jpg";
import slideAirplane from "../assets/slide-airplane.jpg";
import slideSpeedboat from "../assets/slide-speedboat.jpg";
import slideHealth from "../assets/slide-health.jpg";
import slideWorkplace from "../assets/slide-workplace.jpg";
import { trackAction } from "@/lib/achievements";
import { PageBackdrop } from "@/components/PageBackdrop";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { ExploreGallery } from "@/components/ExploreGallery";


export const Route = createFileRoute("/")({
  component: Cockpit,
  head: () => ({
    meta: [
      { title: "H.E.R.I — Your copilot for everywhere" },
      { name: "description", content: "H.E.R.I fuses weather, flights, road transport, culture and body vitals into one calm cockpit." },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: bgFlight, fetchpriority: "high" },
    ],
  }),
});

const missionMetrics = [
  { label: "Places Unlocked", value: "27", sub: "of 195", tone: "text-electric" },
  { label: "Distance Flown", value: "48.2k", sub: "km logged", tone: "text-signal" },
  { label: "Countries", value: "12", sub: "on the map", tone: "text-primary-glow" },
  { label: "Streak", value: "14d", sub: "of exploring", tone: "text-electric" },
];

const features = [
  { to: "/navigator", tag: "Travel & Navigation", body: "Plan trips, get directions", icon: "🧭", bg: bgNavigation },
  { to: "/navigator", tag: "Weather",             body: "Real-time forecasts",     icon: "⛅", bg: bgWeather },
  { to: "/navigator", tag: "Booking",             body: "Flights, hotels, transport", icon: "🧳", bg: bgBooking },
  { to: "/agent",     tag: "AI Assistant",        body: "Ask anything, get help",  icon: "🤖", bg: bgAi },
  { to: "/health",    tag: "Health",              body: "Log vitals · reach doctors", icon: "❤️", bg: slideHealth },
  { to: "/workplace", tag: "Workplace",           body: "Private memos for your team", icon: "🏢", bg: slideWorkplace },
  { to: "/achievements", tag: "Culture & Tourism", body: "Explore places, languages & more", icon: "🏛️", bg: bgAchievements },
  { to: "/achievements", tag: "Achievements",     body: "Earn badges, unlock rewards", icon: "🏆", bg: bgAchievements },
  { to: "/agent",     tag: "Occupation Hub",      body: "Tools & support for your work", icon: "💼", bg: bgBooking },
];


const notifications = [
  { kind: "Weather Alert",       time: "08:30 AM", body: "Heavy rain expected in Nairobi tomorrow. Plan accordingly.", dot: "bg-signal" },
  { kind: "Flight Update",       time: "07:45 AM", body: "Your flight to Mombasa is now on time. Departure 14:30.", dot: "bg-primary" },
  { kind: "Achievement Unlocked",time: "06:20 AM", body: "Congratulations! You visited a new place: Zanzibar.",     dot: "bg-electric" },
  { kind: "Reminder",            time: "06:00 AM", body: "Don't forget your booking at Serena Hotel today.",         dot: "bg-primary-glow" },
];

function useTicker() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const tick = () =>
      setNow(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
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
      <PageBackdrop accent="flight" />
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl glass-panel px-6 py-12 md:px-14 md:py-20">
        <img
          src={bgFlight}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          // @ts-expect-error - fetchpriority is a valid HTML attribute
          fetchpriority="high"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/90" />
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
              <br />for everywhere.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground">
              H.E.R.I fuses weather, flights, road transport, culture and body vitals into one calm cockpit. Karibu — welcome aboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/agent" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-electric px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110 transition">
                Talk to H.E.R.I →
              </Link>
              <Link to="/navigator" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-medium hover:bg-accent transition">
                Open Navigator
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full blur-3xl bg-primary/30" />
            <img src={heriLogo.url} alt="H.E.R.I emblem" className="relative h-64 w-64 md:h-80 md:w-80 object-contain animate-[pulse-glow_4s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* SLIDESHOW — everywhere H.E.R.I moves */}
      <section className="mt-8">
        <HeroSlideshow
          className="h-[420px] md:h-[520px]"
          slides={[
            { src: slideAirport,   eyebrow: "Air · Hub",     title: "Land at every terminal.",         caption: "Track gates, tarmacs and tower comms across international airports." },
            { src: slideRailway,   eyebrow: "Rail · Hub",    title: "Ride the fast lines.",            caption: "High-speed rail platforms and intercity schedules, in real time." },
            { src: slidePort,      eyebrow: "Sea · Hub",     title: "Depart from the harbour.",         caption: "Cargo ports, cruise terminals and ferry timetables at a glance." },
            { src: slideAirplane,  eyebrow: "Air · Vehicle", title: "Chase the horizon.",              caption: "Live flight boards, delays and gate changes as they happen." },
            { src: slideSpeedboat, eyebrow: "Sea · Vehicle", title: "Skim across the blue.",           caption: "Speedboats and ferries between the islands you love." },
            { src: slideHealth,    eyebrow: "Life · Health", title: "A calm room for your wellbeing.", caption: "Log check-ins and reach vetted medical pros in a tap." },
            { src: slideWorkplace, eyebrow: "Life · Work",   title: "Your workspace, private.",         caption: "Memos and news shared only with authorised members of your institution." },
          ]}
        />
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

      <ExploreGallery />


      {/* FEATURE GRID — mirrors the mockup */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Your dashboard</h2>
            <p className="text-sm text-muted-foreground">All features in one place — tap any pillar to launch it.</p>
          </div>
          <span className="hidden md:inline-flex text-[10px] uppercase tracking-[0.3em] text-muted-foreground">All-in-one intelligent support</span>
        </div>

        <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.tag}
              to={f.to}
              onClick={() => trackAction("feature_opened", { feature: f.tag })}
              className="group relative overflow-hidden rounded-2xl border border-border/60 p-5 min-h-[150px] transition hover:-translate-y-0.5 hover:border-primary/50"
            >
              <img
                src={f.bg}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                // @ts-expect-error - fetchpriority is a valid HTML attribute
                fetchpriority="low"
                width={1600}
                height={900}
                className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:opacity-50 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/70 to-background/40" />
              <div className="relative">
                <div className="text-2xl">{f.icon}</div>
                <div className="mt-3 font-display text-base font-semibold">{f.tag}</div>
                <div className="text-xs text-muted-foreground">{f.body}</div>
                <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-primary-glow group-hover:text-electric">Enter →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NOTIFICATIONS PANEL */}
      <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Notifications</h3>
            <div className="flex gap-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span className="rounded-full bg-primary/20 text-primary-glow px-2 py-0.5">All</span>
              <span className="rounded-full px-2 py-0.5">Alerts</span>
              <span className="rounded-full px-2 py-0.5">Rewards</span>
            </div>
          </div>
          <div className="mt-4 divide-y divide-border/40">
            {notifications.map((n) => (
              <div key={n.kind} className="flex gap-3 py-3">
                <span className={`mt-1 h-2 w-2 rounded-full ${n.dot} animate-pulse`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{n.kind}</span>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/achievements"
          className="relative overflow-hidden rounded-2xl border border-border/60 p-6 min-h-[240px] flex flex-col justify-end"
        >
          <img src={bgAchievements} alt="" aria-hidden="true" loading="lazy" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary-glow">Your journey</div>
            <div className="font-display text-2xl font-semibold mt-1">Keep exploring.<br/>Earn rewards.</div>
            <div className="mt-3 text-xs text-muted-foreground">Level 12 · 2,450 pts · 18 countries · 25 badges</div>
          </div>
        </Link>
      </section>
    </div>
  );
}
