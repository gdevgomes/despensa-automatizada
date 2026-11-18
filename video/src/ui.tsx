import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "./theme";

/** Progresso 0→1 de uma animação com mola, começando em `delay` (em frames). */
export const useSpring = (delay = 0, duration = 20) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, durationInFrames: duration, config: { damping: 200 } });
};

/** Estilo de entrada: sobe e aparece. */
export const useAppear = (delay = 0, duration = 20, distance = 30) => {
  const progress = useSpring(delay, duration);
  return {
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`,
  };
};

/** Painel de texto à esquerda das cenas com celular. */
export const SidePanel: React.FC<{
  step: string;
  title: string;
  lines: string[];
  /** Frame em que a primeira linha aparece. */
  firstLineAt?: number;
  /** Espaço em frames entre uma linha e a próxima. */
  lineGap?: number;
}> = ({ step, title, lines, firstLineAt = 20, lineGap = 70 }) => {
  const stepStyle = useAppear(0);
  const titleStyle = useAppear(8);
  return (
    <div style={{ position: "absolute", left: 130, top: 0, bottom: 0, width: 920, display: "flex", flexDirection: "column", justifyContent: "center", fontFamily: FONT }}>
      <div style={{ ...stepStyle, alignSelf: "flex-start", background: COLORS.primary, color: COLORS.white, fontSize: 30, fontWeight: 700, letterSpacing: 2, padding: "10px 26px", borderRadius: 40 }}>
        {step}
      </div>
      <div style={{ ...titleStyle, fontSize: 92, fontWeight: 800, color: COLORS.ink, lineHeight: 1.05, marginTop: 34 }}>{title}</div>
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 26 }}>
        {lines.map((line, i) => (
          <Line key={line} text={line} delay={firstLineAt + i * lineGap} />
        ))}
      </div>
    </div>
  );
};

const Line: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const style = useAppear(delay);
  return (
    <div style={{ ...style, display: "flex", alignItems: "flex-start", gap: 22, fontSize: 44, lineHeight: 1.25, color: COLORS.ink }}>
      <div style={{ flex: "none", width: 16, height: 16, borderRadius: 8, background: COLORS.green, marginTop: 17 }} />
      <div>{text}</div>
    </div>
  );
};

/** Moldura de celular. O conteúdo usa um espaço de 360×740. */
export const Phone: React.FC<{ children: React.ReactNode; dark?: boolean; scale?: number; delay?: number }> = ({ children, dark, scale = 1.2, delay = 0 }) => {
  const progress = useSpring(delay, 26);
  return (
    <div
      style={{
        position: "absolute",
        right: 150,
        top: (1080 - 740 * scale) / 2,
        width: 360,
        height: 740,
        transform: `scale(${scale * interpolate(progress, [0, 1], [0.92, 1])})`,
        transformOrigin: "top right",
        opacity: progress,
      }}
    >
      <div style={{ position: "absolute", inset: -14, borderRadius: 58, background: "#11161c", boxShadow: "0 40px 90px rgba(20,40,70,0.35)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 44, overflow: "hidden", background: dark ? "#0d1117" : COLORS.white, fontFamily: FONT }}>{children}</div>
      <div style={{ position: "absolute", top: 10, left: 140, width: 80, height: 22, borderRadius: 11, background: "#11161c" }} />
    </div>
  );
};



