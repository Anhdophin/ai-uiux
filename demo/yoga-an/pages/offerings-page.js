import { offeringsContent } from '../content/offerings-content.js';
import { initSiteShell } from '../shared/site-shell.js';
import { renderOfferingsHero, renderProgramGrid, renderProcess, renderFaq } from '../features/offerings-sections.js';

const mountPage = () => {
  initSiteShell();

  const pageRoot = document.querySelector('[data-page-root]');
  if (!pageRoot) {
    return;
  }

  pageRoot.innerHTML = [
    renderOfferingsHero(offeringsContent.hero),
    renderProgramGrid(offeringsContent.programs),
    renderProcess(offeringsContent.process),
    renderFaq(offeringsContent.faq),
  ].join('');
};

document.addEventListener('DOMContentLoaded', mountPage);
