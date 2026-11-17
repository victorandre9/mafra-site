"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const NAVY = "#0d2442";
const GREEN = "#3ddc84";

/**
 * Orbe Sentinela: o mascote em 3D. Esfera polida com olho verde que segue o
 * cursor (ou o toque), anel orbital girando com 3 propulsores e jato embaixo.
 * O voo, o desvio, o giro no clique e as falas continuam em Experience.tsx —
 * aqui é só o corpo.
 */
function Orb({ host }: { host: React.RefObject<HTMLDivElement | null> }) {
  const body = useRef<THREE.Group>(null);
  const eye = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const jet = useRef<THREE.Mesh>(null);
  const look = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = host.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 300);
      look.current = { x: (dx / d) * k, y: (dy / d) * k };
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [host]);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (ring.current) ring.current.rotation.y += dt * 1.6;
    if (eye.current) {
      eye.current.rotation.y = THREE.MathUtils.damp(eye.current.rotation.y, look.current.x * 0.75, 6, dt);
      eye.current.rotation.x = THREE.MathUtils.damp(eye.current.rotation.x, look.current.y * 0.55, 6, dt);
    }
    if (body.current) body.current.rotation.z = Math.sin(t * 1.3) * 0.06;
    if (jet.current) {
      const m = jet.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.25 + Math.sin(t * 9) * 0.08 + 0.1;
      jet.current.scale.y = 1 + Math.sin(t * 7) * 0.12;
    }
  });

  return (
    <group ref={body} rotation={[0.18, 0, 0]}>
      <mesh>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshPhysicalMaterial color={NAVY} metalness={0.6} roughness={0.15} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.56, 0.02, 12, 96]} />
        <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      {/* olho: gira na superfície da esfera, olhando para o cursor */}
      <group ref={eye}>
        <mesh position={[0, 0.06, 0.552]}>
          <circleGeometry args={[0.2, 48]} />
          <meshStandardMaterial color="#03101f" />
        </mesh>
        <mesh position={[0, 0.06, 0.556]}>
          <ringGeometry args={[0.07, 0.15, 48]} />
          <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={5} toneMapped={false} />
        </mesh>
        <mesh position={[0.03, 0.09, 0.56]}>
          <circleGeometry args={[0.025, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      <group ref={ring} rotation={[0.35, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.03, 16, 128]} />
          <meshPhysicalMaterial color="#26476f" metalness={0.9} roughness={0.2} clearcoat={1} />
        </mesh>
        {[0, 1, 2].map((k) => {
          const a = (k / 3) * Math.PI * 2;
          return (
            <group key={k} position={[Math.cos(a) * 0.95, 0, Math.sin(a) * 0.95]}>
              <mesh><capsuleGeometry args={[0.07, 0.14, 8, 16]} /><meshStandardMaterial color="#1c3554" metalness={0.8} roughness={0.25} /></mesh>
              <mesh position={[0, -0.16, 0]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#7dffb0" emissive={GREEN} emissiveIntensity={6} toneMapped={false} />
              </mesh>
            </group>
          );
        })}
      </group>
      <mesh ref={jet} position={[0, -0.78, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.18, 0.5, 32, 1, true]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.35} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function DroneOrb() {
  const host = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState(1.5);
  useEffect(() => { setDpr(Math.min(window.devicePixelRatio || 1, 2)); }, []);
  return (
    <div ref={host} className="drone__orb">
      <Canvas dpr={dpr} camera={{ position: [0, 0.35, 3.1], fov: 40 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 3]} intensity={2.2} />
        <pointLight position={[-3, 1, 2]} intensity={22} color={GREEN} />
        <pointLight position={[2, -2, 2]} intensity={16} color="#4f9bdc" />
        <Environment resolution={128}>
          <Lightformer intensity={3} position={[0, 4, 2]} scale={[6, 2, 1]} color="#ffffff" />
          <Lightformer intensity={2} position={[-4, 0, 2]} scale={[2, 4, 1]} color={GREEN} />
          <Lightformer intensity={2} position={[4, 0, 2]} scale={[2, 4, 1]} color="#4f9bdc" />
        </Environment>
        <Orb host={host} />
      </Canvas>
    </div>
  );
}
