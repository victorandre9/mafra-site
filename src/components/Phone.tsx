/* eslint-disable @next/next/no-img-element */
/** Celular 3D da Metodologia MAFRA. As telas trocam com a rolagem (Experience.tsx). Dados ilustrativos. */

function Top({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <div className="ui-top"><span>9:41</span><span className="ui-top__icons"><i /><i /><i /></span></div>
      <div className="ui-head">
        <div>
          <div className="ui-head__sub">{sub}</div>
          <div className="ui-head__title">{title}</div>
        </div>
        <img src="/brand/mafra-logo.png" alt="" width={34} height={34} className="ui-head__logo" />
      </div>
    </>
  );
}

export function Phone() {
  return (
    <div className="phone">
      <div className="phone__glow" />
      <div className="phone__frame">
        <span className="phone__btn phone__btn--a" />
        <span className="phone__btn phone__btn--b" />
        <span className="phone__btn phone__btn--c" />
        <div className="phone__island"><i /></div>
        <div className="phone__screen">
          {/* 1 — Diagnóstico: radar varrendo a operação */}
          <div className="screen screen--1 is-active">
            <Top sub="Etapa 01" title="Diagnóstico" />
            <div className="radar">
              <div className="radar__sweep" />
              <span className="radar__ring r1" /><span className="radar__ring r2" /><span className="radar__ring r3" />
              <span className="radar__blip b1"><em>Retrabalho</em></span>
              <span className="radar__blip b2"><em>Gargalo</em></span>
              <span className="radar__blip b3"><em>Planilha</em></span>
              <span className="radar__blip b4" />
            </div>
            <div className="ui-status"><span className="ui-dot" /> Escaneando rotinas da equipe…</div>
            <div className="meters">
              {([["Informação dispersa", 72], ["Retrabalho", 46], ["Tarefas sem dono", 58]] as const).map(([l, v]) => (
                <div key={l} className="meter">
                  <div className="meter__row"><span>{l}</span><b>{v}%</b></div>
                  <div className="meter__bar"><i style={{ ["--v" as string]: `${v}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          {/* 2 — Processos: fluxograma com dados circulando */}
          <div className="screen screen--2">
            <Top sub="Etapa 02" title="Processos" />
            <div className="pflow2">
              <svg className="pflow2__svg" viewBox="0 0 220 300" preserveAspectRatio="none">
                <path id="pf-path" d="M40 30 V95 H180 V165 H40 V235 H180 V280" className="pflow2__line" />
                <circle r="5" className="pflow2__dot"><animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#pf-path" /></animateMotion></circle>
                <circle r="5" className="pflow2__dot"><animateMotion dur="3.2s" begin="1.6s" repeatCount="indefinite"><mpath href="#pf-path" /></animateMotion></circle>
              </svg>
              {[["Solicitação", "Vendedor", "ok"], ["Aprovação", "Gestora", "ok"], ["Execução", "Técnico", "run"], ["Conferência", "Escritório", "wait"]].map(([t, who, st], i) => (
                <div key={t} className={`pnode pnode--${i % 2 ? "r" : "l"} pnode--${st}`} style={{ ["--d" as string]: `${i * 0.12}s`, top: `${4 + i * 23.5}%` }}>
                  <b>{t}</b><span>{who}</span><i>{st === "ok" ? "✓" : st === "run" ? "●" : "…"}</i>
                </div>
              ))}
            </div>
          </div>

          {/* 3 — Controles digitais: alertas chegando */}
          <div className="screen screen--3">
            <Top sub="Etapa 03" title="Controles" />
            <div className="notes">
              <div className="note note--warn" style={{ ["--d" as string]: "0s" }}><i>!</i><div><b>Tarefa atrasada</b><span>Gestor avisado automaticamente</span></div><em>agora</em></div>
              <div className="note note--ok" style={{ ["--d" as string]: ".35s" }}><i>✓</i><div><b>Checklist concluído</b><span>Veículo 07 · com fotos</span></div><em>2 min</em></div>
              <div className="note note--info" style={{ ["--d" as string]: ".7s" }}><i>↗</i><div><b>Relatório pronto</b><span>Enviado à diretoria</span></div><em>5 min</em></div>
            </div>
            <div className="toggles">
              {["Alertas automáticos", "Relatório diário", "Acesso por perfil"].map((t) => (
                <div key={t} className="toggle"><span>{t}</span><i /></div>
              ))}
            </div>
            <div className="build">
              <div className="build__label">Implantação <span className="js-build">0</span>%</div>
              <div className="build__bar"><span /></div>
            </div>
          </div>

          {/* 4 — Dashboard do gestor */}
          <div className="screen screen--4">
            <Top sub="Etapa 04" title="Painel do gestor" />
            <div className="kpis">
              <div className="kpi"><span>Produtividade</span><b><em className="js-kpi" data-to="38">0</em>%</b><small>▲ no período</small></div>
              <div className="kpi"><span>Pendências</span><b><em className="js-kpi" data-to="12">0</em></b><small className="down">▼ em queda</small></div>
            </div>
            <div className="chartcard">
              <div className="chartcard__head"><span>Entregas por semana</span><i>ao vivo</i></div>
              <svg viewBox="0 0 220 90" className="area">
                <defs>
                  <linearGradient id="ar-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#3ddc84" stopOpacity=".5" />
                    <stop offset="1" stopColor="#3ddc84" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path className="area__fill" d="M0 72 C25 70 35 58 55 60 S90 40 110 44 S150 22 170 26 S205 10 220 8 V90 H0 Z" fill="url(#ar-fill)" />
                <path className="area__line" d="M0 72 C25 70 35 58 55 60 S90 40 110 44 S150 22 170 26 S205 10 220 8" />
                <circle className="area__dot" cx="220" cy="8" r="4" />
              </svg>
            </div>
            <div className="donutrow">
              <svg viewBox="0 0 42 42" className="donut">
                <circle cx="21" cy="21" r="15.9" className="donut__bg" />
                <circle cx="21" cy="21" r="15.9" className="donut__val" />
              </svg>
              <div><b>Metas da equipe</b><span>78% atingidas</span></div>
            </div>
          </div>
          <div className="phone__scan" />
          <div className="phone__glare" />
        </div>
      </div>
      <div className="phone__shadow" />
    </div>
  );
}

/** Cartões holográficos em volta do celular — mudam a cada etapa. */
export function HoloCards() {
  const cards: Array<[number, string, string, string]> = [
    [0, "hc-a", "🔎 Rotinas mapeadas", "Atividades, gargalos e lacunas"],
    [0, "hc-b", "⚠ 3 gargalos", "encontrados no fluxo atual"],
    [1, "hc-a", "🧭 Fluxo definido", "Responsável em cada etapa"],
    [1, "hc-b", "📐 Padrões", "Checklists e regras claras"],
    [2, "hc-a", "🔔 Alertas em tempo útil", "Ninguém depende de mensagem"],
    [2, "hc-b", "🔗 Integra ao ERP", "Dados num lugar só"],
    [3, "hc-a", "📊 Indicadores", "Equipe, qualidade e prazos"],
    [3, "hc-b", "🚀 Melhoria contínua", "Menos desperdício, mais escala"],
  ];
  return (
    <>
      {cards.map(([step, pos, t, s]) => (
        <div key={t} className={`holo ${pos}${step === 0 ? " is-on" : ""}`} data-step={step}>
          <b>{t}</b>
          <span>{s}</span>
        </div>
      ))}
    </>
  );
}
