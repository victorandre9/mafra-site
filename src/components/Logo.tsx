/* eslint-disable @next/next/no-img-element */

/**
 * Logomarca oficial MAFRA Consultoria & Tecnologia.
 * Usa SEMPRE o arquivo original (public/brand/mafra-logo.png): nada de redesenho em
 * vetor, texto ou CSS. Só o fundo branco fora do círculo foi tornado transparente;
 * cores e proporções são as do arquivo (399×398), exibido sempre em proporção.
 */
const SRC = "/brand/mafra-logo.png";
const RATIO = 398 / 399;

export function LogoImage({ size, className = "", priority = false }: { size: number; className?: string; priority?: boolean }) {
  return (
    <img
      src={SRC}
      alt="MAFRA Consultoria & Tecnologia"
      width={size}
      height={Math.round(size * RATIO)}
      className={`logo-img ${className}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ width: size, height: "auto" }}
    />
  );
}

/** Cabeçalho e rodapé: a logo oficial, sem texto adicional. */
export function Logo({ size = 60 }: { size?: number }) {
  return (
    <span className="brand">
      <LogoImage size={size} priority />
    </span>
  );
}

/** Chevron da identidade visual (mesma forma das apresentações). */
export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg className={`chevron ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M58 0h42L50 50l50 50H58L8 50z" />
    </svg>
  );
}
