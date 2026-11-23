import gsap from "gsap";

/**
 * CARDS DE SERVIÇOS E CASES (Victor, 23/11/2026: em monitor de 15,6" ficavam pequenos demais). Só no computador.
 *
 * 1) LUPA (passar o mouse): uma lupa 3D (modelo 2 escolhido pelo Victor: aro azul-ciano aceso, cabo cromado —
 *    `/public/lupa-moldura.webp`, renderizada em 3D) segue o mouse e AMPLIA só o texto que está embaixo dela.
 *    O card NÃO sai do lugar ("não quero que o menu venha para frente"). Por dentro da lente vai uma cópia do card,
 *    dentro da mesma estrutura de classes do original (assim as letras ficam idênticas), ampliada AUMENTO vezes.
 *
 * 2) CLIQUE: a cópia sai do lugar do card e vem até o centro como BOLHA DE GELATINA — cresce em 8 balanços
 *    (achata e estica, cada vez menos, até assentar), com aro furta-cor de bolha de sabão e reflexo de luz; fundo
 *    claro desfocado. RECUSADOS: a gota azul ("cubo de gelo") e o fundo azul-escuro. Fecha no ×, clicando fora ou
 *    Esc, voltando para o card. A cópia mora no <body> (fora do `zoom` das páginas) e rola com o mouse por dentro.
 *    Enquanto aberta, `html.bolha-aberta` segura a troca de páginas (paginas.ts).
 */
const AUMENTO = 2.1;
// moldura renderizada (2ª versão, "mais proporcional": aro fino, cabo curto): centro da lente e raio interno em px CSS
const MOLDURA = { w: 211, h: 227, cx: 97.5, cy: 102, r: 66 };

export function iniciarBolha(): () => void {
  const html = document.documentElement;
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".services__track .card:not(.card--cta), #cases .project:not(.project--cta)"));
  const dicas: HTMLElement[] = [];
  let fecharAtual: (() => void) | null = null;

  // ---------- cópia limpa do card, dentro da MESMA estrutura de classes do original ----------
  const copiaDe = (card: HTMLElement) => {
    const c = card.cloneNode(true) as HTMLElement;
    c.removeAttribute("style");
    c.querySelectorAll<HTMLElement>("[style]").forEach((e) => e.removeAttribute("style"));
    c.querySelectorAll(".card__dica, .reflexo-mouse").forEach((e) => e.remove());
    c.classList.remove("tilt", "card--bolha");
    c.removeAttribute("data-cursor");
    return c;
  };
  const contexto = (card: HTMLElement, c: HTMLElement, lente: boolean) => {
    // (um 1º filho vazio: as regras de `.card:nth-child(1)` do card grande não pegam na cópia)
    if (card.classList.contains("project")) {
      const grupo = card.closest(".work__grupo");
      const raiz = document.createElement("div");
      if (lente) raiz.id = "cases"; // as letras dos cases são definidas por `#cases …` (só enquanto a lupa está na tela)
      raiz.className = "lupa-ctx";
      const g = document.createElement("div");
      g.className = grupo ? grupo.className : "work__grupo";
      const grid = document.createElement("div");
      grid.className = lente ? "work__grid" : "bolha__track bolha__track--case";
      grid.append(document.createElement("i"), c);
      if (!lente) return grid;
      g.appendChild(grid); raiz.appendChild(g);
      return raiz;
    }
    const t = document.createElement("div");
    t.className = lente ? "services__track lupa-ctx" : "services__track bolha__track";
    t.append(document.createElement("i"), c);
    return t;
  };
  const zoomAcumulado = (el: HTMLElement) => {
    let z = 1;
    for (let e: HTMLElement | null = el; e; e = e.parentElement) { const v = parseFloat(e.style.zoom || "1"); if (v) z *= v; }
    return z;
  };

  // ---------- 1) LUPA que segue o mouse ----------
  const lente = document.createElement("div");
  lente.className = "lupa-lente";
  lente.setAttribute("aria-hidden", "true");
  lente.innerHTML = `<div class="lupa-lente__vidro"><div class="lupa-lente__conteudo"></div><span class="lupa-lente__brilho"></span></div>` +
    `<img class="lupa-lente__moldura" src="/lupa-moldura.webp" alt="" width="${MOLDURA.w}" height="${MOLDURA.h}" draggable="false">`;
  document.body.appendChild(lente);
  const conteudo = lente.querySelector<HTMLElement>(".lupa-lente__conteudo")!;
  let alvo: HTMLElement | null = null, copiaLupa: HTMLElement | null = null, escala0 = 1;
  let mx = 0, my = 0, lx = 0, ly = 0, raf = 0, visivel = false;

  const posicionar = () => {
    raf = 0;
    if (!alvo || !copiaLupa) return;
    // (proteção: se a cópia sumiu da lente — ex.: uma saída e entrada muito rápidas —, refaz)
    if (!conteudo.firstChild || !copiaLupa.isConnected) { const a = alvo; alvo = null; mostrarLupa(a, { clientX: mx, clientY: my } as MouseEvent); return; }
    // a lente acompanha o mouse com um leve atraso (movimento macio)
    lx += (mx - lx) * 0.38; ly += (my - ly) * 0.38;
    lente.style.translate = `${lx - MOLDURA.cx}px ${ly - MOLDURA.cy}px`; // (`translate` à parte: o gsap usa `transform` para aparecer)
    const r = alvo.getBoundingClientRect();
    const s = escala0 * AUMENTO;
    const u = (lx - r.left) / escala0, v = (ly - r.top) / escala0;
    conteudo.style.transform = `translate(${MOLDURA.r - u * s}px, ${MOLDURA.r - v * s}px) scale(${s})`;
    if (Math.abs(mx - lx) > 0.3 || Math.abs(my - ly) > 0.3) raf = requestAnimationFrame(posicionar);
  };
  const mostrarLupa = (card: HTMLElement, e: MouseEvent) => {
    if (fecharAtual || html.classList.contains("pagina-andando")) return;
    alvo = card;
    const r = card.getBoundingClientRect();
    copiaLupa = copiaDe(card);
    copiaLupa.style.setProperty("width", `${r.width / zoomAcumulado(card)}px`, "important");
    conteudo.replaceChildren(contexto(card, copiaLupa, true));
    conteudo.style.transform = "none";
    escala0 = r.width / Math.max(1, copiaLupa.offsetWidth); // (offsetWidth: não sofre o `scale` da lente aparecendo)
    mx = lx = e.clientX; my = ly = e.clientY;
    card.classList.add("com-lupa");
    if (!visivel) { visivel = true; gsap.killTweensOf(lente); gsap.fromTo(lente, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" }); }
    posicionar();
  };
  const esconderLupa = () => {
    alvo?.classList.remove("com-lupa");
    alvo = null;
    if (visivel) { visivel = false; gsap.to(lente, { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.in", onComplete: () => { if (!visivel && !alvo) conteudo.replaceChildren(); } }); }
  };
  lente.style.transformOrigin = `${MOLDURA.cx}px ${MOLDURA.cy}px`;

  // ---------- 2) CLIQUE: bolha de geleia até o centro ----------
  const abrir = (card: HTMLElement) => {
    if (fecharAtual || window.innerWidth <= 760) return;
    esconderLupa();
    const r = card.getBoundingClientRect();
    const capa = document.createElement("div");
    capa.className = "bolha";
    capa.setAttribute("role", "dialog");
    capa.setAttribute("aria-modal", "true");
    const fundo = document.createElement("div");
    fundo.className = "bolha__fundo";
    const copia = copiaDe(card);
    copia.classList.add("bolha__card");
    const trilho = contexto(card, copia, false);
    const x = document.createElement("button");
    x.type = "button"; x.className = "bolha__x"; x.setAttribute("aria-label", "Fechar"); x.textContent = "×";
    const aro = document.createElement("span"); aro.className = "bolha__aro";
    const reflexo = document.createElement("span"); reflexo.className = "bolha__reflexo";
    aro.setAttribute("aria-hidden", "true"); reflexo.setAttribute("aria-hidden", "true");
    copia.append(x, aro, reflexo);
    copia.setAttribute("data-lenis-prevent", ""); // a rolagem do mouse rola o card ampliado (não a página)
    capa.append(fundo, trilho);
    document.body.appendChild(capa);
    html.classList.add("bolha-aberta");
    card.classList.add("bolha-origem");

    const f = copia.getBoundingClientRect();
    const raio = parseFloat(getComputedStyle(card).borderTopLeftRadius) || 24;
    // posição "em cima do card": escala uniforme + recorte na altura do card (as letras nunca deformam no voo)
    const posCard = (rc: DOMRect) => {
      const s = rc.width / f.width;
      const corte = Math.max(0, f.height - rc.height / s);
      return { x: rc.left - f.left, y: rc.top - f.top, scaleX: s, scaleY: s, clipPath: `inset(0px 0px ${corte}px 0px round ${raio / s}px)` };
    };
    // origem no CENTRO para a geleia balançar por igual; o deslocamento compensa
    const centro = (p: ReturnType<typeof posCard>) => ({ ...p, x: p.x - (f.width * (1 - p.scaleX)) / 2, y: p.y - (f.height * (1 - p.scaleY)) / 2 });
    gsap.set(copia, { transformOrigin: "50% 50%", ...centro(posCard(r)) });
    gsap.set(x, { opacity: 0, scale: 0.6 });
    gsap.set(aro, { opacity: 0 });
    gsap.fromTo(fundo, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: "power2.out" });
    // GELATINA (Victor: "se movendo várias vezes até abrir"): chega ao centro ainda menor e vai crescendo em
    // balanços — achata/estica 8 vezes, cada balanço menor que o anterior, até assentar no tamanho grande
    const balancos: gsap.TweenVars[] = [];
    const N = 8;
    for (let k = 0; k < N; k++) {
      const base = 0.7 + (0.3 * (k + 1)) / N;          // cresce a cada balanço
      const amp = 0.13 * Math.pow(0.72, k);            // e balança cada vez menos
      const lado = k % 2 === 0 ? 1 : -1;
      balancos.push({ scaleX: base * (1 + amp * lado), scaleY: base * (1 - amp * lado), duration: 0.13 + k * 0.012, ease: "sine.inOut" });
    }
    balancos.push({ scaleX: 1, scaleY: 1, duration: 0.18, ease: "sine.out" });
    gsap.timeline()
      // voo: sai do card e vai ao centro, esticando como líquido em movimento
      .to(copia, { x: 0, y: 0, duration: 0.5, ease: "power3.out" }, 0)
      .to(copia, { scaleX: 0.62, scaleY: 0.74, duration: 0.45, ease: "power2.out" }, 0)
      .to(copia, { clipPath: "inset(0px 0px 0px 0px round 28px)", duration: 0.45, ease: "power3.out" }, 0.05)
      // chegou: gelatina crescendo em balanços até abrir
      .to(copia, { keyframes: balancos }, 0.45)
      .to(aro, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0)
      .to(aro, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 1.55)
      .fromTo(reflexo, { xPercent: -160, opacity: 1 }, { xPercent: 260, duration: 0.95, ease: "power2.inOut" }, 1.2)
      .to(x, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, 1.5);
    x.focus({ preventScroll: true });

    let fechando = false;
    const fechar = () => {
      if (fechando) return;
      fechando = true;
      gsap.killTweensOf([copia, x, aro, reflexo]);
      copia.scrollTop = 0;
      gsap.to(fundo, { opacity: 0, duration: 0.5, delay: 0.1, ease: "power2.inOut" });
      gsap.timeline({ onComplete: () => {
        card.classList.remove("bolha-origem");
        capa.remove();
        html.classList.remove("bolha-aberta");
        fecharAtual = null;
      } })
        .to(x, { opacity: 0, scale: 0.6, duration: 0.15 }, 0)
        .to(aro, { opacity: 0.9, duration: 0.2 }, 0)
        // encolhe (uma última balançada) e volta para o lugar do card
        .to(copia, { scaleX: 1.04, scaleY: 0.95, duration: 0.12, ease: "sine.out" }, 0)
        .to(copia, { ...centro(posCard(card.getBoundingClientRect())), duration: 0.48, ease: "power3.inOut" }, 0.12);
    };
    fecharAtual = fechar;
    fundo.addEventListener("click", fechar);
    trilho.addEventListener("click", (e) => { if (e.target === trilho) fechar(); });
    x.addEventListener("click", fechar);
  };

  const limpezas = cards.map((card) => {
    const dica = document.createElement("span");
    dica.className = "card__dica";
    dica.setAttribute("aria-hidden", "true");
    dica.textContent = "Clique para abrir";
    card.appendChild(dica);
    dicas.push(dica);
    card.classList.add("card--bolha");
    const clique = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("a, button")) return; abrir(card); };
    const entra = (e: MouseEvent) => mostrarLupa(card, e);
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (alvo !== card) { mostrarLupa(card, e); return; }
      if (!raf) raf = requestAnimationFrame(posicionar);
    };
    const sai = () => { if (alvo === card) esconderLupa(); };
    card.addEventListener("click", clique);
    card.addEventListener("mouseenter", entra);
    card.addEventListener("mousemove", move);
    card.addEventListener("mouseleave", sai);
    return () => { card.removeEventListener("click", clique); card.removeEventListener("mouseenter", entra); card.removeEventListener("mousemove", move); card.removeEventListener("mouseleave", sai); };
  });
  // troca de página com a lupa aberta: ela some (o card sai da tela)
  const roda = () => esconderLupa();
  window.addEventListener("wheel", roda, { passive: true });
  const esc = (e: KeyboardEvent) => { if (e.key === "Escape" && fecharAtual) { e.stopPropagation(); fecharAtual(); } };
  window.addEventListener("keydown", esc, { capture: true });

  return () => {
    limpezas.forEach((f) => f());
    dicas.forEach((d) => d.remove());
    cards.forEach((c) => c.classList.remove("card--bolha", "bolha-origem", "com-lupa"));
    window.removeEventListener("wheel", roda);
    window.removeEventListener("keydown", esc, { capture: true });
    cancelAnimationFrame(raf);
    lente.remove();
    document.querySelectorAll(".bolha").forEach((b) => b.remove());
    html.classList.remove("bolha-aberta");
  };
}
