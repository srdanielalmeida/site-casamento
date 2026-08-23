/* ============================================================
   RSVP — JavaScript: Formulário com busca inteligente e validação nominal
   ============================================================ */

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────────
  // 1. SCROLL REVEAL
  // ────────────────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));


  // ────────────────────────────────────────────────────────────
  // 2. CHAVES DO localStorage
  // ────────────────────────────────────────────────────────────
  const LS_MY_CONFIRM   = 'rsvp_minha_confirmacao';
  const LS_ALL_CONFIRMS = 'rsvp_confirmacoes';


  // ────────────────────────────────────────────────────────────
  // 3. ELEMENTOS DO DOM
  // ────────────────────────────────────────────────────────────
  const formSection       = document.getElementById('formulario');
  const form              = document.getElementById('rsvp-form');
  const submitBtn         = document.getElementById('rsvp-submit');
  const successBox        = document.getElementById('rsvp-success');
  const errorBox          = document.getElementById('rsvp-error');
  const editBtn           = document.getElementById('rsvp-btn-edit');
  const headerSub         = formSection ? formSection.querySelector('.rsvp-form-subtitle') : null;

  const inputNome         = document.getElementById('rsvp-nome');
  const suggestionsList   = document.getElementById('rsvp-suggestions');
  const nominalCard       = document.getElementById('rsvp-nominal-card');
  const nominalNameEl     = document.getElementById('rsvp-nominal-name');
  const inputWrapper      = document.getElementById('rsvp-input-wrapper');
  const hintText          = document.getElementById('rsvp-hint-text');

  if (!form) return;


  // ────────────────────────────────────────────────────────────
  // 4. LISTA DE CONVIDADOS & HELPERS DE BUSCA INTELIGENTE
  // ────────────────────────────────────────────────────────────
  const listaOficial = (typeof CONVIDADOS_LISTA !== 'undefined' && Array.isArray(CONVIDADOS_LISTA))
    ? CONVIDADOS_LISTA
    : [];

  function normalizar(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  // Obtém lista de nomes de convidados que já confirmaram presença
  function obterConfirmados() {
    try {
      const saved = localStorage.getItem(LS_ALL_CONFIRMS);
      if (saved) {
        const lista = JSON.parse(saved);
        if (Array.isArray(lista)) {
          return lista.map(item => normalizar(item.nome));
        }
      }
    } catch (_) {}
    return [];
  }

  // Busca sugestões que combinam com o que foi digitado (excluindo os já confirmados)
  function buscarSugestoes(termo) {
    const normTermo = normalizar(termo);
    if (!normTermo || normTermo.length < 2) return [];

    const confirmados = obterConfirmados();

    return listaOficial.filter(nome => {
      const normNome = normalizar(nome);

      // Se este convidado/família já confirmou presença, NÃO exibe mais nas sugestões
      if (confirmados.includes(normNome)) return false;

      if (normNome.includes(normTermo)) return true;

      // Busca por partes de nomes individuais na família
      const partes = normNome.split(/[,&]+/).map(p => p.trim());
      return partes.some(p => p.startsWith(normTermo) || p.includes(normTermo));
    });
  }

  // Encontra a correspondência exata ou melhor na lista
  function validarNomeConvidado(termo) {
    const normTermo = normalizar(termo);
    if (!normTermo) return null;

    // 1. Busca exata normalizada (ex: "flavio" -> "Flávio")
    const exato = listaOficial.find(c => normalizar(c) === normTermo);
    if (exato) return exato;

    // 2. Busca por membro individual que seja exatamente igual ao termo digitado
    const matchMembro = listaOficial.filter(nome => {
      const normNome = normalizar(nome);
      const partes = normNome.split(/[,&]+/).map(p => p.trim());
      return partes.includes(normTermo);
    });
    if (matchMembro.length === 1) return matchMembro[0];

    // 3. Se houver apenas 1 resultado parcial contendo o termo
    const parciais = buscarSugestoes(termo);
    if (parciais.length === 1) return parciais[0];

    return null;
  }

  function obterConvidadoPorUrl() {
    const params = new URLSearchParams(window.location.search);
    const param = params.get('c') || params.get('convidado') || params.get('nome') || params.get('id');
    if (!param) return null;

    const query = decodeURIComponent(param).trim();

    // Busca por número de índice (1 a N)
    const num = parseInt(query, 10);
    if (!isNaN(num) && num >= 1 && num <= listaOficial.length) {
      return listaOficial[num - 1];
    }

    return validarNomeConvidado(query) || query;
  }

  // ────────────────────────────────────────────────────────────
  // 5. INICIALIZAR INPUT / AUTOCOMPLETE
  // ────────────────────────────────────────────────────────────
  function fecharSugestoes() {
    if (suggestionsList) {
      suggestionsList.innerHTML = '';
      suggestionsList.hidden = true;
    }
  }

  function selecionarSugestao(nome) {
    if (inputNome) {
      inputNome.value = nome;
      clearError('rsvp-nome', 'error-nome');
    }
    fecharSugestoes();
  }

  function renderizarSugestoes(resultados) {
    if (!suggestionsList) return;

    if (resultados.length === 0) {
      fecharSugestoes();
      return;
    }

    suggestionsList.innerHTML = '';
    resultados.forEach((nome) => {
      const li = document.createElement('li');
      li.className = 'rsvp-suggestion-item';
      li.innerHTML = `<span class="rsvp-suggestion-icon" aria-hidden="true">✦</span> <span>${escapeHtml(nome)}</span>`;
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        selecionarSugestao(nome);
      });
      suggestionsList.appendChild(li);
    });

    suggestionsList.hidden = false;
  }

  function inicializarCampoNome() {
    const convidadoUrl = obterConvidadoPorUrl();

    if (convidadoUrl) {
      // Modo Nominal Privado via link
      if (inputWrapper) inputWrapper.hidden = true;
      if (nominalCard) {
        nominalCard.hidden = false;
        if (nominalNameEl) nominalNameEl.textContent = convidadoUrl;
      }
      if (inputNome) inputNome.value = convidadoUrl;
      if (hintText) hintText.textContent = 'Este convite é estritamente nominal e intransferível.';
    } else {
      if (nominalCard) nominalCard.hidden = true;
      if (inputWrapper) inputWrapper.hidden = false;

      if (inputNome) {
        inputNome.addEventListener('input', () => {
          clearError('rsvp-nome', 'error-nome');
          const termo = inputNome.value.trim();
          if (termo.length >= 2) {
            const matches = buscarSugestoes(termo);
            renderizarSugestoes(matches);
          } else {
            fecharSugestoes();
          }
        });

        inputNome.addEventListener('blur', () => {
          setTimeout(fecharSugestoes, 200);
        });

        inputNome.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') fecharSugestoes();
        });
      }
    }
  }

  inicializarCampoNome();


  // ────────────────────────────────────────────────────────────
  // 6. VERIFICAR SE ESTE DISPOSITIVO JÁ CONFIRMOU
  // ────────────────────────────────────────────────────────────
  function aplicarDadosSucesso(data) {
    const textEl = successBox.querySelector('.rsvp-success-text');
    if (textEl && data.nome) {
      textEl.innerHTML =
        `Sua presença foi registrada com alegria.<br>` +
        `Bem-vindo(a), <strong style="color:var(--gold-light)">${escapeHtml(data.nome)}</strong>!<br>` +
        `Que a graça do Senhor esteja convosco neste dia especial.`;
    }
    if (headerSub) {
      headerSub.textContent = 'Sua presença está confirmada — aguardamos você com alegria!';
    }
    if (inputNome && data.nome) {
      inputNome.value = data.nome;
    }
    if (nominalNameEl && data.nome) {
      nominalNameEl.textContent = data.nome;
    }
    if (form.elements['mensagem'] && data.mensagem) {
      form.elements['mensagem'].value = data.mensagem;
    }
  }

  function verificarConfirmacaoExistente() {
    try {
      const saved = localStorage.getItem(LS_MY_CONFIRM);
      if (saved) {
        const data = JSON.parse(saved);
        aplicarDadosSucesso(data);
        form.hidden       = true;
        successBox.hidden = false;
        const container = successBox.closest('.rsvp-form-container');
        if (container) container.classList.add('visible');
        successBox.classList.add('visible');
        return true;
      }
    } catch (e) { /* ignora erros de localStorage */ }
    return false;
  }

  verificarConfirmacaoExistente();

  // Sincroniza lista global de confirmações com o Supabase em segundo plano
  async function sincronizarConfirmadosDaNuvem() {
    const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
    if (!sb) return;
    try {
      const { data, error } = await sb.from('rsvp_confirmacoes').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        localStorage.setItem(LS_ALL_CONFIRMS, JSON.stringify(data));
      }
    } catch (_) {}
  }
  sincronizarConfirmadosDaNuvem();


  // ────────────────────────────────────────────────────────────
  // 7. HELPERS
  // ────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function showError(inputId, errorId, msg) {
    const field = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (field) field.classList.add('invalid');
    if (error) error.textContent = msg;
  }

  function clearError(inputId, errorId) {
    const field = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (field) field.classList.remove('invalid');
    if (error) error.textContent = '';
  }

  function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }


  // ────────────────────────────────────────────────────────────
  // 8. VALIDAÇÃO RIGOROSA CONTRA A LISTA OFICIAL
  // ────────────────────────────────────────────────────────────
  function validate() {
    let valid = true;
    const digitado = inputNome ? inputNome.value.trim() : '';

    if (!digitado || digitado.length < 2) {
      showError('rsvp-nome', 'error-nome', 'Por favor, digite seu nome conforme consta no convite.');
      return false;
    }

    // Se estiver no modo nominal fixado por link (?c=...)
    if (nominalCard && !nominalCard.hidden && nominalNameEl) {
      clearError('rsvp-nome', 'error-nome');
      return true;
    }

    // Valida se o nome existe na lista oficial
    const convidadoOficial = validarNomeConvidado(digitado);

    if (!convidadoOficial) {
      // Verifica se o nome digitado pertence a alguém que já confirmou
      const confirmados = obterConfirmados();
      const matchJaConfirmado = listaOficial.find(c => {
        if (normalizar(c) === normalizar(digitado)) return true;
        const partes = normalizar(c).split(/[,&]+/).map(p => p.trim());
        return partes.includes(normalizar(digitado));
      });

      if (matchJaConfirmado && confirmados.includes(normalizar(matchJaConfirmado))) {
        showError('rsvp-nome', 'error-nome', `A presença de "${matchJaConfirmado}" já foi confirmada anteriormente.`);
        return false;
      }

      showError('rsvp-nome', 'error-nome', 'Nome não localizado na lista oficial de convidados. Por favor, verifique a grafia conforme consta em seu convite.');
      valid = false;
    } else {
      // Verifica se este convidado oficial já confirmou (e não é a alteração da sessão atual)
      const confirmados = obterConfirmados();
      if (confirmados.includes(normalizar(convidadoOficial))) {
        const minhaConfirmacao = localStorage.getItem(LS_MY_CONFIRM);
        let meuNome = '';
        try { meuNome = JSON.parse(minhaConfirmacao || '{}').nome || ''; } catch (_) {}

        if (normalizar(meuNome) !== normalizar(convidadoOficial)) {
          showError('rsvp-nome', 'error-nome', `A presença de "${convidadoOficial}" já foi confirmada anteriormente.`);
          return false;
        }
      }

      // Ajusta o input para o nome oficial padronizado
      inputNome.value = convidadoOficial;
      clearError('rsvp-nome', 'error-nome');
    }

    return valid;
  }


  // ────────────────────────────────────────────────────────────
  // 9. SUBMIT — Transição e Salvamento
  // ────────────────────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    if (errorBox) errorBox.hidden = true;

    const confirmacao = {
      id:        gerarId(),
      nome:      inputNome.value.trim(),
      mensagem:  form.elements['mensagem'] ? form.elements['mensagem'].value.trim() : '',
      timestamp: new Date().toISOString(),
    };

    try {
      await new Promise((r) => setTimeout(r, 600));

      localStorage.setItem(LS_MY_CONFIRM, JSON.stringify(confirmacao));

      let lista = [];
      try {
        lista = JSON.parse(localStorage.getItem(LS_ALL_CONFIRMS) || '[]');
        if (!Array.isArray(lista)) lista = [];
      } catch (_) { lista = []; }

      const idxExistente = lista.findIndex((c) => normalizar(c.nome) === normalizar(confirmacao.nome));
      if (idxExistente >= 0) {
        lista[idxExistente] = confirmacao;
      } else {
        lista.push(confirmacao);
      }
      localStorage.setItem(LS_ALL_CONFIRMS, JSON.stringify(lista));

      // Sincroniza com Supabase na nuvem se disponível
      const sb = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
      if (sb) {
        try {
          await sb.from('rsvp_confirmacoes').upsert({
            id: confirmacao.id,
            nome: confirmacao.nome,
            mensagem: confirmacao.mensagem,
            created_at: confirmacao.timestamp
          });
        } catch (sbErr) {
          console.warn('[Supabase] Erro ao salvar confirmação na nuvem:', sbErr);
        }
      }

      aplicarDadosSucesso(confirmacao);

      form.classList.add('is-exiting');

      setTimeout(() => {
        form.hidden = true;
        form.classList.remove('is-exiting');

        successBox.hidden = false;
        successBox.classList.add('visible');

        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);

    } catch (err) {
      console.error('[RSVP] Erro ao registrar:', err);
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  });


  // ────────────────────────────────────────────────────────────
  // 10. BOTÃO ALTERAR CONFIRMAÇÃO
  // ────────────────────────────────────────────────────────────
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      successBox.classList.add('is-exiting');

      setTimeout(() => {
        successBox.hidden = true;
        successBox.classList.remove('is-exiting');

        form.hidden = false;
        if (headerSub) {
          headerSub.textContent = 'Preencha com atenção e carinho — aguardamos você!';
        }

        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (inputNome && !inputWrapper.hidden) {
          inputNome.focus();
        }
      }, 300);
    });
  }


  // ────────────────────────────────────────────────────────────
  // 11. PARALLAX SUAVE NO HERO
  // ────────────────────────────────────────────────────────────
  const heroImg = document.querySelector('.rsvp-hero-img');

  if (heroImg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const progress = Math.min(window.scrollY / window.innerHeight, 1);
          heroImg.style.transform = `scale(1.08) translateY(${progress * 7}%)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

})();
