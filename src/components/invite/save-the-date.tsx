"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Invite } from "@/content/invites/types";
import { Icon } from "@/components/ornaments";
import { Reveal } from "@/components/reveal";
import { downloadIcs, formatDay, formatDayNum, formatMonth, formatYear } from "@/lib/invite-utils";

const HEART = "M50 88C20 66 0 46 0 26 0 10 12 0 27 0c10 0 18 6 23 14C55 6 63 0 73 0c15 0 27 10 27 26 0 20-20 40-50 62z";
const HEART_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 90' preserveAspectRatio='none'><path d='${HEART}'/></svg>`,
)}")`;

function ScratchHeart({ invite, onReveal }: { invite: Invite; onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  const revealRef = useRef(onReveal);
  const d = invite.weddingDate;

  useEffect(() => {
    revealRef.current = onReveal;
  }, [onReveal]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const g = canvas.getContext("2d", { willReadFrequently: true })!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    g.scale(dpr, dpr);

    // Gold foil
    const grd = g.createLinearGradient(0, 0, width, height);
    ["#9a7428", "#e9cf87", "#c49a45", "#fff1c7", "#b88a37", "#e3c27a", "#8f6a22"].forEach((c, i, a) =>
      grd.addColorStop(i / (a.length - 1), c),
    );
    g.fillStyle = grd;
    g.fillRect(0, 0, width, height);
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(255,255,255,${Math.random() * 0.35})`;
      g.fillRect(Math.random() * width, Math.random() * height, 1.2, 1.2);
    }
    g.fillStyle = "rgba(90,59,15,.75)";
    g.textAlign = "center";
    // Canvas can't resolve CSS variables, so read next/font's generated family name.
    const cinzel = getComputedStyle(document.documentElement).getPropertyValue("--font-cinzel").trim() || "serif";
    g.font = `600 ${Math.round(width / 12)}px ${cinzel}`;
    g.letterSpacing = "4px";
    g.fillText("SCRATCH", width / 2, height * 0.38);
    g.fillText("HERE", width / 2, height * 0.38 + width / 9);

    let drawing = false;
    let last: { x: number; y: number } | null = null;
    let moves = 0;
    let finished = false;
    const radius = Math.max(18, width / 12);

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const scratch = (p: { x: number; y: number }) => {
      g.globalCompositeOperation = "destination-out";
      g.lineCap = "round";
      g.lineWidth = radius * 2;
      g.beginPath();
      g.moveTo(last?.x ?? p.x, last?.y ?? p.y);
      g.lineTo(p.x, p.y);
      g.stroke();
      last = p;
      if (++moves % 4 === 0) check();
    };
    const check = () => {
      const data = g.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 4 * 24) {
        total++;
        if (data[i] < 40) clear++;
      }
      if (!finished && clear / total > 0.14) {
        finished = true;
        setDone(true);
        revealRef.current();
      }
    };
    const down = (e: PointerEvent) => {
      drawing = true;
      last = null;
      canvas.setPointerCapture(e.pointerId);
      scratch(pos(e));
    };
    const move = (e: PointerEvent) => drawing && scratch(pos(e));
    const up = () => {
      drawing = false;
      last = null;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div className="relative mx-auto aspect-[100/90] w-[min(78vw,340px)]">
      <div
        className="absolute inset-0"
        style={{ maskImage: HEART_MASK, WebkitMaskImage: HEART_MASK, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blush to-ivory pb-[12%] text-center">
          <span className="font-display text-[clamp(2.2rem,10vw,3.2rem)] leading-none text-maroon-600">{formatDayNum(d)}</span>
          <span className="mt-1 font-display text-[clamp(1rem,4.5vw,1.4rem)] tracking-[0.25em] text-maroon-500 uppercase">{formatMonth(d)}</span>
          <span className="mt-1 font-display text-[clamp(1.4rem,6vw,2rem)] text-maroon-600">{formatYear(d)}</span>
        </div>
        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing"
          animate={{ opacity: done ? 0 : 1 }}
          transition={{ duration: 0.9 }}
          style={{ pointerEvents: done ? "none" : "auto" }}
          aria-label="Scratch to reveal the wedding date"
        />
      </div>
      <svg viewBox="-3 -3 106 96" className="pointer-events-none absolute -inset-[3%] h-[106%] w-[106%]" aria-hidden>
        <path d={HEART} fill="none" stroke="url(#heart-stroke)" strokeWidth="1.6" />
        <defs>
          <linearGradient id="heart-stroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#e9cf87" />
            <stop offset=".5" stopColor="#a37b2e" />
            <stop offset="1" stopColor="#e3c27a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function useCountdown(target: string) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => {
      const diff = Math.max(0, t - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

function Tile({ value, label }: { value: number | undefined; label: string }) {
  const text = value === undefined ? "--" : String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative grid h-[4.6rem] w-[4.2rem] place-items-center overflow-hidden rounded-xl bg-gradient-to-b from-maroon-500 to-maroon-700 shadow-[0_14px_30px_-12px_rgba(95,15,30,.6)] ring-1 ring-gold-300/40 sm:h-24 sm:w-20">
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/25" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: "-60%", opacity: 0, rotateX: 70 }}
            animate={{ y: "0%", opacity: 1, rotateX: 0 }}
            exit={{ y: "60%", opacity: 0, rotateX: -70 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-foil font-display text-3xl tabular-nums sm:text-4xl"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="eyebrow mt-2 text-[0.55rem] text-gold-700">{label}</span>
    </div>
  );
}

export function SaveTheDate({ invite }: { invite: Invite }) {
  const [revealed, setRevealed] = useState(false);
  const left = useCountdown(invite.weddingDate);
  const couple = `${invite.partner1.first} & ${invite.partner2.first}`;

  const celebrate = () => {
    if (revealed) return;
    setRevealed(true);
    const heart = confetti.shapeFromPath({ path: "M5 9C2 7 0 5 0 3 0 1 1 0 3 0c1 0 2 1 2 2 0-1 1-2 2-2 2 0 3 1 3 3 0 2-2 4-5 6z" });
    const opts = { spread: 80, ticks: 220, gravity: 0.8, scalar: 1.1, colors: ["#c49a45", "#e9cf87", "#8c1c2e", "#d9486b", "#fff1c7"] };
    confetti({ ...opts, particleCount: 90, origin: { y: 0.6 }, shapes: [heart, "circle"] });
    setTimeout(() => confetti({ ...opts, particleCount: 60, angle: 60, origin: { x: 0, y: 0.7 } }), 200);
    setTimeout(() => confetti({ ...opts, particleCount: 60, angle: 120, origin: { x: 1, y: 0.7 } }), 350);
  };

  return (
    <section id="date" className="relative overflow-hidden bg-gradient-to-b from-ivory via-blush/60 to-ivory py-24">
      <div className="mx-auto max-w-xl px-5 text-center">
        <Reveal>
          <p className="eyebrow text-gold-600">A special surprise</p>
          <h2 className="mt-3 font-display text-[clamp(1.25rem,5vw,1.7rem)] leading-snug tracking-[0.12em] text-maroon-600 uppercase">
            Scratch the heart to reveal
            <br /> our wedding date
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <ScratchHeart invite={invite} onReveal={celebrate} />
        </Reveal>

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6"
            >
              <p className="font-script text-4xl text-maroon-600">Save the date!</p>
              <p className="mt-1 font-serif text-xl text-ink/70 italic">
                {formatDay(invite.weddingDate)} · {invite.venue.city}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Reveal className="mt-16">
          <p className="eyebrow text-gold-600">Counting down to forever</p>
          <div className="mt-6 flex justify-center gap-3 sm:gap-5" style={{ perspective: 600 }} aria-live="off">
            <Tile value={left?.d} label="Days" />
            <Tile value={left?.h} label="Hours" />
            <Tile value={left?.m} label="Minutes" />
            <Tile value={left?.s} label="Seconds" />
          </div>
          <button
            type="button"
            onClick={() => downloadIcs(invite.events, couple, invite.slug)}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-maroon-500/30 bg-white/60 px-6 py-3 font-display text-xs tracking-[0.2em] text-maroon-600 uppercase shadow-sm transition hover:bg-maroon-600 hover:text-gold-100"
          >
            <Icon name="calendar" /> Add all events to calendar
          </button>
        </Reveal>
      </div>
    </section>
  );
}
