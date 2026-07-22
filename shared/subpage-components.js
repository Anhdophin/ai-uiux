/*
  AI EDIT NOTE:
  - Đọc AGENTS.md + .cursorrules + AI-EDIT-PRECHECK.md trước khi sửa.
  - File này dùng để thay header/footer cũ bằng portal header/footer mới.
  - Nếu clone page mới, chỉ cần giữ #subpage-header và #subpage-footer.
*/
(async function initPortalSubpageShell(){
  function getPortalRootPrefix(){
    const currentScript = document.currentScript;
    if (currentScript && currentScript.src) {
      try {
        const scriptUrl = new URL(currentScript.src, window.location.href);
        let root = scriptUrl.pathname.replace(/\/(?:services\/)?shared\/subpage-components\.js$/, '');
        if (!root.endsWith('/')) root += '/';
        return root;
      } catch (error) {
        // fallback to path depth when currentScript is unavailable
      }
    }
    const path = window.location.pathname.replace(/index\.html$/i, '').replace(/\/+/g, '/');
    const parts = path.split('/').filter(Boolean);
    return parts.length ? '../'.repeat(parts.length) : './';
  }
  function normalize(pathname){
    let path = pathname.replace(/index\.html$/i, '');
    path = path.replace(/\/+/g, '/');
    if (!path.endsWith('/')) path += '/';
    return path;
  }
  function buildRoutes(prefix){
    return {
      home: `${prefix}`,
      work: `${prefix}work/`,
      services: `${prefix}services/`,
      apps: `${prefix}apps/`,
      resources: `${prefix}resources/`,
      about: `${prefix}about/`,
      contact: `${prefix}contact/`,
      insights: `${prefix}insights/`,
      shop: `${prefix}shop/`,
      blog: `${prefix}blog/blog.html`,
      solutions: `${prefix}services_solutions/services_solutions.html`,
    };
  }
  async function inject(selector, url){
    const mount = document.querySelector(selector);
    if (!mount) return;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return;
    mount.innerHTML = await res.text();
  }
  function hydrate(prefix){
    const routes = buildRoutes(prefix);
    const current = normalize(window.location.pathname);
    document.querySelectorAll('[data-nav-link]').forEach((link) => {
      const key = link.dataset.navLink;
      const href = routes[key] || routes.home;
      link.setAttribute('href', href);
      const path = normalize(new URL(href, window.location.href).pathname);
      const isActive = key === 'home' ? current === path : current === path || current.startsWith(path);
      link.classList.toggle('is-active', isActive);
    });
  }

  function scrollBelowTopNavigation(prefix){
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function scheduleBelowNavigationScroll(prefix){
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    scrollBelowTopNavigation(prefix);
    requestAnimationFrame(() => scrollBelowTopNavigation(prefix));
    window.addEventListener('load', () => scrollBelowTopNavigation(prefix), { once: true });
  }

  const prefix = getPortalRootPrefix();
  const shouldUseAutoPageBackground = document.body.dataset.pageBg === 'auto';
  if (shouldUseAutoPageBackground) {
    try {
      const module = await import(`${prefix}js/page-background.js`);
      if (module && typeof module.initPageBackground === 'function') {
        await module.initPageBackground(prefix);
      }
    } catch (error) {
      // continue without page background if module is unavailable
    }
  }

  async function initSharedFooterModule() {
    try {
      const footerModule = await import(`${prefix}js/footer-background.js`);
      if (footerModule && typeof footerModule.initFooterBackground === 'function') {
        await footerModule.initFooterBackground(prefix);
      }
    } catch (error) {
      // continue without footer background if module is unavailable
    }
  }

  async function initSharedUiModule() {
    try {
      const sharedModule = await import(`${prefix}js/modules.js`);
      if (sharedModule && typeof sharedModule.initSharedUI === 'function') {
        sharedModule.initSharedUI(prefix);
      }
    } catch (error) {
      // continue with local hydrate if shared module is unavailable
    }
  }

  await Promise.all([
    inject('#site-header, #subpage-header', `${prefix}partials/header.html`),
    inject('#site-footer, #subpage-footer', `${prefix}partials/footer.html`),
  ]);
  await initSharedFooterModule();
  await initSharedUiModule();
  hydrate(prefix);
  scheduleBelowNavigationScroll(prefix);
})();
