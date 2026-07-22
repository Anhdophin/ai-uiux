export function createGroupBlock(group) {
  const block = document.createElement('section');
  block.className = 'group-block';
  block.dataset.groupId = group.id;
  block.innerHTML = `
    <div class="group-block__header">
      <h3 class="group-block__title">${group.title}</h3>
      <p class="group-block__caption">${group.caption ?? ''}</p>
    </div>
    <div class="group-block__items"></div>
  `;
  return block;
}
