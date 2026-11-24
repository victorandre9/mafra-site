# Visual geral: blocos claro/azul, vidro, fundo animado, malha, mouse, contato, botões

(Parte das notas do site — índice em `CLAUDE.md`.)

- Mouse no computador: o círculo SAIU. Lanterna verde suave segue o mouse (`.lanterna-mouse`); cards, cases,
  formação, números e perguntas sobem/crescem com borda verde e reflexo que segue o mouse; botões, menu e foto têm zoom.
  Botões: SEM ímã (não seguem o mouse), só zoom + luz verde atrás; nunca mudam de cor no hover.
- **Fundo animado** (modelo 1, 19/11/2026): 6 faixas diagonais da marca (`.faixas-fundo`, mesma forma do
  `Chevron` do topo), fixas atrás do conteúdo. Refinadas: seta própria mais LARGA, proporção fixa (vmin), SEM giro; cada uma
  entra pela lateral, flutua e sai (ciclo de 6 s, uma entrando a cada ~1 s). VAGAS FIXAS que não se cruzam
  (3 à direita, 3 à esquerda, alturas separadas), sem parallax; na Metodologia (`body.na-metodologia`, ligado no PRÓPRIO gatilho que trava a tela) ficam só 2,
  na coluna livre à direita do celular (computador) e nenhuma no celular.
  Aparecem só depois do topo; suaves para não brigar com o texto.
- Malha de pontos (`Background3D`): tem paradas também DENTRO dos Cases e nas Perguntas — sem elas parecia travada.
- **Contato escuro** (estilo Liquid Glass CTA): azul-marinho, setas flutuando, WhatsApp/Instagram/LinkedIn empilhados no mesmo
  formato com as cores OFICIAIS de cada app.
- **Site em BLOCOS claro/azul** (21/11/2026, `section.bloco-azul`, mesmo azul do Contato, largura total):
  topo (claro) · faixa que passa (no BRANCO, com respiro antes do azul) · manifesto (azul) · serviços (claro) · metodologia + números (azul) · cases (claro) · sobre (azul) ·
  perguntas (claro) · contato (azul). Faixa clara de transição CURTA (36px) só no começo de cada bloco (`bloco-azul--abre`);
  o Contato também (antes 160px, "efeito branco muito forte").
- **Cards em VIDRO COM AURA** (modelo 2 escolhido pelo Victor, 21/11/2026, fim de `theme-claro.css`): vidro fosco, filete de
  luz no topo e brilho azul saindo do canto de baixo à direita. Cantoneiras em "L" e quadriculado foram RECUSADOS (não voltar).
  Blocos azuis (sobre, números): vidro escuro, texto branco; claros (serviços, cases, perguntas): vidro claro. Serviços mantêm
  o aro triplo; `card--cta`/`project--cta` ficam como eram. Alternativas mostradas: borda de luz girando (1), filete no topo (3).
  Borda dos cards 3px (3x mais grossa, mesma cor); números do bloco azul em BRANCO sólido (o span tinha degradê marinho).
- **Imagem do link compartilhado** (`public/og-image.jpg`, 21/11/2026): modelo 4 — fundo azul-marinho, logo original, frase do topo e FOTO do Victor à direita com selo "Fale com o Victor →". Ao trocar, subir o `?v=` em `layout.tsx`.
- Botões verdes: flash claro passando da esquerda para a direita a cada 3 s (`verde-varre`).
