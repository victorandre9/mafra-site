"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Lenis from "lenis";

// >>> Coloque aqui seu número de WhatsApp (DDI + DDD + número, só dígitos). Ex: "5511999999999"
const WHATSAPP = "";

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
          .add(() => droneSay("Oi! Eu sou o Mafrinha 👋 Role comigo!", 3), 0.8);
        ScrollTrigger.refresh();
      }

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
        for (let i = 1; i <= n; i++) rt.to(track, { yPercent: (-100 / (n + 1)) * i, duration: 0.8, ease: "expo.inOut" }, "+=1.6");
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
        gsap.to(".hero__content", { y: 120, opacity: 0.2, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
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
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: ".manifesto", start: "top 75%", end: "bottom 55%", scrub: true },
      });

      /* ---------- Serviços: rolagem horizontal ---------- */
      const sTrack = $(".services__track");
      const sDist = () => Math.max(0, sTrack.scrollWidth - window.innerWidth);
      gsap.to(sTrack, {
        x: () => -sDist(), ease: "none",
        scrollTrigger: { trigger: ".services", pin: ".services__pin", start: "top top", end: () => "+=" + sDist(), scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      gsap.from(".services__track .card", { y: 120, rotationY: -25, rotationX: 10, opacity: 0, stagger: 0.09, duration: 1.4, ease: "expo.out", transformPerspective: 1000, scrollTrigger: { trigger: ".services", start: "top 70%" } });

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
            trigger: ".process", pin: ".process__pin", start: "top top", end: "+=300%", scrub: 1,
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

      /* ---------- Fluxo do pedido: linha se desenha, pacote viaja, setores acendem ---------- */
      const nodes = $$(".flow__node");
      const desktopFlow = window.innerWidth > 860;
      const flowTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".flow",
          pin: desktopFlow ? ".flow__pin" : false,
          start: desktopFlow ? "top top" : "top 70%",
          end: desktopFlow ? "+=180%" : "bottom 60%",
          scrub: 1,
          onUpdate: (self) => {
            const n = Math.max(1, Math.round(self.progress * nodes.length));
            nodes.forEach((el, k) => el.classList.toggle("is-on", k < n));
          },
        },
      });
      flowTl
        .to(".flow__line-fg", { strokeDashoffset: 0, ease: "none", duration: 1 }, 0)
        .to(".flow__packet", { x: () => $(".flow__line").getBoundingClientRect().width - 30, ease: "none", duration: 1 }, 0)
        .to(".flow__packet", { y: -10, rotation: 8, yoyo: true, repeat: 7, ease: "sine.inOut", duration: 0.125 }, 0);

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
      $$(".flow__sub, .work__lead, .about__lead, .contact__sub, .process__note, .eyebrow:not(.reveal-up)").forEach((p) => {
        gsap.from(p, { y: 30, opacity: 0, filter: "blur(8px)", duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 88%" } });
      });

      // Faixa de tecnologias e textos gigantes reagem à velocidade da rolagem
      const skewTo = gsap.quickTo(".marquee__group, .bigtext__row", "skewX", { duration: 0.6, ease: "power3" });
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => skewTo(gsap.utils.clamp(-12, 12, self.getVelocity() / -250)),
      });
      $$(".bigtext__row").forEach((row) => {
        const dir = Number(row.dataset.dir);
        gsap.fromTo(row, { xPercent: dir > 0 ? -30 : 0 }, { xPercent: dir > 0 ? 0 : -30, ease: "none", scrollTrigger: { trigger: ".bigtext", start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* ---------- Contato ---------- */
      gsap.from(".contact__title .char", { yPercent: 120, stagger: 0.03, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".contact", start: "top 65%" } });
      gsap.from(".form .field, .form .btn", { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".form", start: "top 85%" } });
      on($(".form"), "submit", (e: SubmitEvent) => {
        e.preventDefault();
        const val = (id: string) => ($(id) as HTMLInputElement).value;
        const company = val("#f-company");
        const msg = `Olá, Victor! Meu nome é ${val("#f-name")}${company ? ` (${company})` : ""}.\n\n${val("#f-msg")}`;
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
        droneSay("Mensagem a caminho! 🚀", 3);
      });

      /* =====================================================
         DRONE — voa pela tela acompanhando a rolagem
         ===================================================== */
      const drone = $(".drone"), droneBody = $(".drone__body"), bubble = $(".drone__bubble"), bubbleTxt = $(".drone__bubble span");
      const altEl = $(".js-alt");
      let bubbleTl: gsap.core.Timeline | undefined;
      function droneSay(text: string, hold = 2.6) {
        bubbleTxt.textContent = text;
        bubbleTl?.kill();
        bubbleTl = gsap
          .timeline()
          .to(bubble, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" })
          .to(bubble, { opacity: 0, scale: 0.6, duration: 0.3, ease: "power2.in" }, `+=${hold}`);
      }

      if (reduce) {
        gsap.set(drone, { x: window.innerWidth - 110, y: window.innerHeight - 90 });
        return;
      }

      // Rota em frações da viewport: fica nas laterais e cruza a tela entre as seções.
      const route: Array<[number, number]> = [
        [0.84, 0.3], [0.9, 0.62], [0.55, 0.88], [0.12, 0.7], [0.08, 0.3],
        [0.4, 0.14], [0.88, 0.22], [0.92, 0.55], [0.7, 0.82], [0.3, 0.86],
        [0.07, 0.55], [0.1, 0.22], [0.5, 0.12], [0.88, 0.35], [0.86, 0.75],
        [0.5, 0.88], [0.14, 0.78], [0.8, 0.3],
      ];
      const toPx = () => route.map(([x, y]) => ({ x: x * window.innerWidth, y: y * window.innerHeight }));
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
              gsap.to(droneBody, { rotation: gsap.utils.clamp(-28, 28, dx * 1.4), duration: 0.5, overwrite: "auto" });
              drone.classList.toggle("is-right", x > window.innerWidth * 0.55);
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
      const pupil = drone.querySelector(".drone__pupil") as SVGElement;
      const svg = droneBody.querySelector("svg") as SVGElement;
      const dodge = $(".drone__dodge");
      const dodgeX = gsap.quickTo(dodge, "x", { duration: 0.7, ease: "power3" });
      const dodgeY = gsap.quickTo(dodge, "y", { duration: 0.7, ease: "power3" });
      const pupilX = gsap.quickTo(pupil, "x", { duration: 0.25 });
      const pupilY = gsap.quickTo(pupil, "y", { duration: 0.25 });
      on(window, "pointermove", (e: PointerEvent) => {
        const r = droneBody.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        // o olho segue o cursor
        pupilX((dx / d) * 3.4); pupilY((dy / d) * 3.4);
        // desvia quando o cursor chega perto (no toque, só reage ao clique)
        if (!isTouch && d < 150) {
          const push = ((150 - d) / 150) * 80;
          dodgeX((-dx / d) * push); dodgeY((-dy / d) * push);
        } else { dodgeX(0); dodgeY(0); }
      });
      const quips = [
        "Ei! Isso faz cócegas 😆",
        "Quer um app assim pra sua empresa?",
        "Escaneando sua operação… 🔎",
        "Processo organizado = menos retrabalho ✅",
        "Bora marcar o diagnóstico? 🚀",
      ];
      let qi = 0, rolling = false;
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
        droneSay(quips[qi++ % quips.length], 2.4);
        gsap.timeline({ onComplete: () => { rolling = false; drone.classList.remove("is-boost"); sysEl.textContent = "OK"; } })
          .to(svg, { rotation: 360, scale: 1.2, y: -36, duration: 0.85, ease: "power3.inOut", transformOrigin: "50% 50%" })
          .to(svg, { y: 0, scale: 1, duration: 0.7, ease: "bounce.out" })
          .set(svg, { rotation: 0 });
      });

      // Faíscas atrás do drone (menos no celular)
      const layer = $(".drone-layer");
      const sparkEvery = isTouch ? 70 : 28;
      let lastSpark = 0, px = 0, py = 0;
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
      const lines: Array<[string, string]> = [
        [".services", "Olha tudo que dá pra fazer ✨"],
        [".process", "Esse é o método MAFRA 📱"],
        [".flow", "Fala comigo que eu anoto! 🎙️"],
        ["#cases", "Tecnologia que já está em uso 💪"],
        ["#sobre", "Prazer, esse é o Victor 🤝"],
        [".contact", "Chegamos! Qual processo vamos organizar? 🚀"],
      ];
      lines.forEach(([sel, text]) => ScrollTrigger.create({ trigger: sel, start: "top 55%", onEnter: () => droneSay(text) }));
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
