export const renderContactHero = (hero) => `
  <section class="section page-hero">
    <div class="container centered-copy stack-md">
      <span class="eyebrow">${hero.eyebrow}</span>
      <h1 class="page-title">${hero.title}</h1>
      <p class="section-copy">${hero.copy}</p>
    </div>
  </section>
`;

export const renderContactSupport = (support) => `
  <section class="section-tight">
    <div class="container support-grid">
      ${support
        .map(
          (item) => `
            <article class="card icon-card">
              <div class="icon-card__media" aria-hidden="true">
                <img src="assets/images/${item.icon}" alt="" loading="lazy" />
              </div>
              <h2 class="text-list__title">${item.title}</h2>
              <p class="card-copy flow-space-sm">${item.copy}</p>
            </article>
          `,
        )
        .join('')}
    </div>
  </section>
`;

export const renderContactForm = (contact, schedule) => `
  <section class="section">
    <div class="container contact-grid">
      <div class="card stack-md">
        <span class="eyebrow">Gửi yêu cầu</span>
        <h2 class="section-title">Mô tả ngắn để tôi gợi ý lộ trình phù hợp.</h2>
        <p class="form-copy">Email: <a href="mailto:${contact.email}">${contact.email}</a> · Điện thoại: <a href="tel:${contact.phone.replace(/\s+/g, '')}">${contact.phone}</a></p>
        <form class="form-grid" novalidate data-contact-form>
          <div class="field">
            <label for="name">Tên của bạn</label>
            <input id="name" name="name" type="text" maxlength="80" required />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" maxlength="120" required />
          </div>
          <div class="field">
            <label for="goal">Mục tiêu chính</label>
            <select id="goal" name="goal" required>
              <option value="">Chọn một mục tiêu</option>
              <option>Giảm căng cổ vai gáy</option>
              <option>Tăng độ mở & mobility</option>
              <option>Phục hồi năng lượng / ngủ tốt hơn</option>
              <option>Tìm lịch tập bền vững</option>
            </select>
          </div>
          <div class="field">
            <label for="message">Chia sẻ thêm</label>
            <textarea id="message" name="message" maxlength="800" placeholder="Ví dụ: mình ngồi máy tính nhiều, vai gáy căng, muốn tập 2 buổi/tuần..."></textarea>
          </div>
          <button class="button button-primary" type="submit">Gửi thông tin</button>
          <p class="form-status" data-form-status aria-live="polite"></p>
        </form>
      </div>
      <aside class="card stack-md">
        <span class="eyebrow">Lịch tham khảo</span>
        <h2 class="section-title">Một vài khung giờ thường mở trong tuần.</h2>
        <ul class="studio-schedule">
          ${schedule.map((slot) => `<li><span>${slot.day}</span><strong>${slot.label}</strong></li>`).join('')}
        </ul>
        <div class="media-panel media-panel-contact" aria-hidden="true">
          <img src="assets/images/contact.webp" alt="" loading="lazy" />
        </div>
      </aside>
    </div>
  </section>
`;
