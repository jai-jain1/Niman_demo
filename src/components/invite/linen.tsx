"use client";

import { createContext, useContext } from "react";
import { seeded } from "@/lib/invite-utils";

export type InviteThemeName = "royal" | "pearl";
export const InviteTheme = createContext<InviteThemeName>("royal");
export const useInviteTheme = () => useContext(InviteTheme);

/** Matches the linen the opening video is filmed on. */
export const LINEN = "#cbc5be";

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .26 0 0 0 .14 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

/** Soft, blurred branch shadows — like sunlight falling through leaves onto linen. */
function LeafShadows() {
  const r = seeded(31);
  const branches = [
    { x: -40, y: -30, a: 32, len: 520 },
    { x: 760, y: -60, a: 142, len: 560 },
    { x: 820, y: 640, a: 205, len: 420 },
  ];
  return (
    <svg viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" className="absolute -inset-[6%] h-[112%] w-[112%] animate-leaf blur-[14px]" aria-hidden>
      <g fill="#4f4338" opacity=".2">
        {branches.map((b, i) => {
          const rad = (b.a * Math.PI) / 180;
          const leaves = Array.from({ length: 22 }, (_, j) => {
            const t = j / 22;
            const px = b.x + Math.cos(rad) * b.len * t;
            const py = b.y + Math.sin(rad) * b.len * t;
            const side = j % 2 ? 1 : -1;
            const off = 24 + r() * 26;
            return {
              x: px + Math.cos(rad + side * 1.2) * off,
              y: py + Math.sin(rad + side * 1.2) * off,
              rot: b.a + side * (40 + r() * 30),
              s: 0.7 + r() * 0.8,
            };
          });
          return (
            <g key={i}>
              <path d={`M${b.x} ${b.y}L${b.x + Math.cos(rad) * b.len} ${b.y + Math.sin(rad) * b.len}`} stroke="#4f4338" strokeWidth="7" />
              {leaves.map((l, j) => (
                <ellipse key={j} cx={l.x} cy={l.y} rx={30 * l.s} ry={12 * l.s} transform={`rotate(${l.rot} ${l.x} ${l.y})`} />
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/** Linen backdrop shared by the opening (around the video) and the hero. */
export function LinenBackdrop({ color = LINEN, className = "" }: { color?: string; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} style={{ background: color }} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(255,252,246,.55),transparent_62%)]" />
      <LeafShadows />
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_55%,rgba(70,55,42,.18)_100%)]" />
    </div>
  );
}

/** A strand of pearls in varied sizes, like the one on the envelope. */
export function PearlStrand({ width = 320, sag = 18, count = 34, className = "" }: { width?: number; sag?: number; count?: number; className?: string }) {
  const r = seeded(count * 7 + width);
  const h = sag + 24;
  const pearls = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const x = 8 + t * (width - 16);
    const y = 10 + sag * 4 * t * (1 - t);
    const big = i % 5 === 2;
    return { x, y, r: big ? 5.2 : 2.6 + r() * 2, tone: big ? "gold" : r() > 0.72 ? "blush" : "ivory" };
  });
  return (
    <svg viewBox={`0 0 ${width} ${h}`} className={className} aria-hidden>
      <defs>
        <radialGradient id={`pearl-ivory-${width}`} cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".5" stopColor="#f3ece2" />
          <stop offset="1" stopColor="#c9bcae" />
        </radialGradient>
        <radialGradient id={`pearl-blush-${width}`} cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#fffaf6" />
          <stop offset=".55" stopColor="#ecd9cb" />
          <stop offset="1" stopColor="#bfa48f" />
        </radialGradient>
        <radialGradient id={`pearl-gold-${width}`} cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#fff4dc" />
          <stop offset=".5" stopColor="#d8bd8e" />
          <stop offset="1" stopColor="#8f7350" />
        </radialGradient>
      </defs>
      <path d={`M8 10Q${width / 2} ${10 + sag * 2} ${width - 8} 10`} fill="none" stroke="#bda98f" strokeWidth=".6" />
      {pearls.map((p, i) => (
        <g key={i}>
          <circle cx={p.x + 0.8} cy={p.y + 1.2} r={p.r} fill="#6b5847" opacity=".18" />
          <circle cx={p.x} cy={p.y} r={p.r} fill={`url(#pearl-${p.tone}-${width})`} />
        </g>
      ))}
    </svg>
  );
}

/** Cocoa wax seal with a pressed leaf sprig, matching the seal in the opening video. */
export function CocoaSeal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="cocoa-wax" cx=".38" cy=".32" r=".85">
          <stop offset="0" stopColor="#9a6a4f" />
          <stop offset=".55" stopColor="#6b4330" />
          <stop offset="1" stopColor="#3f261a" />
        </radialGradient>
        <filter id="cocoa-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="2" dy="5" stdDeviation="5" floodColor="#2a1a10" floodOpacity=".35" />
        </filter>
      </defs>
      <path
        filter="url(#cocoa-shadow)"
        fill="url(#cocoa-wax)"
        d="M100 10c13 0 17 9 28 11s20-4 28 6s0 18 6 28s17 11 17 25s-11 15-13 26s8 19 0 28s-19 4-28 10s-9 19-22 21s-17-9-28-9s-19 11-30 5s-6-17-13-24s-21-8-23-21s9-17 9-28s-11-17-6-28s19-6 26-13s4-19 17-24s19 7 32 7z"
      />
      <circle cx="100" cy="100" r="54" fill="none" stroke="#3a2318" strokeOpacity=".55" strokeWidth="2" />
      <circle cx="100" cy="100" r="54" fill="none" stroke="#b98d6c" strokeOpacity=".35" strokeWidth="1" transform="translate(-1 -1)" />
      <g stroke="#3a2318" strokeOpacity=".6" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M100 140V64" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M100 ${128 - i * 16}c-8-4-16-12-18-22`} />
            <path d={`M100 ${128 - i * 16}c8-4 16-12 18-22`} />
          </g>
        ))}
      </g>
      <path d="M62 66c10-14 26-20 42-18" stroke="#fff" strokeOpacity=".22" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
