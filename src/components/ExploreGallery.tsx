import { useState } from "react";
import slideAirport from "../assets/slide-airport.jpg";
import slideRailway from "../assets/slide-railway.jpg";
import slidePort from "../assets/slide-port.jpg";
import slideRoad from "../assets/slide-road.jpg";
import slideAirplane from "../assets/slide-airplane.jpg";
import slideSpeedboat from "../assets/slide-speedboat.jpg";
import slideShip from "../assets/slide-ship.jpg";
import slideTrain from "../assets/slide-train.jpg";
import slideHealth from "../assets/slide-health.jpg";
import slideWorkplace from "../assets/slide-workplace.jpg";

type Category = "all" | "hubs" | "vehicles" | "life";

type Card = {
  id: string;
  src: string;
  title: string;
  sub: string;
  category: Exclude<Category, "all">;
  tag: string;
};

const cards: Card[] = [
  { id: "airport",  src: slideAirport,  title: "International airports", sub: "Terminals, tarmacs, tower comms.",              category: "hubs",     tag: "Hub" },
  { id: "railway",  src: slideRailway,  title: "Modern rail stations",   sub: "Platforms alive with high-speed arrivals.",     category: "hubs",     tag: "Hub" },
  { id: "port",     src: slidePort,     title: "Seaports & harbours",    sub: "Cargo cranes and cruise gateways.",             category: "hubs",     tag: "Hub" },
  { id: "airplane", src: slideAirplane, title: "Airliners in flight",    sub: "From short-haul jets to widebody dreams.",      category: "vehicles", tag: "Air" },
  { id: "train",    src: slideTrain,    title: "Intercity trains",       sub: "Track the rail network across the region.",     category: "vehicles", tag: "Rail" },
  { id: "road",     src: slideRoad,     title: "Cars, buses & shuttles", sub: "Rideshare, coach lines and city loops.",        category: "vehicles", tag: "Road" },
  { id: "ship",     src: slideShip,     title: "Ocean liners",           sub: "Cruise routes and cross-sea passages.",         category: "vehicles", tag: "Sea" },
  { id: "boat",     src: slideSpeedboat,title: "Speedboats & ferries",   sub: "Island hops in minutes, not hours.",            category: "vehicles", tag: "Sea" },
  { id: "health",   src: slideHealth,   title: "Health companion",       sub: "Log vitals, reach medical pros instantly.",     category: "life",     tag: "Life" },
  { id: "work",     src: slideWorkplace,title: "Workplace channels",     sub: "Private memos and news for your institution.",  category: "life",     tag: "Life" },
];

const filters: { key: Category; label: string }[] = [
  { key: "all",      label: "All" },
  { key: "hubs",     label: "Hubs" },
  { key: "vehicles", label: "Vehicles" },
  { key: "life",     label: "Life" },
];

export function ExploreGallery() {
  const [f, setF] = useState<Category>("all");
  const visible = f === "all" ? cards : cards.filter((c) => c.category === f);

  return (
    <section className="mt-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary-glow">Explore</div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold">The whole world, in one cockpit.</h2>
          <p className="text-sm text-muted-foreground max-w-lg mt-1">
            From tarmacs to turquoise waters, from clinic corridors to command centres — H.E.R.I links every surface you move across.
          </p>
        </div>
        <div className="flex gap-1 rounded-full border border-border/60 bg-surface/60 p-1 text-xs">
          {filters.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setF(cat.key)}
              className={`px-3 py-1.5 rounded-full transition ${
                f === cat.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((c, idx) => (
          <figure
            key={c.id}
            className={`group relative overflow-hidden rounded-2xl border border-border/60 aspect-[4/5] ${
              idx === 0 || idx === 5 ? "md:aspect-[4/5] lg:row-span-2 lg:aspect-auto" : ""
            }`}
          >
            <img
              src={c.src}
              alt={c.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] rounded-full border border-primary/40 bg-primary/10 text-primary-glow px-2 py-0.5">
                  {c.tag}
                </span>
              </div>
              <div className="mt-2 font-display text-sm font-semibold leading-tight">{c.title}</div>
              <div className="text-[11px] text-muted-foreground">{c.sub}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
