/* =====================================================================
   build-treatments.mjs  —  Dr. Márcio Teixeira
   Generates tratamentos/<slug>/index.html for every canonical treatment by
   parsing the authoritative COPY-TRATAMENTOS.md. The copy doc stays the
   single source of truth; re-run this whenever the copy changes:

       node tools/build-treatments.mjs

   Each page is a sectioned conversion landing page (NOT a blog article):
   hero + "o que é" split + benefícios/indicações + como funciona split +
   resultados/caso (warm band) + cuidados + médico + FAQ + CTA band, with a
   call-to-action repeated in every section. Real clinical photography is
   pulled from imagens/<folder>/ at build time.

   Plain Node (ESM), no dependencies.
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COPY = readFileSync(join(ROOT, "COPY-TRATAMENTOS.md"), "utf8");
const SITE = "https://drmarcioteixeira.com.br";

/* --- slug → image folder (names in /imagens are irregular) ----------- */
const FOLDER = {
  "skincare-personalizado": "skincare-personalizado",
  "skincare-via-oral": "skincare-oral",
  "peelings-quimicos": "peelings-quimicos",
  "terapia-fotodinamica": "terapia-fotodinamica",
  "laser-luz-intensa-pulsada": "laserterapia",
  "skinbooster": "skinbooster",
  "mmp-dna-salmao-exossomas": "mmp",
  "toxina-botulinica": "toxina-butolínica",
  "acido-hialuronico": "preenchimento-acido-hialuronico",
  "bioestimuladores-de-colageno": "bioestimulador-colageno",
  "lipo-facial-clinica": "lipo-facial",
  "harmonizacao-facial": "harmonizacao-facial",
  "ultrassom-microfocado-liftera": "ultrassom-microfocado",
  "radiofrequencia": "radiofrequencia",
  "fios-de-sustentacao-pdo": "fios-de-pdo",
};

/* Scan a treatment's image folder. Returns the round "icon" art (a digit-less
   .png) plus the real clinical photos, all as URL-encoded relative paths from
   tratamentos/<slug>/. Photos are preferred over the icon for hero + splits. */
function scanArt(slug) {
  const folder = FOLDER[slug] || slug;
  let files = [];
  try {
    files = readdirSync(join(ROOT, "imagens", folder));
  } catch {
    /* folder missing — handled by caller */
  }
  files = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  const icon =
    files.find((f) => /\.png$/i.test(f) && !/\d/.test(f.replace(/\.png$/i, ""))) ||
    files.find((f) => /\.png$/i.test(f)) ||
    files[0] ||
    "";
  const photos = files
    .filter((f) => f !== icon)
    .sort((a, b) => a.localeCompare(b, "pt"))
    .sort((a, b) => (/\.jpe?g$/i.test(b) ? 1 : 0) - (/\.jpe?g$/i.test(a) ? 1 : 0));
  const url = (f) => (f ? encodeURI(`../../imagens/${folder}/${f}`) : "");
  const abs = (f) => (f ? encodeURI(`${SITE}/imagens/${folder}/${f}`) : "");
  return { folder, iconUrl: url(icon), iconAbs: abs(icon), photos: photos.map(url), count: files.length };
}

/* --- "Links internos" display name → destination -------------------- */
const NAME_TO_SLUG = [
  ["Skincare Personalizado", "skincare-personalizado"],
  ["Skincare Via Oral", "skincare-via-oral"],
  ["Peelings Químicos", "peelings-quimicos"],
  ["Terapia Fotodinâmica", "terapia-fotodinamica"],
  ["Laserterapia e Luz Intensa Pulsada", "laser-luz-intensa-pulsada"],
  ["Laserterapia e LIP", "laser-luz-intensa-pulsada"],
  ["MMP com DNA de Salmão e Exossomas", "mmp-dna-salmao-exossomas"],
  ["Skinbooster", "skinbooster"],
  ["Toxina Botulínica", "toxina-botulinica"],
  ["Preenchimento com Ácido Hialurônico", "acido-hialuronico"],
  ["Bioestimuladores de Colágeno", "bioestimuladores-de-colageno"],
  ["Redução de Gordura Localizada", "lipo-facial-clinica"],
  ["Lipo Facial Clínica", "lipo-facial-clinica"],
  ["Harmonização Facial Integrada", "harmonizacao-facial"],
  ["Harmonização Facial", "harmonizacao-facial"],
  ["Ultrassom Microfocado", "ultrassom-microfocado-liftera"],
  ["Radiofrequência", "radiofrequencia"],
  ["Fios de Sustentação (PDO)", "fios-de-sustentacao-pdo"],
  ["Fios de Sustentação", "fios-de-sustentacao-pdo"],
];

const WA = "5551999704848";
const DISCLAIMER =
  "O conteúdo desta página é informativo e não substitui a consulta médica. A indicação, a técnica e os produtos são definidos individualmente em avaliação presencial. Resultados variam de pessoa para pessoa. Procedimentos realizados por médico dermatologista. Conteúdo em conformidade com as normas do CFM sobre publicidade médica.";

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* inline markdown → HTML (bold, italic, strip backticks) */
const inline = (s) => {
  let t = esc(s.trim());
  t = t.replace(/`([^`]+)`/g, "$1");
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return t;
};

const attr = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

/* split a chunk of text into paragraphs on blank lines */
const paras = (text) =>
  text
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);

/* ------------------------------------------------------------------ */
/* parse COPY-TRATAMENTOS.md into treatment records                   */
/* ------------------------------------------------------------------ */
function parse() {
  // each canonical treatment starts with "## N.M · Name"
  const blocks = COPY.split(/\n(?=## \d+\.\d+ · )/).filter((b) =>
    /^## \d+\.\d+ · /.test(b)
  );

  return blocks.map((block) => {
    const lines = block.split("\n");
    const headMatch = lines[0].match(/^## (\d+)\.(\d+) · (.+)$/);
    const eixo = headMatch[1];
    const name = headMatch[3].replace(/\s*\(.*?\)\s*$/, "").trim();

    const meta = (key) => {
      const re = new RegExp("\\*\\*`?" + key + "`?:\\*\\*\\s*(.+)");
      const m = block.match(re);
      return m ? m[1].replace(/`/g, "").trim() : "";
    };
    const field = (key) => {
      const re = new RegExp("\\*\\*" + key + ":\\*\\*\\s*(.+)");
      const m = block.match(re);
      return m ? m[1].trim() : "";
    };

    const slug = (meta("Slug").match(/tratamentos\/([^/]+)/) || [])[1];
    const title = meta("<title>");
    const description = meta("Metadescrição");
    const h1 = meta("H1");
    const keyphrase = meta("Frase-chave");

    // ---- subsections: "### Title\n...content..." ----
    const sec = {};
    const parts = block.split(/\n### /);
    for (let i = 1; i < parts.length; i++) {
      const nl = parts[i].indexOf("\n");
      const t = parts[i].slice(0, nl).trim();
      sec[t.replace(/\s*\(.*?\)\s*$/, "").trim()] = parts[i].slice(nl + 1).trim();
    }

    const eyebrow = field("Eyebrow").replace(/\s*\*\(.*?\)\*/g, "").trim();
    const subhead = field("Subheadline");

    // "Para quem é": bullets + trailing care paragraph
    const pqRaw = sec["Para quem é"] || "";
    const indic = [];
    let care = "";
    pqRaw.split("\n").forEach((ln) => {
      const b = ln.match(/^- (.+)/);
      if (b) indic.push(b[1].trim());
      const c = ln.match(/^\*\*Para quem não é[^:]*:\*\*\s*(.+)/);
      if (c) care = c[1].trim();
    });

    // "Como funciona": numbered lead + description
    const steps = [];
    (sec["Como funciona"] || "").split("\n").forEach((ln) => {
      const m = ln.match(/^\d+\.\s+\*\*(.+?)\*\*[:：]?\s*(.*)$/);
      if (m) steps.push({ t: m[1].trim().replace(/:$/, ""), d: m[2].trim() });
    });

    // Caso: split narrative vs italic aside
    const casoParas = paras(sec["Caso"] || "");
    const casoText = [];
    const casoNotes = [];
    casoParas.forEach((p) => {
      if (/^\*[^*].*\*$/.test(p)) casoNotes.push(p.replace(/^\*|\*$/g, "").trim());
      else casoText.push(p);
    });

    // FAQ: bold-line question, following text = answer
    const faq = [];
    const faqLines = (sec["FAQ"] || "").split("\n");
    let q = null;
    let a = [];
    const pushFaq = () => {
      if (q) faq.push({ q, a: a.join(" ").trim() });
      q = null;
      a = [];
    };
    faqLines.forEach((ln) => {
      const qm = ln.match(/^\*\*(.+?)\*\*\s*$/);
      if (qm) {
        pushFaq();
        q = qm[1].trim();
      } else if (ln.trim()) {
        a.push(ln.trim());
      }
    });
    pushFaq();

    // CTA de fechamento: closing line + contextual WhatsApp text
    const ctaRaw = sec["CTA de fechamento"] || "";
    const ctaParas = paras(ctaRaw.replace(/→.*$/ms, ""));
    const closing = ctaParas.join(" ");
    const ctxMatch = ctaRaw.match(/WhatsApp[^"”]*["“]([^"”]+)["”]/);
    const ctxMsg = ctxMatch ? ctxMatch[1].trim() : `Olá, gostaria de agendar uma avaliação sobre ${name}.`;

    // Links internos → related chips
    const linksRaw = (block.match(/\*\*Links internos:\*\*\s*(.+)/) || [])[1] || "";
    const related = [];
    linksRaw
      .split("·")
      .map((s) => s.replace(/\*/g, "").trim())
      .filter(Boolean)
      .forEach((label) => {
        if (/^Método 4D/i.test(label)) related.push({ label: "Método 4D", href: "../../metodo-4d.html" });
        else if (/^Eixo/i.test(label)) related.push({ label, href: "../../tratamentos.html" });
        else if (/^Sobre/i.test(label)) related.push({ label: "Sobre o Dr. Márcio", href: "../../sobre.html" });
        else if (/^Contato/i.test(label)) related.push({ label: "Contato", href: "../../contato.html" });
        else {
          const hit = NAME_TO_SLUG.find(([n]) => label.startsWith(n));
          if (hit && hit[1] !== slug) related.push({ label, href: `../${hit[1]}/` });
        }
      });
    const seen = new Set();
    const relatedUniq = related.filter((r) => (seen.has(r.href) ? false : seen.add(r.href)));

    return {
      eixo, slug, name, title, description, h1, keyphrase,
      eyebrow, subhead,
      oque: paras(sec["O que é"] || ""),
      porque: paras(sec["Por que fazer"] || ""),
      indic, care, steps,
      resultados: paras(sec["Resultados esperados"] || ""),
      casoText, casoNotes,
      cuidados: paras(sec["Cuidados"] || ""),
      faq, closing, ctxMsg, related: relatedUniq,
    };
  });
}

/* ------------------------------------------------------------------ */
/* icons + shared chrome                                              */
/* ------------------------------------------------------------------ */
const ARROW =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICO_SHIELD =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICO_4D =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="1.6"/></svg>';
const ICO_PIN =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>';
const WPP_ICON =
  '<svg class="wpp__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24zM6.6 20.13c1.65.98 3.22 1.57 5.4 1.57 5.44 0 9.86-4.42 9.86-9.84S17.44 2.02 12 2.02 2.14 6.44 2.14 11.86c0 2.29.67 4 1.79 5.78l-.99 3.62 3.66-1.13zM17.4 14.3c-.07-.12-.27-.19-.56-.34-.29-.14-1.71-.84-1.97-.94-.27-.1-.46-.14-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.56-.89-2.14-.23-.56-.47-.48-.65-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.76 1.17 2.95c.14.19 2.01 3.07 4.86 4.3.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37z"/></svg>';

function navHTML() {
  const links = [
    ["../../index.html", "Início"],
    ["../../tratamentos.html", "Tratamentos", true],
    ["../../metodo-4d.html", "Método 4D"],
    ["../../tricologia.html", "Tricologia"],
    ["../../sobre.html", "Sobre"],
    ["../../contato.html", "Contato"],
  ];
  const navLinks = links
    .map(([h, l, cur]) => `        <a class="nav__link" href="${h}"${cur ? ' aria-current="page"' : ""}>${l}</a>`)
    .join("\n");
  const drawerLinks = links
    .map(([h, l, cur]) => `    <a class="drawer__link" href="${h}"${cur ? ' aria-current="page"' : ""}>${l}</a>`)
    .join("\n");
  const cta = waLink("Olá, gostaria de agendar uma consulta.");
  return `  <header class="nav nav--solid" data-nav>
    <div class="nav__inner">
      <a class="nav__brand" href="../../index.html" aria-label="Dr. Márcio Teixeira, página inicial">
        <img class="nav__logo nav__logo--light" src="../../logo/logo-header-branco.png" alt="Dr. Márcio Teixeira" />
        <img class="nav__logo nav__logo--solid" src="../../logo/logo-header-colorido.png" alt="Dr. Márcio Teixeira" />
      </a>
      <nav class="nav__links" aria-label="Navegação principal">
        <span class="nav__indicator" aria-hidden="true"></span>
${navLinks}
      </nav>
      <a class="btn btn--primary nav__cta" href="${attr(cta)}" target="_blank" rel="noopener">Agende sua consulta</a>
      <button class="nav__burger" data-drawer-open type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="drawer">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div class="nav-scrim" data-drawer-scrim></div>
  <aside class="drawer" id="drawer" data-drawer aria-hidden="true">
    <button class="drawer__close" data-drawer-close type="button" aria-label="Fechar menu">&times;</button>
${drawerLinks}
    <a class="btn btn--primary drawer__cta" href="${attr(cta)}" target="_blank" rel="noopener">Agende sua consulta</a>
  </aside>`;
}

function footerHTML() {
  return `  <footer class="footer" aria-label="Rodapé">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <img class="footer__logo" src="../../logo/logo-rodape.png" alt="Dr. Márcio Teixeira" loading="lazy" />
          <p class="footer__tagline">Seu dermatologista de confiança em Porto Alegre, excelência desde 1993 em saúde e beleza da pele.</p>
        </div>
        <nav class="footer__nav" aria-label="Navegação do rodapé">
          <p class="footer__col-title">Navegação</p>
          <div class="footer__links">
            <a href="../../index.html">Início</a>
            <a href="../../tratamentos.html">Tratamentos</a>
            <a href="../../metodo-4d.html">Método 4D</a>
            <a href="../../tricologia.html">Tricologia</a>
            <a href="../../sobre.html">Sobre</a>
            <a href="../../contato.html">Contato</a>
          </div>
        </nav>
        <div class="footer__info">
          <p class="footer__col-title">Contato</p>
          <div class="footer__contact">
            <span>Av. Dr. Nilo Peçanha, 1221/602, Porto Alegre/RS</span>
            <span>Seg a Sex: 09h às 19h · Sáb: fechado</span>
            <a href="https://wa.me/5551999704848" target="_blank" rel="noopener">(51) 99970-4848</a>
            <a href="tel:+555131104110">(51) 3110-4110</a>
            <a href="mailto:secretaria@dermaclin.poa.br">secretaria@dermaclin.poa.br</a>
          </div>
        </div>
        <div class="footer__connect">
          <p class="footer__col-title">Redes</p>
          <div class="footer__social">
            <a href="https://instagram.com/dr.marciodermato" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.51.01-4.75.07-.9.04-1.39.2-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71C3.21 8.49 3.2 8.86 3.2 12s.01 3.51.07 4.75c.04.9.2 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.9-.04 1.39-.2 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.04-.9-.2-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32C15.51 4.01 15.14 4 12 4zm0 3.06A4.94 4.94 0 1 1 12 17a4.94 4.94 0 0 1 0-9.88zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28zm5.14-.69a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z" /></svg>
            </a>
            <a href="https://facebook.com/dr.marciodermato" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" /></svg>
            </a>
            <a href="https://wa.me/5551999704848" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24zM6.6 20.13c1.65.98 3.22 1.57 5.4 1.57 5.44 0 9.86-4.42 9.86-9.84S17.44 2.02 12 2.02 2.14 6.44 2.14 11.86c0 2.29.67 4 1.79 5.78l-.99 3.62 3.66-1.13z" /></svg>
            </a>
          </div>
        </div>
      </div>
      <p class="footer__creds">CREMERS 20214 · RQE 10858 | 12078 · Membro titular da Sociedade Brasileira de Dermatologia</p>
      <div class="footer__bottom">
        <span>Dr. Márcio Teixeira © Todos os Direitos Reservados</span>
        <span>Desenvolvido por: Freela In Home</span>
      </div>
    </div>
  </footer>

  <a class="wpp" href="${attr(waLink("Olá, gostaria de agendar uma consulta."))}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
    <span class="wpp__label">Agende pelo WhatsApp</span>
    <span class="wpp__btn">
      <span class="wpp__rings" aria-hidden="true"></span>
      ${WPP_ICON}
      <span class="wpp__pip" aria-hidden="true">1</span>
    </span>
  </a>

  <script src="../../assets/js/main.js" defer></script>`;
}

function jsonLD(t, ogImg) {
  const faqLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const pageLD = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t.h1,
    description: t.description,
    image: ogImg,
    about: { "@type": "MedicalProcedure", name: t.name },
    author: {
      "@type": "Physician",
      name: "Dr. Márcio Teixeira",
      medicalSpecialty: "Dermatology",
    },
    audience: { "@type": "MedicalAudience", geographicArea: "Porto Alegre, RS" },
  };
  const crumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://drmarcioteixeira.com.br/" },
      { "@type": "ListItem", position: 2, name: "Tratamentos", item: "https://drmarcioteixeira.com.br/tratamentos.html" },
      { "@type": "ListItem", position: 3, name: t.name, item: `https://drmarcioteixeira.com.br/tratamentos/${t.slug}/` },
    ],
  };
  return [pageLD, faqLD, crumbLD]
    .map((o) => `  <script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n  </script>`)
    .join("\n");
}

/* ------------------------------------------------------------------ */
/* render one page                                                    */
/* ------------------------------------------------------------------ */
function render(t) {
  const art = scanArt(t.slug);
  const photo = (i) => (art.photos.length ? art.photos[i % art.photos.length] : art.iconUrl);
  const heroImg = photo(0);
  const splitA = photo(1);
  const splitB = photo(2);
  const ogImg = art.iconAbs;

  const eixoNames = {
    "1": "A Superfície da Pele",
    "2": "Linhas de Expressão",
    "3": "Alterações do Volume da Face",
    "4": "Flacidez",
  };
  const eixoLabel = t.eyebrow || `Eixo ${t.eixo} · ${eixoNames[t.eixo]}`;
  const eixoShort = `Eixo ${t.eixo} · ${eixoNames[t.eixo].replace(/^(A |Alterações do )/, "")}`;

  const heroCta = waLink(t.ctxMsg);
  const dudaCta = waLink(`Olá, tenho dúvidas sobre ${t.name}. Pode me ajudar?`);

  const P = (arr, ind = "          ") => arr.map((p) => `${ind}<p>${inline(p)}</p>`).join("\n");

  const ctaBtn = (label) =>
    `<a class="btn btn--primary" href="${attr(heroCta)}" target="_blank" rel="noopener">${esc(label || "Agende sua consulta")}</a>`;
  const ctaRow = (label, center) =>
    `        <div class="ts-cta${center ? " ts-cta--center" : ""}">
          ${ctaBtn(label)}
          <a class="btn btn--ghost" href="${attr(dudaCta)}" target="_blank" rel="noopener">Tirar dúvidas no WhatsApp</a>
        </div>`;

  const beneHTML = t.indic.length
    ? `        <div class="bene-grid" data-count="${t.indic.length}">
${t.indic
  .map(
    (i, n) =>
      `          <div class="bene-card reveal" style="--i:${n}"><span class="bene-card__ico" aria-hidden="true">${CHECK}</span><p>${inline(i)}</p></div>`
  )
  .join("\n")}
        </div>`
    : "";
  const careHTML = t.care
    ? `        <div class="callout">
          <p class="callout__title">Atenção · avaliação necessária</p>
          <p>${inline(t.care)}</p>
        </div>`
    : "";
  const stepsHTML = t.steps
    .map(
      (s) =>
        `          <li><span class="steps__t">${inline(s.t)}</span>${s.d ? `<span class="steps__d">${inline(s.d)}</span>` : ""}</li>`
    )
    .join("\n");
  const caseHTML = t.casoText.length
    ? `        <figure class="case reveal">
          <p class="case__label">Caso ilustrativo</p>
          <blockquote class="case__text">${inline(t.casoText.join(" "))}</blockquote>
${t.casoNotes.map((n) => `          <figcaption class="case__note">${inline(n)}</figcaption>`).join("\n")}
        </figure>`
    : "";
  const faqHTML = t.faq
    .map(
      (f) => `          <details class="faq__item">
            <summary class="faq__q">${inline(f.q)}<span class="faq__sign" aria-hidden="true"></span></summary>
            <div class="faq__a"><p>${inline(f.a)}</p></div>
          </details>`
    )
    .join("\n");
  const relatedHTML = t.related
    .map((r) => `            <a class="related__chip" href="${attr(r.href)}">${esc(r.label)}</a>`)
    .join("\n");

  const heroAlt = attr(`${t.name} na clínica do Dr. Márcio Teixeira em Porto Alegre`);

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(t.title)}</title>
  <meta name="description" content="${attr(t.description)}" />
  <meta name="theme-color" content="#057f7f" />
  <meta name="keywords" content="${attr(t.keyphrase)}" />
  <link rel="canonical" href="https://drmarcioteixeira.com.br/tratamentos/${t.slug}/" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${attr(t.title)}" />
  <meta property="og:description" content="${attr(t.description)}" />
  <meta property="og:image" content="${attr(ogImg)}" />
  <link rel="icon" type="image/png" href="../../logo/logo-header-colorido.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../assets/css/main.css" />
${jsonLD(t, ogImg)}
</head>
<body class="is-loading">
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>

${navHTML()}

  <main>
    <!-- =========================== HERO =========================== -->
    <section class="treat-hero" id="conteudo" aria-labelledby="t-title">
      <div class="container">
        <div class="treat-hero__grid">
          <div class="treat-hero__copy">
            <nav class="crumbs" aria-label="Você está em">
              <a href="../../index.html">Início</a>
              <span class="crumbs__sep" aria-hidden="true">/</span>
              <a href="../../tratamentos.html">Tratamentos</a>
              <span class="crumbs__sep" aria-hidden="true">/</span>
              <span class="crumbs__current">${esc(t.name)}</span>
            </nav>
            <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> ${esc(eixoLabel)}</p>
            <h1 id="t-title" class="treat-hero__title">${esc(t.h1)}</h1>
            <p class="treat-hero__lede">${inline(t.subhead)}</p>
            <div class="treat-hero__actions">
              ${ctaBtn("Agende sua consulta")}
              <a class="btn btn--ghost" href="../../metodo-4d.html">Conheça o Método 4D</a>
            </div>
            <ul class="treat-trust" aria-label="Por que o Dr. Márcio">
              <li class="treat-trust__item">${ICO_SHIELD}<span><strong>Excelência</strong>desde 1993</span></li>
              <li class="treat-trust__item">${ICO_4D}<span><strong>Avaliação</strong>Método 4D</span></li>
              <li class="treat-trust__item">${ICO_PIN}<span><strong>Porto Alegre</strong>Av. Nilo Peçanha</span></li>
            </ul>
          </div>
          <figure class="treat-hero__media">
            <img src="${heroImg}" alt="${heroAlt}" />
          </figure>
        </div>
      </div>
    </section>

    <!-- ========================= O QUE É ========================= -->
    <section class="section section--branco tsec" data-fio="right" aria-labelledby="oque-title">
      <div class="container">
        <div class="grid-12 tsplit">
          <figure class="col-6 media-frame reveal">
            <img src="${splitA}" alt="${attr(t.name + ", atendimento na clínica do Dr. Márcio Teixeira")}" loading="lazy" />
          </figure>
          <div class="col-6 tsplit__copy">
            <header class="ts-head ts-head--left">
              <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> O tratamento</p>
              <h2 id="oque-title" class="ts-title">O que é <span class="hl hl--italic">${esc(t.name)}</span></h2>
            </header>
            <div class="t-prose">
${P(t.oque)}
            </div>
            <a class="ts-link" href="${attr(heroCta)}" target="_blank" rel="noopener">Agende sua avaliação ${ARROW}</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== POR QUE / INDICAÇÕES ===================== -->
    <section class="section section--neve tsec" data-fio="left" aria-labelledby="porque-title">
      <div class="container">
        <header class="ts-head ts-head--center">
          <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Por que fazer</p>
          <h2 id="porque-title" class="ts-title">Benefícios para a <span class="hl hl--italic">sua pele</span></h2>
${t.porque.length ? `          <p class="ts-lede">${inline(t.porque[0])}</p>` : ""}
        </header>
${t.porque.length > 1 ? `        <div class="t-prose t-prose--center">\n${P(t.porque.slice(1))}\n        </div>` : ""}
        <p class="ts-subhead">Indicado para você?</p>
${beneHTML}
${careHTML}
${ctaRow("Quero uma avaliação", true)}
      </div>
    </section>

    <!-- ====================== COMO FUNCIONA ====================== -->
    <section class="section section--branco tsec" data-fio="right" aria-labelledby="como-title">
      <div class="container">
        <div class="grid-12 tsplit">
          <div class="col-7 tsplit__copy">
            <header class="ts-head ts-head--left">
              <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Passo a passo</p>
              <h2 id="como-title" class="ts-title">Como <span class="hl hl--italic">funciona</span></h2>
            </header>
            <ol class="steps">
${stepsHTML}
            </ol>
${ctaRow("Agende sua consulta")}
          </div>
          <figure class="col-5 media-frame media-frame--tall reveal">
            <img src="${splitB}" alt="${attr(t.name + ", procedimento realizado por dermatologista")}" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>

    <!-- ================== RESULTADOS + CASO (warm) ================== -->
    <section class="section section--areia tsec" aria-labelledby="result-title">
      <div class="container">
        <header class="ts-head ts-head--center">
          <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Resultados</p>
          <h2 id="result-title" class="ts-title">Resultados <span class="hl hl--italic">esperados</span></h2>
        </header>
        <div class="t-prose t-prose--center">
${P(t.resultados)}
        </div>
${caseHTML}
${ctaRow("Quero esse cuidado", true)}
      </div>
    </section>

    <!-- ================== CUIDADOS + MÉDICO ================== -->
    <section class="section section--branco tsec" data-fio="left" aria-labelledby="cuidados-title">
      <div class="container">
        <div class="grid-12 tsplit tsplit--top">
          <div class="col-7 tsplit__copy">
            <header class="ts-head ts-head--left">
              <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Pós-procedimento</p>
              <h2 id="cuidados-title" class="ts-title">Cuidados</h2>
            </header>
            <div class="info-card">
              <div class="t-prose">
${P(t.cuidados, "                ")}
              </div>
            </div>
          </div>
          <aside class="col-5 author author--stacked" aria-label="Responsável médico">
            <img class="author__avatar" src="../../imagens/sobre.jpg" alt="Dr. Márcio Teixeira" loading="lazy" />
            <div>
              <p class="author__role">Revisão médica</p>
              <p class="author__name">Dr. Márcio Teixeira</p>
              <p class="author__meta">Dermatologista · CREMERS 20214 · RQE 10858 | 12078 · Membro titular da Sociedade Brasileira de Dermatologia.</p>
              <a class="btn btn--ghost author__cta" href="../../sobre.html">Conheça o Dr. Márcio</a>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- ============================ FAQ ============================ -->
    <section class="section section--neve tsec" data-fio="right" aria-labelledby="faq-title">
      <div class="container ts-narrow">
        <header class="ts-head ts-head--center">
          <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> Dúvidas frequentes</p>
          <h2 id="faq-title" class="ts-title">Perguntas <span class="hl hl--italic">frequentes</span></h2>
        </header>
        <div class="faq" data-accordion>
${faqHTML}
        </div>
${t.related.length ? `        <div class="ts-related">
          <p class="ts-related__label">Veja também</p>
          <div class="related">
${relatedHTML}
          </div>
        </div>` : ""}
        <p class="med-disclaimer">${esc(DISCLAIMER)}</p>
      </div>
    </section>

    <!-- ========================= CTA BAND ========================= -->
    <section class="section section--deep cta-band" id="agende" aria-labelledby="cta-title">
      <div class="container">
        <img class="cta-band__logo" src="../../logo/logo-header-branco.png" alt="Dr. Márcio Teixeira" loading="lazy" />
        <h2 id="cta-title" class="section__title">Pronto para cuidar da sua pele <span class="hl hl--italic">com quem entende</span>?</h2>
        <p class="cta-band__lede">${inline(t.closing)}</p>
        <div class="cta-band__actions">
          <a class="btn btn--on-deep" href="${attr(heroCta)}" target="_blank" rel="noopener">Agende sua consulta</a>
          <a class="btn btn--ghost-on-deep" href="${attr(waLink("Olá, gostaria de falar com a secretaria."))}" target="_blank" rel="noopener">${WPP_ICON.replace('class="wpp__icon"', 'class="btn__icon"')} Fale no WhatsApp</a>
        </div>
      </div>
    </section>
  </main>

${footerHTML()}
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* run                                                                */
/* ------------------------------------------------------------------ */
const treatments = parse();
let count = 0;
const report = [];
for (const t of treatments) {
  if (!t.slug) {
    report.push(`SKIP (no slug): ${t.name}`);
    continue;
  }
  const art = scanArt(t.slug);
  if (!art.count) report.push(`WARN no images found for ${t.slug} (folder: ${art.folder})`);
  const dir = join(ROOT, "tratamentos", t.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), render(t), "utf8");
  count++;
  report.push(
    `OK  ${t.eixo}  ${t.slug}  (photos:${art.photos.length} faq:${t.faq.length} steps:${t.steps.length} indic:${t.indic.length} rel:${t.related.length})`
  );
}
console.log(report.join("\n"));
console.log(`\n${count} treatment pages generated.`);
