/** Marca MAFRA: "M" branco com a perna direita em verde + assinatura. */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg className={`logo-mark ${className}`} width={size} height={size * 0.8} viewBox="0 0 100 80" aria-hidden="true">
      <path className="logo-mark__w" d="M6 76V4h17l27 31L77 4h17v30L50 76 23 45v31z" fill="#ffffff" />
      <path className="logo-mark__g" d="M94 40v36H77V57L59 76h-5z" fill="#3ddc84" />
    </svg>
  );
}

export function Logo({ sub = true }: { sub?: boolean }) {
  return (
    <span className="brand">
      <LogoMark />
      <span className="brand__text">
        <span className="brand__name">MAFRA</span>
        {sub && <span className="brand__sub">Consultoria &amp; Tecnologia</span>}
      </span>
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
