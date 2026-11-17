/* =========================================================
   MAFRA — interações e animações
   Libs: GSAP + ScrollTrigger + MotionPathPlugin + Lenis
   ========================================================= */

// >>> Coloque aqui seu número de WhatsApp (DDI + DDD + número, só dígitos). Ex: "5511999999999"
const WHATSAPP = "";

(() => {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  $(".js-year").textContent = new Date().getFullYear();

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  // Âncoras suaves
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2 && id !== "#") return;
      const target = id === "#" || id === "#top" ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      document.body.classList.remove("menu-open");
      lenis ? lenis.scrollTo(target, { duration: 1.6 }) : (target === 0 ? scrollTo(0, 0) : target.scrollIntoView());
    });
  });

  /* ---------- Split de caracteres ---------- */
  $$(".split").forEach((el) => {
    const isGrad = el.classList.contains("grad");
    if (isGrad) el.classList.remove("grad");
    el.innerHTML = [...el.textContent]
      .map((c) => (c === " " ? " " : `<span class="char${isGrad ? " grad" : ""}">${c}</span>`))
      .join("");
  });
  // Split de palavras do manifesto (mantém <em>)
  const manifesto = $(".manifesto__text");
  if (manifesto) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w));
            else { const s = document.createElement("span"); s.className = "word"; s.textContent = w; frag.appendChild(s); }
          });
          n.replaceWith(frag);
        } else walk(n);
      });
    };
    walk(manifesto);
  }

  /* ---------- Preloader ---------- */
  const counter = { v: 0 };
  const count = $(".js-count");
  const loaderTl = gsap.timeline({ onComplete: intro });
  loaderTl
    .to(counter, { v: 100, duration: reduce ? 0.1 : 1.6, ease: "power2.inOut", onUpdate: () => (count.textContent = Math.round(counter.v)) })
    .to(".preloader__bar span", { width: "100%", duration: reduce ? 0.1 : 1.6, ease: "power2.inOut" }, 0)
    .to(".preloader__inner", { y: -30, opacity: 0, duration: 0.4 })
    .to(".preloader", { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "-=0.1");

  function intro() {
    document.body.classList.remove("is-loading");
    $(".preloader").remove();
    lenis && lenis.start();
    const tl = gsap.timeline();
    tl.from(".hero__title .char", { yPercent: 120, rotate: 8, duration: 1.1, ease: "expo.out", stagger: 0.025 })
      .from(".hero__title .rotator", { yPercent: 120, duration: 1, ease: "expo.out" }, 0.3)
      .from(".reveal-up", { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1 }, 0.4)
      .from(".header > *", { y: -60, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.3)
      .from(".hero__scroll", { opacity: 0, duration: 1 }, 1)
      .add(() => droneHello(), 0.8);
    ScrollTrigger.refresh();
  }

  /* ---------- Header + progresso ---------- */
  const header = $(".header");
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      header.classList.toggle("is-scrolled", y > 40);
      header.classList.toggle("is-hidden", y > lastY && y > 400 && !document.body.classList.contains("menu-open"));
      lastY = y;
      gsap.set(".progress span", { scaleX: self.progress });
    },
  });
  $(".burger").addEventListener("click", () => document.body.classList.toggle("menu-open"));

  /* ---------- Rotator de palavras ---------- */
  const track = $(".rotator__track");
  if (track && !reduce) {
    const n = track.children.length - 1;
    const rt = gsap.timeline({ repeat: -1, delay: 2.5 });
    for (let i = 1; i <= n; i++) {
      rt.to(track, { yPercent: (-100 / (n + 1)) * i, duration: 0.8, ease: "expo.inOut" }, `+=1.6`);
    }
    rt.set(track, { yPercent: 0 });
  }

  /* ---------- Canvas de partículas no hero ---------- */
  (() => {
    const canvas = $(".hero__canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, pts = [];
    const mouse = { x: -9999, y: -9999 };
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 14000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4,
      }));
    };
    resize();
    addEventListener("resize", resize);
    canvas.parentElement.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
    const LINK = 130;
    const draw = () => {
      requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 160) { p.x += (dx / d) * 1.4; p.y += (dy / d) * 1.4; }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(155,135,255,${(1 - d / LINK) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 200) {
          ctx.strokeStyle = `rgba(198,255,61,${(1 - md / 200) * 0.5})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = "rgba(230,230,255,.8)";
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
    };
    draw();
  })();

  /* ---------- Parallax dos brilhos do hero ---------- */
  if (!reduce) {
    gsap.to(".hero__glow--a", { yPercent: 40, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__content", { y: 120, opacity: 0.2, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------- Cursor customizado ---------- */
  if (!isTouch) {
    const cursor = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring"), label = $(".cursor__label");
    const xDot = gsap.quickTo(dot, "x", { duration: 0.1 }), yDot = gsap.quickTo(dot, "y", { duration: 0.1 });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" }), yRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
    addEventListener("pointermove", (e) => { cursor.classList.add("is-on"); xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY); });
    $$("[data-cursor]").forEach((el) => {
      el.addEventListener("pointerenter", () => { label.textContent = el.dataset.cursor; cursor.classList.add("is-hover"); });
      el.addEventListener("pointerleave", () => cursor.classList.remove("is-hover"));
    });

    /* Botões magnéticos */
    $$(".magnetic").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });

    /* Cards com tilt 3D + brilho seguindo o mouse */
    $$(".tilt").forEach((el) => {
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry((px - 0.5) * 14); rx((0.5 - py) * 14);
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      });
      el.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
  }

  /* ---------- Manifesto: palavras acendem com o scroll ---------- */
  gsap.to(".manifesto__text .word", {
    opacity: 1, stagger: 0.1, ease: "none",
    scrollTrigger: { trigger: ".manifesto", start: "top 75%", end: "bottom 55%", scrub: true },
  });

  /* ---------- Serviços: scroll horizontal ---------- */
  const sTrack = $(".services__track");
  const sDist = () => Math.max(0, sTrack.scrollWidth - window.innerWidth);
  gsap.to(sTrack, {
    x: () => -sDist(), ease: "none",
    scrollTrigger: {
      trigger: ".services", pin: ".services__pin", start: "top top",
      end: () => "+=" + sDist(), scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
    },
  });
  gsap.from(".services__track .card", {
    y: 80, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out",
    scrollTrigger: { trigger: ".services", start: "top 70%" },
  });

  /* ---------- Processo: celular 3D pinado ---------- */
  const steps = $$(".step"), screens = $$(".screen");
  let current = -1;
  const buildEl = $(".js-build"), buildBar = $(".build__bar span");
  const setStep = (i) => {
    if (i === current) return;
    current = i;
    steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
    screens.forEach((s, k) => s.classList.toggle("is-active", k === i));
    if (i === 2) {
      const b = { v: 0 };
      gsap.fromTo(buildBar, { width: "0%" }, { width: "100%", duration: 1.6, ease: "power2.inOut" });
      gsap.to(b, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => (buildEl.textContent = Math.round(b.v)) });
    }
    if (i === 3) $$(".chart i").forEach((c, k) => c.style.setProperty("--i", k * 0.08));
  };
  const processTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".process", pin: ".process__pin", start: "top top", end: "+=300%", scrub: 1,
      onUpdate: (self) => {
        setStep(Math.min(3, Math.floor(self.progress * 4)));
        gsap.set(".process__bar span", { scaleX: self.progress });
      },
    },
  });
  processTl
    .fromTo(".phone", { rotationY: -28, rotationX: 10, rotationZ: -4 }, { rotationY: 22, rotationX: -6, rotationZ: 3, ease: "none", duration: 1 })
    .fromTo(".orbit--1", { scale: 0.85 }, { scale: 1.1, ease: "none", duration: 1 }, 0)
    .fromTo(".float-chip", { y: 40 }, { y: -60, stagger: 0.1, ease: "none", duration: 0.9 }, 0);
  setStep(0);

  /* ---------- Contadores ---------- */
  $$(".js-counter").forEach((el) => {
    const to = +el.dataset.to;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => gsap.to(o, { v: to, duration: 2, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v)) }),
    });
  });
  gsap.from(".stat", { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".stats", start: "top 80%" } });

  /* ---------- Projetos: entrada em cascata ---------- */
  gsap.from(".project", {
    y: 100, opacity: 0, rotationX: -15, stagger: 0.1, duration: 1.2, ease: "expo.out",
    scrollTrigger: { trigger: ".work__grid", start: "top 80%" },
  });

  /* ---------- Títulos de seção: revelação ---------- */
  $$(".section-title").forEach((t) => {
    gsap.from(t, { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 85%" } });
  });

  /* ---------- Texto gigante que desliza ---------- */
  $$(".bigtext__row").forEach((row) => {
    const dir = +row.dataset.dir;
    gsap.fromTo(row, { xPercent: dir > 0 ? -30 : 0 }, {
      xPercent: dir > 0 ? 0 : -30, ease: "none",
      scrollTrigger: { trigger: ".bigtext", start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  /* ---------- Contato ---------- */
  gsap.from(".contact__title .char", {
    yPercent: 120, stagger: 0.03, duration: 1, ease: "expo.out",
    scrollTrigger: { trigger: ".contact", start: "top 65%" },
  });
  gsap.from(".form .field, .form .btn", {
    y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out",
    scrollTrigger: { trigger: ".form", start: "top 85%" },
  });
  $(".js-submit").addEventListener("click", () => {
    const form = $(".form");
    if (!form.reportValidity()) return;
    const msg = `Olá! Meu nome é ${$("#f-name").value}.\nContato: ${$("#f-contact").value}\n\n${$("#f-msg").value}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    droneSay("Mensagem a caminho! 🚀", 3);
  });

  /* =========================================================
     DRONE — voa pela tela acompanhando o scroll
     ========================================================= */
  const drone = $(".drone"), droneBody = $(".drone__body"), bubble = $(".drone__bubble"), bubbleTxt = $(".drone__bubble span");
  let bubbleTl;
  function droneSay(text, hold = 2.6) {
    if (!bubble) return;
    bubbleTxt.textContent = text;
    bubbleTl && bubbleTl.kill();
    bubbleTl = gsap.timeline()
      .to(bubble, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" })
      .to(bubble, { opacity: 0, scale: 0.6, duration: 0.3, ease: "power2.in" }, `+=${hold}`);
  }
  function droneHello() { droneSay("Oi! Eu sou o Mafrinha 👋 Role comigo!", 3); }

  if (reduce) {
    gsap.set(drone, { x: window.innerWidth - 110, y: window.innerHeight - 90 });
  } else {
    // Pontos (em frações da viewport) por onde o drone passa ao longo da página.
    // Ele fica nas laterais para não cobrir o conteúdo e cruza a tela entre as seções.
    const route = [
      [0.84, 0.30], [0.90, 0.62], [0.55, 0.88], [0.12, 0.70], [0.08, 0.30],
      [0.40, 0.14], [0.88, 0.22], [0.92, 0.55], [0.70, 0.82], [0.30, 0.86],
      [0.07, 0.55], [0.10, 0.22], [0.50, 0.12], [0.88, 0.35], [0.86, 0.75],
      [0.50, 0.88], [0.14, 0.78], [0.80, 0.30],
    ];
    const toPx = () => route.map(([x, y]) => ({ x: x * window.innerWidth, y: y * window.innerHeight }));
    let lastX = 0, flyTween;
    const buildFlight = () => {
      const prog = flyTween ? flyTween.scrollTrigger.progress : 0;
      flyTween && flyTween.scrollTrigger.kill() && flyTween.kill();
      flyTween = gsap.to(drone, {
        motionPath: { path: toPx(), curviness: 1.4 },
        ease: "none", immediateRender: true,
        scrollTrigger: {
          trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.4,
          onUpdate: (self) => {
            // Inclina o drone na direção do movimento (como um drone de verdade)
            const x = gsap.getProperty(drone, "x");
            const dx = x - lastX; lastX = x;
            gsap.to(droneBody, { rotation: gsap.utils.clamp(-28, 28, dx * 1.4), duration: 0.5, overwrite: "auto" });
            drone.classList.toggle("is-right", x > window.innerWidth * 0.55);
          },
        },
      });
      flyTween.progress(prog);
      lastX = gsap.getProperty(drone, "x");
    };
    buildFlight();
    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { buildFlight(); ScrollTrigger.refresh(); }, 250); });

    // Faíscas atrás do drone
    const layer = $(".drone-layer");
    let lastSpark = 0, px = 0, py = 0;
    gsap.ticker.add(() => {
      const x = gsap.getProperty(drone, "x"), y = gsap.getProperty(drone, "y");
      const moved = Math.hypot(x - px, y - py);
      const now = performance.now();
      if (moved > 2 && now - lastSpark > 28) {
        lastSpark = now;
        const s = document.createElement("i");
        s.className = "spark";
        layer.appendChild(s);
        gsap.set(s, { x: x + gsap.utils.random(-10, 10), y: y + 18 + gsap.utils.random(-6, 6) });
        gsap.to(s, { y: "+=" + gsap.utils.random(20, 50), opacity: 0, scale: 0, duration: gsap.utils.random(0.6, 1.1), ease: "power2.out", onComplete: () => s.remove() });
      }
      px = x; py = y;
    });

    // Falas do drone em cada seção
    const lines = [
      [".services", "Olha tudo que dá pra fazer ✨"],
      [".process", "Segue comigo, do zero até a loja 📱"],
      [".stats", "Números que falam por si 📈"],
      ["#projetos", "Qual desses é o seu? 🤔"],
      [".contact", "Chegamos! Bora tirar seu app do papel? 🚀"],
    ];
    lines.forEach(([sel, text]) => ScrollTrigger.create({ trigger: sel, start: "top 55%", onEnter: () => droneSay(text) }));
  }
})();
