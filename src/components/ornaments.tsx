import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/** Radial mandala built from rings of petals — used as slow-rotating backdrops. */
export function Mandala({ rings = 5, ...props }: P & { rings?: number }) {
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rings; r++) {
    const count = 8 + r * 4;
    const radius = 18 + r * 16;
    const len = 10 + r * 2.4;
    for (let i = 0; i < count; i++) {
      const a = (360 / count) * i + (r % 2 ? 180 / count : 0);
      out.push(
        <path
          key={`${r}-${i}`}
          d={`M0 ${-radius} q ${len * 0.45} ${-len * 0.55} 0 ${-len} q ${-len * 0.45} ${len * 0.45} 0 ${len}z`}
          transform={`rotate(${a})`}
        />,
      );
    }
    out.push(<circle key={`c${r}`} r={radius - 2} fill="none" strokeDasharray={r % 2 ? "1 3" : undefined} />);
  }
  return (
    <svg viewBox="-110 -110 220 220" fill="none" stroke="currentColor" strokeWidth={0.6} {...props}>
      {out}
      <circle r={10} />
      <circle r={4} fill="currentColor" />
    </svg>
  );
}

/** Thin gold rule with a lotus at its heart. */
export function LotusDivider({ className = "", ...props }: P) {
  return (
    <svg viewBox="0 0 320 40" fill="none" className={className} {...props}>
      <defs>
        <linearGradient id="ld-g" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.5" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 20h128M192 20h128" stroke="url(#ld-g)" strokeWidth="1" />
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M160 6c6 6 6 18 0 26c-6-8-6-20 0-26z" />
        <path d="M160 32c-4-9-12-14-22-14c3 9 11 14 22 14z" />
        <path d="M160 32c4-9 12-14 22-14c-3 9-11 14-22 14z" />
        <path d="M160 32c-8-4-18-4-26 0M160 32c8-4 18-4 26 0" />
        <circle cx="124" cy="20" r="2" fill="currentColor" />
        <circle cx="196" cy="20" r="2" fill="currentColor" />
        <circle cx="112" cy="20" r="1" fill="currentColor" />
        <circle cx="208" cy="20" r="1" fill="currentColor" />
      </g>
    </svg>
  );
}

/** Corner flourish — rotate/flip with classes for the other corners. */
export function CornerFlourish(props: P) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1" {...props}>
      <path d="M4 116V40C4 20 20 4 40 4h76" />
      <path d="M12 116V44c0-18 14-32 32-32h72" strokeOpacity=".5" />
      <path d="M22 60c10 0 18-8 18-18c-10 0-18 8-18 18zM60 22c0 10-8 18-18 18c0-10 8-18 18-18z" />
      <circle cx="40" cy="40" r="4" />
      <circle cx="40" cy="40" r="1.5" fill="currentColor" />
      <path d="M4 80c8 0 14 6 14 14M80 4c0 8 6 14 14 14" strokeOpacity=".7" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
    </svg>
  );
}

/** Hanging marigold toran — strands of alternating orange/yellow blooms with mango leaves. */
export function Toran({ strands = 13, className = "" }: { strands?: number; className?: string }) {
  const w = 600;
  const gap = w / (strands - 1);
  return (
    <svg viewBox={`0 0 ${w} 130`} className={className} preserveAspectRatio="xMidYMin slice" aria-hidden>
      <path d={`M0 6 Q ${w / 2} 26 ${w} 6`} stroke="#7c5b1f" strokeWidth="2" fill="none" />
      {Array.from({ length: strands }).map((_, i) => {
        const x = i * gap;
        const sag = 6 + 20 * (1 - Math.pow((x - w / 2) / (w / 2), 2));
        const len = i % 2 ? 5 : 7;
        return (
          <g key={i} transform={`translate(${x} ${sag})`}>
            {Array.from({ length: len }).map((__, j) => (
              <g key={j} transform={`translate(0 ${8 + j * 12})`}>
                <circle r="6" fill={j % 2 ? "#f6c026" : "#f28c07"} />
                <circle r="6" fill="url(#toran-shade)" />
                <circle r="1.6" fill="#b45309" opacity=".6" />
              </g>
            ))}
            {i % 2 === 0 && (
              <path
                d={`M0 ${14 + len * 12} c 6 6 6 16 0 22 c -6 -6 -6 -16 0 -22z`}
                fill="#3f6b2a"
                transform={`translate(0 -4)`}
              />
            )}
          </g>
        );
      })}
      <defs>
        <radialGradient id="toran-shade" cx=".35" cy=".35" r=".7">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset=".6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#7c2d12" stopOpacity=".35" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/** Wax seal with a monogram. */
export function WaxSeal({ a, b, className = "" }: { a: string; b: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="ws-body" cx=".38" cy=".32" r=".8">
          <stop offset="0" stopColor="#c23a4f" />
          <stop offset=".55" stopColor="#8c1c2e" />
          <stop offset="1" stopColor="#4a0a16" />
        </radialGradient>
        <radialGradient id="ws-inner" cx=".6" cy=".7" r=".7">
          <stop offset="0" stopColor="#6a1020" />
          <stop offset="1" stopColor="#9b2236" />
        </radialGradient>
        <filter id="ws-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#2a0007" floodOpacity=".45" />
        </filter>
      </defs>
      <path
        filter="url(#ws-shadow)"
        fill="url(#ws-body)"
        d="M100 8c14 0 18 10 30 12s22-4 30 6s0 20 6 30s18 12 18 26s-12 16-14 28s8 20 0 30s-20 4-30 10s-10 20-24 22s-18-10-30-10s-20 12-32 6s-6-18-14-26s-22-8-24-22s10-18 10-30s-12-18-6-30s20-6 28-14s4-20 18-26s20 8 34 8z"
      />
      <circle cx="100" cy="100" r="62" fill="url(#ws-inner)" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="#c4475b" strokeOpacity=".6" strokeWidth="2" />
      <circle cx="100" cy="100" r="54" fill="none" stroke="#3e0710" strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="2 4" />
      <text
        x="100"
        y="114"
        textAnchor="middle"
        fontFamily="var(--font-pinyon)"
        fontSize="46"
        fill="#e9c2c9"
        style={{ paintOrder: "stroke" }}
        stroke="#4a0a16"
        strokeWidth="1.2"
      >
        {a}
        <tspan fontSize="28" dy="-6" fontFamily="var(--font-cormorant)">&amp;</tspan>
        <tspan dy="6">{b}</tspan>
      </text>
      <path d="M58 70c10-14 28-22 46-20" stroke="#fff" strokeOpacity=".22" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Lucide-style line icons, kept local so the bundle stays tiny. */
const paths: Record<string, React.ReactNode> = {
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  plane: <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />,
  train: <><rect x="4" y="3" width="16" height="16" rx="2" /><path d="M4 11h16M12 3v8M8 19l-2 3M18 22l-2-3" /><circle cx="8" cy="15" r=".5" /><circle cx="16" cy="15" r=".5" /></>,
  hotel: <><path d="M2 20V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12M2 16h20M6 12h4" /><path d="M6 6V4h12v2" /></>,
  car: <><path d="M19 17h2v-4l-2-5H5L3 13v4h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M9 17h6" /></>,
  music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
  heart: <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />,
  home: <><path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>,
  sparkle: <path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  shirt: <path d="M20.4 6.6 16 4a4 4 0 0 1-8 0L3.6 6.6a1 1 0 0 0-.5 1.2l1.5 4a1 1 0 0 0 1.2.6L7 12v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9l1.2.4a1 1 0 0 0 1.2-.6l1.5-4a1 1 0 0 0-.5-1.2z" />,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  whatsapp: <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3zM9 8.5c0 4 2.5 6.5 6.5 6.5l1-1.6-2-1-1 1c-1.2-.5-2-1.3-2.5-2.5l1-1-1-2z" />,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>,
  copy: <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  volume: <><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></>,
  mute: <><path d="M11 5 6 9H2v6h4l5 4z" /><path d="m22 9-6 6M16 9l6 6" /></>,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" /></>,
  palette: <><circle cx="13.5" cy="6.5" r="1" /><circle cx="17.5" cy="10.5" r="1" /><circle cx="8.5" cy="7.5" r="1" /><circle cx="6.5" cy="12.5" r="1" /><path d="M12 2a10 10 0 0 0 0 20c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2A5.6 5.6 0 0 0 22 11c0-5-4.5-9-10-9z" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></>,
  chart: <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />,
  star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />,
};

export function Icon({ name, className = "size-4", ...props }: P & { name: keyof typeof paths | string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
