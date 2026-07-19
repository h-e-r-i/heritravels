import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { destinations, type Destination } from "@/lib/destinations";
import { trackAction } from "@/lib/achievements";
import { fetchDestinationWiki, type WikiSummary } from "@/lib/wikimedia";
import {
  disableLocationTracking,
  enableLocationTracking,
  formatDuration,
  LOCATION_EVENT,
  readLocation,
  TWO_DAYS_SECONDS,
  type LocationState,
} from "@/lib/location-tracker";
import { fetchDestinationDossier, type DossierResult } from "@/lib/dossier.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/destinations")({
  component: DestinationsPage,
  head: () => ({
    meta: [
      { title: "100 Destinations — H.E.R.I" },
      { name: "description", content: "One hundred curated places to explore, with live Wikipedia photos and AI-written travel intel." },
      { property: "og:title", content: "100 Destinations — H.E.R.I" },
      { property: "og:description", content: "One hundred curated places to explore, from Zanzibar to Kyoto." },
    ],
    links: [{ rel: "canonical", href: "/destinations" }],
  }),
});

const regions = ["All", "Africa", "Europe", "Asia", "Americas", "Oceania", "Middle East"] as const;

function DestinationsPage() {
  const [region, setRegion] = useState<(typeof regions)[number]>("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Destination | null>(null);
  const [loc, setLoc] = useState<LocationState>(() => readLocation());
  const [locBusy, setLocBusy] = useState(false);
  const [locErr, setLocErr] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setLoc(readLocation());
    window.addEventListener(LOCATION_EVENT, sync);
    return () => window.removeEventListener(LOCATION_EVENT, sync);
  }, []);

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      if (region !== "All" && d.region !== region) return false;
      if (query.trim().length > 0) {
        const q = query.toLowerCase();
        if (!(d.name + d.country + d.tagline + d.vibes.join(" ")).toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [region, query]);

  const open = (d: Destination) => { setActive(d); trackAction("feature_opened", { feature: `destination:${d.id}` }); };

  async function toggleLocation() {
    setLocErr(null); setLocBusy(true);
    if (loc.enabled) { disableLocationTracking(); }
    else {
      const r = await enableLocationTracking();
      if (!r.ok) setLocErr(r.error ?? "Could not access location.");
    }
    setLocBusy(false);
  }

  const activeD = loc.activeDestId ? destinations.find((x) => x.id === loc.activeDestId) : null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Module 05</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">100 Destinations</h1>
          <p className="text-sm text-muted-foreground mt-1">Tap any city to open its live dossier — photos, AI-written intel, currency and vibe.</p>
        </div>
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Nairobi, Kyoto, Petra…"
          className="w-full md:w-80 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Location tracker */}
      <div className="mt-5 glass-panel rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Journey tracker</div>
          <div className="text-sm">
            {loc.enabled
              ? activeD
                ? <>Currently near <span className="text-electric font-semibold">{activeD.name}</span> — {formatDuration(loc.seconds[activeD.id] ?? 0)} / 48h logged</>
                : loc.lastLat != null
                  ? <>Watching your position… no listed destination in range yet.</>
                  : <>Waiting for your first GPS ping…</>
              : <>Flip the switch and H.E.R.I quietly times your stays. Spend 48h in any of the 100 destinations to unlock its Journey Wing.</>
            }
          </div>
          {locErr && <div className="text-xs text-destructive mt-1">{locErr}</div>}
        </div>
        <button onClick={toggleLocation} disabled={locBusy}
          className={`rounded-full px-5 py-2 text-xs font-semibold transition ${loc.enabled ? "bg-signal/20 text-signal border border-signal/60" : "bg-gradient-to-r from-primary to-electric text-primary-foreground shadow-[var(--shadow-glow)]"}`}>
          {locBusy ? "…" : loc.enabled ? "Tracking on · tap to stop" : "Enable location tracking"}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {regions.map((r) => (
          <button key={r} onClick={() => setRegion(r)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              region === r ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-surface/60 text-muted-foreground hover:text-foreground"
            }`}>
            {r}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground self-center">{filtered.length} places</span>
      </div>

      <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((d) => {
          const secs = loc.seconds[d.id] ?? 0;
          const visited = !!loc.visited[d.id];
          const pct = Math.min(100, Math.round((secs / TWO_DAYS_SECONDS) * 100));
          return (
            <button
              key={d.id}
              onClick={() => open(d)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 text-left transition hover:-translate-y-0.5 hover:border-primary/60"
            >
              <DestinationThumb dest={d} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              {visited && (
                <div className="absolute top-2 right-2 rounded-full bg-signal/90 text-background text-[10px] font-bold px-2 py-0.5">
                  ✓ VISITED
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="text-[10px] uppercase tracking-[0.25em] text-primary-glow">{d.region}</div>
                <div className="font-display text-base font-semibold leading-tight">{d.name}</div>
                <div className="text-[11px] text-muted-foreground">{d.country}</div>
                {loc.enabled && secs > 0 && !visited && (
                  <div className="mt-1.5 h-1 w-full rounded-full bg-background/60 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-electric" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm text-muted-foreground">No matches. Try a different search.</div>
        )}
      </div>

      {active && <DestinationModal destination={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function DestinationThumb({ dest }: { dest: Destination }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    fetchDestinationWiki(dest.name, dest.country).then((w) => {
      if (!live) return;
      if (w?.images[0]) setSrc(w.images[0]);
    });
    return () => { live = false; };
  }, [dest.id]);
  return (
    <>
      {src ? (
        <img src={src} alt={`${dest.name}, ${dest.country}`} loading="lazy" decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-electric/10" />
      )}
    </>
  );
}

function DestinationModal({ destination: d, onClose }: { destination: Destination; onClose: () => void }) {
  const [wiki, setWiki] = useState<WikiSummary | null>(null);
  const [dossier, setDossier] = useState<DossierResult | null>(null);
  const [loadingDossier, setLoadingDossier] = useState(true);
  const [tab, setTab] = useState<"overview" | "hotels" | "transport">("overview");
  const [slide, setSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [fs, setFs] = useState(false);
  const getDossier = useServerFn(fetchDestinationDossier);

  useEffect(() => {
    let live = true;
    fetchDestinationWiki(d.name, d.country).then((w) => { if (live) setWiki(w); });
    setLoadingDossier(true);
    getDossier({ data: { name: d.name, country: d.country, lat: d.lat, lng: d.lng } })
      .then((r) => { if (live) setDossier(r); })
      .catch(() => { if (live) setDossier(null); })
      .finally(() => { if (live) setLoadingDossier(false); });
    return () => { live = false; };
  }, [d.id]);

  const slides = wiki?.images ?? [];
  useEffect(() => {
    if (!autoplay || slides.length < 2) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 3800);
    return () => clearInterval(id);
  }, [slides.length, autoplay]);

  const prev = () => slides.length && setSlide((s) => (s - 1 + slides.length) % slides.length);
  const next = () => slides.length && setSlide((s) => (s + 1) % slides.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape" && fs) setFs(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length, fs]);

  const gallery = wiki?.images.slice(1, 5) ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border/60 bg-background shadow-[var(--shadow-glow)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 h-9 w-9 rounded-full border border-border/60 bg-background/80 backdrop-blur text-lg hover:bg-accent"
        >✕</button>

        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-surface-2">
          {slides.length > 0 ? slides.map((src, i) => (
            <img key={src} src={src} alt={`${d.name} ${i + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === slide ? "opacity-100" : "opacity-0"}`} />
          )) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

          {/* Tabs top-right */}
          <div className="absolute top-4 right-16 z-10 flex gap-1 rounded-full border border-border/60 bg-background/70 backdrop-blur p-1 text-[11px]">
            {(["overview","hotels","transport"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-full transition ${tab === t ? "bg-gradient-to-r from-primary to-electric text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {t === "overview" ? "Overview" : t === "hotels" ? "Hotels" : "Transport"}
              </button>
            ))}
          </div>

          {/* Slide dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-24 right-4 z-10 flex gap-1">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === slide ? "w-5 bg-electric" : "w-1.5 bg-background/60"}`} />
              ))}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary-glow">{d.region} · {d.country}</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">{d.name}</h2>
            <p className="text-sm text-muted-foreground mt-1 italic">"{d.tagline}"</p>
          </div>
        </div>

        {tab === "overview" && (
          <div className="p-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-sm leading-relaxed">{wiki?.extract || d.blurb}</p>

              {gallery.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {gallery.map((src, i) => (
                    <img key={i} src={src} alt={`${d.name} ${i + 2}`} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover border border-border/60" />
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {d.vibes.map((v) => (
                  <span key={v} className="rounded-full border border-primary/40 bg-primary/10 text-primary-glow px-3 py-1 text-xs">
                    #{v}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-electric/30 bg-electric/5 p-4">
                <div className="text-[10px] uppercase tracking-widest text-electric mb-2">H.E.R.I dossier · live</div>
                {loadingDossier ? (
                  <div className="text-xs text-muted-foreground">Scanning open sources…</div>
                ) : dossier ? (
                  <div className="space-y-3 text-sm">
                    {dossier.weather && <div><b className="text-electric">Weather:</b> {dossier.weather}</div>}
                    {dossier.bestTimeAdvice && <div><b className="text-electric">Best time:</b> {dossier.bestTimeAdvice}</div>}
                    {dossier.safety && <div><b className="text-electric">Safety:</b> {dossier.safety}</div>}
                    {dossier.tips.length > 0 && (
                      <div>
                        <b className="text-electric">Tips:</b>
                        <ul className="mt-1 list-disc list-inside space-y-0.5 text-muted-foreground">
                          {dossier.tips.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    )}
                    {dossier.feedback.length > 0 && (
                      <div>
                        <b className="text-electric">Traveler feedback:</b>
                        <div className="mt-1 space-y-1">
                          {dossier.feedback.map((f, i) => (
                            <div key={i} className="text-xs italic text-muted-foreground border-l-2 border-electric/60 pl-2">"{f}"</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Dossier unavailable right now.</div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Stat k="Best season" v={d.bestTime} />
              <Stat k="Currency" v={dossier?.currency || d.currency} />
              <Stat k="Language" v={dossier?.languages || d.language} />
              <Stat k="Coordinates" v={`${d.lat.toFixed(2)}°, ${d.lng.toFixed(2)}°`} />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.name + " " + d.country)}`}
                target="_blank" rel="noreferrer"
                className="mt-2 block w-full text-center rounded-full bg-gradient-to-r from-primary to-electric px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110 transition"
              >
                Open in Maps →
              </a>
              {wiki?.pageUrl && (
                <a href={wiki.pageUrl} target="_blank" rel="noreferrer"
                  className="block w-full text-center rounded-full border border-border bg-surface/60 px-4 py-2 text-xs hover:bg-accent transition">
                  Read on Wikipedia
                </a>
              )}
            </div>
          </div>
        )}

        {tab === "hotels" && (
          <HotelsTab dest={d} hotels={dossier?.hotels ?? []} loading={loadingDossier} />
        )}

        {tab === "transport" && (
          <TransportTab dest={d} options={dossier?.transport ?? []} loading={loadingDossier} />
        )}
      </div>
    </div>
  );
}

function HotelsTab({ dest, hotels, loading }: { dest: Destination; hotels: import("@/lib/dossier.functions").Hotel[]; loading: boolean }) {
  if (loading) return <div className="p-8 text-sm text-muted-foreground">Fetching hotels near {dest.name}…</div>;
  if (hotels.length === 0) return <div className="p-8 text-sm text-muted-foreground">No hotel data returned.</div>;
  return (
    <div className="p-6 space-y-3">
      <div className="text-[10px] uppercase tracking-widest text-electric">Hotels near {dest.name} · aggregated intel</div>
      {hotels.map((h, i) => {
        const bookUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(h.name + " " + dest.name)}`;
        return (
          <div key={i} className="rounded-2xl border border-border/60 bg-surface/40 p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="font-display text-lg font-semibold">{h.name}</div>
                <StarRow rating={h.rating} />
                <span className="text-xs text-muted-foreground">({h.reviews.toLocaleString()} reviews)</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{h.area}</div>
              <div className="text-sm mt-1.5">{h.highlight}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">from</div>
                <div className="font-display text-lg font-semibold text-electric">{h.pricePerNight}</div>
                <div className="text-[10px] text-muted-foreground">per night</div>
              </div>
              <a href={bookUrl} target="_blank" rel="noreferrer"
                className="rounded-full bg-gradient-to-r from-primary to-electric px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110">
                Book →
              </a>
            </div>
          </div>
        );
      })}
      <div className="text-[10px] text-muted-foreground italic pt-2">
        Ratings & pricing indicative — booking opens on Booking.com for live availability.
      </div>
    </div>
  );
}

function TransportTab({ dest, options, loading }: { dest: Destination; options: import("@/lib/dossier.functions").TransportOption[]; loading: boolean }) {
  if (loading) return <div className="p-8 text-sm text-muted-foreground">Scanning routes to {dest.name}…</div>;
  if (options.length === 0) return <div className="p-8 text-sm text-muted-foreground">No transport data returned.</div>;
  const icon = (m: string) => m === "flight" ? "✈" : m === "train" ? "🚆" : m === "ship" ? "🚢" : "🚌";
  const trackUrl = (m: string) =>
    m === "flight" ? `https://www.flightradar24.com/data/airports/${dest.name.toLowerCase().replace(/\s+/g, "-")}`
    : m === "train" ? `https://railradar.in/`
    : m === "ship" ? `https://www.marinetraffic.com/en/ais/home/centerx:${dest.lng}/centery:${dest.lat}/zoom:8`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("bus terminal " + dest.name)}`;
  return (
    <div className="p-6 space-y-3">
      <div className="text-[10px] uppercase tracking-widest text-electric">Transport to/from {dest.name} · live network</div>
      {options.map((o, i) => (
        <div key={i} className="rounded-2xl border border-border/60 bg-surface/40 p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-electric/10 border border-electric/30 text-xl">
            {icon(o.mode)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-display text-base font-semibold">{o.operator}</div>
              <span className="text-[10px] uppercase tracking-widest rounded-full bg-primary/10 border border-primary/40 text-primary-glow px-2 py-0.5">{o.mode}</span>
            </div>
            <div className="text-sm text-muted-foreground">{o.route}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{o.schedule} · {o.duration}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">from</div>
              <div className="font-display text-lg font-semibold text-electric">{o.price}</div>
            </div>
            <a href={trackUrl(o.mode)} target="_blank" rel="noreferrer"
              className="rounded-full bg-gradient-to-r from-primary to-electric px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110">
              Track →
            </a>
          </div>
        </div>
      ))}
      <div className="text-[10px] text-muted-foreground italic pt-2">
        Live tracking opens on Flightradar24, RailRadar, and MarineTraffic.
      </div>
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(rating * 2) / 2;
  return (
    <span className="text-electric text-sm" aria-label={`${rating} out of 5`}>
      {"★".repeat(Math.floor(full))}{full % 1 ? "½" : ""}
      <span className="text-muted-foreground/40">{"★".repeat(5 - Math.ceil(full))}</span>
      <span className="ml-1 text-xs text-foreground">{rating.toFixed(1)}</span>
    </span>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="text-sm font-medium">{v}</div>
    </div>
  );
}
