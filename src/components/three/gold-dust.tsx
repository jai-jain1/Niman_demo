"use client";

import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";

/** Drifting gold dust in front of the gates. */
export default function GoldDust() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Sparkles count={90} scale={[5, 9, 3]} size={3} speed={0.3} color="#ffe2a0" opacity={0.9} noise={1.2} />
      <Sparkles count={40} scale={[4, 8, 2]} size={6} speed={0.18} color="#ffd27a" opacity={0.5} />
    </Canvas>
  );
}
