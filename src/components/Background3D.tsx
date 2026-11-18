"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
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
  { sel: ".hero", d: [0.27, 0.0, 1.0, 0.35], m: [0.18, 0.27, 0.62, 0.3] },
  { sel: ".manifesto", d: [-0.3, 0.02, 0.8, 0.35], m: [0.0, -0.28, 0.5, 0.3] },
  { sel: ".services", d: [0.38, 0.3, 0.42, 0.35], m: [0.28, 0.36, 0.34, 0.3] },
  { sel: ".process", d: [-0.52, -0.36, 0.45, 0.35], m: [-0.36, 0.44, 0.26, 0.3] },
  { sel: ".stats", d: [0.0, 0.0, 1.35, 0.35], m: [0.0, 0.0, 0.85, 0.3] },
  { sel: "#cases", d: [-0.42, 0.05, 0.62, 0.35], m: [-0.3, -0.36, 0.4, 0.3] },
  { sel: "#sobre", d: [0.36, -0.05, 0.75, 0.35], m: [0.25, 0.33, 0.45, 0.3] },
  { sel: ".contact", d: [0.3, 0.0, 1.05, 0.35], m: [0.05, 0.28, 0.6, 0.3] },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

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

/**
 * Malha de pontos: esfera de milhares de pontos que ondulam (respiram), verde → azul.
 * A onda é calculada na PLACA DE VÍDEO (shader), não no processador: recalcular
 * 2.600 pontos em JavaScript a cada quadro fazia a malha engasgar em aparelhos modestos.
 */

/**
 * Malha de pontos no estilo original (pontinho verde → azul). O Victor testou a versão de duas cores
 * e preferiu esta, com a transparência suave da seção de números em todo o trajeto (ver STAGES).
 * window.__mafraFundo sobrescreve (só para testar outras cores, sem publicar).
 */
const MALHA_PEROLA = { a: "#3ddc84", b: "#4f9bdc", anel: "#3ddc84", opMul: 0.5 }; // estilo original (Victor: "deixa do jeito que está")
type TemaMalha = { a: string; b: string; anel: string; perola?: number; bead?: number; opMul?: number; tam?: number; normal?: boolean; dentro?: string; fora?: string };
function temaMalha(): TemaMalha {
  const t = typeof window !== "undefined" ? (window as unknown as { __mafraFundo?: TemaMalha }).__mafraFundo : undefined;
  return t ?? MALHA_PEROLA;
}

const POINT_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uSize;
  uniform float uScale;
  attribute vec3 color;
  varying vec3 vColor;
  void main() {
    vec3 p = position;
    float w = 1.0 + uAmp * (0.05 * sin(p.y * 3.2 + uTime * 2.2) + 0.035 * sin(p.x * 4.0 - uTime * 1.7) + 0.03 * cos(p.z * 3.5 + uTime * 1.3));
    vec4 mv = modelViewMatrix * vec4(p * w, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (uScale / -mv.z);
    vColor = color;
  }
`;
const POINT_FRAG = /* glsl */ `
  uniform float uOpacity;
  uniform float uBead;
  uniform float uDuo;
  uniform vec3 uIn;
  uniform vec3 uOut;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    // "conta" (pérola): brilho branco no alto-esquerdo e borda mais escura, para ler no fundo claro
    float hl = smoothstep(0.28, 0.0, length(c - vec2(-0.14, -0.14)));
    float rim = smoothstep(0.22, 0.5, d);
    vec3 base = mix(vColor, mix(uIn, uOut, smoothstep(0.16, 0.44, d)), uDuo); // duas cores no mesmo ponto
    vec3 col = mix(base, vec3(1.0), hl * 0.75 * uBead) * (1.0 - rim * 0.3 * uBead);
    gl_FragColor = vec4(col, uOpacity * smoothstep(0.5, 0.42, d));
  }
`;

function PointSphere({ mobile, energy }: { mobile: boolean; energy: React.RefObject<{ v: number }> }) {
  const { positions, colors } = useMemo(() => {
    const n = mobile ? 1400 : 2600, R = 1.6;
    const positions = new Float32Array(n * 3), colors = new Float32Array(n * 3);
    const tm = temaMalha();
    const ca = new THREE.Color(tm?.a ?? "#3ddc84"), cb = new THREE.Color(tm?.b ?? "#4f9bdc"), c = new THREE.Color();
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
      positions.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3);
      if (tm?.perola) c.copy(Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1 < tm.perola ? cb : ca);
      else c.copy(ca).lerp(cb, (y + 1) / 2);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, colors };
  }, [mobile]);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAmp: { value: 1 }, uSize: { value: (mobile ? 0.045 : 0.035) * (temaMalha()?.tam ?? 1) }, uScale: { value: 400 }, uOpacity: { value: 0.95 }, uBead: { value: temaMalha()?.bead ?? 0 }, uDuo: { value: temaMalha()?.dentro ? 1 : 0 }, uIn: { value: new THREE.Color(temaMalha()?.dentro ?? "#ffffff") }, uOut: { value: new THREE.Color(temaMalha()?.fora ?? "#ffffff") } }),
    [mobile],
  );
  useFrame(({ clock, gl }) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAmp.value = 1 + (energy.current?.v ?? 0) * 2.5; // rolar mais rápido = onda maior
    uniforms.uScale.value = gl.domElement.height / 2; // mesma fórmula do sizeAttenuation do three
  });
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={POINT_VERT}
        fragmentShader={POINT_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={temaMalha()?.normal ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

function Orb({ mobile, wrap }: { mobile: boolean; wrap: React.RefObject<HTMLDivElement | null> }) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
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
    if (ring.current) {
      ring.current.rotation.z += dt * 0.4;
      ring.current.rotation.x = 1.25 + Math.sin(t * 0.4) * 0.2;
    }
    // leve balanço de câmera
    camera.position.x = Math.sin(t * 0.13) * 0.25;
    camera.position.y = Math.cos(t * 0.11) * 0.18;
    camera.lookAt(0, 0, 0);

    // fundo discreto: a malha fica translúcida para não competir com o conteúdo
    if (wrap.current) wrap.current.style.opacity = (c.o * (temaMalha()?.opMul ?? 0.5)).toFixed(3);
    // posição do fundo na tela (frações da viewport): a Orbe usa para não ficar em cima dele
    (window as Window & { __mafraBg?: { x: number; y: number; s: number } }).__mafraBg = {
      x: 0.5 + g.position.x / viewport.width, y: 0.5 - g.position.y / viewport.height, s: g.scale.x * (2.4 / viewport.height),
    };
  });

  return (
    <group ref={root}>
      <group ref={spin}>
        <PointSphere mobile={mobile} energy={cur} />
        {/* malha fina de ligação por trás dos pontos */}
        <lineSegments>
          <wireframeGeometry args={[new THREE.IcosahedronGeometry(1.6, 3)]} />
          <lineBasicMaterial color={temaMalha()?.anel ?? "#3ddc84"} transparent opacity={0.1} />
        </lineSegments>
        <mesh ref={ring}>
          <torusGeometry args={[2.25, 0.006, 6, 200]} />
          <meshBasicMaterial color={temaMalha()?.anel ?? "#3ddc84"} transparent opacity={0.5} />
        </mesh>
      </group>
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
    setDpr(m ? 1 : Math.min(window.devicePixelRatio, 1.25));
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
