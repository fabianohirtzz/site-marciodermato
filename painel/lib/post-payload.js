import { normalizeEditorHtml } from './clean-html.js';
import { resolveStatus } from './publish-date.js';

// Estado do formulário (camelCase) -> linha da tabela mt_posts (snake_case).
// intent default 'draft' (seguro: nada vai pro ar sem escolha explícita);
// a data escolhida é quem decide entre published (agora/retroativo) e scheduled.
export function buildPayload(form = {}, now = new Date()) {
  const row = {
    slug: form.slug || '',
    title: form.title || '',
    category_name: form.categoryName || '',
    category_color: form.categoryColor || '',
    cover_image: form.coverImage || '',
    excerpt: form.excerpt || '',
    content: normalizeEditorHtml(form.content || ''),
    meta_description: form.metaDescription || '',
    seo_title: form.seoTitle || '',
    og_image: form.ogImage || '',
    focus_keyword: form.focusKeyword || '',
    tags: Array.isArray(form.tags) ? form.tags : [],
    status: resolveStatus(form.intent, form.date, now),
  };
  // Sem data no formulário a chave fica de fora: no insert vale o default now()
  // do Postgres e no update a data já gravada é preservada.
  if (form.date) row.date = form.date;
  return row;
}
