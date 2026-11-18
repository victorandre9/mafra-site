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
- **Verifica foi criado para a Bel Log Transportes e a Bel Log Armazém** (empresas da família do Victor;
  "Bel Log" separado). Pode citar os nomes (autorizado em 18/11/2026).
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

- **No ar desde 18/11/2026 (tarde): tema VERDE** (o Victor testou o azul e pediu o verde de volta).
  O azul usava o **azul-marinho da logo** (`#001836`) subindo na escala; o botão do **WhatsApp** é sempre verde (marca dele).
- A troca para o azul foi feita mudando o matiz de todas as cores verdes (CSS, robô 3D, malha, celular);
  script de referência: só os verdes com matiz 80°–175° viram azul 213°.
- **Os dois temas estão salvos no GitHub** (pedido do Victor), cada um com todas as melhorias até 18/11/2026:
  branch `tema-azul` e branch `tema-verde` (o que está no ar). A cor NÃO é trocável pelo visitante.
  Para trocar de tema: aplicar no `main` a diferença de cores do branch do outro tema (CSS, `Background3D.tsx`,
  `Phone.tsx`, `robo/ModelosPerola.tsx`, `page.tsx` e a foto `public/sobre/`), mantendo o que mudou depois.
- Botões: **arredondados** (cantos suaves de 8px foram testados e recusados).

## Robô (Orbe) no celular

- Nunca em cima do texto nem do **celular 3D** (seção "Metodologia de trabalho", a que trava a tela).
  O esconderijo é guardado em coordenada de TELA; sem lugar 100% livre, ele vai para o ponto que menos
  cobre texto, com o celular pesando 4x (`custo` em `Experience.tsx`).
  Enquanto o celular 3D está na tela, o Orbe fica numa VAGA FIXA na lateral dele (lado escolhido na entrada, não troca).
- O Orbe NUNCA sai da tela (trava `travar`, a cada quadro).
- Selo do topo ("Processos mais inteligentes…"): card com a COR DOS BALÕES do robô (vidro verde), letra branca, cantos de 12px, texto centralizado (`.hero .pill`).

- **Voo do menu (computador)**: clicar em Serviços/Método/Cases/Sobre/Contato escurece a tela, a luz do
  robô cresce (brilho, largura e comprimento do facho) e ele desce até o tema em 3 s, 4 s, 5 s, 6 s, 7 s;
  a rolagem é nossa, quadro a quadro (o scrollTo do Lenis pulava direto no PC do Victor); o robô desce em
  linha reta e estaciona POR CIMA do título, com a lanterna em cima dele; a tela volta ao normal (`mafra:voo`).
- Botões verdes: flash claro passando da esquerda para a direita a cada 3 s (`verde-varre`).

## Pendências conhecidas

- E-mail profissional: o Victor vai criar; quando existir, entra no Contato (e-mail como 2º canal além do WhatsApp).
- Contato e links (WhatsApp, Instagram, LinkedIn) moram em `src/lib/contato.ts`.

## Vercel: versão oficial presa

Se o "Visit" abrir uma publicação antiga com o `main` atualizado, a troca automática
da versão oficial foi desligada (rollback/promote manual). Só o Victor resolve no painel:
Overview → aviso de auto-assign desligado → reativar/promover a publicação mais nova.
