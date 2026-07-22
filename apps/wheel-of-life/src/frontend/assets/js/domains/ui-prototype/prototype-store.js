import { CONTEXTS, ICONS, LOCALES, PROMPT_LIBRARY, QUICK_ACTIONS, TOPIC_DETAILS, TOPICS, WHEEL_SEGMENTS } from "./prototype-data.js";

const clampIndex = (items, key) => Math.max(0, items.findIndex((item) => item.key === key));

export function createPrototypeStore() {
  const state = {
    locale: LOCALES[0],
    selectedTopicKey: TOPICS[0].key,
    selectedContextKeys: [CONTEXTS[0].key, CONTEXTS[1].key],
    selectedFeelingKey: null,
    selectedKeywordKey: null,
    selectedDeeperKey: null,
    selectedItem: TOPICS[0],
    selectedKeywordTrail: [],
    mobileView: "explore"
  };

  const listeners = new Set();
  const emit = () => listeners.forEach((listener) => listener(getState()));

  const getTopicData = () => TOPIC_DETAILS[state.selectedTopicKey] ?? TOPIC_DETAILS[TOPICS[0].key];
  const getFeelings = () => getTopicData().feelings ?? [];
  const getKeywords = () => getTopicData().keywords[state.selectedFeelingKey] ?? [];
  const getDeeper = () => getTopicData().deeper[state.selectedKeywordKey] ?? [];
  const getPrompt = () => {
    if (state.selectedDeeperKey) return PROMPT_LIBRARY.deeper;
    if (state.selectedKeywordKey) return PROMPT_LIBRARY.keyword;
    if (state.selectedFeelingKey) return PROMPT_LIBRARY.feeling;
    return PROMPT_LIBRARY.base;
  };

  const getWheelSegments = () => {
    const tally = { career: 18, direction: 20, finance: 14, energy: 16 };
    state.selectedKeywordTrail.forEach((item) => {
      (item.metrics || []).forEach((metric) => {
        if (metric.includes("career") || metric.includes("growth")) tally.career += 10;
        if (metric.includes("direction") || metric.includes("identity")) tally.direction += 10;
        if (metric.includes("finance")) tally.finance += 12;
        if (metric.includes("energy") || metric.includes("time") || metric.includes("mind")) tally.energy += 10;
      });
    });
    return WHEEL_SEGMENTS.map((segment) => ({ ...segment, value: Math.min(92, tally[segment.key] ?? 12) }));
  };

  const getDetailOptions = () => {
    const deeper = getDeeper();
    const keywords = getKeywords();
    if (deeper.length) return deeper.slice(0, 4);
    if (keywords.length) return keywords.slice(0, 4);
    return getFeelings().slice(0, 4);
  };

  const getQuickActions = () => QUICK_ACTIONS.map((item, index) => ({
    ...item,
    active: index === 0 ? Boolean(state.selectedTopicKey) : index === 1 ? state.selectedContextKeys.length > 0 : state.selectedKeywordTrail.length > 0
  }));

  const getTrail = () => [
    TOPICS.find((item) => item.key === state.selectedTopicKey),
    ...state.selectedContextKeys.map((key) => CONTEXTS.find((item) => item.key === key)).filter(Boolean),
    ...state.selectedKeywordTrail
  ];

  const getState = () => ({
    ...state,
    topics: TOPICS,
    contexts: CONTEXTS,
    feelings: getFeelings(),
    keywords: getKeywords(),
    deeper: getDeeper(),
    topicData: getTopicData(),
    wheelSegments: getWheelSegments(),
    prompt: getPrompt(),
    quickActions: getQuickActions(),
    trail: getTrail(),
    detailOptions: getDetailOptions(),
    focusCard: {
      title: state.selectedItem?.label || getTopicData().heroTitle,
      subtitle: state.selectedItem?.detail || getTopicData().heroSubtitle,
      icon: state.selectedItem?.icon || ICONS.direction
    },
    stats: {
      contextCount: state.selectedContextKeys.length,
      trailDepth: state.selectedKeywordTrail.length,
      selectedCount: state.selectedKeywordTrail.length
    }
  });

  const selectTopic = (topicKey) => {
    state.selectedTopicKey = topicKey;
    state.selectedFeelingKey = null;
    state.selectedKeywordKey = null;
    state.selectedDeeperKey = null;
    state.selectedKeywordTrail = [];
    state.selectedItem = TOPICS.find((item) => item.key === topicKey) ?? null;
    emit();
  };

  const selectFeeling = (feelingKey) => {
    const feeling = getFeelings().find((item) => item.key === feelingKey) ?? null;
    state.selectedFeelingKey = feelingKey;
    state.selectedKeywordKey = null;
    state.selectedDeeperKey = null;
    state.selectedKeywordTrail = feeling ? [feeling] : [];
    state.selectedItem = feeling;
    emit();
  };

  const selectKeyword = (keywordKey) => {
    const keyword = getKeywords().find((item) => item.key === keywordKey) ?? null;
    state.selectedKeywordKey = keywordKey;
    state.selectedDeeperKey = null;
    state.selectedKeywordTrail = [...state.selectedKeywordTrail.slice(0, 1), ...(keyword ? [keyword] : [])];
    state.selectedItem = keyword;
    emit();
  };

  const selectDeeper = (deeperKey) => {
    const deeper = getDeeper().find((item) => item.key === deeperKey) ?? null;
    state.selectedDeeperKey = deeperKey;
    state.selectedKeywordTrail = [...state.selectedKeywordTrail.slice(0, 2), ...(deeper ? [deeper] : [])];
    state.selectedItem = deeper;
    emit();
  };

  const openFirst = (items, picker) => {
    const first = items[0];
    if (first) picker(first.key);
  };

  const cycleTopic = () => {
    const currentIndex = clampIndex(TOPICS, state.selectedTopicKey);
    const next = TOPICS[(currentIndex + 1) % TOPICS.length];
    selectTopic(next.key);
  };

  const selectPromptOption = (optionKey) => {
    const option = getPrompt().options.find((item) => item.key === optionKey);
    if (!option) return;
    state.selectedItem = option;
    const target = option.target;
    if (!target) return emit();
    if (target.type === "feeling:first") return openFirst(getFeelings(), selectFeeling);
    if (target.type === "keyword:first") return openFirst(getKeywords(), selectKeyword);
    if (target.type === "deeper:first") {
      if (getDeeper().length) return openFirst(getDeeper(), selectDeeper);
      return emit();
    }
    if (target.type === "keyword:next") {
      const keywords = getKeywords();
      const currentIndex = clampIndex(keywords, state.selectedKeywordKey);
      const next = keywords[(currentIndex + 1) % Math.max(1, keywords.length)];
      if (next) return selectKeyword(next.key);
      return emit();
    }
    if (target.type === "keyword:previous") {
      state.selectedDeeperKey = null;
      state.selectedItem = getKeywords().find((item) => item.key === state.selectedKeywordKey) ?? state.selectedItem;
      return emit();
    }
    if (target.type === "clear-feeling") {
      state.selectedFeelingKey = null;
      state.selectedKeywordKey = null;
      state.selectedDeeperKey = null;
      state.selectedKeywordTrail = [];
      state.selectedItem = TOPICS.find((item) => item.key === state.selectedTopicKey) ?? null;
      return emit();
    }
    if (target.type === "topic:next") return cycleTopic();
    if (target.type === "mobile-view") {
      state.mobileView = target.value;
      return emit();
    }
    if (target.type === "detail") return emit();
    emit();
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      listener(getState());
      return () => listeners.delete(listener);
    },
    getState,
    cycleLocale() {
      const currentIndex = LOCALES.indexOf(state.locale);
      state.locale = LOCALES[(currentIndex + 1) % LOCALES.length];
      emit();
    },
    setMobileView(viewKey) {
      state.mobileView = viewKey;
      emit();
    },
    selectTopic,
    toggleContext(contextKey) {
      const hasKey = state.selectedContextKeys.includes(contextKey);
      state.selectedContextKeys = hasKey
        ? state.selectedContextKeys.filter((key) => key !== contextKey)
        : [...state.selectedContextKeys, contextKey].slice(-4);
      state.selectedItem = CONTEXTS.find((item) => item.key === contextKey) ?? state.selectedItem;
      emit();
    },
    selectFeeling,
    selectKeyword,
    selectDeeper,
    selectPromptOption,
    openFirstFeeling() { openFirst(getFeelings(), selectFeeling); },
    focusNextDetailOption() {
      const first = getDetailOptions()[0];
      if (!first) return;
      if (getDeeper().some((item) => item.key === first.key)) return selectDeeper(first.key);
      if (getKeywords().some((item) => item.key === first.key)) return selectKeyword(first.key);
      if (getFeelings().some((item) => item.key === first.key)) return selectFeeling(first.key);
      emit();
    }
  };
}
