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
   - 7.4 Sobre
   - 7.5 Contato
8. Responsive playbook (per section)
9. Page-shell skeleton (starting template)
10. Sanity checklist before shipping a page

---

## 1. Document scaffold

Every page starts from the same shell. Don't reinvent it per page — the nav, footer and WhatsApp float are global brand surfaces. The full copy-paste template lives in §9; this is the conceptual map.

```
<head>  → meta + theme-color #057f7f + Cormorant Garamond × Poppins + main.css
<body>  → skip-link
        → <header class="nav">            (fixed glass pill: logo + links + AGENDE CTA)
        → <div class="nav__scrim">         (mobile drawer backdrop)
        → <aside class="drawer">           (mobile nav drawer)
        → <main>
             <section class="hero …">       (or a slim .section__head plate on subpages)
             <section class="section …">    (alternating --branco / --neve / --nevoa grounds)
             …
             <section class="cta-band">     (the ONE optional deep-teal band)
        → <footer class="footer">           (deep-teal — counts as the page's dark band)
        → <a class="wpp">                   (WhatsApp float)
        → <script src="assets/js/main.js">
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
.container--wide { max-width: 1320px; }
```

### The fluid grid helper

One reusable auto-fit grid covers differentials, axis cards, treatment cards, stats and the gallery. The `--min` custom property tunes the column floor per use; everything else is shared.

```css
.grid {
  display: grid;
  gap: clamp(20px, 2.4vw, 32px);
  grid-template-columns: repeat(auto-fit, minmax(var(--min, 260px), 1fr));
}

/* Tunings — set --min, the helper does the rest */
.grid--diff   { --min: 220px; }   /* 5 differential cards          */
.grid--axes   { --min: 250px; }   /* the 4 Método 4D axis cards    */
.grid--treat  { --min: 260px; }   /* treatment cards               */
.grid--stats  { --min: 170px; }   /* stat cells (anos, eixos, …)   */
.grid--gallery{ --min: 220px; }   /* Nosso Espaço clinic photos    */
```

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

Four anchor widths. Design mobile-first; these are max-width queries layered on top.

| Breakpoint | Anchor | Responsibility |
|---|---|---|
| **390px** | small phone (baseline) | Single column everywhere. Floor type sizes. WhatsApp float lifts above footer. |
| **768px** | tablet portrait | Nav links → burger drawer. Grids drop to 2-up. Splits stack (media on top). Section padding trims. |
| **1024px** | tablet landscape / small laptop | Full nav returns. Grids reach 3-up. Splits go side-by-side. |
| **1280px** | desktop | Container hits its `1200px` cap, gutter opens toward 80px, full vertical rhythm (`110–140px` sections). |

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
  overflow: clip;                       /* contain the curve watermark / wash */
  isolation: isolate;                   /* scope the backdrop's stacking */
  padding-block: clamp(64px, 9vw, 140px);  /* mobile 64 → desktop 110–140 */
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

---

## 5. Vertical rhythm, grounds & the one-dark-band rule

### Section padding ladder (responsive)

| Context | Mobile (≤390) | Tablet (≤768) | Desktop (≥1280) |
|---|---|---|---|
| Standard section | 64px | 88px | `clamp` → 110–120px |
| Hero | min-height driven | min-height driven | 100vh / tall band |
| Featured / CTA band | 72px | 96px | 120–140px |

The base rule `padding-block: clamp(64px, 9vw, 140px)` covers most sections automatically; only the hero and the CTA band override.

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

**At most one deep-teal full-color band per page, plus the footer.** The CTA band (`--section--deep` / `--grad-deep`) is that band. The footer is always deep-teal and counts as the page's other teal flood. No third dark section. Everything else keeps teal **in cards and accents on a light ground**. The alternation across a page reads like:

```
white → neve → white → nevoa → (areia, optional) → white → DEEP-TEAL CTA → DEEP-TEAL footer
```

Never two identical grounds back-to-back; never a dark section in the body flow except the single CTA.

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
| Tricologia | `/tricologia/` | Tricologia | **NEW** · teal, capilar (hair) + antes/depois |
| Sobre | `/sobre/` | Sobre | teal + one sand-warmed gallery |
| Contato | `/contato/` | Contato | teal, info + form |

Nav: `Início · Tratamentos · Método 4D · Tricologia · Sobre · Contato`. Recurring CTAs: **AGENDE SUA CONSULTA** (primary → WhatsApp `(51) 99970-4848`), **CONHEÇA O MÉTODO 4D**, **Download E-book Método 4D**, **ATENDIMENTO WHATSAPP**.

---

### 7.1 Início (Home)

| # | Section | Ground | Component | Real content |
|---|---|---|---|---|
| 1 | **Hero** (video) | dark video + teal scrim | **video hero** | Eyebrow/apoio: "Seu Dermatologista de confiança em Porto Alegre, excelência desde 1993 em saúde e beleza da pele." · Título: "Dermatologia de Excelência para a Saúde e Beleza da Sua Pele" · Subtítulo: "Dr. Márcio Teixeira: Cuidado personalizado e resultados naturais com quem entende profundamente de pele." · CTAs: `AGENDE SUA CONSULTA` · `CONHEÇA O MÉTODO 4D` · Mídia: `video-hero/video-hero.mp4` (muted, playsinline, poster, pause control) |
| 2 | **Diferenciais** (5 cards) | `--neve` | **differentials grid** (`.grid--diff`) | Eyebrow "Por que Dr. Márcio". Five cards: **Experiência** "Quase 30 anos de atuação e participação ativa nos principais congressos e inovações da dermatologia." · **Atendimento Humanizado** "Você é ouvido, acolhido e orientado com empatia em todas as etapas do tratamento." · **Método 4D Exclusivo** "Abordagem única que avalia sua pele em quatro dimensões, para tratamentos mais eficazes e personalizados." · **Tecnologia de Ponta** "Equipamentos modernos e seguros, que entregam resultados com precisão e conforto." · **Resultados Naturais** "A beleza está no equilíbrio: respeitamos sua individualidade para realçar o que você tem de melhor." |
| 3 | **Método 4D summary** (4 axes) | `--branco` (curve watermark) | **axis cards** (`.grid--axes`) | Eyebrow "Método 4D". Title: "Avaliação correta, *tratamento correto*". Lede: "Esta abordagem exclusiva avalia sua pele em quatro dimensões." Four axis cards: **Eixo 1 · A Superfície da Pele** "Avalia a superfície da pele, focando nas alterações da coloração, textura, luminosidade e uniformidade." · **Eixo 2 · Linhas de Expressão** "Tratamento das rugas dinâmicas e estáticas." · **Eixo 3 · Alterações do Volume da Face** "Reposição ou redução de volume para contornos harmoniosos." · **Eixo 4 · Flacidez** "Abordagem da perda de firmeza e sustentação." CTA: `CONHEÇA O MÉTODO 4D`. |
| 4 | **About-doctor teaser** | `--branco` (split) | **doctor/about block** (`.grid-12`, portrait `col-5` + copy `col-7`) | Portrait (`imagens/sobre.jpg`). Eyebrow "Dr. Márcio Teixeira". Quote/lede: "Cuidar da pele é minha vocação. Valorizar sua beleza natural é minha missão." Short bio line: "Dermatologista CREMERS 20214 · membro titular da Sociedade Brasileira de Dermatologia, com quase 30 anos de trajetória." CTA: "Conheça o Dr. Márcio" → Sobre. |
| 5 | **Featured treatments** | `--neve` | **treatment cards** (`.grid--treat`) | Eyebrow "Tratamentos". Title: "Cuidados *sob medida* para a sua pele". A curated set: Skinbooster · Toxina Botulínica · Preenchimento com Ácido Hialurônico · Bioestimuladores de Colágeno · Ultrassom Microfocado (Liftera) · Radiofrequência (each card: bespoke `imagens/*.png` + name + its eixo). CTA: "Ver todos os tratamentos" → Tratamentos. |
| 6 | **Stats** | `--nevoa` | **stat cells** (`.grid--stats`) | Four stat cells: **30** "anos de excelência" (desde 1993) · **4** "eixos do Método 4D" · **+20** "tratamentos" · **2** "registros RQE (10858 | 12078)". Count-up on reveal. |
| 7 | **Testimonials** | `--areia` (warm) | **testimonials** | Eyebrow "Quem confia". Title: "Resultados que falam por *si*". Patient quotes (placeholder real reviews from Google) on the warm sand ground, sand-tinted shadows. Optional "Avaliações no Google" link. |
| 8 | **Appointment CTA band** | `--section--deep` (the ONE dark band) | **appointment CTA** | Title (white): "Pronto para cuidar da sua pele *com quem entende*?" Lede: "Agende sua consulta da forma mais prática para você." Buttons: `AGENDE SUA CONSULTA` (WhatsApp) · `ATENDIMENTO WHATSAPP`. White logo `logo/logo-header-branco.png`. |
| 9 | **Footer** | deep-teal | **footer** | See §7-global footer block below. |

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

> **Resultados (antes/depois) — opcional.** Há material real de antes/depois em `antes-depois/`: `laser-CO2/` (7 img, Eixo 1), `Liftera/` (5 img + 2 vídeos, Eixo 4), `Preenchimento labial/` (11 img + 4 vídeos, Eixo 3). Pode virar uma galeria de resultados por eixo (slider antes/depois + lightbox, ver `INTERACTIONS.md`) ou cards de prova social. Curar, otimizar para web, converter `.mov` → `.mp4`, e confirmar consentimento de imagem dos pacientes.

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

The doctor is **Dermatologista & Tricologista** (per the brandbook), so the hair/scalp specialty gets its own page. It did **not** exist on the old site, so the copy below is a recommended scaffold to confirm with the client, not extracted ground truth. Keep it on-brand: same teal + serif + whitespace, same section rhythm. Real before/after material exists in `antes-depois/Cabelos/` (14 images).

| # | Section | Ground | Component | Content (scaffold, confirm with client) |
|---|---|---|---|---|
| 1 | **Hero** | `--branco` plate (curve watermark) | **section head plate** | Eyebrow "Tricologia". Title: "Saúde e força para os seus *cabelos*." Lede: "Diagnóstico e tratamento de queda, calvície e saúde do couro cabeludo, com a mesma precisão do Método 4D." CTA `AGENDE SUA CONSULTA`. (Optional support image: a curated frame from `antes-depois/Cabelos/`.) |
| 2 | **O que é tricologia** | `--neve` | **prose** (`.container--narrow`) | Plain, calm explainer: a tricologia é a área da dermatologia dedicada aos cabelos e ao couro cabeludo. Quando procurar, o que esperar da avaliação. |
| 3 | **Principais queixas** | `--branco` | **differentials/icon grid** (`.grid--diff`) | Cards: Queda capilar · Calvície (alopecia androgenética) · Alopecia areata · Caspa e dermatite seborreica · Saúde do couro cabeludo · Fios fracos e quebradiços. (Confirmar lista com o cliente; ícones de linha teal.) |
| 4 | **Tratamentos capilares** | `--neve` | **treatment cards** (`.grid--treat`, `data-eixo="capilar"`) | Cards a definir com o cliente. Exemplos comuns em tricologia: Microagulhamento capilar (MMP) · Mesoterapia / intradermoterapia · Minoxidil e terapias tópicas/orais · Laserterapia capilar · Bioestimulação do couro cabeludo. (Sem arte dedicada ainda em `/imagens`, avaliar produção.) |
| 5 | **Resultados (antes/depois)** | `--areia` (warm) | **gallery / before-after** (`.grid--gallery` → lightbox) | Eyebrow "Resultados reais". Galeria a partir de `antes-depois/Cabelos/` (14 imagens). Curar os melhores pares, otimizar para web, e confirmar consentimento de imagem dos pacientes. Considerar um slider antes/depois. |
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

### Nav (≤768px)
Links collapse into the burger drawer; the pill keeps logo + the AGENDE CTA, which on small phones (≤390) compresses to a WhatsApp-green circle (icon only). Scrim + drawer use the z-scale from §6.

```css
@media (max-width: 768px) {
  .nav__links { display: none; }
  .nav__toggle { display: inline-flex; }
}
@media (max-width: 390px) {
  .nav__cta { width: 44px; height: 44px; padding: 0; border-radius: 999px; }
  .nav__cta-label { display: none; }
}
```

### Hero (video)
Desktop: full-bleed video, copy column ~560px anchored left/center, both CTAs inline. Tablet: copy centers, title scales via `clamp`. Mobile (≤390): a dark/teal scrim plate at the bottom guarantees the white serif title reads over the video; CTAs stack full-width; the title floors near 32px.

```css
.hero__title { font-size: clamp(32px, 6vw, 84px); }
@media (max-width: 600px) {
  .hero__actions { flex-direction: column; align-items: stretch; }
  .hero::after {           /* legibility plate */
    content: ""; position: absolute; inset: auto 0 0 0; height: 56vh; z-index: 1;
    background: linear-gradient(180deg, transparent, rgba(4,77,77,0.78));
  }
}
```

### Grids (differentials, axes, treatments, stats, gallery)
All use `.grid` auto-fit, so they reflow automatically: **3–4 up** desktop → **2 up** tablet → **1 up** mobile. No per-grid media queries needed beyond the shared helper. Stats may hold **2×2** on tablet/mobile rather than a single column (numbers read better paired).

### Axis switcher → accordion (mobile)
Desktop/tablet landscape (≥1024): horizontal **tab rail** with a cross-fading panel. Tablet portrait & mobile (≤768): collapse to a **stacked accordion** (each eixo is a tappable header revealing its alterations) — tabs don't fit four labels on a phone. Behavior + ARIA in `INTERACTIONS.md`.

```css
@media (max-width: 768px) {
  .axis-switcher__tabs { display: none; }
  .axis-switcher__accordion { display: block; }
}
```

### Splits (doctor block, contact info+form)
`.grid-12` collapses to a single column at ≤880px, **media/portrait on top** (`order: -1`) so the human face or the info greets first, copy/form below.

### Gallery (Nosso Espaço)
`.grid--gallery` auto-fit: 4-up desktop → 3-up tablet → 2-up mobile (keep 2 on phones so the space reads as a gallery, not a stack). Lightbox is full-screen at all sizes; close target ≥44px.

### Footer
Desktop: 4 columns (brand · nav · contato · social). Tablet (≤768): 2 columns. Mobile (≤390): single column, links stacked and centered, the credentials + bottom bar last. WhatsApp float lifts above the footer on mobile so it never overlaps the bottom bar.

### Section padding & gutter (all sections)
Padding follows `clamp(64px, 9vw, 140px)`; the gutter follows `clamp(20px, 5vw, 80px)`. Never tighten these to "fit" — drop a decorative element (a watermark, a card) before you cramp the whitespace.

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
<body class="is-loading">
  <a class="skip-link" href="#hero">Pular para o conteúdo</a>

  <header class="nav" data-nav>
    <div class="container nav__inner">
      <a class="nav__brand" href="/" aria-label="Dr. Márcio Teixeira, página inicial">
        <img class="nav__logo" src="logo/logo-header-colorido.png" alt="Dr. Márcio Teixeira" />
      </a>
      <nav class="nav__links" aria-label="Navegação principal">
        <a href="/">Início</a>
        <a href="/tratamentos/">Tratamentos</a>
        <a href="/metodo-4d/">Método 4D</a>
        <a href="/tricologia/">Tricologia</a>
        <a href="/sobre/">Sobre</a>
        <a href="/contato/">Contato</a>
      </nav>
      <a class="btn btn--primary nav__cta" href="https://wa.me/5551999704848">
        <span class="nav__cta-label">AGENDE SUA CONSULTA</span>
      </a>
      <button class="nav__toggle" data-drawer-open aria-label="Abrir menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div class="nav__scrim" data-drawer-scrim hidden></div>
  <aside class="drawer" id="drawer" data-drawer aria-hidden="true">
    <nav class="drawer__links" aria-label="Navegação">
      <a href="/">Início</a>
      <a href="/tratamentos/">Tratamentos</a>
      <a href="/metodo-4d/">Método 4D</a>
      <a href="/tricologia/">Tricologia</a>
      <a href="/sobre/">Sobre</a>
      <a href="/contato/">Contato</a>
    </nav>
    <a class="btn btn--primary" href="https://wa.me/5551999704848">AGENDE SUA CONSULTA</a>
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

    <section class="section section--deep cta-band" aria-labelledby="cta-title">
      <div class="container">
        <h2 id="cta-title" class="section__title">Pronto para cuidar da <span class="hl--italic">sua pele</span>?</h2>
        <a class="btn btn--primary" href="https://wa.me/5551999704848">AGENDE SUA CONSULTA</a>
      </div>
    </section>
  </main>

  <footer class="footer">
    <!-- deep-teal footer: logo-rodape, nav, contato, social, credentials, bottom bar -->
  </footer>

  <a class="wpp" href="https://wa.me/5551999704848" aria-label="Falar no WhatsApp">
    <!-- whatsapp svg (filled) -->
  </a>

  <script src="assets/js/main.js" defer></script>
  <script>
    requestAnimationFrame(() => requestAnimationFrame(() =>
      document.body.classList.remove('is-loading')));
  </script>
</body>
</html>
```

Active-state pattern for the nav (in `main.js`):

```js
const path = location.pathname.replace(/\/index\.html$/, '/') || '/';
document.querySelectorAll('.nav__links a, .drawer__links a').forEach(a => {
  if (a.getAttribute('href') === path) a.setAttribute('aria-current', 'page');
});
```

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
- [ ] Section padding `clamp(64px,9vw,140px)`; gutter `clamp(20px,5vw,80px)`; whitespace never cramped to "fit".
- [ ] Mobile-first verified at 390 → 768 → 1024 → 1280. Tap targets ≥44px; body ≥16px.
- [ ] Hero video muted + playsinline + poster + pause control; legibility plate present on mobile.
- [ ] Axis switcher → accordion below 768px; splits stack with media on top.
- [ ] `prefers-reduced-motion` honored on every reveal, parallax and curve-draw.
- [ ] No em dashes in copy (commas / `·`); real `…`; no emoji in nav, buttons or headings.
- [ ] Footer credentials + "Desenvolvido por: Freela In Home" present; WhatsApp float clears the footer on mobile.
