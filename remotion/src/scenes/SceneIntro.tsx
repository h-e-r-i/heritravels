import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { theme, display } from "../theme";
import { Eyebrow, Title, Body, ScenePad, OrbitRings, Grain, useSceneFade } from "./_ui";

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useSceneFade();
  const pulse = 1 + Math.sin(frame / 18) * 0.03;
  const emblemScale = spring({ frame, fps, config: { damping: 12, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 70% 50%, ${theme.bgAlt}, ${theme.bg} 70%)`, opacity: fade }}>
      <Grain />
      <Img src={staticFile("images/bg-flight.jpg")} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18,
      }} />
      <OrbitRings opacity={0.35} />

      <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1.2fr 1fr", alignItems: "center", padding: "80px 96px" }}>
        <div>
          <Eyebrow>Introducing</Eyebrow>
          <div style={{ height: 20 }} />
          <Title size={120}>H.E.R.I</Title>
          <div style={{ height: 14 }} />
          <div style={{ fontFamily: display, fontSize: 34, color: theme.primaryGlow, fontWeight: 500 }}>
            Your copilot for everywhere.
          </div>
          <div style={{ height: 22 }} />
          <Body delay={12} width={560}>
            One calm cockpit that fuses weather, travel, health, work and culture —
            so your whole day lives in a single, elegant flow.
          </Body>
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            position: "absolute", width: 360, height: 360, borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.primary}66, transparent 65%)`,
            filter: "blur(20px)",
            transform: `scale(${pulse})`,
          }} />
          <div style={{
            transform: `scale(${emblemScale})`,
            width: 320, height: 320, borderRadius: "50%",
            border: `2px solid ${theme.electric}`,
            background: `radial-gradient(circle, ${theme.primary}33, ${theme.bg})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 80px ${theme.primary}55, inset 0 0 40px ${theme.electric}33`,
          }}>
            <div style={{
              fontFamily: display, fontSize: 84, fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.electric}, ${theme.primary})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-0.04em",
            }}>H</div>
          </div>
          {/* orbit dots */}
          {[0, 1, 2].map((i) => {
            const angle = (frame * (2 + i * 0.4) + i * 120) * (Math.PI / 180);
            const r = 200 + i * 30;
            return (
              <div key={i} style={{
                position: "absolute", width: 14, height: 14, borderRadius: "50%",
                background: [theme.electric, theme.signal, theme.primaryGlow][i],
                boxShadow: `0 0 20px currentColor`, color: [theme.electric, theme.signal, theme.primaryGlow][i],
                transform: `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`,
              }} />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
