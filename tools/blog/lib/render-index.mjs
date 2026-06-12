function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Chips de filtro: "Todos" + categorias distintas (cor da primeira ocorrência).
export function renderFilters(posts) {
  const seen = new Map();
  for (const p of posts) {
    const name = p.category?.name || '';
    if (name && !seen.has(name)) seen.set(name, p.category.color || '#057f7f');
  }
  const chips = ['<button class="blog-filter__chip is-active" type="button" data-filter="all">Todos</button>'];
  for (const [name, color] of seen) {
    chips.push(`<button class="blog-filter__chip" type="button" data-filter="${esc(name)}" style="--chip:${esc(color)}">${esc(name)}</button>`);
  }
  return chips.join('\n          ');
}

function card(p, i) {
  const cover = p.coverImage
    ? `<img src="${esc(p.coverImage)}" alt="${esc(p.title)}" loading="lazy" />`
    : '';
  const coverClass = p.coverImage ? 'blog-card__cover' : 'blog-card__cover blog-card__cover--empty';
  return `<article class="blog-card reveal" style="--i:${i % 3}" data-category="${esc(p.category?.name || '')}">
            <a class="blog-card__link" href="blog/${esc(p.slug)}/">
              <div class="${coverClass}" style="--chip:${esc(p.category?.color || '#057f7f')}">${cover}</div>
              <div class="blog-card__body">
                <span class="blog-card__tag" style="--chip:${esc(p.category?.color || '#057f7f')}">${esc(p.category?.name || '')}</span>
                <h3 class="blog-card__title">${esc(p.title)}</h3>
                <p class="blog-card__excerpt">${esc(p.excerpt)}</p>
                <span class="blog-card__meta">${esc(p.dateLabel)}</span>
              </div>
            </a>
          </article>`;
}

export function renderCards(posts) {
  return posts.map(card).join('\n          ');
}
