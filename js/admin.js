/* ============================================================
   ADMIN — JavaScript: Login, CRUD de categorias e presentes
   ============================================================ */

(function () {
  'use strict';

  // ── Senha (hardcoded por enquanto — migrar para Supabase depois) ──
  const ADMIN_PASSWORD = 'danellie2026';

  // ── Elementos ──
  const loginScreen  = document.getElementById('admin-login');
  const adminPanel   = document.getElementById('admin-panel');
  const loginForm    = document.getElementById('login-form');
  const loginError   = document.getElementById('login-error');
  const passwordInput = document.getElementById('admin-password');

  // ── Estado ──
  let data = null;
  let editingItemId = null;

  // ────────────────────────────────────────────────────────────
  // 1. LOGIN
  // ────────────────────────────────────────────────────────────
  function checkSession() {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      showPanel();
    }
  }

  function showPanel() {
    loginScreen.hidden = true;
    adminPanel.hidden = false;
    loadData();
    renderAll();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passwordInput.value === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      loginError.hidden = true;
      showPanel();
    } else {
      loginError.hidden = false;
      passwordInput.value = '';
      passwordInput.focus();
    }
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    sessionStorage.removeItem('admin_auth');
    loginScreen.hidden = false;
    adminPanel.hidden = true;
    passwordInput.value = '';
  });

  // ────────────────────────────────────────────────────────────
  // 2. DADOS & SUPABASE
  // ────────────────────────────────────────────────────────────
  function updateSupabaseStatusBadge() {
    const badge = document.getElementById('supabase-status-badge');
    if (!badge) return;

    if (typeof isSupabaseConfigured === 'function' && isSupabaseConfigured()) {
      if (window._supabaseConvidadosTableMissing) {
        badge.textContent = '🟢 Nuvem Conectada (Tabela de Convidados Pendente)';
        badge.className = 'admin-item-status';
        badge.style.borderColor = 'rgba(212, 175, 55, 0.6)';
        badge.style.color = 'var(--gold-light)';
      } else {
        badge.textContent = '🟢 Nuvem Conectada (Supabase 100%)';
        badge.className = 'admin-item-status admin-item-status-disponivel';
        badge.style.borderColor = 'rgba(76, 175, 80, 0.4)';
        badge.style.color = '';
      }
    } else {
      badge.textContent = '🟡 Modo Local (Offline / localStorage)';
      badge.className = 'admin-item-status';
      badge.style.borderColor = 'rgba(212, 175, 55, 0.4)';
      badge.style.color = '';
    }
  }

  async function loadData() {
    data = getPresentesData();
    updateSupabaseStatusBadge();

    // Se o Supabase estiver configurado, busca presentes, confirmações RSVP e convidados da nuvem
    const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
    if (sb) {
      try {
        const [cloudData, rsvpRes, cloudConvidados] = await Promise.all([
          typeof fetchPresentesDataFromSupabase === 'function' ? fetchPresentesDataFromSupabase() : null,
          sb.from('rsvp_confirmacoes').select('*').order('created_at', { ascending: false }),
          typeof fetchConvidadosFromSupabase === 'function' ? fetchConvidadosFromSupabase() : null
        ]);

        if (cloudData && cloudData.items && cloudData.items.length > 0) {
          data = cloudData;
        }

        if (!rsvpRes.error && Array.isArray(rsvpRes.data)) {
          const mappedRsvp = rsvpRes.data.map(r => ({
            id: r.id,
            nome: r.nome,
            mensagem: r.mensagem || '',
            timestamp: r.created_at || r.timestamp || new Date().toISOString(),
            created_at: r.created_at || r.timestamp
          }));
          localStorage.setItem(LS_ALL_CONFIRMS, JSON.stringify(mappedRsvp));
        }

        renderAll();
        updateSupabaseStatusBadge();
      } catch (err) {
        console.warn('[Supabase] Erro ao sincronizar dados no admin:', err);
      }
    }
  }

  async function save() {
    savePresentesData(data);
    renderAll();

    // Sincroniza em nuvem se o Supabase estiver ativo
    const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
    if (sb) {
      try {
        // Upsert categorias
        if (data.categories && data.categories.length > 0) {
          const catsToSave = data.categories.map((c, idx) => ({
            id: c.id,
            name: c.name,
            icon: c.icon || '',
            ordem: idx + 1
          }));
          await sb.from('presentes_categorias').upsert(catsToSave);
        }

        // Upsert itens
        if (data.items && data.items.length > 0) {
          const itemsToSave = data.items.map(it => ({
            id: it.id,
            name: it.name,
            image: it.image || '',
            link: it.link || '',
            category: it.category || null,
            coupon: it.coupon || ''
          }));
          const { error: itemErr } = await sb.from('presentes_itens').upsert(itemsToSave);
          if (itemErr) {
            console.warn('[Supabase] Tentando salvar sem coluna coupon...', itemErr);
            const itemsWithoutCoupon = data.items.map(it => ({
              id: it.id,
              name: it.name,
              image: it.image || '',
              link: it.link || '',
              category: it.category || null
            }));
            await sb.from('presentes_itens').upsert(itemsWithoutCoupon);
          }
        }
      } catch (err) {
        console.warn('[Supabase] Erro ao sincronizar alterações:', err);
      }
    }
  }

  function getNextItemId() {
    if (data.items.length === 0) return 1;
    return Math.max(...data.items.map((i) => i.id)) + 1;
  }

  // ────────────────────────────────────────────────────────────
  // 3. RENDERIZAÇÃO
  // ────────────────────────────────────────────────────────────
  function renderAll() {
    renderCategories();
    renderItems();
    renderStats();
    populateCategorySelects();
    renderRsvpList();
    renderComprados();
  }

  // ── Presentes Comprados ──
  function renderComprados() {
    const container = document.getElementById('comprados-list');
    const counter   = document.getElementById('comprados-counter');
    if (!container) return;

    const comprados = getCompradosList();
    const allItems  = data ? data.items : [];

    if (counter) {
      counter.textContent = comprados.length === 0
        ? 'Nenhum comprado'
        : `${comprados.length} comprado${comprados.length !== 1 ? 's' : ''}`;
    }

    if (comprados.length === 0) {
      container.innerHTML = `
        <div class="admin-rsvp-empty">
          <p>Nenhum presente foi marcado como comprado ainda.</p>
        </div>`;
      return;
    }

    // Ordenar por timestamp (mais recentes primeiro)
    const sorted = [...comprados].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    container.innerHTML = `
      <table class="admin-rsvp-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Presente</th>
            <th>Comprado por</th>
            <th>Data / Hora</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map((c, i) => {
            const item = allItems.find(it => it.id === c.id);
            const itemName = item ? item.name : `ID ${c.id} (removido)`;
            const temAudit = c.audit_info && typeof c.audit_info === 'object';
            return `
              <tr>
                <td class="admin-rsvp-num">${sorted.length - i}</td>
                <td class="admin-rsvp-nome">${escapeHtml(itemName)}</td>
                <td class="admin-rsvp-msg">${c.nomeConvidado ? escapeHtml(c.nomeConvidado) : '<span class="admin-rsvp-empty-msg">—</span>'}</td>
                <td class="admin-rsvp-data">${formatarData(c.timestamp)}</td>
                <td style="display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap;">
                  <button class="admin-btn admin-btn-outline admin-btn-sm" data-restaurar-id="${c.id}" title="Restaurar para a lista">
                    <svg viewBox="0 0 16 16" fill="none" width="12" height="12"><path d="M2 8a6 6 0 0 1 11.5-2.5M14 8a6 6 0 0 1-11.5 2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M14 2v4h-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 14v-4h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Restaurar
                  </button>
                  <button class="admin-btn admin-btn-outline admin-btn-sm audit-btn" data-audit-id="${c.id}" title="Ver detalhes de quem comprou">
                    🔍 Detalhes
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>`;

    // Event listeners — Restaurar presentes
    container.querySelectorAll('[data-restaurar-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.restaurarId);
        const item = allItems.find(it => it.id === id);
        const nome = item ? item.name : `ID ${id}`;
        if (confirm(`Restaurar "${nome}" para a lista de presentes disponíveis?`)) {
          btn.disabled = true;
          btn.textContent = 'Restaurando...';
          await desmarcarComprado(id);
          renderAll();
        }
      });
    });

    // Event listeners — Ver detalhes de auditoria
    container.querySelectorAll('[data-audit-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.auditId);
        const comprado = sorted.find(c => c.id === id);
        const item = allItems.find(it => it.id === id);
        if (comprado) abrirModalAuditoria(comprado, item);
      });
    });
  }

  // ── Modal de Auditoria do Comprador ──
  function abrirModalAuditoria(comprado, item) {
    const a = comprado.audit_info && typeof comprado.audit_info === 'object'
      ? comprado.audit_info
      : null;
    const nulo = '<span class="audit-vazio">—</span>';
    const sim  = '<span class="audit-ok">✓ Sim</span>';
    const nao  = '<span class="audit-nao">✗ Não</span>';

    // Formata valor ou exibe — se nulo/vazio
    const v = (val) => {
      if (val === null || val === undefined || val === '') return nulo;
      return escapeHtml(String(val));
    };

    // Dados de ação humana
    let acaoHtml = nulo;
    if (a && a.acao_humana && typeof a.acao_humana === 'object') {
      const ah = a.acao_humana;
      const passou = ah.passou === true ? sim : nao;
      const trusted = ah.is_trusted === true ? sim : nao;
      const tempo = (ah.tempo_modal_ms != null) ? `${ah.tempo_modal_ms} ms` : null;
      const honeypot = ah.honeypot_ok === true ? sim : nao;
      acaoHtml = `
        <div class="audit-grid">
          <div class="audit-field"><span class="audit-label">Resultado geral</span>${passou}</div>
          <div class="audit-field"><span class="audit-label">Clique real (isTrusted)</span>${trusted}</div>
          <div class="audit-field"><span class="audit-label">Tempo no modal</span>${v(tempo)}</div>
          <div class="audit-field"><span class="audit-label">Honeypot (sem bot)</span>${honeypot}</div>
        </div>`;
    }

    // Dados de RSVP vinculado
    let rsvpHtml = nulo;
    if (a && a.vinculo_rsvp) {
      rsvpHtml = `<span class="audit-ok">${escapeHtml(a.vinculo_rsvp)}</span>`;
    } else if (a) {
      rsvpHtml = '<span class="audit-vazio">Não confirmou presença neste dispositivo</span>';
    }

    const overlay = document.createElement('div');
    overlay.className = 'audit-modal-overlay';
    overlay.innerHTML = `
      <div class="audit-modal">
        <div class="audit-modal-header">
          <h3 class="audit-modal-title">🔍 Auditoria da Compra</h3>
          <button class="audit-modal-close" id="audit-close" title="Fechar">×</button>
        </div>
        <p class="audit-item-name">${v(item ? item.name : comprado.id)}</p>

        <section class="audit-section">
          <h4 class="audit-section-title">👤 Identificação</h4>
          <div class="audit-grid">
            <div class="audit-field"><span class="audit-label">Nome informado</span>${comprado.nomeConvidado ? escapeHtml(comprado.nomeConvidado) : '<span class="audit-vazio">Anônimo</span>'}</div>
            <div class="audit-field"><span class="audit-label">Convidado via RSVP</span>${rsvpHtml}</div>
            <div class="audit-field"><span class="audit-label">Data / Hora</span>${formatarData(comprado.timestamp)}</div>
          </div>
        </section>

        <section class="audit-section">
          <h4 class="audit-section-title">📱 Dispositivo</h4>
          <div class="audit-grid">
            <div class="audit-field"><span class="audit-label">Tipo de dispositivo</span>${a ? v(a.dispositivo) : nulo}</div>
            <div class="audit-field"><span class="audit-label">Sistema Operacional</span>${a ? v(a.os) : nulo}</div>
            <div class="audit-field"><span class="audit-label">Navegador</span>${a ? v(a.browser) : nulo}</div>
            <div class="audit-field"><span class="audit-label">Resolução da tela</span>${a ? v(a.resolucao) : nulo}</div>
            <div class="audit-field"><span class="audit-label">Fuso horário</span>${a ? v(a.timezone) : nulo}</div>
            <div class="audit-field"><span class="audit-label">Idioma</span>${a ? v(a.idioma) : nulo}</div>
            <div class="audit-field"><span class="audit-label">Online no momento</span>${a ? (a.online === true ? sim : a.online === false ? nao : nulo) : nulo}</div>
          </div>
          ${a && a.ua ? `<div class="audit-ua"><span class="audit-label">User Agent</span><code>${escapeHtml(a.ua)}</code></div>` : ''}
        </section>

        <section class="audit-section">
          <h4 class="audit-section-title">🌐 Rede / Localização</h4>
          <p class="audit-note">Dados obtidos via IP público (ip-api.com). Podem estar em branco se o serviço estava indisponível.</p>
          <div class="audit-grid">
            <div class="audit-field"><span class="audit-label">Endereço IP</span>${a ? v(a.ip) : nulo}</div>
            <div class="audit-field"><span class="audit-label">Cidade</span>${a ? v(a.cidade) : nulo}</div>
            <div class="audit-field"><span class="audit-label">Estado / Região</span>${a ? v(a.regiao) : nulo}</div>
            <div class="audit-field"><span class="audit-label">Provedor (ISP)</span>${a ? v(a.isp) : nulo}</div>
          </div>
        </section>

        <section class="audit-section">
          <h4 class="audit-section-title">🤖 Verificação Anti-Bot</h4>
          ${acaoHtml}
        </section>

        ${!a ? '<p class="audit-no-data">⚠️ Dados de auditoria não disponíveis para esta compra. Compras anteriores à atualização do sistema não possuem auditoria.</p>' : ''}

        <div class="audit-modal-footer">
          <button class="admin-btn admin-btn-ghost admin-btn-sm" id="audit-close-btn">Fechar</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));

    const fechar = () => {
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 300);
    };
    overlay.querySelector('#audit-close').addEventListener('click', fechar);
    overlay.querySelector('#audit-close-btn').addEventListener('click', fechar);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) fechar(); });
  }


  // ── Categorias ──
  function renderCategories() {
    const list = document.getElementById('categories-list');
    if (!list || !data) return;

    list.innerHTML = data.categories.map((cat) => {
      const count = data.items.filter((i) => i.category === cat.id).length;
      const iconSvg = typeof getCategoryIconSvg === 'function' ? getCategoryIconSvg(cat.id, cat.icon) : (cat.icon || '');
      return `
        <div class="admin-cat-chip" data-cat-id="${cat.id}">
          <span class="admin-cat-chip-icon">${iconSvg}</span>
          <span class="admin-cat-chip-name">${cat.name}</span>
          <span class="admin-cat-chip-count">(${count})</span>
          <button class="admin-cat-chip-delete" title="Remover categoria" data-delete-cat="${cat.id}">×</button>
        </div>
      `;
    }).join('');

    // Event listeners para deletar
    list.querySelectorAll('[data-delete-cat]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const catId = btn.dataset.deleteCat;
        const count = data.items.filter((i) => i.category === catId).length;
        if (count > 0) {
          if (!confirm(`Esta categoria tem ${count} item(ns). Remover a categoria e todos os seus itens?`)) return;
          data.items = data.items.filter((i) => i.category !== catId);
        }
        data.categories = data.categories.filter((c) => c.id !== catId);
        savePresentesData(data);
        renderAll();

        // Remove imediatamente do Supabase na nuvem
        const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
        if (sb) {
          try {
            if (count > 0) {
              await sb.from('presentes_itens').delete().eq('category', catId);
            }
            await sb.from('presentes_categorias').delete().eq('id', catId);
          } catch (e) {
            console.warn('[Supabase] Erro ao deletar categoria na nuvem:', e);
          }
        }
      });
    });
  }

  // ── Presentes ──
  function renderItems() {
    const list = document.getElementById('items-list');
    const filterCat = document.getElementById('filter-category');
    if (!list || !data) return;

    const filterValue = filterCat ? filterCat.value : 'todos';
    const filteredItems = filterValue === 'todos'
      ? data.items
      : data.items.filter((i) => i.category === filterValue);

    if (filteredItems.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 2rem; opacity: 0.5;">
          <p style="font-family: var(--font-simple); color: var(--text-muted);">Nenhum presente cadastrado${filterValue !== 'todos' ? ' nesta categoria' : ''}.</p>
        </div>
      `;
      return;
    }

    const comprados = getCompradosList();

    list.innerHTML = filteredItems.map((item, idx) => {
      const cat = data.categories.find((c) => c.id === item.category);
      const catName = cat ? cat.name : item.category;
      const isComprado = comprados.some(c => c.id === item.id);
      const compradoInfo = comprados.find(c => c.id === item.id);

      const statusBadge = isComprado
        ? `<span class="admin-item-status admin-item-status-comprado" title="Comprado${compradoInfo && compradoInfo.nomeConvidado ? ' por ' + compradoInfo.nomeConvidado : ''}">
            <svg viewBox="0 0 16 16" width="10" height="10" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Comprado
          </span>`
        : `<span class="admin-item-status admin-item-status-disponivel">Disponível</span>`;

      const forcarBtn = !isComprado
        ? `<button class="admin-btn-icon" title="Marcar como comprado" data-forcar-comprado="${item.id}">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>`
        : '';

      return `
        <div class="admin-item-row ${isComprado ? 'admin-item-row-comprado' : ''}">
          <span class="admin-item-num">${String(idx + 1).padStart(2, '0')}</span>
          <div class="admin-item-info">
            <span class="admin-item-name" title="${item.name}">${item.name}</span>
            <a href="${item.link}" target="_blank" rel="noopener" class="admin-item-link" title="${item.link}">${item.link}</a>
          </div>
          ${statusBadge}
          <span class="admin-item-cat-badge">${catName}</span>
          ${item.coupon ? `<span class="admin-item-cat-badge" style="background:rgba(212,175,55,0.15); border-color:rgba(212,175,55,0.4); color:var(--gold-light);" title="Cupom de Desconto">🏷️ ${escapeHtml(item.coupon)}</span>` : ''}
          <div class="admin-item-actions">
            ${forcarBtn}
            <button class="admin-btn-icon" title="Editar" data-edit-item="${item.id}">
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="admin-btn-icon btn-delete" title="Remover" data-delete-item="${item.id}">
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Event listeners
    list.querySelectorAll('[data-edit-item]').forEach((btn) => {
      btn.addEventListener('click', () => editItem(parseInt(btn.dataset.editItem)));
    });

    list.querySelectorAll('[data-delete-item]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.deleteItem);
        const item = data.items.find((i) => i.id === id);
        if (item && confirm(`Remover "${item.name}" da lista?`)) {
          data.items = data.items.filter((i) => i.id !== id);
          savePresentesData(data);
          renderAll();

          // Remove imediatamente do Supabase na nuvem
          const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
          if (sb) {
            try {
              const { error } = await sb.from('presentes_itens').delete().eq('id', id);
              if (error) console.warn('[Supabase] Erro ao deletar item:', error);
            } catch (e) {
              console.warn('[Supabase] Erro ao deletar item:', e);
            }
          }
        }
      });
    });

    // Forçar como comprado
    list.querySelectorAll('[data-forcar-comprado]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.forcarComprado);
        const item = data.items.find((i) => i.id === id);
        if (item && confirm(`Marcar "${item.name}" como comprado manualmente?`)) {
          marcarComoComprado(id, 'Admin');
          renderAll();
        }
      });
    });
  }

  // ── Stats ──
  function renderStats() {
    const statsEl = document.getElementById('admin-stats');
    if (!statsEl || !data) return;

    statsEl.innerHTML = `
      <span>Total: <span class="admin-stat-value">${data.items.length}</span> presentes</span>
      <span>Categorias: <span class="admin-stat-value">${data.categories.length}</span></span>
    `;
  }

  // ── Selects de categoria ──
  function populateCategorySelects() {
    const filterSelect = document.getElementById('filter-category');
    const itemSelect = document.getElementById('item-category');

    if (filterSelect) {
      const currentValue = filterSelect.value;
      filterSelect.innerHTML = `<option value="todos">Todas as categorias</option>`;
      data.categories.forEach((cat) => {
        filterSelect.innerHTML += `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`;
      });
      filterSelect.value = currentValue || 'todos';
    }

    if (itemSelect) {
      itemSelect.innerHTML = `<option value="">Selecione...</option>`;
      data.categories.forEach((cat) => {
        itemSelect.innerHTML += `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`;
      });
    }
  }


  // ────────────────────────────────────────────────────────────
  // 4. CRUD — CATEGORIAS
  // ────────────────────────────────────────────────────────────
  const formCat = document.getElementById('form-category');
  const btnAddCat = document.getElementById('btn-add-category');
  const btnSaveCat = document.getElementById('btn-save-category');
  const btnCancelCat = document.getElementById('btn-cancel-category');
  const catNameInput = document.getElementById('cat-name');
  const catIconInput = document.getElementById('cat-icon');

  btnAddCat.addEventListener('click', () => {
    formCat.hidden = false;
    catNameInput.value = '';
    catIconInput.value = '';
    catNameInput.focus();
  });

  btnCancelCat.addEventListener('click', () => {
    formCat.hidden = true;
  });

  btnSaveCat.addEventListener('click', () => {
    const name = catNameInput.value.trim();
    const icon = catIconInput.value.trim() || '📦';

    if (!name) {
      catNameInput.focus();
      return;
    }

    const id = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Verificar duplicatas
    if (data.categories.some((c) => c.id === id)) {
      alert('Já existe uma categoria com este nome.');
      return;
    }

    data.categories.push({ id, name, icon });
    save();
    formCat.hidden = true;
  });


  // ────────────────────────────────────────────────────────────
  // 5. CRUD — PRESENTES
  // ────────────────────────────────────────────────────────────
  const formItem = document.getElementById('form-item');
  const formItemTitle = document.getElementById('form-item-title');
  const btnAddItem = document.getElementById('btn-add-item');
  const btnSaveItem = document.getElementById('btn-save-item');
  const btnCancelItem = document.getElementById('btn-cancel-item');
  const itemEditId = document.getElementById('item-edit-id');
  const itemName = document.getElementById('item-name');
  const itemLink = document.getElementById('item-link');
  const itemCategory = document.getElementById('item-category');
  const itemImage = document.getElementById('item-image');
  const itemCoupon = document.getElementById('item-coupon');

  btnAddItem.addEventListener('click', () => {
    editingItemId = null;
    formItemTitle.textContent = 'Adicionar Presente';
    itemEditId.value = '';
    itemName.value = '';
    itemLink.value = '';
    itemCategory.value = '';
    itemImage.value = '';
    if (itemCoupon) itemCoupon.value = '';
    formItem.hidden = false;
    itemName.focus();
  });

  btnCancelItem.addEventListener('click', () => {
    formItem.hidden = true;
    editingItemId = null;
  });

  function editItem(id) {
    const item = data.items.find((i) => i.id === id);
    if (!item) return;

    editingItemId = id;
    formItemTitle.textContent = 'Editar Presente';
    itemEditId.value = id;
    itemName.value = item.name;
    itemLink.value = item.link;
    itemCategory.value = item.category;
    itemImage.value = item.image || '';
    if (itemCoupon) itemCoupon.value = item.coupon || '';
    formItem.hidden = false;
    itemName.focus();
  }

  btnSaveItem.addEventListener('click', () => {
    const name = itemName.value.trim();
    const link = itemLink.value.trim();
    const category = itemCategory.value;
    const image = itemImage.value.trim();
    const coupon = itemCoupon ? itemCoupon.value.trim() : '';

    if (!name || !link || !category) {
      if (!name) itemName.focus();
      else if (!link) itemLink.focus();
      else itemCategory.focus();
      return;
    }

    if (editingItemId) {
      // Editar existente
      const item = data.items.find((i) => i.id === editingItemId);
      if (item) {
        item.name = name;
        item.link = link;
        item.category = category;
        item.image = image;
        item.coupon = coupon;
      }
    } else {
      // Adicionar novo
      data.items.push({
        id: getNextItemId(),
        name,
        image,
        link,
        category,
        coupon
      });
    }

    save();
    formItem.hidden = true;
    editingItemId = null;
  });

  // Filtro por categoria na lista
  const filterCat = document.getElementById('filter-category');
  if (filterCat) {
    filterCat.addEventListener('change', renderItems);
  }


  // ────────────────────────────────────────────────────────────
  // 6. RESTAURAR DADOS PADRÃO
  // ────────────────────────────────────────────────────────────
  document.getElementById('btn-reset-data').addEventListener('click', async () => {
    if (confirm('Tem certeza? Todas as alterações feitas serão perdidas e os dados serão restaurados para o padrão.')) {
      localStorage.removeItem('presentes_data');
      data = JSON.parse(JSON.stringify(PRESENTES_DEFAULT_DATA));
      savePresentesData(data);
      renderAll();

      const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
      if (sb) {
        try {
          await sb.from('presentes_itens').delete().neq('id', 0);
          await sb.from('presentes_categorias').delete().neq('id', '');
          await save();
        } catch (e) {
          console.warn('[Supabase] Erro ao resetar banco na nuvem:', e);
        }
      }
    }
  });


  // ────────────────────────────────────────────────────────────
  // 7. RSVP — Confirmações de Presença (Gerenciamento Total)
  // ────────────────────────────────────────────────────────────
  const LS_ALL_CONFIRMS = 'rsvp_confirmacoes';

  function getRsvpList() {
    try {
      const raw = localStorage.getItem(LS_ALL_CONFIRMS);
      const lista = JSON.parse(raw || '[]');
      return Array.isArray(lista) ? lista : [];
    } catch (_) { return []; }
  }

  function saveRsvpListLocal(lista) {
    localStorage.setItem(LS_ALL_CONFIRMS, JSON.stringify(lista));
  }

  function formatarData(isoString) {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (_) { return isoString || '—'; }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function normalizarNome(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s,&+]+/g, ' ')
      .trim();
  }

  function gerarIdRsvp() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ── Convidados Data Helper ──
  function getListaConvidados() {
    if (typeof getConvidadosData === 'function') {
      return getConvidadosData();
    }
    return (typeof CONVIDADOS_LISTA !== 'undefined' && Array.isArray(CONVIDADOS_LISTA))
      ? [...CONVIDADOS_LISTA]
      : [];
  }

  function salvarListaConvidados(lista) {
    if (typeof saveConvidadosData === 'function') {
      saveConvidadosData(lista);
    } else {
      localStorage.setItem('convidados_lista', JSON.stringify(lista));
      if (typeof CONVIDADOS_LISTA !== 'undefined') {
        CONVIDADOS_LISTA = lista;
      }
    }
  }

  // ── Ações no banco de dados / LocalStorage ──
  async function desconfirmarPresenca(nome, confId) {
    if (!confirm(`Deseja desmarcar a confirmação de "${nome}"?\nO convidado continuará na lista de presença como "Pendente" e poderá confirmar novamente.`)) {
      return;
    }

    // 1. Remove do cache local de confirmações
    let lista = getRsvpList();
    const norm = normalizarNome(nome);
    lista = lista.filter(c => normalizarNome(c.nome) !== norm && (confId ? c.id !== confId : true));
    saveRsvpListLocal(lista);

    // 2. Remove do Supabase de forma segura (somente o registro correspondente)
    const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
    if (sb) {
      try {
        if (confId) {
          await sb.from('rsvp_confirmacoes').delete().eq('id', confId);
        } else {
          await sb.from('rsvp_confirmacoes').delete().eq('nome', nome);
        }
      } catch (err) {
        console.warn('[Supabase] Erro ao desconfirmar presença:', err);
      }
    }

    renderRsvpList();
    popularSelectConvidados();
  }

  async function salvarConfirmacaoManual(nome, mensagem, confId) {
    const lista = getRsvpList();
    const norm = normalizarNome(nome);
    const existingIdx = lista.findIndex(c => normalizarNome(c.nome) === norm || (confId && c.id === confId));

    const idUsado = confId || (existingIdx >= 0 && lista[existingIdx].id) || gerarIdRsvp();
    const timestamp = (existingIdx >= 0 && lista[existingIdx].timestamp) || new Date().toISOString();

    const novoRegistro = {
      id: idUsado,
      nome: nome,
      mensagem: mensagem || '',
      timestamp: timestamp,
      created_at: timestamp
    };

    if (existingIdx >= 0) {
      lista[existingIdx] = novoRegistro;
    } else {
      lista.push(novoRegistro);
    }
    saveRsvpListLocal(lista);

    // Salva no Supabase de forma segura
    const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
    if (sb) {
      try {
        await sb.from('rsvp_confirmacoes').upsert({
          id: novoRegistro.id,
          nome: novoRegistro.nome,
          mensagem: novoRegistro.mensagem,
          created_at: novoRegistro.timestamp
        });
      } catch (err) {
        console.warn('[Supabase] Erro ao salvar confirmação manual:', err);
      }
    }

    renderRsvpList();
    popularSelectConvidados();
  }

  // ── Adicionar, Alterar e Remover Convidado da Lista ──
  async function adicionarNovoConvidado(nome, jaConfirmar, mensagem) {
    nome = (nome || '').trim();
    if (!nome) return;

    let convidados = getListaConvidados();
    const norm = normalizarNome(nome);
    if (convidados.some(c => normalizarNome(c) === norm)) {
      alert(`O convidado "${nome}" já consta na lista de presença.`);
      return;
    }

    convidados.push(nome);
    salvarListaConvidados(convidados);

    // Salva na nuvem (Supabase)
    if (typeof adicionarConvidadoNuven === 'function') {
      try {
        await adicionarConvidadoNuven(nome);
      } catch (err) {
        console.warn('[Supabase] Erro ao sincronizar novo convidado na nuvem:', err);
      }
    }

    if (jaConfirmar) {
      await salvarConfirmacaoManual(nome, mensagem);
    } else {
      renderRsvpList();
      popularSelectConvidados();
    }
  }

  async function alterarConvidado(nomeAntigo, novoNome, novaMensagem) {
    nomeAntigo = (nomeAntigo || '').trim();
    novoNome = (novoNome || '').trim();
    if (!nomeAntigo || !novoNome) return;

    const normAntigo = normalizarNome(nomeAntigo);
    const normNovo = normalizarNome(novoNome);

    // 1. Atualiza na lista de convidados (se existir nela)
    let convidados = getListaConvidados();
    const idx = convidados.findIndex(c => normalizarNome(c) === normAntigo);
    if (idx >= 0) {
      convidados[idx] = novoNome;
      salvarListaConvidados(convidados);
    } else if (normAntigo !== normNovo && !convidados.some(c => normalizarNome(c) === normNovo)) {
      // Se era um convidado que só constava em confirmação
      convidados.push(novoNome);
      salvarListaConvidados(convidados);
    }

    // Atualiza na nuvem (Supabase)
    if (typeof alterarConvidadoNuven === 'function') {
      try {
        await alterarConvidadoNuven(nomeAntigo, novoNome);
      } catch (err) {
        console.warn('[Supabase] Erro ao sincronizar alteração na nuvem:', err);
      }
    }

    // 2. Atualiza na lista de confirmações (se já tiver confirmação)
    let listaConfirmados = getRsvpList();
    const confIdx = listaConfirmados.findIndex(c => normalizarNome(c.nome) === normAntigo);
    if (confIdx >= 0) {
      const conf = listaConfirmados[confIdx];
      conf.nome = novoNome;
      if (typeof novaMensagem === 'string') {
        conf.mensagem = novaMensagem;
      }
      saveRsvpListLocal(listaConfirmados);

      // Atualiza de forma segura no Supabase mantendo ID e data intactos
      const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
      if (sb && conf.id) {
        try {
          await sb.from('rsvp_confirmacoes').update({
            nome: novoNome,
            mensagem: conf.mensagem || ''
          }).eq('id', conf.id);
        } catch (err) {
          console.warn('[Supabase] Erro ao atualizar nome na confirmação:', err);
        }
      }
    }

    renderRsvpList();
    popularSelectConvidados();
  }

  async function removerConvidadoDaLista(nome, confExistente) {
    nome = (nome || '').trim();
    if (!nome) return;

    const norm = normalizarNome(nome);

    if (confExistente) {
      if (!confirm(`"${nome}" já confirmou presença no casamento.\n\nTem certeza de que deseja remover esta pessoa da lista de presença e excluir sua confirmação?`)) {
        return;
      }

      // 1. Remove confirmação local
      let lista = getRsvpList();
      lista = lista.filter(c => normalizarNome(c.nome) !== norm && (confExistente.id ? c.id !== confExistente.id : true));
      saveRsvpListLocal(lista);

      // 2. Remove confirmação do Supabase cirurgicamente
      const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
      if (sb) {
        try {
          if (confExistente.id) {
            await sb.from('rsvp_confirmacoes').delete().eq('id', confExistente.id);
          } else {
            await sb.from('rsvp_confirmacoes').delete().eq('nome', nome);
          }
        } catch (err) {
          console.warn('[Supabase] Erro ao deletar confirmação:', err);
        }
      }
    } else {
      if (!confirm(`Tem certeza de que deseja remover "${nome}" da lista de presença?`)) {
        return;
      }
    }

    // 3. Remove da lista de convidados local
    let convidados = getListaConvidados();
    convidados = convidados.filter(c => normalizarNome(c) !== norm);
    salvarListaConvidados(convidados);

    // 4. Remove da nuvem (Supabase)
    if (typeof removerConvidadoNuven === 'function') {
      try {
        await removerConvidadoNuven(nome);
      } catch (err) {
        console.warn('[Supabase] Erro ao remover convidado na nuvem:', err);
      }
    }

    renderRsvpList();
    popularSelectConvidados();
  }

  // ── Formulário de Adicionar / Alterar Convidado na Lista ──
  const formConvidado        = document.getElementById('form-convidado');
  const formConvidadoTitle   = document.getElementById('form-convidado-title');
  const inputConvidadoOrig   = document.getElementById('convidado-edit-orig-nome');
  const inputConvidadoNome   = document.getElementById('convidado-nome-input');
  const wrapConfirmar        = document.getElementById('convidado-confirmar-wrap');
  const chkConfirmar         = document.getElementById('convidado-confirmar-checkbox');
  const wrapMsg              = document.getElementById('convidado-msg-wrap');
  const inputMsg             = document.getElementById('convidado-msg-input');
  const btnSaveConvidado     = document.getElementById('btn-save-convidado');
  const btnCancelConvidado   = document.getElementById('btn-cancel-convidado');
  const btnAddConvidado      = document.getElementById('btn-add-convidado');

  if (chkConfirmar) {
    chkConfirmar.addEventListener('change', () => {
      if (wrapMsg) wrapMsg.hidden = !chkConfirmar.checked;
    });
  }

  function abrirFormNovoConvidado() {
    if (!formConvidado) return;
    if (formRsvpManual) formRsvpManual.hidden = true;

    if (formConvidadoTitle) formConvidadoTitle.textContent = 'Adicionar Convidado à Lista de Presença';
    if (inputConvidadoOrig) inputConvidadoOrig.value = '';
    if (inputConvidadoNome) inputConvidadoNome.value = '';
    if (wrapConfirmar) wrapConfirmar.hidden = false;
    if (chkConfirmar) chkConfirmar.checked = false;
    if (wrapMsg) wrapMsg.hidden = true;
    if (inputMsg) inputMsg.value = '';

    formConvidado.hidden = false;
    formConvidado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (inputConvidadoNome) inputConvidadoNome.focus();
  }

  function abrirFormEditarConvidado(nome, confExistente) {
    if (!formConvidado) return;
    if (formRsvpManual) formRsvpManual.hidden = true;

    if (formConvidadoTitle) {
      formConvidadoTitle.textContent = confExistente
        ? `Editar Convidado (Confirmado): ${nome}`
        : `Alterar Convidado: ${nome}`;
    }
    if (inputConvidadoOrig) inputConvidadoOrig.value = nome;
    if (inputConvidadoNome) inputConvidadoNome.value = nome;

    if (confExistente) {
      if (wrapConfirmar) wrapConfirmar.hidden = true;
      if (wrapMsg) wrapMsg.hidden = false;
      if (inputMsg) inputMsg.value = confExistente.mensagem || '';
    } else {
      if (wrapConfirmar) wrapConfirmar.hidden = false;
      if (chkConfirmar) chkConfirmar.checked = false;
      if (wrapMsg) wrapMsg.hidden = true;
      if (inputMsg) inputMsg.value = '';
    }

    formConvidado.hidden = false;
    formConvidado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (inputConvidadoNome) inputConvidadoNome.focus();
  }

  if (btnAddConvidado) {
    btnAddConvidado.addEventListener('click', abrirFormNovoConvidado);
  }

  if (btnCancelConvidado) {
    btnCancelConvidado.addEventListener('click', () => {
      if (formConvidado) formConvidado.hidden = true;
    });
  }

  if (btnSaveConvidado) {
    btnSaveConvidado.addEventListener('click', async () => {
      const nome = inputConvidadoNome ? inputConvidadoNome.value.trim() : '';
      if (!nome) {
        alert('Por favor, informe o nome do convidado / família.');
        if (inputConvidadoNome) inputConvidadoNome.focus();
        return;
      }

      const origNome = inputConvidadoOrig ? inputConvidadoOrig.value.trim() : '';
      const msg = inputMsg ? inputMsg.value.trim() : '';
      const deveConfirmar = chkConfirmar ? chkConfirmar.checked : false;

      btnSaveConvidado.disabled = true;
      const textoOrig = btnSaveConvidado.textContent;
      btnSaveConvidado.textContent = 'Salvando...';

      try {
        if (origNome) {
          await alterarConvidado(origNome, nome, msg);
        } else {
          await adicionarNovoConvidado(nome, deveConfirmar, msg);
        }
        if (formConvidado) formConvidado.hidden = true;
      } finally {
        btnSaveConvidado.disabled = false;
        btnSaveConvidado.textContent = textoOrig;
      }
    });
  }

  // ── Formulário manual de RSVP ──
  const formRsvpManual = document.getElementById('form-rsvp-manual');
  const formRsvpTitle  = document.getElementById('form-rsvp-title');
  const selectRsvpNome = document.getElementById('rsvp-manual-nome');
  const inputRsvpMsg   = document.getElementById('rsvp-manual-msg');
  const inputRsvpEditId = document.getElementById('rsvp-edit-id');
  const btnAddRsvp     = document.getElementById('btn-add-rsvp');
  const btnSaveRsvp    = document.getElementById('btn-save-rsvp-manual');
  const btnCancelRsvp  = document.getElementById('btn-cancel-rsvp-manual');

  function popularSelectConvidados(nomePreselecionado) {
    if (!selectRsvpNome) return;
    const convidados = [...getListaConvidados()].sort((a, b) => a.localeCompare(b, 'pt-BR'));

    const lista = getRsvpList();
    const extras = lista.filter(c => c && c.nome && !convidados.some(oficial => normalizarNome(oficial) === normalizarNome(c.nome)));

    const todosNomes = [...convidados, ...extras.map(e => e.nome)];

    selectRsvpNome.innerHTML = '<option value="">-- Selecione o Convidado / Família --</option>' +
      todosNomes.map(n => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');

    if (nomePreselecionado) {
      const normPre = normalizarNome(nomePreselecionado);
      const match = todosNomes.find(n => normalizarNome(n) === normPre);
      if (match) selectRsvpNome.value = match;
    }
  }

  function abrirFormRsvpManual(nomePreselecionado = '', confExistente = null) {
    if (!formRsvpManual) return;
    if (formConvidado) formConvidado.hidden = true;
    popularSelectConvidados(nomePreselecionado);

    if (confExistente) {
      if (formRsvpTitle) formRsvpTitle.textContent = `Editar Confirmação: ${confExistente.nome}`;
      if (inputRsvpEditId) inputRsvpEditId.value = confExistente.id || '';
      if (selectRsvpNome) selectRsvpNome.value = confExistente.nome;
      if (inputRsvpMsg) inputRsvpMsg.value = confExistente.mensagem || '';
    } else {
      if (formRsvpTitle) formRsvpTitle.textContent = 'Adicionar Confirmação Manual de Presença';
      if (inputRsvpEditId) inputRsvpEditId.value = '';
      if (nomePreselecionado && selectRsvpNome) selectRsvpNome.value = nomePreselecionado;
      if (inputRsvpMsg) inputRsvpMsg.value = '';
    }

    formRsvpManual.hidden = false;
    formRsvpManual.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (btnAddRsvp) {
    btnAddRsvp.addEventListener('click', () => abrirFormRsvpManual());
  }

  if (btnCancelRsvp) {
    btnCancelRsvp.addEventListener('click', () => {
      if (formRsvpManual) formRsvpManual.hidden = true;
    });
  }

  if (btnSaveRsvp) {
    btnSaveRsvp.addEventListener('click', async () => {
      const nome = selectRsvpNome ? selectRsvpNome.value.trim() : '';
      const msg = inputRsvpMsg ? inputRsvpMsg.value.trim() : '';
      const editId = inputRsvpEditId ? inputRsvpEditId.value : '';

      if (!nome) {
        alert('Por favor, selecione o nome do convidado.');
        if (selectRsvpNome) selectRsvpNome.focus();
        return;
      }

      await salvarConfirmacaoManual(nome, msg, editId);
      if (formRsvpManual) formRsvpManual.hidden = true;
    });
  }

  // ── Filtros de Tabela ──
  const searchRsvpInput  = document.getElementById('rsvp-search-input');
  const filterRsvpStatus = document.getElementById('rsvp-filter-status');

  if (searchRsvpInput)  searchRsvpInput.addEventListener('input', renderRsvpList);
  if (filterRsvpStatus) filterRsvpStatus.addEventListener('change', renderRsvpList);

  function renderRsvpList() {
    const container = document.getElementById('rsvp-list');
    const counter   = document.getElementById('rsvp-counter');
    if (!container) return;

    const lista = getRsvpList();
    const convidados = [...getListaConvidados()].sort((a, b) => a.localeCompare(b, 'pt-BR'));

    // Mapa de confirmações por nome normalizado
    const mapConfirmados = new Map();
    lista.forEach(c => {
      if (c && c.nome) {
        mapConfirmados.set(normalizarNome(c.nome), c);
      }
    });

    let confirmadosCount = 0;
    convidados.forEach(nome => {
      if (mapConfirmados.has(normalizarNome(nome))) {
        confirmadosCount++;
      }
    });

    // Convidados confirmados que não estão na lista pré-definida
    const extrasConfirmados = lista.filter(c => c && c.nome && !convidados.some(oficial => normalizarNome(oficial) === normalizarNome(c.nome)));

    const totalConfirmados = confirmadosCount + extrasConfirmados.length;
    const totalConvidados = convidados.length + extrasConfirmados.length;

    if (counter) {
      counter.textContent = `${totalConfirmados} de ${totalConvidados} confirmados (${convidados.length - confirmadosCount} pendentes)`;
    }

    const baseUrl = window.location.origin + window.location.pathname.replace(/admin\.html.*$/i, '') + 'rsvp.html';

    // Termo de busca e filtro de status
    const searchTerm = searchRsvpInput ? normalizarNome(searchRsvpInput.value) : '';
    const statusFilter = filterRsvpStatus ? filterRsvpStatus.value : 'todos';

    const renderRow = (nome, conf, isExtra = false) => {
      const isConfirmed = !!conf;

      // Filtra por busca por texto
      if (searchTerm && !normalizarNome(nome).includes(searchTerm)) {
        return '';
      }

      // Filtra por status
      if (statusFilter === 'confirmados' && !isConfirmed) return '';
      if (statusFilter === 'pendentes' && isConfirmed) return '';

      const guestUrl = `${baseUrl}?c=${encodeURIComponent(nome)}`;
      const rawData = conf ? (conf.timestamp || conf.created_at) : '';
      const dataHora = conf ? formatarData(rawData) : '<span class="admin-rsvp-empty-msg">—</span>';
      const confId = conf ? (conf.id || '') : '';

      return `
        <tr class="${isConfirmed ? 'admin-rsvp-row-confirmed' : 'admin-rsvp-row-pending'}">
          <td style="white-space:nowrap;">
            <span class="admin-item-status ${isConfirmed ? 'admin-item-status-comprado' : 'admin-item-status-disponivel'}">
              ${isConfirmed ? '✓ Confirmado' : '⏳ Pendente'}
            </span>
          </td>
          <td class="admin-rsvp-nome" style="color:${isConfirmed ? 'var(--gold-light, #e8c86a)' : 'rgba(245,237,214,0.7)'}">
            <strong>${escapeHtml(nome)}</strong>
            ${isExtra ? '<span style="font-size:0.72rem; color:var(--gold-light); display:block; opacity:0.8;">(Confirmação em Nuvem)</span>' : ''}
          </td>
          <td style="white-space:nowrap;">
            <button type="button" class="admin-btn admin-btn-outline admin-btn-sm btn-copy-guest-link" data-url="${escapeHtml(guestUrl)}" data-name="${escapeHtml(nome)}" title="Copiar link individual deste convidado">
              📋 Link
            </button>
          </td>
          <td class="admin-rsvp-data">
            ${dataHora}
          </td>
          <td class="admin-rsvp-msg">
            ${isConfirmed && conf.mensagem ? escapeHtml(conf.mensagem) : '<span class="admin-rsvp-empty-msg">—</span>'}
          </td>
          <td style="white-space:nowrap;">
            <div style="display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap;">
              ${isConfirmed ? `
                <button type="button" class="admin-btn admin-btn-outline admin-btn-sm btn-edit-guest" data-name="${escapeHtml(nome)}" title="Alterar nome ou mensagem">
                  ✏️ Editar
                </button>
                <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm btn-unconfirm-rsvp" data-name="${escapeHtml(nome)}" data-id="${escapeHtml(confId)}" title="Tornar pendente (remover confirmação)">
                  ↩️ Desconfirmar
                </button>
                <button type="button" class="admin-btn admin-btn-danger admin-btn-sm btn-remove-guest" data-name="${escapeHtml(nome)}" data-id="${escapeHtml(confId)}" title="Remover da lista de convidados">
                  🗑️ Remover
                </button>
              ` : `
                <button type="button" class="admin-btn admin-btn-primary admin-btn-sm btn-confirm-rsvp" data-name="${escapeHtml(nome)}" title="Marcar presença manualmente">
                  ✓ Confirmar
                </button>
                <button type="button" class="admin-btn admin-btn-outline admin-btn-sm btn-edit-guest" data-name="${escapeHtml(nome)}" title="Alterar nome do convidado">
                  ✏️ Alterar
                </button>
                <button type="button" class="admin-btn admin-btn-danger admin-btn-sm btn-remove-guest" data-name="${escapeHtml(nome)}" data-id="" title="Remover da lista de convidados">
                  🗑️ Remover
                </button>
              `}
            </div>
          </td>
        </tr>
      `;
    };

    const rowsHtmlOficiais = convidados.map((nome) => {
      const conf = mapConfirmados.get(normalizarNome(nome));
      return renderRow(nome, conf, false);
    }).join('');

    const rowsHtmlExtras = extrasConfirmados.map((c) => {
      return renderRow(c.nome, c, true);
    }).join('');

    const hasRows = (rowsHtmlOficiais + rowsHtmlExtras).trim().length > 0;

    const sqlScriptParaCopiar = `-- Execute no SQL Editor do seu projeto Supabase:
CREATE TABLE IF NOT EXISTS public.convidados_lista (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.convidados_lista ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Convidados: Leitura Pública" ON public.convidados_lista;
DROP POLICY IF EXISTS "Convidados: Gerenciamento Total" ON public.convidados_lista;

CREATE POLICY "Convidados: Leitura Pública" ON public.convidados_lista FOR SELECT USING (true);
CREATE POLICY "Convidados: Gerenciamento Total" ON public.convidados_lista FOR ALL USING (true) WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'convidados_lista'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.convidados_lista;
  END IF;
END $$;`;

    container.innerHTML = `
      ${window._supabaseConvidadosTableMissing ? `
        <div style="background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.4); border-radius:8px; padding:0.9rem 1.2rem; margin-bottom:1.2rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.8rem;">
          <div style="font-size:0.85rem; color:var(--text-cream); line-height:1.5;">
            <strong style="color:var(--gold-light);">☁️ Sincronização em Nuvem de Convidados:</strong> Para salvar alterações em tempo real no Supabase entre todos os computadores e celulares, crie a tabela <code>convidados_lista</code> no painel Supabase.
          </div>
          <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" id="btn-copy-supabase-convidados-sql" style="white-space:nowrap;">
            📋 Copiar SQL do Supabase
          </button>
        </div>
      ` : ''}
      <div style="margin-bottom:1.2rem; display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
        <span style="font-size:0.85rem; color:var(--text-muted);">
          💡 <em>Gerencie a lista de convidados: use <strong>"+ Novo Convidado"</strong> para adicionar pessoas, <strong>"✏️ Alterar/Editar"</strong> para renomear ou ajustar mensagens, e <strong>"🗑️ Remover"</strong> para excluir.</em>
        </span>
      </div>
      <table class="admin-rsvp-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Nome / Família</th>
            <th>Link Individual</th>
            <th>Data Confirmação</th>
            <th>Mensagem aos Noivos</th>
            <th>Ações de Gerenciamento</th>
          </tr>
        </thead>
        <tbody>
          ${hasRows ? (rowsHtmlOficiais + rowsHtmlExtras) : `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">Nenhum convidado encontrado com os filtros selecionados.</td></tr>`}
        </tbody>
      </table>`;

    // Event listener para copiar SQL do Supabase
    const btnCopySql = container.querySelector('#btn-copy-supabase-convidados-sql');
    if (btnCopySql) {
      btnCopySql.addEventListener('click', () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(sqlScriptParaCopiar).then(() => {
            const orig = btnCopySql.textContent;
            btnCopySql.textContent = '✓ SQL Copiado!';
            setTimeout(() => { btnCopySql.textContent = orig; }, 2500);
          });
        } else {
          prompt('Copie o comando SQL abaixo para colar no SQL Editor do Supabase:', sqlScriptParaCopiar);
        }
      });
    }

    // Event listeners para copiar link
    container.querySelectorAll('.btn-copy-guest-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        const name = btn.dataset.name;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            const originalText = btn.textContent;
            btn.textContent = '✓ Copiado!';
            btn.style.borderColor = 'var(--gold-light)';
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.borderColor = '';
            }, 2000);
          });
        } else {
          prompt(`Link de confirmação para ${name}:`, url);
        }
      });
    });

    // Event listeners para Desconfirmar (manter na lista, mas remover confirmação)
    container.querySelectorAll('.btn-unconfirm-rsvp').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const id = btn.dataset.id;
        desconfirmarPresenca(name, id);
      });
    });

    // Event listeners para Confirmar Manualmente
    container.querySelectorAll('.btn-confirm-rsvp').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        abrirFormRsvpManual(name);
      });
    });

    // Event listeners para Editar / Alterar Convidado
    container.querySelectorAll('.btn-edit-guest').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const conf = mapConfirmados.get(normalizarNome(name));
        abrirFormEditarConvidado(name, conf);
      });
    });

    // Event listeners para Remover da Lista
    container.querySelectorAll('.btn-remove-guest').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const conf = mapConfirmados.get(normalizarNome(name));
        removerConvidadoDaLista(name, conf);
      });
    });
  }

  // Exportar CSV
  document.getElementById('btn-export-rsvp').addEventListener('click', () => {
    const lista = getRsvpList();
    const convidados = (typeof CONVIDADOS_LISTA !== 'undefined' && Array.isArray(CONVIDADOS_LISTA))
      ? [...CONVIDADOS_LISTA].sort((a, b) => a.localeCompare(b, 'pt-BR'))
      : [];

    const mapConfirmados = new Map();
    lista.forEach(c => {
      if (c && c.nome) mapConfirmados.set(normalizarNome(c.nome), c);
    });

    const header = ['#', 'Status', 'Nome/Família', 'Data/Hora Confirmação', 'Mensagem'];
    const rows = convidados.map((nome, i) => {
      const conf = mapConfirmados.get(normalizarNome(nome));
      const status = conf ? 'CONFIRMADO' : 'PENDENTE';
      const dataHora = conf ? formatarData(conf.timestamp || conf.created_at) : '';
      const msg = conf && conf.mensagem ? conf.mensagem : '';
      return [
        i + 1,
        `"${status}"`,
        `"${nome.replace(/"/g, '""')}"`,
        `"${dataHora.replace(/"/g, '""')}"`,
        `"${msg.replace(/"/g, '""')}"`,
      ];
    });

    // Extras
    const extras = lista.filter(c => c && c.nome && !convidados.some(oficial => normalizarNome(oficial) === normalizarNome(c.nome)));
    extras.forEach((c, idx) => {
      const dataHora = formatarData(c.timestamp || c.created_at);
      rows.push([
        convidados.length + idx + 1,
        `"CONFIRMADO"`,
        `"${(c.nome || '').replace(/"/g, '""')}"`,
        `"${dataHora.replace(/"/g, '""')}"`,
        `"${(c.mensagem || '').replace(/"/g, '""')}"`
      ]);
    });

    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href: url,
      download: `lista-convidados-rsvp-${new Date().toISOString().slice(0,10)}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
  });

  // ── Exportar presentes-data.js ──
  const btnExportFile = document.getElementById('btn-export-presentes-file');
  if (btnExportFile) {
    btnExportFile.addEventListener('click', () => {
      const code = `/* ==========================================================================
   PRESENTES DATA — Dados dos presentes e Categorias
   ========================================================================== */

const PRESENTES_DEFAULT_DATA = ${JSON.stringify(data, null, 2)};
`;
      const blob = new Blob([code], { type: 'application/javascript;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), {
        href: url,
        download: 'presentes-data.js',
      });
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ── Copiar JSON de presentes ──
  const btnCopyJson = document.getElementById('btn-copy-presentes-json');
  if (btnCopyJson) {
    btnCopyJson.addEventListener('click', () => {
      const json = JSON.stringify(data, null, 2);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).then(() => {
          const original = btnCopyJson.textContent;
          btnCopyJson.textContent = '✓ JSON Copiado!';
          setTimeout(() => { btnCopyJson.textContent = original; }, 2000);
        });
      } else {
        prompt('Copie o JSON abaixo:', json);
      }
    });
  }

  // ── Sincronizar Manualmente com Nuvem ──
  const btnSyncCloud = document.getElementById('btn-sync-cloud');
  if (btnSyncCloud) {
    btnSyncCloud.addEventListener('click', async () => {
      btnSyncCloud.disabled = true;
      btnSyncCloud.textContent = '⏳ Sincronizando...';

      // 1. Envia estado atual para a nuvem
      await save();

      // 2. Busca estado mais recente
      if (typeof fetchPresentesDataFromSupabase === 'function') {
        const cloudData = await fetchPresentesDataFromSupabase();
        if (cloudData) {
          data = cloudData;
          renderAll();
          updateSupabaseStatusBadge();
        }
      }

      setTimeout(() => {
        btnSyncCloud.disabled = false;
        btnSyncCloud.textContent = '✓ Sincronizado!';
        setTimeout(() => { btnSyncCloud.textContent = '🔄 Sincronizar com a Nuvem'; }, 2000);
      }, 600);
    });
  }

  // ── Exportar convidados-data.js ──
  const btnExportConvidados = document.getElementById('btn-export-convidados-file');
  if (btnExportConvidados) {
    btnExportConvidados.addEventListener('click', () => {
      const convidadosAtuais = getListaConvidados();
      const code = `/* ============================================================
   Lista Oficial de Convidados — Daniel & Franciellen Maria
   ============================================================ */

const CONVIDADOS_DEFAULT_LISTA = ${JSON.stringify(convidadosAtuais, null, 2)};

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

// Inicializa a variável global com dados atualizados
var CONVIDADOS_LISTA = getConvidadosData();
`;
      const blob = new Blob([code], { type: 'application/javascript;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), {
        href: url,
        download: 'convidados-data.js',
      });
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ── Restaurar Convidados Padrão ──
  const btnResetConvidados = document.getElementById('btn-reset-convidados');
  if (btnResetConvidados) {
    btnResetConvidados.addEventListener('click', async () => {
      if (confirm('Restaurar a lista de convidados para a lista padrão original?\n(As confirmações de presença já registradas no banco de dados NÃO serão apagadas).')) {
        if (typeof resetarConvidadosData === 'function') {
          resetarConvidadosData();
        } else {
          localStorage.removeItem('convidados_lista');
        }

        // Se Supabase ativo, reseta também na nuvem
        const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
        if (sb) {
          try {
            await sb.from('convidados_lista').delete().neq('id', '');
            if (typeof bootstrapConvidadosNoSupabase === 'function') {
              await bootstrapConvidadosNoSupabase(CONVIDADOS_DEFAULT_LISTA);
            }
          } catch (e) {
            console.warn('[Supabase] Erro ao resetar convidados na nuvem:', e);
          }
        }

        renderRsvpList();
        popularSelectConvidados();
      }
    });
  }

  // Limpar confirmações
  document.getElementById('btn-clear-rsvp').addEventListener('click', () => {
    if (confirm('Tem certeza? Isso apagará TODAS as confirmações de presença e os dispositivos confirmados terão de confirmar novamente.')) {
      localStorage.removeItem(LS_ALL_CONFIRMS);
      renderRsvpList();
    }
  });

  // Limpar presentes comprados
  document.getElementById('btn-clear-comprados').addEventListener('click', () => {
    if (confirm('Tem certeza? Isso restaurará TODOS os presentes comprados para a lista de disponíveis.')) {
      localStorage.removeItem(LS_COMPRADOS);
      renderAll();
    }
  });


  // ────────────────────────────────────────────────────────────
  // INIT
  // ────────────────────────────────────────────────────────────
  checkSession();

})();
