/* ==========================================================================
   PRESENTES DATA — Dados dos presentes e Ícones Heráldicos/Customizados
   ========================================================================== */

/**
 * Mapa de Ícones SVG personalizados para categorias
 */
const CATEGORY_SVGS = {
  todos: `<svg viewBox="0 0 52 52" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M31.6,21.6c-1.2,0-2.2-1-2.2-2.2V5.5c0-1.2,1-2.2,2.2-2.2h14.2c1.2,0,2.2,1,2.2,2.2v13.9c0,1.2-1,2.2-2.2,2.2H31.6z"/><path d="M37.7,29.8l-8.2,8.9c-0.5,0.5-0.5,1.3,0,1.9l8.2,8.9c0.5,0.6,1.5,0.6,2,0l8.2-8.9c0.5-0.5,0.5-1.3,0-1.9l-8.2-8.9C39.2,29.2,38.3,29.2,37.7,29.8z"/><circle cx="13" cy="39.4" r="9.3"/><path d="M4.8,6.5l7.2-4.1c0.7-0.4,1.5-0.4,2.1,0l7.1,4.1c0.7,0.4,1.1,1.1,1.1,1.9v8.2c0,0.8-0.4,1.5-1.1,1.9l-7.1,4.1c-0.7,0.4-1.5,0.4-2.1,0l-7.2-4.1c-0.7-0.4-1.1-1.1-1.1-1.9V8.4C3.7,7.6,4.1,6.9,4.8,6.5z"/></svg>`,
  
  eletrodomesticos: `<svg viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.9023438 3.9980469C5.2863438 3.9980469 3.9726562 5.3440469 3.9726562 6.9980469L3.9726562 14L32.033203 14L32.033203 7C32.033203 5.346 30.720516 4 29.103516 4L6.9023438 3.9980469 z M 9 7C9.553 7 10 7.448 10 8L10 11C10 11.552 9.553 12 9 12C8.447 12 8 11.552 8 11L8 8C8 7.448 8.447 7 9 7 z M 3.9726562 16L3.9726562 40.001953C3.9726562 41.655953 5.2872969 43.001953 6.9042969 43.001953L8 43.001953L8 45C8 45.552 8.447 46 9 46L13 46C13.553 46 14 45.552 14 45L14 43.001953L22 43L22 23C22 20.791 23.791 19 26 19L32.033203 19L32.033203 16L3.9726562 16 z M 9 19C9.553 19 10 19.448 10 20L10 24C10 24.552 9.553 25 9 25C8.447 25 8 24.552 8 24L8 20C8 19.448 8.447 19 9 19 z M 27 21C25.346 21 24 22.346 24 24L24 43C24 44.654 25.346 46 27 46L43 46C44.654 46 46 44.654 46 43L46 24C46 22.346 44.654 21 43 21L27 21 z M 38 24C38.552 24 39 24.448 39 25C39 25.552 38.552 26 38 26C37.448 26 37 25.552 37 25C37 24.448 37.448 24 38 24 z M 42 24C42.552 24 43 24.448 43 25C43 25.552 42.552 26 42 26C41.448 26 41 25.552 41 25C41 24.448 41.448 24 42 24 z M 35 29C38.309 29 41 31.691 41 35C41 38.309 38.309 41 35 41C31.691 41 29 38.309 29 35C29 31.691 31.691 29 35 29 z M 35 31 A 4 4 0 0 0 35 39 A 4 4 0 0 0 35 31 z"/></svg>`,
  
  moveis: `<svg viewBox="-1.5 0 19 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2.461 7.02a1.61 1.61 0 0 1 1.61 1.611v2.456h7.857V8.63a1.61 1.61 0 1 1 1.988 1.566v4.634a.476.476 0 0 1-.475.475H2.559a.476.476 0 0 1-.475-.475v-4.634A1.61 1.61 0 0 1 2.46 7.02zm1.059-.894a2.68 2.68 0 0 0-.227-.084V4.669A1.111 1.111 0 0 1 4.4 3.56h7.198a1.111 1.111 0 0 1 1.108 1.109v1.373a2.679 2.679 0 0 0-.227.084 2.717 2.717 0 0 0-1.66 2.505v1.347H5.18V8.631a2.72 2.72 0 0 0-1.66-2.505z"/></svg>`,
  
  cozinha: `<svg viewBox="0 0 55 55" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g><path d="M54.5,40h-6V18.459C48.5,8.453,40.253,0,30.492,0l-0.235,0.002C20.466,0.134,12.5,8.207,12.5,18v4.304 c-1.34-0.965-2.965-1.502-4.612-1.502c-1.635,0-3.17,0.515-4.441,1.488c-1.72,1.317-2.787,3.311-2.93,5.468 c-0.143,2.164,0.648,4.279,2.178,5.809c0.054,0.053,5.396,5.306,8.294,8.04c0.961,0.908,1.512,2.19,1.512,3.518V47h36v-1h6V40z M24.207,44.293l-1.414,1.414L21,43.914l-1.793,1.793l-1.414-1.414l1.793-1.793l-1.793-1.793l1.414-1.414L21,41.086l1.793-1.793 l1.414,1.414L22.414,42.5L24.207,44.293z M25,35.914l-1.793,1.793l-1.414-1.414l1.793-1.793l-1.793-1.793l1.414-1.414L25,33.086 l1.793-1.793l1.414,1.414L26.414,34.5l1.793,1.793l-1.414,1.414L25,35.914z M34.207,44.293l-1.414,1.414L31,43.914l-1.793,1.793 l-1.414-1.414l1.793-1.793l-1.793-1.793l1.414-1.414L31,41.086l1.793-1.793l1.414,1.414L32.414,42.5L34.207,44.293z M34.207,37.707 l-1.414-1.414l1.793-1.793l-1.793-1.793l1.414-1.414L36,33.086l1.793-1.793l1.414,1.414L37.414,34.5l1.793,1.793l-1.414,1.414 L36,35.914L34.207,37.707z M44.207,44.293l-1.414,1.414L41,43.914l-1.793,1.793l-1.414-1.414l1.793-1.793l-1.793-1.793l1.414-1.414 L41,41.086l1.793-1.793l1.414,1.414L42.414,42.5L44.207,44.293z M52.5,44h-4v-2h4V44z"/><rect x="12.5" y="49" width="36" height="6"/></g></svg>`,
  
  cama: `<svg viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5 10C3.347656 10 2 11.347656 2 13L2 26.8125C3.296875 25.6875 4.9375 24.777344 7 24.0625L7 20C7 17.339844 11.542969 17 15.5 17C19.457031 17 24 17.339844 24 20L24 22C24.335938 21.996094 24.65625 22 25 22C25.34375 22 25.664063 21.996094 26 22L26 20C26 17.339844 30.542969 17 34.5 17C38.457031 17 43 17.339844 43 20L43 24.03125C45.058594 24.742188 46.691406 25.671875 48 26.8125L48 13C48 11.347656 46.652344 10 45 10 Z M 25 24C5.90625 24 -0.015625 27.53125 0 37L50 37C50.015625 27.46875 44.09375 24 25 24 Z M 0 39L0 50L7 50L7 46C7 44.5625 7.5625 44 9 44L41 44C42.4375 44 43 44.5625 43 46L43 50L50 50L50 39Z"/></svg>`,
  
  mesa: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21,2H3A1,1,0,0,0,3,4H4V21a1,1,0,0,0,2,0V11H18V21a1,1,0,0,0,2,0V4h1a1,1,0,0,0,0-2ZM14,8H10a1,1,0,0,1,0-2h4a1,1,0,0,1,0,2Z"/></svg>`,
  
  banho: `<svg viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 3.5C2 2.11929 3.11929 1 4.5 1H6V2H7V0H4.5C2.567 0 1 1.567 1 3.5V7H0V8H1V9.5C1 11.2632 2.30385 12.7219 4 12.9646V15H5V13H10V15H11V12.9646C12.6961 12.7219 14 11.2632 14 9.5V8H15V7H2V3.5Z"/><path d="M8 4H5V3H8V4Z"/></svg>`
};

/**
 * Retorna o SVG correspondente à categoria ou seu fallback
 */
function getCategoryIconSvg(categoryId, customIcon) {
  if (categoryId && CATEGORY_SVGS[categoryId]) {
    return CATEGORY_SVGS[categoryId];
  }
  if (customIcon) {
    if (customIcon.trim().startsWith('<svg')) {
      return customIcon;
    }
    // Caso seja id de outra categoria conhecida
    if (CATEGORY_SVGS[customIcon.toLowerCase()]) {
      return CATEGORY_SVGS[customIcon.toLowerCase()];
    }
    return customIcon;
  }
  return CATEGORY_SVGS.todos;
}

const PRESENTES_DEFAULT_DATA = {
  categories: [
    {
      id: 'eletrodomesticos',
      name: 'Eletrodomésticos',
      icon: 'eletrodomesticos'
    },
    {
      id: 'moveis',
      name: 'Móveis',
      icon: 'moveis'
    },
    {
      id: 'cozinha',
      name: 'Cozinha',
      icon: 'cozinha'
    }
  ],
  items: [
    {
      id: 1,
      name: 'Máquina de Lavar Electrolux 13kg Cesto Inox LDA13',
      image: '',
      link: 'https://meli.la/2Nkjpde',
      category: 'eletrodomesticos',
      coupon: ''
    },
    {
      id: 2,
      name: 'Micro-ondas Electrolux 36L Efficient ME36B',
      image: '',
      link: 'https://meli.la/1fXrNjP',
      category: 'eletrodomesticos',
      coupon: ''
    },
    {
      id: 3,
      name: 'Geladeira Brastemp Frost Free 385L Duplex BRM46MB',
      image: '',
      link: 'https://meli.la/31ckSg7',
      category: 'eletrodomesticos',
      coupon: ''
    },
    {
      id: 4,
      name: 'Ar Condicionado Split Inverter TCL 12000 BTUs',
      image: '',
      link: 'https://meli.la/1s8jazq',
      category: 'eletrodomesticos',
      coupon: ''
    },
    {
      id: 5,
      name: 'Ar-condicionado Split Inverter 12000 BTU Prime Air',
      image: '',
      link: 'https://meli.la/2BS4pS9',
      category: 'eletrodomesticos',
      coupon: ''
    },
    {
      id: 6,
      name: 'Cadeira Escritório Presidente Ergonômica 42 Molas Ensacadas',
      image: '',
      link: 'https://meli.la/1p5ihHG',
      category: 'moveis',
      coupon: ''
    },
    {
      id: 7,
      name: 'Poltrona Amamentação Balanço Giratória com Puff',
      image: '',
      link: 'https://meli.la/1LhJCyc',
      category: 'moveis',
      coupon: ''
    },
    {
      id: 8,
      name: 'Panela de Pressão Brinox 4,2L Vanilla',
      image: '',
      link: 'https://meli.la/2ycxPcb',
      category: 'cozinha',
      coupon: ''
    },
    {
      id: 9,
      name: 'Jogo Talheres Faqueiro Búzios 24 Peças Tramontina',
      image: '',
      link: 'https://meli.la/17gPHkE',
      category: 'cozinha',
      coupon: ''
    }
  ]
};

/**
 * Retorna os dados dos presentes do cache local.
 */
function getPresentesData() {
  try {
    const stored = localStorage.getItem('presentes_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.categories && parsed.items) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler dados do localStorage, usando padrão:', e);
  }
  return PRESENTES_DEFAULT_DATA;
}

/**
 * Salva dados dos presentes no localStorage.
 */
function savePresentesData(data) {
  localStorage.setItem('presentes_data', JSON.stringify(data));
}

/**
 * Busca dados em nuvem do Supabase de forma assíncrona.
 * Além dos dados dos itens, sincroniza o status de comprado (is_purchased)
 * para o localStorage local — assim todos os visitantes veem a lista correta.
 */
async function fetchPresentesDataFromSupabase() {
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (!sb) return getPresentesData();

  try {
    const [catsRes, itemsRes] = await Promise.all([
      sb.from('presentes_categorias').select('*').order('ordem', { ascending: true }),
      sb.from('presentes_itens').select('id,name,image,link,category,coupon,is_purchased,purchased_by,purchased_at,audit_info').order('id', { ascending: true })
    ]);

    if (catsRes.error) throw catsRes.error;
    if (itemsRes.error) throw itemsRes.error;

    const categories = (catsRes.data && catsRes.data.length > 0) ? catsRes.data : PRESENTES_DEFAULT_DATA.categories;
    const items = (itemsRes.data && itemsRes.data.length > 0) ? itemsRes.data : PRESENTES_DEFAULT_DATA.items;

    const data = { categories, items };
    savePresentesData(data);

    // ── Sincroniza itens comprados na nuvem para o cache local ──────────────
    // Isso garante que TODOS os dispositivos vejam os itens já comprados,
    // mesmo que não tenham sido eles que clicaram em "Já Comprei!".
    if (itemsRes.data && itemsRes.data.length > 0) {
      const compradosDaNuvem = itemsRes.data
        .filter(it => it.is_purchased === true)
        .map(it => ({
          id: it.id,
          timestamp: it.purchased_at || new Date().toISOString(),
          nomeConvidado: it.purchased_by || '',
          audit_info: it.audit_info || null
        }));

      // Mescla com lista local: itens da nuvem têm precedência
      const listaLocal = getCompradosList();
      const merged = [...compradosDaNuvem];
      listaLocal.forEach(local => {
        if (!merged.some(c => c.id === local.id)) {
          merged.push(local);
        }
      });
      saveCompradosList(merged);
    }

    return data;
  } catch (err) {
    console.warn('[Supabase] Falha ao buscar presentes da nuvem, usando cache local:', err);
    return getPresentesData();
  }
}


/* ============================================================
   SACOLA DE PRESENTES — Funções utilitárias
   ============================================================ */

const LS_MINHA_SACOLA = 'presentes_minha_sacola';
const LS_COMPRADOS    = 'presentes_comprados';

/**
 * Retorna IDs dos presentes separados neste dispositivo.
 * @returns {number[]}
 */
function getSacolaIds() {
  try {
    const raw = localStorage.getItem(LS_MINHA_SACOLA);
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch (_) { return []; }
}

/**
 * Salva IDs da sacola no localStorage.
 * @param {number[]} ids
 */
function saveSacolaIds(ids) {
  localStorage.setItem(LS_MINHA_SACOLA, JSON.stringify(ids));
}

/**
 * Retorna lista de presentes comprados (compartilhada).
 * @returns {{ id: number, timestamp: string, nomeConvidado: string }[]}
 */
function getCompradosList() {
  try {
    const raw = localStorage.getItem(LS_COMPRADOS);
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch (_) { return []; }
}

/**
 * Salva lista de presentes comprados no localStorage.
 */
function saveCompradosList(list) {
  localStorage.setItem(LS_COMPRADOS, JSON.stringify(list));
}

/**
 * Verifica se um item está comprado.
 * @param {number} id
 * @returns {boolean}
 */
function isItemComprado(id) {
  return getCompradosList().some(c => c.id === id);
}

/**
 * Marca um item como comprado (no localStorage e no Supabase).
 * @param {number} id
 * @param {string} [nomeConvidado] - Nome informado pelo convidado (opcional)
 * @param {Object|null} [auditInfo] - Dados de auditoria do dispositivo (coletarAuditoria)
 */
async function marcarComoComprado(id, nomeConvidado, auditInfo) {
  const list = getCompradosList();
  if (!list.some(c => c.id === id)) {
    const registro = {
      id,
      timestamp: new Date().toISOString(),
      nomeConvidado: nomeConvidado || '',
      audit_info: auditInfo || null
    };
    list.push(registro);
    saveCompradosList(list);

    // Sincroniza com Supabase se disponível
    const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
    if (sb) {
      try {
        const payload = {
          is_purchased: true,
          purchased_by: nomeConvidado || '',
          purchased_at: new Date().toISOString()
        };
        // Tenta salvar audit_info (requer coluna audit_info jsonb na tabela)
        if (auditInfo) {
          payload.audit_info = auditInfo;
        }
        await sb.from('presentes_itens').update(payload).eq('id', id);
      } catch (e) {
        console.warn('[Supabase] Erro ao marcar comprado na nuvem:', e);
        // Tenta novamente sem audit_info caso coluna não exista
        try {
          await sb.from('presentes_itens').update({
            is_purchased: true,
            purchased_by: nomeConvidado || '',
            purchased_at: new Date().toISOString()
          }).eq('id', id);
        } catch (e2) {
          console.warn('[Supabase] Erro também sem audit_info:', e2);
        }
      }
    }
  }
}

/**
 * Desmarca um item como comprado (restaurar).
 * @param {number} id
 */
async function desmarcarComprado(id) {
  const list = getCompradosList().filter(c => c.id !== id);
  saveCompradosList(list);

  // Sincroniza com Supabase se disponível
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (sb) {
    try {
      await sb.from('presentes_itens').update({
        is_purchased: false,
        purchased_by: '',
        purchased_at: null
      }).eq('id', id);
    } catch (e) {
      console.warn('[Supabase] Erro ao desmarcar comprado na nuvem:', e);
    }
  }
}

/**
 * Inicia a subscrição Realtime do Supabase para a tabela presentes_itens.
 * Quando outro convidado marcar um item como comprado, o callback é chamado
 * com os dados atualizados para que a UI possa ser atualizada sem reload.
 * @param {function(newRow: Object): void} onUpdate - Chamado com a nova linha
 * @returns {function(): void} Função para cancelar a subscrição
 */
function iniciarRealtimePresentes(onUpdate) {
  const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
  if (!sb || typeof sb.channel !== 'function') return () => {};

  const channel = sb
    .channel('presentes-realtime')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'presentes_itens' },
      (payload) => {
        if (payload && payload.new) {
          const updatedRow = payload.new;

          // Se o item foi marcado como comprado, atualiza a lista local
          if (updatedRow.is_purchased === true) {
            const list = getCompradosList();
            if (!list.some(c => c.id === updatedRow.id)) {
              list.push({
                id: updatedRow.id,
                timestamp: updatedRow.purchased_at || new Date().toISOString(),
                nomeConvidado: updatedRow.purchased_by || '',
                audit_info: updatedRow.audit_info || null
              });
              saveCompradosList(list);
            }
          } else if (updatedRow.is_purchased === false) {
            // Item foi restaurado — remove do cache local
            const list = getCompradosList().filter(c => c.id !== updatedRow.id);
            saveCompradosList(list);
          }

          if (typeof onUpdate === 'function') {
            onUpdate(updatedRow);
          }
        }
      }
    )
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        console.warn('[Supabase Realtime] Erro no canal presentes-realtime.');
      }
    });

  // Retorna função de cancelamento
  return () => {
    try { sb.removeChannel(channel); } catch (_) {}
  };
}
