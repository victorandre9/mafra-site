/**
 * SITE EM PÁGINAS DE TELA CHEIA (especificação aprovada pelo Victor, 23/11/2026)
 *
 * - Cada GRUPO (uma ou mais seções da mesma cor) vira uma ou mais "paradas" do tamanho exato da tela.
 *   Conteúdo menor que a tela é AMPLIADO (zoom) até preencher; maior que a tela, mas não muito, é REDUZIDO até caber
 *   (os 6 cards de Serviços cabem numa página). Só quando não cabe de jeito nenhum (Cases, Perguntas) vira várias
 *   paradas da mesma cor, cortadas no começo de um card/parágrafo.
 * - UM GESTO = UMA PARADA (roda, trackpad, dedo ou tecla; forte ou fraco). Durante a troca nenhum gesto conta.
 * - Claro → azul: a página atual sai pela ESQUERDA e a azul entra pela DIREITA AO MESMO TEMPO (carrossel: a página
 *   que entra é uma cópia visual, trocada pela real no fim). Azul → claro e mesma cor: a página DESCE.
 * - A Metodologia (tela travada) tem paradas internas: uma por etapa, antes de seguir para a próxima página.
 * - Se algo falhar, o site volta a rolar normalmente (nunca fica preso).
 */
import type { gsap as GsapT } from "gsap";
import type { ScrollTrigger as STT } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

type Cor = "claro" | "azul";
type Grupo = { secs: HTMLElement[]; cor: Cor; ajustar: "auto" | "metodo"; modo?: "caber" | "dividir"; pedacos?: string[][]; tops?: number[] };
type Parada = { y: number; grupo: number; primeira: boolean };

export function iniciarPaginas(gsap: typeof GsapT, ScrollTrigger: typeof STT, lenis: Lenis | null): () => void {
  // CELULAR: rolagem contínua normal, tudo para baixo, sem páginas e sem lateral (pedido do Victor, 23/11/2026)
  if (window.innerWidth <= 760) return () => {};
  const q = (s: string) => document.querySelector(s) as HTMLElement | null;
  const def: Array<[string[], Cor, Grupo["ajustar"]]> = [
    [[".hero", ".marquee"], "claro", "auto"],
    [[".manifesto"], "azul", "auto"],
    [[".services"], "claro", "auto"],
    [["#metodo"], "azul", "metodo"],
    [[".stats"], "azul", "auto"],
    [["#cases"], "claro", "auto"],
    [["#sobre"], "azul", "auto"],
    [[".bigtext", "#perguntas"], "claro", "auto"],
    [["#contato"], "azul", "auto"],
    [[".footer"], "claro", "auto"],
  ];
  const grupos: Grupo[] = def
    .map(([sels, cor, ajustar]) => ({ secs: sels.map(q).filter(Boolean) as HTMLElement[], cor, ajustar }))
    .filter((g) => g.secs.length);
  // Cases é grande demais para UMA tela: vira DUAS páginas inteiras (cada uma encaixada na tela, letra ajustada)
  const PEDACOS: Record<string, string[][]> = {
    cases: [[":scope > .eyebrow", ":scope > .section-title", ":scope > .work__lead", ":scope > .work__grupo--b2b"], [":scope > .work__grupo--b2c", ":scope > .work__fecho"]],
  };
  grupos.forEach((g) => { const id = g.secs[0].id; if (g.secs.length === 1 && PEDACOS[id]) g.pedacos = PEDACOS[id]; });
  if (grupos.length < 3) return () => {};

  const html = document.documentElement;
  html.classList.add("modo-paginas");
  const H = () => window.innerHeight;
  const topoDoc = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
  const cabecalho = () => (q(".header")?.getBoundingClientRect().height ?? 0);

  // ---------- 1) tamanho: cada grupo "caber" ocupa exatamente a tela, com o conteúdo ampliado/reduzido ----------
  // REGRA: cabe com pelo menos 60% do tamanho (computador) → vira UMA página (encolhe ou amplia até preencher a tela);
  // precisaria encolher mais que isso → vira várias páginas da mesma cor, sem encolher nada.
  // A ampliação nunca passa de 1,15x no celular / 1,5x no computador e nunca faz o conteúdo passar da largura da tela.
  const ajustarTamanhos = () => {
    const cel = window.innerWidth <= 760;
    grupos.forEach((g) => {
      if (g.ajustar !== "auto") return;
      g.secs.forEach((s) => { s.style.zoom = ""; s.style.minHeight = ""; s.style.removeProperty("--inv-zoom"); });
      if (g.pedacos) { ajustarPedacos(g); return; }
      const altura = g.secs.reduce((a, s) => a + s.getBoundingClientRect().height, 0);
      const util = H() - cabecalho() - 24;
      let z = util / Math.max(1, altura);
      // Serviços (6 cards) é sempre UMA página no computador (pedido do Victor): aceita encolher até 60%
      // computador: toda página cabe na tela (aceita encolher até 60%); celular nem usa este modo
      const minimo = cel ? 0.7 : g.secs.some((x) => x.matches(".hero")) ? 0.5 : 0.6;
      if (z < minimo) { g.modo = "dividir"; return; }
      g.modo = "caber";
      z = Math.min(z, cel ? 1.15 : 1.5);
      // --inv-zoom: o fundo de largura total (100vw) encolheria junto com o zoom; o CSS compensa com ele
      const aplicar = (v: number) => g.secs.forEach((s) => { s.style.zoom = String(v); s.style.setProperty("--inv-zoom", String(1 / v)); });
      aplicar(z);
      // com zoom a largura útil muda (imagens com proporção ficam mais altas/baixas): corrige medindo de novo
      for (let k = 0; k < 4; k++) {
        const real = g.secs.reduce((a2, s) => a2 + s.getBoundingClientRect().height, 0);
        if (Math.abs(real - util) < 6 || (z >= (cel ? 1.15 : 1.5) && real < util)) break;
        z = Math.min(z * (util / real), cel ? 1.15 : 1.5);
        aplicar(z);
      }
      // ampliando: se algo passar da largura da tela (texto quebrando para fora), recua até caber
      const vazou = () => g.secs.some((s) => s.scrollWidth > s.clientWidth + 2);
      while (z > 1 && vazou()) { z = Math.max(1, z - 0.05); aplicar(z); }
      const soma = g.secs.reduce((a, s) => a + s.getBoundingClientRect().height, 0);
      const ultima = g.secs[g.secs.length - 1];
      const falta = H() - soma;
      if (falta > 0) ultima.style.minHeight = `${(ultima.getBoundingClientRect().height + falta) / z}px`;
    });
  };

  // pedaços: cada pedaço é uma página inteira — zoom próprio para ocupar a tela e começo exatamente uma tela depois do anterior
  const ajustarPedacos = (g: Grupo) => {
    const sec = g.secs[0];
    const els = g.pedacos!.map((sels) => sels.map((x) => sec.querySelector(x) as HTMLElement | null).filter(Boolean) as HTMLElement[]);
    els.flat().forEach((e) => { e.style.zoom = ""; e.style.marginTop = ""; e.style.width = ""; e.style.marginLeft = ""; e.style.marginRight = ""; });
    // largura FIXA antes do zoom: assim o conteúdo encolhe por igual (sem isso, com zoom a largura útil cresce,
    // as imagens ficam mais altas e a página nunca cabe). Em tela muito larga, no máximo 1500 px.
    els.flat().forEach((e) => { e.style.width = `${Math.min(e.getBoundingClientRect().width, 1500)}px`; e.style.marginLeft = "auto"; e.style.marginRight = "auto"; });
    sec.style.paddingTop = "0px"; sec.style.paddingBottom = "0px";
    const ch = cabecalho(), util = H() - ch - 32;
    const zs = els.map((lista) => {
      if (!lista.length) return 1;
      const h = lista[lista.length - 1].getBoundingClientRect().bottom - lista[0].getBoundingClientRect().top;
      let z = Math.min(1.3, util / Math.max(1, h));
      const medir = () => lista[lista.length - 1].getBoundingClientRect().bottom - lista[0].getBoundingClientRect().top;
      lista.forEach((e) => { e.style.zoom = String(z); });
      for (let k = 0; k < 4; k++) { // zoom muda a largura → imagens mudam de altura: mede de novo e corrige
        const real = medir();
        if (Math.abs(real - util) < 6 || (z >= 1.3 && real < util)) break;
        z = Math.min(1.3, z * (util / real));
        lista.forEach((e) => { e.style.zoom = String(z); });
      }
      return z;
    });
    const topo = topoDoc(sec);
    g.tops = [];
    els.forEach((lista, i) => {
      if (!lista.length) return;
      const alvo = topo + i * H() + ch + 16;
      const delta = alvo - topoDoc(lista[0]);
      lista[0].style.marginTop = `${delta / zs[i]}px`;
      g.tops!.push(topo + i * H());
    });
    const falta = topo + els.length * H() - (topoDoc(sec) + sec.getBoundingClientRect().height);
    sec.style.paddingBottom = `${Math.max(0, falta)}px`;
  };

  // ---------- 2) paradas ----------
  let paradas: Parada[] = [];
  const calcular = () => {
    ajustarTamanhos();
    const lista: Parada[] = [];
    const ch = cabecalho();
    grupos.forEach((g, gi) => {
      const ini = topoDoc(g.secs[0]);
      const ult = g.secs[g.secs.length - 1];
      const fim = topoDoc(ult) + ult.getBoundingClientRect().height;
      if (g.ajustar === "metodo") {
        const st = ScrollTrigger.getAll().find((t) => t.pin && (t.trigger as HTMLElement | undefined)?.classList?.contains("process"));
        if (st) {
          // cada parada no MEIO da faixa da etapa (etapa = progresso × 4); nunca no fim da trava, que já solta a tela
          [0.04, 0.375, 0.625, 0.875].forEach((f, k) => lista.push({ y: st.start + (st.end - st.start) * f, grupo: gi, primeira: k === 0 }));
          return;
        }
      }
      if (g.tops) { g.tops.forEach((y, k) => lista.push({ y, grupo: gi, primeira: k === 0 })); return; }
      if (fim - ini <= H() + 2 || g.modo === "caber") { lista.push({ y: ini, grupo: gi, primeira: true }); return; }
      // grupo maior que a tela: paradas no começo de cards/títulos/parágrafos, cada uma até uma tela depois da outra
      const marcos = Array.from(new Set(
        g.secs.flatMap((s) => Array.from(s.querySelectorAll<HTMLElement>(".section-title, h2, h3, .card, .project, .faq__item, .about__item, .work__grupo, .hero__linha, .hero__sub, p")))
          .map((el) => Math.round(topoDoc(el) - ch - 16)),
      )).filter((y) => y > ini + 40 && y < fim - 40).sort((a, b) => a - b);
      let y = ini;
      lista.push({ y, grupo: gi, primeira: true });
      const ultimoY = fim - H();
      while (y < ultimoY - 4) {
        const cand = marcos.filter((m) => m > y + H() * 0.25 && m <= y + H() * 0.98);
        let prox = cand.length ? cand[cand.length - 1] : y + H() * 0.9;
        if (prox > ultimoY) prox = ultimoY;
        if (prox <= y + 4) break;
        y = prox;
        lista.push({ y, grupo: gi, primeira: false });
      }
    });
    paradas = lista.map((p) => ({ ...p, y: Math.max(0, Math.round(p.y)) }));
  };

  // ---------- 3) navegação ----------
  let atual = 0, trocando = false;
  const maisPerto = () => {
    const y = window.scrollY;
    let m = 0;
    paradas.forEach((p, i) => { if (Math.abs(p.y - y) < Math.abs(paradas[m].y - y)) m = i; });
    return m;
  };
  const rolar = (y: number, dur: number) => new Promise<void>((ok) => {
    const o = { y: window.scrollY };
    gsap.to(o, { y, duration: dur, ease: "power3.inOut", onUpdate: () => { window.scrollTo(0, o.y); lenis?.scrollTo(o.y, { immediate: true, force: true }); }, onComplete: () => ok() });
  });

  // carrossel: cópia visual da página que entra (só o que está na tela), deslizando junto com a real que sai
  const carrossel = async (destino: Parada, dir: 1 | -1) => {
    const g = grupos[destino.grupo];
    const palco = document.createElement("main");
    palco.className = "pagina-copia";
    palco.setAttribute("aria-hidden", "true");
    const dentro = document.createElement("div");
    dentro.style.position = "absolute"; dentro.style.left = "0"; dentro.style.right = "0";
    // Metodologia (tela travada): a parte fixa aparece sempre no alto da tela, então a cópia não é deslocada
    dentro.style.top = g.ajustar === "metodo" ? "0px" : `${topoDoc(g.secs[0]) - destino.y}px`;
    g.secs.forEach((s) => {
      const c = s.cloneNode(true) as HTMLElement;
      c.removeAttribute("id");
      c.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
      c.querySelectorAll("canvas").forEach((n) => n.remove());
      // a cópia mostra a página PRONTA (texto já no lugar), como no vídeo de referência
      c.querySelectorAll<HTMLElement>("[style]").forEach((n) => { ["transform", "opacity", "filter", "visibility", "clip-path", "translate", "rotate", "scale"].forEach((k) => n.style.removeProperty(k)); });
      // vídeo na cópia: só a imagem de capa (sem tocar nem baixar de novo)
      c.querySelectorAll("video").forEach((n) => { n.removeAttribute("autoplay"); n.preload = "none"; n.querySelectorAll("source").forEach((x) => x.remove()); });
      dentro.appendChild(c);
    });
    palco.appendChild(dentro);
    document.body.appendChild(palco);
    const real = [q("main"), q(".footer")].filter(Boolean) as HTMLElement[];
    const W = window.innerWidth;
    gsap.set(palco, { x: W * dir });
    await new Promise<void>((ok) => {
      gsap.timeline({ onComplete: () => ok() })
        .to(real, { x: -W * dir, duration: 0.9, ease: "power3.inOut" }, 0)
        .to(palco, { x: 0, duration: 0.9, ease: "power3.inOut" }, 0);
    });
    // a página real também fica PRONTA na chegada (sem o texto "aparecendo" depois da troca)
    ScrollTrigger.getAll().forEach((st) => {
      const t = st.trigger as HTMLElement | undefined;
      if (!t || st.pin || st.vars.scrub || !g.secs.some((s) => s.contains(t))) return;
      st.animation?.progress(1);
    });
    window.scrollTo(0, destino.y); lenis?.scrollTo(destino.y, { immediate: true, force: true });
    gsap.set(real, { clearProps: "transform" });
    // a cópia fica por cima mais um instante enquanto a página real termina de montar (sem piscar em branco)
    await new Promise<void>((ok) => setTimeout(ok, 700));
    await new Promise<void>((ok) => { gsap.to(palco, { opacity: 0, duration: 0.25, onComplete: () => ok() }); });
    palco.remove();
  };

  const ir = async (n: number) => {
    if (trocando || n < 0 || n >= paradas.length || n === atual) return;
    trocando = true;
    html.classList.add("trocando-pagina");
    const de = paradas[atual], para = paradas[n];
    const dir: 1 | -1 = n > atual ? 1 : -1;
    try {
      const mudaGrupo = de.grupo !== para.grupo;
      // COMPUTADOR: acabou o bloco → a página seguinte entra INTEIRA pela direita (qualquer troca de bloco);
      // dentro do mesmo bloco as páginas descem. CELULAR: tudo em linha reta, sem troca lateral (pedido do Victor).
      const lado = mudaGrupo && window.innerWidth > 760;
      atual = n; // decidido ANTES de andar: nenhum evento de rolagem no caminho muda a página
      nossoAte = performance.now() + 5000;
      if (lado) await carrossel(para, dir);
      else await rolar(para.y, mudaGrupo ? 1.0 : 0.85);
      nossoAte = performance.now() + 400;
    } catch {
      desligar();
    } finally {
      html.classList.remove("trocando-pagina");
      setTimeout(() => { trocando = false; }, 450);
    }
  };

  // ---------- 4) gestos ----------
  let ultimoGesto = 0;
  const gesto = (d: 1 | -1) => { if (!trocando) ir(atual + d); };
  const roda = (ev: WheelEvent) => {
    if (html.classList.contains("historia-travada") || document.body.classList.contains("em-voo")) return;
    // segura a página: o navegador E a rolagem suave do site (a abertura religa a rolagem suave depois do início)
    ev.preventDefault(); ev.stopPropagation(); lenis?.stop();
    const agora = performance.now(), novo = agora - ultimoGesto > 650; // 650 ms de silêncio = gesto novo (mesmo com a tela pesada no meio da troca)
    ultimoGesto = agora;
    if (novo && Math.abs(ev.deltaY) > 2 && !trocando) gesto(ev.deltaY > 0 ? 1 : -1);
  };
  let y0 = 0, x0 = 0;
  const toqueIni = (ev: TouchEvent) => { y0 = ev.touches[0].clientY; x0 = ev.touches[0].clientX; };
  const toqueMove = (ev: TouchEvent) => {
    if (document.body.classList.contains("em-voo")) return;
    const dy = y0 - ev.touches[0].clientY, dx = x0 - ev.touches[0].clientX;
    if (Math.abs(dx) > Math.abs(dy)) return; // deslize para o lado (cards de Serviços) continua livre
    if (atual === 0 && dy < 0 && window.scrollY <= 1) return; // "puxar para atualizar" no topo
    ev.preventDefault(); ev.stopPropagation(); lenis?.stop();
  };
  const toqueFim = (ev: TouchEvent) => {
    if (document.body.classList.contains("em-voo")) return;
    const dy = y0 - ev.changedTouches[0].clientY, dx = x0 - ev.changedTouches[0].clientX;
    if (Math.abs(dy) > 30 && Math.abs(dy) > Math.abs(dx)) gesto(dy > 0 ? 1 : -1);
  };
  const tecla = (ev: KeyboardEvent) => {
    const alvo = ev.target as HTMLElement | null;
    if (alvo && /input|textarea|select/i.test(alvo.tagName)) return;
    if (["ArrowDown", "PageDown", " "].includes(ev.key)) { ev.preventDefault(); gesto(1); }
    if (["ArrowUp", "PageUp"].includes(ev.key)) { ev.preventDefault(); gesto(-1); }
  };
  // menu/voo/âncoras: depois que a rolagem para, a página atual passa a ser a parada mais próxima
  // A página atual é SEMPRE a que este código escolheu. Só uma rolagem de FORA (voo do menu, link) muda isso,
  // e só quando a tela parou longe da página atual.
  let parada: ReturnType<typeof setTimeout> | undefined;
  let nossoAte = 0;
  const aoRolar = () => {
    if (trocando || performance.now() < nossoAte) return;
    clearTimeout(parada);
    parada = setTimeout(() => { if (!trocando && Math.abs(window.scrollY - paradas[atual].y) > 60) atual = maisPerto(); }, 250);
  };
  // alturas mudaram (fotos, vídeo, fontes, janela): recalcula e REALINHA na mesma página
  const recalcular = () => {
    if (trocando) { setTimeout(recalcular, 500); return; }
    ScrollTrigger.refresh(); calcular();
    atual = Math.min(atual, paradas.length - 1);
    nossoAte = performance.now() + 400;
    window.scrollTo(0, paradas[atual].y); lenis?.scrollTo(paradas[atual].y, { immediate: true, force: true });
  };

  calcular();
  atual = maisPerto();
  lenis?.stop();
  window.addEventListener("wheel", roda, { passive: false, capture: true });
  window.addEventListener("touchstart", toqueIni, { passive: true });
  window.addEventListener("touchmove", toqueMove, { passive: false, capture: true });
  window.addEventListener("touchend", toqueFim, { passive: true });
  window.addEventListener("keydown", tecla, { capture: true });
  window.addEventListener("scroll", aoRolar, { passive: true });
  let rz: ReturnType<typeof setTimeout> | undefined;
  const aoRedimensionar = () => { clearTimeout(rz); rz = setTimeout(recalcular, 300); };
  window.addEventListener("resize", aoRedimensionar);
  // imagens e fontes mudam alturas depois do carregamento
  window.addEventListener("load", () => recalcular());
  setTimeout(recalcular, 1800);

  function desligar() {
    window.removeEventListener("wheel", roda, { capture: true });
    window.removeEventListener("touchstart", toqueIni);
    window.removeEventListener("touchmove", toqueMove, { capture: true });
    window.removeEventListener("touchend", toqueFim);
    window.removeEventListener("keydown", tecla, { capture: true });
    window.removeEventListener("scroll", aoRolar);
    window.removeEventListener("resize", aoRedimensionar);
    html.classList.remove("modo-paginas", "trocando-pagina");
    grupos.forEach((g) => g.secs.forEach((s) => { s.style.zoom = ""; s.style.minHeight = ""; s.style.paddingTop = ""; s.style.paddingBottom = ""; s.querySelectorAll<HTMLElement>(":scope > *").forEach((e) => { e.style.zoom = ""; e.style.marginTop = ""; e.style.width = ""; e.style.marginLeft = ""; e.style.marginRight = ""; }); }));
    lenis?.start();
  }
  // acesso para depuração/teste
  (window as unknown as { __paginas?: unknown }).__paginas = { paradas: () => paradas, atual: () => atual, ir };
  return desligar;
}
