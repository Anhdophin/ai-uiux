import { $, byOrder } from './utils.js';
import { createRoleCard } from './components/role-card.js';
import { createGroupBlock } from './components/group-block.js';
import { createInfoBar } from './components/info-bar.js';
import { animateEntry, animateExit } from './transitions.js';
import { enableHorizontalDragScroll } from './drag-scroll.js';

function normalizeTags(tags = []) {
  return Array.from(new Set((tags || []).map((tag) => String(tag).trim().toLowerCase()).filter(Boolean)));
}

function hasTagIntersection(source = [], target = []) {
  if (!source.length || !target.length) return false;
  const targetSet = new Set(target);
  return source.some((tag) => targetSet.has(tag));
}

function inferItemTagsFromRoleIds(item, roleById) {
  const inferred = [];
  (item.role_ids || []).forEach((id) => {
    const role = roleById.get(id);
    if (!role) return;
    normalizeTags(role.tags).forEach((tag) => inferred.push(tag));
  });
  return normalizeTags(inferred);
}

function itemMatchesRole(item, roleId, roleTags, roleById) {
  if ((item.role_ids || []).includes(roleId)) return true;

  const explicitMatchTags = normalizeTags(item.role_match_tags || []);
  if (explicitMatchTags.length) {
    return hasTagIntersection(roleTags, explicitMatchTags);
  }

  // Fallback for newly added roles: infer reusable item tags from currently mapped roles.
  const inferredTags = inferItemTagsFromRoleIds(item, roleById);
  return hasTagIntersection(roleTags, inferredTags);
}

export function renderHero(profile) {
  $('#hero-title').textContent = profile.hero_title || profile.site_title;
  $('#hero-subtitle').textContent = profile.hero_subtitle || '';
  const primary = $('#primary-cta');
  const secondary = $('#secondary-cta');
  primary.textContent = profile.primary_cta?.label || 'Liên hệ';
  primary.href = profile.primary_cta?.href || '#';
  secondary.textContent = profile.secondary_cta?.label || 'Tải CV PDF';
  secondary.href = profile.secondary_cta?.href || '#';
  document.title = profile.site_title || document.title;
}

export function renderRoleCards(state, onSelect) {
  const region = $('#role-cards-region');
  enableHorizontalDragScroll(region);
  region.innerHTML = '';
  const roles = [...state.loadedData.roles].sort(byOrder);
  roles.forEach((role) => {
    const card = createRoleCard(role, state.selectedRoleId === role.id);
    const cardSurface = card.querySelector('.role-card');

    if (cardSurface) {
      cardSurface.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(role.id);
        }
      });
    }

    card.addEventListener('click', () => onSelect(role.id));
    region.appendChild(card);
  });
}

export async function renderInfoStage(state, roleId, detailApi) {
  const region = $('#info-stage-region');
  const heading = $('#selected-role-heading');
  const summary = $('#selected-role-summary');
  const role = state.loadedData.roles.find((entry) => entry.id === roleId);

  await animateExit(region, state.reducedMotion);

  if (!role) {
    heading.textContent = 'Chọn một vị trí ở trên';
    summary.textContent = 'Khi chọn card, các block và bar sẽ lắp ráp vào sân khấu thông tin.';
    region.innerHTML = `<div class="empty-stage">Chưa có vị trí nào được chọn.</div>`;
    return;
  }

  heading.textContent = role.title;
  summary.textContent = role.summary || '';

  const roleTags = normalizeTags(role.tags || []);
  const roleById = new Map(state.loadedData.roles.map((entry) => [entry.id, entry]));

  const groups = role.group_ids
    .map((groupId) => state.loadedData.groups.find((group) => group.id === groupId))
    .filter(Boolean)
    .sort(byOrder);

  const groupElements = [];
  groups.forEach((group) => {
    const block = createGroupBlock(group);
    const itemsContainer = block.querySelector('.group-block__items');
    const items = state.loadedData.items
      .filter((item) => item.group_id === group.id)
      .filter((item) => itemMatchesRole(item, roleId, roleTags, roleById))
      .sort((a, b) => (a.weight ?? 999) - (b.weight ?? 999));

    items.forEach((item) => {
      const bar = createInfoBar(item);
      const detailButton = bar.querySelector('[data-detail-id]');
      if (detailButton) {
        detailButton.addEventListener('click', (event) => {
          event.stopPropagation();
          detailApi.openDetail(item.detail_id);
        });
      }
      itemsContainer.appendChild(bar);
    });

    region.appendChild(block);
    groupElements.push(block);
  });

  animateEntry(groupElements, state.loadedData.uiConfig.animation || {}, state.reducedMotion);
}
