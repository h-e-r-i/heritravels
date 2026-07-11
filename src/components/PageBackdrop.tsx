import { useEffect, useState } from "react";
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

const tiles = [bgFlight, bgNavigation, bgWeather, bgAi, bgBooking, bgAchievements];

type Accent = "ai" | "achievements" | "navigation" | "flight" | "weather" | "booking" | "health" | "workplace";

const accentMap: Record<Accent, string[]> = {
  ai:           [bgAi, slideWorkplace, bgWeather],
  achievements: [bgAchievements, slideAirplane, slideSpeedboat],
  navigation:   [bgNavigation, slideRailway, slideAirport],
  flight:       [slideAirport, slideAirplane, bgFlight, slidePort],
  weather:      [bgWeather, slideSpeedboat, slideAirplane],
  booking:      [bgBooking, slideAirport, slideRailway],
  health:       [slideHealth, bgWeather, bgAchievements],
  workplace:    [slideWorkplace, bgAi, bgBooking],
};

// Module-level cache so we only warm the browser cache once per session.
let warmed = false;
function warmBackgrounds() {
  if (warmed || typeof window === "undefined") return;
  warmed = true;
  const all = [...tiles, slideAirport, slideRailway, slidePort, slideAirplane, slideSpeedboat, slideHealth, slideWorkplace];
  const run = () => {
    for (const src of all) {
      const img = new Image();
      img.decoding = "async";
      (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "low";
      img.src = src;
    }
  };
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
  if (typeof ric === "function") ric(run);
  else setTimeout(run, 400);
}

/**
 * Fixed ambient background with a rotating accent slideshow (crossfade)
 * plus tiled service collage. Shared across every screen.
 */
export function PageBackdrop({ accent = "flight" }: { accent?: Accent }) {
  const heroes = accentMap[accent];
  const [i, setI] = useState(0);

  useEffect(() => {
    warmBackgrounds();
  }, []);

  useEffect(() => {
    if (heroes.length <= 1) return;
    const id = setInterval(() => setI((n) => (n + 1) % heroes.length), 7000);
    return () => clearInterval(id);
  }, [heroes.length]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {heroes.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt=""
          loading={idx === 0 ? "eager" : "lazy"}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${
            idx === i ? "opacity-25" : "opacity-0"
          }`}
          style={idx === i ? { animation: "kenburns 14s ease-out forwards" } : undefined}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 grid grid-cols-6 opacity-[0.10]">
        {tiles.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-40 w-full object-cover md:h-56"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="orbit-ring h-[620px] w-[620px] animate-[orbit-spin_80s_linear_infinite]" />
        <div className="orbit-ring absolute h-[420px] w-[420px] animate-[orbit-spin-reverse_60s_linear_infinite]" />
        <div className="orbit-ring absolute h-[240px] w-[240px] animate-[orbit-spin_40s_linear_infinite]" />
      </div>
    </div>
  );
}
