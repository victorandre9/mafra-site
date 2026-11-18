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
          // MENU DO TOPO no computador: o robô voa até o tema (pedido do Victor, 18/11/2026) —
          // 3 s no 1º tema, 4 s no 2º, 5 s no 3º… A animação mora junto do robô, mais abaixo.
          const navLinks = $$(".nav .nav__link");
          const iNav = navLinks.indexOf(a);
          if (lenis && iNav >= 0 && typeof target !== "number" && window.innerWidth > 900 && !isTouch) {
            window.dispatchEvent(new CustomEvent("mafra:voo", { detail: { alvo: target, dur: 3 + iNav } }));
            return;
          }
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
      function droneSay(text: string, hold = 4, vao?: [string, string]): boolean {
        hold = Math.max(4, hold); // pedido do Victor: toda fala do Orbe fica pelo menos 4 s na tela
        if (bubbleTl?.isActive()) return false; // nunca troca a frase no meio de outra
        bubbleTxt.textContent = text;
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
        const textosEls = $$("main h1, main h2, main h3, main p, main li, main .btn, main .pill, main summary, main .stat__n, main .swipe-hint, .footer p");
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
      let voando = false; // durante o voo do menu, o desvio e as falas ficam parados
      let tx = 0, ty = 0, escX = 0, escY = 0, apagado = false, ultimo = 0, rotaLivreDesde = 0, apertoDesde = 0;
      const inicioVoo = performance.now();
      const avoid = () => {
        const agora = performance.now();
        if (voando) return;
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
        const deveApagar = !isTouch && semSaida && agora > inicioVoo + 7000 && agora - apertoDesde > 450; // celular: sempre visível (pedido do Victor); computador: só se o aperto durar
        if (deveApagar !== apagado) {
          apagado = deveApagar;
          gsap.to(corpo, { opacity: deveApagar ? 0.55 : 1, duration: deveApagar ? 0.3 : 0.6, overwrite: "auto" });
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
        const destScroll = Math.min(maxScroll, alvo.getBoundingClientRect().top + window.scrollY);
        // estaciona à DIREITA do título (selo + h2), na altura da 1ª linha — nunca em cima do texto
        const sel = alvo.querySelector(".eyebrow")?.getBoundingClientRect();
        const h2 = (alvo.querySelector("h2") ?? alvo).getBoundingClientRect();
        const dir = Math.max(h2.right, sel?.right ?? 0);
        const fimX = gsap.utils.clamp(120, W - 120, dir + 100);
        const fimY = gsap.utils.clamp(150, H - 140, h2.top + window.scrollY - destScroll + 30);
        const prog = { t: 0 };
        // a cada quadro: posição desejada na tela menos onde a rota da rolagem deixou o robô
        const segue = () => {
          const t = prog.t;
          const dx = (fimX - sx0) * t + Math.sin(t * Math.PI) * -60; // curva leve, como um voo
          const dy = (fimY - sy0) * t + Math.sin(t * Math.PI * 2) * 18;
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
        gsap.to(prog, { t: 1, duration: dur, ease: suave });
        lenis.scrollTo(alvo, { duration: dur, easing: suave, lock: true, force: true });
        // o fim é pelo relógio, não pelo aviso do Lenis (com a seção pinada ele às vezes não avisa)
        gsap.delayedCall(dur, () => {
          {
            // estacionou: luz diminui e a tela volta ao normal
            drone.classList.remove("is-voo");
            gsap.delayedCall(0.9, () => document.body.classList.remove("em-voo"));
            gsap.to(escuro, { opacity: 0, duration: 0.9, ease: "power2.inOut", onComplete: () => { escuro.parentNode?.removeChild(escuro); } });
            gsap.to(beam, { scaleX: 1, scaleY: 1, duration: 0.9, ease: "power2.inOut", onComplete: () => { gsap.set(beam, { clearProps: "opacity,scale,transformOrigin" }); } });
            gsap.to(glow, { scale: 1, duration: 0.9, ease: "power2.inOut", onComplete: () => { gsap.set(glow, { clearProps: "opacity,scale" }); } });
            // segura parado enquanto a rota da rolagem assenta (scrub), depois devolve ao desvio normal
            gsap.delayedCall(1.6, () => {
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
      const INTERVALO = 10000;
      const DURACAO_FALA = 5000; // entrada + 4 s visível + saída
      let passo = 1; // a saudação de abertura já foi um "toque"; o próximo é benefício/incentivo
      let iToque = 0, iOutra = 0;
      const menuAberto = () => !!document.querySelector(".orbmenu.is-open");
      const timerFala = setInterval(() => {
        if (ultimaFala < 0 || document.hidden || menuAberto() || voando) return; // começa só depois da saudação de abertura
        // 10 s de SILÊNCIO entre uma frase sumir e a próxima aparecer (cada frase fica ~5 s na tela)
        if (performance.now() - ultimaFala < INTERVALO + DURACAO_FALA) return;
        const ehToque = passo % 2 === 0;
        const texto = ehToque ? TOQUE[iToque % TOQUE.length] : OUTRAS[iOutra % OUTRAS.length];
        if (!droneSay(texto)) return; // sem lugar livre agora: tenta de novo no próximo segundo
        if (ehToque) iToque++; else iOutra++;
        passo++;
      }, 1000);
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
