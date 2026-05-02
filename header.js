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
  const btns = document.querySelectorAll('[data-dir-toggle]');
  btns.forEach(btn => {
    btn.textContent = dir.toUpperCase();
  });
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

// ── Active Nav Highlight ──
function initActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Map filenames → which nav href to highlight
  const desktopMap = {
    'index.html':           'index.html',
    'home2.html':           'index.html',   // home2 → highlight Home
    'about.html':           'about.html',
    'services.html':        'services.html',
    'contact.html':         'contact.html',
    'user-dashboard.html':  '#',            // dashboard parent uses href="#"
    'admin-dashboard.html': '#',
    'login.html':           null,           // login has no nav link
  };

  const targetHref = desktopMap[page];
  if (!targetHref) return;

  // ── Desktop nav — parent link ──
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === targetHref) {
      link.classList.add('active');
    }
  });

  // ── Desktop nav — dropdown sub-link ──
  // Clear any previous active dropdown item first
  document.querySelectorAll('.dropdown a').forEach(a => a.classList.remove('active'));

  // Map pages that live inside a dropdown → the exact href of their sub-link
  const dropdownSubMap = {
    'index.html':           'index.html',           // Home 1
    'home2.html':           'home2.html',           // Home 2
    'user-dashboard.html':  'user-dashboard.html',  // User Dashboard
    'admin-dashboard.html': 'admin-dashboard.html', // Admin Dashboard
  };
  const subHref = dropdownSubMap[page];
  if (subHref) {
    document.querySelectorAll('.dropdown a').forEach(a => {
      if (a.getAttribute('href') === subHref) a.classList.add('active');
    });
  }

  // ── Mobile nav ──
  // Map filenames → mobile link href or toggle id
  const mobileMap = {
    'index.html':           { type: 'toggle', id: 'mob-home-drop', linkHref: 'index.html'  },
    'home2.html':           { type: 'toggle', id: 'mob-home-drop', linkHref: 'home2.html'  },
    'about.html':           { type: 'link',   href: 'about.html'    },
    'services.html':        { type: 'link',   href: 'services.html' },
    'contact.html':         { type: 'link',   href: 'contact.html'  },
    'user-dashboard.html':  { type: 'toggle', id: 'mob-dash-drop', linkHref: 'user-dashboard.html'  },
    'admin-dashboard.html': { type: 'toggle', id: 'mob-dash-drop', linkHref: 'admin-dashboard.html' },
  };

  // Remove any existing mobile active
  document.querySelectorAll('.mobile-nav-link, .mobile-dropdown a').forEach(el => {
    el.classList.remove('active');
  });

  const mob = mobileMap[page];
  if (!mob) return;

  if (mob.type === 'link') {
    // Direct link (About, Services, Contact)
    document.querySelectorAll('.mobile-nav-link').forEach(el => {
      if (el.getAttribute('href') === mob.href) el.classList.add('active');
    });
  } else if (mob.type === 'toggle') {
    // Dropdown parent (Home, Dashboard) — highlight the toggle div
    const toggle = document.querySelector(`[data-toggle="${mob.id}"]`);
    if (toggle) toggle.classList.add('active');
    // Also highlight the specific sub-link inside the dropdown
    const drop = document.getElementById(mob.id);
    if (drop) {
      drop.querySelectorAll('a').forEach(a => {
        if (a.getAttribute('href') === mob.linkHref) a.classList.add('active');
      });
    }
  }
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
  initActiveNav();

  // Bind buttons
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', toggleTheme));
  document.querySelectorAll('[data-dir-toggle]').forEach(btn => btn.addEventListener('click', toggleDir));
  if (window.lucide) lucide.createIcons();
});
