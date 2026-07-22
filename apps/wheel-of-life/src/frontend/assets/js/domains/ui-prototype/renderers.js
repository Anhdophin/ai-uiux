const textOf = (entry, locale, field = "label") => {
  if (!entry) return "";
  const value = entry[field];
  if (typeof value === "string") return value;
  return value?.[locale] ?? value?.en ?? "";
};

const iconMarkup = (iconKey) => `
  <span class="ui-icon-wrap">
    <svg class="ui-icon"><use href="#${iconKey || "i-grid"}"></use></svg>
  </span>
`;

const emptyCard = () => `<div class="ui-empty-card"><svg class="ui-icon"><use href="#i-plus"></use></svg></div>`;

function bindRow(root, selector, handler) {
  root.querySelectorAll(selector).forEach((button) => button.addEventListener("click", () => handler(button.dataset.key)));
}

export function renderTopProgress(state, root) {
  const steps = [state.selectedTopicKey, state.selectedContextKeys[0], state.selectedFeelingKey, state.selectedKeywordKey];
  root.innerHTML = steps.map((item, index) => `<span class="ui-progress-dot ${item ? "is-active" : index === 0 ? "is-active" : ""}"></span>`).join("");
}

export function renderTopicRow(state, root, handlers) {
  root.innerHTML = state.topics.map((topic) => `
    <button class="ui-topic-card ${state.selectedTopicKey === topic.key ? "is-selected" : ""}" type="button" data-key="${topic.key}">
      ${iconMarkup(topic.icon)}
      <span>${textOf(topic, state.locale)}</span>
    </button>
  `).join("");
  bindRow(root, "[data-key]", handlers.onTopic);
}

export function renderContextRow(state, root, handlers) {
  root.innerHTML = state.contexts.map((context) => `
    <button class="ui-context-card ${state.selectedContextKeys.includes(context.key) ? "is-selected" : ""}" type="button" data-key="${context.key}">
      ${iconMarkup(context.icon)}
      <span>${textOf(context, state.locale)}</span>
    </button>
  `).join("");
  bindRow(root, "[data-key]", handlers.onContext);
}

export function renderQuickActions(state, root) {
  root.innerHTML = state.quickActions.map((item) => `
    <button class="ui-quick-action ${item.active ? "is-active" : ""}" type="button">
      ${iconMarkup(item.icon)}
      <span>${textOf(item, state.locale)}</span>
    </button>
  `).join("");
}

export function renderTileRow(state, root, items, activeKey, handlers) {
  root.innerHTML = (items.length ? items : Array.from({ length: 3 }, () => null)).map((item) => item ? `
    <button class="ui-tile-card ${activeKey === item.key ? "is-selected" : ""}" type="button" data-key="${item.key}">
      ${iconMarkup(item.icon)}
      <span class="ui-tile-card__label">${textOf(item, state.locale)}</span>
      <span class="ui-tile-card__meta">${(item.metrics || [])[0] || "pick"}</span>
    </button>
  ` : emptyCard()).join("");
  bindRow(root, "[data-key]", handlers.onPick);
}

export function renderPrompt(state, refs, handlers) {
  refs.promptModeLabel.textContent = state.selectedDeeperKey ? "deep" : state.selectedKeywordKey ? "next" : state.selectedFeelingKey ? "focus" : "select";
  refs.promptQuestion.textContent = textOf({ label: state.prompt.question }, state.locale);
  refs.promptOptions.innerHTML = state.prompt.options.map((option) => `
    <button class="ui-option-card" type="button" data-key="${option.key}">
      ${iconMarkup(option.icon)}
      <span class="ui-option-card__label">${textOf(option, state.locale)}</span>
      <span class="ui-option-card__meta">tap</span>
    </button>
  `).join("");
  bindRow(refs.promptOptions, "[data-key]", handlers.onPrompt);
}

export function renderTrail(state, root) {
  root.innerHTML = state.trail.map((item) => `<span class="ui-trail-pill">${textOf(item, state.locale)}</span>`).join("");
}

export function renderHero(state, refs) {
  refs.activeTopicLabel.textContent = textOf({ label: state.topicData.heroTitle }, state.locale);
  refs.heroTitle.textContent = textOf({ label: state.topicData.heroTitle }, state.locale);
  refs.heroSubtitle.textContent = state.selectedItem?.detail ? textOf(state.selectedItem, state.locale, "detail") : textOf({ label: state.topicData.heroSubtitle }, state.locale);
  refs.focusTitle.textContent = textOf({ label: state.focusCard.title }, state.locale);
  refs.focusSubtitle.textContent = textOf({ label: state.focusCard.subtitle }, state.locale);
  refs.selectedCount.textContent = `${state.stats.selectedCount} ${state.locale === "vi" ? "chọn" : "picks"}`;
  refs.contextCount.textContent = String(state.stats.contextCount);
  refs.trailDepth.textContent = String(state.stats.trailDepth);
}

export function renderWheel(state, refs) {
  const segments = state.wheelSegments;
  refs.wheelVisual.style.setProperty("--seg-1", `color-mix(in srgb, ${segments[0].colorVar} ${segments[0].value}%, white)`);
  refs.wheelVisual.style.setProperty("--seg-2", `color-mix(in srgb, ${segments[1].colorVar} ${segments[1].value}%, white)`);
  refs.wheelVisual.style.setProperty("--seg-3", `color-mix(in srgb, ${segments[2].colorVar} ${segments[2].value}%, white)`);
  refs.wheelVisual.style.setProperty("--seg-4", `color-mix(in srgb, ${segments[3].colorVar} ${segments[3].value}%, white)`);
  refs.wheelLegend.innerHTML = segments.map((segment) => `
    <div class="ui-legend-item">
      <strong>${segment.value}%</strong>
      <span>${textOf(segment, state.locale)}</span>
    </div>
  `).join("");
}

export function renderDetail(state, refs, handlers) {
  const item = state.selectedItem;
  refs.detailKicker.textContent = state.locale === "vi" ? "Đang xem" : "Selected";
  refs.detailTitle.textContent = item ? textOf(item, state.locale) : "—";
  refs.detailCopy.textContent = item?.detail ? textOf(item, state.locale, "detail") : (state.locale === "vi" ? "Nhấn icon để mở chi tiết." : "Tap any icon tile to open detail.");
  refs.detailIcon.innerHTML = `<svg class="ui-icon"><use href="#${item?.icon || "i-grid"}"></use></svg>`;
  refs.detailMetrics.innerHTML = (item?.metrics || []).map((metric) => `<span class="ui-pill">${metric}</span>`).join("");
  refs.detailHintCount.textContent = String(state.detailOptions.length);
  refs.detailOptions.innerHTML = state.detailOptions.map((entry) => `
    <button class="ui-option-card" type="button" data-key="${entry.key}">
      ${iconMarkup(entry.icon)}
      <span class="ui-option-card__label">${textOf(entry, state.locale)}</span>
      <span class="ui-option-card__meta">next</span>
    </button>
  `).join("");
  bindRow(refs.detailOptions, "[data-key]", handlers.onDetailOption);
}

export function renderMobileNav(root, activeView) {
  root.querySelectorAll("[data-mobile-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mobileView === activeView);
  });
}
