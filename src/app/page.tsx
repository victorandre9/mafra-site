import Experience from "@/components/Experience";
import { LINK_INSTAGRAM, LINK_LINKEDIN, LINK_WHATSAPP } from "@/lib/contato";
import Hero3DLazy from "@/components/Hero3DLazy";
import { Drone } from "@/components/Drone";
import OrbMenu from "@/components/OrbMenu";
import { HoloCards, Phone } from "@/components/Phone";
import { SplitChars, SplitWords } from "@/components/Split";
import { Chevron, Logo, LogoImage } from "@/components/Logo";
import { LogoZoom } from "@/components/LogoZoom";

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
    title: "Software de gestão sob medida",
    text: "Sistemas no celular e no computador, desenhados para a rotina real da sua equipe — com acesso por perfil e a informação certa para cada função.",
    tags: ["Web + mobile", "Perfis de acesso", "Uso em campo"],
    icon: <><rect x="14" y="4" width="20" height="40" rx="5" /><path d="M21 38h6M19 14h10M19 20h10M19 26h6" /></>,
  },
  {
    title: "Integração com ERP & sistemas",
    text: "A solução complementa o que você já usa. Pedidos, crédito e faturamento continuam no ERP; a operação ganha uma ferramenta simples que conversa com ele — sem digitar duas vezes.",
    tags: ["Conexão segura", "Usa o ERP que você já tem", "Dados centralizados"],
    icon: <><rect x="4" y="16" width="14" height="16" rx="3" /><rect x="30" y="16" width="14" height="16" rx="3" /><path d="M18 24h12M24 20l4 4-4 4" /></>,
  },
  {
    title: "Indicadores & Gestão de Desempenho",
    text: "Acompanhe a produtividade das equipes, o cumprimento das rotinas, as horas extras, o tempo médio das atividades e os indicadores de desempenho. Transforme dados operacionais em decisões para melhorar resultados.",
    tags: ["Produtividade por colaborador", "Indicadores e dashboards", "Metas e melhoria contínua"],
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
  ["Indicadores e controles digitais", "Crio registros, alertas, painéis e a informação na hora certa — no sistema."],
  ["Gestão de desempenho", "Acompanho equipes, produtividade, qualidade e a evolução dos resultados."],
];

const STATS = [
  { to: 30, suffix: "–60", unit: "dias", label: "prazo típico de implantação de uma solução de gestão" },
  { to: 30, suffix: "", unit: "dias", label: "de acompanhamento assistido após a entrada em uso" },
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
    text: "Processos Gerenciais, MBA em Gestão Empresarial, Técnico em Informática Gerencial e desenvolvimento de aplicativos com tecnologias de mercado: Next.js, Vercel, Neon e GitHub.",
  },
];

const CASES = [
  {
    cls: "p-verifica",
    grupo: "b2b",
    tag: "Logística · Armazéns, cross-docking e transportadoras",
    title: "Verifica — Gestão Operacional Inteligente",
    text: "Sistema de gestão integrado para logística — armazéns, cross-docking e transportadoras. Checklists online ligados ao mecânico e à frota, controle de jornada e produção por colaborador: quem mais produz na separação e quais motoristas e ajudantes entregam mais, com menos horas extras e sem ocorrências. Integrado ao RH e à qualidade.",
    bullets: ["Checklists ligados à manutenção da frota", "Controle de jornada", "Produção por colaborador", "Performance de motoristas e ajudantes", "Integração com RH e qualidade"],
    gain: "Informação controlada num só lugar: a liderança age em cima dos números, e a performance da empresa sobe.",
    icon: "✅",
    logo: "",
    wordmark: "verifica",
    badge: "",
  },
  {
    cls: "p-vetra",
    grupo: "b2b",
    tag: "Solução empresarial · Vendas externas",
    title: "Vetra Sales — Inteligência em Vendas Externas",
    text: "Plataforma de gestão de equipes comerciais externas, com controle de visitas, carteiras de clientes, produtividade dos vendedores, conversão de visitas em pedidos, histórico comercial e indicadores gerenciais.",
    bullets: ["Gestão de visitas", "Carteiras", "Conversão", "Indicadores"],
    gain: "",
    icon: "",
    logo: "/cases/vetra-sales-card.webp",
    wordmark: "foto",
    badge: "Vetra Sales",
  },
  {
    cls: "p-polar",
    grupo: "b2b",
    tag: "Ar-condicionado · Manutenção e instalação com equipe em campo",
    title: "Polar OS — Gestão de Campo para Climatização",
    text: "Sistema de gestão integrado para empresas de ar-condicionado: do pedido fechado à O.S., do técnico certo na rua ao recebimento. Agenda e produtividade por técnico, checklist diário do veículo, materiais e ferramentas com responsável, despesas e diárias da equipe e financeiro no mesmo lugar.",
    bullets: ["Do pedido à O.S.", "Agenda e produtividade por técnico", "Checklist diário do veículo", "Materiais e ferramentas com responsável", "Financeiro integrado"],
    gain: "o técnico gasta só o material necessário, cada ferramenta tem dono e a agenda fica sob controle — menos perdas, menos retrabalho e menos reclamação de cliente.",
    icon: "",
    logo: "/cases/polar-os-card.webp",
    wordmark: "foto",
    badge: "Polar OS",
  },
  {
    cls: "p-vos",
    grupo: "b2c",
    tag: "Projeto autoral · Finanças com inteligência artificial",
    title: "Vo$ — o seu dinheiro sob controle",
    text: "Controle financeiro com inteligência artificial: gastos organizados sozinhos, orçamento do mês sempre à vista e metas que viram plano — do carro novo à viagem dos sonhos.",
    bullets: ["Gastos organizados por categoria", "Orçamento do mês", "Metas para realizar sonhos", "Relatórios claros", "Finanças da família no mesmo app"],
    gain: "A mesma tecnologia pode registrar uma visita, uma ocorrência ou uma despesa da equipe em campo — sem digitar.",
    icon: "🎙️",
    logo: "/cases/vos-logo.webp",
    wordmark: "",
    badge: "Vo$",
  },
  {
    cls: "p-ifluxo",
    grupo: "b2c",
    tag: "Projeto autoral · Dados de movimento",
    title: "iFluxo — confira o movimento antes de sair",
    text: "Consulta do nível de lotação de bares, restaurantes, academias e outros estabelecimentos para escolher o melhor momento da visita.",
    bullets: ["Quantidade de pessoas no local", "Nível de lotação", "Comparação entre estabelecimentos", "Planejamento da visita"],
    gain: "Mostra como transformar dados de movimento em decisão: útil para capacidade, escalas e atendimento.",
    icon: "",
    logo: "/cases/ifluxo.webp",
    wordmark: "arte",
    badge: "iFluxo",
  },
];

// Portfólio em dois grupos (pedido do Victor, 19/11/2026): soluções para empresas e apps para pessoas
const GRUPOS_CASES = [
  {
    id: "b2b",
    titulo: "Soluções empresariais",
    texto: "Ferramentas que ajudam empresas a reduzir desperdícios, melhorar processos, acompanhar equipes e criar oportunidades de crescimento.",
  },
  {
    id: "b2c",
    titulo: "Aplicativos e produtos digitais",
    texto: "Soluções tecnológicas que facilitam atividades e decisões do dia a dia das pessoas.",
  },
];

const FAQ: Array<[string, string]> = [
  ["Quanto custa?", "Cada projeto tem um valor, porque cada operação é diferente. Depois do diagnóstico eu envio uma proposta fechada, com escopo, prazo e investimento definidos — sem surpresa no meio do caminho."],
  ["Preciso trocar o sistema que já uso?", "Não. A solução se conecta ao que você já tem, como o ERP: pedidos, crédito e faturamento continuam onde estão, e a operação ganha uma ferramenta simples que conversa com eles."],
  ["Quanto tempo leva?", "Em média, de 30 a 60 dias para uma solução de gestão entrar em uso. O prazo exato sai do diagnóstico e vai escrito na proposta."],
  ["E depois da entrega?", "São 30 dias de acompanhamento assistido, com a equipe já usando. Depois, cuido da hospedagem, dos backups, da manutenção e do suporte."],
  ["Meus dados ficam seguros?", "Cada pessoa acessa só o que o perfil dela permite, os dados têm cópia de segurança automática e o tratamento de informações pessoais segue a LGPD."],
  ["Atende o meu ramo?", "Sim. Atendo empresas de qualquer ramo — indústria, comércio, saúde, varejo, logística e serviços. O que importa é a rotina: é a partir dela que a solução é desenhada."],
  ["Por onde começa?", "Por uma conversa sem compromisso pelo WhatsApp. Você conta como a operação funciona hoje e onde ela trava, e eu respondo com os próximos passos para o diagnóstico."],
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
      <OrbMenu />

      {/* HEADER */}
      <header className="header">
        <a href="#top" className="logo" data-cursor="Ampliar" aria-label="MAFRA Consultoria & Tecnologia"><Logo size={92} /></a>
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

      {/* Fundo: brilhos e chevrons do topo, e a cena 3D fixa atrás do site inteiro */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero__glow hero__glow--a" />
        <div className="hero__glow hero__glow--b" />
        {/* Degradês "verde com luz branca por dentro" usados pelos chevrons (tema claro) */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <linearGradient id="verde-vidro" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e2ebf6" />
              <stop offset=".28" stopColor="#03336f" />
              <stop offset=".7" stopColor="#02254f" />
              <stop offset="1" stopColor="#011834" />
            </linearGradient>
            <linearGradient id="verde-vidro-suave" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".5" stopColor="#cadbef" />
              <stop offset="1" stopColor="#044492" />
            </linearGradient>
          </defs>
        </svg>
        <div className="hero__chevrons">
          <Chevron className="chev chev--big" />
          <Chevron className="chev chev--mid" />
          <Chevron className="chev chev--small" />
        </div>
      </div>
      <Hero3DLazy />

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="container hero__content">
            <p className="pill reveal-up">Processos mais inteligentes. Equipes mais produtivas. Empresa mais lucrativa.</p>
            <h1 className="hero__title">
              <span className="line"><SplitChars text="Transformo" /></span>
              <span className="line">
                <SplitChars text="processos em" />{" "}
              </span>
              <span className="line">
                <span className="rotator">
                  <span className="rotator__track">
                    <span>resultados</span><span>soluções</span><span>resultados</span><span>decisões</span><span>resultados</span><span>ganhos</span><span>resultados</span>
                  </span>
                </span>
              </span>
              <span className="line"><SplitChars text="que movem." className="outline" /></span>
            </h1>
            <p className="hero__sub reveal-up">
              Entendo a rotina da sua empresa, organizo os processos e desenvolvo o software de gestão que a sua
              equipe usa de verdade — no celular e no computador, integrado ao que você já tem.
            </p>
            <div className="hero__ctas reveal-up">
              <a href="#contato" className="btn magnetic" data-cursor="Vamos"><span>Conversar sobre o diagnóstico</span><i className="btn__arrow">→</i></a>
              <a href="#metodo" className="btn btn--ghost magnetic" data-cursor="Ver"><span>Conhecer o método</span></a>
            </div>
          </div>
          <div className="hero__scroll">
            <span>role para conhecer</span>
            <div className="hero__mouse"><span /></div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="marquee" aria-label="O que eu digitalizo">
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
            <SplitWords text="nas mãos de quem decide. Entendo o negócio. Transformo processos. Desenvolvo soluções." />
          </p>
        </section>

        {/* SERVIÇOS */}
        <section className="services" id="servicos">
          <div className="services__pin">
            <div className="services__head container">
              <Eyebrow>Serviços</Eyebrow>
              <h2 className="section-title">Gestão na prática. <span className="grad">Tecnologia com propósito.</span></h2>
            <p className="services__lead">Para empresas de qualquer ramo — indústria, comércio, saúde, varejo, logística e serviços — que cresceram e ainda dependem de planilha e WhatsApp para operar.</p>
              <p className="swipe-hint" aria-hidden="true">
                <span>Deslize para ver os {SERVICES.length + 1} cards</span>
                <i className="swipe-hint__hand">👉</i>
              </p>
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
                <p>Conte para mim. O diagnóstico é o primeiro passo — e a conversa é sem compromisso.</p>
                <a href="#contato" className="btn magnetic" data-cursor="Vamos"><span>Conversar</span><i className="btn__arrow">→</i></a>
              </article>
            </div>
          </div>
        </section>

        {/* MÉTODO (celular 3D pinado) */}
        <section className="process" id="metodo">
          <div className="process__pin">
            <div className="container process__grid">
              <div className="process__text">
                <Eyebrow>Metodologia de trabalho</Eyebrow>
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
                <div className="process__note">
                  <p className="process__note-q"><strong>Uma equipe de manutenção consegue atender mais clientes com a mesma estrutura?</strong></p>
                  <p>Ao medir tempo de visita, deslocamentos, retrabalhos e produtividade por técnico, o gestor consegue identificar gargalos e reorganizar a agenda.</p>
                  <p>Com uma operação mais eficiente, pode reduzir a necessidade de horas extras e criar capacidade para prospectar novos contratos.</p>
                </div>
              </div>
              <div className="process__stage">
                <div className="orbit orbit--1"><span /></div>
                <div className="orbit orbit--2"><span /></div>
                <Phone />
                <HoloCards />
              </div>
            </div>
          </div>
        </section>

        {/* NÚMEROS */}
        <section className="stats container">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat__line" aria-hidden="true" />
              <div className="stat__n">
                <span className="js-counter" data-to={s.to}>0</span>{s.suffix}
                <small>{s.unit}</small>
              </div>
              <p>{s.label}</p>
            </div>
          ))}
        </section>

        {/* CASES */}
        <section className="work container" id="cases">
          <Eyebrow>Cases</Eyebrow>
          <h2 className="section-title">Tecnologia que <span className="grad">já está em uso</span></h2>
          <p className="work__lead">Tecnologia que desenvolvo para empresas e para pessoas: soluções que organizam a operação e aplicativos que facilitam o dia a dia.</p>
          {GRUPOS_CASES.map((g) => (
            <div key={g.id} className={`work__grupo work__grupo--${g.id}`}>
              <div className="work__grupo-head">
                <h3 className="work__grupo-titulo">
                  <svg className="work__grupo-icone" viewBox="0 0 24 24" aria-hidden="true">
                    {g.id === "b2b" ? (
                      <><path d="M4 21V5l8-3v19" /><path d="M12 9l8 3v9" /><path d="M2 21h20" /><path d="M8 8v.01M8 12v.01M8 16v.01M16 15v.01M16 18v.01" /></>
                    ) : (
                      <><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></>
                    )}
                  </svg>
                  {g.titulo}
                </h3>
                <p className="work__grupo-texto">{g.texto}</p>
              </div>
              <div className="work__grid">
            {CASES.filter((c) => c.grupo === g.id).map((c) => (
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
                    <img
                      className={c.wordmark === "arte" ? "project__art" : c.wordmark === "foto" ? "project__art project__foto" : "project__logo"}
                      src={c.logo}
                      alt={`Logo ${c.badge}`}
                      width={c.wordmark === "arte" ? 900 : c.wordmark === "foto" ? 1600 : 180}
                      height={c.wordmark === "arte" ? 751 : c.wordmark === "foto" ? 1000 : 180}
                      loading="lazy"
                    />
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
                  {c.gain && <p className="project__gain"><strong>Na sua empresa:</strong> {c.gain}</p>}
                </div>
              </article>
            ))}
              </div>
            </div>
          ))}
          <div className="work__fecho">
            <a className="project project--cta tilt" href="#contato" data-cursor="Vamos">
              <div className="project__info">
                <span className="project__tag">Próximo case</span>
                <h3>A solução da sua empresa</h3>
                <p>Ordens de serviço, vendas em campo, checklists, estoque, financeiro: se a sua operação tem um gargalo, ele pode virar o próximo case.</p>
                <span className="btn btn--small"><span>Quero conversar</span></span>
              </div>
            </a>
          </div>
        </section>

        {/* SOBRE */}
        <section className="about container" id="sobre">
          <div className="about__head">
            <div className="about__badge">
              <svg className="about__ring" viewBox="0 0 200 200" aria-hidden="true">
                <defs><path id="circ" d="M100 100m-86 0a86 86 0 1 1 172 0a86 86 0 1 1-172 0" /></defs>
                <text><textPath href="#circ" textLength="536" lengthAdjust="spacing">GESTÃO NA PRÁTICA ✦ TECNOLOGIA COM PROPÓSITO ✦ </textPath></text>
              </svg>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sobre/victor-mafra.jpg?v=5" alt="Victor Mafra" width={720} height={720} className="about__foto" loading="lazy" />
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
          <div className="bigtext__row outline" data-dir="1">diagnóstico ✦ tecnologia ✦ indicadores ✦ resultados ✦ diagnóstico ✦ tecnologia ✦</div>
        </section>

        {/* PERGUNTAS FREQUENTES: responde as objeções antes da conversa */}
        <section className="faq container" id="perguntas">
          <Eyebrow>Perguntas frequentes</Eyebrow>
          <h2 className="section-title">Antes de <span className="grad">conversar</span></h2>
          <div className="faq__list">
            {FAQ.map(([q, r], i) => (
              <details key={q} className="faq__item" open={i === 0}>
                <summary><span>{q}</span><i aria-hidden="true">+</i></summary>
                <p>{r}</p>
              </details>
            ))}
          </div>
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
            <p className="contact__sub">Um toque e a conversa abre no WhatsApp, com a mensagem pronta. Conte como funciona sua rotina hoje e onde ela trava — respondo com os próximos passos para um diagnóstico.</p>
            <div className="contact__actions">
              <a href={LINK_WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn btn--big btn--wa magnetic js-whatsapp" data-cursor="Abrir">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z" /></svg>
                <span>Conversar no WhatsApp</span><i className="btn__arrow">→</i>
              </a>
              <div className="contact__social">
                <a href={LINK_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn btn--ig magnetic" data-cursor="↗">
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 7.3A4.7 4.7 0 1 0 16.7 12 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm6-7.9a1.1 1.1 0 1 1-1.1-1.1A1.1 1.1 0 0 1 18 7.1ZM21.1 8.2a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-3.8-1.5C14.3 2.8 9.7 2.8 8.2 2.9a5.4 5.4 0 0 0-3.8 1.5 5.4 5.4 0 0 0-1.5 3.8c-.1 1.5-.1 6.1 0 7.6a5.4 5.4 0 0 0 1.5 3.8 5.4 5.4 0 0 0 3.8 1.5c1.5.1 6.1.1 7.6 0a5.4 5.4 0 0 0 3.8-1.5 5.4 5.4 0 0 0 1.5-3.8c.1-1.5.1-6.1 0-7.6Zm-2 9.3a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.4.4s-4.2.1-5.4-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.4s-.1-4.2.4-5.4a3 3 0 0 1 1.7-1.7c1.2-.5 4-.4 5.4-.4s4.2-.1 5.4.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.4s.1 4.2-.4 5.4Z" /></svg>
                  <span>Instagram</span>
                </a>
                <a href={LINK_LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn btn--in magnetic" data-cursor="↗">
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2ZM8 19H5V9.5h3Zm-1.5-10.8a1.7 1.7 0 1 1 1.7-1.7 1.7 1.7 0 0 1-1.7 1.7ZM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5S12.8 13 12.8 14.3V19h-3V9.5h2.8v1.3a3.1 3.1 0 0 1 2.8-1.5c3 0 3.6 2 3.6 4.6Z" /></svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LogoZoom />
      <footer className="footer container">
        {/* logo grande e centralizada; os links de redes ficam só no Contato, logo acima */}
        <div className="logo footer__logo"><Logo size={170} /></div>
        {/* assinatura: saiu do topo (3 slogans juntos competiam) e fecha a página aqui */}
        <p className="footer__assinatura"><span className="hero__rule" />Da necessidade operacional à solução digital.<span className="hero__rule" /></p>
        <p>Entendo o negócio. Transformo processos. Desenvolvo soluções.<br />© {new Date().getFullYear()} MAFRA Consultoria &amp; Tecnologia</p>
        <div className="footer__links">
          <a href="#top" data-cursor="↑">Voltar ao topo ↑</a>
        </div>
      </footer>
    </>
  );
}
