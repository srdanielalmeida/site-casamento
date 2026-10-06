/* ============================================================
   Lista Oficial de Convidados — Daniel & Franciellen Maria
   ============================================================ */

const CONVIDADOS_DEFAULT_LISTA = [
  "Ana Delice & Cláudio",
  "Aniny",
  "Antônio, Iolete & Aniny",
  "Bia, Breno & Maria",
  "Edson & Cris",
  "Eliaques, Lídia, Yasmim, Everton & Felipe",
  "Elizeu & Família",
  "Fernanda",
  "Fernando, Andreza & Arthur",
  "Flávio",
  "Fleidemar, Clarice, Sarah & Benjamin",
  "Gilson & Socorro",
  "Joselma & Gabriel",
  "Julielle",
  "Julianny & Felipe",
  "Julinho, Amanda, Julia & Geraldo",
  "Junior & Francineide",
  "Kevilly",
  "Lauro & Janete",
  "Leandro & Jane Meire",
  "Luan & Cristina",
  "Luan, Cristina & Lizzie",
  "Lukas & Michele",
  "Maciel, Raquel & Oscar",
  "Maciel, Raquel, Oscar & Otávio",
  "Madalena",
  "Maeli & Maria Santiago",
  "Maria Rita, Antônio, Julia, Yasmin & Alisson",
  "Marinete, Rafaela & Miguel",
  "Mateus, Débora & Arthur",
  "Michely",
  "Neto, Beth, Chris & Rayane",
  "Paulo, Cris & Kalel",
  "Pe. Zeno",
  "Raiane, Nilo & Kauã",
  "Railson, Neyde & Família",
  "Rany Belizário",
  "Richardson, Andressa & Amélia",
  "Robson",
  "Rosilda, Juventino & Roque",
  "Rosevelt & Camila",
  "Rubens, Rosângela & Isaías",
  "Samily",
  "Sandra, Geovane & Geovana",
  "Torres & Lucidalva",
  "Valdinar & Ivonete",
  "Vitória, Otávio & Miguel",
  "Yohanan"
];

const LS_CONVIDADOS_LISTA = 'convidados_lista';

/**
 * Retorna a lista atual de convidados (do localStorage ou padrão).
 * @returns {string[]}
 */
function getConvidadosData() {
  try {
    const raw = localStorage.getItem(LS_CONVIDADOS_LISTA);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Convidados] Erro ao ler lista do localStorage:', e);
  }
  return [...CONVIDADOS_DEFAULT_LISTA];
}

/**
 * Salva a lista de convidados no localStorage e atualiza a variável global.
 * @param {string[]} lista
 */
function saveConvidadosData(lista) {
  try {
    if (Array.isArray(lista)) {
      localStorage.setItem(LS_CONVIDADOS_LISTA, JSON.stringify(lista));
      CONVIDADOS_LISTA = lista;
    }
  } catch (e) {
    console.warn('[Convidados] Erro ao salvar lista no localStorage:', e);
  }
}

/**
 * Restaura a lista de convidados para o padrão inicial.
 * @returns {string[]}
 */
function resetarConvidadosData() {
  try {
    localStorage.removeItem(LS_CONVIDADOS_LISTA);
    CONVIDADOS_LISTA = [...CONVIDADOS_DEFAULT_LISTA];
    return CONVIDADOS_LISTA;
  } catch (e) {
    console.warn('[Convidados] Erro ao resetar lista:', e);
    return [...CONVIDADOS_DEFAULT_LISTA];
  }
}

// ────────────────────────────────────────────────────────────
// SINCRONIZAÇÃO EM NUVEM (SUPABASE) — CONVIDADOS
// ────────────────────────────────────────────────────────────

window._supabaseConvidadosTableMissing = false;

/**
 * Normaliza string para comparação
 */
function normalizarNomeConvidado(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Busca a lista de convidados na nuvem (Supabase).
 * Se a tabela existir, sincroniza com o cache local.
 * Se a tabela estiver vazia, popula os convidados padrão automaticamente.
 * @returns {Promise<string[]>}
 */
async function fetchConvidadosFromSupabase() {
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (!sb) {
    return getConvidadosData();
  }

  try {
    const { data, error } = await sb
      .from('convidados_lista')
      .select('id, nome')
      .order('nome', { ascending: true });

    if (error) {
      if (error.code === 'PGRST205' || (error.message && error.message.includes('convidados_lista'))) {
        window._supabaseConvidadosTableMissing = true;
      }
      console.warn('[Supabase] Tabela convidados_lista inacessível, usando local:', error.message);
      return getConvidadosData();
    }

    window._supabaseConvidadosTableMissing = false;

    // Se a tabela existe e já possui convidados cadastrados
    if (Array.isArray(data) && data.length > 0) {
      const listaNomes = data
        .map(row => (row.nome || '').trim())
        .filter(Boolean);

      saveConvidadosData(listaNomes);
      return listaNomes;
    }

    // Se a tabela existe mas está vazia (primeiro uso), faz o bootstrap inicial
    if (Array.isArray(data) && data.length === 0) {
      console.info('[Supabase] Tabela convidados_lista vazia. Inicializando com lista padrão...');
      await bootstrapConvidadosNoSupabase(CONVIDADOS_DEFAULT_LISTA);
      return [...CONVIDADOS_DEFAULT_LISTA];
    }
  } catch (err) {
    console.warn('[Supabase] Erro ao consultar convidados na nuvem:', err);
  }

  return getConvidadosData();
}

/**
 * Popula a tabela do Supabase com os convidados padrão na primeira execução
 */
async function bootstrapConvidadosNoSupabase(lista) {
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (!sb || !Array.isArray(lista) || lista.length === 0) return;

  try {
    const rows = lista.map((nome, idx) => ({
      id: 'g_' + (idx + 1).toString().padStart(3, '0') + '_' + Math.random().toString(36).slice(2, 6),
      nome: nome.trim(),
      created_at: new Date().toISOString()
    }));

    const { error } = await sb.from('convidados_lista').upsert(rows);
    if (!error) {
      saveConvidadosData(lista);
      window._supabaseConvidadosTableMissing = false;
    }
  } catch (e) {
    console.warn('[Supabase] Falha ao popular convidados iniciais:', e);
  }
}

/**
 * Adiciona um convidado na nuvem e no cache local
 */
async function adicionarConvidadoNuven(nome) {
  nome = (nome || '').trim();
  if (!nome) return;

  // 1. Atualiza no local imediatamente
  let lista = getConvidadosData();
  const norm = normalizarNomeConvidado(nome);
  if (!lista.some(c => normalizarNomeConvidado(c) === norm)) {
    lista.push(nome);
    saveConvidadosData(lista);
  }

  // 2. Salva no Supabase
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (sb) {
    try {
      const id = 'g_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      await sb.from('convidados_lista').upsert({
        id: id,
        nome: nome,
        created_at: new Date().toISOString()
      });
      window._supabaseConvidadosTableMissing = false;
    } catch (err) {
      console.warn('[Supabase] Erro ao adicionar convidado na nuvem:', err);
    }
  }
}

/**
 * Altera o nome de um convidado na nuvem e no cache local
 */
async function alterarConvidadoNuven(nomeAntigo, novoNome) {
  nomeAntigo = (nomeAntigo || '').trim();
  novoNome = (novoNome || '').trim();
  if (!nomeAntigo || !novoNome) return;

  // 1. Atualiza local
  let lista = getConvidadosData();
  const normAntigo = normalizarNomeConvidado(nomeAntigo);
  const idx = lista.findIndex(c => normalizarNomeConvidado(c) === normAntigo);
  if (idx >= 0) {
    lista[idx] = novoNome;
    saveConvidadosData(lista);
  }

  // 2. Atualiza no Supabase
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (sb) {
    try {
      await sb.from('convidados_lista').update({ nome: novoNome }).eq('nome', nomeAntigo);
    } catch (err) {
      console.warn('[Supabase] Erro ao alterar convidado na nuvem:', err);
    }
  }
}

/**
 * Remove um convidado da nuvem e do cache local
 */
async function removerConvidadoNuven(nome) {
  nome = (nome || '').trim();
  if (!nome) return;

  // 1. Remove do local
  let lista = getConvidadosData();
  const norm = normalizarNomeConvidado(nome);
  lista = lista.filter(c => normalizarNomeConvidado(c) !== norm);
  saveConvidadosData(lista);

  // 2. Remove do Supabase
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (sb) {
    try {
      await sb.from('convidados_lista').delete().eq('nome', nome);
    } catch (err) {
      console.warn('[Supabase] Erro ao remover convidado na nuvem:', err);
    }
  }
}

// Inicializa a variável global com dados atualizados
var CONVIDADOS_LISTA = getConvidadosData();

