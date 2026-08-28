// Martina Lepre — portfolio behaviour
// Reveal on scroll, cadence progress bar, mobile nav. Respects prefers-reduced-motion.

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Reveal on scroll ----
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ---- Cadence bar: fills ticks with scroll progress ----
  const cadence = document.querySelector('.cadence');
  if (cadence) {
    const ticks = cadence.querySelectorAll('i');
    const updateCadence = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const litCount = Math.round(progress * ticks.length);
      ticks.forEach((tick, i) => tick.classList.toggle('lit', i < litCount));
    };
    updateCadence();
    window.addEventListener('scroll', updateCadence, { passive: true });
    window.addEventListener('resize', updateCadence);
  }

  // ---- Mobile nav toggle ----
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.textContent = isOpen ? 'Close' : 'Menu';
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.textContent = 'Menu';
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // ---- Back to top ----
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // ---- Footer year ----
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
