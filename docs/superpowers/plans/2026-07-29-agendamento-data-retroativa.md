# Agendamento de posts e data retroativa — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir, no painel do Dr. Márcio, publicar um post com data retroativa e agendar um post para entrar no ar sozinho em data/hora futura.

**Architecture:** Um terceiro status (`scheduled`) em `mt_posts`. O editor ganha um campo único de data que decide, pela própria data, entre publicar (passado) e agendar (futuro). Um cron de 30 em 30 minutos no GitHub Actions promove no banco os agendados vencidos para `published` **antes** do build — assim `tools/build-blog.mjs` continua lendo só `status=eq.published` e não muda nenhuma linha.

**Tech Stack:** JS ESM sem build step (painel = módulos nativos no browser), `node:test` para testes, PostgREST via `curl` no GitHub Actions, Supabase Postgres.

**Spec:** [docs/superpowers/specs/2026-07-29-agendamento-data-retroativa-design.md](../specs/2026-07-29-agendamento-data-retroativa-design.md)

## Global Constraints

- **Sem dependências novas.** O painel não tem bundler; tudo é ESM nativo carregado pelo browser. Os testes rodam em `node:test` puro. Não instalar pacotes.
- **Idioma:** todo texto de interface, mensagem de toast, comentário de código e mensagem de commit em **português do Brasil**.
- **Comentários explicam o porquê, não o quê.** Seguir a densidade do código existente (comentário curto só onde a razão não é óbvia).
- **Status válidos:** exatamente `'draft'`, `'published'`, `'scheduled'`. Nenhum outro valor.
- **Fuso:** o banco guarda `timestamptz`; toda comparação de tempo é feita em UTC. O painel converte local→ISO ao gravar e ISO→local ao ler.
- **Segurança:** a política RLS pública de `mt_posts` é `for select using (status = 'published')` e **não pode ser afrouxada** — é ela que impede um post agendado de vazar para o visitante e para o build.
- **Comando de teste:** `npm test` (roda `tools/blog/test/*.test.mjs` + `painel/test/*.test.js`). Deve terminar verde ao fim de cada task.
- **Convenção do repo:** lógica pura mora em `painel/lib/` e é testada; telas (`painel/screens/`) não têm teste automatizado e são verificadas no browser.
- **Nome do banco/tabela:** `mt_posts` (projeto Supabase compartilhado com o HD360, prefixo `mt_` obrigatório).

## Estrutura de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `painel/lib/publish-date.js` | criar | Conversão local↔ISO e a regra passado/futuro → status. Única fonte da regra. |
| `painel/test/publish-date.test.js` | criar | Testes de `publish-date.js`. |
| `painel/lib/post-payload.js` | modificar | Passa a mandar `date` e a derivar `status` via `resolveStatus`. |
| `painel/test/post-payload.test.js` | modificar | Cobre `date` presente/ausente e status derivado. |
| `supabase/scheduled-marcio.sql` | criar | Migration: check constraint com `scheduled` + índice parcial. |
| `supabase/schema-marcio.sql` | modificar | Mesmo check já embutido, para setup do zero. |
| `painel/screens/editor.js` | modificar | Campo de data + botão primário reativo. |
| `painel/screens/list.js` | modificar | Aba "Agendados" + badge. |
| `painel/styles.css` | modificar | Tokens `--sched*` + `.badge--sched`. |
| `.github/workflows/publish-blog.yml` | modificar | Cron + split em jobs `gate` e `build`. |

**Não tocar:** `tools/build-blog.mjs`, `tools/blog/lib/load-posts.mjs`, `tools/blog/lib/supabase-map.mjs`. A promoção acontece no banco antes do build, justamente para que esses arquivos fiquem intactos.

---

### Task 1: Módulo `publish-date.js`

Lógica pura, sem DOM. É a única fonte da regra "data no futuro = agendado".

**Files:**
- Create: `painel/lib/publish-date.js`
- Test: `painel/test/publish-date.test.js`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `toLocalInputValue(iso?: string) => string` — ISO/timestamptz → `"YYYY-MM-DDTHH:mm"` no fuso local. Sem argumento ou com valor inválido, devolve o instante atual formatado.
  - `fromLocalInputValue(value: string) => string` — valor do input → ISO UTC (`toISOString()`). Vazio ou inválido → `''`.
  - `resolveStatus(intent: 'draft'|'publish', dateIso: string, now?: Date|string) => 'draft'|'published'|'scheduled'`.

- [ ] **Step 1: Escrever o teste que falha**

Criar `painel/test/publish-date.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toLocalInputValue, fromLocalInputValue, resolveStatus } from '../lib/publish-date.js';

test('toLocalInputValue e fromLocalInputValue fecham o ciclo sem perder o instante', () => {
  // Vale em qualquer fuso: todos os offsets do mundo são múltiplos de 1 minuto,
  // então só os segundos se perdem — e o ISO de entrada não tem segundos.
  const iso = '2026-03-12T12:00:00.000Z';
  const local = toLocalInputValue(iso);
  assert.match(local, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  assert.equal(fromLocalInputValue(local), iso);
});

test('toLocalInputValue cai no agora quando não recebe data usável', () => {
  const agora = toLocalInputValue();
  assert.match(agora, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  assert.match(toLocalInputValue('não é data'), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
});

test('fromLocalInputValue devolve vazio para entrada inútil', () => {
  assert.equal(fromLocalInputValue(''), '');
  assert.equal(fromLocalInputValue('não é data'), '');
});

test('resolveStatus agenda só quando a data está no futuro', () => {
  const now = new Date('2026-07-29T15:00:00.000Z');
  assert.equal(resolveStatus('publish', '2026-07-30T09:00:00.000Z', now), 'scheduled');
  assert.equal(resolveStatus('publish', '2026-01-10T09:00:00.000Z', now), 'published');
  // O instante exato conta como agora, não como futuro: publica na hora.
  assert.equal(resolveStatus('publish', '2026-07-29T15:00:00.000Z', now), 'published');
  // Sem data ou com data quebrada, publicar significa publicar agora.
  assert.equal(resolveStatus('publish', '', now), 'published');
  assert.equal(resolveStatus('publish', 'não é data', now), 'published');
});

test('resolveStatus nunca publica quando a intenção é rascunho', () => {
  const now = new Date('2026-07-29T15:00:00.000Z');
  assert.equal(resolveStatus('draft', '2026-07-30T09:00:00.000Z', now), 'draft');
  assert.equal(resolveStatus('draft', '2026-01-10T09:00:00.000Z', now), 'draft');
  // Intenção desconhecida cai no lado seguro.
  assert.equal(resolveStatus(undefined, '2026-01-10T09:00:00.000Z', now), 'draft');
});
```

- [ ] **Step 2: Rodar o teste e conferir que falha**

Run: `npm run test:painel`
Expected: FAIL — `Cannot find module '../lib/publish-date.js'`

- [ ] **Step 3: Implementar `publish-date.js`**

Criar `painel/lib/publish-date.js`:

```js
// Ponte entre o <input type="datetime-local"> (horário local do navegador) e o
// timestamptz do Supabase (ISO UTC), mais a regra que decide o status gravado.

const pad = n => String(n).padStart(2, '0');

// ISO/timestamptz -> "YYYY-MM-DDTHH:mm" no fuso local (valor do input).
export function toLocalInputValue(iso) {
  const d = new Date(iso ?? Date.now());
  const ok = Number.isNaN(d.getTime()) ? new Date() : d;
  return `${ok.getFullYear()}-${pad(ok.getMonth() + 1)}-${pad(ok.getDate())}` +
    `T${pad(ok.getHours())}:${pad(ok.getMinutes())}`;
}

// Valor do input -> ISO UTC. Vazio/inválido devolve '' para o chamador poder
// omitir a chave do payload em vez de gravar lixo.
export function fromLocalInputValue(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

// intent ('publish' | 'draft') + data escolhida -> status gravado em mt_posts.
// Data no futuro agenda; passado ou agora publica (inclusive retroativo).
export function resolveStatus(intent, dateIso, now = new Date()) {
  if (intent !== 'publish') return 'draft';
  const d = new Date(dateIso || NaN);
  if (Number.isNaN(d.getTime())) return 'published';
  return d.getTime() > new Date(now).getTime() ? 'scheduled' : 'published';
}
```

- [ ] **Step 4: Rodar o teste e conferir que passa**

Run: `npm test`
Expected: PASS — 34 testes verdes (os 29 que já existiam + os 5 novos).

- [ ] **Step 5: Commit**

```bash
git add painel/lib/publish-date.js painel/test/publish-date.test.js
git commit -m "feat(painel): regra de data de publicacao (retroativa vs agendada)"
```

---

### Task 2: `buildPayload` grava a data e deriva o status

**Files:**
- Modify: `painel/lib/post-payload.js`
- Test: `painel/test/post-payload.test.js` (existente — atualizar)

**Interfaces:**
- Consumes: `resolveStatus` da Task 1.
- Produces: `buildPayload(form, now?) => row`. O `form` passa a aceitar `intent: 'draft'|'publish'` (no lugar do antigo `status`) e `date: string` (ISO UTC). A chave `date` só aparece na linha devolvida quando `form.date` é truthy.

**Contexto:** o campo `status` do form **deixa de existir**. O único chamador é `painel/screens/editor.js`, atualizado na Task 4.

- [ ] **Step 1: Atualizar o teste para o contrato novo (vai falhar)**

Substituir todo o conteúdo de `painel/test/post-payload.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPayload } from '../lib/post-payload.js';

const NOW = new Date('2026-07-29T15:00:00.000Z');

test('buildPayload achata o form e limpa o content', () => {
  const row = buildPayload({
    title: 'Novo Post', slug: 'novo-post',
    categoryName: 'Cuidados com a Pele', categoryColor: '#057f7f',
    content: '<p class="ql-align-center">Corpo</p><p><br></p>',
    excerpt: 'Resumo.', coverImage: 'https://img/capa.png',
    metaDescription: 'Meta.', seoTitle: 'SEO', ogImage: 'https://img/og.png',
    focusKeyword: 'pele', tags: ['pele'], intent: 'draft',
  }, NOW);
  assert.equal(row.category_name, 'Cuidados com a Pele');
  assert.equal(row.category_color, '#057f7f');
  assert.equal(row.content, '<p>Corpo</p>');
  assert.equal(row.status, 'draft');
  assert.equal('categoryName' in row, false);
  assert.equal('intent' in row, false);
  assert.equal('id' in row, false);
});

test('buildPayload usa defaults seguros', () => {
  const row = buildPayload({ title: 'X', slug: 'x' }, NOW);
  assert.equal(row.cover_image, '');
  assert.deepEqual(row.tags, []);
  assert.equal(row.status, 'draft');
});

test('buildPayload manda a data escolhida quando ela existe', () => {
  const row = buildPayload({ title: 'X', slug: 'x', intent: 'publish', date: '2026-01-10T09:00:00.000Z' }, NOW);
  assert.equal(row.date, '2026-01-10T09:00:00.000Z');
  assert.equal(row.status, 'published');
});

test('buildPayload omite a chave date quando não há data', () => {
  // Omitir preserva o default now() do Postgres no insert e a data já gravada
  // no update — mandar '' apagaria a data de um post antigo.
  const row = buildPayload({ title: 'X', slug: 'x', intent: 'publish' }, NOW);
  assert.equal('date' in row, false);
  assert.equal(row.status, 'published');
});

test('buildPayload agenda quando a data está no futuro', () => {
  const row = buildPayload({ title: 'X', slug: 'x', intent: 'publish', date: '2026-08-15T12:00:00.000Z' }, NOW);
  assert.equal(row.status, 'scheduled');
  assert.equal(row.date, '2026-08-15T12:00:00.000Z');
});
```

- [ ] **Step 2: Rodar o teste e conferir que falha**

Run: `npm run test:painel`
Expected: FAIL — `row.date` é `undefined` no teste da data escolhida e `row.status` é `'draft'` onde se espera `'published'`/`'scheduled'` (o `buildPayload` atual só olha `form.status`).

- [ ] **Step 3: Reescrever `post-payload.js`**

Substituir todo o conteúdo de `painel/lib/post-payload.js`:

```js
import { normalizeEditorHtml } from './clean-html.js';
import { resolveStatus } from './publish-date.js';

// Estado do formulário (camelCase) -> linha da tabela mt_posts (snake_case).
// intent default 'draft' (seguro: nada vai pro ar sem escolha explícita);
// a data escolhida é quem decide entre published (agora/retroativo) e scheduled.
export function buildPayload(form = {}, now = new Date()) {
  const row = {
    slug: form.slug || '',
    title: form.title || '',
    category_name: form.categoryName || '',
    category_color: form.categoryColor || '',
    cover_image: form.coverImage || '',
    excerpt: form.excerpt || '',
    content: normalizeEditorHtml(form.content || ''),
    meta_description: form.metaDescription || '',
    seo_title: form.seoTitle || '',
    og_image: form.ogImage || '',
    focus_keyword: form.focusKeyword || '',
    tags: Array.isArray(form.tags) ? form.tags : [],
    status: resolveStatus(form.intent, form.date, now),
  };
  // Sem data no formulário a chave fica de fora: no insert vale o default now()
  // do Postgres e no update a data já gravada é preservada.
  if (form.date) row.date = form.date;
  return row;
}
```

- [ ] **Step 4: Rodar os testes e conferir que passam**

Run: `npm test`
Expected: PASS — 37 testes verdes (`post-payload` sobe de 2 para 5 casos).

- [ ] **Step 5: Commit**

```bash
git add painel/lib/post-payload.js painel/test/post-payload.test.js
git commit -m "feat(painel): payload envia date e deriva status pela data"
```

---

### Task 3: Migration SQL do status `scheduled`

**Files:**
- Create: `supabase/scheduled-marcio.sql`
- Modify: `supabase/schema-marcio.sql:22` (check constraint) e após `:28` (índice)

**Interfaces:**
- Consumes: nada.
- Produces: a coluna `mt_posts.status` passa a aceitar `'scheduled'`; índice parcial `mt_posts_scheduled_idx` sobre `(date) where status = 'scheduled'`, usado pela consulta do cron na Task 6.

**Contexto:** o check constraint atual é inline na criação da coluna, então o Postgres o nomeou automaticamente `mt_posts_status_check`. É esse nome que a migration derruba.

- [ ] **Step 1: Escrever a migration**

Criar `supabase/scheduled-marcio.sql`:

```sql
-- Blog Dr. Márcio — agendamento de posts. Projeto Supabase COMPARTILHADO com o
-- HD360, por isso o prefixo mt_. Aplicar uma vez no SQL Editor, depois de
-- schema-marcio.sql. Idempotente: pode rodar de novo sem estragar nada.

-- O check original foi criado inline na coluna, então o Postgres o nomeou
-- mt_posts_status_check. Trocar por um que também aceite 'scheduled'.
alter table public.mt_posts drop constraint if exists mt_posts_status_check;
alter table public.mt_posts add constraint mt_posts_status_check
  check (status in ('draft','published','scheduled'));

-- O cron do GitHub Actions consulta só agendados vencidos, de 30 em 30 minutos.
-- O índice parcial mantém essa consulta barata mesmo com o blog crescendo.
create index if not exists mt_posts_scheduled_idx
  on public.mt_posts (date) where status = 'scheduled';
```

- [ ] **Step 2: Refletir a mudança no schema base**

Em `supabase/schema-marcio.sql`, trocar a linha 22:

```sql
  status           text not null default 'draft' check (status in ('draft','published')),
```

por:

```sql
  status           text not null default 'draft' check (status in ('draft','published','scheduled')),
```

E, logo depois do índice `mt_posts_date_idx` (linha 28), acrescentar:

```sql
create index if not exists mt_posts_scheduled_idx on public.mt_posts (date) where status = 'scheduled';
```

Assim um setup do zero já nasce pronto e não precisa da migration.

- [ ] **Step 3: Conferir que a suíte segue verde**

Run: `npm test`
Expected: PASS — nenhum teste toca SQL, mas isso confirma que nada quebrou.

- [ ] **Step 4: Commit**

```bash
git add supabase/scheduled-marcio.sql supabase/schema-marcio.sql
git commit -m "feat(db): status scheduled em mt_posts + indice parcial"
```

- [ ] **Step 5: CHECKPOINT MANUAL — o usuário aplica a migration**

Este passo **não pode ser feito por um agente**: exige acesso ao dashboard.

Pedir ao usuário:

> Abra o SQL Editor do projeto Supabase `euzmbswywwhmicjlszqw`, cole o conteúdo de `supabase/scheduled-marcio.sql` e rode. Depois confirme que voltou "Success. No rows returned".

Sem esse passo, salvar um post agendado no painel falha com erro de check constraint (`23514`). Não seguir para a Task 4 sem a confirmação.

---

### Task 4: Campo de data e botão reativo no editor

**Files:**
- Modify: `painel/screens/editor.js`

**Interfaces:**
- Consumes: `toLocalInputValue`, `fromLocalInputValue`, `resolveStatus` (Task 1); `buildPayload(form, now?)` com `intent`/`date` (Task 2).
- Produces: nada para outras tasks.

**Contexto:** `editor.js` é uma tela e, pela convenção do repo, não tem teste automatizado — a verificação é no browser. Toda a lógica testável já saiu para `publish-date.js` na Task 1.

- [ ] **Step 1: Importar o módulo de data**

Em `painel/screens/editor.js`, junto dos outros imports do topo, acrescentar:

```js
import { toLocalInputValue, fromLocalInputValue, resolveStatus } from '../lib/publish-date.js';
```

- [ ] **Step 2: Adicionar o campo de data no HTML da seção "Organização"**

Ainda em `editor.js`, dentro do template da segunda `<section class="panel panel--pad">` (a que começa com `<p class="eyebrow">Organização</p>`), **depois** do campo de slug e antes do fechamento `</section>`, inserir:

```html
        <div class="field">
          <label class="field__label" for="f-date">Data de publicação</label>
          <input class="input" id="f-date" type="datetime-local" value="${escapeHtml(toLocalInputValue(existing?.date))}" />
          <p class="field__help" id="date-help"></p>
        </div>
```

- [ ] **Step 3: Ligar o campo ao botão primário**

Logo abaixo da linha que declara `titleEl`, `slugEl`, `catEl`, `catColorEl`, acrescentar as referências novas:

```js
  const dateEl = $('#f-date'), dateHelp = $('#date-help'), publishBtn = $('#btn-publish');
```

E, junto dos outros `addEventListener` de campo (perto do listener de `catEl`), acrescentar:

```js
  dateEl.addEventListener('input', refreshPublishBtn);
```

Depois, junto das outras funções `refresh*`, acrescentar:

```js
  // O rótulo do botão sai da mesma função que decide o status gravado, então
  // o que está escrito no botão nunca diverge do que vai acontecer.
  function refreshPublishBtn() {
    const agendado = resolveStatus('publish', fromLocalInputValue(dateEl.value)) === 'scheduled';
    publishBtn.textContent = agendado ? 'Agendar' : 'Publicar';
    dateHelp.textContent = agendado
      ? 'O post entra no ar sozinho nesse horário (com folga de até 30 minutos).'
      : 'Data no passado publica o post com essa data (retroativo).';
  }
```

- [ ] **Step 4: Trocar `save(status)` por `save(intent)`**

Na função `save`, trocar a assinatura e o objeto `form`:

```js
  async function save(intent) {
    const form = {
```

Dentro do objeto `form`, trocar a linha `status,` por:

```js
      date: fromLocalInputValue(dateEl.value),
      intent,
```

E trocar a linha do toast de sucesso:

```js
    toast(status === 'published' ? 'Post publicado.' : 'Rascunho salvo.', 'ok');
```

por:

```js
    toast(SAVED_MSG[payload.status], 'ok');
```

Acrescentar, no topo do arquivo (depois dos imports, antes de `export async function renderEditor`):

```js
const SAVED_MSG = { published: 'Post publicado.', scheduled: 'Post agendado.', draft: 'Rascunho salvo.' };
```

- [ ] **Step 5: Atualizar os handlers dos botões e a inicialização**

Trocar as duas linhas dos handlers:

```js
  $('#btn-draft').addEventListener('click', () => save('draft'));
  $('#btn-publish').addEventListener('click', () => save('publish'));
```

E, na última linha da função (`refreshMeta(); refreshSerp();`), acrescentar a nova:

```js
  refreshMeta(); refreshSerp(); refreshPublishBtn();
```

- [ ] **Step 6: Rodar os testes**

Run: `npm test`
Expected: PASS — os testes de `lib/` cobrem a regra; a tela não tem teste.

- [ ] **Step 7: Verificar no browser**

Servir o painel e abrir `#/editor`:

```bash
npx --yes serve . -l 4173
```

Conferir, em `http://localhost:4173/painel/`:
1. O campo "Data de publicação" aparece na seção Organização, preenchido com a data/hora de agora.
2. Mudando a data para amanhã, o botão vira **"Agendar"** e o texto de ajuda muda.
3. Voltando a data para ontem, o botão vira **"Publicar"**.
4. Salvando com data de ontem: o toast diz "Post publicado." e o post aparece na lista com a data de ontem.
5. Salvando com data de amanhã: o toast diz "Post agendado."
6. Abrindo um post já salvo para editar: o campo vem preenchido com a data gravada, não com o agora.

- [ ] **Step 8: Commit**

```bash
git add painel/screens/editor.js
git commit -m "feat(painel): campo de data de publicacao com botao agendar/publicar"
```

---

### Task 5: Aba "Agendados" e badge na lista

**Files:**
- Modify: `painel/screens/list.js`
- Modify: `painel/styles.css`

**Interfaces:**
- Consumes: o status `'scheduled'` gravado pelas Tasks 2–4.
- Produces: nada para outras tasks.

- [ ] **Step 1: Adicionar os tokens de cor**

Em `painel/styles.css`, no bloco `:root`, logo depois da linha dos papéis funcionais que define `--warn` (linha 19), acrescentar:

```css
  --sched:#5b7fa6; --sched-ink:#3d5f85; --sched-soft:#e9eff6;
```

Azul-ardósia frio de propósito: âmbar já é Rascunho e verde/teal já é Publicado, então os três estados precisam de famílias de cor distintas para serem lidos de relance.

- [ ] **Step 2: Adicionar a regra do badge**

Na seção `/* ===== 3. Status badge */` de `painel/styles.css`, depois das regras `.badge--draft`, acrescentar:

```css
.badge--sched{ background:var(--sched-soft); color:var(--sched-ink); }
.badge--sched .badge__dot{ background:var(--sched); }
```

- [ ] **Step 3: Adicionar a aba de filtro**

Em `painel/screens/list.js`, dentro do `<div class="seg" ...>`, entre os botões `published` e `draft`, inserir:

```html
          <button class="seg__btn" data-filter="scheduled" role="tab">Agendados</button>
```

Nenhuma mudança na lógica de filtro é necessária: `draw()` já faz `posts.filter(p => p.status === filter)` e a query já traz `status`.

- [ ] **Step 4: Ensinar o badge a reconhecer o terceiro status**

Substituir a função `badge` no fim de `painel/screens/list.js`:

```js
function badge(status) {
  if (status === 'published') return '<span class="badge badge--pub"><span class="badge__dot"></span>Publicado</span>';
  if (status === 'scheduled') return '<span class="badge badge--sched"><span class="badge__dot"></span>Agendado</span>';
  return '<span class="badge badge--draft"><span class="badge__dot"></span>Rascunho</span>';
}
```

- [ ] **Step 5: Rodar os testes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Verificar no browser**

Com o servidor da Task 4 rodando, em `http://localhost:4173/painel/#/posts`:
1. A aba "Agendados" aparece entre "Publicados" e "Rascunhos" e filtra corretamente.
2. O post agendado na Task 4 mostra o badge azul "Agendado" com a data futura na coluna Data.
3. Os badges "Publicado" (verde) e "Rascunho" (âmbar) continuam distinguíveis do novo.

- [ ] **Step 7: Commit**

```bash
git add painel/screens/list.js painel/styles.css
git commit -m "feat(painel): aba e badge de posts agendados na lista"
```

---

### Task 6: Cron que promove os agendados vencidos

**Files:**
- Modify: `.github/workflows/publish-blog.yml`

**Interfaces:**
- Consumes: o status `'scheduled'` (Task 3) e os secrets `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` já configurados no repo.
- Produces: nada para outras tasks. É o último elo.

**Contexto:** hoje o workflow tem um único job `build`. Ele passa a ter dois: `gate` (decide) e `build` (o job atual, sem alteração interna, condicionado ao gate). O `build-blog.mjs` não muda porque a promoção acontece no banco antes dele rodar.

- [ ] **Step 1: Adicionar o gatilho de cron**

Em `.github/workflows/publish-blog.yml`, no bloco `on:`, depois de `workflow_dispatch: {}`, acrescentar:

```yaml
  # A cada 30 min, só para ver se algum post agendado venceu. Quando não há
  # nada vencido, o job `gate` termina em segundos e o `build` nem começa.
  schedule:
    - cron: '0,30 * * * *'
```

- [ ] **Step 2: Criar o job `gate`**

Ainda em `publish-blog.yml`, dentro de `jobs:`, **antes** do job `build`, inserir:

```yaml
  gate:
    runs-on: ubuntu-latest
    outputs:
      build: ${{ steps.check.outputs.build }}
    steps:
      - name: Promover posts agendados vencidos
        id: check
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          EVENTO: ${{ github.event_name }}
        run: |
          set -euo pipefail

          # Publicação manual (botão "Atualizar site" ou disparo manual):
          # constrói direto, sem nem tocar no banco.
          if [ "$EVENTO" != "schedule" ]; then
            echo "build=true" >> "$GITHUB_OUTPUT"
            echo "Evento $EVENTO — build direto."
            exit 0
          fi

          # Falhar alto: um agendamento que não vai ao ar por secret ausente
          # precisa aparecer como erro vermelho, não como execução verde.
          if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_SERVICE_KEY:-}" ]; then
            echo "::error::Secrets SUPABASE_URL/SUPABASE_SERVICE_KEY ausentes — agendamentos nao seriam publicados."
            exit 1
          fi

          # Um único carimbo de tempo serve para consultar e para promover,
          # senão um post poderia vencer entre as duas chamadas e escapar.
          agora=$(date -u +%Y-%m-%dT%H:%M:%SZ)
          filtro="status=eq.scheduled&date=lte.$agora"

          vencidos=$(curl -sS --fail-with-body \
            "$SUPABASE_URL/rest/v1/mt_posts?$filtro&select=id,slug" \
            -H "apikey: $SUPABASE_SERVICE_KEY" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_KEY")

          if [ "$vencidos" = "[]" ]; then
            echo "build=false" >> "$GITHUB_OUTPUT"
            echo "Nenhum post agendado venceu ate $agora."
            exit 0
          fi

          echo "Promovendo: $vencidos"
          curl -sS --fail-with-body -X PATCH \
            "$SUPABASE_URL/rest/v1/mt_posts?$filtro" \
            -H "apikey: $SUPABASE_SERVICE_KEY" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
            -H "Content-Type: application/json" \
            -d '{"status":"published"}'

          echo "build=true" >> "$GITHUB_OUTPUT"
```

O filtro promove **todos** os vencidos, não só o do slot atual — assim um cron que o GitHub atrasar ou pular se resolve sozinho na execução seguinte.

- [ ] **Step 3: Condicionar o job `build` ao gate**

No job `build`, logo depois da linha `build:` e antes de `runs-on: ubuntu-latest`, acrescentar:

```yaml
    needs: gate
    if: needs.gate.outputs.build == 'true'
```

Nenhum passo interno do `build` muda — inclusive o último, "Liberar flag de publicação (mesmo se falhar)", mantém seu `if: always()`, já que agora ele só existe dentro de um job que só roda quando há o que publicar.

- [ ] **Step 4: Validar a sintaxe do YAML**

Run:
```bash
node -e "const s=require('fs').readFileSync('.github/workflows/publish-blog.yml','utf8'); if(!/^jobs:/m.test(s)) throw new Error('sem jobs'); for (const j of ['  gate:','  build:']) if(!s.includes(j)) throw new Error('faltou '+j); console.log('estrutura ok');"
```
Expected: `estrutura ok`

(O repo não tem parser de YAML instalado e a constraint global proíbe dependência nova. A validação real vem do próprio GitHub no Step 6 — um YAML inválido faz o workflow nem aparecer na aba Actions.)

- [ ] **Step 5: Commit e push**

```bash
git add .github/workflows/publish-blog.yml
git commit -m "feat(ci): cron de 30min promove posts agendados antes do build"
git push
```

O push é necessário aqui: o GitHub só reconhece `schedule:` a partir do arquivo já presente no branch padrão.

- [ ] **Step 6: CHECKPOINT MANUAL — validar o cron de ponta a ponta**

Este passo depende de esperar o relógio e de olhar a aba Actions.

Primeiro, conferir que o caminho manual não regrediu:

```bash
gh workflow run "Publicar blog"
gh run watch
```

Esperado: `gate` devolve `build=true` ("Evento workflow_dispatch — build direto") e o `build` roda inteiro, terminando com o deploy FTP.

Depois, o caminho agendado. Pedir ao usuário:

> No painel, agende um post de teste para daqui a ~5 minutos e espere o próximo slot de `:00` ou `:30` (o cron do GitHub costuma atrasar alguns minutos além disso). Confirme na aba Actions que rodou uma execução em que o `gate` diz "Promovendo: [...]", o `build` executou, e o post apareceu no `/blog.html` publicado. Confirme também que, na execução de cron seguinte (sem nada agendado), o `gate` diz "Nenhum post agendado venceu" e o `build` aparece como *skipped*.

Depois de validado, apagar o post de teste pelo painel.

**Alerta a passar ao usuário:** o GitHub desativa workflows agendados após **60 dias sem nenhuma atividade no repositório**. Este repo recebe commits automáticos a cada publicação, então na prática não deve acontecer — mas se o blog ficar dois meses parado, o cron precisa ser reativado na aba Actions.

---

## Resumo da verificação final

Ao fim das 6 tasks, com a migration aplicada e o workflow no ar:

| O que | Como conferir |
|---|---|
| `npm test` verde | 37 testes: os 29 que já existiam + 5 de `publish-date` + 3 novos de `post-payload` |
| Data retroativa | Publicar post com data de ontem → aparece no blog com a data de ontem, ordenado abaixo dos mais novos |
| Agendamento | Post com data futura fica `scheduled`, some do `/blog.html`, e entra sozinho no próximo cron vencido |
| Nada vaza | Com o post agendado no banco, `curl` no `/blog.html` publicado não traz o slug dele |
| Build ocioso | Execução de cron sem agendado vencido: `gate` ~10s, `build` skipped, sem FTP |
