"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { OpeningVideo } from "@/content/invites/types";

const royal = [0.22, 1, 0.36, 1] as const;
const noopSubscribe = () => () => {};

/**
 * Opening built on a filmed envelope: the first frame waits for a tap on the
 * seal, the clip plays, and the couple's names are written onto the blank
 * card it ends on before the invite opens into the palace.
 */
export function VideoIntro({
  guest,
  names,
  dateLine,
  video,
  onOpenStart,
  onReveal,
  onDone,
  onFail,
}: {
  guest: string | null;
  names: string;
  dateLine: string;
  video: OpeningVideo;
  onOpenStart: () => void;
  onReveal: () => void;
  onDone: () => void;
  /** Called if the clip can't load, so the parent can fall back to another opening. */
  onFail: () => void;
}) {
  const [phase, setPhase] = useState<"closed" | "playing" | "card" | "leaving">("closed");
  const el = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const atCard = useRef(false);
  // Render the <video> only on the client so its error handler is attached before it loads.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  const leave = useCallback(() => {
    onReveal();
    setPhase("leaving");
    // Unlock the page even if the exit fade never completes (e.g. a backgrounded tab).
    setTimeout(finish, 1400);
  }, [onReveal, finish]);

  const showCard = useCallback(() => {
    if (atCard.current) return;
    atCard.current = true;
    setPhase("card");
    setTimeout(leave, 2800);
  }, [leave]);

  const open = () => {
    if (phase !== "closed") return;
    setPhase("playing");
    onOpenStart();
    navigator.vibrate?.(15);
    const v = el.current;
    if (!v) return showCard();
    v.play().catch(showCard);
    // Safety net if the clip stalls on a slow connection.
    setTimeout(showCard, ((Number.isFinite(v.duration) ? v.duration : 6) + 3) * 1000);
  };

  const skip = () => {
    onOpenStart();
    leave();
  };

  const closed = phase === "closed";
  const { seal, card } = video;

  return (
    <AnimatePresence onExitComplete={finish}>
      {phase !== "leaving" && (
        <motion.div
          key="video-intro"
          className="fixed inset-0 z-[60] grid place-items-center overflow-hidden bg-[#e9e3da]"
          exit={{ opacity: 0, transition: { duration: 1.1, ease: "easeInOut" } }}
          role="dialog"
          aria-label="Invitation envelope"
        >
          {/* soft, blurred copy of the scene for wide screens */}
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative backdrop */}
          <img src={video.poster} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl" />

          {/* 9:16 frame: covers phones edge to edge, sits as a card on wide screens */}
          <motion.div
            className="relative h-[max(100dvh,177.78vw)] w-[max(100vw,56.25dvh)] shrink-0 overflow-hidden md:h-[94dvh] md:w-[52.875dvh] md:rounded-[28px] md:shadow-[0_40px_90px_rgba(60,40,20,.35)]"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: royal }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- first frame, shown instantly */}
            <img src={video.poster} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
            {mounted && (
              <video
                ref={el}
                className="absolute inset-0 h-full w-full object-cover"
                src={video.src}
                poster={video.poster}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                onError={onFail}
                onEnded={showCard}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration && v.currentTime >= v.duration - 0.15) showCard();
                }}
              />
            )}

            {/* greeting in the blank space above the pearls */}
            <motion.div
              className="pointer-events-none absolute left-1/2 w-[62%] -translate-x-1/2 text-center"
              style={{ top: `${(seal.y - 0.26) * 100}%` }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: closed ? 1 : 0, y: 0 }}
              transition={{ duration: closed ? 1.1 : 0.4, delay: closed ? 0.8 : 0 }}
            >
              <p className="eyebrow text-[0.55rem] text-[#9c8466]">{guest ? "Specially for" : "You are invited"}</p>
              <p className="text-foil-deep mt-1 font-script text-[clamp(1.9rem,8vw,2.6rem)] leading-tight">{guest ?? names}</p>
            </motion.div>

            {/* the names written onto the blank card the clip ends on */}
            <motion.div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${card.x * 100}%`, top: `${card.y * 100}%`, width: `${card.w * 100}%` }}
              initial={{ opacity: 0 }}
              animate={phase === "card" ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, ease: royal }}
            >
              <motion.p
                className="font-hindi text-sm text-[#a08055]"
                initial={{ y: 10, opacity: 0 }}
                animate={phase === "card" ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.1 }}
              >
                ॥ शुभ विवाह ॥
              </motion.p>
              <motion.p
                className="text-foil-deep mt-3 font-script text-[clamp(2.4rem,10vw,3.4rem)] leading-[1.05]"
                initial={{ y: 14, opacity: 0, filter: "blur(4px)" }}
                animate={phase === "card" ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 1.1, delay: 0.3, ease: royal }}
              >
                {names}
              </motion.p>
              <motion.div
                className="mx-auto my-4 h-px w-20 bg-gradient-to-r from-transparent via-[#c99a45] to-transparent"
                initial={{ scaleX: 0 }}
                animate={phase === "card" ? { scaleX: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.8 }}
              />
              <motion.p
                className="eyebrow text-[0.58rem] text-[#8a7458]"
                initial={{ opacity: 0 }}
                animate={phase === "card" ? { opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 1 }}
              >
                are getting married
              </motion.p>
              <motion.p
                className="mt-2 font-display text-xs tracking-[0.3em] text-[#6b5536] uppercase"
                initial={{ opacity: 0 }}
                animate={phase === "card" ? { opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 1.2 }}
              >
                {dateLine}
              </motion.p>
            </motion.div>

            <motion.p
              className="eyebrow pointer-events-none absolute bottom-[max(1.6rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-[0.58rem] whitespace-nowrap text-[#8f7a60]"
              animate={closed ? { opacity: [0.45, 1, 0.45] } : { opacity: 0 }}
              transition={closed ? { duration: 2.6, repeat: Infinity, delay: 1.4 } : { duration: 0.3 }}
            >
              Tap the seal to open
            </motion.p>

            {/* tap target over the wax seal, with a soft pulse to invite the tap */}
            {closed && (
              <span
                className="pointer-events-none absolute aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a77a]/70 animate-pulse-ring"
                style={{ left: `${seal.x * 100}%`, top: `${seal.y * 100}%` }}
              />
            )}
            <button
              type="button"
              onClick={open}
              disabled={!closed}
              aria-label="Tap the seal to open the invitation"
              className="absolute aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#c99a45]"
              style={{ left: `${seal.x * 100}%`, top: `${seal.y * 100}%` }}
            />
          </motion.div>

          {closed && (
            <button
              type="button"
              onClick={skip}
              className="eyebrow absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-10 rounded-full bg-[#5a4630]/40 px-4 py-2 text-[0.6rem] text-[#fbf6ee]"
            >
              Skip ›
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
