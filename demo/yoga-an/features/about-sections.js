import { renderBadgeRow } from '../shared/render-helpers.js';

export const renderAboutHero = (hero) => `
  <section class="section page-hero">
    <div class="container grid-2">
      <div class="stack-lg">
        <span class="eyebrow">${hero.eyebrow}</span>
        <h1 class="page-title">${hero.title}</h1>
        <p class="section-copy">${hero.copy}</p>
        ${renderBadgeRow(hero.badges)}
      </div>
      <div class="media-shell" aria-hidden="true">
        <div class="media-panel">
          <img src="assets/images/img_2.webp" alt="" loading="eager" />
        </div>
        <div class="floating-chip chip-about-top-left">12+ years</div>
        <div class="floating-chip chip-about-bottom-right">Wellness-first teaching</div>
      </div>
    </div>
  </section>
`;

export const renderStoryCards = (storyCards) => `
  <section class="section-tight">
    <div class="container story-grid">
      ${storyCards
        .map(
          (card) => `
            <article class="card story-card">
              <div class="story-card__media" aria-hidden="true">
                <img src="assets/images/${card.image}" alt="" loading="lazy" />
              </div>
              <h2 class="text-list__title">${card.title}</h2>
              <p class="card-copy flow-space-sm">${card.copy}</p>
            </article>
          `,
        )
        .join('')}
    </div>
  </section>
`;

export const renderAboutValues = (values) => `
  <section class="section">
    <div class="container centered-copy stack-md">
      <span class="eyebrow">Triết lý giảng dạy</span>
      <h2 class="section-title">Một cấu trúc dạy học đơn giản, rõ ràng và có trách nhiệm.</h2>
      <p class="section-copy">Ba nguyên tắc này là nền cho mọi lớp private, nhóm nhỏ và retreat.</p>
    </div>
    <div class="container support-grid space-top-2xl">
      ${values
        .map(
          (value) => `
            <article class="card support-card stack-sm">
              <h3 class="text-list__title">${value.title}</h3>
              <p class="card-copy">${value.copy}</p>
            </article>
          `,
        )
        .join('')}
    </div>
  </section>
`;

export const renderTestimonials = (testimonials) => `
  <section class="section-tight">
    <div class="container grid-2">
      <div class="stack-md">
        <span class="eyebrow">Phản hồi học viên</span>
        <h2 class="section-title">Những điều học viên nữ nhắc lại nhiều nhất sau khi tập cùng tôi.</h2>
        <p class="section-copy">Nhẹ hơn, rõ hơn và bớt tự gây áp lực hơn với cơ thể mình.</p>
      </div>
      <div class="stack-md">
        ${testimonials
          .map(
            (item) => `
              <article class="card quote-card">
                <p class="card-copy">“${item.quote}”</p>
                <div class="quote-card__person">
                  <img src="assets/images/${item.avatar}" alt="Ảnh đại diện placeholder của ${item.name}" loading="lazy" />
                  <div>
                    <strong>${item.name}</strong><br />
                    <span class="section-copy">${item.role}</span>
                  </div>
                </div>
              </article>
            `,
          )
          .join('')}
      </div>
    </div>
  </section>
`;
