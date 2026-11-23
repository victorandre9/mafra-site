import gsap from "gsap";

/**
 * CARDS DE SERVIÇOS EM BOLHA (Victor, 23/11/2026: em monitor de 15,6" os cards ficavam pequenos demais para ler).
 * Só no computador. Ao passar o mouse o card "balança" como bolha (CSS, `scale` — não briga com o tilt, que usa
 * `transform`) e mostra "Clique para ampliar". Ao clicar, uma CÓPIA do card sai do lugar dele e vem em BOLHA (mola
 * elástica) até o centro da tela, em tamanho de leitura e com as etiquetas. Fecha clicando fora, no × ou com Esc.
 * A cópia mora no <body> (fora da seção, que tem `zoom` das páginas): é ela que garante o tamanho real da letra.
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

    // GOTA D'ÁGUA (Victor: "bolha com efeito molhado, com desenvolvimento até ficar no tamanho grande"):
    // o card vira uma gota redonda e brilhante no lugar dele, viaja crescendo até o centro e se DESENVOLVE até o
    // card grande, balançando como gelatina; o texto aparece quando ela assenta e o brilho molhado vai sumindo
    const gota = document.createElement("span");
    gota.className = "bolha__gota";
    gota.setAttribute("aria-hidden", "true");
    copia.appendChild(gota);
    const conteudo = Array.from(copia.children).filter((e) => e !== gota) as HTMLElement[];
    const f = copia.getBoundingClientRect();
    const cxDe = r.left + r.width / 2 - (f.left + f.width / 2), cyDe = r.top + r.height / 2 - (f.top + f.height / 2);
    const redondo = (d: number) => ({ scaleX: d / f.width, scaleY: d / f.height, borderRadius: `${f.width / 2}px / ${f.height / 2}px` });
    const dPeq = Math.min(r.width, r.height) * 0.55, dMed = Math.min(f.width, f.height) * 0.62;
    gsap.set(copia, { x: cxDe, y: cyDe, ...redondo(dPeq) });
    gsap.set(conteudo, { opacity: 0 });
    gsap.set(gota, { opacity: 1 });
    gsap.fromTo(fundo, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
    gsap.timeline()
      // 1) a gota se solta do card e viaja crescendo até o centro (estica um pouco no caminho, como líquido)
      .to(copia, { x: 0, y: 0, duration: 0.6, ease: "power2.inOut" }, 0)
      .to(copia, { ...redondo(dMed), duration: 0.6, ease: "power1.inOut" }, 0)
      .to(copia, { scaleX: (dMed * 1.08) / f.width, scaleY: (dMed * 0.9) / f.height, duration: 0.18, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.22)
      // 2) desenvolve: a gota abre até o card grande, balançando
      .to(copia, { scaleX: 1, scaleY: 1, duration: 1.15, ease: "elastic.out(1, 0.45)" }, 0.6)
      .to(copia, { borderRadius: "28px / 28px", duration: 0.7, ease: "power3.out" }, 0.62)
      // 3) o texto aparece e o molhado vai secando
      .to(conteudo, { opacity: 1, duration: 0.45, stagger: 0.05, ease: "power2.out" }, 0.95)
      .to(gota, { opacity: 0.18, duration: 1.1, ease: "power2.out" }, 0.95);
    x.focus({ preventScroll: true });

    let fechando = false;
    const fechar = () => {
      if (fechando) return;
      fechando = true;
      const r2 = card.getBoundingClientRect();
      gsap.killTweensOf([copia, gota, ...conteudo]);
      gsap.to(fundo, { opacity: 0, duration: 0.5, delay: 0.2, ease: "power2.in" });
      gsap.timeline({ onComplete: () => {
        card.classList.remove("bolha-origem");
        capa.remove();
        html.classList.remove("bolha-aberta");
        fecharAtual = null;
      } })
        // volta a ser gota, viaja de volta ao card e ESTOURA (cresce um pouco e some)
        .to(conteudo, { opacity: 0, duration: 0.18 }, 0)
        .to(gota, { opacity: 1, duration: 0.2 }, 0)
        .to(copia, { ...redondo(dMed), duration: 0.32, ease: "power2.in" }, 0)
        .to(copia, { x: r2.left + r2.width / 2 - (f.left + f.width / 2), y: r2.top + r2.height / 2 - (f.top + f.height / 2), ...redondo(dPeq), duration: 0.42, ease: "power2.inOut" }, 0.3)
        .to(copia, { ...redondo(dPeq * 1.35), opacity: 0, duration: 0.2, ease: "power1.out" }, 0.72);
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
