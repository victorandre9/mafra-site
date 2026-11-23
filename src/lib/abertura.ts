/**
 * Conversa entre a ABERTURA (Experience.tsx) e as cenas 3D (Background3D, DroneOrb) — 23/11/2026.
 * As cenas 3D montam e desenham o 1º quadro DURANTE a espera (fundo com estrelas calmas) e avisam "pronto".
 * Enquanto a abertura roda, elas param de desenhar (ficam escondidas atrás dela) e voltam no fim:
 * era o 3D montando e desenhando no meio da apresentação que fazia ela travar no Windows/Chrome.
 */
export const EV_ABERTURA = "mafra:abertura"; // detail: "inicio" | "fim"
export const EV_3D_PRONTO = "mafra:3d-pronto"; // detail: "fundo" | "orbe"

export function aberturaRodando(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains("abrindo");
}

export function avisar3DPronto(id: "fundo" | "orbe") {
  const w = window as unknown as { __3dPronto?: Set<string> };
  (w.__3dPronto ??= new Set()).add(id);
  window.dispatchEvent(new CustomEvent(EV_3D_PRONTO, { detail: id }));
}

/** espera a cena 3D `id` ficar pronta (ou o tempo-limite) */
export function esperar3D(id: "fundo" | "orbe", limiteMs: number): Promise<void> {
  return new Promise((ok) => {
    const w = window as unknown as { __3dPronto?: Set<string> };
    if (w.__3dPronto?.has(id)) { ok(); return; }
    const t = setTimeout(() => { window.removeEventListener(EV_3D_PRONTO, f); ok(); }, limiteMs);
    const f = (e: Event) => { if ((e as CustomEvent).detail === id) { clearTimeout(t); window.removeEventListener(EV_3D_PRONTO, f); ok(); } };
    window.addEventListener(EV_3D_PRONTO, f);
  });
}
