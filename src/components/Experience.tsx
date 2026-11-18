"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Lenis from "lenis";


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
          if (lenis) lenis.scrollTo(target, { duration: 1.6 });
          else if (target === 0) window.scrollTo(0, 0);
          else if (typeof target !== "number") target.scrollIntoView();
        });
      });

      /* ---------- Preloader → intro ---------- */
      const counter = { v: 0 };
      const count = $(".js-count");
      const dur = reduce ? 0.1 : 1.4;
      gsap
        .timeline({ onComplete: intro })
        .to(counter, { v: 100, duration: dur, ease: "power2.inOut", onUpdate: () => { count.textContent = String(Math.round(counter.v)); } })
        .to(".preloader__bar span", { width: "100%", duration: dur, ease: "power2.inOut" }, 0)
        .to(".preloader__inner", { y: -30, opacity: 0, duration: 0.4 })
        .to(".preloader", { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "-=0.1")
        .set(".preloader", { display: "none" });

      function intro() {
        document.body.classList.remove("is-loading");
        lenis?.start();
        gsap
          .timeline()
          .from(".hero__title .char", { yPercent: 120, rotate: 10, filter: "blur(10px)", opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.028 })
          .from(".hero__title .rotator", { yPercent: 120, duration: 1, ease: "expo.out" }, 0.3)
          .from(".reveal-up", { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1 }, 0.4)
          .from(".header > *", { y: -60, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.3)
          .from(".hero__scroll", { opacity: 0, duration: 1 }, 1)
          .add(() => droneSay("Oi! Toque em mim para um diagnóstico rápido 👋", 3.4, [".hero__sub", ".hero__ctas"]), 0.8);
        ScrollTrigger.refresh();
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
        const xDot = gsap.quickTo(dot, "x", { duration: 0.1 }), yDot = gsap.quickTo(dot, "y", { duration: 0.1 });
        const xRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
        const yRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
        on(window, "pointermove", (e: PointerEvent) => {
          cursor.classList.add("is-on");
          xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY);
        });
        $$("[data-cursor]").forEach((el) => {
          on(el, "pointerenter", () => { label.textContent = el.dataset.cursor || ""; cursor.classList.add("is-hover"); });
          on(el, "pointerleave", () => cursor.classList.remove("is-hover"));
        });

        $$(".magnetic").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
          on(el, "pointermove", (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * 0.35);
            yTo((e.clientY - r.top - r.height / 2) * 0.35);
          });
          on(el, "pointerleave", () => { xTo(0); yTo(0); });
        });

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
      if (!mobileLayout) {
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
            onUpdate: (self) => {
              setStep(Math.min(3, Math.floor(self.progress * 4)));
              gsap.set(".process__bar span", { scaleX: self.progress });
            },
          },
        })
        .fromTo(".phone", { rotationY: -28, rotationX: 10, rotationZ: -4 }, { rotationY: 22, rotationX: -6, rotationZ: 3, ease: "none", duration: 1 })
        .fromTo(".orbit--1", { scale: 0.85 }, { scale: 1.1, ease: "none", duration: 1 }, 0)
        .fromTo(".holo", { y: 30 }, { y: -40, ease: "none", duration: 1 }, 0);

      // Celular inclina com o mouse (camada separada da rotação da rolagem)
      if (!isTouch) {
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
      $$(".section-title").forEach((t) => {
        maskWords(t);
        gsap.from(t.querySelectorAll(".wm__i"), {
          yPercent: 115, rotate: 5, duration: 1.2, ease: "expo.out", stagger: 0.07,
          scrollTrigger: { trigger: t, start: "top 85%" },
        });
      });

      // Textos de apoio: sobem saindo do desfoque
      $$(".work__lead, .about__lead, .contact__sub, .process__note, .eyebrow:not(.reveal-up)").forEach((p) => {
        gsap.from(p, { y: 24, opacity: 0, filter: "blur(4px)", duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: p, start: "top 90%" } });
      });

      // Faixa de tecnologias e textos gigantes reagem à velocidade da rolagem
      let skewRest: ReturnType<typeof setTimeout> | undefined;
      cleanups.push(() => clearTimeout(skewRest));
      const skewTo = gsap.quickTo(".marquee__group, .bigtext__row", "skewX", { duration: 0.6, ease: "power3" });
      ScrollTrigger.create({
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
      function droneSay(text: string, hold = 4, vao?: [string, string]) {
        hold = Math.max(4, hold); // pedido do Victor: toda fala do Orbe fica pelo menos 4 s na tela
        ultimaFala = performance.now();
        bubbleTxt.textContent = text;
        bubbleTl?.kill();
        // o balão nunca sai da tela: mede no tamanho final e empurra para dentro
        gsap.set(bubble, { x: 0, y: 0, scale: 1 });
        const r = bubble.getBoundingClientRect();
        const pad = 10, W = window.innerWidth;
        const shift = r.left < pad ? pad - r.left : r.right > W - pad ? W - pad - r.right : 0;
        // o balão escolhe onde fica: acima do Orbe (padrão), um pouco mais alto/baixo, ou embaixo dele —
        // o lugar que cobre MENOS texto e botão (pedido do Victor: no celular ele cobria o botão)
        const orbR = (droneBody.querySelector(".drone__orb") as HTMLElement | null)?.getBoundingClientRect();
        const abaixo = orbR ? orbR.bottom + 8 - r.top : 160;
        const rs = $$("main h1, main h2, main h3, main p, main li, main .btn, main .pill").map((e) => e.getBoundingClientRect());
        if (orbR) rs.push(orbR); // nunca em cima do próprio Orbe
        const topoLivre = ($(".header")?.getBoundingClientRect().bottom ?? 70) + 8; // nem atrás do cabeçalho
        const foraDaTela = (dy: number) => r.top + dy < topoLivre || r.bottom + dy > window.innerHeight - 10;
        const cobre = (dy: number) => rs.reduce((t, q) => {
          const w = Math.min(r.right + shift, q.right) - Math.max(r.left + shift, q.left);
          const h = Math.min(r.bottom + dy, q.bottom) - Math.max(r.top + dy, q.top);
          return t + (w > 0 && h > 0 ? w * h : 0);
        }, foraDaTela(dy) ? 1000000000 : 0);
        // folga até o texto mais próximo (acima e abaixo) na faixa horizontal do balão
        const folga = (dy: number) => {
          let cima = 9999, baixo = 9999;
          for (const q of rs) {
            if (Math.min(r.right + shift, q.right) - Math.max(r.left + shift, q.left) <= 0) continue;
            if (q.bottom <= r.top + dy) cima = Math.min(cima, r.top + dy - q.bottom);
            if (q.top >= r.bottom + dy) baixo = Math.min(baixo, q.top - (r.bottom + dy));
          }
          return Math.min(cima, baixo, 60);
        };
        // procura, perto do Orbe, a posição sem sobreposição e CENTRALIZADA no vão entre textos
        // (ex.: no meio do espaço entre o parágrafo e o botão)
        let dy = 0, melhor = Infinity;
        for (let c = -240; c <= Math.max(240, abaixo); c += 4) {
          const v = cobre(c) * 1000 - folga(c) * 10 + Math.abs(c) * 0.15;
          if (v < melhor) { melhor = v; dy = c; }
        }
        // vão pedido (ex.: entre o parágrafo e os botões do topo): se couber, o balão fica no MEIO dele
        if (vao) {
          const a = $(vao[0])?.getBoundingClientRect(), b = $(vao[1])?.getBoundingClientRect();
          if (a && b && b.top - a.bottom >= r.height + 6) {
            const c = (a.bottom + b.top) / 2 - (r.top + r.bottom) / 2;
            if (!foraDaTela(c)) dy = c;
          }
        }
        gsap.set(bubble, { x: shift, y: dy, scale: 0.6 });
        // o balão é filho do Orbe e anda com ele: com vão pedido, ele "gruda" no vão enquanto aparece
        if (grudar) gsap.ticker.remove(grudar);
        grudar = undefined;
        if (vao) {
          grudar = () => {
            const a = $(vao[0])?.getBoundingClientRect(), b = $(vao[1])?.getBoundingClientRect();
            if (!a || !b) return;
            const atual = bubble.getBoundingClientRect();
            const yAtual = Number(gsap.getProperty(bubble, "y"));
            const altura = atual.height / (Number(gsap.getProperty(bubble, "scale")) || 1);
            if (b.top - a.bottom < altura + 6) return; // não cabe: fica onde a busca colocou
            const centroSemY = (atual.top + atual.bottom) / 2 - yAtual;
            const alvo = (a.bottom + b.top) / 2 - centroSemY;
            const xAtual = Number(gsap.getProperty(bubble, "x"));
            const esqSemX = atual.left - xAtual, dirSemX = atual.right - xAtual, W2 = window.innerWidth;
            const x = esqSemX < 10 ? 10 - esqSemX : dirSemX > W2 - 10 ? W2 - 10 - dirSemX : 0;
            gsap.set(bubble, { y: alvo, x });
          };
          gsap.ticker.add(grudar);
        }
        const soltar = () => { if (grudar) gsap.ticker.remove(grudar); grudar = undefined; };
        bubbleTl = gsap
          .timeline({ onComplete: soltar, onInterrupt: soltar })
          .to(bubble, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" })
          .to(bubble, { opacity: 0, scale: 0.6, duration: 0.3, ease: "power2.in" }, `+=${hold}`);
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
          const cta = $(".hero__ctas .btn:not(.btn--ghost)")?.getBoundingClientRect();
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
      const buildFlight = () => {
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
      const avoidX = gsap.quickTo(layer, "x", { duration: 1.3, ease: "sine.inOut" });
      const avoidY = gsap.quickTo(layer, "y", { duration: 1.3, ease: "sine.inOut" });
      const corpo = $(".drone__dodge");
      const SEL_TEXTO = "main h1, main h2, main h3, main p, main li, main .btn, main .pill, main .eyebrow, main .step.is-active, main .stat, main .holo.is-on, main .card__icon, main .project__media, main .phone__frame, main .about__badge, .footer .logo, .footer p, .footer__links";
      let obst: Element[] = [];
      const coletar = () => { obst = Array.from(document.querySelectorAll(SEL_TEXTO)); };
      coletar();
      on(window, "resize", coletar);
      let tx = 0, ty = 0, apagado = false, ultimo = 0, rotaLivreDesde = 0, apertoDesde = 0;
      const inicioVoo = performance.now();
      const avoid = () => {
        const agora = performance.now();
        if (agora - ultimo < 200) return; // 5x por segundo basta, não pesa e não deixa tremer
        ultimo = agora;
        const W = window.innerWidth, H = window.innerHeight;
        const x = Number(gsap.getProperty(drone, "x")), y = Number(gsap.getProperty(drone, "y"));
        const orbEl = corpo.querySelector(".drone__orb") as HTMLElement | null;
        const tam = Math.max(orbEl?.offsetWidth ?? 0, drone.offsetWidth);
        const hw = tam / 2 + 14, hh = Math.max(orbEl?.offsetHeight ?? 0, drone.offsetHeight) / 2 + 18; // folga para o balanço
        // limites: nunca embaixo do cabeçalho (com espaço para o HUD) nem colado nas bordas
        const topo = ($(".header")?.getBoundingClientRect().bottom ?? 80) + hh + 30;
        const base = H - hh - 18, esq = hw + 8, dir = W - hw - 8;
        const rs = obst.map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W);
        // (malha do fundo não entra mais no desvio)
        const livre = (ox: number, oy: number) => {
          const px = x + ox, py = y + oy;
          if (px < esq || px > dir || py < topo || py > base) return false;
          // (a malha do fundo ficou bem suave: não precisa mais desviar dela — só do texto)
          return !rs.some((r) => px + hw > r.left - 8 && px - hw < r.right + 8 && py + hh > r.top - 8 && py - hh < r.bottom + 8);
        };
        // CALMA (pedido do Victor: "ele fica rodando procurando área vazia"):
        // 1) o esconderijo é um lugar FIXO na tela — enquanto continuar livre, ela fica parada nele,
        //    mesmo que a rota ande por baixo;
        // 2) só volta para a rota depois que a rota ficar livre por um tempo seguido (não a cada brecha);
        // 3) quando precisa mudar, procura perto de onde ELA está (não perto da rota), andando o mínimo.
        const estaEm = tx !== 0 || ty !== 0;
        const hx = x + tx, hy = y + ty; // onde a Orbe está agora (ou indo)
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
        if (!alvo) alvo = [hx - x, hy - y]; // sem espaço livre: não sai correndo, fica onde está
        // mesmo sem espaço livre, a Orbe respeita as bordas e o cabeçalho
        tx = gsap.utils.clamp(esq - x, dir - x, alvo[0]);
        ty = gsap.utils.clamp(topo - y, base - y, alvo[1]);
        avoidX(tx); avoidY(ty);
        // só fica translúcida se o aperto durar (evita piscar)
        if (semSaida) { if (!apertoDesde) apertoDesde = agora; } else apertoDesde = 0;
        const deveApagar = !isTouch && semSaida && agora > inicioVoo + 7000 && agora - apertoDesde > 450; // celular: sempre visível (pedido do Victor); computador: só se o aperto durar
        if (deveApagar !== apagado) {
          apagado = deveApagar;
          gsap.to(corpo, { opacity: deveApagar ? 0.55 : 1, duration: deveApagar ? 0.3 : 0.6, overwrite: "auto" });
        }
      };
      gsap.ticker.add(avoid);
      cleanups.push(() => gsap.ticker.remove(avoid));

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
      // Falas por seção (o robô só INCENTIVA a contratar; nunca comenta os cases), com no máximo UMA a cada 10 segundos (pedido do Victor): rolando rápido,
      // ele não metralha frases — guarda só a da seção onde a pessoa parou e fala quando der o tempo.
      const lines: Array<[string, string]> = [
        [".manifesto", "Sua operação pode render muito mais 🎯"],
        [".services", "Escolha por onde começar — eu cuido do resto ✨"],
        [".process", "Conheça o Programa de Eficiência Operacional e Produtividade 📈"],
        [".stats", "Prazos claros, do início ao acompanhamento ⏱️"],
        ["#cases", "Desenvolva seus processos e veja sua empresa crescer 🚀"],
        ["#sobre", "Prazer, este é o Victor, à frente da MAFRA 🤝"],
        ["#perguntas", "Ficou com dúvida? Toque em mim e fale com o Victor 💬"],
        [".contact", "Qual processo da sua empresa vamos destravar? 🚀"],
      ];
      const INTERVALO = 10000;
      let pendente: string | null = null;
      let timerFala: ReturnType<typeof setTimeout> | undefined;
      const falarQuandoPuder = (text: string) => {
        pendente = text;
        clearTimeout(timerFala);
        const espera = Math.max(0, ultimaFala + INTERVALO - performance.now());
        timerFala = setTimeout(() => {
          if (!pendente) return;
          if (performance.now() - ultimaFala < INTERVALO - 50) { falarQuandoPuder(pendente); return; }
          droneSay(pendente);
          pendente = null;
        }, espera);
      };
      cleanups.push(() => clearTimeout(timerFala));
      const ditas = new Set<string>();
      lines.forEach(([sel, text]) => ScrollTrigger.create({
        trigger: sel, start: "top 55%", end: "bottom 45%",
        onEnter: () => { if (!ditas.has(sel)) { ditas.add(sel); falarQuandoPuder(text); } },
        onLeave: () => { if (pendente === text) pendente = null; },
        onLeaveBack: () => { if (pendente === text) pendente = null; },
      }));
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
