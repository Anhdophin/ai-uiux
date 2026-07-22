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
      const service = form.querySelector('[name="service"]')?.value?.trim() || 'dịch vụ';
      status.textContent = `Cảm ơn ${name}. Tickera đã ghi nhận brief cho ${service}. Đây là bản demo frontend tĩnh.`;
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

  const typingTarget = document.querySelector('[data-typing]');
  if (typingTarget) {
    const finalText = typingTarget.getAttribute('data-typing') || typingTarget.textContent.trim();
    typingTarget.textContent = '';
    const cursor = document.createElement('span');
    cursor.id = 'typed-cursor';
    cursor.textContent = '|';
    typingTarget.after(cursor);
    let i = 0;
    const tick = () => {
      if (i < finalText.length) {
        typingTarget.textContent += finalText.charAt(i);
        i += 1;
        setTimeout(tick, i < 12 ? 44 : 28);
      } else {
        setTimeout(() => cursor.remove(), 1200);
      }
    };
    setTimeout(tick, 280);
  }

  document.querySelectorAll('.media-glow').forEach((card) => {
    const update = (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    };
    card.addEventListener('mouseenter', (event) => {
      card.classList.add('is-hovered');
      update(event);
    });
    card.addEventListener('mousemove', update);
    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-hovered');
    });
  });
});
