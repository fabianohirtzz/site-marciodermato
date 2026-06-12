# Blog + Painel de Publicações — Dr. Márcio Teixeira

**Data:** 2026-06-12
**Status:** Aprovado para planejamento
**Referência arquitetural:** projeto HD360 Moinhos (mesma stack, re-skinado para a identidade do Dr. Márcio)

---

## 1. Objetivo

Adicionar ao site estático do Dr. Márcio:

1. Um **blog público** (índice com filtro + páginas de artigo), na identidade visual da marca.
2. Um **painel administrativo** para o Dr. Márcio (na prática, o Freela In Home) criar, editar e publicar artigos sem mexer em código.

O site permanece 100% estático para o visitante. O conteúdo vem do Supabase e é "assado" em HTML no momento da publicação, mantendo a performance e o deploy via GitHub Pages que o projeto já usa.

## 2. Decisões tomadas (brainstorming)

| Tema | Decisão |
|---|---|
| Arquitetura | Igual ao HD360: Supabase (dados + storage + auth) → Edge Function → GitHub Actions → build estático → GitHub Pages |
| Construção do painel | **Portar e re-skinar** o painel do HD360 (Quill + Supabase, já testado) |
| Projeto Supabase | **Compartilhar** o projeto existente do HD360, com isolamento por tabela/bucket/função |
| Categorias | **Dinâmicas** — criadas livremente conforme o Dr. Márcio publica (sem lista fixa no código) |
| Blog público | **Uma página** (`/blog.html`) com grade + filtro por categoria |
| Curtidas | **Manter** curtidas anônimas nos posts |
| Repositório do painel | **Mesmo repo**, em `/painel/`, publicado junto no GitHub Pages |

## 3. Isolamento no Supabase compartilhado

Como o projeto Supabase é compartilhado com o HD360, todo o recurso novo é nomeado para não colidir:

| Recurso | HD360 | Dr. Márcio |
|---|---|---|
| Tabela de posts | `posts` | `mt_posts` |
| Tabela de estado | `site_meta` | `mt_site_meta` |
| Bucket de imagens | `blog-images` | `marcio-blog-images` |
| Edge Function | `publish` | `publish-marcio` |
| Repo de destino do dispatch | `fabianohirtzz/hd360-moinhos` | `fabianohirtzz/site-marciodermato` |

**Compartilhado (aceito):** Auth (mesmos usuários valem para os dois painéis — o admin é o mesmo) e as cotas do tier grátis (banco/storage/banda somam os dois sites).

**RLS:** em `mt_posts`, leitura pública apenas de `status = 'published'`; escrita apenas para usuários autenticados (mesma política do HD360, aplicada à nova tabela).

## 4. Modelo de dados — tabela `mt_posts`

Espelha o HD360, com categorias livres.

| Campo | Tipo | Uso |
|---|---|---|
| `id` | bigint identity | PK |
| `slug` | text unique | URL: `/blog/<slug>/` |
| `title` | text | título |
| `date` | timestamptz | data de publicação |
| `modified` | timestamptz | última modificação |
| `category_name` | text | **livre** — digitada no editor |
| `category_color` | text | cor da categoria (hex) |
| `cover_image` | text | URL da capa (Storage) |
| `excerpt` | text | resumo (cards + meta) |
| `content` | text | corpo HTML (Quill) |
| `meta_description` | text | SEO |
| `seo_title` | text | SEO |
| `og_image` | text | SEO/social |
| `focus_keyword` | text | SEO |
| `tags` | text[] | tags |
| `likes` | integer | curtidas anônimas |
| `status` | text | `draft` \| `published` |
| `created_at`, `updated_at` | timestamptz | auto |

**Categorias dinâmicas:** não há tabela de categorias nem lista fixa em `config.js`. O editor expõe um campo de texto de categoria com um `<datalist>` populado pelas `category_name` distintas já existentes em `mt_posts` (consulta no load do editor) + um seletor de cor. Ao publicar uma categoria nova, ela passa a aparecer como sugestão automaticamente. Os filtros do blog público também são derivados das categorias presentes nos posts publicados (gerados no build).

`likes`: incremento anônimo via função RPC `mt_increment_likes(slug)` com `security definer` (espelha o mecanismo do HD360, em nome novo).

## 5. Blog público

### 5.1 Índice — `/blog.html`
- Hero curto na identidade teal (eyebrow + título Cormorant + lede).
- Barra de **filtro por categoria** (chips coloridos derivados das categorias existentes; "Todos" como padrão; filtragem client-side).
- **Grade de cards**: capa, chip de categoria colorido, título, resumo, data. Reaproveita `.section`, grid e `.reveal` do design system.
- Estado vazio tratado (quando ainda não há posts).
- Nav e footer padrão + float do WhatsApp.

### 5.2 Artigo — `/blog/<slug>/index.html`
- Breadcrumb `Início / Blog / <título>`.
- Hero com capa, categoria, título, data, tempo de leitura (estimado no build) e curtidas.
- Corpo em `.t-prose` (mesmo estilo tipográfico dos tratamentos).
- Botão de **curtir** (anônimo, RPC).
- Bloco **CTA "Agende sua consulta"** (WhatsApp) ao final.
- **Posts relacionados** (mesma categoria; fallback para mais recentes).
- **JSON-LD `Article`** + `BreadcrumbList` para SEO; `<title>`/meta/OG vindos dos campos do post.

### 5.3 Navegação
- Adicionar `Blog` ao nav e ao footer **em todas as páginas**, incluindo o template gerador `tools/build-treatments.mjs` (`navHTML()`/`footerHTML()`), para que as páginas de tratamento também recebam o link. Reexecutar o build de tratamentos após a mudança.

### 5.4 Identidade visual
Tokens do Dr. Márcio: teal `#057f7f` (e variações), Cormorant Garamond (títulos), Poppins (corpo), motivo do fio de cabelo, reveal on scroll, botões `.btn--primary`. Os estilos do blog entram em `assets/css/main.css` seguindo o padrão BEM existente (ex.: `.blog`, `.blog-card`, `.post-hero`, `.post-prose`).

## 6. Painel — `/painel/`

Portado do HD360 e re-skinado. Stack: vanilla JS (ES modules), Quill 1.3.7, Supabase JS SDK (CDN).

**Telas:**
- **Login** — Supabase Auth (e-mail/senha), na identidade teal.
- **Lista de posts** — filtros (todos / publicados / rascunhos), editar, excluir; topbar com aviso "alterações não publicadas" e botão **"Atualizar site"**.
- **Editor** — título, slug automático (editável), **categoria livre + cor**, Quill re-skinado, capa, resumo, campos de SEO (meta description, seo title, og image, focus keyword), tags, ações Salvar rascunho / Publicar.

**Upload de imagens** → bucket `marcio-blog-images` (capa e imagens inline do corpo).

**Config (`/painel/config.js`):** `SUPABASE_URL`, anon key, nome da tabela (`mt_posts`), bucket (`marcio-blog-images`), nome da função (`publish-marcio`). Sem lista fixa de categorias.

**Re-skin:** aplicar tokens/tipografia do Dr. Márcio ao CSS do painel; trocar logo e textos; manter a lógica/estrutura do HD360.

## 7. Pipeline de publicação

1. Admin salva/edita em `mt_posts` (e imagens no bucket). Trigger marca `mt_site_meta.dirty = true`.
2. Admin clica **"Atualizar site"** → chama a Edge Function `publish-marcio`.
3. `publish-marcio` valida o JWT, marca `publishing = true` e dispara `repository_dispatch` (`event_type: publish-blog`) no repo `site-marciodermato` usando um **GitHub PAT** (secret da função).
4. GitHub Actions (`.github/workflows/publish-blog.yml`) roda `node tools/build-blog.mjs`.
5. `build-blog.mjs` lê os posts `published` de `mt_posts` (service key), gera `/blog.html` (grade + filtros) e cada `/blog/<slug>/index.html`, faz prune de slugs removidos, commita o HTML no `master` e zera `dirty/publishing` via REST.
6. GitHub Pages publica automaticamente.

`tools/build-blog.mjs` é o espelho de `build-treatments.mjs` (mesmo estilo de nav/footer/SEO), com libs auxiliares de render (índice, página de post, sanitização de HTML do Quill).

## 8. Arquivos (visão geral)

**Novos:**
- `blog.html` (gerado/atualizado pelo build)
- `blog/<slug>/index.html` (gerados)
- `painel/` — `index.html`, `app.js`, `config.js`, `screens/{login,list,editor}.js`, `lib/{upload,post-payload}.js`, `painel.css` (folha própria do app, reusando os tokens do `:root` do site)
- `tools/build-blog.mjs` + `tools/blog/lib/*` (load-posts, render-index, render-post-page, sanitize-html, supabase-map)
- `.github/workflows/publish-blog.yml`
- `supabase/` (no repo, para versionar): `schema-marcio.sql` (tabela, RLS, RPC, trigger), `functions/publish-marcio/index.ts`

**Modificados:**
- `assets/css/main.css` — estilos do blog público (índice, cards, página de artigo)
- `assets/js/main.js` — comportamento do filtro do blog e botão de curtir
- `tools/build-treatments.mjs` — adicionar link "Blog" no nav/footer
- páginas estáticas (`index.html`, `tratamentos.html`, `sobre.html`, `metodo-4d.html`, `tricologia.html`, `contato.html`) — link "Blog" no nav/footer

## 9. Pré-requisitos a cargo do Freela In Home

Entram no plano como passo a passo guiado:

1. **Supabase (projeto do HD360):** rodar `schema-marcio.sql` (cria `mt_posts`, `mt_site_meta`, RLS, RPC, trigger); criar bucket público `marcio-blog-images`; criar usuário de login no Auth.
2. **Edge Function:** publicar `publish-marcio`; definir secrets da função: `GITHUB_PAT` (fine-grained, escopo no repo `site-marciodermato`, permissão de dispatch/contents), `GITHUB_OWNER`, `GITHUB_REPO`, `SUPABASE_SERVICE_KEY`.
3. **GitHub:** secret `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` no repo `site-marciodermato` (para o build); confirmar Pages servindo do branch `master`.
4. **Chaves no painel:** preencher `painel/config.js` com `SUPABASE_URL` + anon key.

## 10. Fora de escopo (YAGNI)

- Comentários nos posts.
- Múltiplos autores / papéis de usuário (sempre Dr. Márcio).
- Newsletter / RSS (pode virar fase futura).
- Migração de conteúdo existente (não há blog hoje).
- Agendamento de publicação por data futura.

## 11. Critérios de sucesso

1. Visitante acessa `/blog.html`, vê os artigos publicados, filtra por categoria e abre um artigo com layout na identidade da marca.
2. Link "Blog" presente no nav e footer de todas as páginas.
3. Dr. Márcio faz login no `/painel/`, cria um post com capa e categoria nova, salva como rascunho e depois publica.
4. Ao clicar "Atualizar site", o Actions roda o build e o post aparece no `/blog.html` e em `/blog/<slug>/` em produção.
5. Curtir um post incrementa o contador.
6. Nenhum dado do HD360 é afetado (isolamento por tabela/bucket/função verificado).
7. Páginas de artigo trazem JSON-LD `Article` e meta tags vindas dos campos de SEO.
