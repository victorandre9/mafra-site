# Computador em PÁGINAS de tela cheia (paginas.ts), navegação e Serviços

(Parte das notas do site — índice em `CLAUDE.md`.)

- **Metodologia em janela baixa** (22/11/2026): no computador com pouca altura (notebook com escala do Windows) a seção travada
  encolhe com `zoom` em `.process__grid` (degraus por max-height 920/840/780/720/660); `posHolos` divide as posições pelo zoom.
- **Site em PÁGINAS DE TELA CHEIA** (23/11/2026, `src/lib/paginas.ts`, só COMPUTADOR): 1 gesto (fraco ou forte) = 1 página,
  nunca pula nem para no meio. Cada página cabe numa tela (zoom de 60% a 150%; letra cresce se sobra espaço). Troca de
  BLOCO = a página entra INTEIRA pela direita, só na horizontal (a própria página desliza, como o vídeo de referência do
  Victor); dentro do bloco desce. Cases = 2 páginas (`PEDACOS`); Metodologia = 4 paradas na tela travada; Serviços = 6 cards
  em 2 fileiras de 3. **CELULAR: rolagem contínua normal, tudo para baixo, sem páginas e sem lateral** (ordem do Victor).
  A troca lateral move a PRÓPRIA página (`translate` nas seções; a parte travada da Metodologia se move sozinha) — NUNCA
  cópia/clone: a cópia piscava e a página "se reajustava" na chegada (Victor, 23/11/2026). A página de destino chega PRONTA
  (`prepararDestino`: animações de entrada terminadas). Nada de esconder a barra de rolagem na troca (no Windows alargava a
  página). `ScrollTrigger.refresh()` sempre DEPOIS do encaixe (`ajustarTamanhos`). A barra do topo não some ao rolar.
  Gesto novo = mão parada 220 ms OU mudou de direção OU o embalo do trackpad voltou a crescer (hora do evento, `ev.timeStamp`).
  Topo: título em 2 linhas largas, card "Fale com o Victor" 1,15x na linha dos botões (1,35 ficou grande demais), com a
  foto GRANDE (`victor-mafra-retrato.jpg`, 1122×1402; a de 720 px ficava sem qualidade). Manifesto: menor e centralizado.
  Serviços sem o véu branco (a malha de pontos aparece igual à dos Cases).
  Pedaços (Cases) medidos SEM a animação de entrada (`topoLayout`), seção com 1px de respiro (margem não atravessa) e
  margem corrigida medindo de novo. Se uma página MUDA de altura sozinha (ex.: números contando 0→30 quebravam a linha),
  um ResizeObserver reencaixa tudo. `.stat__n` sem quebra de linha. Card "A solução da sua empresa" 72px mais abaixo.
  Cases LEGÍVEIS: a largura na TELA é fixa (90%, até 1800 px) e a de layout é ela ÷ zoom (cards largos = menos linhas);
  imagens com altura fixa (30vh/19vh, `contain`); letras dos cards maiores. No 1920×694 do Victor: zoom 0,49 → 0,60.
- **Direção das trocas (regra do Victor, 23/11/2026)**: tela CLARA → AZUL = página entra pela DIREITA; AZUL → CLARA = entra
  DE BAIXO PARA CIMA; mesmo tema e azul → azul = desce; voltando, o inverso. Salto pelo mapa (pula temas) = de lado.
- **Navegação sem rolagem (computador)**: MAPA DO SITE na lateral direita (`.pg-mapa`, uma bolinha por tema, nome ao passar
  o mouse, a atual alongada; vidro escuro sobre os temas azuis) + SETAS ↑ ↓ no canto (`.pg-setas`). Usam o mesmo `ir()`.
- **Malha de pontos no computador (páginas)**: dança pela tela inteira sozinha (caminho em "oito", ~40 s), sem depender
  da rolagem; a cada troca de página gira mais rápido por um instante. Celular: paradas pela rolagem, como antes.
- **Serviços no computador** (23/11/2026): título encostado no menu (respiro = altura do menu, em `paginas.ts`), cards e
  cabeçalho com 90% da LARGURA DA TELA (`calc(90vw * var(--inv-zoom))`), letras maiores (h3 1,75rem, texto 1,22rem).
  Em 1366×650 o texto dos cards foi de ~8px para ~13px na tela.
- **"Voltar ao topo"** no computador usa `__paginas.ir(0)` (a rolagem suave fica desligada no modo páginas).
