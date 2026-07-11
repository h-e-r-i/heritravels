import { useEffect } from "react";
import bgFlight from "../assets/bg-flight.jpg";
import bgNavigation from "../assets/bg-navigation.jpg";
import bgWeather from "../assets/bg-weather.jpg";
import bgAi from "../assets/bg-ai.jpg";
import bgBooking from "../assets/bg-booking.jpg";
import bgAchievements from "../assets/bg-achievements.jpg";

const tiles = [bgFlight, bgNavigation, bgWeather, bgAi, bgBooking, bgAchievements];

type Accent = "ai" | "achievements" | "navigation" | "flight" | "weather" | "booking";

const accentMap: Record<Accent, string> = {
  ai: bgAi,
  achievements: bgAchievements,
  navigation: bgNavigation,
  flight: bgFlight,
  weather: bgWeather,
  booking: bgBooking,
};

// Module-level cache so we only warm the browser cache once per session.
let warmed = false;
function warmBackgrounds() {
  if (warmed || typeof window === "undefined") return;
  warmed = true;
  const run = () => {
    for (const src of tiles) {
      const img = new Image();
      img.decoding = "async";
      // low priority — never contends with the LCP image
      (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "low";
      img.src = src;
    }
  };
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
    .requestIdleCallback;
  if (typeof ric === "function") ric(run);
  else setTimeout(run, 400);
}

/**
 * Fixed ambient background: a hero accent image + tiled service collage,
 * shared across Cockpit / Achievements / Agent for a consistent H.E.R.I feel.
 */
export function PageBackdrop({ accent = "flight" }: { accent?: Accent }) {
  const hero = accentMap[accent];

  useEffect(() => {
    warmBackgrounds();
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Accent hero image — eager, high priority: it's the LCP-ish backdrop */}
      <img
        src={hero}
        alt=""
        loading="eager"
        decoding="async"
        // @ts-expect-error - fetchpriority is a valid HTML attribute
        fetchpriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      {/* Service collage strip — lazy, low priority: below the fold */}
      <div className="absolute inset-x-0 bottom-0 grid grid-cols-6 opacity-[0.12]">
        {tiles.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            // @ts-expect-error - fetchpriority is a valid HTML attribute
            fetchpriority="low"
            className="h-40 w-full object-cover md:h-56"
          />
        ))}
      </div>
      {/* Deep gradient wash so content stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
      {/* Signature orbit rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="orbit-ring h-[620px] w-[620px] animate-[orbit-spin_80s_linear_infinite]" />
        <div className="orbit-ring absolute h-[420px] w-[420px] animate-[orbit-spin-reverse_60s_linear_infinite]" />
        <div className="orbit-ring absolute h-[240px] w-[240px] animate-[orbit-spin_40s_linear_infinite]" />
      </div>
    </div>
  );
}
