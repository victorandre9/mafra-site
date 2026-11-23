/**
 * SITE EM PÁGINAS DE TELA CHEIA (especificação aprovada pelo Victor, 23/11/2026)
 *
 * - Cada GRUPO (uma ou mais seções da mesma cor) vira uma ou mais "paradas" do tamanho exato da tela.
 *   Conteúdo menor que a tela é AMPLIADO (zoom) até preencher; maior que a tela, mas não muito, é REDUZIDO até caber
 *   (os 6 cards de Serviços cabem numa página). Só quando não cabe de jeito nenhum (Cases, Perguntas) vira várias
 *   paradas da mesma cor, cortadas no começo de um card/parágrafo.
 * - UM GESTO = UMA PARADA (roda, trackpad, dedo ou tecla; forte ou fraco). Durante a troca nenhum gesto conta.
 * - Troca de BLOCO (computador): a página atual sai pela ESQUERDA e a próxima entra pela DIREITA ao mesmo tempo, só na
 *   horizontal. É a PRÓPRIA página que desliza (nada de cópia): chega pronta, sem piscar. Dentro do bloco: DESCE.
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
      g.secs.forEach((s) => { s.style.zoom = ""; s.style.minHeight = ""; s.style.removeProperty("--inv-zoom"); s.style.removeProperty("padding-top"); });
      if (g.pedacos) { ajustarPedacos(g); return; }
      const altura = g.secs.reduce((a, s) => a + s.getBoundingClientRect().height, 0);
      // o começo do conteúdo nunca fica atrás da barra do topo: o respiro de cima da 1ª seção é, no mínimo, a barra + 12 px
      const ch = cabecalho(), primeira = g.secs[0];
      const respiro0 = parseFloat(getComputedStyle(primeira).paddingTop) || 0;
      const util = H() - 12;
      let z = (util - Math.max(0, ch + 12 - respiro0)) / Math.max(1, altura); // estimativa; o laço abaixo corrige medindo
      // Serviços (6 cards) é sempre UMA página no computador (pedido do Victor): aceita encolher até 60%
      // computador: toda página cabe na tela (aceita encolher até 60%); celular nem usa este modo
      // computador: SEMPRE uma página só (aceita encolher até 50%); o manifesto não cresce além do tamanho normal
      const minimo = cel ? 0.7 : 0.5;
      const teto = cel ? 1.15 : g.secs.some((x) => x.matches(".manifesto")) ? 1 : g.secs.some((x) => x.matches(".hero")) ? 1.25 : 1.5;
      if (z < minimo) { g.modo = "dividir"; return; }
      g.modo = "caber";
      z = Math.min(z, teto);
      // --inv-zoom: o fundo de largura total (100vw) encolheria junto com o zoom; o CSS compensa com ele
      const aplicar = (v: number) => {
        g.secs.forEach((s) => { s.style.zoom = String(v); s.style.setProperty("--inv-zoom", String(1 / v)); });
        primeira.style.setProperty("padding-top", `${Math.max(respiro0, (ch + 12) / v)}px`, "important");
      };
      aplicar(z);
      // com zoom a largura útil muda (imagens com proporção ficam mais altas/baixas): corrige medindo de novo
      for (let k = 0; k < 4; k++) {
        const real = g.secs.reduce((a2, s) => a2 + s.getBoundingClientRect().height, 0);
        if (Math.abs(real - util) < 6 || (z >= teto && real < util)) break;
        z = Math.min(z * (util / real), teto);
        aplicar(z);
      }
      // ampliando: se algo passar da largura da tela (texto quebrando para fora), recua até caber
      const vazou = () => g.secs.some((s) => s.scrollWidth > s.clientWidth + 2);
      while (z > 1 && vazou()) { z = Math.max(1, z - 0.05); aplicar(z); }
      const soma = g.secs.reduce((a, s) => a + s.getBoundingClientRect().height, 0);
      const ultima = g.secs[g.secs.length - 1];
      const falta = H() - soma;
      // a sobra vai para o TOPO (o vídeo cresce e a faixa fica no pé da tela); nos outros grupos, para a última seção
      const enche = g.secs.find((x) => x.matches(".hero")) ?? ultima;
      if (falta > 0) enche.style.minHeight = `${(enche.getBoundingClientRect().height + falta) / z}px`;
    });
  };

  // pedaços: cada pedaço é uma página inteira — zoom próprio para ocupar a tela e começo exatamente uma tela depois do anterior
  // posição de LAYOUT (sem a animação de entrada, que desloca o texto com `transform` até ele aparecer)
  const semAnim = <T,>(e: HTMLElement, f: () => T): T => {
    const t = e.style.transform, tr = e.style.translate;
    e.style.transform = "none"; e.style.translate = "none";
    try { return f(); } finally { e.style.transform = t; e.style.translate = tr; }
  };
  const topoLayout = (e: HTMLElement) => semAnim(e, () => topoDoc(e));
  const baseLayout = (e: HTMLElement) => semAnim(e, () => e.getBoundingClientRect().bottom + window.scrollY);
  const ajustarPedacos = (g: Grupo) => {
    const sec = g.secs[0];
    const els = g.pedacos!.map((sels) => sels.map((x) => sec.querySelector(x) as HTMLElement | null).filter(Boolean) as HTMLElement[]);
    els.flat().forEach((e) => { e.style.zoom = ""; e.style.marginTop = ""; e.style.width = ""; e.style.marginLeft = ""; e.style.marginRight = ""; });
    // largura FIXA antes do zoom: assim o conteúdo encolhe por igual (sem isso, com zoom a largura útil cresce,
    // as imagens ficam mais altas e a página nunca cabe). Em tela muito larga, no máximo 1500 px.
    els.flat().forEach((e) => { e.style.marginLeft = "auto"; e.style.marginRight = "auto"; });
    // LARGURA NA TELA fixa (até 1800 px, 90% da tela): a largura de layout é ela ÷ zoom. Assim, quanto mais a página
    // precisa encolher, mais largos ficam os cards por dentro — o texto ocupa menos linhas e a letra pode ser MAIOR
    // (Victor, 23/11/2026: "ilegível de tão pequena"). As imagens têm altura fixa no CSS, então não crescem junto.
    const largTela = Math.min(window.innerWidth * 0.9, 1800);
    // 1 px (e não 0): sem isso a margem do 1º item "atravessa" a seção e empurra a seção inteira em vez do conteúdo
    sec.style.paddingTop = "1px"; sec.style.paddingBottom = "0px";
    const ch = cabecalho(), util = H() - ch - 48; // folga embaixo: o card do fim nunca encosta na borda
    const zs = els.map((lista) => {
      if (!lista.length) return 1;
      const h = baseLayout(lista[lista.length - 1]) - topoLayout(lista[0]);
      let z = Math.min(1.3, util / Math.max(1, h));
      const medir = () => baseLayout(lista[lista.length - 1]) - topoLayout(lista[0]);
      const aplicarZ = (v: number) => lista.forEach((e) => { e.style.zoom = String(v); e.style.width = `${largTela / v}px`; });
      aplicarZ(z);
      for (let k = 0; k < 10; k++) { // zoom muda a largura → texto e imagens mudam de altura: mede de novo e corrige
        const real = medir();
        if ((real <= util && real > util - 12) || (z >= 1.3 && real < util)) break;
        z = Math.min(1.3, z * Math.pow((util - 4) / real, 0.7));
        aplicarZ(z);
      }
      if (medir() > util) { for (let k = 0; k < 12 && medir() > util; k++) { z *= 0.97; aplicarZ(z); } } // garantia: nunca passa da tela
      return z;
    });
    const topo = topoDoc(sec);
    g.tops = [];
    els.forEach((lista, i) => {
      if (!lista.length) return;
      const alvo = topo + i * H() + ch + 16;
      // mede e corrige até acertar: margens que se juntam ("colapsam") com o card de cima engoliam parte do deslocamento
      let mt = 0;
      for (let k = 0; k < 4; k++) {
        const d = alvo - topoLayout(lista[0]);
        if (Math.abs(d) < 1) break;
        mt += d / zs[i];
        lista[0].style.marginTop = `${mt}px`;
      }
      g.tops!.push(i * H()); // relativo ao começo da seção (a posição absoluta é lida depois do refresh)
    });
    const falta = topo + els.length * H() - (topoDoc(sec) + sec.getBoundingClientRect().height);
    sec.style.paddingBottom = `${Math.max(0, falta)}px`;
  };

  // ---------- 2) paradas ----------
  let paradas: Parada[] = [];
  const calcular = () => {
    ajustarTamanhos();
    // os gatilhos (Metodologia travada, animações) medem DEPOIS do encaixe; antes eles ficavam ~250 px fora do lugar
    ScrollTrigger.refresh();
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
      if (g.tops) { g.tops.forEach((y, k) => lista.push({ y: ini + y, grupo: gi, primeira: k === 0 })); return; }
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

  // ---------- troca de bloco: a PRÓPRIA página desliza de lado (sem cópia, sem "piscar", sem reajuste na chegada) ----------
  // A rolagem fica parada na página atual. A página que entra (que está logo abaixo/acima no site) é deslocada com
  // `translate` para dentro da tela, começando da direita; a atual sai pela esquerda. No fim, na MESMA linha de código:
  // tira os deslocamentos, leva a rolagem até a página nova e avisa os gatilhos — na tela nada muda, ela já estava ali.
  const pinoDo = (g: Grupo) => ScrollTrigger.getAll().find((t) => t.pin && g.secs.some((s) => s.contains(t.trigger as Node)));

  // deixa a página de destino PRONTA antes de aparecer: animações de entrada terminadas, contadores disparados e
  // as animações ligadas à rolagem já no ponto em que ficarão na chegada
  const prepararDestino = (g: Grupo, y: number, lateral: boolean) => {
    ScrollTrigger.getAll().forEach((st) => {
      const t = st.trigger as HTMLElement | undefined;
      if (!t || !g.secs.some((s) => s.contains(t))) return;
      if (st.vars.scrub) {
        if (!lateral || !st.animation) return;
        const prog = gsap.utils.clamp(0, 1, (y - st.start) / Math.max(1, st.end - st.start));
        st.animation.progress(prog);
        if (st.pin && typeof st.vars.onUpdate === "function") st.vars.onUpdate({ ...st, progress: prog } as never); // etapa da Metodologia
        return;
      }
      if (st.pin) return;
      if (st.animation) st.animation.progress(1);
      else if (st.vars.once && typeof st.vars.onEnter === "function") st.vars.onEnter(st);
    });
  };

  // o que se mexe de cada grupo: as seções; mas um elemento TRAVADO (fixo na tela) se mexe sozinho, senão ele "pula"
  const pecas = (g: Grupo) => {
    const fixos = g.secs.flatMap((s) => Array.from(s.querySelectorAll<HTMLElement>(".pin-spacer > *"))).filter((e) => getComputedStyle(e).position === "fixed");
    return fixos.length ? fixos : g.secs;
  };
  // deslocamento com `translate` (não mexe nas animações, que usam `transform`); o fator corrige o zoom da seção
  const fatorZoom = (e: HTMLElement) => {
    const antes = e.style.translate;
    const x0 = e.getBoundingClientRect().left;
    e.style.translate = "1000px 0px";
    const f = (e.getBoundingClientRect().left - x0) / 1000 || 1;
    e.style.translate = antes;
    return f;
  };

  const avisarRobo = (fase: "inicio" | "fim", n: number, secs: HTMLElement[], dx: number, dy: number) =>
    window.dispatchEvent(new CustomEvent("mafra:pagina", { detail: { fase, n, secs, dx, dy } }));

  const deslizar = async (de: Parada, para: Parada, dir: 1 | -1) => {
    const g1 = grupos[de.grupo], g2 = grupos[para.grupo];
    const W = window.innerWidth;
    prepararDestino(g2, para.y, true);
    // onde a página de destino está HOJE no site (a Metodologia travada: começo ou fim da trava, conforme o lado)
    let alvo = para.y;
    const pino = pinoDo(g2);
    // (a parte travada fica no alto da tela na chegada: o alvo é onde ela está agora no site)
    if (pino && para.y > pino.start && para.y < pino.end && pino.pin) alvo = topoDoc(pino.pin);
    const dy = alvo - window.scrollY;
    const sai = pecas(g1).map((e) => ({ e, f: fatorZoom(e), antes: e.style.translate }));
    const entra = g2.secs.map((e) => ({ e, f: fatorZoom(e), antes: e.style.translate }));
    const pos = (p: number) => {
      sai.forEach(({ e, f }) => { e.style.translate = `${(-W * dir * p) / f}px 0px`; });
      entra.forEach(({ e, f }) => { e.style.translate = `${(W * dir * (1 - p)) / f}px ${-dy / f}px`; });
    };
    pos(0);
    // o robô já escolhe o lugar dele na página que está chegando (que agora está deslocada de uma tela para o lado)
    avisarRobo("inicio", paradas.indexOf(para), g2.secs, -W * dir, 0);
    await new Promise<void>((ok) => {
      const o = { p: 0 };
      gsap.to(o, { p: 1, duration: 0.9, ease: "power3.inOut", onUpdate: () => pos(o.p), onComplete: () => ok() });
    });
    // chegada: tudo no mesmo instante (nenhum quadro desenhado no meio)
    [...sai, ...entra].forEach(({ e, antes }) => { e.style.translate = antes; });
    window.scrollTo(0, para.y); lenis?.scrollTo(para.y, { immediate: true, force: true });
    ScrollTrigger.update();
  };

  // imagens: carregadas e decodificadas desde o começo, para nenhuma "aparecer" no meio de uma troca
  const preCarregar = () => {
    document.querySelectorAll<HTMLImageElement>("main img, .footer img").forEach((img) => {
      if (img.loading === "lazy") img.loading = "eager";
      img.decode?.().catch(() => {});
    });
  };

  const ir = async (n: number) => {
    if (trocando || n < 0 || n >= paradas.length || n === atual) return;
    trocando = true;
    html.classList.add("pagina-andando"); // (sem esconder a barra de rolagem: no Windows isso alargava a página e tudo se reorganizava)
    const de = paradas[atual], para = paradas[n];
    const dir: 1 | -1 = n > atual ? 1 : -1;
    try {
      const mudaGrupo = de.grupo !== para.grupo;
      // REGRA DO VICTOR (23/11/2026): tela CLARA → AZUL = a página entra pela DIREITA; AZUL → CLARA = entra DE BAIXO
      // PARA CIMA; mesmo tema (e azul → azul) desce. Voltando, o caminho inverso. Salto pelo mapa do site (pula
      // vários temas) = sempre de lado, para não passar rolando por todas as telas do meio. CELULAR: tudo em linha reta.
      const [ga, gb] = de.grupo < para.grupo ? [de.grupo, para.grupo] : [para.grupo, de.grupo];
      const vizinho = gb - ga === 1;
      const claroParaAzul = grupos[ga].cor === "claro" && grupos[gb].cor === "azul";
      const lado = mudaGrupo && window.innerWidth > 760 && (!vizinho || claroParaAzul);
      atual = n; // decidido ANTES de andar: nenhum evento de rolagem no caminho muda a página
      nossoAte = performance.now() + 5000;
      if (lado) await deslizar(de, para, dir);
      else {
        const g = grupos[para.grupo];
        prepararDestino(g, para.y, false);
        // dentro da parte travada (Metodologia) a tela não anda: as posições ficam onde estão
        const pino = pinoDo(g);
        const travado = !!pino && pino.isActive && para.y >= pino.start && para.y <= pino.end;
        avisarRobo("inicio", n, g.secs, 0, travado ? 0 : -(para.y - window.scrollY));
        await rolar(para.y, mudaGrupo ? 1.0 : 0.85);
      }
      avisarRobo("fim", n, grupos[para.grupo].secs, 0, 0);
      nossoAte = performance.now() + 400;
    } catch {
      desligar();
    } finally {
      html.classList.remove("pagina-andando");
      setTimeout(() => { trocando = false; }, 250);
    }
  };

  // ---------- 4) gestos ----------
  // GESTO NOVO (roda do mouse ou trackpad): 1) a mão parou por 220 ms; 2) mudou de direção; 3) no meio do "embalo"
  // do trackpad, o movimento voltou a CRESCER (nova passada). Antes eram 650 ms de silêncio obrigatório: quem
  // continuava rolando (ex.: no fim, querendo voltar) ficava preso até parar ou clicar.
  let ultimoEv = 0, ultimoSinal = 0, ultimoAbs = 0;
  const gesto = (d: 1 | -1) => { if (!trocando) ir(atual + d); };
  const roda = (ev: WheelEvent) => {
    if (html.classList.contains("historia-travada") || document.body.classList.contains("em-voo")) return;
    // segura a página: o navegador E a rolagem suave do site (a abertura religa a rolagem suave depois do início)
    ev.preventDefault(); ev.stopPropagation(); lenis?.stop();
    const d = ev.deltaMode === 1 ? ev.deltaY * 16 : ev.deltaMode === 2 ? ev.deltaY * H() : ev.deltaY;
    const abs = Math.abs(d), sinal = Math.sign(d);
    if (abs < 1) return;
    // hora em que o movimento ACONTECEU (não a hora em que o código rodou: com a tela ocupada na troca, os eventos
    // chegam atrasados e em bloco, e um "embalo" do trackpad parecia vários gestos)
    const agora = ev.timeStamp || performance.now();
    const pausa = agora - ultimoEv > 220;
    const virou = sinal !== ultimoSinal;
    const acelerou = abs >= 15 && abs > ultimoAbs * 1.6 + 4;
    ultimoEv = agora; ultimoSinal = sinal; ultimoAbs = abs;
    if (!trocando && (pausa || virou || acelerou)) gesto(sinal > 0 ? 1 : -1);
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
    calcular();
    atual = Math.min(atual, paradas.length - 1);
    nossoAte = performance.now() + 400;
    window.scrollTo(0, paradas[atual].y); lenis?.scrollTo(paradas[atual].y, { immediate: true, force: true });
  };

  calcular();
  atual = maisPerto();

  // ---------- 5) NAVEGAÇÃO SEM ROLAGEM (Victor, 23/11/2026): mapa do site na lateral + setas ----------
  // Para quem não tem roda/trackpad à mão (ou não percebe que o site anda por rolagem). O mapa tem uma bolinha por
  // tema (o nome aparece ao passar o mouse); a do tema atual fica alongada. As setas passam para a tela anterior/próxima.
  // Tudo usa o MESMO ir() da rolagem: mesma transição, mesma regra de uma tela por vez.
  const NOMES: Array<[string, string]> = [[".hero", "Início"], [".manifesto", "Propósito"], [".services", "Serviços"], ["#metodo", "Método"],
    [".stats", "Números"], ["#cases", "Cases"], ["#sobre", "Sobre"], [".bigtext", "Perguntas"], ["#contato", "Contato"], [".footer", "Fim"]];
  const nomeDo = (g: Grupo) => NOMES.find(([sel]) => g.secs[0].matches(sel))?.[1] ?? "";
  const mapa = document.createElement("nav");
  mapa.className = "pg-mapa"; mapa.setAttribute("aria-label", "Mapa do site");
  const pontos = grupos.map((g, gi) => {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.nome = nomeDo(g); b.setAttribute("aria-label", `Ir para ${nomeDo(g)}`);
    b.addEventListener("click", () => { const k = paradas.findIndex((p2) => p2.grupo === gi); if (k >= 0) ir(k); });
    mapa.appendChild(b);
    return b;
  });
  const setas = document.createElement("div");
  setas.className = "pg-setas";
  const seta = (dir: 1 | -1, rotulo: string) => {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", rotulo); b.dataset.nome = rotulo;
    b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${dir > 0 ? "M6 9l6 6 6-6" : "M6 15l6-6 6 6"}"/></svg>`;
    b.addEventListener("click", () => gesto(dir));
    setas.appendChild(b);
    return b;
  };
  const setaSobe = seta(-1, "Tela anterior"), setaDesce = seta(1, "Próxima tela");
  document.body.append(mapa, setas);
  const marcarNav = () => {
    const g = paradas[atual]?.grupo ?? 0;
    pontos.forEach((b, i) => { b.classList.toggle("is-on", i === g); if (i === g) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
    setaSobe.disabled = atual <= 0; setaDesce.disabled = atual >= paradas.length - 1;
    // fundo do tema atual (claro/azul): o mapa e as setas trocam de cor para continuar visíveis
    html.classList.toggle("pg-no-azul", grupos[g]?.cor === "azul");
  };
  marcarNav();
  const vigiaNav = setInterval(marcarNav, 300); // (barato: só troca classes) — pega também o voo do menu e a volta ao topo
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
  window.addEventListener("load", () => { recalcular(); preCarregar(); }); // imagens já na espera, não no meio da abertura
  // se alguma página MUDAR DE ALTURA sozinha (número que terminou de contar, imagem que carregou, pergunta aberta),
  // o site se reencaixa — senão todas as páginas abaixo dela ficavam deslocadas (títulos atrás da barra do topo)
  const alturas = new Map<Element, number>();
  let roT: ReturnType<typeof setTimeout> | undefined, roCalmoAte = 0;
  const marcarAlturas = () => grupos.forEach((g) => g.secs.forEach((s2) => alturas.set(s2, Math.round(s2.getBoundingClientRect().height))));
  const ro = new ResizeObserver(() => {
    if (performance.now() < roCalmoAte) return;
    const mudou = grupos.some((g) => g.secs.some((s2) => Math.abs(Math.round(s2.getBoundingClientRect().height) - (alturas.get(s2) ?? 0)) > 2));
    if (!mudou) return;
    clearTimeout(roT);
    roT = setTimeout(() => { recalcular(); roCalmoAte = performance.now() + 600; setTimeout(marcarAlturas, 100); }, 350);
  });
  setTimeout(() => { marcarAlturas(); grupos.forEach((g) => g.secs.forEach((s2) => ro.observe(s2))); }, 2500);
  setTimeout(preCarregar, 4000);
  setTimeout(recalcular, 1800);

  function desligar() {
    clearInterval(vigiaNav); mapa.remove(); setas.remove(); html.classList.remove("pg-no-azul");
    ro.disconnect(); clearTimeout(roT);
    window.removeEventListener("wheel", roda, { capture: true });
    window.removeEventListener("touchstart", toqueIni);
    window.removeEventListener("touchmove", toqueMove, { capture: true });
    window.removeEventListener("touchend", toqueFim);
    window.removeEventListener("keydown", tecla, { capture: true });
    window.removeEventListener("scroll", aoRolar);
    window.removeEventListener("resize", aoRedimensionar);
    html.classList.remove("modo-paginas", "pagina-andando");
    grupos.forEach((g) => g.secs.forEach((s) => { s.style.zoom = ""; s.style.minHeight = ""; s.style.paddingTop = ""; s.style.paddingBottom = ""; s.querySelectorAll<HTMLElement>(":scope > *").forEach((e) => { e.style.zoom = ""; e.style.marginTop = ""; e.style.width = ""; e.style.marginLeft = ""; e.style.marginRight = ""; }); }));
    lenis?.start();
  }
  // acesso para depuração/teste
  (window as unknown as { __paginas?: unknown }).__paginas = { paradas: () => paradas, atual: () => atual, ir };
  return desligar;
}
