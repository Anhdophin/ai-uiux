import { rootPath, setupSharedShell } from '../js/modules.js';

function appCard(item, root) {
  const href = item.path ? `${root}/${item.path}`.replace(/\/+/g, '/').replace(/^\.\//, './') : '#';
  const icon = item.icon ? `${root}/${item.icon}`.replace(/\/+/g, '/').replace(/^\.\//, './') : '';
  return `<a class="portal-app-card portal-app-card--wide" href="${href}"><div class="portal-app-card__icon">${icon ? `<img src="${icon}" alt="${item.title}">` : ''}</div><div><strong>${item.title}</strong><p>${item.subtitle || ''}</p></div></a>`;
}

async function setupAppsPage() {
  const root = rootPath();
  await setupSharedShell(root);
  const [appsRes, toolsRes] = await Promise.all([
    fetch(`${root}/data/apps.json`, { cache: 'no-store' }),
    fetch(`${root}/data/micro-tools.json`, { cache: 'no-store' }),
  ]);
  const apps = await appsRes.json();
  const tools = await toolsRes.json();
  document.querySelector('#page-root').innerHTML = `
    <main class="portal-page portal-apps-page">
      <section class="container portal-section portal-section--first">
        <div class="portal-section__head"><div><p class="portal-eyebrow">Apps Collection</p><h1>Bộ sưu tập apps của iAppLab</h1><p class="portal-lead portal-lead--sm">Trang này gom app ở root và micro tools từ service để người dùng business xem một mạch.</p></div></div>
        <div class="portal-app-grid">${apps.map((item) => appCard(item, root)).join('')}</div>
      </section>
      <section class="container portal-section">
        <div class="portal-section__head"><div><p class="portal-eyebrow">Micro Tools</p><h2>Nhóm tool nhỏ lấy từ service</h2></div></div>
        <div class="portal-app-grid">${tools.map((item) => appCard(item, root)).join('')}</div>
      </section>
    </main>`;
}
setupAppsPage();
