"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ornaments";

const LINKS = [
  { href: "#home", icon: "home", label: "Home" },
  { href: "#events", icon: "calendar", label: "Events" },
  { href: "#venue", icon: "pin", label: "Venue" },
  { href: "#rsvp", icon: "heart", label: "RSVP" },
];

export function Dock({
  playing,
  nowPlaying,
  onToggleMusic,
  shareTitle,
}: {
  playing: boolean;
  nowPlaying: string | null;
  onToggleMusic: () => void;
  shareTitle: string;
}) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > window.innerHeight * 0.6));

  // Briefly show which song is playing whenever the track changes.
  const [tag, setTag] = useState<string | null>(null);
  useEffect(() => {
    if (!playing || !nowPlaying) return;
    const show = setTimeout(() => setTag(nowPlaying), 0);
    const hide = setTimeout(() => setTag(null), 4500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [nowPlaying, playing]);

  const share = async () => {
    const url = window.location.href.split("?")[0];
    try {
      if (navigator.share) await navigator.share({ title: shareTitle, text: `You're invited! ${shareTitle}`, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {}
  };

  return (
    <>
      <AnimatePresence>
        {tag && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-20 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+0.6rem)] z-50 flex max-w-[60vw] items-center gap-2 rounded-full bg-maroon-900/85 py-2 pr-4 pl-3 text-gold-100 shadow-xl ring-1 ring-gold-300/40 backdrop-blur-xl"
            role="status"
          >
            <span className="flex h-3 items-end gap-[2px]" aria-hidden>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-[3px] rounded-full bg-gold-300"
                  animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </span>
            <span className="truncate font-serif text-sm italic">{tag}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* vinyl music toggle */}
      <button
        type="button"
        onClick={onToggleMusic}
        aria-label={playing ? "Pause music" : "Play music"}
        aria-pressed={playing}
        className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 grid size-14 place-items-center rounded-full shadow-xl ring-2 ring-gold-300/60"
        style={{ background: "repeating-radial-gradient(circle,#111 0 2px,#1d1d1d 2px 4px)" }}
      >
        <motion.span
          className="grid size-full place-items-center rounded-full"
          animate={{ rotate: playing ? 360 : 0 }}
          transition={playing ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0.6 }}
        >
          <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600">
            <span className="size-1.5 rounded-full bg-black" />
          </span>
        </motion.span>
        {!playing && (
          <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-maroon-600 text-gold-100 ring-2 ring-ivory">
            <Icon name="mute" className="size-3" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-50 flex items-center gap-1 rounded-full bg-maroon-900/85 p-1.5 shadow-2xl ring-1 ring-gold-300/40 backdrop-blur-xl sm:left-1/2 sm:-translate-x-1/2"
            aria-label="Invitation sections"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-gold-100/90 transition hover:bg-white/10 hover:text-gold-100"
              >
                <Icon name={l.icon} className="size-[18px]" />
                <span className="text-[0.55rem] font-semibold tracking-wider uppercase">{l.label}</span>
              </a>
            ))}
            <button
              type="button"
              onClick={share}
              className="flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-gold-100/90 transition hover:bg-white/10"
            >
              <Icon name={copied ? "check" : "share"} className="size-[18px]" />
              <span className="text-[0.55rem] font-semibold tracking-wider uppercase">{copied ? "Copied" : "Share"}</span>
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
