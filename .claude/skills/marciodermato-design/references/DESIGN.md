# DESIGN.md — Tokens, palette, typography, voice

This is the source of truth for every visual decision for **Dr. Márcio Teixeira**. Read it end-to-end before writing your first CSS rule. Once the reference implementation exists, mirror its `main.css` structure and naming.

**Prime directive: this brand is LIGHT and PREMIUM.** White canvas, faint teal off-white, one disciplined teal, elegant serif display, generous space, warmed by a restrained sand/nude. If you catch yourself typing a near-black default background or a second loud color, you're off-brand.

## Table of contents
1. Brand DNA
2. Color system (tokens + roles)
3. Typography (Cormorant Garamond + Poppins)
4. Spacing & radii
5. Shadows & elevation
6. Motion tokens
7. Voice & copy conventions
8. Content building blocks (Método 4D, treatments, contact)
9. Iconography & the brand curve
10. Accessibility — not optional
11. Anti-patterns to avoid

---

## 1. Brand DNA

Dr. Márcio Teixeira is a **dermatology, aesthetic and surgical** practice (plus **tricologia**) in **Porto Alegre, RS**, with **excellence since 1993** and the proprietary **Método 4D**. The identity must hold these tensions:

| Tension | Resolution |
|---|---|
| Scientific vs. human | Real credibility (30 anos, congressos, SBD, Método 4D) delivered with warm, calm, doctor-led language |
| Clinical vs. premium | Clean teal-and-white cleanliness, but elevated by an elegant serif, real photography, and generous whitespace — a private clinic, not a hospital |
| Health vs. beauty | Teal (saúde, confiança, higiene) is dominant; a restrained warm **sand/nude** carries the "beleza da pele" side. Never let beauty tip into med-spa loudness |
| Authoritative vs. empathetic | Confident expertise ("resultados naturais com quem entende de pele") with acolhimento and individual respect |

The mark: a **rounded teal square holding a sinuous white curve** — glossy, calm, medical-clean. The tone is **trustworthy, sophisticated, calm, natural.**

---

## 2. Color system

All colors live as CSS custom properties on `:root`. **Do not use raw hex in component CSS.** Reach for the token. The brand teal and Poppins come straight from the brandbook (`logo/brandbook.pdf`); the teal variants and the warm accent are the senior-derived system that makes a one-color brand work at scale.

### The brand teal (and its working variants)

| Token | Hex | RGB | Role |
|---|---|---|---|
| `--marca` | `#057f7f` | 5,127,127 | **The brand teal** (official brandbook value). Buttons, icon tiles, key accents, the mark, eyebrow dots, links |
| `--marca-deep` | `#044d4d` | 4,77,77 | Deep teal — large display headings on light, the footer, the one optional dark band, gradient end |
| `--marca-bright` | `#19b3a6` | 25,179,166 | Bright turquoise (the lighter logo tone) — **gradient partner & subtle highlight only**, never large flat fills or text |
| `--marca-ink` | `#055f5f` | 5,95,95 | Teal as **body-size text / links / eyebrow text** (the contrast-safe shade on white & on `--marca-soft`) |
| `--marca-soft` | `#e8f4f4` | 232,244,244 | Soft teal tint — card backgrounds, eyebrow pills, icon-tile grounds, info plates |
| `--marca-wash` | `#f1f8f8` | 241,248,248 | Faintest teal wash — alternating section background |

> Contrast note: `--marca` (#057f7f) on white is ~4.4:1 — fine for large/bold, borderline for small body. **For text, default to `--marca-ink` (#055f5f, ~5.3:1).** `--marca-deep` is safe everywhere as text. `--marca-bright` **fails** as text on white — use it only inside gradients or as a thin accent on dark teal.

### Core surfaces & ink

| Token | Value | Use |
|---|---|---|
| `--branco` | `#ffffff` | Default page/section background |
| `--neve` | `#f4f9f9` | Clinical cool off-white — the primary "breathing" alternate background |
| `--nevoa` | `#eaf3f3` | Soft teal-grey wash — nested fills, deeper alternating band, input grounds |
| `--tinta` | `#16302f` | Default body & heading ink — deep cool slate. **Never `#000`.** |
| `--tinta-muted` | `#566b6a` | Secondary copy, captions, meta, labels |
| `--tinta-soft` | `#8aa0a0` | Placeholders, disabled, faint labels |
| `--linha` | `rgba(5,127,127,0.12)` | Hairlines / borders when truly needed (prefer the curve, washes, whitespace) |

### The warm accent — "beleza da pele" (use sparingly)

A single restrained warm neutral keeps the teal from reading cold and clinical, and nods to skin/beauty. It is an **accent**, not a co-primary: small areas, warm photo grounds, the occasional sand band behind a beauty/results section, soft dividers. Never a saturated gold or pink.

| Token | Value | Use |
|---|---|---|
| `--areia` | `#e9ded2` | Warm sand — alternate warm section ground, soft cards on the beauty/results side |
| `--areia-deep` | `#cdb6a2` | Deeper sand — borders/labels on warm grounds, subtle warm accent |
| `--nude` | `#d8c4b4` | Nude/skin tone — tiny accents, gradient warmth, photo overlays |

### Gradients (sparingly — CTAs, the mark, feature bands)

```css
:root {
  --grad-marca: linear-gradient(140deg, #19b3a6 0%, #057f7f 52%, #044d4d 100%); /* the logo's teal depth */
  --grad-spa:   linear-gradient(180deg, #f4f9f9 0%, #ffffff 100%);              /* clean clinical wash */
  --grad-deep:  linear-gradient(160deg, #057f7f 0%, #03403f 100%);             /* the dark CTA / footer band */
  --grad-pele:  linear-gradient(135deg, #f4f9f9 0%, #efe6dc 100%);             /* faint teal→sand, beauty side */
}
```

Use `--grad-marca` for the primary CTA, the mark, and small feature accents. `--grad-deep` for the *one* dark teal band per page. `--grad-pele` only on a beauty/results section, very faint.

### The discipline that saves you

One teal + white + sand. **Do not invent a second saturated hue.** Health/clinical sections lean teal; beauty/results sections may warm with sand. Every coded color that becomes text uses `--marca-ink` or `--marca-deep`, never `--marca-bright`. When you feel the urge to add "a pop of color", add **space** instead.

---

## 3. Typography

Two families. The brandbook mandates **Poppins**; the elegant serif is chosen to **echo the "Dr. Márcio Teixeira" logotype** and carry the premium-clinical tone.

| Family | Role | Source | Weights |
|---|---|---|---|
| **Cormorant Garamond** | Display headings only — elegant, high-contrast serif echoing the logotype | Google Fonts | 500, 600 (display sizes); use 600 for most heads |
| **Poppins** | All body, UI, eyebrows, labels, buttons, lede, meta | Google Fonts (the brandbook font) | 300, 400, 500, 600, 700 |

### Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Poppins:wght@300;400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

```css
:root {
  --font-display: "Cormorant Garamond", "Georgia", "Times New Roman", serif;
  --font-body: "Poppins", "Helvetica Neue", system-ui, sans-serif;
}
```

### Display title pattern

Cormorant is elegant and contrast-rich — let it carry the premium tone. Keep titles confident and uncrowded. The brand emphasis pattern is **one teal word** (or a teal *italic* word — Cormorant has a beautiful italic) inside a slate title.

```html
<h2 class="metodo__title">
  Avaliação correta, <span class="hl">tratamento correto</span>
</h2>
```

```css
.metodo__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(34px, 5.4vw, 68px);
  line-height: 1.05;
  letter-spacing: 0.005em;     /* high-contrast serif — keep tracking near zero, never tight */
  color: var(--tinta);
}
.hl { color: var(--marca-ink); }
.hl--italic { font-style: italic; font-weight: 500; color: var(--marca-ink); }
```

Cormorant quirks to respect: (a) it is **light by nature** — at display sizes use weight 600, never 400 (it disappears); (b) keep letter-spacing at/near zero, never negative (the thin strokes need air); (c) line-height `1.0–1.12` (the serif is tall and elegant); (d) the **italic is a feature** — use it for one emphasized word, not for whole paragraphs; (e) **never** set body or small UI in Cormorant — below ~22px the contrast muddies. Poppins owns everything functional.

### Type scale

| Use | Family | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Hero title | display | `clamp(40px, 6vw, 84px)` | 600 | `0.005em` |
| Section title (H2) | display | `clamp(34px, 5.4vw, 68px)` | 600 | `0.005em` |
| Sub-title / card title (display) | display | `clamp(24px, 2.8vw, 34px)` | 600 | `0.01em` |
| Card title (UI) | body | `18–21px` | 600 | `0` |
| Lede / intro paragraph | body | `clamp(17px, 1.5vw, 20px)` | 400 | `0` |
| Body | body | `16–17px` | 400 | `0` |
| Eyebrow (uppercase) | body | `12–13px` | 600 | `0.18em` |
| Meta / caption | body | `13–14px` | 500 | `0.01em` |
| Button / chip label | body | `14–15px` | 600 | `0.02em` |
| Small / legal | body | `13px` | 400 | `0` |

Body line-height `1.7` for calm, comfortable reading. Titles `1.05–1.15`. Poppins is geometric — keep body weight 400 (500 for lede), reserve 600/700 for labels, buttons and UI card titles. Never set long body in Poppins 300 (too thin to read); 300 is for oversized hero supporting lines only.

### Eyebrow pattern (the brand's title plate)

A small uppercase **teal eyebrow**, optionally with a short rule or a dot in `--marca`. Refined, not a pill-heavy playful tag.

```html
<p class="eyebrow">
  <span class="eyebrow__rule" aria-hidden="true"></span>
  Método 4D
</p>
```

```css
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--marca-ink);
}
.eyebrow__rule { width: 28px; height: 1.5px; background: var(--marca); border-radius: 2px; }
```

A soft-pill variant (`--marca-soft` background, `--marca-ink` text) is allowed for chips and filters, but the default eyebrow is the quiet rule+caps version — it reads more premium.

---

## 4. Spacing & radii

Generous whitespace is the brand's luxury signal. Don't cramp.

| Step | Value | Use |
|---|---|---|
| xs | 8px | Icon+label gap, chip internals |
| sm | 12–16px | Card internal gaps, form rows |
| md | 22–30px | Card padding, component internals |
| lg | 40–56px | Card outer padding, block rhythm |
| xl | 96–120px | Between major sections |
| xxl | 140px+ | Hero / featured-band vertical padding (desktop) |

### Section padding

`110–140px` top/bottom × `clamp(20px, 5vw, 80px)` side on desktop. Tablet trims to `88px`, mobile to `64px`. When in doubt, add more vertical space — premium breathes.

### Radius scale — soft, restrained (not playful-round)

| Token | Value | Use |
|---|---|---|
| `--r-sm` | 10px | Inputs, small buttons, chips |
| `--r-md` | 16px | Default cards, info plates |
| `--r-lg` | 22px | Feature cards, images, the mark-square echo |
| `--r-xl` | 32px | Big hero panels, featured bands |
| `--r-pill` | 999px | Buttons, chips, eyebrow pills, avatars |

Corners are **softly rounded, not bubbly** — this is premium-clinical, not a kids' brand. The brand square's radius (`--r-lg`) is the signature; echo it on hero media and the doctor portrait frame. Avoid sharp 0px corners on cards and media.

---

## 5. Shadows & elevation

Shadows are **soft, low, large, and teal-tinted** — never hard black. Cleanliness reads through light, diffuse elevation.

### Card shadow (resting)

```css
box-shadow: 0 14px 38px rgba(5, 127, 127, 0.08),
            0 4px 12px rgba(22, 48, 47, 0.05);
```

### Elevated / featured card

```css
box-shadow: 0 22px 56px rgba(5, 127, 127, 0.12),
            0 6px 16px rgba(22, 48, 47, 0.06);
```

### Hover (lifted)

```css
transform: translateY(-6px);
box-shadow: 0 30px 66px rgba(5, 127, 127, 0.16),
            0 8px 20px rgba(22, 48, 47, 0.08);
```

### Primary CTA glow (teal)

```css
box-shadow: 0 12px 30px rgba(5, 127, 127, 0.26);
/* hover */
box-shadow: 0 16px 40px rgba(5, 127, 127, 0.34);
```

Never use `box-shadow` with `rgba(0,0,0, >0.16)` — hard black shadows read as harsh and cheap, off-brand. The tint is always teal (or, on a warm section, a faint sand `rgba(205,182,162,0.18)`).

---

## 6. Motion tokens

```css
:root {
  --ease-calm:  cubic-bezier(0.22, 1, 0.36, 1);   /* default reveal / settle — the brand's signature */
  --ease-soft:  cubic-bezier(0.4, 0, 0.2, 1);      /* hover color/border */
  --ease-glide: cubic-bezier(0.65, 0, 0.35, 1);    /* panel swaps, axis cross-fade */
  --float: 7s;                                      /* base ambient drift */
}
```

### Duration ladder

| Range | Use |
|---|---|
| 160–240ms | Hover color/border |
| 260–360ms | Hover transform/lift, button press |
| 350–550ms | Axis panel cross-fade, accordion, modal |
| 700–900ms | Section reveal ("settles in") — slightly slower than usual = calmer, premium |
| 6–18s | Ambient parallax / curve drift (very slow, subtle) |

Never exceed 900ms for a state change. Ambient loops are slow and barely perceptible. **All motion respects `prefers-reduced-motion`** (see § 10 and ANIMATIONS.md). The premium feel comes from motion being *slightly slower and smoother* than a typical site — composed, never snappy or bouncy.

---

## 7. Voice & copy conventions

Speak with **calm authority and empathy** — a trusted doctor who explains clearly and respects the individual. Portuguese (pt-BR). Lead with credibility, deliver with warmth, promise **natural results**.

| Property | Rule |
|---|---|
| Language | Portuguese (pt-BR), refined and clear |
| Tone | Confiante, acolhedor, científico sem ser frio, sofisticado sem ser arrogante |
| Pronoun | "Dr. Márcio / nossa clínica / nossa equipe"; address the patient as "você"; speak of "sua pele", "cada paciente", "sua individualidade" |
| Real taglines | "Seu dermatologista de confiança em Porto Alegre, excelência desde 1993." · "Cuidado personalizado e resultados naturais com quem entende profundamente de pele." · "Cuidar da pele é minha vocação. Valorizar sua beleza natural é minha missão." |
| Método 4D | Always capitalized as **Método 4D**; the four axes are: **Eixo 1 · A Superfície da Pele**, **Eixo 2 · Linhas de Expressão**, **Eixo 3 · Alterações do Volume da Face**, **Eixo 4 · Flacidez**. Keep names and order exact. |
| Credentials | Show CREMERS 20214 · RQE 10858 | 12078. "Quase 30 anos", "desde 1993", "membro titular da Sociedade Brasileira de Dermatologia", "Método 4D exclusivo". |
| Travessões (— em dash) | **Avoid em dashes in body copy** (a common AI tell, and the house preference across these projects). Use commas, or colons when introducing. In `<title>`/separators use `·` (middle dot). |
| Ellipsis | Real `…` (U+2026) |
| CTA verbs | Primary: **AGENDE SUA CONSULTA** (→ WhatsApp). Also: "Conheça o Método 4D", "Fale no WhatsApp", "Agende sua avaliação". Action + confidence. |
| Numbers | "Quase 30 anos", "desde 1993", "4 eixos", "+20 tratamentos". Precise, never inflated. |
| Forbidden | Hype and discount energy: "melhor da cidade", "imperdível", "promoção", "‑50%", "transforme-se já". Cold jargon walls. Generic "soluções". |
| Emojis | Never in nav, buttons, or headings. Avoid in UI chrome entirely; this brand is restrained. |

### Title formula

`<teal eyebrow (caps + rule)> · <serif display title with one teal/italic word> · <Poppins 400 lede>`

Example:
> ── MÉTODO 4D
> O segredo é a *avaliação correta*, para o tratamento correto
> Esta abordagem exclusiva avalia sua pele em quatro dimensões, para tratamentos mais eficazes e personalizados. (sem travessão)

---

## 8. Content building blocks

Reusable atoms that recur across the site. Real content (full copy, treatments per axis, image mapping) is in the repo-root `README.md`.

### The four axes (lock these — they are the product)

| Eixo | Nome | Foca em | Axis image |
|---|---|---|---|
| 1 | A Superfície da Pele | coloração, textura, poros, luminosidade, manchas, sensibilidade | `imagens/superficie-da-pele*.png` |
| 2 | Linhas de Expressão | rugas dinâmicas e estáticas, sulcos | `imagens/linhas-de-expressao.png` |
| 3 | Alterações do Volume da Face | perda/excesso de volume, contornos, definição | `imagens/volumes-da-face.png` |
| 4 | Flacidez | firmeza, sustentação, flacidez cutânea e muscular | `imagens/flacidez.png` |

Treatments are grouped under these axes on the Tratamentos page (e.g. Eixo 1: Skincare Personalizado, Laserterapia/LIP, Skinbooster, MMP; Eixo 2: Toxina Botulínica, Preenchimento, Bioestimuladores; Eixo 3: Preenchedores, Lipo Facial Clínica, Harmonização; Eixo 4: Ultrassom Microfocado/Liftera, Radiofrequência, Fios PDO). See `README.md` for the full list + image map.

### Axis card

```html
<article class="axis-card">
  <span class="axis-card__num">01</span>
  <h3 class="axis-card__title">A Superfície da Pele</h3>
  <p class="axis-card__desc">Avalia coloração, textura, luminosidade e uniformidade da pele.</p>
</article>
```

A clean white card, big serif (or thin Poppins) eixo number in teal, serif title, Poppins description, soft teal shadow. The number is the recurring motif.

### Stat cell

```html
<div class="stat">
  <span class="stat__num" data-count="30">30</span>
  <span class="stat__key">anos de excelência</span>
</div>
```

Display serif number in `--marca-deep` + Poppins uppercase key in `--tinta-muted`. Use for: anos, eixos, tratamentos, congressos.

### Contact row

```html
<a class="contact-row" href="https://wa.me/5551999704848">
  <span class="contact-row__icon" aria-hidden="true"><!-- whatsapp svg --></span>
  <span>(51) 99970-4848</span>
</a>
```

### Treatment card

```html
<article class="treat-card" data-eixo="1">
  <figure class="treat-card__media"><img src="imagens/skinbooster.png" alt="Skinbooster" loading="lazy" /></figure>
  <h3 class="treat-card__title">Skinbooster</h3>
  <p class="treat-card__eixo">Eixo 1 · Superfície da Pele</p>
</article>
```

---

## 9. Iconography & the brand curve

- Use **thin, refined outline SVGs at 1.75–2px stroke**, `stroke-linecap: round; stroke-linejoin: round`. Lucide or Phosphor (thin/regular) suit the elegant tone. Inline SVG, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"` so icons inherit teal/ink.
- Icon tiles sit inside a **rounded soft-teal square** (`--marca-soft`, `--r-md`) with a `--marca-ink` glyph.
- **The brand curve is the signature motif.** Extract the sinuous white curve from the mark as an SVG path and reuse it: as a faint oversized teal watermark behind a section, as a section divider, as a draw-in accent (see ANIMATIONS § Curve draw). It is the one ownable graphic — use it instead of generic blobs or waves.
- Exception: brand logos (WhatsApp, Instagram, Facebook) are filled (`fill="currentColor"`).
- Never use clip-arty medical icons (clipboards, syringes literal) — keep iconography abstract, clean and minimal.

---

## 10. Accessibility — not optional

A health brand must be impeccable here.

| Rule | Why |
|---|---|
| Honor `prefers-reduced-motion: reduce` everywhere — collapse to opacity-only or instant. | Care, not compliance; vestibular sensitivity. |
| Body text ≥ 16px, line-height ≥ 1.6. Lede 17–20px. | Readability; many patients are older. |
| Color contrast: all text ≥ 4.5:1 (3:1 for large display). **Teal text uses `--marca-ink`/`--marca-deep`, never `--marca` at body size or `--marca-bright`.** | Teal can fail on white/tints; verify every instance. |
| Never rely on teal alone to convey meaning — pair with label/icon. | Color-blind accessibility. |
| Visible focus rings: `outline: 3px solid var(--marca); outline-offset: 3px`. | Keyboard users. |
| Touch targets ≥ 44×44px; comfortable spacing. | Motor accessibility, older patients. |
| Real `alt` on meaningful images (doctor, clinic, treatments); `aria-hidden` + empty alt on the decorative curve/watermark. | Screen readers. |
| Hero video: muted, `playsinline`, with a poster and a pause control; respect reduced-motion. | Don't force motion/autoplay. |
| Form fields: real `<label>`, visible focus, clear error text. | Usable appointment/contact form. |

---

## 11. Anti-patterns to avoid

| Anti-pattern | Why it breaks brand | Do instead |
|---|---|---|
| Dark / near-black default sections | This brand is light & premium | White / `--neve` canvas, one optional deep-teal band |
| Pure black `#000` text | Harsh, cheap | `--tinta: #16302f` deep cool slate |
| A second saturated hue (purple, pink, gold) | Breaks the one-teal discipline | Teal + white + restrained sand only |
| `--marca-bright` (#19b3a6) as text or big fills | Fails contrast, reads neon | Gradient partner / thin accent only; text uses `--marca-ink` |
| Tight, dense layout | Reads clinical/cheap, not premium | Generous whitespace, fewer elements |
| Heading set in Poppins-bold called "premium" | Skips the brand's display voice | Cormorant Garamond 600 for display |
| Cormorant in body / small UI | Thin strokes muddy below ~22px | Poppins for all body and small text |
| Hard black drop-shadows | Cold, cut-out, cheap | Soft, low, teal-tinted shadows |
| Heavy 1px grey section dividers | Corporate-cold | The brand curve, faint washes, whitespace |
| Med-spa loudness: glossy neon buttons, sparkles, "‑50% OFF" | Destroys the premium trust | Restraint: one teal, one serif, slow motion |
| Generic stock "woman touching face" / syringe close-ups | Cliché, untrustworthy | Real photos of Dr. Márcio, the Dermaclin space, bespoke treatment art |
| Travessões (—) in body copy | House style / AI tell | Commas, colons; `·` in titles |
| Bouncy springs / fast parallax everywhere | Cheapens the calm authority | Slow, smooth reveals; subtle parallax; reduced-motion respected |
| Emoji in nav/buttons/headings | Undercuts the trust | None in UI chrome |
| Inflated hype copy ("melhor da cidade", "imperdível") | Erodes medical credibility | Precise, calm, doctor-led claims |

When you catch yourself reaching for one of these, stop and pick the closest calm, teal, premium alternative from `references/COMPONENTS.md`.
