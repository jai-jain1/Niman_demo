"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Invite } from "@/content/invites/types";
import { formatDayNum, formatMonthShort, formatYear } from "@/lib/invite-utils";
import { CocoaSeal, LinenBackdrop, PearlStrand } from "./linen";

const ease = [0.22, 1, 0.36, 1] as const;

const PAPER_GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .45 0 0 0 0 .38 0 0 0 0 .3 0 0 0 .07 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

/**
 * Hero for the Pearl & Linen theme: an ivory card resting on sunlit linen,
 * picking up where the opening video's final card leaves off.
 */
export function PearlHero({ invite, revealed }: { invite: Invite; revealed: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const d = invite.weddingDate;

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: revealed ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.2, ease, delay },
  });

  return (
    <section ref={ref} id="home" className="relative grid h-[100svh] min-h-[620px] place-items-center overflow-hidden">
      <LinenBackdrop />

      <motion.div style={{ y: cardY, opacity: fade }} className="relative w-[min(84vw,430px)]">
        <motion.div
          className="relative rounded-[6px] px-7 pt-16 pb-12 text-center shadow-[0_2px_3px_rgba(80,60,40,.12),0_30px_60px_-20px_rgba(70,50,30,.45)] sm:px-10"
          style={{ background: `${PAPER_GRAIN}, linear-gradient(160deg,#fcfaf6,#f3eee6)` }}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.4, ease }}
        >
          <div className="pointer-events-none absolute inset-3 rounded-[3px] border border-gold-400/50" />
          <div className="pointer-events-none absolute inset-[18px] rounded-[2px] border border-gold-300/40" />

          <motion.div
            className="absolute -top-10 left-1/2 w-24 -translate-x-1/2"
            initial={{ opacity: 0, scale: 1.4, rotate: -12 }}
            animate={revealed ? { opacity: 1, scale: 1, rotate: -6 } : {}}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.5 }}
          >
            <CocoaSeal className="w-full" />
          </motion.div>

          <motion.p {...show(0.6)} className="font-hindi text-sm text-gold-600">
            ॥ शुभ विवाह ॥
          </motion.p>
          <motion.p {...show(0.75)} className="eyebrow mt-3 text-[0.58rem] text-maroon-500/80">
            Together with their families
          </motion.p>

          <h1 className="mt-5 flex flex-col items-center" aria-label={`${invite.partner1.first} weds ${invite.partner2.first}`}>
            <motion.span {...show(0.95)} className="text-foil-deep font-script text-[clamp(3.4rem,15vw,5rem)] leading-[1]">
              {invite.partner1.first}
            </motion.span>
            <motion.span {...show(1.15)} className="my-2 flex items-center gap-3 font-display text-[0.7rem] tracking-[0.5em] text-gold-600">
              <PearlStrand width={70} sag={4} count={9} className="w-14" />
              WEDS
              <PearlStrand width={70} sag={4} count={9} className="w-14 -scale-x-100" />
            </motion.span>
            <motion.span {...show(1.35)} className="text-foil-deep font-script text-[clamp(3.4rem,15vw,5rem)] leading-[1]">
              {invite.partner2.first}
            </motion.span>
          </h1>

          <motion.div {...show(1.6)}>
            <PearlStrand width={300} sag={14} count={30} className="mx-auto mt-6 w-[86%]" />
          </motion.div>

          <motion.p {...show(1.75)} className="mt-4 font-display text-sm tracking-[0.35em] text-maroon-600">
            {formatDayNum(d)} · {formatMonthShort(d).toUpperCase()} · {formatYear(d)}
          </motion.p>
          <motion.p {...show(1.9)} className="mt-1 font-serif text-lg text-maroon-500/80 italic">
            {invite.venue.city}
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.a
        href="#invitation"
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-maroon-600/70"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 2.4, duration: 1 }}
        aria-label="Scroll to the invitation"
      >
        <span className="eyebrow text-[0.55rem]">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-maroon-600/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-maroon-600/60"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
