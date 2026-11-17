"use client";

import dynamic from "next/dynamic";

// Three.js só carrega no navegador e depois do conteúdo principal: o texto aparece rápido.
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false, loading: () => null });

export default function Hero3DLazy() {
  return <Hero3D />;
}
