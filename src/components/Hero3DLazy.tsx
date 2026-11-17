"use client";

import dynamic from "next/dynamic";

// Three.js só carrega no navegador e depois do conteúdo principal: o texto aparece rápido.
const Background3D = dynamic(() => import("./Background3D"), { ssr: false, loading: () => null });

export default function Hero3DLazy() {
  return <Background3D />;
}
