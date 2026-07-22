export const state = {
  selectedRoleId: null,
  loadedData: {
    profile: null,
    roles: [],
    groups: [],
    items: [],
    details: [],
    uiConfig: null,
  },
  openDetailId: null,
  isTransitioning: false,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};
