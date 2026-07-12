import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { theme, display } from "../theme";
import { Eyebrow, Title, Body, Grain, useSceneFade } from "./_ui";

const items = [
  { mono: "❤", label: "Vitals log",   detail: "Mood, sleep, heart rate — one tap" },
  { mono: "+", label: "Doctor directory", detail: "Vetted GPs, specialists nearby" },
  { mono: "◐", label: "Book & remind", detail: "Slot, confirm, ping — done" },
  { mono: "!", label: "SOS",           detail: "One button. Real humans." },
];

export const SceneHealth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useSceneFade();

  // Heart pulse curve
  const pulse = Math.max(0, Math.sin(frame / 6)) * 0.15 + 0.9;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(140deg, #10151f, ${theme.bg})`, opacity: fade }}>
      <Img src={staticFile("images/slide-health.jpg")} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35,
      }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${theme.bg}f5 20%, ${theme.bg}66 80%)` }} />
      <Grain />

      <div style={{ position: "absolute", inset: 0, padding: "80px 96px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <Eyebrow>Pillar 03 · Health</Eyebrow>
          <div style={{ height: 16 }} />
          <Title size={72}>A calm room for your <span style={{ color: "#ff8fa3" }}>wellbeing</span>.</Title>
          <div style={{ height: 18 }} />
          <Body delay={10} width={560}>
            Log check-ins, browse vetted medical pros, book instantly — and if things go sideways,
            an SOS that actually reaches someone.
          </Body>
          <div style={{ height: 26 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {items.map((it, i) => {
              const s = spring({ frame: frame - (25 + i * 8), fps, config: { damping: 20, stiffness: 130 } });
              return (
                <div key={it.label} style={{
                  opacity: interpolate(s, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px)`,
                  background: "rgba(255,143,163,0.08)", border: "1px solid rgba(255,143,163,0.25)",
                  borderRadius: 16, padding: 16,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "rgba(255,143,163,0.15)", border: "1px solid rgba(255,143,163,0.4)",
                    color: "#ff8fa3", display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: display, fontWeight: 700, fontSize: 20,
                  }}>{it.mono}</div>
                  <div style={{ fontFamily: display, fontWeight: 600, fontSize: 18, marginTop: 6 }}>{it.label}</div>
                  <div style={{ fontSize: 13, color: theme.muted }}>{it.detail}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Heart + ECG */}
        <div style={{ position: "relative", height: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            position: "absolute", width: 260, height: 260, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,92,122,0.4), transparent 65%)",
            filter: "blur(20px)", transform: `scale(${pulse})`,
          }} />
          <div style={{
            fontSize: 180, transform: `scale(${pulse})`, filter: "drop-shadow(0 0 30px rgba(255,92,122,0.6))",
          }}>❤️</div>
          {/* ECG line */}
          <svg viewBox="0 0 400 100" style={{ position: "absolute", bottom: 30, width: "90%", height: 100, opacity: 0.9 }}>
            <path
              d={`M0 50 L${(frame * 4) % 400 - 100} 50 L${(frame * 4) % 400 - 80} 20 L${(frame * 4) % 400 - 70} 80 L${(frame * 4) % 400 - 60} 50 L400 50`}
              stroke="#ff5c7a" strokeWidth={2} fill="none"
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
