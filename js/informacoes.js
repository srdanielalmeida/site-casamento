/* ============================================================
   INFORMAÇÕES — JavaScript: Scroll Reveal, Quicknav Scrollspy & Parallax
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
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));


  // ────────────────────────────────────────────────────────────
  // 2. QUICKNAV SCROLLSPY & SMOOTH SCROLL
  // ────────────────────────────────────────────────────────────
  const quickNavLinks = document.querySelectorAll('.inf-qnav-link');
  const sections = document.querySelectorAll('.inf-section');

  // Scroll suave com compensação de offset do header fixo + quicknav
  quickNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const offset = 140; // compensação do header + sticky nav
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetSection.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scrollspy para destacar link ativo
  if (sections.length > 0 && quickNavLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollY = window.pageYOffset;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 160;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      quickNavLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    });
  }


  // ────────────────────────────────────────────────────────────
  // 3. PARALLAX HERO
  // ────────────────────────────────────────────────────────────
  const heroImg = document.querySelector('.inf-hero-img');

  if (heroImg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const progress = Math.min(window.scrollY / window.innerHeight, 1);
          heroImg.style.transform = `scale(1.08) translateY(${progress * 8}%)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }


  // ────────────────────────────────────────────────────────────
  // 4. DELAY EM CASCATA NOS CARDS
  // ────────────────────────────────────────────────────────────
  document.querySelectorAll('.inf-dc-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  document.querySelectorAll('.inf-log-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });

  document.querySelectorAll('.inf-lit-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.12}s`;
  });

})();
