import type { CSSProperties } from "react";
import { LogoImage } from "./Logo";

/**
 * ABERTURA "PORTAL" (Victor, 23/11/2026) — versão que roda no COMPOSITOR do navegador.
 *
 * Toda a apresentação é feita com animações de CSS (só `transform` e `opacity`). O navegador as executa numa parte
 * separada (o compositor), que continua lisa mesmo quando o resto dele está ocupado — montando o 3D, decodificando o
 * vídeo, carregando imagens. A versão anterior era animada quadro a quadro por JavaScript (GSAP + canvas) e
 * congelava junto com essas tarefas (varredura de 23/11: 2,6 s de navegador ocupado com o 3D bem na espera).
 * O JavaScript só liga a classe `.ab-roda` (começo) e faz a saída. O roteiro de tempos está no CSS (`theme-claro.css`).
 *
 * A logo é SEMPRE o arquivo original. Os valores "aleatórios" das estrelas e faíscas são fixos (gerador com semente):
 * o servidor e o navegador desenham exatamente o mesmo HTML.
 */

// gerador pseudoaleatório determinístico (mesmo resultado no servidor e no navegador)
const gerador = (semente: number) => {
  let s = semente >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
};
type Estilo = CSSProperties & Record<`--${string}`, string>;

const r1 = gerador(20261123);
// estrelas que saem do centro (céu calmo, já correndo na espera)
const ESTRELAS = Array.from({ length: 64 }, (_, k): Estilo => {
  const v = 1.8 + r1() * 2.6;
  return {
    "--a": `${(k / 64) * 360 + r1() * 9}deg`,
    "--v": `${v.toFixed(2)}s`,
    "--d": `${(-r1() * v).toFixed(2)}s`,
    "--l": `${Math.round(14 + r1() * 46)}px`,
    "--c": r1() < 0.3 ? "#ffffff" : r1() < 0.6 ? "#8ec5ff" : "#4f9bdc",
  };
});
// estrelas da DOBRA (carga): longas e rápidas
const DOBRA = Array.from({ length: 48 }, (_, k): Estilo => {
  const v = 0.34 + r1() * 0.3;
  return {
    "--a": `${(k / 48) * 360 + r1() * 7}deg`,
    "--v": `${v.toFixed(2)}s`,
    "--d": `${(-r1() * v).toFixed(2)}s`,
    "--l": `${Math.round(110 + r1() * 220)}px`,
    "--c": r1() < 0.5 ? "#ffffff" : "#8ec5ff",
  };
});
// faíscas do flash (3 alcances diferentes)
const FAISCAS = Array.from({ length: 30 }, (_, k): Estilo => ({
  "--a": `${(k / 30) * 360 + r1() * 10}deg`,
  "--v": `${(0.7 + r1() * 0.5).toFixed(2)}s`,
  "--s": `${(0.8 + r1() * 1.4).toFixed(2)}`,
  "--k": `abFaisca${1 + (k % 3)}`,
}));

export default function Abertura() {
  return (
    <div className="preloader" aria-hidden="true">
      {/* o FUNDO (céu, dobra, raios) some de uma vez no flash; daí em diante o escuro é a ÍRIS */}
      <div className="ab-fundo">
        <div className="ab-ceu">{ESTRELAS.map((st, k) => <i key={k} style={st}><b /></i>)}</div>
        <div className="ab-dobra">{DOBRA.map((st, k) => <i key={k} style={st}><b /></i>)}</div>
        <div className="ab-raios-vida"><div className="ab-raios" /></div>
        <div className="ab-vinheta" />
      </div>
      {/* PORTAL no compositor (23/11/2026, Victor: "travadinha na hora que abre o portal"): um anel com furo que só
          CRESCE (transform) + 4 placas escuras que se afastam junto. Antes era uma máscara redesenhada a cada quadro
          pelo navegador, que engasgava quando o site acordava por trás */}
      <div className="ab-iris"><i className="ab-iris__anel" /><i className="ab-iris__c" /><i className="ab-iris__b" /><i className="ab-iris__e" /><i className="ab-iris__d" /></div>
      <div className="ab-palco">
        <span className="ab-aura" />
        <span className="ab-onda" />
        <span className="ab-anel ab-anel--1"><i /></span>
        <span className="ab-anel ab-anel--2"><i /></span>
        <span className="ab-anel ab-anel--3"><i /></span>
        {/* anel de luz: um COMETA dá a volta na logo e deixa o aro aceso */}
        <span className="ab-aro" />
        <span className="ab-cometa"><i /></span>
        <div className="ab-logo">
          <LogoImage size={420} priority />
          <span className="ab-reflexo" />
          <span className="ab-logo-luz" />
        </div>
        <div className="ab-faiscas">{FAISCAS.map((st, k) => <i key={k} style={st}><b /></i>)}</div>
      </div>
      <p className="ab-frase">
        {"Sua operação no controle.".split(" ").map((w, k) => (
          <span key={k} className="ab-palavra" style={{ "--i": String(k) } as Estilo}><span>{w}</span></span>
        ))}
      </p>
      <span className="ab-portal" />
      {/* "risco" de luz horizontal de cinema (flare anamórfico) no flash */}
      <span className="ab-risco" />
      <div className="ab-flash" />
    </div>
  );
}
