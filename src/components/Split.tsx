type SplitProps = { text: string; className?: string; charClassName?: string };

/** Quebra o texto em <span class="char"> para animar letra por letra (renderizado no servidor). */
export function SplitChars({ text, className = "", charClassName = "" }: SplitProps) {
  return (
    <span className={`split ${className}`} aria-label={text}>
      {[...text].map((c, i) =>
        c === " " ? (
          " "
        ) : (
          <span key={i} className={`char ${charClassName}`} aria-hidden="true">
            {c}
          </span>
        ),
      )}
    </span>
  );
}

/** Quebra o texto em <span class="word"> (usado no manifesto). */
export function SplitWords({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((w, i) =>
        /^\s+$/.test(w) || !w ? w : (
          <span key={i} className="word">
            {w}
          </span>
        ),
      )}
    </>
  );
}
