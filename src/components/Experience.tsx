"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Lenis from "lenis";
import { iniciarPaginas } from "@/lib/paginas";
import { EV_ABERTURA, esperar3D } from "@/lib/abertura";


/**
 * Orquestra todas as animações da página: preloader, smooth scroll, cursor,
 * elementos magnéticos, seções pinadas, contadores e o voo do drone.
 * Não renderiza nada — só liga o comportamento ao HTML gerado no servidor.
 */
export default function Experience() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // Animações sempre ativas: a experiência em movimento é parte do produto.
    const reduce = false;
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const $ = (s: string, c: ParentNode = document) => c.querySelector(s) as HTMLElement;
    const $$ = <T extends HTMLElement = HTMLElement>(s: string, c: ParentNode = document) => [...c.querySelectorAll<T>(s)];

    const cleanups: Array<() => void> = [];
    const on = <K extends keyof WindowEventMap>(
      target: Window | HTMLElement | Document,
      type: K | string,
      fn: (e: never) => void,
      opts?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, fn as EventListener, opts);
      cleanups.push(() => target.removeEventListener(type, fn as EventListener, opts));
    };

    /* ---------- Smooth scroll (Lenis) ---------- */
    let lenis: Lenis | null = null;
    const raf = (t: number) => lenis?.raf(t * 1000);
    if (!reduce) {
      // No celular mantém a rolagem nativa (mais fluida e econômica); no desktop, suaviza.
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }

    const ctx = gsap.context(() => {
      /* ---------- Âncoras suaves ---------- */
      $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
        on(a, "click", (e: MouseEvent) => {
          const id = a.getAttribute("href") || "#";
          const target: HTMLElement | number | null = id === "#" || id === "#top" ? 0 : $(id);
          if (target === null) return;
          e.preventDefault();
          document.body.classList.remove("menu-open");
          // MENU DO TOPO no computador: o robô voa até o tema (pedido do Victor, 18/11/2026) —
          // 3 s no 1º tema, 4 s no 2º, 5 s no 3º… A animação mora junto do robô, mais abaixo.
          // vale no computador (menu do topo) e no celular (menu que abre no botão ☰) — pedido do Victor
          const iDesk = $$(".nav .nav__link").indexOf(a);
          let iNav = iDesk >= 0 ? iDesk : $$(".mobile-menu a").indexOf(a);
          // botões do topo ("Conversar sobre o diagnóstico", "Conhecer o método"): mesmo voo do menu,
          // com o tempo do tema de destino (Método 4 s, Contato 7 s)
          if (iNav < 0 && a.closest(".hero__ctas")) iNav = $$(".nav .nav__link").findIndex((n) => n.getAttribute("href") === id);
          if (lenis && iNav >= 0 && typeof target !== "number") {
            window.dispatchEvent(new CustomEvent("mafra:voo", { detail: { alvo: target, dur: 3 + iNav } }));
            return;
          }
          if (lenis) lenis.scrollTo(target, { duration: 1.6 });
          else if (target === 0) window.scrollTo(0, 0);
          else if (typeof target !== "number") target.scrollIntoView();
        });
      });

      /* ---------- ABERTURA "PORTAL" → intro (Victor, 23/11/2026; refinada) ----------
         ESPERA: fundo com estrelas calmas enquanto a página, o vídeo do topo e as DUAS cenas 3D ficam prontos (mín. 2 s,
         máx. 7 s) — o 3D montando no meio da apresentação era o que travava no Windows/Chrome. Durante a abertura o 3D
         para de desenhar (src/lib/abertura.ts). SEQUÊNCIA (~3,9 s): logo ORIGINAL surge grande (desfoque → nítida, girando),
         anéis, anel de luz que se desenha e raios → brilho atravessa e sobe o slogan → CARGA (estrelas em dobra) → FLASH
         com risco de luz e faíscas + onda de choque → PORTAL (--furo) revela o site com o vídeo rodando. */
      const pre = $(".preloader");
      const ceu = $(".ab-estrelas") as HTMLCanvasElement | null;
      const warp = { v: 0.35, a: 1 };
      let ceuVivo = true;
      if (ceu) {
        const ctx2 = ceu.getContext("2d", { alpha: true });
        // 1x no computador comum: o céu é traço fino em movimento, não precisa de retina (e pesava 4x)
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const n = window.innerWidth <= 760 ? 110 : 190;
        const CORES = ["255,255,255", "127,227,173", "52,210,122"];
        type Est = { ang: number; d: number; vel: number; c: number; larg: number };
        const nova = (longe = false): Est => ({ ang: Math.random() * Math.PI * 2, d: longe ? Math.random() * 0.9 : Math.random() * 0.08, vel: 0.35 + Math.random() * 0.9,
          c: Math.random() < 0.25 ? 0 : Math.random() < 0.6 ? 1 : 2, larg: 0.6 + Math.random() * 1.4 });
        const est: Est[] = Array.from({ length: n }, () => nova(true));
        let ult = performance.now();
        const passo = (agora: number) => {
          if (!ceuVivo || !ctx2) return;
          const dt = Math.min(0.05, (agora - ult) / 1000); ult = agora;
          const W = window.innerWidth, H = window.innerHeight;
          if (ceu.width !== Math.round(W * dpr)) { ceu.width = Math.round(W * dpr); ceu.height = Math.round(H * dpr); }
          ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx2.clearRect(0, 0, W, H);
          if (warp.a > 0.01) {
            const R = Math.hypot(W, H) / 2;
            ctx2.lineCap = "round";
            // desenha por cor (poucas trocas de estilo = barato)
            for (let ci = 0; ci < 3; ci++) {
              ctx2.strokeStyle = `rgb(${CORES[ci]})`;
              for (const e of est) {
                if (e.c !== ci) continue;
                const d0 = e.d;
                e.d += dt * e.vel * warp.v * (0.12 + e.d * 1.6);
                if (e.d > 1.05) { Object.assign(e, nova()); continue; }
                const c = Math.cos(e.ang), sn = Math.sin(e.ang);
                ctx2.globalAlpha = Math.min(1, e.d * 3) * warp.a;
                ctx2.lineWidth = e.larg * (0.6 + e.d * 1.6);
                ctx2.beginPath();
                ctx2.moveTo(W / 2 + c * d0 * R, H / 2 + sn * d0 * R);
                ctx2.lineTo(W / 2 + c * (e.d * R + 1.2), H / 2 + sn * (e.d * R + 1.2));
                ctx2.stroke();
              }
            }
            ctx2.globalAlpha = 1;
          }
          requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      }
      // (o CSS da abertura usa display com !important: a saída precisa de !important também, senão a tela da abertura
      // fica invisível POR CIMA do site e engole os cliques)
      const fimAbertura = () => {
        ceuVivo = false;
        if (pre) { pre.style.setProperty("display", "none", "important"); pre.style.pointerEvents = "none"; }
        document.documentElement.classList.remove("abrindo");
        window.dispatchEvent(new CustomEvent(EV_ABERTURA, { detail: "fim" }));
      };
      if (reduce || !pre) {
        gsap.timeline({ onComplete: () => { fimAbertura(); intro(); } })
          .set(".ab-logo", { opacity: 1 }).to(".preloader", { opacity: 0, duration: 0.4, delay: 0.6 });
      } else {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, paused: true });
        const espera = (ms: number) => new Promise<void>((ok) => setTimeout(ok, ms));
        const carregou = new Promise<void>((ok) => { if (document.readyState === "complete") ok(); else window.addEventListener("load", () => ok(), { once: true }); });
        const videoPronto = new Promise<void>((ok) => {
          const v = $(".hero video") as HTMLVideoElement | null;
          if (!v || v.readyState >= 3) { ok(); return; }
          v.addEventListener("canplay", () => ok(), { once: true });
        });
        Promise.race([Promise.all([carregou, videoPronto, esperar3D("orbe", 6500), esperar3D("fundo", 6500), espera(2000)]), espera(7000)])
          // mais um respiro curto: o navegador termina o que estava fazendo antes do 1º quadro da apresentação
          .then(() => new Promise<void>((ok) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(ok, 120)))))
          .then(() => {
            document.documentElement.classList.add("abrindo");
            window.dispatchEvent(new CustomEvent(EV_ABERTURA, { detail: "inicio" }));
            tl.play(0);
          });

        // faíscas: cada uma sai da borda da logo numa direção, em velocidades diferentes
        const faiscas = $$(".ab-faiscas i");
        const raioLogo = () => Math.min(window.innerWidth * (window.innerWidth <= 760 ? 0.62 : 0.5), window.innerHeight * 0.5, window.innerWidth <= 760 ? 280 : 420) / 2;
        tl.set(".ab-logo", { scale: 0.35, rotate: -120 })
          .set(".ab-logo .logo-img", { filter: "blur(10px) brightness(1.7)" }, 0)
          .set(".ab-palavra > span", { y: 0, yPercent: 115 }, 0) // zera o deslocamento do CSS (senão soma com o da animação)
          .to(".ab-aura", { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" }, 0.05)
          .fromTo(".ab-anel", { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 1, duration: 1.2, stagger: 0.12 }, 0.12)
          .to(".ab-logo", { opacity: 1, scale: 1, rotate: 0, duration: 1.35 }, 0.2)
          .to(".ab-logo .logo-img", { filter: "blur(0px) brightness(1)", duration: 1.1, ease: "power2.out" }, 0.25)
          // o anel de luz se desenha em volta da logo
          .set(".ab-traco", { opacity: 1 }, 0.45)
          .fromTo(".ab-traco circle", { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 1.25, ease: "power2.inOut" }, 0.45)
          .to(".ab-raios", { opacity: 0.8, duration: 1.2, ease: "power2.out" }, 0.6)
          .to(".ab-reflexo", { x: "260%", duration: 0.9, ease: "power2.inOut" }, 1.05)
          .to(".ab-palavra > span", { yPercent: 0, duration: 0.75, stagger: 0.07 }, 1.15)
          // CARGA: encolhe (antecipação), as estrelas aceleram, anéis apertam
          .to(".ab-logo", { scale: 0.9, duration: 0.42, ease: "power2.in" }, 2.25)
          .to(".ab-anel, .ab-traco", { scale: 0.92, duration: 0.42, ease: "power2.in" }, 2.25)
          .to(warp, { v: 7, duration: 0.6, ease: "power2.in" }, 2.15)
          .to(".ab-raios", { opacity: 1, scale: 1.12, duration: 0.5, ease: "power2.in" }, 2.2)
          .to(".ab-palavra > span", { yPercent: -115, duration: 0.4, stagger: 0.03, ease: "power2.in" }, 2.3)
          .to(".ab-frase", { opacity: 0, duration: 0.2 }, 2.5)
          // FLASH: clarão + risco de luz horizontal (flare de cinema) + faíscas + onda de choque
          .to(".ab-flash", { opacity: 1, duration: 0.09, ease: "none" }, 2.67)
          .fromTo(".ab-risco", { opacity: 0, scaleX: 0.05 }, { opacity: 1, scaleX: 1, duration: 0.35, ease: "power3.out" }, 2.64)
          .to(".ab-risco", { opacity: 0, scaleY: 0.3, duration: 0.38, ease: "power2.in" }, 2.84)
          .fromTo(".ab-onda", { opacity: 1, scale: 0.9 }, { opacity: 0, scale: 7, duration: 1.0, ease: "power2.out" }, 2.67)
          .add(() => {
            const r = raioLogo();
            faiscas.forEach((f, k) => {
              const a = (k / faiscas.length) * Math.PI * 2 + Math.random() * 0.2, d = r * (2.2 + Math.random() * 2.6);
              gsap.fromTo(f, { x: Math.cos(a) * r, y: Math.sin(a) * r, opacity: 1, scale: 1 + Math.random() * 1.4 },
                { x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, scale: 0.2, duration: 0.7 + Math.random() * 0.5, ease: "power3.out" });
            });
          }, 2.68)
          .set(".ab-anel, .ab-raios, .ab-aura, .ab-traco", { opacity: 0 }, 2.76)
          .to(warp, { a: 0, duration: 0.5 }, 2.76)
          .to(".ab-flash", { opacity: 0, duration: 0.55, ease: "power2.out" }, 2.76)
          // PORTAL: o furo cresce do centro e revela o site; a logo voa em direção à tela
          .set(".ab-portal", { opacity: 1 }, 2.8)
          .set(".preloader", { pointerEvents: "none" }, 2.8) // o site já aparece pelo portal: os cliques passam
          .fromTo(".preloader", { "--furo": "0px" }, { "--furo": `${Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) / 2 + 80)}px`, duration: 1.15, ease: "power3.in" }, 2.8)
          // o anel acompanha a borda do furo (raio = metade de 200px × escala)
          .fromTo(".ab-portal", { scale: 0 }, { scale: (Math.hypot(window.innerWidth, window.innerHeight) / 2 + 80) / 100, duration: 1.15, ease: "power3.in" }, 2.8)
          .to(".ab-logo", { scale: 4.2, opacity: 0, duration: 1.0, ease: "power2.in" }, 2.78)
          .to(".ab-logo .logo-img", { filter: "blur(8px) brightness(1.8)", duration: 1.0, ease: "power2.in" }, 2.78)
          .add(() => intro(), 3.35)
          .add(fimAbertura, 3.98);
        (window as unknown as { __abertura?: gsap.core.Timeline }).__abertura = tl; // (teste quadro a quadro)
      }

      function intro() {
        document.body.classList.remove("is-loading");
        lenis?.start();
        gsap
          .timeline()
          // (sem desfoque nas letras: dezenas de letras com filtro entrando junto com o portal pesavam demais)
          .from(".hero__title .char", { yPercent: 120, rotate: 10, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.028 })
          .from(".hero__title .rotator", { yPercent: 120, duration: 1, ease: "expo.out" }, 0.3)
          .from(".reveal-up", { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1 }, 0.4)
          .from(".header > *", { y: -60, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.3)
          .from(".hero__scroll", { opacity: 0, duration: 1 }, 1)
          // saudação curta ("Clique aqui!", pedido do Victor 21/11/2026) para não brigar com as regras do texto;
          // no celular ela sai colada no Orbe (que nasce logo abaixo do vídeo); no computador, no vão de sempre
          // celular: espera o título terminar de entrar (as letras ainda animando enganam a medida do texto)
          .add(() => droneSay(window.innerWidth <= 760 ? "Clique\naqui! 👆" : "Clique aqui! 👆", 3.4, window.innerWidth <= 760 ? undefined : [".hero__sub", ".hero__ctas"]), window.innerWidth <= 760 ? 2.4 : 0.8);
        // o recálculo das animações é pesado (no celular travava 1,3 s bem no PORTAL): fica para depois da abertura,
        // quando o navegador está livre
        const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => void }).requestIdleCallback;
        setTimeout(() => (ric ? ric(() => ScrollTrigger.refresh(), { timeout: 2500 }) : ScrollTrigger.refresh()), 1600);
      }

      on(window, "mafra:goto", (e: CustomEvent<string>) => {
        const el = $(e.detail);
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { duration: 1.6 });
        else el.scrollIntoView({ behavior: "smooth" });
      });

      /* ---------- Header + barra de progresso ---------- */
      const header = $(".header");
      let lastY = 0;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          header.classList.toggle("is-scrolled", y > 40);
          header.classList.toggle("is-hidden", y > lastY && y > 400 && !document.body.classList.contains("menu-open"));
          lastY = y;
          gsap.set(".progress span", { scaleX: self.progress });
        },
      });
      on($(".burger"), "click", () => document.body.classList.toggle("menu-open"));

      /* ---------- Palavras que giram no título ---------- */
      const track = $(".rotator__track");
      if (track && !reduce) {
        const n = track.children.length - 1;
        const rt = gsap.timeline({ repeat: -1, delay: 3.5 });
        // "resultados" é a palavra principal (pedido do Victor): fica mais tempo nela e sempre volta para ela
        const palavras = Array.from(track.children).map((c) => c.textContent?.trim());
        for (let i = 1; i <= n; i++) {
          const espera = palavras[i - 1] === "resultados" ? 3.2 : 1.4;
          rt.to(track, { yPercent: (-100 / (n + 1)) * i, duration: 0.8, ease: "expo.inOut" }, "+=" + espera);
        }
        rt.set(track, { yPercent: 0 });
      }

      /* ---------- ESBOÇO: vídeo em loop no topo ----------
         Enquanto o topo está na tela, a malha de pontos e as setas do fundo saem (elas brigavam com o vídeo). */
      // o React não grava `muted` no HTML, e sem "mudo" o navegador bloqueia o play automático:
      // força mudo + play, e tenta de novo no primeiro toque/rolagem/clique
      {
        const v = $(".video-topo video") as HTMLVideoElement | null;
        if (v) {
          v.muted = true; v.defaultMuted = true; v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
          // iPhone em modo de economia de bateria bloqueia o vídeo automático e desenha um botão de play por cima:
          // nesse caso o vídeo fica escondido e aparece a IMAGEM PARADA do topo (sem botão); ao primeiro toque ele tenta de novo
          const caixaVideo = v.closest(".video-topo");
          const tocar = () => { if (v.paused) v.play().then(() => caixaVideo?.classList.remove("video-bloqueado")).catch(() => caixaVideo?.classList.add("video-bloqueado")); };
          v.addEventListener("playing", () => caixaVideo?.classList.remove("video-bloqueado"));
          tocar();
          v.addEventListener("canplay", tocar, { once: true });
          ["touchstart", "touchend", "click", "pointerdown", "scroll", "keydown"].forEach((ev) => window.addEventListener(ev, tocar, { passive: true }));
          cleanups.push(() => ["touchstart", "touchend", "click", "pointerdown", "scroll", "keydown"].forEach((ev) => window.removeEventListener(ev, tocar)));
          // volta a tocar SEMPRE: ao voltar para a aba/app (o Safari pausa ao sair), ao voltar ao topo,
          // e um vigia a cada 2 s religa se o navegador tiver parado o vídeo sozinho
          // Safari do iPhone: ao voltar de outro app o vídeo fica CONGELADO, mas `paused` continua false —
          // então não basta "dar play se pausado". Recarrega e dá play de novo ao voltar, e o vigia mede se
          // o tempo do vídeo está ANDANDO; parado por ~2 s com o topo na tela → recarrega.
          const reiniciar = () => { const t = v.currentTime; v.load(); v.addEventListener("loadeddata", () => { try { v.currentTime = t; } catch { /* ok */ } v.play().catch(() => {}); }, { once: true }); };
          const voltar = () => { if (document.visibilityState === "visible") { reiniciar(); setTimeout(tocar, 400); } };
          document.addEventListener("visibilitychange", voltar);
          window.addEventListener("pageshow", voltar);
          window.addEventListener("focus", voltar);
          let ultimoT = -1, parado = 0;
          const vigia = setInterval(() => {
            if (!document.body.classList.contains("video-na-tela") || document.visibilityState !== "visible") return;
            if (v.paused) { tocar(); return; }
            if (Math.abs(v.currentTime - ultimoT) < 0.05) { if (++parado >= 2) { parado = 0; reiniciar(); } } else parado = 0;
            ultimoT = v.currentTime;
          }, 1000);
          cleanups.push(() => { document.removeEventListener("visibilitychange", voltar); window.removeEventListener("pageshow", voltar); window.removeEventListener("focus", voltar); clearInterval(vigia); });
        }
      }
      ScrollTrigger.create({ trigger: ".hero", start: "top bottom", end: "bottom 30%",
        onToggle: (self) => { document.body.classList.toggle("video-na-tela", self.isActive); if (self.isActive) ($(".video-topo video") as HTMLVideoElement | null)?.play().catch(() => {}); } });
      document.body.classList.toggle("video-na-tela", window.scrollY < window.innerHeight * 0.7);
      // malha de pontos e setas voltam BEM MAIS CEDO (pedido do Victor, 21/11/2026): somem só enquanto o topo
      // ocupa quase a tela toda; ao começar a rolar (fim do topo passando de 85% da tela) elas já aparecem
      const malhaST = ScrollTrigger.create({ trigger: ".hero", start: "top bottom", end: "bottom 85%",
        onToggle: (self) => document.body.classList.toggle("com-video", self.isActive) });
      document.body.classList.toggle("com-video", malhaST.isActive || window.scrollY < 10);

      /* ---------- FAIXAS ANIMADAS NO FUNDO (modelo 1, pedido do Victor, 19/11/2026) ----------
         Refinado a pedido dele ("deitam e ficam em pé, esquisito"): sem giro, sem distorção, forma de
         proporção fixa. Agora cada seta ENTRA pela lateral, fica um pouco flutuando e SAI pelo mesmo lado;
         as seis em revezamento, uma entrando a cada ~1 s. A rolagem só as desloca de leve na vertical. */
      if (!reduce) {
        const faixas = $$<HTMLElement>(".faixa");
        gsap.fromTo(".faixas-fundo", { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });
        const CICLO = 6; // segundos de cada seta (entra 1,2 s · fica 3,3 s · sai 1,5 s)
        faixas.forEach((f, i) => {
          const daDireita = f.classList.contains("faixa--dir");
          const fora = daDireita ? 120 : -120; // % da própria largura, fora da tela
          const forma = f.querySelector(".faixa__forma");
          gsap.timeline({ repeat: -1, delay: i * 1, repeatDelay: 0 })
            .fromTo(forma, { xPercent: fora, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out" })
            .to(forma, { yPercent: -5, duration: 1.65, ease: "sine.inOut", yoyo: true, repeat: 1 })
            .to(forma, { xPercent: fora, opacity: 0, duration: 1.5, ease: "power3.in" })
            .to({}, { duration: Math.max(0, CICLO - 6) });
          // (sem parallax: velocidades diferentes faziam uma seta entrar dentro da outra)
        });
      }

      /* ---------- Parallax do hero + chevrons da marca ---------- */
      if (!reduce) {
        gsap.from(".hero .chev", { x: 260, opacity: 0, duration: 1.6, ease: "expo.out", stagger: 0.12, delay: 2.6 });
        gsap.to(".chev--big", { xPercent: -25, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".chev--mid", { xPercent: -80, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".chev--small", { xPercent: 120, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".chev--mid", { y: -16, repeat: -1, yoyo: true, duration: 2.2, ease: "sine.inOut" });
        gsap.fromTo(".chev--contact", { xPercent: 40 }, { xPercent: -10, scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom bottom", scrub: true } });
        gsap.to(".hero__glow--a", { yPercent: 40, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
        // o texto do topo sobe e esmaece suavemente (antes descia e entrava embaixo da faixa verde)
        gsap.to(".hero__content", { y: -50, opacity: 0, ease: "power2.in", scrollTrigger: { trigger: ".hero", start: "55% top", end: "bottom top", scrub: 0.6 } }); // só esmaece quando já está saindo pelo alto
      }

      /* ---------- Cursor, botões magnéticos e tilt (só com mouse) ---------- */
      if (!isTouch) {
        const cursor = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring"), label = $(".cursor__label");
        // o círculo acompanha o mouse 100%, sem atraso (pedido do Victor: o "correr atrás" de 0,45 s
        // parecia travado) — posição aplicada direto no evento, sem animação no meio
        const mover = (el: HTMLElement, x: number, y: number) => { el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`; };
        on(window, "pointermove", (e: PointerEvent) => {
          cursor.classList.add("is-on");
          mover(dot, e.clientX, e.clientY); mover(ring, e.clientX, e.clientY);
        });
        $$("[data-cursor]").forEach((el) => {
          on(el, "pointerenter", () => { label.textContent = el.dataset.cursor || ""; cursor.classList.add("is-hover"); });
          on(el, "pointerleave", () => cursor.classList.remove("is-hover"));
        });

        // ===== LANTERNA DO MOUSE + reflexo nos cards (pedido do Victor, 18/11/2026: opção 2 + cards da 3) =====
        // O círculo antigo saiu (CSS). No lugar: um brilho verde suave segue o mouse pelo fundo, como a
        // lanterna do robô; e cada card/item tem um reflexo que acompanha o mouse por dentro dele.
        const lanterna = document.createElement("div");
        lanterna.className = "lanterna-mouse";
        document.body.appendChild(lanterna);
        cleanups.push(() => lanterna.parentNode?.removeChild(lanterna));
        let lx = -999, ly = -999, pedido = 0;
        on(window, "pointermove", (e: PointerEvent) => {
          lx = e.clientX; ly = e.clientY;
          lanterna.classList.add("is-on");
          if (!pedido) pedido = requestAnimationFrame(() => {
            pedido = 0;
            lanterna.style.setProperty("--lx", lx + "px");
            lanterna.style.setProperty("--ly", ly + "px");
          });
        });
        on(document.documentElement, "pointerleave", () => lanterna.classList.remove("is-on"));
        $$(".card, .project, .about__item, .stat, .faq__item").forEach((el) => {
          const reflexo = document.createElement("span");
          reflexo.className = "reflexo-mouse";
          reflexo.setAttribute("aria-hidden", "true");
          el.appendChild(reflexo);
          on(el, "pointermove", (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            el.style.setProperty("--rx", e.clientX - r.left + "px");
            el.style.setProperty("--ry", e.clientY - r.top + "px");
          });
        });

        // ímã dos botões desligado a pedido do Victor: o botão fica parado e só faz zoom no hover (CSS)

        $$(".tilt").forEach((el) => {
          const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
          const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
          gsap.set(el, { transformPerspective: 900 });
          on(el, "pointermove", (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
            ry((px - 0.5) * 14); rx((0.5 - py) * 14);
            el.style.setProperty("--mx", px * 100 + "%");
            el.style.setProperty("--my", py * 100 + "%");
          });
          on(el, "pointerleave", () => { rx(0); ry(0); });
        });
      }

      /* ---------- Manifesto: palavras acendem com a rolagem ---------- */
      gsap.to(".manifesto__text .word", {
        // acende no ritmo da leitura: começa quando a frase entra e termina antes do meio da tela
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: ".manifesto", start: "top 88%", end: "center 52%", scrub: 0.5 },
      });

      /* ---------- Serviços: rolagem horizontal ---------- */
      // No celular, título + card não cabem na altura da tela com a seção travada:
      // ali os cards deslizam com o dedo (scroll-snap no CSS), sem trava.
      const mobileLayout = window.matchMedia("(max-width: 760px)").matches;
      const sTrack = $(".services__track");
      const sDist = () => Math.max(0, sTrack.scrollWidth - window.innerWidth);
      // no computador os 6 cards ficam em grade (cabem na tela): sem trava. A trava vazia deixava uma "caixa" de altura
      // fixa em volta de Serviços que empurrava as páginas de baixo (títulos cortados no alto)
      if (!mobileLayout && sDist() > 0) {
        gsap.to(sTrack, {
          x: () => -sDist(), ease: "none",
          scrollTrigger: { trigger: ".services", pin: ".services__pin", start: "top top", end: () => "+=" + sDist(), scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
        });
      }
      // Celular: deixa claro que há cards escondidos — bolinhas de posição e uma
      // "espiadinha" automática para o lado quando a seção aparece.
      if (mobileLayout) {
        const cards = $$(".services__track .card");
        const dots = document.createElement("div");
        dots.className = "services__dots";
        dots.setAttribute("aria-hidden", "true");
        cards.forEach((_, k) => {
          const d = document.createElement("i");
          if (k === 0) d.className = "is-on";
          dots.appendChild(d);
        });
        sTrack.after(dots);
        cleanups.push(() => dots.remove());
        const step = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : 1);
        on(sTrack, "scroll", () => {
          const k = Math.round(sTrack.scrollLeft / step());
          [...dots.children].forEach((d, j) => d.classList.toggle("is-on", j === k));
        }, { passive: true });
        // sem espiadinha automática: no celular os cards só se mexem quando a pessoa arrasta (pedido do Victor)
      }

      if (!mobileLayout) gsap.from(".services__track .card", { y: 120, rotationY: -25, rotationX: 10, opacity: 0, stagger: 0.09, duration: 1.4, ease: "expo.out", transformPerspective: 1000, scrollTrigger: { trigger: ".services", start: "top 70%" } });

      /* ---------- Processo: celular 3D pinado, telas trocam ---------- */
      const steps = $$(".step"), screens = $$(".screen");
      let posHolosRef = () => {}; // vira posHolos logo abaixo (os balões se reposicionam enquanto rola)
      const buildEl = $(".js-build"), buildBar = $(".build__bar span");
      let current = 0;
      const setStep = (i: number) => {
        if (i === current) return;
        current = i;
        steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
        screens.forEach((s, k) => s.classList.toggle("is-active", k === i));
        $$(".holo").forEach((h) => h.classList.toggle("is-on", Number(h.dataset.step) === i));
        if (i === 3) {
          $$(".js-kpi").forEach((el) => {
            const o = { v: 0 };
            gsap.to(o, { v: Number(el.dataset.to), duration: 1.4, ease: "power3.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
          });
        }
        if (i === 2) {
          const b = { v: 0 };
          gsap.fromTo(buildBar, { width: "0%" }, { width: "100%", duration: 1.6, ease: "power2.inOut" });
          gsap.to(b, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => { buildEl.textContent = String(Math.round(b.v)); } });
        }
      };
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".process", pin: ".process__pin", start: "top top", end: () => (window.innerWidth <= 900 ? "+=160%" : "+=240%"), scrub: 1,
            // na tela travada da Metodologia ficam só 2 setas do fundo (classe lida no CSS). Fica AQUI, no próprio
            // gatilho que trava a tela: um gatilho separado era calculado antes da trava e desligava cedo demais
            onToggle: (self) => document.body.classList.toggle("na-metodologia", self.isActive),
            onUpdate: (self) => {
              setStep(Math.min(3, Math.floor(self.progress * 4)));
              posHolosRef();
              gsap.set(".process__bar span", { scaleX: self.progress });
            },
          },
        })
        // celular RETO durante toda a rolagem (pedido do Victor, 19/11/2026: o giro atrapalhava ver as telas)
        .set(".phone", { rotationY: 0, rotationX: 0, rotationZ: 0 }, 0)
        .fromTo(".orbit--1", { scale: 0.85 }, { scale: 1.1, ease: "none", duration: 1 }, 0)
        .fromTo(".holo", { y: 30 }, { y: -40, ease: "none", duration: 1 }, 0);

      // ===== Balões em volta do celular ("Rotinas mapeadas", "3 gargalos"…) SEMPRE FORA dele =====
      // (pedido do Victor, 19/11/2026: com o celular reto eles caíam em cima da tela). A posição sai do
      // próprio celular: o balão A encosta do lado de fora à ESQUERDA, sem invadir a coluna de texto;
      // o B do lado de fora à DIREITA. Largura encolhe se faltar espaço.
      const posHolos = () => {
        if (window.innerWidth <= 760) return; // no celular os balões ficam ocultos (CSS)
        const st = $(".process__stage"), fr = $(".phone__frame"), tx = $(".process__text");
        if (!st || !fr) return;
        const s = st.getBoundingClientRect(), f = fr.getBoundingClientRect(), t = tx?.getBoundingClientRect();
        const folga = 14;
        const espE = f.left - (t ? t.right + 20 : s.left) - folga;
        const espD = document.documentElement.clientWidth - f.right - folga - 16;
        // o balão é levemente ampliado pelo 3D (translateZ + perspectiva): ~10% de margem na largura
        const wE = Math.max(100, Math.min(210, espE * 0.9)), wD = Math.max(100, Math.min(210, espD * 0.9));
        // janela baixa: a seção é encolhida com `zoom` (CSS) — as medidas da tela vêm encolhidas e os valores
        // escritos no estilo são encolhidos de novo; divide pelo zoom para o balão cair no lugar certo
        const z = parseFloat(getComputedStyle($(".process__grid") ?? st).zoom || "1") || 1;
        $$<HTMLElement>(".holo.hc-a").forEach((h) => { h.style.left = "auto"; h.style.right = `${(s.right - f.left + folga) / z}px`; h.style.width = `${wE / z}px`; });
        $$<HTMLElement>(".holo.hc-b").forEach((h) => { h.style.right = "auto"; h.style.left = `${(f.right - s.left + folga) / z}px`; h.style.width = `${wD / z}px`; });
      };
      // TELAS DO CELULAR 3D: o texto ocupa TODO o espaço útil da tela (pedido do Victor, 23/11/2026).
      // Cada tela é ampliada (zoom) até o conteúdo encostar no pé da tela, com uma pequena margem. Mede de novo
      // quando a janela muda de tamanho.
      const ajustarTelas = () => {
        $$<HTMLElement>(".phone .screen").forEach((sc) => {
          const fundo = (z: number) => {
            sc.style.zoom = String(z);
            const top = sc.getBoundingClientRect().top;
            let b = 0;
            sc.querySelectorAll<HTMLElement>("*").forEach((el) => { const r = el.getBoundingClientRect(); if (r.height > 0 && r.width > 0) b = Math.max(b, r.bottom - top); });
            return b;
          };
          sc.style.zoom = "1";
          const alto = sc.getBoundingClientRect().height;
          let lo = 1, hi = 1.8;
          for (let k = 0; k < 8; k++) { const m = (lo + hi) / 2; if (fundo(m) <= alto * 0.94) lo = m; else hi = m; }
          sc.style.zoom = String(lo);
        });
      };
      setTimeout(ajustarTelas, 300);
      on(window, "resize", () => setTimeout(ajustarTelas, 350));
      posHolosRef = posHolos;
      posHolos();
      setTimeout(posHolos, 600);
      on(window, "resize", () => setTimeout(posHolos, 300));
      ScrollTrigger.addEventListener("refresh", posHolos);
      cleanups.push(() => ScrollTrigger.removeEventListener("refresh", posHolos));

      // Celular inclina com o mouse (camada separada da rotação da rolagem)
      if (false) { // inclinação com o mouse desligada: o celular fica reto (pedido do Victor)
        const frame = $(".phone__frame");
        const stage = $(".process__stage");
        const fx = gsap.quickTo(frame, "rotationY", { duration: 0.8, ease: "power3" });
        const fy = gsap.quickTo(frame, "rotationX", { duration: 0.8, ease: "power3" });
        on(stage, "pointermove", (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          fx(((e.clientX - r.left) / r.width - 0.5) * 18);
          fy((0.5 - (e.clientY - r.top) / r.height) * 14);
        });
        on(stage, "pointerleave", () => { fx(0); fy(0); });
      }

      /* ---------- Sobre ---------- */
      gsap.from(".about__badge", { scale: 0.6, rotation: -90, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".about", start: "top 75%" } });
      gsap.from(".about__item", { y: 70, opacity: 0, stagger: 0.12, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".about__grid", start: "top 85%" } });

      /* ---------- Contadores ---------- */
      $$(".js-counter").forEach((el) => {
        const to = Number(el.dataset.to);
        const o = { v: 0 };
        ScrollTrigger.create({
          trigger: el, start: "top 85%", once: true,
          onEnter: () => gsap.to(o, { v: to, duration: 2, ease: "power3.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } }),
        });
      });
      gsap.from(".stat", { y: 60, opacity: 0, filter: "blur(6px)", stagger: 0.12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".stats", start: "top 80%" } });
      gsap.from(".stat__line", { scaleX: 0, transformOrigin: "left", stagger: 0.12, duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".stats", start: "top 80%" } });

      /* ---------- Projetos, títulos, texto gigante ---------- */
      gsap.utils.toArray<HTMLElement>(".project").forEach((card, i) => {
        gsap.from(card, {
          clipPath: "inset(18% 8% 18% 8% round 24px)", y: 80, opacity: 0, duration: 1.4, ease: "expo.out", delay: (i % 2) * 0.12,
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
        const media = card.querySelector(".project__media > :not(.project__chev):not(.project__badge)");
        if (media) gsap.fromTo(media, { yPercent: 12 }, { yPercent: -12, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
      });
      // Títulos: cada palavra sobe de dentro de uma "janela" (máscara)
      const maskWords = (el: HTMLElement) => {
        const walk = (node: Node, grad: boolean) => {
          [...node.childNodes].forEach((n) => {
            if (n.nodeType === 3) {
              const frag = document.createDocumentFragment();
              (n.textContent || "").split(/(\s+)/).forEach((w) => {
                if (!w) return;
                if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
                const outer = document.createElement("span");
                outer.className = "wm";
                const inner = document.createElement("span");
                inner.className = "wm__i" + (grad ? " grad" : "");
                inner.textContent = w;
                outer.appendChild(inner);
                frag.appendChild(outer);
              });
              n.replaceWith(frag);
            } else if (n.nodeType === 1) {
              const e = n as HTMLElement;
              const isGrad = e.classList.contains("grad");
              if (isGrad) e.classList.remove("grad");
              walk(e, grad || isGrad);
            }
          });
        };
        walk(el, false);
      };
      /* ---------- SITE EM PÁGINAS DE TELA CHEIA (23/11/2026) — ver src/lib/paginas.ts ---------- */
      if (!reduce) {
        // começa depois que os outros gatilhos (Metodologia, textos) já existem, para medir as paradas certas
        const paginasTimer = setTimeout(() => { cleanups.push(iniciarPaginas(gsap, ScrollTrigger, lenis)); }, 600);
        cleanups.push(() => clearTimeout(paginasTimer));
      }
      // dentro de um bloco que acabou de trocar de cor, o texto espera a transição terminar para aparecer
      const inicioTexto = (el: Element) => (el.closest(".pos-azul, .bloco-azul--abre, .cta-vidro") ? "top 45%" : "top 85%");
      $$(".section-title").forEach((t) => {
        maskWords(t);
        gsap.from(t.querySelectorAll(".wm__i"), {
          yPercent: 115, rotate: 5, duration: 1.2, ease: "expo.out", stagger: 0.07,
          scrollTrigger: { trigger: t, start: inicioTexto(t) },
        });
      });

      // Textos de apoio: sobem saindo do desfoque
      $$(".work__lead, .about__lead, .contact__sub, .process__note, .eyebrow:not(.reveal-up)").forEach((p) => {
        gsap.from(p, { y: 24, opacity: 0, filter: "blur(4px)", duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: p, start: inicioTexto(p) === "top 45%" ? "top 55%" : "top 90%" } });
      });

      // Faixa de tecnologias e textos gigantes reagem à velocidade da rolagem
      let skewRest: ReturnType<typeof setTimeout> | undefined;
      cleanups.push(() => clearTimeout(skewRest));
      const skewTo = gsap.quickTo(".marquee__group, .bigtext__row", "skewX", { duration: 0.6, ease: "power3" });
      // computador (páginas): a rolagem dá SALTOS na troca de página — a faixa entortava e perdia a nitidez; só no celular
      if (window.innerWidth <= 760) ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => {
          skewTo(gsap.utils.clamp(-12, 12, self.getVelocity() / -250));
          clearTimeout(skewRest);
          skewRest = setTimeout(() => skewTo(0), 160);
        },
      });
      // Faixas gigantes: correm sozinhas sem parar (em sentidos opostos) e
      // aceleram com a velocidade da rolagem. O texto é repetido 2x, então
      // andar -50% e recomeçar fecha o laço sem emenda.
      const loops = $$(".bigtext__row").map((row) => {
        const dir = Number(row.dataset.dir);
        return gsap.fromTo(row, { xPercent: dir > 0 ? -50 : 0 }, { xPercent: dir > 0 ? 0 : -50, duration: 28, ease: "none", repeat: -1 });
      });
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 6);
          loops.forEach((t) => gsap.to(t, { timeScale: boost, duration: 0.2, overwrite: true, onComplete: () => { gsap.to(t, { timeScale: 1, duration: 1.2 }); } }));
        },
      });

      /* ---------- Contato ---------- */
      gsap.from(".contact__title .char", { yPercent: 120, stagger: 0.03, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".contact", start: "top 65%" } });
      gsap.from(".contact__actions > *, .contact__social > *", { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".contact__actions", start: "top 90%" } });
      $$(".js-whatsapp").forEach((a) => on(a, "click", () => droneSay("Mensagem a caminho! 🚀", 3)));

      /* =====================================================
         DRONE — voa pela tela acompanhando a rolagem
         ===================================================== */
      const drone = $(".drone"), droneBody = $(".drone__body"), bubble = $(".drone__bubble"), bubbleTxt = $(".drone__bubble span");
      const altEl = $(".js-alt");
      let bubbleTl: gsap.core.Timeline | undefined;
      let grudar: (() => void) | undefined;
      let ultimaFala = -1e9; // hora da última fala (vale para todas, inclusive a saudação)
      cleanups.push(() => { if (grudar) gsap.ticker.remove(grudar); });
      function droneSay(text: string, hold = 4, vao?: [string, string]): boolean {
        hold = Math.max(4, hold); // pedido do Victor: toda fala do Orbe fica pelo menos 4 s na tela
        if (bubbleTl?.isActive()) return false; // nunca troca a frase no meio de outra
        bubbleTxt.textContent = text;
        // frase curta (a saudação "Clique aqui!") usa um balão compacto, para caber no vão sem cobrir texto
        bubble.classList.toggle("drone__bubble--curta", text.length <= 16);
        // ===== POSIÇÃO DO BALÃO: 360° em volta do Orbe (pedido do Victor) =====
        // Testa 12 direções (em cima, embaixo, esquerda, direita e diagonais), sempre COLADO no Orbe,
        // e fica com a que cabe inteira na tela e cobre menos texto. A direção escolhida vale enquanto a
        // frase aparece; a cada quadro o balão acompanha o Orbe e é travado dentro da tela (margem 14px).
        const MARGEM = 14;
        gsap.set(bubble, { x: 0, y: 0, scale: 1 });
        const orbEl = droneBody.querySelector(".drone__orb") as HTMLElement | null;
        const W0 = window.innerWidth, H0 = window.innerHeight;
        const topo0 = ($(".header")?.getBoundingClientRect().bottom ?? 60) + 8;
        const bw = bubble.offsetWidth, bh = bubble.offsetHeight;
        const textosEls = $$("main .phone__frame, main h1:not(.hero__title), .hero__title .char, .hero__title .rotator, main h2, main h3, main p, main li, main .btn, main .pill, main summary, main .stat__n, main .swipe-hint, .footer p");
        const textos = textosEls.map((e) => e.getBoundingClientRect());
        const soltarGrudar = () => { if (grudar) gsap.ticker.remove(grudar); grudar = undefined; };
        const centroOrbe = () => {
          const o = (orbEl ?? droneBody).getBoundingClientRect();
          return { x: o.left + o.width / 2, y: o.top + o.height / 2, rx: o.width * 0.42, ry: o.height * 0.42 };
        };
        const oc0 = centroOrbe();
        const GAP = 6;
        const offsetDe = (ang: number) => {
          const c = Math.cos(ang), sn = Math.sin(ang);
          return { x: c * (oc0.rx + GAP + bw / 2), y: sn * (oc0.ry + GAP + bh / 2) };
        };
        const custo = (ox: number, oy: number) => {
          const cx = oc0.x + ox, cy = oc0.y + oy;
          const l = cx - bw / 2, r2 = cx + bw / 2, t = cy - bh / 2, btm = cy + bh / 2;
          const fora = Math.max(0, MARGEM - l) + Math.max(0, r2 - (W0 - MARGEM)) + Math.max(0, topo0 - t) + Math.max(0, btm - (H0 - MARGEM));
          let c = fora * 5000;
          for (const q of textos) {
            const w = Math.min(r2, q.right) - Math.max(l, q.left), h = Math.min(btm, q.bottom) - Math.max(t, q.top);
            if (w > 0 && h > 0) c += w * h;
          }
          return c;
        };
        // ordem de preferência em empate: em cima, lados, embaixo
        const angulos = [-90, -60, -120, 0, 180, -30, -150, 30, 150, 60, 120, 90].map((g) => (g * Math.PI) / 180);
        let off = offsetDe(angulos[0]), melhor = Infinity;
        angulos.forEach((ang, i) => {
          const o = offsetDe(ang);
          const v = custo(o.x, o.y) + i * 2;
          if (v < melhor) { melhor = v; off = o; }
        });
        // REGRA DE OURO (pedido do Victor: "toda hora entra fala em cima dos textos"):
        // se nenhuma das 12 posições em volta do Orbe está livre de texto, ele NÃO fala agora —
        // o ciclo tenta de novo no segundo seguinte, quando a rolagem abrir espaço.
        const cobertoMelhor = custo(off.x, off.y);
        const temVao = !!vao && window.scrollY < 30;
        if (!temVao && cobertoMelhor > bw * bh * 0.03) {
          gsap.set(bubble, { opacity: 0 });
          return false;
        }
        ultimaFala = performance.now();
        // abertura (vão pedido): com a página no topo, centraliza o balão no vão entre o texto e os botões
        const alvoVao = () => {
          if (!vao || window.scrollY > 30) return null;
          const va = $(vao[0])?.getBoundingClientRect(), vb = $(vao[1])?.getBoundingClientRect();
          if (!va || !vb || vb.top - va.bottom < bh + 6) return null;
          return (va.bottom + vb.top) / 2;
        };
        if (grudar) gsap.ticker.remove(grudar);
        grudar = () => {
          const oc = centroOrbe();
          const W2 = window.innerWidth, H2 = window.innerHeight;
          const topo = ($(".header")?.getBoundingClientRect().bottom ?? 60) + 8;
          // canto natural do balão (sem transform): posição do .drone + posição do balão dentro dele
          const d = drone.getBoundingClientRect();
          const natL = d.left + bubble.offsetLeft, natT = d.top + bubble.offsetTop;
          let cx = oc.x + off.x, cy = oc.y + off.y;
          const yv = alvoVao();
          if (yv !== null) cy = yv;
          cx = gsap.utils.clamp(MARGEM + bw / 2, W2 - MARGEM - bw / 2, cx);
          cy = gsap.utils.clamp(topo + bh / 2, H2 - MARGEM - bh / 2, cy);
          gsap.set(bubble, { x: cx - (natL + bw / 2), y: cy - (natT + bh / 2) });
          // vigia: com a página rolando, se o balão passar a cobrir texto, ele some na hora
          if (yv === null && Number(gsap.getProperty(bubble, "opacity")) > 0.05) { // confere a cada quadro
            const l = cx - bw / 2, rr = cx + bw / 2, t = cy - bh / 2, bb = cy + bh / 2;
            let cob = 0;
            for (const el of textosEls) {
              const q = el.getBoundingClientRect();
              const w = Math.min(rr, q.right) - Math.max(l, q.left), h = Math.min(bb, q.bottom) - Math.max(t, q.top);
              if (w > 0 && h > 0) cob += w * h;
            }
            if (cob > bw * bh * 0.02) {
              bubbleTl?.kill();
              gsap.to(bubble, { opacity: 0, scale: 0.9, duration: 0.1, overwrite: true });
              soltarGrudar();
            }
          }
        };
        grudar();
        gsap.set(bubble, { scale: 0.6, transformOrigin: "50% 50%" });
        gsap.ticker.add(grudar);
        const soltar = () => { if (grudar) gsap.ticker.remove(grudar); grudar = undefined; };
        bubbleTl = gsap
          .timeline({ onComplete: soltar, onInterrupt: soltar })
          .to(bubble, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" })
          .to(bubble, { opacity: 0, scale: 0.6, duration: 0.3, ease: "power2.in" }, `+=${hold}`);
        return true;
      }

      if (reduce) {
        gsap.set(drone, { x: window.innerWidth - 110, y: window.innerHeight - 90 });
        return;
      }

      // Rota em frações da viewport: fica nas laterais e cruza a tela entre as seções.
      const route: Array<[number, number]> = [
        [0.5, 0.82], [0.36, 0.72], [0.55, 0.88], [0.12, 0.7], [0.08, 0.3],
        [0.4, 0.14], [0.88, 0.22], [0.92, 0.55], [0.7, 0.82], [0.3, 0.86],
        [0.07, 0.55], [0.1, 0.22], [0.5, 0.12], [0.88, 0.35], [0.86, 0.75],
        [0.5, 0.88], [0.14, 0.78], [0.8, 0.3],
      ];
      // No celular o texto ocupa a largura toda: o drone fica nas bordas e no alto/baixo.
      const routeMobile: Array<[number, number]> = [
        [0.8, 0.5], [0.82, 0.42], [0.8, 0.82], // começa um pouco mais alto: o balão não cobre o botão [0.5, 0.88], [0.2, 0.84],
        [0.18, 0.5], [0.2, 0.16], [0.5, 0.12], [0.8, 0.2], [0.82, 0.6],
        [0.8, 0.86], [0.2, 0.86], [0.18, 0.22], [0.8, 0.16],
      ];
      let nasceuNoBranco = false, jaRolou = false;
      const toPx = () => {
        const W = window.innerWidth, H = window.innerHeight;
        const pts = (W <= 760 ? routeMobile : route).map(([x, y]) => ({ x: x * W, y: y * H }));
        // Celular: o Orbe NASCE à direita do botão "Agendar diagnóstico" (espaço vazio), logo abaixo
        // do vão entre o parágrafo e os botões — onde fica o balão de abertura (pedido do Victor).
        // A posição sai dos botões de verdade (com a página no topo), não de um número fixo,
        // porque a altura de cada celular muda onde os botões caem.
        if (W <= 760) {
          // nasce na MESMA LINHA do botão verde, no espaço à direita dele (os dois botões têm a mesma
          // largura e deixam essa faixa livre); o balão de abertura fica acima, no vão entre texto e botões
          // nasce DENTRO da faixa do vídeo (entre o cabeçalho e o selo do topo), à direita (pedido do Victor, 20/11/2026)
          const cab = $(".header")?.getBoundingClientRect(), selo = $(".hero .pill")?.getBoundingClientRect();
          const cta = cab && selo && selo.top - cab.bottom > 140 ? null : $(".hero__ctas .btn:not(.btn--ghost)")?.getBoundingClientRect();
          // nasce na PARTE BRANCA, abaixo do vídeo e do selo "Processos mais inteligentes…", no CANTO DIREITO
          // (pedido do Victor, 21/11/2026, com print). Procura, de cima para baixo, a primeira altura em que o Orbe
          // inteiro cabe colado na borda direita sem encostar em nenhuma letra do título nem no texto.
          // As medidas são de LAYOUT (offsetLeft/Top), porque na abertura as letras ainda estão animando.
          if (cab && selo && !cta) {
            const doc = (el: HTMLElement) => {
              let x = 0, y = 0, n: HTMLElement | null = el;
              while (n) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
              return { l: x, t: y, r: x + el.offsetWidth, b: y + el.offsetHeight };
            };
            const orbEl = drone.querySelector(".drone__orb") as HTMLElement | null;
            const tam = Math.max(orbEl?.offsetWidth ?? 0, drone.offsetWidth, 60);
            const altura = Math.max(orbEl?.offsetHeight ?? 0, drone.offsetHeight, 60);
            const hw = tam / 2 + 6, hh = altura / 2 + 6;
            const x = W - (tam / 2 + 4) - 8;
            const seloEl = $(".hero .pill") as HTMLElement;
            const obs = [seloEl, ...$$(".hero__title .char, .hero__title .rotator, .hero p, .hero .btn, .hero .io-card")].map((e) => doc(e as HTMLElement));
            const baseSelo = doc(seloEl).b;
            let y = -1;
            // preferência (pedido do Victor, 21/11/2026): EM FRENTE à palavra "movem" — centro da última linha do título;
            // procura o vão livre mais perto dessa altura (para cima e para baixo) antes da busca geral
            const linhas = $$(".hero__title .line") as HTMLElement[];
            const ult = linhas.length ? doc(linhas[linhas.length - 1]) : null;
            if (ult) {
              const y0 = (ult.t + ult.b) / 2;
              for (let d = 0; d <= 60 && y < 0; d += 4) {
                for (const yy of d ? [y0 - d, y0 + d] : [y0]) {
                  if (yy - hh < baseSelo) continue;
                  if (!obs.some((q) => x + hw > q.l && x - hw < q.r && yy + hh > q.t && yy - hh < q.b)) { y = yy; break; }
                }
              }
            }
            for (let yy = baseSelo + hh + 6; y < 0 && yy < baseSelo + 700; yy += 4) {
              const bate = obs.some((q) => x + hw > q.l && x - hw < q.r && yy + hh > q.t && yy - hh < q.b);
              if (!bate) { y = yy; break; }
            }
            // sem vão livre (celular muito estreito): nasce no ponto mais baixo da faixa do vídeo, como antes
            pts[0] = y > 0 ? { x, y } : { x: W * 0.8, y: Math.max(cab.bottom + 80, selo.top - 58) + window.scrollY };
            nasceuNoBranco = y > 0;
          }
          if (cta) {
            const yDoc = cta.top + window.scrollY; // posição com a página no topo
            const livreX = Math.max(cta.right + 10, W * 0.55);
            pts[0] = { x: Math.min(W - 56, (livreX + W) / 2), y: gsap.utils.clamp(H * 0.35, H * 0.86, yDoc + cta.height / 2) };
          }
        }
        return pts;
      };
      let lastX = 0;
      let flyTween: gsap.core.Tween | undefined;
      // COMPUTADOR (site em páginas de tela cheia): o robô NÃO segue a rolagem — a cada troca de página ele voa,
      // numa curva suave, até um lugar livre da página que está chegando (controle no fim deste bloco: `voarPara`)
      const paginado = window.innerWidth > 760;
      const buildFlight = () => {
        if (paginado) { flyTween?.scrollTrigger?.kill(); flyTween?.kill(); flyTween = undefined; return; }
        const prog = flyTween?.scrollTrigger?.progress ?? 0;
        flyTween?.scrollTrigger?.kill();
        flyTween?.kill();
        gsap.set(drone, toPx()[0]); // a rota começa do ponto atual: posiciona no 1º ponto
        flyTween = gsap.to(drone, {
          motionPath: { path: toPx(), curviness: 1.4 },
          ease: "none",
          immediateRender: true,
          scrollTrigger: {
            trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.4,
            onUpdate: () => {
              // Inclina na direção do movimento, como um drone de verdade
              const x = Number(gsap.getProperty(drone, "x"));
              const dx = x - lastX;
              lastX = x;
              gsap.to(droneBody, { rotation: gsap.utils.clamp(-12, 12, dx * 0.8), duration: 0.6, overwrite: "auto" });
              drone.classList.toggle("is-right", x > window.innerWidth * 0.5);
              altEl.textContent = String(120 + Math.round((flyTween?.scrollTrigger?.progress ?? 0) * 880)).padStart(3, "0");
            },
          },
        });
        flyTween.progress(prog);
        lastX = Number(gsap.getProperty(drone, "x"));
      };
      buildFlight();
      // a fonte do título chega depois: refaz a rota (e o ponto de nascimento) com as medidas certas
      document.fonts?.ready.then(() => { if (window.scrollY < 30) buildFlight(); });
      let rt: ReturnType<typeof setTimeout>;
      let lastW = window.innerWidth;
      on(window, "resize", () => {
        // Ignora o resize da barra de endereço do celular (só muda a altura)
        if (isTouch && window.innerWidth === lastW) return;
        lastW = window.innerWidth;
        clearTimeout(rt);
        rt = setTimeout(() => { buildFlight(); ScrollTrigger.refresh(); }, 250);
      });

      // ---------- Interação do drone ----------
      const sysEl = $(".js-sys");
      // o olho da Orbe segue o cursor sozinho (DroneOrb.tsx); aqui fica o giro do clique
      const svg = droneBody.querySelector(".drone__roll") as HTMLElement;
      const dodge = $(".drone__dodge");
      const dodgeX = gsap.quickTo(dodge, "x", { duration: 0.7, ease: "power3" });
      const dodgeY = gsap.quickTo(dodge, "y", { duration: 0.7, ease: "power3" });
      on(window, "pointermove", (e: PointerEvent) => {
        const r = droneBody.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        // o olho segue o cursor
        // desvia quando o cursor chega perto (no toque, só reage ao clique)
        if (!isTouch && d < 150) {
          const push = ((150 - d) / 150) * 80;
          dodgeX((-dx / d) * push); dodgeY((-dy / d) * push);
        } else { dodgeX(0); dodgeY(0); }
      });
      let rolling = false;
      const burst = () => {
        const r = droneBody.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        for (let k = 0; k < 18; k++) {
          const s = document.createElement("i");
          s.className = "spark";
          layer.appendChild(s);
          const a = (k / 18) * Math.PI * 2, dist = gsap.utils.random(50, 110);
          gsap.set(s, { x: cx, y: cy, scale: gsap.utils.random(0.8, 1.6) });
          gsap.to(s, { x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist, opacity: 0, scale: 0, duration: gsap.utils.random(0.6, 1), ease: "power3.out", onComplete: () => s.remove() });
        }
      };
      on(droneBody, "click", () => {
        if (rolling) return;
        rolling = true;
        drone.classList.add("is-boost");
        sysEl.textContent = "SCAN";
        burst();
        window.dispatchEvent(new Event("mafra:orbmenu"));
        gsap.timeline({ onComplete: () => { rolling = false; drone.classList.remove("is-boost"); sysEl.textContent = "OK"; } })
          .to(svg, { rotationY: 360, scale: 1.2, y: -36, duration: 0.85, ease: "power3.inOut", transformOrigin: "50% 50%", transformPerspective: 600 })
          .to(svg, { y: 0, scale: 1, duration: 0.7, ease: "bounce.out" })
          .set(svg, { rotationY: 0 });
      });

      // Faíscas atrás do drone (menos no celular)
      const layer = $(".drone-layer");
      const sparkEvery = isTouch ? 70 : 28;
      let lastSpark = 0, px = 0, py = 0;
      // Desvio: a Orbe procura espaço livre — longe dos TEXTOS (títulos, parágrafos, botões, cards),
      // da malha de pontos do fundo e do cabeçalho. Se o ponto da rota estiver ocupado, ela flutua até o
      // espaço vazio mais próximo; se não houver nenhum (comum no celular, onde o texto ocupa a largura
      // toda), ela fica onde está e fica translúcida enquanto o texto passa por baixo.
      const avoidX = gsap.quickTo(layer, "x", { duration: 0.9, ease: "sine.inOut" });
      const avoidY = gsap.quickTo(layer, "y", { duration: 0.9, ease: "sine.inOut" });
      const corpo = $(".drone__dodge");
      const SEL_TEXTO = "main h1:not(.hero__title), .hero__title .char, .hero__title .rotator, main h2, main h3, main p, main li, main .btn, main .pill, main .eyebrow, main .step.is-active, main .stat, main .holo.is-on, main .card__icon, main .project__media, main .phone__frame, main .about__badge, main .card, main .project, main .about__item, main .faq__item, main .io-card, main .io-servicos, main .vidro-forte, main .process__note, .footer .logo, .footer p, .footer__links";
      let obst: Element[] = [];
      const coletar = () => { obst = Array.from(document.querySelectorAll(SEL_TEXTO)); };
      coletar();
      on(window, "resize", coletar);
      let voando = false, naVaga = false, ladoVaga: "E" | "D" | null = null; // durante o voo do menu, o desvio e as falas ficam parados
      let tx = 0, ty = 0, escX = 0, escY = 0, apagado = false, ultimo = 0, rotaLivreDesde = 0, apertoDesde = 0;
      const inicioVoo = performance.now();
      const avoid = () => {
        const agora = performance.now();
        if (voando || paginado) return;
        // abertura no celular: o ponto de nascimento já foi medido livre com a página pronta; enquanto as letras
        // ainda animam (e antes da primeira rolagem) o desvio enxergaria "texto" onde não há — fica parado ali
        if (window.scrollY > 30) jaRolou = true;
        if (isTouch && nasceuNoBranco && !jaRolou) return;
        // VOLTOU AO TOPO (pedido do Victor, 21/11/2026: "reproduza sempre"): no celular, com a página no topo, o Orbe
        // volta SEMPRE ao lugar de nascimento (em frente a "movem", medido livre) — larga o esconderijo de antes
        if (isTouch && nasceuNoBranco && window.scrollY < 30) {
          if (tx !== 0 || ty !== 0) { tx = 0; ty = 0; escX = 0; escY = 0; rotaLivreDesde = 0; avoidX(0); avoidY(0); }
          if (apagado) { apagado = false; gsap.to(corpo, { opacity: 1, duration: 0.5, overwrite: "auto" }); }
          if (naVaga) { naVaga = false; ladoVaga = null; gsap.to(corpo, { scale: 1, duration: 0.6, overwrite: "auto" }); }
          return;
        }
        if (agora - ultimo < 200) return; // 5x por segundo basta, não pesa e não deixa tremer
        ultimo = agora;
        const W = window.innerWidth, H = window.innerHeight;
        const x = Number(gsap.getProperty(drone, "x")), y = Number(gsap.getProperty(drone, "y"));
        const orbEl = corpo.querySelector(".drone__orb") as HTMLElement | null;
        const tam = Math.max(orbEl?.offsetWidth ?? 0, drone.offsetWidth);
        // celular: folga mínima — as brechas ao lado do celular 3D têm pouco mais que a largura do Orbe
        const folga = isTouch ? 4 : 14, pad = isTouch ? 2 : 8;
        const hw = tam / 2 + folga, hh = Math.max(orbEl?.offsetHeight ?? 0, drone.offsetHeight) / 2 + (isTouch ? 4 : 18); // folga para o balanço
        // limites: nunca embaixo do cabeçalho (com espaço para o HUD) nem colado nas bordas
        const topo = ($(".header")?.getBoundingClientRect().bottom ?? 80) + hh + 30;
        const base = H - hh - 18, esq = hw + 8, dir = W - hw - 8;
        const vis = obst.map((e) => ({ r: e.getBoundingClientRect(), peso: e.classList.contains("phone__frame") ? 4 : 1 }))
          .filter(({ r }) => r.width > 0 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W);
        const rs = vis.map((v) => v.r);
        // custo de ficar num ponto: área coberta de texto, e o CELULAR pesa 4x (pedido do Victor:
        // "nem no celular, nem em cima do texto")
        const custo = (ox: number, oy: number) => {
          const px = x + ox, py = y + oy;
          let c = 0;
          for (const { r, peso } of vis) {
            const w = Math.min(px + hw, r.right) - Math.max(px - hw, r.left), h = Math.min(py + hh, r.bottom) - Math.max(py - hh, r.top);
            if (w > 0 && h > 0) c += w * h * peso;
          }
          return c;
        };
        // (malha do fundo não entra mais no desvio)
        const livre = (ox: number, oy: number) => {
          const px = x + ox, py = y + oy;
          if (px < esq || px > dir || py < topo || py > base) return false;
          // (a malha do fundo ficou bem suave: não precisa mais desviar dela — só do texto)
          return !rs.some((r) => px + hw > r.left - pad && px - hw < r.right + pad && py + hh > r.top - pad && py - hh < r.bottom + pad);
        };
        // CALMA (pedido do Victor: "ele fica rodando procurando área vazia"):
        // 1) o esconderijo é um lugar FIXO na tela — enquanto continuar livre, ela fica parada nele,
        //    mesmo que a rota ande por baixo;
        // 2) só volta para a rota depois que a rota ficar livre por um tempo seguido (não a cada brecha);
        // 3) quando precisa mudar, procura perto de onde ELA está (não perto da rota), andando o mínimo.
        // CELULAR + seção do celular 3D travada na tela: vaga FIXA na lateral do celular (pedido do Victor:
        // "ele ainda está em frente ao celular"). Nada de procurar lugar — o espaço ali é estreito e a busca
        // acabava passando por cima do celular. Se a brecha for menor que o Orbe, ele encolhe para caber.
        const procEl = $(".process"), foneEl = $(".phone__frame");
        if (isTouch && procEl && foneEl) {
          const pr = procEl.getBoundingClientRect(), fr = foneEl.getBoundingClientRect();
          // vale com a seção travada E enquanto o celular ainda aparece na entrada/saída dela
          // (voltar para a rota com o celular na tela fazia o Orbe cruzar por cima dele)
          const travada = pr.top < H * 0.5 && pr.bottom > H * 0.35 && fr.width > 40 && fr.top < H - 40 && fr.bottom > topo;
          if (travada) {
            const gapE = fr.left, gapD = W - fr.right;
            // o lado é escolhido UMA vez, na entrada: o celular gira e a brecha maior troca de lado —
            // trocar junto fazia o Orbe atravessar o celular
            if (ladoVaga === null) ladoVaga = gapE >= gapD ? "E" : "D";
            const ladoE = ladoVaga === "E";
            const gap = ladoE ? gapE : gapD;
            let caber = Math.min(1, (gap - 10) / tam);
            let vx = ladoE ? gap / 2 : fr.right + gap / 2;
            let vy = gsap.utils.clamp(Math.max(fr.top, topo), Math.min(fr.bottom, base), fr.top + Math.max(60, fr.height * 0.3));
            // ESTACIONA ABAIXO DO CELULAR (pedido do Victor, 21/11/2026): o espaço embaixo do aparelho é livre e
            // largo — ali o Orbe não atrapalha nada e as falas cabem ao lado dele. Um pouco à esquerda do centro,
            // para o balão abrir à direita. Sem espaço embaixo, volta para a lateral do celular.
            const livreBaixo = H - fr.bottom - 24;
            if (livreBaixo >= tam * 0.7) {
              caber = Math.min(1, livreBaixo / (tam + 20));
              vx = W * 0.3;
              vy = Math.min(H - 14 - (tam * caber) / 2, fr.bottom + 18 + (tam * caber) / 2);
            }
            tx = vx - x; ty = vy - y;
            escX = vx; escY = vy;
            avoidX(tx); avoidY(ty);
            gsap.to(corpo, { scale: caber, opacity: 1, duration: 0.6, overwrite: "auto" });
            naVaga = true;
            return;
          }
        }
        ladoVaga = null;
        if (naVaga) { naVaga = false; gsap.to(corpo, { scale: 1, duration: 0.6, overwrite: "auto" }); }
        const estaEm = tx !== 0 || ty !== 0;
        // esconderijo FIXO NA TELA: guardado em coordenada de tela — antes era um deslocamento da rota,
        // e o Orbe andava junto com a rota por cima do celular 3D
        const hx = estaEm ? escX : x, hy = estaEm ? escY : y; // onde a Orbe está agora (ou indo)
        const rotaLivre = livre(0, 0);
        if (rotaLivre) { if (!rotaLivreDesde) rotaLivreDesde = agora; } else rotaLivreDesde = 0;
        let alvo: [number, number] | null = null;
        if (!estaEm && rotaLivre) alvo = [0, 0]; // já está na rota e ela segue livre
        else if (estaEm && rotaLivre && agora - rotaLivreDesde > 900) alvo = [0, 0]; // rota livre há quase 1 s: volta
        else if (estaEm && livre(hx - x, hy - y) && Math.hypot(hx - x, hy - y) < 560) alvo = [hx - x, hy - y]; // fica onde está
        else if (!estaEm && rotaLivre) alvo = [0, 0];
        else {
          busca: for (let raio = 0; raio <= 520; raio += 36) {
            for (let k = 0; k < (raio ? 18 : 1); k++) {
              const a = (k / 18) * Math.PI * 2;
              const ox = hx - x + Math.cos(a) * raio, oy = hy - y + Math.sin(a) * raio * 0.8;
              if (Math.hypot(ox, oy) < 560 && livre(ox, oy)) { alvo = [ox, oy]; break busca; }
            }
          }
        }
        const semSaida = !alvo;
        if (!alvo) {
          // sem espaço 100% livre: vai para o ponto da tela que MENOS cobre texto/celular
          // (antes ficava parado — e no celular, na parte do celular 3D, ficava em cima dele)
          const ax = hx - x, ay = hy - y, atual = custo(ax, ay);
          let melhor = atual, best: [number, number] = [ax, ay];
          for (let gy = topo; gy <= base; gy += 20) {
            for (let gx = esq; gx <= dir; gx += 16) {
              const c = custo(gx - x, gy - y);
              if (c < melhor) { melhor = c; best = [gx - x, gy - y]; }
            }
          }
          // calma: só troca de lugar se o ganho for de verdade
          alvo = melhor < atual * 0.7 - 200 ? best : [ax, ay];
        }
        // mesmo sem espaço livre, a Orbe respeita as bordas e o cabeçalho
        tx = gsap.utils.clamp(esq - x, dir - x, alvo[0]);
        ty = gsap.utils.clamp(topo - y, base - y, alvo[1]);
        escX = x + tx; escY = y + ty;
        avoidX(tx); avoidY(ty);
        // só fica translúcida se o aperto durar (evita piscar)
        if (semSaida) { if (!apertoDesde) apertoDesde = agora; } else apertoDesde = 0;
        // TRANSPARENTE QUANDO PRECISAR (pedido do Victor, 20/11/2026, computador E celular): mede onde o Orbe
        // ESTÁ agora; se ele cobre texto, botão ou card (mais de 12%), fica bem translúcido até sair dali
        let cobre = 0;
        const ob = (orbEl ?? corpo).getBoundingClientRect();
        for (const r of rs) {
          const w = Math.min(ob.right, r.right) - Math.max(ob.left, r.left), h = Math.min(ob.bottom, r.bottom) - Math.max(ob.top, r.top);
          if (w > 0 && h > 0) cobre += w * h;
        }
        const deveApagar = agora > inicioVoo + 4000 && cobre > ob.width * ob.height * 0.12;
        if (deveApagar !== apagado) {
          apagado = deveApagar;
          gsap.to(corpo, { opacity: deveApagar ? 0.28 : 1, duration: deveApagar ? 0.25 : 0.5, overwrite: "auto" });
        }
      };
      gsap.ticker.add(avoid);
      // ===== TRAVA FINAL: o Orbe NUNCA sai da tela (pedido do Victor, já tinha voltado a acontecer) =====
      // O voo e o desvio são animações suaves e, numa rolagem rápida, a rota chega à borda antes do
      // desvio alcançar — o Orbe saía metade para fora. Esta trava mede o Orbe a CADA quadro e empurra
      // a camada de volta para dentro (margem 8px), usando a propriedade CSS `translate`, que soma com
      // as animações do GSAP sem brigar com elas. Não suaviza: na borda, ela segura na hora.
      const orbTrava = $(".drone__orb") as HTMLElement | null;
      let travaX = 0, travaY = 0;
      const travar = () => {
        const alvo = (orbTrava && orbTrava.isConnected ? orbTrava : ($(".drone__orb") as HTMLElement | null)) ?? droneBody;
        const r = alvo.getBoundingClientRect();
        if (!r.width) return;
        const W = window.innerWidth, H = window.innerHeight, m = 8;
        const topoMin = 4;
        // posição sem a trava
        const l = r.left - travaX, rt = r.right - travaX, t = r.top - travaY, b = r.bottom - travaY;
        travaX = l < m ? m - l : rt > W - m ? W - m - rt : 0;
        travaY = t < topoMin ? topoMin - t : b > H - m ? H - m - b : 0;
        layer.style.translate = `${travaX}px ${travaY}px`;
      };
      gsap.ticker.add(travar);

      // ===== VOO DO MENU (computador; pedido do Victor, 18/11/2026) =====
      // Clicou em Serviços/Método/Cases/Sobre/Contato: a tela escurece, a luz do robô cresce
      // (intensidade, raio e distância do facho) e ele desce junto até o tema, devagar — 3 s no 1º,
      // 4 s no 2º, 5 s no 3º… Ao estacionar ao lado do título, a luz diminui e a tela volta ao normal.
      const suave = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
      on(window, "mafra:voo", (e: CustomEvent<{ alvo: HTMLElement; dur: number }>) => {
        if (voando || !lenis) return;
        const { alvo, dur } = e.detail;
        voando = true;
        const beam = $(".drone__beam"), glow = $(".drone__glow");
        bubbleTl?.kill();
        gsap.to(bubble, { opacity: 0, duration: 0.2, overwrite: true });
        (avoidX as unknown as { tween?: gsap.core.Tween }).tween?.kill();
        (avoidY as unknown as { tween?: gsap.core.Tween }).tween?.kill();
        const escuro = document.createElement("div");
        escuro.className = "voo-escuro";
        document.body.appendChild(escuro);
        drone.classList.add("is-voo");
        document.body.classList.add("em-voo");
        // de onde sai (na tela) e onde estaciona: ao lado do título do tema, já com a página no lugar
        const W = window.innerWidth, H = window.innerHeight;
        const lx0 = Number(gsap.getProperty(layer, "x")), ly0 = Number(gsap.getProperty(layer, "y"));
        const sx0 = Number(gsap.getProperty(drone, "x")) + lx0, sy0 = Number(gsap.getProperty(drone, "y")) + ly0;
        const maxScroll = document.documentElement.scrollHeight - H;
        // a página para com um respiro de 150px acima do tema: é ali que o robô estaciona, por cima
        const destScroll = Math.max(0, Math.min(maxScroll, alvo.getBoundingClientRect().top + window.scrollY - 150));
        // estaciona POR CIMA do tema e joga a luz em cima do título (pedido do Victor):
        // centro na 1ª linha do título, acima do selo ("• SERVIÇOS" etc.)
        const h2el = (alvo.querySelector("h2") ?? alvo) as HTMLElement;
        const selo = (alvo.querySelector(".eyebrow") ?? h2el) as HTMLElement;
        // só os TEXTOS (letras): os blocos de linha do título ocupam a largura toda e puxariam o centro
        const textos: Text[] = [];
        const andar = document.createTreeWalker(h2el, NodeFilter.SHOW_TEXT);
        while (andar.nextNode()) if ((andar.currentNode.textContent ?? "").trim()) textos.push(andar.currentNode as Text);
        const faixa = document.createRange();
        // medido a cada quadro: as letras do título entram animadas e só ficam no lugar durante a descida
        const medir = (): [number, number] => {
          // o título é feito de várias peças (palavras/letras): junta todas as da 1ª linha
          const pecas = textos.flatMap((t) => { faixa.selectNodeContents(t); return Array.from(faixa.getClientRects()); }).filter((r) => r.width > 2);
          let esq = h2el.getBoundingClientRect().left, dirR = h2el.getBoundingClientRect().right;
          if (pecas.length) {
            const topo1 = Math.min(...pecas.map((r) => r.top));
            const mesmas = pecas.filter((r) => r.top < topo1 + 20);
            esq = Math.min(...mesmas.map((r) => r.left));
            dirR = Math.max(...mesmas.map((r) => r.right));
          }
          const topoTema = selo.getBoundingClientRect().top + window.scrollY - destScroll; // onde fica com a página parada
          return [gsap.utils.clamp(120, W - 120, (esq + dirR) / 2), gsap.utils.clamp(90, H - 140, topoTema - 72)];
        };
        const prog = { t: 0 };
        // a cada quadro: posição desejada na tela menos onde a rota da rolagem deixou o robô
        const segue = () => {
          const t = prog.t;
          // linha reta e suave: o robô desce JUNTO com a tela (pedido do Victor: nada de rodar em volta)
          const [fimX, fimY] = medir();
          const dx = (fimX - sx0) * t;
          const dy = (fimY - sy0) * t;
          gsap.set(layer, {
            x: sx0 + dx - Number(gsap.getProperty(drone, "x")),
            y: sy0 + dy - Number(gsap.getProperty(drone, "y")),
          });
        };
        gsap.ticker.add(segue);
        // luz mais forte: intensidade (brilho), raio (largura) e distância (comprimento do facho)
        gsap.to(escuro, { opacity: 1, duration: 0.8, ease: "power2.out" });
        gsap.to(beam, { scaleX: 1.8, scaleY: 2.6, opacity: 1, transformOrigin: "50% 0%", duration: 1, ease: "power2.out" });
        gsap.to(glow, { scale: 2.4, opacity: 1, duration: 1, ease: "power2.out" });
        // a ROLAGEM é nossa, quadro a quadro, no mesmo relógio do robô: no computador do Victor o
        // scrollTo do Lenis pulava direto para o tema. Lenis parado = a roda do mouse não interfere.
        const y0 = window.scrollY;
        // celular: rolagem nativa (o Lenis parado esconde a rolagem da página no iPhone) e o dedo fica
        // bloqueado durante o voo; computador: Lenis parado = a roda do mouse não interfere
        const segura = (ev: Event) => ev.preventDefault();
        if (isTouch) {
          window.addEventListener("touchmove", segura, { passive: false });
          window.addEventListener("wheel", segura, { passive: false });
        } else lenis.stop();
        const rolar = (y: number) => {
          if (isTouch) window.scrollTo(0, y);
          else lenis?.scrollTo(y, { immediate: true, force: true });
        };
        gsap.to(prog, {
          t: 1, duration: dur, ease: suave,
          onUpdate: () => rolar(y0 + (destScroll - y0) * prog.t),
          onComplete: () => {
            if (isTouch) {
              window.removeEventListener("touchmove", segura);
              window.removeEventListener("wheel", segura);
            } else lenis?.start();
          },
        });
        // o fim é pelo relógio, não pelo aviso do Lenis (com a seção pinada ele às vezes não avisa)
        gsap.delayedCall(dur, () => {
          {
            // estacionou: luz diminui e a tela volta ao normal
            drone.classList.remove("is-voo");
            gsap.delayedCall(0.9, () => document.body.classList.remove("em-voo"));
            gsap.to(escuro, { opacity: 0, duration: 0.9, ease: "power2.inOut", onComplete: () => { escuro.parentNode?.removeChild(escuro); } });
            // estacionado: a lanterna fica em cima do título, mais fraca (pedido do Victor)
            gsap.to(beam, { scaleX: 1.25, scaleY: 1.5, opacity: 0.85, duration: 0.9, ease: "power2.inOut" });
            gsap.to(beam, { scaleX: 1, scaleY: 1, delay: 3.2, duration: 0.9, ease: "power2.inOut", onComplete: () => { gsap.set(beam, { clearProps: "opacity,scale,transformOrigin" }); } });
            gsap.to(glow, { scale: 1, duration: 0.9, ease: "power2.inOut", onComplete: () => { gsap.set(glow, { clearProps: "opacity,scale" }); } });
            // segura parado enquanto a rota da rolagem assenta (scrub), depois devolve ao desvio normal
            gsap.delayedCall(4.1, () => {
              gsap.ticker.remove(segue);
              tx = Number(gsap.getProperty(layer, "x"));
              ty = Number(gsap.getProperty(layer, "y"));
              escX = Number(gsap.getProperty(drone, "x")) + tx;
              escY = Number(gsap.getProperty(drone, "y")) + ty;
              ultimo = 0;
              voando = false;
            });
          }
        });
      });
      cleanups.push(() => { gsap.ticker.remove(travar); layer.style.translate = ""; });
      cleanups.push(() => gsap.ticker.remove(avoid));

      // ===== ROBÔ NO SITE EM PÁGINAS (computador, 23/11/2026, pedido do Victor: "mais fluido, ele está perdido") =====
      // Uma MOLA amortecida leva o robô até o alvo: sai devagar, acelera, desacelera e assenta sem tranco, e um novo
      // alvo no meio do caminho só curva a rota (nunca um "pulo"). Longe do alvo na horizontal, ele sobe um pouco:
      // o caminho vira um ARCO. O alvo é escolhido quando a troca começa, já olhando a página que está chegando
      // (onde os textos e cards vão ficar), num lugar livre perto de uma vaga da vez (laterais alternadas).
      let alvoX = window.innerWidth * 0.86, alvoY = window.innerHeight * 0.66, velX = 0, velY = 0;
      let posX = alvoX, posY = alvoY, trocandoPag = false;
      const velRobo = () => Math.hypot(velX, velY);
      if (paginado) {
        const VAGAS: Array<[number, number]> = [[0.86, 0.68], [0.12, 0.72], [0.88, 0.32], [0.1, 0.34], [0.86, 0.78], [0.13, 0.52], [0.9, 0.52], [0.11, 0.8]];
        type Ret = { l: number; t: number; r: number; b: number };
        const orbP = () => (corpo.querySelector(".drone__orb") as HTMLElement | null);
        const medidas = () => {
          const W = window.innerWidth, H = window.innerHeight;
          const tam = Math.max(orbP()?.offsetWidth ?? 0, 100);
          const hw = tam / 2 + 14, hh = tam / 2 + 20;
          const topo = ($(".header")?.getBoundingClientRect().bottom ?? 70) + hh + 26;
          return { W, H, tam, hw, hh, topo, base: H - hh - 14, esq: hw + 10, dir: W - hw - 10 };
        };
        // retângulos dos textos/cards de um conjunto de seções, deslocados para onde vão ficar na chegada
        const obstaculos = (secs: Element[] | null, dx = 0, dy = 0): Ret[] => {
          const H = window.innerHeight, W = window.innerWidth;
          const extras = Array.from(document.querySelectorAll(".bigtext__row, .marquee")); // faixas que passam também são "texto"
          return [...obst, ...extras].filter((e) => !secs || secs.some((sc) => sc.contains(e)))
            .map((e) => e.getBoundingClientRect())
            .filter((r) => r.width > 0 && r.height > 0)
            .map((r) => ({ l: r.left + dx, t: r.top + dy, r: r.right + dx, b: r.bottom + dy }))
            .filter((r) => r.b > 0 && r.t < H && r.r > 0 && r.l < W);
        };
        const acharLugar = (cx: number, cy: number, rs: Ret[]): [number, number] => {
          const m = medidas();
          const livre = (x: number, y: number) => x >= m.esq && x <= m.dir && y >= m.topo && y <= m.base &&
            !rs.some((r) => x + m.hw > r.l - 10 && x - m.hw < r.r + 10 && y + m.hh > r.t - 10 && y - m.hh < r.b + 10);
          cx = gsap.utils.clamp(m.esq, m.dir, cx); cy = gsap.utils.clamp(m.topo, m.base, cy);
          for (let raio = 0; raio <= 900; raio += 30) {
            for (let k = 0; k < (raio ? 24 : 1); k++) {
              const a = (k / 24) * Math.PI * 2, x = cx + Math.cos(a) * raio, y = cy + Math.sin(a) * raio * 0.75;
              if (livre(x, y)) return [x, y];
            }
          }
          // sem lugar 100% livre: o ponto que menos cobre texto
          let melhor = Infinity, best: [number, number] = [cx, cy];
          for (let y = m.topo; y <= m.base; y += 24) for (let x = m.esq; x <= m.dir; x += 24) {
            let c = 0;
            for (const r of rs) { const w = Math.min(x + m.hw, r.r) - Math.max(x - m.hw, r.l), h = Math.min(y + m.hh, r.b) - Math.max(y - m.hh, r.t); if (w > 0 && h > 0) c += w * h; }
            c += Math.hypot(x - cx, y - cy) * 0.5; // perto da vaga desempata
            if (c < melhor) { melhor = c; best = [x, y]; }
          }
          return best;
        };
        const voarPara = (n: number, secs: Element[] | null, dx = 0, dy = 0) => {
          const { W, H } = medidas();
          const [fx, fy] = VAGAS[((n % VAGAS.length) + VAGAS.length) % VAGAS.length];
          [alvoX, alvoY] = acharLugar(fx * W, fy * H, obstaculos(secs, dx, dy));
          altEl.textContent = String(120 + n * 60).padStart(3, "0");
        };
        // começo: lugar livre na 1ª página
        coletar();
        voarPara(0, null);
        posX = alvoX; posY = alvoY;
        gsap.set(drone, { x: posX, y: posY });
        on(window, "mafra:pagina", (e: CustomEvent<{ fase: "inicio" | "fim"; n: number; secs: Element[]; dx: number; dy: number }>) => {
          const d = e.detail;
          if (d.fase === "inicio") {
            trocandoPag = true;
            calar(); ultimaRolagem = performance.now(); // nada de fala no meio da troca
            coletar();
            voarPara(d.n, d.secs, d.dx, d.dy);
          } else {
            trocandoPag = false;
            ultimaRolagem = performance.now();
            // chegou: confere com a página já no lugar; só muda o alvo se ele ficou em cima de algum texto
            const m = medidas(), rs = obstaculos(null);
            const cobre = rs.some((r) => alvoX + m.hw > r.l && alvoX - m.hw < r.r && alvoY + m.hh > r.t && alvoY - m.hh < r.b);
            if (cobre) [alvoX, alvoY] = acharLugar(alvoX, alvoY, rs);
          }
        });
        const inclinar = gsap.quickTo(droneBody, "rotation", { duration: 0.5, ease: "power2.out" });
        let ultimaConf = 0;
        const mola = () => {
          if (voando) { velX = velY = 0; posX = Number(gsap.getProperty(drone, "x")); posY = Number(gsap.getProperty(drone, "y")); return; }
          // depois do voo do menu: o deslocamento que ele deixou na camada passa para a posição (sem mexer na tela)
          const lx = Number(gsap.getProperty(layer, "x")), ly = Number(gsap.getProperty(layer, "y"));
          if (lx || ly) { posX += lx; posY += ly; alvoX = posX; alvoY = posY; gsap.set(layer, { x: 0, y: 0 }); }
          const dt = Math.min(0.1, gsap.ticker.deltaRatio(60) / 60); // relógio real (tela lenta não deixa o robô lento)
          const w = 2.4; // "rigidez" da mola: ~2 s para atravessar a tela, assentando sem balançar
          const arco = Math.min(160, Math.abs(alvoX - posX) * 0.16); // longe na horizontal → sobe um pouco (arco)
          const ty = Math.max(medidas().topo, alvoY - arco);
          velX += (w * w * (alvoX - posX) - 2 * w * velX) * dt;
          velY += (w * w * (ty - posY) - 2 * w * velY) * dt;
          const v = Math.hypot(velX, velY), vmax = 820;
          if (v > vmax) { velX *= vmax / v; velY *= vmax / v; }
          posX += velX * dt; posY += velY * dt;
          gsap.set(drone, { x: posX, y: posY });
          inclinar(gsap.utils.clamp(-14, 14, velX * 0.018));
          drone.classList.toggle("is-right", alvoX > window.innerWidth * 0.5);
          // parado: se algo passou a cobrir (pergunta aberta, card que cresceu), procura um lugar livre perto
          const agora = performance.now();
          if (!trocandoPag && v < 20 && agora - ultimaConf > 700) {
            ultimaConf = agora;
            const m = medidas(), rs = obstaculos(null);
            const cobre = rs.some((r) => alvoX + m.hw > r.l && alvoX - m.hw < r.r && alvoY + m.hh > r.t && alvoY - m.hh < r.b);
            if (cobre) [alvoX, alvoY] = acharLugar(alvoX, alvoY, rs);
          }
        };
        gsap.ticker.add(mola);
        cleanups.push(() => gsap.ticker.remove(mola));
        on(window, "resize", () => { const m = medidas(); alvoX = gsap.utils.clamp(m.esq, m.dir, alvoX); alvoY = gsap.utils.clamp(m.topo, m.base, alvoY); });
      }

      const sparks = () => {
        const x = Number(gsap.getProperty(drone, "x")), y = Number(gsap.getProperty(drone, "y"));
        const now = performance.now();
        if (Math.hypot(x - px, y - py) > 2 && now - lastSpark > sparkEvery) {
          lastSpark = now;
          const s = document.createElement("i");
          s.className = "spark";
          layer.appendChild(s);
          gsap.set(s, { x: x + gsap.utils.random(-10, 10), y: y + 18 + gsap.utils.random(-6, 6) });
          gsap.to(s, { y: "+=" + gsap.utils.random(20, 50), opacity: 0, scale: 0, duration: gsap.utils.random(0.6, 1.1), ease: "power2.out", onComplete: () => s.remove() });
        }
        px = x; py = y;
      };
      gsap.ticker.add(sparks);
      cleanups.push(() => gsap.ticker.remove(sparks));

      // Falas do drone em cada seção
      // Falas em CICLO (pedido do Victor): alterna o convite para tocar na Orbe com uma frase de
      // benefício ou de incentivo — toque → benefício → toque → incentivo → … — uma a cada 10 s.
      // O robô só incentiva a contratar; nunca comenta os cases. Pausa com o menu aberto ou a aba escondida.
      const TOQUE = [
        "Toque em mim e faça um diagnóstico rápido 👋",
        "3 perguntas, 30 segundos: toque em mim 👆",
        "Quer saber onde sua operação trava? Toque em mim 👋",
      ];
      const OUTRAS = [
        "Menos retrabalho, mais tempo para o que importa 🎯",
        "Sua operação pode render muito mais 🚀",
        "Informação certa na mão de quem decide 📊",
        "Qual processo da sua empresa vamos destravar? 💡",
        "Equipe produtiva, operação sob controle ✅",
        "Do diagnóstico ao suporte, eu cuido de tudo ✨",
      ];
      // ===== QUANDO O ORBE FALA (regra do Victor, 18/11/2026) =====
      // 1) só com a TELA PARADA: rolou, o balão some na hora e ninguém fala enquanto rola;
      // 2) uma fala a cada 10 s (do começo de uma ao começo da outra): 1 minuto parado = 6 falas.
      const INTERVALO = 10000;
      const PARADA = 700; // a página precisa estar parada há este tempo para contar como "parada"
      let ultimaRolagem = -1e9, ultimoY = window.scrollY;
      const calar = () => {
        if (!bubbleTl?.isActive() && Number(gsap.getProperty(bubble, "opacity")) < 0.05) return;
        bubbleTl?.kill();
        if (grudar) gsap.ticker.remove(grudar);
        grudar = undefined;
        gsap.to(bubble, { opacity: 0, scale: 0.85, duration: 0.18, overwrite: true });
      };
      const vigiaRolagem = () => {
        const y = window.scrollY;
        if (Math.abs(y - ultimoY) > 1) { ultimaRolagem = performance.now(); calar(); }
        ultimoY = y;
      };
      gsap.ticker.add(vigiaRolagem);
      cleanups.push(() => gsap.ticker.remove(vigiaRolagem));
      let passo = 1; // a saudação de abertura já foi um "toque"; o próximo é benefício/incentivo
      let iToque = 0, iOutra = 0;
      const menuAberto = () => !!document.querySelector(".orbmenu.is-open");
      const timerFala = setInterval(() => {
        if (ultimaFala < 0 || document.hidden || menuAberto() || voando) return; // começa só depois da saudação de abertura
        const agora = performance.now();
        if (agora - ultimaRolagem < PARADA) return; // tela em movimento: não fala
        if (paginado && (trocandoPag || velRobo() > 25)) return; // robô ainda voando para a página nova
        if (agora - ultimaFala < INTERVALO) return; // a cada 10 s
        const ehToque = passo % 2 === 0;
        const texto = ehToque ? TOQUE[iToque % TOQUE.length] : OUTRAS[iOutra % OUTRAS.length];
        if (!droneSay(texto)) return; // sem lugar livre agora: tenta de novo daqui a pouco
        if (ehToque) iToque++; else iOutra++;
        passo++;
      }, 250);
      cleanups.push(() => clearInterval(timerFala));
    });

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
      gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}
