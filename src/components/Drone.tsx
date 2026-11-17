/** Mascote "Mafrinha": drone que voa pela tela acompanhando a rolagem (animado em Experience.tsx). */
export function Drone() {
  return (
    <div className="drone-layer" aria-hidden="true">
      <div className="drone">
        <div className="drone__body">
          <svg viewBox="0 0 120 80" width="120" height="80">
            <defs>
              <linearGradient id="dg" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#9b87ff" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
              <radialGradient id="eye" cx=".5" cy=".5" r=".5">
                <stop offset="0" stopColor="#eaffb0" />
                <stop offset=".6" stopColor="#c6ff3d" />
                <stop offset="1" stopColor="#5f8a00" />
              </radialGradient>
            </defs>
            <path d="M22 26 L48 40 M98 26 L72 40" stroke="#2a2a3d" strokeWidth="5" strokeLinecap="round" />
            <g className="prop prop--l">
              <ellipse cx="22" cy="22" rx="20" ry="3.2" fill="rgba(200,220,255,.55)" />
            </g>
            <g className="prop prop--r">
              <ellipse cx="98" cy="22" rx="20" ry="3.2" fill="rgba(200,220,255,.55)" />
            </g>
            <circle cx="22" cy="24" r="4" fill="#2a2a3d" />
            <circle cx="98" cy="24" r="4" fill="#2a2a3d" />
            <rect x="38" y="32" width="44" height="26" rx="13" fill="url(#dg)" />
            <rect x="44" y="38" width="32" height="14" rx="7" fill="#0b0b14" />
            <circle className="drone__eye" cx="60" cy="45" r="5" fill="url(#eye)" />
            <path d="M48 58 L44 68 M72 58 L76 68 M40 68 H50 M70 68 H80" stroke="#2a2a3d" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="drone__glow" />
        </div>
        <div className="drone__bubble">
          <span>Oi! Eu sou o Mafrinha 👋</span>
        </div>
      </div>
    </div>
  );
}
