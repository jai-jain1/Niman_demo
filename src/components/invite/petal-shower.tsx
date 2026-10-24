"use client";

import { useEffect, useRef } from "react";

type Petal = { x: number; y: number; r: number; vx: number; vy: number; rot: number; vr: number; flip: number; vf: number; color: string };

const COLORS = ["#c2183f", "#e0365a", "#f28c07", "#f6b31a", "#f7d2d9", "#9e1030"];

/** Rose and marigold petals tumbling down after the gates open. */
export function PetalShower({ active, count = 90, duration = 7000 }: { active: boolean; count?: number; duration?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current!;
    const g = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;
    const petals: Petal[] = Array.from({ length: count }, () => ({
      x: Math.random() * w(),
      y: -20 - Math.random() * h() * 0.9,
      r: 5 + Math.random() * 7,
      vx: -0.4 + Math.random() * 0.8,
      vy: 1 + Math.random() * 1.8,
      rot: Math.random() * Math.PI * 2,
      vr: -0.04 + Math.random() * 0.08,
      flip: Math.random() * Math.PI,
      vf: 0.03 + Math.random() * 0.06,
      color: COLORS[(Math.random() * COLORS.length) | 0],
    }));

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      g.clearRect(0, 0, w(), h());
      let alive = 0;
      for (const p of petals) {
        p.x += p.vx + Math.sin((p.y + p.flip * 40) / 60) * 0.6;
        p.y += p.vy;
        p.rot += p.vr;
        p.flip += p.vf;
        if (p.y > h() + 20) {
          if (elapsed < duration) p.y = -20;
          else continue;
        }
        alive++;
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.rot);
        g.scale(1, Math.abs(Math.cos(p.flip)) * 0.8 + 0.2);
        g.fillStyle = p.color;
        g.beginPath();
        g.moveTo(0, -p.r);
        g.bezierCurveTo(p.r * 0.9, -p.r * 0.6, p.r * 0.7, p.r * 0.8, 0, p.r);
        g.bezierCurveTo(-p.r * 0.7, p.r * 0.8, -p.r * 0.9, -p.r * 0.6, 0, -p.r);
        g.fill();
        g.fillStyle = "rgba(255,255,255,.22)";
        g.beginPath();
        g.ellipse(-p.r * 0.2, -p.r * 0.2, p.r * 0.25, p.r * 0.5, 0, 0, Math.PI * 2);
        g.fill();
        g.restore();
      }
      if (alive > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active, count, duration]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[55] h-full w-full" aria-hidden />;
}
