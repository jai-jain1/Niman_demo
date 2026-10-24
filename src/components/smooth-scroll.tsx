"use client";

import { ReactLenis } from "lenis/react";

/** Buttery inertial scrolling across the whole page. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.09, smoothWheel: true, anchors: { offset: -16 } }}>
      {children}
    </ReactLenis>
  );
}
