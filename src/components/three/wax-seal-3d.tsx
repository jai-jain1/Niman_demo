"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Geometry                                                            */
/* ------------------------------------------------------------------ */
const DEPTH = 0.12;
const BEVEL = { bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.12, bevelSegments: 8, curveSegments: 64, depth: DEPTH };
/** Front face of the seal after centring on z. */
const FRONT = DEPTH / 2 + BEVEL.bevelThickness;

/** Slightly lumpy wax outline. */
const rim = (a: number) => 1 + 0.045 * Math.sin(a * 7 + 0.6) + 0.028 * Math.sin(a * 13 + 2.1) + 0.015 * Math.sin(a * 23);
/** Jagged crack running from the bottom to the top of the seal. */
const CRACK: [number, number][] = [
  [0.02, -1],
  [-0.05, -0.62],
  [0.06, -0.3],
  [-0.04, 0.05],
  [0.05, 0.38],
  [-0.03, 0.7],
  [0.01, 1],
];

function extrude(shape: THREE.Shape) {
  const g = new THREE.ExtrudeGeometry(shape, BEVEL);
  g.translate(0, 0, -DEPTH / 2);
  return g;
}

function useSealGeometries() {
  return useMemo(() => {
    const whole = new THREE.Shape();
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      const r = rim(a);
      if (i === 0) whole.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else whole.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    const half = (side: "left" | "right") => {
      const s = new THREE.Shape();
      const [a0, a1] = side === "left" ? [Math.PI / 2, (3 * Math.PI) / 2] : [-Math.PI / 2, Math.PI / 2];
      for (let i = 0; i <= 48; i++) {
        const a = a0 + ((a1 - a0) * i) / 48;
        const r = rim(a);
        if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      const crack = side === "left" ? CRACK : [...CRACK].reverse();
      crack.forEach(([x, y]) => s.lineTo(x, y * 0.98));
      return extrude(s);
    };
    return { whole: extrude(whole), left: half("left"), right: half("right") };
  }, []);
}

/** Paints the monogram (white on black) onto the texture's canvas. */
function paintMonogram(tex: THREE.CanvasTexture, a: string, b: string, family: string) {
  const g = (tex.image as HTMLCanvasElement).getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#fff";
  g.strokeStyle = "#fff";
  g.lineWidth = 7;
  g.lineJoin = "round";
  g.textBaseline = "middle";
  g.font = `230px ${family}`;
  const wa = g.measureText(a).width;
  const wb = g.measureText(b).width;
  g.font = `120px ${family}`;
  const wamp = g.measureText("&").width;
  let x = 256 - (wa + wamp * 0.6 + wb) / 2;
  g.font = `230px ${family}`;
  const glyph = (t: string, gx: number, gy: number) => {
    g.strokeText(t, gx, gy);
    g.fillText(t, gx, gy);
  };
  glyph(a, x, 270);
  x += wa - wamp * 0.2;
  g.font = `120px ${family}`;
  glyph("&", x, 230);
  x += wamp * 0.8;
  g.font = `230px ${family}`;
  glyph(b, x, 270);
  tex.needsUpdate = true;
}

/** The couple's monogram drawn to a canvas, used as the gold leaf's alpha map. */
function useMonogram(a: string, b: string) {
  const [tex] = useState(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.NoColorSpace;
    return t;
  });
  useEffect(() => {
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-pinyon").trim() || "cursive";
    paintMonogram(tex, a, b, family);
    // Repaint once the script font has actually loaded.
    document.fonts?.load(`230px ${family}`).then(() => paintMonogram(tex, a, b, family), () => {});
  }, [a, b, tex]);
  return tex;
}

/* ------------------------------------------------------------------ */
/*  Seal                                                                */
/* ------------------------------------------------------------------ */
function useMaterials(monogram: THREE.Texture, waxColor: string) {
  return useMemo(() => {
    // Dark wax (cocoa) needs a warm, low sheen; ivory wax keeps its creamy glow.
    const dark = new THREE.Color(waxColor).getHSL({ h: 0, s: 0, l: 0 }).l < 0.35;
    const wax = new THREE.MeshPhysicalMaterial({
      color: waxColor,
      roughness: dark ? 0.42 : 0.32,
      clearcoat: dark ? 0.55 : 0.8,
      clearcoatRoughness: dark ? 0.3 : 0.22,
      sheen: dark ? 0.15 : 0.6,
      sheenColor: new THREE.Color(dark ? "#a0705a" : "#fff1d2"),
      sheenRoughness: 0.5,
      envMapIntensity: dark ? 0.6 : 1,
    });
    // A touch of warm emissive keeps the gold reading as gold, not bronze, in shadow.
    const gold = new THREE.MeshStandardMaterial({
      color: "#f4c96f",
      metalness: 0.9,
      roughness: 0.26,
      envMapIntensity: 2.2,
      emissive: "#6b4510",
      emissiveIntensity: 0.45,
      alphaMap: monogram,
      transparent: true,
      depthWrite: false,
    });
    const goldRing = new THREE.MeshStandardMaterial({
      color: "#eebf62",
      metalness: 0.9,
      roughness: 0.3,
      envMapIntensity: 2,
      emissive: "#5a3a0c",
      emissiveIntensity: 0.35,
    });
    return { wax, gold, goldRing };
  }, [monogram, waxColor]);
}

type Mats = ReturnType<typeof useMaterials>;

/** Raised rim ring, a ring of tiny beads and the gilded monogram. */
function Face({ mats, side }: { mats: Mats; side?: "left" | "right" }) {
  const ring = useMemo(() => new THREE.TorusGeometry(0.76, 0.035, 12, 96, side ? Math.PI : Math.PI * 2), [side]);
  const beads = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2 + 0.04;
      const x = Math.cos(a) * 0.88;
      if (!side || (side === "left" ? x < 0 : x > 0)) out.push([x, Math.sin(a) * 0.88]);
    }
    return out;
  }, [side]);
  const decal = useMemo(() => {
    const w = side ? 0.72 : 1.44;
    const g = new THREE.PlaneGeometry(w, 1.44);
    if (side) {
      const uv = g.attributes.uv as THREE.BufferAttribute;
      for (let i = 0; i < uv.count; i++) uv.setX(i, side === "left" ? uv.getX(i) * 0.5 : 0.5 + uv.getX(i) * 0.5);
      g.translate(side === "left" ? -0.36 : 0.36, 0, 0);
    }
    return g;
  }, [side]);
  const ringRot = side === "left" ? Math.PI / 2 : side === "right" ? -Math.PI / 2 : 0;

  return (
    <group position={[0, 0, FRONT]}>
      <mesh geometry={ring} material={mats.goldRing} rotation={[0, 0, ringRot]} />
      {beads.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.005]} material={mats.goldRing}>
          <sphereGeometry args={[0.022, 8, 8]} />
        </mesh>
      ))}
      <mesh geometry={decal} material={mats.gold} position={[0, 0, 0.004]} />
    </group>
  );
}

function Seal({
  initials,
  cracked,
  tilt,
  wax,
}: {
  initials: [string, string];
  cracked: boolean;
  tilt: React.RefObject<{ x: number; y: number }>;
  wax: string;
}) {
  const geo = useSealGeometries();
  const monogram = useMonogram(initials[0], initials[1]);
  const mats = useMaterials(monogram, wax);
  const halfMats = useMemo(() => {
    const clone = (m: THREE.Material) => Object.assign(m.clone(), { transparent: true });
    return [0, 1].map(() => ({ wax: clone(mats.wax), gold: clone(mats.gold), goldRing: clone(mats.goldRing) }) as Mats);
  }, [mats]);
  const root = useRef<THREE.Group>(null);
  const halves = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const crackAt = useRef<number | null>(null);
  const born = useRef<number | null>(null);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    born.current ??= t;
    const g = root.current;
    if (g) {
      // Drop-in "press" when the seal appears, then breathe and follow the tilt.
      const life = Math.min((t - born.current) / 0.9, 1);
      const press = 1 + 0.25 * Math.pow(1 - life, 3);
      g.scale.setScalar(press);
      const k = 1 - Math.pow(0.002, dt);
      g.rotation.x += (tilt.current.y * 0.35 + Math.sin(t * 0.7) * 0.05 - g.rotation.x) * k;
      g.rotation.y += (tilt.current.x * 0.45 + Math.cos(t * 0.5) * 0.06 - g.rotation.y) * k;
    }
    if (cracked) {
      crackAt.current ??= t;
      const e = t - crackAt.current;
      halves.forEach((h, i) => {
        const dir = i === 0 ? -1 : 1;
        if (!h.current) return;
        h.current.position.set(dir * (0.25 * e + 1.4 * e * e), -2.6 * e * e + 0.25 * e, 0.3 * e);
        h.current.rotation.set(-0.9 * e, dir * 1.8 * e, dir * -1.3 * e);
        const o = Math.max(0, 1 - e / 1.15);
        Object.values(halfMats[i]).forEach((m) => (m.opacity = o));
      });
    }
  });

  return (
    <group ref={root}>
      {!cracked ? (
        <group>
          <mesh geometry={geo.whole} material={mats.wax} />
          <Face mats={mats} />
        </group>
      ) : (
        (["left", "right"] as const).map((side, i) => (
          <group key={side} ref={halves[i]}>
            <mesh geometry={geo[side]} material={halfMats[i].wax} />
            <Face mats={halfMats[i]} side={side} />
          </group>
        ))
      )}
    </group>
  );
}

/** Places a child at a fraction of the canvas (like CSS left/top) and sizes it to a fraction of its width. */
function Placed({ x, y, widthRatio, children }: { x: number; y: number; widthRatio: number; children: React.ReactNode }) {
  const { viewport } = useThree();
  return (
    <group position={[(x - 0.5) * viewport.width, (0.5 - y) * viewport.height, 0]} scale={(widthRatio * viewport.width) / 2}>
      {children}
    </group>
  );
}

function Dust() {
  const { viewport } = useThree();
  return <Sparkles count={46} scale={[viewport.width, viewport.height, 2]} size={3.2} speed={0.25} color="#f5d58e" opacity={0.85} noise={1.1} />;
}

/**
 * A real 3D wax seal: ivory wax with a gilded monogram, lit by warm studio
 * light so highlights move as the guest tilts their phone. On `cracked` it
 * splits along a jagged line and the halves fall away. Gold dust drifts
 * across the envelope in the same WebGL scene (one context, not two).
 */
export default function WaxSeal3D({
  initials,
  cracked,
  x = 0.5,
  y = 0.47,
  widthRatio = 0.34,
  wax = "#f7ead3",
  dust = true,
  paused = false,
  onReady,
}: {
  initials: [string, string];
  cracked: boolean;
  x?: number;
  y?: number;
  widthRatio?: number;
  /** Wax colour — ivory by default, cocoa for the Pearl & Linen first slide. */
  wax?: string;
  /** Drift gold dust across the canvas (only when the canvas covers the scene). */
  dust?: boolean;
  /** Stop rendering, e.g. when scrolled out of view. */
  paused?: boolean;
  onReady?: () => void;
}) {
  const tilt = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      tilt.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      tilt.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tilt.current.x = Math.max(-1, Math.min(1, e.gamma / 22));
      tilt.current.y = Math.max(-1, Math.min(1, (e.beta - 45) / 22));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      // Measure the layout size, not the on-screen size: parents may be CSS-scaled.
      resize={{ offsetSize: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 11], fov: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
    >
      <ambientLight intensity={0.55} color="#fff0db" />
      <directionalLight position={[-3, 4, 6]} intensity={2.3} color="#ffecd0" />
      <directionalLight position={[3, 2, 5]} intensity={0.8} color="#fff6e8" />
      <pointLight position={[2.5, -1.5, 4]} intensity={2.2} color="#ffc070" distance={14} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffe2b0" position={[-3, 4, 4]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#fff4e0" position={[4, 1, 3]} scale={[3, 6, 1]} />
        <Lightformer form="ring" intensity={2.4} color="#ffcf80" position={[0, -3, 3]} scale={3} />
      </Environment>
      <Placed x={x} y={y} widthRatio={widthRatio}>
        <Seal initials={initials} cracked={cracked} tilt={tilt} wax={wax} />
      </Placed>
      {dust && <Dust />}
    </Canvas>
  );
}
