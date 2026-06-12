# Blog — Fase 2: Painel Administrativo (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar o painel `/painel/` onde o Dr. Márcio faz login e cria/edita/exclui artigos do blog (rascunho ou publicado), com editor rich-text, upload de imagens, SEO e **categorias livres** — portado do HD360 e re-skinado na identidade da marca.

**Architecture:** SPA vanilla (ES modules) servido estaticamente em `/painel/`. Fala direto com o Supabase (Auth + tabela `mt_posts` + Storage `marcio-blog-images`) via SDK do CDN. Quill 1.3.7 para o corpo. Reaproveita a lógica testada do painel do HD360; a única mudança de comportamento é a categoria, que deixa de ser lista fixa e passa a ser campo livre + cor, com sugestão das já usadas. O botão "Atualizar site" já é cabeado para `publish-marcio`/`mt_site_meta`, mas só fica funcional após a Fase 3 (backend).

**Tech Stack:** Vanilla JS ESM, Quill 1.3.7 (CDN), `@supabase/supabase-js@2` (CDN), `node --test` para as libs puras, CSS próprio (`painel/styles.css`) reusando os tokens da marca.

**Pré-requisitos (já providenciados pelo Freela In Home):** `mt_posts` criada (rodar `supabase/schema-marcio.sql` se ainda não rodou), bucket público `marcio-blog-images`, e um usuário de login no Supabase Auth. A anon key é a mesma do projeto compartilhado.

**Referência de port:** o painel original está em `E:\Clientes\Grupo Libertad\HD 360 Moinhos\Site\hd360-project\painel\`. Onde uma tarefa disser "copie de <arquivo HD360>", copie o conteúdo e aplique só as mudanças indicadas.

---

## Estrutura de arquivos

**Criar (tudo sob `painel/`):**
- `painel/package.json` — `{"type":"module"}` + nada mais (as libs do painel são ESM `.js`).
- `painel/config.js` — URL, anon key, nomes de tabela/bucket/função (sem lista fixa de categorias).
- `painel/index.html` — shell (login-root + app-root + toasts), fonts da marca, Quill CSS.
- `painel/styles.css` — re-skin (bloco `:root` da marca + aliases; componentes inalterados).
- `painel/app.js` — shell do app, rotas (#/posts, #/editor), auth, controle de publicação.
- `painel/screens/login.js` — tela de login.
- `painel/screens/list.js` — lista de posts (filtros, excluir).
- `painel/screens/editor.js` — editor (Quill, capa, tags, SEO, **categoria livre + cor**).
- `painel/lib/ui.js` — toast + escapeHtml.
- `painel/lib/slug.js` — slugify.
- `painel/lib/clean-html.js` — normaliza HTML do Quill.
- `painel/lib/post-payload.js` — form → linha do banco.
- `painel/lib/seo.js` — contador de meta + prévia SERP (domínio da marca).
- `painel/lib/upload.js` — upload pro bucket.
- `painel/lib/categories.js` — **novo**: categorias distintas já usadas (para o datalist).
- `painel/lib/publish.js` — estado/disparo de publicação (cabeado p/ Fase 3).
- `painel/test/*.test.js` — testes das libs puras.

**Modificar:**
- `package.json` (raiz) — script `test:painel` e incluir os testes do painel no `test`.

---

## Task 1: `painel/package.json` + `painel/config.js`

**Files:**
- Create: `painel/package.json`, `painel/config.js`

- [ ] **Step 1: package.json do painel**

Create `painel/package.json`:

```json
{
  "name": "marciodermato-painel",
  "version": "1.0.0",
  "private": true,
  "type": "module"
}
```

- [ ] **Step 2: config.js**

Create `painel/config.js`. Copie a `SUPABASE_ANON_KEY` REAL de `E:\Clientes\Grupo Libertad\HD 360 Moinhos\Site\hd360-project\painel\config.js` (mesma do projeto compartilhado):

```js
// Configuração pública do painel do Dr. Márcio. A anon key é segura por design
// (RLS no banco). Projeto Supabase COMPARTILHADO com o HD360 — por isso os nomes
// prefixados com mt_ / marcio- para isolar.
export const SUPABASE_URL = 'https://euzmbswywwhmicjlszqw.supabase.co';
export const SUPABASE_ANON_KEY = 'COLE_A_ANON_KEY_REAL_DO_CONFIG_DO_HD360';

export const POSTS_TABLE = 'mt_posts';
export const SITE_META_TABLE = 'mt_site_meta';
export const STORAGE_BUCKET = 'marcio-blog-images';
export const PUBLISH_FN = 'publish-marcio';

// Cor padrão sugerida ao criar uma categoria nova (teal da marca).
export const DEFAULT_CATEGORY_COLOR = '#057f7f';
```

- [ ] **Step 3: Verificar**

Run: `node --check painel/config.js && node -e "import('./painel/config.js').then(m=>console.log(m.POSTS_TABLE, m.STORAGE_BUCKET, m.PUBLISH_FN))"`
Expected: `mt_posts marcio-blog-images publish-marcio`. Confirme que a anon key não contém o caractere cirílico e tem 3 segmentos separados por ponto.

- [ ] **Step 4: Commit**

```bash
git add painel/package.json painel/config.js
git commit -m "feat(painel): config do painel (tabela/bucket/função isolados)"
```

---

## Task 2: Libs puras de port — `ui.js`, `slug.js`, `clean-html.js`

**Files:**
- Create: `painel/lib/ui.js`, `painel/lib/slug.js`, `painel/lib/clean-html.js`
- Test: `painel/test/slug.test.js`, `painel/test/clean-html.test.js`

Estes três são cópias byte-a-byte do HD360 (não precisam de adaptação).

- [ ] **Step 1: Copiar os 3 arquivos**

Copie verbatim:
- `…/hd360-project/painel/lib/ui.js` → `painel/lib/ui.js`
- `…/hd360-project/painel/lib/slug.js` → `painel/lib/slug.js`
- `…/hd360-project/painel/lib/clean-html.js` → `painel/lib/clean-html.js`

Para referência, o conteúdo esperado de cada um:

`painel/lib/ui.js`:
```js
// Toast acessível (verde=ok, rosa=erro, azul=info). Some sozinho.
export function toast(message, kind = 'ok') {
  const host = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = `toast toast--${kind}`;
  el.innerHTML = `<span class="toast__dot"></span>${escapeHtml(message)}`;
  host.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// Escapa texto para inserção segura em HTML (títulos de posts vêm do usuário).
export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
```

`painel/lib/slug.js`:
```js
// Título -> slug de URL: minúsculo, sem acento, só [a-z0-9-], hífens colapsados.
export function slugify(title) {
  return String(title ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

`painel/lib/clean-html.js`:
```js
// Limpa a saída do editor (Quill): tira classes ql-* e parágrafos vazios.
export function normalizeEditorHtml(html) {
  return String(html ?? '')
    .replace(/\s*class="[^"]*\bql-[^"]*"/g, '')
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .trim();
}
```

- [ ] **Step 2: Testes (port)**

Create `painel/test/slug.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../lib/slug.js';

test('slugify remove acentos e normaliza', () => {
  assert.equal(slugify('Proteção Solar Diária'), 'protecao-solar-diaria');
  assert.equal(slugify('  Olá, Mundo!  '), 'ola-mundo');
  assert.equal(slugify(''), '');
});
```

Create `painel/test/clean-html.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEditorHtml } from '../lib/clean-html.js';

test('normalizeEditorHtml tira classes ql-* e parágrafos vazios', () => {
  assert.equal(normalizeEditorHtml('<p class="ql-align-center">Oi</p><p><br></p>'), '<p>Oi</p>');
  assert.equal(normalizeEditorHtml('<p></p>'), '');
});
```

- [ ] **Step 3: Rodar**

Run: `node --test painel/test/slug.test.js painel/test/clean-html.test.js`
Expected: PASS (2 tests).

- [ ] **Step 4: Commit**

```bash
git add painel/lib/ui.js painel/lib/slug.js painel/lib/clean-html.js painel/test/slug.test.js painel/test/clean-html.test.js
git commit -m "feat(painel): libs ui/slug/clean-html (port)"
```

---

## Task 3: `post-payload.js` (port)

**Files:**
- Create: `painel/lib/post-payload.js`
- Test: `painel/test/post-payload.test.js`

- [ ] **Step 1: Implementar (cópia do HD360)**

Create `painel/lib/post-payload.js`:
```js
import { normalizeEditorHtml } from './clean-html.js';

// Estado do formulário (camelCase) -> linha da tabela mt_posts (snake_case).
// status default 'draft' (seguro: nada vai pro ar sem escolha explícita).
export function buildPayload(form = {}) {
  return {
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
    status: form.status === 'published' ? 'published' : 'draft',
  };
}
```

- [ ] **Step 2: Teste**

Create `painel/test/post-payload.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPayload } from '../lib/post-payload.js';

test('buildPayload achata o form e limpa o content', () => {
  const row = buildPayload({
    title: 'Novo Post', slug: 'novo-post',
    categoryName: 'Cuidados com a Pele', categoryColor: '#057f7f',
    content: '<p class="ql-align-center">Corpo</p><p><br></p>',
    excerpt: 'Resumo.', coverImage: 'https://img/capa.png',
    metaDescription: 'Meta.', seoTitle: 'SEO', ogImage: 'https://img/og.png',
    focusKeyword: 'pele', tags: ['pele'], status: 'draft',
  });
  assert.equal(row.category_name, 'Cuidados com a Pele');
  assert.equal(row.category_color, '#057f7f');
  assert.equal(row.content, '<p>Corpo</p>');
  assert.equal(row.status, 'draft');
  assert.equal('categoryName' in row, false);
  assert.equal('id' in row, false);
});

test('buildPayload usa defaults seguros', () => {
  const row = buildPayload({ title: 'X', slug: 'x' });
  assert.equal(row.cover_image, '');
  assert.deepEqual(row.tags, []);
  assert.equal(row.status, 'draft');
});
```

- [ ] **Step 3: Rodar**

Run: `node --test painel/test/post-payload.test.js`
Expected: PASS (2 tests).

- [ ] **Step 4: Commit**

```bash
git add painel/lib/post-payload.js painel/test/post-payload.test.js
git commit -m "feat(painel): payload form->mt_posts (port)"
```

---

## Task 4: `seo.js` (adaptado ao domínio da marca)

**Files:**
- Create: `painel/lib/seo.js`
- Test: `painel/test/seo.test.js`

- [ ] **Step 1: Teste primeiro (TDD)**

Create `painel/test/seo.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { metaState, serp } from '../lib/seo.js';

test('metaState classifica o comprimento da meta description', () => {
  assert.deepEqual(metaState(''), { count: 0, level: 'empty' });
  assert.equal(metaState('x'.repeat(140)).level, 'ok');
  assert.equal(metaState('x'.repeat(175)).level, 'over');
});

test('serp usa o domínio e o sufixo da marca', () => {
  const full = serp({ title: 'Proteção Solar', slug: 'protecao-solar',
    seoTitle: 'Proteção Solar · Dr. Márcio', metaDescription: 'Resumo SEO.' });
  assert.equal(full.title, 'Proteção Solar · Dr. Márcio');
  assert.equal(full.url, 'drmarcioteixeira.com.br › blog › protecao-solar');

  const fallback = serp({ title: 'Acne', slug: 'acne', excerpt: 'Texto.' });
  assert.equal(fallback.title, 'Acne · Dr. Márcio Teixeira');
  assert.equal(fallback.desc, 'Texto.');
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test painel/test/seo.test.js`
Expected: FAIL (módulo não encontrado).

- [ ] **Step 3: Implementar**

Create `painel/lib/seo.js`:
```js
// Estado do contador da meta description (faixa recomendada 120–160).
export function metaState(text, { min = 120, max = 160 } = {}) {
  const count = String(text ?? '').length;
  let level = 'ok';
  if (count === 0) level = 'empty';
  else if (count < min) level = 'short';
  else if (count > max) level = 'over';
  return { count, level };
}

// Prévia estilo Google (SERP), com fallbacks sensatos.
export function serp({ title = '', slug = '', seoTitle = '', metaDescription = '', excerpt = '' } = {}) {
  return {
    title: seoTitle.trim() || `${title} · Dr. Márcio Teixeira`,
    url: `drmarcioteixeira.com.br › blog › ${slug}`,
    desc: (metaDescription.trim() || excerpt.trim()).slice(0, 160),
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `node --test painel/test/seo.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add painel/lib/seo.js painel/test/seo.test.js
git commit -m "feat(painel): SEO/SERP no domínio da marca"
```

---

## Task 5: `upload.js` (port, bucket via config)

**Files:**
- Create: `painel/lib/upload.js`

- [ ] **Step 1: Implementar**

Create `painel/lib/upload.js` (idêntico ao HD360; o bucket vem do config, que já é `marcio-blog-images`):
```js
import { STORAGE_BUCKET } from '../config.js';

// Sobe uma imagem pro bucket público e devolve a URL pública absoluta.
export async function uploadImage(supabase, file) {
  const safe = file.name.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9.]+/g, '-').toLowerCase();
  const path = `posts/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
```

- [ ] **Step 2: Verificar sintaxe**

Run: `node --check painel/lib/upload.js`
Expected: sem erro.

- [ ] **Step 3: Commit**

```bash
git add painel/lib/upload.js
git commit -m "feat(painel): upload de imagem para o bucket da marca"
```

---

## Task 6: `categories.js` (novo — categorias livres)

**Files:**
- Create: `painel/lib/categories.js`
- Test: `painel/test/categories.test.js`

Lê as categorias distintas já usadas em `mt_posts` para alimentar o `datalist` do editor (nome → cor, primeira ocorrência).

- [ ] **Step 1: Teste primeiro (TDD)**

Create `painel/test/categories.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dedupeCategories } from '../lib/categories.js';

test('dedupeCategories devolve nome→cor distintos (primeira ocorrência)', () => {
  const rows = [
    { category_name: 'Pele', category_color: '#057f7f' },
    { category_name: 'Pele', category_color: '#000000' },
    { category_name: 'Cabelo', category_color: '#a87a4e' },
    { category_name: '', category_color: '#fff' },
  ];
  assert.deepEqual(dedupeCategories(rows), [
    { name: 'Pele', color: '#057f7f' },
    { name: 'Cabelo', color: '#a87a4e' },
  ]);
});

test('dedupeCategories tolera vazio', () => {
  assert.deepEqual(dedupeCategories(null), []);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test painel/test/categories.test.js`
Expected: FAIL (módulo não encontrado).

- [ ] **Step 3: Implementar**

Create `painel/lib/categories.js`:
```js
import { POSTS_TABLE, DEFAULT_CATEGORY_COLOR } from '../config.js';

// Reduz linhas {category_name, category_color} a uma lista distinta por nome
// (primeira cor vista vence). Puro e testável.
export function dedupeCategories(rows) {
  const map = new Map();
  for (const r of (rows || [])) {
    const name = (r.category_name || '').trim();
    if (name && !map.has(name)) map.set(name, r.category_color || DEFAULT_CATEGORY_COLOR);
  }
  return [...map].map(([name, color]) => ({ name, color }));
}

// Busca as categorias já usadas no banco (para o datalist do editor).
export async function fetchCategories(supabase) {
  const { data, error } = await supabase.from(POSTS_TABLE).select('category_name,category_color');
  if (error || !data) return [];
  return dedupeCategories(data);
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `node --test painel/test/categories.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add painel/lib/categories.js painel/test/categories.test.js
git commit -m "feat(painel): categorias livres (distintas do banco)"
```

---

## Task 7: `publish.js` (adaptado — cabeado p/ Fase 3)

**Files:**
- Create: `painel/lib/publish.js`
- Test: `painel/test/publish.test.js`

- [ ] **Step 1: Teste primeiro (TDD)**

Create `painel/test/publish.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publishUiState } from '../lib/publish.js';

test('publishUiState reflete dirty/publishing', () => {
  assert.deepEqual(publishUiState({ publishing: true }),
    { flagVisible: false, btnLabel: 'Publicando…', btnDisabled: true });
  assert.deepEqual(publishUiState({ dirty: true, publishing: false }),
    { flagVisible: true, btnLabel: 'Atualizar site', btnDisabled: false });
  assert.deepEqual(publishUiState({ dirty: false, publishing: false }),
    { flagVisible: false, btnLabel: 'Atualizar site', btnDisabled: false });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test painel/test/publish.test.js`
Expected: FAIL (módulo não encontrado).

- [ ] **Step 3: Implementar**

Create `painel/lib/publish.js`:
```js
import { SITE_META_TABLE, PUBLISH_FN } from '../config.js';

// Estado puro do controle "Atualizar site" a partir do mt_site_meta.
export function publishUiState({ dirty, publishing } = {}) {
  if (publishing) return { flagVisible: false, btnLabel: 'Publicando…', btnDisabled: true };
  return { flagVisible: !!dirty, btnLabel: 'Atualizar site', btnDisabled: false };
}

// Lê o estado de publicação (linha única id=1). Tolera ausência (Fase 3 cria a tabela).
export async function fetchSiteMeta(supabase) {
  const { data, error } = await supabase
    .from(SITE_META_TABLE).select('dirty,publishing,last_published_at').eq('id', 1).single();
  if (error) return { dirty: false, publishing: false };
  return data;
}

// Invoca a Edge Function que dispara o rebuild (existe a partir da Fase 3).
export async function requestPublish(supabase) {
  const { data, error } = await supabase.functions.invoke(PUBLISH_FN, { body: {} });
  if (error) throw error;
  return data;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `node --test painel/test/publish.test.js`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add painel/lib/publish.js painel/test/publish.test.js
git commit -m "feat(painel): controle de publicação (cabeado p/ fase 3)"
```

---

## Task 8: `styles.css` — re-skin na identidade da marca

**Files:**
- Create: `painel/styles.css`

A estratégia: copiar a `styles.css` do HD360 inteira, mas **substituir o `@font-face` + o bloco `:root`** por tokens da marca + **aliases** que recolorem todos os componentes sem reescrevê-los, e ajustar a `.state__art` (que usava arte do HD360).

- [ ] **Step 1: Copiar a base**

Copie `…/hd360-project/painel/styles.css` → `painel/styles.css`.

- [ ] **Step 2: Substituir o topo do arquivo**

Substitua TUDO do início do arquivo até o fim do bloco `:root{...}` (linhas 1–36 no original, do comentário de cabeçalho passando pelo `@font-face` até fechar o `:root`) por:

```css
/* Painel Dr. Márcio — estilos. Re-skin do painel HD360 nos tokens da marca:
   teal + Cormorant Garamond × Poppins. Componentes herdados via aliases de cor. */
*,*::before,*::after{ box-sizing:border-box; }
html,body{ margin:0; }
[hidden]{ display:none !important; }

:root{
  /* Paleta da marca */
  --marca:#057f7f; --marca-deep:#044d4d; --marca-bright:#19b3a6; --marca-ink:#055f5f;
  --marca-soft:#e8f4f4; --marca-wash:#f1f8f8;
  /* Superfícies e tinta */
  --branco:#ffffff; --creme:#f4f9f9; --creme-deep:#eaf3f3;
  --tinta:#16302f; --tinta-muted:#566b6a; --tinta-soft:#8aa0a0;
  --linha:rgba(5,127,127,0.12); --linha-forte:rgba(5,127,127,0.22);
  --app-bg:#f4f9f9; --surface:#ffffff; --sidebar:#ffffff;
  /* Papéis funcionais */
  --danger:#d6455d; --danger-ink:#b32d44; --danger-soft:#fbe8eb;
  --ok:#19b3a6; --ok-ink:#0f7f76; --ok-soft:#e2f5f2;
  --warn:#caa24a; --warn-ink:#8a6d28; --warn-soft:#f6efdf;
  /* Aliases que mapeiam os tokens herdados do HD360 -> paleta da marca.
     (Mantém todas as regras de componente abaixo funcionando, recoloridas.) */
  --lilas:var(--marca); --lilas-ink:var(--marca-ink); --lilas-soft:var(--marca-soft);
  --azul:var(--marca); --azul-ink:var(--marca-ink); --azul-soft:var(--marca-soft);
  --rosa:var(--danger); --rosa-ink:var(--danger-ink); --rosa-soft:var(--danger-soft);
  --verde:var(--ok); --verde-ink:var(--ok-ink); --verde-soft:var(--ok-soft);
  --amarelo:var(--warn); --amarelo-ink:var(--warn-ink); --amarelo-soft:var(--warn-soft);
  /* Tipografia da marca */
  --font-display:"Cormorant Garamond","Georgia",serif;
  --font-body:"Poppins",system-ui,sans-serif;
  /* Raios e motion */
  --r-sm:12px; --r-md:16px; --r-lg:20px; --r-pill:999px;
  --ease-gentle:cubic-bezier(0.22,1,0.36,1);
  --ease-soft:cubic-bezier(0.4,0,0.2,1);
}
```

Mantenha TODO o restante do arquivo (de `body{...}` até o fim, seções 1–13 + editor grid + reduced motion) **sem alterações** — os aliases acima cuidam da recoloração.

- [ ] **Step 3: Ajustar o seletor de cor de categoria (novo componente do editor)**

Adicione ao final de `painel/styles.css`:
```css
/* Categoria livre: input + seletor de cor */
.cat-pick{ display:flex; gap:10px; align-items:center; }
.cat-pick .input{ flex:1; }
.cat-pick__color{ width:46px; height:44px; flex:none; padding:4px; border:1px solid var(--linha-forte); border-radius:var(--r-sm); background:var(--surface); cursor:pointer; }
```

- [ ] **Step 4: Verificar balanço de chaves**

Run: `node -e "const c=require('fs').readFileSync('painel/styles.css','utf8'); const o=(c.match(/{/g)||[]).length,x=(c.match(/}/g)||[]).length; console.log(o,x); process.exit(o===x?0:1)"`
Expected: dois números iguais.

- [ ] **Step 5: Commit**

```bash
git add painel/styles.css
git commit -m "feat(painel): re-skin na identidade da marca (teal + Cormorant/Poppins)"
```

---

## Task 9: `painel/index.html` — shell re-skinado

**Files:**
- Create: `painel/index.html`

- [ ] **Step 1: Implementar**

Create `painel/index.html`:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Painel · Dr. Márcio Teixeira</title>
  <link rel="icon" type="image/png" href="../logo/logo-header-colorido.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="login-root" hidden></div>
  <div id="app-root" hidden></div>
  <div class="toasts" id="toasts" aria-live="polite" aria-atomic="false"></div>

  <script src="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js"></script>
  <script type="module" src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verificar**

Run: `node -e "const s=require('fs').readFileSync('painel/index.html','utf8'); console.log(s.includes('app.js') && s.includes('quill') && s.includes('Cormorant'))"`
Expected: `true`

- [ ] **Step 3: Commit**

```bash
git add painel/index.html
git commit -m "feat(painel): shell HTML re-skinado"
```

---

## Task 10: `screens/login.js` — re-skin

**Files:**
- Create: `painel/screens/login.js`

- [ ] **Step 1: Implementar (port com logo/textos da marca)**

Create `painel/screens/login.js` (estrutura idêntica ao HD360; mudam logo e textos):
```js
export function renderLogin(root, { onLogin }) {
  root.innerHTML = `
    <main class="login">
      <div class="login__blob" aria-hidden="true"></div>
      <form class="login__card" id="login-form">
        <img class="login__mark" src="../logo/logo-header-colorido.png" alt="Dr. Márcio Teixeira" />
        <h1 class="login__title">Painel do Blog</h1>
        <p class="login__sub">Entre para gerenciar os artigos.</p>
        <div class="field">
          <label class="field__label" for="email">E-mail</label>
          <input class="input" id="email" type="email" autocomplete="username" required />
        </div>
        <div class="field">
          <label class="field__label" for="pw">Senha</label>
          <input class="input" id="pw" type="password" autocomplete="current-password" required />
        </div>
        <button class="btn btn--primary login__submit" type="submit">Entrar</button>
        <p class="login__err" id="login-err" role="alert" hidden>E-mail ou senha incorretos.</p>
      </form>
    </main>`;

  const form = root.querySelector('#login-form');
  const err = root.querySelector('#login-err');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true;
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#pw').value;
    const btn = form.querySelector('button');
    btn.disabled = true;
    try { await onLogin(email, password); }
    catch (e2) { err.hidden = false; }
    finally { btn.disabled = false; }
  });
}
```

- [ ] **Step 2: Verificar sintaxe**

Run: `node --check painel/screens/login.js`
Expected: sem erro.

- [ ] **Step 3: Commit**

```bash
git add painel/screens/login.js
git commit -m "feat(painel): tela de login re-skinada"
```

---

## Task 11: `screens/list.js` — port + `mt_posts` + cor por hex

**Files:**
- Create: `painel/screens/list.js`

Mudanças vs. HD360: tabela `mt_posts` (via config), o ponto da categoria usa `category_color` (que agora é hex) diretamente, e o estado vazio não usa a arte do HD360.

- [ ] **Step 1: Implementar**

Create `painel/screens/list.js`:
```js
import { escapeHtml, toast } from '../lib/ui.js';
import { POSTS_TABLE } from '../config.js';

const DATE_FMT = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

const ICON_EDIT = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
const ICON_DEL = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>';

// Mantém só hex válido para uso seguro em atributo style.
function safeColor(c) {
  return /^#[0-9a-fA-F]{3,8}$/.test(String(c || '')) ? c : '#057f7f';
}

export async function renderList(work, { supabase }) {
  work.innerHTML = `
    <div class="panel">
      <div class="panel__head">
        <div class="seg" role="tablist" aria-label="Filtrar por status">
          <button class="seg__btn seg__btn--on" data-filter="all" role="tab">Todos</button>
          <button class="seg__btn" data-filter="published" role="tab">Publicados</button>
          <button class="seg__btn" data-filter="draft" role="tab">Rascunhos</button>
        </div>
        <a class="btn btn--primary" href="#/editor">Novo post</a>
      </div>
      <div id="list-body"><div class="skel" aria-hidden="true">
        <span class="skel__row"></span><span class="skel__row"></span><span class="skel__row"></span>
      </div></div>
    </div>`;

  const body = work.querySelector('#list-body');
  let filter = 'all';

  const { data: posts, error } = await supabase
    .from(POSTS_TABLE)
    .select('id,slug,title,category_name,category_color,status,date,likes')
    .order('date', { ascending: false });

  if (error) {
    body.innerHTML = `<div class="state"><h2 class="state__title">Não deu para carregar</h2>
      <p class="state__sub">Tente recarregar a página.</p></div>`;
    toast('Erro ao carregar posts.', 'err');
    return;
  }

  function rowsHtml(list) {
    if (!list.length) {
      return `<div class="state">
        <h2 class="state__title">Nenhum post aqui</h2>
        <p class="state__sub">Quando você criar um post, ele aparece nesta lista.</p>
        <a class="btn btn--primary" href="#/editor">Escrever um post</a>
      </div>`;
    }
    const tr = list.map(p => `
      <tr>
        <td class="table__title">${escapeHtml(p.title)}</td>
        <td><span class="cat"><span class="cat__dot" style="background:${safeColor(p.category_color)}"></span>${escapeHtml(p.category_name)}</span></td>
        <td>${badge(p.status)}</td>
        <td class="table__meta">${p.date ? DATE_FMT.format(new Date(p.date)) : ''}</td>
        <td class="table__num">${p.likes ?? 0}</td>
        <td class="table__actions">
          <a class="iconbtn" href="#/editor?id=${p.id}" aria-label="Editar">${ICON_EDIT}</a>
          <button class="iconbtn iconbtn--danger" data-del="${p.id}" data-title="${escapeHtml(p.title)}" aria-label="Excluir">${ICON_DEL}</button>
        </td>
      </tr>`).join('');
    return `<table class="table">
      <thead><tr><th>Título</th><th>Categoria</th><th>Status</th><th>Data</th><th class="table__num">Curtidas</th><th></th></tr></thead>
      <tbody>${tr}</tbody></table>`;
  }

  function draw() {
    const list = filter === 'all' ? posts : posts.filter(p => p.status === filter);
    body.innerHTML = rowsHtml(list);
    body.querySelectorAll('[data-del]').forEach(btn =>
      btn.addEventListener('click', () => confirmDelete(btn.dataset.del, btn.dataset.title)));
  }

  work.querySelectorAll('.seg__btn').forEach(b => b.addEventListener('click', () => {
    work.querySelectorAll('.seg__btn').forEach(x => x.classList.remove('seg__btn--on'));
    b.classList.add('seg__btn--on');
    filter = b.dataset.filter;
    draw();
  }));

  async function confirmDelete(id, title) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-t">
        <h2 class="modal__title" id="m-t">Excluir post?</h2>
        <p class="modal__body">Excluir “${escapeHtml(title)}”? Essa ação não pode ser desfeita.</p>
        <div class="modal__actions">
          <button class="btn btn--quiet" data-close>Cancelar</button>
          <button class="btn btn--danger" data-confirm>Excluir post</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.querySelector('[data-close]').addEventListener('click', close);
    document.addEventListener('keydown', function esc(e){ if(e.key==='Escape'){close();document.removeEventListener('keydown',esc);} });
    overlay.querySelector('[data-confirm]').addEventListener('click', async () => {
      const { error } = await supabase.from(POSTS_TABLE).delete().eq('id', id);
      close();
      if (error) { toast('Não deu para excluir.', 'err'); return; }
      const i = posts.findIndex(p => String(p.id) === String(id));
      if (i >= 0) posts.splice(i, 1);
      draw();
      toast('Post excluído.', 'ok');
    });
  }

  draw();
}

function badge(status) {
  return status === 'published'
    ? '<span class="badge badge--pub"><span class="badge__dot"></span>Publicado</span>'
    : '<span class="badge badge--draft"><span class="badge__dot"></span>Rascunho</span>';
}
```

- [ ] **Step 2: Verificar sintaxe**

Run: `node --check painel/screens/list.js`
Expected: sem erro.

- [ ] **Step 3: Commit**

```bash
git add painel/screens/list.js
git commit -m "feat(painel): lista de posts (mt_posts, cor por hex)"
```

---

## Task 12: `screens/editor.js` — port + categoria livre

**Files:**
- Create: `painel/screens/editor.js`

Mudanças vs. HD360: tabela `mt_posts`; o campo categoria vira **input de texto + datalist + seletor de cor**; ao escolher uma categoria existente, a cor é preenchida automaticamente.

- [ ] **Step 1: Implementar**

Create `painel/screens/editor.js`:
```js
import { escapeHtml, toast } from '../lib/ui.js';
import { POSTS_TABLE, DEFAULT_CATEGORY_COLOR } from '../config.js';
import { slugify } from '../lib/slug.js';
import { metaState, serp } from '../lib/seo.js';
import { buildPayload } from '../lib/post-payload.js';
import { uploadImage } from '../lib/upload.js';
import { fetchCategories } from '../lib/categories.js';

export async function renderEditor(work, { supabase, id }) {
  let existing = null;
  if (id) {
    const { data, error } = await supabase.from(POSTS_TABLE).select('*').eq('id', id).single();
    if (error || !data) { toast('Post não encontrado.', 'err'); location.hash = '#/posts'; return; }
    existing = data;
  }

  const categories = await fetchCategories(supabase);
  const colorByName = new Map(categories.map(c => [c.name.toLowerCase(), c.color]));

  const tags = new Set(existing?.tags || []);
  let slugTouched = !!existing;
  let coverImage = existing?.cover_image || '';

  work.innerHTML = `
    <form id="editor" class="editor-grid">
      <section class="panel panel--pad">
        <p class="eyebrow">Conteúdo</p>
        <div class="field">
          <label class="field__label" for="f-title">Título</label>
          <input class="input" id="f-title" type="text" value="${escapeHtml(existing?.title || '')}" />
        </div>
        <div class="field">
          <span class="field__label">Texto</span>
          <div class="editor"><div id="quill"></div></div>
        </div>
        <div class="field">
          <span class="field__label">Imagem de capa</span>
          <div id="cover-slot"></div>
        </div>
      </section>

      <section class="panel panel--pad">
        <p class="eyebrow">Organização</p>
        <div class="field">
          <label class="field__label" for="f-cat">Categoria</label>
          <div class="cat-pick">
            <input class="input" id="f-cat" type="text" list="cat-list" placeholder="ex.: Cuidados com a Pele" value="${escapeHtml(existing?.category_name || '')}" />
            <input class="cat-pick__color" id="f-cat-color" type="color" value="${escapeHtml(existing?.category_color || DEFAULT_CATEGORY_COLOR)}" aria-label="Cor da categoria" />
          </div>
          <datalist id="cat-list">
            ${categories.map(c => `<option value="${escapeHtml(c.name)}"></option>`).join('')}
          </datalist>
          <p class="field__help">Digite uma categoria existente ou crie uma nova e escolha a cor.</p>
        </div>
        <div class="field">
          <span class="field__label">Tags</span>
          <div class="chips" id="chips">
            <input class="chips__input" id="chip-input" placeholder="Adicionar tag…" />
          </div>
        </div>
        <div class="field">
          <label class="field__label" for="f-slug">Slug (URL)</label>
          <input class="input" id="f-slug" type="text" value="${escapeHtml(existing?.slug || '')}" />
          <p class="field__help">Mudar o endereço muda a URL e pode afetar o SEO.</p>
        </div>
      </section>

      <section class="panel panel--pad">
        <p class="eyebrow">SEO</p>
        <div class="field">
          <label class="field__label" for="f-seotitle">Título de SEO</label>
          <input class="input" id="f-seotitle" type="text" value="${escapeHtml(existing?.seo_title || '')}" />
        </div>
        <div class="field">
          <label class="field__label" for="f-meta">Meta description</label>
          <textarea class="input" id="f-meta" rows="3">${escapeHtml(existing?.meta_description || '')}</textarea>
          <p class="field__help"><span class="counter" id="meta-count">0</span>/160 caracteres</p>
        </div>
        <div class="field">
          <label class="field__label" for="f-kw">Palavra-chave foco</label>
          <input class="input" id="f-kw" type="text" value="${escapeHtml(existing?.focus_keyword || '')}" />
        </div>
        <div class="field">
          <label class="field__label" for="f-excerpt">Resumo (excerpt)</label>
          <textarea class="input" id="f-excerpt" rows="2">${escapeHtml(existing?.excerpt || '')}</textarea>
        </div>
        <div class="serp" id="serp"></div>
      </section>

      <div class="editor-actions">
        <button class="btn btn--quiet" type="button" id="btn-preview">Ver prévia</button>
        <button class="btn btn--ghost" type="button" id="btn-draft">Salvar rascunho</button>
        <button class="btn btn--primary" type="button" id="btn-publish">Publicar</button>
      </div>
    </form>`;

  const quill = new window.Quill('#quill', {
    theme: 'snow',
    modules: { toolbar: [
      ['bold', 'italic'], [{ header: 2 }, { header: 3 }],
      [{ list: 'bullet' }], ['blockquote', 'link', 'image'],
    ] },
  });
  if (existing?.content) quill.clipboard.dangerouslyPasteHTML(existing.content);

  quill.getModule('toolbar').addHandler('image', () => pickImage(async (file) => {
    try {
      const url = await uploadImage(supabase, file);
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', url, 'user');
    } catch { toast('Falha no upload da imagem.', 'err'); }
  }));

  const $ = sel => work.querySelector(sel);
  const titleEl = $('#f-title'), slugEl = $('#f-slug'), catEl = $('#f-cat'), catColorEl = $('#f-cat-color');
  const seoTitleEl = $('#f-seotitle'), metaEl = $('#f-meta'), excerptEl = $('#f-excerpt');

  titleEl.addEventListener('input', () => {
    if (!slugTouched) slugEl.value = slugify(titleEl.value);
    refreshSerp();
  });
  slugEl.addEventListener('input', () => { slugTouched = true; refreshSerp(); });
  seoTitleEl.addEventListener('input', refreshSerp);
  excerptEl.addEventListener('input', refreshSerp);
  metaEl.addEventListener('input', () => { refreshMeta(); refreshSerp(); });
  // Ao digitar/escolher uma categoria já existente, herda a cor dela.
  catEl.addEventListener('input', () => {
    const hit = colorByName.get(catEl.value.trim().toLowerCase());
    if (hit) catColorEl.value = hit;
  });

  function refreshMeta() {
    const { count, level } = metaState(metaEl.value);
    const c = $('#meta-count'); c.textContent = count;
    c.style.color = level === 'over' ? 'var(--danger-ink)' : level === 'ok' ? 'var(--ok-ink)' : 'var(--tinta-muted)';
  }
  function refreshSerp() {
    const s = serp({ title: titleEl.value, slug: slugEl.value, seoTitle: seoTitleEl.value, metaDescription: metaEl.value, excerpt: excerptEl.value });
    $('#serp').innerHTML = `<span class="serp__url">${escapeHtml(s.url)}</span>
      <span class="serp__title">${escapeHtml(s.title)}</span>
      <span class="serp__desc">${escapeHtml(s.desc)}</span>`;
  }

  const chips = $('#chips'), chipInput = $('#chip-input');
  function drawChips() {
    chips.querySelectorAll('.chip').forEach(c => c.remove());
    [...tags].forEach(t => {
      const el = document.createElement('span');
      el.className = 'chip';
      el.innerHTML = `${escapeHtml(t)}<button type="button" class="chip__x" aria-label="Remover ${escapeHtml(t)}">×</button>`;
      el.querySelector('.chip__x').addEventListener('click', () => { tags.delete(t); drawChips(); });
      chips.insertBefore(el, chipInput);
    });
  }
  chipInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const v = chipInput.value.trim().replace(/,$/, '');
      if (v) { tags.add(v); chipInput.value = ''; drawChips(); }
    } else if (e.key === 'Backspace' && !chipInput.value && tags.size) {
      const last = [...tags].pop(); tags.delete(last); drawChips();
    }
  });
  drawChips();

  renderCover();
  function renderCover() {
    const slot = $('#cover-slot');
    if (coverImage) {
      slot.innerHTML = `<figure class="cover"><img class="cover__img" src="${escapeHtml(coverImage)}" alt="Prévia da capa" />
        <div class="cover__bar"><button class="btn btn--quiet" type="button" id="cover-change">Trocar</button>
        <button class="btn btn--danger" type="button" id="cover-remove">Remover</button></div></figure>`;
      slot.querySelector('#cover-remove').addEventListener('click', () => { coverImage = ''; renderCover(); });
      slot.querySelector('#cover-change').addEventListener('click', chooseCover);
    } else {
      slot.innerHTML = `<button type="button" class="dropzone" id="cover-pick">
        <span class="dropzone__t">Clique para enviar a capa</span>
        <span class="dropzone__hint">JPG ou PNG, 16:9 recomendado</span></button>`;
      slot.querySelector('#cover-pick').addEventListener('click', chooseCover);
    }
  }
  function chooseCover() {
    pickImage(async (file) => {
      try { coverImage = await uploadImage(supabase, file); renderCover(); }
      catch { toast('Falha no upload da capa.', 'err'); }
    });
  }

  async function save(status) {
    const form = {
      title: titleEl.value.trim(),
      slug: (slugEl.value.trim() || slugify(titleEl.value)),
      categoryName: catEl.value.trim(),
      categoryColor: catColorEl.value || DEFAULT_CATEGORY_COLOR,
      content: quill.root.innerHTML,
      excerpt: excerptEl.value.trim(),
      coverImage,
      metaDescription: metaEl.value.trim(),
      seoTitle: seoTitleEl.value.trim(),
      ogImage: existing?.og_image || coverImage,
      focusKeyword: $('#f-kw').value.trim(),
      tags: [...tags],
      status,
    };
    if (!form.title) { toast('Dê um título ao post.', 'err'); return; }
    if (!form.slug) { toast('O slug ficou vazio.', 'err'); return; }
    if (!form.categoryName) { toast('Escolha ou crie uma categoria.', 'err'); return; }
    const payload = buildPayload(form);

    let res;
    if (existing) res = await supabase.from(POSTS_TABLE).update(payload).eq('id', existing.id);
    else res = await supabase.from(POSTS_TABLE).insert(payload);

    if (res.error) {
      toast(res.error.code === '23505' ? 'Já existe um post com esse slug.' : 'Não deu para salvar.', 'err');
      return;
    }
    toast(status === 'published' ? 'Post publicado.' : 'Rascunho salvo.', 'ok');
    location.hash = '#/posts';
  }

  $('#btn-draft').addEventListener('click', () => save('draft'));
  $('#btn-publish').addEventListener('click', () => save('published'));
  $('#btn-preview').addEventListener('click', () => openPreview(titleEl.value, quill.root.innerHTML, coverImage));

  refreshMeta(); refreshSerp();
}

function pickImage(back) {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.addEventListener('change', () => { if (input.files[0]) back(input.files[0]); });
  input.click();
}

function openPreview(title, html, cover) {
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="modal" style="width:min(760px,100%);max-height:86vh;overflow:auto;text-align:left">
    ${cover ? `<img src="${escapeHtml(cover)}" alt="" style="width:100%;border-radius:var(--r-md);margin-bottom:16px" />` : ''}
    <h1 style="font-family:var(--font-display);font-weight:600;font-size:32px;margin:0 0 16px">${escapeHtml(title || 'Sem título')}</h1>
    <div class="editor__body" style="padding:0">${html}</div>
    <div class="modal__actions" style="margin-top:20px"><button class="btn btn--quiet" data-close>Fechar</button></div>
  </div>`;
  document.body.appendChild(ov);
  const close = () => ov.remove();
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  ov.querySelector('[data-close]').addEventListener('click', close);
}
```

- [ ] **Step 2: Verificar sintaxe**

Run: `node --check painel/screens/editor.js`
Expected: sem erro.

- [ ] **Step 3: Commit**

```bash
git add painel/screens/editor.js
git commit -m "feat(painel): editor com categoria livre + cor (mt_posts)"
```

---

## Task 13: `app.js` — shell, rotas, auth, publicação

**Files:**
- Create: `painel/app.js`

Port do HD360 com a marca: logo, sem `data-color`, mesma lógica de rotas/auth/publicação.

- [ ] **Step 1: Implementar**

Create `painel/app.js`:
```js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { renderLogin } from './screens/login.js';
import { renderList } from './screens/list.js';
import { renderEditor } from './screens/editor.js';
import { publishUiState, fetchSiteMeta, requestPublish } from './lib/publish.js';
import { toast } from './lib/ui.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginRoot = document.getElementById('login-root');
const appRoot = document.getElementById('app-root');

function shell(innerTitle) {
  appRoot.innerHTML = `
    <div class="app">
      <aside class="sidebar">
        <a class="sidebar__brand" href="#/posts">
          <img class="sidebar__mark" src="../logo/logo-header-colorido.png" alt="Dr. Márcio Teixeira" />
          <span class="sidebar__word">Painel</span>
        </a>
        <nav class="sidebar__nav">
          <a class="navitem navitem--active" href="#/posts">Posts</a>
        </nav>
        <button class="navitem navitem--foot" type="button" id="logout">Sair</button>
      </aside>
      <div class="main">
        <header class="topbar">
          <h1 class="topbar__title" id="page-title">${innerTitle}</h1>
          <div class="topbar__actions">
            <span class="publish__flag" id="publish-flag" hidden><span class="publish__dot"></span>Alterações não publicadas</span>
            <button class="btn btn--primary" id="publish-btn">Atualizar site</button>
          </div>
        </header>
        <main class="work" id="work"></main>
      </div>
    </div>`;
  appRoot.querySelector('#logout').addEventListener('click', async () => { await supabase.auth.signOut(); });
  initPublishControl();
  return appRoot.querySelector('#work');
}

let publishTimer = null;

async function refreshPublishControl() {
  const flag = appRoot.querySelector('#publish-flag');
  const btn = appRoot.querySelector('#publish-btn');
  if (!flag || !btn) return null;
  const meta = await fetchSiteMeta(supabase);
  const ui = publishUiState(meta);
  flag.hidden = !ui.flagVisible;
  btn.textContent = ui.btnLabel;
  btn.disabled = ui.btnDisabled;
  return meta;
}

function initPublishControl() {
  const btn = appRoot.querySelector('#publish-btn');
  btn.addEventListener('click', onPublishClick);
  refreshPublishControl();
}

async function onPublishClick() {
  try {
    await requestPublish(supabase);
    await refreshPublishControl();
    toast('Publicando o site…', 'info');
    pollPublish(Date.now());
  } catch {
    toast('Não deu para iniciar a publicação.', 'err');
  }
}

function pollPublish(startedAt) {
  clearTimeout(publishTimer);
  publishTimer = setTimeout(async () => {
    const meta = await refreshPublishControl();
    if (meta && !meta.publishing) { toast('Site atualizado.', 'ok'); return; }
    if (Date.now() - startedAt > 180000) { toast('A publicação está demorando. Confira o GitHub Actions.', 'err'); return; }
    pollPublish(startedAt);
  }, 4000);
}

async function route() {
  const hash = location.hash || '#/posts';
  const work = shell('Posts');
  const titleEl = appRoot.querySelector('#page-title');
  if (hash.startsWith('#/editor')) {
    const id = new URLSearchParams(hash.split('?')[1] || '').get('id');
    titleEl.textContent = id ? 'Editar post' : 'Novo post';
    await renderEditor(work, { supabase, id });
  } else {
    titleEl.textContent = 'Posts';
    await renderList(work, { supabase });
  }
}

function showLogin() {
  appRoot.hidden = true;
  loginRoot.hidden = false;
  renderLogin(loginRoot, {
    onLogin: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
  });
}

function showApp() {
  loginRoot.hidden = true;
  appRoot.hidden = false;
  route();
}

window.addEventListener('hashchange', () => { if (!appRoot.hidden) route(); });

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) showApp(); else showLogin();
});

const { data } = await supabase.auth.getSession();
if (data.session) showApp(); else showLogin();
```

- [ ] **Step 2: Verificar sintaxe**

Run: `node --check painel/app.js`
Expected: sem erro.

- [ ] **Step 3: Commit**

```bash
git add painel/app.js
git commit -m "feat(painel): app shell, rotas, auth e controle de publicação"
```

---

## Task 14: Integrar testes do painel ao `npm test` da raiz

**Files:**
- Modify: `package.json` (raiz)

- [ ] **Step 1: Atualizar scripts**

Em `package.json` (raiz), ajuste os scripts para incluir os testes do painel:

```json
  "scripts": {
    "test": "node --test tools/blog/test/*.test.mjs painel/test/*.test.js",
    "test:blog": "node --test tools/blog/test/*.test.mjs",
    "test:painel": "node --test painel/test/*.test.js",
    "build:blog": "node tools/build-blog.mjs",
    "build:treatments": "node tools/build-treatments.mjs"
  },
```

> O `painel/package.json` tem `"type":"module"`, então o `node --test` carrega os `.js` do painel como ESM (a resolução usa o package.json mais próximo do arquivo de teste).

- [ ] **Step 2: Rodar tudo**

Run: `npm test`
Expected: PASS — os 19 testes do blog + os do painel (slug, clean-html, post-payload, seo, categories, publish). Sem falhas.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore(painel): incluir testes do painel no npm test"
```

---

## Task 15: Verificação funcional no navegador

**Files:** nenhum (verificação).

**Pré-condição:** `supabase/schema-marcio.sql` aplicado, bucket `marcio-blog-images` criado, e um usuário de login no Supabase Auth (tudo já providenciado pelo Freela In Home).

- [ ] **Step 1: Servir o site**

Run (background): `npx --yes serve -l 5050 .`. Abra `http://localhost:5050/painel/`.

- [ ] **Step 2: Login**

Entre com o e-mail/senha criados no Supabase Auth. Esperado: cai na lista de posts (vazia ou com o que houver). Se errar a senha, mostra o erro.

- [ ] **Step 3: Criar um post com categoria nova**

Clique "Novo post". Preencha título (slug auto), escreva no Quill, suba uma capa (vai pro bucket `marcio-blog-images`), digite uma categoria NOVA (ex.: "Acne") e escolha uma cor, adicione tags e a meta description (veja o contador e a prévia SERP no domínio da marca). Clique "Salvar rascunho".
Esperado: toast "Rascunho salvo", volta à lista, o post aparece com o ponto da cor escolhida e badge "Rascunho".

- [ ] **Step 4: Reabrir e publicar**

Edite o post: confirme que a categoria "Acne" aparece no campo e a cor foi preservada. Abra um post novo e confirme que "Acne" agora aparece como sugestão no datalist. Publique um post (status "published").
Esperado: badge "Publicado". Rode `npm run build:blog` com as env do Supabase e confirme que o post publicado é gerado em `blog/<slug>/` (lendo do banco, não do seed):
```powershell
$env:SUPABASE_URL="https://euzmbswywwhmicjlszqw.supabase.co"; $env:SUPABASE_SERVICE_KEY="<service_role>"; npm run build:blog
```

- [ ] **Step 5: Curtidas/Excluir**

Na lista, exclua um rascunho de teste (confirma no modal). Esperado: some da lista, toast "Post excluído".

- [ ] **Step 6: Observação sobre "Atualizar site"**

O botão "Atualizar site" ainda NÃO funciona (precisa do backend da Fase 3 — função `publish-marcio` + tabela `mt_site_meta`). Clicar mostra um toast de erro; isso é esperado nesta fase.

- [ ] **Step 7: Screenshot de evidência**

Tire um screenshot do editor e da lista para registro.

---

## Self-review (preenchido pelo autor do plano)

- **Cobertura do spec (Fase 2):** login (T10/T13) · lista com filtros e excluir (T11) · editor Quill + capa + tags + SEO (T12) · upload pro bucket (T5) · **categoria livre + cor + datalist** (T6/T12) · re-skin na marca (T8) · tabela `mt_posts` em todas as chamadas (T11/T12) · testes (T2–T7, T14). O botão "Atualizar site" existe e está cabeado, mas vira funcional só na Fase 3 (documentado em T15/Step 6).
- **Sem placeholders:** código completo em cada passo. Exceção consciente: a anon key real é colada do config do HD360 (T1), com verificação.
- **Consistência de tipos/nomes:** `POSTS_TABLE`/`STORAGE_BUCKET`/`PUBLISH_FN`/`SITE_META_TABLE`/`DEFAULT_CATEGORY_COLOR` definidos em `config.js` (T1) e consumidos com os mesmos nomes em list/editor/upload/categories/publish. `buildPayload` (T3) recebe `categoryName`/`categoryColor` produzidos pelo editor (T12). `fetchCategories`/`dedupeCategories` (T6) alimentam o datalist e o `colorByName` do editor.

---

## Próximo: Fase 3 — Pipeline automático

Backend que falta para o botão "Atualizar site" funcionar: `mt_site_meta` + trigger `mark_dirty`, Edge Function `publish-marcio` (valida o JWT, marca `publishing`, dispara `repository_dispatch` no repo `site-marciodermato`), e `.github/workflows/publish-blog.yml` rodando `build:blog` (lendo `mt_posts` com a service key), commitando o HTML e dando push. Pré-requisitos já providenciados: service key, PAT, secrets.
