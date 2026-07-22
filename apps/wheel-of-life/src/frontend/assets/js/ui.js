// UI rendering helpers.
// Keep DOM creation logic grouped here so app logic stays smaller.
(function () {
  function renderFeelings() {
    const grid = document.querySelector('[data-role="feeling-grid"]');
    if (!grid) return;

    grid.innerHTML = window.ctSeed.feelings
      .map((item) => `
        <button class="ct-choice-card" data-role="feeling-card" data-feeling-id="${item.id}">
          <strong>${item.title}</strong>
          <span class="ct-muted">${item.subtitle}</span>
        </button>
      `)
      .join('');
  }

  function updateTrail() {
    const trail = document.querySelector('[data-role="context-trail"]');
    if (!trail) return;

    const parts = [];
    if (window.ctState.sessionId) parts.push(`session:${window.ctState.sessionId}`);
    if (window.ctState.context?.age_range) parts.push(window.ctState.context.age_range);
    if (window.ctState.context?.life_stage) parts.push(window.ctState.context.life_stage);
    if (window.ctState.context?.career_stage) parts.push(window.ctState.context.career_stage);
    if (window.ctState.selectedFeeling) parts.push(window.ctState.selectedFeeling);
    window.ctState.selectedKeywords.forEach((item) => parts.push(item));
    (window.ctState.contextTrail || []).slice(-2).forEach((item) => parts.push(item.label || item.event_type));

    trail.innerHTML = parts.length
      ? parts.map((part) => `<span class="ct-chip">${part}</span>`).join('')
      : '<span class="ct-chip">Chưa có context</span>';
  }

  function renderKeywordLanes(lanes) {
    const board = document.querySelector('[data-role="keyword-lanes"]');
    if (!board) return;
    if (!lanes.length) {
      board.innerHTML = '<p class="ct-muted">Hãy chọn một feeling để mở tầng keyword đầu tiên.</p>';
      return;
    }

    board.innerHTML = lanes
      .map((lane, index) => `
        <section class="ct-lane">
          <div class="ct-lane-head">
            <strong>Tầng ${index + 1}</strong>
            <span class="ct-muted">${lane.title}</span>
          </div>
          <div class="ct-pill-wrap">
            ${lane.items
              .map(
                (item) => `
                  <button
                    class="ct-keyword-pill ${window.ctState.selectedKeywords.includes(item.id) ? 'is-selected' : ''}"
                    data-role="keyword-pill"
                    data-node-id="${item.id}"
                  >
                    ${item.label}
                  </button>
                `,
              )
              .join('')}
          </div>
        </section>
      `)
      .join('');
  }

  function renderNodeDetail(payload) {
    const box = document.querySelector('[data-role="node-detail"]');
    if (!box) return;
    if (!payload?.node) {
      box.innerHTML = '<p class="ct-muted">Chọn một keyword để xem prompt gợi mở và các nhánh liên quan.</p>';
      return;
    }

    const prompts = (payload.node.clarifying_prompts || []).map((item) => `<li>${item}</li>`).join('');
    const childBadges = (payload.children || []).map((item) => `<span class="ct-badge">${item.label}</span>`).join('');
    const relatedBadges = (payload.related || []).map((item) => `<span class="ct-badge">${item.label}</span>`).join('');

    box.innerHTML = `
      <article class="ct-detail-card">
        <div class="ct-detail-grid">
          <div>
            <strong>${payload.node.label}</strong>
            <p class="ct-muted">Depth ${payload.node.depth} • ${payload.node.kind}</p>
          </div>
          <div>
            <strong>Prompt gợi mở</strong>
            <ul class="ct-list">${prompts || '<li>Chưa có prompt.</li>'}</ul>
          </div>
          <div>
            <strong>Child nodes</strong>
            <div class="ct-inline-badges">${childBadges || '<span class="ct-muted">Chưa có.</span>'}</div>
          </div>
          <div>
            <strong>Related nodes</strong>
            <div class="ct-inline-badges">${relatedBadges || '<span class="ct-muted">Chưa có.</span>'}</div>
          </div>
        </div>
      </article>
    `;
  }

  function renderAIOutput(payload) {
    const box = document.querySelector('[data-role="ai-output"]');
    if (!box) return;
    const selectablePromptHtml = payload.selectable_prompt
      ? `
        <strong>${payload.selectable_prompt.question}</strong>
        <div class="ct-pill-wrap">
          ${(payload.selectable_prompt.options || []).map((item) => `<span class="ct-badge">${item}</span>`).join('')}
        </div>
      `
      : '';
    box.innerHTML = `
      <article class="ct-detail-card">
        <strong>Tóm tắt</strong>
        <p>${payload.summary}</p>
        <strong>Khả năng đang diễn ra</strong>
        <ul class="ct-list">${payload.possible_patterns.map((item) => `<li>${item}</li>`).join('')}</ul>
        ${selectablePromptHtml}
        <strong>Câu hỏi tiếp</strong>
        <ul class="ct-list">${payload.follow_up_questions.map((item) => `<li>${item}</li>`).join('')}</ul>
        <strong>Gợi ý path tiếp</strong>
        <p>${(payload.next_keyword_paths || []).join(', ') || 'Chưa có'}</p>
        <p class="ct-muted">${payload.confidence_note || ''}</p>
      </article>
    `;
  }

  function renderWheelPreview(payload) {
    const box = document.querySelector('[data-role="wheel-output"]');
    if (!box) return;
    if (!payload?.life_area_scores?.length) {
      box.innerHTML = '<p class="ct-muted">Chưa có đủ keyword để map sang wheel.</p>';
      return;
    }
    box.innerHTML = payload.life_area_scores
      .map((item) => `
        <article class="ct-score-card">
          <div class="ct-score-row">
            <strong>${item.life_area_label}</strong>
            <span>${item.score}</span>
          </div>
          <div class="ct-progress"><span style="width:${Math.min(item.score, 100)}%"></span></div>
          <p class="ct-muted">Evidence: ${item.evidence.map((ev) => ev.label).join(', ')}</p>
        </article>
      `)
      .join('');
  }

  function renderAuditInline(payload) {
    const box = document.querySelector('[data-role="audit-inline"]');
    if (!box) return;
    if (!payload) {
      box.innerHTML = '';
      return;
    }
    const issueCount = Object.values(payload.issues || {}).reduce((total, arr) => total + arr.length, 0);
    box.innerHTML = `
      <article class="ct-audit-card">
        <strong>${payload.ok ? '<span class="ct-audit-ok">Seed audit OK</span>' : '<span class="ct-audit-bad">Seed audit có vấn đề</span>'}</strong>
        <p class="ct-muted">Nodes: ${payload.node_count} • Tổng issue ghi nhận: ${issueCount}</p>
      </article>
    `;
  }

  window.ctUI = {
    renderFeelings,
    updateTrail,
    renderKeywordLanes,
    renderNodeDetail,
    renderAIOutput,
    renderWheelPreview,
    renderAuditInline,
  };
})();
