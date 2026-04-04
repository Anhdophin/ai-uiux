function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function normalize(text) {
  return String(text || '').toLowerCase().trim();
}

function toHref(path) {
  if (!path) return '#';
  const value = String(path).trim();

  if (value.startsWith('/apps/')) {
    return `.${value.replace('/apps', '')}`;
  }

  if (value.startsWith('apps/')) {
    return `./${value.slice(5)}`;
  }

  if (value.startsWith('/')) {
    return value;
  }

  return value;
}

function createCard(app) {
  const subtitle = app.subtitle || app.summary || app.category || '';
  return `
    <a class="app-card" href="${escapeHtml(toHref(app.path || app.route))}" aria-label="${escapeHtml(app.title)}">
      <div class="app-meta">
        <div class="app-title">${escapeHtml(app.title)}</div>
        <div class="app-subtitle">${escapeHtml(subtitle)}</div>
      </div>
      <div class="app-icon">${app.icon || app.cover ? `<img src="${escapeHtml('../' + (app.icon || app.cover).replace(/^\//, ''))}" alt="${escapeHtml(app.title)}">` : ''}</div>
      <div class="app-badge">${escapeHtml(app.group || app.category || '')}</div>
      <div class="app-reflection" aria-hidden="true"></div>
    </a>
  `;
}

function floatingIcons(apps) {
  const picks = [apps[0], apps[1], apps[2], apps[3], apps[4], apps[5]].filter(Boolean);
  return picks.map((app, index) => {
    const src = app.icon || app.cover;
    if (!src) return '';
    return `<img class="floating-icon floating-${index + 1}" src="${escapeHtml('../' + src.replace(/^\//, ''))}" alt="" aria-hidden="true">`;
  }).join('');
}

function groupShelves(apps) {
  const map = new Map();
  apps.forEach((app) => {
    const key = app.shelf || app.order || 1;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(app);
  });
  return [...map.entries()].sort((a, b) => Number(a[0]) - Number(b[0]));
}

function renderShelves(apps) {
  if (!apps.length) {
    return `<div class="empty-state">Chưa có app nào khớp với từ khóa tìm kiếm.</div>`;
  }
  return groupShelves(apps).map(([shelf, list]) => `
    <section class="shelf-section" data-shelf="${escapeHtml(String(shelf))}">
      <div class="shelf-track">${list.map(createCard).join('')}</div>
      <div class="shelf-base" aria-hidden="true"></div>
    </section>
  `).join('');
}

function renderPage(apps) {
  return `
    <main class="page-home apps-hub-page">
      <section class="hero container apps-hub-hero">
        <div class="hero-floating">${floatingIcons(apps)}</div>
        <div class="hero-inner apps-hub-hero__inner">
          <p class="apps-hub-kicker">Mini Apps / Micro Tools</p>
          <h1>Nhỏ và Nhàn</h1>
          <p>App nhỏ được thiết kế để giúp bạn giải quyết vấn đề nhí.</p>
          <div class="apps-hub-search">
            <label class="search-box" aria-label="Tìm app trong kho apps">
              <span class="search-icon">⌕</span>
              <input id="app-search" type="search" placeholder="Tìm app theo tên, nhóm, slug...">
              <span class="search-shortcut">Ctrl/⌘ K</span>
            </label>
          </div>
          <div class="apps-hub-meta">
            <span class="portal-chip"><strong data-app-count>${apps.length}</strong>&nbsp;apps</span>
            <a class="portal-chip" href="../services/">Services</a>
          </div>
        </div>
      </section>
      <section class="shelves-wrap" id="shelves-wrap">${renderShelves(apps)}</section>
    </main>
  `;
}

export async function initAppsHub(root = '..') {
  const mount = document.querySelector('#page-root');
  if (!mount) return;
  const response = await fetch(`${root}/data/apps.json`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Không tải được data/apps.json');
  const allApps = await response.json();

  const paint = (apps) => {
    mount.innerHTML = renderPage(apps);
    const input = document.querySelector('#app-search');
    input?.focus({ preventScroll: true });
    input?.addEventListener('input', (event) => {
      const q = normalize(event.target.value);
      const filtered = !q ? allApps : allApps.filter((app) => normalize(`${app.title} ${app.subtitle || ''} ${app.slug} ${app.group || ''}`).includes(q));
      paintFiltered(filtered, event.target.value);
    }, { once: true });
  };

  const paintFiltered = (apps, value = '') => {
    mount.innerHTML = renderPage(apps);
    const input = document.querySelector('#app-search');
    if (input) {
      input.value = value;
      input.addEventListener('input', (event) => {
        const q = normalize(event.target.value);
        const filtered = !q ? allApps : allApps.filter((app) => normalize(`${app.title} ${app.subtitle || ''} ${app.slug} ${app.group || ''}`).includes(q));
        paintFiltered(filtered, event.target.value);
      });
    }
    window.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        input?.focus();
      }
    }, { once: true });
  };

  paintFiltered(allApps);
}
