import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme, display } from "../theme";
import { Eyebrow, Title, Body, ScenePad, Grain, useSceneFade } from "./_ui";

const problems = [
  "5 apps to plan a trip",
  "No signal on your vitals",
  "Work memos lost in chat",
  "Weather in another tab",
  "Bookings scattered everywhere",
];

export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = useSceneFade();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(140deg, ${theme.bg}, ${theme.bgAlt})`, opacity: fade }}>
      <Grain />
      {/* Floating drifting problem chips */}
      {problems.map((p, i) => {
        const t = frame - i * 8;
        const x = interpolate(t, [0, 300], [-40, 40]);
        const o = interpolate(t, [0, 25, 260, 320], [0, 0.9, 0.9, 0]);
        const rot = interpolate(i, [0, 4], [-6, 6]);
        const positions = [
          { top: "12%", left: "8%" },
          { top: "22%", right: "6%" },
          { top: "50%", left: "62%" },
          { bottom: "18%", left: "10%" },
          { bottom: "10%", right: "12%" },
        ][i];
        return (
          <div key={p} style={{
            position: "absolute", ...positions,
            padding: "12px 22px", borderRadius: 999,
            background: "rgba(255,255,255,0.04)", border: `1px solid ${theme.border}`,
            color: theme.muted, fontSize: 18, fontFamily: display,
            transform: `translate(${x}px, 0) rotate(${rot}deg)`,
            opacity: o, whiteSpace: "nowrap",
          }}>× {p}</div>
        );
      })}

      <ScenePad>
        <Eyebrow>The problem</Eyebrow>
        <div style={{ height: 20 }} />
        <Title size={92}>Your day is <span style={{ color: theme.danger }}>fragmented</span>.</Title>
        <div style={{ height: 24 }} />
        <Body width={640}>
          Weather here. Flights there. Health elsewhere. Work memos buried in group chats.
          Every tap, a different app. Every context switch, a little tax.
        </Body>
      </ScenePad>
    </AbsoluteFill>
  );
};
