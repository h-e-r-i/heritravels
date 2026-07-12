import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { theme, display } from "../theme";
import { Eyebrow, Title, Body, Grain, useSceneFade } from "./_ui";

const memos = [
  { tag: "MEMO",  who: "Ops · Aviation",     time: "08:12", body: "New runway checklist for the Nairobi hub — please review before Friday." },
  { tag: "NEWS",  who: "HR · Hospital",      time: "07:44", body: "Two additional paediatricians joining the ward next Monday." },
  { tag: "ALERT", who: "Security",           time: "06:20", body: "Access badges rotate tonight at 22:00 — collect replacements at reception." },
];

export const SceneWorkplace: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useSceneFade();

  return (
    <AbsoluteFill style={{ background: theme.bg, opacity: fade }}>
      <Img src={staticFile("images/slide-workplace.jpg")} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25,
      }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${theme.bg}ee 30%, ${theme.bg}88)` }} />
      <Grain />

      <div style={{ position: "absolute", inset: 0, padding: "80px 96px", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 60, alignItems: "center" }}>
        <div>
          <Eyebrow>Pillar 04 · Workplace</Eyebrow>
          <div style={{ height: 14 }} />
          <Title size={68}>Your workspace, <span style={{ color: theme.electric }}>private</span>.</Title>
          <div style={{ height: 16 }} />
          <Body delay={10} width={540}>
            Memos, news and alerts shared only with authorised members of your institution.
            An invite code gates the room. No noise, no leaks.
          </Body>

          <div style={{ height: 26, display: "flex", gap: 10 }}>
            <div style={{
              padding: "10px 16px", border: `1px dashed ${theme.electric}66`, borderRadius: 12,
              fontFamily: display, letterSpacing: "0.2em", fontSize: 14, color: theme.electric,
              background: `${theme.electric}0d`,
              opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
            }}>
              INVITE · HERI-AVIATION
            </div>
          </div>
        </div>

        {/* Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {memos.map((m, i) => {
            const s = spring({ frame: frame - (20 + i * 14), fps, config: { damping: 22, stiffness: 130 } });
            const o = interpolate(s, [0, 1], [0, 1]);
            const x = interpolate(s, [0, 1], [40, 0]);
            const color = m.tag === "ALERT" ? theme.signal : m.tag === "NEWS" ? theme.primaryGlow : theme.electric;
            return (
              <div key={m.who} style={{
                opacity: o, transform: `translateX(${x}px)`,
                background: "linear-gradient(160deg, rgba(75,123,255,0.10), rgba(10,18,38,0.6))",
                border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{
                      fontSize: 10, letterSpacing: "0.25em", padding: "4px 8px", borderRadius: 6,
                      background: `${color}22`, color, border: `1px solid ${color}55`,
                    }}>{m.tag}</span>
                    <span style={{ fontFamily: display, fontWeight: 600 }}>{m.who}</span>
                  </div>
                  <span style={{ fontSize: 12, color: theme.muted }}>{m.time}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 15, color: theme.muted, lineHeight: 1.5 }}>{m.body}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
