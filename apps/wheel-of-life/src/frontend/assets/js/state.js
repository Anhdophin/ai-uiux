// Central in-memory state for scaffold demo.
// Later this can move to a formal store without changing UI contracts.
window.ctState = {
  apiBaseUrl: 'http://127.0.0.1:8000/api',
  sessionId: null,
  context: null,
  contextTrail: [],
  selectedFeeling: null,
  selectedKeywords: [],
  reflection: '',
  laneNodeIds: [],
  activeNodeId: null,
};
