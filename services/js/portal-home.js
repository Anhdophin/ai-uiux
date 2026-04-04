import { rootPath, setupSharedShell } from './modules.js';

function card(title, body, href, tone = '') {
  return `<a class="portal-card ${tone}" href="${href}"><h3>${title}</h3><p>${body}</p><span>Xem thêm</span></a>`;
}

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
  const featuredApps = apps.slice(0, 6);
  const featuredTools = tools.slice(0, 4);
  document.querySelector('#page-root').innerHTML = `
    <main class="portal-page portal-home-page">
      <section class="portal-hero container">
        <div class="portal-hero__copy">
          <p class="portal-eyebrow">ai-uiux.com</p>
          <h1>iAppLab là cổng vào cho app, service, và shop.</h1>
          <p class="portal-lead">Người dùng business có thể vào dùng app trước, rồi đi tiếp sang service để tìm hiểu dịch vụ thiết kế mini app, hoặc qua shop để xem các sản phẩm đi kèm.</p>
          <div class="portal-actions">
            <a class="portal-cta" href="${root}/apps/">Open Apps</a>
            <a class="portal-chip" href="${root}/services/">Xem Service</a>
            <a class="portal-chip" href="${root}/shop/">Xem Shop</a>
          </div>
        </div>
        <div class="portal-hero__panel">
          <div class="portal-stat"><strong>${apps.length}</strong><span>App đang có</span></div>
          <div class="portal-stat"><strong>${tools.length}</strong><span>Micro tool hỗ trợ</span></div>
          <div class="portal-stat"><strong>1 portal</strong><span>Cho business khám phá</span></div>
        </div>
      </section>
      <section class="container portal-section">
        <div class="portal-section__head">
          <div><p class="portal-eyebrow">Flow mới</p><h2>Đi từ app sang dịch vụ và shop</h2></div>
        </div>
        <div class="portal-card-grid">
          ${card('Apps', 'Bộ sưu tập app và micro tool để dùng thử hoặc mở nhanh.', `${root}/apps/`, 'tone-app')}
          ${card('Service', 'Trang dịch vụ để chuyển output từ app thành workflow, tài liệu hoặc mini app.', `${root}/services/`, 'tone-service')}
          ${card('Shop', 'Kênh sản phẩm đi kèm hoạt động ngang hàng với service và apps.', `${root}/shop/`, 'tone-shop')}
        </div>
      </section>
      <section class="container portal-section">
        <div class="portal-section__head"><div><p class="portal-eyebrow">Featured Apps</p><h2>App chính của iAppLab</h2></div><a class="portal-text-link" href="${root}/apps/">Xem toàn bộ apps</a></div>
        <div class="portal-app-grid">${featuredApps.map((item) => appCard(item, root)).join('')}</div>
      </section>
      <section class="container portal-section portal-section--compact">
        <div class="portal-section__head"><div><p class="portal-eyebrow">Micro Tools</p><h2>App mở nhanh cho business maker</h2></div></div>
        <div class="portal-app-grid">${featuredTools.map((item) => appCard(item, root)).join('')}</div>
      </section>
    </main>`;
}
setupHome();
