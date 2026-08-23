/* ============================================================
   NOSSA HISTÓRIA — JavaScript Interativo
   Animações de scroll reveal + parallax suave no hero
   ============================================================ */

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────────
  // 1. SCROLL REVEAL — observer para elementos .reveal
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
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  // ────────────────────────────────────────────────────────────
  // 2. REVEAL COM DELAY POR CAPÍTULO (efeito cascata)
  // ────────────────────────────────────────────────────────────
  const chapters = document.querySelectorAll('.nh-chapter');
  chapters.forEach((chapter) => {
    const img  = chapter.querySelector('.nh-chapter-image');
    const text = chapter.querySelector('.nh-chapter-text');

    if (img)  img.style.transitionDelay  = '0.1s';
    if (text) text.style.transitionDelay = '0.3s';
  });

  // ────────────────────────────────────────────────────────────
  // 3. PARALLAX SUAVE NO HERO
  // ────────────────────────────────────────────────────────────
  const heroImg = document.querySelector('.nh-hero-img');

  if (heroImg) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = window.innerHeight;
          const progress = Math.min(scrollY / maxScroll, 1);

          // Move a imagem para cima levemente (parallax)
          heroImg.style.transform = `scale(1.08) translateY(${progress * 8}%)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ────────────────────────────────────────────────────────────
  // 4. SMOOTH SCROLL PARA ÂNCORA #timeline
  // ────────────────────────────────────────────────────────────
  const scrollBtn = document.querySelector('.nh-scroll-btn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#timeline');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ────────────────────────────────────────────────────────────
  // 5. MARCADORES DA TIMELINE — aparecem com delay especial
  // ────────────────────────────────────────────────────────────
  const markerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translate(-50%, -50%) scale(1)';
          markerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.nh-chapter-marker').forEach((marker) => {
    marker.style.opacity = '0';
    marker.style.transform = 'translate(-50%, -50%) scale(0.5)';
    marker.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    markerObserver.observe(marker);
  });

})();
