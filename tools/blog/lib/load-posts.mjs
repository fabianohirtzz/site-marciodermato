import { readFile } from 'node:fs/promises';
import { mapSupabaseRow } from './supabase-map.mjs';

// Seed local (mapeado para o modelo interno).
export async function fromJson(jsonUrl) {
  const rows = JSON.parse(await readFile(jsonUrl, 'utf8'));
  return rows.map(mapSupabaseRow);
}

// Posts publicados do Supabase via PostgREST com a service key.
export async function fromSupabase({ url, serviceKey, fetchImpl = fetch }) {
  const endpoint = `${url}/rest/v1/mt_posts?status=eq.published&select=*`;
  const res = await fetchImpl(endpoint, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase ${res.status}: ${body}`);
  }
  const rows = await res.json();
  return rows.map(mapSupabaseRow);
}

// Supabase se houver env; senão, o seed.
export async function loadPosts({ env = process.env, jsonUrl, fetchImpl } = {}) {
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
    return fromSupabase({ url: env.SUPABASE_URL, serviceKey: env.SUPABASE_SERVICE_KEY, fetchImpl });
  }
  return fromJson(jsonUrl);
}
