# Embedded Lead Form (MeuTrack) — Brand Alignment

The appointment form on `contato.html` is **not our HTML**. It is a 3-step quiz served by a
Cloudflare Worker at `meutrack-ingest.carlosabsj-ti.workers.dev` and dropped onto the page as an
iframe by `embed.js`.

## Read this first: what you can and cannot change

The iframe is **cross-origin**. `marciodermato.com.br` cannot reach into
`meutrack-ingest.carlosabsj-ti.workers.dev`. This is a browser security boundary, not a
configuration we forgot to turn on.

**Therefore: no rule in this design system can be applied to the form by writing CSS in
`assets/css/main.css`.** Any selector you write targeting the fields, the buttons, the progress
dots, or the "Recebido!" screen will silently do nothing. If you catch yourself writing
`.contact-embed iframe input { ... }`, stop — it cannot work.

There are exactly two surfaces you can act on:

| Surface | Who controls it | How to change it |
|---|---|---|
| **Inside the form** — colors, fonts, radius, logo, copy | The MeuTrack panel (server-side) | Log into MeuTrack, edit the form's theme, save. Values below. |
| **Around the form** — card, title, lede, width, shadow, spacing | Us, in `main.css` | `.contact-embed*` rules. Normal CSS. |

Do not propose a CSS fix for a problem that lives inside the iframe. Say plainly that it must be
changed in the MeuTrack panel, and hand over the exact values from the table below.

## The tokens the form actually exposes

The Worker renders a `:root` block of `--th-*` variables into the form's own document. Each one
corresponds to a field in the MeuTrack theme editor. This is the complete set, with the value
currently live and the value this design system wants.

| Form token | Live now | Should be | Why |
|---|---|---|---|
| `--th-primary` | `#3DAAA8` | `#057f7f` (`--marca`) | `#3DAAA8` is a lighter, greener teal. It is not our brand teal and reads as a different company. **This is the single biggest offender.** |
| `--th-text` | `#055F5F` | `#16302f` (`--tinta`) | Body copy on this site is near-black ink, not teal. Teal body text is what makes the form look like a widget. |
| `--th-muted` | `#3DAAA8` | `#8aa0a0` (`--tinta-soft`) | Muted/secondary text must recede. Right now it is the same saturated teal as the primary. |
| `--th-answer` | `#fafafa` | `#f4f9f9` (`--neve`) | Neutral grey vs. our teal-tinted snow. Subtle, but `#fafafa` reads cold next to our warm-lit cards. |
| `--th-answer-text` | `#1d907d` | `#16302f` (`--tinta`) | Same reasoning as `--th-text`. |
| `--th-placeholder` | `#d1d1d1` | `#8aa0a0` (`--tinta-soft`) | Matches `.field ::placeholder` on the rest of the site. |
| `--th-bg` / `--th-surface` | `#ffffff` | `#ffffff` (`--branco`) | Already correct. Leave alone. |
| `--th-btn-bg` | `linear-gradient(180deg,#3DAAA8,…)` | `linear-gradient(140deg,#19b3a6 0%,#057f7f 52%,#044d4d 100%)` (`--grad-marca`) | Our primary button gradient runs at **140deg** through three stops. A flat 180deg two-stop gradient is the giveaway of a default theme. |
| `--th-btn-text` / `--th-btn-fg` | `#ffffff` | `#ffffff` | Already correct. |
| `--th-radius` | `999px` | `999px` for buttons | Correct for buttons — `.btn` uses `--r-pill`. But see the caveat below about inputs. |
| `--th-font` | `'Poppins'` | `'Poppins'` | Already correct. Do not "fix" this. |
| `--th-title` | `22px` | `22px` | Fine. The serif display title lives in *our* card header, not inside the iframe. |
| `--th-align` | `left` | `left` | Fine. |

### The radius caveat

`--th-radius` appears to drive **both** the button and the input fields. Our site pills the
buttons (`--r-pill`) but rounds inputs to `--r-md` (16px). If MeuTrack has only one radius field,
we cannot have both. Prefer keeping `999px` (correct buttons, slightly-too-round inputs) over
`16px` (correct inputs, a squared-off primary button that clashes with every other CTA on the
site). A wrong button is more visible than a wrong input.

If the panel ever grows a separate input-radius field, set it to `16px`.

## Do not fight the logo

The form renders the clinic logotype at the top (`logoUrl`, `logoSize`). Our card header already
carries a Cormorant title. Two brand marks stacked is noise. Either:

- turn the logo **off** in the panel and let our `.contact-embed__title` carry the identity, or
- keep the logo and drop our title to a lede.

Prefer the first. The serif title is ours, it is on-brand, and it uses a typeface the iframe
cannot load in the same weight.

## Our side of the boundary

`.contact-embed` in `main.css` is the frame around the iframe. This is where the design system
applies normally, and where you should spend effort once the panel tokens are right:

```css
.contact-embed__title  /* Cormorant Garamond, centered, with .hl--italic on the accent word */
.contact-embed__lede   /* Poppins, --tinta-soft, max-width ~34ch */
.contact-embed iframe  /* border-radius: var(--r-md) */
```

The card itself reuses `.contact-form` — white surface, `--r-lg`, the teal-tinted double shadow.
That is correct and should not be re-invented.

`embed.js` accepts `data-width` and `data-height`. `data-width` is a max-width in px (we use
`520`). `data-height` is only the *initial* height; the Worker posts the real height back via
`postMessage` and `embed.js` resizes the iframe. Never hard-code a final height, and never set
`overflow` on the wrapper — a scrollbar inside a form that is already resizing itself is the
worst of both.

## Verifying a change

The form is served fresh on every load, so a panel change is live immediately — no deploy needed.

```bash
curl -s "https://meutrack-ingest.carlosabsj-ti.workers.dev/f/ng_MXvkuBh" \
  | grep -oE '\-\-th-[a-z-]+: ?[^;}]+'
```

That prints the live token block. Compare against the "Should be" column above. If a value did
not change, it was not saved in the panel — do not go looking for a CSS cause.

## The trap

Every CTA on the site now points at this form (see the `CTA` constant in `tools/build-treatments.mjs`,
`tools/blog/lib/chrome.mjs`, `scripts/build-stubs.mjs`). The form is the **only** conversion
surface. A styling regression here costs more than a styling regression anywhere else on the site,
and it cannot be caught by `npm test`, by a rebuild, or by reading the repo — the offending code
is on someone else's server. Check it visually after any MeuTrack panel edit.
