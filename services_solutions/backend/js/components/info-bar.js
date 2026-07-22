export function createInfoBar(item) {
  const bar = document.createElement('div');
  bar.className = `info-bar info-bar--${item.style_variant || 'default'}`;
  bar.dataset.itemId = item.id;
  const detailButton = item.has_detail
    ? `<button type="button" class="info-bar__detail" aria-label="Xem chi tiết cho ${item.label}" data-detail-id="${item.detail_id}">!</button>`
    : '';

  bar.innerHTML = `
    <span class="info-bar__label" title="${item.short_note ?? item.label}">${item.label}</span>
    ${detailButton}
  `;
  return bar;
}
