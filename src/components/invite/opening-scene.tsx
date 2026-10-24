"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { OpeningVideo } from "@/content/invites/types";
import { BouquetBottom, BouquetTop, Emboss, type EmbossPalette } from "./envelope-intro";
import { CocoaSeal, PearlStrand } from "./linen";

/** How far the camera moves into the card when the opening video ends. */
export const OPENING_ZOOM = 1.42;

const ease = [0.22, 1, 0.36, 1] as const;

/** Florals pressed into the card, toned to the paper in the video. */
const CARD_EMBOSS: EmbossPalette = {
  paper: "#d9d5cb",
  shadow: "rgba(92,80,64,.32)",
  highlight: "rgba(255,255,255,.6)",
  detail: "rgba(110,95,75,.35)",
};

/**
 * The 9:16 stage both the opening video and the first slide live in. It
 * covers phones edge to edge; on wide screens it is full height and its
 * edges dissolve into the matching linen. Sizes inside use container units
 * (cqw), so text scales with the stage exactly the same in both places.
 */
export function OpeningFrame({ className = "", style, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={`@container relative h-[max(100svh,177.78vw)] w-[max(100vw,56.25svh)] shrink-0 overflow-hidden md:h-svh md:w-[56.25svh] md:[mask-composite:intersect] md:[mask-image:linear-gradient(90deg,transparent,#000_11%,#000_89%,transparent),linear-gradient(transparent,#000_4%,#000_95%,transparent)] ${className}`}
      style={{ transformOrigin: "50% 54.5%", ...style }}
      {...props}
    />
  );
}

/**
 * The couple's details written onto the card the video ends on. `animate`
 * writes them in line by line; without it they render in their final state
 * (used by the first slide, which must match the last frame of the intro).
 */
export function CardText({
  card,
  partner1,
  partner2,
  dateLine,
  city,
  visible,
  animate = false,
}: {
  card: OpeningVideo["card"];
  partner1: string;
  partner2: string;
  dateLine: string;
  city: string;
  visible: boolean;
  animate?: boolean;
}) {
  const line = (delay: number) =>
    animate
      ? {
          initial: { opacity: 0, y: 10 },
          animate: visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
          transition: { duration: 0.9, delay: visible ? delay : 0, ease },
        }
      : {};

  return (
    <div
      className="pointer-events-none absolute text-center text-[#4a3326]"
      style={{
        left: `${(card.x - card.w / 2) * 100}%`,
        top: `${(card.y - card.h / 2) * 100}%`,
        width: `${card.w * 100}%`,
        height: `${card.h * 100}%`,
        opacity: animate ? undefined : visible ? 1 : 0,
      }}
    >
      <motion.div {...line(0)} className="absolute top-[3%] left-1/2 aspect-[240/170] w-[64%] -translate-x-1/2 opacity-80">
        <Emboss viewBox="0 0 240 170" palette={CARD_EMBOSS} className="inset-0 h-full w-full">
          <BouquetTop />
        </Emboss>
      </motion.div>
      <motion.div {...line(0.2)} className="absolute -bottom-[3%] left-1/2 aspect-[240/170] w-[46%] -translate-x-1/2 opacity-70">
        <Emboss viewBox="0 0 240 170" palette={CARD_EMBOSS} className="inset-0 h-full w-full">
          <BouquetBottom />
        </Emboss>
      </motion.div>

      <div className="absolute inset-x-[7%] top-[15.5%] flex flex-col items-center">
        <motion.div {...line(0.15)} className="w-[17cqw]">
          <CocoaSeal className="w-full" />
        </motion.div>
        <motion.p {...line(0.35)} className="mt-[1.2cqw] font-hindi text-[2.4cqw] text-[#8a6e4f]">
          ॥ शुभ विवाह ॥
        </motion.p>
        <motion.p {...line(0.5)} className="mt-[1cqw] font-display text-[1.45cqw] tracking-[0.32em] text-[#8a7458] uppercase">
          Together with their families
        </motion.p>
        <motion.p {...line(0.7)} className="mt-[2.4cqw] font-script text-[8.6cqw] leading-[1] text-[#55392b]">
          {partner1}
        </motion.p>
        <motion.div {...line(0.85)} className="my-[0.8cqw] flex items-center gap-[1.6cqw] font-display text-[1.5cqw] tracking-[0.45em] text-[#9b7c52]">
          <PearlStrand width={70} sag={4} count={9} className="w-[9cqw]" />
          WEDS
          <PearlStrand width={70} sag={4} count={9} className="w-[9cqw] -scale-x-100" />
        </motion.div>
        <motion.p {...line(1)} className="font-script text-[8.6cqw] leading-[1] text-[#55392b]">
          {partner2}
        </motion.p>
        <motion.div {...line(1.2)} className="mt-[2.2cqw] w-[78%]">
          <PearlStrand width={300} sag={12} count={28} className="w-full" />
        </motion.div>
        <motion.p {...line(1.35)} className="mt-[1.6cqw] font-display text-[2cqw] tracking-[0.34em] text-[#5a4130]">
          {dateLine}
        </motion.p>
        <motion.p {...line(1.5)} className="mt-[0.4cqw] font-serif text-[2.5cqw] text-[#7a6048] italic">
          {city}
        </motion.p>
      </div>
    </div>
  );
}
