
(function () {
  function mount() {
    const body = document.body;
    const headerSlot = document.querySelector('[data-common-header]');
    const footerSlot = document.querySelector('[data-common-footer]');
    const headerActions = document.querySelector('[data-header-actions]');
    const footerActions = document.querySelector('[data-footer-actions]');

    if (headerSlot) {
      headerSlot.className = 'common-header';
      headerSlot.innerHTML = `
        <div>
          <h1 class="common-title">${body.dataset.toolTitle || 'New Tool'}</h1>
          <p class="common-subtitle">${body.dataset.toolSubtitle || 'Starter shell for future tools.'}</p>
        </div>
        <div class="common-actions"></div>
      `;
      if (headerActions) {
        headerActions.hidden = false;
        headerSlot.querySelector('.common-actions').append(...headerActions.children);
      }
    }

    if (footerSlot) {
      footerSlot.className = 'common-footer';
      footerSlot.innerHTML = `
        <div>${body.dataset.footerText || 'Micro Tools Starter Pack'}</div>
        <div class="common-actions footer-actions"></div>
      `;
      if (footerActions) {
        footerActions.hidden = false;
        footerSlot.querySelector('.footer-actions').append(...footerActions.children);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }

  window.CommonUI = { mount };
})();
