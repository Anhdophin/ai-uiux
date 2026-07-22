(function () {
  const form = document.getElementById('yoga-tool-form');
  if (!form) return;

  const statusBox = document.getElementById('form-status');
  const submitButton = document.getElementById('tool-submit-button');
  const config = window.LOTUS_SITE_CONFIG || {};
  const googleScriptUrl = (config.googleScriptUrl || '').trim();

  const pageUrlField = document.getElementById('page-url-field');
  const submittedAtField = document.getElementById('submitted-at-field');

  if (pageUrlField) pageUrlField.value = window.location.href;
  if (submittedAtField) submittedAtField.value = new Date().toISOString();

  function setStatus(message, type) {
    statusBox.textContent = message;
    statusBox.classList.remove('is-success', 'is-error');
    if (type) statusBox.classList.add(type);
  }

  function serializeForm(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    const multipleValueKeys = new Set();

    for (const [key] of formData.entries()) {
      const fields = formElement.querySelectorAll(`[name="${CSS.escape(key)}"]`);
      if (fields.length > 1 || (fields[0] && (fields[0].type === 'checkbox'))) {
        multipleValueKeys.add(key);
      }
    }

    for (const [key, value] of formData.entries()) {
      if (multipleValueKeys.has(key)) {
        if (!Array.isArray(data[key])) data[key] = [];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key] = data[key].join(' | ');
      }
    });

    return data;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus('Vui lòng điền đủ các trường bắt buộc trước khi gửi.', 'is-error');
      return;
    }

    if (!googleScriptUrl) {
      setStatus('Chưa cấu hình Google Script URL. Hãy mở file js/site-config.js và dán URL Web App của Google Apps Script.', 'is-error');
      return;
    }

    const payload = serializeForm(form);

    submitButton.classList.add('is-loading');
    submitButton.setAttribute('aria-busy', 'true');
    setStatus('Đang gửi dữ liệu lên Google Sheet...', '');

    try {
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || 'Gửi dữ liệu thất bại.');
      }

      setStatus('Gửi thành công. Thông tin đã được chuyển vào Google Sheet.', 'is-success');
      form.reset();
      if (pageUrlField) pageUrlField.value = window.location.href;
      if (submittedAtField) submittedAtField.value = new Date().toISOString();
    } catch (error) {
      setStatus(error.message || 'Có lỗi khi gửi dữ liệu. Kiểm tra lại Google Script URL và quyền publish web app.', 'is-error');
    } finally {
      submitButton.classList.remove('is-loading');
      submitButton.removeAttribute('aria-busy');
    }
  });
})();
