document.addEventListener('components:loaded', () => {
  if (window.navigationModule) window.navigationModule.init();
  if (window.interactionsModule) window.interactionsModule.init();

  const yearNode = document.querySelector('[data-current-year]');
  if (yearNode) yearNode.textContent = new Date().getFullYear();
});
