# COMPONENTS.md — The Dr. Márcio Teixeira component library

Read this before adding or modifying any component. The brand already has a defined language — **extend the closest analog here before inventing.** Every component obeys the prime directive from DESIGN.md: **light canvas, one disciplined teal, elegant Cormorant display over Poppins UI, softly rounded corners, soft teal-tinted shadows, calm motion, impeccable accessibility.** All class names are BEM (`block__element--modifier`).

Use the **exact tokens** from DESIGN.md — never raw hex. The recurring ones below are: `--marca` `--marca-deep` `--marca-bright` `--marca-ink` `--marca-soft` `--marca-wash`, `--branco` `--neve` `--nevoa` `--tinta` `--tinta-muted` `--tinta-soft` `--linha`, `--areia` `--areia-deep` `--nude`, the gradients `--grad-marca` `--grad-deep` `--grad-spa` `--grad-pele`, type `--font-display` (Cormorant Garamond, ≥22px display only) and `--font-body` (Poppins, everything else), radii `--r-sm` `--r-md` `--r-lg` `--r-xl` `--r-pill`, and motion `--ease-calm` `--ease-soft` `--ease-glide`.

Two craft reflexes carried into every snippet below:
- **Shadows are teal-tinted, never black.** Resting `0 14px 38px rgba(5,127,127,0.08), 0 4px 12px rgba(22,48,47,0.05)`; the brand never uses `rgba(0,0,0, >0.16)`.
- **Copy has no travessões (—).** Use commas, colons, or `·` (middle dot). Portuguese, calm, doctor-led.

## Component index

| # | Component | Section | Defining trait |
|---|---|---|---|
| 1 | Top nav (floating glass island) | Header | A floating pill over the hero; dual-logo swap + sliding indicator; condenses to a frosted-white capsule when scrolled |
| 2 | Button system | Global | Teal pill primary (glow), ghost outline, on-deep variants |
| 3 | Eyebrow + section header | Every section | Caps teal eyebrow with rule → serif title with one `.hl` word → Poppins lede |
| 4 | Video hero | Hero | Full-bleed muted video, deep-teal scrim, heritage rails, scroll cue, pause control |
| 5 | Differentials grid | Diferenciais | 5 cards, soft-teal icon tile, title, copy |
| 6 | Método 4D axis card + 4-axis layout | Método 4D | Numbered 01–04, serif eixo title, description |
| 7 | Treatment card + grid | Tratamentos | Image, title, "Eixo N ·" label, `data-eixo` for filtering |
| 8 | Doctor / About block | Sobre | Portrait frame, bio, credential chips, serif signature quote |
| 9 | Clinic gallery ("Nosso Espaço") | Sobre / Contato | Rounded ambiente frames + lightbox trigger |
| 10 | Stats row | Anywhere | Serif number in `--marca-deep` + Poppins caps key (removed from Home) |
| 11 | Reviews carousel (Avaliações) | Avaliações | Google-toned cards, gold stars, initials avatars, rating header, arrows |
| 12 | FAQ accordion item | FAQ | Question button + answer panel, teal +/− indicator |
| 13 | Appointment CTA band | Pre-footer | The one deep-teal full-color band |
| 14 | Contact form + info rows | Contato | Labeled fields, teal focus ring, contact rows |
| 15 | Footer | Footer | Logo, nav, contact, social, credentials line |
| 16 | WhatsApp floating button | Global | Fixed WhatsApp-green button, pill label, CSS pulse rings, unread pip |
| 17 | Two-image drag comparator | Resultados | Slider you drag to reveal the second image; `--pos` clip |
| 18 | Casos case carousel | Casos | Horizontal rail of cards; hover/tap cross-fades image A→B; `--off` stagger |
| 19 | Fio de cabelo motif | Global (opt-in) | The brand-mark hair strand drawn in a section's free lateral margin via `data-fio` |

---

## 1. Top nav — floating glass island

**Purpose.** The fixed header is a **floating glass "island" pill**, not a full-width bar. Over the video hero it reads as a frosted, translucent capsule (`logo-header-branco.png` + white links against the deep-teal scrim, backdrop blur); once the user scrolls past 60px it condenses into a **frosted-white floating capsule** with a soft teal shadow, swapping to `logo-header-colorido.png` and teal-ink links. Premium-clinical, bright and calm — never glass-on-dark.

**When to use.** Every page. The translucent-over-hero state only applies on pages that open with the video hero (Início). On inner pages (`Tratamentos`, `Sobre`, `Contato`, etc.) start in the solid state by adding the `nav--solid` class on the `.nav` element at load (the JS scroll-toggle is skipped when `nav--solid` is present).

> **Where this lives.** Markup in `index.html`; all styles in `assets/css/main.css` (`.nav` block, ~lines 317–486); behavior in `assets/js/main.js` — the `is-solid` scroll toggle (~line 85) and the `navIndicator()` IIFE (~line 103). The drawer/scrim logic is in the same JS file (~line 144).

### Anatomy

```html
<header class="nav" data-nav>
  <div class="nav__inner">
    <a class="nav__brand" href="index.html" aria-label="Dr. Márcio Teixeira, página inicial">
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

    <a class="btn btn--primary nav__cta" href="https://wa.me/5551999704848?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta." target="_blank" rel="noopener">Agende sua consulta</a>

    <button class="nav__burger" data-drawer-open type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="drawer">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<!-- the drawer + scrim are siblings of <header>, not children -->
<div class="nav-scrim" data-drawer-scrim></div>
<aside class="drawer" id="drawer" data-drawer aria-hidden="true">
  <button class="drawer__close" data-drawer-close type="button" aria-label="Fechar menu">&times;</button>
  <a class="drawer__link" href="index.html" aria-current="page">Início</a>
  <a class="drawer__link" href="tratamentos.html">Tratamentos</a>
  <!-- … restante dos links … -->
  <a class="btn btn--primary drawer__cta" href="https://wa.me/5551999704848?text=…" target="_blank" rel="noopener">Agende sua consulta</a>
</aside>
```

### Critical CSS

```css
/* the .nav wrapper is click-through; only the pill catches clicks */
.nav {
  position: fixed; inset: 0 0 auto 0; z-index: var(--z-nav);
  padding: clamp(14px, 2vw, 22px) clamp(14px, 4vw, 30px) 0;
  pointer-events: none;             /* clicks pass through the gaps beside the pill */
  animation: nav-drop 0.85s var(--ease-glide) both;
}
/* the glass island */
.nav__inner {
  pointer-events: auto;
  max-width: 1200px; margin-inline: auto;
  display: flex; align-items: center; gap: 20px;
  padding: 11px 12px 11px 26px;
  border-radius: var(--r-pill);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(16px) saturate(1.3);
  box-shadow: 0 18px 50px rgba(3,64,63,0.22);
  transition: background .4s var(--ease-glide), box-shadow .4s var(--ease-glide),
    border-color .4s var(--ease-glide), padding .35s var(--ease-glide);
}

/* logo cross-swap: white mark over hero, colored mark when solid */
.nav__logo { height: 42px; width: auto; transition: height .35s var(--ease-glide); }
.nav__logo--solid { display: none; }

/* links rail + the sliding indicator pill (positioned via JS-set CSS vars) */
.nav__links { position: relative; display: flex; gap: 2px; margin-inline: auto; }
.nav__indicator {
  position: absolute; top: 0; bottom: 0; left: 0;
  width: var(--ind-w, 0); transform: translateX(var(--ind-x, 0));
  border-radius: var(--r-pill);
  background: rgba(255,255,255,0.16);
  opacity: var(--ind-o, 0); pointer-events: none; z-index: 0;
  transition: transform .42s var(--ease-glide), width .42s var(--ease-glide),
    opacity .3s var(--ease-soft), background .4s var(--ease-glide);
}
.nav__link {
  position: relative; z-index: 1;       /* sits above the indicator */
  padding: 9px 16px; border-radius: var(--r-pill);
  font: 500 15px/1 var(--font-body); letter-spacing: 0.01em;
  color: rgba(255,255,255,0.92);
  transition: color .25s var(--ease-soft);
}
.nav__link:hover, .nav__link:focus-visible, .nav__link[aria-current="page"] { color: #fff; }
.nav__cta { flex: none; min-height: 46px; padding: 13px 24px; }

/* SCROLLED / inner-page solid state — the pill condenses into a frosted-white capsule */
.nav.is-solid .nav__inner, .nav--solid .nav__inner {
  max-width: 1090px;                    /* micro-shrink as you scroll */
  background: rgba(255,255,255,0.9);
  border-color: rgba(5,127,127,0.12);
  box-shadow: 0 16px 42px rgba(5,127,127,0.16), 0 3px 10px rgba(22,48,47,0.06);
  padding-block: 9px;
}
.nav.is-solid .nav__logo, .nav--solid .nav__logo { height: 38px; }
.nav.is-solid .nav__indicator, .nav--solid .nav__indicator { background: var(--marca-soft); }
.nav.is-solid .nav__logo--light, .nav--solid .nav__logo--light { display: none; }
.nav.is-solid .nav__logo--solid, .nav--solid .nav__logo--solid { display: block; }
.nav.is-solid .nav__link, .nav--solid .nav__link { color: var(--marca-ink); }
.nav.is-solid .nav__link:hover, .nav.is-solid .nav__link[aria-current="page"] { color: var(--marca-deep); }
.nav.is-solid .nav__burger span, .nav--solid .nav__burger span { background: var(--marca-deep); }

.nav__burger { display: none; flex-direction: column; gap: 5px; width: 44px; height: 44px; align-items: center; justify-content: center; background: none; border: 0; cursor: pointer; }
.nav__burger span { width: 24px; height: 2px; border-radius: 2px; background: #fff; transition: background .3s var(--ease-soft); }

@media (max-width: 980px) {
  .nav__links, .nav__cta { display: none; }
  .nav__burger { display: flex; margin-left: auto; }
  .nav__inner { padding: 8px 8px 8px 20px; gap: 12px; }
}
```

### Craft notes
- **It is an island, not a bar.** The `.nav` wrapper is `pointer-events: none` so clicks fall through the gaps either side of the pill; only `.nav__inner` re-enables pointer events. The pill enters with a one-shot `nav-drop` animation. Never make it a full-bleed slab.
- **Scroll state.** `assets/js/main.js` toggles `.is-solid` on `[data-nav]` when `scrollY > 60` (~line 92), but **only** when `.nav--solid` is absent — inner pages hard-set `nav--solid` so links never render white-on-white. The solid state condenses the capsule (`max-width` 1200→1090px) and frosts it white; it never darkens.
- **Sliding indicator.** `.nav__indicator` is a single pill that glides under the hovered/focused link and rests under the current page. `navIndicator()` (~line 103) writes `--ind-x` / `--ind-w` / `--ind-o` from each link's `offsetLeft` / `offsetWidth` on `mouseenter`/`focus`, and snaps back to the `[aria-current="page"]` link on `mouseleave`/`focusout`. It re-measures on `resize` and after fonts settle. Over the hero the indicator is `rgba(255,255,255,0.16)`; in the solid state it is `--marca-soft`.
- **Dual logo swap.** Two `<img>`s toggled by `display` (light over hero, solid when scrolled) — no runtime `src` swap, so no flash. Keep both at the same intrinsic height to avoid layout shift.
- **Drawer.** The burger (`data-drawer-open`) opens `.drawer` (a right-side `<aside>`) over a `.nav-scrim`; both gain `.is-open`. The drawer and scrim are **siblings of `<header>`**, not nested inside it. Esc, scrim click, and any drawer link close it; body scroll locks while open. Touch targets ≥ 44px. Focus rings: `outline: 3px solid var(--marca); outline-offset: 3px`.

---

## 2. Button system

**Purpose.** Three shapes that cover every action. Compose `btn` + a variant. The brand button is a **pill**; the primary carries a **teal glow** (never a hard black shadow). No sparkles, no neon, no gradients-everywhere energy.

**When to use.**
- `--primary` — the dominant CTA (AGENDE SUA CONSULTA, Agende sua avaliação). One primary per visual cluster.
- `--ghost` — secondary action sitting beside a primary (Conheça o Método 4D, Ver tratamentos).
- `--whatsapp` — explicit "Fale no WhatsApp" with the logomark, when the channel itself is the message.
- `--on-deep` — white / outline-white variants used **only** inside the deep-teal CTA band (§13).

### Anatomy

```html
<a class="btn btn--primary" href="https://wa.me/5551999704848" target="_blank" rel="noopener">Agende sua consulta</a>

<a class="btn btn--ghost" href="metodo-4d.html">Conheça o Método 4D</a>

<a class="btn btn--whatsapp" href="https://wa.me/5551999704848" target="_blank" rel="noopener">
  <svg class="btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24zM6.6 20.13c1.65.98 3.22 1.57 5.4 1.57 5.44 0 9.86-4.42 9.86-9.84S17.44 2.02 12 2.02 2.14 6.44 2.14 11.86c0 2.29.67 4 1.79 5.78l-.99 3.62 3.66-1.13z"/></svg>
  Fale no WhatsApp
</a>
```

### Critical CSS

```css
.btn {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  min-height: 50px; padding: 15px 30px; border-radius: var(--r-pill);
  font: 600 15px/1 var(--font-body); letter-spacing: 0.02em; text-transform: none;
  cursor: pointer; border: 0; white-space: nowrap; text-decoration: none;
  transition: transform .28s var(--ease-calm), box-shadow .28s var(--ease-soft),
              background .25s var(--ease-soft), color .25s var(--ease-soft);
}
.btn__icon { width: 19px; height: 19px; flex: none; }
.btn:focus-visible { outline: 3px solid var(--marca); outline-offset: 3px; }

/* PRIMARY — teal, white text, teal glow */
.btn--primary {
  background: var(--grad-marca); color: #fff;
  box-shadow: 0 12px 30px rgba(5,127,127,0.26);
}
.btn--primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(5,127,127,0.34);
}
.btn--primary:active { transform: translateY(-1px); }

/* GHOST / OUTLINE — teal border, marca-ink text, fills on hover */
.btn--ghost {
  background: transparent; color: var(--marca-ink);
  box-shadow: inset 0 0 0 1.5px var(--marca);
}
.btn--ghost:hover {
  background: var(--marca); color: #fff;
  transform: translateY(-3px);
  box-shadow: inset 0 0 0 1.5px var(--marca), 0 14px 32px rgba(5,127,127,0.24);
}

/* WHATSAPP — solid teal with the logomark; reads as a channel, still on-brand */
.btn--whatsapp {
  background: var(--marca); color: #fff;
  box-shadow: 0 12px 30px rgba(5,127,127,0.22);
}
.btn--whatsapp:hover {
  background: var(--marca-deep); transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(5,127,127,0.30);
}

/* ON the deep-teal band only (§13) */
.btn--on-deep { background: #fff; color: var(--marca-deep); box-shadow: 0 12px 30px rgba(0,0,0,0.16); }
.btn--on-deep:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.22); }
.btn--ghost-on-deep { background: rgba(255,255,255,0.10); color: #fff; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.7); }
.btn--ghost-on-deep:hover { background: rgba(255,255,255,0.18); transform: translateY(-3px); }

@media (prefers-reduced-motion: reduce) {
  .btn, .btn:hover { transform: none; transition: background .2s, color .2s, box-shadow .2s; }
}
```

### Craft notes
- The primary uses `--grad-marca` (the logo's teal depth) for a subtle dimensionality; a flat `--marca` is also acceptable if a section already carries the gradient elsewhere. Either way the **glow is teal**, never black.
- Buttons may carry a leading thin-outline SVG (1.75–2px stroke) but **never an emoji**. WhatsApp/Instagram logomarks are the only filled icons.
- Min height 50px keeps the touch target comfortable for older patients. Label is sentence-case ("Agende sua consulta") in chrome; the hero/CTA-band may render the same label uppercase via `text-transform` for impact, but keep the copy itself in sentence case.
- Reserve the teal glow for the **one** primary in a cluster. A row with two glowing buttons reads cheap; pair `--primary` with `--ghost`.

---

## 3. Eyebrow + section header pattern

**Purpose.** The title plate that opens almost every section: a small **uppercase teal eyebrow** with a short rule, a **Cormorant display title** carrying exactly one teal (or teal-italic) `.hl` word, and a calm **Poppins lede**. This three-beat formula is the brand's compositional signature and the reason the pages feel composed rather than busy.

**When to use.** At the top of every content section. The eyebrow may be omitted on the hero (the eyebrow there is the video context), but the serif-title + lede pairing recurs everywhere.

### Anatomy

```html
<header class="head">
  <p class="eyebrow">
    <span class="eyebrow__rule" aria-hidden="true"></span>
    Método 4D
  </p>
  <h2 class="head__title">
    O segredo é a <span class="hl hl--italic">avaliação correta</span>, para o tratamento correto
  </h2>
  <p class="head__lede">
    Esta abordagem exclusiva avalia sua pele em quatro dimensões, para tratamentos mais eficazes e personalizados.
  </p>
</header>
```

### Critical CSS

```css
.eyebrow {
  display: inline-flex; align-items: center; gap: 12px;
  font: 600 13px/1 var(--font-body); letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--marca-ink); margin: 0 0 20px;
}
.eyebrow__rule { width: 28px; height: 1.5px; border-radius: 2px; background: var(--marca); }

/* soft-pill variant for chips/filters — the rule version stays the default */
.eyebrow--pill {
  padding: 7px 14px; border-radius: var(--r-pill);
  background: var(--marca-soft); color: var(--marca-ink); letter-spacing: 0.12em;
}

.head { max-width: 720px; }
.head--center { margin-inline: auto; text-align: center; }
.head--center .eyebrow { justify-content: center; }

.head__title {
  margin: 0;
  font-family: var(--font-display); font-weight: 600;
  font-size: clamp(34px, 5.4vw, 68px); line-height: 1.06; letter-spacing: 0.005em;
  color: var(--tinta);
}
.hl { color: var(--marca-ink); }
.hl--italic { font-style: italic; font-weight: 500; color: var(--marca-ink); }

.head__lede {
  margin: 22px 0 0;
  font: 400 clamp(17px, 1.5vw, 20px)/1.7 var(--font-body);
  color: var(--tinta-muted);
}
```

### Craft notes
- **Cormorant is light by nature** — the title is weight 600, never 400 (it disappears at display sizes). Keep letter-spacing at/near zero (`0.005em`), never negative; the thin strokes need air. Line-height stays `1.05–1.12`.
- The **italic is a feature**: `.hl--italic` is the most premium emphasis. Use it on **one** word or short phrase per title, never a whole line.
- Never set the lede or eyebrow in Cormorant — below ~22px the high-contrast serif muddies. Poppins owns everything functional.
- Lede stays ≥ 17px, line-height 1.7, color `--tinta-muted` for the calm secondary tone. Keep it to one or two sentences.

---

## 4. Video hero

**Purpose.** The first impression on Início: a full-bleed muted background video of the clinic, a **deep-teal scrim** for legibility, a confident Cormorant title with one highlighted phrase, a supporting Poppins line, two CTAs, a scroll cue, and **lateral "heritage rails"** that lateralize the brand's time/heritage signals. Calm and cinematic without being a flashy med-spa.

**When to use.** Home only. Inner pages use the lighter page-header pattern (eyebrow + title on `--neve`), not the video.

> **Where this lives.** Markup in `index.html` (`<section class="hero" id="hero">`); styles in `assets/css/main.css` (`.hero` block, ~lines 618–760); behavior in `assets/js/main.js` — autoplay + pause control (~line 171) and the soft parallax on `.hero__media.parallax` (~line 212). **There is no count-up stats block in the hero** — the lateral heritage rails replaced it.

### Anatomy

```html
<section class="hero" id="hero" aria-label="Apresentação Dr. Márcio Teixeira">
  <div class="hero__media parallax" aria-hidden="true">
    <video class="hero__video" id="hero-video" muted loop playsinline autoplay preload="auto" disablepictureinpicture>
      <source src="video-hero/video-hero.mp4" type="video/mp4" />
    </video>
    <div class="hero__scrim"></div>
  </div>

  <!-- lateral heritage rails: rotated 90°, pinned to each edge -->
  <div class="hero__rail hero__rail--left" aria-hidden="true">
    <span class="hero__rail-bar"></span>
    <span>+30 anos de excelência</span>
  </div>
  <div class="hero__rail hero__rail--right" aria-hidden="true">
    <span>Desde 1993</span>
    <span class="hero__rail-bar"></span>
  </div>

  <div class="hero__inner">
    <div class="hero__copy">
      <p class="hero__eyebrow">Dermatologia, estética e tricologia · Porto Alegre</p>
      <h1 class="hero__title">
        Dermatologia de excelência para a saúde e <span class="hl-light">beleza da sua pele</span>
      </h1>
      <p class="hero__lede">
        Dr. Márcio Teixeira: cuidado personalizado e resultados naturais com quem entende profundamente de pele, com excelência desde 1993.
      </p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="https://wa.me/5551999704848?text=…" target="_blank" rel="noopener">Agende sua consulta</a>
        <a class="btn btn--ghost-on-deep" href="metodo-4d.html">Conheça o Método 4D</a>
      </div>
    </div>
  </div>

  <a class="hero__cue" href="#diferenciais" aria-label="Rolar para saber mais">
    <span>Saiba mais</span>
    <span class="hero__cue-line" aria-hidden="true"></span>
  </a>

  <!-- pause control: bottom-LEFT (the WhatsApp float owns bottom-right); two SVGs cross-faded by .is-paused -->
  <button class="hero__pause" data-hero-pause type="button" aria-label="Pausar vídeo">
    <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
    <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
  </button>
</section>
```

### Critical CSS

```css
.hero { --rail-gutter: 30px; --hero-px: clamp(64px, 5vw, 76px); }
.hero__media { position: absolute; inset: 0; z-index: -1; }   /* .parallax is nudged in JS */
.hero__video { width: 100%; height: 100%; object-fit: cover; }

/* deep-teal scrim — legibility without killing the footage */
.hero__scrim {
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, rgba(4,77,77,0.55) 0%, rgba(4,77,77,0.30) 40%, rgba(3,64,63,0.66) 100%),
    radial-gradient(120% 90% at 18% 70%, rgba(3,64,63,0.45), transparent 60%);
}

/* lateral heritage rails — rotated caps text in the free margins */
.hero__rail {
  position: absolute; top: 50%; transform-origin: center;
  display: inline-flex; align-items: center; gap: 14px;
  font: 500 11px/1 var(--font-body); letter-spacing: 0.34em; text-transform: uppercase;
  color: rgba(255,255,255,0.82); white-space: nowrap; z-index: 2;
  text-shadow: 0 1px 12px rgba(3,64,63,0.55);
}
.hero__rail--left  { left: var(--rail-gutter);  transform: translate(-50%, -50%) rotate(-90deg); }
.hero__rail--right { right: var(--rail-gutter); transform: translate(50%, -50%) rotate(-90deg); }
.hero__rail-bar { width: 30px; height: 1px; background: var(--marca-bright); opacity: 0.85; }

.hero__inner {
  max-width: var(--container-wide); width: 100%; margin-inline: auto;
  padding: calc(var(--nav-h) + 40px) var(--hero-px) 80px;  /* --hero-px reserves the rail strip */
  position: relative; z-index: 1;
}
.hero__copy { max-inline-size: 940px; }
.hero__title {
  margin: 0; max-width: 17ch;
  font-family: var(--font-display); font-weight: 600;
  font-size: clamp(40px, 6vw, 84px); line-height: 1.05; letter-spacing: 0.005em; color: #fff;
}
.hl-light { color: #fff; font-style: italic; font-weight: 500; }   /* teal glyph fails on video; italic-white reads premium */

.hero__cue {
  position: absolute; left: 50%; bottom: 26px; transform: translateX(-50%);
  display: inline-flex; flex-direction: column; align-items: center; gap: 10px;
  font: 600 11px/1 var(--font-body); letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(255,255,255,0.8); z-index: 2;
}
.hero__cue-line { width: 1.5px; height: 40px; background: linear-gradient(rgba(255,255,255,0.8), transparent); animation: cue-drift 2.6s var(--ease-calm) infinite; }
@keyframes cue-drift { 0%,100% { transform: translateY(0); opacity: .55; } 50% { transform: translateY(6px); opacity: 1; } }

/* pause control — bottom-LEFT, opposite the WhatsApp float */
.hero__pause {
  position: absolute; left: clamp(16px, 4vw, 40px); bottom: 24px; z-index: 2;
  width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(255,255,255,0.14); color: #fff; border: 1px solid rgba(255,255,255,0.3);
  cursor: pointer; backdrop-filter: blur(6px);
}
.hero__pause svg { width: 18px; height: 18px; }
.hero__pause .icon-play { display: none; }                       /* paused → show play, hide pause */
.hero__pause.is-paused .icon-pause { display: none; }
.hero__pause.is-paused .icon-play  { display: block; }

@media (prefers-reduced-motion: reduce) { .hero__cue-line { animation: none; } }
@media (max-width: 600px) {
  .hero__rail { display: none; }                                 /* rails clip off-canvas; reclaim padding */
  .hero { --hero-px: clamp(20px, 5vw, 28px); }
  .hero__cue { display: none; }                                  /* collides with stacked CTAs; redundant on touch */
}
```

### Craft notes
- **Heritage rails, not stats.** `.hero__rail--left` ("+30 anos de excelência") and `.hero__rail--right` ("Desde 1993") are rotated `-90°` and pinned to the gutters, each paired with a thin `--marca-bright` `.hero__rail-bar`. They lateralize the brand's time/heritage in the dead margin instead of a center count-up block. They are `aria-hidden` decoration and hide below 600px. **Do not reintroduce a hero count-up stats row** — it was removed.
- **Video.** Muted, looped, `playsinline`, `autoplay` with a real **pause control**. `assets/js/main.js` forces `video.muted` (iOS inline-autoplay quirk), calls `play()` and falls back to the paused state if the browser blocks it, retrying on `canplay`. Under `prefers-reduced-motion` it removes `autoplay`, pauses, and shows the play glyph. The pause button cross-fades `.icon-pause` / `.icon-play` via the `.is-paused` class and updates its `aria-label`.
- **Parallax.** `.hero__media.parallax` is nudged a few px (`translate3d`, factor 0.06) on scroll while the hero is in view; skipped under reduced motion.
- The highlighted phrase uses **italic white** (`.hl-light`), not teal — `--marca`/`--marca-bright` would fail contrast over footage. Teal lives in the buttons, the scrim, and the rail bars.
- Two CTAs only: the teal **primary** plus a **ghost-on-deep** outline. The scrim is **deep teal**, not generic black. Title ≤ ~17ch so it wraps to a few composed lines.

---

## 5. Differentials grid

**Purpose.** The "por que escolher o Dr. Márcio" section: five cards, each a **soft-teal icon tile**, a title, and one calm sentence. It establishes credibility (experiência, acolhimento, the proprietary method, technology, natural results) without hype.

**When to use.** Home, below the hero. The five are fixed: **Experiência**, **Atendimento Humanizado**, **Método 4D Exclusivo**, **Tecnologia de Ponta**, **Resultados Naturais**.

### Anatomy

```html
<section class="section diff">
  <div class="container">
    <header class="head head--center"> … eyebrow + title + lede (§3) … </header>

    <div class="diff__grid">
      <article class="diff-card reveal" style="--i:0">
        <span class="diff-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5l3 2"/><circle cx="12" cy="12" r="9"/></svg>
        </span>
        <h3 class="diff-card__title">Experiência</h3>
        <p class="diff-card__text">Quase 30 anos de excelência em dermatologia, com presença ativa nos principais congressos da área.</p>
      </article>

      <article class="diff-card reveal" style="--i:1">
        <span class="diff-card__icon" aria-hidden="true"><!-- heart / hands svg --></span>
        <h3 class="diff-card__title">Atendimento Humanizado</h3>
        <p class="diff-card__text">Acolhimento e respeito à sua individualidade, em cada etapa do cuidado com a sua pele.</p>
      </article>

      <article class="diff-card reveal" style="--i:2">
        <span class="diff-card__icon" aria-hidden="true"><!-- four-square / grid svg --></span>
        <h3 class="diff-card__title">Método 4D Exclusivo</h3>
        <p class="diff-card__text">Uma avaliação proprietária que estuda sua pele em quatro eixos, para o tratamento certo.</p>
      </article>

      <article class="diff-card reveal" style="--i:3">
        <span class="diff-card__icon" aria-hidden="true"><!-- spark / device svg --></span>
        <h3 class="diff-card__title">Tecnologia de Ponta</h3>
        <p class="diff-card__text">Equipamentos modernos e técnicas atualizadas, a serviço de resultados seguros.</p>
      </article>

      <article class="diff-card reveal" style="--i:4">
        <span class="diff-card__icon" aria-hidden="true"><!-- leaf / sparkle svg --></span>
        <h3 class="diff-card__title">Resultados Naturais</h3>
        <p class="diff-card__text">Valorizamos a sua beleza natural, sem exageros, realçando o que já é seu.</p>
      </article>
    </div>
  </div>
</section>
```

### Critical CSS

```css
.diff__grid {
  display: grid; gap: 24px; margin-top: clamp(40px, 5vw, 64px);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.diff-card {
  background: var(--branco); border-radius: var(--r-lg); padding: 36px 30px;
  display: flex; flex-direction: column; gap: 14px;
  box-shadow: 0 14px 38px rgba(5,127,127,0.08), 0 4px 12px rgba(22,48,47,0.05);
  transition: transform .26s var(--ease-calm), box-shadow .26s var(--ease-soft);
}
.diff-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 66px rgba(5,127,127,0.16), 0 8px 20px rgba(22,48,47,0.08);
}
.diff-card__icon {
  width: 60px; height: 60px; border-radius: var(--r-md);
  display: grid; place-items: center;
  background: var(--marca-soft); color: var(--marca-ink);
}
.diff-card__icon svg { width: 28px; height: 28px; }
.diff-card__title { margin: 0; font: 600 21px/1.25 var(--font-body); color: var(--tinta); }
.diff-card__text  { margin: 0; font: 400 16px/1.7 var(--font-body); color: var(--tinta-muted); }
```

### Craft notes
- Icon tiles are the canonical **soft-teal square** (`--marca-soft` ground, `--marca-ink` glyph, `--r-md`). Icons are thin outline SVGs (1.75px, round caps/joins, `fill="none"`, `stroke="currentColor"`) — never clip-art syringes or clipboards.
- Card titles are **Poppins 600** (UI scale, below 22px), not Cormorant. Cormorant is for the section title above, not the card titles.
- Five cards on an `auto-fit` grid land as 3 + 2 on desktop, 2-up on tablet, 1-up on mobile. The shadow is the resting teal recipe; hover lifts to the elevated recipe. Stagger reveal with the `--i` step (ANIMATIONS § Stagger).

---

## 6. Método 4D axis card + the 4-axis layout

**Purpose.** The brand's proprietary IP, given weight. Four numbered axis cards (01–04) explaining how the Método 4D reads the skin. This pattern appears on the Home summary, the dedicated Método 4D page, and (as filter labels) the Tratamentos page — keep it identical everywhere.

**When to use.** Anywhere the Método 4D is explained. **Lock the four axes exactly** as in DESIGN.md:

| Eixo | Nome | Foca em |
|---|---|---|
| 01 | A Superfície da Pele | coloração, textura, poros, luminosidade, manchas, sensibilidade |
| 02 | Linhas de Expressão | rugas dinâmicas e estáticas, sulcos |
| 03 | Alterações do Volume da Face | perda/excesso de volume, contornos, definição |
| 04 | Flacidez | firmeza, sustentação, flacidez cutânea e muscular |

### Anatomy

```html
<section class="section section--wash metodo">
  <div class="container">
    <header class="head"> … eyebrow "Método 4D" + title + lede (§3) … </header>

    <div class="metodo__axes">
      <article class="axis-card reveal" style="--i:0">
        <span class="axis-card__num">01</span>
        <h3 class="axis-card__title">A Superfície da Pele</h3>
        <p class="axis-card__desc">Avalia coloração, textura, poros, luminosidade, manchas e sensibilidade da pele.</p>
      </article>
      <article class="axis-card reveal" style="--i:1">
        <span class="axis-card__num">02</span>
        <h3 class="axis-card__title">Linhas de Expressão</h3>
        <p class="axis-card__desc">Estuda as rugas dinâmicas e estáticas e os sulcos formados pela expressão.</p>
      </article>
      <article class="axis-card reveal" style="--i:2">
        <span class="axis-card__num">03</span>
        <h3 class="axis-card__title">Alterações do Volume da Face</h3>
        <p class="axis-card__desc">Analisa perda ou excesso de volume, contornos e definição dos traços.</p>
      </article>
      <article class="axis-card reveal" style="--i:3">
        <span class="axis-card__num">04</span>
        <h3 class="axis-card__title">Flacidez</h3>
        <p class="axis-card__desc">Observa firmeza, sustentação e a flacidez cutânea e muscular.</p>
      </article>
    </div>
  </div>
</section>
```

### Critical CSS

```css
.metodo__axes {
  display: grid; gap: 22px; margin-top: clamp(40px, 5vw, 64px);
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.axis-card {
  position: relative; background: var(--branco); border-radius: var(--r-lg);
  padding: 38px 30px 32px;
  box-shadow: 0 14px 38px rgba(5,127,127,0.08), 0 4px 12px rgba(22,48,47,0.05);
  transition: transform .26s var(--ease-calm), box-shadow .26s var(--ease-soft);
}
.axis-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 66px rgba(5,127,127,0.16), 0 8px 20px rgba(22,48,47,0.08);
}
/* the recurring motif: the big serif eixo number in teal */
.axis-card__num {
  display: block; font-family: var(--font-display); font-weight: 600;
  font-size: clamp(40px, 4vw, 56px); line-height: 1; letter-spacing: 0.01em;
  color: var(--marca); margin-bottom: 16px;
}
.axis-card__title { margin: 0 0 10px; font: 600 19px/1.3 var(--font-body); color: var(--tinta); }
/* on the dedicated Método page, the axis title may go Cormorant ≥22px: */
.metodo--feature .axis-card__title { font: 600 clamp(24px, 2.8vw, 30px)/1.15 var(--font-display); letter-spacing: 0.01em; }
.axis-card__desc { margin: 0; font: 400 15.5px/1.7 var(--font-body); color: var(--tinta-muted); }
```

### Craft notes
- The **eixo number is the signature motif** — large Cormorant in `--marca`. Repeat the exact treatment in the Home summary and the dedicated page so the four axes always read as one system.
- On the dedicated Método 4D page, pair each axis with its image (`imagens/superficie-da-pele*.png`, `linhas-de-expressao.png`, `volumes-da-face.png`, `flacidez.png`) in a two-column split, and the axis title can graduate to Cormorant (≥22px). On the compact Home summary, keep titles in Poppins 600.
- An interactive tab/switcher variant (axes as tabs, panels cross-fade over 350–450ms with `--ease-glide`) lives in INTERACTIONS § Método 4D switcher. The card grid here is the static, always-correct fallback.
- The four are **numbered, ordered, and styled identically** everywhere. Never reorder, rename, or restyle them per page — it is proprietary IP.

---

## 7. Treatment card + responsive grid

**Purpose.** A single treatment in the Tratamentos catalog: bespoke treatment art, the treatment name, and an "Eixo N · …" label tying it back to the Método 4D. The `data-eixo` attribute powers filtering by axis.

**When to use.** The Tratamentos page grid, and as a small "tratamentos em destaque" rail on Home. Each card belongs to one of the four eixos.

### Anatomy

```html
<div class="treat__grid" data-treat-grid>
  <article class="treat-card reveal" data-eixo="1" style="--i:0">
    <figure class="treat-card__media">
      <img src="imagens/skinbooster.png" alt="Skinbooster" loading="lazy" />
    </figure>
    <div class="treat-card__body">
      <h3 class="treat-card__title">Skinbooster</h3>
      <p class="treat-card__eixo">Eixo 1 · A Superfície da Pele</p>
    </div>
  </article>

  <article class="treat-card reveal" data-eixo="2" style="--i:1">
    <figure class="treat-card__media"><img src="imagens/toxina-butolinica.png" alt="Toxina Botulínica" loading="lazy" /></figure>
    <div class="treat-card__body">
      <h3 class="treat-card__title">Toxina Botulínica</h3>
      <p class="treat-card__eixo">Eixo 2 · Linhas de Expressão</p>
    </div>
  </article>

  <article class="treat-card reveal" data-eixo="4" style="--i:2">
    <figure class="treat-card__media"><img src="imagens/radiofrequencia.png" alt="Radiofrequência" loading="lazy" /></figure>
    <div class="treat-card__body">
      <h3 class="treat-card__title">Radiofrequência</h3>
      <p class="treat-card__eixo">Eixo 4 · Flacidez</p>
    </div>
  </article>
  <!-- … one card per treatment, grouped by eixo … -->
</div>
```

### Critical CSS

```css
.treat__grid {
  display: grid; gap: 26px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
.treat-card {
  background: var(--branco); border-radius: var(--r-lg); overflow: hidden;
  box-shadow: 0 14px 38px rgba(5,127,127,0.08), 0 4px 12px rgba(22,48,47,0.05);
  transition: transform .28s var(--ease-calm), box-shadow .28s var(--ease-soft);
}
.treat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 66px rgba(5,127,127,0.16), 0 8px 20px rgba(22,48,47,0.08);
}
.treat-card__media { margin: 0; aspect-ratio: 4 / 3; overflow: hidden; background: var(--neve); }
.treat-card__media img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform .5s var(--ease-calm);
}
.treat-card:hover .treat-card__media img { transform: scale(1.05); }
.treat-card__body { padding: 24px 26px 28px; }
.treat-card__title { margin: 0 0 8px; font: 600 20px/1.25 var(--font-body); color: var(--tinta); }
.treat-card__eixo {
  margin: 0; font: 600 12.5px/1 var(--font-body); letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--marca-ink);
}

/* filtered-out state (driven by JS toggling data-active on the grid) */
.treat-card[hidden] { display: none; }
.treat-card.is-out { opacity: 0; transform: scale(.96); pointer-events: none; }
```

### Craft notes
- `data-eixo="1..4"` is the filter key. The Tratamentos page filter bar uses **soft-pill eyebrows** (`.eyebrow--pill`, §3) as toggle chips labelled "Todos · Eixo 1 · Eixo 2 · Eixo 3 · Eixo 4"; JS shows/hides cards by `data-eixo` and re-runs the stagger reveal. Wiring is in INTERACTIONS § Treatment filter.
- The "Eixo N ·" label is the **only place** uppercase teal meta appears on the card — it keeps the catalog visibly organized by the Método 4D. Use `--marca-ink` (contrast-safe), never `--marca-bright`.
- Prefer the bespoke art in `imagens/` over stock. `loading="lazy"` on every catalog image; real `alt` = the treatment name.
- The image zoom on hover is gentle (`scale(1.05)`, 500ms `--ease-calm`); the card itself lifts 6px with the elevated teal shadow.

---

## 8. Doctor / About block

**Purpose.** The human anchor of the brand: a framed portrait of Dr. Márcio, a warm bio, credential chips, and the signature quote in serif italic. It carries the "trust + empathy" promise more than any other section.

**When to use.** The Sobre page hero block, and a condensed version on Home. The signature quote is a real tagline; render it in Cormorant italic for gravity.

### Anatomy

```html
<section class="section sobre">
  <div class="container sobre__grid">
    <figure class="sobre__portrait">
      <img src="imagens/sobre.jpg" alt="Dr. Márcio Teixeira, dermatologista e tricologista" loading="lazy" />
    </figure>

    <div class="sobre__copy">
      <header class="head"> … eyebrow "Sobre o Dr. Márcio" + title (§3) … </header>

      <p class="sobre__bio">
        Formado pela UFRGS, com residência no Hospital de Clínicas de Porto Alegre e membro titular
        da Sociedade Brasileira de Dermatologia, o Dr. Márcio reúne quase 30 anos de prática clínica,
        estética e cirúrgica, sempre com foco em resultados naturais e no respeito a cada paciente.
      </p>

      <ul class="sobre__chips">
        <li class="chip">CREMERS 20214</li>
        <li class="chip">RQE 10858</li>
        <li class="chip">RQE 12078</li>
        <li class="chip">SBD · Membro titular</li>
      </ul>

      <blockquote class="sobre__quote">
        <p>Cuidar da pele é minha vocação. Valorizar sua beleza natural é minha missão.</p>
        <cite class="sobre__quote-by">Dr. Márcio Teixeira</cite>
      </blockquote>

      <a class="btn btn--primary" href="https://wa.me/5551999704848" target="_blank" rel="noopener">Agende sua consulta</a>
    </div>
  </div>
</section>
```

### Critical CSS

```css
.sobre__grid {
  display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(32px, 5vw, 72px);
  align-items: center;
}
.sobre__portrait { margin: 0; border-radius: var(--r-lg); overflow: hidden;
  box-shadow: 0 22px 56px rgba(5,127,127,0.12), 0 6px 16px rgba(22,48,47,0.06); }
.sobre__portrait img { width: 100%; height: 100%; object-fit: cover; display: block; aspect-ratio: 4 / 5; }

.sobre__bio { margin: 6px 0 0; font: 400 17px/1.75 var(--font-body); color: var(--tinta-muted); }

.sobre__chips { list-style: none; margin: 26px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
.chip {
  display: inline-flex; align-items: center; padding: 8px 16px; border-radius: var(--r-pill);
  background: var(--marca-soft); color: var(--marca-ink);
  font: 600 13px/1 var(--font-body); letter-spacing: 0.04em;
}

.sobre__quote { margin: 30px 0 0; padding-left: 22px; border-left: 2px solid var(--marca); }
.sobre__quote p {
  margin: 0; font-family: var(--font-display); font-style: italic; font-weight: 500;
  font-size: clamp(22px, 2.6vw, 30px); line-height: 1.3; color: var(--marca-deep);
}
.sobre__quote-by {
  display: block; margin-top: 12px; font-style: normal;
  font: 600 13px/1 var(--font-body); letter-spacing: 0.1em; text-transform: uppercase; color: var(--tinta-muted);
}
.sobre__copy .btn { margin-top: 34px; }

@media (max-width: 880px) {
  .sobre__grid { grid-template-columns: 1fr; }
  .sobre__portrait img { aspect-ratio: 4 / 3; }
}
```

### Craft notes
- The portrait uses the **brand square radius** (`--r-lg`) and the elevated teal-tinted shadow — the same lift the mark itself has. Never a hard black drop-shadow, never a sharp 0px frame.
- Credential chips are the **soft-teal pill** (`--marca-soft` / `--marca-ink`). Show **CREMERS 20214 · RQE 10858 | 12078** verbatim; these are trust signals, render them precisely.
- The signature quote is **Cormorant italic** (≥22px, so the serif is legal here) in `--marca-deep`, with a thin teal left rule — the one place body-adjacent serif is allowed because it is display-sized.
- Real `alt` on the portrait (it is meaningful). On mobile, stack with the portrait on top at a wider `4/3` crop.

---

## 9. Clinic gallery ("Nosso Espaço")

**Purpose.** Real photos of the Dermaclin space (`ambiente/dermaclin1…15.jpg`) in rounded frames, opening a lightbox. It proves the clinic is real and premium — the antidote to stock photography.

**When to use.** The Sobre page (and optionally a strip on Contato). Use the genuine `ambiente/` photography, never generic interiors.

### Anatomy

```html
<section class="section section--neve gallery">
  <div class="container">
    <header class="head head--center"> … eyebrow "Nosso Espaço" + title (§3) … </header>

    <div class="gallery__grid" data-lightbox-group>
      <a class="gallery__item gallery__item--tall reveal" href="ambiente/dermaclin1.jpg" data-lightbox style="--i:0">
        <img src="ambiente/dermaclin1.jpg" alt="Recepção da Dermaclin" loading="lazy" />
        <span class="gallery__zoom" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>
        </span>
      </a>
      <a class="gallery__item reveal" href="ambiente/dermaclin2.jpg" data-lightbox style="--i:1">
        <img src="ambiente/dermaclin2.jpg" alt="Sala de atendimento" loading="lazy" /><span class="gallery__zoom" aria-hidden="true"><!-- icon --></span>
      </a>
      <!-- … dermaclin3…15.jpg … -->
    </div>
  </div>

  <div class="lightbox" data-lightbox-modal aria-hidden="true" role="dialog" aria-label="Galeria">
    <button class="lightbox__close" data-lightbox-close aria-label="Fechar">&times;</button>
    <button class="lightbox__nav lightbox__nav--prev" data-lightbox-prev aria-label="Anterior">&#8249;</button>
    <img class="lightbox__img" data-lightbox-img src="" alt="" />
    <button class="lightbox__nav lightbox__nav--next" data-lightbox-next aria-label="Próxima">&#8250;</button>
  </div>
</section>
```

### Critical CSS

```css
.gallery__grid {
  margin-top: clamp(40px, 5vw, 64px);
  display: grid; gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  grid-auto-rows: 220px; grid-auto-flow: dense;
}
.gallery__item {
  position: relative; display: block; border-radius: var(--r-lg); overflow: hidden;
  box-shadow: 0 14px 38px rgba(5,127,127,0.08);
  transition: transform .28s var(--ease-calm), box-shadow .28s var(--ease-soft);
}
.gallery__item--tall { grid-row: span 2; }      /* masonry accents */
.gallery__item--wide { grid-column: span 2; }
.gallery__item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s var(--ease-calm); }
.gallery__item:hover { transform: translateY(-4px); box-shadow: 0 26px 56px rgba(5,127,127,0.16); }
.gallery__item:hover img { transform: scale(1.05); }
.gallery__zoom {
  position: absolute; inset: 0; margin: auto; width: 52px; height: 52px; border-radius: 50%;
  display: grid; place-items: center; color: #fff;
  background: rgba(4,77,77,0.55); backdrop-filter: blur(4px);
  opacity: 0; transition: opacity .25s var(--ease-soft);
}
.gallery__item:hover .gallery__zoom, .gallery__item:focus-visible .gallery__zoom { opacity: 1; }
.gallery__zoom svg { width: 22px; height: 22px; }

.lightbox {
  position: fixed; inset: 0; z-index: 200; display: grid; place-items: center;
  background: rgba(3,64,63,0.82); backdrop-filter: blur(8px);
  opacity: 0; pointer-events: none; transition: opacity .35s var(--ease-soft);
}
.lightbox.is-open { opacity: 1; pointer-events: auto; }
.lightbox__img { max-width: min(92vw, 1100px); max-height: 86vh; border-radius: var(--r-md); box-shadow: 0 30px 80px rgba(0,0,0,0.4); }
.lightbox__close, .lightbox__nav {
  position: absolute; background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.28);
  width: 48px; height: 48px; border-radius: 50%; font-size: 26px; cursor: pointer;
}
.lightbox__close { top: 24px; right: 24px; }
.lightbox__nav--prev { left: 24px; top: 50%; transform: translateY(-50%); }
.lightbox__nav--next { right: 24px; top: 50%; transform: translateY(-50%); }
```

### Craft notes
- A light **masonry rhythm** via `grid-auto-rows` + `span 2` on a couple of items (`--tall`, `--wide`) reads more editorial than a flat grid, while staying tidy. Keep most cells square.
- The lightbox overlay is **deep teal** (`rgba(3,64,63,0.82)`), not pure black — even the modal scrim stays on-brand. Trap focus, close on `Esc` and backdrop click, arrow-key navigate (INTERACTIONS § Gallery lightbox).
- Real `alt` per photo (recepção, sala, etc.). The hover zoom glyph is a thin outline magnifier; the whole frame is the link.

---

## 10. Stats row

**Purpose.** A calm proof band of three or four numbers: a **Cormorant numeral in `--marca-deep`** over a **Poppins uppercase key** in `--tinta-muted`. Numbers count up once on reveal.

> **Status.** The standalone "Números" section was **removed from the Home** (it sits commented out in `index.html`, between the Avaliações and CTA-band sections) — the hero now carries the brand's heritage signals via the lateral rails (§4) instead. This pattern remains a valid building block for **inner pages** (e.g. inside the Sobre block). The count-up driver (`countUp()`, `.stat__num[data-count]`) still lives in `assets/js/main.js` (~line 232) for any page that opts back in.

**When to use.** Inside the Sobre block or an inner-page proof strip — **not** the Home hero. The brand's confirmed figures: **30 anos**, **4 eixos**, **+20 tratamentos** (extend with "desde 1993" or "congressos" only with confirmed copy).

### Anatomy

```html
<div class="stats reveal">
  <div class="stat">
    <span class="stat__num" data-count="30" data-suffix=" anos">30</span>
    <span class="stat__key">de excelência</span>
  </div>
  <span class="stat__sep" aria-hidden="true"></span>
  <div class="stat">
    <span class="stat__num" data-count="4">4</span>
    <span class="stat__key">eixos do Método 4D</span>
  </div>
  <span class="stat__sep" aria-hidden="true"></span>
  <div class="stat">
    <span class="stat__num" data-count="20" data-prefix="+">+20</span>
    <span class="stat__key">tratamentos</span>
  </div>
</div>
```

### Critical CSS

```css
.stats {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  gap: clamp(24px, 5vw, 64px);
  padding: clamp(36px, 5vw, 56px) clamp(24px, 5vw, 48px);
  background: var(--branco); border-radius: var(--r-xl);
  box-shadow: 0 14px 38px rgba(5,127,127,0.08), 0 4px 12px rgba(22,48,47,0.05);
}
.stat { text-align: center; }
.stat__num {
  display: block; font-family: var(--font-display); font-weight: 600;
  font-size: clamp(44px, 6vw, 72px); line-height: 1; letter-spacing: 0.01em;
  color: var(--marca-deep);
}
.stat__key {
  display: block; margin-top: 10px;
  font: 600 13px/1.3 var(--font-body); letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--tinta-muted);
}
.stat__sep { width: 1px; height: 56px; background: var(--linha); }
@media (max-width: 640px) { .stat__sep { display: none; } }
```

### Craft notes
- The number is **Cormorant 600 in `--marca-deep`** (safe as large display text). The key is Poppins uppercase muted — the contrast keeps the band calm and premium.
- Count-up runs once on reveal, prefixing/suffixing from `data-prefix` / `data-suffix` (so "+20 tratamentos" animates cleanly). Never loop (ANIMATIONS § Count-up). Under reduced motion, the final value renders instantly.
- Separators are thin teal hairlines (`--linha`), hidden on mobile where stats stack. Confirm any new figure before publishing; the brand never inflates.

---

## 11. Reviews carousel (Avaliações)

**Purpose.** Real Google reviews in a calm, honest carousel: a header with the multicolor Google "G", the gold star row, and a "4,9 · 216 avaliações" score line; a horizontally scrolling track of review cards, each with gold stars, the patient's words, and an **initials avatar** in a per-card tint; prev/next arrows; and a "Ver todas no Google" CTA. Quiet social proof, sourced from the real account — not loud, not invented.

**When to use.** The Avaliações section on Home (`#avaliacoes`). It carries `data-fio="left"` (the hair motif, §19). The card text is real Google copy; the avatar tints rotate through a small palette per card.

> **Where this lives.** Markup in `index.html` (`<section class="reviews" id="avaliacoes">`); styles in `assets/css/main.css` (`.reviews` / `.review-card` block, ~lines 1612–1745); the manual carousel behavior is the `reviews()` IIFE in `assets/js/main.js` (~line 370), which mirrors the `casos()` carousel — arrow clicks `scrollBy` one card, and the arrows enable/disable at the ends.

### Anatomy

```html
<section class="section section--branco reviews" id="avaliacoes" aria-labelledby="avaliacoes-title" data-fio="left">
  <div class="container reviews__top">
    <header class="reviews__head reveal">
      <div class="reviews__intro">
        <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Avaliações</p>
        <h2 id="avaliacoes-title" class="section__title">Quem é cuidado <span class="hl hl--italic">recomenda</span></h2>
        <p class="section__lede">Histórias reais de pacientes, registradas no Google.</p>

        <a class="reviews__rating" href="https://g.page/r/CSvT6zxc3wPiEBM/review" target="_blank" rel="noopener"
           aria-label="4,9 de 5 estrelas em 216 avaliações no Google. Avaliar no Google.">
          <span class="reviews__rating-g" aria-hidden="true">
            <svg viewBox="0 0 24 24"><!-- multicolor Google G: #4285F4 #34A853 #FBBC05 #EA4335 --></svg>
          </span>
          <span class="reviews__rating-meta">
            <span class="reviews__rating-stars" aria-hidden="true"><!-- 5 gold star SVGs --></span>
            <span class="reviews__rating-score"><strong>4,9</strong> · 216 avaliações no Google</span>
          </span>
        </a>
      </div>
      <div class="reviews__nav" role="group" aria-label="Navegar pelas avaliações">
        <button class="reviews__arrow" type="button" data-reviews-prev aria-label="Ver avaliação anterior" disabled><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" …/></svg></button>
        <button class="reviews__arrow" type="button" data-reviews-next aria-label="Ver próxima avaliação"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" …/></svg></button>
      </div>
    </header>
  </div>

  <div class="reviews__viewport reveal">
    <ul class="reviews__track" data-reviews-track tabindex="0" role="list" aria-label="Avaliações de pacientes no Google">
      <li class="review-item">
        <article class="review-card">
          <div class="review-card__stars" aria-label="5 de 5 estrelas"><!-- 5 gold star SVGs --></div>
          <p class="review-card__text">Excelente dermatologista e profissional exemplar…</p>
          <footer class="review-card__by">
            <!-- initials avatar tinted per card via --av-bg / --av-ink -->
            <span class="review-card__avatar" style="--av-bg:#e8f4f4;--av-ink:#055f5f" aria-hidden="true">JM</span>
            <span class="review-card__id">
              <span class="review-card__name">Juliana Meyer</span>
              <span class="review-card__src">Avaliação no Google</span>
            </span>
          </footer>
        </article>
      </li>
      <!-- … one .review-item per review … -->
    </ul>
  </div>

  <div class="container reviews__more reveal">
    <a class="btn btn--ghost" href="https://g.page/r/CSvT6zxc3wPiEBM/review" target="_blank" rel="noopener">Ver todas no Google</a>
  </div>
</section>
```

### Critical CSS

```css
.reviews__rating { display: inline-flex; align-items: center; gap: 12px; /* … */ }
.reviews__rating-g svg { width: 24px; height: 24px; }                 /* the multicolor Google G */
.reviews__rating-stars { display: inline-flex; gap: 2px; color: #fbbc05; }   /* Google gold */
.reviews__rating-score { font: 500 13px/1 var(--font-body); color: var(--tinta-muted); }
.reviews__rating-score strong { color: var(--tinta); font-weight: 700; font-size: 14.5px; }

/* the track bleeds full-width but pads to the boxed container via --edge */
.reviews__track {
  --per: 3;                                  /* cards in view (2 ≤1080px, 1.12 on phones) */
  --gap: clamp(16px, 1.6vw, 26px);
  --edge: calc(max(0px, (100vw - var(--container)) / 2) + var(--gutter));
  display: flex; align-items: stretch; gap: var(--gap);
  padding: 18px var(--edge) 26px;
  overflow-x: auto; scroll-snap-type: x proximity; scroll-padding-inline: var(--edge);
  scrollbar-width: none;
}
.reviews__track::-webkit-scrollbar { display: none; }
.review-item {
  flex: 0 0 calc((100vw - 2 * var(--edge) - (var(--per) - 1) * var(--gap)) / var(--per));
  scroll-snap-align: start; display: flex;
}
.review-card {
  display: flex; flex-direction: column; gap: 16px;
  width: 100%; min-height: 300px;
  background: var(--branco); border-radius: var(--r-lg); padding: 32px 30px;
  box-shadow: 0 14px 38px rgba(5,127,127,0.08), 0 4px 12px rgba(22,48,47,0.05);
  transition: transform .28s var(--ease-calm), box-shadow .28s var(--ease-soft);
}
.review-card:hover { transform: translateY(-6px); box-shadow: 0 30px 66px rgba(5,127,127,0.16), 0 8px 20px rgba(22,48,47,0.08); }
.review-card__stars { display: inline-flex; gap: 3px; color: #fbbc05; }     /* gold, not teal */
.review-card__stars svg { width: 19px; height: 19px; }
.review-card__text {
  margin: 0; font: 400 16px/1.72 var(--font-body); color: var(--tinta);
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 7; overflow: hidden;  /* clamp long reviews */
}
.review-card__by { display: flex; align-items: center; gap: 13px; margin-top: auto; }
.review-card__avatar {
  width: 46px; height: 46px; border-radius: 50%; flex: none; display: grid; place-items: center;
  background: var(--av-bg, var(--marca-soft)); color: var(--av-ink, var(--marca-ink));   /* per-card tint */
  font: 600 15px/1 var(--font-body); letter-spacing: 0.03em;
}
.review-card__name { font: 600 15px/1.25 var(--font-body); color: var(--tinta); }
.review-card__src  { font: 500 12px/1 var(--font-body); color: var(--tinta-soft); }

.reviews__arrow:disabled { opacity: .4; cursor: default; }
```

### Craft notes
- **Stars are Google gold (`#fbbc05`), not teal** — both in the header rating and on every card. This is the one sanctioned non-teal accent on the page, because the reviews are genuinely Google's; pairing them with the multicolor "G" keeps the source honest.
- **Avatars are initials, never stock faces** (privacy + trust). Each card sets its own `--av-bg` / `--av-ink` inline so the row of circles alternates through soft teals and warm sands; the avatar falls back to `--marca-soft` / `--marca-ink` if unset. The `review-card__src` reads "Avaliação no Google".
- **Honest copy.** Card text is verbatim from real Google reviews and is line-clamped (`-webkit-line-clamp: 7`, loosened on phones) so cards stay even without truncating mid-thought visibly. The header score is **4,9 · 216 avaliações** — confirm before changing; the brand never inflates.
- **Carousel mechanics** mirror `casos()`: a full-bleed `.reviews__track` that pads to the boxed `--edge`, snap-scrolls, and shows `--per` cards (3 → 2 → 1.12 down the breakpoints). Arrows `scrollBy` exactly one card+gap and disable at each end. The track is keyboard-scrollable (`tabindex="0"`). The "Ver todas no Google" ghost CTA and the rating link both point at the real `g.page` review URL.

---

## 12. FAQ accordion item

**Purpose.** Common patient questions in calm, expandable items: a question button and an answer panel, with a teal **+/−** indicator. Reduces friction before the consult.

**When to use.** A FAQ section on Home or Contato (convênio, primeira consulta, Método 4D, tricologia, etc.). Single-open behavior, full keyboard support.

### Anatomy

```html
<div class="faq" data-accordion>
  <details class="faq__item">
    <summary class="faq__q">
      Como funciona a primeira consulta?
      <span class="faq__sign" aria-hidden="true"></span>
    </summary>
    <div class="faq__a">
      <p>Na primeira consulta avaliamos sua pele pelo Método 4D, entendemos seu histórico e seus objetivos, e montamos um plano de cuidado individual, com calma e sem pressa.</p>
    </div>
  </details>

  <details class="faq__item">
    <summary class="faq__q">Vocês atendem tricologia (cabelo e couro cabeludo)?<span class="faq__sign" aria-hidden="true"></span></summary>
    <div class="faq__a"><p>Sim. O Dr. Márcio é dermatologista e tricologista, com avaliação e tratamento de queda capilar e do couro cabeludo.</p></div>
  </details>
</div>
```

### Critical CSS

```css
.faq { max-width: 760px; margin-inline: auto; }
.faq__item {
  background: var(--branco); border-radius: var(--r-md); margin-bottom: 12px; overflow: hidden;
  box-shadow: 0 8px 24px rgba(5,127,127,0.06);
  transition: background .3s var(--ease-soft);
}
.faq__item[open] { background: var(--marca-soft); }
.faq__q {
  list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 18px;
  padding: 22px 26px; font: 600 17px/1.4 var(--font-body); color: var(--tinta);
}
.faq__q::-webkit-details-marker { display: none; }

/* teal +/− indicator built from two bars */
.faq__sign { position: relative; width: 18px; height: 18px; flex: none; }
.faq__sign::before, .faq__sign::after {
  content: ""; position: absolute; left: 50%; top: 50%; background: var(--marca);
  border-radius: 2px; transition: transform .35s var(--ease-glide), opacity .25s var(--ease-soft);
}
.faq__sign::before { width: 16px; height: 2px; transform: translate(-50%, -50%); }
.faq__sign::after  { width: 2px; height: 16px; transform: translate(-50%, -50%); }
.faq__item[open] .faq__sign::after { transform: translate(-50%, -50%) rotate(90deg); opacity: 0; }   /* + becomes − */

.faq__a { padding: 0 26px 24px; font: 400 16px/1.7 var(--font-body); color: var(--tinta-muted); }

@media (prefers-reduced-motion: reduce) { .faq__sign::before, .faq__sign::after { transition: none; } }
```

### Craft notes
- Native `<details>` is the accessible base; enhance with JS for smooth height and single-open (INTERACTIONS § Accordion). The open item gets a calm `--marca-soft` wash, not a hard border.
- The indicator is a **teal plus that collapses to a minus** (the vertical bar rotates out). Clean, geometric, no chevron clutter. Color stays `--marca`.
- Questions are Poppins 600; answers Poppins 400 muted, ≥ 16px. Keep answers short and warm.

---

## 13. Appointment CTA band

**Purpose.** The **one** deep-teal full-color band the page is allowed (the brand's single dark moment). A white Cormorant headline, a warm line, and two CTAs (AGENDE SUA CONSULTA + WhatsApp). It converts with calm authority.

**When to use.** Once per page, just before the footer. Never two full-color bands on one page.

### Anatomy

```html
<section class="section cta-band">
  <div class="container">
    <div class="cta-band__card">
      <div class="cta-band__decor" aria-hidden="true"><!-- faint brand curve watermark svg --></div>
      <p class="cta-band__eyebrow">Atendimento em Porto Alegre</p>
      <h2 class="cta-band__title">
        Vamos cuidar da <span class="cta-band__hl">sua pele</span>, com resultados naturais
      </h2>
      <p class="cta-band__text">
        Agende sua consulta e conheça o Método 4D, um cuidado pensado para a sua individualidade.
      </p>
      <div class="cta-band__actions">
        <a class="btn btn--on-deep" href="https://wa.me/5551999704848" target="_blank" rel="noopener">Agende sua consulta</a>
        <a class="btn btn--ghost-on-deep" href="https://wa.me/5551999704848" target="_blank" rel="noopener">
          <svg class="btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24z"/></svg>
          Fale no WhatsApp
        </a>
      </div>
    </div>
  </div>
</section>
```

### Critical CSS

```css
.cta-band__card {
  position: relative; overflow: hidden; isolation: isolate;
  background: var(--grad-deep); color: #fff;
  border-radius: var(--r-xl); text-align: center;
  padding: clamp(48px, 7vw, 96px) clamp(28px, 6vw, 80px);
}
.cta-band__decor {
  position: absolute; inset: 0; z-index: -1; opacity: 0.16; color: var(--marca-bright);
  /* the sinuous brand curve as an oversized watermark; the one place --marca-bright shows, faint */
}
.cta-band__eyebrow {
  font: 600 13px/1 var(--font-body); letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(255,255,255,0.78); margin: 0 0 18px;
}
.cta-band__title {
  margin: 0 auto; max-width: 18ch;
  font-family: var(--font-display); font-weight: 600;
  font-size: clamp(32px, 4.6vw, 60px); line-height: 1.08; letter-spacing: 0.005em; color: #fff;
}
.cta-band__hl { font-style: italic; font-weight: 500; color: #fff; }
.cta-band__text {
  margin: 22px auto 0; max-width: 56ch;
  font: 400 clamp(16px, 1.4vw, 19px)/1.7 var(--font-body); color: rgba(255,255,255,0.88);
}
.cta-band__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-top: 36px; }
```

### Craft notes
- Background is **`--grad-deep`** (the dark CTA gradient) — this is the sanctioned single dark band. Do not also darken the footer into a second; let this band be the one.
- Buttons here are the **on-deep** variants (white solid + outline-white). Never reuse the teal primary on a teal band.
- The decorative **brand curve watermark** is the only place `--marca-bright` may appear, and only at ~0.16 opacity. The headline highlight uses italic white, not teal.
- The card is a giant rounded panel (`--r-xl`), not a sharp full-bleed slab; it should feel like a confident object resting on the page.

---

## 14. Contact form + info rows

**Purpose.** The appointment/contact form: labeled fields (nome, telefone/WhatsApp, e-mail, mensagem) with a **teal focus ring**, an "Enviar" button, paired with a column of contact info rows (endereço, horário, WhatsApp, telefone, e-mail). Usable, calm, accessible.

**When to use.** The Contato page. Pair the form and the info column in a two-up grid.

### Anatomy

```html
<section class="section contato">
  <div class="container contato__grid">
    <form class="form" action="#" method="post" novalidate>
      <div class="form__row">
        <label class="form__label" for="f-nome">Nome</label>
        <input class="form__input" id="f-nome" name="nome" type="text" required autocomplete="name" placeholder="Seu nome" />
      </div>
      <div class="form__row">
        <label class="form__label" for="f-tel">Telefone / WhatsApp</label>
        <input class="form__input" id="f-tel" name="telefone" type="tel" required autocomplete="tel" placeholder="(51) 99999-9999" />
      </div>
      <div class="form__row">
        <label class="form__label" for="f-email">E-mail</label>
        <input class="form__input" id="f-email" name="email" type="email" autocomplete="email" placeholder="voce@email.com" />
      </div>
      <div class="form__row">
        <label class="form__label" for="f-msg">Mensagem</label>
        <textarea class="form__input form__input--area" id="f-msg" name="mensagem" rows="4" placeholder="Como podemos ajudar?"></textarea>
      </div>
      <button class="btn btn--primary form__submit" type="submit">Enviar</button>
    </form>

    <aside class="contato__info">
      <a class="contact-row" href="https://maps.google.com/?q=Av.+Dr.+Nilo+Peçanha,+1221/602,+Porto+Alegre">
        <span class="contact-row__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.4-7-11a7 7 0 0 1 14 0c0 4.6-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg></span>
        <span class="contact-row__text"><b>Endereço</b>Av. Dr. Nilo Peçanha, 1221/602 · Porto Alegre/RS</span>
      </a>
      <div class="contact-row">
        <span class="contact-row__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>
        <span class="contact-row__text"><b>Horário</b>Seg a Sex · 09h às 19h</span>
      </div>
      <a class="contact-row" href="https://wa.me/5551999704848">
        <span class="contact-row__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24z"/></svg></span>
        <span class="contact-row__text"><b>WhatsApp</b>(51) 99970-4848</span>
      </a>
      <a class="contact-row" href="tel:+555131104110">
        <span class="contact-row__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 17v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></span>
        <span class="contact-row__text"><b>Telefone</b>(51) 3110-4110</span>
      </a>
      <a class="contact-row" href="mailto:secretaria@dermaclin.poa.br">
        <span class="contact-row__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span>
        <span class="contact-row__text"><b>E-mail</b>secretaria@dermaclin.poa.br</span>
      </a>
    </aside>
  </div>
</section>
```

### Critical CSS

```css
.contato__grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(32px, 5vw, 64px); align-items: start; }

.form { display: flex; flex-direction: column; gap: 18px; }
.form__row { display: flex; flex-direction: column; gap: 8px; }
.form__label { font: 600 13px/1 var(--font-body); letter-spacing: 0.06em; text-transform: uppercase; color: var(--marca-ink); }
.form__input {
  width: 100%; padding: 14px 16px; border-radius: var(--r-sm);
  background: var(--neve); border: 1.5px solid var(--linha);
  font: 400 16px/1.5 var(--font-body); color: var(--tinta);
  transition: border-color .2s var(--ease-soft), box-shadow .2s var(--ease-soft), background .2s var(--ease-soft);
}
.form__input::placeholder { color: var(--tinta-soft); }
.form__input:focus {
  outline: none; background: var(--branco);
  border-color: var(--marca);
  box-shadow: 0 0 0 3px rgba(5,127,127,0.16);    /* teal focus ring */
}
.form__input--area { resize: vertical; min-height: 120px; }
.form__submit { align-self: flex-start; margin-top: 6px; }

.contato__info { display: flex; flex-direction: column; gap: 14px; }
.contact-row {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 18px 20px; border-radius: var(--r-md);
  background: var(--branco); text-decoration: none; color: var(--tinta);
  box-shadow: 0 10px 28px rgba(5,127,127,0.07);
  transition: transform .22s var(--ease-calm), box-shadow .22s var(--ease-soft);
}
.contact-row:hover { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(5,127,127,0.12); }
.contact-row__icon {
  width: 44px; height: 44px; flex: none; border-radius: var(--r-md);
  display: grid; place-items: center; background: var(--marca-soft); color: var(--marca-ink);
}
.contact-row__icon svg { width: 22px; height: 22px; }
.contact-row__text { font: 400 15px/1.5 var(--font-body); color: var(--tinta-muted); }
.contact-row__text b { display: block; font-weight: 600; color: var(--tinta); margin-bottom: 2px; }

@media (max-width: 860px) { .contato__grid { grid-template-columns: 1fr; } }
```

### Craft notes
- Every field has a **real `<label>`** (never placeholder-as-label) and an `autocomplete` hint. Inputs are ≥ 16px to prevent iOS zoom and keep older patients comfortable.
- The **focus ring is teal**: `border-color: var(--marca)` + a soft `rgba(5,127,127,0.16)` glow. Keyboard focus on the submit uses the global `outline: 3px solid var(--marca)`.
- Field grounds are `--neve` resting → `--branco` on focus, hairline `--linha`. No hard 1px grey corporate boxes.
- Info rows carry the soft-teal icon tile and the real contact data verbatim: **endereço Av. Dr. Nilo Peçanha, 1221/602 · Porto Alegre/RS**, **Seg a Sex 09h às 19h**, **WhatsApp (51) 99970-4848**, **tel (51) 3110-4110**, **e-mail secretaria@dermaclin.poa.br**. Hours use "Seg a Sex", never a travessão range.

---

## 15. Footer

**Purpose.** The calm sign-off: footer logo, navigation, contact, social links, credentials line, and copyright. Light and organized, never a second dark band (the CTA band §13 is the page's one dark moment).

**When to use.** Every page. The footer sits on `--neve` (or `--nevoa`), keeping the page light to the very bottom.

### Anatomy

```html
<footer class="footer">
  <div class="container footer__top">
    <div class="footer__brand">
      <img class="footer__logo" src="logo/logo-rodape.png" alt="Dr. Márcio Teixeira" width="200" height="56" />
      <p class="footer__tag">Dermatologia, estética e tricologia em Porto Alegre, excelência desde 1993.</p>
      <div class="footer__social">
        <a class="footer__soc" href="https://instagram.com/dr.marciodermato" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.42.4.68.8.9 1.4.17.4.36 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2a3.8 3.8 0 0 1-.9 1.4c-.4.42-.8.68-1.4.9-.4.17-1 .36-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.22-.6.48-1 .9-1.4.4-.42.8-.68 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.5a6.3 6.3 0 1 0 0 12.6 6.3 6.3 0 0 0 0-12.6zm0 10.4a4.1 4.1 0 1 1 0-8.2 4.1 4.1 0 0 1 0 8.2zm6.5-10.6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></a>
        <a class="footer__soc" href="https://facebook.com/dr.marciodermato" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg></a>
        <a class="footer__soc" href="https://wa.me/5551999704848" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24z"/></svg></a>
        <a class="footer__soc" href="https://g.page/dr-marcio-teixeira" target="_blank" rel="noopener" aria-label="Google"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 12.2c0-.7-.06-1.2-.2-1.8H12v3.4h5.4c-.1.9-.7 2.2-2 3.1l-.02.12 2.9 2.2.2.02c1.9-1.7 2.9-4.3 2.9-7.1z"/><path d="M12 22c2.6 0 4.8-.86 6.4-2.3l-3-2.3c-.8.56-1.9.95-3.4.95-2.6 0-4.8-1.7-5.6-4.1l-.12.01-3 2.3-.04.11A10 10 0 0 0 12 22z"/></svg></a>
      </div>
    </div>

    <nav class="footer__col" aria-label="Navegação do rodapé">
      <h4 class="footer__title">Navegue</h4>
      <a href="index.html">Início</a>
      <a href="tratamentos.html">Tratamentos</a>
      <a href="metodo-4d.html">Método 4D</a>
      <a href="tricologia.html">Tricologia</a>
      <a href="sobre.html">Sobre</a>
      <a href="contato.html">Contato</a>
    </nav>

    <div class="footer__col">
      <h4 class="footer__title">Contato</h4>
      <p>Av. Dr. Nilo Peçanha, 1221/602 · Porto Alegre/RS</p>
      <p>Seg a Sex · 09h às 19h</p>
      <p><a href="https://wa.me/5551999704848">(51) 99970-4848</a></p>
      <p><a href="tel:+555131104110">(51) 3110-4110</a></p>
      <p><a href="mailto:secretaria@dermaclin.poa.br">secretaria@dermaclin.poa.br</a></p>
    </div>
  </div>

  <div class="container footer__bottom">
    <small class="footer__cred">Dr. Márcio Teixeira · Dermatologista e Tricologista · CREMERS 20214 · RQE 10858 | 12078</small>
    <small class="footer__copy">Dr. Márcio Teixeira © Todos os Direitos Reservados</small>
  </div>
</footer>
```

### Critical CSS

```css
.footer { background: var(--neve); padding-top: clamp(56px, 7vw, 88px); }
.footer__top {
  display: grid; grid-template-columns: 1.4fr 0.8fr 1fr; gap: clamp(32px, 5vw, 64px);
  padding-bottom: 48px; border-bottom: 1px solid var(--linha);
}
.footer__logo { height: 50px; width: auto; }
.footer__tag { margin: 18px 0 22px; max-width: 36ch; font: 400 15px/1.7 var(--font-body); color: var(--tinta-muted); }
.footer__social { display: flex; gap: 10px; }
.footer__soc {
  width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center;
  background: var(--marca-soft); color: var(--marca-ink);
  transition: background .2s var(--ease-soft), color .2s var(--ease-soft), transform .2s var(--ease-calm);
}
.footer__soc svg { width: 20px; height: 20px; }
.footer__soc:hover { background: var(--marca); color: #fff; transform: translateY(-3px); }

.footer__col { display: flex; flex-direction: column; gap: 10px; }
.footer__title { margin: 0 0 6px; font: 600 13px/1 var(--font-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--marca-ink); }
.footer__col a, .footer__col p { font: 400 15px/1.6 var(--font-body); color: var(--tinta-muted); text-decoration: none; margin: 0; }
.footer__col a:hover { color: var(--marca-ink); }

.footer__bottom {
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px;
  padding: 22px 0 30px;
}
.footer__cred, .footer__copy { font: 400 13px/1.5 var(--font-body); color: var(--tinta-soft); }

@media (max-width: 760px) { .footer__top { grid-template-columns: 1fr; } }
```

### Craft notes
- Uses **`logo-rodape.png`**. Social order: **Instagram (@dr.marciodermato) · Facebook · WhatsApp · Google** — filled logomarks in soft-teal circles that fill with `--marca` on hover.
- The credentials line shows **CREMERS 20214 · RQE 10858 | 12078** verbatim; the copyright reads exactly **"Dr. Márcio Teixeira © Todos os Direitos Reservados"**.
- Footer stays **light** (`--neve`). It is not a second dark band; section dividers here are the faint `--linha` hairline, used sparingly. No travessões in any line.

---

## 16. WhatsApp floating button

**Purpose.** A persistent floating WhatsApp button bottom-right linking straight to `wa.me/5551999704848` — the clinic's primary contact channel, always one tap away. It is composed of a hover-reveal **pill label**, a round **WhatsApp-green button**, **CSS pulse rings**, and an unread-style **pip badge**, so it reads as a live, inviting channel without strobing.

**When to use.** Every page, fixed bottom-right. The hero's pause control sits bottom-**left** so the two never overlap. All motion is disabled under reduced motion.

> **Where this lives.** Markup at the end of `index.html` (`<a class="wpp">`); styles in `assets/css/main.css` (`.wpp` block, ~lines 490–615). **It is 100% CSS** — the rings, breathe, icon wiggle, entrance, and pip are CSS keyframes, **not** a Lottie/JS animation (an early commit message mentioned "Lottie pulse"; the shipped build is pure CSS).

### Anatomy

```html
<a class="wpp" href="https://wa.me/5551999704848?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta."
   target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
  <span class="wpp__label">Agende pelo WhatsApp</span>
  <span class="wpp__btn">
    <span class="wpp__rings" aria-hidden="true"></span>
    <svg class="wpp__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24z…"/></svg>
    <span class="wpp__pip" aria-hidden="true">1</span>
  </span>
</a>
```

### Critical CSS

```css
.wpp {
  position: fixed; right: clamp(16px, 3vw, 28px); bottom: clamp(16px, 3vw, 28px);
  z-index: var(--z-float);
  display: flex; align-items: center; justify-content: flex-end; text-decoration: none;
  animation: wpp-in 0.8s var(--ease-calm) 0.7s both;        /* gentle entrance */
}

/* hover-reveal pill label (slides out to the left of the button) */
.wpp__label {
  max-width: 0; padding: 0; margin-right: 0; overflow: hidden; white-space: nowrap;
  font: 600 0.9rem/1 var(--font-body); color: var(--marca-deep); background: #fff;
  border-radius: 999px; box-shadow: 0 12px 30px rgba(5,127,127,0.16);
  opacity: 0; transform: translateX(10px);
  transition: max-width .46s var(--ease-calm), opacity .32s var(--ease-soft),
    transform .46s var(--ease-calm), padding .46s var(--ease-calm), margin .46s var(--ease-calm);
}
.wpp:hover .wpp__label, .wpp:focus-visible .wpp__label {
  max-width: 260px; opacity: 1; transform: translateX(0); padding: 12px 18px; margin-right: 14px;
}

/* the round button — WhatsApp green, with a slow "breathe" */
.wpp__btn {
  position: relative; width: 60px; height: 60px; border-radius: 50%;
  display: grid; place-items: center; flex: none;
  background: linear-gradient(150deg, #2ce86c 0%, #25d366 45%, #12b34f 100%);
  color: #fff;
  box-shadow: 0 14px 34px rgba(18,179,79,0.42), inset 0 1px 0 rgba(255,255,255,0.32);
  animation: wpp-breathe 3.8s var(--ease-calm) infinite;
  transition: transform .26s var(--ease-calm), box-shadow .26s var(--ease-soft);
}
.wpp__icon { width: 30px; height: 30px; animation: wpp-wiggle 5s var(--ease-calm) 2.2s infinite; }

/* radar ripple rings — pure CSS pseudo-elements, staggered */
.wpp__rings { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; }
.wpp__rings::before, .wpp__rings::after {
  content: ""; position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid rgba(37,211,102,0.55);
  animation: wpp-ring 3s var(--ease-soft) infinite;
}
.wpp__rings::after { animation-delay: 1.5s; }
@keyframes wpp-ring { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(1.85); opacity: 0; } }

/* unread-style pip */
.wpp__pip {
  position: absolute; top: -3px; right: -3px; min-width: 20px; height: 20px; padding: 0 5px;
  border-radius: 999px; display: grid; place-items: center;
  font: 700 11px/1 var(--font-body); color: #fff; background: #ec4d4d; border: 2px solid #fff;
  box-shadow: 0 3px 8px rgba(0,0,0,0.18);
  animation: wpp-pip 0.5s var(--ease-calm) 1.6s both;
}
.wpp:hover .wpp__btn, .wpp:focus-visible .wpp__btn { transform: translateY(-3px) scale(1.05); }

@media (prefers-reduced-motion: reduce) {
  .wpp, .wpp__btn, .wpp__icon, .wpp__pip { animation: none; }
  .wpp__rings::before, .wpp__rings::after { animation: none; opacity: 0; }
}
```

### Craft notes
- **This float is WhatsApp green, not teal** — a deliberate exception to the one-teal rule. Because it represents the WhatsApp channel itself (with its logomark, ring color, and pip), the green reads correctly as "message us on WhatsApp"; the rest of the page stays teal. Do not recolor it to `--marca`.
- **The pulse is CSS, not Lottie.** Two staggered ring pseudo-elements (`::before` 0s, `::after` 1.5s delay) ripple outward; the button "breathes" its shadow; the icon does an occasional subtle wiggle. All four animations, the entrance, and the pip are CSS keyframes and all stop under `prefers-reduced-motion`.
- **The pip is a soft notification badge** (`#ec4d4d`, white ring) reading "1", animating in once after load — an invitation, not an alarm. Keep it a single small badge.
- The **label only appears on hover/focus**, sliding out as a white pill in `--marca-deep` — so the resting state is just the clean circle. The `?text=` pre-fills a calm opening message. Always `target="_blank"` + `rel="noopener"`, with a real `aria-label`.

---

## 17. Before / after drag comparator

**Purpose.** The "Resultados reais" proof: a two-image slider you **drag to reveal** the second image. A copy column sits beside it; the comparator stacks image B full and clips image A to a draggable width, with a divider, a round handle, and an invisible range for keyboard/SR users. **No state labels** — see § Compliance.

**When to use.** The Resultados section on Home (`#resultados`, carries `data-fio="left"`). One comparator per section, paired with the §3 header copy and a consent note.

> **Where this lives.** Markup in `index.html` (`.compare` → `.ba[data-ba]`); styles in `assets/css/main.css` (~lines 880–987); behavior in `assets/js/main.js` (~line 277), which drives `--pos` from both the range input and press-and-drag anywhere on the image.

### Anatomy

```html
<div class="compare">
  <div class="compare__copy reveal">
    … eyebrow + section title + lede (§3) …
    <p class="compare__note">Resultado real de paciente da clínica. Imagens exibidas com consentimento.</p>
  </div>

  <!-- the slider. --pos (0–100%) is the single source of truth -->
  <div class="ba reveal" data-ba style="--pos:50%">
    <img class="ba__img ba__img--after"  src="assets/img/home-b.jpg" alt="Pele da paciente, registro fotográfico 2" />
    <img class="ba__img ba__img--before" src="assets/img/home-a.jpg" alt="Pele da paciente, registro fotográfico 1" />
    <!-- NO state labels: the words "antes"/"depois" are banned site-wide (§ Compliance) -->
    <div class="ba__divider" aria-hidden="true">
      <span class="ba__handle"><svg viewBox="0 0 24 24" …><path d="M9 7 4 12l5 5M15 7l5 5-5 5"/></svg></span>
    </div>
    <input class="ba__range" type="range" min="0" max="100" value="50" step="0.1" aria-label="Comparar os dois registros fotográficos" />
  </div>
</div>
```

### Critical CSS

```css
.compare { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 72px); align-items: center; }
.compare__note { margin: 22px 0 0; font: 500 13.5px/1.6 var(--font-body); color: var(--tinta-soft); }

.ba {
  position: relative; width: 100%; max-width: 520px; margin-inline: auto;
  aspect-ratio: 4 / 5; border-radius: var(--r-lg); overflow: hidden;
  user-select: none; cursor: ew-resize; touch-action: pan-y;   /* horizontal drags slide; vertical still scrolls */
  box-shadow: 0 22px 56px rgba(5,127,127,0.16), 0 6px 16px rgba(22,48,47,0.08);
  --pos: 50%;
}
.ba__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 18%; pointer-events: none; }
/* the "before" is clipped to --pos; the "after" shows underneath in the revealed band */
.ba__img--before { clip-path: inset(0 calc(100% - var(--pos)) 0 0); }
.ba__img--after  { object-position: center 9%; }               /* nudge so features line up with --before */

.ba__label { position: absolute; top: 16px; z-index: 3; padding: 6px 14px; border-radius: var(--r-pill);
  font: 600 11px/1 var(--font-body); letter-spacing: 0.14em; text-transform: uppercase;
  color: #fff; background: rgba(4,77,77,0.6); backdrop-filter: blur(4px); pointer-events: none; }
.ba__label--before { left: 16px; } .ba__label--after { right: 16px; }

.ba__divider { position: absolute; top: 0; bottom: 0; left: var(--pos); width: 2px; margin-left: -1px;
  background: rgba(255,255,255,0.92); box-shadow: 0 0 0 1px rgba(4,77,77,0.12); z-index: 3; pointer-events: none; }
.ba__handle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center;
  background: #fff; color: var(--marca-ink); box-shadow: 0 6px 18px rgba(4,77,77,0.28); }

/* invisible range = the keyboard/SR control; pointer drag is handled on .ba itself */
.ba__range { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; z-index: 4;
  opacity: 0; cursor: ew-resize; pointer-events: none; appearance: none; background: transparent; }
.ba__range:focus-visible { outline: 3px solid var(--marca); outline-offset: 4px; }
```

### Craft notes
- **`--pos` is the whole mechanism.** A single `--pos` (0–100%) custom prop, set on `.ba`, simultaneously drives the `.ba__img--before` clip (`inset(0 calc(100% - var(--pos)) 0 0)`) and the `left` of `.ba__divider`. Move `--pos`, the reveal and the divider track together. The handle is centered on the divider.
- **Dual input for a reason.** The `<input type="range">` is the accessible control (keyboard, screen readers) but is `pointer-events: none` and `opacity: 0`; the JS adds press-and-drag on the **whole image** (Pointer Events, with capture) so users can grab anywhere, not just a thumb. Both paths write `--pos` and keep the range's `value` in sync. `touch-action: pan-y` keeps vertical page scroll working on touch.
- There are **no state-label pills** on the comparator (§ Compliance); the divider/handle are white with a teal-tinted shadow. Always pair with a **consent note** (`.compare__note`) — real-patient imagery, shown with consent. Neutral, non-comparative `alt` on both images.

---

## 18. Casos — case carousel

**Purpose.** A horizontal carousel of patient cases: each card shows a first image and **cross-fades to a second one on hover (or tap on touch)**, with a category chip. There is **no state label** — the words "antes"/"depois" are banned site-wide (§ Compliance). Cards carry a small vertical `--off` stagger so the rail reads organic, not gridded.

**When to use.** The Casos section on Home (`#casos`, `section--casos`). The track scroll-snaps and is driven by prev/next arrows; on touch, tapping a card toggles its reveal persistently.

> **Where this lives.** Markup in `index.html` (`.casos` → `.casos__track` → `.caso-item`); styles in `assets/css/main.css` (~lines 1428–1606); behavior in the `casos()` IIFE in `assets/js/main.js` (~line 317) — arrow `scrollBy`, end-state arrow disabling, and tap-to-toggle `.is-revealed`.

### Anatomy

```html
<section class="section section--casos" id="casos" aria-labelledby="casos-title">
  <div class="container casos__top">
    <header class="casos__head reveal">
      <div class="casos__intro">
        … eyebrow "Resultados" + title + lede (§3) …
        <p class="section__lede casos__hint">Passe o cursor sobre a foto, ou toque nela, para ver o resultado.</p>
      </div>
      <div class="casos__nav" role="group" aria-label="Navegar pelos resultados">
        <button class="casos__arrow" type="button" data-casos-prev aria-label="Ver caso anterior" disabled><svg …/></button>
        <button class="casos__arrow" type="button" data-casos-next aria-label="Ver próximo caso"><svg …/></button>
      </div>
    </header>
  </div>

  <div class="casos__viewport reveal">
    <ul class="casos__track" data-casos-track tabindex="0" role="list" aria-label="Casos de pacientes da clínica">
      <li class="caso-item">
        <!-- --off staggers this card's vertical offset (× --casos-off-step) -->
        <article class="caso" style="--off:2.6">
          <button class="caso__toggle" type="button" aria-pressed="false" aria-label="Tratamento Capilar: ver o resultado">
            <span class="caso__media">
              <img class="caso__img caso__img--a" src="imagens/casos/capilar-01a.jpg" alt="Tratamento Capilar, registro fotográfico 1" loading="lazy" width="560" height="896" />
              <img class="caso__img caso__img--b" src="imagens/casos/capilar-01b.jpg" alt="Tratamento Capilar, registro fotográfico 2" loading="lazy" width="560" height="896" />
            </span>
            <span class="caso__meta">
              <span class="caso__cat">Tratamento Capilar</span>
            </span>
          </button>
        </article>
      </li>
      <!-- … one .caso-item per case (categories repeat: Tratamento Capilar, Preenchimento Labial, Laser CO₂, Liftera) … -->
    </ul>
  </div>
</section>
```

### Critical CSS

```css
.casos { --casos-off-step: clamp(8px, 1.4vw, 18px); }            /* the unit each --off multiplies */
.casos__track {
  --per: 6; --gap: clamp(14px, 1.3vw, 22px);                     /* cards in view: 6 → 5 → 4 → 3 → 2.2 */
  display: flex; align-items: flex-start; gap: var(--gap);
  padding: 18px var(--gutter) 26px;
  overflow-x: auto; scroll-snap-type: x proximity; scroll-padding-inline: var(--gutter);
  scrollbar-width: none;
}
.casos__track::-webkit-scrollbar { display: none; }
.caso-item { flex: 0 0 calc((100vw - 2 * var(--gutter) - (var(--per) - 1) * var(--gap)) / var(--per)); scroll-snap-align: start; }
.caso { margin-top: calc(var(--off, 0) * var(--casos-off-step)); }   /* the organic stagger */

.caso__toggle { display: block; width: 100%; padding: 0; border: 0; background: none; cursor: pointer; text-align: left; }
.caso__media {
  position: relative; aspect-ratio: 5 / 8; border-radius: var(--r-lg); overflow: hidden; background: var(--nevoa);
  box-shadow: 0 16px 40px rgba(5,127,127,0.12), 0 4px 12px rgba(22,48,47,0.06);
  transition: transform .4s var(--ease-calm), box-shadow .4s var(--ease-soft);
}
.caso__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  transition: opacity .55s var(--ease-glide), transform .8s var(--ease-calm); }
.caso__img--b { opacity: 0; transform: scale(1.04); }

/* reveal image B on hover / keyboard focus / tap-toggled .is-revealed */
.caso__toggle:hover .caso__img--b,
.caso__toggle:focus-visible .caso__img--b,
.caso.is-revealed .caso__img--b { opacity: 1; transform: none; }
.caso__toggle:hover .caso__img--a,
.caso.is-revealed .caso__img--a { opacity: 0; }
.caso__toggle:hover .caso__media,
.caso__toggle:focus-visible .caso__media { transform: translateY(-6px); box-shadow: 0 30px 64px rgba(5,127,127,0.2), 0 8px 20px rgba(22,48,47,0.08); }

/* state tag: two stacked labels cross-fade in place */
.caso__tag { display: inline-grid; padding: 6px 13px; border-radius: var(--r-pill);
  background: rgba(255,255,255,0.88); backdrop-filter: blur(6px); box-shadow: 0 6px 18px rgba(5,127,127,0.14);
  font: 600 11px/1 var(--font-body); letter-spacing: 0.12em; text-transform: uppercase; color: var(--marca-ink); }
.caso__tag-state { grid-area: 1 / 1; transition: opacity .4s var(--ease-glide); }   /* overlap so they swap */
/* NOTE: the old .caso__tag state pill was removed — see § Compliance. */
.caso__cat { padding: 6px 12px; border-radius: var(--r-pill); background: rgba(4,77,77,0.42); backdrop-filter: blur(6px);
  font: 600 11px/1.2 var(--font-body); /* … white caps category chip … */ }

@media (prefers-reduced-motion: reduce) {
  .caso__img { transition: opacity 0.001ms; } .caso__img--b { transform: none; }
}
```

### Craft notes
- **Reveal works three ways.** Hover and keyboard focus reveal image B while held; a **tap** (the whole card is a `<button class="caso__toggle">`) toggles `.is-revealed` persistently for touch devices, syncing `aria-pressed`. The two `.caso__img`s cross-fade (B also un-scales from `1.04`). The card carries only a `.caso__cat` category chip — no state label (§ Compliance).
- **`--off` is the organic stagger.** Each `.caso` reads `--off` (e.g. `2.6`, `0`, `4.4`, …) and offsets its top margin by `--off × --casos-off-step`, so the rail of portrait cards sits at varied heights instead of a flat row. Keep values small and varied; it is decoration, not a grid.
- **Full-bleed snap rail.** `.casos__track` is a flex rail padded to `--gutter`, scroll-snaps, hides its scrollbar, and shows `--per` cards (6 down to 2.2 across breakpoints). Arrows `scrollBy` one card+gap and disable at the ends; the track is keyboard-scrollable (`tabindex="0"`). Cards are `5 / 8` portrait with the brand `--r-lg` radius and teal-tinted shadow. Every image is `loading="lazy"` with real `alt`.

---

## 19. Fio de cabelo motif

**Purpose.** The brand's signature **background motif**: a single sinuous hair strand — the curve from the brand mark — drawn in the **free lateral margin** of a section, drawing itself as the section scrolls through the viewport. It is the quiet thread that ties the pages to the trichology/dermatology identity without ever crowding the content.

**When to use.** Opt a section in with a `data-fio` attribute. Sides **alternate** down the page by authoring choice (`left` / `right`), always landing in the empty gutter beside the boxed `.container`, never over text. Currently used on Resultados (`left`), Método (`right`), Dr. Márcio (`right`), and Avaliações (`left`).

> **Where this lives.** Opt-in via `data-fio="left|right"` on a `<section>`; the SVG is generated at runtime by the `fioMotif()` IIFE in `assets/js/main.js` (~line 433). Styling hooks (`.fio-sec`, `.fio-sec__main`, `.fio-sec__sheen`) are in `assets/css/main.css` (~lines 795–820). It depends on the section being a positioned, `overflow: clip` container (the standard `.section`).

### Anatomy

```html
<!-- author-side opt-in: just add data-fio. JS appends the <svg.fio-sec> as the last child. -->
<section class="section section--branco" id="resultados" data-fio="left">
  <div class="container"> … </div>
  <!-- main.js injects here:
  <svg class="fio-sec" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 W H">
    <path class="fio-sec__main"  pathLength="1" fill="none" />   stroke: url(#fio-grad) on light, #dff3ef on deep
    <path class="fio-sec__sheen" pathLength="1" fill="none" />   a travelling highlight segment
  </svg>
  -->
</section>
```

### Critical CSS

```css
/* one strand per section, in the free lateral margin, behind the content */
.fio-sec { position: absolute; inset: 0; width: 100%; height: 100%; z-index: var(--z-base); pointer-events: none; }
.fio-sec__main  { stroke-width: 1.3px; opacity: 0.5; stroke-linecap: round; stroke-linejoin: round; }
.fio-sec__sheen { stroke-width: 2.4px; opacity: 0; stroke-linecap: round; filter: url(#fio-soft); }  /* soft blur */
@media (prefers-reduced-motion: reduce) { .fio-sec__sheen { opacity: 0 !important; } }
```

```js
// shared <defs> injected once into <body>: the teal gradient + the sheen blur
// <linearGradient id="fio-grad"> #19b3a6 → #057f7f → #044d4d (top→bottom)
// <filter id="fio-soft"> feGaussianBlur stdDeviation="2"
```

### Craft notes
- **Opting in is one attribute.** Add `data-fio="left"` or `data-fio="right"` to any `.section`. `fioMotif()` measures the gutter between the viewport edge and the `.container` on the chosen side, draws a vertical wavy path centered in that gutter (amplitude clamped to the gutter, with a touch of "micro life" so it reads as a hair, not a sine wave), and appends it as the section's last child so it sits at `--z-base`, **behind the content but above the background**. Because `.section` is `overflow: clip`, the strand touches and vanishes exactly at the section divide.
- **Alternate the sides** down the page (left, right, right, left, …) so the motif breathes across the layout. The strand only renders when there is real free margin: `fioMotif()` hides it when the viewport is `< 1080px` or the gutter is `< 26px` (so it never collides with text on narrow screens).
- **Color is context-aware.** On light sections the main stroke is the teal gradient `url(#fio-grad)` with a `#1ec7b6` sheen; on deep sections (`section--deep`) it flips to a pale `#dff3ef` strand with an `#f1fffb` sheen so it stays legible on the dark band.
- **Scroll-driven, motion-safe.** The path uses `pathLength="1"`; `strokeDashoffset` tracks the section's progress through the viewport so the strand **draws itself** as you scroll, while a short `.fio-sec__sheen` segment travels along it (fading at the ends). Under `prefers-reduced-motion`, the strand renders fully drawn and the sheen is suppressed.

---

## Component composition rules

When adding a new section, pick the closest pattern before inventing:

| Pattern | Used by | When to pick |
|---|---|---|
| **Header + auto-fit card grid** | Diferenciais, Tratamentos | A set of peer items reads as a calm grid |
| **Numbered axis cards** | Método 4D | Anything that explains the four eixos — keep it identical everywhere |
| **Two-column split (image + copy)** | Sobre, Método 4D feature, Resultados comparator | A section pairs real photography/art (or the §17 slider) with text |
| **Full-bleed snap rail + arrows** | Casos, Avaliações | A set of items reads as a browsable carousel rather than a static grid |
| **Masonry frames + lightbox** | Nosso Espaço gallery | Showing the real clinic / a set of photos |
| **Single deep-teal band** | Appointment CTA, (footer stays light) | The one conversion moment — used **once** per page |
| **Form + info rows** | Contato | The page asks for an action and needs the real contact data |
| **Lateral background motif** | Sections via `data-fio` | A quiet brand thread in the free gutter — opt in, alternate sides |

Two standing rules across all of them: **one teal, used with discipline** (text teal is always `--marca-ink` or `--marca-deep`, never `--marca-bright`), and **one dark band per page** (the §13 CTA). The two sanctioned exceptions to "one teal" are the **Google-gold review stars** (§11) and the **WhatsApp-green float** (§16) — both earn their hue because they represent an external channel. When you feel the urge to add a *third* saturated hue or a second dark section, add whitespace instead.
