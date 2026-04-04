async function fetchJson(path){
  const res = await fetch(path, {cache:'no-store'});
  if(!res.ok) throw new Error(`Cannot load ${path}`);
  return res.json();
}

function renderCatalogCards(items, root){
  if(!root) return;
  if(!Array.isArray(items) || !items.length){
    root.innerHTML = '<div class="catalog-empty">Chưa có nội dung mẫu.</div>';
    return;
  }
  root.innerHTML = items.map(item => `
    <article class="catalog-card">
      <div class="catalog-thumb">${item.cover ? `<img src="${item.cover}" alt="${item.title}">` : ''}</div>
      <div class="catalog-card-body">
        <div class="catalog-meta">
          <span class="catalog-chip">${item.tag || 'Item'}</span>
          <span>${item.meta || ''}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.excerpt || ''}</p>
        <div class="catalog-actions">
          <a class="site-link-btn" href="${item.href}">Mở trang</a>
          ${item.secondaryHref ? `<a class="site-outline-btn" href="${item.secondaryHref}">Xem thêm</a>` : ''}
        </div>
      </div>
    </article>
  `).join('');
}

async function initCatalogPage(){
  const page = document.querySelector('[data-catalog-json]');
  if(!page) return;
  const data = await fetchJson(page.dataset.catalogJson);
  document.title = data.seoTitle || data.hero.title;
  const set = (id, value)=>{ const el = document.getElementById(id); if(el && value != null) el.textContent = value; };
  set('catalogLabel', data.hero.label);
  set('catalogTitle', data.hero.title);
  set('catalogSubtitle', data.hero.subtitle);
  set('catalogSectionTitle', data.sectionTitle || 'Danh mục');
  set('catalogSectionBody', data.sectionBody || '');
  const stats = document.getElementById('catalogStats');
  if(stats){ stats.innerHTML = (data.stats || []).map(s=>`<div class="catalog-stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join(''); }
  renderCatalogCards(data.items || [], document.getElementById('catalogGrid'));
}

async function initDetailPage(){
  const page = document.querySelector('[data-detail-json]');
  if(!page) return;
  const data = await fetchJson(page.dataset.detailJson);
  document.title = data.seoTitle || data.title;
  const setHtml = (id, value)=>{ const el = document.getElementById(id); if(el && value != null) el.innerHTML = value; };
  const setTxt = (id, value)=>{ const el = document.getElementById(id); if(el && value != null) el.textContent = value; };
  setTxt('detailLabel', data.label);
  setTxt('detailTitle', data.title);
  setTxt('detailSubtitle', data.subtitle);
  const cover = document.getElementById('detailCoverImage');
  if(cover && data.cover) cover.src = data.cover;
  setHtml('detailIntro', data.intro || '');
  const sections = document.getElementById('detailSections');
  if(sections){
    sections.innerHTML = (data.sections || []).map(sec=>`<section><h2>${sec.title}</h2>${(sec.paragraphs||[]).map(p=>`<p>${p}</p>`).join('')}${sec.list?.length?`<ul>${sec.list.map(i=>`<li>${i}</li>`).join('')}</ul>`:''}</section>`).join('');
  }
  const info = document.getElementById('detailFacts');
  if(info){
    info.innerHTML = (data.facts || []).map(f=>`<div class="detail-kv-row"><strong>${f.label}</strong><span>${f.value}</span></div>`).join('');
  }
  const ctas = document.getElementById('detailCtas');
  if(ctas){
    ctas.innerHTML = (data.ctas || []).map((c,idx)=>`<a class="${idx===0?'site-link-btn':'site-outline-btn'}" href="${c.href}">${c.label}</a>`).join('');
  }
  setTxt('detailSidebarTitle', data.sidebarTitle || 'Thông tin');
  setHtml('detailSidebarBody', data.sidebarBody || '');
}

document.addEventListener('DOMContentLoaded', ()=>{
  initCatalogPage().catch(console.error);
  initDetailPage().catch(console.error);
});
