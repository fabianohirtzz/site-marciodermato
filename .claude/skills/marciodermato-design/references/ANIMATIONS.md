# ANIMATIONS.md — Motion vocabulary

This is the kinetic alphabet for **Dr. Márcio Teixeira**. Read it before adding any motion. Pick a pattern from here; resist inventing a new one.

The motion of this brand is **calm, smooth, and slightly slower than a typical site** — composed, never snappy, never bouncy, never flashy. For a premium dermatology practice, *the unhurried timing is the luxury signal*. A reveal that settles in over 800ms reads as confident and expensive; the same reveal at 300ms reads as a SaaS landing page. Restraint is the whole game: **one calm motion per section, not three.** And because this is a health brand, every animation here ships with its `prefers-reduced-motion` fallback in the same section — that is care, and it is mandatory.

**The golden rule:** every animation in this file must degrade gracefully under `prefers-reduced-motion: reduce`. The reduced-motion contract (§ 0) is not optional — wire it in the same pass you write the animation.

## Table of contents
0. The reduced-motion contract (read first)
1. Motion philosophy for this brand
2. Easing & duration tokens
3. Gentle reveal (the default) + stagger
4. Soft parallax (hero media)
5. Fio de cabelo — the signature scroll-driven motif
6. Soft hover lift (cards, buttons, image zoom)
7. Método 4D axis cards + icon stroke-draw
8. Comparison comparator (drag-to-reveal)
9. Casos + Avaliações carousels (scroll-snap, arrows, cross-fade)
10. Hero video (autoplay, pause, reduced-motion fallback)
11. Nav — entrance, scrolled-state (`.is-solid`), sliding indicator
12. Mobile drawer, smooth anchor scroll
13. WhatsApp float — entrance, breathe, wiggle, radar rings
14. Performance rules
15. What NOT to do

> **Note on the hero stats count-up.** Earlier builds animated a count-up stats band (anos · eixos · tratamentos). That band was removed from the page; the hero now carries static **heritage rails** instead (§ 1a). The `countUp()` helper still ships in `main.js` as a dormant utility, but no page wires `data-count` to it. Treat count-up as *legacy/optional* — do not present it as a primary motion. The hero rails do **not** animate.

---

## 0. The reduced-motion contract — read first

Put this near the top of your CSS (it lives in `main.css` § 3). It collapses every reveal, parallax and stroke-draw to instant or opacity-only, neutralizes every loop, and turns off video autoplay. After this is in place, each animation you write only needs to be *additive* on top of a safe, always-visible default. This is the **exact** block that ships:

```css
/* Elements that will reveal start hidden but ALWAYS end visible */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity .8s var(--ease-calm), transform .8s var(--ease-calm);
}
.reveal.is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
  }
  .reveal { opacity: 1 !important; transform: none !important; }   /* appear, no slide */
  .parallax { transform: none !important; }
  .curve-draw path { stroke-dashoffset: 0 !important; }            /* drawn, not animating */
}
```

The global `transition-duration: .001ms !important` is the safety net that flattens every hover, panel and carousel transition. On top of it, several components add **targeted** reduced-motion rules to zero a *hover transform* or kill a *looping* animation outright (the WhatsApp rings, the fio sheen, the cue line, card lifts) — always co-located with the component. When you add motion, follow that pattern: rely on § 0 for the blanket flatten, then add a tight rule wherever an idle loop or a transform-on-hover would still read as movement.

Also expose a **JS-level** flag so scroll-driven effects (parallax, the fio motif), the carousels and the video can all check the same preference — `main.js` defines exactly this and uses it everywhere:

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
2. **Restraint over abundance.** One calm motion per section (a reveal *or* a drift), not a stack of them. The signature flourish — the *fio de cabelo* strand drawing in with scroll (§5) — lives in the empty gutter, one per marked section, never crowding the text.
3. **Soft, never bouncy.** No spring overshoot, no elastic, no fast parallax, no harsh strobing. Shadows that deepen on hover are **teal-tinted, never hard black**. Calm confidence *is* the brand; motion should feel like a slow exhale.

What this rules out: bouncy spring easings everywhere, autoplay carousels, fast scroll-jacking, neon glows that pulse, anything that calls attention to the animation itself. If a viewer *notices the motion* before they notice the content, it is too much.

### 1a. Hero heritage rails — *deliberately static*

The hero flanks its content with two vertical **heritage rails** (`.hero__rail--left` / `.hero__rail--right`) — small rotated caps reading *"+30 anos de excelência"* and *"Desde 1993"*, each with a short `.hero__rail-bar` tick in `--marca-bright`. They replaced the old count-up stats band, and they are **intentionally motionless**: positioned at `top: 50%` with `transform: translate(±50%, -50%) rotate(-90deg)`, no entrance, no scroll tie-in. They read as engraved heritage marks, not animated stats. Do not bolt a reveal or a count onto them — the stillness is the point, and it is the calmest possible way to state the brand's tenure. (On `≤600px` they clip off-canvas and are simply `display: none`.) Listed here so nobody "fixes" their lack of motion.

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
| `--ease-calm` | out-quart: quick start, long graceful glide to rest | Section reveals, stagger-in, fio/curve stroke-draw, hover *transform* / lift, image zoom |
| `--ease-soft` | symmetric ease-in-out | Hover *color* / border / background tints, focus rings, scrim fades, small chrome |
| `--ease-glide` | symmetric in-out, slightly sharper | Nav entrance + scrolled-state, sliding indicator, drawer slide, casos cross-fade |

### Duration ladder

| Range | Use |
|---|---|
| 160–240ms | Hover color / border, opacity-only indicator fade |
| 260–360ms | Hover transform / lift, button press, sliding-indicator slide (.42s on glide) |
| 350–550ms | Drawer / scrim, nav scrolled-state, casos cross-fade (.55s), icon stroke-draw (.85–.95s) |
| 700–900ms | Section reveal ("settles in"), nav entrance, fio scroll-draw — slightly slower = calmer, premium |
| 3–5s | Sanctioned idle loops only (WhatsApp breathe/rings/wiggle, hero cue) — slow, killed under reduced-motion |

**Never exceed 900ms for a state change.** Ambient loops are slow and almost subliminal. The premium feel comes from motion being *slightly slower and smoother* than a typical site — composed, never bouncy.

---

## 3. Gentle reveal (the default) + stagger

Almost everything enters this way: a small **16px rise + fade** as it scrolls into view, over **700–900ms** with `--ease-calm`. One-shot IntersectionObserver — fire once, then unobserve.

### JS

```js
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && e.intersectionRatio > 0.12) {
      e.target.classList.add('is-in');
      io.unobserve(e.target);          // reveal once, never re-run
    }
  }
}, { threshold: [0, 0.12], rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
// No IntersectionObserver? Add `.is-in` to every `.reveal` up front so content is never stuck hidden.
```

A `body.is-loading` guard (`body.is-loading * { transition: none !important }`) holds transitions off until JS clears the class on the second `requestAnimationFrame`, so nothing flashes its reveal mid-boot.

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

## 4. Soft parallax (hero media)

The hero media drifts **slowly** as the user scrolls — a few percent of `translateY`, never more. This is *atmosphere*, not a roller coaster: subtle enough that a casual viewer feels depth without consciously seeing movement. Only the hero foreground is parallaxed; nothing else on the page is.

### JS (requestAnimationFrame, coalesced — the calm way)

Drive only `transform`, read scroll once per frame, and keep the multiplier tiny. The shipped loop targets `.hero__media.parallax` at **0.06** (≈6%) and stops computing once the hero is well out of view, so it costs nothing for the rest of the page.

```js
const heroMedia = document.querySelector('.hero__media.parallax');
if (heroMedia) {
  let ticking = false;
  const onScroll = () => {
    if (ticking || reduceMotion()) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {          // only while the hero is near
        heroMedia.style.transform = `translate3d(0, ${(y * 0.06).toFixed(2)}px, 0)`;
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}
```

**Keep it subtle:** maximum a few percent of travel. Aggressive or fast parallax is explicitly off-brand (DESIGN.md anti-patterns) and a motion-sickness risk for a health audience.

**Reduced motion:** the JS bails up front via `reduceMotion()`, so `transform` is never written; § 0 also forces `transform: none` on `.parallax`. Double-safe.

---

## 5. Fio de cabelo — the signature scroll-driven motif

This is the **one ownable, signature motion** of the site. The brand icon's curve is a single **strand of hair** (a *fio de cabelo*); `fioMotif()` in `main.js` draws that strand, full-height, in the empty outer gutter of each marked section, and lets scroll *paint it in* as the section crosses the viewport. It is the brand's reusable backdrop in place of generic blobs or waves — calm, almost subliminal, and never near the text.

### How it's wired

Mark a section with `data-fio="left"` or `data-fio="right"` to choose the side; `fioMotif()` does the rest. For each marked section it:

1. Injects shared `<defs>` once — a vertical teal `linearGradient` (`#19b3a6 → #057f7f → #044d4d`) and a soft Gaussian-blur filter (`#fio-soft`).
2. Builds an `.fio-sec` SVG as the section's **last child**, so it sits at `--z-base` (behind content, above the background). The section's `overflow: clip` makes the strand touch and vanish exactly at each band's seam.
3. Generates a gently waving vertical path that **tapers to a point at the top and base** (a `sin(π·t)` envelope), with a low-frequency wave plus a tiny `×0.16` micro-jitter for "hair life." It draws two stacked copies: `.fio-sec__main` (the strand) and `.fio-sec__sheen` (a travelling highlight). On `.section--deep` bands the stroke flips to near-white (`#dff3ef` / `#f1fffb`) so it reads over the teal.
4. Hides the motif on narrow viewports (`< 1080px`) or when the free gutter is `< 26px` — it never crowds the text.

### The scroll-driven draw

The strand uses `pathLength="1"` so dash math is `0…1` regardless of real length. As the section travels up, JS maps a 0→1 progress `sp` to `strokeDashoffset` on the main path — the strand **draws itself from one end** rather than fading. The sheen is a short dash segment (`SEG = 0.08`) whose offset tracks `sp`, so a soft highlight glides along the strand; its opacity eases to `0` at both ends so the glint never sits on the tapered tips.

```js
// per section, coalesced in a rAF scroll handler:
const r  = sec.getBoundingClientRect();
const sp = clamp((innerHeight * 0.82 - r.top) / Math.max(1, r.height), 0, 1);

main.style.strokeDasharray  = 1;
main.style.strokeDashoffset = reduce ? 0 : (1 - sp).toFixed(4);   // draw in with scroll

if (!reduce) {
  sheen.style.strokeDasharray  = SEG + ' ' + (1 - SEG);
  sheen.style.strokeDashoffset = (SEG / 2 - sp).toFixed(4);       // highlight travels
  const edge = Math.min(sp, 1 - sp);                              // fade near the tips
  sheen.style.opacity = (0.9 * clamp(edge / 0.12, 0, 1)).toFixed(3);
}
```

The geometry is rebuilt on `load` and (debounced) on `resize`; scroll updates are rAF-coalesced and `passive`.

### CSS for the motif layer

```css
.fio-sec      { position: absolute; inset: 0; width: 100%; height: 100%;
                z-index: var(--z-base); pointer-events: none; }
.fio-sec__main  { stroke-width: 1.3px; opacity: .5; stroke-linecap: round; stroke-linejoin: round; }
.fio-sec__sheen { stroke-width: 2.4px; opacity: 0; stroke-linecap: round; filter: url(#fio-soft); }
```

**Reduced motion:** `fioMotif()` reads `reduceMotion()` once. When set, the main strand is pinned `strokeDashoffset: 0` (drawn in full, no scroll paint) and the sheen is forced to `opacity: 0`; CSS also hard-locks `.fio-sec__sheen { opacity: 0 !important }`. The strand is present and still — never animating, never glinting.

### Legacy: generic curve-draw helper

A general `.curve-draw` stroke-in (`stroke-dashoffset 1 → 0` over `1.4s var(--ease-calm)`, fired by adding `.is-in` via a one-shot observer at `threshold: 0.4`) still ships in `main.css` § 3 and `main.js`. It's the reusable primitive the fio motif is built on; use it for a *one-off* line draw under a title. Under reduced-motion § 0 pins `.curve-draw path { stroke-dashoffset: 0 }` — drawn instantly, no animation.

---

## 6. Soft hover lift (cards, buttons, image zoom)

Pointer feedback is gentle and short (**260ms**), with **teal-tinted** shadows only. Never a hard black drop-shadow, never a big spring.

### Card lift

Cards (`.diff-card`, `.axis-card`, `.treat-card`, `.review-card`) rise **6px** and deepen their soft teal shadow over **.26s** (treat/review cards use **.28s**). Shadow values are the brand tokens from DESIGN.md § 5. These exact values ship across § 11–14 of `main.css`:

```css
.diff-card,
.axis-card,
.treat-card {
  transition:
    transform .26s var(--ease-calm),
    box-shadow .26s var(--ease-soft);
  box-shadow:
    0 14px 38px rgba(5, 127, 127, 0.08),
    0 4px 12px rgba(22, 48, 47, 0.05);
}
.diff-card:hover,  .diff-card:focus-within,
.axis-card:hover,  .axis-card:focus-within,
.treat-card:hover, .treat-card:focus-within {
  transform: translateY(-6px);
  box-shadow:
    0 30px 66px rgba(5, 127, 127, 0.16),
    0 8px 20px rgba(22, 48, 47, 0.08);
}
```

Note `:focus-within` mirrors the hover so keyboard users get the same affordance.

### Diff-card icon stroke-draw (reveal + hover redraw)

The five differential icons (`.diff-card__icon svg`) are lucide-style strokes painted with the brand gradient (`stroke: url(#mt-icon-grad)`). Each shape carries `pathLength="1"` and **draws itself in** when the card reveals — staggered off the card's own `--i`:

```css
.diff-card__icon svg :is(path, circle, rect, polyline, line, polygon) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset .95s var(--ease-calm);
  transition-delay: calc(var(--i, 0) * 80ms + 220ms);   /* after the card has risen */
}
.diff-card.is-in .diff-card__icon svg :is(...) { stroke-dashoffset: 0; }

/* hover/focus re-draws the icon — a calm one-shot, not a loop */
.diff-card:hover .diff-card__icon svg :is(...),
.diff-card:focus-within .diff-card__icon svg :is(...) {
  animation: mt-icon-redraw .85s var(--ease-calm) both;   /* dashoffset 1 → 0 */
}
```

**Reduced motion (co-located in § 11):** the icon shapes are pinned `stroke-dashoffset: 0` with `transition: none`, and the hover `animation` is set to `none` — icons appear fully drawn, no draw-in, no redraw.

### Treatment avatars — lift, gradient ring, eixo reveal (home)

The circular `.tav` avatars lift and scale on hover/focus, reveal a masked gradient ring (`.tav__ring::after` opacity `0 → .92`), and fade the eixo label up into place; siblings dim to `.55` to spotlight the hovered one.

```css
.tav__ring { transition: transform .34s var(--ease-calm), box-shadow .34s var(--ease-soft), opacity .3s var(--ease-soft); }
.tav:hover .tav__ring,
.tav:focus-visible .tav__ring { transform: translateY(-8px) scale(1.05); }
.tav__eixo { opacity: 0; transform: translateY(4px); transition: opacity .3s var(--ease-soft), transform .3s var(--ease-calm); }
.tav:hover .tav__eixo, .tav:focus-visible .tav__eixo { opacity: 1; transform: none; }
.treat-avatars:hover .tav:not(:hover) .tav__ring { opacity: .55; }   /* spotlight */
```

`@media (hover: none)` shows the eixo at rest and drops the dim, so touch users get the labels without a hover. **Reduced motion:** the `.tav__ring` lift transform is zeroed and the eixo keeps only an opacity fade (no slide).

### Buttons — brighten / fill, settle on press

The primary CTA brightens its teal glow on hover and gives a small, *non-bouncy* press. Ghost/outline buttons fill with teal (the outline is an `inset` box-shadow, not a `border`, so the fill swap never nudges layout). These are the shipped values (`main.css` § 4):

```css
.btn {
  transition:
    transform .28s var(--ease-calm),
    box-shadow .28s var(--ease-soft),
    background-color .25s var(--ease-soft),
    color .25s var(--ease-soft);
}

/* Primary teal CTA */
.btn--primary {
  background: var(--grad-marca);
  color: #fff;
  box-shadow: 0 12px 30px rgba(5, 127, 127, 0.26);
}
.btn--primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(5, 127, 127, 0.34);   /* glow deepens — no color flip */
}
.btn--primary:active { transform: translateY(-1px); }  /* settle toward rest, not a bounce */

/* Ghost / outline — fills with teal on hover */
.btn--ghost {
  background: transparent;
  color: var(--marca-ink);
  box-shadow: inset 0 0 0 1.5px var(--marca);
}
.btn--ghost:hover {
  background: var(--marca);
  color: #fff;
  transform: translateY(-3px);
  box-shadow: inset 0 0 0 1.5px var(--marca), 0 14px 32px rgba(5, 127, 127, 0.24);
}
```

(There are also `--whatsapp`, `--on-deep` and `--ghost-on-deep` variants for the teal CTA band, all lifting `-3px` on hover.) **Reduced motion (co-located in § 4):** `.btn, .btn:hover { transform: none }` — buttons keep their color/shadow swap but never move.

### Image zoom inside a rounded frame

Treatment photos sit in a rounded `.treat-card__media` frame with `overflow: hidden`; the image scales **1.05** on hover over **.5s**. The frame echoes the brand radius (`--r-lg`).

```css
.treat-card__media { aspect-ratio: 4 / 3; overflow: hidden; }
.treat-card__media img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform .5s var(--ease-calm);
}
.treat-card:hover .treat-card__media img {
  transform: scale(1.05);            /* gentle — never a dramatic zoom */
}
```

**Reduced motion (co-located in § 14):** `.treat-card:hover .treat-card__media img { transform: none }` — the image stays put.

**Reduced motion:** § 0 collapses all of these transitions to instant, so hover simply swaps the end state (deeper shadow, filled button, slightly larger image) with no animation. On top of that, the codebase adds targeted rules so even the *resting state* doesn't shift — the shipped block (`main.css` § 11) is:

```css
@media (prefers-reduced-motion: reduce) {
  .diff-card:hover, .axis-card:hover, .treat-card:hover { transform: none; }
}
```

with the treat-card image (§ 14) and the buttons (§ 4) carrying their own `transform: none` rules. Pattern to follow: any *transform* on hover gets a co-located `transform: none` under reduced-motion.

---

## 7. Método 4D axis cards + icon stroke-draw

The four 4D eixos are **not** a tabbed cross-fade — they are a static `.axes-grid` of four `.axis-card`s (4-across → 2×2 → 1) that each carry the `.reveal` class and a sequential `--i` (`0…3`), so the row **settles in as a staggered cascade** (§ 3) and then rests. Each card holds a serif `.axis-card__num` (01–04) and lifts `-6px` on hover (§ 6). That's the whole motion: a calm reveal, a soft lift. No panel swapping, no carousel.

```html
<div class="axes-grid section__body">
  <article class="axis-card reveal" style="--i:0">…<span class="axis-card__num">01</span>…</article>
  <article class="axis-card reveal" style="--i:1">…<span class="axis-card__num">02</span>…</article>
  <article class="axis-card reveal" style="--i:2">…</article>
  <article class="axis-card reveal" style="--i:3">…</article>
</div>
```

The deeper "draw-in" gesture for this brand lives on the **Diferenciais** icons (§ 6, the gradient stroke-draw) and on the **fio motif** (§ 5) — keep the Método grid restful so those signatures stay special.

**Reduced motion:** § 0 zeroes the reveal transform and delay (cards just appear); the hover lift is killed by the § 11 `transform: none` rule.

> **Legacy count-up (unused).** `countUp()` still lives in `main.js`: a one-shot, observer-fired tick to `data-count` over `1400ms` with an ease-out-cubic, snapping straight to the final value under reduced-motion (and width-locking the box mid-count so Cormorant's proportional figures can't reflow the row). **No current page wires it up** — the stats band it served was removed in favor of the static hero rails (§ 1a). Reach for it only if a future page genuinely needs an animated metric; do not treat it as a default motion.

---

## 8. Comparison comparator (drag-to-reveal)

The before/after comparator (`.ba`) is a **single `--pos` custom property** driving everything. `.ba__img--before` is clipped to that position and `.ba__divider` is parked at it; as `--pos` changes both follow instantly — there is no transition on them, the *finger/cursor is the timing function*. Pure CSS does the wipe; JS only writes the number.

```css
.ba { --pos: 50%; cursor: ew-resize; touch-action: pan-y; }   /* horizontal drags slide; vertical still scrolls */
.ba__img--before { clip-path: inset(0 calc(100% - var(--pos)) 0 0); }
.ba__divider     { left: var(--pos); }
```

### JS — pointer drag + accessible range

Dragging works **anywhere on the image** (pointer events on `.ba`, with `setPointerCapture`), not just on a thumb. An invisible `<input type="range">` rides on top for keyboard/AT control; it's kept in sync and ignores pointer events so it never hijacks the touch drag.

```js
const setFromX = (clientX) => {
  const rect = ba.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  range.value = pct;
  ba.style.setProperty('--pos', pct + '%');
};
ba.addEventListener('pointerdown', (e) => { dragging = true; ba.setPointerCapture?.(e.pointerId); setFromX(e.clientX); });
ba.addEventListener('pointermove', (e) => { if (dragging) setFromX(e.clientX); });
range.addEventListener('input', () => ba.style.setProperty('--pos', range.value + '%'));  // keyboard path
```

**Reduced motion:** nothing to disable — the comparator only moves while the user is actively dragging (or arrowing the range), so there is no autonomous motion to suppress. It's reduced-motion-safe by construction.

---

## 9. Casos + Avaliações carousels (scroll-snap, arrows, cross-fade)

Two horizontal carousels — **Casos** (results gallery) and **Avaliações** (reviews) — share the same calm pattern: a native overflow track with `scroll-snap-type: x proximity`, hidden scrollbars, and a pair of arrows that page by exactly one card. No autoplay (autoplay carousels are explicitly off-brand, § 15).

### Arrow paging (shared logic)

```js
const step = () => {
  const card = track.querySelector('.caso-item');           // (or '.review-item')
  const gap  = parseFloat(getComputedStyle(track).columnGap) || 0;
  return card.getBoundingClientRect().width + gap;          // one card + gap per click
};
const go = (dir) =>
  track.scrollBy({ left: dir * step(), behavior: reduceMotion() ? 'auto' : 'smooth' });
```

Arrows **disable at the ends** — a rAF-coalesced, `passive` scroll handler toggles `prev.disabled` / `next.disabled` from `scrollLeft`. The disabled arrow flattens to `opacity: .4` and `transform: none`; the live one lifts `-2px` and fills teal on hover (`.casos__arrow` / `.reviews__arrow`, transition `transform .26s var(--ease-calm)`).

### Casos cross-fade — image A ↔ B

Each card layers two images. At rest the **second image** sits at `opacity: 0; transform: scale(1.04)`; on hover, focus, or a tap-toggled `.is-revealed`, it cross-fades up (`opacity .55s var(--ease-glide)`, `transform .8s var(--ease-calm)`) while the **first** fades out and the `.caso__media` lifts `-6px`. There is **no state label** on the card (§ Compliance). Touch devices have no hover, so a `.caso__toggle` button flips `.is-revealed` on tap (JS toggles `aria-pressed`).

```css
.caso__img { transition: opacity .55s var(--ease-glide), transform .8s var(--ease-calm); }
.caso__img--b { opacity: 0; transform: scale(1.04); }
.caso__toggle:hover .caso__img--b,
.caso__toggle:focus-visible .caso__img--b,
.caso.is-revealed .caso__img--b { opacity: 1; transform: none; }
```

### `--off` stagger — the casos shelf

Cards carry an `--off` value and drop by `calc(var(--off) * var(--casos-off-step))` (`--casos-off-step: clamp(8px, 1.4vw, 18px)`), so the row sits as a gently uneven shelf rather than a rigid line. This is **static layout offset, not animation** — it just gives the gallery rhythm.

**Reduced motion:** arrow paging falls back to `behavior: 'auto'` (instant jump); the casos cross-fade is flattened (`.caso__img { transition: opacity .001ms }`, `--b { transform: none }`, and the media lift is zeroed) so the A→B swap is clean, with no scale or slide. The § 13 review-card and arrow hover lifts are zeroed too.

---

## 10. Hero video (autoplay, pause, reduced-motion fallback)

The hero background video is **muted, `playsinline`, looping, with a poster and a visible pause/play control.** Under reduced-motion it **does not autoplay** — it shows the poster frame instead. This is the one acceptable autoplay, and only in this exact restrained form.

### HTML

```html
<div class="hero__media parallax">
  <video
    id="hero-video"
    class="hero__video"
    muted loop playsinline preload="metadata"
    poster="imagens/hero-poster.jpg"
    aria-label="Vídeo institucional da clínica">
    <source src="video-hero/video-hero.mp4" type="video/mp4" />
  </video>
</div>
<div class="hero__scrim" aria-hidden="true"></div>

<!-- bottom-LEFT, opposite the WhatsApp float -->
<button class="hero__pause" type="button" data-hero-pause aria-label="Pausar vídeo">
  <svg class="icon-pause" …></svg>
  <svg class="icon-play"  …></svg>   <!-- shown only when .is-paused -->
</button>
```

### CSS

```css
.hero__video { width: 100%; height: 100%; object-fit: cover; }
/* A layered teal-ink scrim keeps white overlay text legible — never a harsh black wash */
.hero__scrim {
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, rgba(4,77,77,.55) 0%, rgba(4,77,77,.30) 40%, rgba(3,64,63,.72) 100%),
    radial-gradient(120% 90% at 18% 70%, rgba(3,64,63,.45), transparent 60%);
}
.hero__pause {
  position: absolute;
  left: clamp(16px, 4vw, 40px); bottom: 24px;   /* opposite corner to the WhatsApp float */
  width: 44px; height: 44px;                     /* ≥44px touch target */
  border-radius: 50%;
  display: grid; place-items: center;
  background: rgba(255,255,255,0.14);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff; cursor: pointer;
  transition: background .2s var(--ease-soft);
}
.hero__pause:hover { background: rgba(255,255,255,0.26); }
.hero__pause .icon-play { display: none; }
.hero__pause.is-paused .icon-pause { display: none; }
.hero__pause.is-paused .icon-play  { display: block; }   /* glyph swap, no JS DOM edit */
```

### JS — reduced-motion-aware autoplay + pause control

The shipped control is `.hero__pause` (`[data-hero-pause]`), sitting **bottom-left** so it never collides with the WhatsApp float bottom-right. The play/pause glyph is two SVGs toggled by `.is-paused` (no JS DOM swap). The handler forces `muted` as a *property* (iOS only honors inline autoplay when both the property and attribute are set) and retries once on `canplay` if the browser blocked the initial `play()`.

```js
const video    = document.getElementById('hero-video');
const pauseBtn = document.querySelector('[data-hero-pause]');

video.muted = true; video.setAttribute('muted', '');   // iOS inline-autoplay requirement
const setPaused = (paused) => {
  pauseBtn.classList.toggle('is-paused', paused);
  pauseBtn.setAttribute('aria-label', paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
};
const tryPlay = () => {
  const p = video.play();
  if (p?.catch) p.then(() => setPaused(false)).catch(() => setPaused(true));
  else setPaused(video.paused);
};

if (reduceMotion()) {
  video.removeAttribute('autoplay'); video.pause(); setPaused(true);   // poster only, opt-in
} else {
  tryPlay();
  video.addEventListener('canplay', () => { if (video.paused) tryPlay(); }, { once: true });
}
pauseBtn.addEventListener('click', () => {
  if (video.paused) { video.muted = true; tryPlay(); }
  else { video.pause(); setPaused(true); }
});
```

Notes: never add `autoplay` for users who prefer reduced motion; never play sound (the video is `muted`); always keep the pause control visible and labelled. The `.hero__scrim` is a layered teal-ink gradient, never hard black (DESIGN.md § 5).

**Reduced motion:** the poster is shown, no autoplay, and the user can opt in via the play button. Fully respected.

---

## 11. Nav — entrance, scrolled-state (`.is-solid`), sliding indicator

The nav is a **floating glass island** (a detached pill, not a full-width bar). Calm chrome motion — short, glide-eased, never flashy.

### Entrance

On load the whole nav drops in once with `nav-drop` (`.85s var(--ease-glide)`):

```css
.nav { animation: nav-drop .85s var(--ease-glide) both; }
@keyframes nav-drop { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .nav { animation: none; } }
```

### Scrolled-state — the glass pill condenses (`.is-solid`)

Past **`scrollY > 60`** JS toggles `.is-solid` (not `is-scrolled`). The glass capsule micro-shrinks (`max-width 1200 → 1090px`), frosts to near-opaque white, takes a soft teal shadow, tightens its padding, shrinks the logo (`42 → 38px`), swaps the light logo for the solid one, and flips the link/indicator colors to ink. The pill's `.nav__inner` carries the transition (`.4s var(--ease-glide)` on background/shadow/border, `.35s` on padding).

```css
.nav.is-solid .nav__inner {
  max-width: 1090px;                                   /* condenses as you scroll */
  background: rgba(255,255,255,0.9);
  box-shadow: 0 16px 42px rgba(5,127,127,0.16), 0 3px 10px rgba(22,48,47,0.06);
  padding-top: 9px; padding-bottom: 9px;
}
.nav.is-solid .nav__logo { height: 38px; }
.nav.is-solid .nav__indicator { background: var(--marca-soft); }   /* glass → soft-teal pill */
```

```js
const nav = document.querySelector('[data-nav]');
if (nav && !nav.classList.contains('nav--solid')) {           // inner pages force --solid, skip
  let navTicking = false;
  window.addEventListener('scroll', () => {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('is-solid', window.scrollY > 60);
      navTicking = false;
    });
  }, { passive: true });
}
```

(Inner pages set `.nav--solid` statically and the script leaves them alone.)

### Sliding indicator — a pill that glides under the links

`.nav__indicator` is a single pill behind the link row that **slides and resizes** to the hovered/focused link, resting under the current page (`[aria-current="page"]`). It's positioned entirely by JS-set CSS vars — `--ind-x` (translateX), `--ind-w` (width), `--ind-o` (opacity) — read from each link's `offsetLeft` / `offsetWidth`.

```css
.nav__indicator {
  position: absolute; top: 0; bottom: 0; left: 0;
  width: var(--ind-w, 0);
  transform: translateX(var(--ind-x, 0));
  opacity: var(--ind-o, 0);
  border-radius: var(--r-pill);
  background: rgba(255,255,255,0.16);
  transition: transform .42s var(--ease-glide), width .42s var(--ease-glide),
              opacity .3s var(--ease-soft), background .4s var(--ease-glide);
}
```

```js
const moveTo = (el) => {
  if (!el) { ind.style.setProperty('--ind-o', '0'); return; }
  ind.style.setProperty('--ind-x', el.offsetLeft + 'px');
  ind.style.setProperty('--ind-w', el.offsetWidth + 'px');
  ind.style.setProperty('--ind-o', '1');
};
const rest = () => moveTo(activeLink());                 // settle under the current page
items.forEach(a => { a.addEventListener('mouseenter', () => moveTo(a)); a.addEventListener('focus', () => moveTo(a)); });
links.addEventListener('mouseleave', rest);
links.addEventListener('focusout', rest);
rest();
// recompute after fonts settle, on load, and on (debounced) resize so widths stay accurate
```

**Reduced motion:** the slide/resize is dropped — the indicator keeps only an opacity fade (`.nav__indicator { transition: opacity .2s var(--ease-soft); }`), so it appears under the active link without travelling. The nav entrance is disabled entirely.

## 12. Mobile drawer, smooth anchor scroll

### Mobile drawer slide

The `.drawer` slides in from the right over **.42s** with `--ease-glide`; the `.nav-scrim` (a teal-ink veil, never pure black) fades in beneath it over `.35s`.

```css
.drawer {
  position: fixed; inset: 0 0 0 auto;
  width: min(86vw, 380px);
  transform: translateX(100%);
  transition: transform .42s var(--ease-glide);
  will-change: transform;
}
.drawer.is-open { transform: none; }

.nav-scrim {
  position: fixed; inset: 0;
  background: rgba(4,77,77,0.32);     /* teal-ink veil, never pure black */
  opacity: 0; visibility: hidden;
  transition: opacity .35s var(--ease-soft), visibility .35s var(--ease-soft);
}
.nav-scrim.is-open { opacity: 1; visibility: visible; }
```

```js
const drawer  = document.querySelector('[data-drawer]');
const scrim   = document.querySelector('[data-drawer-scrim]');
const openBtn = document.querySelector('[data-drawer-open]');
const closeBtn = document.querySelector('[data-drawer-close]');

const setDrawer = (open) => {
  drawer.classList.toggle('is-open', open);
  scrim.classList.toggle('is-open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  openBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';   // lock scroll while open
};
openBtn.addEventListener('click', () => setDrawer(true));
closeBtn?.addEventListener('click', () => setDrawer(false));
scrim.addEventListener('click', () => setDrawer(false));
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setDrawer(false)));  // close on nav
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setDrawer(false); });
```

### Smooth anchor scroll

Native CSS smooth scroll, with the reduced-motion override already handled by § 0 (`scroll-behavior: auto !important`).

```css
html { scroll-behavior: smooth; }
:target, [id] { scroll-margin-top: 96px; }   /* clear the fixed nav */
```

The shipped JS handler intercepts in-page anchors so it can honor the preference explicitly (the drawer closes via its own link handler, above):

```js
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  });
});
```

`[id] { scroll-margin-top: calc(var(--nav-h) + 8px); }` clears the floating nav so targets aren't hidden under it.

**Reduced motion:** § 0 flattens the nav/drawer transitions to instant and forces `html { scroll-behavior: auto }`; the JS anchor handler checks `reduceMotion()` and jumps instead of gliding.

---

## 13. WhatsApp float — entrance, breathe, wiggle, radar rings

The fixed `.wpp` button (bottom-right) is the brand's one permitted set of **idle loops** — kept soft, slow, and instantly killable under reduced-motion. There is no Lottie here; it's all CSS keyframes. Four motions stack:

| Motion | Selector | Keyframe / timing | Character |
|---|---|---|---|
| Entrance | `.wpp` | `wpp-in .8s var(--ease-calm) .7s both` | rises + scales in once, after the page settles |
| Breathe | `.wpp__btn` | `wpp-breathe 3.8s var(--ease-calm) infinite` | shadow swells and relaxes — a slow pulse, **box-shadow only** (no transform) |
| Wiggle | `.wpp__icon` | `wpp-wiggle 5s var(--ease-calm) 2.2s infinite` | the glyph tilts for a beat at the tail of each cycle, then rests |
| Radar rings | `.wpp__rings::before / ::after` | `wpp-ring 3s var(--ease-soft) infinite`, `::after` delayed **1.5s** | two concentric rings expand (`scale 1 → 1.85`) and fade out, staggered |

```css
.wpp__rings::before,
.wpp__rings::after {
  content: ""; position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid rgba(37, 211, 102, 0.55);
  animation: wpp-ring 3s var(--ease-soft) infinite;
}
.wpp__rings::after { animation-delay: 1.5s; }            /* second ring trails the first */
@keyframes wpp-ring { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(1.85); opacity: 0; } }
```

On hover/focus the button lifts and scales (`translateY(-3px) scale(1.05)`) and a label pill expands to the left (`max-width 0 → 260px`). A small unread "pip" (`.wpp__pip`) pops in once via `wpp-pip`.

**Reduced motion:** every loop and the entrance are turned off, and the rings are hidden outright — the co-located block (`main.css` § 7, ~line 608) is:

```css
@media (prefers-reduced-motion: reduce) {
  .wpp, .wpp__btn, .wpp__icon, .wpp__pip { animation: none; }
  .wpp__rings::before, .wpp__rings::after { animation: none; opacity: 0; }
}
```

The button is still there, still tappable — just perfectly still. (The hero scroll cue, `.hero__cue-line`, follows the same rule: `cue-drift 2.6s … infinite` at rest, `animation: none` under reduced-motion.)

---

## 14. Performance rules

| Rule | Why |
|---|---|
| Animate `transform` and `opacity` only for 60fps motion | Other properties trigger layout/paint and stutter |
| `requestAnimationFrame` to coalesce *every* scroll handler (parallax, nav, fio motif, carousel arrow-state) | Multiple scroll events per frame is wasteful |
| `passive: true` on all scroll listeners; debounce `resize` (fio rebuild, indicator reflow) | Don't block the scroll thread; don't thrash on resize |
| `will-change: transform` only on actively animating layers (parallax media, drawer) | Hints the compositor; expensive if left on everywhere |
| One-shot IntersectionObserver: `unobserve` after reveal / stroke-draw fires | Don't keep observing what already fired |
| `loading="lazy"` on every `<img>` past the hero | Treatment art, casos gallery, clinic gallery, etc. |
| `preload="metadata"` (not `auto`) on the hero video; provide a `poster` | The poster carries first paint; full preload is wasteful for a looping ambient video |
| Cap stagger via `--i % 6` on long grids | Prevents a multi-second cascade on big catalogs |
| Stroke-draw (fio motif, diff icons, curve) uses `pathLength="1"` | Dash math stays `0…1` regardless of the path's real length |
| Fio motif is skipped below 1080px / when the gutter is too thin; carousels hide scrollbars but keep keyboard focus | Avoid building/painting SVG where it can't fit; keep snap tracks accessible |

---

## 15. What NOT to do

| Don't | Why it breaks brand | Instead |
|---|---|---|
| Bouncy / spring easings everywhere | Cheapens the calm authority; reads as a kids' app | `--ease-calm` reveals; a tiny non-bouncy lift on hover |
| Fast or large parallax | Disorienting, motion-sickness risk, off-brand | A few percent of slow `translateY`, rAF-driven |
| Hard black drop-shadows on hover | Cold, cut-out, cheap | Soft, low, **teal-tinted** shadows (§6, DESIGN.md §5) |
| State changes longer than 900ms | Feels broken / sluggish | 700–900ms reveals, ≤550ms panels, ~260ms hovers |
| Autoplay the hero video under reduced-motion, or with sound | Removes user control; a health-brand failure | Poster + opt-in play; always muted; visible pause |
| The fio motif on every section, or near the text | Burns the signature; clutters; hurts legibility | One per `data-fio` section, in the free gutter only; auto-hidden when the gutter is too small |
| Strobing, flashing, looping glows | Sensory harm, accessibility violation | The few sanctioned idle loops (WhatsApp, cue line) — all soft and reduced-motion-killed |
| Animating the hero rails or adding a count-up to them | They are deliberately static heritage marks (§ 1a) | Leave them still; the count-up helper is dormant, not a default |
| Autoplaying the casos / reviews carousels | Off-brand; steals control | Arrow-paged, scroll-snap; user drives it |
| Animating 5+ large elements at once | Visual overload, drops frames | One calm motion per section; stagger the rest |
| Forgetting the reduced-motion fallback | Excludes & can harm patients; breaks the contract | Wire § 0 every time, plus a co-located rule for any loop or hover-transform |

When unsure, choose the calmer option. A still, refined, legible page is *always* on-brand for this clinic; a busy or hurried one never is. The premium feel is the unhurried timing.
