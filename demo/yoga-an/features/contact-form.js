const sanitizeValue = (value) => value.replace(/[<>]/g, '').trim();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const initContactForm = () => {
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');

  if (!form || !status) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: sanitizeValue(String(formData.get('name') || '')),
      email: sanitizeValue(String(formData.get('email') || '')),
      goal: sanitizeValue(String(formData.get('goal') || '')),
      message: sanitizeValue(String(formData.get('message') || '')),
    };

    if (!payload.name || !payload.email || !payload.goal) {
      status.dataset.state = 'error';
      status.textContent = 'Vui lòng nhập đủ tên, email và mục tiêu chính.';
      return;
    }

    if (!emailPattern.test(payload.email)) {
      status.dataset.state = 'error';
      status.textContent = 'Email chưa đúng định dạng.';
      return;
    }

    status.dataset.state = 'success';
    status.textContent = 'Demo tĩnh đã ghi nhận thông tin của bạn. Khi triển khai thật có thể nối tới Formspree hoặc API route.';
    form.reset();
  });
};
