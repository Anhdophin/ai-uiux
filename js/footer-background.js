const FOOTER_BG_STYLE_PROP = '--footer-bg-image';
const FOOTER_BG_INTERVAL_MS = 30000;

function normalizeRoot(root = '.') {
  if (!root || root === './') return '.';
  return root.replace(/\/+$/, '') || '.';
}

function toFooterAssetPrefix(root = '.') {
  const normalized = normalizeRoot(root);
  return normalized === '.' ? './assets/footer-background' : `${normalized}/assets/footer-background`;
}

function buildCandidates(basePath) {
  const extensions = ['.webp', '.jpg', '.jpeg', '.png', '.svg'];
  return extensions.map((extension) => `${basePath}${extension}`);
}

function imageExists(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
}

async function resolveExistingImages(prefix) {
  const baseNames = ['01', '02', '03'];
  const existing = [];

  for (const baseName of baseNames) {
    const candidates = buildCandidates(`${prefix}/${baseName}`);
    for (const candidate of candidates) {
      if (await imageExists(candidate)) {
        existing.push(candidate);
        break;
      }
    }
  }

  return existing;
}

function applyFooterImage(footerElement, imageUrl) {
  footerElement.style.setProperty(FOOTER_BG_STYLE_PROP, `url("${imageUrl}")`);
}

export async function initFooterBackground(root = '.') {
  const footerElement = document.querySelector('.portal-footer');
  if (!footerElement) return;
  if (footerElement.dataset.footerBgInit === '1') return;

  const assetPrefix = toFooterAssetPrefix(root);
  const images = await resolveExistingImages(assetPrefix);
  if (!images.length) return;

  let currentIndex = 0;
  applyFooterImage(footerElement, images[currentIndex]);

  if (images.length > 1) {
    window.setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      applyFooterImage(footerElement, images[currentIndex]);
    }, FOOTER_BG_INTERVAL_MS);
  }

  footerElement.dataset.footerBgInit = '1';
}
