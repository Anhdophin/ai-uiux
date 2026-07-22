// App bootstrap and interaction wiring.
// Keep this file focused on orchestration, not heavy domain logic.
// v6 update: selection-first context and locale-aware AI payload.
(function () {
  const apiBase = window.ctState.apiBaseUrl;
  const {
    renderFeelings,
    updateTrail,
    renderKeywordLanes,
    renderNodeDetail,
    renderAIOutput,
    renderWheelPreview,
    renderAuditInline,
  } = window.ctUI;

  function buildFallbackLanes(feelingId) {
    const items = window.ctSeed.feelings
      .filter((item) => item.id === feelingId)
      .map((item) => ({ id: item.id, label: item.title }));
    return items.length ? [{ title: 'Feeling root', items }] : [];
  }

  async function fetchJson(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  }

  async function loadNodeChildren(nodeId) {
    return fetchJson(`${apiBase}/keyword/${nodeId}/children`);
  }

  async function requestWheelPreview() {
    const payload = { selected_keyword_ids: window.ctState.selectedKeywords || [] };
    try {
      const data = await fetchJson(`${apiBase}/wheel/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      renderWheelPreview(data);
    } catch (error) {
      renderWheelPreview({ life_area_scores: [] });
      console.error(error);
    }
  }

  function buildUserRealityContext() {
    const ctx = window.ctState.context || {};
    return {
      locale: ctx.locale || 'vi',
      life_setup: ctx.life_setup || 'working_few_years',
      current_pressures: [ctx.primary_pressure || 'career_pressure'],
      current_goals: [ctx.primary_goal || 'find_direction'],
      constraints: [],
      readiness_level: 'want_direction_suggestions',
      custom_keywords: [],
      note_fragment: window.ctState.reflection || null,
    };
  }

  async function requestAIDeepening() {
    const payload = {
      locale: window.ctState.context?.locale || 'vi',
      mode: 'deepen_selection',
      context_profile: {
        age_range: window.ctState.context?.age_range || '25-29',
        gender: window.ctState.context?.gender || 'male',
        life_stage: window.ctState.context?.life_stage || 'working',
        career_stage: window.ctState.context?.career_stage || 'early',
        goals: [],
        concerns: [],
      },
      user_reality_context: buildUserRealityContext(),
      feeling: {
        feeling_id: window.ctState.selectedFeeling || 'unclear_direction',
        intensity: 3,
        frequency: 'often',
        note: null,
      },
      selected_keywords: window.ctState.selectedKeywords,
      reflection_snippet: window.ctState.reflection || null,
    };

    try {
      const data = await fetchJson(`${apiBase}/ai/deepen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      renderAIOutput(data);
    } catch (error) {
      renderAIOutput({
        locale: 'vi',
        summary: 'Chưa kết nối được backend AI scaffold.',
        possible_patterns: ['Hãy chạy backend FastAPI trước.'],
        follow_up_questions: ['Backend đã chạy tại port 8000 chưa?'],
        next_keyword_paths: [],
        selectable_options: ['Kiểm tra backend local'],
        confidence_note: 'Lỗi kết nối local.',
      });
      console.error(error);
    }
  }

  async function runSeedAudit() {
    try {
      const data = await fetchJson(`${apiBase}/audit/seed`);
      renderAuditInline(data);
    } catch (error) {
      renderAuditInline({ ok: false, node_count: 0, issues: {} });
      console.error(error);
    }
  }

  function setFeeling(feelingId) {
    window.ctState.selectedFeeling = feelingId;
    window.ctState.selectedKeywords = [feelingId];
    window.ctState.laneNodeIds = [feelingId];
    window.ctState.activeNodeId = feelingId;
    updateTrail();
  }

  async function loadJourneyFromFeeling(feelingId) {
    setFeeling(feelingId);
    try {
      const payload = await loadNodeChildren(feelingId);
      renderKeywordLanes([
        { title: 'Feeling root', items: [payload.node] },
        { title: 'Child nodes', items: payload.children },
        payload.related?.length ? { title: 'Related nodes', items: payload.related } : null,
      ].filter(Boolean));
      renderNodeDetail(payload);
      await requestWheelPreview();
    } catch (error) {
      renderKeywordLanes(buildFallbackLanes(feelingId));
      renderNodeDetail(null);
      renderWheelPreview({ life_area_scores: [] });
      console.error(error);
    }
  }

  async function expandNode(nodeId) {
    if (!window.ctState.selectedKeywords.includes(nodeId)) {
      window.ctState.selectedKeywords.push(nodeId);
    }
    window.ctState.activeNodeId = nodeId;
    updateTrail();

    try {
      const payload = await loadNodeChildren(nodeId);
      const rootFeelingId = window.ctState.selectedFeeling;
      const lanes = [];
      if (rootFeelingId) {
        lanes.push({ title: 'Feeling root', items: [{ id: rootFeelingId, label: rootFeelingId }] });
      }
      lanes.push({ title: 'Node đang mở', items: [payload.node] });
      if (payload.children?.length) lanes.push({ title: 'Child nodes', items: payload.children });
      if (payload.related?.length) lanes.push({ title: 'Related nodes', items: payload.related });
      renderKeywordLanes(lanes);
      renderNodeDetail(payload);
      await requestWheelPreview();
    } catch (error) {
      console.error(error);
    }
  }

  function bindContextForm() {
    const form = document.querySelector('[data-role="context-form"]');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      window.ctState.context = Object.fromEntries(formData.entries());
      updateTrail();
      fetchJson(`${apiBase}/session/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: window.ctState.context.locale || 'vi',
          context_profile: {
            age_range: window.ctState.context.age_range || '25-29',
            gender: window.ctState.context.gender || 'male',
            life_stage: window.ctState.context.life_stage || 'working',
            career_stage: window.ctState.context.career_stage || 'early',
            goals: [],
            concerns: [],
          },
          user_reality_context: buildUserRealityContext(),
        }),
      }).then((session) => {
        window.ctState.sessionId = session.session_id;
        window.ctState.contextTrail = session.trail || [];
        updateTrail();
      }).catch((error) => console.error(error));
    });
  }

  function bindGlobalClicks() {
    document.addEventListener('click', async (event) => {
      const feelingButton = event.target.closest('[data-role="feeling-card"]');
      if (feelingButton) {
        document.querySelectorAll('[data-role="feeling-card"]').forEach((card) => card.classList.remove('is-selected'));
        feelingButton.classList.add('is-selected');
        await loadJourneyFromFeeling(feelingButton.dataset.feelingId);
        if (window.ctState.sessionId) {
          fetchJson(`${apiBase}/session/${window.ctState.sessionId}/selection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_type: 'feeling_selected', selected_id: feelingButton.dataset.feelingId }),
          }).then((session) => { window.ctState.contextTrail = session.trail || []; updateTrail(); }).catch((error) => console.error(error));
        }
        return;
      }

      const keywordButton = event.target.closest('[data-role="keyword-pill"]');
      if (keywordButton) {
        await expandNode(keywordButton.dataset.nodeId);
        if (window.ctState.sessionId) {
          fetchJson(`${apiBase}/session/${window.ctState.sessionId}/selection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_type: 'keyword_selected', selected_id: keywordButton.dataset.nodeId }),
          }).then((session) => { window.ctState.contextTrail = session.trail || []; updateTrail(); }).catch((error) => console.error(error));
        }
        return;
      }

      const saveReflection = event.target.closest('[data-role="save-reflection"]');
      if (saveReflection) {
        const input = document.querySelector('[data-role="reflection-input"]');
        window.ctState.reflection = input?.value?.trim() || '';
        if (window.ctState.sessionId) {
          fetchJson(`${apiBase}/session/${window.ctState.sessionId}/selection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_type: 'reflection_updated', note_fragment: window.ctState.reflection || null }),
          }).then((session) => { window.ctState.contextTrail = session.trail || []; updateTrail(); }).catch((error) => console.error(error));
        }
        return;
      }

      const askAI = event.target.closest('[data-role="ask-ai"]');
      if (askAI) {
        await requestAIDeepening();
        return;
      }

      const runAudit = event.target.closest('[data-action="run-seed-audit"]');
      if (runAudit) {
        await runSeedAudit();
      }
    });
  }

  function init() {
    renderFeelings();
    bindContextForm();
    bindGlobalClicks();
    updateTrail();
  }

  init();
})();
