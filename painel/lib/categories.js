import { POSTS_TABLE, DEFAULT_CATEGORY_COLOR } from '../config.js';

// Reduz linhas {category_name, category_color} a uma lista distinta por nome
// (primeira cor vista vence). Puro e testável.
export function dedupeCategories(rows) {
  const map = new Map();
  for (const r of (rows || [])) {
    const name = (r.category_name || '').trim();
    if (name && !map.has(name)) map.set(name, r.category_color || DEFAULT_CATEGORY_COLOR);
  }
  return [...map].map(([name, color]) => ({ name, color }));
}

// Busca as categorias já usadas no banco (para o datalist do editor).
export async function fetchCategories(supabase) {
  const { data, error } = await supabase.from(POSTS_TABLE).select('category_name,category_color');
  if (error || !data) return [];
  return dedupeCategories(data);
}
