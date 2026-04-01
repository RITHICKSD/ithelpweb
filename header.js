/* BCF IT SUPPORT — Shared Header & Global JS */

// ── Theme ──
function initTheme() {
  const saved = localStorage.getItem('bcf-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('bcf-theme', next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(el => {
    el.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
  });
  if (window.lucide) lucide.createIcons();
}

// ── RTL / LTR ──
function initDir() {
  const saved = localStorage.getItem('bcf-dir') || 'ltr';
  document.documentElement.setAttribute('dir', saved);
  updateDirIcon(saved);
}
function toggleDir() {
  const current = document.documentElement.getAttribute('dir');
  const next = current === 'ltr' ? 'rtl' : 'ltr';
  document.documentElement.classList.add('no-transition');
  document.documentElement.setAttribute('dir', next);
  localStorage.setItem('bcf-dir', next);
  updateDirIcon(next);
  setTimeout(() => {
    document.documentElement.classList.remove('no-transition');
  }, 100);
}
function updateDirIcon(dir) {
  const icons = document.querySelectorAll('.dir-icon');
  icons.forEach(el => {
    el.setAttribute('data-lucide', 'globe');
  });
  if (window.lucide) lucide.createIcons();
}

// ── Mobile Menu ──
function initMobileMenu() {
  const ham = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!ham || !mobileNav) return;
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  // Mobile dropdowns
  document.querySelectorAll('.mobile-nav-link[data-toggle]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.dataset.toggle);
      if (target) {
        target.classList.toggle('open');
        const icon = link.querySelector('.mob-arrow');
        if (icon) icon.style.transform = target.classList.contains('open') ? 'rotate(180deg)' : '';
      }
    });
  });
  // Close on link click
  mobileNav.querySelectorAll('a:not([data-toggle])').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Scroll Reveal ──
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

// ── Counter Animation ──
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(el => io.observe(el));
}

// ── Progress Bars ──
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width || '100%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => io.observe(b));
}

// ── FAQ ──
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ── Header Scroll Shadow ──
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 20 ? '0 4px 30px rgba(0,0,0,0.3)' : '';
  }, { passive: true });
}

// ── Init All ──
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDir();
  initMobileMenu();
  initReveal();
  initCounters();
  initProgressBars();
  initFAQ();
  initHeaderScroll();

  // Bind buttons
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', toggleTheme));
  document.querySelectorAll('[data-dir-toggle]').forEach(btn => btn.addEventListener('click', toggleDir));
  if (window.lucide) lucide.createIcons();
});
