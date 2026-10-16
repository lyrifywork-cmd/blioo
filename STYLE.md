# Blioo — Guia de Estilo

> **Regra única:** qualquer tela, componente, landing, e-mail ou asset novo do Blioo **deve** seguir este documento. A fonte da verdade dos tokens é o bloco `:root` de `index.html`. Em caso de conflito, prevalece `index.html`.

---

## 1. Essência da marca

- **Produto:** Blioo — "link na bio". Uma página com a identidade do usuário reunindo projetos, redes e conteúdo em um endereço (`bli.oo/seunome`).
- **Sensação:** calmo, quente, editorial, confiante. Verde profundo + lima ácido, superfícies claras, cantos muito arredondados, tipografia grande e apertada.
- **Princípios:**
  1. **Uma ideia por tela.** Poucos elementos, muito espaço em branco.
  2. **Hierarquia por tamanho, não por cor.** Títulos display enormes lideram; cor é acento, nunca decoração.
  3. **Tudo em pílula.** Botões, tags, links do hero, header: raio 99px.
  4. **Mobile-first na entrega, desktop no refinamento.** Conferir sempre ≤960px, ≤900px, ≤560px.
  5. **Movimento que respeita.** Animações curtas, sutis, e desligadas com `prefers-reduced-motion`.
  6. **Português do Brasil sempre.** `lang="pt-BR"`, tom direto e sem exclamações.

---

## 2. Tokens de cor

Copiar exatamente. Definir em `:root` e repetir nos blocos de dark (ver §3).

```css
:root{
  --bg:#F4F5EF;            /* fundo da página — off-white esverdeado */
  --surface:#FFFFFF;       /* cartões, pills, faixa */
  --surface-2:#EAECE3;     /* fundo secundário, chips, ícones */
  --ink:#0C1210;           /* texto principal */
  --ink-2:#56605A;         /* texto secundário / lede */
  --line:rgba(12,18,16,.1);/* bordas de 1px */
  --brand:#0E5E49;         /* verde profundo — cor da marca */
  --brand-2:#0A4A39;       /* hover do verde */
  --on-brand:#F4F5EF;      /* texto sobre verde */
  --lime:#C8F53A;          /* lima ácido — acento */
  --on-lime:#0C1210;       /* texto sobre lima */
  --glass:rgba(255,255,255,.72); /* vidro do header */
  --shadow:0 10px 30px -12px rgba(12,18,16,.25);
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --bg:#0A0E0C; --surface:#121916; --surface-2:#18211D;
    --ink:#EEF1EA; --ink-2:#97A39C; --line:rgba(238,241,234,.1);
    --brand:#C8F53A; --brand-2:#D9FF6B; --on-brand:#0C1210;
    --glass:rgba(18,25,22,.72); --shadow:0 10px 30px -12px rgba(0,0,0,.7);
    color-scheme:dark;
  }
}
:root[data-theme="dark"]{ /* mesmo bloco do dark, para toggle manual */
  --bg:#0A0E0C; --surface:#121916; --surface-2:#18211D;
  --ink:#EEF1EA; --ink-2:#97A39C; --line:rgba(238,241,234,.1);
  --brand:#C8F53A; --brand-2:#D9FF6B; --on-brand:#0C1210;
  --glass:rgba(18,25,22,.72); --shadow:0 10px 30px -12px rgba(0,0,0,.7);
  color-scheme:dark;
}
```

### Uso correto

| Situação | Token |
|---|---|
| Fundo da página | `--bg` |
| Cartões, header, FAQ, steps | `--surface` |
| Chips, ícones, estados neutros | `--surface-2` |
| Corpo de texto | `--ink` |
| Texto de apoio / lede | `--ink-2` |
| Borda de qualquer superfície | `--line` (sempre 1px) |
| CTA principal, marca, links fortes | `--brand` |
| Destaque pontual (tag, marcador, eyebrow no dark) | `--lime` |
| Caixa final invertida | `--ink` com texto `--bg` |
| Contraste sobre verde ou lima | `--on-brand` / `--on-lime` |

### Destaques fixos (não tokenizar)

- Lima no dark continua `#C8F53A` (o `--brand` é que vira lima).
- Tela do telefone no hero: `linear-gradient(170deg,#12503F,#0A2A22)`, texto `#EEF1EA`.
- Tema t3 (Profissional): fundo `#15131C`, texto `#F1EEF7`, acento `#B9A6FF`.
- Glow do hero: `radial-gradient(closest-side, color-mix(in srgb, var(--lime) 55%, transparent), transparent)`.

> **Proibido:** introduzir nova cor sem passar por aqui. Nada de gradientes arco-íris, nada de sombra colorida, nada de preto puro `#000` ou branco puro `#FFF` em superfícies.

---

## 3. Dark mode

- Obrigatório em tudo: `@media (prefers-color-scheme:dark)` **e** o override `:root[data-theme="dark"]` (toggle manual).
- Sempre acompanhar de `color-scheme:dark`.
- No dark, `--brand` vira lima — portanto elementos que usam `--brand` como acento (eyebrow, ponto do logo, `✦` do marquee, links) ganham automaticamente o tom ácido. Não force cor nesses elementos; use `var(--brand)`.
- `<meta name="theme-color">` duplicado: `#F4F5EF` (light) / `#0A0E0C` (dark).

---

## 4. Tipografia

```css
--f-d:"Bricolage Grotesque",system-ui,sans-serif;              /* display */
--f-t:"Inter",system-ui,-apple-system,"Segoe UI",sans-serif;   /* texto */
```

- Carregar via Google Fonts com `preconnect` + `display=swap`:
  `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600&display=swap`
- **Display:** apenas `h1/h2/h3`, logo, números dos passos, marquee, avatar. Sempre `font-weight:800`, `letter-spacing:-.035em`, `line-height:1.02`. Nunca itálico.
- **Texto:** todo o resto. Pesos 400 (corpo), 500 (nav/links), 600 (botões/labels).

### Escala

| Elemento | Tamanho | Peso | Cor |
|---|---|---|---|
| `h1` | `clamp(44px,7.6vw,96px)` | 800 | `--ink` |
| `h2` de seção | `clamp(34px,5vw,60px)`, `max-width:16ch` | 800 | `--ink` |
| `h3` de card | `clamp(22px,2.2vw,28px)`, `letter-spacing:-.025em` | 800 | `--ink` |
| Lede | `clamp(17px,1.7vw,20px)`, `max-width:46ch` | 400 | `--ink-2` |
| Eyebrow | `13px` / `600` / `uppercase` / `letter-spacing:.12em` | 600 | `--brand` |
| Corpo | `17px` / `1.6` | 400 | `--ink` |
| Texto de card / apoio | `15px` | 400 | `--ink-2` |
| Nav / links miúdos | `14.5px` | 500 | `--ink-2` |
| Rodapé | `13.5–15px` | 400 | `--ink-2` |

### Destaque no título

```css
h1 em{font-style:normal;background:var(--lime);color:var(--on-lime);
  padding:0 .12em;border-radius:.18em;
  box-decoration-break:clone;-webkit-box-decoration-break:clone}
```

---

## 5. Forma, espaço e elevação

```css
--r:22px;   /* raio padrão de cartão */
--ease:cubic-bezier(.22,.61,.36,1);
```

| Uso | Raio |
|---|---|
| Botões, tags, chips, nav, badges | `99px` |
| Cartões (bento, steps, themes) | `22px` |
| FAQ | `18px` |
| Ícone quadrado | `14px` |
| Sheet mobile | `26px` |
| Caixa final | `clamp(26px,4vw,44px)` |
| Mockup de telefone | `44px` (tela `34px`) |

- **Largura de conteúdo:** `.wrap{width:min(1160px,calc(100% - 40px));margin-inline:auto}`.
- **Respiro de seção:** `padding:clamp(64px,8vw,112px) 0`. Seções Sequênciais usam `style="padding-top:0"` na segunda em diante.
- **Grelhas:** sempre `gap:16px` (não 12, não 24).
- **Hero:** `padding:clamp(130px,15vw,190px) 0 clamp(56px,7vw,100px)`; grid `1.1fr .9fr`, `gap:clamp(32px,5vw,72px)`.
- **Sombra:** apenas `var(--shadow)` ou a do telefone `0 40px 80px -30px rgba(12,18,16,.55)`. Nada de sombra em card estático — só no `:hover`.
- **Bordas:** `1px solid var(--line)` em todas as superfícies elevadas.

---

## 6. Componentes canônicos

### 6.1 Botões

```css
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;
  font:600 15px/1 var(--f-t);padding:15px 24px;border-radius:99px;
  border:1px solid transparent;text-decoration:none;cursor:pointer;
  transition:transform .2s var(--ease),background-color .2s var(--ease),box-shadow .2s var(--ease)}
.btn:hover{transform:translateY(-2px)}
.btn-main{background:var(--brand);color:var(--on-brand)}
.btn-main:hover{background:var(--brand-2)}
.btn-lime{background:var(--lime);color:var(--on-lime)}
.btn-ghost{background:var(--surface);color:var(--ink);border-color:var(--line)}
```

- CTAs primários levam seta no texto: `Criar minha página →`.
- Dentro do header: `padding:13px 20px;font-size:14px` + `box-shadow:var(--shadow)`.
- Na caixa final (fundo `--ink`): `.btn-main` inverte para lima (`.final .btn-main{background:var(--lime);color:var(--on-lime)}`) e `.btn-ghost` fica transparente com borda `rgba(255,255,255,.3)`.

### 6.2 Header flutuante

Peças separadas em pílulas de vidro, nunca uma barra sólida:

```css
.hdr{position:fixed;z-index:50;left:0;right:0;top:calc(14px + env(safe-area-inset-top,0px));pointer-events:none}
.pill{pointer-events:auto;display:flex;align-items:center;background:var(--glass);
  backdrop-filter:blur(16px) saturate(1.4);-webkit-backdrop-filter:blur(16px) saturate(1.4);
  border:1px solid var(--line);border-radius:99px;box-shadow:var(--shadow)}
```

- Logo: `font:800 24px var(--f-d);letter-spacing:-.04em` com o ponto final em `--brand` (lima no dark): `blioo<i>.</i>`.
- Nav: links `14.5px/500`, `padding:9px 16px`, raio 99px; item ativo (`[aria-current]`) recebe `background:var(--ink);color:var(--bg)`.
- **Mobile (≤960px):** nav e `btn-ghost` somem, entra `.menu-btn` e o `.sheet` (vidro `blur(20px)`, raio `26px`, links com `padding:14px 16px`).

### 6.3 Badges, chips e tags

- `.badge` — pílula `--surface` + borda, `13.5px/500`, com bolinha `8px` em `--brand` e anel `box-shadow:0 0 0 4px color-mix(in srgb,var(--brand) 22%,transparent)`.
- `.tag` — pílula lima (`12px/600`); variante `.tag.soon` usa `--surface-2` + `--ink-2` para "em breve".
- `.chip` — pílula `--surface-2`, `14px/600`, trecho destacado em `<u>` com `--brand`.

### 6.4 Bento de recursos

- Grid de 6 colunas; `.cell{grid-column:span 2}`, `.cell.w{span 3}`, `.cell.big{span 4}` com `background:var(--brand);color:var(--on-brand);border-color:var(--brand)`.
- `min-height:210px;padding:28px;gap:36px;justify-content:space-between`.
- Hover: `transform:translateY(-4px);box-shadow:var(--shadow)` em `.25s var(--ease)`.
- `.ico`: quadrado `44px`, raio `14px`, fundo `--surface-2`, glifo texto (não usar biblioteca de ícones).
- Em ≤900px vira 2 colunas; em ≤560px, 1 coluna.

### 6.5 Passos, temas e FAQ

- **Steps:** 3 colunas de cartões `--surface`; `.n` é círculo `48px` `--ink`/`--bg` com número em display 800. ≤860px → 1 coluna.
- **Themes:** 3 colunas, `min-height:300px`, pré-visualização `.mini` com 3 barras `99px` (a primeira sempre lima). Fundos: `--surface` / gradiente verde / `#15131C`.
- **FAQ:** `<details class="qa">` nativo, raio `18px`, `summary` com `::after` `"+"` em círculo `32px` `--surface-2` que gira 45° e fica lima quando `[open]`. Parágrafo `max-width:62ch`.

### 6.6 Marquee e caixa final

- **Marquee:** `.strip` com `border-block:1px solid var(--line)`, fundo `--surface`; `.track` em display `700 clamp(20px,2.6vw,30px)`, `letter-spacing:-.02em`, `animation:slide 32s linear infinite` (conteúdo duplicado), separador `✦` em `--brand`. Sempre `aria-hidden="true"`.
- **Caixa final:** `background:var(--ink);color:var(--bg);border-radius:clamp(26px,4vw,44px);padding:clamp(44px,7vw,96px) clamp(24px,5vw,72px);overflow:hidden` + círculo lima `420px` borrado no canto inferior direito via `::after`.

### 6.7 Preços

- `.plans` em grid de 3 colunas, `gap:16px`; ≤860px vira 1 coluna.
- `.plan`: cartão `--surface` + borda + `--r`, `padding:28px`, flex column com `gap:24px`, hover `translateY(-4px)`.
- Plano em destaque (`.plan.feat`): fundo `--ink` e texto `--bg` (espelhando a caixa final — **nunca** `--brand`, que no dark vira lima e quebraria os botões lima). Acentos em lima: `✓`, `.tag`, `.btn-main` (`background:var(--lime);color:var(--on-lime)`), ghost com borda `rgba(255,255,255,.3)`.
- `.price` com valor em display `800 clamp(38px,4.2vw,52px)` + período em `14px` `--ink-2`; no card invertido, `opacity:.7`.
- `.feats`: lista sem marcador, `✓` em `--brand` (lima no card invertido); item futuro `.soon` em `--ink-2` com `<em>` em pílula `--surface-2` ("em breve").
- CTA alinhado na base (`margin-top:auto`); plano sem ação usa `.tag.soon` no lugar do botão.

### 6.8 Documentos legais

- Cabeçalho enxuto nas páginas legais: marca + `.pill.back` ("Voltar"), que funciona em qualquer largura (diferente de `.acts .btn-ghost`, escondido ≤960px).
- `.legal` na `<section class="sec">` adiciona `padding-top:clamp(120px,14vw,170px)` para livrar o header flutuante.
- `.doc` (máx. 760px) com `.doc-block` por seção numerada; `h2` do documento usa escala própria (`clamp(23px,2.6vw,30px)`, sem o limite de 16ch do `.sec h2`).
- Corpo `16.5px/1.65`, listas com marcador em `--brand`, links em `--brand` sublinhados; `.doc-callout` (cartão `--surface`) para o bloco de contato.
- Itens do rodapé que ainda não existem ficam como `<span>`; quando a página existe, viram `<a>` (como Privacidade/Termos).

### 6.9 Telas de conta (entrar / criar conta)

- Cabeçalho enxuto igual ao das páginas legais: marca + `.pill.back` ("Voltar").
- `.auth-grid` split `1.05fr .95fr` (introdução à esquerda, `.auth-card` à direita); ≤900px vira coluna única com o cartão limitado a 520px.
- `.auth-card`: cartão `--surface` + borda + `--shadow`, raio `clamp(22px,3vw,30px)`, `display:grid;gap:20px`.
- `.tabs`: controle segmentado (`--surface-2` de fundo, pílula ativa em `--surface` + sombra) ligando `entrar.html` ↔ `criar-conta.html`; estado ativo com `aria-current="page"`.
- `.field` (grid, `gap:8px`): `label` 14px/600, input `padding:14px 16px`, raio 14px, fundo `--bg`, borda `--line` → `--brand` no focus; `.hint` 13px `--ink-2`.
- `.prefix-box` para o identificador: `blioo.app/` em `--ink-2` colado ao input, `:focus-within` na borda.
- `.check` com `accent-color:var(--brand)`; `.auth-card .btn` sempre full-width; `.or` como divisor com linhas em `--line`; `.auth-alt` e `.auth-note` centralizados em 14.5px/13.5px.
- Ação indisponível não é link: vira `<span class="btn … is-soon" aria-disabled="true">` (`opacity:.55`, sem hover) dentro de `.oauth`, com `.tag.soon` "Em breve" — mesmo tratamento do bento e do plano Estúdio. É o caso do "Continuar com o Google".
- Formulários estáticos: `novalidate`, labels com `for`, `autocomplete` correto (`email`, `current-password`, `new-password`, `username`), `aria-describedby` nas dicas e `pattern`/`minlength` no identificador e senha.

### 6.10 Onboarding

- `onboarding.html` carrega `<script type="module" src="js/onboarding.js"></script>`; o módulo exporta `initOnboarding()` e reutiliza `initCopy` de `js/copy.js` no passo final.
- `.onb-grid` split (`1.1fr .9fr`) com `.onb-aside` sticky (`top:calc(96px + safe-area)`); ≤900px vira coluna única com a pré-visualização primeiro (`order:-1`).
- Progresso: `.prog` com `<li data-state="current|done|pending">` e número em `--f-d`; estado atual em `--ink`, concluído com número em `--brand`.
- Passos: `.panel` + `.pane`; só o `.pane.active` aparece (escondido via `.js`, então sem JS todos os passos ficam visíveis e utilizáveis). `.onb-actions` só depois do JS.
- Pré-visualização reaproveita o mockup do hero (`.phone/.screen/.av/.lk`) e ganha variações por tema: `.screen--estudio` (`#0E5E49`) e `.screen--profissional` (`#15131C`, primeiro link `#B9A6FF`).
- Seletor de tema reaproveita `.themes/.theme` como `<label>` com radio escondido; seleção via `:has(input:checked)` com outline `--brand`. No label, `<b>`/`<small>` assumem os estilos de `h3`/`p`.
- Links: `.link-row` (texto + endereço + remover) gerado por JS com ids únicos e `label for` corretos.
- Deep link: `onboarding.html#passo-2` abre direto num passo (1–4).
- **Ordem do fluxo:** `criar-conta.html` → `onboarding.html` (3 passos) → `dashboard.html`. Ao publicar, o onboarding grava `localStorage['blioo.onboarding']='ok'`; o dashboard tem guard que redireciona para `onboarding.html` enquanto essa flag não existir (`entrar.html` aponta para o dashboard, que aplica o mesmo guard).
- Fluxo: `criar-conta.html` (submit) → `onboarding.html`.

### 6.11 Dashboard (6 páginas separadas, troca instantânea)

- App shell dividido em um HTML por seção — `dashboard.html` (visão geral), `links.html`, `aparencia.html`, `metricas.html`, `dominio.html`, `configuracoes.html` — com o mesmo `<head>`, header do app (marca + "Ver minha página" + `.dash-avatar`) e `.dash-nav` (cada página marca o seu `aria-current="page"` estaticamente, sem JS).
- **Navegação instantânea (`js/shell.js`):** todas as páginas carregam o shell, que intercepta cliques no `.dash-nav` ( respeitando Ctrl/Cmd+clique), busca o HTML, troca só o `<main>`, atualiza título/URL (`pushState`), move o foco para o `h1` e monta o módulo da página via `import()` dinâmico. Botão voltar funciona (`popstate`). Sem JS ou se o fetch falhar, cai para navegação normal.
- **Módulos compartilhados:** `js/app.js` (guarda de acesso + identidade do cabeçalho), `js/store.js` (estado `blioo.onboarding.data`: `loadData`/`saveData`, validadores e `DEFAULT_DATA`), `js/preview.js` (`createPreview`/`paintPreview` — a mesma peça no onboarding e no painel).
- **Um módulo por página:** `js/dashboard.js` (visão geral: identidade, copiar, estatísticas), `js/links.js` (tudo da gestão de links), `js/aparencia.js` (radios + pré-visualização), `js/config.js` (identificador, e-mail, plano, sair, excluir). Métricas e Domínio são estáticas e carregam só `js/app.js`.
- Cada página carrega só o que usa; nenhuma lógica é duplicada entre páginas.
- Páginas do painel têm `<meta name="robots" content="noindex">`.
- `.dash-grid`: lateral `.dash-nav` (sticky, pílulas) + conteúdo; ≤900px vira coluna única com nav em linha.
- Cartões `.dcard` (`--surface` + borda + `--r`), números `.stat b` em display 800, `.dcard-row` para cartão com ação à direita.
- Links gerenciáveis: `.dlink` (grip `⠿`, texto com ellipsis, `.acts` com `.icon-btn`); toggle com `aria-pressed` (`●`/`○`) e estado `.off` (`opacity:.55`); edição inline `.dlink.editing` + `.editor` (labels com `for` gerados, **controles da linha escondidos no modo de edição** — `.dlink.editing > .grip/.acts{display:none}`); **reordenação real** com ↑/↓ (troca no DOM, foco mantido no botão, ordem salva); contador de ativos/desativados no cartão de estatísticas.
- Aparência reutiliza `.themes/.theme` (radios escondidos, `:has(input:checked)`) e a pré-visualização do onboarding (`.phone/.screen` + `.screen--estudo`/`.screen--profissional`).
- A página Links tem a própria pré-visualização ao lado (`.links-layout` + `.links-preview` sticky; em mobile, coluna única com a lista primeiro). Pré-visualização, contador, estado vazio e gravação rodam juntos em `sync()` (`js/links.js`) a cada mudança.
- Estado vazio: sem links, aparece `.dcard.empty` ("Nenhum link ainda") no lugar da lista.
- Recursos futuros (Métricas, Domínio): cartão `.dcard` + `.breve` com `<span class="btn … is-soon" aria-disabled="true">`, `.tag.soon` e link "Disponível no plano Pro →" para `index.html#precos` — nunca link morto.
- Todos os CTAs de plano apontam para `index.html#precos`; "Copiar link" reusa `data-copy` + `initCopy` de `js/copy.js`.
- **Estado compartilhado com o onboarding:** `localStorage['blioo.onboarding.data']` = `{handle, theme, links:[{label,url,active}]}`. O dashboard nasce desse estado (identificação, avatar, links, tema e pré-visualização) e toda alteração feita no painel (handle, links, tema, ativar/desativar) regrava a mesma chave — o onboarding também relê esses dados ao reabrir.

### 6.12 Fluxo de autenticação (logado × deslogado)

**Estado (tudo em `js/session.js`, única fonte de verdade):** `blioo.session` (existe = logado), `blioo.account` (conta), `blioo.onboarding` (`'ok'` = configuração concluída), `blioo.onboarding.data` (conteúdo da página, ver §6.11).

| Página | Deslogado | Logado sem onboarding | Logado + onboarding |
|---|---|---|---|
| `index.html` | Marketing normal, CTAs intactos | CTAs de conta → `onboarding.html` | CTAs de conta → `dashboard.html` |
| `entrar.html` / `criar-conta.html` (`js/auth.js`) | Formulário funciona; submit sem JS segue o `action` | Rebate para `onboarding.html` | Rebate para `dashboard.html` |
| `onboarding.html` | Redireciona para `criar-conta.html` | Livre | Livre (relê o estado salvo) |
| `app/dashboard.html` e demais páginas do painel | Redireciona para `entrar.html` | Redireciona para `onboarding.html` | Livre |

- Cadastro (`criar-conta`): grava conta + sessão + identificador no estado e leva a `onboarding.html`.
- Login (`entrar`): e-mail confere com a conta salva → sessão + destino certo; e-mail desconhecido → `.form-error` com `role="alert"`, sem navegar, oferecendo criar a conta.
- `criar-conta` e `entrar` carregam `js/auth.js`; a landing ajusta os CTAs via `js/account-links.js` (`initAccountLinks` no boot do `main.js`) — sempre no cliente, nunca no servidor.
- Sair (Configurações do painel) apaga só a sessão e volta à landing; "Excluir minha conta" (com `confirm`) apaga sessão, conta, onboarding e dados e volta à landing.

### 6.14 Página pública do usuário

- `pagina.html` é a página que o público vê (`blioo.app/seunome`) — página imersiva, sem header, sem footer, sem JS de guarda: qualquer pessoa pode abri-la.
- **Regra WYSIWYG:** é o espelho fiel da pré-visualização do onboarding/aparência. Mesma fonte de estado (`blioo.onboarding.data`), mesmo mapeamento de tema — essencial: gradiente `#12503F→#0A2A22`; estúdio: `#0E5E49`; profissional: `#15131C` (primeiro link `#B9A6FF`).
- Sem estado salvo, usa o fallback de demonstração (perfil Ana Solano, mesmos 4 links do dashboard).
- Links públicos são `<a class="plink">` reais (`target=_blank`, `rel=noopener`), só os ativos; primeiro link em destaque (lima, lilás no profissional), `hover` em `scale(1.02)`.
- Assinatura discreta: `.pill.feito` ("feito com blioo.") → `index.html`.
- `document.title` é atualizado para `<handle> — Blioo`.

### 6.15 Rodapé

**Só na landing (`index.html`).** Telas de conta, onboarding e documentos legais **não têm rodapé** — a navegação de volta é o `.pill.back` ("Voltar") do header.
`fgrid` (flex space-between, `border-bottom:1px solid var(--line)`) + `fcols` com `h4` `12px` uppercase `letter-spacing:.12em` em `--ink-2`, links `15px` `--ink-2` com hover `--ink`. Itens indisponíveis são `<span>` com `opacity:.55` (não links mortos).

---

## 7. Motion

- Duração padrão **0.2s** para micro-interações (botões, hover); **0.25s** para cards; **0.5–0.7s** para revelação de scroll e transformações maiores.
- Easing sempre `var(--ease)`. Transições apenas de `transform`, `background-color`, `box-shadow`, `opacity`.
- **Revelação:** só após `document.documentElement.classList.add('js')`:
  ```css
  .js .rv{opacity:0;transform:translateY(22px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
  .js .rv.in{opacity:1;transform:none}
  ```
  Aplicada via `IntersectionObserver` (`threshold:.12`) — observe cada `.rv`, adicione `.in` e `unobserve`.
- **Reduced motion é obrigatório:**
  ```css
  @media (prefers-reduced-motion:reduce){
    html{scroll-behavior:auto}
    *,*::before,*::after{animation:none!important;transition-duration:.01ms!important}
    .js .rv{opacity:1;transform:none}
  }
  ```
- `html{scroll-behavior:smooth;scroll-padding-top:96px}`.

---

## 8. Acessibilidade (não negociável)

- `lang="pt-BR"` e `<meta name="color-scheme" content="light dark">`.
- Skip link `.skip` para `#conteudo`.
- `:focus-visible{outline:2px solid var(--brand);outline-offset:3px}` — nunca remover o outline.
- `[hidden]{display:none!important}` em `base.css` — qualquer `display` declarado num componente anularia o atributo `hidden` do HTML.
- Ícones decorativos com `aria-hidden="true"`; seções com `aria-label` quando há mais de uma `nav`.
- Menu mobile: `aria-expanded`, `aria-controls`, fechar com `Esc` e ao clicar em link.
- Texto copiado tem `aria-live="polite"` e reverte após 2200ms.
- Manter `--ink` sobre `--bg` e `--on-brand`/`--on-lime` sobre as cores cheias (contraste AA).

---

## 9. Código e convenções

**Site estático, sem build, sem framework.** Tudo é separado por pastas e arquivos modulares:

```
index.html              landing (única com JS: menu, scrollspy, reveal, copy)
404.html                erro 404 (estática, sem JS)
app/
  entrar.html           tela de login    ─┐
  criar-conta.html      tela de cadastro ─┴→ CSS: ../css/auth.css
  onboarding.html       3 passos até publicar ─┴→ CSS: ../css/onboarding.css + js/onboarding.js
  dashboard.html        visão geral ─┬→ CSS: ../css/dashboard.css
  links.html            gestão de links │   + js/dashboard.js / js/links.js
  aparencia.html        temas + preview │   + js/aparencia.js (cada página, seu módulo)
  metricas.html         em breve        │   + js/app.js (só guarda + identidade)
  dominio.html          em breve        │
  configuracoes.html    conta e perigo ─┘   + js/config.js (sem footer, sem indexação)
  pagina.html           página pública blioo.app/seunome — espelho da pré-visualização
                       → CSS: ../css/pagina.css + js/pagina.js (sem header, sem footer, sem guarda)
legal/
  privacidade.html      documentos legais — estáticos, sem JS, CSS: ../css/legal.css
  termos.html
css/
  main.css              entrada: @import na ordem da cascata
  tokens.css            :root, dark mode, tokens (só aqui)
  base.css              reset, tipografia, .wrap, .skip
  buttons.css header.css hero.css marquee.css
  sections.css bento.css steps.css themes.css pricing.css faq.css final.css footer.css
  legal.css             páginas legais (.back, .legal, .doc, .doc-callout)
  auth.css              telas de conta (.auth-grid, .auth-card, .tabs, .field, .prefix-box)
  onboarding.css        onboarding (.onb-grid, .prog, .pane, .link-row, .screen--*)
  dashboard.css         painel (.dash-grid, .dash-nav, .dcard, .dlink, .breve)
  pagina.css            página pública (.pagina-main, .plinks, .plink, .feito)
  motion.css            .rv + prefers-reduced-motion
js/
  main.js               importa e executa os init* (landing)
  onboarding.js         init* do onboarding (importa initCopy de copy.js)
  app.js                casca do painel: guarda + identidade (usado pelo shell e pelas páginas)
  shell.js              navegação instantânea entre as páginas do painel (fetch + troca do <main>)
  store.js              estado blioo.onboarding.data: loadData/saveData, validadores, DEFAULT_DATA
  preview.js            createPreview/paintPreview — mesma peça em todo mockup
  dashboard.js          visão geral: identidade, copiar, estatísticas (importa initCopy)
  links.js              gestão de links: linhas, editor, ordem, busca, filtros, toast (importa store + preview)
  aparencia.js          radios de tema + pré-visualização
  config.js             identificador, plano, sair, excluir
  pagina.js             initPagina(): estado → tema, identidade, links públicos (importa initCopy)
  menu.js scrollspy.js reveal.js copy.js   (um módulo por comportamento, export function init*)
assets/                 fontes auto-hospedadas e imagens (ver §12)
```

**Nova página HTML = mesma receita:** `<head>` padrão (metas, `color-scheme`, duplo `theme-color`, og:*, canonical, favicon, manifest, fontes, `../css/main.css?v=N` dentro de `app/` ou `legal/`), skip link, `<header class="hdr">` com `.pill.back`, `<main id="conteudo">`. **Sem `<footer>`** — rodapé é exclusivo da landing. Exceção única: `app/pagina.html` (pública e imersiva, sem header nem footer — ver §6.14).
- **Pastas:** `app/` (telas do produto: conta, onboarding, painel, página pública), `legal/` (privacidade, termos), raiz (landing, 404, robots, sitemap). Caminhos sempre relativos (`../css/`, `../js/`, `../assets/` a partir das pastas) — nunca absolutos, para funcionar em qualquer subpath de deploy.
- **Cache-busting:** toda referência local de CSS/JS leva `?v=N` (`css/main.css?v=2`, `js/dashboard.js?v=2`). Ao alterar qualquer `.css` ou `.js`, incremente o `N` em todos os HTMLs — sem isso o navegador pode servir a versão antiga do cache. Links entre páginas usam o nome do arquivo (`privacidade.html`, `termos.html`, `entrar.html`, `criar-conta.html`, `onboarding.html`) e âncoras da landing usam `index.html#secao`.

- Um componente = um arquivo CSS nomeado + um bloco comentado no topo. Componente novo → novo arquivo + uma linha de `@import` em `main.css` (a ordem preserva a cascata: tokens → base → botões → header → hero → marquee → seções → motion).
- `js` é **ES module** (`<script type="module" src="js/main.js">`): precisa ser servido por HTTP local (`python -m http.server`) — `file://` não carrega módulos. A classe `js` no `<html>` continua inline no `<head>` (evita flash dos `.rv`).
- JS vanilla, só APIs nativas (`IntersectionObserver`, `navigator.clipboard`) com fallback; módulos só consultam o DOM depois do parse.
- Tema via classes no `:root`, nunca cor hardcoded em componente (exceto os fixos do §2).
- Nomes de classe curtos e semânticos: `hdr, pill, brand, nav, acts, sheet, hero, hero-grid, strip, track, badge, lede, cta, note, phone, screen, av, lk, copy, sec, eyebrow, head, bento, cell, tag, ico, steps, step, n, chip, themes, theme, mini, faq, qa, final, final-box, fgrid, fcols, fbot, rv, js, wrap, skip, btn`.
- SEO: `title`, `description`, `canonical`, `og:*`, `og:locale: pt_BR`, favicon SVG, apple-touch-icon, manifest.
- Ícones: glifos de texto (`∞ @ Aa ▭ ↗ ✦`), nunca biblioteca externa.

---

## 10. Tom de voz (UI e copy)

- Português do Brasil, frases curtas, benefício antes da feature.
- Sem exclamações, sem jargão técnico, sem caixa alta (fora eyebrow/rodapé).
- Verbos no imperativo suave: "Criar minha página", "Ver exemplos", "Copiar link".
- Placeholders e labels explicam o formato: `blioo.app/seunome`.
- Microcopy de estado: "Link copiado ✓" / "Não foi possível copiar".
- Assinatura: "feito com cuidado, no Brasil".

---

## 11. Breakpoints

| Largura | O que muda |
|---|---|
| ≤960px | Header vira sheet + botão Menu |
| ≤900px | Hero, telas de conta, onboarding e dashboard em coluna única; bento 2→1 coluna |
| ≤860px | Steps, themes e planos em coluna única |
| ≤560px | Bento 1 coluna; themes `min-height:240px` |
| ≤520px | CTA do header mais compacto |

---

## 12. Assets (atualizados para a identidade atual)

A pasta `assets/` segue **esta** identidade — SVG e PNG são gerados a partir dos tokens do §2.

- **`assets/fonts/`** — Inter (`inter-latin`, `inter-latin-ext`) e Bricolage Grotesque (`bricolage-grotesque-latin`, `bricolage-grotesque-latin-ext`), variáveis, subsets latin/latin-ext, declarados em `fonts.css`. O `index.html` carrega as fontes via Google Fonts; a pasta local serve para self-hosting e para embedar em SVG/OG.
- **`assets/img/`** — SVGs com a paleta nova (`#F4F5EF` fundo, `#0C1210` traço, `#0E5E49` lente). O `icon.svg` tem `<style>` interno que adapta o favicon a `prefers-color-scheme: dark` (traço `#EEF1EA`, lente `#C8F53A`).
- **Regenerar PNGs:** renderizar os SVGs no Edge headless (`--headless=new --screenshot --window-size=<WxH>`), sempre removendo o `<style>` do ícone antes de renderizar (headless força dark). Medir larguras de texto com fontTools antes de usar `textLength` — nunca comprimir texto.
- **`assets/manifest.webmanifest`** — `background_color`/`theme_color` em `#F4F5EF`, ícones svg + png (512 maskable + 180). Os caminhos dos ícones são relativos ao próprio manifest (`img/...`, nunca `assets/img/...`).


---

## 13. Checklist para nova tela

- [ ] Usa só tokens do §2; nenhuma cor nova.
- [ ] Tem variant dark (`prefers-color-scheme` + `[data-theme="dark"]`).
- [ ] Títulos em `--f-d` 800 com `letter-spacing:-.035em`; texto em `--f-t` 400/500/600.
- [ ] Superfícies: `--surface` + `1px var(--line)` + `--r` (22px); elementos de ação em raio 99px.
- [ ] Espaçamentos e `gap` na escala do §5; conteúdo dentro de `.wrap`.
- [ ] Hover sutil (`translateY(-2px)` em botão, `-4px` em card), sempre com `var(--ease)`.
- [ ] `:focus-visible` preservado; decorativos com `aria-hidden`; rótulos ARIA corretos.
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Testado em 1160px, 900px, 560px.
- [ ] Copy em pt-BR no tom do §10.
