# CTAs em popup rastreado (MeuTrack) — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer os 186 CTAs do site abrirem o formulário da MeuTrack como popup dentro do próprio domínio, em vez de redirecionar o visitante para `workers.dev`.

**Architecture:** O `embed.js` da MeuTrack já tem modo modal nativo: carregado sem `data-form`, ele instala um listener delegado no `document` e abre o formulário em iframe ao clicar em qualquer elemento com `data-th-quiz`. Adicionamos a tag do script em todas as páginas publicadas, marcamos os CTAs com `data-th-quiz` mantendo o `href` como fallback, e vestimos o overlay deles com uma camada de estilo nossa. Nenhuma lógica de tracking é reescrita.

**Tech Stack:** HTML estático + CSS (`assets/css/main.css`) + JS vanilla (`assets/js/main.js`); geradores em Node ESM (`tools/`); testes com `node --test`.

**Spec:** [2026-07-29-popup-cta-meutrack-design.md](../specs/2026-07-29-popup-cta-meutrack-design.md)

## Global Constraints

- **Form ID novo:** `PGW6nIOmTX`. O antigo `ng_MXvkuBh` não pode sobrar em nenhuma página publicada.
- **URL do formulário:** `https://meutrack-ingest.carlosabsj-ti.workers.dev/f/PGW6nIOmTX`
- **URL do embed:** `https://meutrack-ingest.carlosabsj-ti.workers.dev/embed.js`
- **O `href` de cada CTA permanece.** É o fallback para quando o `embed.js` não carrega. Nunca trocar o `<a>` por `<button>`, nunca remover `target="_blank" rel="noopener"`.
- **Escopo:** somente links que hoje apontam para `workers.dev/f/`. Não tocar em navegação interna, download do e-book (`ebook/Ebook-Metodo-4D.pdf`), avaliação no Google (`g.page`) nem nos `wa.me` do rodapé.
- **Páginas publicadas** = todos os `.html` do repositório, exceto `node_modules/`, `painel/` e os `preview-*.html`.
- **Páginas geradas não se editam à mão** — `tratamentos/*/index.html` sai de `tools/build-treatments.mjs`; `blog/*/index.html` sai de `tools/blog/lib/render-post.mjs`. A exceção está documentada no passo 8 da Task 2.
- **Fonte única de tags de tracking:** `tools/lib/tracking.mjs`. O comentário no topo do arquivo já estabelece que páginas escritas à mão e geradas devem sair idênticas.
- **Tokens de cor** (de `assets/css/main.css`): `--marca: #057f7f`, `--marca-bright: #19b3a6`, `--tinta: #16302f`.
- **Idioma:** comentários de código em português, como no resto do repositório.

---

## File Structure

| Arquivo | Responsabilidade |
|---|---|
| `tools/lib/tracking.mjs` (modificar) | Fonte única: ID do formulário, URL, atributos do CTA e a tag do `embed.js` |
| `tools/test/tracking.test.mjs` (criar) | Testa os contratos exportados por `tracking.mjs` |
| `tools/test/cta-popup.test.mjs` (criar) | Guarda de regressão: varre o HTML publicado e trava os invariantes do popup |
| `tools/build-treatments.mjs` (modificar) | Gerador das 15 páginas de tratamento |
| `tools/blog/lib/chrome.mjs` (modificar) | Nav, drawer e FAB do blog |
| `tools/blog/lib/render-post.mjs` (modificar) | Página de post do blog |
| `scripts/build-stubs.mjs` (modificar) | Gerador legado, fora do `package.json`; atualizado para não reintroduzir o padrão antigo |
| 7 páginas HTML à mão + 1 post gerado (modificar) | `index`, `sobre`, `contato`, `tratamentos`, `tricologia`, `metodo-4d`, `blog.html` |
| `assets/js/main.js` (modificar) | Marca o overlay do `embed.js` com `.th-modal` e atributos de diálogo |
| `assets/css/main.css` (modificar) | Aparência do `.th-modal` |
| `package.json` (modificar) | Inclui `tools/test/*.test.mjs` no `npm test` |

---

### Task 1: Fonte única do CTA e da tag do embed

Centraliza o ID do formulário, os atributos do CTA e a tag do `embed.js` em `tools/lib/tracking.mjs`, para que os três geradores e as páginas à mão produzam markup idêntico.

**Files:**
- Modify: `tools/lib/tracking.mjs`
- Create: `tools/test/tracking.test.mjs`
- Modify: `package.json` (campo `scripts.test`)

**Interfaces:**
- Consumes: nada (primeira task).
- Produces: de `tools/lib/tracking.mjs` — `FORM_ID: string`, `CTA_HREF: string`, `CTA_ATTRS: string`, `TRACKING_FOOT: string`. As tasks 2 e 3 importam esses nomes.

- [ ] **Step 1: Escrever o teste que falha**

Criar `tools/test/tracking.test.mjs`:

```js
/* Contratos de tracking.mjs — a fonte única das tags e do CTA.
   Se algum destes quebrar, páginas geradas e escritas à mão divergem. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { FORM_ID, CTA_HREF, CTA_ATTRS, TRACKING_FOOT } from '../lib/tracking.mjs';

test('FORM_ID é o formulário novo', () => {
  assert.equal(FORM_ID, 'PGW6nIOmTX');
});

test('CTA_HREF aponta para o formulário do FORM_ID', () => {
  assert.equal(
    CTA_HREF,
    'https://meutrack-ingest.carlosabsj-ti.workers.dev/f/PGW6nIOmTX'
  );
});

test('CTA_ATTRS abre o popup e mantém o href de fallback', () => {
  assert.match(CTA_ATTRS, /data-th-quiz="PGW6nIOmTX"/);
  assert.match(CTA_ATTRS, /href="https:\/\/meutrack-ingest\.carlosabsj-ti\.workers\.dev\/f\/PGW6nIOmTX"/);
  assert.match(CTA_ATTRS, /target="_blank"/);
  assert.match(CTA_ATTRS, /rel="noopener"/);
});

test('CTA_ATTRS põe data-th-quiz antes do href', () => {
  assert.ok(
    CTA_ATTRS.indexOf('data-th-quiz') < CTA_ATTRS.indexOf('href='),
    'a ordem dos atributos precisa bater com a das páginas migradas'
  );
});

test('TRACKING_FOOT carrega o embed.js sem data-form', () => {
  assert.match(TRACKING_FOOT, /src="https:\/\/meutrack-ingest\.carlosabsj-ti\.workers\.dev\/embed\.js"/);
  assert.ok(!TRACKING_FOOT.includes('data-form'), 'modo modal não usa data-form');
  assert.match(TRACKING_FOOT, /async/);
});
```

- [ ] **Step 2: Incluir o novo diretório de testes no `npm test`**

Em `package.json`, o campo `scripts.test` hoje é:

```json
"test": "node --test tools/blog/test/*.test.mjs painel/test/*.test.js"
```

Trocar por:

```json
"test": "node --test tools/test/*.test.mjs tools/blog/test/*.test.mjs painel/test/*.test.js"
```

- [ ] **Step 3: Rodar o teste para ver falhar**

Run: `npm test`
Expected: FAIL — `SyntaxError: The requested module '../lib/tracking.mjs' does not provide an export named 'FORM_ID'`

- [ ] **Step 4: Implementar em `tools/lib/tracking.mjs`**

Acrescentar ao final do arquivo (mantendo `GTM_ID`, `TRACKING_HEAD` e `TRACKING_BODY` como estão):

```js
/* --- CTAs em popup ---------------------------------------------------
   O formulário abre dentro do site (modo modal do embed.js), acionado
   pelo atributo data-th-quiz. O href continua ali de propósito: o
   embed.js dá preventDefault() no clique, então o link só dispara se o
   script não carregar — e aí o visitante cai no formulário como antes. */
export const FORM_ID = 'PGW6nIOmTX';

export const CTA_HREF = `https://meutrack-ingest.carlosabsj-ti.workers.dev/f/${FORM_ID}`;

/** Atributos completos de um <a> de CTA. Uso: `<a class="btn" ${CTA_ATTRS}>`. */
export const CTA_ATTRS = `data-th-quiz="${FORM_ID}" href="${CTA_HREF}" target="_blank" rel="noopener"`;

/** Vai imediatamente antes de </body>, depois do main.js. */
export const TRACKING_FOOT = `  <!-- MeuTrack: popup dos CTAs (data-th-quiz) -->
  <script async src="https://meutrack-ingest.carlosabsj-ti.workers.dev/embed.js"></script>`;
```

- [ ] **Step 5: Rodar os testes**

Run: `npm test`
Expected: PASS — os 5 testes de `tracking.test.mjs` passam e nenhum teste existente de `tools/blog/test/` ou `painel/test/` quebra.

- [ ] **Step 6: Commit**

```bash
git add tools/lib/tracking.mjs tools/test/tracking.test.mjs package.json
git commit -m "feat(cta): fonte unica do formulario em popup no tracking.mjs"
```

---

### Task 2: Migrar os 186 CTAs para o popup

Deliverable único: nenhuma página publicada redireciona mais o visitante para fora do domínio. Geradores e páginas à mão andam juntos porque a guarda de regressão é global — se qualquer um dos dois ficar para trás, o teste falha.

**Files:**
- Create: `tools/test/cta-popup.test.mjs`
- Modify: `tools/build-treatments.mjs` (linhas 116-119, 294, 305, 316, 373, 382, 443-444, 449, 453, 575, 688)
- Modify: `tools/blog/lib/chrome.mjs` (linhas 3-5, 25, 36, 47, 97)
- Modify: `tools/blog/lib/render-post.mjs` (linhas 1, 31, 38, 163, 249, 263)
- Modify: `scripts/build-stubs.mjs` (linhas 5-8)
- Modify: `index.html`, `sobre.html`, `contato.html`, `tratamentos.html`, `tricologia.html`, `metodo-4d.html`, `blog.html`
- Modify: `blog/flacidez-no-rosto-tem-tratamento-veja-o-que-realmente-funciona-em-2026/index.html`
- Regenerate: `tratamentos/*/index.html` (15 arquivos)

**Interfaces:**
- Consumes: `FORM_ID`, `CTA_HREF`, `CTA_ATTRS`, `TRACKING_FOOT` de `tools/lib/tracking.mjs` (Task 1).
- Produces: markup canônico do CTA — `<a class="..." data-th-quiz="PGW6nIOmTX" href="https://meutrack-ingest.carlosabsj-ti.workers.dev/f/PGW6nIOmTX" target="_blank" rel="noopener">`. A Task 3 estiliza o overlay que esse markup dispara.

- [ ] **Step 1: Escrever a guarda de regressão**

Criar `tools/test/cta-popup.test.mjs`:

```js
/* Invariantes dos CTAs em popup.
   As páginas de tratamento e do blog são geradas; sem esta guarda, um
   rebuild com o gerador desatualizado devolve o site ao redirect. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORM_ID } from '../lib/tracking.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const IGNORAR = new Set(['node_modules', 'painel', '.git', 'docs']);

function paginas(dir = ROOT, acc = []) {
  for (const nome of readdirSync(dir)) {
    if (IGNORAR.has(nome)) continue;
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) paginas(caminho, acc);
    else if (nome.endsWith('.html') && !nome.startsWith('preview-')) acc.push(caminho);
  }
  return acc;
}

const PAGINAS = paginas().map((f) => [relative(ROOT, f), readFileSync(f, 'utf8')]);
const LINK_FORM = /<a\b[^>]*href="https:\/\/meutrack-ingest\.carlosabsj-ti\.workers\.dev\/f\/[^"]*"[^>]*>/g;
const LINK_POPUP = /<a\b[^>]*data-th-quiz[^>]*>/g;

test('encontrou as páginas publicadas', () => {
  assert.ok(PAGINAS.length >= 23, `esperava >= 23 páginas, achei ${PAGINAS.length}`);
});

test('nenhuma página publicada usa o formulário antigo', () => {
  for (const [arquivo, html] of PAGINAS) {
    assert.ok(!html.includes('ng_MXvkuBh'), `${arquivo} ainda aponta para ng_MXvkuBh`);
  }
});

test('todo link para o formulário abre em popup', () => {
  for (const [arquivo, html] of PAGINAS) {
    for (const tag of html.match(LINK_FORM) || []) {
      assert.ok(
        tag.includes(`data-th-quiz="${FORM_ID}"`),
        `${arquivo}: CTA sem data-th-quiz -> ${tag}`
      );
    }
  }
});

test('todo CTA em popup mantém o href de fallback', () => {
  for (const [arquivo, html] of PAGINAS) {
    for (const tag of html.match(LINK_POPUP) || []) {
      assert.match(
        tag,
        /href="https:\/\/meutrack-ingest\.carlosabsj-ti\.workers\.dev\/f\//,
        `${arquivo}: CTA sem href de fallback -> ${tag}`
      );
    }
  }
});

test('toda página com CTA carrega o embed.js', () => {
  for (const [arquivo, html] of PAGINAS) {
    if (!html.includes('data-th-quiz')) continue;
    assert.ok(
      html.includes('workers.dev/embed.js'),
      `${arquivo} tem CTA de popup mas não carrega o embed.js`
    );
  }
});
```

- [ ] **Step 2: Rodar para ver falhar**

Run: `npm test`
Expected: FAIL — `nenhuma página publicada usa o formulário antigo`: `index.html ainda aponta para ng_MXvkuBh`.

- [ ] **Step 3: Atualizar `tools/build-treatments.mjs`**

Trocar o bloco de comentário + constante das linhas 116-119:

```js
/* Todo CTA vai para o formulário rastreado (MeuTrack), que ao final
   encaminha o lead para o WhatsApp. O wa.me direto fica apenas no telefone
   escrito e no ícone de redes do rodapé. */
const CTA = "https://meutrack-ingest.carlosabsj-ti.workers.dev/f/ng_MXvkuBh";
```

por:

```js
/* Todo CTA abre o formulário rastreado (MeuTrack) em popup, sem tirar o
   visitante do domínio; ao final o formulário encaminha o lead para o
   WhatsApp. O wa.me direto fica apenas no telefone escrito e no ícone de
   redes do rodapé. Os atributos vêm de lib/tracking.mjs (fonte única). */
```

Ajustar o `import` da linha 20 para trazer os novos nomes:

```js
import { TRACKING_HEAD, TRACKING_BODY, TRACKING_FOOT, CTA_ATTRS } from "./lib/tracking.mjs";
```

Substituir cada um dos 7 pontos de interpolação do href — nas linhas 305, 316, 373, 449, 453, 575 e 688 — trocando `href="${attr(cta)}" target="_blank" rel="noopener"` (ou `href="${CTA}" ...`, ou `href="${attr(heroCta)}" ...`, ou `href="${attr(dudaCta)}" ...`) por `${CTA_ATTRS}`. Resultado esperado em cada linha:

```js
      <a class="btn btn--primary nav__cta" ${CTA_ATTRS}>Agende sua consulta</a>
    <a class="btn btn--primary drawer__cta" ${CTA_ATTRS}>Agende sua consulta</a>
  <a class="wpp" ${CTA_ATTRS} aria-label="Falar no WhatsApp">
    `<a class="btn btn--primary" ${CTA_ATTRS}>${esc(label || "Agende sua consulta")}</a>`;
          <a class="btn btn--ghost" ${CTA_ATTRS}>Tirar dúvidas no WhatsApp</a>
            <a class="ts-link" ${CTA_ATTRS}>Agende sua avaliação ${ARROW}</a>
          <a class="btn btn--on-deep" ${CTA_ATTRS}>Agende sua consulta</a>
```

Remover as variáveis que ficaram órfãs: `const cta = CTA;` (linha 294), `const heroCta = CTA;` e `const dudaCta = CTA;` (linhas 443-444). Se `heroCta` ou `dudaCta` forem usados em outro ponto além dos listados, mantê-los.

Inserir a tag do embed logo depois do `main.js` (linha 382):

```js
  <script src="../../assets/js/main.js" defer></script>
${TRACKING_FOOT}`;
```

- [ ] **Step 4: Atualizar `tools/blog/lib/chrome.mjs`**

Trocar o comentário + constante das linhas 3-5:

```js
// Todo CTA vai para o formulário rastreado, que ao final leva o lead ao
// WhatsApp. O wa.me direto só aparece no telefone escrito e no ícone de redes.
export const CTA = 'https://meutrack-ingest.carlosabsj-ti.workers.dev/f/ng_MXvkuBh';
```

por uma reexportação da fonte única, para não haver duas verdades:

```js
// Todo CTA abre o formulário rastreado em popup (data-th-quiz), sem tirar o
// visitante do domínio. O wa.me direto só aparece no telefone escrito e no
// ícone de redes do rodapé.
export { CTA_HREF as CTA, CTA_ATTRS } from '../../lib/tracking.mjs';
```

Como `export ... from` não cria binding local, adicionar também o import para uso interno no próprio arquivo:

```js
import { CTA_ATTRS } from '../../lib/tracking.mjs';
```

Substituir os usos nas linhas 36, 47 e 97:

```js
      <a class="btn btn--primary nav__cta" ${CTA_ATTRS}>Agende sua consulta</a>
    <a class="btn btn--primary drawer__cta" ${CTA_ATTRS}>Agende sua consulta</a>
  <a class="wpp" ${CTA_ATTRS} aria-label="Falar no WhatsApp">
```

Remover `const cta = CTA;` (linha 25) se ficar órfã.

- [ ] **Step 5: Atualizar `tools/blog/lib/render-post.mjs`**

No import da linha 1, trazer `CTA_ATTRS` em vez de `CTA`:

```js
import { navHTML, footerHTML, CTA_ATTRS } from './chrome.mjs';
```

Substituir os usos nas linhas 38 e 249:

```js
    + `<a class="btn btn--primary article-cta__btn" ${CTA_ATTRS}>Agende sua consulta</a>`
            <a class="btn btn--primary" ${CTA_ATTRS}>Agende sua consulta</a>
```

Remover `const wa = CTA;` (linha 31) e `const ctaCta = CTA;` (linha 163) se ficarem órfãs.

Adicionar `TRACKING_FOOT` ao import da linha 4 e inseri-lo depois do `main.js` (linha 263):

```js
import { TRACKING_HEAD, TRACKING_BODY, TRACKING_FOOT } from '../../lib/tracking.mjs';
```

```js
  <script src="../../assets/js/main.js" defer></script>
${TRACKING_FOOT}
</body>
```

- [ ] **Step 6: Atualizar `scripts/build-stubs.mjs`**

Este gerador não está no `package.json` e **não será executado**; a mudança existe só para que ninguém o rode e reintroduza o padrão antigo. Trocar as linhas 5-8:

```js
// Todo CTA vai para o formulário rastreado, que ao final leva o lead ao
// WhatsApp. O wa.me direto só aparece no telefone escrito e no ícone de redes.
const CTA =
  "https://meutrack-ingest.carlosabsj-ti.workers.dev/f/ng_MXvkuBh";
```

por:

```js
// Todo CTA abre o formulário rastreado em popup (data-th-quiz). Gerador
// legado, fora do npm scripts — mantido em dia para não reintroduzir o
// redirect caso alguém o execute.
const CTA =
  "https://meutrack-ingest.carlosabsj-ti.workers.dev/f/PGW6nIOmTX";
```

- [ ] **Step 7: Regenerar as 15 páginas de tratamento**

Run: `npm run build:treatments`

Conferir que o diff contém **apenas** as mudanças previstas:

```bash
git diff -U0 -- tratamentos/ | grep -E '^[-+]' | grep -vE '^(\+\+\+|---)' | grep -vE 'th-quiz|embed\.js|PGW6nIOmTX|ng_MXvkuBh|MeuTrack'
```

Expected: saída vazia. Qualquer linha que apareça aqui é uma mudança não intencional do gerador — investigar antes de seguir.

- [ ] **Step 8: Migrar as páginas escritas à mão e o post do blog**

O post do blog é gerado por `render-post.mjs`, mas o `npm run build:blog` depende de credenciais do Supabase. A transformação abaixo produz exatamente o mesmo markup que o gerador atualizado produziria (mesma ordem de atributos), então o próximo build reproduz o arquivo idêntico. Se as credenciais estiverem disponíveis, prefira rodar `npm run build:blog` e conferir que o diff do post fica vazio.

Criar o script **no scratchpad, fora do repositório** (é uso único, não versionar):

```js
/* migra-cta.mjs — uso único. Marca os CTAs com data-th-quiz, troca o ID do
   formulário e insere a tag do embed.js depois do main.js. */
import { readFileSync, writeFileSync } from 'node:fs';

const FORM_ID = 'PGW6nIOmTX';
const FOOT =
  '  <!-- MeuTrack: popup dos CTAs (data-th-quiz) -->\n' +
  '  <script async src="https://meutrack-ingest.carlosabsj-ti.workers.dev/embed.js"></script>\n';
const MAIN_JS = /^([ \t]*<script src="[^"]*assets\/js\/main\.js" defer><\/script>\n)/m;

for (const arquivo of process.argv.slice(2)) {
  let html = readFileSync(arquivo, 'utf8');

  if (!html.includes('data-th-quiz')) {
    html = html.replace(
      /href="(https:\/\/meutrack-ingest\.carlosabsj-ti\.workers\.dev\/f\/[^"]+)"/g,
      (_m, url) => `data-th-quiz="${FORM_ID}" href="${url}"`
    );
  }

  // Pega tanto o href dos CTAs quanto o data-form do embed inline da contato.
  html = html.split('ng_MXvkuBh').join(FORM_ID);

  if (!html.includes('MeuTrack: popup dos CTAs')) {
    if (!MAIN_JS.test(html)) throw new Error(`${arquivo}: não achei a tag do main.js`);
    html = html.replace(MAIN_JS, `$1${FOOT}`);
  }

  writeFileSync(arquivo, html);
  console.log('ok:', arquivo);
}
```

Rodar sobre as 8 páginas:

```bash
node "$SCRATCHPAD/migra-cta.mjs" \
  index.html sobre.html contato.html tratamentos.html tricologia.html \
  metodo-4d.html blog.html \
  "blog/flacidez-no-rosto-tem-tratamento-veja-o-que-realmente-funciona-em-2026/index.html"
```

Expected: 8 linhas `ok:`.

- [ ] **Step 9: Rodar a guarda de regressão**

Run: `npm test`
Expected: PASS — todos os testes, incluindo os 5 de `cta-popup.test.mjs`.

- [ ] **Step 10: Conferir a contagem à mão**

```bash
grep -rc 'data-th-quiz="PGW6nIOmTX"' --include=*.html . | grep -v node_modules | awk -F: '{s+=$2} END {print "CTAs em popup:", s}'
grep -rn 'ng_MXvkuBh' --include=*.html --include=*.mjs --include=*.js . | grep -v node_modules | grep -v docs/
```

Expected: `CTAs em popup: 186` e nenhuma ocorrência de `ng_MXvkuBh`.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(cta): formulario em popup no lugar do redirect para fora do site"
```

---

### Task 3: Vestir o overlay do popup

O `embed.js` cria o overlay com estilos inline, sem classe, e com backdrop transparente — o card branco flutua sobre a página e some sobre as seções claras. Esta task o marca e o estiliza na identidade do site, sem tocar na lógica deles.

**Files:**
- Modify: `assets/js/main.js` (inserir depois do bloco `trackedCtas()`, que termina na linha 740)
- Modify: `assets/css/main.css` (acrescentar ao final)

**Interfaces:**
- Consumes: o markup de CTA da Task 2 — é o clique nele que faz o `embed.js` criar o overlay.
- Produces: a classe `.th-modal` no elemento de overlay (`div` com `z-index: 2147483000`, filho direto de `<body>`), com `role="dialog"` e `aria-modal="true"`.

- [ ] **Step 1: Marcar o overlay em `assets/js/main.js`**

Inserir depois do fechamento do `trackedCtas()` (linha 740) e antes do `})();` final do arquivo:

```js
  /* --- Popup do formulário: veste o overlay do embed.js -------------
     O embed.js monta o overlay com estilo inline e sem classe; o único
     identificador estável é o z-index. Marcamos com .th-modal para o CSS
     assumir a aparência. Toda a lógica (altura, Escape, redirect final)
     continua sendo do script deles. */
  (function popupDoFormulario() {
    const Z_DO_OVERLAY = "2147483000";

    const vestir = (no) => {
      if (!(no instanceof HTMLElement)) return;
      if (no.style.zIndex !== Z_DO_OVERLAY || no.dataset.thVestido) return;
      no.dataset.thVestido = "1";
      no.classList.add("th-modal");
      no.setAttribute("role", "dialog");
      no.setAttribute("aria-modal", "true");
      no.setAttribute("aria-label", "Agende sua avaliação");
      const frame = no.querySelector("iframe");
      if (frame) frame.focus();
    };

    new MutationObserver((registros) => {
      for (const reg of registros) reg.addedNodes.forEach(vestir);
    }).observe(document.body, { childList: true });
  })();
```

- [ ] **Step 2: Estilizar em `assets/css/main.css`**

Acrescentar ao final do arquivo:

```css
/* ===================================================================
   POPUP DO FORMULÁRIO (MeuTrack)
   O overlay vem do embed.js com estilos inline — daí o !important. O
   card branco já vem do formulário em modo popup; aqui cuidamos do
   fundo, da entrada e do botão de fechar.
   =================================================================== */
.th-modal {
  background: rgba(22, 48, 47, 0.62) !important;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  animation: th-modal-entra 0.18s ease-out both;
}

.th-modal button {
  width: 36px !important;
  height: 36px !important;
  color: var(--branco) !important;
  background: var(--marca) !important;
  box-shadow: 0 4px 14px rgba(4, 77, 77, 0.4) !important;
  transition: background 0.2s ease, transform 0.2s ease;
}

.th-modal button:hover,
.th-modal button:focus-visible {
  background: var(--marca-bright) !important;
  transform: scale(1.06);
}

@keyframes th-modal-entra {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .th-modal {
    animation: none !important;
  }

  .th-modal button {
    transition: none;
  }
}
```

- [ ] **Step 3: Subir o servidor local**

Run: `node scripts/serve.mjs`
Expected: o servidor informa a porta em que está ouvindo. Deixar rodando em background para os passos seguintes.

- [ ] **Step 4: Verificar no browser com Playwright**

Abrir a home no endereço local, clicar no CTA do header e confirmar, via snapshot e screenshot:

1. A URL da aba **não muda** — o visitante continua no site.
2. Existe um elemento com a classe `th-modal` e `role="dialog"`.
3. O fundo atrás do card está escurecido (visível no screenshot).
4. O botão de fechar está teal, não cinza.

Run (no console do Playwright, após o clique):
```js
const ov = document.querySelector('.th-modal');
({ classe: !!ov, papel: ov?.getAttribute('role'), fundo: getComputedStyle(ov).backgroundColor })
```
Expected: `{ classe: true, papel: 'dialog', fundo: 'rgba(22, 48, 47, 0.62)' }`

- [ ] **Step 5: Commit**

```bash
git add assets/js/main.js assets/css/main.css
git commit -m "feat(cta): backdrop e botao de fechar do popup na identidade do site"
```

---

### Task 4: QA no browser e publicação

**Files:**
- Nenhum arquivo novo. Correções pontuais, se o QA apontar algo.

**Interfaces:**
- Consumes: o site inteiro, como resultado das tasks 1-3.
- Produces: site publicado com o checklist do spec verificado.

- [ ] **Step 1: Rodar o checklist do spec com Playwright**

Com o servidor local no ar, verificar em **desktop (1440×900)**:

1. O popup abre a partir de um CTA do header, um do corpo da página e do botão flutuante (`.wpp`) — em `index.html`, em uma página de tratamento e no post do blog.
2. `Escape` fecha; o botão "×" fecha.
3. Depois de fechar, o scroll da página volta ao normal (`document.documentElement.style.overflow` vazio).
4. Enquanto aberto, o scroll da página está travado.
5. O card fica legível sobre seção clara **e** sobre a seção teal escura.
6. Em `contato.html`: o formulário inline continua aparecendo **e** um clique num CTA abre exatamente **um** overlay (`document.querySelectorAll('.th-modal').length === 1`).
7. Console sem erros novos.

- [ ] **Step 2: Verificar em mobile (375×812)**

1. O card cabe na viewport, sem corte.
2. O botão "×" está dentro da área visível e alcançável pelo polegar.
3. O menu drawer fecha ou convive com o popup sem sobreposição quebrada — abrir o drawer, clicar no CTA dele e conferir que o formulário fica por cima e utilizável.

- [ ] **Step 3: Varredura final do repositório**

```bash
npm test
grep -rn 'ng_MXvkuBh' --include=*.html --include=*.mjs --include=*.js . | grep -v node_modules | grep -v docs/
grep -rLn 'embed\.js' --include=*.html . | grep -v node_modules | grep -v painel | grep -v preview-
```

Expected: testes passando; nenhuma ocorrência de `ng_MXvkuBh`; a última varredura lista apenas páginas sem CTA (se listar `index.html` ou qualquer página de conversão, falta a tag).

- [ ] **Step 4: Publicar**

```bash
git push origin master
```

Depois do deploy, repetir os itens 1, 2 e 6 do Step 1 **no site publicado**, confirmando que o `embed.js` e o iframe do worker carregam a partir do domínio real (o worker pode responder diferente para `localhost` no `ref`).

- [ ] **Step 5: Registrar as pendências com a agência**

Levar de volta à agência de tráfego, por escrito:

1. **Redirect final** — ao concluir o formulário, o `embed.js` executa `location.href = url`, substituindo a página inteira do site. É comportamento do script deles e não é interceptável de fora. Confirmar se é o desejado ou se preferem que o destino final abra em nova aba (mudança teria de sair do lado deles).
2. **Corte no histórico** — a partir de agora todos os leads chegam por `PGW6nIOmTX`; o `ng_MXvkuBh` deixou de ser usado no site.
3. **Botão flutuante** — o FAB com ícone de WhatsApp (`.wpp`) já apontava para o formulário, não para o WhatsApp; agora ele abre o popup. Vale confirmar se o ícone deve continuar sendo o do WhatsApp.

---

## Notas para quem executa

- **Não troque `<a>` por `<button>`.** O `href` é o fallback de quando o `embed.js` não carrega; sem ele, um adblock derruba 186 CTAs de uma vez.
- **`trackedCtas()` em `assets/js/main.js:714` fica como está.** O `BASE` dele é o prefixo `.../f/`, que continua válido com o ID novo. Ele alimenta o href do fallback com `ref` e `vid`.
- **A guarda `window.__thModal`** dentro do `embed.js` é o que permite `contato.html` carregar o script duas vezes (inline + modal) sem abrir dois overlays. Não tente "otimizar" removendo uma das tags.
- **Se o `embed.js` da MeuTrack mudar o `z-index` do overlay**, a Task 3 para de aplicar o backdrop — o popup continua funcionando, só volta ao visual padrão. O teste `cta-popup.test.mjs` não cobre isso; é uma verificação visual.
