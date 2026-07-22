import { getRandomInRange, $$ } from './utils.js';

export function animateEntry(groups, config, reducedMotion = false) {
  if (reducedMotion) {
    groups.forEach((group) => {
      group.style.opacity = '1';
      group.style.transform = 'none';
      $$('.info-bar', group).forEach((bar) => {
        bar.style.opacity = '1';
        bar.style.transform = 'none';
      });
    });
    return;
  }

  groups.forEach((group, groupIndex) => {
    const groupDelay = groupIndex * (config.group_stagger_ms ?? 120);
    group.style.animationDelay = `${groupDelay}ms`;
    group.style.setProperty('--enter-offset', `${getRandomInRange(config.group_translate_y_min ?? 24, config.group_translate_y_max ?? 48)}px`);
    group.classList.add('is-entering');

    const bars = $$('.info-bar', group);
    bars.forEach((bar, itemIndex) => {
      const extra = config.allow_controlled_random ? getRandomInRange(0, config.item_stagger_ms ?? 70) : 0;
      const delay = groupDelay + (itemIndex * (config.item_stagger_ms ?? 70)) + extra;
      bar.style.animationDelay = `${delay}ms`;
      bar.style.setProperty('--enter-offset', `${getRandomInRange(config.item_translate_y_min ?? 16, config.item_translate_y_max ?? 36)}px`);
      bar.classList.add('is-entering');
    });
  });
}

export async function animateExit(region, reducedMotion = false) {
  const groups = $$('.group-block', region);
  if (!groups.length) return;

  if (reducedMotion) {
    region.innerHTML = '';
    return;
  }

  groups.forEach((group) => {
    $$('.info-bar', group).forEach((bar) => bar.classList.add('is-exiting'));
    setTimeout(() => group.classList.add('is-exiting'), 90);
  });

  await new Promise((resolve) => setTimeout(resolve, 360));
  region.innerHTML = '';
}
