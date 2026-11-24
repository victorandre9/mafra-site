# Abertura "PORTAL"

(Parte das notas do site — índice em `CLAUDE.md`.)

- **Abertura "PORTAL"** (23/11/2026, aprovada pelo Victor; substitui a de 21/11): espera o site CARREGAR (página + vídeo do
  topo, mínimo 2 s, máximo 6 s) com estrelas calmas; depois ~3,8 s: logo ORIGINAL grande surge do desfoque girando, anéis e
  raios, brilho atravessa, slogan "Sua operação no controle." (escolhido pelo Victor, 23/11/2026; também no rodapé), CARGA (estrelas em dobra), FLASH + onda de
  choque, e o PORTAL (`--furo`, máscara circular na própria abertura) abre e revela o site com o vídeo rodando. Tudo em código
  (`.ab-*` no fim do `theme-claro.css`, timeline em `Experience.tsx`). Saída com `display:none !important` (o CSS usa !important).
  REFINO de desempenho (23/11/2026, "travando demais" no Windows/Chrome): a espera também aguarda as DUAS cenas 3D ficarem
  prontas (`src/lib/abertura.ts`) e o 3D PARA de desenhar durante a abertura (`<PausaAbertura/>` via `setFrameloop` — trocar
  a prop `frameloop` recriava a cena e travava 1,5 s). Recorte da logo com `clip-path` e filtro só na imagem (no iPhone o
  filtro em elemento redondo desenhava um QUADRADO). Raios menores sem máscara, céu a 1x, anel do portal com `transform`,
  `ScrollTrigger.refresh()` do intro só depois da abertura, imagens pré-carregadas na espera, letras do título sem blur.
  Medido: travadas de ~3 s → ~0,2 s (computador) e ~2-4 s → ~0,4 s (celular). Extras: anel de luz que se desenha (SVG),
  faíscas e risco de luz horizontal no flash, brilho correndo pelo slogan.
  SITE CONGELADO durante a abertura (`html.abrindo-quieto`, Victor: "congele todo o site"): vídeo pausado, animações de CSS
  do site pausadas, faixas gigantes (gsap repeat -1) pausadas, robô/setas/malha escondidos e tickers do robô parados;
  tudo volta só NO FIM da apresentação (3,99 s).
  **ROTEIRO NO COMPOSITOR (23/11/2026, Victor: "precisa rodar 100% lisa", travava no PC e no celular):** a varredura mostrou o
  navegador ocupado 2,6 s com o 3D bem na espera, e a apresentação (GSAP + canvas, quadro a quadro em JavaScript) congelava junto.
  Agora é TUDO animação de CSS só com `transform`/`opacity` (`src/components/Abertura.tsx` + bloco `.ab-*` no `theme-claro.css`),
  que o navegador roda no compositor e NÃO trava com o resto ocupado. O JS só liga `.ab-roda` e marca 2,8 s (cliques),
  3,35 s (intro) e 3,97 s (fim) pelo RELÓGIO da animação `abLogo`. Estrelas e faíscas são elementos com valores fixos
  (gerador com semente — servidor e navegador iguais). O anel desenhado virou um COMETA de luz dando a volta + aro aceso.
  Atenção ao `animation-fill-mode`: elementos que começam VISÍVEIS no 0% do keyframe (onda, faíscas) usam `forwards`,
  senão aparecem parados desde o início. Portal: `@property --furo` (inherits: false) animado em CSS.
  **DUAS FASES (23/11/2026, Victor: "o símbolo demora; estrelas primeiro e a logo em meio segundo"):** FASE 1 é só CSS e
  começa SOZINHA com a página (sem esperar o JavaScript, que levava 2-3 s): estrelas, e aos ~0,5 s a logo surge com anéis,
  cometa e raios, e fica viva (aura pulsando) enquanto o site carrega. FASE 2 (`.ab-roda`, quando tudo carregou e a fase 1
  assentou — `performance.now() ≥ 2,3 s`): brilho, slogan, carga, flash, portal; marcos do JS pelo relógio de `abLogoSai`
  (1,8 s cliques, 2,35 s intro, 2,96 s fim). A espera pelo carregamento (vídeo, 3D, página) continua como estava.
  **PORTAL EM ÍRIS (23/11/2026, Victor: "travadinha na hora que abre o portal"):** a máscara `--furo` era redesenhada pelo
  navegador a cada quadro e engasgava. Agora: no flash (1,8 s) o FUNDO (`.ab-fundo`: céu, dobra, raios) some e a ÍRIS
  (`.ab-iris`) assume o escuro — um anel com furo que cresce (scale 0→1,667, furo 48vmax×escala) + 4 placas escuras que se
  afastam 50vmax×escala com a MESMA curva. Só transform/opacity (compositor). O site (vídeo, 3D, animações) só ACORDA quando
  o portal termina (2,96 s; Victor: "acabou o portal, inicia os vídeos do site").
