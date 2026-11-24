# Topo (hero): vídeo, títulos, selo, card "Fale com o Victor", faixa

(Parte das notas do site — índice em `CLAUDE.md`.)

- Selo do topo ("Processos mais inteligentes…"): card com a COR DOS BALÕES do robô (vidro verde), letra branca, cantos de 12px, texto centralizado (`.hero .pill`).
- **Topo com VÍDEO** (20/11/2026, gerado no Runway Gen-4.5 pela API e ampliado para 2K no Magnific (217 créditos); computador `topo-hd.mp4` 1080p, celular `topo.mp4` 720p — chave salva no ambiente `mafra-site`):
  `public/video/topo.mp4` em LOOP atrás do topo (mudo + play forçados pelo código; recarrega se o Safari congelar ao voltar do
  app; vigia a cada 1 s). Celular: faixa de vídeo NÍTIDA no alto (42svh desde 23/11/2026; era 48 — texto começava quase no meio da tela) com o vídeo em ZOOM OUT: largura inteira 16:9 encostada no fim da faixa, topo dissolvendo no fundo (Victor: cubos muito grandes) e texto abaixo. Com o vídeo na tela, malha 3D e setas somem.
- Topo: lista "/ Diagnóstico & processos…" e cartão de vidro **"Fale com o Victor"** (foto, abre o WhatsApp) na MESMA linha
  dos dois botões; os dois botões do topo fazem o VOO do robô (Método 4 s, Contato 7 s).
- **"que movem." do título em NEGRITO** (23/11/2026, Victor: "muito fraquinho", mesma cor): contorno 2,6px e peso 800 no computador; no celular contorno 2,2px e peso 700 (o 800 quebrava "movem").
- iPhone em economia de bateria (vídeo bloqueado): esconde o vídeo e o botão de play, fica a imagem parada (`.video-bloqueado`).
- Malha de pontos/setas: somem só com o topo quase inteiro na tela (`com-video` termina em `bottom 85%`); o vídeo usa `video-na-tela`.
- **Card "Fale com o Victor"** (21/11/2026): modelo 2 holográfico (borda em degradê azul girando, brilho atravessando a cada 4 s,
  nome/botão em degradê marinho, linha "Respondo pelo WhatsApp") com a FOTO GRANDE do modelo 3 (lateral, dissolvendo no card).
- **Faixa do topo (computador, páginas)**: nítida — sem `scale(1.05)`, sem `will-change`, sem halo de sombra, peso 600,
  sem o "entortar" pela velocidade da rolagem (só no celular). Mesmo tamanho (Victor não quer maior).
- **Barra do topo justa na logo** (23/11/2026): só 3px acima e 3px abaixo da logo (computador e celular).
- Lista do topo ("/ Diagnóstico & processos…"): +2px e negrito; texto do topo ("Entendo a rotina…") +1px e negrito; menu do topo em negrito (monitor pequeno). Bloco de texto do topo 160px mais à esquerda no computador (`translate`, o vídeo NÃO muda).
