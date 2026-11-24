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

## Notas por ASSUNTO (leia SÓ o arquivo do assunto da tarefa)

As notas detalhadas ficam em `docs/claude/`, um arquivo por bloco do site. Antes de mexer num assunto, leia o arquivo
dele (e só ele). Ao decidir algo novo, registre no arquivo do assunto — não aqui.

| Assunto | Arquivo | Código principal |
|---|---|---|
| Cores, tema azul/verde, regra do `tema-verde` | `docs/claude/tema-cores.md` | `theme-claro.css` |
| Topo: vídeo, título, selo, card "Fale com o Victor", faixa | `docs/claude/topo.md` | `page.tsx`, `theme-claro.css` |
| Abertura "PORTAL" | `docs/claude/abertura.md` | `Abertura.tsx`, `Experience.tsx`, `abertura.ts` |
| Robô (Orbe) | `docs/claude/robo.md` | `Experience.tsx`, `Drone*.tsx` |
| Computador em páginas, mapa/setas, Serviços | `docs/claude/paginas.md` | `src/lib/paginas.ts` |
| Cards (lupa, bolha), Cases, Perguntas | `docs/claude/cards-lupa-perguntas.md` | `src/lib/bolha.ts`, `faqFoco.ts` |
| Visual geral (blocos, vidro, fundo, malha, mouse, contato) | `docs/claude/visual.md` | `theme-claro.css`, `Background3D.tsx` |
| Metodologia (celular 3D) e ajustes do celular | `docs/claude/metodologia-celular.md` | `Phone.tsx`, `Experience.tsx` |

**Regra de cor do dia a dia:** toda atualização vai também para o `tema-verde` (detalhes em `tema-cores.md`).

**Economia de publicações (Vercel, plano gratuito tem limite diário):** `vercel.json` → `ignoreCommand` NÃO publica
os branches `tema-azul`/`tema-verde` (são só cópia de segurança) nem mudanças só em `CLAUDE.md`/`docs/`.

## Mapa do código (Graphify)

Antes de abrir arquivos para achar onde algo mora, consulte o mapa (montado sem custo de tokens no início da sessão):
`graphify query "assunto"`, `graphify explain "Função"` ou `graphify-out/GRAPH_REPORT.md`. Depois de mudar código: `graphify update .`

## Pendências conhecidas

- E-mail profissional: o Victor vai criar; quando existir, entra no Contato (e-mail como 2º canal além do WhatsApp).
- Contato e links (WhatsApp, Instagram, LinkedIn) moram em `src/lib/contato.ts`.

## Vercel: versão oficial presa

Se o "Visit" abrir uma publicação antiga com o `main` atualizado, a troca automática
da versão oficial foi desligada (rollback/promote manual). Só o Victor resolve no painel:
Overview → aviso de auto-assign desligado → reativar/promover a publicação mais nova.
