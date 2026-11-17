/**
 * Marca MAFRA Consultoria & Tecnologia — reprodução vetorial da logomarca oficial:
 * "M" branco com a peça verde inclinada na base direita, assinatura em caixa alta
 * espaçada e o selo circular (anel verde/branco, dobra verde e linhas finas).
 */

const M_WHITE_L = "M0 140V0h30l60 84v40L28 38v102z";
const M_WHITE_R = "M136 0h28v48l-28 24z";
const M_GREEN = "M72 140l64-60 28-24v84h-28v-30l-32 30z";

export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg className={`logo-mark ${className}`} width={size} height={(size * 140) / 164} viewBox="0 0 164 140" aria-hidden="true">
      <path className="logo-mark__w" d={M_WHITE_L} fill="#ffffff" />
      <path className="logo-mark__w" d={M_WHITE_R} fill="#ffffff" />
      <path className="logo-mark__g" d={M_GREEN} fill="#3ddc84" />
    </svg>
  );
}

export function Logo({ uid, sub = true }: { uid: string; sub?: boolean }) {
  return (
    <span className="brand">
      <LogoBadge uid={uid} size={48} withText={false} />
      <span className="brand__text">
        <span className="brand__name">MAFRA</span>
        {sub && <span className="brand__sub">Consultoria &amp; Tecnologia</span>}
      </span>
    </span>
  );
}

/** Selo circular completo (preloader, seção Sobre). */
export function LogoBadge({ uid, size = 220, withText = true, className = "" }: { uid: string; size?: number; withText?: boolean; className?: string }) {
  // ids únicos por selo: dois selos na mesma página não podem compartilhar gradientes
  const id = `badge-${uid}`;
  return (
    <svg className={`logo-badge ${className}`} width={size} height={size} viewBox="0 0 400 400" role="img" aria-label="MAFRA Consultoria & Tecnologia">
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor="#0f2a4d" />
          <stop offset="1" stopColor="#0a1c38" />
        </radialGradient>
        <linearGradient id={`${id}-peel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5fe08f" />
          <stop offset="1" stopColor="#1f9a52" />
        </linearGradient>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3fd178" />
          <stop offset=".5" stopColor="#22a95a" />
          <stop offset="1" stopColor="#3fd178" />
        </linearGradient>
        <linearGradient id={`${id}-m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4fdc86" />
          <stop offset="1" stopColor="#25ae5f" />
        </linearGradient>
        <clipPath id={`${id}-disc`}><circle cx="200" cy="200" r="178" /></clipPath>
      </defs>
      <circle cx="200" cy="200" r="196" fill="#ffffff" />
      <circle cx="200" cy="200" r="191" fill={`url(#${id}-ring)`} />
      <circle cx="200" cy="200" r="178" fill={`url(#${id}-bg)`} />
      <g clipPath={`url(#${id}-disc)`}>
        <path className="logo-badge__peel" d="M0 120C40 70 95 32 160 16c-30 34-44 74-50 118C80 128 40 132 0 150z" fill={`url(#${id}-peel)`} />
        <path d="M160 16c-30 34-44 74-50 118-10-30-6-74 22-108z" fill="#0d3b2c" opacity=".55" />
        <path className="logo-badge__line" d="M58 250L232 10" stroke="#3ddc84" strokeWidth="1.4" opacity=".75" />
        <path d="M330 300c-15 30-40 52-68 66" stroke="#3ddc84" strokeWidth="2" fill="none" opacity=".8" />
      </g>
      <g transform={withText ? "translate(118 78)" : "translate(118 130)"}>
        <path className="logo-mark__w" d={M_WHITE_L} fill="#ffffff" />
        <path className="logo-mark__w" d={M_WHITE_R} fill="#ffffff" />
        <path className="logo-mark__g" d={M_GREEN} fill={`url(#${id}-m)`} />
      </g>
      {withText && (
        <>
          <text x="200" y="268" textAnchor="middle" className="logo-badge__name">MAFRA</text>
          <text x="200" y="292" textAnchor="middle" className="logo-badge__sub">CONSULTORIA &amp; TECNOLOGIA</text>
          <rect x="168" y="306" width="64" height="3" rx="1.5" fill="#3ddc84" />
        </>
      )}
    </svg>
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
