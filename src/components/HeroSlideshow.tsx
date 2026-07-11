import { useEffect, useState } from "react";

export type Slide = {
  src: string;
  eyebrow: string;
  title: string;
  caption: string;
};

/**
 * Auto-rotating cinematic slideshow with crossfade, ken-burns zoom,
 * progress bar and pill navigation. Used on the Cockpit hero.
 */
export function HeroSlideshow({
  slides,
  interval = 5500,
  className = "",
}: {
  slides: Slide[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [paused, slides.length, interval]);

  const current = slides[i];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-border/60 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, idx) => (
        <img
          key={s.src}
          src={s.src}
          alt=""
          aria-hidden={idx !== i}
          loading={idx === 0 ? "eager" : "lazy"}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out ${
            idx === i ? "opacity-100 animate-[kenburns_9s_ease-out_forwards]" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,theme(colors.primary/25),transparent_60%)]" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10">
        <div className="text-[10px] uppercase tracking-[0.35em] text-primary-glow">
          {current.eyebrow}
        </div>
        <h3 className="mt-2 font-display text-2xl md:text-4xl font-semibold leading-tight">
          {current.title}
        </h3>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{current.caption}</p>

        <div className="mt-5 flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-8 bg-primary" : "w-3 bg-border/70 hover:bg-primary/50"
              }`}
            />
          ))}
          <span className="ml-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
