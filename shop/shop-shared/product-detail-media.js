/*
  AI EDIT NOTE:
  - Đọc AGENTS.md + .cursorrules + AI-EDIT-PRECHECK.md trước khi sửa.
  - Không hardcode slug/path/category nếu dữ liệu đã có trong catalog/meta.
  - Nếu sửa clone/routing, kiểm tra: page.meta.json -> shop/data/shop-catalog.json -> href/route -> folder path.
*/
(function(){
  function ensureLightbox(){
    let overlay = document.querySelector('.product-lightbox');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'product-lightbox';
    overlay.innerHTML = `
      <div class="product-lightbox__backdrop" data-lightbox-close></div>
      <div class="product-lightbox__dialog">
        <button class="product-lightbox__nav is-prev" type="button" data-lightbox-prev aria-label="Ảnh trước">‹</button>
        <img class="product-lightbox__image" alt="Product image preview" />
        <button class="product-lightbox__nav is-next" type="button" data-lightbox-next aria-label="Ảnh kế tiếp">›</button>
        <button class="product-lightbox__close" type="button" data-lightbox-close aria-label="Đóng">×</button>
        <div class="product-lightbox__counter"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    const close = () => {
      overlay.classList.remove('is-open');
      document.body.classList.remove('product-lightbox-open');
    };
    overlay.addEventListener('click', (event) => {
      if(event.target.closest('[data-lightbox-close]')) close();
    });
    document.addEventListener('keydown', (event) => {
      if(event.key === 'Escape' && overlay.classList.contains('is-open')) close();
      if(event.key === 'ArrowLeft' && overlay.classList.contains('is-open')) overlay.prev && overlay.prev();
      if(event.key === 'ArrowRight' && overlay.classList.contains('is-open')) overlay.next && overlay.next();
    });
    overlay.addEventListener('wheel', (event) => {
      if(!overlay.classList.contains('is-open')) return;
      event.preventDefault();
      if(Math.abs(event.deltaY) < 4) return;
      if(event.deltaY > 0) overlay.next && overlay.next();
      else overlay.prev && overlay.prev();
    }, { passive: false });
    return overlay;
  }

  function injectStyles(){
    if(document.getElementById('product-lightbox-styles')) return;
    const style = document.createElement('style');
    style.id = 'product-lightbox-styles';
    style.textContent = `
      .fruit-stage.has-product-media{padding:18px}
      .product-media-stage{position:relative;width:100%;height:100%;min-height:420px;border-radius:28px;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center;padding:18px}
      .product-media-stage img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block}
      .product-media-nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:999px;border:1px solid rgba(17,19,21,.12);background:rgba(255,255,255,.92);backdrop-filter:blur(8px);display:inline-flex;align-items:center;justify-content:center;font-size:28px;line-height:1;cursor:pointer;z-index:2;box-shadow:0 10px 24px rgba(16,23,34,.12)}
      .product-media-nav.is-prev{left:14px}.product-media-nav.is-next{right:14px}
      .product-media-stage[data-has-many="false"] .product-media-nav{display:none}
      .product-media-counter{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);padding:6px 10px;border-radius:999px;background:rgba(17,19,21,.76);color:#fff;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;z-index:2}
      .product-media-thumbs{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
      .product-media-thumbs .thumb{padding:0;overflow:hidden;background:#fff;border:1px solid rgba(17,19,21,.08)}
      .product-media-thumbs .thumb img{width:100%;height:100%;object-fit:cover;display:block}
      .product-media-thumbs .thumb.is-active{outline:2px solid #111315;outline-offset:3px}
      .product-lightbox{position:fixed;inset:0;z-index:9999;display:none}
      .product-lightbox.is-open{display:block}
      .product-lightbox__backdrop{position:absolute;inset:0;background:rgba(7,10,8,.82);backdrop-filter:blur(6px)}
      .product-lightbox__dialog{position:relative;z-index:1;width:min(92vw,1200px);height:min(88vh,900px);margin:6vh auto;display:flex;align-items:center;justify-content:center}
      .product-lightbox__image{max-width:100%;max-height:100%;object-fit:contain;border-radius:18px;box-shadow:0 20px 80px rgba(0,0,0,.35);background:#fff}
      .product-lightbox__close,.product-lightbox__nav{position:absolute;width:46px;height:46px;border:0;border-radius:999px;background:#fff;color:#111;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.2)}
      .product-lightbox__close{top:-10px;right:-10px;font-size:30px;line-height:1}
      .product-lightbox__nav{top:50%;transform:translateY(-50%);font-size:34px;line-height:1;display:inline-flex;align-items:center;justify-content:center}
      .product-lightbox__nav.is-prev{left:-58px}.product-lightbox__nav.is-next{right:-58px}
      .product-lightbox__counter{position:absolute;left:50%;bottom:-14px;transform:translateX(-50%);padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.92);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 10px 30px rgba(0,0,0,.12)}
      body.product-lightbox-open{overflow:hidden}
      @media (max-width: 860px){.product-lightbox__nav.is-prev{left:10px}.product-lightbox__nav.is-next{right:10px}.product-lightbox__close{top:10px;right:10px}}
    `;
    document.head.appendChild(style);
  }

  async function init(){
    if(!window.ShopCatalog) return;
    const stage = document.querySelector('.fruit-stage');
    const thumbs = document.querySelector('.thumbs');
    if(!stage || !thumbs) return;
    injectStyles();
    const catalog = await window.ShopCatalog.fetchCatalog();
    const product = window.ShopCatalog.findProductByCurrentPath(catalog.products || []);
    if(!product) return;
    const mainSrc = window.ShopCatalog.resolveImage(product.main_image || product.card_image);
    const extraGallery = (product.gallery || []).map(window.ShopCatalog.resolveImage).filter(Boolean);
    const images = [mainSrc, ...extraGallery.filter(src => src !== mainSrc)];
    const lightbox = ensureLightbox();
    let activeIndex = 0;

    stage.innerHTML = `
      <div class="product-media-stage" data-has-many="${images.length > 1 ? 'true' : 'false'}">
        <button class="product-media-nav is-prev" type="button" aria-label="Ảnh trước">‹</button>
        <img src="${mainSrc}" alt="${window.ShopCatalog.escapeHtml(product.title)}" />
        <button class="product-media-nav is-next" type="button" aria-label="Ảnh kế tiếp">›</button>
        <div class="product-media-counter">1 / ${images.length}</div>
      </div>`;
    stage.classList.add('has-product-media');
    const stageFrame = stage.querySelector('.product-media-stage');
    const stageImg = stage.querySelector('img');
    const counter = stage.querySelector('.product-media-counter');

    function syncThumbState(){
      thumbs.querySelectorAll('[data-gallery-index]').forEach((thumb, idx) => {
        thumb.classList.toggle('is-active', idx + 1 === activeIndex);
      });
    }

    function updateImage(index, fromThumb){
      activeIndex = (index + images.length) % images.length;
      stageImg.src = images[activeIndex];
      stageImg.alt = `${product.title} ${activeIndex + 1}`;
      counter.textContent = `${activeIndex + 1} / ${images.length}`;
      syncThumbState();
      if(fromThumb) lightbox.openWith(images[activeIndex], stageImg.alt, activeIndex);
    }

    function next(){ updateImage(activeIndex + 1); }
    function prev(){ updateImage(activeIndex - 1); }

    lightbox.images = images;
    lightbox.currentIndex = 0;
    lightbox.openWith = (src, alt, index) => {
      const img = lightbox.querySelector('.product-lightbox__image');
      const counterEl = lightbox.querySelector('.product-lightbox__counter');
      lightbox.currentIndex = typeof index === 'number' ? index : Math.max(0, images.indexOf(src));
      img.src = src;
      img.alt = alt || '';
      counterEl.textContent = `${lightbox.currentIndex + 1} / ${images.length}`;
      lightbox.classList.add('is-open');
      document.body.classList.add('product-lightbox-open');
    };
    lightbox.next = () => {
      const nextIndex = (lightbox.currentIndex + 1) % images.length;
      lightbox.openWith(images[nextIndex], `${product.title} ${nextIndex + 1}`, nextIndex);
    };
    lightbox.prev = () => {
      const prevIndex = (lightbox.currentIndex - 1 + images.length) % images.length;
      lightbox.openWith(images[prevIndex], `${product.title} ${prevIndex + 1}`, prevIndex);
    };
    lightbox.querySelector('[data-lightbox-next]').addEventListener('click', lightbox.next);
    lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', lightbox.prev);

    stage.addEventListener('click', (event) => {
      if(event.target.closest('.product-media-nav')) return;
      lightbox.openWith(images[activeIndex], `${product.title} ${activeIndex + 1}`, activeIndex);
    });
    stageFrame.querySelector('.product-media-nav.is-next').addEventListener('click', next);
    stageFrame.querySelector('.product-media-nav.is-prev').addEventListener('click', prev);
    stage.addEventListener('wheel', (event) => {
      if(images.length <= 1) return;
      event.preventDefault();
      if(Math.abs(event.deltaY) < 4) return;
      if(event.deltaY > 0) next(); else prev();
    }, { passive: false });

    if(!extraGallery.length){
      thumbs.innerHTML = '';
      thumbs.style.display = 'none';
      return;
    }

    thumbs.innerHTML = extraGallery.map((src, index) => `
      <button class="thumb ${index === 0 && activeIndex === 1 ? 'is-active' : ''}" type="button" data-gallery-index="${index}" aria-label="Ảnh phụ ${index + 1}">
        <img src="${src}" alt="${window.ShopCatalog.escapeHtml(product.title)} ${index + 2}" />
      </button>
    `).join('');
    thumbs.classList.add('product-media-thumbs');

    thumbs.addEventListener('click', (event) => {
      const button = event.target.closest('[data-gallery-index]');
      if(!button) return;
      const index = Number(button.dataset.galleryIndex || 0) + 1;
      updateImage(index, true);
    });
    thumbs.addEventListener('wheel', (event) => {
      if(images.length <= 1) return;
      event.preventDefault();
      if(Math.abs(event.deltaY) < 4) return;
      if(event.deltaY > 0) next(); else prev();
    }, { passive: false });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
