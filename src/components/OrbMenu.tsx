"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { WHATSAPP } from "@/lib/contato";

/**
 * Menu da Orbe (o mascote). Tocar nela abre 3 caminhos:
 * 1. Diagnóstico rápido — 3 perguntas de um toque viram uma mensagem pronta no WhatsApp
 *    (o Victor recebe o contato já qualificado: segmento, problema, tamanho da equipe).
 * 2. Falar com o Victor — WhatsApp direto.
 * 3. Me leva até… — atalhos para as seções (a rolagem é feita pelo Experience, via evento).
 * Abre pelo evento "mafra:orbmenu", disparado no clique da Orbe.
 */

const SEGMENTOS = ["Comércio / distribuição", "Indústria", "Serviços técnicos", "Transporte / logística", "Saúde", "Outro"];
const PROBLEMAS = [
  "Retrabalho e tarefas esquecidas",
  "Informação espalhada (planilhas, WhatsApp)",
  "Pouco controle da equipe em campo",
  "Financeiro desorganizado",
  "Falta de indicadores para decidir",
  "Outro",
];
const EQUIPES = ["1 a 5 pessoas", "6 a 20 pessoas", "21 a 50 pessoas", "Mais de 50"];
const SECOES: Array<[string, string]> = [
  ["#servicos", "Serviços"],
  ["#metodo", "Metodologia"],
  ["#cases", "Cases"],
  ["#sobre", "Sobre o Victor"],
  ["#contato", "Contato"],
];

type Tela = "menu" | "seg" | "prob" | "equipe" | "fim" | "ir";

const wa = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

export default function OrbMenu() {
  const [open, setOpen] = useState(false);
  const [tela, setTela] = useState<Tela>("menu");
  const [seg, setSeg] = useState("");
  const [prob, setProb] = useState("");
  const [equipe, setEquipe] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const abrir = () => { setTela("menu"); setOpen(true); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("mafra:orbmenu", abrir);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("mafra:orbmenu", abrir); window.removeEventListener("keydown", esc); };
  }, []);

  if (!mounted) return null;

  const mensagem =
    `Olá, Victor! Vim pelo site da MAFRA e fiz o diagnóstico rápido.\n\n` +
    `• Segmento: ${seg}\n• Maior desafio: ${prob}\n• Equipe: ${equipe}\n\n` +
    `Gostaria de conversar sobre uma solução para a minha empresa.`;

  const ir = (href: string) => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("mafra:goto", { detail: href }));
  };

  const passo = tela === "seg" ? 1 : tela === "prob" ? 2 : tela === "equipe" ? 3 : 0;

  return createPortal(
    <div className={`orbmenu${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="orbmenu__backdrop" onClick={() => setOpen(false)} />
      <div className="orbmenu__panel" role="dialog" aria-modal="true" aria-label="Assistente MAFRA">
        <div className="orbmenu__head">
          <span className="orbmenu__id"><i /> MAFRA-01 · Assistente</span>
          <button className="orbmenu__x" onClick={() => setOpen(false)} aria-label="Fechar">✕</button>
        </div>

        {passo > 0 && (
          <div className="orbmenu__steps" aria-hidden="true">
            {[1, 2, 3].map((n) => <span key={n} className={n <= passo ? "is-on" : ""} />)}
          </div>
        )}

        {tela === "menu" && (
          <div className="orbmenu__body" key="menu">
            <p className="orbmenu__q">Oi! Como posso te ajudar?</p>
            <button className="orbmenu__opt orbmenu__opt--hero" onClick={() => setTela("seg")}>
              <b>⚡ Diagnóstico rápido</b><span>3 perguntas, 30 segundos — e o Victor já entende seu cenário</span>
            </button>
            <a className="orbmenu__opt" href={wa("Olá, Victor! Vim pelo site da MAFRA e gostaria de conversar.")} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <b>💬 Falar com o Victor</b><span>Abre o WhatsApp direto</span>
            </a>
            <button className="orbmenu__opt" onClick={() => setTela("ir")}>
              <b>🧭 Me leva até…</b><span>Serviços, metodologia, cases, sobre</span>
            </button>
          </div>
        )}

        {tela === "seg" && (
          <div className="orbmenu__body" key="seg">
            <p className="orbmenu__q">Qual é o segmento da sua empresa?</p>
            <div className="orbmenu__chips">
              {SEGMENTOS.map((s) => <button key={s} className="orbmenu__chip" onClick={() => { setSeg(s); setTela("prob"); }}>{s}</button>)}
            </div>
          </div>
        )}

        {tela === "prob" && (
          <div className="orbmenu__body" key="prob">
            <p className="orbmenu__q">Qual é o maior desafio hoje?</p>
            <div className="orbmenu__chips">
              {PROBLEMAS.map((s) => <button key={s} className="orbmenu__chip" onClick={() => { setProb(s); setTela("equipe"); }}>{s}</button>)}
            </div>
            <button className="orbmenu__back" onClick={() => setTela("seg")}>← voltar</button>
          </div>
        )}

        {tela === "equipe" && (
          <div className="orbmenu__body" key="equipe">
            <p className="orbmenu__q">Quantas pessoas na equipe?</p>
            <div className="orbmenu__chips">
              {EQUIPES.map((s) => <button key={s} className="orbmenu__chip" onClick={() => { setEquipe(s); setTela("fim"); }}>{s}</button>)}
            </div>
            <button className="orbmenu__back" onClick={() => setTela("prob")}>← voltar</button>
          </div>
        )}

        {tela === "fim" && (
          <div className="orbmenu__body" key="fim">
            <p className="orbmenu__q">Pronto! Seu diagnóstico:</p>
            <ul className="orbmenu__resumo">
              <li><span>Segmento</span><b>{seg}</b></li>
              <li><span>Maior desafio</span><b>{prob}</b></li>
              <li><span>Equipe</span><b>{equipe}</b></li>
            </ul>
            <a className="btn btn--wa orbmenu__send" href={wa(mensagem)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <span>Enviar para o Victor no WhatsApp</span><i className="btn__arrow">→</i>
            </a>
            <button className="orbmenu__back" onClick={() => setTela("seg")}>↺ refazer</button>
          </div>
        )}

        {tela === "ir" && (
          <div className="orbmenu__body" key="ir">
            <p className="orbmenu__q">Para onde vamos?</p>
            <div className="orbmenu__chips">
              {SECOES.map(([href, label]) => <button key={href} className="orbmenu__chip" onClick={() => ir(href)}>{label}</button>)}
            </div>
            <button className="orbmenu__back" onClick={() => setTela("menu")}>← voltar</button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
