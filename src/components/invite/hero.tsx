"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { IntroArt, Invite } from "@/content/invites/types";
import { formatDayNum, formatMonthShort, formatYear } from "@/lib/invite-utils";
import { PalaceScene } from "./palace-scene";

const SkyLanterns = dynamic(() => import("@/components/three/sky-lanterns"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

/** Loads an image in JS so a missing file is detected reliably (no hydration race). */
function useImageStatus(src?: string) {
  const [status, setStatus] = useState<{ src?: string; ok: boolean } | null>(null);
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setStatus({ src, ok: true });
    img.onerror = () => setStatus({ src, ok: false });
    img.src = src;
    return () => {
      img.onload = img.onerror = null;
    };
  }, [src]);
  if (!src) return "missing";
  return status?.src !== src ? "checking" : status.ok ? "ok" : "missing";
}

const LANDSCAPE = "(min-aspect-ratio: 1/1)";
function useLandscape() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(LANDSCAPE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(LANDSCAPE).matches,
    () => false,
  );
}

/**
 * The palace artwork (the gate video's last frame), the wide variant on
 * landscape screens, or the drawn palace when the artwork is missing.
 */
function HeroBackdrop({ art }: { art?: IntroArt }) {
  const portrait = useImageStatus(art?.palaceImage);
  const wide = useImageStatus(art?.palaceImageWide);
  const landscape = useLandscape();
  if (!art || portrait === "missing") return <PalaceScene className="h-full w-full" />;
  // The gate covers the hero while this resolves, so a plain night sky is enough.
  if (portrait === "checking") return <div className="h-full w-full bg-night-900" />;
  const src = landscape && wide === "ok" ? art.palaceImageWide : art.palaceImage;
  // eslint-disable-next-line @next/next/no-img-element -- client-chosen local artwork
  return <img src={src} alt="" className="h-full w-full object-cover" />;
}

export function Hero({ invite, revealed }: { invite: Invite; revealed: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: revealed ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.4, ease, delay },
  });

  const d = invite.weddingDate;

  return (
    <section ref={ref} id="home" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-night-900">
      <motion.div className="absolute inset-0 will-change-transform" style={{ scale: sceneScale, y: sceneY }}>
        <HeroBackdrop art={invite.intro} />
      </motion.div>
      {revealed && <SkyLanterns count={invite.intro ? 16 : 22} />}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_38%_at_50%_44%,rgba(5,10,30,.7),transparent_75%)]" />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-[12vh] text-center"
      >
        <motion.p {...show(0.2)} className="eyebrow text-gold-200/90">
          Together with their families
        </motion.p>
        <motion.h1 className="mt-4 flex flex-col items-center" aria-label={`${invite.partner1.first} weds ${invite.partner2.first}`}>
          <motion.span
            {...show(0.5)}
            className="text-foil-animated font-script text-[clamp(4.2rem,18vw,9rem)] leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,.45)]"
          >
            {invite.partner1.first}
          </motion.span>
          <motion.span {...show(0.9)} className="my-1 flex items-center gap-3 font-display text-sm tracking-[0.5em] text-gold-100">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-300" />
            WEDS
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-300" />
          </motion.span>
          <motion.span
            {...show(1.2)}
            className="text-foil-animated font-script text-[clamp(4.2rem,18vw,9rem)] leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,.45)]"
          >
            {invite.partner2.first}
          </motion.span>
        </motion.h1>
        <motion.div {...show(1.6)} className="mt-6 flex items-center gap-4 font-display text-gold-100">
          <span className="text-lg tracking-[0.3em]">{formatDayNum(d)}</span>
          <span className="size-1 rounded-full bg-gold-300" />
          <span className="text-lg tracking-[0.3em] uppercase">{formatMonthShort(d)}</span>
          <span className="size-1 rounded-full bg-gold-300" />
          <span className="text-lg tracking-[0.3em]">{formatYear(d)}</span>
        </motion.div>
        <motion.p {...show(1.8)} className="mt-2 font-serif text-lg text-gold-100/80 italic">
          {invite.venue.city}
        </motion.p>
      </motion.div>

      <motion.a
        href="#invitation"
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-gold-100/80"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 2.4, duration: 1 }}
        aria-label="Scroll to the invitation"
      >
        <span className="eyebrow text-[0.55rem]">Scroll</span>
        <span className="relative h-10 w-[1px] overflow-hidden bg-gold-100/25">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-gold-200"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
