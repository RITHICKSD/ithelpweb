/* HOME 1 — Page-Specific JavaScript */

// ── AIOps bar animation trigger via IntersectionObserver ──
function initDevOpsBars() {
  const bars = document.querySelectorAll('.dop-fill');
  if (!bars.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width || '0%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => io.observe(b));
}

// ── Animated particle trails on hero canvas (optional enhancement) ──
function initHeroParticles() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;
  // Subtle floating dots effect via CSS is already handled
}

// ── Marquee hover pause ──
function initMarquee() {
  const inner = document.querySelector('.marquee-inner');
  if (!inner) return;
  inner.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
  inner.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
}


// ── Network map node animation ──
function initNetworkNodes() {
  document.querySelectorAll('.node-ping').forEach((node, i) => {
    node.style.animationDelay = `${i * 0.4}s`;
  });
}

// ── Init all home-1 specific ──
document.addEventListener('DOMContentLoaded', () => {
  initDevOpsBars();
  initMarquee();
  initNetworkNodes();
});
