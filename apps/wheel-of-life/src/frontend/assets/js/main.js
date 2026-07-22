import { createPrototypeStore } from "./domains/ui-prototype/prototype-store.js";
import { bindDetailSheet, enableDragScroll } from "./domains/ui-prototype/interaction.js";
import { renderContextRow, renderDetail, renderHero, renderMobileNav, renderPrompt, renderQuickActions, renderTileRow, renderTopProgress, renderTopicRow, renderTrail, renderWheel } from "./domains/ui-prototype/renderers.js";

const refs = {
  appShell: document.querySelector("[data-role='app-shell']"),
  topProgress: document.querySelector("[data-role='top-progress']"),
  trailbar: document.querySelector("[data-role='trailbar']"),
  topicRow: document.querySelector("[data-role='topic-row']"),
  contextRow: document.querySelector("[data-role='context-row']"),
  feelingRow: document.querySelector("[data-role='feeling-row']"),
  keywordRow: document.querySelector("[data-role='keyword-row']"),
  deeperRow: document.querySelector("[data-role='deeper-row']"),
  activeTopicLabel: document.querySelector("[data-role='active-topic-label']"),
  feelingCount: document.querySelector("[data-role='feeling-count']"),
  keywordCount: document.querySelector("[data-role='keyword-count']"),
  deeperCount: document.querySelector("[data-role='deeper-count']"),
  heroTitle: document.querySelector("[data-role='hero-title']"),
  heroSubtitle: document.querySelector("[data-role='hero-subtitle']"),
  selectedCount: document.querySelector("[data-role='selected-count']"),
  wheelVisual: document.querySelector("[data-role='wheel-visual']"),
  wheelLegend: document.querySelector("[data-role='wheel-legend']"),
  promptModeLabel: document.querySelector("[data-role='prompt-mode-label']"),
  promptQuestion: document.querySelector("[data-role='prompt-question']"),
  promptOptions: document.querySelector("[data-role='prompt-options']"),
  localeIndicator: document.querySelector("[data-role='locale-indicator']"),
  detailSheet: document.querySelector("[data-role='detail-sheet']"),
  detailIcon: document.querySelector("[data-role='detail-icon']"),
  detailKicker: document.querySelector("[data-role='detail-kicker']"),
  detailTitle: document.querySelector("[data-role='detail-title']"),
  detailCopy: document.querySelector("[data-role='detail-copy']"),
  detailMetrics: document.querySelector("[data-role='detail-metrics']"),
  detailHintCount: document.querySelector("[data-role='detail-hint-count']"),
  detailOptions: document.querySelector("[data-role='detail-options']"),
  quickActions: document.querySelector("[data-role='quick-actions']"),
  focusTitle: document.querySelector("[data-role='focus-title']"),
  focusSubtitle: document.querySelector("[data-role='focus-subtitle']"),
  contextCount: document.querySelector("[data-role='context-count']"),
  trailDepth: document.querySelector("[data-role='trail-depth']"),
  bottomNav: document.querySelector("[data-role='bottom-nav']")
};

const store = createPrototypeStore();

const openDetail = () => {
  refs.detailSheet.classList.add("is-open");
  refs.detailSheet.setAttribute("aria-hidden", "false");
};
const closeDetail = () => {
  refs.detailSheet.classList.remove("is-open");
  refs.detailSheet.setAttribute("aria-hidden", "true");
  if (refs.appShell.dataset.mobileView === "detail") {
    store.setMobileView("explore");
  }
};

function render(state) {
  refs.appShell.dataset.mobileView = state.mobileView;
  refs.localeIndicator.textContent = state.locale.toUpperCase();
  refs.feelingCount.textContent = String(state.feelings.length);
  refs.keywordCount.textContent = String(state.keywords.length);
  refs.deeperCount.textContent = String(state.deeper.length);

  renderTopProgress(state, refs.topProgress);
  renderQuickActions(state, refs.quickActions);
  renderTrail(state, refs.trailbar);
  renderTopicRow(state, refs.topicRow, { onTopic: (key) => store.selectTopic(key) });
  renderContextRow(state, refs.contextRow, { onContext: (key) => store.toggleContext(key) });
  renderTileRow(state, refs.feelingRow, state.feelings, state.selectedFeelingKey, {
    onPick: (key) => {
      store.selectFeeling(key);
      openDetail();
    }
  });
  renderTileRow(state, refs.keywordRow, state.keywords, state.selectedKeywordKey, {
    onPick: (key) => {
      store.selectKeyword(key);
      openDetail();
    }
  });
  renderTileRow(state, refs.deeperRow, state.deeper, state.selectedDeeperKey, {
    onPick: (key) => {
      store.selectDeeper(key);
      openDetail();
    }
  });
  renderHero(state, refs);
  renderWheel(state, refs);
  renderPrompt(state, refs, {
    onPrompt: (key) => {
      store.selectPromptOption(key);
      openDetail();
    }
  });
  renderDetail(state, refs, {
    onDetailOption: (key) => {
      const current = state.detailOptions.find((item) => item.key === key);
      if (!current) return;
      if (state.deeper.some((item) => item.key === key)) store.selectDeeper(key);
      else if (state.keywords.some((item) => item.key === key)) store.selectKeyword(key);
      else if (state.feelings.some((item) => item.key === key)) store.selectFeeling(key);
    }
  });
  renderMobileNav(refs.bottomNav, state.mobileView);
}

store.subscribe(render);

[
  refs.trailbar,
  refs.topicRow,
  refs.contextRow,
  refs.feelingRow,
  refs.keywordRow,
  refs.deeperRow,
  refs.promptOptions,
  refs.detailOptions,
  refs.quickActions,
  refs.wheelLegend
].forEach(enableDragScroll);

bindDetailSheet(refs.detailSheet, {
  close: closeDetail,
  pickCurrent: closeDetail,
  next: () => {
    store.focusNextDetailOption();
    openDetail();
  }
});

document.querySelectorAll("[data-action='cycle-locale']").forEach((button) => button.addEventListener("click", () => store.cycleLocale()));
document.querySelectorAll("[data-action='open-detail']").forEach((button) => button.addEventListener("click", openDetail));
document.querySelectorAll("[data-mobile-view]").forEach((button) => {
  button.addEventListener("click", () => {
    const viewKey = button.dataset.mobileView;
    store.setMobileView(viewKey);
    if (viewKey === "detail") openDetail();
    else if (viewKey !== "detail") closeDetail();
  });
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDetail();
});
