import { AbsoluteFill, Sequence } from "remotion";
import { FPS, SCENE_ORDER, SCENE_SECONDS } from "./data";
import { ExpiryScene, IntroScene, ListScene, OutroScene, ProblemScene, ReminderScene, ScanScene } from "./scenes";

const SCENES = {
  intro: IntroScene,
  problem: ProblemScene,
  scan: ScanScene,
  expiry: ExpiryScene,
  list: ListScene,
  reminder: ReminderScene,
  outro: OutroScene,
} as const;

export const Video: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill>
      {SCENE_ORDER.map((key) => {
        const duration = SCENE_SECONDS[key] * FPS;
        const Scene = SCENES[key];
        const start = from;
        from += duration;
        return (
          <Sequence key={key} from={start} durationInFrames={duration}>
            <Scene duration={duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
