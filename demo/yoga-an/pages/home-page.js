import { homeContent } from '../content/home-content.js';
import { initSiteShell } from '../shared/site-shell.js';
import { renderHomeHero, renderHomeStats, renderHomeServices, renderHomeSupport } from '../features/home-sections.js';

const mountPage = () => {
  initSiteShell();

  const pageRoot = document.querySelector('[data-page-root]');
  if (!pageRoot) {
    return;
  }

  pageRoot.innerHTML = [
    renderHomeHero(homeContent.hero),
    renderHomeStats(homeContent.intro),
    renderHomeServices(homeContent.services),
    renderHomeSupport(homeContent.supportList),
  ].join('');
};

document.addEventListener('DOMContentLoaded', mountPage);
