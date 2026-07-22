import { initFooterBackground } from './footer-background.js';

export async function injectPartial(targetSelector, partialPath) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  const res = await fetch(partialPath, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Cannot load partial: ${partialPath}`);
  el.innerHTML = await res.text();
}

export function rootPath() {
  return document.body.dataset.root || '.';
}

export function normalizePagePath(pathname = window.location.pathname) {
  let path = pathname.replace(/index\.html$/i, '');
  path = path.replace(/\/+/g, '/');
  if (!path.endsWith('/')) path += '/';
  return path;
}

export function buildPortalRoutes(root = '.') {
  const prefix = root === '.' ? './' : root.replace(/\/$/, '') + '/';
  return {
    home: `${prefix}`,
    work: `${prefix}work/`,
    apps: `${prefix}apps/`,
    services: `${prefix}services/`,
    resources: `${prefix}resources/`,
    about: `${prefix}about/`,
    contact: `${prefix}contact/`,
    insights: `${prefix}insights/`,
    solutions: `${prefix}services_solutions/services_solutions.html`,
    blog: `${prefix}blog/blog.html`,
    shop: `${prefix}shop/`,
  };
}

export function hydratePortalLinks(root = rootPath()) {
  const routes = buildPortalRoutes(root);
  const current = normalizePagePath();
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const key = link.dataset.navLink;
    const href = routes[key] || routes.home;
    link.setAttribute('href', href);
    const linkPath = normalizePagePath(new URL(href, window.location.href).pathname);
    const isActive = key === 'home' ? current === linkPath : current === linkPath || current.startsWith(linkPath);
    link.classList.toggle('is-active', isActive);
  });
}

export function scrollBelowTopNavigation(root = rootPath(), headerSelector = '#site-header .portal-header') {
  if (window.location.hash) return;
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function scheduleBelowNavigationScroll(root = rootPath(), headerSelector = '#site-header .portal-header') {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  scrollBelowTopNavigation(root, headerSelector);
  requestAnimationFrame(() => scrollBelowTopNavigation(root, headerSelector));
  window.addEventListener('load', () => scrollBelowTopNavigation(root, headerSelector), { once: true });
}

const THEME_KEY = 'iapplab-theme';
const LIGHT = 'light';
const DARK = 'dark';
let deferredInstallPrompt = null;

export function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || LIGHT;
}

export function applyTheme(theme = LIGHT) {
  const nextTheme = theme === DARK ? DARK : LIGHT;
  document.documentElement.dataset.theme = nextTheme;
  document.body.dataset.theme = nextTheme;
  localStorage.setItem(THEME_KEY, nextTheme);
}

export function initThemeToggle() {
  applyTheme(getStoredTheme());
}

function isIosLike() {
  const ua = window.navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function refreshInstallButtons() {
  document.querySelectorAll('[data-install-button]').forEach((btn) => {
    if (isStandalone()) {
      btn.hidden = true;
      return;
    }
    btn.hidden = false;
    if (deferredInstallPrompt) {
      btn.textContent = 'Install App';
    } else if (isIosLike()) {
      btn.textContent = 'Add to Home';
    } else {
      btn.textContent = 'Install App';
    }
  });
}

export function initInstallButton() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    refreshInstallButtons();
  });
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    refreshInstallButtons();
  });
  document.querySelectorAll('[data-install-button]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice.catch(() => null);
        deferredInstallPrompt = null;
        refreshInstallButtons();
        return;
      }
      window.alert(isIosLike() ? 'Trên iPhone/iPad, anh mở Share rồi chọn Add to Home Screen.' : 'Trình duyệt chưa đưa ra hộp cài đặt lúc này.');
    });
  });
  refreshInstallButtons();
}

export function initSharedUI(root = rootPath()) {
  initThemeToggle();
  initInstallButton();
  hydratePortalLinks(root);
}

export async function setupSharedShell(root = rootPath()) {
  await Promise.all([
    injectPartial('#site-header', `${root}/partials/header.html`),
    injectPartial('#site-footer', `${root}/partials/footer.html`),
  ]);
  initFooterBackground(root);
  initSharedUI(root);
  scheduleBelowNavigationScroll(root);
}
