import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, display } from "../theme";
import React from "react";

// Shared UI helpers
export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const y = interpolate(frame - delay, [0, 20], [8, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <div style={{
      opacity: o, transform: `translateY(${y}px)`,
      fontSize: 13, letterSpacing: "0.35em", textTransform: "uppercase",
      color: theme.electric, fontWeight: 600,
    }}>{children}</div>
  );
};

export const Title: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({
  children, delay = 0, size = 84,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 140 } });
  const o = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [30, 0]);
  return (
    <h1 style={{
      opacity: o, transform: `translateY(${y}px)`,
      fontFamily: display, fontWeight: 600,
      fontSize: size, lineHeight: 1.05, margin: 0, color: theme.ink,
      letterSpacing: "-0.02em",
    }}>{children}</h1>
  );
};

export const Body: React.FC<{ children: React.ReactNode; delay?: number; width?: number }> = ({
  children, delay = 0, width = 640,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const y = interpolate(frame - delay, [0, 24], [10, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <p style={{
      opacity: o, transform: `translateY(${y}px)`,
      fontSize: 22, lineHeight: 1.45, color: theme.muted, maxWidth: width, margin: 0,
    }}>{children}</p>
  );
};

export const OrbitRings: React.FC<{ opacity?: number }> = ({ opacity = 0.25 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity, pointerEvents: "none" }}>
      {[520, 360, 220].map((size, i) => (
        <div key={size} style={{
          position: "absolute", width: size, height: size, borderRadius: "50%",
          border: `1px solid ${theme.border}`,
          transform: `rotate(${(frame * (i % 2 === 0 ? 0.4 : -0.6))}deg)`,
          borderTopColor: theme.electric, borderRightColor: "transparent", borderBottomColor: "transparent",
        }} />
      ))}
    </div>
  );
};

export const Grain: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: "radial-gradient(ellipse at 20% 10%, rgba(75,123,255,0.25), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(34,230,255,0.18), transparent 55%)",
  }} />
);

export const ScenePad: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", inset: 0, padding: "80px 96px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
    {children}
  </div>
);

export const useSceneFade = (fadeIn = 12, holdBeforeOut = 0) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeOutStart = durationInFrames - 14 - holdBeforeOut;
  const inO = interpolate(frame, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" });
  const outO = interpolate(frame, [fadeOutStart, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(inO, outO);
};
