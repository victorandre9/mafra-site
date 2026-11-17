"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

/**
 * Logo do topo ampliável (pedido do Victor): um toque na logo do cabeçalho a traz grande para o
 * centro da tela, para dar para ler "Consultoria & Tecnologia". Tocar fora, nela de novo ou Esc
 * devolve para o lugar. A animação sai da posição real da logo no cabeçalho e volta para ela.
 * Usa o arquivo original da logo (399 px): o tamanho máximo fica perto disso para não borrar.
 */
export function LogoZoom() {
  const [aberta, setAberta] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const fundo = useRef<HTMLDivElement>(null);
  const origem = useRef<HTMLElement | null>(null);

  const deslocamento = () => {
    const o = origem.current?.getBoundingClientRect(), d = img.current?.getBoundingClientRect();
    if (!o || !d) return { x: 0, y: 0, scale: 0.2 };
    return { x: o.left + o.width / 2 - (d.left + d.width / 2), y: o.top + o.height / 2 - (d.top + d.height / 2), scale: o.width / d.width };
  };

  useEffect(() => {
    const logo = document.querySelector<HTMLElement>(".header .logo");
    if (!logo) return;
    const abrir = (e: Event) => { e.preventDefault(); origem.current = logo.querySelector("img") ?? logo; setAberta(true); };
    logo.addEventListener("click", abrir);
    return () => logo.removeEventListener("click", abrir);
  }, []);

  useEffect(() => {
    if (!aberta) return;
    const de = deslocamento();
    gsap.fromTo(fundo.current, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    gsap.fromTo(img.current, { ...de, opacity: 1 }, { x: 0, y: 0, scale: 1, duration: 0.7, ease: "expo.out" });
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") fechar(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberta]);

  const fechar = () => {
    const para = deslocamento();
    gsap.to(fundo.current, { opacity: 0, duration: 0.35 });
    gsap.to(img.current, { ...para, duration: 0.5, ease: "expo.inOut", onComplete: () => setAberta(false) });
  };

  if (!aberta) return null;
  return createPortal(
    <div className="logozoom" onClick={fechar} role="dialog" aria-label="Logo MAFRA Consultoria & Tecnologia">
      <div ref={fundo} className="logozoom__fundo" />
      <img ref={img} src="/brand/mafra-logo.png" alt="MAFRA Consultoria & Tecnologia" className="logozoom__img" />
    </div>,
    document.body,
  );
}
