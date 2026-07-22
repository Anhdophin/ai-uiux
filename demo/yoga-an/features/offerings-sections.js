export const renderOfferingsHero = (hero) => `
  <section class="section page-hero">
    <div class="container centered-copy stack-md">
      <span class="eyebrow">${hero.eyebrow}</span>
      <h1 class="page-title">${hero.title}</h1>
      <p class="section-copy">${hero.copy}</p>
    </div>
  </section>
`;

export const renderProgramGrid = (programs) => `
  <section class="section-tight">
    <div class="container program-grid">
      ${programs
        .map(
          (program) => `
            <article class="card program-card stack-md">
              <div class="program-card__media" aria-hidden="true">
                <img src="assets/images/${program.image}" alt="" loading="lazy" />
              </div>
              <h2 class="text-list__title">${program.title}</h2>
              <p class="card-copy">${program.copy}</p>
              <ul class="stack-sm" aria-label="Điểm nổi bật của ${program.title}">
                ${program.bullets.map((bullet) => `<li class="list-copy">• ${bullet}</li>`).join('')}
              </ul>
            </article>
          `,
        )
        .join('')}
    </div>
  </section>
`;

export const renderProcess = (process) => `
  <section class="section wave-band">
    <div class="container centered-copy stack-md">
      <span class="eyebrow">Quy trình làm việc</span>
      <h2 class="section-title">Mỗi chương trình đều đi qua 3 bước rất rõ.</h2>
      <p class="section-copy">Đủ rõ để bạn tin tưởng, đủ mềm để cơ thể có thời gian đáp ứng.</p>
    </div>
    <div class="container support-grid space-top-2xl">
      ${process
        .map(
          (step) => `
            <article class="card support-card stack-sm">
              <h3 class="text-list__title">${step.title}</h3>
              <p class="card-copy">${step.copy}</p>
            </article>
          `,
        )
        .join('')}
    </div>
  </section>
`;

export const renderFaq = (faq) => `
  <section class="section">
    <div class="container grid-2">
      <div class="stack-md">
        <span class="eyebrow">FAQ</span>
        <h2 class="section-title">Một số câu hỏi thường gặp trước khi bắt đầu.</h2>
        <p class="section-copy">Nếu bạn cần trường hợp riêng hơn, hãy email hoặc gửi form ở trang liên hệ.</p>
      </div>
      <div class="text-list">
        ${faq
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
    </div>
  </section>
`;
