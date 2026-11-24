# Robô (Orbe): celular e computador

(Parte das notas do site — índice em `CLAUDE.md`.)

- Nunca em cima do texto nem do **celular 3D** (seção "Metodologia de trabalho", a que trava a tela).
  O esconderijo é guardado em coordenada de TELA; sem lugar 100% livre, ele vai para o ponto que menos
  cobre texto, com o celular pesando 4x (`custo` em `Experience.tsx`).
  Enquanto o celular 3D está na tela, o Orbe ESTACIONA ABAIXO DO CELULAR (21/11/2026, um pouco à esquerda do centro, balões
  abrem ao lado dele; o balão também desvia do celular). Sem espaço embaixo (tela baixa), volta para a VAGA FIXA na lateral.
- O Orbe NUNCA sai da tela (trava `travar`, a cada quadro).
- **Voo do menu (computador E celular — no celular pelo menu ☰)**: clicar em Serviços/Método/Cases/Sobre/Contato escurece a tela, a luz do
  robô cresce (brilho, largura e comprimento do facho) e ele desce até o tema em 3 s, 4 s, 5 s, 6 s, 7 s;
  a rolagem é nossa, quadro a quadro (o scrollTo do Lenis pulava direto no PC do Victor); o robô desce em
  linha reta e estaciona POR CIMA do título, com a lanterna em cima dele; a tela volta ao normal (`mafra:voo`).
- **Falas do Orbe**: só com a tela PARADA (rolou → o balão some na hora) e uma a cada 10 s, de começo a começo
  (1 minuto parado = 6 falas). Continua valendo a regra de ouro: só fala se houver lugar sem cobrir texto.
- Robô: obstáculos incluem CARDS inteiros; cobrindo texto/botão/card > 12% fica translúcido (0,28) no computador e no celular.
- Robô no celular nasce na PARTE BRANCA, EM FRENTE à palavra "movem" (centro da última linha do título, canto direito; vão livre medido pelo layout; sem vão, cai no vídeo); fica parado ali até a 1ª rolagem. Saudação "Clique aqui! 👆" em balão compacto de 2 linhas, só se couber sem cobrir texto.
- Robô no celular: sempre que a página VOLTA AO TOPO, ele retorna ao lugar em frente a "movem" (larga o esconderijo).
- **Robô no computador (páginas, 23/11/2026)**: NÃO segue mais a rolagem. A cada troca (`mafra:pagina`, avisado por
  `paginas.ts`) ele escolhe um lugar LIVRE na página que está chegando (vagas laterais alternadas, `VAGAS`) e voa até lá
  com uma MOLA amortecida (arco para cima quando vai longe; inclina na direção do voo). Não fala enquanto voa.
  Orbe 10% menor no computador (133 px). Celular: tudo como antes. Victor aprovou o robô assim ("ficou ótimo, pode manter").
  A área de desenho do Orbe é 1,5x o quadro dele (`.drone__orb > div`, câmera fov 54,6°): o ARO girando não é cortado.
  A LUZ (`.drone__beam`) mora DENTRO de `.drone__float` (flutua, inclina e desvia junto) e nasce na PONTINHA de baixo
  (computador top 104px, celular 76px; centro 66,5px / 46px).
