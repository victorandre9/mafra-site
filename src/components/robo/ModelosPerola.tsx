"use client";
/**
 * Modelos 3D do mascote na paleta Pérola & Esmeralda (escolhidos pelo Victor, 17/11/2026).
 * Orbe = o que está no site; Quad = Quadricóptero Pro, guardado para testar depois.
 * Material: branco perolado com reflexo furta-cor, cromo polido e luzes esmeralda
 * (emissivas, sem tone mapping, para o Bloom pegar só elas).
 */
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export const PEROLA = "#f3f6f8", PRATA = "#d4dbe2", CROMO = "#eef2f5";
export const ESM = "#022550", ESM_CLARO = "#044492", GELO = "#e2ebf6", LENTE = "#00070f";

export function Perola(props: { color?: string }) {
  return <meshPhysicalMaterial color={props.color ?? PEROLA} metalness={0.12} roughness={0.16} clearcoat={1} clearcoatRoughness={0.03}
    sheen={1} sheenRoughness={0.35} sheenColor={GELO} iridescence={0.45} iridescenceIOR={1.35} iridescenceThicknessRange={[180, 420]} />;
}
export const Metal = ({ c = CROMO, r = 0.22 }: { c?: string; r?: number }) => <meshPhysicalMaterial color={c} metalness={1} roughness={r} clearcoat={0.6} />;
export const Neon = ({ c = ESM, i = 5 }: { c?: string; i?: number }) => <meshStandardMaterial color={c} emissive={c} emissiveIntensity={i} toneMapped={false} />;

/* ---------------- ORBE ---------------- */
export function Orbe({ olhar, pose = [0.14, -0.35, 0], inclinacaoOlho = -0.42 }: { olhar?: React.RefObject<{ x: number; y: number }>; pose?: [number, number, number]; inclinacaoOlho?: number }) {
  const ring = useRef<THREE.Group>(null), eye = useRef<THREE.Group>(null), jet = useRef<THREE.Group>(null), iris = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (ring.current) ring.current.rotation.y += dt * 1.1;
    if (eye.current) {
      // com cursor/toque, o olho segue; sem, passeia devagar
      const alvo = olhar?.current;
      const ty = alvo ? alvo.x * 0.7 : Math.sin(t * 0.7) * 0.32;
      const tx = alvo ? alvo.y * 0.5 : Math.sin(t * 0.5) * 0.12;
      eye.current.rotation.y = THREE.MathUtils.damp(eye.current.rotation.y, ty, 6, dt);
      eye.current.rotation.x = THREE.MathUtils.damp(eye.current.rotation.x, tx, 6, dt);
    }
    if (iris.current) iris.current.rotation.z += dt * 0.8;
    if (jet.current) { jet.current.scale.y = 1 + Math.sin(t * 8) * 0.1; }
  });
  return (
    <group rotation={pose}>
      {/* casco perolado */}
      <mesh castShadow><sphereGeometry args={[0.6, 96, 96]} /><Perola /></mesh>
      {/* costuras de painel (meridianos prata) */}
      {[0, Math.PI / 3, (2 * Math.PI) / 3].map((a) => (
        <mesh key={a} rotation={[0, a, 0]}><torusGeometry args={[0.602, 0.0045, 8, 160]} /><Metal c={PRATA} r={0.35} /></mesh>
      ))}
      {/* cinta do equador: aro de cromo com filete esmeralda */}
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.607, 0.028, 24, 160]} /><Metal /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.632, 0.007, 12, 160]} /><Neon i={4} /></mesh>
      {/* olho: moldura cromada, lente escura de vidro, íris que gira, pupila e brilho */}
      <group rotation={[inclinacaoOlho, 0, 0]}><group ref={eye}>
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0, 0.585]}><torusGeometry args={[0.215, 0.022, 24, 96]} /><Metal r={0.12} /></mesh>
          <mesh position={[0, 0, 0.6]}><circleGeometry args={[0.205, 96]} /><meshPhysicalMaterial color={LENTE} metalness={0.3} roughness={0.1} clearcoat={1} /></mesh>
          <mesh ref={iris} position={[0, 0, 0.603]}><ringGeometry args={[0.075, 0.16, 96, 1, 0, Math.PI * 1.85]} /><Neon c={ESM} i={4.5} /></mesh>
          <mesh position={[0, 0, 0.604]}><ringGeometry args={[0.06, 0.072, 64]} /><Neon c={ESM_CLARO} i={7} /></mesh>
          <mesh position={[0, 0, 0.605]}><circleGeometry args={[0.055, 48]} /><meshBasicMaterial color="#00070f" /></mesh>
          <mesh position={[0.045, 0.05, 0.62]}><circleGeometry args={[0.022, 24]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
          {/* domo de vidro sobre a lente */}
          <mesh position={[0, 0, 0.6]} scale={[1, 1, 0.32]}>
            <sphereGeometry args={[0.215, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial transparent opacity={0.18} roughness={0.02} metalness={0} clearcoat={1} color="#ffffff" depthWrite={false} />
          </mesh>
        </group>
      </group>
      </group>
      {/* anel orbital de prata escovada com propulsores */}
      <group ref={ring} rotation={[0.38, 0, 0.08]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.0, 0.032, 24, 200]} /><Metal c={PRATA} r={0.28} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.965, 0.006, 8, 200]} /><Neon i={3} /></mesh>
        {[0, 1, 2].map((k) => {
          const a = (k / 3) * Math.PI * 2;
          return (
            <group key={k} position={[Math.cos(a), 0, Math.sin(a)]}>
              <mesh><capsuleGeometry args={[0.075, 0.13, 12, 32]} /><Perola /></mesh>
              <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.078, 0.008, 8, 48]} /><Metal /></mesh>
              <mesh position={[0, -0.155, 0]}><sphereGeometry args={[0.045, 24, 24]} /><Neon c={ESM_CLARO} i={8} /></mesh>
            </group>
          );
        })}
      </group>
      {/* jato: cone esmeralda com núcleo branco */}
      <group ref={jet} position={[0, -0.86, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.17, 0.55, 48, 1, true]} /><meshBasicMaterial color={ESM} transparent opacity={0.4} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>
        <mesh rotation={[Math.PI, 0, 0]} position={[0, 0.06, 0]}><coneGeometry args={[0.07, 0.36, 32, 1, true]} /><meshBasicMaterial color={GELO} transparent opacity={0.7} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>
      </group>
      <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.12, 0.02, 16, 64]} /><Metal /></mesh>
    </group>
  );
}

/* ---------------- QUADRICÓPTERO ---------------- */
function Helice({ dir }: { dir: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 9 * dir; });
  return (
    <group>
      {/* disco de borrão: o que o olho vê numa hélice de verdade */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.33, 64]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.1} depthWrite={false} /></mesh>
      <group ref={g}>
        {[0, Math.PI].map((a) => (
          <mesh key={a} rotation={[0.18, a, 0]} position={[Math.cos(a) * 0.16, 0, -Math.sin(a) * 0.16]}>
            <boxGeometry args={[0.32, 0.008, 0.05]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.55} roughness={0.1} clearcoat={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
function Led({ c, p, rate = 1 }: { c: string; p: [number, number, number]; rate?: number }) {
  const m = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => { if (m.current) m.current.emissiveIntensity = Math.sin(clock.elapsedTime * rate * 5) > 0.2 ? 9 : 0.4; });
  return <mesh position={p}><sphereGeometry args={[0.028, 16, 16]} /><meshStandardMaterial ref={m} color={c} emissive={c} emissiveIntensity={6} toneMapped={false} /></mesh>;
}
export function Quad() {
  const arms: Array<[number, number]> = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
  return (
    <group rotation={[0.32, -0.6, 0]} scale={0.95}>
      {/* casco perolado com chanfro e frisos */}
      <RoundedBox args={[1.1, 0.26, 0.74]} radius={0.12} smoothness={8} castShadow><Perola /></RoundedBox>
      <RoundedBox args={[0.86, 0.06, 0.6]} radius={0.03} smoothness={4} position={[0, -0.15, 0]}><Metal c={PRATA} r={0.3} /></RoundedBox>
      {/* cúpula de vidro esmeralda */}
      <mesh position={[0.05, 0.13, 0]} scale={[1.05, 0.5, 0.8]}>
        <sphereGeometry args={[0.32, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color={GELO} transmission={0.95} roughness={0.03} thickness={0.5} ior={1.45} clearcoat={1} attenuationColor={ESM} attenuationDistance={0.6} />
      </mesh>
      <mesh position={[0.05, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.322, 0.012, 12, 96]} /><Metal /></mesh>
      {/* filete de luz ao redor do casco */}
      {[0.375, -0.375].map((z) => <mesh key={z} position={[0, 0.0, z]}><boxGeometry args={[0.78, 0.018, 0.006]} /><Neon i={4} /></mesh>)}
      {arms.map(([x, z], i) => (
        <group key={i}>
          <group position={[x * 0.6, 0.02, z * 0.46]} rotation={[0, -Math.atan2(z * 0.46, x * 0.6), 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.042, 0.6, 8, 24]} /><Perola color="#e8edf1" /></mesh>
            <mesh position={[0, 0.043, 0]}><boxGeometry args={[0.5, 0.006, 0.012]} /><Neon i={3} /></mesh>
          </group>
          <group position={[x * 0.95, 0.08, z * 0.72]}>
            <mesh><cylinderGeometry args={[0.085, 0.1, 0.15, 48]} /><Metal r={0.15} /></mesh>
            <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.03, 0.03, 0.04, 24]} /><Metal /></mesh>
            {/* protetor da hélice: aro perolado com luz esmeralda por dentro */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}><torusGeometry args={[0.36, 0.024, 16, 96]} /><Perola /></mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}><torusGeometry args={[0.335, 0.007, 8, 96]} /><Neon i={3.5} /></mesh>
            <group position={[0, 0.11, 0]}><Helice dir={i % 2 ? 1 : -1} /></group>
          </group>
        </group>
      ))}
      {/* câmera no gimbal: lente de vidro escuro com anel esmeralda */}
      <group position={[0.3, -0.25, 0]}>
        <mesh><sphereGeometry args={[0.13, 48, 48]} /><Perola /></mesh>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><cylinderGeometry args={[0.07, 0.075, 0.06, 48]} /><Metal r={0.12} /></mesh>
        <mesh position={[0.133, 0, 0]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[0.058, 48]} /><meshPhysicalMaterial color={LENTE} metalness={0.4} roughness={0.05} clearcoat={1} /></mesh>
        <mesh position={[0.134, 0, 0]} rotation={[0, Math.PI / 2, 0]}><ringGeometry args={[0.03, 0.045, 48]} /><Neon c={ESM_CLARO} i={6} /></mesh>
      </group>
      <Led c="#ff5a6a" p={[-0.56, 0.02, 0.31]} />
      <Led c={ESM_CLARO} p={[-0.56, 0.02, -0.31]} rate={1.3} />
      {[-0.27, 0.27].map((z) => (
        <group key={z}>
          <mesh position={[0, -0.38, z]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.022, 0.9, 6, 16]} /><Metal c={PRATA} r={0.3} /></mesh>
          {[-0.25, 0.25].map((x) => <mesh key={x} position={[x, -0.27, z]}><cylinderGeometry args={[0.014, 0.014, 0.22, 12]} /><Metal c={PRATA} /></mesh>)}
        </group>
      ))}
    </group>
  );
}

