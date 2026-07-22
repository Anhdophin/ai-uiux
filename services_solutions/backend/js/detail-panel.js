import { $, $$ } from './utils.js';
import { renderRichBlocks } from './components/rich-content.js';

export function setupDetailPanel(state) {
  const panel = $('#detail-panel-root');
  const backdrop = $('#backdrop-root');

  function closeDetail() {
    state.openDetailId = null;
    panel.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      panel.hidden = true;
      backdrop.hidden = true;
      panel.innerHTML = '';
    }, 320);
  }

  function openDetail(detailId) {
    const detail = state.loadedData.details.find((entry) => entry.id === detailId);
    if (!detail) return;

    state.openDetailId = detailId;
    panel.hidden = false;
    backdrop.hidden = false;
    panel.innerHTML = `
      <div class="detail-panel__header">
        <div>
          <p class="panel-kicker">Detail</p>
          <h2>${detail.title}</h2>
        </div>
        <button type="button" class="icon-button" data-detail-close aria-label="Đóng panel chi tiết">✕</button>
      </div>
      <div class="detail-panel__body"></div>
    `;

    const body = $('.detail-panel__body', panel);
    if (detail.content_type === 'rich_blocks') {
      body.appendChild(renderRichBlocks(detail.blocks || []));
    } else if (detail.detail_html) {
      body.innerHTML = detail.detail_html;
    }

    panel.classList.add('is-open');
    backdrop.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');

    $('[data-detail-close]', panel)?.addEventListener('click', closeDetail);
  }

  backdrop.addEventListener('click', closeDetail);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.openDetailId) closeDetail();
  });

  return { openDetail, closeDetail };
}
