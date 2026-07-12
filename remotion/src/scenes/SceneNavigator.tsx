import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { theme, display } from "../theme";
import { Eyebrow, Title, Body, ScenePad, Grain, useSceneFade } from "./_ui";

const features = [
  { mono: "N", tint: "#22e6ff", label: "Navigate", detail: "Turn-by-turn across cities & continents" },
  { mono: "W", tint: "#7aa7ff", label: "Weather", detail: "Live forecasts on every leg" },
  { mono: "B", tint: "#ffb84a", label: "Booking", detail: "Flights · hotels · transport" },
  { mono: "AI", tint: "#4b7bff", label: "AI Copilot", detail: "Ask anything, get help" },
];

const FeatureCard: React.FC<{ i: number; f: typeof features[number] }> = ({ i, f }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = 20 + i * 10;
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 140 } });
  const o = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [40, 0]);
  return (
    <div style={{
      opacity: o, transform: `translateY(${y}px)`,
      background: "linear-gradient(160deg, rgba(75,123,255,0.12), rgba(10,18,38,0.6))",
      border: `1px solid ${theme.border}`, borderRadius: 20, padding: 22,
      display: "flex", flexDirection: "column", gap: 10,
      backdropFilter: "none",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${f.tint}22`, border: `1px solid ${f.tint}66`, color: f.tint,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: display, fontWeight: 700, fontSize: 18, letterSpacing: "-0.03em",
      }}>{f.mono}</div>
      <div style={{ fontFamily: display, fontSize: 22, fontWeight: 600, color: theme.ink }}>{f.label}</div>
      <div style={{ fontSize: 14, color: theme.muted, lineHeight: 1.4 }}>{f.detail}</div>
    </div>
  );
};

export const SceneNavigator: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = useSceneFade();
  return (
    <AbsoluteFill style={{ background: theme.bg, opacity: fade }}>
      <Img src={staticFile("images/bg-navigation.jpg")} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25,
        transform: `scale(${1 + frame * 0.0004})`,
      }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${theme.bg}dd, ${theme.bg}ee)` }} />
      <Grain />
      <div style={{ position: "absolute", inset: 0, padding: "70px 96px", display: "grid", gridTemplateRows: "auto 1fr", gap: 40 }}>
        <div>
          <Eyebrow>Pillar 01 · Navigator</Eyebrow>
          <div style={{ height: 16 }} />
          <Title size={68}>Plan, route, arrive — <span style={{ color: theme.electric }}>calmly</span>.</Title>
          <div style={{ height: 14 }} />
          <Body delay={12} width={720}>
            Live weather, transport bookings and turn-by-turn directions all rendered in one cockpit.
            No more tab-jumping between apps to get out the door.
          </Body>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, alignSelf: "end" }}>
          {features.map((f, i) => <FeatureCard key={f.label} i={i} f={f} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
