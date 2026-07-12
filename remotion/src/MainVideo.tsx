import { AbsoluteFill, Sequence } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { theme } from "./theme";
import { SceneProblem } from "./scenes/SceneProblem";
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneNavigator } from "./scenes/SceneNavigator";
import { SceneTransport } from "./scenes/SceneTransport";
import { SceneHealth } from "./scenes/SceneHealth";
import { SceneWorkplace } from "./scenes/SceneWorkplace";
import { SceneOutro } from "./scenes/SceneOutro";

loadDisplay("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const FPS = 30;
export const WIDTH = 1280;
export const HEIGHT = 720;

// 90 seconds total
const S = FPS; // seconds -> frames
const D = {
  problem: 14 * S,     // 0
  intro: 11 * S,       // 14
  navigator: 14 * S,   // 25
  transport: 15 * S,   // 39
  health: 12 * S,      // 54
  workplace: 12 * S,   // 66
  outro: 12 * S,       // 78 -> 90
};
export const TOTAL_FRAMES = Object.values(D).reduce((a, b) => a + b, 0);

let cursor = 0;
const seq = (dur: number) => {
  const from = cursor;
  cursor += dur;
  return { from, durationInFrames: dur };
};

const s1 = seq(D.problem);
const s2 = seq(D.intro);
const s3 = seq(D.navigator);
const s4 = seq(D.transport);
const s5 = seq(D.health);
const s6 = seq(D.workplace);
const s7 = seq(D.outro);

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg, fontFamily: "Inter, sans-serif", color: theme.ink }}>
      <Sequence {...s1}><SceneProblem /></Sequence>
      <Sequence {...s2}><SceneIntro /></Sequence>
      <Sequence {...s3}><SceneNavigator /></Sequence>
      <Sequence {...s4}><SceneTransport /></Sequence>
      <Sequence {...s5}><SceneHealth /></Sequence>
      <Sequence {...s6}><SceneWorkplace /></Sequence>
      <Sequence {...s7}><SceneOutro /></Sequence>
    </AbsoluteFill>
  );
};
