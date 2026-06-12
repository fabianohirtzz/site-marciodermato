import { formatDatePtBr } from './format-date.mjs';

const pad = n => String(n).padStart(2, '0');

// timestamptz com offset -> ISO naive UTC (usado no JSON-LD).
function normalizeTimestamp(value) {
  if (!value) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

// Linha da tabela mt_posts -> modelo interno (com dateLabel derivado).
export function mapSupabaseRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: normalizeTimestamp(row.date),
    modified: normalizeTimestamp(row.modified || row.date),
    dateLabel: formatDatePtBr(row.date),
    category: { name: row.category_name || '', color: row.category_color || '#057f7f' },
    coverImage: row.cover_image || '',
    excerpt: row.excerpt || '',
    content: row.content || '',
    metaDescription: row.meta_description || '',
    seoTitle: row.seo_title || '',
    ogImage: row.og_image || '',
    focusKeyword: row.focus_keyword || '',
    tags: row.tags || [],
    likes: row.likes || 0,
  };
}
