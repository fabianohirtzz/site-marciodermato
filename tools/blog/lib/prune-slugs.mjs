// Dado os slugs gerados antes e agora, devolve os que devem ser removidos.
export function slugsToPrune(oldSlugs, newSlugs) {
  const keep = new Set(newSlugs || []);
  return [...new Set(oldSlugs || [])].filter(slug => !keep.has(slug));
}
