# Cards de Serviços/Cases (lupa e bolha), Cases, Perguntas

(Parte das notas do site — índice em `CLAUDE.md`.)

- **Cases em DOIS GRUPOS** (19/11/2026, `GRUPOS_CASES` em `page.tsx`):
  **Soluções empresariais** (3 lado a lado no computador): Verifica, **Vetra Sales** (`public/cases/vetra-sales-card.webp`),
  **Polar OS** (`public/cases/polar-os-card.webp`); **Aplicativos e produtos digitais** (2): Vo$ e iFluxo.
  Card final "A solução da sua empresa" fica fora dos grupos, em largura total. Tablet: 2 colunas (o 3º card empresarial
  ocupa a fileira); celular: 1. Vetra Sales é o nome de divulgação de um protótipo de vendas externas:
  NUNCA ligá-lo a cliente nenhum no site; "Na sua empresa" aprovado pelo Victor em 19/11/2026.
- Cases empresariais: as TRÊS placas de logo (Verifica em código; Vetra/Polar recortadas das imagens originais em
  `public/cases/*-placa.webp`) com o MESMO tamanho e proporção 3,7:1, teto 320px, no mesmo fundo azul-escuro do Verifica.
- **Faixa gigante (Perguntas)**: UMA linha — "processos ✦ gestão ✦ tecnologia ✦" + no fim o trecho VAZADO
  (`.bt-vazado`), repetido 4x para o letreiro nunca ficar vazio (23/11/2026).
- **Cards de Serviços e Cases** (23/11/2026, Victor: monitor de 15,6" não dava para ler; `src/lib/bolha.ts`, só computador):
  1) PASSAR O MOUSE = LUPA 3D que segue o mouse e AMPLIA (2,2x) só o texto embaixo dela; o card NÃO sai do lugar
  ("não quero que o menu venha para frente"). Modelo 2 escolhido pelo Victor (aro azul-ciano aceso, cabo cromado),
  renderizado em 3D com three.js: `/public/lupa-moldura.webp` — HOJE é o MODELO 3, BOLHA sem cabo (borda furta-cor, centro
  transparente; 181×181, centro 90,65, lente de 170px). O modelo 2 com cabo foi trocado ("não está muito bom") — e
  `/public/lupa-cursor.png` (ícone do cursor nas Perguntas e na dica). Dentro da lente vai uma cópia do card na MESMA
  estrutura de classes (inclusive um `#cases` temporário), com o MESMO `zoom` da página e a MESMA largura e ALTURA do card:
  as linhas quebram iguais e a lente nunca passa do fim da cópia. O centro da lente fica preso dentro do card (com mouse
  rápido o atraso deixava a lente fora e ela ficava BRANCA).
  VIGIA: a cada movimento do mouse (em qualquer lugar) confere se ainda está no card da lupa; senão ela some — o navegador
  às vezes não avisa a saída rápida e a lente branca ficava TRAVADA na tela. Some também ao sair da janela, trocar de página
  (`mafra:pagina`), tecla ou rodinha. Causa real da lente presa: entrar e sair rápido deixava a animação de APARECER brigando com a de SUMIR (a de
  aparecer terminava por último) → `esconderLupa` mata as animações antes (`killTweensOf` + `overwrite`), e o vigia força
  opacidade 0 se não houver card sob o mouse.
  2) CLIQUE = a cópia sai do card e vem ao centro como GELATINA: cresce em 8 balanços (achata/estica, cada vez menos)
  até abrir; aro furta-cor de bolha de sabão e reflexo; fundo claro desfocado; fecha (×, fora, Esc) voltando ao card.
  RECUSADOS: gota azul ("cubo de gelo"), fundo azul-escuro, abrir sozinho ao passar o mouse (trazia o card para frente).
  O card aberto rola com o mouse por dentro (`data-lenis-prevent`); cursor normal com ele aberto.
- **Perguntas em FOCO** (23/11/2026, `src/lib/faqFoco.ts`): sanfona (abriu uma, fecha as outras). No computador a resposta
  NÃO abre na lista (a página mudava de altura e o encaixe encolhia/crescia tudo): o clique abre um painel em tela cheia —
  círculo escuro nasce do ponto do clique, pergunta sobe palavra por palavra, resposta acende, luz passa; ← → navegam.
  `html.bolha-aberta` segura a troca de páginas enquanto bolha/foco estão abertos.
