# INTERACTIONS.md — Behavior & wiring

Animation is *how things move* (see ANIMATIONS.md). Interaction is *how the patient makes things move*. This is the behavior layer for **Dr. Márcio Teixeira** — every interactive control on a premium dermatology site. For a health brand, **accessibility is brand-defining**: every control is a real `<button>`/`<a>` (never a `<div>` with a click), carries proper ARIA state, works fully from the keyboard, shows a visible focus ring (`outline: 3px solid var(--marca); outline-offset: 3px`), and degrades to instant / opacity-only under `prefers-reduced-motion: reduce`.

The tone of the behavior must match the brand: **calm, predictable, forgiving.** No surprise pop-ups, no controls that vanish, no motion that can't be stopped. A click responds within ~100ms, confirms within ~350ms, settles within ~550ms with `--ease-calm` — never bouncy, never snappy.

All copy in the UI is Portuguese (pt-BR), warm and doctor-led. **No travessões (—)** in any string; use commas, colons, or `·`. Real `…` for ellipsis.

## Index

0. Shared helpers (reduced-motion flag, focus trap, throttle)
1. Scrolled nav (transparent → solid, swap logo)
2. Mobile drawer (focus trap, Esc, scroll lock)
3. **Método 4D axis switcher** (the centerpiece — tablist + hash deep-link)
4. **Treatment filter by axis** (data-eixo + aria-live count)
5. Clinic gallery lightbox (focus trap, prev/next, arrows)
6. FAQ accordion (button + region, teal +/− indicator)
7. Contact form (inline validation → wa.me deep link, mailto fallback)
8. Smooth anchor scrolling with header offset
9. Count-up + scroll-reveal init (IntersectionObserver bootstrap)
10. WhatsApp float reveal after scroll
11. The init pattern (DOMContentLoaded) + reduced-motion in JS

Verified brand constants used below: WhatsApp `5551999704848` ((51) 99970-4848), e-mail `secretaria@dermaclin.poa.br`. The four axes are locked in § 3 exactly as DESIGN.md defines them.

---

## 0. Shared helpers

Drop these once near the top of `main.js`. Everything else uses them.

```js
/* prefers-reduced-motion is the brand's accessibility contract.
   prefersReduced() is read live (not cached) so OS changes apply mid-session. */
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReduced = () => motionQuery.matches;

/* Honor a manual override too, if you ever ship a "reduzir animações" toggle:
   <html class="reduzir-movimento"> would also count. */
const calm = () =>
  prefersReduced() || document.documentElement.classList.contains('reduzir-movimento');

/* rAF-throttle for scroll/resize listeners. Coalesces bursts into one paint. */
function rafThrottle(fn) {
  let ticking = false;
  return (...args) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { fn(...args); ticking = false; });
  };
}

/* Focus trap for the drawer and the lightbox. Returns a release() cleanup fn. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapFocus(container) {
  const nodes = () => [...container.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  function onKey(e) {
    if (e.key !== 'Tab') return;
    const f = nodes();
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}

/* Body scroll lock that survives nested overlays (drawer + lightbox) via a counter. */
let scrollLocks = 0;
function lockScroll() {
  if (scrollLocks++ === 0) {
    document.body.style.paddingRight = (window.innerWidth - document.documentElement.clientWidth) + 'px';
    document.body.style.overflow = 'hidden';
  }
}
function unlockScroll() {
  if (scrollLocks > 0 && --scrollLocks === 0) {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}
```

The shared focus-ring rule belongs in CSS, applied globally so no control is ever missed:

```css
:focus-visible {
  outline: 3px solid var(--marca);
  outline-offset: 3px;
  border-radius: inherit;
}
```

`:focus-visible` (not `:focus`) so the teal ring shows for keyboard users, not on mouse click.

---

## 1. Scrolled nav

Past a threshold the nav swaps from transparent-over-hero to a solid white bar, and the white logo swaps to the colored one. State lives in a single `.is-scrolled` class on the header; CSS does the visual work.

### Markup hooks

```html
<header class="nav" data-nav>
  <a class="nav__brand" href="/">
    <img class="nav__logo nav__logo--branco"   src="logo/logo-header-branco.png"   alt="Dr. Márcio Teixeira" />
    <img class="nav__logo nav__logo--colorido"  src="logo/logo-header-colorido.png" alt="Dr. Márcio Teixeira" aria-hidden="true" />
  </a>
  <!-- nav links + CTA + burger -->
</header>
```

Both logos ship in the DOM; CSS cross-fades between them so there is no flash of a missing image. The colored one is `aria-hidden` because the white one already provides the accessible name.

### JS

```js
function initScrolledNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;
  const THRESHOLD = 40;
  const update = () => nav.classList.toggle('is-scrolled', window.scrollY > THRESHOLD);
  window.addEventListener('scroll', rafThrottle(update), { passive: true });
  update(); // set correct state on load / refresh mid-page
}
```

### CSS

```css
.nav {
  position: fixed; inset: 0 0 auto; z-index: 100;
  background: transparent;
  transition: background .4s var(--ease-soft), box-shadow .4s var(--ease-soft);
}
.nav.is-scrolled {
  background: var(--branco);
  box-shadow: 0 6px 24px rgba(5, 127, 127, 0.08);
}
.nav__logo { transition: opacity .4s var(--ease-soft); grid-area: 1 / 1; }
.nav__brand { display: grid; }                 /* stack both logos */
.nav__logo--colorido { opacity: 0; }
.nav.is-scrolled .nav__logo--branco   { opacity: 0; }
.nav.is-scrolled .nav__logo--colorido { opacity: 1; }

/* On pages without a media hero, the nav is solid from the top. */
.nav--solid { background: var(--branco); }

@media (prefers-reduced-motion: reduce) {
  .nav, .nav__logo { transition: none; }
}
```

The nav-link color also flips with `.is-scrolled` (white text on the hero, `--tinta` on the solid bar) — that is pure CSS, no JS.

---

## 2. Mobile drawer

The burger opens a full-height teal/white drawer sliding from the right. It traps focus, locks body scroll, closes on Esc / backdrop / link click, and drives everything from `aria-expanded` as the single source of truth.

### Markup hooks

```html
<button class="nav__burger" data-burger aria-expanded="false" aria-controls="nav-drawer"
        aria-label="Abrir menu">
  <span></span><span></span><span></span>
</button>

<div class="nav-backdrop" data-drawer-backdrop hidden></div>

<nav class="nav-drawer" id="nav-drawer" data-drawer aria-label="Menu principal" hidden>
  <ul class="nav-drawer__list">
    <li><a class="nav-drawer__link" href="/">Início</a></li>
    <li><a class="nav-drawer__link" href="/tratamentos.html">Tratamentos</a></li>
    <li><a class="nav-drawer__link" href="/metodo-4d.html">Método 4D</a></li>
    <li><a class="nav-drawer__link" href="/sobre.html">Sobre</a></li>
    <li><a class="nav-drawer__link" href="/contato.html">Contato</a></li>
  </ul>
  <a class="btn btn--whats" href="https://wa.me/5551999704848">AGENDE SUA CONSULTA</a>
</nav>
```

### JS

```js
function initDrawer() {
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-drawer-backdrop]');
  if (!burger || !drawer) return;
  let release = () => {};

  function open() {
    drawer.hidden = false; if (backdrop) backdrop.hidden = false;
    requestAnimationFrame(() => {                 // next frame so the transition runs
      drawer.classList.add('is-open');
      backdrop?.classList.add('is-open');
    });
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fechar menu');
    lockScroll();
    release = trapFocus(drawer);
    drawer.querySelector(FOCUSABLE)?.focus();
  }

  function close() {
    drawer.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    unlockScroll();
    release();
    burger.focus();                               // return focus to the trigger
    const hide = () => { drawer.hidden = true; if (backdrop) backdrop.hidden = true; };
    if (calm()) hide();
    else drawer.addEventListener('transitionend', hide, { once: true });
  }

  const isOpen = () => burger.getAttribute('aria-expanded') === 'true';
  burger.addEventListener('click', () => (isOpen() ? close() : open()));
  backdrop?.addEventListener('click', close);
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) close(); });
}
```

### CSS

```css
.nav-drawer {
  position: fixed; inset: 0 0 0 auto; z-index: 120;
  width: min(86vw, 360px);
  display: flex; flex-direction: column; gap: 28px;
  padding: 96px 32px 40px;
  background: var(--branco);
  border-radius: var(--r-xl) 0 0 var(--r-xl);
  box-shadow: -24px 0 60px rgba(5, 127, 127, 0.14);
  transform: translateX(100%);
  transition: transform .42s var(--ease-calm);
}
.nav-drawer.is-open { transform: translateX(0); }
.nav-drawer__link { font-size: 19px; font-weight: 500; color: var(--tinta); padding: 12px 0; display: block; }

.nav-backdrop {
  position: fixed; inset: 0; z-index: 110;
  background: rgba(4, 77, 77, 0.32);
  opacity: 0; transition: opacity .42s var(--ease-soft);
}
.nav-backdrop.is-open { opacity: 1; }

/* burger → X morph driven purely by aria-expanded */
.nav__burger span { display: block; width: 22px; height: 2px; background: currentColor; border-radius: 2px;
  transition: transform .3s var(--ease-soft), opacity .3s var(--ease-soft); }
.nav__burger[aria-expanded="true"] span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav__burger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.nav__burger[aria-expanded="true"] span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (prefers-reduced-motion: reduce) {
  .nav-drawer, .nav-backdrop, .nav__burger span { transition: none; }
}
```

---

## 3. Método 4D axis switcher (centerpiece)

The brand's proprietary IP, rendered as a segmented control. Clicking a tab cross-fades to that axis's panel (description + its treatments). Full WAI-ARIA tablist pattern: roving `tabindex`, `aria-selected`, arrow-key navigation, Home/End, and a hash deep-link (`#eixo-2`) so an axis is shareable and bookmarkable.

**The four axes are locked — names and order are exact (from DESIGN.md):**

| Eixo | id | Nome | Foca em |
|---|---|---|---|
| 1 | `eixo-1` | A Superfície da Pele | coloração, textura, poros, luminosidade, manchas, sensibilidade |
| 2 | `eixo-2` | Linhas de Expressão | rugas dinâmicas e estáticas, sulcos |
| 3 | `eixo-3` | Alterações do Volume da Face | perda/excesso de volume, contornos, definição |
| 4 | `eixo-4` | Flacidez | firmeza, sustentação, flacidez cutânea e muscular |

### Markup hooks

```html
<div class="metodo4d" data-axis-switcher>
  <div class="metodo4d__tabs" role="tablist" aria-label="Eixos do Método 4D">
    <button class="metodo4d__tab" id="tab-eixo-1" role="tab" aria-selected="true"
            aria-controls="panel-eixo-1" tabindex="0">
      <span class="metodo4d__tab-num">01</span> A Superfície da Pele
    </button>
    <button class="metodo4d__tab" id="tab-eixo-2" role="tab" aria-selected="false"
            aria-controls="panel-eixo-2" tabindex="-1">
      <span class="metodo4d__tab-num">02</span> Linhas de Expressão
    </button>
    <button class="metodo4d__tab" id="tab-eixo-3" role="tab" aria-selected="false"
            aria-controls="panel-eixo-3" tabindex="-1">
      <span class="metodo4d__tab-num">03</span> Alterações do Volume da Face
    </button>
    <button class="metodo4d__tab" id="tab-eixo-4" role="tab" aria-selected="false"
            aria-controls="panel-eixo-4" tabindex="-1">
      <span class="metodo4d__tab-num">04</span> Flacidez
    </button>
  </div>

  <div class="metodo4d__panel" id="panel-eixo-1" role="tabpanel"
       aria-labelledby="tab-eixo-1" tabindex="0">
    <p class="metodo4d__desc">Avalia coloração, textura, poros, luminosidade, manchas e sensibilidade da pele.</p>
    <ul class="metodo4d__treats">
      <li>Skincare Personalizado</li><li>Laserterapia / LIP</li><li>Skinbooster</li><li>MMP</li>
    </ul>
  </div>
  <div class="metodo4d__panel" id="panel-eixo-2" role="tabpanel"
       aria-labelledby="tab-eixo-2" tabindex="0" hidden>…</div>
  <div class="metodo4d__panel" id="panel-eixo-3" role="tabpanel"
       aria-labelledby="tab-eixo-3" tabindex="0" hidden>…</div>
  <div class="metodo4d__panel" id="panel-eixo-4" role="tabpanel"
       aria-labelledby="tab-eixo-4" tabindex="0" hidden>…</div>
</div>
```

### JS

```js
function initAxisSwitcher() {
  const root = document.querySelector('[data-axis-switcher]');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panelFor = (tab) => document.getElementById(tab.getAttribute('aria-controls'));

  function select(tab, { focus = true, push = true } = {}) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;                  // roving tabindex
      const panel = panelFor(t);
      if (on) {
        panel.hidden = false;
        requestAnimationFrame(() => panel.classList.add('is-in')); // cross-fade in
      } else {
        panel.classList.remove('is-in');
        panel.hidden = true;
      }
    });
    if (focus) tab.focus();
    if (push) {
      const id = tab.getAttribute('aria-controls').replace('panel-', '');  // eixo-2
      history.replaceState(null, '', '#' + id);
    }
  }

  // Arrow / Home / End keyboard navigation (WAI-ARIA tabs pattern)
  root.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    if (next) { e.preventDefault(); select(next); }
  });

  tabs.forEach((tab) => tab.addEventListener('click', () => select(tab)));

  // Deep-link: open #eixo-N on load, and react to hash changes
  function fromHash(focus) {
    const id = location.hash.slice(1);                 // eixo-2
    const tab = tabs.find((t) => t.getAttribute('aria-controls') === 'panel-' + id);
    if (tab) select(tab, { focus, push: false });
  }
  if (/^#eixo-[1-4]$/.test(location.hash)) fromHash(false);
  window.addEventListener('hashchange', () => fromHash(true));
}
```

### CSS (cross-fade, reduced-motion aware)

```css
.metodo4d__panel { opacity: 0; transform: translateY(10px);
  transition: opacity .42s var(--ease-glide), transform .42s var(--ease-glide); }
.metodo4d__panel.is-in { opacity: 1; transform: none; }

.metodo4d__tab[aria-selected="true"] { color: var(--marca-deep); }
.metodo4d__tab[aria-selected="true"] .metodo4d__tab-num { color: var(--marca); }

@media (prefers-reduced-motion: reduce) {
  .metodo4d__panel { transition: none; transform: none; }
}
```

`hidden` is the *functional* swap (keeps inactive panels out of the a11y tree and tab order); `.is-in` is the *visual* swap. Never conflate them. Tabs are real `<button>`s, so Enter/Space already activate them.

---

## 4. Treatment filter by axis

On the Tratamentos page, a segmented filter (Todos · Eixo 1 – 4) shows/hides cards by `data-eixo`, animates them in/out gracefully, and announces the visible count through an `aria-live` region. It mirrors the axis-switcher concept so the two stay conceptually in sync (same eixo ids, same order, same labels).

### Markup hooks

```html
<div class="treat-filter" role="tablist" aria-label="Filtrar tratamentos por eixo">
  <button class="chip chip--on" role="tab" aria-selected="true"  data-eixo="todos">Todos</button>
  <button class="chip" role="tab" aria-selected="false" data-eixo="1">Eixo 1 · Superfície</button>
  <button class="chip" role="tab" aria-selected="false" data-eixo="2">Eixo 2 · Linhas de Expressão</button>
  <button class="chip" role="tab" aria-selected="false" data-eixo="3">Eixo 3 · Volume</button>
  <button class="chip" role="tab" aria-selected="false" data-eixo="4">Eixo 4 · Flacidez</button>
</div>

<p class="treat-filter__count" data-treat-count role="status" aria-live="polite"></p>

<div class="treat-grid" data-treat-grid>
  <article class="treat-card" data-eixo="1">…</article>
  <article class="treat-card" data-eixo="2">…</article>
  <!-- … -->
</div>
```

### JS

```js
function initTreatmentFilter() {
  const chips = [...document.querySelectorAll('.treat-filter [data-eixo]')];
  const cards = [...document.querySelectorAll('.treat-card[data-eixo]')];
  const count = document.querySelector('[data-treat-count]');
  if (!chips.length || !cards.length) return;

  function apply(value) {
    let shown = 0;
    cards.forEach((card) => {
      const match = value === 'todos' || card.dataset.eixo === value;
      if (match) {
        shown++;
        card.hidden = false;
        if (!calm()) { card.classList.remove('is-out'); requestAnimationFrame(() => card.classList.add('is-in')); }
      } else {
        card.classList.remove('is-in');
        if (calm()) { card.hidden = true; }
        else {
          card.classList.add('is-out');                          // fade/scale out, then unmount
          card.addEventListener('transitionend', function done() {
            if (card.classList.contains('is-out')) card.hidden = true;
            card.removeEventListener('transitionend', done);
          }, { once: true });
        }
      }
    });
    if (count) {
      const label = value === 'todos' ? 'todos os eixos' : 'o Eixo ' + value;
      count.textContent = shown === 1
        ? '1 tratamento em ' + label + '.'
        : shown + ' tratamentos em ' + label + '.';
    }
  }

  function activate(chip) {
    chips.forEach((c) => {
      const on = c === chip;
      c.classList.toggle('chip--on', on);
      c.setAttribute('aria-selected', String(on));
      c.tabIndex = on ? 0 : -1;
    });
    apply(chip.dataset.eixo);
  }

  chips.forEach((chip) => chip.addEventListener('click', () => activate(chip)));

  // arrow-key navigation across the filter chips
  document.querySelector('.treat-filter').addEventListener('keydown', (e) => {
    const i = chips.indexOf(document.activeElement);
    if (i < 0) return;
    let next = null;
    if (e.key === 'ArrowRight') next = chips[(i + 1) % chips.length];
    else if (e.key === 'ArrowLeft') next = chips[(i - 1 + chips.length) % chips.length];
    else if (e.key === 'Home') next = chips[0];
    else if (e.key === 'End') next = chips[chips.length - 1];
    if (next) { e.preventDefault(); next.focus(); activate(next); }
  });

  activate(chips[0]); // default: Todos, sets initial count
}
```

### CSS

```css
.treat-card { transition: opacity .4s var(--ease-calm), transform .4s var(--ease-calm); }
.treat-card.is-out { opacity: 0; transform: translateY(8px) scale(.98); }
.treat-card.is-in  { opacity: 1; transform: none; }
.treat-filter__count { font-size: 14px; color: var(--tinta-muted); margin: 18px 0 0; }

@media (prefers-reduced-motion: reduce) {
  .treat-card { transition: none; }
}
```

---

## 5. Clinic gallery lightbox

Opens the `ambiente/dermaclin*.jpg` photos of the Dermaclin space in an accessible modal: `aria-modal`, focus trap, Esc to close, prev/next buttons, arrow keys, and a returned-focus contract. Reduced-motion friendly (instant under `calm()`).

### Markup hooks

```html
<ul class="gallery" data-gallery>
  <li><button class="gallery__thumb" data-lightbox="0">
    <img src="ambiente/dermaclin1.jpg" alt="Recepção da Dermaclin" loading="lazy" /></button></li>
  <li><button class="gallery__thumb" data-lightbox="1">
    <img src="ambiente/dermaclin2.jpg" alt="Sala de atendimento" loading="lazy" /></button></li>
  <!-- … dermaclin3.jpg … dermaclin15.jpg … -->
</ul>

<div class="lightbox" data-lightbox-modal role="dialog" aria-modal="true"
     aria-label="Galeria do espaço Dermaclin" hidden>
  <button class="lightbox__close" data-lb-close aria-label="Fechar galeria">&times;</button>
  <button class="lightbox__nav lightbox__nav--prev" data-lb-prev aria-label="Foto anterior">&#8249;</button>
  <figure class="lightbox__stage">
    <img class="lightbox__img" data-lb-img alt="" />
    <figcaption class="lightbox__cap" data-lb-cap></figcaption>
  </figure>
  <button class="lightbox__nav lightbox__nav--next" data-lb-next aria-label="Próxima foto">&#8250;</button>
</div>
```

### JS

```js
function initLightbox() {
  const modal = document.querySelector('[data-lightbox-modal]');
  const thumbs = [...document.querySelectorAll('[data-lightbox]')];
  if (!modal || !thumbs.length) return;

  const imgEl = modal.querySelector('[data-lb-img]');
  const capEl = modal.querySelector('[data-lb-cap]');
  const items = thumbs.map((btn) => {
    const img = btn.querySelector('img');
    return { src: img.src, alt: img.alt };
  });
  let index = 0, release = () => {}, lastFocused = null;

  function render() {
    const it = items[index];
    imgEl.src = it.src;
    imgEl.alt = it.alt;
    capEl.textContent = it.alt + ' · ' + (index + 1) + ' de ' + items.length;
  }
  const go = (delta) => { index = (index + delta + items.length) % items.length; render(); };

  function open(i) {
    index = i;
    lastFocused = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    lockScroll();
    render();
    release = trapFocus(modal);
    modal.querySelector('[data-lb-close]').focus();
  }
  function close() {
    modal.classList.remove('is-open');
    unlockScroll();
    release();
    const hide = () => { modal.hidden = true; lastFocused?.focus(); };
    if (calm()) hide();
    else modal.addEventListener('transitionend', hide, { once: true });
  }

  thumbs.forEach((btn, i) => btn.addEventListener('click', () => open(i)));
  modal.querySelector('[data-lb-close]').addEventListener('click', close);
  modal.querySelector('[data-lb-prev]').addEventListener('click', () => go(-1));
  modal.querySelector('[data-lb-next]').addEventListener('click', () => go(1));
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); }); // backdrop

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  });
}
```

### CSS

```css
.lightbox {
  position: fixed; inset: 0; z-index: 200;
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px;
  padding: clamp(16px, 4vw, 48px);
  background: rgba(4, 77, 77, 0.86);
  opacity: 0; transition: opacity .4s var(--ease-soft);
}
.lightbox.is-open { opacity: 1; }
.lightbox__img { max-width: 100%; max-height: 86vh; border-radius: var(--r-lg); display: block; margin: 0 auto; }
.lightbox__cap { color: var(--branco); text-align: center; font-size: 14px; margin-top: 12px; }
.lightbox__nav, .lightbox__close { background: rgba(255,255,255,.14); color: var(--branco);
  border: 0; border-radius: var(--r-pill); width: 48px; height: 48px; cursor: pointer; font-size: 24px; }
.lightbox__close { position: absolute; top: 20px; right: 20px; }

@media (prefers-reduced-motion: reduce) { .lightbox { transition: none; } }
```

---

## 6. FAQ accordion

The button + region pattern (more controllable than `<details>` for the teal +/− indicator and smooth height). Each header is a `<button>` with `aria-expanded` + `aria-controls`; each answer is a region labelled by its button. Multi-open by default; flip `SINGLE_OPEN` to true for single-open.

### Markup hooks

```html
<div class="faq" data-faq>
  <div class="faq__item">
    <h3 class="faq__head">
      <button class="faq__trigger" aria-expanded="false" aria-controls="faq-a1" id="faq-q1">
        O Método 4D substitui a consulta dermatológica?
        <span class="faq__icon" aria-hidden="true"></span>
      </button>
    </h3>
    <div class="faq__panel" id="faq-a1" role="region" aria-labelledby="faq-q1" hidden>
      <div class="faq__inner">
        <p>Não. O Método 4D é a forma como o Dr. Márcio organiza a avaliação durante a sua consulta…</p>
      </div>
    </div>
  </div>
  <!-- more .faq__item … -->
</div>
```

### JS

```js
function initFaq() {
  const faq = document.querySelector('[data-faq]');
  if (!faq) return;
  const SINGLE_OPEN = false;
  const triggers = [...faq.querySelectorAll('.faq__trigger')];

  function setOpen(trigger, open) {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    trigger.setAttribute('aria-expanded', String(open));
    if (open) {
      panel.hidden = false;
      if (calm()) return;
      panel.style.height = '0px';
      requestAnimationFrame(() => { panel.style.height = panel.scrollHeight + 'px'; });
      panel.addEventListener('transitionend', function done() {
        panel.style.height = 'auto'; panel.removeEventListener('transitionend', done);
      }, { once: true });
    } else {
      if (calm()) { panel.hidden = true; return; }
      panel.style.height = panel.scrollHeight + 'px';
      requestAnimationFrame(() => { panel.style.height = '0px'; });
      panel.addEventListener('transitionend', function done() {
        panel.hidden = true; panel.style.height = ''; panel.removeEventListener('transitionend', done);
      }, { once: true });
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      if (SINGLE_OPEN && !open) {
        triggers.forEach((t) => { if (t !== trigger && t.getAttribute('aria-expanded') === 'true') setOpen(t, false); });
      }
      setOpen(trigger, !open);
    });
  });
}
```

### CSS (teal +/− indicator)

```css
.faq__panel { overflow: hidden; transition: height .4s var(--ease-glide); }
.faq__inner { padding: 4px 0 24px; color: var(--tinta-muted); }

.faq__icon { position: relative; width: 18px; height: 18px; flex: 0 0 auto; }
.faq__icon::before, .faq__icon::after { content: ""; position: absolute; inset: 50% 0 auto;
  height: 2px; background: var(--marca); border-radius: 2px; transition: transform .3s var(--ease-soft); }
.faq__icon::after { transform: translateY(-50%) rotate(90deg); }     /* vertical bar = "+" */
.faq__trigger[aria-expanded="true"] .faq__icon::after { transform: translateY(-50%) rotate(0); } /* "−" */

@media (prefers-reduced-motion: reduce) {
  .faq__panel { transition: none; }
  .faq__icon::before, .faq__icon::after { transition: none; }
}
```

Native button keyboard support (Enter/Space) is inherited. The `+` collapses to `−` via the rotating pseudo-element. The teal indicator is paired with the open/closed state semantically (`aria-expanded`), never color alone.

---

## 7. Contact form

Labeled fields (nome, telefone/WhatsApp, e-mail, mensagem) with inline validation in clear pt-BR. There is no backend, so a valid submit composes a prefilled WhatsApp message and opens `wa.me/5551999704848`; if `wa.me` cannot open, it falls back to a `mailto:` to `secretaria@dermaclin.poa.br`.

### Markup hooks

```html
<form class="form" data-contact-form novalidate>
  <div class="form__row">
    <label class="form__label" for="cf-nome">Nome <span aria-hidden="true">*</span></label>
    <input class="form__input" id="cf-nome" name="nome" type="text" autocomplete="name"
           required aria-required="true" aria-describedby="cf-nome-err" />
    <p class="form__err" id="cf-nome-err" hidden></p>
  </div>
  <div class="form__row">
    <label class="form__label" for="cf-tel">Telefone / WhatsApp <span aria-hidden="true">*</span></label>
    <input class="form__input" id="cf-tel" name="telefone" type="tel" inputmode="tel"
           autocomplete="tel" required aria-required="true" aria-describedby="cf-tel-err"
           placeholder="(51) 99999-9999" />
    <p class="form__err" id="cf-tel-err" hidden></p>
  </div>
  <div class="form__row">
    <label class="form__label" for="cf-email">E-mail</label>
    <input class="form__input" id="cf-email" name="email" type="email" autocomplete="email"
           aria-describedby="cf-email-err" />
    <p class="form__err" id="cf-email-err" hidden></p>
  </div>
  <div class="form__row">
    <label class="form__label" for="cf-msg">Mensagem <span aria-hidden="true">*</span></label>
    <textarea class="form__input" id="cf-msg" name="mensagem" rows="4"
              required aria-required="true" aria-describedby="cf-msg-err"></textarea>
    <p class="form__err" id="cf-msg-err" hidden></p>
  </div>
  <button class="btn btn--primary" type="submit">AGENDE SUA CONSULTA</button>
  <p class="form__status" data-form-status role="status" aria-live="polite"></p>
</form>
```

### JS — validation + the wa.me builder

```js
function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const WHATS = '5551999704848';
  const EMAIL = 'secretaria@dermaclin.poa.br';
  const status = form.querySelector('[data-form-status]');

  const rules = {
    nome: (v) => v.trim().length >= 2 || 'Por favor, informe seu nome.',
    telefone: (v) => (v.replace(/\D/g, '').length >= 10) || 'Confira o telefone, parece faltar um número.',
    email: (v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Esse e-mail não parece válido.',
    mensagem: (v) => v.trim().length >= 5 || 'Conte rapidamente como podemos ajudar.',
  };

  function fieldError(field) {
    const test = rules[field.name];
    if (!test) return '';
    const res = test(field.value);
    return res === true ? '' : res;
  }
  function showError(field, msg) {
    const err = document.getElementById(field.getAttribute('aria-describedby'));
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) { err.textContent = msg; err.hidden = !msg; }
  }

  // validate on blur (forgiving, not on every keystroke)
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => showError(field, fieldError(field)));
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') showError(field, fieldError(field)); });
  });

  // Build the prefilled WhatsApp message text
  function buildMessage(data) {
    const linhas = [
      'Olá! Gostaria de agendar uma consulta.',
      'Nome: ' + data.nome,
      'Telefone: ' + data.telefone,
      data.email ? 'E-mail: ' + data.email : null,
      'Mensagem: ' + data.mensagem,
    ].filter(Boolean);
    return linhas.join('\n');
  }
  // The exact wa.me URL builder
  function whatsappURL(data) {
    return 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(buildMessage(data));
  }
  function mailtoURL(data) {
    const subject = encodeURIComponent('Agendamento de consulta · ' + data.nome);
    const body = encodeURIComponent(buildMessage(data));
    return 'mailto:' + EMAIL + '?subject=' + subject + '&body=' + body;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input, textarea')];
    let firstInvalid = null;
    fields.forEach((field) => {
      const msg = fieldError(field);
      showError(field, msg);
      if (msg && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) { firstInvalid.focus(); status.textContent = 'Confira os campos destacados, por favor.'; return; }

    const data = Object.fromEntries(new FormData(form).entries());
    const url = whatsappURL(data);
    status.textContent = 'Abrindo o WhatsApp, conclua o envio por lá. Se não abrir, enviaremos por e-mail.';
    const win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = mailtoURL(data);    // popup blocked → graceful mailto fallback
  });
}
```

### CSS (error state)

```css
.form__input { width: 100%; min-height: 48px; padding: 14px 16px;
  border: 1.5px solid var(--linha); border-radius: var(--r-sm);
  background: var(--neve); color: var(--tinta); font: inherit; }
.form__input[aria-invalid="true"] { border-color: #b4453c; background: #fdf3f2; } /* warm error, not neon red */
.form__err { color: #b4453c; font-size: 13px; margin: 6px 0 0; }
.form__status { color: var(--marca-ink); font-size: 14px; margin-top: 14px; }
```

Errors never rely on color alone — there is always a text message tied via `aria-describedby` and `aria-invalid`. The error red is a muted, warm tone, never an alarming neon.

---

## 8. Smooth anchor scrolling with header offset

In-page anchors scroll smoothly with the fixed nav's height subtracted, and jump instantly under reduced-motion. The cleanest part is CSS; JS only handles the offset + hash update.

```css
html { scroll-behavior: smooth; }
:target, section[id] { scroll-margin-top: 96px; }   /* clears the fixed nav */
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
```

```js
function initAnchorScroll() {
  const NAV_OFFSET = 96;
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;                            // let real off-page links pass
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: calm() ? 'auto' : 'smooth' });
      history.pushState(null, '', href);
      target.setAttribute('tabindex', '-1');          // move focus for screen readers
      target.focus({ preventScroll: true });
    });
  });
}
```

Note: the axis switcher (§3) owns `#eixo-N` hashes, so guard those if they collide with this handler (e.g. skip anchors handled by `[data-axis-switcher]`).

---

## 9. Count-up + scroll-reveal init

The reveal and count-up *visuals* live in ANIMATIONS.md; this is the wiring that drives them. One shared `IntersectionObserver` adds `.is-in` to `.reveal` elements and ticks each `[data-count]` once. Under `calm()`, reveals are shown immediately and numbers print their final value with no animation.

```js
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-count]');

  if (calm() || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
    counters.forEach((el) => { el.textContent = el.dataset.count; });
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-in');
      if (el.dataset.stagger) {                       // optional grid stagger
        [...el.children].forEach((child, i) => child.style.setProperty('--rev-i', i));
      }
      if (el.dataset.count !== undefined) countUp(el);
      obs.unobserve(el);                              // once only, never loops
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach((el) => io.observe(el));
  counters.forEach((el) => { if (!el.classList.contains('reveal')) io.observe(el); });
}

function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const dur = 1400, start = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3);          // ease-out cubic, calm
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * ease(p)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
```

Markup: `<span class="stat__num" data-count="30" data-suffix="">30</span>`. The literal `30` inside is the no-JS / reduced-motion fallback.

---

## 10. WhatsApp float reveal after scroll

The floating WhatsApp button stays hidden over the hero and reveals once the user scrolls past it, so it never competes with the first impression.

### Markup hooks

```html
<a class="whats-float" data-whats-float href="https://wa.me/5551999704848"
   aria-label="Falar no WhatsApp com a Dermaclin" hidden>
  <svg viewBox="0 0 24 24" aria-hidden="true" width="26" height="26"><!-- whatsapp glyph --></svg>
</a>
```

### JS

```js
function initWhatsFloat() {
  const float = document.querySelector('[data-whats-float]');
  if (!float) return;
  const SHOW_AFTER = 600;                              // px scrolled before it appears
  const update = () => {
    const show = window.scrollY > SHOW_AFTER;
    if (show) float.hidden = false;
    requestAnimationFrame(() => float.classList.toggle('is-in', show));
  };
  window.addEventListener('scroll', rafThrottle(update), { passive: true });
  update();
}
```

### CSS

```css
.whats-float {
  position: fixed; right: 20px; bottom: 20px; z-index: 90;
  width: 56px; height: 56px; display: grid; place-items: center;
  background: var(--marca); color: var(--branco); border-radius: var(--r-pill);
  box-shadow: 0 12px 30px rgba(5, 127, 127, 0.28);
  opacity: 0; transform: translateY(12px) scale(.9);
  transition: opacity .4s var(--ease-calm), transform .4s var(--ease-calm);
}
.whats-float.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .whats-float { transition: none; } }
```

---

## 11. The init pattern + reduced-motion in JS

One `DOMContentLoaded` entry point wires everything. Each `init*` guards on its own elements (returns early if absent), so the same `main.js` runs safely on every page (Início, Tratamentos, Método 4D, Tricologia, Sobre, Contato) without errors.

```js
function init() {
  initScrolledNav();      // 1
  initDrawer();           // 2
  initAxisSwitcher();     // 3
  initTreatmentFilter();  // 4
  initLightbox();         // 5
  initFaq();              // 6
  initContactForm();      // 7
  initAnchorScroll();     // 8
  initReveal();           // 9
  initWhatsFloat();       // 10

  const yr = document.querySelector('[data-year]');     // dynamic footer year
  if (yr) yr.textContent = new Date().getFullYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

### Honoring prefers-reduced-motion via matchMedia

`calm()` (§0) is the single gate. Read it **live** at the moment of each interaction rather than caching a boolean, so a patient who toggles the OS setting mid-visit gets the calmer experience immediately. To re-apply static state when the preference flips, listen on the media query:

```js
motionQuery.addEventListener('change', () => {
  if (motionQuery.matches) {
    // reveal everything that was waiting to animate, print final counter values
    document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => el.classList.add('is-in'));
    document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
  }
});
```

The contract, restated because it is brand-defining for a health site: **every interactive control is a real focusable element, carries correct ARIA state, is fully keyboard operable, shows the 3px teal focus ring, and never depends on motion to be usable.** When a behavior cannot meet all five, it does not ship.
