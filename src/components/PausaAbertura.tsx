"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { EV_ABERTURA, aberturaRodando } from "@/lib/abertura";

/**
 * Dentro de um <Canvas>: para de desenhar a cena enquanto a ABERTURA roda e volta no fim.
 * Mexe direto no relógio da cena (setFrameloop) — trocar a prop `frameloop` do Canvas recriava a cena inteira
 * e travava o navegador por mais de 1 s justamente na abertura.
 */
export default function PausaAbertura() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    if (aberturaRodando()) setFrameloop("never");
    const f = (e: Event) => setFrameloop((e as CustomEvent).detail === "inicio" ? "never" : "always");
    window.addEventListener(EV_ABERTURA, f);
    return () => window.removeEventListener(EV_ABERTURA, f);
  }, [setFrameloop]);
  return null;
}
