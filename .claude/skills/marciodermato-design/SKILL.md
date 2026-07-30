---
name: marciodermato-design
description: Senior-level design system for Dr. Márcio Teixeira — a premium dermatology & trichology practice in Porto Alegre/RS, excellence since 1993, creator of the proprietary Método 4D (a four-axis skin assessment). Activate whenever building or modifying UI, pages, sections, components, copy, or animations inside the Marcio Dermato project — including the video hero, the Método 4D four-axis explainer, the treatments catalog organized by the 4 axes, the about/doctor bio, the clinic ("Dermaclin") space gallery, the differentials grid, the appointment/WhatsApp CTA, contact form, and any eyebrow, stat, divider or accent. Provides the exact color tokens (the brand teal #057f7f with deep/bright variants on a clean light canvas, plus a restrained warm sand/nude accent for the "beleza da pele" side), the Cormorant Garamond × Poppins type system (elegant serif display echoing the logotype + Poppins body per the brandbook), the calm clinical-premium component patterns, the refined motion vocabulary (gentle reveals, soft parallax, prefers-reduced-motion first), and the craft rules that keep the brand reading like a trustworthy, sophisticated, results-natural dermatology clinic — never a generic SaaS landing page, never cold-clinical, never a flashy med-spa. This brand is LIGHT and PREMIUM — teal + white, elegant restraint. Read references/DESIGN.md before writing any CSS, references/COMPONENTS.md for component anatomy, references/ANIMATIONS.md for motion, references/INTERACTIONS.md for behavior, references/LAYOUT.md for page structure, and references/INSPIRATION.md for the creative library to pull from. Use this skill aggressively — if there is any chance the user is touching Marcio Dermato's UI, copy, or motion, this skill applies.
---

# Dr. Márcio Teixeira — Dermatology Design System

You are designing for **Dr. Márcio Teixeira** — a **dermatology, aesthetic and surgical** practice in **Porto Alegre, Rio Grande do Sul**, with **excellence since 1993** (nearly 30 years). The doctor is a **Dermatologista & Tricologista** (CREMERS 20214 · RQE 10858 | 12078), member of the Sociedade Brasileira de Dermatologia, and the **creator of the Método 4D** — a proprietary framework that assesses the skin across four axes (Surface, Expression Lines, Volume, Sagging). The digital identity must feel **trustworthy, sophisticated, calm, and human** — science + technology + empathy, with **natural results** as the promise. Never generic, never cold-clinical, never a loud med-spa with neon gradients and stock "woman touching face" photos.

You are not "a designer who follows a system." You are a senior designer with extraordinary craft instincts who happens to be writing code. Default to **calm**. Default to **breathing room**. Default to **teal used with intention on a light canvas**. When in doubt, choose the option that feels more like a **refined private clinic** and less like a discount aesthetic franchise — confident, quiet, expensive.

## The single most important instruction

**This brand is LIGHT and PREMIUM.** The canvas is white and a faint teal-tinted off-white. The brand color is a single, sophisticated **teal (`#057f7f`)** — used with restraint, not splashed everywhere. If you have muscle memory from the dark NOX or Quarezemin systems (near-black backgrounds, gold-on-black, cinematic vignettes), or from the multicolor playful HD360 system (five crayon colors, characters, confetti) — **this is neither.** Here it's **one disciplined teal, an elegant serif, generous whitespace, and clinical cleanliness warmed by a sand/nude accent.** Every time you reach for a second loud hue or a dark default section, stop.

## Brand DNA in one paragraph

A **premium dermatology clinic** that is **scientific but human, clinical but warm, results-driven but natural.** The mark is a **rounded teal square holding a sinuous white curve** — read it as a *profile of skin / a serene path / the letter form* — glossy, calm, medical-clean. The palette is **teal + white**, the colors of health, water, hygiene and trust, balanced by a restrained **warm sand/nude** that nods to skin and beauty. Typography pairs an **elegant high-contrast serif** (echoing the "Dr. Márcio Teixeira" logotype) for display with **Poppins** (the brandbook font) for everything functional. The organizing idea across the whole site is the **Método 4D** — four axes that structure the home, the dedicated method page, and the treatments catalog. Tradition here is **30 years of excellence and active presence at the field's major congresses** — credibility delivered with empathy.

## How this skill is organized

Always read the relevant reference file before producing code. The SKILL.md only holds principles; the heavy detail lives in `references/` so you load only what you need.

| File | When to read |
|---|---|
| `references/DESIGN.md` | Before writing CSS or picking a color, type size, or token. Full teal palette + warm accent, the Cormorant Garamond + Poppins setup, type scale, voice, brand DNA, copy conventions, accessibility. |
| `references/COMPONENTS.md` | Before adding or modifying any component. HTML/CSS anatomy for the glass nav, video hero, differentials grid, Método 4D axis cards, treatment cards, doctor/about block, clinic gallery, stats, testimonials, FAQ, appointment CTA, contact form, footer, WhatsApp float. |
| `references/ANIMATIONS.md` | Before adding any motion. Easing tokens, gentle reveals, soft parallax, the curve-draw motif, count-ups, hover lifts — and the reduced-motion contract. |
| `references/INTERACTIONS.md` | Before wiring behavior. Método 4D axis switcher/tabs, treatment filtering by axis, mobile drawer, contact form, gallery lightbox, scrolled-nav. |
| `references/LAYOUT.md` | Before laying out a page or section. Section anatomy, grid templates, container scales, the full sitemap (Início, Tratamentos, Método 4D, Tricologia, Sobre, Contato), responsive playbook. |
| `references/INSPIRATION.md` | When ideating a new feature or unsure how to approach something. Maps creative directions to references for premium clinical / aesthetic-medical / wellness brands. |
| `references/EMBED-FORM.md` | **Before touching the appointment form on `contato.html`.** It is a cross-origin MeuTrack iframe — our CSS cannot style its interior. Read this before proposing any fix, or you will write selectors that silently do nothing. Contains the exact `--th-*` token values to set in the MeuTrack panel. |

## The ten commandments of Marcio Dermato craft

These rule out the vast majority of generic mistakes before they happen.

1. **The canvas is white and faint teal-off-white; teal lives in accents.** Base background is `--branco: #ffffff` and `--neve: #f4f9f9`. Teal enters through headings, the brand mark, eyebrows, buttons, icon tiles, dividers and key accents — not by flooding viewports. At most **one** deep-teal full-color band per page (a CTA or the footer), never more.
2. **One teal, used with discipline.** The brand is `--marca: #057f7f`. Use `--marca-deep: #044d4d` for large display ink and dark bands, `--marca-bright: #19b3a6` only as a gradient partner / subtle highlight, and `--marca-ink: #055f5f` when teal becomes body-size text (contrast). Do not introduce a second saturated hue — the only secondary is the quiet warm **sand/nude** for skin/beauty warmth. The **only** sanctioned non-teal colors are two *functional brand* exceptions: **Google gold `#fbbc05`** on review stars/rating, and **WhatsApp green** on the floating WhatsApp button — both are external-platform identities, never decorative palette.
3. **Ink is a deep cool slate, never pure black.** Body text is `--tinta: #16302f` (a teal-leaning charcoal). Never `#000`. Pure black is harsh and cheap; this brand is refined.
4. **Display is an elegant serif; everything else is Poppins.** Headings use **Cormorant Garamond** (elegant, high-contrast — it echoes the logotype and signals premium care). Body, UI, eyebrows, labels, buttons are **Poppins** (the brandbook's mandated font). Never set body in the serif; never set a hero display in Poppins-bold and call it premium. (See `references/DESIGN.md` § Typography.)
5. **Generous whitespace is the luxury signal.** Premium reads as *space*, not density. Sections breathe (`96–140px` vertical). Don't cram. If a layout feels busy, remove an element before shrinking the gaps.
6. **The Método 4D is the backbone — keep it consistent.** The four axes (1 Superfície, 2 Linhas de Expressão, 3 Volume, 4 Flacidez) structure the home summary, the dedicated method page, and the treatments catalog. Number them, order them, and visually treat them the same everywhere. It is the brand's proprietary IP — give it weight.
7. **Motion is calm, smooth and refined — never flashy.** Gentle fades, soft rises, slow parallax, a tasteful draw of the brand curve. No harsh strobing, no bouncy springs everywhere, no autoplay that can't be paused. Always honor `prefers-reduced-motion: reduce`. Calm confidence *is* the brand. (See `references/ANIMATIONS.md`.)
8. **Sections separate with soft teal hairlines, washes, and the brand curve — not hard rules.** Use the **sinuous curve from the mark** as a divider/accent motif, faint teal washes (`--neve`/`--nevoa`), and whitespace. Never a heavy 1px grey line slashing the page.
9. **Shadows are soft, low and teal-tinted.** Cards rest on large, soft, slightly **teal-tinted** shadows (`0 18px 44px rgba(5,127,127,0.10)`) — never hard black drop-shadows. Elevation feels like a gentle lift, clean and clinical.
10. **Copy is warm, precise, doctor-led, and Portuguese-natural.** Speak with calm authority and empathy: "Cuidado personalizado e resultados naturais." Lead with credibility (anos, congressos, Método 4D) delivered humanely. **Avoid travessões (—)** in body copy (use commas/colons; `·` in titles). No clinical jargon walls, no hype ("melhor da cidade"), no emojis in nav/buttons/headings. Primary CTA is **AGENDE SUA CONSULTA** → WhatsApp.

## The motion vocabulary (one-liner each)

You always have these tools available — picking the right one is the senior move. All degrade gracefully under `prefers-reduced-motion`.

- **Gentle reveal** — `.reveal` → `IntersectionObserver` adds `.is-in`; elements rise and fade in over `700–900ms` with `--ease-calm`. The default for almost everything.
- **Fio de cabelo scroll motif** — the signature brand gesture. `fioMotif()` (in `main.js`) injects the mark's sinuous curve as an SVG hair-strand into the free lateral gutter of every `data-fio="left|right"` section, alternating sides down the page; it self-draws on scroll with a gradient stroke + travelling sheen. Opt a light section in with `data-fio`. (A generic `.curve-draw` watermark helper still ships for one-off accents.)
- **Soft parallax** — the hero media (`.hero__media.parallax`) drifts slowly on scroll, subtle and smooth, never aggressive.
- **Nav indicator slide** — the `.nav__indicator` pill glides under the active/hovered link (JS sets `--ind-x/--ind-w/--ind-o`); the glass island also condenses to `.is-solid` past `scrollY > 60`.
- **Soft hover lift** — cards translate up a few px and deepen their teal-tinted shadow; buttons brighten / fill.
- **Stagger-in** — grids of treatment avatars or axis cards reveal in sequence with an `--i`-indexed step, so the page assembles with composure.
- **Hero heritage rails** — the rotated lateral rails ("+30 anos de excelência" / "Desde 1993") are *deliberately static* (they replaced the old hero count-up stats — do not animate them as counters). The `countUp()` helper still ships in `main.js` but is currently dormant (no `[data-count]` elements on the home).
- **Carousel + comparator motion** — the casos and reviews tracks scroll-snap one card per arrow; the `.ba` comparator clips on a drag-driven `--pos`; casos cards cross-fade image A↔B on hover/tap. All flatten under reduced motion.

## How to start any new piece of UI

1. Read `references/DESIGN.md`. Know the teal tokens, the warm accent, the Cormorant + Poppins setup, and the type scale before you reach for hex.
2. Read `references/LAYOUT.md` for the section template (eyebrow → serif display title → lede → content → soft divider) and the sitemap so you know which page you're building.
3. Read `references/COMPONENTS.md` for the closest existing analog. Extend the established card/hero/axis language before inventing.
4. Decide the section's role — is it teal-accented (health/clinical) or sand-warmed (beauty/skin)? Keep teal dominant; use warmth sparingly.
5. Write semantic HTML with BEM-style classes (`section__element--modifier`).
6. Implement CSS using existing tokens. Add **one** calm motion (reveal or parallax), not three. Wire `prefers-reduced-motion` in the same pass.
7. Test mobile first at 390px, then 768px, then 1024px. Touch targets ≥ 44px; body text never below 16px. Verify teal text contrast against white/tints.

## The two biggest failure modes

- **Cold and clinical.** Pure teal + white with tight spacing reads like a hospital intake form or a SaaS dashboard. Warm it: add the sand/nude accent, the elegant serif, real photography of the doctor and the clinic, generous space, and human copy. The brand is *premium care*, not *a lab*.
- **Loud and cheap (med-spa syndrome).** The opposite pull is neon-teal gradients, glossy buttons everywhere, sparkles, "‑50% OFF" energy, and stocky beauty photos. Resist. Luxury is restraint: one teal, one serif, lots of space, slow motion, natural results. If it looks like a Groupon aesthetic deal, you've broken brand.

## Compliance — the words "antes" and "depois" are banned

The site advertises through Google, whose healthcare policies do not accept before/after
framing. In July 2026 the whole site was swept clean of it, so treat this as a hard rule:

- **Never write "antes" or "depois" as a comparative pair** — not in visible copy, headings,
  eyebrows, chips, captions, `alt`, `aria-label`, `title`, meta tags, JSON-LD, HTML comments,
  CSS class names, or image filenames.
- **The imagery stays.** Only the wording goes. Comparators and case carousels are fine; they
  just carry no state labels.
- **Neutral vocabulary to use instead:** "Resultados" / "Resultados reais" for section
  eyebrows; "Resultado" for a chip; "registro fotográfico 1 / 2" in `alt`; "ver o resultado"
  in `aria-label`; "comparar os dois registros" for the comparator. For plain temporal prose
  prefer "previamente", "após", "em seguida", "quanto mais cedo".
- **Naming convention:** paired assets end in `a`/`b` (`home-a.jpg`, `capilar-01a.jpg`) and
  BEM modifiers are `--a` / `--b` (`.caso__img--a`). The `antes-depois/` folder at the repo
  root is untouched source material and is excluded from the FTP deploy — never link to it.
- Always keep the **consent note** next to real patient imagery (`.compare__note`).

The same rule is recorded for copywriting in `COPY-TRATAMENTOS.md` (§ Conformidade CFM).

## Brand facts (verified — use these)

```
Nome:        Dr. Márcio Teixeira
Atuação:     Dermatologia clínica, estética e cirúrgica · Tricologia · desde 1993
Diferencial: Método 4D (criado pelo Dr. Márcio) — 4 eixos de avaliação da pele
Registros:   CREMERS 20214 · RQE 10858 (Clínica Médica) | RQE 12078 (Dermatologia)
Formação:    UFRGS · Residência no Hospital de Clínicas de Porto Alegre
             Membro titular da Sociedade Brasileira de Dermatologia
Endereço:    Av. Dr. Nilo Peçanha, 1221/602 · Porto Alegre/RS
Horário:     Seg a Sex 09h às 19h · Sáb fechado
WhatsApp:    (51) 99970-4848
Telefone:    (51) 3110-4110
E-mail:      secretaria@dermaclin.poa.br
Instagram:   @dr.marciodermato
Facebook:    /dr.marciodermato
Páginas:     Início · Tratamentos · Método 4D · Tricologia · Sobre · Contato
             (Tricologia é página NOVA, tratamentos capilares; não existia no site antigo)
```

The full extracted site copy, the treatments-by-axis list, and the image→treatment mapping live in the project `README.md` at the repo root — read it when you need real content.

## Where the code & assets live

The site is **plain HTML + one external stylesheet + one external script** — nothing inline. When you change styling or behavior, edit these, not the HTML `<head>`:

- `assets/css/main.css` — **all** styles (tokens on `:root`, every component). The reference implementation the `references/` docs mirror.
- `assets/js/main.js` — **all** behavior (reveal observer, nav indicator + scroll state, drawer, hero play/pause, soft parallax, the `fioMotif()` motif generator, the comparison comparator, the casos + reviews carousels).
- `assets/img/` — page-specific images authored for this build (e.g. `home-a.jpg`, `home-b.jpg` for the comparator).
- `index.html` is the canonical, fully-built page; `tratamentos.html`, `metodo-4d.html`, `tricologia.html`, `sobre.html`, `contato.html` are page stubs to build out against the same system.

Brand assets:

- `logo/` — `logo-header-colorido.png` (on light / scrolled nav), `logo-header-branco.png` (white, over hero/dark), `logo-rodape.png`/`logo-rodape2.png` (footer), `brandbook.pdf` (the source of the teal + Poppins decision). The mark's sinuous **white curve** is the reusable brand motif — it's already extracted and generated per-section by `fioMotif()`.
- `video-hero/video-hero.mp4` — hero background video.
- `imagens/` — per-treatment art (`toxina-butolinica.png`, `skinbooster`, `radiofrequencia.png`, the four axis images `superficie-da-pele*`, `linhas-de-expressao`, `volumes-da-face`, `flacidez`, etc.), plus `sobre*.jpg`, `contato.jpg`, `metodo4d-sobre*.jpg`, `rodape-site*`, and `imagens/casos/*a.jpg`/`*b.jpg` for the Casos carousel. (`*.wpress` is an old WordPress backup — ignore.)
- `ambiente/` — `dermaclin1…15.jpg`, photos of the physical clinic for the "Nosso Espaço" gallery.

When building, prefer the real photography and the bespoke treatment art over generic stock — it is what keeps the brand specific and trustworthy.
