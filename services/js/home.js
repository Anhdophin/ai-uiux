function createCard(app) {
  return `
    <a class="app-card" href="${app.path}" aria-label="${app.title}">
      <div class="app-meta">
        <div class="app-title">${app.title}</div>
        <div class="app-subtitle">${app.subtitle || ''}</div>
      </div>
      <div class="app-icon"><img src="${app.icon}" alt="${app.title}"></div>
      <div class="app-badge">${app.title}</div>
      <div class="app-reflection" aria-hidden="true"></div>
    </a>
  `;
}

function floatingIcons(apps) {
  const picks = [apps[1], apps[9], apps[14], apps[7], apps[0], apps[11]].filter(Boolean);
  return picks.map((app, index) => `<img class="floating-icon floating-${index + 1}" src="${app.icon}" alt="" aria-hidden="true">`).join('');
}

function groupShelves(apps) {
  const map = new Map();
  apps.forEach((app) => {
    const key = app.shelf || 1;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(app);
  });
  return [...map.entries()].sort((a,b) => a[0]-b[0]);
}

function renderShelves(apps) {
  const shelves = groupShelves(apps);
  if (!apps.length) {
    return `<div class="empty-state">Chưa có mini app nào khớp với từ khóa tìm kiếm.</div>`;
  }
  return shelves.map(([shelf, list]) => `
    <section class="shelf-section" data-shelf="${shelf}">
      <div class="shelf-track">${list.map(createCard).join('')}</div>
      <div class="shelf-base" aria-hidden="true"></div>
    </section>
  `).join('');
}

export function renderHome(apps) {
  return `
    <div class="page-home">
      <section class="hero container">
        <div class="hero-floating">${floatingIcons(apps)}</div>
        <div class="hero-inner">
          <h1>Công cụ hỗ trợ công việc,<br>giúp anh mở app thật nhanh</h1>
          <div class="hero-subscribe">
            <input type="email" placeholder="Enter your email" aria-label="Email">
            <button type="button">Subscribe</button>
          </div>
          <div class="hero-meta">${apps.length} mini apps đã sẵn chỗ trên trang chủ</div>
        </div>
      </section>
      <section class="shelves-wrap" id="shelves-wrap">${renderShelves(apps)}</section>
    </div>
  `;
}

export function bindSearch(allApps) {
  const input = document.querySelector('#app-search');
  const root = document.querySelector('#page-root');
  const count = document.querySelector('[data-app-count]');
  if (!input || !root) return;

  const paint = (apps) => {
    root.innerHTML = renderHome(apps);
    if (count) count.textContent = String(apps.length);
  };

  paint(allApps);

  input.addEventListener('input', (event) => {
    const q = event.target.value.trim().toLowerCase();
    const filtered = allApps.filter((app) => {
      const hay = `${app.title} ${app.subtitle || ''} ${app.slug}`.toLowerCase();
      return hay.includes(q);
    });
    paint(filtered);
  });

  window.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      input.focus();
    }
  });
}
