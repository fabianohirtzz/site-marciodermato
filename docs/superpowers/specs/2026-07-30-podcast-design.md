# Podcast "É uma Questão de Pele" no site + WhatsApp do rodapé no formulário

**Data:** 2026-07-30
**Branch:** `feat/podcast`

## Contexto

O Dr. Márcio mantém o podcast **É uma Questão de Pele** no YouTube
(`@ÉUmaQuestãodePele01`) e pediu para incorporá-lo ao site, como reforço de
autoridade. Levantamento do canal em 30/07/2026:

- **3 episódios** completos, cadência mensal: EP 01 (48:32), EP 02 (50:59),
  EP 03 "Skincare básico: hidratação" (37:07).
- **14 Shorts**, cortes dos episódios. Os de melhor desempenho: "A piada de Deus
  e a criação da pele" (1 mil), "Pele seca envelhece mais?" (554), "O segredo
  para disfarçar rugas" (286).
- Canal novo, com 28 inscritos.

Como o canal ainda é pequeno, **nenhuma métrica pública entra no site**: sem
contagem de inscritos, sem visualizações. O site mostra o conteúdo, não o
tamanho da audiência.

Junto disso, o ícone do WhatsApp no rodapé ainda apontava para o `wa.me`,
enquanto o restante do site já converte pelo popup do formulário MeuTrack.

## Escopo

1. Rodapé: ícone do WhatsApp **e** número de telefone passam a abrir o popup do
   formulário. Ícone do YouTube entra nas Redes.
2. Navegação: item **Podcast** no menu; CTA "Agende sua consulta" sai do nav
   desktop; drawer mobile ganha Podcast e uma fileira de ícones sociais.
3. Seção do podcast na home.
4. Página `podcast.html` completa.
5. Widget do podcast na sidebar dos posts do blog.
6. SEO: JSON-LD, meta tags, sitemap.

## Decisões e alternativas descartadas

### Vídeos: híbrido, não embed puro nem self-hosted puro

Os Shorts do trilho são **auto-hospedados**, em loop mudo, no padrão que já
usamos no projeto Castello. O clique abre um **lightbox com o embed do YouTube**,
com som e autoplay.

Isso resolve os dois lados: o trilho fica com o visual premium e o carregamento
rápido do arquivo local, e o play no lightbox conta como visualização real para
o canal, sem tirar o visitante do site.

- *Embed puro* foi descartado: sem loop silencioso e com thumbnail do YouTube, o
  trilho fica visualmente pobre.
- *Self-hosted puro* foi descartado: não gera nada para o canal do Dr. Márcio.

O preview local carrega apenas os **primeiros 12 segundos** de cada Short, em
540px de largura, H.264, **sem faixa de áudio**. Isso fica em torno de 300 KB
por vídeo (~4 MB no total) contra cerca de 20 MB se levasse os shorts inteiros.
O short completo o visitante vê no lightbox.

O iframe do YouTube só é criado no clique, e usa `youtube-nocookie.com`. Nenhum
cookie do YouTube carrega antes da interação.

### CTA fora do nav desktop

Decisão do cliente, para abrir espaço ao item Podcast. Fica registrada a
ressalva: isso remove a CTA principal do desktop em todas as páginas. Vale
acompanhar os leads no MeuTrack depois de publicar. No mobile nada muda, o
`.drawer__cta` continua.

Implementação: remover o elemento `.nav__cta` do HTML resolve os dois casos,
porque o CTA mobile vem do drawer. Não é preciso CSS condicional.

### Ícone do YouTube em teal, não em vermelho

O sistema de design abre exceção de cor apenas para o dourado do Google
(avaliações) e o verde do WhatsApp (botão flutuante). O YouTube entra em
`currentColor`, igual a Instagram e Facebook.

### Fonte única de dados com gerador

`tools/podcast/podcast.json` guarda episódios e shorts. `tools/build-podcast.mjs`
gera `podcast.html` inteira e injeta o bloco da home entre marcadores
`<!-- PODCAST:START -->` / `<!-- PODCAST:END -->` no `index.html`.

Alternativa descartada: escrever a home à mão e a página pelo gerador. Duplicaria
a lista de shorts em dois lugares, e ela muda todo mês.

## Arquitetura

### Dados: `tools/podcast/podcast.json`

```jsonc
{
  "canal": "https://www.youtube.com/@ÉUmaQuestãodePele01",
  "episodios": [
    { "id": "GSCntb2YkYk", "num": 3, "titulo": "...", "duracao": "37:07",
      "publicado": "2026-07-16", "descricao": "..." }
  ],
  "shorts": [
    { "id": "Q5KsiC4d2hU", "titulo": "...", "arquivo": "short-01" }
  ]
}
```

Os episódios vêm em ordem decrescente; o primeiro da lista é o destaque da home.
As descrições são extraídas do canal e revisadas antes de publicar.

### Gerador: `tools/build-podcast.mjs`

- Lê o JSON, valida campos obrigatórios e a existência dos arquivos de vídeo.
- Escreve `podcast.html` a partir do template, reaproveitando `TRACKING_HEAD`,
  `TRACKING_BODY`, `TRACKING_FOOT` e `CTA_ATTRS` de `tools/lib/tracking.mjs`.
- Substitui o bloco marcado no `index.html`.
- Escapa HTML em todo texto vindo do JSON.
- Script npm: `build:podcast`. Teste em `tools/test/`, no padrão `node --test`.

### Mídia: `assets/podcast/`

`short-01.mp4` … `short-14.mp4`, cada um com seu `short-NN.jpg` (frame de ~1s).

Pipeline de atualização, documentado em `tools/podcast/README.md`:

```bash
pip install yt-dlp
yt-dlp -f "bv*[height<=1080]" -o "raw-%(id)s.%(ext)s" https://youtube.com/shorts/<ID>
ffmpeg -i raw-<ID>.mp4 -t 12 -vf "scale=540:-2" -c:v libx264 -crf 28 -an assets/podcast/short-NN.mp4
ffmpeg -ss 1 -i assets/podcast/short-NN.mp4 -frames:v 1 -q:v 4 assets/podcast/short-NN.jpg
```

### Seção da home

Posição: entre *Tratamentos em destaque* e *Avaliações* — "o que fazemos → a voz
do médico → o que dizem". Fundo `--branco` com wash de areia, para não colidir
com o `--neve` da seção anterior.

Anatomia, seguindo o template de seção do sistema:

```
eyebrow "Podcast"
título serif "É uma Questão de Pele"
lede de uma linha
split: fachada 16:9 do episódio mais recente | título, descrição, "Ver todos os episódios"
trilho horizontal de Shorts 9:16, largura total
```

### Página `podcast.html`

Padrão de raiz do site, como `blog.html`. Estrutura:

1. Hero compacto, sem vídeo.
2. O que é o podcast, para quem, cadência.
3. Os 3 episódios em cards, com fachada 16:9, duração e descrição.
4. Grade completa dos 14 Shorts.
5. CTA duplo: inscrever no canal / agendar consulta.

### Comportamento (`assets/js/main.js`)

- **Trilho:** `preload="none"`; `IntersectionObserver` dá play quando o card
  entra na viewport e pausa quando sai. No mobile (<768px), toca apenas o card
  centralizado.
- **Lightbox:** overlay 9:16 com iframe `youtube-nocookie` (`autoplay=1&rel=0`),
  setas prev/next trocando o ID, contador "3 / 14", link "Ver no YouTube", fecha
  com ESC e clique fora. Foco preso no overlay enquanto aberto.
- **Fachada dos episódios:** thumbnail estática; o iframe 16:9 só é injetado no
  clique.
- **`prefers-reduced-motion: reduce`:** o trilho não roda em loop, mostra só o
  poster. O clique continua funcionando.

### Rodapé e navegação

- Ícone social do WhatsApp e o número `(51) 99970-4848` recebem `CTA_ATTRS`
  (`data-th-quiz` + href de fallback do formulário).
- Ícone do YouTube entra nas Redes, apontando para o canal.
- "Podcast" entra na coluna Navegação.
- Nav: item **Podcast** entre *Sobre* e *Blog*; elemento `.nav__cta` removido.
- Drawer: link Podcast, CTA mantido, e fileira de ícones sociais (Instagram,
  Facebook, YouTube, WhatsApp) no rodapé do painel.

Isso alcança **32 arquivos**: 7 páginas de raiz, 15 tratamentos e 10 posts. Os
gerados saem de `tools/build-treatments.mjs` e `tools/blog/lib/`; os manuais são
editados direto. Depois, rodar `build:treatments` e `build:blog`.

### Blog

Widget "Ouça o podcast" na sidebar dos posts, em
`tools/blog/lib/render-post.mjs`, com o episódio mais recente e link para
`podcast.html`. Widget fixo, não curadoria por post.

### SEO

- `podcast.html`: title, description, OG, canonical.
- JSON-LD `PodcastSeries` com um `VideoObject` por episódio.
- Entrada em `tools/build-sitemap.mjs`.

## Riscos

**Deploy acidental na Erehost.** O workflow `publish-blog.yml` roda a cada 30
min e, quando um post agendado vence ou há `pending_build`, faz build e deploy
FTPS de **master** para a hospedagem. O cliente quer validar no GitHub Pages
antes do deploy. Por isso o trabalho fica em `feat/podcast` e o merge em master
só acontece depois do OK.

**Manutenção mensal.** Cada Short novo exige rodar o pipeline de download.
Documentado em `tools/podcast/README.md`. Com cadência mensal, é tranquilo.

## Fora de escopo

- Player de áudio próprio ou distribuição em Spotify/Apple Podcasts.
- Transcrições dos episódios.
- Atualização automática do canal via API do YouTube.
