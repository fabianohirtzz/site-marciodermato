# INSPIRATION.md — The creative library

This is where you go when the user asks for something new and you need to widen your reference space without breaking brand. Each entry pairs a creative direction with the worlds, archetypes, and techniques that already do it well, so you know what to study and what to adapt for **Dr. Márcio Teixeira**.

The goal is never "copy these sites." The goal is to understand what makes a reference work, port the underlying mechanic into the Marcio Dermato vocabulary (**light canvas, one disciplined teal #057f7f, Cormorant Garamond display + Poppins body, the sinuous brand curve, generous whitespace, calm refined motion**), and produce something that feels *of this brand*: a trustworthy, sophisticated, calm private dermatology clinic with natural results as the promise.

Before anything else, internalize the brand's two failure modes (from SKILL.md). Every idea in this file is flagged against them:

- **COLD-CLINICAL** — teal + white with tight spacing, thin grey rules, a stock-photo doctor, reads like a hospital intake form or a SaaS dashboard. The fix is always: warmth (sand accent, serif, real photography, space, human copy).
- **MED-SPA LOUD** — neon-teal gradients, glossy buttons everywhere, sparkles, "‑50% OFF" energy, stocky beauty photos. The fix is always: restraint (one teal, one serif, lots of space, slow motion, natural results).

When an idea risks tipping into either, this file says so explicitly. If neither flag is raised, the idea is safely on-brand.

## Table of contents

1. How to use this file
2. The creative north star (the adjacent worlds, and what to borrow from each)
3. Reference library (categorized archetypes + the takeaway + the trap)
4. Section-by-section creative options (hero, Método 4D, treatments, doctor/about, gallery, testimonials, appointment CTA, contact)
5. The signature brand-curve motif (the ownable visual idea)
6. Photography & art direction
7. Copywriting inspiration
8. Motion inspiration (and the anti-references)
9. The "when you're stuck" checklist
10. What we deliberately do NOT take inspiration from

---

## 1. How to use this file

1. The user describes a feature in their own words ("I want a section that explains the method," "make the treatments page feel less like a catalog").
2. Find the closest creative direction below.
3. Study the **mechanic** (the scroll behavior, the type rhythm, the layout pattern), not the visual style of the reference.
4. Translate it back through `DESIGN.md` (tokens, type) and `COMPONENTS.md` (the closest existing analog) so it lands in our teal-and-white, Cormorant + Poppins system.
5. Run the proposal past the two failure modes. If it is drifting cold or loud, course-correct before you write a line of CSS.
6. If you can't find a match, write one in here for the next sitting Claude.

Ranking convention in section 4: each option is tagged **[safe]**, **[elevated]**, or **[ambitious]**. Safe is the reliable senior default. Ambitious is the awards-tier swing that needs more craft and QA. All three must read on-brand; ambition never means louder, it means *more considered*.

---

## 2. The creative north star

Marcio Dermato lives at the intersection of **aesthetic medicine** and **premium care**. The positioning is *trustworthy, sophisticated, calm, natural results*. It is a doctor with the Método 4D, not a franchise with a price list. To widen the reference space without losing that, borrow deliberately from five adjacent worlds, and respect the line each one can cross.

### High-end skincare brands (Aesop, Augustinus Bader, La Mer, Dr. Barbara Sturm, Biologique Recherche)
- **Borrow:** the restraint. Serif-or-clean-sans typography, enormous whitespace, product-as-object photography, color used as a single quiet accent, copy that explains the science calmly. The "expensive because it is confident, not because it shouts" register.
- **The line:** these are *commerce* brands. Don't import a cart, a "Add to bag", a discount banner, or a product-grid-with-prices feel. Marcio Dermato sells *consultations and trust*, not bottles. The CTA is always **AGENDE SUA CONSULTA**, never "Comprar".
- **Flag:** copying their luxe-but-cold minimalism wholesale risks **COLD-CLINICAL**. Warm it with the doctor's real presence and the sand accent.

### Medical-aesthetic clinics (the good ones)
- **Borrow:** the credibility architecture. Named doctor, credentials shown plainly, before/after handled tastefully, a proprietary method given its own page (the Método 4D is exactly this). The trust signals: anos de atuação, congressos, SBD membership.
- **The line:** most clinic sites are where **MED-SPA LOUD** lives. Avoid their stock "woman touching face" heroes, neon gradients, glossy CTA spam, and "agende e ganhe" promos. Study their *structure*, reject their *skin*.
- **Flag:** high risk of MED-SPA LOUD. Borrow the information architecture, not the visual language.

### Wellness / spa (Six Senses, Aman, Comfort Zone, calm spa-resort sites)
- **Borrow:** the *calm*. Slow motion, soft natural light, water and stone textures, breathing layouts, the feeling of being cared for. This is where our teal (água, saúde, higiene) and the calm motion vocabulary find their emotional register.
- **The line:** wellness can drift into vague, sentimental, "self-care candle" softness. Marcio Dermato is *medical*; keep the scientific spine (the Método 4D, the credentials) visible under the calm.
- **Flag:** over-borrowing risks soft-sentimental mush. Anchor every calm moment to a real clinical claim.

### Luxury cosmetic packaging (editorial product art direction)
- **Borrow:** the treatment of a single object on a clean ground, the macro detail, the disciplined palette, the way premium packaging photography makes one thing feel precious. The bespoke per-treatment art in `/imagens` should be treated this way.
- **The line:** packaging is about gloss and surface. Don't let it become glossy-for-its-own-sake (that tips loud). Our gloss is the calm sheen of the mark, not a chrome button.
- **Flag:** glossy excess risks MED-SPA LOUD.

### Editorial beauty (Vogue/Harper's beauty pages, The Gentlewoman, Cereal magazine)
- **Borrow:** the typographic confidence. Serif display at scale, airy letter-spacing, one-italic-word emphasis, generous margins, photography that breathes. Cormorant Garamond is the bridge here.
- **The line:** editorial can be cold and aloof. Marcio Dermato is *warm authority* — keep the empathy in the copy and the doctor in the frame.
- **Flag:** aloofness risks COLD-CLINICAL.

**The one-line synthesis:** *Aesop's restraint + a real doctor's credibility + a spa's calm + an editorial's type confidence, on a light teal-and-white canvas.* That is the north star. Anything that pulls toward "med-spa franchise" or "hospital dashboard" is off it.

---

## 3. Reference library

Categorized archetypes you can cite and study. Each gives the **takeaway for Marcio Dermato** and the **trap to avoid**.

### A. The serif-led premium skincare hero
Archetype: Augustinus Bader / Dr. Barbara Sturm — a large serif headline, a calm product or portrait, one accent color, vast whitespace, a single quiet CTA.
- **Takeaway:** the hero earns trust through *composure*, not through a busy collage. One serif title with a single teal/italic word, the hero video or the doctor, one button. Let it breathe.
- **Trap:** their heroes are often product-on-white and emotionally flat. We have a real doctor and a real method — put a human and a promise in the frame so it doesn't go COLD-CLINICAL.

### B. The proprietary-method explainer page
Archetype: brands that named and own a process (Bader's "TFC8", any clinic with a signature protocol page). The method gets its own URL, a number system, and a visual diagram.
- **Takeaway:** the Método 4D *is* this pattern, and it is the brand's hero feature. Give the four axes a consistent number system (01–04), a diagram, and weight. Treat it as IP, not a feature list.
- **Trap:** turning it into a generic "our process: 1-2-3-4" SaaS timeline. It must feel proprietary and clinical-premium, tied to real skin assessment, not a startup onboarding flow.

### C. Aesop-style restrained commerce / catalog
Archetype: Aesop, Diptyque — product pages that lead with story and object photography, no cart clutter, serif-led, generous.
- **Takeaway:** the Tratamentos catalog should feel like a curated collection organized by the four axes, each treatment a quiet card with bespoke art. Story before "buy".
- **Trap:** a dense price-grid with badges and "agende" buttons on every card = MED-SPA LOUD. No prices, no promo flags, one calm CTA per card at most.

### D. The "real place" clinic about/story
Archetype: boutique-clinic and atelier about-pages that photograph the actual space and the actual person, with a calm bio and credentials.
- **Takeaway:** we have `sobre.jpg`, `sobre2.jpg`, and 15 real `dermaclin*.jpg` photos. Use them. The about page is the doctor's voice + real credentials + the real clinic.
- **Trap:** stock-doctor-in-white-coat-with-arms-crossed. Instant COLD-CLINICAL and untrustworthy. Only real Dr. Márcio imagery.

### E. Editorial typographic system (the type-as-instrument archetype)
Archetype: The Gentlewoman, Cereal, Sotheby's — ornamental serif at scale, airy eyebrows, italic emphasis.
- **Takeaway:** lean on Cormorant Garamond 600 for display, one teal/italic word per title, the uppercase teal eyebrow with a hairline rule. This is the brand's editorial confidence.
- **Trap:** never set body or small UI in Cormorant (it muddies below ~22px), and never tighten its tracking. Poppins owns everything functional.

### F. Wellness/spa calm-motion archetype
Archetype: Aman, Six Senses — slow reveals, soft parallax on hero media, water-like easing.
- **Takeaway:** the motion vocabulary. Gentle 700–900ms reveals, slow curve drift, soft hover lifts. Calm *is* the premium signal.
- **Trap:** spa sites sometimes autoplay long ambient video with no control. Always give the hero video a pause control, a poster, and reduced-motion respect.

### G. Awwwards-tier scrollytelling (used with restraint)
Archetype: Apple product pages, NYT "Snow Fall", Stripe marketing — pinned hero, scroll-progress driving a single message, dwell beats.
- **Takeaway:** a *restrained* scroll-story is the most ambitious way to present the Método 4D (one axis revealed per scroll beat). The mechanic: sticky pin + a `progress` variable + the brand curve drawing as the through-line.
- **Trap:** Apple-scale scrub on a clinic budget often janks and over-animates. Keep it to four calm beats, reduced-motion gives a static stacked version. Over-ambition here risks both jank and MED-SPA LOUD if the motion gets flashy.

### H. The trust-band / credentials archetype
Archetype: premium-clinic stat bands, law-firm/medical credibility rows.
- **Takeaway:** a soft band with count-up stats (desde 1993, quase 30 anos, 4 eixos, +20 tratamentos) + CREMERS/RQE + SBD. Quiet authority.
- **Trap:** inflated numbers or badge-walls read cheap. Precise, restrained, real.

---

## 4. Section-by-section creative options

For each section: 2–4 distinct approaches, ranked safe → ambitious, each tied to brand tokens. Sample copy is Portuguese, no travessões.

### HERO

**[safe] Calm video hero with serif promise.**
`video-hero.mp4` muted/playsinline behind a soft teal-deep scrim (`--grad-deep` at low opacity bottom-up so text reads), white logo (`logo-header-branco.png`), one Cormorant title with a teal-bright word, one Poppins lede, one teal pill CTA. A faint brand-curve drifts in the lower third.
> *Dermatologia que une ciência, tecnologia e cuidado humano.*
> Seu dermatologista de confiança em Porto Alegre, excelência desde 1993.
> [ AGENDE SUA CONSULTA ]
- Tokens: `--grad-deep` scrim, `--branco` text, `--marca-bright` highlight word (on dark only), `--r-pill` CTA. The one allowed deep band moment.
- Flag: keep the scrim soft and the motion slow, or the video tips MED-SPA LOUD.

**[elevated] Split hero: portrait + promise on light.**
Left: Cormorant title + lede + CTA on `--neve`. Right: a real Dr. Márcio portrait (`sobre.jpg`) in an `--r-lg` mark-square frame with a soft teal-tinted shadow, a thin curve accent tracing one edge. Light, editorial, human, warm.
- Tokens: light canvas (no dark band), `--marca-ink` eyebrow, sand accent optional behind the portrait frame.
- Flag: this is the warmest, most COLD-CLINICAL-proof hero. Preferred when the doctor's trust is the priority.

**[ambitious] Hero with a draw-on-scroll curve into the Método 4D.**
Calm static-ish hero that, as the user begins scrolling, draws the brand curve downward and hands off into the Método 4D section as one continuous gesture (the curve becomes the method's spine).
- Tokens: `stroke-dashoffset` curve draw with `--ease-calm`, reduced-motion = curve simply present.
- Flag: only if the curve handoff is genuinely smooth; otherwise fall back to [safe]. Ambition here = seamlessness, not spectacle.

### MÉTODO 4D EXPLAINER (the hero feature)

This is the ownable centerpiece. Four axes, always numbered 01–04, always in order: **01 A Superfície da Pele · 02 Linhas de Expressão · 03 Alterações do Volume da Face · 04 Flacidez.** Four creative ways to visualize the four axes:

**[safe] Four axis cards in a 2×2 or 1×4.**
Clean white axis cards (`COMPONENTS § Axis card`): big teal eixo number, Cormorant title, Poppins description, soft teal shadow, stagger-in reveal (70–90ms). Each links to its treatments. The reliable, scannable default.
> Eixo 01 · A Superfície da Pele — Avalia coloração, textura, poros, luminosidade e manchas.
- Tokens: `--marca-soft` icon ground, `--marca-deep` numerals, soft teal shadow.

**[elevated] Vertical stepper with the curve as the rail.**
The four axes stack as a vertical stepper; the **brand curve runs down the left as the connecting rail**, drawing in on scroll, with a teal node per axis that fills as it enters view. Each step pairs the axis image (`superficie-da-pele.png`, `linhas-de-expressao.png`, `volumes-da-face.png`, `flacidez.png`) with its text.
- Tokens: curve-draw motion, `--marca` nodes, `--neve` alternating ground. The curve doubles as a **progress indicator for the 4 axes** (see § 5).
- Flag: keeps the method premium and ownable; the safest of the "interesting" options.

**[elevated] Interactive axis switcher (tabs that cross-fade).**
Four teal tabs (01–04); selecting one cross-fades a panel (350–450ms, `--ease-glide`) showing that axis's image, description, and its treatments. The "smooth axis switch" from the motion vocabulary.
- Tokens: `--marca-soft` inactive tab, `--marca` active, panel cross-fade. See `INTERACTIONS § axis switcher`.
- Flag: make the cross-fade calm, never a hard cut or a bouncy slide.

**[ambitious] Face-map / scroll-story of the four axes.**
A central refined face illustration or a real treated-skin image; as the user scrolls (or hovers), each axis highlights its zone of the face with a teal trace and the curve, one dwell beat per axis. The most awards-tier expression of the Método 4D.
- Tokens: teal traces, curve draw, sticky-pin + `progress`. Reduced-motion = a static labeled diagram with all four axes shown.
- Flag: high craft + QA cost. Must stay clinical-elegant; an over-animated face-map tips MED-SPA LOUD instantly. Use only when the budget supports doing it beautifully.

### TREATMENTS CATALOG

Organized by the four axes (see README for the full per-axis list and image map).

**[safe] Axis-grouped grid with quiet cards.**
Sections per eixo; within each, treatment cards (`COMPONENTS § Treatment card`): bespoke art (`skinnbooster.png`, `toxina-butolinica.png`, `radiofrequencia.png`, etc.), Cormorant/Poppins title, the eixo label, soft hover lift. No prices, no badges.
> Skinbooster — Eixo 01 · Superfície da Pele
- Tokens: `--neve` section grounds alternating, soft teal shadow, hover `translateY(-6px)`.

**[elevated] Filterable catalog by axis.**
The full grid with a teal filter rail (01–04 + Todos); selecting an axis filters the cards with a calm fade/stagger. The eyebrow chip-pill variant is allowed here.
- Tokens: `--marca-soft` chips, `--marca` active. See `INTERACTIONS § filtering`.
- Flag: keep it one calm transition; resist "sort by price" or any commerce chrome.

**[ambitious] Editorial treatment detail pages.**
Each treatment gets an Aesop-style detail page: bespoke art hero on `--neve`, a calm "o que é / para quem / como funciona" body in Poppins, the parent axis as context, one WhatsApp CTA. Story before action.
- Tokens: `--r-lg` media frame, curve watermark behind the body, `--marca-ink` body links.
- Flag: never add a cart, price, or "agende e ganhe". Direct to WhatsApp. Commerce chrome = MED-SPA LOUD.

### DOCTOR / ABOUT STORY

**[safe] Portrait + bio + credential band.**
Real Dr. Márcio portrait (`sobre.jpg`/`sobre2.jpg`) in an `--r-lg` frame, a calm first-person bio, a credential row (CREMERS 20214 · RQE 10858 | 12078 · SBD · UFRGS · HCPA), a count-up stat cell or two.
> Cuidar da pele é minha vocação. Valorizar sua beleza natural é minha missão.
- Tokens: light canvas, soft teal shadow on the frame, `--marca-deep` stat numerals.

**[elevated] Story with the curve as a timeline.**
"Desde 1993" rendered as a calm horizontal/vertical journey (formação, residência no HCPA, SBD, criação do Método 4D), the brand curve threading the milestones, drawing in on scroll.
- Tokens: curve-draw, `--neve` ground, Cormorant milestone years.
- Flag: keep it to a few real milestones; not a dense résumé wall.

**[ambitious] Two-voice "ciência + empatia" spread.**
An editorial spread pairing the scientific credibility (method, congressos, credentials) on the teal-leaning side with the human promise (a warm portrait, the vocation quote) on the sand-warmed side, divided by the brand curve.
- Tokens: teal side vs. `--areia` side, curve divider. Resolves the brand's core science/human tension visually.
- Flag: keep teal dominant; the sand side is an accent, not a co-primary.

### CLINIC GALLERY ("Nosso Espaço" / Dermaclin)

**[safe] Soft masonry of real space photos.**
A calm grid of `dermaclin1…15.jpg` in `--r-lg` frames with soft teal-tinted shadows, gentle stagger-in, a lightbox on click.
- Tokens: `--neve` ground, soft shadows. See `INTERACTIONS § gallery lightbox`.

**[elevated] Curve-masked gallery feature.**
One or two hero clinic photos masked by the brand curve (image inside the sinuous shape), with the rest as a quiet grid below. Makes the real space feel branded.
- Tokens: SVG curve `clip-path` / mask (see § 5), soft shadow.
- Flag: mask only the feature image(s); a whole grid of curve-masked photos gets busy.

**[ambitious] Slow horizontal "walk-through" of the space.**
A calm horizontal scroll/parallax that walks the viewer through the clinic (reception → consultório → procedimentos), one space per dwell, captions in Poppins meta.
- Tokens: soft parallax, `--neve` ground, curve as the path motif.
- Flag: must stay slow and smooth; a fast carousel tips loud. Reduced-motion = vertical stack.

### TESTIMONIALS

**[safe] Quiet quote cards.**
First name + context only (no stock faces), Cormorant pull-quote, a small teal quote-mark or curve accent, soft card. Privacy-respecting.
> "Atendimento humano e resultados naturais. Saí da consulta confiante." — Paciente, Porto Alegre
- Tokens: `--marca-soft` card or white with soft shadow, Cormorant quote.

**[elevated] Single rotating testimonial with curve accent.**
One large calm quote that cross-fades between voices on a timer/arrows, the brand curve underlining it.
- Tokens: calm cross-fade (`--ease-glide`), curve accent.
- Flag: never auto-rotate fast; slow dwell, pausable.

**[ambitious] Testimonial woven into the method.**
Pair each axis (where appropriate) with a one-line real patient outcome, so social proof reinforces the Método 4D rather than sitting in a generic carousel.
- Tokens: ties to the axis cards/stepper.
- Flag: only with real, attributable quotes; never invent outcomes.

### APPOINTMENT CTA (the one deep band per page)

**[safe] Deep-teal full band CTA.**
The single allowed dark moment: `--grad-deep` band, white Cormorant headline, one Poppins lede, the **AGENDE SUA CONSULTA** pill → WhatsApp, a faint white curve watermark.
> Vamos cuidar da sua pele com a atenção que ela merece.
> [ AGENDE SUA CONSULTA ]
- Tokens: `--grad-deep`, `--branco` text, white curve watermark.

**[elevated] Sand-warmed CTA on light.**
A light alternative on `--grad-pele` (faint teal→sand) for a softer, beauty-side close, teal CTA pill, curve accent. Use when a page already spent its deep band elsewhere.
- Tokens: `--grad-pele`, `--marca` CTA.
- Flag: at most one deep band per page; if the footer is deep teal, make this CTA the light/sand version.

**[ambitious] CTA with the curve as a draw-in flourish.**
The brand curve draws across the band on reveal, ending in a subtle point toward the CTA.
- Tokens: curve-draw, `--grad-deep`.
- Flag: subtle; a flashy draw tips loud.

### CONTACT

**[safe] Two-column: form + clinic facts.**
Left: a calm form (real labels, teal focus ring, soft inputs on `--nevoa`). Right: address (Av. Dr. Nilo Peçanha, 1221/602), horário (Seg a Sex 09h às 19h), WhatsApp (51) 99970-4848, phone (51) 3110-4110, e-mail, a contact-row per item, `contato.jpg` or a map.
- Tokens: `--nevoa` input grounds, `--marca` focus ring (`outline: 3px solid var(--marca)`).

**[elevated] Contact over a real photo aside.**
The form on a soft card floating over `contato.jpg` or a Dermaclin photo, grounding the form in the real place (the "real place" mechanic from § 3.D).
- Tokens: soft teal shadow card, curve accent on the aside.
- Flag: keep the photo overlay light; don't darken to a cinematic vignette (wrong brand).

**[ambitious] Conversational appointment flow.**
A gentle step-by-step (motivo da consulta → preferência de horário → contato) that ends in a prefilled WhatsApp deeplink. Calm, one question-cluster at a time.
- Tokens: vertical-step pattern, teal active state.
- Flag: three steps max; never feel like a SaaS funnel. No checkout.

---

## 5. The signature brand-curve motif

The mark is a **rounded teal square holding a sinuous white curve.** That curve is the one ownable graphic. Extract it once as an SVG path and reuse it everywhere instead of generic blobs or waves. This is the brand's smartest, most ownable device, so protect the discipline: it should feel intentional and rare, never wallpaper.

A catalog of deployments, roughly safe → ambitious:

1. **Section divider.** A faint teal curve separating two sections instead of a hard 1px rule. The default replacement for any grey divider you were about to draw.
2. **Hero accent.** A single oversized curve drifting slowly (soft parallax) in the lower third of the hero, low opacity, `--marca` or white on the deep band.
3. **Watermark.** An enormous, very-low-opacity curve sitting behind a section (the Método 4D, the CTA, the about story) as a tonal texture. `rgba(5,127,127,0.04–0.07)`.
4. **Draw-on-scroll accent.** `stroke-dashoffset` animates the curve drawing in as the section reveals (`--ease-calm`, 900ms+). The signature brand gesture. Reduced-motion = curve simply present.
5. **Progress indicator for the 4 axes.** In the Método 4D stepper, the curve is the vertical rail; it draws / fills as the user advances through eixos 01→04, with a teal node per axis. The curve literally carries the method.
6. **Image mask.** A feature photo (a Dermaclin space, the doctor portrait) clipped to the curve's silhouette via `clip-path`/SVG mask, so the real imagery wears the brand shape.
7. **The handoff thread.** The curve as a continuous through-line between sections (hero → method → CTA), drawing onward as the page scrolls, so the whole page feels composed by one gesture (the [ambitious] hero option).
8. **Micro-accent.** A tiny curve segment as an eyebrow flourish, a quote underline, a bullet, or the trailing flourish under a stat. Used sparingly.

Rules of restraint: at most **two** prominent curve moments per page (e.g. the method rail + the CTA watermark); the rest are faint accents. The curve is `--marca` / `--marca-deep` on light, white on the deep band, always low-opacity when it's a watermark. Never recolor it to a second hue; never let it become a busy decorative pattern. If a page has more curve than whitespace, you have overused it.

---

## 6. Photography & art direction

The brand's specificity and trust live in **real photography** and the **bespoke treatment art** already in the repo. Generic stock is the fastest way to break the brand.

**The look:**
- **Real Dr. Márcio portraits** (`sobre.jpg`, `sobre2.jpg`) — warm, natural light, the doctor present and human, not a stiff arms-crossed white-coat stock pose. This is the single most trust-building image on the site.
- **The Dermaclin space** (`ambiente/dermaclin1…15.jpg`) — the actual clinic: reception, consultório, equipment. Real place = real trust (the "real place" mechanic).
- **Bespoke treatment art** (`imagens/*.png`) — the per-treatment and per-axis art (`superficie-da-pele.png`, `linhas-de-expressao.png`, `volumes-da-face.png`, `flacidez.png`, `toxina-butolinica.png`, `skinnbooster.png`, etc.). Treat each like luxury packaging: one object, clean ground, calm.
- **Método 4D supporting imagery** (`metodo4d-sobre*.jpg`).

**Color grading:** lean clean and slightly cool toward teal/white. Bright, airy, even light; soft contrast; never a dark cinematic vignette (that's the NOX/Quarezemin world, wrong brand). Skin tones stay natural and warm; the sand accent can warm a beauty/results frame. Avoid heavy filters.

**Framing & treatment:** real photos sit in `--r-lg` frames (the mark-square echo) with soft teal-tinted shadows, occasionally masked by the brand curve. Lots of negative space around imagery.

**Stock clichés to ban (instant distrust / MED-SPA LOUD):**
- The "woman touching her face" / "looking in a mirror" stock shot.
- Syringe macros, needle close-ups, injection-in-progress shots.
- Blue-gloved hands, lab/test-tube imagery, clinical-cold equipment hero shots.
- Generic smiling-doctor-in-white-coat-arms-crossed stock.
- Before/after handled tabloid-style; if used at all, keep it tasteful, consented, and quiet.

When in doubt, use a real photo from the repo over any stock. If a section truly needs new imagery, brief it to match the real grade: clean, calm, warm-natural, teal-leaning, generous space.

---

## 7. Copywriting inspiration

**Tone references:** the calm authority of a trusted physician explaining clearly; the editorial warmth of premium skincare copy (Aesop, Augustinus Bader) that respects the reader's intelligence; never hype, never jargon walls. *Confiante, acolhedor, científico sem ser frio, sofisticado sem ser arrogante.* Portuguese (pt-BR). No travessões (use commas, colons, or `·` in titles).

**Headline patterns that fit (calm authority + empathy):**
- *Promise + place + heritage:* "Seu dermatologista de confiança em Porto Alegre, excelência desde 1993."
- *Vocation, first person:* "Cuidar da pele é minha vocação. Valorizar sua beleza natural é minha missão."
- *The method as the idea:* "O segredo é a *avaliação correta*, para o tratamento correto." (one teal italic word)
- *Science + human:* "Ciência, tecnologia e cuidado humano, lado a lado."
- *Natural results promise:* "Resultados naturais, com quem entende profundamente de pele."

**Using the Método 4D as the narrative spine:** let the four axes structure copy the way they structure layout. Introduce the method, then let each axis carry a clear, calm explanation of what it assesses and which treatments address it. The four-axis frame is the brand's story, not just a feature. Always capitalize **Método 4D**; keep axis names and order exact.

**Real taglines to riff on (from DESIGN.md):**
- "Seu dermatologista de confiança em Porto Alegre, excelência desde 1993."
- "Cuidado personalizado e resultados naturais com quem entende profundamente de pele."
- "Cuidar da pele é minha vocação. Valorizar sua beleza natural é minha missão."

**Eyebrow / label patterns:** quiet uppercase teal eyebrows with a hairline rule — "MÉTODO 4D", "NOSSO ESPAÇO", "TRATAMENTOS POR EIXO", "SOBRE O DR. MÁRCIO".

**CTA verbs:** primary **AGENDE SUA CONSULTA** (→ WhatsApp). Also "Conheça o Método 4D", "Fale no WhatsApp", "Agende sua avaliação". Action + confidence, never discount energy.

**Forbidden copy (erodes medical credibility / MED-SPA LOUD):** "melhor da cidade", "imperdível", "promoção", "‑50%", "transforme-se já", emojis in chrome, jargon walls, inflated numbers. Lead with real credibility, deliver with warmth, promise natural results.

---

## 8. Motion inspiration

**The register:** calm, smooth, *slightly slower than a typical site* — composed, never snappy. Premium reads as motion that settles in. (Wellness/spa archetype, § 3.F.) All motion honors `prefers-reduced-motion: reduce`.

**Calm premium references to study:**
- **Slow reveals** — Stripe / Apple marketing section reveals: elements rise ~16px and fade over 700–900ms with `--ease-calm`. The default for almost everything.
- **Soft parallax** — Aman/Six Senses hero media and the decorative curve drifting a few percent on scroll. Subtle, smooth.
- **Curve draw** — the signature gesture: `stroke-dashoffset` drawing the brand curve in on reveal (the method rail, the CTA flourish, the section divider).
- **Smooth axis cross-fade** — Radix-style tab swaps, applied to the Método 4D switcher: opacity + slight translateY over 350–450ms with `--ease-glide`.
- **Soft hover lift** — cards translate `-6px` and deepen their teal-tinted shadow over ~260ms.
- **Stagger-in** — treatment/axis grids assembling in sequence with a 70–90ms step, composed.
- **Count-up** — stat numbers tick once on reveal (anos, eixos, tratamentos), never looping.

**Anti-references (never do these — they cheapen the calm authority):**
- Bouncy springs everywhere, overshoot easing on every element.
- Fast/aggressive parallax, scroll-jacking that fights the user.
- Neon glows, strobing, sparkle/confetti, glossy pulsing buttons.
- Autoplay video with no pause control; motion that can't be reduced.
- Marquees of logos, spinning badges, "look at me" micro-interactions.
- Hard cuts between states (always cross-fade), snappy <150ms reveals that feel cheap.

Never exceed 900ms for a state change; ambient loops (curve drift) are 6–18s and barely perceptible. If a motion draws attention to itself rather than to the content, it's off-brand.

---

## 9. The "when you're stuck" checklist

Quick prompts to regenerate on-brand ideas:

1. **What would Aesop do?** Strip it back. Remove an element, add space, make the type quieter and more confident.
2. **Where's the doctor / the real place?** If a section feels generic, put a real Dr. Márcio portrait or a Dermaclin photo in it. Trust comes from the real.
3. **Can the Método 4D carry this?** The four axes are the brand's spine — most "how do I structure this" questions answer to "number it 01–04 and order it like the method."
4. **Where's the curve?** If you reached for a blob, a wave, or a grey divider, use the brand curve instead. It's the ownable shape.
5. **Is teal earning its place?** One disciplined teal. If you added a second saturated hue, remove it. If teal feels cold, warm with the sand accent, the serif, and a real photo — not a second color.
6. **Did I add space or density?** When it feels busy, remove an element before shrinking gaps. Whitespace is the luxury signal.
7. **Is the motion slower than I think it should be?** Premium settles in. Slow the reveal, soften the easing, kill the bounce.
8. **Run the two-flag test.** Does it tip COLD-CLINICAL (add warmth: sand, serif, photo, copy) or MED-SPA LOUD (add restraint: one teal, space, slow motion, no promo)? Fix the flagged one before shipping.
9. **Would a senior designer be proud, and would a discerning patient feel they're in good hands?** If either is no, refine before adding anything new.

---

## 10. What we deliberately do NOT take inspiration from

These produce templates that *look* aesthetic-medical but break the brand:

- **Loud med-spa / aesthetic-franchise sites** — neon-teal gradients, glossy CTA spam, "agende e ganhe", price grids, sparkles. The single biggest trap. Study their *information architecture* only; reject their visual language.
- **Generic medical/corporate templates** — stock doctor, thin grey dividers, cold blue gradients, soulless "Schedule your appointment" hero. COLD-CLINICAL.
- **Dark "cinematic" glassmorphism SaaS sites** — near-black backgrounds, gold-on-black, deep vignettes. That's the NOX/Quarezemin world, the opposite brand. This brand is LIGHT.
- **Multicolor playful kids'/clinic sites** — five crayon colors, characters, confetti, blobs. That's the HD360 world. Here it's one disciplined teal.
- **E-commerce skincare templates** — carts, badges, "‑50%", product-grid-with-prices. We sell consultations and trust, not bottles. CTA is always AGENDE SUA CONSULTA → WhatsApp.
- **"Above the fold" SaaS conventions** — buttoned CTA + tagline + dashboard screenshot. Exactly what we are not.

When you catch yourself drifting toward one of these, stop and re-read SKILL.md § "The two biggest failure modes." Then pick the closest calm, teal, premium alternative above.

---

## When the user wants something genuinely new

The Marcio Dermato language — light canvas, one teal, Cormorant + Poppins, the brand curve, calm motion, the Método 4D spine — is rich enough that the large majority of new asks fit a pattern above. For the genuinely new:

1. **Brainstorm three directions inside the vocabulary**, not generically ("a calm scroll-story that walks through the four axes as a single skin journey"; "an editorial treatment page where the bespoke art leads and the body explains the science"). Tag each safe / elevated / ambitious.
2. **Pick the closest archetype** from § 3 and the closest component from `COMPONENTS.md`. Add the new direction to this file for the next Claude.
3. **Sketch the HTML first**, then one calm motion, then the polish. Wire reduced-motion in the same pass.
4. **Run the two-flag test and the § 9 checklist** before shipping. Hold yourself to: *would a senior designer be proud, and would a discerning patient feel they're in good hands?*

The brand has the tokens, the type system, the motion vocabulary, the curve, and the Método 4D to support almost anything — calmly, premium, and unmistakably its own.
