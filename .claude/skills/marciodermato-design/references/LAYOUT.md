# LAYOUT.md — Page anatomy, grid & responsive playbook

How the **Dr. Márcio Teixeira** pages are assembled: where padding lives, how the container and grid behave, how the canonical section breathes, how the brand curve separates bands, and exactly which knobs to turn at each breakpoint. The governing instinct is the same as everywhere in this system: **premium = whitespace**. Light grounds only. Teal lives in accents. At most **one** deep-teal full-color band per page (a CTA or the footer). Never cramp; if a layout feels busy, remove an element before you shrink a gap.

Read `DESIGN.md` first for the tokens this file uses verbatim (`--branco`, `--neve`, `--nevoa`, `--areia`, the teal family, `--font-display`/`--font-body`, the radius and shadow scale, the motion tokens). Read `COMPONENTS.md` for the HTML/CSS of the components named here. Read `ANIMATIONS.md` for the curve-draw and reveal motion this file references.

## Table of contents
1. Document scaffold (the page shell)
2. Container & grid system
3. Section anatomy (the canonical rhythm)
4. The brand-curve divider & wash transitions
5. Vertical rhythm, grounds & the one-dark-band rule
6. Z-index scale
7. Full sitemap + per-page section breakdown
   - 7.1 Início (Home)
   - 7.2 Tratamentos
   - 7.3 Método 4D
   - 7.4 Tricologia
   - 7.5 Sobre
   - 7.6 Contato
8. Responsive playbook (per section)
9. Page-shell skeleton (starting template)
10. Sanity checklist before shipping a page

---

## 1. Document scaffold

Every page starts from the same shell. Don't reinvent it per page — the nav, footer and WhatsApp float are global brand surfaces. The full copy-paste template lives in §9; this is the conceptual map.

```
<head>  → meta + theme-color #057f7f + Cormorant Garamond × Poppins + main.css
<body class="is-loading fonts-pending">
        → skip-link
        → <header class="nav" data-nav>     (fixed glass pill: logo + links + AGENDE CTA + burger)
        → <div class="nav-scrim" data-drawer-scrim>   (mobile drawer backdrop)
        → <aside class="drawer" data-drawer>          (mobile nav drawer)
        → <main>
             <section class="hero …">       (home) or <section class="page-head …"> (subpage stub plate)
             <section class="section …">    (alternating --branco / --neve grounds, opt-in data-fio)
             …
             <section class="section section--deep cta-band">   (the ONE deep-teal band)
        → <footer class="footer">           (deep-teal — counts as the page's dark band)
        → <a class="wpp">                   (WhatsApp float, bottom-right)
        → <script src="assets/js/main.js" defer>
```

Rules that never change:
- `lang="pt-BR"` — non-negotiable.
- `theme-color` is the brand teal `#057f7f` so mobile chrome blends.
- The skip-link targets the first focusable section id (`#hero` on home, the first `.section` on subpages).
- The nav is `position: fixed` and floats over content, so the first section needs top breathing room (`padding-top` that clears the pill — see §3).
- The footer is the deep-teal band. If a page also uses a teal CTA band, that's still fine: the footer + one CTA band is the maximum teal flood; no other section goes dark.

---

## 2. Container & grid system

A single container scale and one fluid grid helper carry the whole site. Premium spacing comes from the **gutter** (`clamp(20px, 5vw, 80px)`) — it opens to a generous 80px on wide screens and never falls below a comfortable 20px on phones.

```css
:root {
  --container: 1200px;          /* main content width (1180–1240 band) */
  --container-narrow: 720px;    /* prose / article measure (~68–72 chars) */
  --container-wide: 1320px;     /* two-line serif titles + the diff/hero band */
  --gutter: clamp(20px, 5vw, 80px);
}

.container {
  width: 100%;
  max-width: var(--container);
  margin-inline: auto;
  padding-inline: var(--gutter);
}

/* Text-heavy passages: doctor bio, method intro, mission/vision prose */
.container--narrow { max-width: var(--container-narrow); }

/* Slightly wider for two-line serif titles that want to breathe */
.container--wide { max-width: var(--container-wide); }   /* 1320px */

/* Aligns a section's content to the nav edges (wide cap, slightly tighter gutter).
   Used by Diferenciais so the 5-card row spans the full optical width. */
.container--diff { max-width: var(--container-wide); padding-inline: clamp(20px, 5vw, 56px); }
```

### Grids — the shipped set

A generic auto-fit `.grid` helper exists for future card sections, but the home page deliberately uses **three bespoke grids** instead, each tuned so its row never orphans a card. Reach for the bespoke grid when the section matches; the `.grid` helper is the fallback for new card rows.

```css
/* Generic fallback helper (set --min per use) */
.grid {
  display: grid;
  gap: clamp(20px, 2.4vw, 32px);
  grid-template-columns: repeat(auto-fit, minmax(var(--min, 260px), 1fr));
}
.grid--diff  { --min: 220px; }
.grid--axes  { --min: 250px; }
.grid--treat { --min: 260px; }
```

**Diferenciais — `.diff-grid` (flex, centered wrap).** Five cards, so a flex row keeps the wrapped remainder centered (5-across → 3+2 / 2+2+1 → 1 on small phones) instead of left-aligning an orphan. Each card is `flex: 1 1 196px; min-width: 0; max-width: 340px`; below **520px** cards go full-width.

```css
.diff-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(18px, 1.8vw, 26px); }
.diff-grid .diff-card { flex: 1 1 196px; min-width: 0; max-width: 340px; }
@media (max-width: 520px) { .diff-grid .diff-card { flex-basis: 100%; max-width: none; } }
```

**Método 4D — `.axes-grid` (explicit grid).** Exactly four axis cards: 4-across → **2×2** at ≤1024px → 1 at ≤520px. Explicit columns (not auto-fit) so it always lands 4 / 2×2 / 1, never a 3+1 orphan.

```css
.axes-grid { display: grid; gap: clamp(20px, 2.2vw, 26px); grid-template-columns: repeat(4, 1fr); }
@media (max-width: 1024px) { .axes-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px)  { .axes-grid { grid-template-columns: 1fr; } }
```

**Tratamentos em destaque — `.treat-avatars` (circular avatar group).** Not cards: a centered flex cluster of circular `.tav` links (`width: 138px`, 112px ring), `max-width: 880px`, title always visible, the Método 4D eixo revealed on hover (shown at rest on touch). The full treatment **cards** (`.treat-card` / `.grid--treat`) are reserved for the Tratamentos page, not the home.

### The 12-column helper (for deliberate asymmetric layouts)

When a section needs an intentional split (doctor portrait + bio, contact info + form, hero copy + media), reach for an explicit 12-col grid instead of auto-fit.

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(28px, 4vw, 72px);
  align-items: center;
}
/* common spans */
.col-7 { grid-column: span 7; }
.col-6 { grid-column: span 6; }
.col-5 { grid-column: span 5; }
@media (max-width: 880px) {
  .grid-12 { grid-template-columns: 1fr; gap: clamp(24px, 5vw, 40px); }
  .col-7, .col-6, .col-5 { grid-column: 1 / -1; }
}
```

### Standard breakpoints

Design mobile-first; everything below is a `max-width` query layered on top. The site doesn't use one global tier set — each component breaks where its content stops fitting. These are the **real** anchor widths in `main.css`, smallest concern to largest:

| Breakpoint | Where it fires | Responsibility |
|---|---|---|
| **520px** | `.diff-grid`, `.axes-grid` | Diferenciais cards → full-width; Método 4D axes → single column. |
| **560px** | `.section--casos` track | Casos carousel → `--per: 2.2`; caso meta tag/category stack. |
| **600px** | `.hero` | Hero CTAs stack full-width; rails + scroll cue hide; mobile legibility plate (`.hero::after`). |
| **640px** | `.stats` | Stat separators drop; cells go 2-up. |
| **680px** | `.reviews__track` | Reviews carousel → `--per: 1.12`; review text clamp loosens. |
| **760px** | `.casos__track` | Casos carousel → `--per: 3`. |
| **880px** | `.grid-12`, `.compare`, `.footer` | Splits stack (portrait/media on top via `order: -1`); before/after `.compare` → 1 col; footer → 2 cols. |
| **980px** | `.nav`, `.casos__track` | Nav links + CTA → burger drawer; casos → `--per: 4`. |
| **1024px** | `.axes-grid` | Método 4D axes → 2×2. |
| **1080px** | `.reviews__track` | Reviews carousel → `--per: 2`. |
| **1200px** | `.casos__track`, `.container` cap | Casos → `--per: 5`; container reaches its `1200px` cap, gutter opens toward 80px, full vertical rhythm. |
| **480px** | `.footer` | Footer → single centered column, enlarged logo. |

Per-component carousel column counts (`--per`) and the nav drawer breakpoint (**980px**, not 768px) are the two values most often misremembered — check this table before assuming a 768 tier.

---

## 3. Section anatomy (the canonical rhythm)

Every standard section follows the same calm template. The order is fixed; pieces are optional but never reordered.

```
[ optional curve / wash backdrop (aria-hidden) — faint teal watermark or top wash ]
   eyebrow            (caps teal + short rule)            ← .eyebrow from DESIGN.md
   display title      (Cormorant 600, ONE teal/italic word)
   lede               (Poppins 400, max ~640px)
   content            (grid / split / cards / form / gallery)
   optional section CTA
[ soft curve divider into the next section ]
```

```html
<section class="section section--neve" id="metodo" aria-labelledby="metodo-title">
  <div class="section__curve section__curve--watermark" aria-hidden="true">
    <!-- faint oversized brand curve SVG — see ANIMATIONS.md § Curve draw -->
  </div>

  <div class="container">
    <header class="section__head">
      <p class="eyebrow">
        <span class="eyebrow__rule" aria-hidden="true"></span> Método 4D
      </p>
      <h2 id="metodo-title" class="section__title">
        Avaliação correta, <span class="hl hl--italic">tratamento correto</span>
      </h2>
      <p class="section__lede">
        Esta abordagem exclusiva avalia sua pele em quatro dimensões, para
        tratamentos mais eficazes e personalizados.
      </p>
    </header>

    <div class="grid grid--axes"><!-- the four axis cards --></div>
  </div>

  <div class="section__divider" aria-hidden="true"><!-- soft curve into next band --></div>
</section>
```

### Base section CSS

```css
.section {
  position: relative;
  overflow: clip;                       /* contain the fio motif / wash; clips the lateral strand at the seam */
  isolation: isolate;                   /* scope the backdrop's stacking */
  padding-block: clamp(64px, 9vw, 134px);  /* mobile 64 → desktop ~134 */
  background: var(--branco);            /* default ground */
}

/* Alternating light grounds — never two of the same adjacent */
.section--branco { background: var(--branco); }   /* #ffffff   pure white   */
.section--neve   { background: var(--neve); }     /* #f4f9f9   clinical cool off-white (primary alternate) */
.section--nevoa  { background: var(--nevoa); }    /* #eaf3f3   deeper teal-grey wash (occasional)          */
.section--areia  { background: var(--areia); }    /* #e9ded2   warm sand — beauty/results side only        */

/* The ONE optional deep-teal band per page (CTA). Footer is the other teal flood. */
.section--deep {
  background: var(--grad-deep);         /* linear-gradient(160deg,#057f7f,#03403f) */
  color: var(--neve);
}

/* Casos carousel band — a light teal-green wash, still inside the
   brand family (NOT a deep flood). Its own padding + a slight card-offset step. */
.section--casos {
  --casos-off-step: clamp(8px, 1.4vw, 18px);
  padding-block: clamp(72px, 9vw, 130px);
  background: linear-gradient(180deg, #ecf6f1 0%, #dcefe7 100%);
}

.section__head {
  max-width: 720px;
  margin: 0 auto clamp(40px, 6vw, 64px);
  text-align: center;
}
.section__head--left { margin-inline: 0; text-align: left; }   /* content / split sections */
.section__head--wide { max-width: 940px; }                     /* two-line serif titles     */

.section__title {
  margin: 14px 0 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(34px, 5.4vw, 68px);
  line-height: 1.06;
  letter-spacing: 0.005em;
  color: var(--tinta);
  text-wrap: balance;
}
.hl { color: var(--marca-ink); }
.hl--italic { font-style: italic; font-weight: 500; color: var(--marca-ink); }

.section__lede {
  max-width: 640px;
  margin: 16px auto 0;
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(17px, 1.5vw, 20px);
  line-height: 1.7;
  color: var(--tinta-muted);
}
.section__head--left .section__lede { margin-inline: 0; }
```

The head is **centered by default** (marketing sections); add `--head--left` for content/split sections (bio, contact). One teal/italic word per title — never two highlights. The lede stays under ~640px so the measure never runs long.

---

## 4. The brand-curve divider & wash transitions

This brand never slashes the page with a heavy grey 1px rule. Sections separate three ways, in order of preference: **whitespace**, a **faint wash transition**, and the **sinuous brand curve** (the one ownable graphic, extracted from the mark's white curve).

### a) The curve divider (signature separator)

Drop the brand's sinuous curve as a low, wide SVG between two bands. Its fill is the **next** section's ground so the eye glides across the seam. The draw-in animation lives in `ANIMATIONS.md § Curve draw`; here it's a static separator.

```html
<div class="section__divider" aria-hidden="true">
  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" width="100%" height="120">
    <path d="M0,64 C320,8 560,112 760,72 C980,28 1180,96 1440,52 L1440,120 L0,120 Z"
          fill="var(--neve)"/>   <!-- = the next section's background -->
  </svg>
</div>
```

```css
.section__divider {
  position: absolute;
  left: 0; right: 0; bottom: -1px;     /* -1 kills sub-pixel seam */
  line-height: 0;
  pointer-events: none;
  z-index: 1;
}
.section__divider svg { display: block; width: 100%; height: clamp(60px, 8vw, 120px); }
```

### b) The faint curve watermark (atmosphere)

An oversized, very low-opacity teal curve sitting behind a section's content — the brand's quiet texture. Never above ~0.06 opacity; it must whisper.

```css
.section__curve--watermark {
  position: absolute;
  inset: auto -8% -6% auto;            /* anchor bottom-right, bleed off-canvas */
  width: min(680px, 60vw);
  color: var(--marca);
  opacity: 0.05;
  z-index: 0;
  pointer-events: none;
}
.section__curve--watermark svg { width: 100%; height: auto; }
```

### c) The wash transition (simplest, cheapest)

When two adjacent sections share a near-tone (white → neve), a soft vertical gradient at the seam is enough — no SVG needed.

```css
.section--wash-top::before {
  content: "";
  position: absolute; inset: 0 0 auto 0; height: 120px;
  background: linear-gradient(180deg, var(--neve) 0%, transparent 100%);
  z-index: 0; pointer-events: none;
}
```

Rules: only **one** divider device per seam (don't stack a curve and a wash). Keep all of them `aria-hidden`. Never a `border-top: 1px solid grey`. If unsure, just let whitespace do the work.

### d) The lateral fio-de-cabelo motif (layout-level concern) — `data-fio`

The ownable brand graphic on the home is the **fio de cabelo** (the hair-strand curve drawn from the logo). It is **not** a seam divider — it lives in the **free lateral gutter** of a section, running vertically alongside the content, and is **generated by `main.js`**, not authored in markup. A section opts in by adding a `data-fio` attribute whose value picks the side:

```html
<section class="section section--branco" id="resultados" data-fio="left">  …
<section class="section section--branco" id="metodo"     data-fio="right"> …
```

How it behaves (verified in `main.js` + `main.css`):
- `main.js` reads every `[data-fio]`, injects a full-bleed `<svg class="fio-sec">` and draws a sine-wave strand in the side gutter — `gutter * 0.5` from the page edge (`left` or `right` per the attribute). It sits at `--z-base` (behind content, above the ground).
- The section's `overflow: clip` makes the strand **touch and vanish exactly at the band's top/bottom edge**, so it reads as one strand per section, not a continuous line.
- It only goes on **light** sections (the teal/`--deep` bands carry no fio).
- **Sides alternate down the page.** Real placement on the home: `resultados=left` → `metodo=right` → `dr-marcio=right` → `avaliacoes=left`. (Diferenciais, casos and treatments carry no `data-fio`.)
- `.fio-sec__main` is the calm strand (`opacity: 0.5`); `.fio-sec__sheen` is a soft scroll-driven highlight, suppressed under `prefers-reduced-motion`.

Layout takeaway: treat `data-fio` as a per-section flag, keep the gutter free enough for the strand to live there, and **alternate the side** vs. the previous fio section so the motif zig-zags down the page rather than hugging one edge.

---

## 5. Vertical rhythm, grounds & the one-dark-band rule

### Section padding ladder (responsive)

| Context | Mobile (≤390) | Tablet | Desktop (≥1280) |
|---|---|---|---|
| Standard section | 64px | ~88px | `clamp` → ~134px |
| Carousel band (casos / reviews) | 72px | ~96px | `clamp` → ~130px |
| Hero | `min-height: 100svh` | `100svh` | `100svh` |
| CTA band | follows standard | follows standard | follows standard |

The base rule `padding-block: clamp(64px, 9vw, 134px)` covers most sections automatically; the two carousel bands use `clamp(72px, 9vw, 130px)`, and the hero overrides with `min-height: 100svh`.

### Max content widths

| Content | Width |
|---|---|
| Section content (grids, splits) | `--container` (1200px) |
| Prose (bio, method intro, mission/vision) | `--container-narrow` (720px) |
| Section head + lede | 720px head / 640px lede |
| Hero copy column | ~560px |

### When to use which ground

- **`--branco` (#ffffff):** the default. Hero copy zones, most content sections, the doctor portrait split.
- **`--neve` (#f4f9f9):** the primary "breathing" alternate. Use it to set a section apart from white neighbors — differentials, the Método 4D summary, treatments index. This is the workhorse off-white.
- **`--nevoa` (#eaf3f3):** the deeper teal-grey wash. Use **occasionally** for a slightly more grounded band (stats strip, a nested info plate) — not every other section, or the rhythm muddies.
- **`--areia` (#e9ded2):** the warm sand, reserved for the **beauty/results** side. A single sand-warmed band is the right move for a "resultados naturais" moment, a testimonial strip, or the warmth behind a beauty-leaning gallery. Pair its shadows with the sand tint (`rgba(205,182,162,0.18)`), not teal. Use it at most once or twice per site — it's an accent ground, not an alternate.

### The one-dark-band rule

**At most one deep-teal full-color band per page, plus the footer.** The CTA band (`.section--deep` / `--grad-deep`, `#agende` on the home) is that band. The footer is always deep-teal and counts as the page's other teal flood. No third dark section. The `.section--casos` carousel ground is a **light teal-green wash**, not a dark flood, so it doesn't break the rule. Everything else keeps teal **in cards and accents on a light ground**. The real alternation on the home reads:

```
white → white → neve → white → casos(teal-green wash) → white → neve → white → DEEP-TEAL CTA → DEEP-TEAL footer
```

(`--nevoa` and `--areia` exist as tokens and are options for subpages — e.g. a sand-warmed gallery on Sobre — but the home body flow uses only `--branco`, `--neve`, the casos wash, and the single deep CTA.) Never two identical grounds back-to-back where it muddies the rhythm; never a dark section in the body flow except the single CTA.

---

## 6. Z-index scale

Standardize the stack site-wide. Never reach for arbitrary `999`. Combine with `isolation: isolate` on section ancestors so per-section atmosphere (curve watermark, wash) never leaks across siblings.

```css
:root {
  --z-base:    0;    /* section atmosphere: curve watermark, wash, washes      */
  --z-content: 2;    /* section head, content, footer-of-section               */
  --z-divider: 1;    /* curve divider sitting between bands                    */
  --z-float:   60;   /* WhatsApp float                                         */
  --z-nav:     100;  /* fixed glass nav pill                                   */
  --z-scrim:   110;  /* mobile drawer backdrop / scrim                         */
  --z-drawer:  120;  /* mobile nav drawer                                      */
  --z-lightbox:200;  /* Nosso Espaço gallery lightbox (top of everything)      */
}
```

| Layer | z-index | Notes |
|---|---|---|
| Section atmosphere | 0 | Curve watermark, washes — `pointer-events: none`. |
| Curve divider | 1 | Between bands; below content. |
| Section content | 2 | Head, grids, forms. |
| WhatsApp float | 60 | Above content, below nav so the drawer can cover it. |
| Nav pill | 100 | Fixed; gains a solid/blurred state on scroll. |
| Drawer scrim | 110 | Dims the page behind the open mobile drawer. |
| Mobile drawer | 120 | Slides over the scrim. |
| Gallery lightbox | 200 | The clinic-photo lightbox; sits above the nav. |

---

## 7. Full sitemap + per-page section breakdown

Five pages, mirroring the live architecture. Global on every page: the glass nav, the WhatsApp float, the deep-teal footer with credentials. Component names in **bold** map to `COMPONENTS.md`. Copy is the real, verified content from `README.md` — use it verbatim (no em dashes; commas/`·`).

| Page | URL | Menu | Lead accent |
|---|---|---|---|
| Início | `/` | Início | teal, multi-section |
| Tratamentos | `/tratamentos/` | Tratamentos | teal, the 4 eixos |
| Método 4D | `/metodo-4d/` | Método 4D | teal, the 4 eixos deep |
| Tricologia | `/tricologia/` | Tricologia | **NEW** · teal, capilar (hair) + results gallery |
| Sobre | `/sobre/` | Sobre | teal + one sand-warmed gallery |
| Contato | `/contato/` | Contato | teal, info + form |

Nav (verbatim in markup): `Início · Tratamentos · Método 4D · Tricologia · Sobre · Contato`. Recurring CTAs: **Agende sua consulta** (primary → WhatsApp `(51) 99970-4848`), **Conheça o Método 4D**, **Download E-book Método 4D**, **Atendimento WhatsApp**.

> **Build status (verify before extending a subpage).** Only **Início** (`index.html`) is fully built. **Tratamentos, Método 4D, Tricologia, Sobre and Contato are currently stubs** — each renders a single `.page-head` plate (eyebrow + `section__title` + lede + a "Conteúdo em breve" badge) inside `<main>`, plus the global footer + WhatsApp float. The per-page section tables in §7.2–§7.6 below are the **target architecture** (content confirmed from `README.md`) to build into those stubs, not the current DOM. When you flesh out a subpage, follow the home's real patterns: bespoke grids (§2), the `data-fio` motif on light sections (§4d), and the breakpoints in §2.

---

### 7.1 Início (Home)

This is the **real, current** order and markup in `index.html`. The old "Números / Stats" band was **removed** (it's commented out, `<!-- NÚMEROS -->`, between the reviews and the CTA) — the `.stats` CSS still exists but the home no longer renders it. Section ids and modifiers below are verbatim from the markup.

| # | id | Section | Ground (modifier) | data-fio | Component | Real content |
|---|---|---|---|---|---|---|
| 1 | `#hero` | **Hero** (video) | dark video + teal scrim (`.hero`, `--grad-deep` base) | — | **video hero** | Eyebrow: "Dermatologia, estética e tricologia · Porto Alegre". Título: "Dermatologia de excelência para a saúde e *beleza da sua pele*". Lede: "Dr. Márcio Teixeira: cuidado personalizado e resultados naturais com quem entende profundamente de pele, com excelência desde 1993." CTAs: `Agende sua consulta` (WhatsApp) · `Conheça o Método 4D`. Mídia `video-hero/video-hero.mp4` (muted, loop, playsinline, autoplay). **Lateral heritage rails** (`.hero__rail--left` "+30 anos de excelência" · `.hero__rail--right` "Desde 1993"), a scroll cue (`.hero__cue`), and a **bottom-left** play/pause control (`.hero__pause`, opposite the WhatsApp float). |
| 2 | `#resultados` | **Resultados** (two-image drag comparator) | `--branco` | **left** | **comparator** (`.compare` split + `.ba` drag comparator) | Eyebrow "Resultados reais". Title: "Veja a diferença que o cuidado *certo* faz". Drag the divider to compare `home-a.jpg` / `home-b.jpg`. Note: "Resultado real de paciente da clínica. Imagens exibidas com consentimento." |
| 3 | `#diferenciais` | **Diferenciais** (5 cards) | `--neve` | — | **differentials** (`.diff-grid`, `.container--diff`) | Eyebrow "Por que Dr. Márcio". Title: "Ciência e empatia a serviço da *sua pele*". Five cards: **Experiência** · **Atendimento Humanizado** · **Método 4D Exclusivo** · **Tecnologia de Ponta** · **Resultados Naturais** (each with a brand-gradient line icon that draws in on reveal). |
| 4 | `#metodo` | **Método 4D** (4 axes) | `--branco` | **right** | **axis cards** (`.axes-grid`) | Eyebrow "Método 4D". Title: "Avaliação correta, *tratamento correto*". Lede about the four dimensions. Cards **01 A Superfície da Pele** · **02 Linhas de Expressão** · **03 Alterações do Volume da Face** · **04 Flacidez**. CTA: `Conheça o Método 4D` → metodo-4d.html. |
| 5 | `#casos` | **Casos** (full-bleed carousel) | `.section--casos` (light teal-green wash) | — | **casos carousel** (`.casos__viewport` / `.casos__track`, full-bleed) | Eyebrow "Resultados". Title: "Resultados que *falam por si*". Hint: "Passe o cursor sobre a foto, ou toque nela, para ver o resultado." Prev/next arrows; horizontal scroll-snap track of `.caso` cards (hover/tap cross-fades to the second image), each with a category chip (Tratamento Capilar · Preenchimento Labial · Laser CO₂ · Liftera). Cards carry a small `--off` vertical-offset for a staggered rhythm. |
| 6 | `#dr-marcio` | **Dr. Márcio teaser** | `--branco` (split) | **right** | **doctor/about block** (`.grid-12`: portrait `.col-5` + copy `.col-7`) | Portrait `imagens/sobre.jpg`. Eyebrow "Dr. Márcio Teixeira". Title: "Cuidar da pele é minha *vocação*". Bio (UFRGS, residência no HCPA, membro titular SBD, criador do Método 4D). Chips: CREMERS 20214 · RQE 10858 · RQE 12078 · SBD Membro titular. Pull-quote "Valorizar sua beleza natural é minha missão." CTA "Conheça o Dr. Márcio" → sobre.html. |
| 7 | `#tratamentos` | **Tratamentos em destaque** (avatar group) | `--neve` | — | **treatment avatars** (`.treat-avatars` / `.tav`) | Eyebrow "Tratamentos". Title: "Cuidados *sob medida* para a sua pele". Lede: "Uma seleção de tratamentos faciais, organizados pelos quatro eixos do Método 4D." Ten circular avatars (Skinbooster · Laserterapia · LIP · Peelings Químicos · Toxina Botulínica · Ácido Hialurônico · Bioestimuladores · Harmonização Facial · Ultrassom Liftera · Radiofrequência · Fios de Sustentação), each tagged with its eixo (revealed on hover) and linking to tratamentos.html. CTA: "Ver todos os tratamentos". |
| 8 | `#avaliacoes` | **Avaliações** (Google reviews carousel) | `--branco` (`.reviews`) | **left** | **reviews carousel** (`.reviews__viewport` / `.reviews__track`, boxed full-bleed) | Eyebrow "Avaliações". Title: "Quem é cuidado *recomenda*". Google rating chip (**4,9** · 216 avaliações, real Google "G" mark + gold stars) linking to the Google review page. Prev/next arrows; horizontal scroll-snap track of `.review-card` (real patient quotes from Google, initials avatar + name + "Avaliação no Google"). Footer link "Ver todas no Google". |
| 9 | `#agende` | **CTA band** (appointment) | `--section--deep` (the ONE dark band) | — | **appointment CTA** (`.cta-band`) | White logo `logo/logo-header-branco.png`. Title (white): "Pronto para cuidar da sua pele *com quem entende*?" Lede: "Agende sua consulta da forma mais prática para você." Buttons: `Agende sua consulta` (`.btn--on-deep`) · `Atendimento WhatsApp` (`.btn--ghost-on-deep`). |
| — | — | **Footer** | deep-teal | — | **footer** | See §7-global footer block below. |
| — | — | **WhatsApp float** | — | — | **wpp float** | `.wpp` fixed bottom-right (breathing + radar rings + hover-reveal label "Agende pelo WhatsApp"). |

Ground alternation across the home: `branco → neve → branco → casos(teal-green wash) → branco → neve → branco → DEEP-TEAL CTA → DEEP-TEAL footer`. The fio motif alternates **left → right → right → left** across `resultados / metodo / dr-marcio / avaliacoes`.

---

### 7.2 Tratamentos

| # | Section | Ground | Component | Real content |
|---|---|---|---|---|
| 1 | **Hero / intro** | `--branco` slim plate | **section head plate** (no video) | Eyebrow "Tratamentos". Title: "Cansado(a) dos *mesmos resultados*?" Lede: "O segredo é a avaliação correta, para o tratamento correto." (Optional support image `imagens/metodo4d-sobre*.jpg`.) |
| 2 | **Axis filter** | `--neve` (sticky strip) | **axis filter** (chips → filters `.treat-card[data-eixo]`) | Filter chips: "Todos" · "Eixo 1 · Superfície" · "Eixo 2 · Linhas de Expressão" · "Eixo 3 · Volume da Face" · "Eixo 4 · Flacidez". Filtering behavior in `INTERACTIONS.md`. |
| 3 | **Eixo 1 — A Superfície da Pele** | `--branco` | **treatment cards** (`.grid--treat`) | Subhead "Eixo 1 · A Superfície da Pele". Cards: Skincare Personalizado (Home Care) `skincare-personalizado.png` · Skincare Via Oral `skincare-oral.png` · Terapia Fotodinâmica · Laserterapia e Luz Intensa Pulsada (LIP) `laserterapia.png` · Skinbooster `skinnbooster.png` · MMP com DNA de Salmão e Exossomas `mmp.png`. |
| 4 | **Eixo 2 — Linhas de Expressão** | `--neve` | **treatment cards** | Subhead "Eixo 2 · Linhas de Expressão". Cards: Toxina Botulínica `toxina-butolinica.png` · Preenchimento com Ácido Hialurônico `preenchimento-acido-hialuronico.png` · Bioestimuladores de Colágeno `bioestimulador-colageno.png` · Skinbooster · Tecnologias de Apoio `tecnologia-de-apoio.png`. |
| 5 | **Eixo 3 — Alterações do Volume da Face** | `--branco` | **treatment cards** | Subhead "Eixo 3 · Alterações do Volume da Face". Cards: Preenchedores à Base de Ácido Hialurônico `preenchedores-acido-hialuronico.png` · Bioestimuladores de Colágeno · Redução de Gordura Localizada (Lipo Facial Clínica) `lipo-facical.png` · Harmonização Facial Integrada `harmonizacao-facial.png`. |
| 6 | **Eixo 4 — Flacidez** | `--neve` | **treatment cards** | Subhead "Eixo 4 · Flacidez". Cards: Bioestimuladores de Colágeno · Ultrassom Microfocado: Liftera `ultrassom-microfocado.png` · Radiofrequência `radiofrequencia.png` · Fios de Sustentação (PDO) `fios-de-pdo.png` · Tecnologias Complementares e Skincare `tecnologias-complementares.png`. (Optional, "avaliar inclusão": Peelings Químicos `peelings-quimicos.png`, Photo Aging `photo-aging.png`.) |
| 7 | **CTA band** | `--section--deep` | **appointment CTA** | "Cada pele pede um *plano próprio*. Vamos montar o seu?" Buttons: `AGENDE SUA CONSULTA` · `CONHEÇA O MÉTODO 4D`. |
| 8 | **Footer** | deep-teal | **footer** | Global. |

> **Resultados — opcional.** Há material fotográfico real de pacientes em `antes-depois/` (pasta-fonte, fora do deploy): `laser-CO2/` (7 img, Eixo 1), `Liftera/` (5 img + 2 vídeos, Eixo 4), `Preenchimento labial/` (11 img + 4 vídeos, Eixo 3). Pode virar uma galeria de resultados por eixo (comparador de duas imagens + lightbox, ver `INTERACTIONS.md`) ou cards de prova social. **Sem rótulos "antes"/"depois"** (ver § Compliance). Curar, otimizar para web, converter `.mov` → `.mp4`, e confirmar consentimento de imagem dos pacientes.

---

### 7.3 Método 4D

| # | Section | Ground | Component | Real content |
|---|---|---|---|---|
| 1 | **Hero** | `--branco` plate (curve watermark) | **section head plate** | Eyebrow "Método 4D · exclusivo do Dr. Márcio". Title: "Cansado dos mesmos resultados? O segredo é a *avaliação correta*, para o tratamento correto." |
| 2 | **Method intro** | `--neve` | **prose** (`.container--narrow`) | "Esta abordagem inovadora avalia a pele em toda a sua complexidade, dividindo os problemas e os tratamentos em quatro eixos principais e complementares." Optional support image `imagens/metodo4d-sobre*.jpg`. |
| 3 | **Axis switcher** (4 axes deep) | `--branco` | **axis switcher / tabs** (desktop tabs → mobile accordion) | Tab rail of the 4 eixos; each panel shows the alterations it assesses: **Eixo 1 · A Superfície da Pele** — tipo de pele; textura e poros dilatados; manchas; perda de luminosidade; sensibilidade (img `superficie-da-pele.png`). **Eixo 2 · Linhas de Expressão** — linhas dinâmicas; linhas estáticas; sulcos; expressões marcadas (`linhas-de-expressao.png`). **Eixo 3 · Alterações do Volume da Face** — perda de volume; excesso/deslocamento; desproporções; perda de definição (`volumes-da-face.png`). **Eixo 4 · Flacidez** — flacidez cutânea; flacidez muscular; jowls; excesso de pele (`flacidez.png`). Cross-fade per `INTERACTIONS.md`. |
| 4 | **E-book CTA** | `--areia` (warm) or `--nevoa` | **inline CTA card** | Title: "Entenda o Método 4D em profundidade." Button: `Download E-book Método 4D`. |
| 5 | **Appointment CTA band** | `--section--deep` | **appointment CTA** | "Quer saber qual eixo a *sua pele* pede primeiro?" Button: `AGENDE SUA CONSULTA`. |
| 6 | **Footer** | deep-teal | **footer** | Global. |

> One dark band only: the appointment CTA. The e-book CTA stays on a light/warm ground (a card with the teal button), not a second teal flood.

---

### 7.4 Tricologia (NEW page)

The doctor is **Dermatologista & Tricologista** (per the brandbook), so the hair/scalp specialty gets its own page. It did **not** exist on the old site, so the copy below is a recommended scaffold to confirm with the client, not extracted ground truth. Keep it on-brand: same teal + serif + whitespace, same section rhythm. Real patient photo material exists in `antes-depois/Cabelos/` (source folder, excluded from deploy — 14 images).

| # | Section | Ground | Component | Content (scaffold, confirm with client) |
|---|---|---|---|---|
| 1 | **Hero** | `--branco` plate (curve watermark) | **section head plate** | Eyebrow "Tricologia". Title: "Saúde e força para os seus *cabelos*." Lede: "Diagnóstico e tratamento de queda, calvície e saúde do couro cabeludo, com a mesma precisão do Método 4D." CTA `AGENDE SUA CONSULTA`. (Optional support image: a curated frame from `antes-depois/Cabelos/`.) |
| 2 | **O que é tricologia** | `--neve` | **prose** (`.container--narrow`) | Plain, calm explainer: a tricologia é a área da dermatologia dedicada aos cabelos e ao couro cabeludo. Quando procurar, o que esperar da avaliação. |
| 3 | **Principais queixas** | `--branco` | **differentials/icon grid** (`.grid--diff`) | Cards: Queda capilar · Calvície (alopecia androgenética) · Alopecia areata · Caspa e dermatite seborreica · Saúde do couro cabeludo · Fios fracos e quebradiços. (Confirmar lista com o cliente; ícones de linha teal.) |
| 4 | **Tratamentos capilares** | `--neve` | **treatment cards** (`.grid--treat`, `data-eixo="capilar"`) | Cards a definir com o cliente. Exemplos comuns em tricologia: Microagulhamento capilar (MMP) · Mesoterapia / intradermoterapia · Minoxidil e terapias tópicas/orais · Laserterapia capilar · Bioestimulação do couro cabeludo. (Sem arte dedicada ainda em `/imagens`, avaliar produção.) |
| 5 | **Resultados reais** | `--areia` (warm) | **gallery** (`.grid--gallery` → lightbox) | Eyebrow "Resultados reais". Galeria a partir de `antes-depois/Cabelos/` (14 imagens). Curar os melhores pares, otimizar para web, e confirmar consentimento de imagem dos pacientes. Rótulo neutro ("Resultado") — nunca "antes"/"depois" (§ Compliance). |
| 6 | **Appointment CTA band** | `--section--deep` | **appointment CTA** | "Recupere a confiança nos seus cabelos." Button: `AGENDE SUA CONSULTA`. |
| 7 | **Footer** | deep-teal | **footer** | Global. |

---

### 7.5 Sobre

| # | Section | Ground | Component | Real content |
|---|---|---|---|---|
| 1 | **Hero** | `--branco` plate | **section head plate** | Eyebrow "Sobre". Title: "Cuidar da pele é minha *vocação*. Valorizar sua beleza natural é minha missão." Welcome lede: "Bem-vindo à Clínica Dr. Márcio Teixeira, um espaço onde ciência, tecnologia e empatia se unem para oferecer o que há de melhor em dermatologia clínica, estética e cirúrgica." |
| 2 | **Doctor bio + credentials + quote** | `--branco` (split) | **doctor/about block** (`.grid-12`: `sobre.jpg`/`sobre2.jpg` `col-5` + copy `col-7`) | Credentials line: "Dermatologista – CREMERS 20214 · RQE 10858 (Clínica Médica) | RQE 12078 (Dermatologia)". Bio: "Com quase 30 anos de trajetória, Dr. Márcio é reconhecido por sua dedicação à dermatologia clínica, estética e cirúrgica. Formado pela UFRGS e com residência médica no Hospital de Clínicas de Porto Alegre, é membro titular da Sociedade Brasileira de Dermatologia e atua também como palestrante e co-investigador em pesquisas clínicas. Sua atuação é marcada pela busca por resultados naturais e seguros, com foco no atendimento personalizado e no respeito à individualidade de cada paciente. Além disso, é o criador do exclusivo Método 4D, que revoluciona a forma de avaliar e tratar a pele, considerando não apenas a superfície, mas também linhas de expressão, volume e flacidez." Pull-quote: "Acredito que a dermatologia deve valorizar a beleza única de cada indivíduo, promovendo saúde, autoestima e confiança em todas as fases da vida." |
| 3 | **Nosso Espaço** (gallery) | `--areia` (warm) | **clinic gallery** (`.grid--gallery` → lightbox) | Eyebrow "Nosso Espaço". Title: "Conheça a *Dermaclin*." Gallery of `ambiente/dermaclin1.jpg … dermaclin15.jpg`. Lightbox per `INTERACTIONS.md`. The sand ground warms the beauty/space moment; sand-tinted shadows. |
| 4 | **Missão / Visão / Valores** | `--neve` | **values grid** (3-col, then list) | Eyebrow "Valores Inegociáveis". **Missão:** "Promover a saúde e a beleza da pele com excelência técnica, atendimento humanizado e resultados naturais, respeitando sempre a individualidade de cada paciente." **Visão:** "Ser referência em dermatologia personalizada, unindo conhecimento científico, tecnologia de ponta e um olhar empático para transformar vidas por meio do cuidado com a pele." **Valores:** Transparência em cada orientação · Inovação constante em técnicas e tratamentos · Ética e respeito à individualidade · Gentileza como base do atendimento · Excelência como hábito diário. |
| 5 | **CTA band** | `--section--deep` | **appointment CTA** | "Será um prazer cuidar da *sua pele*." Button: `AGENDE SUA CONSULTA`. |
| 6 | **Footer** | deep-teal | **footer** | Global. |

---

### 7.6 Contato

| # | Section | Ground | Component | Real content |
|---|---|---|---|---|
| 1 | **Header** | `--branco` plate | **section head plate** | Title: "Fale Conosco". Lede: "Estamos à disposição para tirar dúvidas, orientar sobre tratamentos e agendar sua consulta da forma mais prática para você." |
| 2 | **Contact info + form** | `--neve` (split) | **contact rows** + **contact form** (`.grid-12`: info `col-5` + form `col-7`) | **Info column** (contact rows): Endereço — "Av. Dr. Nilo Peçanha, 1221/602, Porto Alegre/RS" · Horário — "Seg à Sex: 09h às 19h · Sáb: Fechado" · WhatsApp — "(51) 99970-4848" · Telefone — "(51) 3110-4110" · E-mail — "secretaria@dermaclin.poa.br" · social: Instagram @dr.marciodermato, Facebook dr.marciodermato. **Form column** ("Fale Conosco"): nome, e-mail, telefone, mensagem; submit button "Enviar". Real `<label>` per field, visible focus. |
| 3 | **Map** | `--branco` | **map embed** | Google Maps embed of Av. Dr. Nilo Peçanha, 1221/602. "Google Maps / Avaliações" link. Rounded `--r-lg` frame. |
| 4 | **WhatsApp CTA band** | `--section--deep` | **appointment CTA** | "Prefere conversar agora? *Chame no WhatsApp.*" Buttons: `ATENDIMENTO WHATSAPP` · `Agende Sua Consulta`. |
| 5 | **Footer** | deep-teal | **footer** | Global. |

---

### Global footer (every page)

Deep-teal band (`--grad-deep`), white logo `logo/logo-rodape.png`. Columns: brand + tagline ("Seu dermatologista de confiança em Porto Alegre, excelência desde 1993.") · nav links (Início · Tratamentos · Método 4D · Tricologia · Sobre · Contato) · contato (endereço, horário Seg–Sex 09–19h, (51) 99970-4848, (51) 3110-4110, secretaria@dermaclin.poa.br) · social (Instagram, Facebook, WhatsApp). Credentials line: "CREMERS 20214 · RQE 10858 | 12078 · membro titular da Sociedade Brasileira de Dermatologia". Bottom bar: "Dr. Márcio Teixeira © Todos Direitos Reservados" · "Desenvolvido por: Freela In Home".

---

## 8. Responsive playbook (per section)

Design mobile-first. Below: how each major section reflows from phone to desktop. Mobile column counts default to **1**; grids open up with `auto-fit` and the `--min` floors from §2.

### Nav (≤980px)
At **980px** both the links **and** the inline AGENDE CTA hide, and the burger (`.nav__burger`) appears — the full nav (links + CTA) lives only in the drawer below this width. The glass pill keeps just logo + burger and tightens its padding. Scrim + drawer use the z-scale from §6. (There is no icon-only circle-CTA variant; the AGENDE button simply moves into the drawer.)

```css
@media (max-width: 980px) {
  .nav__links,
  .nav__cta { display: none; }
  .nav__burger { display: flex; margin-left: auto; }
  .nav__inner { padding: 8px 8px 8px 20px; gap: 12px; }
}
```

### Hero (video)
Desktop: full-bleed video at `min-height: 100svh`, copy left-anchored (`.hero__copy` max ~940px, title clamps to 17ch), both CTAs inline, **lateral rails** flanking the content, scroll cue centered at the bottom, play/pause bottom-left. The rails sit on a fixed `--rail-gutter: 30px` and the content reserves `--hero-px` so the title never overlaps them. At **600px** everything narrow-screen kicks in: CTAs stack full-width, the **rails and scroll cue hide** (they'd clip off-canvas / collide with the stacked buttons), `--hero-px` tightens, and a bottom legibility plate (`.hero::after`) deepens the scrim so the white serif title reads over the video.

```css
.hero__title { font-size: clamp(40px, 6vw, 84px); }   /* floors ~40px */
@media (max-width: 600px) {
  .hero__actions { flex-direction: column; align-items: stretch; }
  .hero__actions .btn { width: 100%; }
  .hero__rail { display: none; }
  .hero__cue { display: none; }
  .hero { --hero-px: clamp(20px, 5vw, 28px); }
  .hero::after {           /* legibility plate */
    content: ""; position: absolute; inset: auto 0 0 0; height: 56vh; z-index: 0;
    background: linear-gradient(180deg, transparent, rgba(4,77,77,0.78));
  }
}
```

### Grids (the shipped home grids)
Each bespoke grid reflows on its own breakpoint (see §2 for the CSS):
- **Diferenciais `.diff-grid`** (flex): 5-across → centered 3+2 / 2+2+1 → full-width at **520px**.
- **Método 4D `.axes-grid`** (explicit): 4-across → **2×2** at **1024px** → 1 at **520px**.
- **Tratamentos `.treat-avatars`** (flex avatar cluster): wraps freely, capped at 880px wide; on touch (`hover: none`) the eixo label shows at rest instead of on hover.

### Carousels (Casos + Avaliações)
Both are horizontal scroll-snap tracks that **break out of the container** (full-bleed), with prev/next arrow controls and a `--per` (cards-in-view) that steps down responsively:
- **Casos `.casos__track`**: `--per` 6 → 5 (**1200**) → 4 (**980**) → 3 (**760**) → 2.2 (**560**); the track pads to the page `--gutter`. The caso meta (category chip) sits at the card corner; it clamps to the card width at **560px**.
- **Avaliações `.reviews__track`**: `--per` 3 → 2 (**1080**) → 1.12 (**680**); the track pads to a computed `--edge` so the cards line up with `.container` (boxed full-bleed, not edge-to-edge). Review text line-clamp loosens (7 → 11 lines) at **680px**.

### Splits (doctor block — and the planned contact info+form)
`.grid-12` collapses to a single column at **880px**, **media/portrait on top** (`.sobre__portrait { order: -1 }`) so the human face greets first, copy below; the portrait also drops to `4/3` aspect on mobile. The before/after `.compare` split likewise goes 1-column at **880px**.

### Footer
Desktop: 4 columns (`1.4fr 1fr 1.2fr 1fr` — brand · nav · contato · redes). Tablet (**880px**): 2 columns. Mobile (**480px**): single centered column, enlarged logo (80px), links/contact/social centered, credentials + bottom bar last. The WhatsApp float clears the footer so it never overlaps the bottom bar.

### Section padding & gutter (all sections)
Standard padding follows `clamp(64px, 9vw, 134px)` (the carousel bands use `clamp(72px, 9vw, 130px)`); the gutter follows `clamp(20px, 5vw, 80px)`. Never tighten these to "fit" — drop a decorative element before you cramp the whitespace.

---

## 9. Page-shell skeleton (starting template)

Copy this for any new page; swap the `<main>` sections. Reuse the central `assets/css/main.css` and `assets/js/main.js` — every page-specific style still belongs in `main.css`, scoped by section class.

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Dr. Márcio Teixeira · Dermatologista em Porto Alegre</title>
  <meta name="description" content="Dermatologia de excelência desde 1993 em Porto Alegre. Cuidado personalizado, resultados naturais e o exclusivo Método 4D. Agende sua consulta." />
  <meta name="theme-color" content="#057f7f" />

  <link rel="icon" type="image/png" href="logo/logo-header-colorido.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Poppins:wght@300;400;500;600;700&display=swap"
    rel="stylesheet" />

  <link rel="stylesheet" href="assets/css/main.css" />
</head>
<body class="is-loading fonts-pending">
  <a class="skip-link" href="#hero">Pular para o conteúdo</a>

  <header class="nav" data-nav>
    <div class="nav__inner">
      <a class="nav__brand" href="index.html" aria-label="Dr. Márcio Teixeira, página inicial">
        <!-- two logos: white over the hero glass, colored once the pill goes solid -->
        <img class="nav__logo nav__logo--light" src="logo/logo-header-branco.png" alt="Dr. Márcio Teixeira" />
        <img class="nav__logo nav__logo--solid" src="logo/logo-header-colorido.png" alt="Dr. Márcio Teixeira" />
      </a>
      <nav class="nav__links" aria-label="Navegação principal">
        <span class="nav__indicator" aria-hidden="true"></span>
        <a class="nav__link" href="index.html" aria-current="page">Início</a>
        <a class="nav__link" href="tratamentos.html">Tratamentos</a>
        <a class="nav__link" href="metodo-4d.html">Método 4D</a>
        <a class="nav__link" href="tricologia.html">Tricologia</a>
        <a class="nav__link" href="sobre.html">Sobre</a>
        <a class="nav__link" href="contato.html">Contato</a>
      </nav>
      <a class="btn btn--primary nav__cta" href="https://wa.me/5551999704848" target="_blank" rel="noopener">Agende sua consulta</a>
      <button class="nav__burger" data-drawer-open type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="drawer">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div class="nav-scrim" data-drawer-scrim></div>
  <aside class="drawer" id="drawer" data-drawer aria-hidden="true">
    <button class="drawer__close" data-drawer-close type="button" aria-label="Fechar menu">&times;</button>
    <a class="drawer__link" href="index.html" aria-current="page">Início</a>
    <a class="drawer__link" href="tratamentos.html">Tratamentos</a>
    <a class="drawer__link" href="metodo-4d.html">Método 4D</a>
    <a class="drawer__link" href="tricologia.html">Tricologia</a>
    <a class="drawer__link" href="sobre.html">Sobre</a>
    <a class="drawer__link" href="contato.html">Contato</a>
    <a class="btn btn--primary drawer__cta" href="https://wa.me/5551999704848" target="_blank" rel="noopener">Agende sua consulta</a>
  </aside>

  <main>
    <section class="hero" id="hero" aria-label="Apresentação">
      <!-- video hero (home) or a slim .section__head plate (subpages) -->
    </section>

    <section class="section section--neve" aria-labelledby="sec-2-title">
      <div class="container">
        <header class="section__head">
          <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Eyebrow</p>
          <h2 id="sec-2-title" class="section__title">Título com <span class="hl hl--italic">destaque</span></h2>
          <p class="section__lede">Linha de apoio em Poppins 400.</p>
        </header>
        <div class="grid grid--diff"><!-- cards --></div>
      </div>
      <div class="section__divider" aria-hidden="true"><!-- curve into next band --></div>
    </section>

    <!-- … more sections … -->

    <section class="section section--deep cta-band" id="agende" aria-labelledby="cta-title">
      <div class="container">
        <h2 id="cta-title" class="section__title">Pronto para cuidar da <span class="hl--italic">sua pele</span>?</h2>
        <a class="btn btn--on-deep" href="https://wa.me/5551999704848" target="_blank" rel="noopener">Agende sua consulta</a>
        <a class="btn btn--ghost-on-deep" href="https://wa.me/5551999704848" target="_blank" rel="noopener">Atendimento WhatsApp</a>
      </div>
    </section>
  </main>

  <footer class="footer">
    <!-- deep-teal footer: logo-rodape, nav, contato, social, credentials, bottom bar -->
  </footer>

  <a class="wpp" href="https://wa.me/5551999704848" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
    <span class="wpp__label">Agende pelo WhatsApp</span>
    <span class="wpp__btn"><!-- rings + whatsapp svg (filled) + pip --></span>
  </a>

  <script src="assets/js/main.js" defer></script>
</body>
</html>
```

Notes on the real shell:
- The body boots as `class="is-loading fonts-pending"`; `main.js` removes `is-loading` after first paint (kills reveal flashes) and `fonts-pending` once webfonts settle.
- Page hrefs are flat **`*.html`** files (`index.html`, `tratamentos.html`, …), not `/dir/` paths — this is a static GitHub Pages site.
- The **active nav state is hard-coded** in each page's markup (`aria-current="page"` on the current link in both `.nav__links` and the `.drawer`); there's no runtime path-matching script. `main.js` instead drives the sliding `.nav__indicator` and the `.nav.is-solid` scroll state.

---

## 10. Sanity checklist before shipping a page

- [ ] `lang="pt-BR"`, `theme-color="#057f7f"`, skip-link aimed at the first section id.
- [ ] Cormorant Garamond × Poppins loaded; no body text in the serif.
- [ ] Every section has `id` + `aria-labelledby` (or `aria-label`).
- [ ] Display titles use the one-teal/italic-word pattern; `--marca-ink`/`--marca-deep` for any teal text (never `--marca-bright`).
- [ ] Light grounds only; **exactly one** deep-teal CTA band + the deep-teal footer. No third dark section.
- [ ] No two identical grounds back-to-back; sand (`--areia`) used at most once or twice, on the beauty side.
- [ ] Section dividers are the brand curve / washes / whitespace — never a grey 1px rule. One divider device per seam.
- [ ] Shadows soft, low, teal-tinted (sand-tinted on warm grounds); never `rgba(0,0,0,>0.16)`.
- [ ] Section padding `clamp(64px,9vw,134px)` (carousels `clamp(72px,9vw,130px)`); gutter `clamp(20px,5vw,80px)`; whitespace never cramped to "fit".
- [ ] Mobile-first verified at the real breakpoints (see §2): nav drawer at **980px**, hero at **600px**, splits/footer at **880px**, carousels at their own `--per` steps. Tap targets ≥44px; body ≥16px.
- [ ] Hero video muted + loop + playsinline + autoplay + pause control (bottom-left, opposite the WhatsApp float); legibility plate present at ≤600px; rails + cue hidden at ≤600px.
- [ ] Light sections that opt into the fio motif use `data-fio` and **alternate the side** vs. the previous fio section; carousels/grids carry no fio.
- [ ] Splits (`.grid-12`) stack with portrait/media on top (`order: -1`) at ≤880px.
- [ ] `prefers-reduced-motion` honored on every reveal, parallax and curve-draw.
- [ ] No em dashes in copy (commas / `·`); real `…`; no emoji in nav, buttons or headings.
- [ ] Footer credentials + "Desenvolvido por: Freela In Home" present; WhatsApp float clears the footer on mobile.
