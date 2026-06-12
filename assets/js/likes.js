/* Curtidas anônimas do blog. Módulo ES. Usa a RPC mt_increment_likes.
   A anon key é pública por design (RLS protege o banco). */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://euzmbswywwhmicjlszqw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1em1ic3d5d3dobWljamxzenF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDEyODYsImV4cCI6MjA5NjAxNzI4Nn0.oSIv6fSKVxO9Umuii6xt98cT0yoSqepTIzVCdcocfuU';

const el = document.querySelector('[data-like]');
if (el) {
  const slug = el.getAttribute('data-like');
  const btn = el.querySelector('.like__btn');
  const count = el.querySelector('.like__count');
  const storeKey = `mt_liked:${slug}`;

  if (localStorage.getItem(storeKey)) {
    btn.setAttribute('aria-pressed', 'true');
    btn.classList.add('is-liked');
  }

  btn.addEventListener('click', async () => {
    if (localStorage.getItem(storeKey)) return;
    btn.classList.add('is-liked');
    btn.setAttribute('aria-pressed', 'true');
    count.textContent = String((Number(count.textContent) || 0) + 1);
    localStorage.setItem(storeKey, '1');
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data } = await supabase.rpc('mt_increment_likes', { p_slug: slug });
      if (typeof data === 'number') count.textContent = String(data);
    } catch { /* otimista: mantém o incremento local */ }
  });
}
