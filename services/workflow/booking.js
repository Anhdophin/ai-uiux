(function(){
  function setupReveal(){
    const items = document.querySelectorAll('.reveal');
    if(!items.length) return;
    if(!('IntersectionObserver' in window)){
      items.forEach(el => el.classList.add('in-view'));
      return;
    }
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.12 });
    items.forEach(el => observer.observe(el));
  }

  const cfg = window.bookingConfig || {};
  const byId = (id) => document.getElementById(id);
  const setText = (id, val) => { const el = byId(id); if (el) el.textContent = val || ''; };

  setupReveal();

  setText('bookingTitle', cfg.title || 'Đặt lịch trao đổi');
  setText('bookingSubtitle', cfg.subtitle || 'Chọn khung giờ phù hợp để bắt đầu.');
  setText('providerName', cfg.providerName || 'Booking service');
  setText('fallbackNote', cfg.fallbackNote || 'Trang này có thể nhúng booking trực tiếp hoặc dùng như hub liên hệ.');

  const serviceList = byId('bookingServices');
  (cfg.services || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    serviceList?.appendChild(li);
  });

  const stepList = byId('bookingSteps');
  (cfg.steps || []).forEach((item, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${String(idx+1).padStart(2,'0')}</strong><span>${item}</span>`;
    stepList?.appendChild(li);
  });

  const providerUrl = cfg.providerUrl || '';
  const embedUrl = cfg.embedUrl || providerUrl;
  const providerLink = byId('providerLink');
  const launchBtn = byId('launchBookingBtn');
  const openNewTabBtn = byId('openBookingNewTab');
  const embed = byId('bookingEmbed');
  const placeholder = byId('bookingPlaceholder');

  if(providerLink) {
    providerLink.textContent = providerUrl ? 'Mở trang booking trực tiếp' : 'Chưa gắn link booking';
    providerLink.href = providerUrl || '#';
    if(providerUrl) {
      providerLink.target = '_blank';
      providerLink.rel = 'noopener noreferrer';
    }
  }

  if(launchBtn) {
    launchBtn.href = providerUrl || '#connect';
    if(providerUrl) {
      launchBtn.target = '_blank';
      launchBtn.rel = 'noopener noreferrer';
    }
  }

  if(openNewTabBtn) {
    openNewTabBtn.href = providerUrl || '#connect';
    if(providerUrl) {
      openNewTabBtn.target = '_blank';
      openNewTabBtn.rel = 'noopener noreferrer';
    }
  }

  const canEmbed = embedUrl && /^https?:\/\//.test(embedUrl) && !embedUrl.includes('your-handle') && cfg.embedEnabled !== false;
  if(canEmbed && embed) {
    const frame = document.createElement('iframe');
    frame.src = embedUrl;
    frame.title = 'Booking widget';
    frame.loading = 'lazy';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.addEventListener('error', () => {
      if(placeholder) placeholder.hidden = false;
    });
    embed.prepend(frame);
  }
  if(placeholder) placeholder.hidden = false;

  const fallbackEmail = byId('fallbackEmail');
  if(fallbackEmail && cfg.fallbackEmail){
    fallbackEmail.href = `mailto:${cfg.fallbackEmail}`;
    fallbackEmail.textContent = cfg.fallbackEmail;
  }
  const fallbackPhone = byId('fallbackPhone');
  if(fallbackPhone){
    if(cfg.fallbackPhone){
      fallbackPhone.href = `tel:${cfg.fallbackPhone}`;
      fallbackPhone.textContent = cfg.fallbackPhone;
    } else {
      const card = fallbackPhone.closest('.booking-mini-card');
      if(card) card.style.display='none';
    }
  }
})();
