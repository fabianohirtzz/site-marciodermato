// Minutos de leitura a partir do HTML do post (200 palavras/min).
export function readingTime(html) {
  const text = String(html).replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
