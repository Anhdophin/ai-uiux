import { rootPath, setupSharedShell } from './modules.js';
import { bindSearch } from './home.js';

async function setupHome() {
  const root = rootPath();
  await setupSharedShell(root);

  const response = await fetch(`${root}/data/apps.json`);
  const apps = await response.json();
  bindSearch(apps);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register(`${root}/sw.js`));
  }
}

setupHome();
