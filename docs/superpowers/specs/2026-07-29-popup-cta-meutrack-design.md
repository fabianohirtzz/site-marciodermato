# CTAs em popup rastreado (MeuTrack) — Site Dr. Márcio

**Data:** 2026-07-29
**Status:** Aprovado para planejamento
**Origem:** solicitação da agência de tráfego pago do Dr. Márcio

---

## 1. Objetivo

Hoje todo CTA de conversão do site leva o visitante **para fora do domínio** — abre `meutrack-ingest.carlosabsj-ti.workers.dev/f/...` em nova aba. A agência pediu que o formulário passe a abrir **como popup dentro do próprio site**, sem redirecionamento, preservando o rastreio de origem do lead (UTM/gclid/visitante).

Motivo do pedido: manter a jornada dentro do domínio anunciado, evitando o redirect para um domínio de terceiro nas campanhas do Google Ads.

## 2. Situação atual (o que já existe)

- O pixel `t.js?p=4TqtCgzLsewg` **já está em todas as 25 páginas** — a atribuição de UTM/gclid/visitante já funciona.
- **186 links `<a>`** em 23 páginas apontam para `https://meutrack-ingest.carlosabsj-ti.workers.dev/f/ng_MXvkuBh` com `target="_blank"`.
- `contato.html:143` já usa o `embed.js` em **modo inline** (`data-form="ng_MXvkuBh"`).
- `assets/js/main.js:714` tem o bloco `trackedCtas()`, que injeta `visitorId` e UTMs na querystring do href dos CTAs (o formulário roda em outra origem e não enxerga o storage do site).
- Os CTAs de páginas geradas vêm de três scripts: `tools/build-treatments.mjs:119` (15 páginas de tratamento), `tools/blog/lib/chrome.mjs` (blog) e `scripts/build-stubs.mjs:8` (não está no `package.json`; não é executado no fluxo atual).
- WhatsApp direto (`wa.me`) aparece só no rodapé — telefone escrito e ícone social. Não é CTA de conversão.

### O `embed.js` da MeuTrack

O script tem **dois modos**, e o modo popup já é nativo:

- **Inline** — `<script src=".../embed.js" data-form="X">` injeta um iframe naquele ponto do DOM.
- **Modal** — carregado **sem** `data-form`, instala um listener delegado no `document`. Qualquer clique em elemento com `data-th-quiz="X"` (ou `data-th-form`) sofre `preventDefault()` e abre o formulário em iframe sobre a página, via `?popup=1`.

O modo modal já trata: montagem da URL com `ref` (URL atual) e `vid` (visitorId), fechamento por `Escape` e por botão "×", trava do scroll do `<html>`, ajuste dinâmico de altura por `postMessage`, e o redirect final quando o formulário conclui. Há uma guarda `window.__thModal` que impede dois overlays caso o script carregue duas vezes na mesma página.

No modo popup, o formulário já vem tematizado na marca: `--th-primary: #3DAAA8` (teal), fonte Poppins, logo do Dr. Márcio, card branco (`--th-surface: #ffffff`) com `border-radius: 14px` e sombra forte. O `<style id="th-popup">` do worker zera o fundo de `html, body` — ou seja, **o card flutua sobre um backdrop transparente**.

**Conclusão: não precisamos construir modal nenhum. Precisamos ativar o modo modal e vesti-lo.**

## 3. Decisões tomadas (brainstorming)

| Tema | Decisão |
|---|---|
| Formulário | **Trocar tudo para `PGW6nIOmTX`** — inclusive o embed inline da `contato.html`. O `ng_MXvkuBh` sai do site. |
| Mecanismo | **Modo modal nativo do `embed.js`** via `data-th-quiz` |
| Visual | **Backdrop escurecido + blur**, aplicado por uma camada de estilo nossa sobre o overlay deles |
| Escopo | **Somente os 186 CTAs que hoje apontam para o formulário** |
| Fallback | **Manter o `href` atual** em cada CTA |

**Descartado:**

- *Modal próprio* (construir o overlay do zero apontando o iframe para `/f/PGW6nIOmTX?popup=1`) — daria controle visual total, mas duplicaria a lógica de `visitorId`, altura dinâmica e redirect final; qualquer mudança no worker poderia quebrar o site.
- *Nativo puro sem estilo* — o card branco sobre seção clara se perde no fundo e a página continua competindo com o formulário.
- *E-book atrás do formulário* — transformar os 5 botões de download em lead magnet aumentaria captura, mas cria atrito num material hoje baixado direto e exige que o formulário entregue o PDF ao final. Fora do escopo.
- *WhatsApp do rodapé no popup* — tiraria o contato direto de quem só quer ligar ou mandar mensagem.

## 4. Arquitetura

Um único `embed.js` por página, em modo modal:

```html
<script async src="https://meutrack-ingest.carlosabsj-ti.workers.dev/embed.js"></script>
```

Vai antes do `</body>`, depois do `main.js`. Sem `data-form` — só o modo modal. Inclusive em `contato.html`, que já carrega o `embed.js` em modo inline: a tag do modal entra lá também, para que os CTAs da página não dependam da presença do formulário inline. A guarda `window.__thModal` cobre o duplo carregamento.

Cada CTA de conversão fica assim:

```html
<a class="btn btn--primary" data-th-quiz="PGW6nIOmTX"
   href="https://meutrack-ingest.carlosabsj-ti.workers.dev/f/PGW6nIOmTX"
   target="_blank" rel="noopener">Agendar avaliação</a>
```

O `href` e o `target="_blank"` **permanecem de propósito**: o `embed.js` dá `preventDefault()` no clique, então o link só dispara se o script não carregar (worker fora do ar, adblock, falha de rede). Nesse caminho, o comportamento é exatamente o de hoje — nenhum CTA fica morto. Por isso o `trackedCtas()` do `main.js` continua existindo: ele alimenta o href do fallback.

Não há JS por botão nem inicialização: o listener é delegado no `document`, então funciona também em conteúdo inserido depois.

### Camada de estilo do modal

O overlay é criado pelo `embed.js` com estilos inline e sem classe. Um `MutationObserver` no `<body>` detecta o nó pelo `z-index: 2147483000` e aplica a classe `.th-modal`. A partir daí o CSS assume:

- backdrop `rgba(11, 42, 46, .62)` com `backdrop-filter: blur(3px)`
- fade-in de 180ms (suprimido sob `prefers-reduced-motion: reduce`)
- botão de fechar no teal da marca em vez do círculo cinza padrão
- `role="dialog"` + `aria-modal="true"` no overlay, com o foco indo para o iframe ao abrir

Como os estilos do `embed.js` são inline, as regras precisam de `!important`. Toda a lógica continua deles — nós só vestimos. Se a MeuTrack atualizar o `embed.js`, o pior caso é o backdrop deixar de ser aplicado; o popup segue funcionando.

## 5. Arquivos tocados

| Alvo | Mudança |
|---|---|
| 25 páginas HTML | tag do `embed.js` antes do `</body>` |
| 186 links `<a>` | `+ data-th-quiz="PGW6nIOmTX"` e ID novo no `href` |
| `contato.html:143` | embed inline passa de `ng_MXvkuBh` → `PGW6nIOmTX` |
| `assets/js/main.js` | ID novo no `trackedCtas()` + camada de estilo do modal |
| `assets/css/` | regras do `.th-modal` |
| `tools/build-treatments.mjs` | constante `CTA` + tag do embed no template |
| `tools/blog/lib/chrome.mjs` | mesma mudança no chrome do blog |
| `scripts/build-stubs.mjs` | atualizado para não reintroduzir o padrão antigo (**não será executado**) |

### Páginas geradas

- **Tratamentos** — alterar `build-treatments.mjs` e rodar `npm run build:treatments`. O gerador lê `COPY-TRATAMENTOS.md` e roda offline; o diff das 15 páginas deve conter apenas as mudanças previstas.
- **Blog** — `tools/build-blog.mjs` depende do Supabase. Alterar `chrome.mjs` e aplicar a mesma transformação no único post já gerado, de forma que o próximo build reproduza o HTML idêntico. Se o build puder rodar, rodá-lo e conferir que o diff é vazio.

## 6. Riscos e limites

- **Redirect final:** ao concluir o formulário, o `embed.js` executa `location.href = url` (provavelmente WhatsApp), substituindo a página inteira do site. É comportamento do script da MeuTrack e não é interceptável de fora. **Confirmar com a agência se é o desejado.**
- **Dependência de terceiro:** o formulário roda em iframe do worker. Se o worker estiver fora do ar, o card abre vazio. O fallback do `href` cobre falha de carregamento do `embed.js`, não falha do worker.
- **Corte no histórico:** trocar `ng_MXvkuBh` por `PGW6nIOmTX` cria uma descontinuidade no relatório de leads da MeuTrack. Decisão consciente da agência.
- **Duplo carregamento em `contato.html`:** a página terá o embed inline e o modal. A guarda `window.__thModal` cobre isso; validar em QA que só abre um overlay por clique.

## 7. Verificação

Rodar o site local (`node scripts/serve.mjs`) e auditar com Playwright em desktop e mobile:

1. O popup abre **sem sair do domínio** (a URL da aba não muda) a partir de um CTA do header, um do corpo e um do rodapé.
2. `Escape` e o botão "×" fecham; o scroll do site volta ao normal depois de fechar.
3. O card fica legível sobre seção clara **e** sobre seção escura (teal).
4. O scroll da página trava enquanto o popup está aberto.
5. Um clique = um overlay, inclusive em `contato.html`.
6. Mobile (375px): o card cabe na viewport e o "×" fica alcançável.
7. Console sem erros novos.

Varreduras no repositório:

- nenhuma ocorrência de `ng_MXvkuBh` fora de arquivos de histórico;
- todo `<a>` que aponta para `workers.dev/f/` tem `data-th-quiz`;
- toda página HTML publicada carrega o `embed.js`.
