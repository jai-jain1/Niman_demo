"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { OpeningVideo } from "@/content/invites/types";
import { LINEN, LinenBackdrop } from "./linen";
import { CardText, OPENING_ZOOM, OpeningFrame } from "./opening-scene";

const noopSubscribe = () => () => {};

/**
 * Opening built on a filmed envelope: the first frame waits for a tap on the
 * seal, the clip plays, the couple's details are written onto the blank card
 * it ends on, and the camera moves in to the card — which is exactly how the
 * first slide is framed, so the hand-off is invisible.
 */
export function VideoIntro({
  guest,
  partner1,
  partner2,
  dateLine,
  city,
  video,
  onOpenStart,
  onReveal,
  onDone,
  onFail,
}: {
  guest: string | null;
  partner1: string;
  partner2: string;
  dateLine: string;
  city: string;
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
    setTimeout(leave, 3500);
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
  const atCardPhase = phase === "card";
  const { seal } = video;

  return (
    <AnimatePresence onExitComplete={finish}>
      {phase !== "leaving" && (
        <motion.div
          key="video-intro"
          className="fixed inset-0 z-[60] grid place-items-center overflow-hidden"
          style={{ background: LINEN }}
          exit={{ opacity: 0, transition: { duration: 1.1, ease: "easeInOut" } }}
          role="dialog"
          aria-label="Invitation envelope"
        >
          <LinenBackdrop />

          <OpeningFrame
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: atCardPhase ? OPENING_ZOOM : 1 }}
            transition={
              atCardPhase ? { scale: { duration: 2.8, delay: 0.5, ease: [0.45, 0, 0.2, 1] } } : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
            }
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
                  if (v.duration && v.currentTime >= v.duration - 0.12) showCard();
                }}
              />
            )}

            {/* greeting in the blank space above the pearls */}
            <motion.div
              className="pointer-events-none absolute left-1/2 w-[62%] -translate-x-1/2 text-center"
              style={{ top: `${(seal.y - 0.26) * 100}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: closed ? 1 : 0 }}
              transition={{ duration: closed ? 1.1 : 0.4, delay: closed ? 0.8 : 0 }}
            >
              <p className="font-display text-[1.7cqw] tracking-[0.32em] text-[#9c8466] uppercase">{guest ? "Specially for" : "You are invited"}</p>
              <p className="mt-[0.6cqw] font-script text-[7cqw] leading-tight text-[#6b4a35]">{guest ?? `${partner1} & ${partner2}`}</p>
            </motion.div>

            <CardText
              card={video.card}
              partner1={partner1}
              partner2={partner2}
              dateLine={dateLine}
              city={city}
              visible={atCardPhase}
              animate
            />

            <motion.p
              className="pointer-events-none absolute bottom-[max(1.6rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 font-display text-[1.9cqw] tracking-[0.32em] whitespace-nowrap text-[#8f7a60] uppercase"
              animate={closed ? { opacity: [0.45, 1, 0.45] } : { opacity: 0 }}
              transition={closed ? { duration: 2.6, repeat: Infinity, delay: 1.4 } : { duration: 0.3 }}
            >
              Tap the seal to open
            </motion.p>

            {/* tap target over the wax seal, with a soft pulse to invite the tap */}
            {closed && (
              <span
                className="pointer-events-none absolute aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2 animate-pulse-ring rounded-full border border-[#c9a77a]/70"
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
          </OpeningFrame>

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
