(function () {
  async function injectComponents() {
    const nodes = document.querySelectorAll('[data-include]');
    await Promise.all(
      [...nodes].map(async (node) => {
        const source = node.dataset.include;
        if (!source) return;
        try {
          const response = await fetch(source);
          if (!response.ok) throw new Error('Component not found');
          const html = (await response.text()).replaceAll('{{root}}', window.location.pathname.includes('/pages/') ? '..' : '.');
          node.innerHTML = html;
        } catch (error) {
          node.innerHTML = '<div class="container"><p>Component failed to load.</p></div>';
          console.error(error);
        }
      })
    );
    document.dispatchEvent(new CustomEvent('components:loaded'));
  }

  injectComponents();
})();
