# COMPONENTS.md — The Dr. Márcio Teixeira component library

Read this before adding or modifying any component. The brand already has a defined language — **extend the closest analog here before inventing.** Every component obeys the prime directive from DESIGN.md: **light canvas, one disciplined teal, elegant Cormorant display over Poppins UI, softly rounded corners, soft teal-tinted shadows, calm motion, impeccable accessibility.** All class names are BEM (`block__element--modifier`).

Use the **exact tokens** from DESIGN.md — never raw hex. The recurring ones below are: `--marca` `--marca-deep` `--marca-bright` `--marca-ink` `--marca-soft` `--marca-wash`, `--branco` `--neve` `--nevoa` `--tinta` `--tinta-muted` `--tinta-soft` `--linha`, `--areia` `--areia-deep` `--nude`, the gradients `--grad-marca` `--grad-deep` `--grad-spa` `--grad-pele`, type `--font-display` (Cormorant Garamond, ≥22px display only) and `--font-body` (Poppins, everything else), radii `--r-sm` `--r-md` `--r-lg` `--r-xl` `--r-pill`, and motion `--ease-calm` `--ease-soft` `--ease-glide`.

Two craft reflexes carried into every snippet below:
- **Shadows are teal-tinted, never black.** Resting `0 14px 38px rgba(5,127,127,0.08), 0 4px 12px rgba(22,48,47,0.05)`; the brand never uses `rgba(0,0,0, >0.16)`.
- **Copy has no travessões (—).** Use commas, colons, or `·` (middle dot). Portuguese, calm, doctor-led.

## Component index

| # | Component | Section | Defining trait |
|---|---|---|---|
| 1 | Top nav (clean / glass bar) | Header | Transparent over hero, solid white + soft teal shadow when scrolled; logo swaps |
| 2 | Button system | Global | Teal pill primary (glow), ghost outline, WhatsApp variant |
| 3 | Eyebrow + section header | Every section | Caps teal eyebrow with rule → serif title with one `.hl` word → Poppins lede |
| 4 | Video hero | Hero | Full-bleed muted video, deep-teal scrim, Cormorant title, two CTAs, scroll cue |
| 5 | Differentials grid | Diferenciais | 5 cards, soft-teal icon tile, title, copy |
| 6 | Método 4D axis card + 4-axis layout | Método 4D | Numbered 01–04, serif eixo title, description |
| 7 | Treatment card + grid | Tratamentos | Image, title, "Eixo N ·" label, `data-eixo` for filtering |
| 8 | Doctor / About block | Sobre | Portrait frame, bio, credential chips, serif signature quote |
| 9 | Clinic gallery ("Nosso Espaço") | Sobre / Contato | Rounded ambiente frames + lightbox trigger |
| 10 | Stats row | Anywhere | Serif number in `--marca-deep` + Poppins caps key |
| 11 | Testimonial card | Depoimentos | Quote, patient name, teal stars (Google tone) |
| 12 | FAQ accordion item | FAQ | Question button + answer panel, teal +/− indicator |
| 13 | Appointment CTA band | Pre-footer | The one deep-teal full-color band |
| 14 | Contact form + info rows | Contato | Labeled fields, teal focus ring, contact rows |
| 15 | Footer | Footer | Logo, nav, contact, social, credentials line |
| 16 | WhatsApp floating button | Global | Fixed teal circle → wa.me |

---

## 1. Top nav — clean / glass bar

**Purpose.** The fixed header. It starts **transparent over the video hero** (the `logo-header-branco.png` and white links read against the deep-teal scrim), then becomes a **solid white bar with a soft teal shadow** once the user scrolls past the hero, swapping to `logo-header-colorido.png` and teal-ink links. This is the premium-clinical equivalent of the dark "glass nav" in other systems: here it is **bright and calm**, never glass-on-dark.

**When to use.** Every page. The transparent-over-hero state only applies on pages that open with the video hero (Início); on inner pages (`Tratamentos`, `Sobre`, `Contato`), start in the solid state by adding `is-solid` on load.

### Anatomy

```html
<header class="nav" data-nav>
  <div class="nav__inner">
    <a class="nav__brand" href="index.html" aria-label="Dr. Márcio Teixeira, início">
      <img class="nav__logo nav__logo--light" src="logo/logo-header-branco.png" alt="Dr. Márcio Teixeira" width="190" height="52" />
      <img class="nav__logo nav__logo--solid" src="logo/logo-header-colorido.png" alt="Dr. Márcio Teixeira" width="190" height="52" />
    </a>

    <nav class="nav__links" aria-label="Navegação principal">
      <a class="nav__link" href="index.html" aria-current="page">Início</a>
      <a class="nav__link" href="tratamentos.html">Tratamentos</a>
      <a class="nav__link" href="metodo-4d.html">Método 4D</a>
      <a class="nav__link" href="tricologia.html">Tricologia</a>
      <a class="nav__link" href="sobre.html">Sobre</a>
      <a class="nav__link" href="contato.html">Contato</a>
    </nav>

    <a class="btn btn--primary nav__cta" href="https://wa.me/5551999704848?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta." target="_blank" rel="noopener">
      Agende sua consulta
    </a>

    <button class="nav__burger" data-burger type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-drawer">
      <span></span><span></span><span></span>
    </button>
  </div>

  <div class="nav-drawer" id="nav-drawer" data-drawer aria-hidden="true">
    <a class="nav-drawer__link" href="index.html">Início</a>
    <a class="nav-drawer__link" href="tratamentos.html">Tratamentos</a>
    <a class="nav-drawer__link" href="metodo-4d.html">Método 4D</a>
    <a class="nav-drawer__link" href="tricologia.html">Tricologia</a>
    <a class="nav-drawer__link" href="sobre.html">Sobre</a>
    <a class="nav-drawer__link" href="contato.html">Contato</a>
    <a class="btn btn--primary nav-drawer__cta" href="https://wa.me/5551999704848" target="_blank" rel="noopener">Agende sua consulta</a>
  </div>
</header>
```

### Critical CSS

```css
.nav {
  position: fixed; inset: 0 0 auto 0; z-index: 100;
  transition: background .35s var(--ease-soft), box-shadow .35s var(--ease-soft), padding .35s var(--ease-soft);
  background: transparent;
}
.nav__inner {
  max-width: 1240px; margin-inline: auto;
  display: flex; align-items: center; gap: 24px;
  padding: 22px clamp(20px, 5vw, 56px);
  transition: padding .35s var(--ease-soft);
}

/* logo cross-swap: white mark over hero, colored mark when solid */
.nav__logo { height: 46px; width: auto; transition: height .35s var(--ease-soft); display: block; }
.nav__logo--solid { display: none; }

/* default (over hero): white links */
.nav__links { display: flex; gap: 4px; margin-inline: auto; }
.nav__link {
  padding: 9px 16px; border-radius: var(--r-pill);
  font: 500 15px/1 var(--font-body); letter-spacing: 0.01em;
  color: rgba(255,255,255,0.92);
  transition: background .2s var(--ease-soft), color .2s var(--ease-soft);
}
.nav__link:hover, .nav__link:focus-visible { background: rgba(255,255,255,0.14); color: #fff; }
.nav__link[aria-current="page"] { color: #fff; }

/* SCROLLED / inner-page solid state */
.nav.is-solid {
  background: var(--branco);
  box-shadow: 0 10px 34px rgba(5,127,127,0.10), 0 2px 8px rgba(22,48,47,0.05);
}
.nav.is-solid .nav__inner { padding-block: 14px; }
.nav.is-solid .nav__logo { height: 40px; }
.nav.is-solid .nav__logo--light { display: none; }
.nav.is-solid .nav__logo--solid { display: block; }
.nav.is-solid .nav__link { color: var(--marca-ink); }
.nav.is-solid .nav__link:hover, .nav.is-solid .nav__link:focus-visible { background: var(--marca-soft); color: var(--marca-deep); }
.nav.is-solid .nav__link[aria-current="page"] { color: var(--marca-deep); background: var(--marca-soft); }

.nav__burger { display: none; flex-direction: column; gap: 5px; width: 44px; height: 44px; align-items: center; justify-content: center; background: none; border: 0; cursor: pointer; }
.nav__burger span { width: 24px; height: 2px; border-radius: 2px; background: #fff; transition: background .3s var(--ease-soft); }
.nav.is-solid .nav__burger span { background: var(--marca-deep); }

@media (max-width: 920px) {
  .nav__links, .nav__cta { display: none; }
  .nav__burger { display: flex; }
}
```

### Craft notes
- The state flip is driven by a single `IntersectionObserver` on a sentinel just below the hero (or a `scrollY > 60` check). JS toggles `.is-solid` on `[data-nav]` — see INTERACTIONS § Scrolled nav. Never darken; the solid state is **white with a soft teal shadow**, not a dark bar.
- Two logo `<img>`s with a `display` swap is more robust than one `<img>` with a runtime `src` change (no flash). Keep both at the same intrinsic size to avoid layout shift.
- The CTA in the bar is the **primary** button (§2) — teal pill, white text. Inner pages set `is-solid` immediately so links never render white on white.
- Touch targets ≥ 44px; the burger is a full 44×44 hit area. Focus rings: `outline: 3px solid var(--marca); outline-offset: 3px`.

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

**Purpose.** The first impression on Início: a full-bleed muted background video of the clinic, a **deep-teal scrim** for legibility, a confident Cormorant title with one highlighted phrase, a supporting Poppins line, two CTAs, and a scroll cue. Calm and cinematic without being a flashy med-spa.

**When to use.** Home only. Inner pages use the lighter page-header pattern (eyebrow + title on `--neve`), not the video.

### Anatomy

```html
<section class="hero" aria-label="Apresentação Dr. Márcio Teixeira">
  <div class="hero__media" aria-hidden="true">
    <video class="hero__video" data-hero-video
           autoplay muted loop playsinline preload="metadata"
           poster="imagens/hero-poster.jpg">
      <source src="video-hero/video-hero.mp4" type="video/mp4" />
    </video>
    <div class="hero__scrim"></div>
  </div>

  <div class="hero__inner">
    <p class="hero__eyebrow">Dermatologia, estética e tricologia · Porto Alegre</p>
    <h1 class="hero__title">
      Seu dermatologista de confiança, com <span class="hl-light">resultados naturais</span>
    </h1>
    <p class="hero__lede">
      Cuidado personalizado e excelência desde 1993, com quem entende profundamente de pele.
    </p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="https://wa.me/5551999704848" target="_blank" rel="noopener">Agende sua consulta</a>
      <a class="btn btn--ghost-on-deep" href="metodo-4d.html">Conheça o Método 4D</a>
    </div>
  </div>

  <a class="hero__cue" href="#diferenciais" aria-label="Rolar para saber mais">
    <span class="hero__cue-label">Saiba mais</span>
    <span class="hero__cue-line" aria-hidden="true"></span>
  </a>

  <button class="hero__pause" data-hero-pause type="button" aria-label="Pausar vídeo">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
  </button>
</section>
```

### Critical CSS

```css
.hero { position: relative; min-height: 100svh; display: grid; align-items: center; overflow: hidden; isolation: isolate; }
.hero__media { position: absolute; inset: 0; z-index: -1; }
.hero__video { width: 100%; height: 100%; object-fit: cover; }

/* deep-teal scrim — legibility without killing the footage */
.hero__scrim {
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, rgba(4,77,77,0.55) 0%, rgba(4,77,77,0.30) 40%, rgba(3,64,63,0.66) 100%),
    radial-gradient(120% 90% at 18% 70%, rgba(3,64,63,0.45), transparent 60%);
}

.hero__inner {
  max-width: 1240px; width: 100%; margin-inline: auto;
  padding: 0 clamp(20px, 5vw, 56px); padding-top: var(--nav-h, 96px);
  position: relative; z-index: 1; max-inline-size: 980px;
}
.hero__eyebrow {
  font: 600 13px/1 var(--font-body); letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(255,255,255,0.85); margin: 0 0 22px;
}
.hero__title {
  margin: 0; max-width: 16ch;
  font-family: var(--font-display); font-weight: 600;
  font-size: clamp(40px, 6vw, 84px); line-height: 1.05; letter-spacing: 0.005em;
  color: #fff;
}
.hl-light { color: #fff; font-style: italic; font-weight: 500; }   /* teal-bright glyph would fail on video; italic-white reads premium */
.hero__lede {
  margin: 24px 0 0; max-width: 52ch;
  font: 300 clamp(17px, 1.6vw, 21px)/1.6 var(--font-body);
  color: rgba(255,255,255,0.90);
}
.hero__actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 38px; }

.hero__cue {
  position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%);
  display: inline-flex; flex-direction: column; align-items: center; gap: 10px;
  font: 600 11px/1 var(--font-body); letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(255,255,255,0.8); text-decoration: none; z-index: 2;
}
.hero__cue-line { width: 1.5px; height: 40px; background: linear-gradient(rgba(255,255,255,0.8), transparent); animation: cue-drift 2.6s var(--ease-calm) infinite; }
@keyframes cue-drift { 0%,100% { transform: translateY(0); opacity: .55; } 50% { transform: translateY(6px); opacity: 1; } }

.hero__pause {
  position: absolute; right: clamp(16px, 4vw, 40px); bottom: 28px; z-index: 2;
  width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(255,255,255,0.14); color: #fff; border: 1px solid rgba(255,255,255,0.3);
  cursor: pointer; backdrop-filter: blur(6px);
}
.hero__pause svg { width: 18px; height: 18px; }

@media (prefers-reduced-motion: reduce) {
  .hero__video { display: none; }        /* poster stays via background on .hero__media, or show poster image */
  .hero__cue-line { animation: none; }
}
```

### Craft notes
- The video is **muted, looped, playsinline, with a poster** and a real **pause control** — never force unstoppable motion. Under `prefers-reduced-motion`, suppress the video and rely on the poster (set the poster as a `background-image` on `.hero__media` so it remains when the `<video>` hides).
- The highlighted phrase uses **italic white** (`.hl-light`), not teal: `--marca` and especially `--marca-bright` would fail contrast over footage. Teal lives in the buttons and the scrim, not the hero text color.
- Two CTAs only: the teal **primary** (AGENDE SUA CONSULTA) plus a **ghost-on-deep** outline (CONHEÇA O MÉTODO 4D). Never three.
- The scrim is **deep teal**, tying the hero to the brand instead of a generic black overlay. Keep the bottom stop heaviest so the CTAs and cue read.
- Title ≤ ~16ch so it wraps to two or three composed lines; never a single cramped line of giant serif.

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

**When to use.** Below the hero or inside the Sobre block. The brand's confirmed figures: **30 anos**, **4 eixos**, **+20 tratamentos** (extend with "desde 1993" or "congressos" only with confirmed copy).

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

## 11. Testimonial card

**Purpose.** Patient words in a Google-reviews tone: a teal star row, the quote at a comfortable reading size, and a simple attribution. Quiet social proof, not loud.

**When to use.** A "Depoimentos" section. Keep three visible; if more, a calm manual carousel (no autoplay, or slow autoplay that pauses on hover and respects reduced motion).

### Anatomy

```html
<article class="quote reveal" style="--i:0">
  <div class="quote__stars" aria-label="5 de 5 estrelas">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 21.3l1.4-6.8L2.2 9.7l6.9-.7z"/></svg>
    <!-- repeat ×5 -->
  </div>
  <p class="quote__text">
    Atendimento humano e cuidadoso do começo ao fim. O Dr. Márcio explica tudo com calma e os resultados ficaram muito naturais.
  </p>
  <footer class="quote__by">
    <span class="quote__avatar" aria-hidden="true">M</span>
    <span class="quote__name">Mariana L. <span class="quote__src">via Google</span></span>
  </footer>
</article>
```

### Critical CSS

```css
.quote {
  background: var(--branco); border-radius: var(--r-lg); padding: 34px 32px;
  display: flex; flex-direction: column; gap: 18px;
  box-shadow: 0 14px 38px rgba(5,127,127,0.08), 0 4px 12px rgba(22,48,47,0.05);
}
.quote__stars { display: inline-flex; gap: 3px; color: var(--marca); }
.quote__stars svg { width: 19px; height: 19px; }
.quote__text { margin: 0; font: 400 17px/1.7 var(--font-body); color: var(--tinta); }
.quote__by { display: flex; align-items: center; gap: 12px; margin-top: auto; }
.quote__avatar {
  width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; flex: none;
  background: var(--marca-soft); color: var(--marca-ink); font: 600 16px/1 var(--font-body);
}
.quote__name { font: 600 14.5px/1.3 var(--font-body); color: var(--tinta); }
.quote__src { display: block; font: 500 12.5px/1 var(--font-body); color: var(--tinta-soft); margin-top: 2px; }
```

### Craft notes
- Stars are filled in `--marca` (full teal is fine on a star glyph, not body text). Keep five; the `aria-label` carries the rating for screen readers.
- Avatars are a **teal-soft initial circle** — never stock faces (privacy + trust). The "via Google" tag sets the honest review tone without a loud badge.
- Quote text stays ≥ 17px, line-height 1.7. No travessões in patient copy — clean it on intake.

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

**Purpose.** A persistent teal circle bottom-right linking straight to WhatsApp (`wa.me/5551999704848`) — the clinic's primary contact channel, always one tap away.

**When to use.** Every page, fixed. A single gentle pulse ring signals it without strobing; disabled under reduced motion.

### Anatomy

```html
<a class="wpp" href="https://wa.me/5551999704848?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta."
   target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24zM6.6 20.13c1.65.98 3.22 1.57 5.4 1.57 5.44 0 9.86-4.42 9.86-9.84S17.44 2.02 12 2.02 2.14 6.44 2.14 11.86c0 2.29.67 4 1.79 5.78l-.99 3.62 3.66-1.13z"/></svg>
</a>
```

### Critical CSS

```css
.wpp {
  position: fixed; right: 20px; bottom: 20px; z-index: 90;
  width: 60px; height: 60px; border-radius: 50%; display: grid; place-items: center;
  background: var(--marca); color: #fff; text-decoration: none;
  box-shadow: 0 12px 30px rgba(5,127,127,0.30);
  transition: transform .25s var(--ease-calm), background .25s var(--ease-soft), box-shadow .25s var(--ease-soft);
}
.wpp svg { width: 32px; height: 32px; position: relative; z-index: 1; }
.wpp::before {
  content: ""; position: absolute; inset: 0; border-radius: 50%; background: var(--marca); z-index: 0;
  animation: wpp-ring 3s var(--ease-soft) infinite;
}
@keyframes wpp-ring { 0% { transform: scale(1); opacity: .5; } 70%, 100% { transform: scale(1.7); opacity: 0; } }
.wpp:hover { transform: translateY(-3px) scale(1.06); background: var(--marca-deep); box-shadow: 0 16px 40px rgba(5,127,127,0.38); }
.wpp:hover::before { animation-play-state: paused; opacity: 0; }
.wpp:focus-visible { outline: 3px solid var(--marca); outline-offset: 3px; }

@media (max-width: 560px) { .wpp { width: 54px; height: 54px; right: 16px; bottom: 16px; } }
@media (prefers-reduced-motion: reduce) { .wpp::before { animation: none; opacity: 0; } }
```

### Craft notes
- The float is **teal** (`--marca`), not WhatsApp green, so it reads as *Dr. Márcio*, not a generic badge. The pulse ring is slow (3s) and gentle, paused on hover, removed under reduced motion.
- Shadow is the teal CTA glow. On mobile it shrinks to 54px so it never covers footer links or the contact rows.
- The `?text=` pre-fills a calm, on-brand opening message. Always `target="_blank"` + `rel="noopener"`, with a real `aria-label`.

---

## Component composition rules

When adding a new section, pick the closest pattern before inventing:

| Pattern | Used by | When to pick |
|---|---|---|
| **Header + auto-fit card grid** | Diferenciais, Tratamentos, Depoimentos | A set of peer items reads as a calm grid |
| **Numbered axis cards** | Método 4D | Anything that explains the four eixos — keep it identical everywhere |
| **Two-column split (image + copy)** | Sobre, Método 4D feature | A section pairs real photography/art with text |
| **Masonry frames + lightbox** | Nosso Espaço gallery | Showing the real clinic / a set of photos |
| **Single deep-teal band** | Appointment CTA, (footer stays light) | The one conversion moment — used **once** per page |
| **Form + info rows** | Contato | The page asks for an action and needs the real contact data |

Two standing rules across all of them: **one teal, used with discipline** (text teal is always `--marca-ink` or `--marca-deep`, never `--marca-bright`), and **one dark band per page** (the §13 CTA). When you feel the urge to add a second saturated hue or a second dark section, add whitespace instead.
