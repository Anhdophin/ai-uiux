function renderMetadataRows(project) {
  const rows = [
    ['Client', project.client],
    ['Industry', project.industry],
    ['Year', project.year],
    ['Scope', (project.scope || []).join(', ')],
    ['Deliverables', (project.deliverables || []).join(', ')],
  ];

  return rows
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value || ''}</dd></div>`)
    .join('');
}

function renderAlternatingSection(section, reverse = false) {
  return `
    <section class="project-detail ${reverse ? 'is-reverse' : ''}">
      <div class="project-detail__media">
        <img src="${section.image}" alt="${section.alt}" loading="lazy">
      </div>
      <article class="project-detail__copy">
        <h2>${section.heading}</h2>
        ${(section.paragraphs || []).map((paragraph) => `<p>${paragraph}</p>`).join('')}
        ${(section.list || []).length
          ? `<ul>${section.list.map((item) => `<li>${item}</li>`).join('')}</ul>`
          : ''}
        ${section.keyMessage ? `<p class="project-detail__message">${section.keyMessage}</p>` : ''}
      </article>
    </section>
  `;
}

function renderOverviewStats(project) {
  const entries = Object.entries(project.overview || {});
  return entries
    .map(([_, item]) => `<article><strong>${item.label}</strong><p>${item.value}</p></article>`)
    .join('');
}

function renderCoreExperience(project) {
  const core = project.coreExperience;
  if (!core) return '';

  return `
    <section class="project-core container-content">
      <header class="project-section-head">
        <h2>${core.heading || 'Core Experience'}</h2>
        <p>${core.intro || ''}</p>
      </header>

      ${(core.items || []).length
        ? `<div class="project-core__grid">${core.items
            .map(
              (item) => `
                <article>
                  <p class="works-kicker">${item.label}</p>
                  <h3>${item.title}</h3>
                  <p>${item.description}</p>
                </article>`,
            )
            .join('')}</div>`
        : ''}

      ${(core.supportingFeatures || []).length
        ? `<div class="project-core__support">
            <h3>Supporting Features</h3>
            <div class="project-core__support-grid">${core.supportingFeatures
              .map(
                (feature) => `
                  <article>
                    <h4>${feature.title}</h4>
                    <p>${feature.description}</p>
                  </article>`,
              )
              .join('')}</div>
          </div>`
        : ''}

      ${core.keyMessage ? `<p class="project-core__message">${core.keyMessage}</p>` : ''}
    </section>
  `;
}

function renderSelectedSpreads(project) {
  const images = project.gallery || [];
  if (!images.length) return '';

  const first = images[0];
  const second = images.slice(1, 3);
  const third = images[3];
  const rest = images.slice(4);

  return `
    <section class="project-spreads">
      <header class="project-section-head">
        <h2>Selected Spreads</h2>
        <p>${project.spreadsIntro || 'A selection of key pages showing the content hierarchy, editorial rhythm and visual consistency of the final company profile.'}</p>
      </header>

      ${first
        ? `<figure class="project-spreads__full"><img src="${first.src}" alt="${first.alt}" loading="lazy">${first.caption ? `<figcaption>${first.caption}</figcaption>` : ''}</figure>`
        : ''}

      ${second.length
        ? `<div class="project-spreads__split">${second
            .map(
              (image) =>
                `<figure><img src="${image.src}" alt="${image.alt}" loading="lazy">${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}</figure>`,
            )
            .join('')}</div>`
        : ''}

      ${third
        ? `<figure class="project-spreads__full"><img src="${third.src}" alt="${third.alt}" loading="lazy">${third.caption ? `<figcaption>${third.caption}</figcaption>` : ''}</figure>`
        : ''}

      ${rest.length
        ? `<div class="project-spreads__grid">${rest
            .map(
              (image) =>
                `<figure><img src="${image.src}" alt="${image.alt}" loading="lazy">${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}</figure>`,
            )
            .join('')}</div>`
        : ''}
    </section>
  `;
}

function renderTestimonial(project) {
  if (!project.testimonial) return '';

  return `
    <section class="project-testimonial">
      <blockquote>${project.testimonial.quote}</blockquote>
      <p><strong>${project.testimonial.name}</strong></p>
      <p>${project.testimonial.position}</p>
    </section>
  `;
}

function renderNextProject(project) {
  if (!project.nextProject) return '';
  return `
    <section class="project-next">
      <a class="project-next__card" href="${project.nextProject.href}">
        <span class="project-next__thumb"><img src="${project.nextProject.image}" alt="${project.nextProject.alt}" loading="lazy"></span>
        <span class="project-next__meta">
          <span class="works-kicker">Next Case</span>
          <strong>${project.nextProject.title}</strong>
        </span>
        <span class="project-next__arrow" aria-hidden="true">-&gt;</span>
      </a>
    </section>
  `;
}

export function renderProjectCase(project) {
  const experienceActions = project.experience?.actions || {};
  const finalCta = project.finalCta || {};

  return `
    <main class="project-case-page">
      <section class="project-hero container-content">
        <article class="project-hero__copy">
          <p class="works-kicker">${project.kicker || 'SELECTED PROJECT / COMPANY PROFILE'}</p>
          <h1>${project.title}</h1>
          <p class="project-hero__subtitle">${project.subtitle}</p>
          <p class="project-hero__subtitle project-hero__subtitle--vi">${project.subtitleVi}</p>
          <p>${project.heroDescription}</p>
          <dl class="project-meta">${renderMetadataRows(project)}</dl>
        </article>

        <div class="project-hero__media">
          <figure class="project-hero__media-main">
            <img src="${project.heroImage.src}" alt="${project.heroImage.alt}" loading="eager">
          </figure>
          <figure class="project-hero__media-secondary">
            <img src="${project.secondaryImage.src}" alt="${project.secondaryImage.alt}" loading="lazy">
          </figure>
        </div>
      </section>

      <section class="project-experience" style="--project-banner-image: url('${project.bannerImage.src}')">
        <div class="container-content project-experience__inner">
          <h2>${project.experience.heading}</h2>
          <p>${project.experience.paragraph1}</p>
          <p>${project.experience.paragraph2}</p>
          <p class="project-experience__message">${project.experience.message}</p>
          <div class="project-experience__actions">
            <a class="portal-cta" href="${experienceActions.primaryHref || '#selected-spreads'}">${experienceActions.primaryLabel || 'View Full Project Gallery'}</a>
            <a class="portal-chip" href="${experienceActions.secondaryHref || '../../../contact/'}">${experienceActions.secondaryLabel || 'Discuss a Similar Project'}</a>
          </div>
        </div>
      </section>

      <section class="project-overview container-content">
        <header class="project-section-head">
          <h2>Project Overview</h2>
          <p>${project.overviewIntro}</p>
        </header>
        <div class="project-overview__grid">${renderOverviewStats(project)}</div>
        ${project.overviewNote ? `<p class="project-overview__note">${project.overviewNote}</p>` : ''}
      </section>

      <div class="container-content">
        ${renderAlternatingSection(project.challengeSection, false)}
        ${renderAlternatingSection(project.strategySection, true)}
      </div>

      ${renderCoreExperience(project)}

      <div class="container-content">${renderAlternatingSection(project.visualSection, false)}</div>

      <div id="selected-spreads" class="container-content">${renderSelectedSpreads(project)}</div>

      ${project.designSystemSection
        ? `<div class="container-content">${renderAlternatingSection(project.designSystemSection, true)}</div>`
        : ''}

      <section class="project-outcome container-content">
        <header class="project-section-head">
          <h2>The Outcome</h2>
        </header>
        <p>${project.outcome.description}</p>
        <ul>${(project.outcome.points || []).map((point) => `<li>${point}</li>`).join('')}</ul>
      </section>

      <div class="container-content">${renderTestimonial(project)}</div>

      <section class="project-final-cta">
        <div class="container-reading project-final-cta__inner">
          <h2>${finalCta.heading || 'Need a company profile that explains your business clearly?'}</h2>
          <p>${finalCta.paragraph || 'Let\'s turn your experience, services and project capabilities into a profile clients can understand, trust and remember.'}</p>
          <div class="project-final-cta__actions">
            <a class="portal-cta" href="${finalCta.primaryHref || '../../../contact/'}">${finalCta.primaryLabel || 'Start a Project'}</a>
            <a class="portal-chip" href="${finalCta.secondaryHref || '../../'}">${finalCta.secondaryLabel || 'View Another Case Study'}</a>
          </div>
        </div>
      </section>

      <div class="container-content">${renderNextProject(project)}</div>
    </main>
  `;
}
