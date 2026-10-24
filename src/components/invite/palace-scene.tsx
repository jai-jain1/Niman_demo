import { seeded } from "@/lib/invite-utils";

/**
 * Moonlit lake palace, drawn entirely in SVG so it is crisp at every size and
 * weighs a few KB. 800×520 canvas, sliced to cover — the central palace stays
 * visible on narrow phones while desktops see the wings, palms and lake.
 */

const dome = (cx: number, base: number, w: number, h: number) =>
  `M${cx - w / 2} ${base} C${cx - w / 2} ${base - h * 0.55} ${cx - w * 0.18} ${base - h * 0.72} ${cx} ${base - h}
   C${cx + w * 0.18} ${base - h * 0.72} ${cx + w / 2} ${base - h * 0.55} ${cx + w / 2} ${base} Z`;

const arch = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y + h} V${y + h * 0.42} Q${x} ${y + h * 0.08} ${x + w / 2} ${y} Q${x + w} ${y + h * 0.08} ${x + w} ${y + h * 0.42} V${y + h} Z`;

function Chhatri({ cx, base, w }: { cx: number; base: number; w: number }) {
  const ph = w * 0.7;
  return (
    <g>
      <path d={dome(cx, base - ph, w, w * 0.85)} />
      <line x1={cx} y1={base - ph - w * 0.85} x2={cx} y2={base - ph - w * 1.15} className="finial" />
      <rect x={cx - w / 2 - 1.5} y={base - ph - 2} width={w + 3} height={3} />
      <rect x={cx - w / 2} y={base - ph} width={2.4} height={ph} />
      <rect x={cx + w / 2 - 2.4} y={base - ph} width={2.4} height={ph} />
      <rect x={cx - 1.2} y={base - ph} width={2.4} height={ph} />
      <rect x={cx - w / 2 - 2} y={base - 2} width={w + 4} height={3} />
    </g>
  );
}

function Windows({ x, y, w, h, n, gap, lit = 0.85, seed = 1 }: { x: number; y: number; w: number; h: number; n: number; gap: number; lit?: number; seed?: number }) {
  const r = seeded(seed);
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const on = r() < lit;
        return <path key={i} d={arch(x + i * (w + gap), y, w, h)} className={on ? "win" : "win-off"} />;
      })}
    </g>
  );
}

function Palace() {
  return (
    <g>
      {/* far wings */}
      <g className="far">
        <rect x="110" y="296" width="100" height="34" />
        <rect x="590" y="296" width="100" height="34" />
        <Chhatri cx={130} base={296} w={14} />
        <Chhatri cx={190} base={296} w={14} />
        <Chhatri cx={610} base={296} w={14} />
        <Chhatri cx={670} base={296} w={14} />
        <Windows x={120} y={306} w={7} h={14} n={8} gap={4.6} seed={3} lit={0.6} />
        <Windows x={600} y={306} w={7} h={14} n={8} gap={4.6} seed={4} lit={0.6} />
      </g>
      {/* wings */}
      <g className="mid">
        <rect x="200" y="278" width="110" height="52" />
        <rect x="490" y="278" width="110" height="52" />
        <rect x="196" y="274" width="118" height="5" />
        <rect x="486" y="274" width="118" height="5" />
        <Chhatri cx={214} base={274} w={18} />
        <Chhatri cx={255} base={274} w={22} />
        <Chhatri cx={296} base={274} w={18} />
        <Chhatri cx={504} base={274} w={18} />
        <Chhatri cx={545} base={274} w={22} />
        <Chhatri cx={586} base={274} w={18} />
        <Windows x={207} y={286} w={9} h={17} n={8} gap={4.4} seed={5} />
        <Windows x={207} y={309} w={9} h={15} n={8} gap={4.4} seed={6} lit={0.7} />
        <Windows x={497} y={286} w={9} h={17} n={8} gap={4.4} seed={7} />
        <Windows x={497} y={309} w={9} h={15} n={8} gap={4.4} seed={8} lit={0.7} />
      </g>
      {/* towers */}
      <g className="near">
        <rect x="306" y="222" width="30" height="108" />
        <rect x="464" y="222" width="30" height="108" />
        <rect x="302" y="218" width="38" height="5" />
        <rect x="460" y="218" width="38" height="5" />
        <Chhatri cx={321} base={218} w={24} />
        <Chhatri cx={479} base={218} w={24} />
        <Windows x={313} y={232} w={7} h={15} n={2} gap={2} seed={9} lit={1} />
        <Windows x={471} y={232} w={7} h={15} n={2} gap={2} seed={10} lit={1} />
        <Windows x={313} y={262} w={7} h={15} n={2} gap={2} seed={11} lit={1} />
        <Windows x={471} y={262} w={7} h={15} n={2} gap={2} seed={12} lit={1} />
        {/* central block */}
        <rect x="336" y="246" width="128" height="84" />
        <rect x="332" y="242" width="136" height="5" />
        <rect x="372" y="226" width="56" height="18" />
        <path d={dome(400, 228, 66, 62)} />
        <line x1="400" y1="166" x2="400" y2="150" className="finial" />
        <circle cx="400" cy="160" r="2.2" className="finial-dot" />
        <Chhatri cx={346} base={242} w={16} />
        <Chhatri cx={454} base={242} w={16} />
        {/* grand arch */}
        <path d={arch(384, 280, 32, 50)} className="win gate" />
        <Windows x={344} y={256} w={10} h={20} n={3} gap={3.5} seed={13} lit={1} />
        <Windows x={423} y={256} w={10} h={20} n={3} gap={3.5} seed={14} lit={1} />
        <Windows x={344} y={290} w={10} h={22} n={3} gap={3.5} seed={15} lit={1} />
        <Windows x={423} y={290} w={10} h={22} n={3} gap={3.5} seed={16} lit={1} />
        <Windows x={378} y={230} w={6} h={11} n={5} gap={3.6} seed={17} lit={1} />
      </g>
    </g>
  );
}

function Palm({ x, s = 1, flip = false }: { x: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} 330) scale(${flip ? -s : s} ${s})`} className="palm">
      <path d="M0 0 C 2 -30 6 -60 14 -88 L 18 -88 C 11 -60 7 -30 5 0 Z" />
      <g transform="translate(16 -88)">
        {[-160, -125, -95, -60, -25, 10, 35].map((a, i) => (
          <path key={i} transform={`rotate(${a})`} d="M0 0 C 10 -6 26 -6 40 4 C 26 0 12 2 0 3 Z" />
        ))}
      </g>
    </g>
  );
}

function Balustrade() {
  const balusters = Array.from({ length: 46 }, (_, i) => i * 18 - 4);
  return (
    <g>
      <defs>
        <linearGradient id="ps-marble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe6ee" />
          <stop offset="1" stopColor="#b9adc4" />
        </linearGradient>
        <linearGradient id="ps-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfc4d8" />
          <stop offset="1" stopColor="#7d7192" />
        </linearGradient>
        <linearGradient id="ps-rail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf4f6" />
          <stop offset="1" stopColor="#c8bccf" />
        </linearGradient>
      </defs>
      <rect x="0" y="470" width="800" height="50" fill="url(#ps-floor)" />
      <path d="M0 492 H800 M0 510 H800" stroke="#fff" strokeOpacity=".18" />
      <path d="M120 470 L60 520 M300 470 L280 520 M500 470 L520 520 M680 470 L740 520" stroke="#fff" strokeOpacity=".12" />
      <rect x="0" y="462" width="800" height="10" fill="url(#ps-rail)" />
      {balusters.map((x) => (
        <path
          key={x}
          fill="url(#ps-marble)"
          d={`M${x + 4} 462 h10 v3 c0 3 -3 4 -3 8 c0 6 5 9 5 15 c0 6 -3 8 -3 10 v2 h-11 v-2 c0 -2 -3 -4 -3 -10 c0 -6 5 -9 5 -15 c0 -4 -3 -5 -3 -8z`}
          transform="translate(0 -40)"
        />
      ))}
      <rect x="-4" y="414" width="808" height="10" rx="2" fill="url(#ps-rail)" />
      <rect x="-4" y="424" width="808" height="2" fill="#8b7f9c" opacity=".5" />
      {[290, 510, 110, 690].map((x, i) => (
        <g key={x} transform={`translate(${x} 414)`} className={i > 1 ? "desk-only" : undefined}>
          <circle r="26" cy="-14" fill="url(#ps-lamp-glow)" />
          <path d="M-7 0 h14 l-2 -4 h-10z" fill="#b48a3c" />
          <path d="M-6 -4 v-16 q6 -8 12 0 v16z" fill="#ffd27a" opacity=".9" />
          <path d="M-6 -4 v-16 q6 -8 12 0 v16z" fill="none" stroke="#9a7428" strokeWidth="1" />
          <path d="M0 -26 v-4" stroke="#9a7428" strokeWidth="1.2" />
          <ellipse cx="0" cy="-12" rx="2" ry="4" fill="#fff6d6" />
        </g>
      ))}
    </g>
  );
}

const SVG_PROPS = { viewBox: "0 0 800 520", preserveAspectRatio: "xMidYMid slice", "aria-hidden": true } as const;

/**
 * Static art and animated details live in separate SVGs: animating anything
 * inside an SVG repaints all of it, including the costly water filter.
 */
export function PalaceScene({ className = "", showBalcony = true }: { className?: string; showBalcony?: boolean }) {
  const r = seeded(42);
  const stars = Array.from({ length: 90 }, () => ({ x: r() * 800, y: r() * 260, s: 0.4 + r() * 1.3, d: r() * 4 }));

  return (
    <div className={`relative ${className}`}>
      <svg {...SVG_PROPS} className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="ps-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#050a1e" />
            <stop offset=".45" stopColor="#0f1f4d" />
            <stop offset=".72" stopColor="#24387a" />
            <stop offset=".9" stopColor="#4a4f8f" />
            <stop offset="1" stopColor="#7a5d8a" />
          </linearGradient>
          <radialGradient id="ps-moon" cx=".4" cy=".38" r=".7">
            <stop offset="0" stopColor="#fffdf3" />
            <stop offset=".7" stopColor="#e9e3d0" />
            <stop offset="1" stopColor="#c9c2ad" />
          </radialGradient>
          <radialGradient id="ps-moonglow">
            <stop offset="0" stopColor="#fff7dc" stopOpacity=".5" />
            <stop offset=".4" stopColor="#c8d4ff" stopOpacity=".14" />
            <stop offset="1" stopColor="#c8d4ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ps-horizon" cx=".5" cy="1" r=".6">
            <stop offset="0" stopColor="#ffb86b" stopOpacity=".45" />
            <stop offset="1" stopColor="#ffb86b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ps-lamp-glow">
            <stop offset="0" stopColor="#ffd88a" stopOpacity=".75" />
            <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ps-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a3470" />
            <stop offset=".5" stopColor="#141f4a" />
            <stop offset="1" stopColor="#070d26" />
          </linearGradient>
          <linearGradient id="ps-stone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a3a6e" />
            <stop offset="1" stopColor="#1a1c44" />
          </linearGradient>
          <filter id="ps-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ps-ripple">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.18" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="9" />
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
          <clipPath id="ps-water-clip">
            <rect x="0" y="330" width="800" height="190" />
          </clipPath>
        </defs>
        <style>{`
          .ps-palace .far{fill:#1b1f4a}
          .ps-palace .mid{fill:#23285a}
          .ps-palace .near{fill:url(#ps-stone)}
          .ps-palace path,.ps-palace rect{stroke:#e3c27a;stroke-opacity:.14;stroke-width:.6}
          .ps-palace .win{fill:#ffc86b;stroke:none}
          .ps-palace .win-off{fill:#2f3570;stroke:none}
          .ps-palace .gate{fill:#ffdf9e}
          .ps-palace .finial{stroke:#e3c27a;stroke-opacity:.8;stroke-width:1.4}
          .ps-palace .finial-dot{fill:#e3c27a}
          .ps-palace .palm path{fill:#0b1030;stroke:none}
          @media (max-width: 767px){.desk-only{display:none}}
        `}</style>

        <rect width="800" height="520" fill="url(#ps-sky)" />
        <rect width="800" height="340" fill="url(#ps-horizon)" />
        <circle cx="400" cy="92" r="120" fill="url(#ps-moonglow)" />
        <g>
          <circle cx="400" cy="92" r="34" fill="url(#ps-moon)" />
          <circle cx="390" cy="84" r="6" fill="#d6cfb9" opacity=".6" />
          <circle cx="412" cy="100" r="8" fill="#d6cfb9" opacity=".45" />
          <circle cx="398" cy="108" r="3.5" fill="#d6cfb9" opacity=".5" />
          <circle cx="416" cy="80" r="3" fill="#d6cfb9" opacity=".5" />
        </g>

        <g className="ps-palace">
          <Palm x={70} s={1.15} />
          <Palm x={100} s={0.85} flip />
          <Palm x={730} s={1.15} flip />
          <Palm x={700} s={0.85} />
          <Palace />
        </g>

        <rect x="0" y="330" width="800" height="190" fill="url(#ps-water)" />
        <g clipPath="url(#ps-water-clip)" opacity=".3">
          <g className="ps-palace" transform="translate(0 660) scale(1 -1)">
            <Palace />
          </g>
          <ellipse cx="400" cy="420" rx="14" ry="60" fill="#fff7dc" opacity=".35" />
        </g>

        {showBalcony && <Balustrade />}
      </svg>

      {/* animated details only — cheap to repaint */}
      <svg {...SVG_PROPS} className="absolute inset-0 h-full w-full">
        <style>{`
          .ps-shimmer{animation:ps-sh 5s ease-in-out infinite}
          @keyframes ps-sh{0%,100%{opacity:.15;transform:translateX(0)}50%{opacity:.45;transform:translateX(6px)}}
          .ps-flame{animation:ps-fl 1.6s ease-in-out infinite;transform-origin:center bottom;transform-box:fill-box}
          @keyframes ps-fl{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.25) translateY(-1px)}}
          @media (max-width: 767px){.desk-only{display:none}}
        `}</style>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff" opacity={0.35 + (s.d / 4) * 0.6} />
        ))}
        {[350, 362, 376, 392, 410].map((y, i) => (
          <path
            key={y}
            className="ps-shimmer"
            style={{ animationDelay: `${i * 0.7}s` }}
            d={`M${330 - i * 18} ${y} h${140 + i * 36}`}
            stroke="#ffd59a"
            strokeWidth=".8"
            strokeDasharray="10 7 3 9"
          />
        ))}
        {showBalcony &&
          [290, 510, 110, 690].map((x, i) => (
            <ellipse key={x} cx={x} cy={402} rx="2.4" ry="5" fill="#fff6d6" className={`ps-flame ${i > 1 ? "desk-only" : ""}`} />
          ))}
      </svg>
    </div>
  );
}
