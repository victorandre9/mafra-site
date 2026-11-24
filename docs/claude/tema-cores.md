# Tema de cores (18/11/2026)

(Parte das notas do site — índice em `CLAUDE.md`.)

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

