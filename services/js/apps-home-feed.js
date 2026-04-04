/* js/apps-home-feed.js */
/* Comment: file này dành cho trang chủ root. Chỉ cần đặt container [data-apps-home-feed] là render được. */
window.IAppLabAppsHomeFeed = (() => {
  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
  }

  function toLocalHref(route) {
    if (!route) return '#';
    return route.startsWith('/apps/') ? '.' + route : route;
  }

  async function loadFeed() {
    const response = await fetch('./data/apps-home-feed.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Không tải được data/apps-home-feed.json');
    return response.json();
  }

  function renderItem(item) {
    const coverHtml = item.cover
      ? `<img src=".${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" loading="lazy">`
      : `<div class="app-card__placeholder">${escapeHtml(item.title)}</div>`;

    const tags = (item.tags || []).slice(0, 3).map((tag) => `<span class="app-card__tag">${escapeHtml(tag)}</span>`).join('');
    return `
      <a class="app-card" href="${escapeHtml(toLocalHref(item.route))}">
        <div class="app-card__media">${coverHtml}</div>
        <div class="app-card__top">
          <h3 class="app-card__title">${escapeHtml(item.title)}</h3>
          <span class="app-card__badge">${escapeHtml(item.category || 'App')}</span>
        </div>
        <p class="app-card__summary">${escapeHtml(item.summary || '')}</p>
        <div class="app-card__meta">${tags}</div>
      </a>
    `;
  }

  async function init(selector = '[data-apps-home-feed]') {
    const root = document.querySelector(selector);
    if (!root) return;
    const payload = await loadFeed();
    const items = Array.isArray(payload.items) ? payload.items : [];
    root.innerHTML = items.map(renderItem).join('');
  }

  return { init };
})();
