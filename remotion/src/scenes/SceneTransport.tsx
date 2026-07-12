import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile, Sequence } from "remotion";
import { theme, display } from "../theme";
import { Eyebrow, Title, Body, Grain, useSceneFade } from "./_ui";

const tiles = [
  { img: "images/slide-airport.jpg",   tag: "Air · Hub",     label: "Airports" },
  { img: "images/slide-airplane.jpg",  tag: "Air",           label: "Airliners" },
  { img: "images/slide-railway.jpg",   tag: "Rail · Hub",    label: "Stations" },
  { img: "images/slide-train.jpg",     tag: "Rail",          label: "Trains" },
  { img: "images/slide-port.jpg",      tag: "Sea · Hub",     label: "Seaports" },
  { img: "images/slide-ship.jpg",      tag: "Sea",           label: "Ocean liners" },
  { img: "images/slide-speedboat.jpg", tag: "Sea",           label: "Speedboats" },
  { img: "images/slide-road.jpg",      tag: "Road",          label: "Cars & buses" },
];

const Tile: React.FC<{ i: number; t: typeof tiles[number] }> = ({ i, t }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = 15 + i * 6;
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 130 } });
  const o = interpolate(s, [0, 1], [0, 1]);
  const scale = interpolate(s, [0, 1], [0.9, 1]);
  const kb = 1 + (frame - delay) * 0.0008;
  return (
    <div style={{
      opacity: o, transform: `scale(${scale})`,
      position: "relative", borderRadius: 18, overflow: "hidden",
      border: `1px solid ${theme.border}`, aspectRatio: "4/5",
    }}>
      <Img src={staticFile(t.img)} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${Math.max(1, kb)})`,
      }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, ${theme.bg}f2)` }} />
      <div style={{ position: "absolute", inset: 0, padding: 14, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{
          alignSelf: "flex-start", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase",
          color: theme.electric, border: `1px solid ${theme.electric}55`, background: `${theme.electric}15`,
          padding: "4px 8px", borderRadius: 999,
        }}>{t.tag}</div>
        <div style={{ fontFamily: display, fontSize: 18, fontWeight: 600, marginTop: 8 }}>{t.label}</div>
      </div>
    </div>
  );
};

export const SceneTransport: React.FC = () => {
  const fade = useSceneFade();
  return (
    <AbsoluteFill style={{ background: theme.bg, opacity: fade }}>
      <Grain />
      <div style={{ position: "absolute", inset: 0, padding: "60px 96px", display: "grid", gridTemplateRows: "auto 1fr", gap: 28 }}>
        <div>
          <Eyebrow>Pillar 02 · Everywhere you move</Eyebrow>
          <div style={{ height: 12 }} />
          <Title size={62}>From tarmacs to <span style={{ color: theme.electric }}>turquoise waters</span>.</Title>
          <div style={{ height: 12 }} />
          <Body delay={10} width={780}>
            H.E.R.I links every surface you cross — airports, rail, seaports and roads,
            with real-time boards for the vehicles between them.
          </Body>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {tiles.map((t, i) => <Tile key={t.label} i={i} t={t} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
