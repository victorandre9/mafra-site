"use client";

import dynamic from "next/dynamic";

// O corpo 3D só carrega no navegador (WebGL); o voo e as reações moram em Experience.tsx.
const DroneOrb = dynamic(() => import("./DroneOrb"), { ssr: false, loading: () => null });

/** Mascote "Mafrinha" — Orbe Sentinela em 3D que voa pela tela com a rolagem e reage ao cursor. */
export function Drone() {
  return (
    <div className="drone-layer">
      <div className="drone" aria-hidden="true">
        <div className="drone__dodge">
          <div className="drone__body" title="Clique em mim!">
            <div className="drone__float">
              {/* a luz mora DENTRO do corpo: flutua, inclina e desvia junto, sempre saindo da pontinha de baixo (Victor, 23/11/2026) */}
              <div className="drone__beam"><span className="drone__scan" /></div>
              <div className="drone__roll">
                <DroneOrb />
              </div>
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
