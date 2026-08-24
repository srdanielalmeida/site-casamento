/* ============================================================
   PRESENTES — JavaScript: categorias, renderização, sacola
   ============================================================ */

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────────
  // 1. SCROLL REVEAL
  // ────────────────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));


  // ────────────────────────────────────────────────────────────
  // 2. CARREGAR E RENDERIZAR PRESENTES
  // ────────────────────────────────────────────────────────────
  const data = getPresentesData();
  const contentEl = document.getElementById('presentes-content');
  const catMenuEl = document.querySelector('.pr-cat-menu');
  let activeCategory = 'todos';

  // Gerar botões de categorias no mini menu
  function renderCategoryButtons() {
    if (!catMenuEl) return;

    data.categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'pr-cat-btn';
      btn.dataset.category = cat.id;
      const iconSvg = typeof getCategoryIconSvg === 'function' ? getCategoryIconSvg(cat.id, cat.icon) : (cat.icon || '');
      btn.innerHTML = `<span class="pr-cat-icon" aria-hidden="true">${iconSvg}</span><span>${cat.name}</span>`;
      btn.addEventListener('click', () => filterByCategory(cat.id));
      catMenuEl.appendChild(btn);
    });
  }

  // Gerar SVG placeholder para imagem
  function getPlaceholderSVG() {
    return `
      <div class="pr-item-img-placeholder">
        <div class="pr-item-img-placeholder-icon" aria-hidden="true">
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="20" width="52" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 28v24a2 2 0 0 0 2 2h40a2 2 0 0 0 2-2V28" stroke="currentColor" stroke-width="1.5"/>
            <path d="M30 20v34" stroke="currentColor" stroke-width="1.5"/>
            <path d="M30 20c0 0-8-12-14-6s0 6 0 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M30 20c0 0 8-12 14-6s0 6 0 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="pr-item-img-placeholder-text">Imagem em breve</span>
      </div>
    `;
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Identificar rótulo do botão (sugestão de presente)
  function getStoreLabel(url) {
    return 'Ver Sugestão';
  }


  // ────────────────────────────────────────────────────────────
  // 3. SACOLA DE PRESENTES
  // ────────────────────────────────────────────────────────────
  const sacolaDrawer   = document.getElementById('sacola-drawer');
  const sacolaBackdrop = document.getElementById('sacola-backdrop');
  const sacolaFab      = document.getElementById('sacola-fab');
  const sacolaClose    = document.getElementById('sacola-close');
  const sacolaBody     = document.getElementById('sacola-body');
  const sacolaCount    = document.getElementById('sacola-count');
  const sacolaEmpty    = document.getElementById('sacola-empty');

  function toggleSeparar(id) {
    let ids = getSacolaIds();
    if (ids.includes(id)) {
      ids = ids.filter(i => i !== id);
    } else {
      ids.push(id);
    }
    saveSacolaIds(ids);
    renderContent(activeCategory);
    atualizarBadgeSacola();
    renderSacola();
  }

  function abrirSacola() {
    renderSacola();
    sacolaDrawer.classList.add('open');
    sacolaBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function fecharSacola() {
    sacolaDrawer.classList.remove('open');
    sacolaBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function atualizarBadgeSacola() {
    const ids = getSacolaIds();
    const count = ids.length;
    if (sacolaCount) {
      sacolaCount.textContent = count;
      sacolaCount.style.display = count > 0 ? 'flex' : 'none';
    }
    if (sacolaFab) {
      sacolaFab.classList.toggle('has-items', count > 0);
    }
  }

  function renderSacola() {
    if (!sacolaBody) return;

    const ids = getSacolaIds();
    const comprados = getCompradosList();

    if (ids.length === 0) {
      sacolaBody.innerHTML = '';
      if (sacolaEmpty) sacolaEmpty.hidden = false;
      return;
    }

    if (sacolaEmpty) sacolaEmpty.hidden = true;

    const allItems = data.items;
    const noticeHtml = `
      <div class="sacola-notice-banner">
        <span>💡 <strong>Importante:</strong> Após comprar na loja, clique no botão <strong>"Já Comprei!"</strong> abaixo para <strong>remover o item da lista</strong> e evitar presentes repetidos.</span>
      </div>
    `;

    const html = ids.map(id => {
      const item = allItems.find(i => i.id === id);
      if (!item) return '';

      const comprado = comprados.find(c => c.id === id);
      const storeLabel = getStoreLabel(item.link);
      const couponSacolaHtml = (item.coupon && item.coupon.trim() !== '')
        ? `<div class="sacola-item-coupon" title="Cupom disponível">🏷️ Cupom: <strong>${escapeHtml(item.coupon)}</strong></div>`
        : '';

      const hasImage = item.image && item.image.trim() !== '';
      const imgHtml = hasImage
        ? `<img src="${item.image}" alt="${item.name}" class="sacola-item-img">`
        : `<div class="sacola-item-img sacola-item-img-placeholder">
            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
              <rect x="4" y="20" width="52" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 28v24a2 2 0 0 0 2 2h40a2 2 0 0 0 2-2V28" stroke="currentColor" stroke-width="1.5"/>
              <path d="M30 20v34" stroke="currentColor" stroke-width="1.5"/>
              <path d="M30 20c0 0-8-12-14-6s0 6 0 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M30 20c0 0 8-12 14-6s0 6 0 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>`;

      if (comprado) {
        return `
          <div class="sacola-item sacola-item-comprado">
            ${imgHtml}
            <div class="sacola-item-info">
              <span class="sacola-item-name">${item.name}</span>
              <span class="sacola-item-badge-comprado">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Comprado
              </span>
            </div>
            <button class="sacola-item-remove" data-remove-sacola="${id}" title="Remover da sacola">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </div>
        `;
      }

      return `
        <div class="sacola-item">
          ${imgHtml}
          <div class="sacola-item-info">
            <span class="sacola-item-name">${item.name}</span>
            ${couponSacolaHtml}
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="sacola-item-store">${storeLabel} →</a>
          </div>
          <div class="sacola-item-actions">
            <button class="sacola-btn-comprei" data-comprar-id="${id}" title="Marcar como comprado e remover da lista">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Já Comprei!
            </button>
            <button class="sacola-item-remove" data-remove-sacola="${id}" title="Remover da sacola">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    sacolaBody.innerHTML = noticeHtml + html;

    // Event listeners — Remover da sacola
    sacolaBody.querySelectorAll('[data-remove-sacola]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.removeSacola);
        let ids = getSacolaIds().filter(i => i !== id);
        saveSacolaIds(ids);
        renderContent(activeCategory);
        atualizarBadgeSacola();
        renderSacola();
      });
    });

    // Event listeners — Marcar como comprado
    sacolaBody.querySelectorAll('[data-comprar-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.comprarId);
        abrirModalCompra(id);
      });
    });
  }

  // ── Modal de confirmação de compra ──
  function abrirModalCompra(itemId) {
    const item = data.items.find(i => i.id === itemId);
    if (!item) return;

    const overlay = document.createElement('div');
    overlay.className = 'compra-modal-overlay';
    overlay.innerHTML = `
      <div class="compra-modal">
        <div class="compra-modal-header">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3 class="compra-modal-title">Confirmar Compra</h3>
        </div>
        <p class="compra-modal-item-name">${item.name}</p>
        <p class="compra-modal-desc">
          Ao confirmar, este item será <strong>removido da lista pública</strong> para evitar que outro convidado compre o mesmo presente.
        </p>
        <div class="compra-modal-field">
          <label for="compra-nome" class="compra-modal-label">Seu nome ou família (opcional)</label>
          <input type="text" id="compra-nome" class="compra-modal-input" placeholder="Ex: Família Silva / Tio João" autocomplete="off">
        </div>
        <div class="compra-modal-actions">
          <button class="compra-modal-btn-confirm" id="btn-confirmar-compra">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Confirmar e Remover da Lista
          </button>
          <button class="compra-modal-btn-cancel" id="btn-cancelar-compra">Voltar</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));

    const nomeInput = overlay.querySelector('#compra-nome');
    nomeInput.focus();

    overlay.querySelector('#btn-confirmar-compra').addEventListener('click', () => {
      const nome = nomeInput.value.trim();
      marcarComoComprado(itemId, nome);
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 350);
      renderContent(activeCategory);
      renderSacola();
      atualizarBadgeSacola();
      mostrarToastCompra(item.name);
    });

    overlay.querySelector('#btn-cancelar-compra').addEventListener('click', () => {
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 350);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        setTimeout(() => overlay.remove(), 350);
      }
    });
  }

  // ── Toast de confirmação ──
  function mostrarToastCompra(itemName) {
    const toast = document.createElement('div');
    toast.className = 'compra-toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Presente confirmado e removido da lista pública!</span>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // Event listeners do FAB e drawer
  if (sacolaFab)      sacolaFab.addEventListener('click', abrirSacola);
  if (sacolaClose)    sacolaClose.addEventListener('click', fecharSacola);
  if (sacolaBackdrop) sacolaBackdrop.addEventListener('click', fecharSacola);


  // ────────────────────────────────────────────────────────────
  // 4. RENDERIZAÇÃO DE CARDS
  // ────────────────────────────────────────────────────────────

  // Gerar card de produto
  function renderItemCard(item, index) {
    const hasImage = item.image && item.image.trim() !== '';
    const comprado = isItemComprado(item.id);
    const sacola = getSacolaIds();
    const separado = sacola.includes(item.id);

    // Se comprado, esconder para todos
    if (comprado) return '';

    const imageHTML = hasImage
      ? `<img src="${item.image}" alt="${item.name}" class="pr-item-img" loading="lazy">`
      : getPlaceholderSVG();

    const storeLabel = getStoreLabel(item.link);

    const separadoClass = separado ? 'pr-separado' : '';
    const separadoIcon = separado
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="#D4AF37" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
      : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.6"/></svg>`;

    const couponHtml = (item.coupon && item.coupon.trim() !== '')
      ? `
        <div class="pr-item-coupon" data-copy-coupon="${escapeHtml(item.coupon)}" title="Clique para copiar o cupom de desconto">
          <div class="pr-item-coupon-left">
            <span>🏷️ Cupom:</span>
            <strong class="pr-item-coupon-code">${escapeHtml(item.coupon)}</strong>
          </div>
          <span class="pr-item-coupon-btn">Copiar</span>
        </div>
      `
      : '';

    // Ações contextuais do card
    const cardActionsHtml = separado
      ? `
        <div class="pr-item-card-actions pr-item-card-actions-separado">
          <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="pr-item-btn pr-item-btn-store" title="${storeLabel}">
            ${storeLabel}
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </a>
          <button type="button" class="pr-item-btn-comprei" data-comprar-card-id="${item.id}" title="Marcar como comprado e remover da lista">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ✓ Já Comprei!
          </button>
        </div>
        <p class="pr-card-status-hint pr-card-status-hint-separado">
          🛍️ Na sua sacola · Ao finalizar a compra, clique em <strong>"Já Comprei!"</strong> para remover da lista.
        </p>
      `
      : `
        <div class="pr-item-card-actions">
          <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="pr-item-btn" title="${storeLabel}">
            ${storeLabel}
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </a>
        </div>
        <p class="pr-card-status-hint">
          🤍 Clique no coração acima para separar este presente
        </p>
      `;

    return `
      <article class="pr-item-card ${separadoClass}" style="animation-delay: ${index * 0.06}s">
        <div class="pr-item-img-wrap">
          ${imageHTML}
          <button class="pr-btn-separar ${separado ? 'active' : ''}" data-separar-id="${item.id}" title="${separado ? 'Remover da sacola' : 'Separar este presente'}">
            ${separadoIcon}
            <span class="pr-btn-separar-label">${separado ? 'Separado' : 'Separar'}</span>
          </button>
          ${separado ? '<span class="pr-badge-separado">✓ Na sua Sacola</span>' : ''}
        </div>
        <div class="pr-item-body">
          <h3 class="pr-item-name">${item.name}</h3>
          ${couponHtml}
          ${cardActionsHtml}
        </div>
      </article>
    `;
  }

  // Renderizar conteúdo (todas as categorias ou filtrado)
  function renderContent(categoryFilter) {
    if (!contentEl) return;

    // Verificar se todos os itens de toda a lista foram comprados (Meta: Zerar a lista!)
    const totalDisponiveisGlobal = data.items.filter(item => !isItemComprado(item.id)).length;
    if (totalDisponiveisGlobal === 0 && data.items.length > 0) {
      contentEl.innerHTML = `
        <div class="pr-all-bought-box reveal">
          <div class="pr-all-bought-icon">🎉 🤍 🏡</div>
          <h2 class="pr-all-bought-title">Lista Zerada com Amor!</h2>
          <p class="pr-all-bought-text">
            Glória a Deus! Todos os presentes de nossa lista foram presenteados com imenso carinho por nossos familiares e amigos.
          </p>
          <p class="pr-all-bought-sub">
            A presença, o afeto e as orações de cada um de vocês são o alicerce mais precioso da nossa nova família. Nosso mais sincero agradecimento de coração!
          </p>
        </div>
      `;
      return;
    }

    let html = '';

    if (categoryFilter === 'todos') {
      // Renderizar por seções de categoria
      data.categories.forEach((cat) => {
        const items = data.items.filter((item) => item.category === cat.id && !isItemComprado(item.id));
        if (items.length === 0) return;

        const iconSvg = typeof getCategoryIconSvg === 'function' ? getCategoryIconSvg(cat.id, cat.icon) : (cat.icon || '');
        html += `
          <div class="pr-category-section" id="cat-section-${cat.id}">
            <div class="pr-category-header">
              <span class="pr-category-icon" aria-hidden="true">${iconSvg}</span>
              <h2 class="pr-category-title">${cat.name}</h2>
              <span class="pr-category-count">${items.length} ${items.length === 1 ? 'disponível' : 'disponíveis'}</span>
            </div>
            <div class="pr-items-grid">
              ${items.map((item, i) => renderItemCard(item, i)).join('')}
            </div>
          </div>
        `;
      });
    } else {
      // Renderizar apenas itens da categoria filtrada
      const cat = data.categories.find((c) => c.id === categoryFilter);
      const items = data.items.filter((item) => item.category === categoryFilter && !isItemComprado(item.id));

      if (cat && items.length > 0) {
        const iconSvg = typeof getCategoryIconSvg === 'function' ? getCategoryIconSvg(cat.id, cat.icon) : (cat.icon || '');
        html += `
          <div class="pr-category-section" id="cat-section-${cat.id}">
            <div class="pr-category-header">
              <span class="pr-category-icon" aria-hidden="true">${iconSvg}</span>
              <h2 class="pr-category-title">${cat.name}</h2>
              <span class="pr-category-count">${items.length} ${items.length === 1 ? 'disponível' : 'disponíveis'}</span>
            </div>
            <div class="pr-items-grid">
              ${items.map((item, i) => renderItemCard(item, i)).join('')}
            </div>
          </div>
        `;
      } else {
        html = `
          <div class="pr-empty-category">
            <p>✨ Todos os presentes desta categoria já foram escolhidos e comprados com carinho!</p>
          </div>
        `;
      }
    }

    contentEl.innerHTML = html;

    // Event listeners para botões de separar
    contentEl.querySelectorAll('[data-separar-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(btn.dataset.separarId);
        toggleSeparar(id);
      });
    });

    // Event listeners para botões Já Comprei direto no card
    contentEl.querySelectorAll('[data-comprar-card-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(btn.dataset.comprarCardId);
        abrirModalCompra(id);
      });
    });

    // Re-observar reveals
    contentEl.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // Filtrar por categoria
  function filterByCategory(categoryId) {
    activeCategory = categoryId;

    // Atualizar botões ativos
    document.querySelectorAll('.pr-cat-btn').forEach((btn) => {
      btn.classList.toggle('pr-cat-active', btn.dataset.category === categoryId);
    });

    // Re-renderizar conteúdo
    renderContent(categoryId);
  }

  // Botão "Todos" event listener
  const todosBtn = document.getElementById('cat-todos');
  if (todosBtn) {
    todosBtn.addEventListener('click', () => filterByCategory('todos'));
  }

  // Inicializar
  renderCategoryButtons();
  renderContent('todos');
  atualizarBadgeSacola();

  // Sincronização em segundo plano com a nuvem (Supabase)
  if (typeof fetchPresentesDataFromSupabase === 'function') {
    fetchPresentesDataFromSupabase().then((newData) => {
      if (newData && newData.items && newData.items.length > 0) {
        data.categories = newData.categories;
        data.items = newData.items;
        if (catMenuEl) {
          catMenuEl.querySelectorAll('.pr-cat-btn:not(#cat-todos)').forEach(b => b.remove());
        }
        renderCategoryButtons();
        renderContent(activeCategory);
        atualizarBadgeSacola();
      }
    });
  }


  // Copiar cupom de desconto ao clicar
  document.addEventListener('click', (e) => {
    const couponEl = e.target.closest('[data-copy-coupon]');
    if (couponEl) {
      e.preventDefault();
      e.stopPropagation();
      const code = couponEl.dataset.copyCoupon;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          const btn = couponEl.querySelector('.pr-item-coupon-btn');
          if (btn) {
            const orig = btn.textContent;
            btn.textContent = '✓ Copiado!';
            btn.style.color = '#2e7d32';
            btn.style.borderColor = '#2e7d32';
            setTimeout(() => {
              btn.textContent = orig;
              btn.style.color = '';
              btn.style.borderColor = '';
            }, 2000);
          }
          mostrarToastCompra(`Cupom "${code}" copiado com sucesso!`);
        });
      } else {
        prompt('Copie o cupom de desconto abaixo:', code);
      }
    }
  });

  // ────────────────────────────────────────────────────────────
  // 5. PARALLAX HERO
  // ────────────────────────────────────────────────────────────
  const heroImg = document.querySelector('.pr-hero-img');

  if (heroImg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const p = Math.min(window.scrollY / window.innerHeight, 1);
          heroImg.style.transform = `scale(1.08) translateY(${p * 7}%)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

})();
