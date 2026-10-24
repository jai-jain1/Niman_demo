"use client";

import confetti from "canvas-confetti";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { WaxSeal } from "@/components/ornaments";
import type { IntroArt } from "@/content/invites/types";
import { seeded } from "@/lib/invite-utils";
import { CinematicGate } from "./cinematic-gate";

const GoldDust = dynamic(() => import("@/components/three/gold-dust"), { ssr: false });

const silk = [0.7, 0, 0.25, 1] as const;
const royal = [0.22, 1, 0.36, 1] as const;

type Stage = "preload" | "gate" | "opening" | "gone";

/* ------------------------------------------------------------------ */
/*  Arch geometry (450 × 800 artboard)                                  */
/* ------------------------------------------------------------------ */
type Pt = [number, number];
const L: Pt[] = [[34, 236], [34, 156], [140, 100], [225, 64]];
const R: Pt[] = [[225, 64], [310, 100], [416, 156], [416, 236]];
const OPENING = "M34 800 V236 C34 156 140 100 225 64 C310 100 416 156 416 236 V800 Z";
const bez = ([a, b, c, d]: Pt[], t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
};
const alongArch = (n: number) => [
  ...Array.from({ length: n }, (_, i) => bez(L, i / n)),
  ...Array.from({ length: n + 1 }, (_, i) => bez(R, i / n)),
];

/* ------------------------------------------------------------------ */
/*  Brass door leaf                                                     */
/* ------------------------------------------------------------------ */
function DoorLeaf({ side }: { side: "left" | "right" }) {
  const id = `door-${side}`;
  return (
    <svg
      viewBox="0 0 200 640"
      preserveAspectRatio={side === "left" ? "xMaxYMid slice" : "xMinYMid slice"}
      className="absolute inset-0 h-full w-full"
      style={side === "right" ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-brass`} x1="0" x2="1">
          <stop offset="0" stopColor="#6b4a17" />
          <stop offset=".18" stopColor="#c9a04e" />
          <stop offset=".42" stopColor="#f3dc9a" />
          <stop offset=".6" stopColor="#b98c3a" />
          <stop offset=".85" stopColor="#e2c27a" />
          <stop offset="1" stopColor="#7c5b1f" />
        </linearGradient>
        <linearGradient id={`${id}-panel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f330c" />
          <stop offset="1" stopColor="#261804" />
        </linearGradient>
        {/* candle-lit palace interior glowing through the jaali */}
        <radialGradient id={`${id}-glow`} cx={side === "left" ? "1" : "1"} cy=".55" r="1.1">
          <stop offset="0" stopColor="#fff0c2" />
          <stop offset=".3" stopColor="#f2b45a" />
          <stop offset=".7" stopColor="#8a3a12" />
          <stop offset="1" stopColor="#2a0c04" />
        </radialGradient>
        <pattern id={`${id}-jaali`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M10 0 C14 4 14 6 10 10 C6 6 6 4 10 0Z M10 10 C14 14 14 16 10 20 C6 16 6 14 10 10Z M0 10 C4 6 6 6 10 10 C6 14 4 14 0 10Z M10 10 C14 6 16 6 20 10 C16 14 14 14 10 10Z"
            fill="none"
            stroke="#d9b465"
            strokeWidth="1.7"
          />
          <circle cx="10" cy="10" r="1.7" fill="#f3dc9a" />
          <circle cx="0" cy="0" r="1.2" fill="#b98c3a" />
          <circle cx="20" cy="20" r="1.2" fill="#b98c3a" />
        </pattern>
        <filter id={`${id}-emboss`}>
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#1d1203" floodOpacity=".6" />
        </filter>
      </defs>

      <rect width="200" height="640" fill={`url(#${id}-brass)`} />
      <rect x="10" y="10" width="180" height="620" fill={`url(#${id}-panel)`} />
      <rect x="14" y="14" width="172" height="612" fill="none" stroke={`url(#${id}-brass)`} strokeWidth="3" />

      <path d="M24 300 V130 Q24 50 100 34 Q176 50 176 130 V300 Z" fill={`url(#${id}-glow)`} className="jaali-glow" />
      <path d="M24 300 V130 Q24 50 100 34 Q176 50 176 130 V300 Z" fill={`url(#${id}-jaali)`} />
      <path d="M24 300 V130 Q24 50 100 34 Q176 50 176 130 V300 Z" fill="none" stroke={`url(#${id}-brass)`} strokeWidth="5" filter={`url(#${id}-emboss)`} />
      <path d="M34 300 V134 Q34 62 100 46 Q166 62 166 134 V300" fill="none" stroke="#f3dc9a" strokeOpacity=".5" strokeWidth="1" />

      <g transform="translate(100 360)" filter={`url(#${id}-emboss)`}>
        <circle r="44" fill={`url(#${id}-brass)`} />
        <circle r="36" fill={`url(#${id}-panel)`} />
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} transform={`rotate(${i * 30})`} d="M0 -32 C7 -22 7 -14 0 -8 C-7 -14 -7 -22 0 -32Z" fill={`url(#${id}-brass)`} />
        ))}
        <circle r="7" fill="#f3dc9a" />
      </g>

      {[424, 524].map((y) => (
        <g key={y} filter={`url(#${id}-emboss)`}>
          <rect x="30" y={y} width="140" height="86" rx="4" fill="none" stroke={`url(#${id}-brass)`} strokeWidth="4" />
          <rect x="40" y={y + 10} width="120" height="66" rx="2" fill="none" stroke="#f3dc9a" strokeOpacity=".45" />
          <g transform={`translate(100 ${y + 43})`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse key={i} transform={`rotate(${i * 45})`} cy="-14" rx="5" ry="11" fill={`url(#${id}-brass)`} />
            ))}
            <circle r="5" fill="#f3dc9a" />
          </g>
        </g>
      ))}

      {Array.from({ length: 24 }).map((_, i) => (
        <g key={i}>
          <circle cx="19" cy={33.5 + i * 25.5} r="3" fill="#1d1203" opacity=".5" />
          <circle cx="19" cy={32 + i * 25.5} r="3" fill="#f3dc9a" />
          <circle cx="181" cy={33.5 + i * 25.5} r="3" fill="#1d1203" opacity=".5" />
          <circle cx="181" cy={32 + i * 25.5} r="3" fill="#f3dc9a" />
        </g>
      ))}
      <g transform="translate(178 300)" filter={`url(#${id}-emboss)`}>
        <circle r="7" fill={`url(#${id}-brass)`} />
        <circle cy="18" r="14" fill="none" stroke={`url(#${id}-brass)`} strokeWidth="4" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Marble archway: inlay, garland, jasmine, rangoli, diyas             */
/* ------------------------------------------------------------------ */
function Rose({ x, y, s, tone }: { x: number; y: number; s: number; tone: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0 0 c ${s} -4 ${s * 1.4} 4 ${s * 1.9} 2 c -4 4 -12 4 -${s * 1.9} -2z`} fill="#3f6b2a" transform={`rotate(${(tone * 360) | 0})`} />
      <circle r={s} fill={tone > 0.66 ? "url(#ga-rose-red)" : tone > 0.33 ? "url(#ga-rose)" : "url(#ga-rose-ivory)"} />
      <path
        d={`M${-s * 0.5} 0 a ${s * 0.5} ${s * 0.5} 0 1 1 ${s * 0.6} ${s * 0.3} a ${s * 0.3} ${s * 0.3} 0 1 0 -${s * 0.2} -${s * 0.5}`}
        fill="none"
        stroke={tone > 0.66 ? "#6e0f22" : "#b98a92"}
        strokeWidth=".8"
      />
    </g>
  );
}

function Diya({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cy="-12" r="26" fill="url(#ga-diya-glow)" />
      <path d="M-12 0 Q-12 -7 0 -7 Q12 -7 12 0 Q6 5 0 5 Q-6 5 -12 0Z" fill="#a4501f" />
      <path d="M-12 0 Q0 -3 12 0" stroke="#e0a54a" strokeWidth="1" fill="none" />
      <ellipse cx="7" cy="-11" rx="2.6" ry="6" fill="#ffd36b" className="flame" />
      <ellipse cx="7" cy="-10" rx="1.2" ry="3" fill="#fffbe8" className="flame" />
    </g>
  );
}

function ArchFrame() {
  const r = seeded(23);
  const garland = alongArch(16).map(([x, y]) => ({ x: x + (r() - 0.5) * 6, y: y + (r() - 0.5) * 6, s: 8 + r() * 5, tone: r() }));
  const sideRoses = [262, 290, 318, 346].flatMap((y) => [
    { x: 36 + (r() - 0.5) * 4, y, s: 8 + r() * 3, tone: r() },
    { x: 414 + (r() - 0.5) * 4, y, s: 8 + r() * 3, tone: r() },
  ]);
  const cusps = alongArch(11);
  const strands = [0.22, 0.48, 0.74].flatMap((t) => [bez(L, t), bez(R, 1 - t)]);
  const veins = Array.from({ length: 9 }, () => {
    const x = r() * 450;
    const y = r() * 800;
    return `M${x} ${y} q ${20 + r() * 40} ${30 + r() * 50} ${-10 + r() * 60} ${80 + r() * 90}`;
  });

  return (
    <>
      <svg viewBox="0 0 450 800" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <style>{`.jasmine{animation:ga-sway 4.5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0}@keyframes ga-sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}`}</style>
        {/* hanging jasmine */}
      {strands.map(([x, y], i) => (
        <g key={i} className="jasmine" style={{ animationDelay: `${i * -0.7}s` }}>
          <path d={`M${x} ${y} v${110 + (i % 3) * 40}`} stroke="#5b7a2e" strokeWidth=".7" />
          {Array.from({ length: 12 + (i % 3) * 4 }).map((_, j) => (
            <circle key={j} cx={x + Math.sin(j * 1.3) * 1.6} cy={y + 8 + j * 9} r={3 - j * 0.07} fill="#fffaf2" stroke="#e8dcc6" strokeWidth=".4" />
          ))}
          <Rose x={x} y={y + 18 + (12 + (i % 3) * 4) * 9} s={5} tone={0.9} />
        </g>
      ))}
      </svg>

    <svg viewBox="0 0 450 800" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="ga-marble" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbf7f1" />
          <stop offset=".5" stopColor="#efe6da" />
          <stop offset="1" stopColor="#dccfbd" />
        </linearGradient>
        <linearGradient id="ga-step" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3ebe0" />
          <stop offset="1" stopColor="#c9b9a3" />
        </linearGradient>
        <radialGradient id="ga-rose" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".55" stopColor="#f6dfe0" />
          <stop offset="1" stopColor="#d9a5ad" />
        </radialGradient>
        <radialGradient id="ga-rose-red" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#e2566e" />
          <stop offset=".6" stopColor="#b01d39" />
          <stop offset="1" stopColor="#6e0f22" />
        </radialGradient>
        <radialGradient id="ga-rose-ivory" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset=".6" stopColor="#f3e3cc" />
          <stop offset="1" stopColor="#c9ab83" />
        </radialGradient>
        <radialGradient id="ga-diya-glow">
          <stop offset="0" stopColor="#ffd88a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <filter id="ga-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#2a0a00" floodOpacity=".55" />
        </filter>
      </defs>

      {/* marble wall with the arch cut out */}
      <path d={`M0 0H450V800H0Z ${OPENING}`} fillRule="evenodd" fill="url(#ga-marble)" filter="url(#ga-shadow)" />
      {veins.map((d, i) => (
        <path key={i} d={d} stroke="#b9a68e" strokeOpacity=".28" strokeWidth=".7" fill="none" />
      ))}

      {/* lintel */}
      <rect x="120" y="14" width="210" height="34" rx="3" fill="none" stroke="#c49a45" strokeWidth="1.2" />
      <text x="225" y="39" textAnchor="middle" fontFamily="var(--font-tiro)" fontSize="19" fill="#8c1c2e">
        ॥ शुभ विवाह ॥
      </text>

      {/* spandrel pietra-dura flowers */}
      {[
        [92, 96],
        [358, 96],
      ].map(([x, y], k) => (
        <g key={k} transform={`translate(${x} ${y})`}>
          <path d="M-36 14 C-20 -4 -6 4 0 0 C6 4 20 -4 36 14" stroke="#4f6b2a" strokeWidth="1.4" fill="none" />
          {[-26, 26].map((lx) => (
            <path key={lx} d={`M${lx} 8 c4 -8 12 -8 14 -2 c-6 4 -10 4 -14 2z`} fill="#4f6b2a" transform={lx > 0 ? `scale(-1 1) translate(${-2 * lx} 0)` : undefined} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse key={i} transform={`rotate(${i * 45})`} cy="-7" rx="3.4" ry="7" fill={i % 2 ? "#8c1c2e" : "#b02a3e"} />
          ))}
          <circle r="3.4" fill="#d4ab5a" />
        </g>
      ))}

      {/* inlaid pilasters */}
      {[0, 416].map((x) => (
        <g key={x}>
          <rect x={x + 6} y="250" width="22" height="520" fill="none" stroke="#c49a45" strokeWidth="1" />
          {Array.from({ length: 9 }).map((_, i) => (
            <g key={i} transform={`translate(${x + 17} ${280 + i * 56})`}>
              <path d="M0 -9 L6 0 L0 9 L-6 0Z" fill="#8c1c2e" />
              <circle r="2" fill="#d4ab5a" />
            </g>
          ))}
        </g>
      ))}

      {/* gilded rim + cusped (multifoil) edge */}
      <path d={OPENING} fill="none" stroke="#e9dcc6" strokeWidth="16" />
      <path d={OPENING} fill="none" stroke="#c49a45" strokeWidth="4" />
      <path d={OPENING} fill="none" stroke="#8c1c2e" strokeWidth="1" transform="translate(0 0)" />
      {cusps.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6.5" fill="#f4ede2" stroke="#c49a45" strokeWidth="1.2" />
      ))}

      {/* rose garland along the arch */}
      {[...garland, ...sideRoses].map((p, i) => (
        <Rose key={i} {...p} />
      ))}

      {/* threshold, rangoli & diyas */}
      <rect x="0" y="770" width="450" height="30" fill="url(#ga-step)" />
      <path d="M0 770 H450" stroke="#c49a45" strokeWidth="1.5" />
      <g transform="translate(225 786) scale(1 .34)">
        {Array.from({ length: 24 }).map((_, i) => (
          <circle key={`d${i}`} transform={`rotate(${i * 15})`} cy="-64" r="3" fill="#fff" />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <ellipse key={`g${i}`} transform={`rotate(${i * 22.5})`} cy="-46" rx="8" ry="14" fill={i % 2 ? "#2f7a3a" : "#e7b10f"} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={`p${i}`} transform={`rotate(${i * 30})`} cy="-28" rx="7" ry="12" fill={i % 2 ? "#d9486b" : "#f28c07"} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse key={`r${i}`} transform={`rotate(${i * 45})`} cy="-12" rx="5" ry="9" fill="#8c1c2e" />
        ))}
        <circle r="6" fill="#f6c026" />
      </g>
    </svg>

    <svg viewBox="0 0 450 800" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <style>{`.flame{animation:ga-fl 1.3s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}@keyframes ga-fl{0%,100%{transform:scale(1,1)}40%{transform:scale(.9,1.2)}70%{transform:scale(1.05,.92)}}`}</style>
      <defs>
        <radialGradient id="ga-diya-glow">
          <stop offset="0" stopColor="#ffd88a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Diya x={92} y={790} />
      <Diya x={150} y={792} s={0.85} />
      <Diya x={300} y={792} s={0.85} />
      <Diya x={358} y={790} />
    </svg>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Preloader                                                           */
/* ------------------------------------------------------------------ */
export function Preloader({ names }: { names: string }) {
  return (
    <motion.div
      key="preload"
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_42%,#6e1423_0%,#2a040b_55%,#12020a_100%)] px-6 text-center"
      exit={{ opacity: 0, scale: 1.12, filter: "blur(10px)" }}
      transition={{ duration: 0.9, ease: royal }}
    >
      <div className="relative grid size-60 place-items-center">
        <motion.div
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,200,110,.35),transparent_65%)]"
          animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <svg viewBox="-110 -110 220 220" className="absolute inset-0 h-full w-full" aria-hidden>
          <motion.circle r="100" fill="none" stroke="#d4ab5a" strokeWidth=".8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: "easeInOut" }} />
          <motion.circle r="94" fill="none" stroke="#d4ab5a" strokeOpacity=".5" strokeWidth=".5" strokeDasharray="1 4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} />
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.path
              key={i}
              d="M0 -54 C 12 -66 12 -80 0 -90 C -12 -80 -12 -66 0 -54Z"
              transform={`rotate(${i * 22.5})`}
              fill="none"
              stroke="#e3c27a"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.25 + i * 0.05, ease: "easeOut" }}
            />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.circle
              key={i}
              cy="-96"
              r="1.6"
              fill="#f3dc9a"
              transform={`rotate(${i * 22.5 + 11.25})`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 + i * 0.03 }}
            />
          ))}
          <motion.circle r="50" fill="none" stroke="#d4ab5a" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.4 }} />
        </svg>
        <motion.span
          className="text-foil-animated relative font-hindi text-7xl leading-none drop-shadow-[0_0_18px_rgba(255,200,110,.55)]"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: royal }}
        >
          ॐ
        </motion.span>
      </div>

      <motion.svg viewBox="-30 -30 60 40" className="-mt-2 w-16" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} aria-hidden>
        <circle cy="-12" r="16" fill="url(#pl-glow)" />
        <defs>
          <radialGradient id="pl-glow">
            <stop offset="0" stopColor="#ffd88a" stopOpacity=".9" />
            <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M-16 0 Q-16 -8 0 -8 Q16 -8 16 0 Q8 7 0 7 Q-8 7 -16 0Z" fill="#a4501f" />
        <motion.ellipse cx="9" cy="-14" rx="3" ry="7" fill="#ffd36b" animate={{ scaleY: [1, 1.25, 0.9, 1], scaleX: [1, 0.85, 1.05, 1] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ originY: 1 }} />
      </motion.svg>

      <motion.p className="mt-5 font-hindi text-3xl text-gold-200" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.9 }}>
        शुभ विवाह
      </motion.p>
      <motion.p className="mt-1 font-script text-4xl text-gold-100" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.9 }}>
        {names}
      </motion.p>
      <div className="mt-8 h-px w-40 overflow-hidden bg-gold-200/20">
        <motion.div className="h-full bg-gradient-to-r from-gold-600 via-gold-200 to-gold-600" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3, ease: "easeInOut" }} />
      </div>
      <motion.p className="eyebrow mt-3 text-[0.55rem] text-gold-200/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
        Preparing your invitation
      </motion.p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Seal (shared by both entries)                                       */
/* ------------------------------------------------------------------ */
export function SealButton({
  ref,
  initials,
  shown,
  ready,
  opening,
  appearDelay,
  onClick,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  initials: [string, string];
  shown: boolean;
  ready: boolean;
  opening: boolean;
  appearDelay: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={!ready}
      className="pointer-events-auto relative grid size-36 place-items-center outline-none"
      aria-label="Tap the seal to open the invitation"
      initial={{ scale: 0, opacity: 0 }}
      animate={shown ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 13, delay: shown && ready ? appearDelay : 0 }}
      whileHover={ready ? { scale: 1.06 } : undefined}
      whileTap={ready ? { scale: 0.93 } : undefined}
    >
      {ready && (
        <>
          <span className="absolute size-36 rounded-full border border-gold-200/80 animate-pulse-ring" />
          <span className="absolute size-36 rounded-full border border-gold-200/60 animate-pulse-ring [animation-delay:1.2s]" />
        </>
      )}
      <motion.svg
        viewBox="0 0 240 120"
        className="absolute w-64"
        aria-hidden
        animate={opening ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <defs>
          <linearGradient id="bow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffaf3" />
            <stop offset=".5" stopColor="#ecdcc8" />
            <stop offset="1" stopColor="#d4bc9f" />
          </linearGradient>
        </defs>
        <path d="M120 60 C90 20 40 10 30 40 C24 62 70 76 120 60Z" fill="url(#bow)" stroke="#c9ad8b" strokeWidth=".8" />
        <path d="M120 60 C150 20 200 10 210 40 C216 62 170 76 120 60Z" fill="url(#bow)" stroke="#c9ad8b" strokeWidth=".8" />
        <path d="M112 64 L86 118 L100 112 L108 120 L120 66Z" fill="url(#bow)" stroke="#c9ad8b" strokeWidth=".8" />
        <path d="M128 64 L154 118 L140 112 L132 120 L120 66Z" fill="url(#bow)" stroke="#c9ad8b" strokeWidth=".8" />
      </motion.svg>
      {/* seal cracks into two halves */}
      {(["l", "r"] as const).map((h) => (
        <motion.span
          key={h}
          className="absolute size-32"
          style={{ clipPath: h === "l" ? "polygon(0 0,52% 0,46% 30%,54% 55%,47% 78%,52% 100%,0 100%)" : "polygon(52% 0,100% 0,100% 100%,52% 100%,47% 78%,54% 55%,46% 30%)" }}
          animate={opening ? { x: h === "l" ? -70 : 70, y: 60, rotate: h === "l" ? -35 : 35, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeIn" }}
        >
          <WaxSeal a={initials[0]} b={initials[1]} className="size-full drop-shadow-2xl" />
        </motion.span>
      ))}
    </motion.button>
  );
}

/** Gold shards and wax crumbs bursting from the seal. */
export function burstFromSeal(el: HTMLElement | null) {
  const r = el?.getBoundingClientRect();
  if (!r) return;
  const origin = { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
  confetti({ particleCount: 80, spread: 360, startVelocity: 24, gravity: 0.9, ticks: 160, scalar: 0.8, shapes: ["square"], colors: ["#f3dc9a", "#d4ab5a", "#fff1c7", "#a37b2e"], origin, zIndex: 80 });
  confetti({ particleCount: 24, spread: 360, startVelocity: 14, gravity: 1.2, ticks: 120, scalar: 1.1, shapes: ["circle"], colors: ["#8c1c2e", "#b02a3e"], origin, zIndex: 80 });
}

/** Checks whether the rendered intro artwork (still + video) is actually available. */
function useArtStatus(art?: IntroArt) {
  const [status, setStatus] = useState<"checking" | "ready" | "missing">("checking");
  useEffect(() => {
    if (!art) return;
    let settled = false;
    let pending = 2;
    const finish = (ok: boolean) => {
      if (settled) return;
      if (!ok || --pending === 0) {
        settled = true;
        setStatus(ok ? "ready" : "missing");
      }
    };
    const img = new Image();
    img.onload = () => finish(true);
    img.onerror = () => finish(false);
    img.src = art.gateImage;
    const video = document.createElement("video");
    video.muted = true;
    video.preload = "auto";
    video.onloadeddata = () => finish(true);
    video.onerror = () => finish(false);
    video.src = art.gateVideo;
    const timeout = setTimeout(() => finish(false), 6000);
    return () => {
      settled = true;
      clearTimeout(timeout);
      video.removeAttribute("src");
    };
  }, [art]);
  return art ? status : "missing";
}

/* ------------------------------------------------------------------ */
/*  Velvet curtain                                                      */
/* ------------------------------------------------------------------ */
function Curtain({ side, stage, px, openPx }: { side: "left" | "right"; stage: Stage; px: MotionValue<number>; openPx: number }) {
  const left = side === "left";
  const x = stage === "preload" ? 0 : stage === "opening" ? (left ? "-105%" : "105%") : left ? -openPx : openPx;
  return (
    <motion.div className={`absolute inset-y-0 z-20 w-[56%] ${left ? "left-0" : "right-0"}`} style={{ x: px }}>
      <motion.div
        className="h-full w-full"
        initial={false}
        animate={{ x, skewY: stage === "gate" ? (left ? -1 : 1) : 0 }}
        transition={{ duration: stage === "opening" ? 1.6 : 2.2, ease: silk, delay: stage === "opening" ? 1.6 : 0.15 }}
        style={{
          transformOrigin: left ? "0% 0%" : "100% 0%",
          background:
            "repeating-linear-gradient(90deg,#3a0610 0%,#7a1527 4%,#9b2236 6%,#5f0f1e 9%,#2e040c 12%), linear-gradient(180deg,rgba(0,0,0,.35),transparent 30%,transparent 70%,rgba(0,0,0,.45))",
          backgroundBlendMode: "multiply",
          boxShadow: left ? "18px 0 40px rgba(0,0,0,.55)" : "-18px 0 40px rgba(0,0,0,.55)",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-6 bg-[repeating-linear-gradient(90deg,#d4ab5a_0_3px,#7c5b1f_3px_6px)] [mask:linear-gradient(to_bottom,#000_30%,transparent)]" />
        <div className="absolute inset-x-0 bottom-6 h-1.5 bg-foil" />
        <div className={`absolute top-[46%] ${left ? "right-3" : "left-3"} flex flex-col items-center`}>
          <span className="h-8 w-1 bg-foil" />
          <span className="size-5 rounded-full bg-foil shadow-md" />
          <span className="h-10 w-4 rounded-b-full bg-[repeating-linear-gradient(90deg,#d4ab5a_0_2px,#7c5b1f_2px_4px)]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  The gate                                                            */
/* ------------------------------------------------------------------ */
export function GateIntro({
  guest,
  initials,
  names,
  art,
  onOpenStart,
  onReveal,
  onDone,
}: {
  guest: string | null;
  initials: [string, string];
  names: string;
  /** Rendered artwork; when the files exist the video entry replaces the illustrated gate. */
  art?: IntroArt;
  /** Fires on the tap itself — start music here (needs the user gesture). */
  onOpenStart: () => void;
  /** Fires as the camera passes through the doors. */
  onReveal: () => void;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<Stage>("preload");
  const [minDone, setMinDone] = useState(false);
  const artStatus = useArtStatus(art);
  // The preloader stays up for its full sequence and until we know which entry to show.
  const stage: Stage = phase === "preload" && minDone && artStatus !== "checking" ? "gate" : phase;
  const sealRef = useRef<HTMLButtonElement>(null);

  // How far each curtain draws back: on phones a slim edge stays visible; on
  // wide screens the curtains stop exactly at the archway, draping it.
  const [curtainOpen, setCurtainOpen] = useState(0);
  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const frame = Math.min(w, window.innerHeight * 0.5625);
      const visible = Math.max(w * 0.08, (w - frame) / 2 + frame * 0.03);
      setCurtainOpen(w * 0.56 - visible);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Preloader → gate
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setMinDone(true), reduce ? 600 : 3300);
    return () => clearTimeout(t);
  }, []);

  // Tilt / pointer parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const curtainX = useTransform(sx, (v) => v * 18);
  const archX = useTransform(sx, (v) => v * -8);
  const archY = useTransform(sy, (v) => v * -6);
  const textX = useTransform(sx, (v) => v * 6);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      mx.set(Math.max(-1, Math.min(1, e.gamma / 25)));
      my.set(Math.max(-1, Math.min(1, (e.beta - 45) / 25)));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [mx, my]);

  const open = () => {
    if (stage !== "gate") return;
    setPhase("opening");
    onOpenStart();
    burstFromSeal(sealRef.current);
    setTimeout(onReveal, 2300);
    setTimeout(() => {
      setPhase("gone");
      onDone();
    }, 3500);
  };

  const skip = () => {
    onOpenStart();
    onReveal();
    setPhase("gone");
    onDone();
  };

  const opening = stage === "opening";
  const ready = stage === "gate";

  if (artStatus === "ready" && art && stage !== "preload") {
    return <CinematicGate guest={guest} initials={initials} names={names} art={art} onOpenStart={onOpenStart} onReveal={onReveal} onDone={onDone} />;
  }

  return (
    <AnimatePresence>
      {stage !== "gone" && (
        <motion.div key="gate" className="fixed inset-0 z-[60] overflow-hidden" exit={{ opacity: 0, transition: { duration: 0.5 } }} role="dialog" aria-label="Invitation cover">
          {/* palace wall behind everything on wide screens */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#5f0f1e,#22030a_75%)]"
            animate={{ opacity: opening ? 0 : 1 }}
            transition={{ duration: 1.2, delay: 1.8 }}
          />

          {/* camera: dollies forward through the doors */}
          <motion.div
            className="absolute inset-0 will-change-transform"
            initial={false}
            animate={opening ? { scale: 2.6, filter: "blur(5px)", opacity: 0 } : { scale: stage === "preload" ? 1.08 : 1, filter: "blur(0px)", opacity: 1 }}
            transition={opening ? { duration: 1.5, delay: 1.9, ease: [0.55, 0, 0.75, 0.2] } : { duration: 3, ease: royal }}
          >
            <motion.div className="absolute inset-y-0 left-1/2 w-[min(100vw,56.25dvh)] -translate-x-1/2" style={{ perspective: 1400 }}>
              {/* door leaves swing inward */}
              <div className="absolute top-[5%] right-[5%] bottom-[2.5%] left-[5%]">
                {(["left", "right"] as const).map((side) => (
                  <motion.div
                    key={side}
                    className={`absolute inset-y-0 w-1/2 overflow-hidden ${side === "left" ? "left-0" : "right-0"}`}
                    style={{ transformOrigin: side === "left" ? "0% 50%" : "100% 50%", willChange: "transform", backfaceVisibility: "hidden" }}
                    animate={{ rotateY: opening ? (side === "left" ? 112 : -112) : 0 }}
                    transition={{ duration: 2.2, delay: 0.7, ease: silk }}
                  >
                    <DoorLeaf side={side} />
                    <motion.div
                      className="absolute top-1/2 h-12 w-full -translate-y-1/2"
                      style={{
                        background: "linear-gradient(180deg,#f7eee4 0%,#fffaf3 30%,#e8d6c2 55%,#fbf3ea 75%,#d9c3aa 100%)",
                        boxShadow: "0 6px 14px rgba(40,10,0,.35)",
                        transformOrigin: side === "left" ? "0% 50%" : "100% 50%",
                      }}
                      animate={{ scaleX: opening ? 0 : 1 }}
                      transition={{ duration: 0.7, delay: 0.15, ease: "easeIn" }}
                    />
                    <motion.div className="absolute inset-0 bg-black" initial={{ opacity: 0 }} animate={{ opacity: opening ? 0.6 : 0 }} transition={{ duration: 2, delay: 0.8 }} />
                  </motion.div>
                ))}

                {/* light at the seam + god rays */}
                <motion.div
                  className="pointer-events-none absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-gradient-to-b from-gold-100/0 via-[#fff3cf] to-gold-100/0 shadow-[0_0_24px_8px_rgba(255,214,140,.55)]"
                  animate={{ opacity: opening ? [1, 1, 0] : [0.55, 0.9, 0.55], scaleX: opening ? [1, 40, 90] : 1 }}
                  transition={opening ? { duration: 1.6, delay: 0.4 } : { duration: 3, repeat: Infinity }}
                />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {[-18, -9, 0, 9, 18].map((deg, i) => (
                    <motion.div
                      key={deg}
                      className="absolute top-[-10%] left-1/2 h-[130%] w-[16%] -translate-x-1/2 bg-gradient-to-b from-[#ffe6a8]/40 via-[#ffcf7a]/10 to-transparent blur-md"
                      style={{ rotate: deg, transformOrigin: "50% 0%" }}
                      animate={{ opacity: opening ? 0.9 : [0.15, 0.45, 0.15] }}
                      transition={opening ? { duration: 0.8, delay: 0.4 } : { duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.5 }}
                    />
                  ))}
                </div>
              </div>

              <motion.div className="absolute inset-0" style={{ x: archX, y: archY }}>
                <ArchFrame />
              </motion.div>

              {stage !== "preload" && <GoldDust />}

              {/* invitation copy + seal */}
              <motion.div className="pointer-events-none absolute inset-0" style={{ x: textX }}>
                <motion.div
                  className="absolute top-[24%] left-1/2 w-[82%] max-w-sm -translate-x-1/2 px-2 text-center"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 14 }}
                  transition={{ duration: 1, delay: ready ? 1.4 : 0 }}
                >
                  <div className="rounded-2xl bg-maroon-900/60 px-5 py-4 shadow-2xl ring-1 ring-gold-300/35 backdrop-blur-md">
                    <p className="eyebrow text-[0.58rem] text-gold-200/90">{guest ? "An invitation for" : "You are cordially invited"}</p>
                    <p className="mt-1 font-script text-[2.4rem] leading-tight text-gold-100">{guest ?? "to our wedding"}</p>
                    <p className="mt-1 font-serif text-sm text-gold-100/75 italic">{names}</p>
                  </div>
                </motion.div>

                <div className="absolute top-[51.25%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <SealButton
                    ref={sealRef}
                    initials={initials}
                    shown={stage !== "preload"}
                    ready={ready}
                    opening={opening}
                    appearDelay={1.9}
                    onClick={open}
                  />
                </div>

                <motion.p
                  className="eyebrow absolute bottom-[11%] left-1/2 -translate-x-1/2 rounded-full bg-maroon-900/65 px-5 py-2.5 text-[0.62rem] whitespace-nowrap text-gold-100 ring-1 ring-gold-300/35 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={ready ? { opacity: [0.6, 1, 0.6] } : { opacity: 0 }}
                  transition={ready ? { duration: 2.4, repeat: Infinity, delay: 2.4 } : { duration: 0.3 }}
                >
                  Tap the seal to open
                </motion.p>
              </motion.div>
            </motion.div>

            <Curtain side="left" stage={stage} px={curtainX} openPx={curtainOpen} />
            <Curtain side="right" stage={stage} px={curtainX} openPx={curtainOpen} />
          </motion.div>

          {/* light floods out as the doors open */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#fff8e4_0%,rgba(255,214,140,.75)_28%,rgba(255,170,80,0)_70%)]"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={opening ? { opacity: [0, 0.95, 0], scale: [0.3, 1.4, 2] } : { opacity: 0 }}
            transition={{ duration: 3, delay: 0.6, times: [0, 0.6, 1] }}
          />

          <AnimatePresence>{stage === "preload" && <Preloader names={names} />}</AnimatePresence>

          {stage !== "opening" && (
            <button
              type="button"
              onClick={skip}
              className="eyebrow absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-50 rounded-full bg-black/35 px-4 py-2 text-[0.6rem] text-gold-100 ring-1 ring-gold-200/40 backdrop-blur"
            >
              Skip ›
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
