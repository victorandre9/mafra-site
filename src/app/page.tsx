import Experience from "@/components/Experience";
import Hero3DLazy from "@/components/Hero3DLazy";
import { Drone } from "@/components/Drone";
import { Phone } from "@/components/Phone";
import { SplitChars, SplitWords } from "@/components/Split";

const TECH = ["Flutter", "React Native", "Swift", "Kotlin", "Firebase", "Node.js", "Supabase", "Figma", "IA & LLMs"];

const SERVICES = [
  {
    title: "Consultoria estratégica",
    text: "Valido sua ideia, defino escopo, prioridades e o caminho tecnológico mais inteligente para o seu orçamento.",
    tags: ["Discovery & MVP", "Roadmap de produto", "Escolha de stack"],
    icon: <><circle cx="24" cy="24" r="18" /><path d="M24 12v12l8 6" /></>,
  },
  {
    title: "UX/UI Design",
    text: "Interfaces lindas e intuitivas, prototipadas e testadas antes de escrever uma linha de código.",
    tags: ["Wireframes", "Design System", "Protótipo navegável"],
    icon: <><rect x="8" y="8" width="32" height="32" rx="8" /><path d="M8 20h32M20 20v20" /></>,
  },
  {
    title: "Desenvolvimento mobile",
    text: "Apps nativos e multiplataforma (iOS e Android) rápidos, estáveis e prontos para escalar.",
    tags: ["Flutter / React Native", "Swift / Kotlin", "Publicação nas lojas"],
    icon: <><rect x="14" y="4" width="20" height="40" rx="5" /><path d="M21 38h6" /></>,
  },
  {
    title: "Integrações & Back-end",
    text: "APIs, pagamentos, notificações, login social, painéis administrativos e integrações com seu sistema.",
    tags: ["APIs REST/GraphQL", "Pagamentos & PIX", "Cloud & Firebase"],
    icon: <><path d="M6 30l10-10 8 8 18-18" /><path d="M32 10h10v10" /></>,
  },
  {
    title: "IA & Automação",
    text: "Chatbots, assistentes inteligentes e automações que colocam inteligência artificial para trabalhar no seu app.",
    tags: ["Assistentes com LLM", "Automação de processos", "Análise de dados"],
    icon: <><circle cx="24" cy="24" r="6" /><path d="M24 4v8M24 36v8M4 24h8M36 24h8M10 10l6 6M32 32l6 6M38 10l-6 6M16 32l-6 6" /></>,
  },
];

const STEPS = [
  ["Descoberta", "Entendo seu negócio, público e objetivos. Saímos com escopo claro e um MVP enxuto."],
  ["Design", "Protótipo navegável para você testar no celular antes de investir em código."],
  ["Desenvolvimento", "Sprints semanais com entregas que você acompanha e testa em tempo real."],
  ["Lançamento & evolução", "Publicação nas lojas, métricas e melhorias contínuas para seu app crescer."],
];

const STATS = [
  { to: 40, suffix: "+", label: "projetos digitais entregues" },
  { to: 98, suffix: "%", label: "clientes satisfeitos" },
  { to: 8, suffix: " sem", label: "tempo médio até o MVP" },
  { to: 24, suffix: "/7", label: "monitoramento pós-lançamento" },
];

const PROJECTS = [
  { cls: "p-delivery", emoji: "🛵", title: "Delivery & marketplace", text: "Pedidos, rastreio em tempo real, pagamentos" },
  { cls: "p-health", emoji: "🩺", title: "Saúde & agendamentos", text: "Agenda, teleconsulta, lembretes" },
  { cls: "p-fin", emoji: "💳", title: "Fintech & carteiras", text: "PIX, extratos, cartões, segurança" },
  { cls: "p-fit", emoji: "🏋️", title: "Fitness & bem-estar", text: "Treinos, gamificação, wearables" },
  { cls: "p-edu", emoji: "🎓", title: "Educação", text: "Cursos, quizzes, progresso do aluno" },
  { cls: "p-biz", emoji: "📊", title: "Gestão interna", text: "Apps para equipes, campo e operações" },
];

const NAV = [
  ["#servicos", "Serviços"],
  ["#processo", "Processo"],
  ["#projetos", "Projetos"],
  ["#contato", "Contato"],
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="dot" /> {children}
    </p>
  );
}

export default function Home() {
  return (
    <>
      <Experience />

      {/* PRELOADER */}
      <div className="preloader" aria-hidden="true">
        <div className="preloader__inner">
          <div className="preloader__logo">mafra<span>.</span></div>
          <div className="preloader__bar"><span /></div>
          <div className="preloader__count"><span className="js-count">0</span>%</div>
        </div>
      </div>

      {/* CURSOR */}
      <div className="cursor" aria-hidden="true">
        <div className="cursor__dot" />
        <div className="cursor__ring"><span className="cursor__label" /></div>
      </div>

      <Drone />

      {/* HEADER */}
      <header className="header">
        <a href="#top" className="logo" data-cursor="Topo">mafra<span>.</span></a>
        <nav className="nav">
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className="nav__link">{label}</a>
          ))}
        </nav>
        <a href="#contato" className="btn btn--small magnetic" data-cursor="Vamos!"><span>Fale comigo</span></a>
        <button className="burger" aria-label="Abrir menu"><span /><span /></button>
      </header>
      <div className="mobile-menu">
        {NAV.map(([href, label]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </div>

      <div className="progress" aria-hidden="true"><span /></div>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero__glow hero__glow--a" />
          <div className="hero__glow hero__glow--b" />
          <Hero3DLazy />
          <div className="container hero__content">
            <p className="eyebrow reveal-up"><span className="dot" /> Consultoria &amp; implementação de aplicativos</p>
            <h1 className="hero__title">
              <span className="line"><SplitChars text="Transformo" /></span>
              <span className="line">
                <SplitChars text="ideias em" />{" "}
                <span className="rotator">
                  <span className="rotator__track">
                    <span>apps</span><span>produtos</span><span>resultados</span><span>apps</span>
                  </span>
                </span>
              </span>
              <span className="line"><SplitChars text="que se movem." className="outline" /></span>
            </h1>
            <p className="hero__sub reveal-up">
              Do primeiro rascunho ao app publicado na App Store e Google Play. Estratégia, design e código, com a
              mesma obsessão por detalhe que você está vendo nesta página.
            </p>
            <div className="hero__ctas reveal-up">
              <a href="#contato" className="btn magnetic" data-cursor="Bora"><span>Quero meu app</span><i className="btn__arrow">→</i></a>
              <a href="#processo" className="btn btn--ghost magnetic" data-cursor="Ver"><span>Como eu trabalho</span></a>
            </div>
          </div>
          <div className="hero__scroll">
            <span>role para voar</span>
            <div className="hero__mouse"><span /></div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="marquee" aria-label="Tecnologias">
          <div className="marquee__track">
            {[0, 1].map((g) => (
              <div key={g} className="marquee__group" aria-hidden={g === 1}>
                {TECH.map((t) => (
                  <span key={t} className="contents">
                    <span>{t}</span><i>✦</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="manifesto container">
          <p className="manifesto__text">
            <SplitWords text="Um bom aplicativo não é só bonito. Ele" />{" "}
            <em><SplitWords text="resolve um problema real," /></em>{" "}
            <SplitWords text="encanta quem usa e" />{" "}
            <em><SplitWords text="gera retorno" /></em>{" "}
            <SplitWords text="para quem investe. Meu trabalho é unir negócio, design e tecnologia para que o seu app nasça certo, desde o primeiro clique." />
          </p>
        </section>

        {/* SERVIÇOS */}
        <section className="services" id="servicos">
          <div className="services__pin">
            <div className="services__head container">
              <Eyebrow>Serviços</Eyebrow>
              <h2 className="section-title">O que eu faço <span className="grad">por você</span></h2>
            </div>
            <div className="services__track">
              {SERVICES.map((s, i) => (
                <article key={s.title} className="card tilt" data-cursor="✦">
                  <div className="card__num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="card__icon"><svg viewBox="0 0 48 48">{s.icon}</svg></div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <ul>{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                </article>
              ))}
              <article className="card card--cta">
                <h3>Tem um desafio diferente?</h3>
                <p>Bora conversar. Se tem tela, tem jeito.</p>
                <a href="#contato" className="btn magnetic" data-cursor="Bora"><span>Conversar</span><i className="btn__arrow">→</i></a>
              </article>
            </div>
          </div>
        </section>

        {/* PROCESSO */}
        <section className="process" id="processo">
          <div className="process__pin">
            <div className="container process__grid">
              <div className="process__text">
                <Eyebrow>Processo</Eyebrow>
                <h2 className="section-title">Da ideia à <span className="grad">loja</span></h2>
                <div className="steps">
                  {STEPS.map(([t, d], i) => (
                    <div key={t} className={`step${i === 0 ? " is-active" : ""}`}>
                      <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                      <div><h3>{t}</h3><p>{d}</p></div>
                    </div>
                  ))}
                </div>
                <div className="process__bar"><span /></div>
              </div>
              <div className="process__stage">
                <div className="orbit orbit--1"><span /></div>
                <div className="orbit orbit--2"><span /></div>
                <Phone />
                <div className="float-chip chip--a">⚡ 60fps</div>
                <div className="float-chip chip--b">🔒 Seguro</div>
                <div className="float-chip chip--c">☁️ Cloud</div>
              </div>
            </div>
          </div>
        </section>

        {/* NÚMEROS */}
        <section className="stats container">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <div className="stat__n"><span className="js-counter" data-to={s.to}>0</span>{s.suffix}</div>
              <p>{s.label}</p>
            </div>
          ))}
        </section>

        {/* PROJETOS */}
        <section className="work container" id="projetos">
          <Eyebrow>Projetos</Eyebrow>
          <h2 className="section-title">Tipos de app que <span className="grad">eu construo</span></h2>
          <div className="work__grid">
            {PROJECTS.map((p) => (
              <a key={p.title} className="project tilt" href="#contato" data-cursor="Quero">
                <div className={`project__media ${p.cls}`}><div className="project__emoji">{p.emoji}</div></div>
                <div className="project__info"><h3>{p.title}</h3><span>{p.text}</span></div>
              </a>
            ))}
          </div>
        </section>

        {/* TEXTO GIGANTE */}
        <section className="bigtext" aria-hidden="true">
          <div className="bigtext__row" data-dir="-1">tecnologia ✦ design ✦ estratégia ✦ tecnologia ✦ design ✦ estratégia ✦</div>
          <div className="bigtext__row outline" data-dir="1">ios ✦ android ✦ web ✦ ia ✦ ios ✦ android ✦ web ✦ ia ✦</div>
        </section>

        {/* CONTATO */}
        <section className="contact" id="contato">
          <div className="contact__glow" />
          <div className="container contact__inner">
            <Eyebrow>Contato</Eyebrow>
            <h2 className="contact__title">
              <span className="line"><SplitChars text="Seu app" /></span>
              <span className="line"><SplitChars text="começa aqui." charClassName="grad" /></span>
            </h2>
            <p className="contact__sub">Me conta sua ideia. Respondo em até 24h com os próximos passos, sem compromisso.</p>
            <form className="form">
              <div className="field"><input id="f-name" type="text" required placeholder=" " /><label htmlFor="f-name">Seu nome</label></div>
              <div className="field"><input id="f-contact" type="text" required placeholder=" " /><label htmlFor="f-contact">E-mail ou WhatsApp</label></div>
              <div className="field field--full"><textarea id="f-msg" rows={3} required placeholder=" " /><label htmlFor="f-msg">Conte sobre seu projeto</label></div>
              <button type="submit" className="btn btn--big magnetic" data-cursor="Enviar"><span>Enviar pelo WhatsApp</span><i className="btn__arrow">→</i></button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer container">
        <div className="logo">mafra<span>.</span></div>
        <p>© {new Date().getFullYear()} Mafra — Consultoria e Implementação de Aplicativos</p>
        <div className="footer__links">
          <a href="#" data-cursor="↗">Instagram</a>
          <a href="#" data-cursor="↗">LinkedIn</a>
          <a href="#top" data-cursor="↑">Voltar ao topo ↑</a>
        </div>
      </footer>
    </>
  );
}
