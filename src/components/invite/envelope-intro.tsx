"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useId, useRef, useState } from "react";
import { burstFromSeal } from "./gate-intro";

const WaxSeal3D = dynamic(() => import("@/components/three/wax-seal-3d"), { ssr: false });

const silk = [0.7, 0, 0.25, 1] as const;
const royal = [0.22, 1, 0.36, 1] as const;

/** Where the flaps meet and the seal sits, as fractions of the envelope. */
const SEAL_X = 0.5;
const SEAL_Y = 0.47;
const SEAL_W = 0.34;

/* ------------------------------------------------------------------ */
/*  Letterpress emboss                                                  */
/* ------------------------------------------------------------------ */
const PAPER = "#f3e1cd";
const SHADOW = "rgba(118,76,44,.55)";
const HIGHLIGHT = "#fffdf8";
const DETAIL = "rgba(150,104,68,.58)";

type Vars = React.CSSProperties & Record<`--emb-${string}`, string>;

/**
 * Draws a motif three times — a soft shadow offset down-right, a highlight
 * offset up-left and the paper-coloured face with fine engraved lines — which
 * reads as paper pressed up from behind.
 */
function Emboss({ viewBox, className, style, children }: { viewBox: string; className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const shadow: Vars = { fill: SHADOW, "--emb-detail": "transparent", "--emb-stem": SHADOW, "--emb-gold": SHADOW };
  const light: Vars = { fill: HIGHLIGHT, "--emb-detail": "transparent", "--emb-stem": HIGHLIGHT, "--emb-gold": HIGHLIGHT };
  const face: Vars = { fill: PAPER, "--emb-detail": DETAIL, "--emb-stem": PAPER, "--emb-gold": `url(#${id}-foil)` };
  return (
    <svg viewBox={viewBox} className={`emb pointer-events-none absolute ${className ?? ""}`} style={style} aria-hidden>
      <defs>
        <linearGradient id={`${id}-foil`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b98a35" />
          <stop offset=".45" stopColor="#f3d68f" />
          <stop offset=".7" stopColor="#c99a45" />
          <stop offset="1" stopColor="#9a7428" />
        </linearGradient>
        <g id={`${id}-m`}>{children}</g>
      </defs>
      <use href={`#${id}-m`} transform="translate(1.25 1.45)" style={shadow} />
      <use href={`#${id}-m`} transform="translate(-.9 -.9)" style={light} />
      <use href={`#${id}-m`} style={face} />
    </svg>
  );
}

/* Floral primitives (drawn pointing "up"; rotate in degrees, negative = left) */
function Leaf({ x, y, r, len = 18, w = 7, gold = false }: { x: number; y: number; r: number; len?: number; w?: number; gold?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path className={gold ? "g d" : "d"} d={`M0 0C${w * 0.75} ${-len * 0.28} ${w * 0.7} ${-len * 0.72} 0 ${-len}C${-w * 0.7} ${-len * 0.72} ${-w * 0.75} ${-len * 0.28} 0 0Z`} />
      <path className="s" style={{ strokeWidth: 0.45 }} d={`M0 -1L0 ${-len * 0.82}`} />
    </g>
  );
}

function Bloom({ x, y, r, petals = 8 }: { x: number; y: number; r: number; petals?: number }) {
  const petal = (len: number, w: number) =>
    `M0 0C${w} ${-len * 0.2} ${w * 1.05} ${-len * 0.78} ${w * 0.35} ${-len}Q0 ${-len * 1.08} ${-w * 0.35} ${-len}C${-w * 1.05} ${-len * 0.78} ${-w} ${-len * 0.2} 0 0Z`;
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: petals }).map((_, i) => (
        <g key={`o${i}`} transform={`rotate(${(360 / petals) * i})`}>
          <path className="d" d={petal(r, r * 0.42)} />
          <path className="s" style={{ strokeWidth: 0.4 }} d={`M0 ${-r * 0.35}L0 ${-r * 0.82}`} />
        </g>
      ))}
      {Array.from({ length: petals - 2 }).map((_, i) => (
        <path key={`m${i}`} className="d" transform={`rotate(${(360 / (petals - 2)) * i + 18})`} d={petal(r * 0.7, r * 0.32)} />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <path key={`i${i}`} className="d" transform={`rotate(${i * 72 + 36})`} d={petal(r * 0.42, r * 0.22)} />
      ))}
      <circle className="d" r={r * 0.2} />
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={`s${i}`} className="g" transform={`rotate(${i * 45 + 10})`} cy={-r * 0.24} r={r * 0.05} />
      ))}
    </g>
  );
}

/** A little cluster of berries to fill gaps between leaves. */
function Berries({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${Math.abs(s)})`}>
      <circle className="d" r={2.1} />
      <circle className="d" cx={3.6} cy={-2.2} r={1.7} />
      <circle className="g" cx={-3.2} cy={-2.6} r={1.5} />
    </g>
  );
}

function Blossom({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} className="d" transform={`rotate(${i * 72})`} cy={-r * 0.62} r={r * 0.5} />
      ))}
      <circle className="g" r={r * 0.32} />
    </g>
  );
}

function Bud({ x, y, r, len = 9 }: { x: number; y: number; r: number; len?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path className="d" d={`M0 0C${len * 0.5} ${-len * 0.4} ${len * 0.3} ${-len} 0 ${-len * 1.15}C${-len * 0.3} ${-len} ${-len * 0.5} ${-len * 0.4} 0 0Z`} />
    </g>
  );
}

const mirror = (W: number) => (l: { x: number; y: number; r: number; len?: number; w?: number; gold?: boolean }) => ({ ...l, x: W - l.x, r: -l.r });

/** Bouquet on the top flap: wide at the top, tapering toward the seal. */
function BouquetTop() {
  const leaves = [
    { x: 100, y: 70, r: -70, len: 20 },
    { x: 92, y: 74, r: -125, len: 18 },
    { x: 78, y: 66, r: -60, len: 19, gold: true },
    { x: 66, y: 66, r: -128, len: 17 },
    { x: 54, y: 58, r: -58, len: 17 },
    { x: 42, y: 56, r: -130, len: 15 },
    { x: 30, y: 47, r: -62, len: 14 },
    { x: 20, y: 44, r: -120, len: 12 },
    { x: 92, y: 90, r: -150, len: 15 },
    { x: 76, y: 97, r: -120, len: 14, gold: true },
    { x: 62, y: 101, r: -160, len: 13 },
    { x: 112, y: 112, r: -40, len: 13 },
    { x: 114, y: 136, r: -45, len: 11 },
  ];
  const all = [...leaves, ...leaves.map(mirror(240))];
  return (
    <>
      <path className="s" d="M120 72C92 70 52 62 14 40" />
      <path className="s" d="M120 72C148 70 188 62 226 40" />
      <path className="s" d="M120 78C96 92 70 101 42 105" />
      <path className="s" d="M120 78C144 92 170 101 198 105" />
      <path className="s" d="M120 82C117 110 123 136 120 166" />
      {all.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}
      <Bloom x={78} y={54} r={13} petals={7} />
      <Bloom x={162} y={54} r={13} petals={7} />
      <Bloom x={120} y={60} r={24} petals={9} />
      <Blossom x={40} y={98} r={6} />
      <Blossom x={200} y={98} r={6} />
      <Blossom x={28} y={30} r={5} />
      <Blossom x={212} y={30} r={5} />
      <Berries x={56} y={80} />
      <Berries x={184} y={80} s={-1} />
      <Berries x={98} y={104} s={0.8} />
      <Berries x={142} y={104} s={-0.8} />
      <Bud x={120} y={150} r={0} />
      <Bud x={120} y={124} r={-28} len={7} />
      <Bud x={120} y={124} r={28} len={7} />
    </>
  );
}

/** Bouquet on the bottom flap: fans outward and up toward the seal. */
function BouquetBottom() {
  const leaves = [
    { x: 98, y: 98, r: -75, len: 20 },
    { x: 88, y: 104, r: -120, len: 19, gold: true },
    { x: 72, y: 92, r: -65, len: 18 },
    { x: 58, y: 88, r: -125, len: 17 },
    { x: 44, y: 78, r: -60, len: 16, gold: true },
    { x: 30, y: 72, r: -128, len: 14 },
    { x: 20, y: 62, r: -70, len: 12 },
    { x: 90, y: 122, r: -140, len: 15 },
    { x: 70, y: 128, r: -110, len: 14 },
    { x: 48, y: 134, r: -150, len: 13 },
    { x: 112, y: 70, r: -35, len: 13 },
    { x: 114, y: 44, r: -40, len: 11, gold: true },
  ];
  const all = [...leaves, ...leaves.map(mirror(240))];
  return (
    <>
      <path className="s" d="M120 100C90 96 52 84 16 60" />
      <path className="s" d="M120 100C150 96 188 84 224 60" />
      <path className="s" d="M120 106C92 118 60 130 22 140" />
      <path className="s" d="M120 106C148 118 180 130 218 140" />
      <path className="s" d="M120 90C117 62 123 34 120 8" />
      {all.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}
      <Bloom x={76} y={106} r={14} petals={7} />
      <Bloom x={164} y={106} r={14} petals={7} />
      <Bloom x={120} y={98} r={26} petals={9} />
      <Blossom x={30} y={140} r={6} />
      <Blossom x={210} y={140} r={6} />
      <Blossom x={36} y={56} r={5} />
      <Blossom x={204} y={56} r={5} />
      <Berries x={58} y={112} />
      <Berries x={182} y={112} s={-1} />
      <Berries x={100} y={128} s={0.8} />
      <Berries x={140} y={128} s={-0.8} />
      <Bud x={120} y={22} r={0} />
      <Bud x={120} y={50} r={-30} len={7} />
      <Bud x={120} y={50} r={30} len={7} />
    </>
  );
}

/** Trailing vine for the side flaps. */
function Vine() {
  const sx = (y: number) => 30 + 9 * Math.sin(y / 38);
  const stem = Array.from({ length: 53 }, (_, i) => {
    const y = 258 - i * 5;
    return `${i ? "L" : "M"}${sx(y).toFixed(1)} ${y}`;
  }).join("");
  const leaves = Array.from({ length: 12 }, (_, i) => {
    const y = 236 - i * 18;
    const left = i % 2 === 0;
    return { x: sx(y), y, r: left ? -58 : 58, len: 15 - i * 0.35, w: 6, gold: i === 3 || i === 8 };
  });
  return (
    <>
      <path className="s" d={stem} />
      {leaves.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}
      {[196, 128, 66].map((y, i) => (
        <Blossom key={y} x={sx(y) + (i % 2 ? 8 : -8)} y={y} r={6} />
      ))}
      <Bud x={sx(14)} y={14} r={0} len={8} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Envelope flaps                                                      */
/* ------------------------------------------------------------------ */
type Side = "top" | "bottom" | "left" | "right";
const P = (x: number, y: number) => `${x}% ${y}%`;
const cx = SEAL_X * 100;
const cy = SEAL_Y * 100;
const FLAPS: Record<Side, { pts: [number, number][]; origin: string; axis: "X" | "Y"; open: number; delay: number; shade: string; edge: string }> = {
  left: { pts: [[0, 0], [cx, cy], [0, 100]], origin: "0% 50%", axis: "Y", open: -176, delay: 1.35, shade: "linear-gradient(90deg,#f4e3d0,#eed8c1)", edge: `M0 0L${cx} ${cy}L0 100` },
  right: { pts: [[100, 0], [100, 100], [cx, cy]], origin: "100% 50%", axis: "Y", open: 176, delay: 1.35, shade: "linear-gradient(270deg,#f2dfcb,#ecd5be)", edge: `M100 0L${cx} ${cy}L100 100` },
  bottom: { pts: [[0, 100], [100, 100], [cx, cy]], origin: "50% 100%", axis: "X", open: -178, delay: 1.0, shade: "linear-gradient(0deg,#f0dcc6,#f6e7d6)", edge: `M0 100L${cx} ${cy}L100 100` },
  top: { pts: [[0, 0], [100, 0], [cx, cy]], origin: "50% 0%", axis: "X", open: 178, delay: 0.5, shade: "linear-gradient(180deg,#f7e9d9,#efdac4)", edge: `M0 0L${cx} ${cy}L100 0` },
};

const PAPER_GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .55 0 0 0 0 .4 0 0 0 0 .28 0 0 0 .09 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

function Flap({ side, opening, children }: { side: Side; opening: boolean; children?: React.ReactNode }) {
  const f = FLAPS[side];
  const clip = `polygon(${f.pts.map(([x, y]) => P(x, y)).join(",")})`;
  // The back face is rotated 180°, so its polygon is mirrored along the hinge axis.
  const backClip = `polygon(${f.pts.map(([x, y]) => (f.axis === "X" ? P(x, 100 - y) : P(100 - x, y))).join(",")})`;
  const rotate = f.axis === "X" ? { rotateX: opening ? f.open : 0 } : { rotateY: opening ? f.open : 0 };
  const overlaps = side === "top" || side === "bottom";

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ transformOrigin: f.origin, transformStyle: "preserve-3d", transformPerspective: 1600 }}
      animate={rotate}
      transition={{ duration: 1.35, delay: f.delay, ease: silk }}
    >
      {/* front: embossed paper */}
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", filter: overlaps ? "drop-shadow(0 5px 7px rgba(110,70,40,.22))" : undefined }}>
        <div className="absolute inset-0" style={{ clipPath: clip, background: `${PAPER_GRAIN}, ${f.shade}` }}>
          {children}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d={f.edge} fill="none" stroke="rgba(140,95,60,.32)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            <path d={f.edge} fill="none" stroke="rgba(255,250,240,.75)" strokeWidth="1" vectorEffect="non-scaling-stroke" transform="translate(0 .25)" />
          </svg>
        </div>
      </div>
      {/* back: inner paper with a whisper of gold */}
      <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: f.axis === "X" ? "rotateX(180deg)" : "rotateY(180deg)" }}>
        <div className="absolute inset-0" style={{ clipPath: backClip, background: `${PAPER_GRAIN}, linear-gradient(135deg,#ead3ba,#e2c7a8)` }} />
      </div>
    </motion.div>
  );
}

/** Flat ivory seal shown instantly, until the 3D seal is ready (or if WebGL is unavailable). */
function FlatSeal({ initials }: { initials: [string, string] }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="fs-wax" cx=".38" cy=".32" r=".85">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset=".6" stopColor="#eedfc4" />
          <stop offset="1" stopColor="#cdb48e" />
        </radialGradient>
        <linearGradient id="fs-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3d68f" />
          <stop offset=".5" stopColor="#c99a45" />
          <stop offset="1" stopColor="#9a7428" />
        </linearGradient>
      </defs>
      <path
        fill="url(#fs-wax)"
        d="M100 6c14 0 18 10 30 12s22-4 30 6s0 20 6 30s18 12 18 26s-12 16-14 28s8 20 0 30s-20 4-30 10s-10 20-24 22s-18-10-30-10s-20 12-32 6s-6-18-14-26s-22-8-24-22s10-18 10-30s-12-18-6-30s20-6 28-14s4-20 18-26s20 8 34 8z"
      />
      <circle cx="100" cy="100" r="66" fill="none" stroke="url(#fs-gold)" strokeWidth="3.5" />
      <text x="100" y="118" textAnchor="middle" fontFamily="var(--font-pinyon)" fontSize="58" fill="url(#fs-gold)">
        {initials[0]}
        <tspan fontSize="30" dy="-10">&amp;</tspan>
        <tspan dy="10">{initials[1]}</tspan>
      </text>
    </svg>
  );
}

const GLINTS = [
  [22, 14, 0],
  [80, 22, 1.4],
  [14, 62, 2.6],
  [88, 70, 0.8],
  [64, 84, 3.2],
  [34, 90, 2],
  [58, 30, 4],
  [40, 8, 2.9],
  [72, 56, 1.1],
  [26, 40, 3.7],
] as const;

/* ------------------------------------------------------------------ */
/*  The envelope                                                        */
/* ------------------------------------------------------------------ */
export function EnvelopeIntro({
  guest,
  initials,
  names,
  dateLine,
  onOpenStart,
  onReveal,
  onDone,
}: {
  guest: string | null;
  initials: [string, string];
  names: string;
  dateLine: string;
  onOpenStart: () => void;
  onReveal: () => void;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<"closed" | "opening" | "leaving">("closed");
  const [sealReady, setSealReady] = useState(false);
  const sealBtn = useRef<HTMLButtonElement>(null);
  const finished = useRef(false);
  const opening = phase !== "closed";

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  const leave = useCallback(() => {
    onReveal();
    setPhase("leaving");
    // Unlock the page even if the exit fade never completes (e.g. a backgrounded tab).
    setTimeout(finish, 1500);
  }, [onReveal, finish]);

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    onOpenStart();
    navigator.vibrate?.(18);
    burstFromSeal(sealBtn.current);
    setTimeout(leave, 3700);
  };

  const skip = () => {
    onOpenStart();
    leave();
  };

  return (
    <AnimatePresence onExitComplete={finish}>
      {phase !== "leaving" && (
        <motion.div
          key="envelope"
          className="fixed inset-0 z-[60] grid place-items-center overflow-hidden bg-[#3b2416] bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,196,120,.35),transparent_55%),radial-gradient(ellipse_at_80%_90%,rgba(190,120,60,.3),transparent_50%)]"
          exit={{ opacity: 0, transition: { duration: 1.1, ease: "easeInOut" } }}
          role="dialog"
          aria-label="Invitation envelope"
        >
          <motion.div
            className="relative h-dvh w-[min(100vw,56.25dvh)] overflow-hidden md:h-[94dvh] md:w-[min(100vw,52.9dvh)] md:rounded-[28px] md:shadow-[0_40px_90px_rgba(20,8,0,.6)]"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: royal }}
          >
            {/* inside of the envelope, revealed as the flaps unfold */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,#fff1cf_0%,#e9c27a_32%,#b9853a_70%,#7c5520_100%)]">
              <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle,rgba(255,255,255,.6)_1px,transparent_1.5px)] [background-size:14px_14px]" />
              <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(255,250,230,.95),transparent_45%)]"
                initial={{ opacity: 0 }}
                animate={opening ? { opacity: [0, 0.6, 1] } : { opacity: 0 }}
                transition={{ duration: 3.2, delay: 0.8, times: [0, 0.6, 1] }}
              />
              {/* the invitation card rises out of the envelope */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-[76%] -translate-x-1/2 -translate-y-1/2"
                initial={{ y: "22%", scale: 0.9, opacity: 0 }}
                animate={opening ? { y: ["22%", "0%", "0%"], scale: [0.9, 1, 1.08], opacity: [0, 1, 1] } : {}}
                transition={{ duration: 2.2, delay: 1.6, times: [0, 0.55, 1], ease: royal }}
              >
                <div className="rounded-xl bg-[#fbf3e6] p-2 shadow-[0_30px_60px_rgba(80,45,10,.45)]">
                  <div className="rounded-lg px-5 py-9 text-center ring-1 ring-[#c99a45]/60">
                    <p className="font-hindi text-sm text-[#9a7428]">॥ शुभ विवाह ॥</p>
                    <p className="text-foil-deep mt-3 font-script text-[clamp(2.6rem,11vw,3.6rem)] leading-tight">{names}</p>
                    <p className="eyebrow mt-3 text-[0.58rem] text-[#8a6a4a]">are getting married</p>
                    <div className="mx-auto my-4 h-px w-24 bg-gradient-to-r from-transparent via-[#c99a45] to-transparent" />
                    <p className="font-display text-xs tracking-[0.3em] text-[#6b4a2a] uppercase">{dateLine}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <Flap side="left" opening={opening}>
              <Emboss viewBox="0 0 60 260" className="top-[25%] left-[4%] h-[50%]" style={{ aspectRatio: "60 / 260" }}>
                <Vine />
              </Emboss>
            </Flap>
            <Flap side="right" opening={opening}>
              <Emboss viewBox="0 0 60 260" className="top-[25%] right-[4%] h-[50%] -scale-x-100" style={{ aspectRatio: "60 / 260" }}>
                <Vine />
              </Emboss>
            </Flap>
            <Flap side="bottom" opening={opening}>
              <Emboss viewBox="0 0 240 170" className="top-[67.5%] left-1/2 w-[62%] -translate-x-1/2">
                <BouquetBottom />
              </Emboss>
            </Flap>
            <Flap side="top" opening={opening}>
              <Emboss viewBox="0 0 240 170" className="top-[3%] left-1/2 w-[74%] -translate-x-1/2">
                <BouquetTop />
              </Emboss>
            </Flap>

            {/* golden light: a warm lamp glow, a sheen sweeping the paper and glints */}
            <motion.div className="pointer-events-none absolute inset-0" animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 0.6 }}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_8%,rgba(255,206,130,.38),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_100%,rgba(255,190,110,.22),transparent_50%)]" />
              <div
                className="absolute aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(255,214,140,.42),transparent_62%)] [animation-duration:4s]"
                style={{ left: `${SEAL_X * 100}%`, top: `${SEAL_Y * 100}%` }}
              />
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[20%] left-0 h-[140%] w-[45%] animate-sheen bg-gradient-to-r from-transparent via-[rgba(255,236,196,.6)] to-transparent" />
              </div>
              {GLINTS.map(([x, y, d]) => (
                <svg
                  key={`${x}-${y}`}
                  viewBox="-10 -10 20 20"
                  className="absolute size-6 animate-glint text-[#fff6dc] drop-shadow-[0_0_8px_rgba(255,206,120,1)]"
                  style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }}
                  aria-hidden
                >
                  <path d="M0-10C1-3 3-1 10 0C3 1 1 3 0 10C-1 3-3 1-10 0C-3-1-1-3 0-10Z" fill="currentColor" />
                </svg>
              ))}
            </motion.div>

            {/* greeting + hint */}
            <motion.div
              className="pointer-events-none absolute top-[60.5%] left-1/2 w-[70%] -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: opening ? 0 : 1, y: 0 }}
              transition={{ duration: opening ? 0.4 : 1, delay: opening ? 0 : 0.9 }}
            >
              <p className="eyebrow text-[0.55rem] text-[#a07a55]">{guest ? "Specially for" : "You are invited"}</p>
              <p className="text-foil-deep mt-0.5 font-script text-[clamp(1.9rem,8vw,2.5rem)] leading-tight [filter:drop-shadow(0_1px_0_rgba(255,255,255,.7))]">
                {guest ?? names}
              </p>
            </motion.div>
            <motion.p
              className="eyebrow pointer-events-none absolute bottom-[max(1.4rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-[0.58rem] whitespace-nowrap text-[#8f6b4a]"
              animate={opening ? { opacity: 0 } : { opacity: [0.45, 1, 0.45] }}
              transition={opening ? { duration: 0.3 } : { duration: 2.6, repeat: Infinity, delay: 1.5 }}
            >
              Tap the seal to open
            </motion.p>

            {/* seal: a soft cast shadow, the instant flat seal and the 3D seal */}
            <motion.div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(90,55,25,.38),transparent_68%)]"
              style={{ left: `${SEAL_X * 100 + 1.2}%`, top: `calc(${SEAL_Y * 100}% + 1.6%)`, width: `${SEAL_W * 118}%`, aspectRatio: "1" }}
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${SEAL_X * 100}%`, top: `${SEAL_Y * 100}%`, width: `${SEAL_W * 104}%`, aspectRatio: "1" }}
              animate={{ opacity: sealReady ? 0 : opening ? 0 : 1, scale: opening && !sealReady ? 0.6 : 1 }}
              transition={{ duration: 0.6 }}
            >
              <FlatSeal initials={initials} />
            </motion.div>
            <WaxSeal3D initials={initials} cracked={opening} x={SEAL_X} y={SEAL_Y} widthRatio={SEAL_W} onReady={() => setSealReady(true)} />
            <button
              ref={sealBtn}
              type="button"
              onClick={open}
              disabled={opening}
              aria-label="Tap the seal to open the invitation"
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#c99a45]"
              style={{ left: `${SEAL_X * 100}%`, top: `${SEAL_Y * 100}%`, width: `${SEAL_W * 110}%`, aspectRatio: "1" }}
            />
          </motion.div>

          {!opening && (
            <button
              type="button"
              onClick={skip}
              className="eyebrow absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-10 rounded-full bg-[#3b2416]/40 px-4 py-2 text-[0.6rem] text-[#fbf3e6]"
            >
              Skip ›
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
