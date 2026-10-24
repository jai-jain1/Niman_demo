import type { StoryChapter } from "@/content/invites/types";
import { seeded } from "@/lib/invite-utils";

/** Illustrated postcards for each chapter of the couple's story. */
export function StoryScene({ scene, className = "" }: { scene: StoryChapter["scene"]; className?: string }) {
  const r = seeded(scene.length * 31);
  return (
    <svg viewBox="0 0 300 200" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden>
      {scene === "city" && (
        <>
          <defs>
            <linearGradient id="sc-city" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3b2a5c" />
              <stop offset=".6" stopColor="#b5577a" />
              <stop offset="1" stopColor="#f2a27a" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" fill="url(#sc-city)" />
          {Array.from({ length: 16 }).map((_, i) => {
            const h = 40 + r() * 70;
            const x = i * 19;
            return (
              <g key={i}>
                <rect x={x} y={150 - h} width="17" height={h} fill="#2a1d45" />
                {Array.from({ length: Math.floor(h / 10) }).map((__, j) =>
                  r() > 0.45 ? <rect key={j} x={x + 3 + (j % 2) * 7} y={156 - h + j * 9} width="3" height="4" fill="#ffd27a" opacity=".85" /> : null,
                )}
              </g>
            );
          })}
          <path d="M0 150 H300 V200 H0Z" fill="#1d1533" />
          <path d="M40 150 L120 112 L200 150 M120 112 V150 M60 150 L120 120 L180 150" stroke="#e8c9d6" strokeWidth="1" fill="none" opacity=".7" />
          {Array.from({ length: 70 }).map((_, i) => {
            const x = r() * 300;
            const y = r() * 200;
            return <line key={i} x1={x} y1={y} x2={x - 4} y2={y + 12} stroke="#fff" strokeOpacity=".35" strokeWidth=".7" />;
          })}
          <g transform="translate(212 118)">
            <path d="M-34 0 a34 30 0 0 1 68 0 q-8.5 -6 -17 0 q-8.5 -6 -17 0 q-8.5 -6 -17 0 q-8.5 -6 -17 0z" fill="#c0182f" />
            <path d="M0 0 V46 q0 6 -6 6" stroke="#2a1d45" strokeWidth="2.4" fill="none" />
            <circle cx="-9" cy="22" r="6" fill="#2a1d45" />
            <path d="M-17 52 v-18 q8 -8 16 0 v18z" fill="#2a1d45" />
            <circle cx="11" cy="20" r="6.5" fill="#2a1d45" />
            <path d="M2 52 v-20 q9 -8 18 0 v20z" fill="#2a1d45" />
          </g>
        </>
      )}
      {scene === "mountains" && (
        <>
          <defs>
            <linearGradient id="sc-mtn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8fb7e0" />
              <stop offset="1" stopColor="#e9f1f7" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" fill="url(#sc-mtn)" />
          <circle cx="240" cy="40" r="16" fill="#fff6d6" />
          <path d="M-10 150 L60 50 L110 110 L160 40 L230 120 L270 70 L320 150Z" fill="#7d93b8" />
          <path d="M60 50 L75 72 L66 70 L58 80 L48 66Z M160 40 L178 66 L166 62 L158 74 L146 58Z M270 70 L282 86 L272 84 L262 90Z" fill="#fff" />
          <path d="M-10 170 L50 110 L120 160 L190 100 L260 150 L320 120 V200 H-10Z" fill="#4f6d8f" />
          <path d="M0 200 V168 Q150 140 300 172 V200Z" fill="#2f4a3a" />
          {Array.from({ length: 14 }).map((_, i) => {
            const x = i * 23 + r() * 8;
            const s = 0.7 + r() * 0.6;
            return <path key={i} transform={`translate(${x} ${175 - s * 6}) scale(${s})`} d="M0 -30 L10 -10 L5 -10 L13 4 L-13 4 L-5 -10 L-10 -10Z" fill="#1f3a2a" />;
          })}
          <path d="M120 190 l14 -16 l14 16z" fill="#c0182f" />
          <path d="M134 174 v16" stroke="#7a0f1f" />
        </>
      )}
      {scene === "beach" && (
        <>
          <defs>
            <linearGradient id="sc-beach" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6a46b" />
              <stop offset=".55" stopColor="#f7c98b" />
              <stop offset="1" stopColor="#fbe3b5" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" fill="url(#sc-beach)" />
          <circle cx="150" cy="120" r="34" fill="#ffefc2" />
          <rect y="118" width="300" height="40" fill="#3f7fa6" />
          {[124, 132, 140, 148].map((y, i) => (
            <path key={y} d={`M${60 + i * 6} ${y} h${180 - i * 12}`} stroke="#ffe6b0" strokeOpacity={0.6 - i * 0.1} strokeWidth="1.4" strokeDasharray="14 8" />
          ))}
          <path d="M0 158 Q150 146 300 160 V200 H0Z" fill="#efd3a2" />
          <g transform="translate(36 160)" fill="#3a2a1f">
            <path d="M0 0 C 2 -30 8 -60 18 -82 L22 -82 C 13 -60 7 -30 5 0Z" />
            <g transform="translate(20 -82)">
              {[-160, -120, -80, -40, 0, 30].map((a) => (
                <path key={a} transform={`rotate(${a})`} d="M0 0 C 10 -6 26 -6 40 4 C 26 0 12 2 0 3 Z" />
              ))}
            </g>
          </g>
          <g transform="translate(180 152)" fill="#3a2a1f">
            <circle cx="0" cy="-30" r="5" />
            <path d="M-6 0 v-20 q6 -6 12 0 v20z" />
            <circle cx="16" cy="-29" r="5" />
            <path d="M10 0 v-20 q6 -7 12 0 l2 20z" />
            <path d="M6 -16 h6" stroke="#3a2a1f" strokeWidth="2" />
          </g>
          <path d="M120 180 c -6 -8 4 -14 8 -6 c 4 -8 14 -2 8 6 l -8 8z" fill="none" stroke="#b07b45" strokeWidth="1.4" />
        </>
      )}
      {(scene === "lake" || scene === "palace") && (
        <>
          <defs>
            <linearGradient id="sc-lake" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f3b38a" />
              <stop offset=".5" stopColor="#f7d6a8" />
              <stop offset="1" stopColor="#fbe9cf" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" fill="url(#sc-lake)" />
          <circle cx="70" cy="70" r="20" fill="#fff4d8" opacity=".9" />
          <path d="M0 110 Q60 96 120 108 T300 104 V130 H0Z" fill="#c99a87" opacity=".6" />
          <g fill="#f5e6d3" stroke="#b98a6a" strokeWidth=".6">
            <rect x="90" y="96" width="140" height="34" />
            <rect x="140" y="80" width="40" height="18" />
            <path d="M146 80 c 0 -14 28 -14 28 0z" />
            {[100, 120, 200, 220].map((x) => (
              <path key={x} d={`M${x - 7} 96 c 0 -10 14 -10 14 0z`} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <path key={i} d={`M${96 + i * 11} 128 v-12 q4 -6 8 0 v12z`} fill="#e3c9a8" />
            ))}
          </g>
          <rect y="130" width="300" height="70" fill="#7aa3b8" />
          <g opacity=".35" transform="translate(0 260) scale(1 -1)">
            <rect x="90" y="96" width="140" height="34" fill="#f5e6d3" />
            <rect x="140" y="80" width="40" height="18" fill="#f5e6d3" />
          </g>
          {[140, 150, 162, 176].map((y, i) => (
            <path key={y} d={`M${30 + i * 20} ${y} h${80 - i * 8}`} stroke="#fff" strokeOpacity=".5" strokeWidth="1" />
          ))}
          <g transform="translate(210 168)">
            <path d="M-22 0 q22 10 44 0 l-4 6 h-36z" fill="#7a3b1f" />
            <path d="M0 0 v-22 l14 18z" fill="#fff4d8" />
          </g>
        </>
      )}
    </svg>
  );
}
