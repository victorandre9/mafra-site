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
            <div className="ui-title">Ideias 💡</div>
            <div className="sticky-grid">
              {["Público-alvo", "Problema", "MVP", "Métricas", "Concorrentes", "Monetização"].map((t, i) => (
                <div key={t} className={`sticky s${i + 1}`}>{t}</div>
              ))}
            </div>
          </div>

          <div className="screen screen--2">
            <div className="ui-top"><span>9:41</span><span>●●●</span></div>
            <div className="wire">
              <div className="wire__hero" />
              <div className="wire__row"><i /><i /><i /></div>
              <div className="wire__line w80" />
              <div className="wire__line w60" />
              <div className="wire__card" />
              <div className="wire__card" />
              <div className="palette"><i /><i /><i /><i /></div>
            </div>
          </div>

          <div className="screen screen--3">
            <div className="ui-top"><span>9:41</span><span>●●●</span></div>
            <pre className="code">
              <code>
                <b>class</b> <u>SeuApp</u> {"{\n"}
                {"  "}<i>{"// feito sob medida"}</i>{"\n"}
                {"  build() {\n"}
                {"    "}<b>return</b>{" Experiencia(\n"}
                {"      rapida: "}<s>true</s>{",\n"}
                {"      linda: "}<s>true</s>{",\n"}
                {"      escalavel: "}<s>true</s>{",\n"}
                {"    );\n  }\n}"}
              </code>
            </pre>
            <div className="build">
              <div className="build__label">Build <span className="js-build">0</span>%</div>
              <div className="build__bar"><span /></div>
            </div>
          </div>

          <div className="screen screen--4">
            <div className="ui-top"><span>9:41</span><span>●●●</span></div>
            <div className="launch">
              <div className="launch__icon">m</div>
              <div className="launch__name">Seu App</div>
              <div className="launch__stars">★★★★★</div>
              <div className="launch__btn">Disponível ✓</div>
              <div className="chart">
                {bars.map((h, i) => (
                  <i key={i} style={{ ["--h" as string]: `${h}%`, ["--i" as string]: i * 0.08 }} />
                ))}
              </div>
              <div className="launch__kpi">+12.4k downloads</div>
            </div>
          </div>
        </div>
      </div>
      <div className="phone__shadow" />
    </div>
  );
}
