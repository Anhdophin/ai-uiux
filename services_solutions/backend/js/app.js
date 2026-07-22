import { state } from './state.js';
import { loadAllData } from './data-loader.js';
import { renderHero, renderRoleCards, renderInfoStage } from './render.js';
import { setupDetailPanel } from './detail-panel.js';

async function init() {
  try {
    const data = await loadAllData();
    state.loadedData = data;
    renderHero(data.profile);

    const detailApi = setupDetailPanel(state);

    async function selectRole(roleId) {
      if (state.isTransitioning || state.selectedRoleId === roleId) return;
      state.isTransitioning = true;
      state.selectedRoleId = roleId;
      renderRoleCards(state, selectRole);
      await renderInfoStage(state, roleId, detailApi);
      state.isTransitioning = false;
    }

    renderRoleCards(state, selectRole);
    const firstRole = data.roles.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))[0];
    if (firstRole) {
      await selectRole(firstRole.id);
    }
  } catch (error) {
    console.error(error);
    document.body.innerHTML = `
      <main style="padding: 40px; color: white; font-family: Inter, system-ui, sans-serif;">
        <h1>Không tải được Dynamic CV scaffold</h1>
        <p>Hãy chạy bằng local server thay vì mở trực tiếp file HTML.</p>
        <pre>${error.message}</pre>
      </main>
    `;
  }
}

init();
