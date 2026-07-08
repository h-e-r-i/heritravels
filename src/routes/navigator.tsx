import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import bgNavigation from "../assets/bg-navigation.jpg";
import { trackAction } from "@/lib/achievements";



export const Route = createFileRoute("/navigator")({
  component: Navigator,
  head: () => ({
    meta: [
      { title: "Navigator — H.E.R.I" },
      { name: "description", content: "Weather, flights and transport routes on one radar." },
    ],
    links: [{ rel: "canonical", href: "/navigator" }],
  }),
});

type City = {
  name: string;
  country: string;
  temp: number;
  cond: string;
  wind: number;
  humidity: number;
  aqi: number;
  local: string;
};

const cities: City[] = [
  { name: "Nairobi",     country: "KE", temp: 23, cond: "Partly cloudy", wind: 12, humidity: 62, aqi: 42, local: "14:12" },
  { name: "Zanzibar",    country: "TZ", temp: 29, cond: "Sunny",         wind: 18, humidity: 74, aqi: 30, local: "14:12" },
  { name: "Cape Town",   country: "ZA", temp: 17, cond: "Windy",         wind: 34, humidity: 58, aqi: 22, local: "13:12" },
  { name: "Lagos",       country: "NG", temp: 31, cond: "Humid",         wind: 8,  humidity: 84, aqi: 68, local: "12:12" },
  { name: "Cairo",       country: "EG", temp: 34, cond: "Clear",         wind: 15, humidity: 24, aqi: 91, local: "13:12" },
  { name: "London",      country: "UK", temp: 14, cond: "Drizzle",       wind: 22, humidity: 79, aqi: 35, local: "11:12" },
];

const flights = [
  { code: "KQ 100", route: "NBO → LHR", status: "On time",  gate: "24", eta: "21:40", tone: "signal" },
  { code: "ET 505", route: "ADD → JFK", status: "Boarding", gate: "07", eta: "22:10", tone: "signal" },
  { code: "SA 234", route: "JNB → CPT", status: "Delayed",  gate: "12", eta: "+35m",  tone: "destructive" },
  { code: "KL 566", route: "AMS → NBO", status: "In flight",gate: "—",  eta: "05:20", tone: "primary" },
];

const routes = [
  { from: "Nairobi CBD", to: "JKIA Airport",     mode: "SGV Express",  duration: "38 min", cost: "KSh 450" },
  { from: "Mombasa",     to: "Diani Beach",      mode: "Coastal Ferry",duration: "1h 20",  cost: "KSh 900" },
  { from: "Arusha",      to: "Serengeti Gate",   mode: "Safari Cruiser",duration: "3h 15", cost: "$120" },
  { from: "Kigali",      to: "Musanze",          mode: "Volcano Bus",  duration: "2h 05",  cost: "RWF 3500" },
];

function Navigator() {
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("Nairobi, Kenya");
  const [to, setTo] = useState("Kilimanjaro National Park");
  const [mode, setMode] = useState<"driving" | "flying" | "transit" | "walking">("driving");
  const filtered = cities.filter((c) =>
    (c.name + c.country).toLowerCase().includes(q.toLowerCase()),
  );

  const mapSrc = `https://www.google.com/maps?output=embed&hl=en&z=6&saddr=${encodeURIComponent(from)}&daddr=${encodeURIComponent(to)}`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Module 02</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">Navigator</h1>
          <p className="text-sm text-muted-foreground mt-1">Atmosphere, altitude, and asphalt — one radar screen.</p>
        </div>
        <div className="relative w-full md:w-72">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search cities..."
            className="w-full rounded-full border border-border bg-surface/60 px-4 py-2 text-sm outline-none focus:border-primary transition"
          />
        </div>
      </div>

      {/* LIVE MAP */}
      <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
          <img src={bgNavigation} alt="" aria-hidden="true" loading="lazy" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 to-background/90" />
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Route planner</div>
            <h2 className="font-display text-lg font-semibold mt-1">Where are you flying?</h2>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">From</span>
                <input value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">To</span>
                <input value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
              </label>

              <div className="flex gap-1 rounded-full border border-border/60 bg-surface/60 p-1 text-xs">
                {(["driving","flying","transit","walking"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-full px-2 py-1.5 capitalize transition ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {m === "driving" ? "🚗 Drive" : m === "flying" ? "✈️ Flight" : m === "transit" ? "🚆 Train" : "🚶 Walk"}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-primary/40 bg-primary/10 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-2xl text-gradient-electric">5h 48m</div>
                    <div className="text-xs text-muted-foreground">Best route · 320 km via A104</div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=${mode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-signal/90 hover:bg-signal text-primary-foreground px-4 py-2 text-xs font-semibold transition"
                  >
                    GO
                  </a>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2">
                    <span>6h 10m · 335 km</span><span className="text-muted-foreground">via B1</span>
                  </div>
                  <div className="flex justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2">
                    <span>6h 35m · 360 km</span><span className="text-muted-foreground">via C103</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-2 relative overflow-hidden min-h-[420px]">
          <iframe
            title="H.E.R.I live map"
            src={mapSrc}
            className="h-full min-h-[420px] w-full rounded-xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>



      {/* WEATHER GRID */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold mb-3">Atmospheric conditions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div key={c.name} className="glass-panel rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-lg font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.country} · {c.local} local</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-4xl text-gradient-electric">{c.temp}°</div>
                  <div className="text-xs text-muted-foreground">{c.cond}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  ["Wind", `${c.wind}`, "km/h"],
                  ["Humid", `${c.humidity}%`, "rel"],
                  ["AQI", `${c.aqi}`, c.aqi < 50 ? "Good" : c.aqi < 100 ? "OK" : "Poor"],
                ].map(([k, v, sub]) => (
                  <div key={k} className="rounded-lg border border-border/60 bg-background/40 py-2">
                    <div className="text-[10px] uppercase text-muted-foreground tracking-widest">{k}</div>
                    <div className="font-display text-sm">{v}</div>
                    <div className="text-[10px] text-muted-foreground">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-sm text-muted-foreground py-8 text-center">
              No cities match "{q}".
            </div>
          )}
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* FLIGHTS */}
        <section className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Flight board</h2>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Live · ATC</span>
          </div>
          <div className="mt-4 divide-y divide-border/40">
            {flights.map((f) => (
              <div key={f.code} className="flex items-center justify-between py-3 gap-3">
                <div>
                  <div className="font-display font-semibold text-sm">{f.code}</div>
                  <div className="text-xs text-muted-foreground">{f.route}</div>
                </div>
                <div className="text-right">
                  <div
                    className={
                      f.tone === "destructive"
                        ? "inline-flex items-center gap-1.5 text-destructive text-sm font-medium"
                        : "inline-flex items-center gap-1.5 text-signal text-sm font-medium"
                    }
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${f.tone === "destructive" ? "bg-destructive" : "bg-signal"} animate-pulse`} />
                    {f.status}
                  </div>
                  <div className="text-xs text-muted-foreground">Gate {f.gate} · {f.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ROUTES */}
        <section className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Road & rail routes</h2>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Book · Track</span>
          </div>
          <div className="mt-4 space-y-3">
            {routes.map((r) => (
              <div key={r.from + r.to} className="rounded-xl border border-border/60 bg-background/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="font-medium">{r.from}</span>
                    <span className="text-muted-foreground mx-2">→</span>
                    <span className="font-medium">{r.to}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full border border-primary/40 text-primary-glow">
                    {r.mode}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>⏱ {r.duration}</span>
                  <span>💳 {r.cost}</span>
                  <button className="rounded-full bg-primary/20 hover:bg-primary/30 text-primary-glow px-3 py-1 transition">
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
