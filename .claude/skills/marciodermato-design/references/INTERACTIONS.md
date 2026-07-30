# INTERACTIONS.md — Behavior & wiring

Animation is *how things move* (see ANIMATIONS.md). Interaction is *how the patient makes things move*. This is the behavior layer for **Dr. Márcio Teixeira** — every interactive control on a premium dermatology site. For a health brand, **accessibility is brand-defining**: every control is a real `<button>`/`<a>` (never a `<div>` with a click), carries proper ARIA state, works fully from the keyboard, shows a visible focus ring (`outline: 3px solid var(--marca); outline-offset: 3px`), and degrades to instant / opacity-only under `prefers-reduced-motion: reduce`.

The tone of the behavior must match the brand: **calm, predictable, forgiving.** No surprise pop-ups, no controls that vanish, no motion that can't be stopped. A click responds within ~100ms, confirms within ~350ms, settles within ~550ms with the calm easings (`--ease-glide`, `--ease-soft`, `--ease-calm`) — never bouncy, never snappy.

All copy in the UI is Portuguese (pt-BR), warm and doctor-led. **No travessões (—)** in any string; use commas, colons, or `·`. Real `…` for ellipsis.

> **This file describes what actually ships.** All behavior lives in `assets/js/main.js` (one IIFE, no build step, no framework). Function names, `[data-*]` hooks, and the classes the JS toggles below are the real ones in the file. CSS state classes referenced here live in `assets/css/main.css`. When you wire new behavior, follow the patterns here; when you change behavior, update this file.

## Index

The shipped, wired behaviors (in `main.js` order):

0. Shared truths (live reduced-motion flag, rAF-throttle, boot/font guards)
1. **Gentle reveal** — one-shot IntersectionObserver, `.reveal` → `.is-in`
2. **Curve draw** — signature gesture, `.curve-draw` → `.is-in`
3. **Scrolled nav** — `.is-solid` toggle + logo swap (`[data-nav]`)
4. **Nav sliding indicator** — the pill that glides between links
5. **Mobile drawer** — `[data-drawer]` open/close, Esc, scroll lock
6. **Hero video play/pause** — `[data-hero-pause]`, motion-safe autoplay
7. **Soft hero parallax** — `.hero__media.parallax`
8. **Comparison drag comparator** — `[data-ba]` + `.ba__range` → `--pos`
9. **Casos carousel** — `[data-casos-track]` + tap-to-reveal image B
10. **Avaliações carousel** — `[data-reviews-track]`
11. **Smooth anchor scrolling** — in-page `#` links
12. **Fio de cabelo motif** — `fioMotif()`, per-section SVG generation
13. The IIFE pattern + reduced-motion in JS

Verified brand constants: WhatsApp `5551999704848` ((51) 99970-4848). The nav links are real page routes (`index.html`, `tratamentos.html`, `metodo-4d.html`, `tricologia.html`, `sobre.html`, `contato.html`), not in-page tabs.

---

## 0. Shared truths

`main.js` is a single IIFE (`(function () { "use strict"; … })();`) so nothing leaks to the global scope. A few helpers are read by everything below.

```js
/* prefers-reduced-motion is the brand's accessibility contract.
   reduceMotion() is read live (not cached) so an OS change applies mid-session. */
const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

Every scroll/resize listener in the file uses the same hand-rolled rAF throttle inline (`let ticking = false; … requestAnimationFrame(() => { …; ticking = false; })`) so bursts coalesce into one paint, and every listener is registered `{ passive: true }`.

Two boot guards run first so the page never paints a half-styled or reflowing first frame:

```js
/* boot: drop .is-loading after two rAFs so entrance transitions can run */
function boot() {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => document.body.classList.remove("is-loading"))
  );
}

/* font guard: keep .fonts-pending until webfonts settle (or 1.5s safety
   timeout) so font-sensitive layout never paints in the fallback face and
   then reflows. */
document.fonts?.ready.then(drop);
setTimeout(drop, 1500);
```

`<body class="is-loading fonts-pending">` is the no-JS / pre-paint state; both classes are dropped once JS runs. The shared focus-ring rule belongs in CSS, applied globally so no control is ever missed:

```css
:focus-visible {
  outline: 3px solid var(--marca);
  outline-offset: 3px;
  border-radius: inherit;
}
```

`:focus-visible` (not `:focus`) so the teal ring shows for keyboard users, not on mouse click.

---

## 1. Gentle reveal

The brand's default entrance. A **one-shot** IntersectionObserver adds `.is-in` to each `.reveal` element the first time it crosses into view, then unobserves it so it never loops or re-fires on scroll-back.

### How it's wired

```js
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting && e.intersectionRatio > 0.12) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);          // once only
      }
    }
  },
  { threshold: [0, 0.12], rootMargin: "0px 0px -8% 0px" }
);
revealEls.forEach((el) => io.observe(el));
```

The element must be **>12% visible** to reveal (`intersectionRatio > 0.12` against the `[0, 0.12]` threshold list), and the `-8%` bottom rootMargin holds the trigger until the element is comfortably on-screen. Per-item stagger inside a grid is handled in CSS via `--i` on each card (e.g. the diferenciais and axes grids set `style="--i:0…4"`); the JS only flips `.is-in` on the wrapper.

### Accessibility / reduced-motion

No `IntersectionObserver` support → every `.reveal` gets `.is-in` immediately (`revealEls.forEach(el => el.classList.add("is-in"))`), so content is never trapped hidden. The reveal *visual* (opacity + small lift, see `.reveal.is-in`/`.reveal--lift.is-in` in CSS and ANIMATIONS.md) collapses to opacity-only / instant under reduced-motion via the CSS media query — the JS does not branch on motion here, the stylesheet does.

---

## 2. Curve draw

The signature gesture: the hair-strand curve that strokes itself on as it enters view. Separate, simpler observer from the reveal one.

```js
const cio = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");   // CSS animates stroke-dashoffset → 0
        cio.unobserve(e.target);
      }
    }
  },
  { threshold: 0.4 }
);
document.querySelectorAll(".curve-draw").forEach((el) => cio.observe(el));
```

Fires at **40% visible** (`threshold: 0.4`), one-shot. The draw itself is `.curve-draw.is-in path { stroke-dashoffset: 0 }` in CSS — see ANIMATIONS.md for the stroke-dash anatomy. Reduced-motion is handled in the stylesheet.

---

## 3. Scrolled nav

The nav starts as a translucent glass capsule over the hero and, past a small scroll threshold, condenses into a frosted-white floating capsule with the colored logo. State is a single `.is-solid` class on the header; CSS does all the visual work (capsule shrink, shadow, link-color flip, logo swap).

### Markup hooks

```html
<header class="nav" data-nav>
  <a class="nav__brand" href="index.html" aria-label="Dr. Márcio Teixeira, página inicial">
    <img class="nav__logo nav__logo--light" src="logo/logo-header-branco.png"   alt="Dr. Márcio Teixeira" />
    <img class="nav__logo nav__logo--solid" src="logo/logo-header-colorido.png" alt="Dr. Márcio Teixeira" />
  </a>
  <nav class="nav__links" aria-label="Navegação principal">
    <span class="nav__indicator" aria-hidden="true"></span>
    <a class="nav__link" href="index.html" aria-current="page">Início</a>
    <!-- … more nav__link routes … -->
  </nav>
  <a class="btn btn--primary nav__cta" href="https://wa.me/5551999704848?text=…">Agende sua consulta</a>
  <button class="nav__burger" data-drawer-open aria-label="Abrir menu" aria-expanded="false" aria-controls="drawer">…</button>
</header>
```

Both logos ship in the DOM; CSS swaps which is `display: block` per state, so there is no flash of a missing image.

### How it's wired

```js
const nav = document.querySelector("[data-nav]");
if (nav && !nav.classList.contains("nav--solid")) {   // inner pages can be solid from the top
  const onNavScroll = () =>
    requestAnimationFrame(() => nav.classList.toggle("is-solid", window.scrollY > 60));
  window.addEventListener("scroll", onNavScroll, { passive: true });
  onNavScroll();   // correct state on load / refresh mid-page
}
```

Threshold is **`scrollY > 60`**. If the header already carries `.nav--solid` (an inner page with no media hero, which is solid from the top), the scroll listener is **never attached** — the static class wins and there is nothing to toggle.

### CSS hooks the JS relies on

`.nav.is-solid` and `.nav--solid` share the same rule block: they shrink `.nav__inner` (`max-width: 1090px`), add the frosted white background + shadow, set `.nav__logo--light { display: none }` / `.nav__logo--solid { display: block }`, repaint `.nav__link` to `--marca-ink` (and `--marca-deep` on hover/`[aria-current]`), and recolor the burger. The link-color flip is pure CSS, no JS.

---

## 4. Nav sliding indicator

A single pill (`.nav__indicator`) glides between nav links on hover/focus and rests under the current page. Position is driven by three JS-set CSS vars; the glide is a CSS transition.

### How it's wired (`navIndicator()`)

```js
const ind = links.querySelector(".nav__indicator");
const items = [...links.querySelectorAll(".nav__link")];
const active = () => links.querySelector('.nav__link[aria-current="page"]') || items[0];

const moveTo = (el) => {
  if (!el) { ind.style.setProperty("--ind-o", "0"); return; }
  ind.style.setProperty("--ind-x", el.offsetLeft + "px");   // slide
  ind.style.setProperty("--ind-w", el.offsetWidth + "px");  // width to match link
  ind.style.setProperty("--ind-o", "1");                    // show
};
const rest = () => moveTo(active());

items.forEach((a) => {
  a.addEventListener("mouseenter", () => moveTo(a));
  a.addEventListener("focus",      () => moveTo(a));   // keyboard tracks too
});
links.addEventListener("mouseleave", rest);
links.addEventListener("focusout",  rest);
rest();
```

- The pill measures the target link's `offsetLeft`/`offsetWidth` and writes `--ind-x` (transform translate), `--ind-w` (width), `--ind-o` (opacity) on the indicator. CSS (`.nav__indicator { transform: translateX(var(--ind-x)); width: var(--ind-w); opacity: var(--ind-o); transition: transform/width/opacity }`) does the actual glide.
- **Resting position** is the `[aria-current="page"]` link, falling back to the first link.
- Both `mouseenter` *and* `focus` move it, so it tracks keyboard tabbing as well as the mouse; `mouseleave`/`focusout` return it to rest.
- It is **re-measured** after fonts settle (`document.fonts.ready.then(rest)`), on `window.load`, and on a 150ms-debounced `resize`, because link widths change with the font and the breakpoint.

### Accessibility

The indicator is `aria-hidden="true"` decoration; the accessible "current page" signal is `aria-current="page"` on the link itself, never the pill. The pill has `pointer-events: none` so it never intercepts clicks.

---

## 5. Mobile drawer

The burger opens a panel; a scrim dims the page. It closes on the close button, the scrim, any link tap, or Esc, and locks body scroll while open. `aria-expanded` (on the burger) and `aria-hidden` (on the drawer) are kept in sync as the source of truth.

### Markup hooks

```html
<button class="nav__burger" data-drawer-open aria-label="Abrir menu" aria-expanded="false" aria-controls="drawer">
  <span></span><span></span><span></span>
</button>

<div class="nav-scrim" data-drawer-scrim></div>
<aside class="drawer" id="drawer" data-drawer aria-hidden="true">
  <button class="drawer__close" data-drawer-close aria-label="Fechar menu">&times;</button>
  <a class="drawer__link" href="index.html" aria-current="page">Início</a>
  <!-- … drawer__link routes … -->
  <a class="btn btn--primary drawer__cta" href="https://wa.me/5551999704848?text=…">Agende sua consulta</a>
</aside>
```

### How it's wired

```js
const drawer  = document.querySelector("[data-drawer]");
const scrim   = document.querySelector("[data-drawer-scrim]");
const openBtn = document.querySelector("[data-drawer-open]");
const closeBtn = document.querySelector("[data-drawer-close]");

const setDrawer = (open) => {
  drawer.classList.toggle("is-open", open);          // CSS slides the panel in
  scrim.classList.toggle("is-open", open);           // CSS fades the scrim
  drawer.setAttribute("aria-hidden", String(!open));
  openBtn.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";   // scroll lock
};

openBtn.addEventListener("click", () => setDrawer(true));
closeBtn?.addEventListener("click", () => setDrawer(false));
scrim.addEventListener("click", () => setDrawer(false));
drawer.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => setDrawer(false))   // tapping any link closes it
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setDrawer(false);
});
```

- Single `setDrawer(open)` drives the whole state: `.is-open` on both drawer and scrim, `aria-hidden`/`aria-expanded`, and `body.style.overflow`.
- Close affordances: the close button, the scrim, **any anchor inside the drawer** (so navigating closes it), and **Esc** (global `keydown`).
- The whole block guards on `drawer && scrim && openBtn`, so pages without a drawer no-op.

### Accessibility

`aria-hidden` toggles the drawer in/out of the a11y tree; `aria-expanded` on the burger reflects open state; the burger declares `aria-controls="drawer"`. Esc closes from anywhere. (Note: this implementation does **not** trap Tab focus inside the drawer or restore focus to the burger on close — it relies on `aria-hidden` + scroll-lock + Esc. If you harden it, that is the gap to fill.)

---

## 6. Hero video play/pause

The hero `<video>` autoplays muted (motion-safe), and a single button (`[data-hero-pause]`) toggles play/pause and swaps its glyph + accessible label.

### Markup hooks

```html
<video class="hero__video" id="hero-video" muted loop playsinline autoplay preload="auto" disablepictureinpicture>
  <source src="video-hero/video-hero.mp4" type="video/mp4" />
</video>

<button class="hero__pause" data-hero-pause type="button" aria-label="Pausar vídeo">
  <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">…</svg>
  <svg class="icon-play"  viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">…</svg>
</button>
```

Both icons ship in the button; CSS shows the pause glyph by default and swaps to play under `.is-paused` (`.hero__pause.is-paused .icon-pause { display: none } / .icon-play { display: block }`).

### How it's wired

```js
const video = document.getElementById("hero-video");
const pauseBtn = document.querySelector("[data-hero-pause]");

video.muted = true; video.setAttribute("muted", "");   // iOS honors inline autoplay only when muted is set as a property too

const setPaused = (paused) => {
  pauseBtn.classList.toggle("is-paused", paused);       // swaps the icon
  pauseBtn.setAttribute("aria-label", paused ? "Reproduzir vídeo" : "Pausar vídeo");
};

const tryPlay = () => {
  const p = video.play();
  if (p?.catch) p.then(() => setPaused(false)).catch(() => setPaused(true));
  else setPaused(video.paused);
};

if (reduceMotion()) {
  video.removeAttribute("autoplay"); video.pause(); setPaused(true);
} else {
  tryPlay();
  video.addEventListener("canplay", () => { if (video.paused) tryPlay(); }, { once: true }); // retry if autoplay was blocked
}

pauseBtn.addEventListener("click", () => {
  if (video.paused) { video.muted = true; tryPlay(); }
  else { video.pause(); setPaused(true); }
});
```

- The button is a true toggle: paused → `tryPlay()` (re-mutes first, for autoplay policy); playing → `pause()`.
- `setPaused()` is the single source of the visual + label, so the glyph and `aria-label` can never drift from reality. The label reads **"Pausar vídeo"** while playing, **"Reproduzir vídeo"** while paused.
- Autoplay is wrapped in promise handling: if the browser blocks it, the catch sets the paused state, and a one-shot `canplay` retry attempts play once the video is actually ready.

### Accessibility / reduced-motion

Under `prefers-reduced-motion: reduce` the video **does not autoplay** — `autoplay` is removed, the video is paused, and the button starts in its "Reproduzir vídeo" (play) state, so motion is opt-in. The control is a real `<button>` with an always-accurate `aria-label`; the decorative scrim/glyphs are `aria-hidden`.

---

## 7. Soft hero parallax

A whisper of depth: the hero media drifts at ~6% of scroll, only while the hero is on screen, and never under reduced-motion.

```js
const heroMedia = document.querySelector(".hero__media.parallax");
const onScroll = () => {
  if (ticking || reduceMotion()) return;        // motion-gated, rAF-throttled
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.2)            // stop once the hero is well past
      heroMedia.style.transform = `translate3d(0, ${(y * 0.06).toFixed(2)}px, 0)`;
    ticking = false;
  });
};
window.addEventListener("scroll", onScroll, { passive: true });
```

`reduceMotion()` is checked **live inside the handler**, so toggling the OS preference mid-scroll stops the drift immediately. The early-out at `1.2 × innerHeight` avoids transforming once the hero is offscreen.

---

## 8. Comparison drag comparator

A single before/after image where the patient drags to wipe between the two states. A real `<input type="range">` is the keyboard-accessible engine; pointer events let you press-and-drag anywhere on the image. Both write the same `--pos` CSS var that clips the "before" image and positions the divider.

### Markup hooks

```html
<div class="ba" data-ba style="--pos:50%">
  <img class="ba__img ba__img--after"  src="…/home-b.jpg" alt="Pele da paciente, registro fotográfico 2" />
  <img class="ba__img ba__img--before" src="…/home-a.jpg" alt="Pele da paciente, registro fotográfico 1" />
  <div class="ba__divider" aria-hidden="true"><span class="ba__handle">…chevrons…</span></div>
  <input class="ba__range" type="range" min="0" max="100" value="50" step="0.1"
         aria-label="Comparar os dois registros fotográficos" />
</div>
```

CSS consumes `--pos`: `.ba__img--before { clip-path: inset(0 calc(100% - var(--pos)) 0 0) }` and `.ba__divider { left: var(--pos) }`.

### How it's wired

```js
document.querySelectorAll("[data-ba]").forEach((ba) => {
  const range = ba.querySelector(".ba__range");
  const apply = () => ba.style.setProperty("--pos", range.value + "%");
  range.addEventListener("input", apply);   // keyboard + native thumb drag
  apply();

  /* Press-and-drag anywhere on the image (touch + mouse). The range stays for
     keyboard a11y; pointer events drive the live drag and keep range.value in sync. */
  let dragging = false;
  const setFromX = (clientX) => {
    const rect = ba.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    range.value = pct;
    ba.style.setProperty("--pos", pct + "%");
  };
  ba.addEventListener("pointerdown", (e) => {
    dragging = true;
    ba.setPointerCapture?.(e.pointerId);     // keep receiving moves outside the box
    setFromX(e.clientX);
  });
  ba.addEventListener("pointermove", (e) => { if (dragging) setFromX(e.clientX); });
  const stop = (e) => { dragging = false; ba.releasePointerCapture?.(e.pointerId); };
  ba.addEventListener("pointerup", stop);
  ba.addEventListener("pointercancel", stop);
});
```

- **Two input paths, one var.** The range's `input` event (fired by keyboard arrows, the native thumb, and assistive tech) calls `apply()`. Pointer events anywhere on `.ba` call `setFromX()`, which clamps to 0–100, **writes back to `range.value`** (so the two stay in sync), and updates `--pos`.
- **Pointer events** unify mouse + touch + pen, and `setPointerCapture` means a drag started on the image keeps tracking even if the cursor leaves the box. `pointercancel` (e.g. a touch interrupted by the browser) stops cleanly. No separate touch handlers are needed.
- `[data-ba]` is queried with `forEach`, so multiple comparators on a page each wire independently.

### Accessibility / reduced-motion

The `<input type="range">` carries the interaction's accessibility: it is fully keyboard operable (Arrow/Home/End/PageUp-Down move `--pos` in real time via `input`) and labelled `aria-label="Comparar os dois registros fotográficos"`. The divider/handle are `aria-hidden` decoration. There is no time-based animation, so nothing to gate for reduced-motion — the wipe is direct manipulation.

---

## 9. Casos carousel

A full-bleed, horizontally-scrolling track of case cards. Arrows step one card at a time and disable at the ends; each card reveals its second image on hover/focus (desktop) and on tap (touch), with `aria-pressed` tracking the tapped state.

### Markup hooks

```html
<div class="casos__nav" role="group" aria-label="Navegar pelos resultados">
  <button class="casos__arrow" type="button" data-casos-prev aria-label="Ver caso anterior" disabled>…</button>
  <button class="casos__arrow" type="button" data-casos-next aria-label="Ver próximo caso">…</button>
</div>

<div class="casos__viewport">
  <ul class="casos__track" data-casos-track tabindex="0" role="list" aria-label="Casos de pacientes da clínica">
    <li class="caso-item">
      <article class="caso" style="--off:2.6">
        <button class="caso__toggle" type="button" aria-pressed="false" aria-label="Tratamento Capilar: ver o resultado">
          <span class="caso__media">
            <img class="caso__img caso__img--a"  … />
            <img class="caso__img caso__img--b" … />
          </span>
          <span class="caso__meta">…category chip only (no state label)…</span>
        </button>
      </article>
    </li>
    <!-- … more .caso-item … -->
  </ul>
</div>
```

### How it's wired (`casos()`)

```js
const track = document.querySelector("[data-casos-track]");
const prev  = document.querySelector("[data-casos-prev]");
const next  = document.querySelector("[data-casos-next]");

/* one card (its width + the track's column-gap) per arrow click */
const step = () => {
  const card = track.querySelector(".caso-item");
  if (!card) return track.clientWidth;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  return card.getBoundingClientRect().width + gap;
};
const go = (dir) =>
  track.scrollBy({ left: dir * step(), behavior: reduceMotion() ? "auto" : "smooth" });
prev?.addEventListener("click", () => go(-1));
next?.addEventListener("click", () => go(1));

/* enable/disable arrows at the ends, rAF-throttled on scroll + on resize */
const updateArrows = () => {
  const max = track.scrollWidth - track.clientWidth - 2;
  if (prev) prev.disabled = track.scrollLeft <= 2;
  if (next) next.disabled = track.scrollLeft >= max;
};
track.addEventListener("scroll", /* rAF-throttled */ updateArrows, { passive: true });
window.addEventListener("resize", updateArrows);
updateArrows();

/* hover-less (touch) devices: tap toggles image B persistently */
track.querySelectorAll(".caso__toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const caso = btn.closest(".caso");
    const on = caso.classList.toggle("is-revealed");
    btn.setAttribute("aria-pressed", String(on));
  });
});
```

- **Native scroll is the engine.** Arrows call `scrollBy` by exactly one card (measured width + computed `column-gap`); the track is also free-scroll/swipe by the user. Smooth scroll degrades to `"auto"` under reduced-motion.
- **Arrow disabling** is computed from `scrollLeft` against `scrollWidth - clientWidth` (with a 2px tolerance): `prev` disables at the start, `next` at the end. Recomputed on every (throttled) scroll and on resize, and once on init — so the first card starts with `prev` disabled (matching the `disabled` attribute in the markup).
- **Reveal model.** On pointer devices, hover/focus reveals image B purely in CSS (`.caso__toggle:hover .caso__img--b`, `:focus-visible …`). On touch there is no hover, so the tap handler **toggles `.caso.is-revealed`** persistently and flips `aria-pressed` — the same CSS rule (`.caso.is-revealed .caso__img--b`) drives the visual. Hover and the toggled class share one stylesheet path, so the two never diverge.

### Accessibility / keyboard

Each card's reveal control is a real `<button class="caso__toggle">` with `aria-pressed` (toggle semantics) and a descriptive `aria-label` ("`<categoria>`: ver o resultado"); Enter/Space activate it natively, and `:focus-visible` reveals image B exactly like hover. The track is `tabindex="0"` + `role="list"` with an `aria-label`, so it is focusable and can be scrolled with the keyboard. Arrow buttons carry `aria-label`s and use the native `disabled` attribute at the ends. Cards carry no state label (§ Compliance).

---

## 10. Avaliações carousel

The Google-reviews carousel. Mechanically a twin of the casos carousel (arrows + native scroll + end-disabling), minus the reveal — review cards have no hover state.

### Markup hooks

```html
<div class="reviews__nav" role="group" aria-label="Navegar pelas avaliações">
  <button class="reviews__arrow" type="button" data-reviews-prev aria-label="Ver avaliação anterior" disabled>…</button>
  <button class="reviews__arrow" type="button" data-reviews-next aria-label="Ver próxima avaliação">…</button>
</div>

<div class="reviews__viewport">
  <ul class="reviews__track" data-reviews-track tabindex="0" role="list" aria-label="Avaliações de pacientes no Google">
    <li class="review-item"><article class="review-card">…stars · text · author…</article></li>
    <!-- … more .review-item … -->
  </ul>
</div>
```

### How it's wired (`reviews()`)

Identical pattern to §9 with `[data-reviews-track]`, `[data-reviews-prev/next]`, and `.review-item` as the step unit:

```js
const step = () => {
  const card = track.querySelector(".review-item");
  if (!card) return track.clientWidth;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  return card.getBoundingClientRect().width + gap;
};
const go = (dir) =>
  track.scrollBy({ left: dir * step(), behavior: reduceMotion() ? "auto" : "smooth" });
// …same updateArrows() (scrollLeft vs scrollWidth - clientWidth - 2), throttled scroll + resize…
```

Arrows step one review card; they disable at the ends; smooth scroll falls back to `"auto"` under reduced-motion; the track is free-scroll/swipe and focusable (`tabindex="0"`, `role="list"`, `aria-label`). No tap-to-reveal here.

### Accessibility

Arrow buttons have `aria-label`s and use native `disabled` at the ends. Each `review-card__stars` carries an `aria-label` ("5 de 5 estrelas") so the rating is announced; the star SVGs are `aria-hidden`. The header's Google rating is a real `<a>` to the Google review page with a full `aria-label` ("4,9 de 5 estrelas em 216 avaliações no Google…").

---

## 11. Smooth anchor scrolling

In-page `#` links scroll smoothly to their target, instantly under reduced-motion. This is deliberately minimal — `scrollIntoView`, no JS offset math (the fixed nav clearance is handled in CSS via `scroll-margin-top` on section targets).

```js
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id === "#" || id.length < 2) return;        // ignore bare "#"
    const target = document.querySelector(id);
    if (!target) return;                            // let real off-page links pass
    e.preventDefault();
    target.scrollIntoView({
      behavior: reduceMotion() ? "auto" : "smooth",
      block: "start",
    });
  });
});
```

`reduceMotion()` is read live so the jump is instant when the preference is set. Note this handler does **not** push to `history` or move focus — keep it that way unless you also add `scroll-margin-top` accounting and a focus-shift, and make sure not to hijack off-page links (the `querySelector(id)` guard already lets those through).

---

## 12. Fio de cabelo motif

The brand's hair-strand signature, generated per section. `fioMotif()` scans `[data-fio]` sections and injects one self-drawing SVG strand into each section's free outer gutter, on the chosen side, that strokes on as the section crosses the viewport. (Deep anatomy lives in COMPONENTS.md / ANIMATIONS.md — this is just the wiring.)

### Markup hooks

```html
<section class="section section--branco" data-fio="left">…</section>
<section class="section section--branco" data-fio="right">…</section>
<!-- on a teal band, add section--deep so the strand inverts to light: -->
<section class="section section--deep" data-fio="left">…</section>
```

`data-fio="left"|"right"` picks the side; `.section--deep` flips the stroke to a light tint for dark bands.

### How it's wired (`fioMotif()`)

- **Once, shared:** appends a hidden `<svg id="fio-defs">` to `<body>` holding the teal `linearGradient#fio-grad` and a soft-blur filter, reused by every strand.
- **Per section:** for each `[data-fio]`, creates an `<svg class="fio-sec" aria-hidden="true" preserveAspectRatio="none">` with two paths — `.fio-sec__main` (the strand) and `.fio-sec__sheen` (the moving highlight) — and **appends it as the section's last child** so it sits at z-base, behind the content. Stroke is the teal gradient, or light tints (`#dff3ef` / `#f1fffb`) when `.section--deep`.
- **`build()`** (on `load`, and 150ms-debounced on `resize`): measures the section and its `.container` to find the free gutter on the chosen side, computes a band X and amplitude, and **generates the path `d`** as a vertical sine strand that tapers to a point at the top and base (so it kisses the section divide), with a high-frequency micro-wave for "hair life". It **hides the strand** when the viewport is narrow (`< 1080px`) or the gutter is too thin (`< 26px`) by setting `display: none`.
- **`onScroll()`** (rAF-throttled scroll listener): maps the section's viewport position to a `0→1` progress and drives the draw via `stroke-dasharray`/`stroke-dashoffset` on the main path, plus a traveling sheen segment whose opacity fades out near the strand's tips.

### Accessibility / reduced-motion

Every generated SVG is `aria-hidden="true"` — pure decoration, never in the a11y tree or tab order. Under `prefers-reduced-motion: reduce`, `reduceMotion()` is read once in this module: the strand is drawn **fully and statically** (dashoffset 0, no scroll-linked draw) and the sheen is hidden (`opacity: 0`). The motif also self-suppresses on narrow/cramped layouts, so it never crowds the content.

---

## 13. The IIFE pattern + reduced-motion in JS

All of the above lives inside one IIFE in `main.js`, executed top-to-bottom on parse. There is no `init()` registry and no framework — each block guards on its own elements (`if (!el) return;`, or `forEach` over a possibly-empty NodeList), so the same `main.js` runs safely on every page (Início, Tratamentos, Método 4D, Tricologia, Sobre, Contato) without errors when a given section is absent.

```js
(function () {
  "use strict";
  const reduceMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function boot() { /* drop .is-loading after 2 rAFs */ }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* reveal, curve-draw, nav scrolled, nav indicator, drawer, hero video,
     parallax, before/after, casos, reviews, anchor scroll, fioMotif … */
})();
```

### Honoring prefers-reduced-motion

`reduceMotion()` (§0) is the single gate, and it is read **live at the moment of each interaction** — never cached — so a patient who toggles the OS setting mid-visit gets the calmer experience immediately for parallax, hero autoplay, carousel smooth-scroll, anchor scroll, and the fio draw. Where the effect is purely CSS (reveal, curve-draw, the before/after wipe visuals), reduced-motion is honored by the stylesheet's media query, not by JS branching.

### Dormant code to know about

`main.js` still contains a `countUp()` helper and a `.stat__num[data-count]` observer (threshold 0.6, with prefix/suffix and a width-lock so Cormorant's proportional figures can't reflow mid-count). The current home page **no longer renders count-up stats** (the hero's heritage rails replaced them), so this code is **dormant** — it finds no matching elements and does nothing. If you reintroduce a stat with `<span class="stat__num" data-count="30" data-suffix=" anos">30</span>`, it will animate on scroll-in (and print the final value instantly under reduced-motion). Treat it as available-but-unused, not as a shipped behavior.

---

The contract, restated because it is brand-defining for a health site: **every interactive control is a real focusable element, carries correct ARIA state, is keyboard operable, shows the 3px teal focus ring, and never depends on motion to be usable.** When a behavior cannot meet all of these, it does not ship.
