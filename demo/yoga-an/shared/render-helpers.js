export const renderButtonRow = (buttons = []) => `
  <div class="button-row">
    ${buttons
      .map((button) => `<a class="button ${button.variant}" href="${button.href}">${button.label}</a>`)
      .join('')}
  </div>
`;

export const renderMetricGrid = (metrics = []) => `
  <div class="metric-grid" role="list">
    ${metrics
      .map(
        (metric) => `
          <div class="metric" role="listitem">
            <strong>${metric.value}</strong>
            <span>${metric.label}</span>
          </div>
        `,
      )
      .join('')}
  </div>
`;

export const renderBadgeRow = (badges = []) => `
  <div class="badge-row">
    ${badges.map((badge) => `<span class="badge">${badge}</span>`).join('')}
  </div>
`;
