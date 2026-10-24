"use client";

/* eslint-disable @next/next/no-img-element -- layered artwork needs plain <img> for onError fallbacks and absolute stacking */

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { IntroArt } from "@/content/invites/types";
import { Preloader, SealButton, burstFromSeal } from "./gate-intro";

const GoldDust = dynamic(() => import("@/components/three/gold-dust"), { ssr: false });

const royal = [0.22, 1, 0.36, 1] as const;
const accelerate = [0.55, 0, 0.75, 0.2] as const;

/**
 * Entry built on rendered artwork: the closed-gate still (the video's first
 * frame) waits behind the wax seal; on tap the gate-opening video plays and
 * its last frame — the palace — crossfades into the hero, which shows the
 * same image. Flowers, gold dust and the seal are live layers on top.
 */
export function CinematicGate({
  guest,
  initials,
  names,
  art,
  onOpenStart,
  onReveal,
  onDone,
}: {
  guest: string | null;
  initials: [string, string];
  names: string;
  art: IntroArt;
  onOpenStart: () => void;
  onReveal: () => void;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<"gate" | "opening" | "leaving">("gate");
  const [showPreloader, setShowPreloader] = useState(true);
  const [missing, setMissing] = useState<Record<string, boolean>>({});
  const video = useRef<HTMLVideoElement>(null);
  const seal = useRef<HTMLButtonElement>(null);
  const revealed = useRef(false);

  // Let the preloader (already on screen) play its exit over the gate.
  useEffect(() => {
    const id = requestAnimationFrame(() => setShowPreloader(false));
    return () => cancelAnimationFrame(id);
  }, []);

  // Pointer / tilt parallax: foreground flowers drift more than the gate.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const fgX = useTransform(sx, (v) => v * 16);
  const fgY = useTransform(sy, (v) => v * 10);
  const bgX = useTransform(sx, (v) => v * -6);
  const bgY = useTransform(sy, (v) => v * -4);
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

  const finished = useRef(false);
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  const reveal = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    onReveal();
    setPhase("leaving");
    // Unlock the page even if the exit fade never completes (e.g. a backgrounded tab).
    setTimeout(finish, 1600);
  }, [onReveal, finish]);

  // Safety net: never leave a guest stuck if the video stalls on a slow network.
  useEffect(() => {
    if (phase !== "opening") return;
    const d = video.current?.duration;
    const t = setTimeout(reveal, ((d && Number.isFinite(d) ? d : 8) + 2.5) * 1000);
    return () => clearTimeout(t);
  }, [phase, reveal]);

  const open = () => {
    if (phase !== "gate") return;
    setPhase("opening");
    onOpenStart();
    burstFromSeal(seal.current);
    const v = video.current;
    setTimeout(() => void v?.play().catch(reveal), 450);
  };

  const skip = () => {
    onOpenStart();
    reveal();
  };

  // Start the crossfade just before the video ends, so the hero takes over on the palace frame.
  const onTimeUpdate = () => {
    const v = video.current;
    if (v?.duration && v.currentTime >= v.duration - 1.2) reveal();
  };

  const hide = (key: string) => setMissing((m) => ({ ...m, [key]: true }));
  const opening = phase !== "gate";

  return (
    <AnimatePresence onExitComplete={finish}>
      {phase !== "leaving" && (
        <motion.div
          key="cinematic-gate"
          className="fixed inset-0 z-[60] overflow-hidden bg-maroon-900"
          exit={{ opacity: 0, transition: { duration: 1.3, ease: "easeInOut" } }}
          role="dialog"
          aria-label="Invitation cover"
        >
          {/* soft, blurred copy of the gate fills wide screens */}
          <img src={art.gateImage} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl brightness-50" />

          <motion.div
            className="absolute inset-y-0 left-1/2 w-[min(100vw,56.25dvh)] -translate-x-1/2 overflow-hidden shadow-[0_0_120px_rgba(0,0,0,.65)] will-change-transform"
            initial={{ scale: 1.14 }}
            animate={{ scale: 1 }}
            transition={{ duration: 3.4, ease: royal }}
          >
            <motion.div className="absolute -inset-3" style={{ x: bgX, y: bgY }}>
              <video
                ref={video}
                className="h-full w-full object-cover"
                poster={art.gateImage}
                src={art.gateVideo}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                onTimeUpdate={onTimeUpdate}
                onEnded={reveal}
              />
            </motion.div>

            {/* warm light breathing through the seam until the seal is broken */}
            <motion.div
              className="pointer-events-none absolute inset-y-[18%] left-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#fff0c8] to-transparent shadow-[0_0_28px_10px_rgba(255,210,130,.45)]"
              animate={opening ? { opacity: 0 } : { opacity: [0.25, 0.6, 0.25] }}
              transition={opening ? { duration: 0.4 } : { duration: 3.2, repeat: Infinity }}
            />

            {/* foreground florals part as the camera moves through */}
            {art.garland && !missing.garland && (
              <motion.div className="pointer-events-none absolute inset-x-[-4%] top-0" style={{ x: fgX, y: fgY }}>
                <motion.img
                  src={art.garland}
                  alt=""
                  onError={() => hide("garland")}
                  className="w-full drop-shadow-[0_12px_18px_rgba(0,0,0,.45)]"
                  animate={opening ? { y: "-75%", scale: 1.35, opacity: 0 } : { y: 0, scale: 1, opacity: 1 }}
                  transition={opening ? { duration: 2.4, delay: 0.7, ease: accelerate } : { duration: 0 }}
                />
              </motion.div>
            )}
            {(["left", "right"] as const).map((side) => {
              const src = side === "left" ? art.floralsLeft : art.floralsRight;
              const key = `florals-${side}`;
              if (!src || missing[key]) return null;
              const left = side === "left";
              return (
                <motion.div key={side} className={`pointer-events-none absolute bottom-[-2%] w-[58%] ${left ? "left-[-6%]" : "right-[-6%]"}`} style={{ x: fgX, y: fgY }}>
                  <motion.img
                    src={src}
                    alt=""
                    onError={() => hide(key)}
                    className="w-full drop-shadow-[0_-8px_18px_rgba(0,0,0,.4)]"
                    animate={opening ? { x: left ? "-70%" : "70%", y: "30%", scale: 1.45, opacity: 0 } : { x: 0, y: 0, scale: 1, opacity: 1 }}
                    transition={opening ? { duration: 2.2, delay: 0.8, ease: accelerate } : { duration: 0 }}
                  />
                </motion.div>
              );
            })}

            <GoldDust />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_45%,rgba(20,2,8,.55)_100%)]" />

            {/* guest greeting */}
            <motion.div
              className="pointer-events-none absolute top-[24%] left-1/2 w-[82%] max-w-sm -translate-x-1/2 px-2 text-center"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: opening ? 0 : 1, y: opening ? -10 : 0 }}
              transition={{ duration: opening ? 0.5 : 1.1, delay: opening ? 0 : 1.6 }}
            >
              <div className="rounded-2xl bg-maroon-900/55 px-5 py-4 shadow-2xl ring-1 ring-gold-300/35 backdrop-blur-md">
                <p className="eyebrow text-[0.58rem] text-gold-200/90">{guest ? "An invitation for" : "You are cordially invited"}</p>
                <p className="mt-1 font-script text-[2.4rem] leading-tight text-gold-100">{guest ?? "to our wedding"}</p>
                <p className="mt-1 font-serif text-sm text-gold-100/75 italic">{names}</p>
              </div>
            </motion.div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <SealButton ref={seal} initials={initials} shown ready={phase === "gate"} opening={opening} appearDelay={2} onClick={open} />
            </div>

            <motion.p
              className="eyebrow pointer-events-none absolute bottom-[11%] left-1/2 -translate-x-1/2 rounded-full bg-maroon-900/65 px-5 py-2.5 text-[0.62rem] whitespace-nowrap text-gold-100 ring-1 ring-gold-300/35 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={opening ? { opacity: 0 } : { opacity: [0.6, 1, 0.6] }}
              transition={opening ? { duration: 0.3 } : { duration: 2.4, repeat: Infinity, delay: 2.6 }}
            >
              Tap the seal to open
            </motion.p>
          </motion.div>

          {!opening && (
            <button
              type="button"
              onClick={skip}
              className="eyebrow absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-50 rounded-full bg-black/35 px-4 py-2 text-[0.6rem] text-gold-100 ring-1 ring-gold-200/40 backdrop-blur"
            >
              Skip ›
            </button>
          )}

          <AnimatePresence initial={false}>{showPreloader && <Preloader names={names} />}</AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
