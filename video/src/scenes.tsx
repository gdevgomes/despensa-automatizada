import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "./theme";
import { Phone, SidePanel, useAppear, useSpring } from "./ui";

const Background: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: COLORS.bg, fontFamily: FONT }}>{children}</AbsoluteFill>
);

/** Fade de entrada e saída de cada cena. */
const Fade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10, duration - 10, duration], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Scene: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => (
  <Background>
    <Fade duration={duration}>{children}</Fade>
  </Background>
);

/* ---------- Abertura ---------- */

export const IntroScene: React.FC<{ duration: number }> = ({ duration }) => {
  const logo = useSpring(0, 30);
  const title = useAppear(25);
  const tagline = useAppear(55);
  return (
    <Scene duration={duration}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 36 }}>
        <Img src={staticFile("logo.png")} style={{ width: 300, height: 300, borderRadius: 66, transform: `scale(${0.6 + logo * 0.4})`, opacity: logo, boxShadow: "0 30px 60px rgba(25,118,210,0.3)" }} />
        <div style={{ ...title, fontSize: 110, fontWeight: 800, color: COLORS.primary }}>Dispensa Automatizada</div>
        <div style={{ ...tagline, fontSize: 48, color: COLORS.ink, maxWidth: 1300, textAlign: "center", lineHeight: 1.25 }}>
          Controle o que você tem em casa e não deixe a comida vencer.
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* ---------- Problema ---------- */

const PAIN = [
  "A validade é pequena e fica escondida.",
  "Depois da compra do mês, a despensa enche.",
  "Os itens mais antigos ficam no fundo e vencem.",
];

export const ProblemScene: React.FC<{ duration: number }> = ({ duration }) => {
  const title = useAppear(0);
  const solution = useAppear(270);
  return (
    <Scene duration={duration}>
      <AbsoluteFill style={{ padding: "0 160px", justifyContent: "center", gap: 50 }}>
        <div style={{ ...title, fontSize: 84, fontWeight: 800, color: COLORS.ink, lineHeight: 1.1 }}>
          Você já achou um produto <span style={{ color: COLORS.red }}>vencido</span> na despensa?
        </div>
        <div style={{ display: "flex", gap: 36 }}>
          {PAIN.map((text, i) => (
            <PainCard key={text} text={text} delay={60 + i * 55} />
          ))}
        </div>
        <div style={{ ...solution, fontSize: 52, color: COLORS.ink }}>
          O app resolve isso em <b style={{ color: COLORS.primary }}>3 passos</b>: escanear, informar a validade e receber o lembrete.
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

const PainCard: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const style = useAppear(delay);
  return (
    <div style={{ ...style, flex: 1, background: COLORS.white, border: `2px solid ${COLORS.redLight}`, borderRadius: 24, padding: "36px 38px", fontSize: 40, lineHeight: 1.25, color: COLORS.ink, boxShadow: "0 12px 30px rgba(20,40,70,0.08)" }}>
      <div style={{ width: 14, height: 14, borderRadius: 7, background: COLORS.red, marginBottom: 22 }} />
      {text}
    </div>
  );
};

/* ---------- Telas reais do app (capturas do celular) ---------- */

/** Mostra uma captura real do app dentro da moldura do celular. */
const RealScreen: React.FC<{ file: string; opacity?: number }> = ({ file, opacity = 1 }) => (
  <Img src={staticFile(file)} style={{ position: "absolute", top: 34, left: 0, width: 360, height: 706, objectFit: "contain", objectPosition: "top", opacity }} />
);

const WhiteBase: React.FC = () => <div style={{ position: "absolute", inset: 0, background: COLORS.white }} />;

/* ---------- Passo 1: escanear ---------- */

export const ScanScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const found = interpolate(frame, [300, 312], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(frame, [296, 300, 316], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scene duration={duration}>
      <SidePanel
        step="PASSO 1"
        title="Escaneie o produto"
        lines={[
          "Abra o app e aponte a câmera para o código de barras.",
          "O app mostra o nome do produto.",
          "Você não digita nada. Os dados vêm do Open Food Facts.",
        ]}
        firstLineAt={30}
        lineGap={300}
      />
      <Phone dark>
        <WhiteBase />
        <RealScreen file="tela-scanner.png" />
        <RealScreen file="tela-produto.png" opacity={found} />
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
      </Phone>
    </Scene>
  );
};

/* ---------- Passo 2: validade ---------- */

export const ExpiryScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const picked = interpolate(frame, [200, 214], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scene duration={duration}>
      <SidePanel
        step="PASSO 2"
        title="Informe a validade"
        lines={["Escolha o ano e o mês da validade.", "Toque em adicionar.", "O produto entra na sua dispensa em poucos segundos."]}
        firstLineAt={30}
        lineGap={190}
      />
      <Phone>
        <WhiteBase />
        <RealScreen file="tela-produto.png" />
        <RealScreen file="tela-validade.png" opacity={picked} />
      </Phone>
    </Scene>
  );
};

/* ---------- Lista ---------- */

export const ListScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  // Toque simulado no botão "Acabou", seguido da captura real do resultado.
  const ripple = interpolate(frame, [570, 600], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = interpolate(frame, [600, 612], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scene duration={duration}>
      <SidePanel
        step="SUA DISPENSA"
        title="Tudo em uma lista"
        lines={[
          "Cada produto aparece com a sua foto.",
          "A lista vem ordenada por validade, com uma cor para cada situação.",
          "Acabou? Toque em Acabou. O lembrete é cancelado.",
        ]}
        firstLineAt={30}
        lineGap={270}
      />
      <Phone>
        <WhiteBase />
        <RealScreen file="tela-lista.png" />
        <RealScreen file="tela-lista-acabou.png" opacity={done} />
        {ripple > 0 && ripple < 1 ? (
          <div style={{ position: "absolute", left: 293 - 28, top: 224 - 28, width: 56, height: 56, borderRadius: 28, background: COLORS.primary, opacity: 0.45 * (1 - ripple), transform: `scale(${0.6 + ripple})` }} />
        ) : null}
      </Phone>
    </Scene>
  );
};

/* ---------- Lembretes ---------- */

export const ReminderScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const enter = useSpring(60, 24);
  const exit = useSpring(380, 18);
  const pressed = frame >= 330;
  return (
    <Scene duration={duration}>
      <SidePanel
        step="LEMBRETES"
        title="O app avisa você"
        lines={[
          "Sete dias antes da validade, às 9h da manhã, você recebe um lembrete.",
          "Responda na própria notificação: Sim, já consumi ou Ainda tenho.",
          "Ficou 15 dias sem abrir o app? Ele pede para conferir a despensa.",
        ]}
        firstLineAt={30}
        lineGap={170}
      />
      <Phone dark>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg,#1d3a5f,#0b1624)" }} />
        <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", color: COLORS.white }}>
          <div style={{ fontSize: 76, fontWeight: 300 }}>09:00</div>
          <div style={{ fontSize: 16, opacity: 0.8 }}>segunda-feira</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            top: 260,
            padding: 16,
            borderRadius: 20,
            background: "rgba(255,255,255,0.96)",
            transform: `translateY(${(1 - enter) * -60 + exit * -40}px)`,
            opacity: enter * (1 - exit),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Img src={staticFile("logo.png")} style={{ width: 28, height: 28, borderRadius: 7 }} />
            <div style={{ fontSize: 12, color: COLORS.muted }}>Dispensa Automatizada · agora</div>
          </div>
          <div style={{ marginTop: 10, fontSize: 16, fontWeight: 700, color: COLORS.ink }}>Nutella vence em 7 dias</div>
          <div style={{ marginTop: 4, fontSize: 13, color: COLORS.muted }}>Você já consumiu este produto?</div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <div style={{ flex: 1, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: pressed ? COLORS.green : COLORS.greenLight, color: pressed ? COLORS.white : COLORS.green }}>Sim, já consumi</div>
            <div style={{ flex: 1, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: COLORS.primaryLight, color: COLORS.primary }}>Ainda tenho</div>
          </div>
        </div>
      </Phone>
    </Scene>
  );
};

/* ---------- Fechamento ---------- */

export const OutroScene: React.FC<{ duration: number }> = ({ duration }) => {
  const logo = useSpring(0, 26);
  const line1 = useAppear(20);
  const chips = useAppear(80);
  return (
    <Scene duration={duration}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34 }}>
        <Img src={staticFile("logo.png")} style={{ width: 220, height: 220, borderRadius: 50, transform: `scale(${0.7 + logo * 0.3})`, opacity: logo, boxShadow: "0 24px 50px rgba(25,118,210,0.3)" }} />
        <div style={{ ...line1, fontSize: 84, fontWeight: 800, color: COLORS.primary, textAlign: "center", lineHeight: 1.1 }}>
          Menos desperdício.
          <br />
          <span style={{ color: COLORS.green }}>Mais economia.</span>
        </div>
        <div style={{ ...chips, display: "flex", gap: 22, fontSize: 36 }}>
          {["Android e iOS", "Sem cadastro nem login", "Dados no seu celular"].map((t) => (
            <div key={t} style={{ padding: "14px 30px", borderRadius: 40, background: COLORS.white, border: `2px solid ${COLORS.primaryLight}`, color: COLORS.ink }}>
              {t}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
