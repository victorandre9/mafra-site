import gsap from "gsap";

/**
 * CARDS AMPLIÁVEIS (Victor, 23/11/2026: em monitor de 15,6" os cards de Serviços e Cases ficavam pequenos demais).
 * Só no computador. Mouse em cima: o card balança como bolha (CSS, `scale` — não briga com o tilt) e o cursor vira uma
 * LUPA 3D. Clique: uma CÓPIA do card cresce do lugar dele até o centro (estilo App Store / layout compartilhado):
 * escala uniforme + recorte com cantos redondos que se abre, mola no fim, aro iridescente de bolha de sabão e reflexo.
 * Fundo CLARO desfocado (o azul-escuro e a "gota" foram recusados: "cubo de gelo"). Fecha no ×, clicando fora ou Esc,
 * voltando exatamente para o card. A cópia mora no <body> (fora do `zoom` das páginas) e rola com o mouse por dentro.
 * Enquanto aberta, `html.bolha-aberta` segura a troca de páginas (paginas.ts).
 */
export function iniciarBolha(): () => void {
  const html = document.documentElement;
  // Serviços + Cases (Victor: "Verifica, Vetra Sales, Polar OS… Aplicativos e produtos digitais também, está pequeno")
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".services__track .card:not(.card--cta), #cases .project:not(.project--cta)"));
  const dicas: HTMLElement[] = [];
  let fecharAtual: (() => void) | null = null;

  const abrir = (card: HTMLElement) => {
    if (fecharAtual || window.innerWidth <= 760) return;
    const r = card.getBoundingClientRect();

    const capa = document.createElement("div");
    capa.className = "bolha";
    capa.setAttribute("role", "dialog");
    capa.setAttribute("aria-modal", "true");
    const fundo = document.createElement("div");
    fundo.className = "bolha__fundo";
    const trilho = document.createElement("div");
    const ehCase = card.classList.contains("project");
    trilho.className = ehCase ? "bolha__track bolha__track--case" : "services__track bolha__track";
    // (um 1º filho vazio: as regras de `.card:nth-child(1)` do card grande não pegam na cópia)
    trilho.appendChild(document.createElement("i"));
    const copia = card.cloneNode(true) as HTMLElement;
    copia.removeAttribute("style");
    copia.querySelectorAll<HTMLElement>("[style]").forEach((e) => e.removeAttribute("style"));
    copia.querySelectorAll(".card__dica").forEach((e) => e.remove());
    copia.classList.remove("tilt");
    copia.classList.add("bolha__card");
    copia.removeAttribute("data-cursor");
    const x = document.createElement("button");
    x.type = "button";
    x.className = "bolha__x";
    x.setAttribute("aria-label", "Fechar");
    x.textContent = "×";
    copia.appendChild(x);
    trilho.appendChild(copia);
    capa.append(fundo, trilho);
    document.body.appendChild(capa);
    html.classList.add("bolha-aberta");
    card.classList.add("bolha-origem");

    // ABERTURA "CARTÃO QUE CRESCE" (refino de 23/11/2026, Victor: a gota parecia "cubo de gelo" e o fundo azul, feio).
    // Referência: a expansão de cartões da App Store / animações de layout compartilhado (Framer Motion `layoutId`):
    // a cópia começa EXATAMENTE em cima do card (escala uniforme — a letra nunca deforma — e um recorte com cantos
    // redondos na altura do card) e cresce com mola até o painel grande, enquanto o recorte se abre. Um aro de bolha de
    // sabão (iridescente, transparente) brilha durante o voo e some; um reflexo de luz atravessa no fim.
    const aro = document.createElement("span");
    aro.className = "bolha__aro";
    const reflexo = document.createElement("span");
    reflexo.className = "bolha__reflexo";
    aro.setAttribute("aria-hidden", "true"); reflexo.setAttribute("aria-hidden", "true");
    copia.append(aro, reflexo);
    copia.setAttribute("data-lenis-prevent", ""); // a rolagem do mouse rola o card ampliado (não a página)
    const f = copia.getBoundingClientRect();
    const raio = parseFloat(getComputedStyle(card).borderTopLeftRadius) || 24;
    const posCard = (rc: DOMRect) => {
      const s = rc.width / f.width;
      const corte = Math.max(0, f.height - rc.height / s);
      return { x: rc.left - f.left, y: rc.top - f.top, scale: s, clipPath: `inset(0px 0px ${corte}px 0px round ${raio / s}px)` };
    };
    const aberto = { x: 0, y: 0, scale: 1, clipPath: "inset(0px 0px 0px 0px round 28px)" };
    gsap.set(copia, { transformOrigin: "0 0", ...posCard(r) });
    gsap.set(x, { opacity: 0, scale: 0.6 });
    gsap.set(aro, { opacity: 0 });
    gsap.fromTo(fundo, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
    gsap.timeline()
      .to(copia, { x: 0, y: 0, duration: 0.62, ease: "expo.out" }, 0)
      .to(copia, { scale: 1, duration: 0.85, ease: "back.out(1.25)" }, 0)
      .to(copia, { clipPath: aberto.clipPath, duration: 0.6, ease: "power3.out" }, 0.04)
      .to(aro, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0)
      .to(aro, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 0.55)
      .fromTo(reflexo, { xPercent: -160, opacity: 1 }, { xPercent: 260, duration: 0.9, ease: "power2.inOut" }, 0.35)
      .to(x, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, 0.5);
    x.focus({ preventScroll: true });

    let fechando = false;
    const fechar = () => {
      if (fechando) return;
      fechando = true;
      gsap.killTweensOf([copia, x, aro, reflexo]);
      copia.scrollTop = 0;
      gsap.to(fundo, { opacity: 0, duration: 0.45, ease: "power2.inOut" });
      gsap.timeline({ onComplete: () => {
        card.classList.remove("bolha-origem");
        capa.remove();
        html.classList.remove("bolha-aberta");
        fecharAtual = null;
      } })
        .to(x, { opacity: 0, scale: 0.6, duration: 0.15 }, 0)
        .to(aro, { opacity: 0.8, duration: 0.2 }, 0)
        .to(copia, { ...posCard(card.getBoundingClientRect()), duration: 0.5, ease: "power3.inOut" }, 0.02);
    };
    fecharAtual = fechar;
    fundo.addEventListener("click", fechar);
    trilho.addEventListener("click", (e) => { if (e.target === trilho) fechar(); });
    x.addEventListener("click", fechar);
  };

  const cliques = cards.map((card) => {
    const dica = document.createElement("span");
    dica.className = "card__dica";
    dica.setAttribute("aria-hidden", "true");
    dica.textContent = "Clique para ampliar";
    card.appendChild(dica);
    dicas.push(dica);
    card.classList.add("card--bolha");
    const f = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("a, button")) return; abrir(card); };
    card.addEventListener("click", f);
    return () => card.removeEventListener("click", f);
  });
  const esc = (e: KeyboardEvent) => { if (e.key === "Escape" && fecharAtual) { e.stopPropagation(); fecharAtual(); } };
  window.addEventListener("keydown", esc, { capture: true });

  return () => {
    cliques.forEach((f) => f());
    dicas.forEach((d) => d.remove());
    cards.forEach((c) => c.classList.remove("card--bolha", "bolha-origem"));
    window.removeEventListener("keydown", esc, { capture: true });
    document.querySelectorAll(".bolha").forEach((b) => b.remove());
    html.classList.remove("bolha-aberta");
  };
}
