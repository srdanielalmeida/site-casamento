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
      badge.textContent = '🟢 Nuvem Conectada (Supabase)';
      badge.className = 'admin-item-status admin-item-status-disponivel';
      badge.style.borderColor = 'rgba(76, 175, 80, 0.4)';
    } else {
      badge.textContent = '🟡 Modo Local (Offline / localStorage)';
      badge.className = 'admin-item-status';
      badge.style.borderColor = 'rgba(212, 175, 55, 0.4)';
    }
  }

  function loadData() {
    data = getPresentesData();
    updateSupabaseStatusBadge();

    // Se o Supabase estiver configurado, atualiza da nuvem em segundo plano
    if (typeof fetchPresentesDataFromSupabase === 'function') {
      fetchPresentesDataFromSupabase().then((cloudData) => {
        if (cloudData && cloudData.items && cloudData.items.length > 0) {
          data = cloudData;
          renderAll();
          updateSupabaseStatusBadge();
        }
      });
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
            return `
              <tr>
                <td class="admin-rsvp-num">${sorted.length - i}</td>
                <td class="admin-rsvp-nome">${escapeHtml(itemName)}</td>
                <td class="admin-rsvp-msg">${c.nomeConvidado ? escapeHtml(c.nomeConvidado) : '<span class="admin-rsvp-empty-msg">—</span>'}</td>
                <td class="admin-rsvp-data">${formatarData(c.timestamp)}</td>
                <td>
                  <button class="admin-btn admin-btn-outline admin-btn-sm" data-restaurar-id="${c.id}" title="Restaurar para a lista">
                    <svg viewBox="0 0 16 16" fill="none" width="12" height="12"><path d="M2 8a6 6 0 0 1 11.5-2.5M14 8a6 6 0 0 1-11.5 2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M14 2v4h-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 14v-4h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Restaurar
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>`;

    // Event listeners — Restaurar presentes
    container.querySelectorAll('[data-restaurar-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.restaurarId);
        const item = allItems.find(it => it.id === id);
        const nome = item ? item.name : `ID ${id}`;
        if (confirm(`Restaurar "${nome}" para a lista de presentes disponíveis?`)) {
          desmarcarComprado(id);
          renderAll();
        }
      });
    });
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
  // 7. RSVP — Confirmações de Presença
  // ────────────────────────────────────────────────────────────
  const LS_ALL_CONFIRMS = 'rsvp_confirmacoes';

  function getRsvpList() {
    try {
      const raw = localStorage.getItem(LS_ALL_CONFIRMS);
      const lista = JSON.parse(raw || '[]');
      return Array.isArray(lista) ? lista : [];
    } catch (_) { return []; }
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

  function renderRsvpList() {
    const container = document.getElementById('rsvp-list');
    const counter   = document.getElementById('rsvp-counter');
    if (!container) return;

    const lista = getRsvpList();
    const convidados = (typeof CONVIDADOS_LISTA !== 'undefined' && Array.isArray(CONVIDADOS_LISTA))
      ? [...CONVIDADOS_LISTA].sort((a, b) => a.localeCompare(b, 'pt-BR'))
      : [];

    const totalConvidados = convidados.length;
    const confirmadosCount = lista.length;

    if (counter) {
      counter.textContent = `${confirmadosCount} de ${totalConvidados} confirmados (${totalConvidados - confirmadosCount} pendentes)`;
    }

    // Mapa de confirmações por nome (case-insensitive)
    const mapConfirmados = new Map();
    lista.forEach(c => {
      if (c && c.nome) {
        mapConfirmados.set(c.nome.toLowerCase().trim(), c);
      }
    });

    const baseUrl = window.location.origin + window.location.pathname.replace(/admin\.html.*$/i, '') + 'rsvp.html';

    container.innerHTML = `
      <div style="margin-bottom:1.2rem; display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
        <span style="font-size:0.85rem; color:var(--text-muted);">
          💡 <em>Clique em "Copiar Link" para enviar o link direto no WhatsApp do convidado. Ele verá <strong>apenas o seu próprio nome</strong>!</em>
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
          </tr>
        </thead>
        <tbody>
          ${convidados.map((nome) => {
            const conf = mapConfirmados.get(nome.toLowerCase().trim());
            const isConfirmed = !!conf;
            const guestUrl = `${baseUrl}?c=${encodeURIComponent(nome)}`;

            return `
              <tr class="${isConfirmed ? 'admin-rsvp-row-confirmed' : 'admin-rsvp-row-pending'}">
                <td style="white-space:nowrap;">
                  <span class="admin-item-status ${isConfirmed ? 'admin-item-status-comprado' : 'admin-item-status-disponivel'}">
                    ${isConfirmed ? '✓ Confirmado' : '⏳ Pendente'}
                  </span>
                </td>
                <td class="admin-rsvp-nome" style="color:${isConfirmed ? 'var(--gold-light, #e8c86a)' : 'rgba(245,237,214,0.7)'}">
                  <strong>${escapeHtml(nome)}</strong>
                </td>
                <td style="white-space:nowrap;">
                  <button type="button" class="admin-btn admin-btn-outline admin-btn-sm btn-copy-guest-link" data-url="${escapeHtml(guestUrl)}" data-name="${escapeHtml(nome)}" title="Copiar link nominal deste convidado">
                    📋 Copiar Link
                  </button>
                </td>
                <td class="admin-rsvp-data">
                  ${isConfirmed ? formatarData(conf.timestamp) : '<span class="admin-rsvp-empty-msg">—</span>'}
                </td>
                <td class="admin-rsvp-msg">
                  ${isConfirmed && conf.mensagem ? escapeHtml(conf.mensagem) : '<span class="admin-rsvp-empty-msg">—</span>'}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>`;

    // Event listeners para os botões de copiar link
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
  }

  // Exportar CSV
  document.getElementById('btn-export-rsvp').addEventListener('click', () => {
    const lista = getRsvpList();
    const convidados = (typeof CONVIDADOS_LISTA !== 'undefined' && Array.isArray(CONVIDADOS_LISTA))
      ? [...CONVIDADOS_LISTA].sort((a, b) => a.localeCompare(b, 'pt-BR'))
      : [];

    const mapConfirmados = new Map();
    lista.forEach(c => {
      if (c && c.nome) mapConfirmados.set(c.nome.toLowerCase().trim(), c);
    });

    const header = ['#', 'Status', 'Nome/Família', 'Data/Hora Confirmação', 'Mensagem'];
    const rows = convidados.map((nome, i) => {
      const conf = mapConfirmados.get(nome.toLowerCase().trim());
      const status = conf ? 'CONFIRMADO' : 'PENDENTE';
      const dataHora = conf ? formatarData(conf.timestamp) : '';
      const msg = conf && conf.mensagem ? conf.mensagem : '';
      return [
        i + 1,
        `"${status}"`,
        `"${nome.replace(/"/g, '""')}"`,
        `"${dataHora.replace(/"/g, '""')}"`,
        `"${msg.replace(/"/g, '""')}"`,
      ];
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
