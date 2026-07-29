# Agendamento de posts e data retroativa — Painel Dr. Márcio

**Data:** 2026-07-29
**Status:** Aprovado para planejamento
**Base:** blog + painel entregues em [2026-06-12-blog-painel-design.md](2026-06-12-blog-painel-design.md)

---

## 1. Objetivo

Dar ao painel duas capacidades que hoje não existem:

1. **Data retroativa** — publicar um post com data anterior à de hoje (para subir conteúdo antigo sem que ele apareça como recém-escrito).
2. **Agendamento** — marcar um post para entrar no ar sozinho em data/hora futura, sem ninguém precisar abrir o painel naquele dia.

O site continua 100% estático. O visitante nunca vê um post agendado antes da hora.

## 2. Situação atual (o que já existe)

- `mt_posts` já tem a coluna `date timestamptz not null default now()`, mas o painel **nunca a envia**: `buildPayload()` em `painel/lib/post-payload.js` não inclui `date`, então o Postgres sempre grava `now()` no insert e mantém o valor antigo no update. Data retroativa é, portanto, uma coluna já existente que só falta expor.
- `status` aceita apenas `'draft'` e `'published'` (check constraint em `supabase/schema-marcio.sql`).
- O build (`tools/build-blog.mjs` → `tools/blog/lib/load-posts.mjs`) lê `mt_posts?status=eq.published` e ordena por `date` decrescente.
- O build só roda quando alguém clica em "Atualizar site" no painel (Edge Function `publish-marcio` → `repository_dispatch` → `.github/workflows/publish-blog.yml` → build → FTP para a Erehost).

Ou seja: **nada dispara sozinho na hora marcada**. É esse o problema real do agendamento.

## 3. Decisões tomadas (brainstorming)

| Tema | Decisão |
|---|---|
| Disparo do agendamento | **Cron no GitHub Actions** — o repo é público, então minutos de Actions são gratuitos |
| Frequência do cron | **A cada 30 min** (`0,30 * * * *`); folga real de ~0–40 min sobre o horário marcado |
| UI do editor | **Um único campo de data**, modelo WordPress: data no passado → Publicar; data no futuro → Agendar |
| Onde a promoção acontece | **No banco, antes do build** — o build continua lendo só `status=eq.published`, sem alteração |
| Fuso horário | UTC de ponta a ponta (`timestamptz` + runner do Actions em UTC + painel convertendo local→ISO) |

**Descartado:** pg_cron/pg_net no Supabase (horário mais preciso, mas exige configuração manual extra do usuário) e "fila até o próximo Atualizar site" (mais simples, mas exige lembrar de abrir o painel no dia).

## 4. Modelo de dados

Um terceiro status. Migration nova em `supabase/scheduled-marcio.sql`:

```sql
alter table public.mt_posts drop constraint if exists mt_posts_status_check;
alter table public.mt_posts add constraint mt_posts_status_check
  check (status in ('draft','published','scheduled'));

create index if not exists mt_posts_scheduled_idx
  on public.mt_posts (date) where status = 'scheduled';
```

`supabase/schema-marcio.sql` recebe o mesmo check já embutido, para que um setup do zero não precise da migration.

**Segurança:** a política RLS pública é `for select using (status = 'published')`. Um post `scheduled` fica invisível para o `anon` e para o build — não precisa de nenhuma trava adicional. `mt_increment_likes` também já filtra por `status = 'published'`.

**Ciclo de vida:**

```
draft ──(Publicar, data no passado)──> published
draft ──(Agendar, data no futuro)────> scheduled ──(cron, na hora)──> published
published ──(editar e mover data para o futuro + Agendar)──> scheduled  [sai do ar no próximo build]
```

## 5. Painel — editor

### 5.1 Campo de data

Na seção **Organização** de `painel/screens/editor.js`, um `<input type="datetime-local">` rotulado "Data de publicação", pré-preenchido com:

- a `date` do post existente, convertida para o fuso local; ou
- o instante atual, para post novo.

### 5.2 Botão primário reativo

O botão `#btn-publish` muda de rótulo conforme a data escolhida (evento `input` no campo de data):

| Data escolhida | Rótulo | `status` gravado | `date` gravada |
|---|---|---|---|
| passado ou agora | **Publicar** | `published` | a data escolhida (retroativa) |
| futuro | **Agendar** | `scheduled` | a data escolhida |

"Salvar rascunho" continua gravando `draft` e preserva a data escolhida — ao publicar depois, ela é reavaliada.

### 5.3 Lógica pura extraída

Novo módulo `painel/lib/publish-date.js`, sem dependência de DOM, testável em Node:

| Função | Responsabilidade |
|---|---|
| `toLocalInputValue(iso)` | ISO/timestamptz → string `YYYY-MM-DDTHH:mm` no fuso local (valor do input) |
| `fromLocalInputValue(str)` | valor do input → ISO UTC para gravar |
| `resolveStatus(intent, dateIso, now)` | `intent` (`'draft'` \| `'publish'`) + data → `'draft'` \| `'published'` \| `'scheduled'` |

`resolveStatus` é a única fonte da regra passado/futuro; o rótulo do botão e o payload consultam a mesma função, então não há como divergirem.

### 5.4 Payload

`buildPayload()` em `painel/lib/post-payload.js` passa a:

- incluir `date` (ISO UTC vindo de `fromLocalInputValue`); se o formulário não trouxer data, **omitir a chave** para não sobrescrever a data existente nem quebrar o default `now()`;
- aceitar os três status, delegando a decisão a `resolveStatus` (o editor passa `intent`, não `status` cru).

## 6. Painel — lista

`painel/screens/list.js`:

- Quarta aba no filtro: **Todos / Publicados / Agendados / Rascunhos**.
- Novo badge `badge--sched` (âmbar) com o texto "Agendado", ao lado dos badges de publicado e rascunho já existentes. Estilo em `painel/styles.css`, seguindo o padrão dos outros dois.
- A coluna "Data" já mostra `p.date` formatada e a ordenação já é `date` decrescente — um post agendado aparece naturalmente no topo, com a data futura visível. Nenhuma mudança de query.

## 7. Cron de publicação

`.github/workflows/publish-blog.yml` ganha o gatilho de cron e é dividido em **dois jobs**, para que a checagem periódica não arraste build nem FTP quando não há nada a publicar.

```yaml
on:
  repository_dispatch:
    types: [publish-blog]
  workflow_dispatch: {}
  schedule:
    - cron: '0,30 * * * *'
```

### Job `gate`

Roda em toda execução. Define o output `build` (`'true'` | `'false'`):

- Se o evento **não** é `schedule` (botão "Atualizar site" ou disparo manual): devolve `build=true` imediatamente, sem tocar no banco.
- Se o evento **é** `schedule`:
  1. `GET mt_posts?status=eq.scheduled&date=lte.<agora ISO>&select=id` com a service key.
  2. Resposta vazia → `build=false`. O workflow termina em ~10 s, sem build e sem FTP.
  3. Resposta com linhas → `PATCH mt_posts?status=eq.scheduled&date=lte.<agora ISO>` com `{"status":"published"}` e devolve `build=true`.

A promoção acontece **antes** do build, no banco. Por isso `build-blog.mjs` e `load-posts.mjs` não mudam nem uma linha: eles continuam lendo `status=eq.published` e o post promovido já está lá.

Efeito colateral desejável: depois que entra no ar, o post aparece como "Publicado" no painel, não mais como agendado.

### Job `build`

`needs: gate`, `if: needs.gate.outputs.build == 'true'`. É exatamente o job atual (conferir credenciais → build → sitemap → commit → FTP → marcar publicado), movido sem alteração interna. O passo final "Liberar flag de publicação" mantém seu `if: always()`, agora dentro de um job que só existe quando há o que publicar.

**Conferência de credenciais:** no caminho `schedule`, o job `gate` precisa de `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` (nos demais eventos ele não toca no banco e não exige nada). Se faltarem, ele falha explicitamente em vez de devolver `build=false` silenciosamente — um agendamento que não vai ao ar por secret ausente precisa aparecer como erro vermelho, não como execução verde.

## 8. Fuso horário

Todas as comparações são em UTC:

- o banco guarda `timestamptz`;
- o runner do GitHub roda em UTC e monta o `<agora ISO>` da consulta;
- o painel converte o valor local do `datetime-local` para ISO UTC na gravação e de volta para local na leitura.

O horário digitado em Porto Alegre é o horário que vale, inclusive atravessando mudanças de offset.

## 9. Testes

`npm test` (node:test, sem dependências) cobre:

| Arquivo | Casos |
|---|---|
| `painel/test/publish-date.test.js` (novo) | ida e volta local↔ISO; `resolveStatus` com data no passado, no futuro, no instante exato (`now` conta como passado → publica), e com `intent='draft'` sempre devolvendo `draft`; data ausente |
| `painel/test/post-payload.test.js` (existente) | `date` presente no payload quando informada; chave **ausente** quando não informada; status `scheduled` derivado de data futura |

O job `gate` não tem teste automatizado — é validado manualmente, uma vez, com `workflow_dispatch` e um post agendado para ~2 minutos à frente.

## 10. Fora de escopo

- **Coluna `modified`:** hoje recebe `now()` na criação e nunca é atualizada pelo painel. Mexer nisso é outro assunto e não entra aqui.
- **Despublicar por data de expiração.**
- **Notificação** (e-mail/WhatsApp) quando um agendado entra no ar.
- **Precisão de minuto exato** — aceita-se a folga do cron do GitHub.

## 11. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Post agendado vazar para o público antes da hora | RLS pública já filtra `status = 'published'`; o build usa a mesma query |
| Editar um post publicado e jogar a data para o futuro o tira do ar | Comportamento intencional (modelo WordPress), decidido no brainstorming; o rótulo do botão muda para "Agendar", sinalizando a consequência antes do clique |
| Cron do GitHub atrasar ou pular execuções em períodos de carga | Aceito. O gate promove **todos** os agendados vencidos, não só o do slot atual, então um cron pulado se resolve sozinho na execução seguinte |
| Checagem de 30 em 30 min poluir o histórico de Actions | Job `gate` termina em ~10 s e o job `build` nem aparece quando não há nada a publicar |
