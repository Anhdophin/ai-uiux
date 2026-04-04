/*
  AI EDIT NOTE:
  - Đọc AGENTS.md + .cursorrules + AI-EDIT-PRECHECK.md trước khi sửa.
  - Không hardcode slug/path/category nếu dữ liệu đã có trong catalog/meta.
  - Nếu sửa clone/routing, kiểm tra: page.meta.json -> shop/data/shop-catalog.json -> href/route -> folder path.
*/
(function(){
  const ShopCatalog = {};
  ShopCatalog.getBasePrefix = function(){
    const parts = window.location.pathname.split('/').filter(Boolean);
    const idx = parts.indexOf('shop');
    if (idx === -1) return './';
    const depth = parts.length - idx - 1;
    return depth <= 0 ? './' : '../'.repeat(depth);
  };
  ShopCatalog.catalogUrl = function(){ return ShopCatalog.getBasePrefix() + 'data/shop-catalog.json'; };
  ShopCatalog.fetchCatalog = async function(){ const res = await fetch(ShopCatalog.catalogUrl(), {cache:'no-store'}); if(!res.ok) throw new Error('Cannot load shop catalog'); return res.json(); };
  ShopCatalog.escapeHtml = function(value){ return String(value || '').replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); };
  ShopCatalog.toLocalUrl = function(path){
    if(!path) return '#';
    if(/^https?:\/\//i.test(path)) return path;
    if(path.startsWith('/shop/')) return ShopCatalog.getBasePrefix() + path.replace(/^\/shop\//, '');
    return path;
  };
  ShopCatalog.resolveImage = function(path){
    return ShopCatalog.toLocalUrl(path || '/shop/shop-shared/placeholder-product.svg');
  };
  ShopCatalog.renderCategoryCards = function(categories){ return categories.map(cat => `
      <a class="shop-card mini-card auto-category-card" href="${ShopCatalog.toLocalUrl(cat.route)}">
        <div class="media">${cat.image ? `<img class=\"auto-category-image\" src=\"${ShopCatalog.resolveImage(cat.image)}\" alt=\"${ShopCatalog.escapeHtml(cat.title)}\" loading=\"lazy\" />` : `<span class=\"auto-orb\" style=\"--cat-accent:${ShopCatalog.escapeHtml(cat.accent || '#7cb6de')}\"></span>`}</div>
        <div><h4>${ShopCatalog.escapeHtml(cat.title)}</h4><p>${ShopCatalog.escapeHtml(cat.card_caption || `${cat.product_count} sản phẩm`)}</p></div>
      </a>
    `).join(''); };
  ShopCatalog.renderSidebarCategories = function(categories){ return categories.map(cat => `
      <a class="category-item" href="${ShopCatalog.toLocalUrl(cat.route)}">
        <span class="category-thumb" style="--cat-accent:${ShopCatalog.escapeHtml(cat.accent || '#7cb6de')}">${cat.image ? `<img class=\"category-thumb-image\" src=\"${ShopCatalog.resolveImage(cat.image)}\" alt=\"${ShopCatalog.escapeHtml(cat.title)}\" loading=\"lazy\" />` : ''}</span>
        <div><h4>${ShopCatalog.escapeHtml(cat.title)}</h4><p>${ShopCatalog.escapeHtml(cat.product_count)} sản phẩm</p></div>
        <span class="icon-arrow">↗</span>
      </a>
    `).join(''); };
  ShopCatalog.renderProductCards = function(products){ return products.map(product => `
      <a class="product-item" href="${ShopCatalog.toLocalUrl(product.route)}" data-tags="${ShopCatalog.escapeHtml((product.experience_tags || []).join('|'))}" data-category="${ShopCatalog.escapeHtml(product.category_slug || '')}">
        <span class="product-thumb">
          <img class="product-thumb-image" src="${ShopCatalog.resolveImage(product.card_image || product.main_image)}" alt="${ShopCatalog.escapeHtml(product.title)}" loading="lazy" />
        </span>
        <div class="product-copy"><h4>${ShopCatalog.escapeHtml(product.short_title || product.title)}</h4><p>${ShopCatalog.escapeHtml(product.category_title || '')}${product.experience_tags && product.experience_tags[0] ? ' · ' + ShopCatalog.escapeHtml(product.experience_tags[0]) : ''}</p></div>
        <div class="price">${ShopCatalog.escapeHtml(product.price || 'Liên hệ')}</div>
      </a>
    `).join(''); };
  ShopCatalog.renderExperienceChips = function(tags, activeTag){ const first = `<button class="chip ${activeTag === 'all' ? 'is-active' : ''}" data-filter="all" type="button">All</button>`; const others = tags.map(tag => `<button class="chip ${activeTag === tag ? 'is-active' : ''}" data-filter="${ShopCatalog.escapeHtml(tag)}" type="button">${ShopCatalog.escapeHtml(tag)}</button>`).join(''); return first + others; };
  ShopCatalog.groupProductsByCategory = function(products, categories){
    const map = new Map();
    (categories || []).forEach(cat => map.set(cat.slug, { label: cat.title, key: cat.slug, products: [] }));
    (products || []).forEach(product => {
      const key = product.category_slug || 'uncategorized';
      if(!map.has(key)) map.set(key, { label: product.category_title || key, key, products: [] });
      map.get(key).products.push(product);
    });
    return Array.from(map.values()).filter(group => group.products.length);
  };
  ShopCatalog.renderProductTabs = function(products, categories, options){
    const opts = Object.assign({ includeLatest: true, latestLabel: 'Mới cập nhật', latestLimit: 8, includeAll: false, allLabel: 'All products' }, options || {});
    const groups = [];
    if(opts.includeLatest){ groups.push({ key:'latest', label:opts.latestLabel, products:(products || []).slice(0, opts.latestLimit) }); }
    if(opts.includeAll){ groups.push({ key:'all', label:opts.allLabel, products:(products || []) }); }
    ShopCatalog.groupProductsByCategory(products, categories).forEach(group => groups.push(group));
    const filteredGroups = groups.filter(group => (group.products || []).length);
    if(!filteredGroups.length) return '<div class="empty-state">Chưa có sản phẩm.</div>';
    const tabButtons = filteredGroups.map((group, index) => `<button class="product-tab ${index === 0 ? 'is-active' : ''}" type="button" data-tab="${ShopCatalog.escapeHtml(group.key)}">${ShopCatalog.escapeHtml(group.label)} <span>${group.products.length}</span></button>`).join('');
    const panels = filteredGroups.map((group, index) => `<div class="product-tab-panel ${index === 0 ? 'is-active' : ''}" data-panel="${ShopCatalog.escapeHtml(group.key)}"><div class="product-grid">${ShopCatalog.renderProductCards(group.products)}</div></div>`).join('');
    return `<div class="product-tabs-wrap"><div class="product-tabs" role="tablist">${tabButtons}</div><div class="product-panels">${panels}</div></div>`;
  };
  ShopCatalog.bindFilter = function(filterWrap, scope){
    if(!filterWrap || !scope) return;
    filterWrap.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if(!button) return;
      const filter = button.dataset.filter;
      filterWrap.querySelectorAll('.chip').forEach(chip => chip.classList.toggle('is-active', chip === button));
      scope.querySelectorAll('[data-tags]').forEach(item => {
        const tags = (item.dataset.tags || '').split('|').filter(Boolean);
        item.style.display = (filter === 'all' || tags.includes(filter)) ? '' : 'none';
      });
      scope.querySelectorAll('.product-tab-panel').forEach(panel => {
        const visibleCount = Array.from(panel.querySelectorAll('.product-item')).filter(item => item.style.display !== 'none').length;
        panel.classList.toggle('is-empty', visibleCount === 0);
      });
    });
  };
  ShopCatalog.bindTabs = function(container){
    if(!container) return;
    container.addEventListener('click', (event) => {
      const button = event.target.closest('[data-tab]');
      if(!button) return;
      const key = button.dataset.tab;
      container.querySelectorAll('[data-tab]').forEach(tab => tab.classList.toggle('is-active', tab === button));
      container.querySelectorAll('[data-panel]').forEach(panel => panel.classList.toggle('is-active', panel.dataset.panel === key));
    });
  };
  ShopCatalog.findProductByCurrentPath = function(products){
    const current = window.location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '/');
    return (products || []).find(product => String(product.route || '').replace(/\/+$/, '/') === current);
  };
  window.ShopCatalog = ShopCatalog;
})();
