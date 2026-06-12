/* Filtro de categorias do índice do blog. Sem dependências.
   Lê ?cat=Nome da URL (deep-link das chips) e filtra os cards por data-category. */
(function () {
  const filter = document.querySelector('[data-blog-filter]');
  const grid = document.querySelector('[data-blog-grid]');
  if (!filter || !grid) return;
  const empty = document.querySelector('[data-blog-empty]');
  const chips = [...filter.querySelectorAll('.blog-filter__chip')];
  const cards = [...grid.querySelectorAll('.blog-card')];

  function apply(value) {
    let visible = 0;
    for (const card of cards) {
      const match = value === 'all' || card.dataset.category === value;
      card.hidden = !match;
      if (match) visible++;
    }
    for (const chip of chips) chip.classList.toggle('is-active', chip.dataset.filter === value);
    if (empty) empty.hidden = visible !== 0;
  }

  filter.addEventListener('click', (e) => {
    const chip = e.target.closest('.blog-filter__chip');
    if (!chip) return;
    const value = chip.dataset.filter;
    apply(value);
    const url = new URL(location.href);
    if (value === 'all') url.searchParams.delete('cat');
    else url.searchParams.set('cat', value);
    history.replaceState(null, '', url);
  });

  const initial = new URLSearchParams(location.search).get('cat');
  if (initial && chips.some(c => c.dataset.filter === initial)) apply(initial);
})();
