"use client";

/* eslint-disable @next/next/no-img-element -- the video's final frame, framed exactly like the intro */

import { motion } from "motion/react";
import type { Invite, OpeningVideo } from "@/content/invites/types";
import { LINEN, LinenBackdrop } from "./linen";
import { CardText, OPENING_ZOOM, OpeningFrame } from "./opening-scene";

/**
 * First slide after the filmed opening: the opened envelope and card from the
 * video's last frame, framed at the same zoom the intro ends on, with the
 * couple's details written on the card. Nothing here moves on scroll, which
 * keeps text perfectly steady on phones.
 */
export function CardHero({ invite, video, dateLine, revealed }: { invite: Invite; video: OpeningVideo; dateLine: string; revealed: boolean }) {
  return (
    <section id="home" className="relative grid h-[100svh] place-items-center overflow-hidden" style={{ background: LINEN }}>
      <LinenBackdrop />
      <OpeningFrame style={{ scale: OPENING_ZOOM }}>
        <img src={video.finalFrame} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <CardText
          card={video.card}
          partner1={invite.partner1.first}
          partner2={invite.partner2.first}
          dateLine={dateLine}
          city={invite.venue.city}
          visible
        />
      </OpeningFrame>

      <motion.a
        href="#invitation"
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[#5a4130]/70"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 1 }}
        aria-label="Scroll to the invitation"
      >
        <span className="eyebrow text-[0.55rem]">Scroll</span>
        <span className="relative h-9 w-px overflow-hidden bg-[#5a4130]/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-[#5a4130]/60"
            animate={{ y: [-16, 36] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
