import type { EventTheme } from "@/content/invites/types";

/** Gold line-art illustration for each function. */
export function EventArt({ theme, className = "" }: { theme: EventTheme; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (theme) {
    case "mehndi":
      return (
        <svg viewBox="0 0 200 200" className={className} aria-hidden>
          <g {...common}>
            <path d="M70 186 V120 C62 110 52 96 48 84 C44 74 54 68 62 76 L72 92 V44 C72 34 86 34 86 44 V84 M86 84 V34 C86 24 100 24 100 34 V84 M100 84 V38 C100 28 114 28 114 38 V86 M114 86 V54 C114 44 128 44 128 54 V122 C128 150 116 166 116 186" />
            <circle cx="100" cy="130" r="18" />
            <circle cx="100" cy="130" r="10" strokeDasharray="2 3" />
            <circle cx="100" cy="130" r="3" fill="currentColor" />
            {Array.from({ length: 12 }).map((_, i) => (
              <path key={i} transform={`rotate(${i * 30} 100 130)`} d="M100 108 c4 -4 4 -8 0 -12 c-4 4 -4 8 0 12z" />
            ))}
            {[79, 93, 107, 121].map((x, i) => (
              <g key={x}>
                <circle cx={x} cy={44 - (i === 0 || i === 3 ? -6 : 0) + 6} r="3" />
                <path d={`M${x - 3} ${64} h6 M${x - 3} ${72} h6`} strokeDasharray="1 2" />
              </g>
            ))}
            <path d="M80 168 c10 -6 30 -6 40 0 M78 176 c12 -6 32 -6 44 0" />
            <path d="M150 60 l14 -28 l6 4 l-14 28 z M150 60 l-2 8 l6 -4" />
            <circle cx="40" cy="40" r="2" fill="currentColor" />
            <circle cx="160" cy="150" r="2" fill="currentColor" />
          </g>
        </svg>
      );
    case "haldi":
      return (
        <svg viewBox="0 0 200 200" className={className} aria-hidden>
          <g {...common}>
            <path d="M40 110 h120 c0 30 -26 52 -60 52 s-60 -22 -60 -52z" />
            <path d="M52 110 c0 -10 96 -10 96 0" />
            <path d="M70 162 l-6 14 h72 l-6 -14" />
            <path d="M60 120 c20 8 60 8 80 0" strokeDasharray="3 4" />
            {[70, 100, 130].map((x, i) => (
              <g key={x} transform={`translate(${x} ${96 - (i === 1 ? 10 : 0)})`}>
                {Array.from({ length: 10 }).map((_, j) => (
                  <path key={j} transform={`rotate(${j * 36})`} d="M0 0 c4 -4 4 -10 0 -14 c-4 4 -4 10 0 14z" />
                ))}
                <circle r="3" fill="currentColor" />
              </g>
            ))}
            <path d="M30 70 c10 -20 30 -26 40 -24 c-4 12 -20 24 -40 24z M30 70 l40 -24" />
            <path d="M170 70 c-10 -20 -30 -26 -40 -24 c4 12 20 24 40 24z M170 70 l-40 -24" />
            <path d="M100 40 v-14 M86 46 l-8 -10 M114 46 l8 -10" />
          </g>
        </svg>
      );
    case "sangeet":
      return (
        <svg viewBox="0 0 200 200" className={className} aria-hidden>
          <g {...common}>
            <ellipse cx="62" cy="130" rx="14" ry="28" />
            <ellipse cx="138" cy="130" rx="14" ry="28" />
            <path d="M62 102 h76 M62 158 h76" />
            {Array.from({ length: 8 }).map((_, i) => (
              <path key={i} d={`M${66 + i * 9.5} 103 L${70 + i * 9.5} 157`} strokeOpacity=".7" />
            ))}
            <path d="M58 100 l-14 -26 M142 100 l14 -26" />
            <path d="M120 40 v34 a8 6 0 1 1 -4 -5 V48 l22 -6 v26 a8 6 0 1 1 -4 -5 V46" />
            <path d="M60 46 v24 a7 5 0 1 1 -4 -4 V46 l10 -2" />
            {[[30, 30], [170, 30], [100, 24], [160, 92], [36, 96]].map(([x, y], i) => (
              <path key={i} transform={`translate(${x} ${y})`} d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2Z" />
            ))}
          </g>
        </svg>
      );
    case "wedding":
      return (
        <svg viewBox="0 0 200 200" className={className} aria-hidden>
          <g {...common}>
            <path d="M30 70 C30 40 70 20 100 14 C130 20 170 40 170 70Z" />
            <path d="M100 14 V4 M96 8 h8" />
            <path d="M24 70 h152 M28 78 h144" />
            <path d="M40 78 V170 M160 78 V170 M70 78 V170 M130 78 V170" />
            <path d="M40 90 c10 14 20 14 30 0 M130 90 c10 14 20 14 30 0" strokeDasharray="2 3" />
            <path d="M70 78 c10 22 50 22 60 0" strokeDasharray="2 3" />
            {[44, 56, 144, 156].map((x) => (
              <path key={x} d={`M${x} 78 v18`} strokeDasharray="1.5 3" />
            ))}
            <path d="M78 170 h44 l-6 -14 h-32z" />
            <path d="M100 154 c-8 -8 -6 -18 0 -26 c2 8 8 10 6 18 c4 -2 4 -6 4 -8 c4 6 2 14 -10 16z" fill="currentColor" fillOpacity=".25" />
            <path d="M22 170 h156 M30 178 h140" />
            <path d="M54 160 c0 -8 12 -8 12 0 v10 h-12z M134 160 c0 -8 12 -8 12 0 v10 h-12z" />
            <path d="M60 152 v-6 M140 152 v-6 M56 146 c2 -4 6 -4 8 0 M136 146 c2 -4 6 -4 8 0" />
          </g>
        </svg>
      );
    case "reception":
      return (
        <svg viewBox="0 0 200 200" className={className} aria-hidden>
          <g {...common}>
            <path d="M100 6 V30" />
            <path d="M60 46 C60 34 140 34 140 46 L130 60 H70Z" />
            <path d="M70 60 c0 14 60 14 60 0" />
            {[64, 82, 100, 118, 136].map((x, i) => (
              <g key={x}>
                <path d={`M${x} ${48 + (i % 2) * 4} v${22 + (i % 2) * 6}`} strokeDasharray="1 3" />
                <path d={`M${x} ${72 + (i % 2) * 10} l-3 5 l3 5 l3 -5z`} />
              </g>
            ))}
            <path d="M100 30 c-10 0 -16 6 -16 10 M100 30 c10 0 16 6 16 10" />
            <path d="M66 120 l10 44 M76 164 l-4 18 M64 182 h16 M58 120 h24 c0 14 -6 22 -12 22 s-12 -8 -12 -22z" transform="rotate(-12 70 150)" />
            <path d="M134 120 l-10 44 M124 164 l4 18 M120 182 h16 M118 120 h24 c0 14 -6 22 -12 22 s-12 -8 -12 -22z" transform="rotate(12 130 150)" />
            <path d="M92 112 l4 6 M108 112 l-4 6 M100 106 v8" />
            <circle cx="96" cy="128" r="1.6" fill="currentColor" />
            <circle cx="104" cy="132" r="1.2" fill="currentColor" />
            <circle cx="100" cy="122" r="1" fill="currentColor" />
          </g>
        </svg>
      );
  }
}

/** Soft, light cards for the Pearl & Linen theme — each function keeps a gentle tint. */
export const PEARL_THEMES: Record<EventTheme, { bg: string; ink: string; accent: string; art: string; chip: string }> = {
  mehndi: {
    bg: "bg-[linear-gradient(160deg,#f4f3ec,#e6e8db)]",
    ink: "text-[#3d4232]",
    accent: "text-[#5d6b47]",
    art: "text-[#7f8a68]/70",
    chip: "bg-white/60 ring-[#7f8a68]/30",
  },
  haldi: {
    bg: "bg-[linear-gradient(160deg,#fbf6e8,#f2e6c9)]",
    ink: "text-[#4a3b22]",
    accent: "text-[#9a7a3c]",
    art: "text-[#b3946b]/75",
    chip: "bg-white/60 ring-[#b3946b]/35",
  },
  sangeet: {
    bg: "bg-[linear-gradient(160deg,#f5f1f4,#e7e0e8)]",
    ink: "text-[#3d3340]",
    accent: "text-[#76627c]",
    art: "text-[#9a879f]/70",
    chip: "bg-white/60 ring-[#9a879f]/35",
  },
  wedding: {
    bg: "bg-[linear-gradient(160deg,#faf6f0,#ece2d4)]",
    ink: "text-[#3b2c23]",
    accent: "text-[#66402e]",
    art: "text-[#b3946b]/80",
    chip: "bg-white/65 ring-[#b3946b]/40",
  },
  reception: {
    bg: "bg-[linear-gradient(160deg,#f3eee8,#ddd3c7)]",
    ink: "text-[#33281f]",
    accent: "text-[#5a4130]",
    art: "text-[#8f7350]/75",
    chip: "bg-white/60 ring-[#8f7350]/35",
  },
};

export const THEMES: Record<EventTheme, { bg: string; ink: string; accent: string; art: string; chip: string }> = {
  mehndi: {
    bg: "bg-[radial-gradient(120%_80%_at_50%_0%,#7f9a45_0%,#4b6624_55%,#2f4416_100%)]",
    ink: "text-[#fbf6e4]",
    accent: "text-[#f3d9a0]",
    art: "text-[#f3e3b4]/80",
    chip: "bg-[#fbf6e4]/15 ring-[#f3e3b4]/30",
  },
  haldi: {
    bg: "bg-[radial-gradient(120%_80%_at_50%_0%,#ffd84d_0%,#f2b40c_50%,#d98a04_100%)]",
    ink: "text-[#4a2a03]",
    accent: "text-[#7a1527]",
    art: "text-[#7a4a05]/70",
    chip: "bg-white/35 ring-[#7a4a05]/25",
  },
  sangeet: {
    bg: "bg-[radial-gradient(120%_80%_at_50%_0%,#6a54b5_0%,#3b2d7a_55%,#1c1442_100%)]",
    ink: "text-[#f4efff]",
    accent: "text-[#e9cf87]",
    art: "text-[#e9cf87]/75",
    chip: "bg-white/10 ring-[#e9cf87]/30",
  },
  wedding: {
    bg: "bg-[radial-gradient(120%_80%_at_50%_0%,#b02a3e_0%,#7a1527_55%,#3e0710_100%)]",
    ink: "text-[#fff3e2]",
    accent: "text-[#efd9a0]",
    art: "text-[#efd9a0]/80",
    chip: "bg-white/10 ring-[#efd9a0]/35",
  },
  reception: {
    bg: "bg-[radial-gradient(120%_80%_at_50%_0%,#3a3530_0%,#1d1a17_60%,#0c0b0a_100%)]",
    ink: "text-[#f6eee2]",
    accent: "text-[#e3c27a]",
    art: "text-[#e3c27a]/80",
    chip: "bg-white/8 ring-[#e3c27a]/30",
  },
};
