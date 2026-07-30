# Podcast "É uma Questão de Pele" — como atualizar

O canal: <https://www.youtube.com/@%C3%89UmaQuest%C3%A3odePele01>

Tudo sai de **`podcast.json`**. Ele alimenta três lugares:

- `podcast.html` (página inteira, gerada)
- a seção da home, injetada entre `<!-- PODCAST:START -->` e `<!-- PODCAST:END -->`
- o card "Ouça o podcast" na sidebar dos posts do blog

Nunca edite `podcast.html` nem o bloco da home à mão: o próximo build sobrescreve.

## Como o vídeo funciona

Os cortes do trilho são **arquivos locais de 12 segundos, mudos e sem faixa de
áudio** — servem só para dar movimento. O short completo, com som, abre num
lightbox com o player do YouTube (`youtube-nocookie`), criado apenas no clique.
Assim o play conta como visualização real para o canal, e quem não assiste não
recebe cookie nenhum do YouTube.

Os episódios longos nunca são baixados: só a capa é local, e o player abre no
mesmo lightbox, em 16:9.

## Episódio novo

1. Baixe a capa e reduza para 960px de largura:

   ```bash
   curl -sL "https://i.ytimg.com/vi/<ID>/maxresdefault.jpg" -o raw.jpg
   ffmpeg -y -i raw.jpg -vf "scale=960:-2" -q:v 5 assets/podcast/ep-04.jpg
   ```

2. Acrescente o episódio **no topo** da lista `episodios` do `podcast.json`.
   O primeiro da lista é o destaque da home e o card do blog. Campos: `id`
   (o código de 11 caracteres da URL), `num`, `titulo`, `duracao` (`MM:SS`),
   `segundos`, `publicado` (`AAAA-MM-DD`), `capa`, `descricao`.

3. `npm run build:podcast && npm run build:sitemap`

## Corte (Short) novo

1. Baixe os primeiros segundos e reencode:

   ```bash
   pip install yt-dlp   # só na primeira vez

   python -m yt_dlp -f "bv*[height<=1080]/bv*" \
     --download-sections "*0-14" --force-keyframes-at-cuts \
     -o "raw.%(ext)s" "https://www.youtube.com/shorts/<ID>"

   ffmpeg -y -i raw.mp4 -t 12 -vf "scale=480:-2,fps=24" \
     -c:v libx264 -preset slow -crf 30 -profile:v main \
     -movflags +faststart -an assets/podcast/short-15.mp4

   ffmpeg -y -ss 1 -i assets/podcast/short-15.mp4 -frames:v 1 \
     -vf "scale=360:-2" -q:v 6 assets/podcast/short-15.jpg
   ```

   Mire em algo perto de 300 KB por arquivo. O trilho da home carrega vários.

2. Acrescente ao **topo** da lista `shorts`: `id`, `arquivo` (sem extensão),
   `titulo`, e `"home": true` se ele deve entrar no trilho da home.

   O `titulo` é escrito por nós, não copiado do YouTube: os títulos de lá vêm
   cheios de hashtag. Ele aparece embaixo do card e no `aria-label`.

3. `npm run build:podcast`

## Regras que o build cobra

`node tools/build-podcast.mjs` falha, sem gravar nada, se:

- faltar campo obrigatório em algum episódio ou corte;
- faltar o `.mp4` ou o `.jpg` de algum corte, ou a capa de algum episódio;
- o par **"antes"/"depois"** aparecer em qualquer texto (política do Google
  para saúde, ver a seção de conformidade no `COPY-TRATAMENTOS.md`).

Nenhuma métrica do canal entra no site: sem inscritos, sem visualizações.
Há teste cobrindo isso em `tools/test/podcast.test.mjs`.

## Depois de mexer no blog

O card da sidebar sai de `tools/blog/lib/render-post.mjs` e lê o `podcast.json`
no build. Para ele apontar para um episódio novo, republique o blog pelo painel
(o Actions roda com as credenciais do Supabase). Rodar `npm run build:blog`
local **sem** `SUPABASE_URL`/`SUPABASE_SERVICE_KEY` usa o seed de 2 posts
placeholder e apaga os posts reais.
