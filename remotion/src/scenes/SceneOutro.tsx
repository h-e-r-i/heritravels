import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { theme, display } from "../theme";
import { Eyebrow, Title, Body, Grain, OrbitRings, useSceneFade } from "./_ui";

const stats = [
  { k: "27", u: "Places", tone: theme.electric },
  { k: "12", u: "Countries", tone: theme.primaryGlow },
  { k: "48k", u: "km flown", tone: theme.signal },
  { k: "14d", u: "Streak", tone: theme.electric },
];

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fade = useSceneFade(18);

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 30%, ${theme.bgAlt}, ${theme.bg} 70%)`,
      opacity: fade,
    }}>
      <Img src={staticFile("images/bg-achievements.jpg")} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22,
      }} />
      <Grain />
      <OrbitRings opacity={0.4} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80, textAlign: "center" }}>
        <Eyebrow>Achievements + Culture</Eyebrow>
        <div style={{ height: 18 }} />
        <Title size={92}>Explore. Earn. <span style={{
          background: `linear-gradient(120deg, ${theme.electric}, ${theme.primaryGlow})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Belong.</span></Title>
        <div style={{ height: 18 }} />
        <Body delay={10} width={720}>
          Every trip unlocks badges. Every language, a story. Every check-in, progress you can see.
        </Body>

        <div style={{ height: 40 }} />
        <div style={{ display: "flex", gap: 20 }}>
          {stats.map((s, i) => {
            const sp = spring({ frame: frame - (25 + i * 8), fps, config: { damping: 18, stiffness: 120 } });
            const o = interpolate(sp, [0, 1], [0, 1]);
            const y = interpolate(sp, [0, 1], [24, 0]);
            return (
              <div key={s.u} style={{
                opacity: o, transform: `translateY(${y}px)`,
                padding: "18px 26px", borderRadius: 16,
                background: "rgba(75,123,255,0.08)", border: `1px solid ${theme.border}`, minWidth: 140,
              }}>
                <div style={{ fontFamily: display, fontSize: 40, fontWeight: 600, color: s.tone }}>{s.k}</div>
                <div style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.muted, marginTop: 4 }}>{s.u}</div>
              </div>
            );
          })}
        </div>

        <div style={{ height: 60 }} />
        <div style={{
          fontFamily: display, fontSize: 22, letterSpacing: "0.3em", textTransform: "uppercase",
          color: theme.muted,
          opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          Karibu — welcome aboard.
        </div>
        <div style={{ height: 12 }} />
        <div style={{
          fontFamily: display, fontSize: 56, fontWeight: 700,
          background: `linear-gradient(120deg, ${theme.electric}, ${theme.primary})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-0.02em",
          opacity: interpolate(frame, [90, 130], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          H.E.R.I
        </div>
      </div>
    </AbsoluteFill>
  );
};
