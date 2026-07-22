/*
  Landing Page Function Kit
  ---------------------------------
  Bộ JS thuần để gắn nhanh vào landing page.
  Tất cả function được viết để:
  - dễ đọc
  - dễ sửa tay
  - không phụ thuộc framework

  Cách dùng chính:
  - Gắn file JS vào trang
  - Đặt HTML theo data-attribute trong file demo
  - JS sẽ tự init khi DOM ready
*/

(function () {
  'use strict';

  // =========================================================
  // Utility helpers
  // =========================================================

  /**
   * Chọn 1 phần tử.
   */
  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  /**
   * Chọn nhiều phần tử.
   */
  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  /**
   * Kiểm tra phần tử có tồn tại không.
   */
  function exists(el) {
    return !!el;
  }

  /**
   * Khóa / mở cuộn trang khi popup mở.
   */
  function setBodyScrollLocked(locked) {
    document.body.classList.toggle('lp-scroll-locked', locked);
  }

  /**
   * Hiện toast báo nhanh cho user.
   */
  function showToast(message, type = 'info', duration = 2500) {
    let host = $('[data-toast-host]');

    if (!host) {
      host = document.createElement('div');
      host.setAttribute('data-toast-host', '');
      host.className = 'lp-toast-host';
      document.body.appendChild(host);
    }

    const toast = document.createElement('div');
    toast.className = `lp-toast lp-toast--${type}`;
    toast.textContent = message;
    host.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));

    window.setTimeout(() => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => toast.remove(), 220);
    }, duration);
  }

  /**
   * Copy text nhanh.
   */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Đã sao chép nội dung.', 'success');
    } catch (error) {
      console.error('Copy failed:', error);
      showToast('Không thể sao chép lúc này.', 'error');
    }
  }

  // =========================================================
  // Sticky CTA
  // =========================================================

  /**
   * Bật sticky CTA bar.
   * HTML cần có: data-sticky-cta
   */
  function initStickyCTA() {
    const stickyBars = $all('[data-sticky-cta]');
    if (!stickyBars.length) return;

    stickyBars.forEach((bar) => {
      const hideAbove = Number(bar.dataset.hideAbove || 0);

      function update() {
        const shouldShow = window.scrollY > hideAbove;
        bar.classList.toggle('is-visible', shouldShow);
      }

      update();
      window.addEventListener('scroll', update, { passive: true });
    });
  }

  // =========================================================
  // FAQ accordion
  // =========================================================

  /**
   * FAQ structure:
   * [data-faq-item]
   *   [data-faq-question]
   *   [data-faq-answer]
   */
  function initFAQ() {
    const items = $all('[data-faq-item]');
    if (!items.length) return;

    items.forEach((item) => {
      const button = $('[data-faq-question]', item);
      const answer = $('[data-faq-answer]', item);
      if (!button || !answer) return;

      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        item.classList.toggle('is-open', !isOpen);
        answer.hidden = isOpen;
      });
    });
  }

  // =========================================================
  // Popup system
  // =========================================================

  function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (!popup) return;

    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    setBodyScrollLocked(true);
  }

  function closePopup(popup) {
    if (!popup) return;

    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    setBodyScrollLocked(false);
  }

  /**
   * Nút mở popup:
   * data-open-popup="popup-id"
   *
   * Popup:
   * .lp-popup#popup-id
   * data-popup-close để đóng
   */
  function initPopups() {
    const openButtons = $all('[data-open-popup]');
    const popups = $all('.lp-popup');

    openButtons.forEach((button) => {
      button.addEventListener('click', () => {
        openPopup(button.dataset.openPopup);
      });
    });

    popups.forEach((popup) => {
      popup.addEventListener('click', (event) => {
        const target = event.target;
        const closeButton = target.closest('[data-popup-close]');
        const clickedBackdrop = target === popup;

        if (closeButton || clickedBackdrop) {
          closePopup(popup);
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const activePopup = $('.lp-popup.is-open');
      if (activePopup) closePopup(activePopup);
    });
  }

  /**
   * Lead popup tự bật sau X giây hoặc sau Y% scroll.
   *
   * HTML:
   * data-auto-popup="popup-id"
   * data-auto-popup-delay="6000"
   * data-auto-popup-scroll="45"
   */
  function initAutoPopup() {
    const trigger = $('[data-auto-popup]');
    if (!trigger) return;

    const popupId = trigger.dataset.autoPopup;
    const delay = Number(trigger.dataset.autoPopupDelay || 0);
    const scrollPercent = Number(trigger.dataset.autoPopupScroll || 0);
    const storageKey = `lp_popup_seen_${popupId}`;

    if (sessionStorage.getItem(storageKey) === '1') return;

    let opened = false;

    function markSeenAndOpen() {
      if (opened) return;
      opened = true;
      sessionStorage.setItem(storageKey, '1');
      openPopup(popupId);
    }

    if (delay > 0) {
      window.setTimeout(markSeenAndOpen, delay);
    }

    if (scrollPercent > 0) {
      const onScroll = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        if (max <= 0) return;

        const currentPercent = (window.scrollY / max) * 100;
        if (currentPercent >= scrollPercent) {
          markSeenAndOpen();
          window.removeEventListener('scroll', onScroll);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  // =========================================================
  // Form handler (front-end demo)
  // =========================================================

  /**
   * Validate căn bản cho form lead.
   */
  function validateLeadForm(form) {
    const requiredFields = $all('[data-required="true"]', form);
    let isValid = true;

    requiredFields.forEach((field) => {
      const value = String(field.value || '').trim();
      const fieldWrap = field.closest('.lp-field') || field.parentElement;

      if (!value) {
        isValid = false;
        field.classList.add('is-error');
        if (fieldWrap) fieldWrap.classList.add('is-error');
      } else {
        field.classList.remove('is-error');
        if (fieldWrap) fieldWrap.classList.remove('is-error');
      }
    });

    return isValid;
  }

  /**
   * Đây là chỗ anh sẽ thay bằng API thật sau này.
   * Hiện tại chỉ giả lập submit thành công.
   */
  function mockSubmitLeadData(payload) {
    console.log('Lead payload:', payload);
    return new Promise((resolve) => {
      window.setTimeout(() => resolve({ ok: true }), 900);
    });
  }

  async function handleLeadFormSubmit(form) {
    const submitButton = $('[type="submit"]', form);

    if (!validateLeadForm(form)) {
      showToast('Anh vui lòng nhập đủ các trường bắt buộc.', 'error');
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      form.classList.add('is-loading');
      if (submitButton) submitButton.disabled = true;

      const result = await mockSubmitLeadData(payload);

      if (result.ok) {
        form.reset();
        form.classList.remove('is-loading');
        showToast('Đã gửi thông tin thành công.', 'success');

        const successTarget = form.dataset.successTarget;
        if (successTarget) {
          const target = document.getElementById(successTarget);
          if (target) target.hidden = false;
        }
      } else {
        throw new Error('Submit failed');
      }
    } catch (error) {
      console.error(error);
      form.classList.remove('is-loading');
      showToast('Có lỗi khi gửi thông tin.', 'error');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }

  function initLeadForms() {
    const forms = $all('[data-lead-form]');
    if (!forms.length) return;

    forms.forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        handleLeadFormSubmit(form);
      });
    });
  }

  // =========================================================
  // Booking link helper
  // =========================================================

  /**
   * Nút đặt lịch chỉ cần gắn data-booking-url.
   * Có thể là link Google Calendar booking / Calendly / trang riêng.
   */
  function initBookingButtons() {
    const buttons = $all('[data-booking-url]');
    if (!buttons.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const url = button.dataset.bookingUrl;
        if (!url) return;
        window.open(url, '_blank', 'noopener');
      });
    });
  }

  // =========================================================
  // Contact action helper
  // =========================================================

  /**
   * Nút có data-contact-href sẽ mở link tương ứng.
   * Dùng cho tel:, mailto:, zalo, messenger, whatsapp...
   */
  function initContactButtons() {
    const buttons = $all('[data-contact-href]');
    if (!buttons.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const href = button.dataset.contactHref;
        if (!href) return;
        window.open(href, '_blank', 'noopener');
      });
    });
  }

  // =========================================================
  // Tabs
  // =========================================================

  /**
   * Group structure:
   * [data-tabs]
   *   [data-tab-button="id"]
   *   [data-tab-panel="id"]
   */
  function initTabs() {
    const groups = $all('[data-tabs]');
    if (!groups.length) return;

    groups.forEach((group) => {
      const buttons = $all('[data-tab-button]', group);
      const panels = $all('[data-tab-panel]', group);

      function activateTab(id) {
        buttons.forEach((button) => {
          button.classList.toggle('is-active', button.dataset.tabButton === id);
        });

        panels.forEach((panel) => {
          panel.hidden = panel.dataset.tabPanel !== id;
        });
      }

      buttons.forEach((button) => {
        button.addEventListener('click', () => activateTab(button.dataset.tabButton));
      });

      if (buttons[0]) activateTab(buttons[0].dataset.tabButton);
    });
  }

  // =========================================================
  // Anchor navigation + active section
  // =========================================================

  function initSmoothAnchors() {
    const links = $all('[data-scroll-to]');
    if (!links.length) return;

    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.dataset.scrollTo;
        const target = document.getElementById(targetId);
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initActiveSectionNav() {
    const navLinks = $all('[data-section-nav]');
    if (!navLinks.length) return;

    const sections = navLinks
      .map((link) => document.getElementById(link.dataset.sectionNav))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;

          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.dataset.sectionNav === id);
          });
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // =========================================================
  // Reveal on scroll
  // =========================================================

  function initRevealOnScroll() {
    const items = $all('[data-reveal]');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
  }

  // =========================================================
  // Gallery lightbox
  // =========================================================

  function initLightboxGallery() {
    const galleries = $all('[data-lightbox-gallery]');
    if (!galleries.length) return;

    galleries.forEach((gallery) => {
      const images = $all('[data-lightbox-src]', gallery);
      if (!images.length) return;

      images.forEach((thumb) => {
        thumb.addEventListener('click', () => {
          const src = thumb.dataset.lightboxSrc;
          const alt = thumb.getAttribute('alt') || '';
          openLightbox(src, alt);
        });
      });
    });
  }

  function openLightbox(src, alt = '') {
    let lightbox = $('.lp-lightbox');

    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lp-lightbox';
      lightbox.innerHTML = `
        <div class="lp-lightbox__dialog">
          <button class="lp-lightbox__close" type="button" data-lightbox-close aria-label="Close">×</button>
          <img class="lp-lightbox__image" src="" alt="">
        </div>
      `;
      document.body.appendChild(lightbox);

      lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox || event.target.closest('[data-lightbox-close]')) {
          closeLightbox();
        }
      });
    }

    const image = $('.lp-lightbox__image', lightbox);
    image.src = src;
    image.alt = alt;

    lightbox.classList.add('is-open');
    setBodyScrollLocked(true);
  }

  function closeLightbox() {
    const lightbox = $('.lp-lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    setBodyScrollLocked(false);
  }

  // =========================================================
  // Copy helper buttons
  // =========================================================

  function initCopyButtons() {
    const buttons = $all('[data-copy-text]');
    if (!buttons.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => copyText(button.dataset.copyText || ''));
    });
  }

  // =========================================================
  // Init all
  // =========================================================

  function initLandingKit() {
    initStickyCTA();
    initFAQ();
    initPopups();
    initAutoPopup();
    initLeadForms();
    initBookingButtons();
    initContactButtons();
    initTabs();
    initSmoothAnchors();
    initActiveSectionNav();
    initRevealOnScroll();
    initLightboxGallery();
    initCopyButtons();
  }

  document.addEventListener('DOMContentLoaded', initLandingKit);
})();
