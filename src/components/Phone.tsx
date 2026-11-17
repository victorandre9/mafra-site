/** Celular 3D (CSS) da seção Processo. As telas trocam conforme a rolagem. */
export function Phone() {
  const bars = [30, 45, 40, 60, 72, 88, 100];
  return (
    <div className="phone">
      <div className="phone__frame">
        <div className="phone__notch" />
        <div className="phone__screen">
          <div className="screen screen--1 is-active">
            <div className="ui-top"><span>9:41</span><span>●●●</span></div>
            <div className="ui-title">Diagnóstico 🔎</div>
            <div className="sticky-grid">
              {["Gargalos", "Retrabalho", "Informação dispersa", "Rotinas", "Equipe", "Metas"].map((t, i) => (
                <div key={t} className={`sticky s${i + 1}`}>{t}</div>
              ))}
            </div>
          </div>

          <div className="screen screen--2">
            <div className="ui-top"><span>9:41</span><span>●●●</span></div>
            <div className="ui-title ui-title--dark">Fluxo</div>
            <div className="pflow">
              {["Solicitação", "Aprovação", "Execução", "Conferência", "Concluído"].map((t, i) => (
                <div key={t} className="pflow__item" style={{ ["--d" as string]: `${i * 0.12}s` }}>
                  <i>{i + 1}</i>
                  <span>{t}</span>
                  <b>{i < 4 ? "✓" : "…"}</b>
                </div>
              ))}
            </div>
            <div className="palette"><i /><i /><i /><i /></div>
          </div>

          <div className="screen screen--3">
            <div className="ui-top"><span>9:41</span><span>●●●</span></div>
            <pre className="code">
              <code>
                <b>const</b> <u>alerta</u> = {"{\n"}
                {"  "}<i>{"// controle digital"}</i>{"\n"}
                {"  se: "}<s>{"'tarefa atrasada'"}</s>{",\n"}
                {"  avisar: ["}<s>{"'gestor'"}</s>{"],\n"}
                {"  registrar: "}<s>true</s>{",\n"}
                {"  painel: "}<s>true</s>{",\n"}
                {"};"}
              </code>
            </pre>
            <div className="build">
              <div className="build__label">Implantação <span className="js-build">0</span>%</div>
              <div className="build__bar"><span /></div>
            </div>
          </div>

          <div className="screen screen--4">
            <div className="ui-top"><span>9:41</span><span>●●●</span></div>
            <div className="launch">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="launch__logo" src="/brand/mafra-logo.png" alt="MAFRA Consultoria & Tecnologia" width={96} height={96} />
              <div className="launch__name">Painel do gestor</div>
              <div className="launch__stars">Produtividade da equipe</div>
              <div className="launch__btn">Metas no alvo ✓</div>
              <div className="chart">
                {bars.map((h, i) => (
                  <i key={i} style={{ ["--h" as string]: `${h}%`, ["--i" as string]: i * 0.08 }} />
                ))}
              </div>
              <div className="launch__kpi">Pendências em queda ↓</div>
            </div>
          </div>
        </div>
      </div>
      <div className="phone__shadow" />
    </div>
  );
}
