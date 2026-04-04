import { rootPath, setupSharedShell } from './modules.js';

function appCard(item, root) {
  const href = item.path ? `${root}/${item.path}`.replace(/\/+/g, '/').replace(/^\.\//, './') : '#';
  const icon = item.icon ? `${root}/${item.icon}`.replace(/\/+/g, '/').replace(/^\.\//, './') : '';
  return `<a class="portal-app-card" href="${href}"><div class="portal-app-card__icon">${icon ? `<img src="${icon}" alt="${item.title}">` : ''}</div><div><strong>${item.title}</strong><p>${item.subtitle || ''}</p></div></a>`;
}

async function setupHome() {
  const root = rootPath();
  await setupSharedShell(root);
  const [appsRes, toolsRes] = await Promise.all([
    fetch(`${root}/data/apps.json`, { cache: 'no-store' }),
    fetch(`${root}/data/micro-tools.json`, { cache: 'no-store' }),
  ]);
  const apps = await appsRes.json();
  const tools = await toolsRes.json();
  const featuredApps = apps.slice(0, 4);
  const featuredTools = tools.slice(0, 4);
  document.querySelector('#page-root').innerHTML = `
    <main class="portal-page portal-home-page">
      <section class="portal-hero container">
        <div class="portal-hero__copy">
          <p class="portal-eyebrow">ai-uiux.com</p>
          <h1>Small App <br>For Small Business.</h1>
          <p class="portal-lead">Các ứng dụng hữu ích cho doanh nghiệp và cá nhân khởi nghiệp chuyên môn.</p>
          
        </div>
        
      </section>
      <section class="container portal-section">
        <div class="portal-section__head"><div><p class="portal-eyebrow">Featured Apps</p><h2>4 app mới nhất của iAppLab</h2></div><a class="portal-text-link" href="${root}/apps/">Xem toàn bộ apps</a></div>
        <div class="portal-app-grid">${featuredApps.map((item) => appCard(item, root)).join('')}</div>
      </section>
      <section class="container portal-section portal-section--compact">
        <div class="portal-section__head"><div><p class="portal-eyebrow">Quick Access</p><h2>Nhóm app và tool mở nhanh</h2></div></div>
        <div class="portal-app-grid">${featuredTools.map((item) => appCard(item, root)).join('')}</div>
      </section>
    </main>`;
}
setupHome();
