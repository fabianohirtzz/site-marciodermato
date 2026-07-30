/* Render do podcast "É uma Questão de Pele".

   Duas saídas a partir do mesmo tools/podcast/podcast.json:
   - renderHomeSection(): o bloco injetado entre os marcadores da index.html
   - renderPage(): a podcast.html inteira

   Sem I/O aqui de propósito, para o build e os testes poderem chamar as
   funções direto. */
import { CTA_ATTRS } from '../../lib/tracking.mjs';
import { navHTML, footerHTML } from '../../blog/lib/chrome.mjs';
import { TRACKING_HEAD, TRACKING_BODY, TRACKING_FOOT } from '../../lib/tracking.mjs';

const SITE = 'https://marciodermato.com.br';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Em atributo escapamos também as aspas, senão um título com aspas fecha o
   atributo e injeta markup. */
export const attr = (s = '') => esc(s).replace(/"/g, '&quot;');

/* "37:07" -> "37 min". Os minutos bastam para o visitante decidir se cabe
   agora; o segundo exato é ruído. */
export function minutos(duracao = '') {
  const [m] = String(duracao).split(':');
  const n = parseInt(m, 10);
  return Number.isFinite(n) ? `${n} min` : '';
}

export function validate(data) {
  const erros = [];
  if (!data || typeof data !== 'object') return ['podcast.json vazio ou inválido'];
  if (!Array.isArray(data.episodios) || !data.episodios.length) erros.push('nenhum episódio');
  if (!Array.isArray(data.shorts) || !data.shorts.length) erros.push('nenhum short');
  if (!data.canal) erros.push('canal ausente');

  for (const [i, ep] of (data.episodios || []).entries()) {
    for (const campo of ['id', 'num', 'titulo', 'duracao', 'publicado', 'capa', 'descricao']) {
      if (!ep[campo]) erros.push(`episodio[${i}]: falta "${campo}"`);
    }
  }
  for (const [i, s] of (data.shorts || []).entries()) {
    for (const campo of ['id', 'arquivo', 'titulo']) {
      if (!s[campo]) erros.push(`short[${i}]: falta "${campo}"`);
    }
  }
  // A regra de conformidade do projeto: "antes" e "depois" não podem aparecer
  // como par comparativo em nada que o Google leia.
  const texto = JSON.stringify(data).toLowerCase();
  if (/\bantes\b/.test(texto) && /\bdepois\b/.test(texto)) {
    erros.push('o par "antes"/"depois" não pode aparecer no conteúdo publicado');
  }
  return erros;
}

const PLAY_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.2-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5z"/></svg>';

/* Fachada do episódio: só a capa até o clique. O iframe do YouTube nasce no
   JS, então nenhum cookie do YouTube carrega em quem não assistir. */
function facade(ep, base = '', cls = '') {
  return `<button class="pfacade${cls}" type="button" data-yt="${attr(ep.id)}" data-kind="ep" aria-label="Assistir ao episódio ${ep.num}: ${attr(ep.titulo)}">
          <img class="pfacade__img" src="${base}${attr(ep.capa)}" alt="" loading="lazy" width="960" height="540" />
          <span class="pfacade__play" aria-hidden="true">${PLAY_SVG}</span>
          <span class="pfacade__time">${esc(minutos(ep.duracao))}</span>
        </button>`;
}

/* Deslocamento vertical de cada card, como no carrossel de Resultados: quebra
   a régua reta e dá ritmo à faixa. Ciclo fixo, para o build ser determinístico. */
const DEGRAUS = [0, 2.4, 1.1, 3, 0.6, 1.8];

/* Um card do trilho. O preview local é mudo e sem áudio no arquivo; o short
   completo, com som, abre no lightbox do YouTube. */
function corteItem(s, i, base = '') {
  // O título fica FORA do vídeo: os shorts já trazem legenda queimada, e um
  // rótulo por cima viraria texto sobre texto.
  return `          <li class="corte-item">
            <article class="corte" style="--off:${DEGRAUS[i % DEGRAUS.length]}">
              <button class="corte__btn" type="button" data-yt="${attr(s.id)}" data-corte-index="${i}" aria-label="Assistir: ${attr(s.titulo)}">
                <video class="corte__video" playsinline muted loop preload="none" poster="${base}assets/podcast/${attr(s.arquivo)}.jpg">
                  <source src="${base}assets/podcast/${attr(s.arquivo)}.mp4" type="video/mp4" />
                </video>
                <span class="corte__play" aria-hidden="true">${PLAY_SVG}</span>
              </button>
              <p class="corte__title">${esc(s.titulo)}</p>
            </article>
          </li>`;
}

const SETAS = `        <div class="cortes__nav" role="group" aria-label="Navegar pelos cortes">
          <button class="cortes__arrow" type="button" data-cortes-prev aria-label="Ver corte anterior" disabled><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="cortes__arrow" type="button" data-cortes-next aria-label="Ver próximo corte"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>`;

/* O trilho segue a anatomia do carrossel de Resultados da home: cabeçalho com
   as setas à direita e a faixa sangrando de ponta a ponta. */
function trilho(shorts, cabecalho, base = '') {
  return `      <div class="container cortes__top">
        <div class="cortes__head reveal">
${cabecalho}
${SETAS}
        </div>
      </div>

      <div class="cortes__viewport reveal">
        <ul class="cortes__track" data-cortes-track tabindex="0" role="list" aria-label="Cortes do podcast">
${shorts.map((s, i) => corteItem(s, i, base)).join('\n')}
        </ul>
      </div>`;
}

export function renderHomeSection(data) {
  const dest = data.episodios[0];
  const shorts = data.shorts.filter((s) => s.home);
  return `    <section class="section section--neve podcast" id="podcast" aria-labelledby="podcast-title" data-podcast>
      <div class="container">
        <header class="ts-head ts-head--center">
          <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Podcast</p>
          <h2 class="ts-title" id="podcast-title">É uma <span class="hl hl--italic">Questão de Pele</span></h2>
          <p class="ts-lede">${esc(data.apresentadores)} conversam sobre pele, cabelo e saúde sem complicar. Ciência de um lado, consultório do outro.</p>
        </header>

        <div class="podcast__feature reveal">
          ${facade(dest)}
          <div class="podcast__body">
            <p class="podcast__ep">Episódio ${esc(String(dest.num))} · ${esc(minutos(dest.duracao))}</p>
            <h3 class="podcast__ep-title">${esc(dest.titulo)}</h3>
            <p class="podcast__ep-desc">${esc(dest.descricao)}</p>
            <div class="podcast__actions">
              <a class="btn btn--primary" href="podcast.html">Ver todos os episódios</a>
              <a class="btn btn--ghost" href="${attr(data.canal)}" target="_blank" rel="noopener">Conhecer o canal</a>
            </div>
          </div>
        </div>
      </div>

${trilho(
  shorts,
  `          <div class="cortes__intro">
            <p class="cortes__label">Cortes rápidos</p>
            <p class="cortes__hint">Os trechos que mais rendem dúvida no consultório, em menos de um minuto.</p>
          </div>`
)}
    </section>`;
}

function head(title, description, canonical, extra = '') {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${attr(title)}</title>
  <meta name="description" content="${attr(description)}" />
  <meta name="theme-color" content="#057f7f" />
  <link rel="canonical" href="${attr(canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${attr(title)}" />
  <meta property="og:description" content="${attr(description)}" />
  <meta property="og:url" content="${attr(canonical)}" />
  <meta property="og:image" content="${SITE}/assets/podcast/og-podcast.jpg" />
  <link rel="icon" type="image/png" href="logo/logo-header-colorido.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/main.css" />
${extra}${TRACKING_HEAD}
</head>`;
}

/* JSON-LD: a série mais um VideoObject por episódio. Sem contagem de
   inscritos nem de visualizações em lugar nenhum. */
function jsonLd(data) {
  const canonical = `${SITE}/podcast.html`;
  const series = {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: data.nome,
    url: canonical,
    description: data.sobre,
    webFeed: data.canal,
    author: { '@type': 'Person', name: 'Dr. Márcio Teixeira' },
  };
  const videos = data.episodios.map((ep) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `${data.nome} · Episódio ${ep.num}: ${ep.titulo}`,
    description: ep.descricao,
    thumbnailUrl: `${SITE}/${ep.capa}`,
    uploadDate: ep.publicado,
    duration: `PT${Math.floor(ep.segundos / 60)}M${ep.segundos % 60}S`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${ep.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${ep.id}`,
  }));
  return [series, ...videos]
    .map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n');
}

export function renderPage(data) {
  const title = `Podcast É uma Questão de Pele · Dr. Márcio Teixeira`;
  const description =
    'O podcast do Dr. Márcio Teixeira, dermatologista e tricologista em Porto Alegre, sobre pele, cabelos e saúde. Episódios completos e cortes rápidos.';

  const episodios = data.episodios
    .map(
      (ep) => `        <article class="pep reveal">
          ${facade(ep, '', ' pfacade--card')}
          <div class="pep__body">
            <p class="pep__meta">Episódio ${esc(String(ep.num))} · ${esc(minutos(ep.duracao))}</p>
            <h3 class="pep__title">${esc(ep.titulo)}</h3>
            <p class="pep__desc">${esc(ep.descricao)}</p>
          </div>
        </article>`
    )
    .join('\n');

  return `${head(title, description, `${SITE}/podcast.html`, jsonLd(data) + '\n')}
<body class="is-loading">
${TRACKING_BODY}
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>

${navHTML('', 'podcast')}

  <main id="conteudo">
    <!-- A hero empresta o nude e o dourado da identidade do podcast, que é
         própria e diferente do teal do consultório. O selo é o logo do canal. -->
    <section class="section phero" aria-labelledby="phero-title">
      <div class="container phero__inner">
        <div class="phero__text">
          <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Podcast</p>
          <h1 class="phero__title" id="phero-title">É uma <span class="hl hl--italic">Questão de Pele</span></h1>
          <p class="phero__tagline">A ciência que transforma sua pele.</p>
          <p class="phero__lede">${esc(data.sobre)}</p>
          <ul class="phero__hosts">
            <li>
              <strong>Dr. Márcio Teixeira</strong>
              <span>Dermatologista e tricologista, criador do Método 4D</span>
            </li>
            <li>
              <strong>Cristine Prato</strong>
              <span>Farmacêutica, da Farmatec Farmácia de Manipulação</span>
            </li>
          </ul>
        </div>
        <figure class="phero__media reveal">
          <img class="phero__photo" src="assets/podcast/hero-dupla.jpg" alt="Dr. Márcio Teixeira e Cristine Prato, apresentadores do podcast" width="900" height="1082" />
          <img class="phero__seal" src="assets/podcast/logo-podcast.jpg" alt="" width="420" height="420" loading="lazy" />
        </figure>
      </div>
    </section>

    <section class="section section--branco" aria-labelledby="episodios-title" data-fio="left">
      <div class="container">
        <header class="ts-head">
          <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Episódios</p>
          <h2 class="ts-title" id="episodios-title">Conversas <span class="hl hl--italic">completas</span></h2>
          <p class="ts-lede">Cada episódio percorre um dos eixos do Método 4D, o protocolo de avaliação criado pelo Dr. Márcio.</p>
        </header>
        <div class="pep-list">
${episodios}
        </div>
      </div>
    </section>

    <section class="section section--neve podcast" aria-labelledby="cortes-title">
${trilho(
  data.shorts,
  `          <div class="cortes__intro">
            <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Cortes</p>
            <h2 class="section__title" id="cortes-title">Respostas <span class="hl hl--italic">rápidas</span></h2>
            <p class="section__lede cortes__hint">Os trechos que mais rendem dúvida no consultório, em menos de um minuto.</p>
          </div>`
)}
    </section>

    <section class="section section--deep cta-band" id="agende" aria-labelledby="cta-title">
      <div class="container">
        <img class="cta-band__logo reveal" src="logo/logo-header-branco.png" alt="Dr. Márcio Teixeira" loading="lazy" />
        <h2 id="cta-title" class="section__title reveal">Sua pele merece uma <span class="hl--italic">avaliação de verdade</span></h2>
        <p class="cta-band__lede reveal">O conteúdo do podcast informa. O diagnóstico é individual, e acontece na consulta.</p>
        <div class="cta-band__actions reveal">
          <a class="btn btn--on-deep" ${CTA_ATTRS}>Agende sua consulta</a>
          <a class="btn btn--ghost-on-deep" href="metodo-4d.html">Conheça o Método 4D</a>
        </div>
      </div>
    </section>
  </main>

${footerHTML('')}

  <script src="assets/js/main.js" defer></script>
${TRACKING_FOOT}
</body>
</html>
`;
}
