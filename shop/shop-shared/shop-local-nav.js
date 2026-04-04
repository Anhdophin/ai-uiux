(function(){
  function toTitle(value){ return String(value || '').replace(/[-_]+/g,' ').trim(); }
  function escapeHtml(value){ return String(value || '').replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }
  function init(){
    var header = document.getElementById('subpage-header');
    if(!header || document.querySelector('.shop-local-nav-wrap')) return;
    var parts = window.location.pathname.split('/').filter(Boolean);
    var shopIndex = parts.indexOf('shop');
    if(shopIndex === -1) return;
    var basePrefix = (window.ShopCatalog && window.ShopCatalog.getBasePrefix) ? window.ShopCatalog.getBasePrefix() : './';
    var links = [
      { href: basePrefix, label: 'Shop', key: 'shop-root' },
      { href: basePrefix + 'all/', label: 'All', key: 'shop-all' }
    ];
    if(parts[shopIndex + 1] && parts[shopIndex + 1] !== 'all'){
      var categorySlug = parts[shopIndex + 1];
      links.push({ href: basePrefix + categorySlug + '/', label: toTitle(categorySlug), key: 'cat-' + categorySlug });
    }
    if(parts.length > shopIndex + 2){
      links.push({ href: window.location.pathname, label: document.title || toTitle(parts[parts.length - 1]), key: 'current' });
    }
    var current = window.location.pathname.replace(/index\.html$/, '').replace(/\/+$|$/,'/');
    var html = '<div class="shop-local-nav-wrap"><nav class="shop-local-nav" aria-label="Shop navigation">';
    links.forEach(function(link, index){
      var normalized = String(link.href || '').replace(/index\.html$/, '').replace(/\/+$|$/,'/');
      var active = normalized === current && link.key !== 'current';
      html += '<a href="' + escapeHtml(link.href) + '" class="' + (active ? 'is-active' : '') + '">' + escapeHtml(link.label) + '</a>';
      if(index < links.length - 1){ html += '<span class="shop-local-nav__sep">/</span>'; }
    });
    html += '</nav></div>';
    header.insertAdjacentHTML('afterend', html);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
