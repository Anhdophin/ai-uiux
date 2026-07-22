import { renderButtonRow, renderMetricGrid } from '../shared/render-helpers.js';

export const renderHomeHero = (hero) => `
  <section class="section page-hero">
    <div class="container grid-2 hero-layout">
      <div class="stack-lg">
        <span class="eyebrow">${hero.eyebrow}</span>
        <h1 class="page-title">${hero.title}</h1>
        <p class="section-copy">${hero.copy}</p>
        ${renderButtonRow([
          { ...hero.primaryCta, variant: 'button-primary' },
          { ...hero.secondaryCta, variant: 'button-secondary' },
        ])}
        <div class="button-row" aria-label="Điểm nổi bật">
          ${hero.stats.map((item) => `<span class="hero-note"><strong>${item.value}</strong> ${item.label}</span>`).join('')}
        </div>
      </div>
      <div class="media-shell" aria-hidden="true">
        <div class="media-panel media-panel-hero">
          <img src="assets/images/hero_img.webp" alt="" loading="eager" />
        </div>
        <div class="floating-chip chip-top-right"><strong>1:1</strong> riêng tư</div>
        <div class="floating-chip chip-bottom-left"><strong>Breath</strong> + mobility</div>
        <div class="floating-chip chip-bottom-right">${hero.note}</div>
      </div>
    </div>
  </section>
`;

export const renderHomeStats = (intro) => `
  <section class="section-tight">
    <div class="container centered-copy stack-md">
      <span class="eyebrow">${intro.eyebrow}</span>
      <h2 class="section-title">${intro.title}</h2>
      <p class="section-copy">${intro.copy}</p>
      ${renderMetricGrid(intro.metrics)}
    </div>
  </section>
`;

export const renderHomeServices = (services) => `
  <section class="section wave-band">
    <div class="container grid-3" aria-label="Các dịch vụ chính">
      ${services
        .map(
          (service) => `
            <article class="card icon-card">
              <div class="icon-card__media" aria-hidden="true">
                <img src="assets/images/${service.icon}" alt="" loading="lazy" />
              </div>
              <h3 class="text-list__title">${service.title}</h3>
              <p class="card-copy flow-space-sm">${service.copy}</p>
            </article>
          `,
        )
        .join('')}
    </div>
  </section>
`;

export const renderHomeSupport = (supportList) => `
  <section class="section">
    <div class="container grid-2">
      <div class="media-shell" aria-hidden="true">
        <div class="media-panel">
          <img src="assets/images/img_1.webp" alt="" loading="lazy" />
        </div>
        <div class="floating-chip chip-support-top-left">Female-first guidance</div>
        <div class="floating-chip chip-support-bottom-right">Reset your posture & energy</div>
      </div>
      <div class="stack-lg">
        <span class="eyebrow">${supportList.eyebrow}</span>
        <h2 class="section-title">${supportList.title}</h2>
        <p class="section-copy">${supportList.copy}</p>
        <div class="text-list">
          ${supportList.items
            .map(
              (item) => `
                <article class="text-list__item stack-sm">
                  <h3 class="text-list__title">${item.title}</h3>
                  <p class="list-copy">${item.copy}</p>
                </article>
              `,
            )
            .join('')}
        </div>
        <a class="button button-primary" href="${supportList.cta.href}">${supportList.cta.label}</a>
      </div>
    </div>
  </section>
`;
