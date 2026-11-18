"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Orbe, Quad, ESM_CLARO, GELO } from "./robo/ModelosPerola";

/** Qual mascote voa no site. "quad" = Quadricóptero Pro (em teste, pedido do Victor 18/11/2026); "orbe" volta para a Orbe. */
const MODELO: "orbe" | "quad" = "quad";

/** Quadricóptero vira levemente para o cursor/toque, como um drone de verdade. */
function QuadVivo({ olhar }: { olhar: React.RefObject<{ x: number; y: number }> }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }, dt) => {
    if (!g.current) return;
    const t = clock.elapsedTime;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, olhar.current.x * 0.5, 4, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, olhar.current.y * 0.18, 4, dt);
    g.current.position.y = Math.sin(t * 1.6) * 0.05;
  });
  return <group ref={g}><Quad /></group>;
}

/**
 * Orbe Sentinela: o mascote em 3D, na paleta Pérola & Esmeralda (escolha do Victor, 17/11/2026).
 * O modelo mora em robo/ModelosPerola.tsx (junto do Quadricóptero, guardado para teste).
 * Aqui ficam a luz de estúdio e o olho que segue o cursor/toque. O voo, o desvio, o giro
 * no clique e as falas continuam em Experience.tsx — aqui é só o corpo.
 * Sem pós-produção (Bloom) aqui: ela apaga a transparência do canvas e desenha um
 * quadrado claro em volta do Orbe. O brilho verde vem das luzes emissivas + CSS.
 */
export default function DroneOrb() {
  const host = useRef<HTMLDivElement>(null);
  const olhar = useRef({ x: 0, y: 0 });
  const [dpr, setDpr] = useState(1.5);
  useEffect(() => { setDpr(Math.min(window.devicePixelRatio || 1, 2)); }, []);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = host.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 300);
      olhar.current = { x: (dx / d) * k, y: (dy / d) * k };
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div ref={host} className={MODELO === "quad" ? "drone__orb drone__orb--quad" : "drone__orb"}>
      <Canvas dpr={dpr} camera={MODELO === "quad" ? { position: [0, 0.8, 4.05], fov: 38 } : { position: [0, 0.25, 4.15], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.12} />
        <directionalLight position={[3, 4.5, 2.5]} intensity={3} />
        <pointLight position={[-2.6, 1.2, -2]} intensity={30} color={ESM_CLARO} />
        <pointLight position={[2.6, 0.6, -2.2]} intensity={22} color="#cfe8ff" />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.6} position={[0, 5, 1]} scale={[8, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.1} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={0.7} position={[5, 1, 0]} rotation-y={-Math.PI / 2} scale={[3, 6, 1]} color={GELO} />
          <Lightformer form="ring" intensity={2.5} position={[0, 1, -6]} scale={3} color={ESM_CLARO} />
        </Environment>
        {MODELO === "quad" ? <QuadVivo olhar={olhar} /> : <Orbe olhar={olhar} pose={[0.12, 0, 0]} inclinacaoOlho={-0.18} />}
      </Canvas>
    </div>
  );
}
