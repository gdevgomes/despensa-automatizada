import { Composition } from "remotion";
import { Video } from "./Video";
import { FPS, HEIGHT, WIDTH, totalFrames } from "./data";

export const Root: React.FC = () => (
  <Composition id="Video" component={Video} durationInFrames={totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
);
