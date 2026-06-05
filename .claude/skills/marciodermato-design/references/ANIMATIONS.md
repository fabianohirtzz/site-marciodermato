# ANIMATIONS.md — Motion vocabulary

This is the kinetic alphabet for **Dr. Márcio Teixeira**. Read it before adding any motion. Pick a pattern from here; resist inventing a new one.

The motion of this brand is **calm, smooth, and slightly slower than a typical site** — composed, never snappy, never bouncy, never flashy. For a premium dermatology practice, *the unhurried timing is the luxury signal*. A reveal that settles in over 800ms reads as confident and expensive; the same reveal at 300ms reads as a SaaS landing page. Restraint is the whole game: **one calm motion per section, not three.** And because this is a health brand, every animation here ships with its `prefers-reduced-motion` fallback in the same section — that is care, and it is mandatory.

**The golden rule:** every animation in this file must degrade gracefully under `prefers-reduced-motion: reduce`. The reduced-motion contract (§ 0) is not optional — wire it in the same pass you write the animation.

## Table of contents
0. The reduced-motion contract (read first)
1. Motion philosophy for this brand
2. Easing & duration tokens
3. Gentle reveal (the default) + stagger
4. Soft parallax (hero media & the curve)
5. Curve draw — the signature gesture
6. Soft hover lift (cards, buttons, image zoom)
7. Count-up (anos · eixos · tratamentos)
8. Método 4D axis cross-fade
9. Hero video (autoplay, pause, reduced-motion fallback)
10. Nav scrolled-state, mobile drawer, smooth anchor scroll
11. Performance rules
12. What NOT to do

---

## 0. The reduced-motion contract — read first

Put this near the top of your CSS. It collapses every reveal, parallax, curve-draw and count-up to instant or opacity-only, stops every loop, and turns off video autoplay. After this is in place, each animation you write only needs to be *additive* on top of a safe, always-visible default.

```css
/* Elements that will reveal start hidden but ALWAYS end visible */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity .8s var(--ease-calm),
    transform .8s var(--ease-calm);
}
.reveal.is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
  .reveal { opacity: 1 !important; transform: none !important; }   /* appear, no slide */
  .parallax, .curve-watermark, .float { transform: none !important; }
  .curve-draw path { stroke-dashoffset: 0 !important; }            /* drawn, not animating */
}
```

Also expose a **JS-level** flag so scroll-driven effects, the count-up and the video can all check the same preference:

```js
const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// In any JS animation: if (reduceMotion()) { applyEndStateInstantly(); return; }
```

**Never** strobe, flash, or run aggressive/fast parallax. **Never** autoplay motion the user can't immediately pause. When in doubt: slower, subtler, calmer.

---

## 1. Motion philosophy for this brand

Three principles govern every choice:

1. **Composed, not snappy.** Reveals settle over **700–900ms** with `--ease-calm` — deliberately slower than the 300–500ms most sites use. The extra time is what makes the page feel poised and premium rather than reactive. Never exceed 900ms for a state change.
2. **Restraint over abundance.** One calm motion per section (a reveal *or* a parallax drift), not a stack of them. The signature flourish — the brand curve drawing in (§5) — appears *once or twice per page*, never on every block.
3. **Soft, never bouncy.** No spring overshoot, no elastic, no fast parallax, no harsh strobing. Shadows that deepen on hover are **teal-tinted, never hard black**. Calm confidence *is* the brand; motion should feel like a slow exhale.

What this rules out: bouncy spring easings everywhere, autoplay carousels, fast scroll-jacking, neon glows that pulse, anything that calls attention to the animation itself. If a viewer *notices the motion* before they notice the content, it is too much.

---

## 2. Easing & duration tokens

These are the exact tokens from DESIGN.md § 6 — reproduced here for convenience. Use them verbatim; do not invent new curves.

```css
:root {
  --ease-calm:  cubic-bezier(0.22, 1, 0.36, 1);   /* default reveal / settle — the brand's signature */
  --ease-soft:  cubic-bezier(0.4, 0, 0.2, 1);      /* hover color / border */
  --ease-glide: cubic-bezier(0.65, 0, 0.35, 1);    /* panel swaps, axis cross-fade */
  --float: 7s;                                      /* base ambient drift */
}
```

### When to use each

| Token | Curve character | Use for |
|---|---|---|
| `--ease-calm` | out-quart: quick start, long graceful glide to rest | Section reveals, stagger-in, curve draw, hover *transform* / lift, count-up settle |
| `--ease-soft` | symmetric ease-in-out | Hover *color* / border / background tints, focus rings, small chrome |
| `--ease-glide` | symmetric in-out, slightly sharper | Axis panel cross-fade, accordion, modal, drawer slide, nav scrolled-state |

### Duration ladder

| Range | Use |
|---|---|
| 160–240ms | Hover color / border |
| 260–360ms | Hover transform / lift, button press, image zoom |
| 350–550ms | Axis panel cross-fade, accordion, modal, drawer |
| 700–900ms | Section reveal ("settles in") — slightly slower than usual = calmer, premium |
| 6–18s | Ambient parallax / curve drift (very slow, barely perceptible) |

**Never exceed 900ms for a state change.** Ambient loops are slow and almost subliminal. The premium feel comes from motion being *slightly slower and smoother* than a typical site — composed, never bouncy.

---

## 3. Gentle reveal (the default) + stagger

Almost everything enters this way: a small **16px rise + fade** as it scrolls into view, over **700–900ms** with `--ease-calm`. One-shot IntersectionObserver — fire once, then unobserve.

### JS

```js
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && e.intersectionRatio > 0.15) {
      e.target.classList.add('is-in');
      io.unobserve(e.target);          // reveal once, never re-run
    }
  }
}, { threshold: [0, 0.15], rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```

### CSS

The base `.reveal` is defined in § 0. To vary the settle time per element, lean toward the slow end (800ms) for hero/headline blocks and the faster end (700ms) for smaller cards:

```css
.reveal            { transition-duration: .8s; }   /* default — premium, unhurried */
.reveal--slow      { transition-duration: .9s; }   /* hero lede, big display title */
.reveal--quick     { transition-duration: .7s; }   /* small cards, meta rows */
```

A gentle variant that rises a touch further (for a hero headline that should feel like it lifts in):

```css
.reveal--lift { transform: translateY(28px); }
.reveal--lift.is-in { transform: none; }
```

### Stagger — the page assembles with composure

Grids of treatment cards, axis cards or stats reveal in sequence. Drive the delay with an `--i` custom property set per index; step **70–90ms** and cap the total cascade so a long grid doesn't crawl.

```css
.reveal[style*="--i"] { transition-delay: calc(var(--i) * 80ms); }
```

```html
<article class="axis-card reveal" style="--i:0">…</article>
<article class="axis-card reveal" style="--i:1">…</article>
<article class="axis-card reveal" style="--i:2">…</article>
<article class="axis-card reveal" style="--i:3">…</article>
```

Keep the step at 70–90ms; with the four 4D axes that's a graceful ~240ms spread, with a 6-card treatment grid ~400–480ms — enough that the page "settles in" without anyone waiting. To cap a long grid, modulo the index in JS (`el.style.setProperty('--i', i % 6)`).

**Reduced motion:** § 0 zeroes the transform and the delay, so every `.reveal` simply appears in place. No extra code needed.

---

## 4. Soft parallax (hero media & the curve)

The hero media and the decorative brand curve drift **slowly** as the user scrolls — a few percent of `translateY`, never more. This is *atmosphere*, not a roller coaster. The motion must be so subtle that a casual viewer feels depth without consciously seeing movement.

### CSS

```css
.parallax {
  will-change: transform;
  transition: transform .1s linear;   /* tiny smoothing only; the rAF loop drives it */
}
.hero__media   { /* foreground hero image / video frame */ }
.hero__curve   { /* the decorative brand curve layered behind/beside the media */ }
```

### JS (requestAnimationFrame, coalesced — the calm way)

Drive only `transform`, read scroll once per frame, and keep the multiplier tiny. The curve drifts a hair faster than the media to separate the planes.

```js
const layers = [
  { el: document.querySelector('.hero__media'), speed: 0.04 },  // ~4% drift — barely there
  { el: document.querySelector('.hero__curve'), speed: 0.08 },  // curve drifts a touch more
];

let ticking = false;
function onScroll() {
  if (ticking || reduceMotion()) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    for (const l of layers) {
      if (l.el) l.el.style.transform = `translate3d(0, ${(y * l.speed).toFixed(2)}px, 0)`;
    }
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
```

### Native alternative — scroll-driven animation (progressive enhancement)

Where supported, CSS scroll-timelines do this off the main thread. Guard it so unsupported browsers fall back cleanly to no parallax (which is perfectly fine).

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .hero__curve {
      animation: curve-drift linear both;
      animation-timeline: view();
      animation-range: entry 0% exit 100%;
    }
    @keyframes curve-drift {
      from { transform: translateY(-3%); }
      to   { transform: translateY(3%); }
    }
  }
}
```

**Keep it subtle:** maximum a few percent of travel. Aggressive or fast parallax is explicitly off-brand (DESIGN.md anti-patterns) and a motion-sickness risk for a health audience.

**Reduced motion:** the JS bails via `reduceMotion()`; the CSS variant is wrapped in `prefers-reduced-motion: no-preference`; § 0 forces `transform: none` on `.parallax` / `.curve-watermark`. Triple-safe.

---

## 5. Curve draw — the signature gesture

The brand mark holds a **sinuous white curve**. Animating that curve drawing itself in (via `stroke-dashoffset`) is the **one ownable, signature motion** of this site. Use it sparingly — once or twice per page (e.g. under a section title, or as a divider between two bands) — so it stays special. Everywhere else, the same curve sits as a faint, static, oversized **watermark**.

### SVG scaffold (extract the path from `logo/`)

Replace the `d` below with the real curve path lifted from the brand mark. `pathLength="1"` normalizes the math so the dash values are always `0…1` regardless of the actual path length.

```html
<svg class="curve-draw" viewBox="0 0 600 200" fill="none" aria-hidden="true"
     preserveAspectRatio="xMidYMid meet">
  <path
    pathLength="1"
    d="M10,150 C140,30 250,30 320,110 S480,180 590,60"
    stroke="var(--marca)" stroke-width="3"
    stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

### CSS — the draw-in

The path starts fully "undrawn" (`stroke-dashoffset: 1`) and animates to `0` over a generous ~1.4s with `--ease-calm` when `.is-in` is added by the same reveal observer (§3).

```css
.curve-draw path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 1.4s var(--ease-calm);
}
.curve-draw.is-in path { stroke-dashoffset: 0; }
```

Wire it through the existing reveal observer by giving the SVG the `reveal` class too, or observe `.curve-draw` directly:

```js
const curveIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      curveIO.unobserve(e.target);
    }
  }
}, { threshold: 0.4 });
document.querySelectorAll('.curve-draw').forEach(el => curveIO.observe(el));
```

### The static watermark variant

The same curve, oversized, very faint, behind a section — the brand's reusable backdrop instead of generic blobs or waves. No animation; it just *is*.

```css
.curve-watermark {
  position: absolute;
  inset: auto -10% -12% auto;       /* bleed off an edge */
  width: min(70vw, 880px);
  color: var(--marca);
  opacity: 0.05;                    /* a whisper — never competes with text */
  pointer-events: none;
  z-index: 0;
}
.curve-watermark svg { width: 100%; height: auto; display: block; }
```

Place real content above it with `position: relative; z-index: 1`. Keep opacity in the `0.04–0.07` range so it reads as texture, not decoration shouting for attention.

**Reduced motion:** § 0 sets `.curve-draw path { stroke-dashoffset: 0 }` — the curve appears fully drawn, instantly, no stroke animation. The watermark is static regardless, so it's always safe.

---

## 6. Soft hover lift (cards, buttons, image zoom)

Pointer feedback is gentle and short (**260ms**), with **teal-tinted** shadows only. Never a hard black drop-shadow, never a big spring.

### Card lift

Cards rise **6px** and deepen their soft teal shadow over 260ms. Shadow values are the brand tokens from DESIGN.md § 5.

```css
.axis-card,
.treat-card {
  transition:
    transform .26s var(--ease-calm),
    box-shadow .26s var(--ease-soft);
  box-shadow:
    0 14px 38px rgba(5, 127, 127, 0.08),
    0 4px 12px rgba(22, 48, 47, 0.05);
}
.axis-card:hover,
.treat-card:hover,
.axis-card:focus-within,
.treat-card:focus-within {
  transform: translateY(-6px);
  box-shadow:
    0 30px 66px rgba(5, 127, 127, 0.16),
    0 8px 20px rgba(22, 48, 47, 0.08);
}
```

Note `:focus-within` mirrors the hover so keyboard users get the same affordance.

### Buttons — brighten / fill, settle on press

The primary CTA brightens its teal glow on hover and gives a small, *non-bouncy* press. Ghost/outline buttons fill with teal.

```css
.btn {
  transition:
    transform .22s var(--ease-calm),
    box-shadow .22s var(--ease-soft),
    background-color .2s var(--ease-soft),
    color .2s var(--ease-soft);
}

/* Primary teal CTA */
.btn--primary {
  background: var(--grad-marca);
  color: #fff;
  box-shadow: 0 12px 30px rgba(5, 127, 127, 0.26);
}
.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(5, 127, 127, 0.34);   /* glow deepens — no color flip */
}
.btn--primary:active { transform: translateY(0); }    /* settle, not bounce */

/* Ghost / outline — fills with teal on hover */
.btn--ghost {
  background: transparent;
  color: var(--marca-ink);
  border: 1.5px solid var(--linha);
}
.btn--ghost:hover {
  background: var(--marca);
  color: #fff;
  border-color: var(--marca);
}
```

### Image zoom inside a rounded frame

Treatment / clinic photos sit in a rounded frame with `overflow: hidden`; the image scales **1.04** on hover. The frame echoes the brand square radius (`--r-lg`).

```css
.treat-card__media,
.frame {
  overflow: hidden;
  border-radius: var(--r-lg);
}
.treat-card__media img,
.frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .5s var(--ease-calm);
  will-change: transform;
}
.treat-card:hover .treat-card__media img,
.frame:hover img {
  transform: scale(1.04);            /* gentle — never a dramatic zoom */
}
```

**Reduced motion:** § 0 collapses all of these transitions to instant, so hover simply swaps the end state (deeper shadow, filled button, slightly larger image) with no animation. If you want hover to be completely flat under reduced-motion, add:

```css
@media (prefers-reduced-motion: reduce) {
  .axis-card:hover, .treat-card:hover { transform: none; }
  .treat-card:hover .treat-card__media img, .frame:hover img { transform: none; }
  .btn--primary:hover { transform: none; }
}
```

---

## 7. Count-up (anos · eixos · tratamentos)

Stat numbers tick up **once** when the stat band reveals — anos de excelência, eixos, tratamentos, congressos. One pass, never a loop. Under reduced-motion it **snaps straight to the final value** (no ticking at all).

### HTML

```html
<div class="stat reveal">
  <span class="stat__num" data-count="30">30</span>
  <span class="stat__key">anos de excelência</span>
</div>
<div class="stat reveal">
  <span class="stat__num" data-count="4">4</span>
  <span class="stat__key">eixos do Método 4D</span>
</div>
<div class="stat reveal">
  <span class="stat__num" data-count="20" data-prefix="+">+20</span>
  <span class="stat__key">tratamentos</span>
</div>
```

### JS

```js
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  const prefix = el.dataset.prefix || '';
  if (reduceMotion()) { el.textContent = prefix + target; return; }  // snap, respect preference

  const dur = 1400;                         // calm, premium pace
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);   // ease-out cubic — matches --ease-calm feel
    el.textContent = prefix + Math.round(target * eased);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Fire from a one-shot observer so each stat counts exactly once.
const statIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      countUp(e.target);
      statIO.unobserve(e.target);
    }
  }
}, { threshold: 0.6 });
document.querySelectorAll('.stat__num').forEach(el => statIO.observe(el));
```

The 1.4s duration and ease-out cubic deliberately mirror the calm reveal pace — the number rises with the same composed cadence as the card it sits in.

**Reduced motion:** handled inline — `countUp` snaps to `prefix + target` and returns before any animation. The number is always correct and readable.

---

## 8. Método 4D axis cross-fade

Switching between the four 4D axis tabs **cross-fades** the panel — opacity plus a slight `translateY` — over **350–450ms** with `--ease-glide`. Calm, never a hard cut, never a slide-carousel.

### HTML

```html
<div class="axis" role="tablist" aria-label="Método 4D">
  <button class="axis__tab is-active" role="tab" aria-selected="true"  data-axis="1">Eixo 1</button>
  <button class="axis__tab"           role="tab" aria-selected="false" data-axis="2">Eixo 2</button>
  <button class="axis__tab"           role="tab" aria-selected="false" data-axis="3">Eixo 3</button>
  <button class="axis__tab"           role="tab" aria-selected="false" data-axis="4">Eixo 4</button>
</div>

<div class="axis__panels">
  <section class="axis__panel is-active" role="tabpanel" data-axis="1">…</section>
  <section class="axis__panel"           role="tabpanel" data-axis="2" hidden>…</section>
  <section class="axis__panel"           role="tabpanel" data-axis="3" hidden>…</section>
  <section class="axis__panel"           role="tabpanel" data-axis="4" hidden>…</section>
</div>
```

### CSS

```css
.axis__panel {
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity .42s var(--ease-glide),
    transform .42s var(--ease-glide);
}
.axis__panel.is-active {
  opacity: 1;
  transform: none;
}
.axis__panel[hidden] { display: none; }   /* removed from flow when fully inactive */
```

### JS

To cross-fade cleanly, unhide the incoming panel, force a reflow, then toggle the active state on the next frame so the transition runs.

```js
const tabs   = document.querySelectorAll('.axis__tab');
const panels = document.querySelectorAll('.axis__panel');

function selectAxis(n) {
  tabs.forEach(t => {
    const on = t.dataset.axis === String(n);
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on ? 'true' : 'false');
  });

  panels.forEach(p => {
    const on = p.dataset.axis === String(n);
    if (on) {
      p.hidden = false;
      // next frame: let display:flex paint before fading in
      requestAnimationFrame(() => p.classList.add('is-active'));
    } else {
      p.classList.remove('is-active');
      if (reduceMotion()) { p.hidden = true; }
      else { p.addEventListener('transitionend', () => { p.hidden = true; }, { once: true }); }
    }
  });
}

tabs.forEach(t => t.addEventListener('click', () => selectAxis(t.dataset.axis)));
```

**Reduced motion:** § 0 makes the transition instant, and the JS hides the outgoing panel immediately (no `transitionend` wait), so the swap is a clean, flicker-free cut.

---

## 9. Hero video (autoplay, pause, reduced-motion fallback)

The hero background video is **muted, `playsinline`, looping, with a poster and a visible pause/play control.** Under reduced-motion it **does not autoplay** — it shows the poster frame instead. This is the one acceptable autoplay, and only in this exact restrained form.

### HTML

```html
<div class="hero__video-wrap">
  <video
    id="hero-video"
    class="hero__video"
    muted loop playsinline preload="metadata"
    poster="imagens/hero-poster.jpg"
    aria-label="Vídeo institucional da clínica">
    <source src="video-hero/video-hero.mp4" type="video/mp4" />
  </video>

  <button class="hero__video-toggle" type="button"
          aria-pressed="false" aria-label="Pausar vídeo">
    <span class="hero__video-icon" aria-hidden="true"><!-- pause/play svg --></span>
  </button>
</div>
```

### CSS

```css
.hero__video {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}
/* A faint teal-ink scrim keeps white overlay text legible — never a harsh black wash */
.hero__video-wrap::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(4,77,77,0.10) 0%, rgba(4,77,77,0.42) 100%);
  pointer-events: none;
}
.hero__video-toggle {
  position: absolute; right: 20px; bottom: 20px;
  width: 44px; height: 44px;                 /* ≥44px touch target */
  border-radius: var(--r-pill);
  display: grid; place-items: center;
  background: rgba(255,255,255,0.16);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.35);
  color: #fff; cursor: pointer;
  transition: background-color .2s var(--ease-soft), transform .26s var(--ease-calm);
}
.hero__video-toggle:hover { background: rgba(255,255,255,0.26); transform: translateY(-1px); }
```

### JS — reduced-motion-aware autoplay + pause control

```js
const video  = document.getElementById('hero-video');
const toggle = document.querySelector('.hero__video-toggle');

function setPaused(paused) {
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.setAttribute('aria-label', paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
  toggle.classList.toggle('is-paused', paused);
}

if (reduceMotion()) {
  // Show the poster, do NOT autoplay. The toggle becomes an explicit play affordance.
  video.removeAttribute('autoplay');
  video.pause();
  setPaused(true);
} else {
  video.play().catch(() => setPaused(true));   // some browsers block; reflect real state
  setPaused(video.paused);
}

toggle.addEventListener('click', () => {
  if (video.paused) { video.play(); setPaused(false); }
  else              { video.pause(); setPaused(true); }
});
```

Notes: never add `autoplay` for users who prefer reduced motion; never play sound (the video is `muted`); always keep the pause control visible and labelled. The scrim is teal-ink, never hard black (DESIGN.md § 5).

**Reduced motion:** the poster is shown, no autoplay, and the user can opt in via the play button. Fully respected.

---

## 10. Nav scrolled-state, mobile drawer, smooth anchor scroll

Calm chrome motion — short, glide-eased, never flashy.

### Nav scrolled-state

The glass nav gains a solid-ish background, a soft teal shadow and slightly tighter padding once the page scrolls past a small threshold. Transition the *visual* properties only.

```css
.nav {
  transition:
    background-color .35s var(--ease-glide),
    box-shadow .35s var(--ease-glide),
    padding .35s var(--ease-glide);
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(10px);
}
.nav.is-scrolled {
  background: rgba(255,255,255,0.92);
  box-shadow: 0 10px 30px rgba(5,127,127,0.08);
  padding-top: 12px; padding-bottom: 12px;
}
```

```js
const nav = document.querySelector('.nav');
let navTicking = false;
window.addEventListener('scroll', () => {
  if (navTicking) return;
  navTicking = true;
  requestAnimationFrame(() => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
    navTicking = false;
  });
}, { passive: true });
```

### Mobile drawer slide

The drawer slides in from the right over ~420ms with `--ease-glide`; a backdrop fades in beneath it.

```css
.drawer {
  position: fixed; inset: 0 0 0 auto;
  width: min(86vw, 380px);
  transform: translateX(100%);
  transition: transform .42s var(--ease-glide);
  will-change: transform;
}
.drawer.is-open { transform: none; }

.drawer__backdrop {
  position: fixed; inset: 0;
  background: rgba(4,77,77,0.32);     /* teal-ink veil, never pure black */
  opacity: 0; visibility: hidden;
  transition: opacity .35s var(--ease-soft), visibility .35s var(--ease-soft);
}
.drawer__backdrop.is-open { opacity: 1; visibility: visible; }
```

```js
const drawer   = document.querySelector('.drawer');
const backdrop = document.querySelector('.drawer__backdrop');
const openBtn  = document.querySelector('[data-drawer-open]');
const closeBtn = document.querySelector('[data-drawer-close]');

function setDrawer(open) {
  drawer.classList.toggle('is-open', open);
  backdrop.classList.toggle('is-open', open);
  openBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';   // lock scroll while open
}
openBtn.addEventListener('click', () => setDrawer(true));
closeBtn.addEventListener('click', () => setDrawer(false));
backdrop.addEventListener('click', () => setDrawer(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setDrawer(false); });
```

### Smooth anchor scroll

Native CSS smooth scroll, with the reduced-motion override already handled by § 0 (`scroll-behavior: auto !important`).

```css
html { scroll-behavior: smooth; }
:target, [id] { scroll-margin-top: 96px; }   /* clear the fixed nav */
```

If you need JS smooth scroll (e.g. to also close the drawer), respect the preference explicitly:

```js
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    setDrawer?.(false);
    target.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  });
});
```

**Reduced motion:** § 0 flattens the nav/drawer transitions to instant and forces `scroll-behavior: auto`; the JS anchor handler checks `reduceMotion()` and jumps instead of gliding.

---

## 11. Performance rules

| Rule | Why |
|---|---|
| Animate `transform` and `opacity` only for 60fps motion | Other properties trigger layout/paint and stutter |
| `requestAnimationFrame` to coalesce scroll handlers (parallax, nav) | Multiple scroll events per frame is wasteful |
| `passive: true` on scroll listeners | Don't block the scroll thread |
| `will-change: transform` on actively animating layers (parallax media, zoom image) — and only there | Hints the compositor; expensive if left on everywhere |
| One-shot IntersectionObserver: `unobserve` after reveal / count-up | Don't keep observing what already fired |
| `loading="lazy"` on every `<img>` past the hero | Treatment art, clinic gallery, etc. |
| `preload="metadata"` (not `auto`) on the hero video; provide a `poster` | The poster carries first paint; full preload is wasteful for a looping ambient video |
| Cap stagger via `--i % 6` on long grids | Prevents a multi-second cascade on big catalogs |
| `stroke-dashoffset` curve draw uses `pathLength="1"` | Dash math stays correct regardless of the path's real length |

---

## 12. What NOT to do

| Don't | Why it breaks brand | Instead |
|---|---|---|
| Bouncy / spring easings everywhere | Cheapens the calm authority; reads as a kids' app | `--ease-calm` reveals; a tiny non-bouncy lift on hover |
| Fast or large parallax | Disorienting, motion-sickness risk, off-brand | A few percent of slow `translateY`, rAF-driven |
| Hard black drop-shadows on hover | Cold, cut-out, cheap | Soft, low, **teal-tinted** shadows (§6, DESIGN.md §5) |
| State changes longer than 900ms | Feels broken / sluggish | 700–900ms reveals, ≤550ms panels, ~260ms hovers |
| Autoplay the hero video under reduced-motion, or with sound | Removes user control; a health-brand failure | Poster + opt-in play; always muted; visible pause |
| The curve draw on every block | Burns the signature gesture; clutters | Once or twice per page; static watermark elsewhere |
| Strobing, flashing, looping glows / pulses | Sensory harm, accessibility violation | Static accents; the one calm curve draw |
| Animating 5+ large elements at once | Visual overload, drops frames | One calm motion per section; stagger the rest |
| Re-running count-up on every re-scroll | Distracting, looks broken | One-shot observer, `unobserve` after firing |
| Forgetting the reduced-motion fallback | Excludes & can harm patients; breaks the contract | Wire § 0 every time, in the same pass |

When unsure, choose the calmer option. A still, refined, legible page is *always* on-brand for this clinic; a busy or hurried one never is. The premium feel is the unhurried timing.
