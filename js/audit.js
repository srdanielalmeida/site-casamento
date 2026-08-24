/* ==========================================================================
   AUDIT.JS — Módulo de Auditoria de Compradores
   Coleta dados REAIS do dispositivo e da rede no momento da compra.
   Nenhum campo é inventado: se não conseguirmos extrair, ficará vazio/null.
   ========================================================================== */

'use strict';

/**
 * Faz parse do User Agent para extrair dispositivo, OS e navegador.
 * Retorna sempre strings ("Desconhecido" se não reconhecido).
 */
function _parseUserAgent(ua) {
  const s = ua || '';

  // ── Dispositivo ──────────────────────────────────────────────
  let dispositivo = 'Desconhecido';
  if (/iPad/i.test(s))                            dispositivo = 'iPad';
  else if (/iPhone/i.test(s))                     dispositivo = 'iPhone';
  else if (/Android.*Mobile/i.test(s))            dispositivo = 'Smartphone Android';
  else if (/Android/i.test(s))                    dispositivo = 'Tablet Android';
  else if (/Macintosh|Mac OS X/i.test(s) && !/Mobile/i.test(s)) dispositivo = 'Mac';
  else if (/Windows NT/i.test(s))                 dispositivo = 'PC Windows';
  else if (/Linux/i.test(s) && !/Android/i.test(s)) dispositivo = 'PC Linux';
  else if (/CrOS/i.test(s))                       dispositivo = 'Chromebook';

  // ── Sistema Operacional ──────────────────────────────────────
  let os = 'Desconhecido';
  const iosMatch = s.match(/CPU(?: iPhone)? OS ([\d_]+)/i);
  const androidMatch = s.match(/Android ([\d.]+)/i);
  const winMatch = s.match(/Windows NT ([\d.]+)/i);
  const macMatch = s.match(/Mac OS X ([\d_]+)/i);

  if (iosMatch) {
    os = 'iOS ' + iosMatch[1].replace(/_/g, '.');
  } else if (androidMatch) {
    os = 'Android ' + androidMatch[1];
  } else if (winMatch) {
    const ntVersions = {
      '10.0': '10/11', '6.3': '8.1', '6.2': '8',
      '6.1': '7', '6.0': 'Vista', '5.1': 'XP'
    };
    os = 'Windows ' + (ntVersions[winMatch[1]] || winMatch[1]);
  } else if (macMatch) {
    os = 'macOS ' + macMatch[1].replace(/_/g, '.');
  } else if (/CrOS/i.test(s)) {
    os = 'Chrome OS';
  } else if (/Linux/i.test(s) && !/Android/i.test(s)) {
    os = 'Linux';
  }

  // ── Navegador ────────────────────────────────────────────────
  let browser = 'Desconhecido';

  // Ordem importa: verificar especializados antes de genéricos
  if (/Instagram/i.test(s))         browser = 'Instagram (WebView)';
  else if (/FBAN|FBAV/i.test(s))   browser = 'Facebook (WebView)';
  else if (/WhatsApp/i.test(s))    browser = 'WhatsApp (WebView)';
  else if (/OPR\//i.test(s))       browser = 'Opera';
  else if (/Edg\//i.test(s))       browser = 'Microsoft Edge';
  else if (/SamsungBrowser/i.test(s)) browser = 'Samsung Internet';
  else if (/YaBrowser/i.test(s))   browser = 'Yandex Browser';
  else if (/UCBrowser/i.test(s))   browser = 'UC Browser';
  else if (/CriOS/i.test(s))       browser = 'Chrome (iOS)';
  else if (/FxiOS/i.test(s))       browser = 'Firefox (iOS)';
  else if (/Chrome\//i.test(s) && !/Chromium/i.test(s)) browser = 'Google Chrome';
  else if (/Chromium/i.test(s))    browser = 'Chromium';
  else if (/Firefox\//i.test(s))   browser = 'Mozilla Firefox';
  else if (/Safari\//i.test(s) && /Version\//i.test(s)) browser = 'Safari';

  return { dispositivo, os, browser };
}

/**
 * Tenta buscar dados de IP/localização via ip-api.com (API pública gratuita).
 * Se falhar (rede, bloqueio, limite), retorna null para cada campo — nunca fabrica.
 * @returns {Promise<{ip:string|null, cidade:string|null, regiao:string|null, isp:string|null}>}
 */
async function _fetchIpData() {
  const resultado = { ip: null, cidade: null, regiao: null, isp: null };
  try {
    const res = await fetch(
      'https://ip-api.com/json/?fields=status,query,city,regionName,isp',
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return resultado;
    const json = await res.json();
    if (json.status !== 'success') return resultado;
    resultado.ip     = json.query     || null;
    resultado.cidade = json.city      || null;
    resultado.regiao = json.regionName || null;
    resultado.isp    = json.isp       || null;
  } catch (_) {
    // Silencia erros de rede — retorna campos nulos
  }
  return resultado;
}

/**
 * Coleta auditoria completa do dispositivo atual.
 * @param {{ isTrusted: boolean, tempoModalMs: number, honeypotPreenchido: boolean }} acaoParams
 * @returns {Promise<Object>} objeto de auditoria
 */
async function coletarAuditoria({ isTrusted = false, tempoModalMs = 0, honeypotPreenchido = false } = {}) {
  const ua = navigator.userAgent || '';
  const { dispositivo, os, browser } = _parseUserAgent(ua);

  // ── Resolução de tela ────────────────────────────────────────
  const resolucao = (window.screen && window.screen.width && window.screen.height)
    ? `${window.screen.width}×${window.screen.height}`
    : null;

  // ── Fuso Horário ─────────────────────────────────────────────
  let timezone = null;
  try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || null; } catch (_) {}

  // ── Idioma ───────────────────────────────────────────────────
  const idioma = navigator.language || navigator.userLanguage || null;

  // ── Vínculo com RSVP (quem confirmou presença neste dispositivo) ──
  let vinculo_rsvp = null;
  try {
    const rsvpRaw = localStorage.getItem('rsvp_minha_confirmacao');
    if (rsvpRaw) {
      const rsvpObj = JSON.parse(rsvpRaw);
      if (rsvpObj && rsvpObj.nome) {
        vinculo_rsvp = rsvpObj.nome;
      }
    }
  } catch (_) {}

  // ── Verificação de ação humana ───────────────────────────────
  // - isTrusted: clique real (não disparado por script)
  // - tempo: humano leva pelo menos 800ms para ler e clicar
  // - honeypot: campo oculto — se preenchido, é automação
  const passou_anti_bot = isTrusted === true
    && honeypotPreenchido === false
    && tempoModalMs >= 800;

  const acao_humana = {
    passou: passou_anti_bot,
    is_trusted: isTrusted,
    tempo_modal_ms: tempoModalMs,
    honeypot_ok: !honeypotPreenchido
  };

  // ── Dados de IP (operação assíncrona, não bloqueia UI) ───────
  const ipData = await _fetchIpData();

  return {
    timestamp_coleta: new Date().toISOString(),
    ua,
    dispositivo,
    os,
    browser,
    resolucao,
    timezone,
    idioma,
    online: navigator.onLine,
    ip:     ipData.ip,
    cidade: ipData.cidade,
    regiao: ipData.regiao,
    isp:    ipData.isp,
    vinculo_rsvp,
    acao_humana
  };
}

// Expõe como global (compatível com scripts não-module)
window.coletarAuditoria = coletarAuditoria;
