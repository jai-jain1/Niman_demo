"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import type { Invite } from "@/content/invites/types";
import { Icon } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "./section-heading";

const ROUTE = "M180 92 C 30 170, 330 250, 180 300 S 40 400, 180 448";

function Gateway() {
  return (
    <svg viewBox="0 0 80 56" className="w-20 text-maroon-600" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <path d="M8 54V22h64v32M28 54V36a12 12 0 0 1 24 0v18M8 22l4-6h56l4 6M14 16V10h52v6M10 54h60" />
      <path d="M14 30h8v12h-8zM58 30h8v12h-8z" />
      <path d="M20 10c0-4 4-6 4-6s4 2 4 6M52 10c0-4 4-6 4-6s4 2 4 6M36 10c0-5 4-8 4-8s4 3 4 8" />
    </svg>
  );
}

function CityPalace() {
  return (
    <svg viewBox="0 0 80 56" className="w-20 text-maroon-600" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <path d="M4 54h72M8 54V30h64v24M28 30V20h24v10M30 20c0-10 20-10 20 0M40 10V6" />
      <path d="M10 30c0-6 8-6 8 0M62 30c0-6 8-6 8 0M14 24v6M66 24v6" />
      {Array.from({ length: 7 }).map((_, i) => (
        <path key={i} d={`M${13 + i * 9} 54v-10a3 3 0 0 1 6 0v10`} />
      ))}
    </svg>
  );
}

export function Journey({ invite }: { invite: Invite }) {
  const section = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });
  const x = useMotionValue(180);
  const y = useMotionValue(92);
  const rotate = useMotionValue(90);

  const place = (p: number) => {
    const el = path.current;
    if (!el) return;
    const len = el.getTotalLength();
    const at = Math.min(Math.max(p, 0), 1) * len;
    const a = el.getPointAtLength(at);
    const b = el.getPointAtLength(Math.min(at + 1, len));
    x.set(a.x);
    y.set(a.y);
    rotate.set((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 45);
  };
  useMotionValueEvent(progress, "change", place);
  useEffect(() => place(0), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="journey" className="relative overflow-hidden bg-gradient-to-b from-ivory to-paper py-24">
      <SectionHeading eyebrow="The wedding express" title="Our Journey" />
      <Reveal className="mx-auto mt-4 max-w-md px-6 text-center font-serif text-xl text-ink/70 italic">
        From the city that brought us together to the city where we say forever.
      </Reveal>

      <div ref={section} className="relative mx-auto mt-10 w-full max-w-[420px] px-4">
        <svg viewBox="0 0 360 540" className="w-full" aria-hidden>
          <path d={ROUTE} fill="none" stroke="#d4ab5a" strokeOpacity=".35" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
          <motion.path
            ref={path}
            d={ROUTE}
            fill="none"
            stroke="url(#jr-grad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            style={{ pathLength: progress }}
          />
          <defs>
            <linearGradient id="jr-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c49a45" />
              <stop offset="1" stopColor="#8c1c2e" />
            </linearGradient>
          </defs>
          <circle cx="180" cy="92" r="6" fill="#fbf6ee" stroke="#c49a45" strokeWidth="2" />
          <circle cx="180" cy="448" r="6" fill="#8c1c2e" stroke="#fbf6ee" strokeWidth="2" />
          <motion.g style={{ x, y, rotate }}>
            <circle r="18" fill="#fbf6ee" stroke="#d4ab5a" strokeWidth="1" />
            <g transform="translate(-10 -10) scale(.84)" fill="none" stroke="#8c1c2e" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </g>
          </motion.g>
        </svg>

        <div className="absolute top-0 left-0 right-0 flex flex-col items-center text-center">
          <Gateway />
          <p className="font-display text-3xl tracking-[0.15em] text-maroon-600">{invite.from.code}</p>
        </div>
        <div className="absolute top-[13%] left-4 text-left">
          <p className="font-serif text-lg font-semibold text-ink/80">{invite.from.city}</p>
          <p className="eyebrow text-[0.55rem] text-gold-700">{invite.from.state}</p>
        </div>
        <div className="absolute right-0 bottom-0 left-0 flex flex-col items-center text-center">
          <p className="font-display text-3xl tracking-[0.15em] text-maroon-600">{invite.to.code}</p>
          <CityPalace />
        </div>
        <div className="absolute right-4 bottom-[13%] text-right">
          <p className="font-serif text-lg font-semibold text-ink/80">{invite.to.city}</p>
          <p className="eyebrow text-[0.55rem] text-gold-700">{invite.to.state}</p>
        </div>
        <div className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm ring-1 ring-gold-300/50 backdrop-blur">
          <span className="flex items-center gap-1.5 eyebrow text-[0.55rem] text-maroon-600">
            <Icon name="plane" className="size-3" /> {invite.from.date} → {invite.to.date}
          </span>
        </div>
      </div>
    </section>
  );
}
