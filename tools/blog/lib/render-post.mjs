import { navHTML, footerHTML, CTA_ATTRS } from './chrome.mjs';
import { sanitizeContent } from './sanitize-html.mjs';
import { readingTime } from './reading-time.mjs';
import { TRACKING_HEAD, TRACKING_BODY, TRACKING_FOOT } from '../../lib/tracking.mjs';

const SITE = 'https://marciodermato.com.br';
const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function relatedCard(p) {
  const cover = p.coverImage
    ? `<img src="${esc(p.coverImage)}" alt="${esc(p.title)}" loading="lazy" />` : '';
  const coverClass = p.coverImage ? 'blog-card__cover' : 'blog-card__cover blog-card__cover--empty';
  return `<article class="blog-card">
            <a class="blog-card__link" href="../${esc(p.slug)}/">
              <div class="${coverClass}" style="--chip:${esc(p.category?.color || '#057f7f')}">${cover}</div>
              <div class="blog-card__body">
                <span class="blog-card__tag" style="--chip:${esc(p.category?.color || '#057f7f')}">${esc(p.category?.name || '')}</span>
                <h3 class="blog-card__title">${esc(p.title)}</h3>
                <span class="blog-card__meta">${esc(p.dateLabel)}</span>
              </div>
            </a>
          </article>`;
}

/* CTAs inseridos no meio do artigo — padrão em todo post do blog. */
function ctaConsulta(post) {
  return '<aside class="article-cta article-cta--consulta">'
    + '<div class="article-cta__body">'
    + '<p class="article-cta__eyebrow">Avaliação personalizada</p>'
    + '<h3 class="article-cta__title">Quer saber qual tratamento é ideal para você?</h3>'
    + '<p class="article-cta__text">O Dr. Márcio avalia o seu caso com o Método 4D e monta um plano sob medida, com resultados naturais.</p>'
    + '</div>'
    + `<a class="btn btn--primary article-cta__btn" ${CTA_ATTRS}>Agende sua consulta</a>`
    + '</aside>';
}

function ctaEbook() {
  return '<aside class="article-cta article-cta--ebook">'
    + '<div class="article-cta__body">'
    + '<p class="article-cta__eyebrow">E-book gratuito</p>'
    + '<h3 class="article-cta__title">Entenda o Método 4D em profundidade</h3>'
    + '<p class="article-cta__text">Baixe o e-book gratuito e descubra como avaliamos a pele em quatro dimensões para chegar a resultados naturais.</p>'
    + '</div>'
    + '<a class="btn btn--ghost article-cta__btn" href="../../ebook/Ebook-Metodo-4D.pdf" target="_blank" rel="noopener" download>Baixar o e-book</a>'
    + '</aside>';
}

// Insere os CTAs entre seções (antes de um <h2>), espaçados ~1/3 e ~2/3 do artigo.
function injectCtas(body, post) {
  const idxs = [];
  const re = /<h2/gi;
  let m;
  while ((m = re.exec(body))) idxs.push(m.index);

  // candidatos = limites de seção, exceto o 1º título e o último
  const candidates = idxs.slice(1, -1);
  if (!candidates.length) return body; // artigo curto: fica só com o CTA do rodapé

  const blocks = [];
  if (candidates.length >= 3) {
    blocks.push({ at: candidates[Math.floor(candidates.length / 3)], html: ctaConsulta(post) });
    blocks.push({ at: candidates[Math.floor((candidates.length * 2) / 3)], html: ctaEbook() });
  } else {
    blocks.push({ at: candidates[Math.floor(candidates.length / 2)], html: ctaConsulta(post) });
  }

  // dedupe de posições + inserção de trás para frente (não desloca índices)
  const seen = new Set();
  blocks
    .filter(b => (seen.has(b.at) ? false : seen.add(b.at)))
    .sort((a, b) => b.at - a.at)
    .forEach(b => { body = body.slice(0, b.at) + b.html + body.slice(b.at); });
  return body;
}

/* ---- Sidebar (Categorias · Tags · Posts recentes) — espelha o HD360 ---- */
function sideCategories(categories, post) {
  if (!categories || !categories.length) return '';
  const current = post.category?.name || '';
  const items = categories.map((c) => {
    const isCur = c.name === current;
    return `<li${isCur ? ' class="is-current"' : ''}>`
      + `<a href="../../blog.html?cat=${encodeURIComponent(c.name)}">`
      + `<span class="side-dot" style="--chip:${esc(c.color || '#057f7f')}" aria-hidden="true"></span>`
      + `${esc(c.name)}</a></li>`;
  }).join('\n          ');
  return `<section class="side-card">
          <h4 class="side-card__title">Categorias</h4>
          <ul class="side-cats">
          ${items}
          </ul>
        </section>`;
}

function sideTags(post) {
  const tags = post.tags || [];
  if (!tags.length) return '';
  const spans = tags
    .map((t) => `<span class="side-tag">#${esc(t)}</span>`).join('\n          ');
  return `<section class="side-card">
          <h4 class="side-card__title">Tags</h4>
          <div class="side-tags">
          ${spans}
          </div>
        </section>`;
}

function sideRecent(recent, post) {
  const list = (recent || []).filter((p) => p.slug !== post.slug).slice(0, 5);
  if (!list.length) return '';
  const items = list.map((p) => {
    const thumb = p.coverImage
      ? `<img src="${esc(p.coverImage)}" alt="${attr(p.title)}" loading="lazy" />` : '';
    const thumbClass = p.coverImage ? 'side-recent__thumb' : 'side-recent__thumb side-recent__thumb--empty';
    return `<li><a href="../${esc(p.slug)}/">`
      + `<span class="${thumbClass}">${thumb}</span>`
      + `<span class="side-recent__t">${esc(p.title)}</span></a></li>`;
  }).join('\n          ');
  return `<section class="side-card">
          <h4 class="side-card__title">Posts recentes</h4>
          <ul class="side-recent">
          ${items}
          </ul>
        </section>`;
}

function sidebar(post, opts) {
  return [
    sideCategories(opts.categories, post),
    sideTags(post),
    sideRecent(opts.recent, post),
  ].filter(Boolean).join('\n        ');
}

function relatedSection(related) {
  if (!related || !related.length) return '';
  return `
    <section class="section section--neve">
      <div class="container">
        <header class="ts-head ts-head--center">
          <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Leia também</p>
          <h2 class="ts-title">Mais do <span class="hl hl--italic">blog</span></h2>
        </header>
        <div class="blog-grid">
          ${related.map(relatedCard).join('\n          ')}
        </div>
      </div>
    </section>`;
}

export function renderPostPage(post, related = [], opts = {}) {
  const title = post.seoTitle || `${post.title} · Blog · Dr. Márcio Teixeira`;
  const desc = post.metaDescription || post.excerpt || '';
  const url = `${SITE}/blog/${post.slug}/`;
  const ogImg = post.ogImage || post.coverImage || `${SITE}/logo/logo-header-colorido.png`;
  const mins = readingTime(post.content);
  const body = injectCtas(sanitizeContent(post.content), post);

  const ld = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, description: desc, image: ogImg,
    datePublished: post.date, dateModified: post.modified,
    author: { '@type': 'Physician', name: 'Dr. Márcio Teixeira', medicalSpecialty: 'Dermatology' },
    publisher: {
      '@type': 'Organization', name: 'Dr. Márcio Teixeira',
      logo: { '@type': 'ImageObject', url: `${SITE}/logo/logo-header-colorido.png` },
    },
    mainEntityOfPage: url,
  };
  const crumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog.html` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(title)}</title>
  <meta name="description" content="${attr(desc)}" />
  <meta name="theme-color" content="#057f7f" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${attr(title)}" />
  <meta property="og:description" content="${attr(desc)}" />
  <meta property="og:image" content="${attr(ogImg)}" />
  <meta property="og:url" content="${url}" />
  <link rel="icon" type="image/png" href="../../logo/logo-header-colorido.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../assets/css/main.css" />
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <script type="application/ld+json">${JSON.stringify(crumbLd)}</script>
${TRACKING_HEAD}
</head>
<body class="is-loading">
${TRACKING_BODY}
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>

${navHTML('../../', 'blog')}

  <main id="conteudo">
    <article class="post">
      <header class="post-hero">
        <div class="container">
         <div class="post-hero__inner">
          <nav class="crumbs" aria-label="Você está em">
            <a href="../../index.html">Início</a>
            <span class="crumbs__sep" aria-hidden="true">/</span>
            <a href="../../blog.html">Blog</a>
            <span class="crumbs__sep" aria-hidden="true">/</span>
            <span class="crumbs__current">${esc(post.title)}</span>
          </nav>
          <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> ${esc(post.category?.name || 'Blog')}</p>
          <h1 class="post-hero__title">${esc(post.title)}</h1>
          <p class="post-hero__meta">${esc(post.dateLabel)} · ${mins} min de leitura</p>
         </div>
        </div>
      </header>

      <div class="container post-layout">
        <div class="post-main">
          ${post.coverImage ? `<figure class="post-cover"><img src="${esc(post.coverImage)}" alt="${attr(post.title)}" /></figure>` : ''}
          <div class="t-prose post-prose">
            ${body}
          </div>

          <div class="like" data-like="${esc(post.slug)}">
            <button class="like__btn" type="button" aria-pressed="false" aria-label="Curtir este artigo">
              <svg class="like__heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2 5 5.2 5c2 0 3.3 1.1 4.1 2.3.4.6.7.6 1.4.6h2.6c.7 0 1 0 1.4-.6C16.5 6.1 17.8 5 19.8 5 23 5 24.6 8.4 22 11.7 19.5 16.4 12 21 12 21z" /></svg>
              <span class="like__count">${Number(post.likes) || 0}</span>
            </button>
            <span class="like__hint">Gostou? Deixe seu coração.</span>
          </div>

          <div class="post-cta">
            <a class="btn btn--primary" ${CTA_ATTRS}>Agende sua consulta</a>
          </div>
        </div>

        <aside class="post-side">
        ${sidebar(post, opts)}
        </aside>
      </div>
    </article>
    ${relatedSection(related)}
  </main>

${footerHTML('../../')}

  <script src="../../assets/js/main.js" defer></script>
${TRACKING_FOOT}
  <script type="module" src="../../assets/js/likes.js"></script>
</body>
</html>
`;
}
