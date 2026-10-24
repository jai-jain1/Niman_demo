"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { seeded } from "@/lib/invite-utils";

/** Soft radial sprite used for each lantern's halo. */
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,214,140,1)");
    grd.addColorStop(0.25, "rgba(255,170,80,0.55)");
    grd.addColorStop(1, "rgba(255,140,40,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

type Lantern = { x: number; y: number; z: number; speed: number; sway: number; phase: number; scale: number };

function Lanterns({ count }: { count: number }) {
  const body = useRef<THREE.InstancedMesh>(null);
  const halo = useRef<THREE.InstancedMesh>(null);
  const glow = useGlowTexture();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lanterns = useMemo<Lantern[]>(() => {
    const r = seeded(7);
    return Array.from({ length: count }, () => ({
      x: (r() - 0.5) * 12,
      y: -4 + r() * 8,
      z: -3 - r() * 7,
      speed: 0.12 + r() * 0.18,
      sway: 0.15 + r() * 0.3,
      phase: r() * Math.PI * 2,
      scale: 0.6 + r() * 0.5,
    }));
  }, [count]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    lanterns.forEach((l, i) => {
      l.y += l.speed * Math.min(dt, 0.05);
      if (l.y > 4.5) l.y = -4;
      const x = l.x + Math.sin(t * 0.4 + l.phase) * l.sway;
      const flicker = 1 + Math.sin(t * 7 + l.phase * 3) * 0.04;
      dummy.position.set(x, l.y, l.z);
      dummy.rotation.set(0, t * 0.2 + l.phase, Math.sin(t * 0.6 + l.phase) * 0.08);
      dummy.scale.setScalar(l.scale);
      dummy.updateMatrix();
      body.current?.setMatrixAt(i, dummy.matrix);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(l.scale * 1.25 * flicker);
      dummy.updateMatrix();
      halo.current?.setMatrixAt(i, dummy.matrix);
    });
    if (body.current) body.current.instanceMatrix.needsUpdate = true;
    if (halo.current) halo.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.13, 0.09, 0.26, 12, 1, true]} />
        <meshBasicMaterial color="#ffb45e" side={THREE.DoubleSide} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={halo} args={[undefined, undefined, count]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

const subscribeNone = () => () => {};
const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

export default function SkyLanterns({ count = 26 }: { count?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  const touch = useSyncExternalStore(subscribeNone, isTouch, () => false);

  // Stop rendering entirely once the hero scrolls out of view.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "100px" });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="pointer-events-none absolute inset-0">
      <Canvas
        frameloop={onScreen ? "always" : "never"}
        dpr={touch ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 55 }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <Lanterns count={touch ? Math.round(count * 0.7) : count} />
        <Sparkles count={touch ? 36 : 60} scale={[10, 6, 4]} size={2.2} speed={0.25} color="#ffe2a8" opacity={0.7} />
      </Canvas>
    </div>
  );
}
