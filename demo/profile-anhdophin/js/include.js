
async function loadPartial(selector, filePath) {
  const target = document.querySelector(selector);
  if (!target) return;
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('Failed to load ' + filePath);
    target.innerHTML = await response.text();
  } catch (error) {
    target.innerHTML = '<div style="padding:16px;background:#fff;border-radius:16px;color:#8a1d1d;">Không tải được thành phần dùng chung.</div>';
    console.error(error);
  }
}

function normalizeSharedPath(value, depth) {
  if (!value || depth === '.' || !value.startsWith('./')) return value;
  return `${depth}/${value.slice(2)}`;
}

function normalizePartialPaths(target, depth) {
  if (!target) return;

  target.querySelectorAll('[href]').forEach(node => {
    const href = node.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    node.setAttribute('href', normalizeSharedPath(href, depth));
  });

  target.querySelectorAll('[src]').forEach(node => {
    const src = node.getAttribute('src');
    if (!src || src.startsWith('http') || src.startsWith('data:')) return;
    node.setAttribute('src', normalizeSharedPath(src, depth));
  });
}

function initHeader() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function markActivePage() {
  const page = document.body.dataset.page;
  document.querySelectorAll('[data-site-nav] a').forEach(link => {
    if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
  });
}

function setYear() {
  const node = document.querySelector('[data-current-year]');
  if (node) node.textContent = new Date().getFullYear();
}

async function bootstrapShared() {
  const depth = document.body.dataset.depth || '.';
  await loadPartial('[data-include="header"]', `${depth}/shared/header.html`);
  await loadPartial('[data-include="footer"]', `${depth}/shared/footer.html`);
  normalizePartialPaths(document.querySelector('[data-include="header"]'), depth);
  normalizePartialPaths(document.querySelector('[data-include="footer"]'), depth);
  initHeader();
  markActivePage();
  setYear();
}

document.addEventListener('DOMContentLoaded', bootstrapShared);
