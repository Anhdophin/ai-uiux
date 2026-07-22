import { rootPath, setupSharedShell } from '../../js/modules.js';

setupSharedShell(rootPath());

const templateData = {
	personal: {
		strengths: [
			'Kỹ năng mềm', 'Tư duy phản biện', 'Khả năng học nhanh',
			'Kỹ năng giao tiếp', 'Kinh nghiệm', 'Sáng tạo',
			'Kỹ năng AI/Tech', 'Giải quyết vấn đề', 'Lãnh đạo'
		],
		weaknesses: [
			'Quản lý thời gian', 'Thiếu kinh nghiệm', 'Ít tự tin',
			'Kỹ năng kỹ thuật', 'Bé buồn dễ', 'Thiếu tập trung',
			'Không thành thạo ngoại ngữ', 'Nỗi sợ thất bại', 'Kì vọng quá cao'
		],
		opportunities: [
			'Khóa học trực tuyến', 'Networking', 'Tình nguyện',
			'Dự án cá nhân', 'Công việc mới', 'Mentoring',
			'Cộng đồng tech', 'Sáng kiến riêng', 'Hợp tác'
		],
		threats: [
			'Thị trường cạnh tranh', 'Công nghệ cũ', 'Suy thoái kinh tế',
			'Thay đổi nhanh', 'Tự động hóa', 'Học vị không đủ',
			'Health issues', 'Động lực giảm', 'Áp suất xã hội'
		]
	},
	business: {
		strengths: [
			'Thương hiệu mạnh', 'Vị trí thị trường', 'Mạng lưới khách hàng',
			'Sản phẩm chất lượng', 'Đội ngũ giỏi', 'Tài chính ổn định',
			'Công nghệ tự động', 'Dịch vụ chăm sóc tốt', 'Giá cạnh tranh'
		],
		weaknesses: [
			'Quản lý không hiệu quả', 'Chi phí cao', 'Tư cấp hạn chế',
			'Sản xuất chậm', 'Lợi nhuận thấp', 'Nợ lớn',
			'Hệ thống lạc hậu', 'Nhân viên năng suất thấp', 'Tài trợ khó khăn'
		],
		opportunities: [
			'Thị trường mới', 'Sản phẩm mới', 'Hợp tác chiến lược',
			'Công nghệ mới', 'Mở rộng địa lý', 'M&A',
			'Kinh tế phân tán', 'Nhãn hiệu mở rộng', 'Export'
		],
		threats: [
			'Cạnh tranh tăng', 'Thay đổi quy định', 'Suy thoái kinh tế',
			'Đội ngũ rủi ro', 'Sự thay đổi gu khách', 'Nguyên liệu tăng',
			'Công nghệ disrupt', 'Vấn đề môi trường', 'Thay đổi tiêu thụ'
		]
	},
	production: {
		strengths: [
			'Quy trình tối ưu', 'Máy móc hiện đại', 'Nhân viên kỹ năng cao',
			'Chi phí sản xuất thấp', 'Sản lượng cao', 'Địa điểm suất vấn',
			'Kiểm soát chất lượng', 'Đóng gói bền vững', 'Chuỗi cung ứng'
		],
		weaknesses: [
			'Thiết bị cũ', 'Bảo trì quá tải', 'Nhân viên không đủ',
			'Bỏng phế thải', 'Tiêu chuẩn XK kém', 'Không sẵn sàng',
			'Năng lực hạn chế', 'Bảo mật yếu', 'Không agile'
		],
		opportunities: [
			'Tự động hóa', 'Công nghệ xanh', 'Mô hình circular',
			'Mở rộng nhà máy', 'Sản phẩm mới', 'Thị trường mới',
			'Đại lý mới', 'Robotics', 'AI/ML tối ưu'
		],
		threats: [
			'Giá nguyên liệu', 'Cạnh tranh giá', 'Logistics tắc',
			'Quy định môi trường', 'Su cộng ứng', 'Sốc thị trường',
			'Thiếu nhân công', 'Phát thải cao', 'Điểm yếu kỹ thuật'
		]
	},
	finance: {
		strengths: [
			'Dòng tiền mạnh', 'Tỷ lệ margin cao', 'Tài sản lớn',
			'Không nợ', 'Chi phí thấp', 'Thu nhập ổn định',
			'Mô hình revenu đa dạng', 'Credit rating tốt', 'Nền tảng vững'
		],
		weaknesses: [
			'Dòng tiền âm', 'Nợ cao', 'Lợi nhuận âm',
			'Chi phí quá cao', 'Vốn chủ sở hữu yếu', 'Lợi tức thấp',
			'Công nợ lâu', 'Hệ thống tài chính lạc hậu', 'Quy mô nhỏ'
		],
		opportunities: [
			'Tăng giá bán', 'Mở vốn mới', 'Tiết kiệm chi phí',
			'Khoảng rộng mới', 'IPO', 'Cân bằng danh mục',
			'Tài chính xanh', 'Fintech', 'Tử nhân thêm'
		],
		threats: [
			'Lãi suất tăng', 'Suy thoái', 'Biến động tiền tệ',
			'Tăng thuế', 'Credit crunch', 'Lạm phát',
			'Rủi ro địa chính trị', 'Sụp đổ thị trường', 'Quy định tighter'
		]
	}
};

const swotNames = {
	strengths: 'Strengths',
	weaknesses: 'Weaknesses',
	opportunities: 'Opportunities',
	threats: 'Threats'
};

const swotColorMap = {
	strengths: 'swot-s',
	weaknesses: 'swot-w',
	opportunities: 'swot-o',
	threats: 'swot-t'
};

const exportChartColorMap = {
	strengths: '#22c55e',
	weaknesses: '#ef4444',
	opportunities: '#3b82f6',
	threats: '#f97316'
};

const SUMMARY_API_ENDPOINT = '/api/swot-summary';

const sections = Array.from(document.querySelectorAll('[data-field-key].swot-items'));
const resultBox = document.getElementById('resultBox');
const buildBtn = document.getElementById('buildBtn');
const copyBtn = document.getElementById('copyBtn');
const exportJpgBtn = document.getElementById('exportJpgBtn');
const templateContainer = document.getElementById('templateContainer');
const themeTabs = document.querySelectorAll('.theme-tab');

let hasShownBackendFallback = false;

function renderTemplateGroup(theme, container) {
	container.innerHTML = '';
	const templates = templateData[theme];
	const swotOrder = ['strengths', 'weaknesses', 'opportunities', 'threats'];

	swotOrder.forEach((field) => {
		const items = templates[field];
		if (!items || items.length === 0) {
			return;
		}

		const group = document.createElement('div');
		group.className = `template-group ${swotColorMap[field]}`;

		const header = document.createElement('div');
		header.className = 'template-group-header';

		const label = document.createElement('div');
		label.className = 'template-group-label';
		label.textContent = swotNames[field].substring(0, 1);

		const title = document.createElement('span');
		title.textContent = swotNames[field];

		header.appendChild(label);
		header.appendChild(title);

		const row = document.createElement('div');
		row.className = 'template-items-row';

		items.forEach((template) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'template-item';
			button.textContent = template;
			button.addEventListener('click', () => fillTemplate(field, template));
			row.appendChild(button);
		});

		group.appendChild(header);
		group.appendChild(row);
		container.appendChild(group);
	});
}

function renderMobileFieldTemplates(filterContainer) {
	const fieldKey = filterContainer.dataset.fieldKey;
	const currentTheme = document.querySelector('.theme-tab.active')?.dataset.theme || 'personal';
	const items = templateData[currentTheme]?.[fieldKey];
	filterContainer.innerHTML = '';

	if (!items || items.length === 0) {
		return;
	}

	const group = document.createElement('div');
	group.className = `template-group ${swotColorMap[fieldKey]}`;

	const header = document.createElement('div');
	header.className = 'template-group-header';
	header.style.marginBottom = '8px';

	const label = document.createElement('div');
	label.className = 'template-group-label';
	label.textContent = swotNames[fieldKey].substring(0, 1);

	const title = document.createElement('span');
	title.textContent = `Chọn ${swotNames[fieldKey]}`;

	header.appendChild(label);
	header.appendChild(title);

	const row = document.createElement('div');
	row.className = 'template-items-row';

	items.forEach((template) => {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'template-item';
		button.textContent = template;
		button.addEventListener('click', () => fillTemplate(fieldKey, template));
		row.appendChild(button);
	});

	group.appendChild(header);
	group.appendChild(row);
	filterContainer.appendChild(group);
}

function renderTemplates(theme) {
	renderTemplateGroup(theme, templateContainer);
	document.querySelectorAll('.swot-mobile-filter').forEach((filter) => {
		renderMobileFieldTemplates(filter);
	});
}

function createSwotItem(value = '', score = 0) {
	const item = document.createElement('div');
	item.className = 'swot-item';
	item.innerHTML = `
		<input type="text" value="${value}" placeholder="Nhập nội dung..." class="swot-input">
		<input type="range" min="0" max="100" value="${score}" class="swot-slider">
		<div class="swot-value">${score}%</div>
	`;

	const input = item.querySelector('.swot-input');
	const slider = item.querySelector('.swot-slider');
	const valueDisplay = item.querySelector('.swot-value');

	slider.addEventListener('input', () => {
		valueDisplay.textContent = `${slider.value}%`;
	});

	input.addEventListener('focus', () => {
		const container = input.closest('.swot-items');
		const items = Array.from(container.querySelectorAll('.swot-item'));
		const lastItem = items[items.length - 1];
		const lastInput = lastItem.querySelector('.swot-input');
		if (lastInput.value.trim()) {
			container.appendChild(createSwotItem());
		}
	});

	input.addEventListener('keypress', (event) => {
		if (event.key !== 'Enter') {
			return;
		}

		event.preventDefault();
		const container = input.closest('.swot-items');
		const items = Array.from(container.querySelectorAll('.swot-item'));
		const currentIndex = items.indexOf(item);
		if (currentIndex < items.length - 1) {
			items[currentIndex + 1].querySelector('.swot-input').focus();
		}
	});

	return item;
}

function fillTemplate(fieldKey, templateValue) {
	const section = sections.find((entry) => entry.dataset.fieldKey === fieldKey);
	if (!section) {
		return;
	}

	const items = Array.from(section.querySelectorAll('.swot-item'));
	const targetItem = items.find((item) => !item.querySelector('.swot-input').value.trim()) || items[items.length - 1];

	if (!targetItem) {
		return;
	}

	const input = targetItem.querySelector('.swot-input');
	input.value = templateValue;
	input.focus();

	if (targetItem === items[items.length - 1] && templateValue.trim()) {
		section.appendChild(createSwotItem());
	}
}

function collectSwotPayload() {
	return sections.map((section) => {
		const label = section.dataset.fieldLabel || '';
		const key = section.dataset.fieldKey || '';
		const items = Array.from(section.querySelectorAll('.swot-item'))
			.map((item) => {
				const input = item.querySelector('.swot-input');
				const slider = item.querySelector('.swot-slider');
				const text = input.value.trim();
				const score = Number(slider.value || 0);
				return text ? { text, score } : null;
			})
			.filter(Boolean);

		return { key, label, items };
	});
}

function buildOutputLocal(payload) {
	const lines = payload.map((section) => {
		const filledItems = section.items.map((item) => `• ${item.text}`);
		return filledItems.length
			? `## ${section.label}\n${filledItems.join('\n')}`
			: `## ${section.label}\n(chưa nhập)`;
	});

	return `BẢN GHI NHANH\n\n${lines.join('\n\n')}`;
}

async function buildOutput() {
	const payload = collectSwotPayload();
	const originalText = buildBtn.textContent;
	buildBtn.disabled = true;
	buildBtn.textContent = 'Đang xử lý...';

	try {
		const response = await fetch(SUMMARY_API_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ sections: payload })
		});

		if (!response.ok) {
			throw new Error(`API failed: ${response.status}`);
		}

		const data = await response.json();
		if (!data || typeof data.summary !== 'string') {
			throw new Error('Malformed response');
		}

		resultBox.textContent = data.summary;
	} catch (error) {
		resultBox.textContent = buildOutputLocal(payload);
		if (!hasShownBackendFallback) {
			hasShownBackendFallback = true;
			console.warn('Backend unavailable, used local fallback summary.', error);
		}
	} finally {
		buildBtn.disabled = false;
		buildBtn.textContent = originalText;
	}
}

async function copyResult() {
	try {
		await navigator.clipboard.writeText(resultBox.textContent);
		copyBtn.textContent = 'Đã copy';
		setTimeout(() => {
			copyBtn.textContent = 'Copy text';
		}, 1400);
	} catch {
		window.alert('Trình duyệt chưa cho copy tự động.');
	}
}

function loadHtml2canvas() {
	if (window.html2canvas) {
		return Promise.resolve(window.html2canvas);
	}

	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
		script.onload = () => resolve(window.html2canvas);
		script.onerror = () => reject(new Error('Không tải được html2canvas.'));
		document.body.appendChild(script);
	});
}

function downloadBlob(blob, filename) {
	const link = document.createElement('a');
	link.style.display = 'none';
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(link.href);
}

function downloadDataUrl(dataUrl, filename) {
	const link = document.createElement('a');
	link.style.display = 'none';
	link.href = dataUrl;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function createExportOverviewChart(chartData) {
	function createRadarPizzaSvg(data) {
		const size = 220;
		const center = size / 2;
		const maxRadius = 82;
		const axisAngles = [-90, 0, 90, 180];
		const maxTotal = Math.max(...data.map((item) => item.totalPercent), 1);

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
		svg.setAttribute('width', String(size));
		svg.setAttribute('height', String(size));
		svg.style.display = 'block';

		const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		bg.setAttribute('cx', String(center));
		bg.setAttribute('cy', String(center));
		bg.setAttribute('r', String(maxRadius));
		bg.setAttribute('fill', '#f8fafc');
		bg.setAttribute('stroke', '#e5e7eb');
		bg.setAttribute('stroke-width', '1');
		svg.appendChild(bg);

		[0.25, 0.5, 0.75, 1].forEach((ratio) => {
			const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			ring.setAttribute('cx', String(center));
			ring.setAttribute('cy', String(center));
			ring.setAttribute('r', String(maxRadius * ratio));
			ring.setAttribute('fill', 'none');
			ring.setAttribute('stroke', '#d1d5db');
			ring.setAttribute('stroke-width', '1');
			svg.appendChild(ring);
		});

		axisAngles.forEach((deg) => {
			const rad = (deg * Math.PI) / 180;
			const x = center + maxRadius * Math.cos(rad);
			const y = center + maxRadius * Math.sin(rad);
			const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			axis.setAttribute('x1', String(center));
			axis.setAttribute('y1', String(center));
			axis.setAttribute('x2', String(x));
			axis.setAttribute('y2', String(y));
			axis.setAttribute('stroke', '#d1d5db');
			axis.setAttribute('stroke-width', '1');
			svg.appendChild(axis);
		});

		data.forEach((item, index) => {
			const initial = (item.label || '?').trim().charAt(0).toUpperCase();
			const rad = (axisAngles[index] * Math.PI) / 180;
			const x = center + (maxRadius + 14) * Math.cos(rad);
			const y = center + (maxRadius + 14) * Math.sin(rad);
			const axisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			axisLabel.setAttribute('x', String(x));
			axisLabel.setAttribute('y', String(y + 3));
			axisLabel.setAttribute('text-anchor', 'middle');
			axisLabel.setAttribute('font-size', '11');
			axisLabel.setAttribute('font-weight', '700');
			axisLabel.setAttribute('fill', exportChartColorMap[item.key] || '#374151');
			axisLabel.textContent = initial;
			svg.appendChild(axisLabel);
		});

		const points = data.map((item, index) => {
			const value = Math.max(0, item.totalPercent);
			const ratio = value / maxTotal;
			const rad = (axisAngles[index] * Math.PI) / 180;
			const x = center + maxRadius * ratio * Math.cos(rad);
			const y = center + maxRadius * ratio * Math.sin(rad);
			const initial = (item.label || '?').trim().charAt(0).toUpperCase();
			return { x, y, color: exportChartColorMap[item.key] || '#6b7280', initial };
		});

		const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
		polygon.setAttribute('points', points.map((point) => `${point.x},${point.y}`).join(' '));
		polygon.setAttribute('fill', 'rgba(37,99,235,.18)');
		polygon.setAttribute('stroke', '#2563eb');
		polygon.setAttribute('stroke-width', '2');
		svg.appendChild(polygon);

		points.forEach((point) => {
			const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			dot.setAttribute('cx', String(point.x));
			dot.setAttribute('cy', String(point.y));
			dot.setAttribute('r', '9');
			dot.setAttribute('fill', point.color);
			dot.setAttribute('stroke', '#ffffff');
			dot.setAttribute('stroke-width', '1.5');
			svg.appendChild(dot);

			const dotLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			dotLabel.setAttribute('x', String(point.x));
			dotLabel.setAttribute('y', String(point.y + 3));
			dotLabel.setAttribute('text-anchor', 'middle');
			dotLabel.setAttribute('font-size', '9');
			dotLabel.setAttribute('font-weight', '700');
			dotLabel.setAttribute('fill', '#ffffff');
			dotLabel.textContent = point.initial;
			svg.appendChild(dotLabel);
		});

		return svg;
	}

	const chartBlock = document.createElement('section');
	chartBlock.style.marginTop = '20px';
	chartBlock.style.padding = '16px';
	chartBlock.style.border = '1px solid var(--line)';
	chartBlock.style.borderRadius = '16px';
	chartBlock.style.background = 'rgba(17,24,39,.02)';

	const title = document.createElement('h3');
	title.textContent = 'Tổng quan SWOT theo tổng % (dạng pizza)';
	title.style.margin = '0 0 12px';
	title.style.fontSize = '1.05rem';
	chartBlock.appendChild(title);

	const hasData = chartData.some((item) => item.totalPercent > 0);

	const content = document.createElement('div');
	content.style.display = 'grid';
	content.style.gridTemplateColumns = '220px 1fr';
	content.style.gap = '18px';
	content.style.alignItems = 'center';

	const chart = document.createElement('div');
	chart.style.width = '220px';
	chart.style.height = '220px';
	chart.style.borderRadius = '50%';
	chart.style.border = '1px solid var(--line)';
	chart.style.background = '#ffffff';
	chart.style.display = 'flex';
	chart.style.alignItems = 'center';
	chart.style.justifyContent = 'center';

	if (hasData) {
		chart.appendChild(createRadarPizzaSvg(chartData));
	} else {
		chart.style.background = '#e5e7eb';
	}

	const legend = document.createElement('div');
	legend.style.display = 'grid';
	legend.style.gap = '8px';

	chartData.forEach((item) => {
		const row = document.createElement('div');
		row.style.display = 'grid';
		row.style.gridTemplateColumns = '14px minmax(0,1fr) auto';
		row.style.columnGap = '8px';
		row.style.alignItems = 'center';
		row.style.fontSize = '.92rem';

		const dot = document.createElement('span');
		dot.style.width = '14px';
		dot.style.height = '14px';
		dot.style.borderRadius = '50%';
		dot.style.display = 'inline-block';
		dot.style.background = exportChartColorMap[item.key] || '#6b7280';

		const label = document.createElement('span');
		label.textContent = `${item.label} (${item.count} ý)`;

		const value = document.createElement('strong');
		value.textContent = `${item.totalPercent}%`;

		row.appendChild(dot);
		row.appendChild(label);
		row.appendChild(value);
		legend.appendChild(row);
	});

	content.appendChild(chart);
	content.appendChild(legend);
	chartBlock.appendChild(content);

	return chartBlock;
}

function createExportClone(source) {
	const clone = source.cloneNode(true);
	clone.style.width = '1200px';
	clone.style.minWidth = '1200px';
	clone.style.boxSizing = 'border-box';
	clone.style.padding = '0';
	clone.style.paddingBottom = '40px';
	clone.style.margin = '0';
	clone.style.background = 'white';

	const clonedGrid = clone.querySelector('.tool-grid');
	if (clonedGrid) {
		clonedGrid.style.gridTemplateColumns = 'repeat(2,minmax(0,1fr))';
	}

	const clonedThemeWrapper = clone.querySelector('.theme-filter-wrapper');
	if (clonedThemeWrapper) {
		clonedThemeWrapper.style.display = 'block';
		const clonedThemeTabs = clonedThemeWrapper.querySelector('.theme-tabs');
		if (clonedThemeTabs) {
			clonedThemeTabs.style.display = 'none';
		}
		const clonedTemplateContainer = clonedThemeWrapper.querySelector('#templateContainer');
		if (clonedTemplateContainer) {
			const helperLine = clonedTemplateContainer.previousElementSibling;
			if (helperLine) {
				helperLine.style.display = 'none';
			}
			clonedTemplateContainer.style.display = 'none';
		}
	}

	clone.querySelectorAll('.swot-mobile-filter').forEach((element) => {
		element.style.display = 'none';
	});

	const chartData = [];
	clone.querySelectorAll('.swot-items').forEach((section) => {
		const label = section.dataset.fieldLabel || '';
		const key = section.dataset.fieldKey || '';
		const items = Array.from(section.querySelectorAll('.swot-item'));
		const filledItems = items.filter((item) => item.querySelector('.swot-input').value.trim());
		const scores = filledItems.map((item) => Number(item.querySelector('.swot-slider').value || 0));
		const totalPercent = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0)) : 0;

		chartData.push({ key, label, totalPercent, count: scores.length });

		const wrapper = document.createElement('div');
		wrapper.className = 'export-swot-section';
		wrapper.style.marginBottom = '16px';

		const heading = document.createElement('div');
		heading.style.fontWeight = '700';
		heading.style.marginBottom = '8px';
		heading.textContent = label;
		wrapper.appendChild(heading);

		filledItems.forEach((item) => {
			const input = item.querySelector('.swot-input');
			const slider = item.querySelector('.swot-slider');

			const itemWrapper = document.createElement('div');
			itemWrapper.style.display = 'grid';
			itemWrapper.style.gridTemplateColumns = 'minmax(0,1fr) 72px';
			itemWrapper.style.columnGap = '12px';
			itemWrapper.style.alignItems = 'start';
			itemWrapper.style.padding = '6px 0';
			itemWrapper.style.fontSize = '0.95rem';
			itemWrapper.style.lineHeight = '1.4';

			const textSpan = document.createElement('span');
			textSpan.textContent = `• ${input.value.trim()}`;
			textSpan.style.minWidth = '0';
			textSpan.style.wordBreak = 'break-word';

			const scoreSpan = document.createElement('span');
			scoreSpan.textContent = `${slider.value}%`;
			scoreSpan.style.fontSize = '0.85rem';
			scoreSpan.style.color = 'var(--muted)';
			scoreSpan.style.fontWeight = '600';
			scoreSpan.style.textAlign = 'right';

			itemWrapper.appendChild(textSpan);
			itemWrapper.appendChild(scoreSpan);
			wrapper.appendChild(itemWrapper);
		});

		section.replaceWith(wrapper);
	});

	clone.querySelectorAll('.tool-grid article h3').forEach((title) => title.remove());
	clone.querySelectorAll('button').forEach((button) => button.remove());

	clone.appendChild(createExportOverviewChart(chartData));

	const footer = document.createElement('div');
	footer.style.marginTop = '24px';
	footer.style.marginBottom = '20px';
	footer.style.paddingTop = '16px';
	footer.style.paddingBottom = '8px';
	footer.style.borderTop = '1px solid var(--line)';
	footer.style.fontSize = '0.8rem';
	footer.style.color = 'var(--muted)';
	footer.style.lineHeight = '1.4';
	footer.textContent = 'Được làm tại iAppLab - Made by Anhdophin - Email: anhdophin@gmail.com';
	clone.appendChild(footer);

	return clone;
}

async function exportPageAsJpg() {
	const source = document.querySelector('.tool-hero');
	if (!source) {
		return;
	}

	const exportWrapper = createExportClone(source);
	const tempContainer = document.createElement('div');
	tempContainer.style.position = 'fixed';
	tempContainer.style.top = '-9999px';
	tempContainer.style.left = '-9999px';
	tempContainer.style.zIndex = '-1';
	tempContainer.appendChild(exportWrapper);
	document.body.appendChild(tempContainer);

	exportJpgBtn.disabled = true;
	const originalText = exportJpgBtn.textContent;
	exportJpgBtn.textContent = 'Đang xuất...';

	let html2canvasLib;
	try {
		html2canvasLib = await loadHtml2canvas();
	} catch {
		window.alert('Không tải được công cụ xuất ảnh. Vui lòng thử lại.');
		tempContainer.remove();
		exportJpgBtn.disabled = false;
		exportJpgBtn.textContent = originalText;
		return;
	}

	try {
		const contentCanvas = await html2canvasLib(exportWrapper, {
			backgroundColor: '#ffffff',
			scale: 2,
			useCORS: true,
			allowTaint: true
		});

		const a4Width = 2480;
		const a4Height = 3508;
		const scale = Math.min(a4Width / contentCanvas.width, a4Height / contentCanvas.height);
		const finalCanvas = document.createElement('canvas');
		finalCanvas.width = a4Width;
		finalCanvas.height = a4Height;

		const ctx = finalCanvas.getContext('2d');
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, a4Width, a4Height);

		const targetWidth = Math.round(contentCanvas.width * scale);
		const targetHeight = Math.round(contentCanvas.height * scale);
		const offsetX = Math.round((a4Width - targetWidth) / 2);
		const offsetY = Math.round((a4Height - targetHeight) / 2);

		ctx.drawImage(contentCanvas, 0, 0, contentCanvas.width, contentCanvas.height, offsetX, offsetY, targetWidth, targetHeight);

		if (finalCanvas.toBlob) {
			finalCanvas.toBlob((blob) => {
				if (!blob) {
					throw new Error('Không tạo được blob ảnh.');
				}
				downloadBlob(blob, 'swot-analysis.jpg');
			}, 'image/jpeg', 0.95);
		} else {
			downloadDataUrl(finalCanvas.toDataURL('image/jpeg', 0.95), 'swot-analysis.jpg');
		}
	} catch (error) {
		window.alert('Xuất JPG không thành công. Hãy thử lại sau.');
		console.error(error);
	} finally {
		tempContainer.remove();
		exportJpgBtn.disabled = false;
		exportJpgBtn.textContent = originalText;
	}
}

themeTabs.forEach((tab) => {
	tab.addEventListener('click', () => {
		themeTabs.forEach((entry) => entry.classList.remove('active'));
		tab.classList.add('active');
		renderTemplates(tab.dataset.theme);
	});
});

sections.forEach((section) => {
	if (!section.querySelector('.swot-item')) {
		for (let index = 0; index < 5; index += 1) {
			section.appendChild(createSwotItem());
		}
	}
});

renderTemplates('personal');
buildBtn.addEventListener('click', buildOutput);
copyBtn.addEventListener('click', copyResult);
exportJpgBtn.addEventListener('click', exportPageAsJpg);


