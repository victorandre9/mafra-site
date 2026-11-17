/** Mascote "Mafrinha": drone que voa pela tela com a rolagem e reage ao cursor (lógica em Experience.tsx). */
export function Drone() {
  const rotors: Array<[number, number, string]> = [
    [30, 30, "a"],
    [130, 30, "b"],
    [30, 98, "c"],
    [130, 98, "d"],
  ];
  return (
    <div className="drone-layer">
      <div className="drone" aria-hidden="true">
        <div className="drone__beam"><span className="drone__scan" /></div>
        <div className="drone__dodge">
          <div className="drone__body" title="Clique em mim!">
            <div className="drone__float">
            <svg viewBox="0 0 160 128" width="150" height="120">
              <defs>
                <linearGradient id="dr-hull" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#24456f" />
                  <stop offset=".55" stopColor="#0d2442" />
                  <stop offset="1" stopColor="#061428" />
                </linearGradient>
                <linearGradient id="dr-edge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#3ddc84" />
                  <stop offset="1" stopColor="#4f9bdc" />
                </linearGradient>
                <radialGradient id="dr-core" cx=".5" cy=".5" r=".5">
                  <stop offset="0" stopColor="#eafff2" />
                  <stop offset=".45" stopColor="#3ddc84" />
                  <stop offset="1" stopColor="#0b3d26" />
                </radialGradient>
                <radialGradient id="dr-disc" cx=".5" cy=".5" r=".5">
                  <stop offset="0" stopColor="rgba(160,220,255,.05)" />
                  <stop offset=".7" stopColor="rgba(160,220,255,.22)" />
                  <stop offset="1" stopColor="rgba(61,220,132,.55)" />
                </radialGradient>
              </defs>

              {/* braços */}
              <g stroke="#1c3554" strokeWidth="7" strokeLinecap="round">
                <path d="M58 52 L30 30 M102 52 L130 30 M58 76 L30 98 M102 76 L130 98" />
              </g>
              <g stroke="url(#dr-edge)" strokeWidth="1.6" strokeLinecap="round" opacity=".9">
                <path d="M58 52 L30 30 M102 52 L130 30 M58 76 L30 98 M102 76 L130 98" />
              </g>

              {/* rotores */}
              {rotors.map(([x, y, k]) => (
                <g key={k} transform={`translate(${x} ${y})`}>
                  <circle r="22" fill="url(#dr-disc)" className="drone__disc" />
                  <circle r="22" fill="none" stroke="url(#dr-edge)" strokeWidth="1.2" opacity=".7" />
                  <g className={`drone__blade drone__blade--${k}`}>
                    <rect x="-20" y="-1.8" width="40" height="3.6" rx="1.8" fill="rgba(220,240,255,.85)" />
                    <rect x="-1.8" y="-20" width="3.6" height="40" rx="1.8" fill="rgba(220,240,255,.35)" />
                  </g>
                  <circle r="4.5" fill="#0d2442" stroke="#3ddc84" strokeWidth="1.5" />
                </g>
              ))}

              {/* casco */}
              <path d="M62 40 H98 L112 64 L98 88 H62 L48 64 Z" fill="url(#dr-hull)" stroke="url(#dr-edge)" strokeWidth="2" />
              <path d="M66 46 H94 L104 64 L94 82 H66 L56 64 Z" fill="none" stroke="rgba(143,180,220,.25)" strokeWidth="1" />
              {/* núcleo / olho */}
              <circle cx="80" cy="64" r="13" fill="#03101f" stroke="rgba(61,220,132,.5)" strokeWidth="1.5" />
              <circle className="drone__core" cx="80" cy="64" r="9" fill="url(#dr-core)" />
              <circle className="drone__pupil" cx="80" cy="64" r="3.4" fill="#03101f" />
              <circle cx="77" cy="61" r="1.6" fill="#fff" opacity=".9" />
              {/* LEDs de navegação */}
              <circle className="drone__led drone__led--r" cx="52" cy="64" r="2.6" fill="#ff4d5e" />
              <circle className="drone__led drone__led--g" cx="108" cy="64" r="2.6" fill="#3ddc84" />
              {/* trem de pouso */}
              <path d="M66 88 L60 104 M94 88 L100 104 M54 104 H70 M90 104 H106" stroke="#4f6f94" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            </div>
            <div className="drone__glow" />
          </div>
        </div>
        <div className="drone__hud">
          <span className="drone__hud-id">MAFRA-01</span>
          <span>ALT <b className="js-alt">000</b>m</span>
          <span>SYS <b className="js-sys">OK</b></span>
        </div>
        <div className="drone__bubble">
          <span>Oi! Eu sou o Mafrinha 👋</span>
        </div>
      </div>
    </div>
  );
}
