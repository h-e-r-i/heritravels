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

/**
 * Fixed ambient background: a hero accent image + tiled service collage,
 * shared across Cockpit / Achievements / Agent for a consistent H.E.R.I feel.
 */
export function PageBackdrop({ accent = "flight" }: { accent?: Accent }) {
  const hero = accentMap[accent];
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Accent hero image */}
      <img
        src={hero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      {/* Service collage strip */}
      <div className="absolute inset-x-0 bottom-0 grid grid-cols-6 opacity-[0.12]">
        {tiles.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
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
