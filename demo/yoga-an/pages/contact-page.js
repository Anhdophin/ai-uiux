import { contactContent } from '../content/contact-content.js';
import { initSiteShell } from '../shared/site-shell.js';
import { siteContent } from '../content/site-content.js';
import { renderContactHero, renderContactSupport, renderContactForm } from '../features/contact-sections.js';
import { initContactForm } from '../features/contact-form.js';

const mountPage = () => {
  initSiteShell();

  const pageRoot = document.querySelector('[data-page-root]');
  if (!pageRoot) {
    return;
  }

  pageRoot.innerHTML = [
    renderContactHero(contactContent.hero),
    renderContactSupport(contactContent.support),
    renderContactForm(siteContent.contact, contactContent.schedule),
  ].join('');

  initContactForm();
};

document.addEventListener('DOMContentLoaded', mountPage);
