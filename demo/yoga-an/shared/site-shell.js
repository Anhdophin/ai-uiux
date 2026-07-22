import { siteContent } from '../content/site-content.js';

const buildNavLinks = (currentPage) =>
  siteContent.navigation
    .map(
      (item) => `
        <a class="site-nav__link" href="${item.href}" ${currentPage === item.href ? 'aria-current="page"' : ''}>${item.label}</a>
      `,
    )
    .join('');

export const renderSiteHeader = (currentPage) => `
  <header class="site-header" data-menu-open="false">
    <div class="container site-header__inner">
      <a class="site-brand" href="index.html" aria-label="${siteContent.brand.name}">
        <span class="site-brand__mark">${siteContent.brand.mark}</span>
        <span>
          <strong>${siteContent.brand.name}</strong><br />
          <span class="section-copy">${siteContent.brand.tagline}</span>
        </span>
      </a>
      <div class="site-header__actions">
        <button class="mobile-menu-button" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle>
          <span aria-hidden="true">☰</span>
          <span class="sr-only">Mở menu</span>
        </button>
      </div>
      <nav id="site-nav" class="site-nav" aria-label="Điều hướng chính">
        ${buildNavLinks(currentPage)}
        <a class="button button-primary" href="contact.html">Đặt lịch</a>
      </nav>
    </div>
  </header>
`;

export const renderSiteFooter = () => `
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div>
        <div class="site-brand">
          <span class="site-brand__mark">${siteContent.brand.mark}</span>
          <span>${siteContent.brand.name}</span>
        </div>
        <p class="section-copy" style="margin-top: 0.75rem; max-width: 28rem;">${siteContent.contact.city} · ${siteContent.contact.responseTime}</p>
      </div>
      <div class="site-footer__links" aria-label="Liên kết chân trang">
        ${siteContent.footerLinks.map((item) => `<a href="${item.href}">${item.label}</a>`).join('')}
        <a href="mailto:${siteContent.contact.email}">${siteContent.contact.email}</a>
      </div>
    </div>
  </footer>
`;

export const initSiteShell = () => {
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');
  const currentPage = document.body.dataset.page || 'index.html';

  if (header) {
    header.innerHTML = renderSiteHeader(currentPage);
    const menuToggle = header.querySelector('[data-menu-toggle]');
    const headerElement = header.querySelector('.site-header');

    menuToggle?.addEventListener('click', () => {
      const isOpen = headerElement.dataset.menuOpen === 'true';
      headerElement.dataset.menuOpen = String(!isOpen);
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  if (footer) {
    footer.innerHTML = renderSiteFooter();
  }
};
