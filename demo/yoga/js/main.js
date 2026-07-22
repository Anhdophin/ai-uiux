function getBasePath() {
  return document.body.dataset.basePath || '';
}

async function includePartials() {
  const includeTargets = document.querySelectorAll('[data-include]');
  const basePath = getBasePath();

  for (const target of includeTargets) {
    const filePath = target.getAttribute('data-include');

    try {
      const response = await fetch(`${basePath}${filePath}`);
      if (!response.ok) {
        throw new Error(`Cannot load partial: ${basePath}${filePath}`);
      }

      let html = await response.text();
      html = html.replaceAll('{{base}}', basePath);
      target.innerHTML = html;
    } catch (error) {
      target.innerHTML = `<div style="padding: 1rem; color: red;">${error.message}</div>`;
    }
  }

  setupMenuToggle();
  setupActiveButtons();
  setupActiveNav();
}

function setupMenuToggle() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-menu-panel]');

  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function setupActiveButtons() {
  const buttons = document.querySelectorAll('.button');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.closest('.class-grid')) {
        const siblingButtons = button.closest('.class-grid').querySelectorAll('.button');
        siblingButtons.forEach((item) => item.classList.remove('is-active'));
      }
      button.classList.add('is-active');
      setTimeout(() => button.classList.remove('is-active'), 220);
    });
  });
}

function setupActiveNav() {
  const links = document.querySelectorAll('[data-nav-match]');
  const path = window.location.pathname;

  links.forEach((link) => {
    const candidates = (link.dataset.navMatch || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const isMatch = candidates.some((item) => path.endsWith(item) || path === item);
    if (isMatch) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });
}

document.addEventListener('DOMContentLoaded', includePartials);
