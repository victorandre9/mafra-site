import gsap from "gsap";

/**
 * PERGUNTAS FREQUENTES (Victor, 23/11/2026).
 * 1) Bug: abrir uma pergunta não fechava a outra; a página crescia e o encaixe das páginas reduzia/ampliava tudo.
 *    Agora é SANFONA: abriu uma, as outras fecham (celular).
 * 2) Computador: a resposta não abre mais dentro da lista (a página nunca muda de altura). O clique abre o "FOCO":
 *    a tela escurece num CÍRCULO que nasce do ponto do clique, a pergunta sobe palavra por palavra em letra grande e a
 *    resposta acende palavra por palavra, com uma luz passando. Setas ← → navegam entre as perguntas;
 *    fecha no ×, clicando fora ou com Esc. Enquanto aberto, `html.bolha-aberta` segura a troca de páginas.
 */
export function iniciarFaqFoco(): () => void {
  const html = document.documentElement;
  const itens = Array.from(document.querySelectorAll<HTMLDetailsElement>(".faq__item"));
  if (!itens.length) return () => {};
  const desk = () => window.innerWidth > 760;
  const limpezas: (() => void)[] = [];

  // sanfona (vale nos dois; no computador nenhuma fica aberta)
  itens.forEach((d) => {
    const f = () => { if (d.open) itens.forEach((o) => { if (o !== d) o.open = false; }); };
    d.addEventListener("toggle", f);
    limpezas.push(() => d.removeEventListener("toggle", f));
  });
  if (desk()) itens.forEach((d) => { d.open = false; });

  const dados = itens.map((d) => ({
    q: d.querySelector("summary span")?.textContent?.trim() ?? "",
    r: d.querySelector("p")?.textContent?.trim() ?? "",
  }));

  let capa: HTMLDivElement | null = null;
  let atual = 0;

  const palavras = (txt: string, cls: string) =>
    txt.split(/\s+/).map((w) => `<span class="${cls}"><span>${w.replace(/</g, "&lt;")}</span></span>`).join(" ");

  const mostrar = (i: number, dir = 0) => {
    if (!capa) return;
    atual = (i + dados.length) % dados.length;
    const caixa = capa.querySelector<HTMLElement>(".faq-foco__conteudo")!;
    const montar = () => {
      caixa.innerHTML =
        `<p class="faq-foco__selo">Pergunta ${atual + 1} de ${dados.length}</p>` +
        `<h3 class="faq-foco__q">${palavras(dados[atual].q, "ff-w")}</h3>` +
        `<p class="faq-foco__r">${palavras(dados[atual].r, "ff-r")}</p>`;
      gsap.fromTo(caixa.querySelectorAll(".ff-w > span"), { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.035 });
      gsap.fromTo(caixa.querySelectorAll(".ff-r"), { opacity: 0.08, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.018, delay: 0.25 });
      gsap.fromTo(caixa.querySelector(".faq-foco__selo"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
      gsap.fromTo(capa!.querySelector(".faq-foco__luz"), { xPercent: -120 }, { xPercent: 220, duration: 1.4, ease: "power2.inOut", delay: 0.2 });
    };
    if (dir === 0) { montar(); return; }
    gsap.to(caixa, { opacity: 0, x: -40 * dir, duration: 0.22, ease: "power2.in", onComplete: () => {
      montar();
      gsap.fromTo(caixa, { opacity: 0, x: 40 * dir }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" });
    } });
  };

  const fechar = () => {
    if (!capa) return;
    const c = capa;
    capa = null;
    gsap.to(c.querySelector(".faq-foco__painel"), { scale: 0.94, opacity: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(c, { opacity: 0, duration: 0.4, delay: 0.1, ease: "power2.in", onComplete: () => { c.remove(); html.classList.remove("bolha-aberta"); } });
  };

  const abrir = (i: number, ev?: MouseEvent) => {
    if (capa) return;
    capa = document.createElement("div");
    capa.className = "faq-foco";
    capa.setAttribute("role", "dialog");
    capa.setAttribute("aria-modal", "true");
    capa.innerHTML =
      `<div class="faq-foco__fundo"></div>` +
      `<div class="faq-foco__painel"><span class="faq-foco__luz" aria-hidden="true"></span>` +
      `<button type="button" class="faq-foco__x" aria-label="Fechar">×</button>` +
      `<div class="faq-foco__conteudo"></div>` +
      `<div class="faq-foco__nav"><button type="button" class="faq-foco__seta" data-d="-1" aria-label="Pergunta anterior">←</button>` +
      `<button type="button" class="faq-foco__seta" data-d="1" aria-label="Próxima pergunta">→</button></div></div>`;
    document.body.appendChild(capa);
    html.classList.add("bolha-aberta");
    // círculo que nasce do ponto do clique e cobre a tela
    const cx = ev ? ev.clientX : innerWidth / 2, cy = ev ? ev.clientY : innerHeight / 2;
    const raio = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    const fundo = capa.querySelector<HTMLElement>(".faq-foco__fundo")!;
    gsap.fromTo(fundo, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${raio}px at ${cx}px ${cy}px)`, duration: 0.75, ease: "power3.inOut" });
    gsap.fromTo(capa.querySelector(".faq-foco__painel"), { opacity: 0, scale: 0.9, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.25, ease: "expo.out" });
    mostrar(i);
    fundo.addEventListener("click", fechar);
    capa.querySelector(".faq-foco__x")!.addEventListener("click", fechar);
    capa.querySelectorAll<HTMLElement>(".faq-foco__seta").forEach((b) => b.addEventListener("click", () => mostrar(atual + Number(b.dataset.d), Number(b.dataset.d))));
    capa.querySelector<HTMLElement>(".faq-foco__x")!.focus({ preventScroll: true });
  };

  itens.forEach((d, i) => {
    const s = d.querySelector("summary");
    if (!s) return;
    const f = (e: MouseEvent) => { if (!desk()) return; e.preventDefault(); abrir(i, e); };
    s.addEventListener("click", f);
    limpezas.push(() => s.removeEventListener("click", f));
  });
  const tecla = (e: KeyboardEvent) => {
    if (!capa) return;
    if (e.key === "Escape") { e.stopPropagation(); fechar(); }
    if (e.key === "ArrowRight") { e.stopPropagation(); e.preventDefault(); mostrar(atual + 1, 1); }
    if (e.key === "ArrowLeft") { e.stopPropagation(); e.preventDefault(); mostrar(atual - 1, -1); }
  };
  window.addEventListener("keydown", tecla, { capture: true });
  limpezas.push(() => window.removeEventListener("keydown", tecla, { capture: true }));

  return () => { limpezas.forEach((f) => f()); capa?.remove(); html.classList.remove("bolha-aberta"); };
}
