/*
  AI EDIT NOTE:
  - Đọc AGENTS.md + .cursorrules + AI-EDIT-PRECHECK.md trước khi sửa.
  - File này dùng để thay header/footer cũ bằng portal header/footer mới.
  - Nếu clone page mới, chỉ cần giữ #subpage-header và #subpage-footer.
*/
(async function initPortalSubpageShell(){
  function getPortalRootPrefix(){
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
      services: `${prefix}services/`,
      apps: `${prefix}apps/`,
      shop: `${prefix}shop/`,
      about: `${prefix}services/about/`,
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
  const prefix = getPortalRootPrefix();
  await Promise.all([
    inject('#subpage-header', `${prefix}../partials/header.html`),
    inject('#subpage-footer', `${prefix}../partials/footer.html`),
  ]);
  hydrate(prefix);
})();
