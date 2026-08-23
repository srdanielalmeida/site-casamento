/* ==========================================================================
   SUPABASE CLIENT — Sincronização em Nuvem em Tempo Real (Presentes & RSVP)
   ========================================================================== */

const SUPABASE_CONFIG = {
  // Cole aqui a URL do seu projeto Supabase (ex: https://xyzcompany.supabase.co)
  url: '',
  
  // Cole aqui a sua chave anônima pública (anon public key)
  anonKey: ''
};

let _supabaseInstance = null;

function getSupabaseClient() {
  if (_supabaseInstance) return _supabaseInstance;

  const url = (SUPABASE_CONFIG.url || '').trim();
  const key = (SUPABASE_CONFIG.anonKey || '').trim();

  if (url && key && typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
    try {
      _supabaseInstance = window.supabase.createClient(url, key);
      return _supabaseInstance;
    } catch (err) {
      console.warn('[Supabase] Falha ao inicializar:', err);
    }
  }
  return null;
}

function isSupabaseConfigured() {
  const url = (SUPABASE_CONFIG.url || '').trim();
  const key = (SUPABASE_CONFIG.anonKey || '').trim();
  return Boolean(url && key && !url.includes('xyzcompany') && !key.includes('sua-chave'));
}
