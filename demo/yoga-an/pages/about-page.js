import { aboutContent } from '../content/about-content.js';
import { initSiteShell } from '../shared/site-shell.js';
import { renderAboutHero, renderStoryCards, renderAboutValues, renderTestimonials } from '../features/about-sections.js';

const mountPage = () => {
  initSiteShell();

  const pageRoot = document.querySelector('[data-page-root]');
  if (!pageRoot) {
    return;
  }

  pageRoot.innerHTML = [
    renderAboutHero(aboutContent.hero),
    renderStoryCards(aboutContent.storyCards),
    renderAboutValues(aboutContent.values),
    renderTestimonials(aboutContent.testimonials),
  ].join('');
};

document.addEventListener('DOMContentLoaded', mountPage);
