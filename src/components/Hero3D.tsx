"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerformanceMonitor, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const ICONS = [
  { color: "#c6ff3d", radius: 2.3, speed: 0.35, y: 0.6, size: 0.42, phase: 0 },
  { color: "#22d3ee", radius: 2.6, speed: 0.28, y: -0.7, size: 0.5, phase: 1.3 },
  { color: "#ff5ca8", radius: 2.1, speed: 0.42, y: -0.1, size: 0.36, phase: 2.6 },
  { color: "#ffd23d", radius: 2.8, speed: 0.22, y: 1.0, size: 0.32, phase: 3.9 },
  { color: "#ffffff", radius: 2.45, speed: 0.31, y: -1.1, size: 0.3, phase: 5.1 },
];

/** "Ícones de app" orbitando o núcleo. */
function AppIcon({ color, radius, speed, y, size, phase }: (typeof ICONS)[number]) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase;
    const m = ref.current;
    if (!m) return;
    m.position.set(Math.cos(t) * radius, y + Math.sin(t * 1.7) * 0.25, Math.sin(t) * radius);
    m.rotation.set(t * 0.8, t * 1.1, 0);
  });
  return (
    <RoundedBox ref={ref} args={[size, size, size * 0.28]} radius={size * 0.22} smoothness={3}>
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.2} emissive={color} emissiveIntensity={0.25} />
    </RoundedBox>
  );
}

/** Campo de partículas leve (uma única draw call). */
function Stars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 7;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      arr[i * 3 + 2] = r * Math.cos(ph) - 3;
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#c9c2ff" transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene({ mobile }: { mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Posição responsiva: à direita no desktop, no topo (menor) no celular.
  const wide = viewport.width > 7;
  const baseX = wide ? viewport.width * 0.22 : viewport.width * 0.18;
  const baseY = wide ? 0 : viewport.height * 0.26;
  const baseScale = wide ? 1 : 0.62;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    // Progresso de rolagem dentro do hero (0 → 1)
    const p = Math.min(1, window.scrollY / window.innerHeight);
    const px = state.pointer.x, py = state.pointer.y;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.5 + p * Math.PI * 0.9, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.3 + p * 0.6, 4, dt);
    g.position.x = THREE.MathUtils.damp(g.position.x, baseX - p * (wide ? 1.5 : 0.4), 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + p * 1.8, 4, dt);
    const s = baseScale * (1 - p * 0.35);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, dt));
    if (shell.current) shell.current.rotation.z += dt * 0.12;
  });

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={0.9}>
        <mesh>
          <icosahedronGeometry args={[1.25, mobile ? 12 : 32]} />
          <MeshDistortMaterial color="#6b4dff" roughness={0.12} metalness={0.55} distort={0.38} speed={1.8} />
        </mesh>
        <mesh ref={shell} scale={1.75}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.18} />
        </mesh>
      </Float>
      {ICONS.slice(0, mobile ? 3 : ICONS.length).map((ic) => (
        <AppIcon key={ic.color} {...ic} />
      ))}
    </group>
  );
}

export default function Hero3D() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const m = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
    setMobile(m);
    setDpr(m ? 1.25 : Math.min(window.devicePixelRatio, 1.75));
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // Pausa a renderização quando o hero sai da tela (economiza bateria/GPU)
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="hero__canvas">
      <Canvas
        dpr={dpr}
        frameloop={!visible ? "never" : reduced ? "demand" : "always"}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: !mobile, powerPreference: "high-performance", alpha: true }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 5, 5]} intensity={1.6} />
        <pointLight position={[-4, -2, 3]} intensity={30} color="#22d3ee" />
        <pointLight position={[3, -3, 2]} intensity={25} color="#ff5ca8" />
        <Stars count={mobile ? 250 : 700} />
        <Scene mobile={mobile} />
      </Canvas>
    </div>
  );
}
