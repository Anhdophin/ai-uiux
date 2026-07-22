const STYLE_ID = 'auto-page-background-style';
const LAYER_ID = 'auto-page-background-layer';

function normalizeRoot(root = '.') {
  if (!root || root === './') return '.';
  return root.replace(/\/+$/, '') || '.';
}

function toAssetPrefix(root = '.') {
  const normalized = normalizeRoot(root);
  return normalized === '.' ? './assets/pages-background' : `${normalized}/assets/pages-background`;
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    body.has-auto-page-background {
      background-color: #0d1117;
    }

    #${LAYER_ID} {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: -2;
      overflow: hidden;
    }

    #${LAYER_ID} .auto-page-background__image,
    #${LAYER_ID} .auto-page-background__blur {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: top center;
      transform: translate3d(0, 0, 0);
      will-change: transform;
    }

    #${LAYER_ID} .auto-page-background__image {
      opacity: 0.42;
    }

    #${LAYER_ID} .auto-page-background__blur {
      top: auto;
      bottom: 0;
      height: 25%;
      filter: blur(12px);
      opacity: 0.6;
      transform-origin: bottom center;
    }

    #${LAYER_ID} .auto-page-background__veil {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 28%;
      background: linear-gradient(to bottom, rgba(13, 17, 23, 0), rgba(13, 17, 23, 0.82));
    }

    @media (max-width: 768px) {
      #${LAYER_ID} .auto-page-background__image {
        opacity: 0.36;
      }

      #${LAYER_ID} .auto-page-background__blur {
        opacity: 0.52;
        filter: blur(10px);
      }
    }
  `;
  document.head.appendChild(style);
}

function imageExists(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
}

async function resolveBackgroundUrl(basePath) {
  const extensions = ['.webp', '.jpg', '.jpeg', '.png'];
  for (const extension of extensions) {
    const candidate = `${basePath}${extension}`;
    if (await imageExists(candidate)) return candidate;
  }
  return null;
}

function createLayer(imageUrl) {
  const existing = document.getElementById(LAYER_ID);
  if (existing) existing.remove();

  const layer = document.createElement('div');
  layer.id = LAYER_ID;
  layer.setAttribute('aria-hidden', 'true');

  const bgImage = document.createElement('div');
  bgImage.className = 'auto-page-background__image';
  bgImage.style.backgroundImage = `url("${imageUrl}")`;

  const bgBlur = document.createElement('div');
  bgBlur.className = 'auto-page-background__blur';
  bgBlur.style.backgroundImage = `url("${imageUrl}")`;

  const bgVeil = document.createElement('div');
  bgVeil.className = 'auto-page-background__veil';

  layer.append(bgImage, bgBlur, bgVeil);
  document.body.prepend(layer);

  return { bgImage, bgBlur };
}

function initParallax(imageElement, blurElement) {
  let ticking = false;

  const apply = () => {
    const offset = Math.min(window.scrollY * 0.18, 120);
    imageElement.style.transform = `translate3d(0, ${offset}px, 0)`;
    blurElement.style.transform = `translate3d(0, ${offset * 0.45}px, 0)`;
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(apply);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  apply();
}

function toFileName(title) {
  return encodeURIComponent((title || '').trim());
}

export async function initPageBackground(root = '.') {
  const title = document.title || '';
  const fileName = toFileName(title);
  if (!fileName) return;

  const assetPrefix = toAssetPrefix(root);
  const backgroundPath = `${assetPrefix}/${fileName}`;
  const backgroundUrl = await resolveBackgroundUrl(backgroundPath);
  if (!backgroundUrl) return;

  ensureStyles();
  document.body.classList.add('has-auto-page-background');
  const { bgImage, bgBlur } = createLayer(backgroundUrl);
  initParallax(bgImage, bgBlur);
}
