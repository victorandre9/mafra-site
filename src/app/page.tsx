import Experience from "@/components/Experience";
import Hero3DLazy from "@/components/Hero3DLazy";
import { Drone } from "@/components/Drone";
import { Phone } from "@/components/Phone";
import { SplitChars, SplitWords } from "@/components/Split";
import { Chevron, Logo, LogoImage } from "@/components/Logo";

const TECH = [
  "Ordens de serviço", "Força de vendas", "Logística & entregas", "Financeiro", "Checklists",
  "Dashboards", "Integração com ERP", "Gestão de ativos", "ISO 9001", "IA aplicada",
];

const SERVICES = [
  {
    title: "Diagnóstico & processos",
    text: "Mapeio rotinas, gargalos e informações que faltam ao gestor. Organizo fluxos, padrões e responsabilidades antes de qualquer linha de código.",
    tags: ["Mapeamento de rotinas", "Padronização", "Melhoria contínua"],
    icon: <><circle cx="21" cy="21" r="13" /><path d="M31 31l11 11" /><path d="M15 21h12M21 15v12" /></>,
  },
  {
    title: "Aplicativos de gestão sob medida",
    text: "Sistemas no celular e no computador, desenhados para a rotina real da sua equipe — com acesso por perfil e a informação certa para cada função.",
    tags: ["Web + mobile", "Perfis de acesso", "Uso em campo"],
    icon: <><rect x="14" y="4" width="20" height="40" rx="5" /><path d="M21 38h6M19 14h10M19 20h10M19 26h6" /></>,
  },
  {
    title: "Integração com ERP & sistemas",
    text: "O app complementa o que você já usa. Pedidos, crédito e faturamento continuam no ERP; a operação ganha uma interface ágil conectada por API.",
    tags: ["API autenticada", "ERP existente", "Dados centralizados"],
    icon: <><rect x="4" y="16" width="14" height="16" rx="3" /><rect x="30" y="16" width="14" height="16" rx="3" /><path d="M18 24h12M24 20l4 4-4 4" /></>,
  },
  {
    title: "Indicadores & dashboards",
    text: "Registros, alertas e painéis em tempo útil. Sócios e gestores acompanham equipes, pendências, recebíveis e resultados sem depender de mensagens.",
    tags: ["Painéis por perfil", "Alertas", "Relatórios"],
    icon: <><path d="M6 42V6M6 42h36" /><path d="M14 32l8-9 7 6 11-14" /></>,
  },
  {
    title: "Implantação & suporte",
    text: "Configuração, carga inicial, treinamento da equipe e acompanhamento dos primeiros 30 dias. Depois, hospedagem, backups, manutenção e suporte.",
    tags: ["Treinamento", "30 dias assistidos", "Suporte contínuo"],
    icon: <><path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z" /><path d="M17 24l5 5 9-10" /></>,
  },
];

const STEPS = [
  ["Diagnóstico das rotinas", "Entendo atividades, dificuldades, gargalos e as informações que faltam ao gestor."],
  ["Organização dos processos", "Defino fluxos, padrões, responsabilidades e oportunidades de melhoria."],
  ["Indicadores e controles digitais", "Crio registros, alertas, dashboards e informações em tempo útil — no app."],
  ["Gestão de desempenho", "Acompanhamos equipes, produtividade, qualidade e a evolução dos resultados."],
];

const STATS = [
  { to: 30, suffix: "–60", unit: "dias", label: "prazo típico de implantação de um app de gestão" },
  { to: 30, suffix: "", unit: "dias", label: "de acompanhamento assistido após a entrada em uso" },
  { to: 3, suffix: "", unit: "canais", label: "de registro já aplicados em produção: voz, foto e WhatsApp" },
  { to: 100, suffix: "%", unit: "", label: "sob medida para a sua empresa — do diagnóstico ao suporte" },
];

const ABOUT = [
  {
    n: "01",
    title: "Gestão e liderança",
    text: "Atuação como gestor e sócio empresarial: liderança de equipes, gestão de recursos, custos e processos, metas e planejamento estratégico.",
  },
  {
    n: "02",
    title: "Qualidade e processos",
    text: "Mapeamento de rotinas, melhoria contínua, padronização, sistemas da qualidade e atuação em auditorias ISO 9001.",
  },
  {
    n: "03",
    title: "Formação e tecnologia",
    text: "Processos Gerenciais, MBA em Gestão Empresarial (em curso), Técnico em Informática Gerencial e desenvolvimento de aplicativos.",
  },
];

const CASES = [
  {
    cls: "p-verifica",
    tag: "Solução empresarial · Gestão operacional",
    title: "Verifica — Gestão Operacional Inteligente",
    text: "Sistema sob medida para uma transportadora: checklists, frota, qualidade e RH no mesmo lugar. Indicadores clicáveis levam direto ao detalhe, e a gestão monta apresentações com as telas do próprio app.",
    bullets: ["Checklists e frota", "Qualidade (ROQ) com indicadores", "RH, férias e documentação", "Despesas, multas e premiações", "Exporta Excel e PDF"],
    gain: "Rotinas que viviam em planilhas e mensagens viraram um sistema único, com histórico pronto para auditoria.",
    icon: "✅",
    logo: "",
    wordmark: "verifica",
    badge: "",
  },
  {
    cls: "p-vos",
    tag: "Projeto autoral · Voz e inteligência artificial",
    title: "Vo$ — registro por voz e foto",
    text: "Você fala o gasto ou manda a foto do cupom; a IA transcreve, entende valor e categoria e até divide a compra entre categorias. Funciona também pelo WhatsApp.",
    bullets: ["Voz, foto e WhatsApp", "IA lê o cupom fiscal", "Espaços compartilhados", "Relatórios e metas"],
    gain: "A mesma tecnologia pode registrar uma visita, uma ocorrência ou uma despesa da equipe em campo — sem digitar.",
    icon: "🎙️",
    logo: "/cases/vos-logo.webp",
    wordmark: "",
    badge: "Vo$",
  },
  {
    cls: "p-ifluxo",
    tag: "Projeto autoral · Dados de movimento",
    title: "iFluxo — confira o movimento antes de sair",
    text: "Consulta do nível de lotação de bares, restaurantes, academias e outros estabelecimentos para escolher o melhor momento da visita.",
    bullets: ["Quantidade de pessoas no local", "Nível de lotação", "Comparação entre estabelecimentos", "Planejamento da visita"],
    gain: "Mostra como transformar dados de movimento em decisão: útil para capacidade, escalas e atendimento.",
    icon: "",
    logo: "",
    wordmark: "",
    badge: "iFluxo",
  },
];

const FLOW = [
  ["Você fala", "“Gastei 42 no mercado”"],
  ["Transcrição", "O áudio vira texto"],
  ["IA entende", "Valor, categoria e data"],
  ["Cupom dividido", "Cada item na categoria certa"],
  ["Você confere", "Nada é salvo sem ok"],
  ["Relatórios", "Mês, tendências e orçamento"],
];

const NAV = [
  ["#servicos", "Serviços"],
  ["#metodo", "Método"],
  ["#cases", "Cases"],
  ["#sobre", "Sobre"],
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
          <div className="preloader__logo"><LogoImage size={200} priority /></div>
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
        <a href="#top" className="logo" data-cursor="Topo" aria-label="MAFRA Consultoria & Tecnologia"><Logo size={62} /></a>
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
          <div className="hero__chevrons" aria-hidden="true">
            <Chevron className="chev chev--big" />
            <Chevron className="chev chev--mid" />
            <Chevron className="chev chev--small" />
          </div>
          <Hero3DLazy />
          <div className="container hero__content">
            <p className="pill reveal-up">Consultoria &amp; implementação de aplicativos</p>
            <h1 className="hero__title">
              <span className="line"><SplitChars text="Transformo" /></span>
              <span className="line">
                <SplitChars text="processos em" />{" "}
              </span>
              <span className="line">
                <span className="rotator">
                  <span className="rotator__track">
                    <span>aplicativos</span><span>controle</span><span>resultados</span><span>aplicativos</span>
                  </span>
                </span>
              </span>
              <span className="line"><SplitChars text="que movem." className="outline" /></span>
            </h1>
            <p className="hero__sub reveal-up">
              Entendo a rotina da sua empresa, organizo os processos e desenvolvo o aplicativo de gestão que a sua
              equipe usa de verdade — no celular e no computador, integrado ao que você já tem.
            </p>
            <div className="hero__ctas reveal-up">
              <a href="#contato" className="btn magnetic" data-cursor="Bora"><span>Agendar diagnóstico</span><i className="btn__arrow">→</i></a>
              <a href="#metodo" className="btn btn--ghost magnetic" data-cursor="Ver"><span>Conhecer o método</span></a>
            </div>
            <p className="hero__tagline reveal-up"><span className="hero__rule" />Da necessidade operacional à solução digital.</p>
          </div>
          <div className="hero__scroll">
            <span>role para voar</span>
            <div className="hero__mouse"><span /></div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="marquee" aria-label="O que digitalizamos">
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
            <SplitWords text="Sistema bom não é o mais bonito. É o que" />{" "}
            <em><SplitWords text="nasce da rotina real," /></em>{" "}
            <SplitWords text="elimina retrabalho e coloca" />{" "}
            <em><SplitWords text="a informação certa" /></em>{" "}
            <SplitWords text="nas mãos de quem decide. Entendemos o negócio. Transformamos processos. Desenvolvemos soluções." />
          </p>
        </section>

        {/* SERVIÇOS */}
        <section className="services" id="servicos">
          <div className="services__pin">
            <div className="services__head container">
              <Eyebrow>Serviços</Eyebrow>
              <h2 className="section-title">Gestão na prática. <span className="grad">Tecnologia com propósito.</span></h2>
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
                <h3>Qual é o gargalo da sua operação?</h3>
                <p>Me conta. O diagnóstico é o primeiro passo — e a conversa é sem compromisso.</p>
                <a href="#contato" className="btn magnetic" data-cursor="Bora"><span>Conversar</span><i className="btn__arrow">→</i></a>
              </article>
            </div>
          </div>
        </section>

        {/* MÉTODO (celular 3D pinado) */}
        <section className="process" id="metodo">
          <div className="process__pin">
            <div className="container process__grid">
              <div className="process__text">
                <Eyebrow>Metodologia MAFRA</Eyebrow>
                <h2 className="section-title">Programa de <span className="grad">Eficiência Operacional</span></h2>
                <div className="steps">
                  {STEPS.map(([t, d], i) => (
                    <div key={t} className={`step${i === 0 ? " is-active" : ""}`}>
                      <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                      <div><h3>{t}</h3><p>{d}</p></div>
                    </div>
                  ))}
                </div>
                <div className="process__bar"><span /></div>
                <p className="process__note">Dois resultados: <strong>reduzir desperdícios</strong> e <strong>criar condições para crescer</strong>.</p>
              </div>
              <div className="process__stage">
                <div className="orbit orbit--1"><span /></div>
                <div className="orbit orbit--2"><span /></div>
                <Phone />
                <div className="float-chip chip--a">📊 Indicadores</div>
                <div className="float-chip chip--b">🔒 Acesso por perfil</div>
                <div className="float-chip chip--c">🔗 Integra ao ERP</div>
              </div>
            </div>
          </div>
        </section>

        {/* NÚMEROS */}
        <section className="stats container">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <div className="stat__n">
                <span className="js-counter" data-to={s.to}>0</span>{s.suffix}
                <small>{s.unit}</small>
              </div>
              <p>{s.label}</p>
            </div>
          ))}
        </section>

        {/* FLUXO DO PEDIDO */}
        <section className="flow" aria-labelledby="flow-title">
          <div className="flow__pin">
            <div className="container">
              <Eyebrow>Tecnologia aplicada</Eyebrow>
              <h2 id="flow-title" className="section-title">Da fala ao relatório, <span className="grad">em segundos.</span></h2>
              <p className="flow__sub">Voz e inteligência artificial no lugar da digitação. Aqui, o exemplo é o registro de um gasto — na sua empresa, pode ser a visita do vendedor, a ocorrência do técnico ou o checklist do motorista.</p>
            </div>
            <div className="flow__track container">
              <svg className="flow__line" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true">
                <path className="flow__line-bg" d="M0 10H1000" />
                <path className="flow__line-fg" d="M0 10H1000" />
              </svg>
              <div className="flow__packet" aria-hidden="true">💸</div>
              <ol className="flow__nodes">
                {FLOW.map(([who, what], i) => (
                  <li key={who} className="flow__node">
                    <span className="flow__dot">{String(i + 1).padStart(2, "0")}</span>
                    <strong>{who}</strong>
                    <span>{what}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* CASES */}
        <section className="work container" id="cases">
          <Eyebrow>Cases</Eyebrow>
          <h2 className="section-title">Tecnologia que <span className="grad">já está em uso</span></h2>
          <p className="work__lead">Meu trabalho é resolver problemas de empresas. Estes projetos mostram, na prática, o nível de solução que levo para a sua operação.</p>
          <div className="work__grid">
            {CASES.map((c) => (
              <article key={c.title} className="project tilt" data-cursor="✦">
                <div className={`project__media ${c.cls}`}>
                  <Chevron className="project__chev" />
                  {"wordmark" in c && c.wordmark === "verifica" ? (
                    <span className="vf-mark" role="img" aria-label="Verifica — Gestão Operacional Inteligente">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/cases/verifica-mark.svg" alt="" width={64} height={64} className="vf-mark__icon" />
                      <span className="vf-mark__text">
                        <span className="vf-mark__name">
                          Verific
                          <svg viewBox="0 0 120 120" className="vf-mark__a" aria-hidden="true">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" />
                            <path d="M 36 88 L 60 32 L 84 88" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M 44 68 L 53 79 L 78 64" fill="none" stroke="oklch(0.65 0.21 22)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="vf-mark__sub">Gestão Operacional Inteligente</span>
                      </span>
                    </span>
                  ) : c.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="project__logo" src={c.logo} alt={`Logo ${c.badge}`} width={180} height={180} loading="lazy" />
                  ) : (
                    <div className="project__emoji">{c.icon}</div>
                  )}
                  <span className="project__badge">{c.badge}</span>
                </div>
                <div className="project__info">
                  <span className="project__tag">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <ul>{c.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                  <p className="project__gain"><strong>Na sua empresa:</strong> {c.gain}</p>
                </div>
              </article>
            ))}
            <a className="project project--cta tilt" href="#contato" data-cursor="Bora">
              <div className="project__info">
                <span className="project__tag">Próximo case</span>
                <h3>O app da sua empresa</h3>
                <p>Ordens de serviço, vendas em campo, checklists, estoque, financeiro: se a sua operação tem um gargalo, ele pode virar o próximo case.</p>
                <span className="btn btn--small"><span>Quero conversar</span></span>
              </div>
            </a>
          </div>
        </section>

        {/* SOBRE */}
        <section className="about container" id="sobre">
          <div className="about__head">
            <div className="about__badge" aria-hidden="true">
              <svg className="about__ring" viewBox="0 0 200 200">
                <defs><path id="circ" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" /></defs>
                <text><textPath href="#circ">GESTÃO NA PRÁTICA ✦ TECNOLOGIA COM PROPÓSITO ✦ </textPath></text>
              </svg>
              <LogoImage size={180} />
            </div>
            <div>
              <Eyebrow>Quem está por trás</Eyebrow>
              <h2 className="section-title">Victor <span className="grad">Mafra</span></h2>
              <p className="about__lead">
                Experiência prática em gestão e tecnologia: conhecimento de operação, processos e sistemas aplicado a
                desafios reais de empresas. Antes de programar, eu entendo como o seu negócio funciona.
              </p>
            </div>
          </div>
          <div className="about__grid">
            {ABOUT.map((a) => (
              <div key={a.n} className="about__item">
                <span className="about__n">{a.n}</span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TEXTO GIGANTE */}
        <section className="bigtext" aria-hidden="true">
          <div className="bigtext__row" data-dir="-1">processos ✦ gestão ✦ tecnologia ✦ processos ✦ gestão ✦ tecnologia ✦</div>
          <div className="bigtext__row outline" data-dir="1">diagnóstico ✦ apps ✦ indicadores ✦ resultados ✦ diagnóstico ✦ apps ✦</div>
        </section>

        {/* CONTATO */}
        <section className="contact" id="contato">
          <div className="contact__glow" />
          <Chevron className="chev chev--contact" />
          <div className="container contact__inner">
            <Eyebrow>Contato</Eyebrow>
            <h2 className="contact__title">
              <span className="line"><SplitChars text="Sua operação," /></span>
              <span className="line"><SplitChars text="no próximo nível." charClassName="grad" /></span>
            </h2>
            <p className="contact__sub">Conte como funciona sua rotina hoje e onde ela trava. Respondo com os próximos passos para um diagnóstico.</p>
            <form className="form">
              <div className="field"><input id="f-name" type="text" required placeholder=" " /><label htmlFor="f-name">Seu nome</label></div>
              <div className="field"><input id="f-company" type="text" placeholder=" " /><label htmlFor="f-company">Empresa e segmento</label></div>
              <div className="field field--full"><textarea id="f-msg" rows={3} required placeholder=" " /><label htmlFor="f-msg">Qual processo você quer organizar?</label></div>
              <button type="submit" className="btn btn--big magnetic" data-cursor="Enviar"><span>Enviar pelo WhatsApp</span><i className="btn__arrow">→</i></button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer container">
        <div className="logo"><Logo size={84} /></div>
        <p>Entendemos o negócio. Transformamos processos. Desenvolvemos soluções.<br />© {new Date().getFullYear()} MAFRA Consultoria &amp; Tecnologia</p>
        <div className="footer__links">
          <a href="#" data-cursor="↗">Instagram</a>
          <a href="#" data-cursor="↗">LinkedIn</a>
          <a href="#top" data-cursor="↑">Voltar ao topo ↑</a>
        </div>
      </footer>
    </>
  );
}
