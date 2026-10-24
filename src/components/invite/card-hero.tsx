"use client";

/* eslint-disable @next/next/no-img-element -- the video's final frame, framed exactly like the intro */

import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Invite, OpeningVideo } from "@/content/invites/types";
import { seeded } from "@/lib/invite-utils";
import { CocoaSeal, LeafShadows, LINEN, LinenBackdrop } from "./linen";
import { CardText, FoilName, OPENING_ZOOM, OpeningFrame } from "./opening-scene";

const WaxSeal3D = dynamic(() => import("@/components/three/wax-seal-3d"), { ssr: false });

const r = seeded(77);
const MOTES = Array.from({ length: 26 }, () => ({
  left: 8 + r() * 84,
  top: 35 + r() * 60,
  size: 2 + r() * 3.5,
  delay: r() * 8,
  dur: 6 + r() * 5,
  dx: -30 + r() * 60,
}));

/**
 * First slide after the filmed opening: the opened envelope and card from the
 * video's last frame, at the zoom the intro ends on — brought to life with a
 * real 3D cocoa wax seal, shimmering gold-foil names, drifting dappled
 * sunlight, a sweeping sunbeam, floating gold dust and a gentle tilt that
 * follows the phone. Nothing moves on scroll, so text stays steady on phones.
 */
export function CardHero({ invite, video, dateLine, revealed }: { invite: Invite; video: OpeningVideo; dateLine: string; revealed: boolean }) {
  const section = useRef<HTMLElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  const [sealReady, setSealReady] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "80px" });
    if (section.current) io.observe(section.current);
    return () => io.disconnect();
  }, []);

  // Tilt with the pointer or the phone, like holding a real card.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 16 });
  const sy = useSpring(my, { stiffness: 50, damping: 16 });
  const rotateY = useTransform(sx, (v) => v * 4);
  const rotateX = useTransform(sy, (v) => v * -3.5);
  const lightX = useTransform(sx, (v) => `${50 + v * 18}%`);
  const lightY = useTransform(sy, (v) => `${40 + v * 14}%`);
  const glare = useTransform([lightX, lightY], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,246,226,.38), transparent 46%)`);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      mx.set(Math.max(-1, Math.min(1, e.gamma / 25)));
      my.set(Math.max(-1, Math.min(1, (e.beta - 45) / 25)));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [mx, my]);

  const initials: [string, string] = [invite.partner1.first[0], invite.partner2.first[0]];

  return (
    <section
      ref={section}
      id="home"
      className="relative grid h-[100svh] place-items-center overflow-hidden"
      style={{ background: LINEN, perspective: 1400 }}
    >
      <LinenBackdrop />

      <motion.div className="relative will-change-transform" style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        <OpeningFrame style={{ scale: OPENING_ZOOM }}>
          <img src={video.finalFrame} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />

          {/* dappled sunlight drifting across the card, like the light in the video */}
          <div className="pointer-events-none absolute inset-0 opacity-55">
            <LeafShadows />
          </div>

          <CardText
            card={video.card}
            partner1={invite.partner1.first}
            partner2={invite.partner2.first}
            dateLine={dateLine}
            city={invite.venue.city}
            visible
            seal={
              <>
                <motion.div className="absolute inset-0" animate={{ opacity: sealReady ? 0 : 1 }} transition={{ duration: 0.6 }}>
                  <CocoaSeal className="w-full" />
                </motion.div>
                <div className="absolute -inset-[22%]">
                  <WaxSeal3D
                    initials={initials}
                    cracked={false}
                    widthRatio={0.64}
                    wax="#5a3322"
                    dust={false}
                    paused={!onScreen}
                    onReady={() => setSealReady(true)}
                  />
                </div>
              </>
            }
            renderName={(name, i) => <FoilName name={name} delay={i * 0.6} />}
          />

          {/* a warm sunbeam sweeping across the card */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-[10%] left-0 h-[120%] w-[38%] animate-sunbeam bg-gradient-to-r from-transparent via-[rgba(255,243,216,.42)] to-transparent" />
          </div>
        </OpeningFrame>

        {/* soft glare that follows the tilt */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: glare }} />
      </motion.div>

      {/* gold dust floating in the light */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="absolute animate-mote rounded-full bg-[radial-gradient(circle,#fff6dc,#e3c78f_55%,transparent_70%)]"
            style={
              {
                left: `${m.left}%`,
                top: `${m.top}%`,
                width: m.size * 2,
                height: m.size * 2,
                animationDelay: `${m.delay}s`,
                animationDuration: `${m.dur}s`,
                "--mote-dx": `${m.dx}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

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
