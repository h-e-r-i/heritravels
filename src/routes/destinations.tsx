import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { destinations, destinationImage, destinationThumb, type Destination } from "@/lib/destinations";
import { trackAction } from "@/lib/achievements";

export const Route = createFileRoute("/destinations")({
  component: DestinationsPage,
  head: () => ({
    meta: [
      { title: "100 Destinations — H.E.R.I" },
      { name: "description", content: "One hundred curated places to explore, from Zanzibar to Kyoto. Tap any card for photos and travel intel." },
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

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Module 05</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">100 Destinations</h1>
          <p className="text-sm text-muted-foreground mt-1">Tap any city to open its dossier — photos, best season, currency and vibe.</p>
        </div>
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Nairobi, Kyoto, Petra…"
          className="w-full md:w-80 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm outline-none focus:border-primary"
        />
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
        {filtered.map((d) => (
          <button
            key={d.id}
            onClick={() => open(d)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 text-left transition hover:-translate-y-0.5 hover:border-primary/60"
          >
            <img
              src={destinationThumb(d)}
              alt={`${d.name}, ${d.country}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-primary-glow">{d.region}</div>
              <div className="font-display text-base font-semibold leading-tight">{d.name}</div>
              <div className="text-[11px] text-muted-foreground">{d.country}</div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm text-muted-foreground">No matches. Try a different search.</div>
        )}
      </div>

      {active && <DestinationModal destination={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function DestinationModal({ destination: d, onClose }: { destination: Destination; onClose: () => void }) {
  const gallery = [
    destinationImage(d, 1600, 900),
    `https://source.unsplash.com/1200x900/?${encodeURIComponent(d.name + " landmark")}`,
    `https://source.unsplash.com/1200x900/?${encodeURIComponent(d.country + " travel")}`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border/60 bg-background shadow-[var(--shadow-glow)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 h-9 w-9 rounded-full border border-border/60 bg-background/80 backdrop-blur text-lg hover:bg-accent"
        >✕</button>

        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          <img src={gallery[0]} alt={d.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary-glow">{d.region} · {d.country}</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">{d.name}</h2>
            <p className="text-sm text-muted-foreground mt-1 italic">"{d.tagline}"</p>
          </div>
        </div>

        <div className="p-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm leading-relaxed">{d.blurb}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {gallery.slice(1).map((src, i) => (
                <img key={i} src={src} alt={`${d.name} ${i + 2}`} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover border border-border/60" />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {d.vibes.map((v) => (
                <span key={v} className="rounded-full border border-primary/40 bg-primary/10 text-primary-glow px-3 py-1 text-xs">
                  #{v}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Stat k="Best season" v={d.bestTime} />
            <Stat k="Currency" v={d.currency} />
            <Stat k="Language" v={d.language} />
            <Stat k="Coordinates" v={`${d.lat.toFixed(2)}°, ${d.lng.toFixed(2)}°`} />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.name + " " + d.country)}`}
              target="_blank" rel="noreferrer"
              className="mt-2 block w-full text-center rounded-full bg-gradient-to-r from-primary to-electric px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110 transition"
            >
              Open in Maps →
            </a>
            <a
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(d.name.replace(/ /g, "_"))}`}
              target="_blank" rel="noreferrer"
              className="block w-full text-center rounded-full border border-border bg-surface/60 px-4 py-2 text-xs hover:bg-accent transition"
            >
              Read on Wikipedia
            </a>
          </div>
        </div>
      </div>
    </div>
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
