/**
 * CASAMENTO DANIEL & FRANCIELEN MARIA (DAN & ELLIE)
 * Componentes Globais (Menu & Rodapé) e Interatividade
 * 
 * NOTA: As variáveis abaixo definem o Menu (Header) e o Rodapé (Footer)
 * de TODO o site. Qualquer alteração aqui é refletida em todas as páginas.
 */

// ==========================================================================
// CONFIGURAÇÃO GLOBAL DO SITE (MENU E RODAPÉ COMO VARIÁVEIS)
// ==========================================================================
const SITE_CONFIG = {
  // Configurações do Menu Superior (Header)
  header: {
    leftLinks: [
      { text: 'Início', href: 'index.html' },
      { text: 'Informações', href: 'informacoes.html' }
    ],
    crest: {
      imgSrc: 'images/brasao/Gemini_Generated_Image_cqwzlmcqwzlmcqwz 1.png',
      alt: 'Brasão Daniel e Franciellen',
      href: 'brasao.html',
      ariaLabel: 'Ver o Brasão da Família Almeida'
    },
    rightLinks: [
      { text: 'RSVP', href: 'rsvp.html' },
      { text: 'Presentes', href: 'presentes.html' }
    ]
  },

  // Configurações do Rodapé (Footer)
  footer: {
    verse: '"Para que todos vejam, e saibam, e considerem,<br>e juntamente entendam que a mão do Senhor fez isso."',
    reference: 'Isaías 41:20',
    crest: {
      imgSrc: 'images/brasao/ChatGPT Image 12 de ago. de 2026, 20_08_35.png',
      alt: 'Brasão Daniel & Franciellen',
      href: 'brasao.html'
    },
    copyright: '© 2026 Daniel & Franciellen Maria · Todos os direitos reservados'
  }
};

/**
 * Renderiza o Menu Superior (Header) de forma padronizada
 */
function renderHeader() {
  const header = document.querySelector('.site-header#header, .site-header');
  if (!header) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const renderLink = (link) => {
    const isActive = (link.href === currentPath) || (currentPath === '' && link.href === 'index.html');
    return `<li><a href="${link.href}" class="nav-link${isActive ? ' active' : ''}">${link.text}</a></li>`;
  };

  const leftHtml = SITE_CONFIG.header.leftLinks.map(renderLink).join('\n          ');
  const rightHtml = SITE_CONFIG.header.rightLinks.map(renderLink).join('\n          ');

  header.innerHTML = `
    <div class="header-container">
      <!-- Brasão / Sinete Mobile (Canto Esquerdo) -->
      <a href="${SITE_CONFIG.header.crest.href}" class="header-mobile-brand" aria-label="${SITE_CONFIG.header.crest.ariaLabel}">
        <div class="mobile-crest-wrapper">
          <img src="${SITE_CONFIG.header.crest.imgSrc}" alt="${SITE_CONFIG.header.crest.alt}" class="mobile-crest-img">
        </div>
      </a>

      <nav class="nav-menu" id="nav-menu" aria-label="Navegação Principal">
        <ul class="nav-list nav-list-left">
          ${leftHtml}
        </ul>

        <a href="${SITE_CONFIG.header.crest.href}" class="header-brand" aria-label="${SITE_CONFIG.header.crest.ariaLabel}">
          <div class="brand-crest-wrapper">
            <img src="${SITE_CONFIG.header.crest.imgSrc}" alt="${SITE_CONFIG.header.crest.alt}" class="brand-crest-img">
          </div>
        </a>

        <ul class="nav-list nav-list-right">
          ${rightHtml}
        </ul>
      </nav>

      <button class="mobile-toggle" id="mobile-toggle" aria-label="Abrir Menu de Navegação">
        <div class="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>
  `;
}

/**
 * Renderiza o Rodapé (Footer) padronizado em todas as páginas
 */
function renderFooter() {
  let footer = document.querySelector('.site-footer-bottom#footer, footer.site-footer-bottom, footer#footer');
  
  // Se a página não tiver a tag footer, cria dinamicamente antes do final do body
  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'site-footer-bottom';
    footer.id = 'footer';
    document.body.appendChild(footer);
  }

  footer.innerHTML = `
    <!-- Versículo -->
    <div class="footer-quote">
      <div class="footer-quote-line"></div>
      <p class="footer-verse">${SITE_CONFIG.footer.verse}</p>
      <div class="footer-verse-ref">
        <span class="footer-ref-line"></span>
        <span class="footer-ref-text">${SITE_CONFIG.footer.reference}</span>
        <span class="footer-ref-line"></span>
      </div>
      <div class="footer-quote-line"></div>
    </div>

    <!-- Monograma / Brasão -->
    <div class="footer-monogram">
      <a href="${SITE_CONFIG.footer.crest.href}" aria-label="Ver o Brasão da Família Almeida">
        <img src="${SITE_CONFIG.footer.crest.imgSrc}" alt="${SITE_CONFIG.footer.crest.alt}" class="footer-brasao-img">
      </a>
    </div>

    <p class="footer-copy">${SITE_CONFIG.footer.copyright}</p>
  `;
}

// ==========================================================================
// INICIALIZAÇÃO E EVENTOS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Renderiza componentes globais compartilhados
  renderHeader();
  renderFooter();

  // 2. Interatividade do Cabeçalho
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Efeito de Scroll no Cabeçalho
  const handleScroll = () => {
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Menu Mobile Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Fechar menu ao clicar em qualquer link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Destaque de link conforme seção na tela (ScrollSpy para ancoras)
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const highlightNavLink = () => {
      const scrollY = window.pageYOffset;
      
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const correspondLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);
        
        if (correspondLink) {
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            correspondLink.classList.add('active');
          } else {
            correspondLink.classList.remove('active');
          }
        }
      });
    };

    window.addEventListener('scroll', highlightNavLink, { passive: true });
  }

  // ==========================================================================
  // CONTAGEM REGRESSIVA AUTOMÁTICA (DATA DO CASAMENTO: 31 DE OUTUBRO DE 2026)
  // ==========================================================================
  const weddingDate = new Date('2026-10-31T17:00:00').getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minutesEl = document.getElementById('cd-minutes');
      const secondsEl = document.getElementById('cd-seconds');
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  };

  if (document.getElementById('cd-days')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});
