export function createRoleCard(role, isActive = false) {
  const cardItem = document.createElement('article');
  cardItem.className = `role-card-item${isActive ? ' is-active' : ''}`;
  cardItem.dataset.roleId = role.id;

  const cardSurface = document.createElement('div');
  cardSurface.className = 'role-card';
  cardSurface.setAttribute('role', 'button');
  cardSurface.setAttribute('tabindex', '0');
  cardSurface.setAttribute('aria-pressed', String(isActive));
  cardSurface.setAttribute('aria-label', role.title);

  if (role.card_image) {
    const resolvedImageUrl = new URL(role.card_image, window.location.href).href;
    cardSurface.style.setProperty('--card-image', `url("${resolvedImageUrl}")`);
  }

  const label = document.createElement('span');
  label.className = 'role-card__title';
  label.textContent = role.card_title || role.title;
  cardSurface.appendChild(label);

  cardItem.appendChild(cardSurface);

  if (role.detail_href) {
    const detailLink = document.createElement('a');
    detailLink.className = 'role-card__detail-link button button-secondary';
    detailLink.href = role.detail_href;
    detailLink.textContent = role.detail_label || 'Detail';
    detailLink.setAttribute('aria-label', `${detailLink.textContent} cho ${role.card_title || role.title}`);
    detailLink.addEventListener('click', (event) => {
      event.stopPropagation();
    });
    cardItem.appendChild(detailLink);
  }

  return cardItem;
}
