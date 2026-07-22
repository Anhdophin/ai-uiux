
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-item').forEach((item, index) => {
    const button = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (!button || !content) return;
    const openByDefault = index === 0;
    button.setAttribute('aria-expanded', String(openByDefault));
    content.hidden = !openByDefault;
    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      content.hidden = isOpen;
    });
  });

  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');
  if (form && status) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.querySelector('[name="name"]')?.value?.trim() || 'anh';
      status.textContent = `Cảm ơn ${name}. Đây là bản demo frontend tĩnh, form đã mô phỏng trạng thái nhận brief.`;
      form.reset();
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
