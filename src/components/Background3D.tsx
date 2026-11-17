"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, PerformanceMonitor, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Cena 3D de fundo, fixa atrás do site inteiro.
 *
 * A esfera tem vida própria (deriva, giro, respiração, deformação e cor pulsando)
 * e, ao rolar, viaja entre "paradas" ligadas a cada seção — muda de lugar,
 * tamanho e intensidade para nunca brigar com o texto.
 */

type Stage = { sel: string; d: [number, number, number, number]; m: [number, number, number, number] };
// [x, y, escala, opacidade] — x/y em frações da viewport (0 = centro). d = desktop, m = celular.
const STAGES: Stage[] = [
  { sel: ".hero", d: [0.27, 0.0, 1.0, 1], m: [0.18, 0.27, 0.62, 0.95] },
  { sel: ".manifesto", d: [-0.3, 0.02, 0.8, 0.55], m: [0.0, -0.28, 0.5, 0.35] },
  { sel: ".services", d: [0.38, 0.3, 0.42, 0.75], m: [0.28, 0.36, 0.34, 0.55] },
  { sel: ".process", d: [-0.52, -0.36, 0.45, 0.2], m: [-0.36, 0.44, 0.26, 0.2] },
  { sel: ".stats", d: [0.0, 0.0, 1.35, 0.35], m: [0.0, 0.0, 0.85, 0.3] },
  { sel: "#cases", d: [-0.42, 0.05, 0.62, 0.45], m: [-0.3, -0.36, 0.4, 0.3] },
  { sel: "#sobre", d: [0.36, -0.05, 0.75, 0.6], m: [0.25, 0.33, 0.45, 0.45] },
  { sel: ".contact", d: [0.3, 0.0, 1.05, 0.9], m: [0.05, 0.28, 0.6, 0.6] },
];

const ICONS = [
  { color: "#3ddc84", radius: 2.25, speed: 0.42, tilt: 0.35, size: 0.4, phase: 0 },
  { color: "#4f9bdc", radius: 2.6, speed: 0.31, tilt: -0.5, size: 0.48, phase: 1.3 },
  { color: "#ffffff", radius: 2.05, speed: 0.5, tilt: 0.9, size: 0.32, phase: 2.6 },
  { color: "#8ec5ff", radius: 2.8, speed: 0.26, tilt: -0.2, size: 0.3, phase: 3.9 },
  { color: "#1f9d5a", radius: 2.4, speed: 0.37, tilt: 0.6, size: 0.36, phase: 5.1 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const C_BLUE = new THREE.Color("#1d5c9a");
const C_GREEN = new THREE.Color("#178a52");
const E_BLUE = new THREE.Color("#0b2a52");
const E_GREEN = new THREE.Color("#0f4a3a");

/** Âncoras: posição de rolagem em que cada seção está centralizada na tela. */
function useAnchors() {
  const anchors = useRef<number[]>([]);
  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight;
      anchors.current = STAGES.map(({ sel }, i) => {
        const el = document.querySelector<HTMLElement>(sel);
        if (!el) return i === 0 ? 0 : Infinity;
        const top = el.getBoundingClientRect().top + window.scrollY;
        // seções altas (pinadas) ancoram no início; as demais, no centro
        const h = el.offsetHeight;
        return i === 0 ? 0 : Math.max(0, top + Math.min(h, vh) / 2 - vh / 2);
      });
    };
    compute();
    ScrollTrigger.addEventListener("refresh", compute);
    window.addEventListener("resize", compute);
    const t = setTimeout(compute, 2500);
    return () => {
      ScrollTrigger.removeEventListener("refresh", compute);
      window.removeEventListener("resize", compute);
      clearTimeout(t);
    };
  }, []);
  return anchors;
}

function AppIcon({ color, radius, speed, tilt, size, phase }: (typeof ICONS)[number]) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime * speed + phase;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    m.position.set(x, Math.sin(t) * radius * tilt * 0.45 + Math.sin(t * 2.3) * 0.12, z);
    m.rotation.set(t * 0.9, t * 1.3, t * 0.4);
  });
  return (
    <RoundedBox ref={ref} args={[size, size, size * 0.28]} radius={size * 0.22} smoothness={3}>
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.25} emissive={color} emissiveIntensity={0.35} />
    </RoundedBox>
  );
}

/** Anel de partículas que orbita o núcleo. */
function Halo({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const th = (i / count) * Math.PI * 2;
      const r = 1.95 + (Math.random() - 0.5) * 0.35;
      a[i * 3] = Math.cos(th) * r;
      a[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
      a[i * 3 + 2] = Math.sin(th) * r;
    }
    return a;
  }, [count]);
  useFrame(({ clock }, dt) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += dt * 0.35;
    p.rotation.x = 1.1 + Math.sin(clock.elapsedTime * 0.3) * 0.15;
    p.rotation.z = Math.sin(clock.elapsedTime * 0.2) * 0.25;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#7dffb0" transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/** Campo de estrelas com deriva, cintilar e parallax de rolagem. */
function Stars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = -2 - Math.random() * 10;
    }
    return arr;
  }, [count]);
  useFrame(({ clock }, dt) => {
    if (!ref.current || !mat.current) return;
    ref.current.rotation.z += dt * 0.006;
    ref.current.position.y = ((window.scrollY * 0.0012) % 6) - 3;
    mat.current.opacity = 0.55 + Math.sin(clock.elapsedTime * 1.4) * 0.2;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={mat} size={0.045} color="#cfe9ff" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Orb({ mobile, wrap }: { mobile: boolean; wrap: React.RefObject<HTMLDivElement | null> }) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const blob = useRef<React.ComponentRef<typeof MeshDistortMaterial>>(null);
  const { viewport, camera } = useThree();
  const anchors = useAnchors();
  const cur = useRef({ x: 0.27, y: 0, s: 1, o: 0, v: 0, lastY: 0 });

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = state.clock.elapsedTime;
    const g = root.current;
    if (!g) return;

    // 1) Alvo pela rolagem: interpola entre as paradas das seções
    const y = window.scrollY;
    const a = anchors.current;
    let i = 0;
    while (i < a.length - 1 && y >= a[i + 1]) i++;
    const A = mobile ? STAGES[i].m : STAGES[i].d;
    const nextI = Math.min(i + 1, STAGES.length - 1);
    const B = mobile ? STAGES[nextI].m : STAGES[nextI].d;
    const span = a[nextI] - a[i];
    const k = span > 0 && isFinite(span) ? smooth(Math.min(1, Math.max(0, (y - a[i]) / span))) : 0;
    const tx = A[0] + (B[0] - A[0]) * k;
    const ty = A[1] + (B[1] - A[1]) * k;
    const ts = A[2] + (B[2] - A[2]) * k;
    const to = A[3] + (B[3] - A[3]) * k;

    const c = cur.current;
    c.x = THREE.MathUtils.damp(c.x, tx, 2.6, dt);
    c.y = THREE.MathUtils.damp(c.y, ty, 2.6, dt);
    c.s = THREE.MathUtils.damp(c.s, ts, 2.6, dt);
    c.o = THREE.MathUtils.damp(c.o, to, 3, dt);
    // velocidade de rolagem → energia extra (gira e deforma mais quando a pessoa rola)
    const vel = Math.abs(y - c.lastY) / Math.max(dt, 0.001);
    c.lastY = y;
    c.v = THREE.MathUtils.damp(c.v, Math.min(vel / 2500, 1), 4, dt);

    // 2) Vida própria: deriva em lissajous + respiração
    const driftX = Math.sin(t * 0.37) * 0.32 + Math.sin(t * 0.11) * 0.18;
    const driftY = Math.cos(t * 0.29) * 0.24 + Math.sin(t * 0.53) * 0.1;
    const breathe = 1 + Math.sin(t * 1.1) * 0.04;
    const px = state.pointer.x * 0.25;
    const py = state.pointer.y * 0.18;
    g.position.set(c.x * viewport.width + driftX * c.s + px, c.y * viewport.height + driftY * c.s + py, 0);
    g.scale.setScalar(c.s * breathe * (mobile ? 1 : 1));

    if (spin.current) {
      spin.current.rotation.y += dt * (0.25 + c.v * 2.2);
      spin.current.rotation.x = Math.sin(t * 0.21) * 0.35 + state.pointer.y * 0.2;
      spin.current.rotation.z = Math.cos(t * 0.17) * 0.18;
    }
    if (shell.current) {
      shell.current.rotation.x -= dt * 0.12;
      shell.current.rotation.z += dt * 0.08;
      shell.current.scale.setScalar(1.75 * (1 + Math.sin(t * 1.1 + Math.PI) * 0.035));
    }
    if (ring.current) {
      ring.current.rotation.z += dt * 0.4;
      ring.current.rotation.x = 1.25 + Math.sin(t * 0.4) * 0.2;
    }
    if (blob.current) {
      blob.current.distort = 0.3 + Math.sin(t * 0.8) * 0.1 + c.v * 0.25;
      const mix = (Math.sin(t * 0.25) * 0.5 + 0.5) * 0.65;
      blob.current.color.copy(C_BLUE).lerp(C_GREEN, mix);
      blob.current.emissive.copy(E_BLUE).lerp(E_GREEN, mix);
    }
    // leve balanço de câmera
    camera.position.x = Math.sin(t * 0.13) * 0.25;
    camera.position.y = Math.cos(t * 0.11) * 0.18;
    camera.lookAt(0, 0, 0);

    if (wrap.current) wrap.current.style.opacity = c.o.toFixed(3);
  });

  return (
    <group ref={root}>
      <group ref={spin}>
        <mesh>
          <icosahedronGeometry args={[1.25, mobile ? 14 : 40]} />
          <MeshDistortMaterial
            ref={blob}
            color="#1d5c9a"
            emissive="#0b2a52"
            emissiveIntensity={0.45}
            roughness={0.08}
            metalness={0.5}
            clearcoat={1}
            clearcoatRoughness={0.15}
            distort={0.35}
            speed={2.2}
          />
        </mesh>
        <mesh ref={shell} scale={1.75}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#3ddc84" wireframe transparent opacity={0.2} />
        </mesh>
        <mesh ref={ring}>
          <torusGeometry args={[2.25, 0.012, 8, 160]} />
          <meshBasicMaterial color="#3ddc84" transparent opacity={0.55} blending={THREE.AdditiveBlending} />
        </mesh>
        <Halo count={mobile ? 140 : 320} />
      </group>
      {ICONS.slice(0, mobile ? 3 : ICONS.length).map((ic) => (
        <AppIcon key={ic.color} {...ic} />
      ))}
    </group>
  );
}

export default function Background3D() {
  const wrap = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const m = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
    setMobile(m);
    setDpr(m ? 1 : Math.min(window.devicePixelRatio, 1.6));
  }, []);

  return (
    <div ref={wrap} className="bg3d" aria-hidden="true" style={{ opacity: 0 }}>
      <Canvas
        dpr={dpr}
        frameloop="always"
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: !mobile, powerPreference: "high-performance", alpha: true }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 5, 5]} intensity={1.8} />
        <pointLight position={[-4, -2, 3]} intensity={34} color="#3ddc84" />
        <pointLight position={[3, -3, 2]} intensity={28} color="#4f9bdc" />
        <pointLight position={[0, 4, -2]} intensity={18} color="#ffffff" />
        <Stars count={mobile ? 260 : 750} />
        <Orb mobile={mobile} wrap={wrap} />
      </Canvas>
    </div>
  );
}
