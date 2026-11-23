# Site MAFRA Consultoria & Tecnologia — notas para o Claude

Site institucional da **MAFRA Consultoria & Tecnologia**, empresa do **Victor** (Victor Mafra). Next.js 15 + TypeScript + Tailwind,
GSAP/ScrollTrigger + Lenis, React Three Fiber. Textos em pt-BR.

O Victor não é desenvolvedor: fale em português simples, sem jargão de git.

## Publicação: merge automático (ordem do Victor, 17/11/2026)

Toda alteração vai para o ar sem pedir autorização:

1. `npm run build` passando.
2. Commit, push no branch de trabalho, PR contra `main`.
3. Esperar o check da Vercel no PR (`pull_request_read` → `get_status`) ficar `success`.
4. **Fazer o merge sozinho.** Nunca perguntar "posso fazer o merge?".
5. Conferir o status da Vercel no commit de merge
   (`curl -s https://api.github.com/repos/victorandre9/mafra-site/commits/<sha>/status`).
6. Avisar o Victor só no fim — ou se algo falhar (build quebrado, check vermelho, conflito).

A rede deste ambiente bloqueia `*.vercel.app`: não dá para abrir o site daqui.
O endereço de produção é o do projeto `mafra-site` na Vercel.

## Regras de conteúdo

- **Site institucional: o trabalho da MAFRA é solução para EMPRESAS**, não criar produtos.
  Vo$, iFluxo e Verifica aparecem como cases: falar dos BENEFÍCIOS e funcionalidades
  (ex.: Vo$ = controle financeiro, metas, realizar sonhos), nunca um passo a passo de uso.
- **Voz do site: primeira pessoa ("eu")**. O Victor atua como profissional autônomo —
  nada de "nós", "entendemos", "desenvolvemos" (decisão de 18/11/2026).
- **Verifica no site: NÃO citar Bel Log nem família** (decisão do Victor, 18/11/2026). O card fala do setor:
  "criado para empresas de logística — armazéns, cross-docking e transportadoras", com os benefícios
  (checklists ligados à manutenção da frota, jornada, produção por colaborador, performance de motoristas
  e ajudantes, integração com RH e qualidade).
- **Galato e Thermobrás são clientes em potencial: nunca citar** (nem dados derivados das propostas).
- **Logos são sempre os arquivos originais** (`public/brand/mafra-logo.png`, `public/cases/*`).
  Nunca redesenhar/recriar logo com SVG, texto ou CSS.
- **Formação do Victor: MBA em Gestão Empresarial CONCLUÍDO (julho/2026).** Nunca escrever "em curso".
- **Nome da empresa por extenso: "MAFRA Consultoria & Tecnologia"** (com "&") em mensagens e textos formais —
  nunca só "MAFRA" sozinho (ex.: "Vim pelo site da MAFRA Consultoria & Tecnologia").
- **"Mafra" é o sobrenome do Victor e o nome da EMPRESA — nunca uma pessoa.** Na conversa e nos textos:
  a pessoa é o **Victor**; a empresa é a **MAFRA Consultoria & Tecnologia**. Nada de "o Mafra fez", "fale com o Mafra".
- Números no site só se forem reais (prazos e etapas da metodologia). Nada inventado.

## Tema de cores (18/11/2026)

- **No ar desde 18/11/2026 (noite): tema AZUL** (azul-marinho da logo, `#001836`, subindo na escala). Histórico:
  verde → azul → verde → azul. O botão do **WhatsApp** é sempre verde (marca dele).
- **Para trocar de tema: rodar a regra de cores no site ATUAL** (nunca restaurar a cópia antiga inteira):
  verde→azul = matiz 80°–175° vira 213° (`l2 = 0.07 + (l-0.15)*0.42`, `s2 = 0.95`; gelo/menta acima de l 0.86 mantém
  a luz, saturação até 0.55), pulando o bloco `.btn--wa`; e trocar a foto `public/sobre/` pela do tema (subir o `?v=`).
- A troca para o azul foi feita mudando o matiz de todas as cores verdes (CSS, robô 3D, malha, celular);
  script de referência: só os verdes com matiz 80°–175° viram azul 213°.
- **Os dois temas estão salvos no GitHub** (pedido do Victor), cada um com todas as melhorias:
  branch `tema-azul` (o que está no ar) e branch `tema-verde`, ambas atualizadas com TUDO até a noite de 18/11/2026. A cor NÃO é trocável pelo visitante.
  Para trocar de tema: aplicar no `main` a diferença de cores do branch do outro tema (CSS, `Background3D.tsx`,
  `Phone.tsx`, `robo/ModelosPerola.tsx`, `page.tsx` e a foto `public/sobre/`), mantendo o que mudou depois.
- **REGRA (pedido do Victor, 19/11/2026): toda atualização vai também para o `tema-verde`.** Depois de cada merge:
  cherry-pick dos commits novos no `tema-verde` e trocar só os ACENTOS azuis que entraram no commit pelos verdes
  (`#011834`→`#0c6b38`, `#1f5fa8`→`#18a057`, `#4f9bdc`→`#34d27a`, `#8ec5ff`→`#7fe3ad`); textos/navy neutros ficam.
- Botões: **arredondados** (cantos suaves de 8px foram testados e recusados).

## Robô (Orbe) no celular

- Nunca em cima do texto nem do **celular 3D** (seção "Metodologia de trabalho", a que trava a tela).
  O esconderijo é guardado em coordenada de TELA; sem lugar 100% livre, ele vai para o ponto que menos
  cobre texto, com o celular pesando 4x (`custo` em `Experience.tsx`).
  Enquanto o celular 3D está na tela, o Orbe ESTACIONA ABAIXO DO CELULAR (21/11/2026, um pouco à esquerda do centro, balões
  abrem ao lado dele; o balão também desvia do celular). Sem espaço embaixo (tela baixa), volta para a VAGA FIXA na lateral.
- O Orbe NUNCA sai da tela (trava `travar`, a cada quadro).
- Selo do topo ("Processos mais inteligentes…"): card com a COR DOS BALÕES do robô (vidro verde), letra branca, cantos de 12px, texto centralizado (`.hero .pill`).

- **Voo do menu (computador E celular — no celular pelo menu ☰)**: clicar em Serviços/Método/Cases/Sobre/Contato escurece a tela, a luz do
  robô cresce (brilho, largura e comprimento do facho) e ele desce até o tema em 3 s, 4 s, 5 s, 6 s, 7 s;
  a rolagem é nossa, quadro a quadro (o scrollTo do Lenis pulava direto no PC do Victor); o robô desce em
  linha reta e estaciona POR CIMA do título, com a lanterna em cima dele; a tela volta ao normal (`mafra:voo`).
- **Falas do Orbe**: só com a tela PARADA (rolou → o balão some na hora) e uma a cada 10 s, de começo a começo
  (1 minuto parado = 6 falas). Continua valendo a regra de ouro: só fala se houver lugar sem cobrir texto.
- Mouse no computador: o círculo SAIU. Lanterna verde suave segue o mouse (`.lanterna-mouse`); cards, cases,
  formação, números e perguntas sobem/crescem com borda verde e reflexo que segue o mouse; botões, menu e foto têm zoom.
  Botões: SEM ímã (não seguem o mouse), só zoom + luz verde atrás; nunca mudam de cor no hover.
- Metodologia (computador): abaixo das etapas, o EXEMPLO da equipe de manutenção (no lugar de "Dois resultados…");
  só a etapa ativa mostra a descrição, para tudo caber na tela travada. No celular o exemplo fica oculto (sem espaço).
- **Cases em DOIS GRUPOS** (19/11/2026, `GRUPOS_CASES` em `page.tsx`):
  **Soluções empresariais** (3 lado a lado no computador): Verifica, **Vetra Sales** (`public/cases/vetra-sales-card.webp`),
  **Polar OS** (`public/cases/polar-os-card.webp`); **Aplicativos e produtos digitais** (2): Vo$ e iFluxo.
  Card final "A solução da sua empresa" fica fora dos grupos, em largura total. Tablet: 2 colunas (o 3º card empresarial
  ocupa a fileira); celular: 1. Vetra Sales é o nome de divulgação de um protótipo de vendas externas:
  NUNCA ligá-lo a cliente nenhum no site; "Na sua empresa" aprovado pelo Victor em 19/11/2026.
- Cases empresariais: as TRÊS placas de logo (Verifica em código; Vetra/Polar recortadas das imagens originais em
  `public/cases/*-placa.webp`) com o MESMO tamanho e proporção 3,7:1, teto 320px, no mesmo fundo azul-escuro do Verifica.
- Celular 3D da Metodologia: RETO o tempo todo (sem giro na rolagem nem com o mouse); telas alternam
  escura (etapas 1 e 3) e CLARA (etapas 2 e 4) para o visitante perceber a troca. Balões em volta (`.holo`)
  posicionados pelo próprio celular (`posHolos`): A fora à esquerda sem invadir o texto, B fora à direita.
- **Fundo animado** (modelo 1, 19/11/2026): 6 faixas diagonais da marca (`.faixas-fundo`, mesma forma do
  `Chevron` do topo), fixas atrás do conteúdo. Refinadas: seta própria mais LARGA, proporção fixa (vmin), SEM giro; cada uma
  entra pela lateral, flutua e sai (ciclo de 6 s, uma entrando a cada ~1 s). VAGAS FIXAS que não se cruzam
  (3 à direita, 3 à esquerda, alturas separadas), sem parallax; na Metodologia (`body.na-metodologia`, ligado no PRÓPRIO gatilho que trava a tela) ficam só 2,
  na coluna livre à direita do celular (computador) e nenhuma no celular.
  Aparecem só depois do topo; suaves para não brigar com o texto.
- Malha de pontos (`Background3D`): tem paradas também DENTRO dos Cases e nas Perguntas — sem elas parecia travada.
- **Topo com VÍDEO** (20/11/2026, gerado no Runway Gen-4.5 pela API e ampliado para 2K no Magnific (217 créditos); computador `topo-hd.mp4` 1080p, celular `topo.mp4` 720p — chave salva no ambiente `mafra-site`):
  `public/video/topo.mp4` em LOOP atrás do topo (mudo + play forçados pelo código; recarrega se o Safari congelar ao voltar do
  app; vigia a cada 1 s). Celular: faixa de vídeo NÍTIDA no alto e texto abaixo. Com o vídeo na tela, malha 3D e setas somem.
- Topo: lista "/ Diagnóstico & processos…" e cartão de vidro **"Fale com o Victor"** (foto, abre o WhatsApp) na MESMA linha
  dos dois botões; os dois botões do topo fazem o VOO do robô (Método 4 s, Contato 7 s).
- **Contato escuro** (estilo Liquid Glass CTA): azul-marinho, setas flutuando, WhatsApp/Instagram/LinkedIn empilhados no mesmo
  formato com as cores OFICIAIS de cada app.
- Robô: obstáculos incluem CARDS inteiros; cobrindo texto/botão/card > 12% fica translúcido (0,28) no computador e no celular.
- **Abertura com a logo** (21/11/2026): fundo azul-marinho, logo ORIGINAL entra girando, dois anéis de luz giram em volta,
  brilho atravessa a logo, aura pulsa; na saída a logo cresce e some (`.preloader__orbita`, ~2 s).
- Robô no celular nasce na PARTE BRANCA, EM FRENTE à palavra "movem" (centro da última linha do título, canto direito; vão livre medido pelo layout; sem vão, cai no vídeo); fica parado ali até a 1ª rolagem. Saudação "Clique aqui! 👆" em balão compacto de 2 linhas, só se couber sem cobrir texto.
- iPhone em economia de bateria (vídeo bloqueado): esconde o vídeo e o botão de play, fica a imagem parada (`.video-bloqueado`).
- Malha de pontos/setas: somem só com o topo quase inteiro na tela (`com-video` termina em `bottom 85%`); o vídeo usa `video-na-tela`.
- **Site em BLOCOS claro/azul** (21/11/2026, `section.bloco-azul`, mesmo azul do Contato, largura total):
  topo (claro) · faixa que passa (no BRANCO, com respiro antes do azul) · manifesto (azul) · serviços (claro) · metodologia + números (azul) · cases (claro) · sobre (azul) ·
  perguntas (claro) · contato (azul). Faixa clara de transição CURTA (36px) só no começo de cada bloco (`bloco-azul--abre`);
  o Contato também (antes 160px, "efeito branco muito forte").
- **Cards em VIDRO COM AURA** (modelo 2 escolhido pelo Victor, 21/11/2026, fim de `theme-claro.css`): vidro fosco, filete de
  luz no topo e brilho azul saindo do canto de baixo à direita. Cantoneiras em "L" e quadriculado foram RECUSADOS (não voltar).
  Blocos azuis (sobre, números): vidro escuro, texto branco; claros (serviços, cases, perguntas): vidro claro. Serviços mantêm
  o aro triplo; `card--cta`/`project--cta` ficam como eram. Alternativas mostradas: borda de luz girando (1), filete no topo (3).
  Borda dos cards 3px (3x mais grossa, mesma cor); números do bloco azul em BRANCO sólido (o span tinha degradê marinho).
- **Card "Fale com o Victor"** (21/11/2026): modelo 2 holográfico (borda em degradê azul girando, brilho atravessando a cada 4 s,
  nome/botão em degradê marinho, linha "Respondo pelo WhatsApp") com a FOTO GRANDE do modelo 3 (lateral, dissolvendo no card).
- Robô no celular: sempre que a página VOLTA AO TOPO, ele retorna ao lugar em frente a "movem" (larga o esconderijo).
- **Espaçamento no celular** (21/11/2026): temas encostados, ~10px entre os textos; só os CASES têm distância maior do bloco azul (88px).
- **Imagem do link compartilhado** (`public/og-image.jpg`, 21/11/2026): modelo 4 — fundo azul-marinho, logo original, frase do topo e FOTO do Victor à direita com selo "Fale com o Victor →". Ao trocar, subir o `?v=` em `layout.tsx`.
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
- **Robô no computador (páginas, 23/11/2026)**: NÃO segue mais a rolagem. A cada troca (`mafra:pagina`, avisado por
  `paginas.ts`) ele escolhe um lugar LIVRE na página que está chegando (vagas laterais alternadas, `VAGAS`) e voa até lá
  com uma MOLA amortecida (arco para cima quando vai longe; inclina na direção do voo). Não fala enquanto voa.
  Orbe 10% menor no computador (133 px). Celular: tudo como antes. Victor aprovou o robô assim ("ficou ótimo, pode manter").
  A área de desenho do Orbe é 1,5x o quadro dele (`.drone__orb > div`, câmera fov 54,6°): o ARO girando não é cortado.
  A LUZ (`.drone__beam`) mora DENTRO de `.drone__float` (flutua, inclina e desvia junto) e nasce na PONTINHA de baixo
  (computador top 104px, celular 76px; centro 66,5px / 46px).
- **Faixa gigante (Perguntas)**: UMA linha — "processos ✦ gestão ✦ tecnologia ✦" + no fim o trecho VAZADO
  (`.bt-vazado`), repetido 4x para o letreiro nunca ficar vazio (23/11/2026).
- **Malha de pontos no computador (páginas)**: dança pela tela inteira sozinha (caminho em "oito", ~40 s), sem depender
  da rolagem; a cada troca de página gira mais rápido por um instante. Celular: paradas pela rolagem, como antes.
- **Barra do topo justa na logo** (23/11/2026): só 3px acima e 3px abaixo da logo (computador e celular).
- **Telas do celular 3D** (23/11/2026): cada tela é ampliada com `zoom` até o conteúdo ocupar o espaço útil (`ajustarTelas`).
- Botões verdes: flash claro passando da esquerda para a direita a cada 3 s (`verde-varre`).

## Pendências conhecidas

- E-mail profissional: o Victor vai criar; quando existir, entra no Contato (e-mail como 2º canal além do WhatsApp).
- Contato e links (WhatsApp, Instagram, LinkedIn) moram em `src/lib/contato.ts`.

## Vercel: versão oficial presa

Se o "Visit" abrir uma publicação antiga com o `main` atualizado, a troca automática
da versão oficial foi desligada (rollback/promote manual). Só o Victor resolve no painel:
Overview → aviso de auto-assign desligado → reativar/promover a publicação mais nova.
