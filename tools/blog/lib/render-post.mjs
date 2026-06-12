import { navHTML, footerHTML, waLink } from './chrome.mjs';
import { sanitizeContent } from './sanitize-html.mjs';
import { readingTime } from './reading-time.mjs';

const SITE = 'https://drmarcioteixeira.com.br';
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

export function renderPostPage(post, related = []) {
  const title = post.seoTitle || `${post.title} · Blog · Dr. Márcio Teixeira`;
  const desc = post.metaDescription || post.excerpt || '';
  const url = `${SITE}/blog/${post.slug}/`;
  const ogImg = post.ogImage || post.coverImage || `${SITE}/logo/logo-header-colorido.png`;
  const mins = readingTime(post.content);
  const body = sanitizeContent(post.content);
  const ctaCta = waLink(`Olá, li o artigo "${post.title}" e gostaria de agendar uma avaliação.`);

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
</head>
<body class="is-loading">
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>

${navHTML('../../', 'blog')}

  <main id="conteudo">
    <article class="post">
      <header class="post-hero">
        <div class="container post-hero__inner">
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
      </header>

      ${post.coverImage ? `<figure class="post-cover"><img src="${esc(post.coverImage)}" alt="${attr(post.title)}" /></figure>` : ''}

      <div class="container post-body">
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
          <a class="btn btn--primary" href="${attr(ctaCta)}" target="_blank" rel="noopener">Agende sua consulta</a>
        </div>
      </div>
    </article>
    ${relatedSection(related)}
  </main>

${footerHTML('../../')}

  <script src="../../assets/js/main.js" defer></script>
  <script type="module" src="../../assets/js/likes.js"></script>
</body>
</html>
`;
}
