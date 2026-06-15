# Blog — Fase 3: Pipeline de Publicação Automática (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Fazer o botão "Atualizar site" do painel funcionar de ponta a ponta: ao clicar, o site é reconstruído a partir do `mt_posts` e publicado no GitHub Pages, sem o Freela In Home rodar nada manualmente.

**Architecture:** O painel chama a Edge Function `publish-marcio` (valida o login, marca `mt_site_meta.publishing=true` e dispara um `repository_dispatch` no repo `site-marciodermato`). O GitHub Actions roda `tools/build-blog.mjs` lendo o `mt_posts` com a service key, commita o HTML gerado e dá push — o Pages publica. Um trigger em `mt_posts` marca o site como "sujo" a cada mudança, acendendo o aviso "Alterações não publicadas" no painel.

**Tech Stack:** Postgres (Supabase) trigger/RLS, Deno (Edge Function), GitHub Actions (YAML), Node (build já existente da Fase 1).

**Pré-requisitos (Freela In Home):** service_role key em mãos, GitHub PAT (fine-grained no repo `site-marciodermato`, Contents: read/write) criado, Supabase CLI instalado OU acesso ao Dashboard para deploy de função e secrets. Tudo já providenciado.

**Referência:** HD360 — `supabase/publish.sql`, `supabase/functions/publish/index.ts`, `.github/workflows/publish-blog.yml`.

---

## Estrutura de arquivos

**Criar:**
- `supabase/publish-marcio.sql` — tabela `mt_site_meta` + trigger `mt_mark_site_dirty` em `mt_posts` + RLS.
- `supabase/functions/publish-marcio/index.ts` — Edge Function (dispatch p/ o repo da marca).
- `supabase/functions/publish-marcio/deno.json` — `{ "imports": {} }`.
- `.github/workflows/publish-blog.yml` — workflow que roda o build e publica.

**Sem modificações de código do painel** — ele já está cabeado (`PUBLISH_FN='publish-marcio'`, `SITE_META_TABLE='mt_site_meta'`).

---

## Task 1: `supabase/publish-marcio.sql`

**Files:**
- Create: `supabase/publish-marcio.sql`

- [ ] **Step 1: Escrever o SQL**

Create `supabase/publish-marcio.sql`:
```sql
-- Blog Dr. Márcio — Fase 3: estado de publicação (projeto Supabase compartilhado, prefixo mt_).
-- Aplicar uma vez no SQL Editor.

create table if not exists public.mt_site_meta (
  id                 integer primary key default 1,
  dirty              boolean not null default true,
  publishing         boolean not null default false,
  last_published_at  timestamptz,
  constraint mt_site_meta_single_row check (id = 1)
);

insert into public.mt_site_meta (id) values (1) on conflict (id) do nothing;

-- Qualquer escrita em mt_posts marca o site como "sujo".
create or replace function public.mt_mark_site_dirty()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.mt_site_meta set dirty = true where id = 1;
  return null;
end; $$;

drop trigger if exists mt_posts_mark_site_dirty on public.mt_posts;
create trigger mt_posts_mark_site_dirty
  after insert or update or delete on public.mt_posts
  for each statement execute function public.mt_mark_site_dirty();

-- RLS: o painel (admin autenticado) lê o estado. Escrita só via service key (função/workflow).
alter table public.mt_site_meta enable row level security;

drop policy if exists mt_site_meta_read on public.mt_site_meta;
create policy mt_site_meta_read on public.mt_site_meta
  for select to authenticated using (true);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/publish-marcio.sql
git commit -m "feat(blog): mt_site_meta + trigger de site sujo (fase 3)"
```

*(Aplicar no Supabase é um passo guiado na Task 4.)*

---

## Task 2: Edge Function `publish-marcio`

**Files:**
- Create: `supabase/functions/publish-marcio/index.ts`, `supabase/functions/publish-marcio/deno.json`

- [ ] **Step 1: deno.json**

Create `supabase/functions/publish-marcio/deno.json`:
```json
{
  "imports": {}
}
```

- [ ] **Step 2: index.ts**

Create `supabase/functions/publish-marcio/index.ts` (OWNER/REPO da marca; tabela `mt_site_meta`):
```ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OWNER = 'fabianohirtzz';
const REPO = 'site-marciodermato';
const EVENT_TYPE = 'publish-blog';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const pat = Deno.env.get('GITHUB_PAT');
    if (!pat) return json({ error: 'GITHUB_PAT não configurado.' }, 500);

    // 1. Garantir que quem chama é o admin autenticado.
    const authHeader = req.headers.get('Authorization') ?? '';
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: 'Não autorizado.' }, 401);

    // 2. Marcar como publicando (service key ignora RLS).
    const admin = createClient(supabaseUrl, serviceKey);
    await admin.from('mt_site_meta').update({ publishing: true }).eq('id', 1);

    // 3. Disparar o rebuild no GitHub.
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
        'User-Agent': 'marciodermato-painel',
      },
      body: JSON.stringify({ event_type: EVENT_TYPE }),
    });

    if (!res.ok) {
      await admin.from('mt_site_meta').update({ publishing: false }).eq('id', 1);
      return json({ error: `GitHub ${res.status}: ${await res.text()}` }, 502);
    }

    return json({ ok: true }, 200);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
```

- [ ] **Step 3: Verificar sintaxe (TypeScript/Deno é só texto aqui; check básico)**

Run: `node -e "const s=require('fs').readFileSync('supabase/functions/publish-marcio/index.ts','utf8'); console.log(s.includes('site-marciodermato'), s.includes('mt_site_meta'), s.includes('publish-blog'))"`
Expected: `true true true`

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/publish-marcio/
git commit -m "feat(blog): edge function publish-marcio (dispatch p/ o repo da marca)"
```

---

## Task 3: Workflow `.github/workflows/publish-blog.yml`

**Files:**
- Create: `.github/workflows/publish-blog.yml`

- [ ] **Step 1: Escrever o workflow**

Create `.github/workflows/publish-blog.yml`:
```yaml
name: Publicar blog

on:
  repository_dispatch:
    types: [publish-blog]
  workflow_dispatch: {}

permissions:
  contents: write

concurrency:
  group: publish-blog
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Build do blog lendo do Supabase
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
        run: node tools/build-blog.mjs

      - name: Commit do HTML gerado
        run: |
          git config user.name "Marcio Dermato Bot"
          git config user.email "bot@drmarcioteixeira.com.br"
          git add -A
          git diff --cached --quiet || git commit -m "chore(blog): rebuild automatico do site [skip ci]"
          git push

      - name: Marcar site como publicado
        if: success()
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
        run: |
          curl -sS -X PATCH "$SUPABASE_URL/rest/v1/mt_site_meta?id=eq.1" \
            -H "apikey: $SUPABASE_SERVICE_KEY" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
            -H "Content-Type: application/json" \
            -d "{\"dirty\":false,\"publishing\":false,\"last_published_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}"

      - name: Liberar flag de publicação (mesmo se falhar)
        if: always()
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
        run: |
          curl -sS -X PATCH "$SUPABASE_URL/rest/v1/mt_site_meta?id=eq.1" \
            -H "apikey: $SUPABASE_SERVICE_KEY" \
            -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
            -H "Content-Type: application/json" \
            -d "{\"publishing\":false}"
```

> Nota: `workflow_dispatch: {}` permite acionar o build manualmente pela aba Actions do GitHub (útil para testar sem o painel).

- [ ] **Step 2: Validar o YAML**

Run: `node -e "const s=require('fs').readFileSync('.github/workflows/publish-blog.yml','utf8'); console.log(s.includes('tools/build-blog.mjs'), s.includes('mt_site_meta'), s.includes('repository_dispatch'))"`
Expected: `true true true`

- [ ] **Step 3: Commit + push**

```bash
git add .github/workflows/publish-blog.yml
git commit -m "feat(blog): workflow de publicação automática"
git push origin master
```

> O workflow precisa existir no `master` para o `repository_dispatch` encontrá-lo. Por isso o push aqui.

---

## Task 4: Deploy guiado (Freela In Home)

Passos manuais no Supabase e GitHub. **Sem isto, o botão não funciona.**

- [ ] **Step 1: Rodar o SQL**

Supabase Dashboard → SQL Editor → cole `supabase/publish-marcio.sql` → Run. Confirme que `mt_site_meta` foi criada e tem 1 linha (id=1).

- [ ] **Step 2: Secrets no GitHub (para o build do workflow)**

Repo `site-marciodermato` → Settings → Secrets and variables → Actions → New repository secret:
- `SUPABASE_URL` = `https://euzmbswywwhmicjlszqw.supabase.co`
- `SUPABASE_SERVICE_KEY` = a service_role key.

- [ ] **Step 3: Deploy da Edge Function**

Com a Supabase CLI (logado no projeto):
```bash
supabase functions deploy publish-marcio --project-ref euzmbswywwhmicjlszqw --no-verify-jwt
```
*(O `--no-verify-jwt` deixa a função receber a chamada; a checagem de login é feita dentro do código via `getUser`.)*
Alternativa sem CLI: criar a função `publish-marcio` pelo Dashboard → Edge Functions e colar o `index.ts`.

- [ ] **Step 4: Secret da função**

Dashboard → Edge Functions → Manage secrets (ou `supabase secrets set`):
- `GITHUB_PAT` = o PAT fine-grained (Contents: read/write no repo `site-marciodermato`).
*(`SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` são injetados automaticamente pelo Supabase nas funções — não precisa cadastrar.)*

- [ ] **Step 5: Confirmar GitHub Pages**

Settings → Pages → Source = branch `master`. (Já deve estar assim, pois o site publica do master.)

---

## Task 5: Verificação ponta a ponta

- [ ] **Step 1: Disparo manual do workflow (sanity)**

GitHub → Actions → "Publicar blog" → Run workflow (usa o `workflow_dispatch`). Deve rodar o build, commitar (se houver mudança) e zerar as flags. Confira o log verde.

- [ ] **Step 2: Pelo painel**

No `/painel/`, edite/publique um post. O aviso "Alterações não publicadas" deve acender (o trigger marcou dirty). Clique **"Atualizar site"** → o botão vira "Publicando…" → toast "Publicando o site…".

- [ ] **Step 3: Acompanhar**

GitHub → Actions: um run "Publicar blog" disparado por `repository_dispatch` deve aparecer e completar. Ao terminar, o painel volta para "Atualizar site" e mostra toast "Site atualizado." (o polling lê `mt_site_meta.publishing=false`).

- [ ] **Step 4: Conferir no ar**

Abra `drmarcioteixeira.com.br/blog.html` (após o deploy do Pages) — o post real aparece e os placeholders do seed somem (o build leu o `mt_posts` e o prune removeu os diretórios antigos).

- [ ] **Step 5: Caso de erro**

Se o run falhar, o passo "Liberar flag" zera `publishing` de qualquer forma (o painel não trava). Verifique os secrets e o PAT.

---

## Self-review (autor do plano)

- **Cobertura:** `mt_site_meta` + trigger (T1) · função `publish-marcio` apontando para `fabianohirtzz/site-marciodermato` + `mt_site_meta` (T2) · workflow rodando `tools/build-blog.mjs` e fazendo PATCH em `mt_site_meta` (T3) · deploy/secrets guiados (T4) · verificação ponta a ponta (T5).
- **Consistência:** o painel já usa `PUBLISH_FN='publish-marcio'` e `SITE_META_TABLE='mt_site_meta'` (Fase 2); o build usa `SUPABASE_URL`/`SUPABASE_SERVICE_KEY` (Fase 1); o workflow injeta exatamente esses nomes. A função lê os env auto-injetados + `GITHUB_PAT`.
- **Sem placeholders:** todo arquivo tem conteúdo final. Os passos manuais (T4) são inevitáveis (deploy/secrets) e estão detalhados.
- **Efeito colateral desejado:** o primeiro publish real apaga os posts placeholder do seed do ar (prune por slug + reinjeção do blog.html), resolvendo o conteúdo de exemplo que foi ao ar na Fase 1.
