const STORAGE_KEY = 'epub-metadata-tool-state-v3';

const defaultRoles = ['title', 'chapter', 'header_large', 'header_medium', 'header_small', 'topic'];
const emptyDraft = () => ({
  title: '',
  author: '',
  language: '',
  groups: [],
  topics: [],
  series: '',
});
const emptyPresets = () => ({
  groups: [],
  topics: [],
  authors: [],
  series: [],
});
const state = {
  roles: [],
  analysis: null,
  epubFileBase64: '',
  exportDirHandle: null,
  exportDirName: '',
  metadataDraft: emptyDraft(),
  presets: emptyPresets(),
};

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
};

function uniqStrings(items) {
  return [...new Set((items || []).map((x) => String(x || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
}

function parseCsvTags(text) {
  return uniqStrings(String(text || '').split(',').map((x) => x.trim()));
}

function tagsToCsv(list) {
  return uniqStrings(list).join(', ');
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    state.roles = Array.isArray(saved.roles) && saved.roles.length ? saved.roles : [...defaultRoles];
    state.presets = {
      groups: uniqStrings(saved.presets?.groups || []),
      topics: uniqStrings(saved.presets?.topics || []),
      authors: uniqStrings(saved.presets?.authors || []),
      series: uniqStrings(saved.presets?.series || []),
    };
    state.metadataDraft = {
      title: saved.metadataDraft?.title || '',
      author: saved.metadataDraft?.author || '',
      language: saved.metadataDraft?.language || '',
      groups: uniqStrings(saved.metadataDraft?.groups || []),
      topics: uniqStrings(saved.metadataDraft?.topics || []),
      series: saved.metadataDraft?.series || '',
    };
    $('#tocInput').value = saved.tocText || '';
  } catch {
    state.roles = [...defaultRoles];
  }
}

function persistState() {
  captureMetadataDraft();
  const payload = {
    roles: state.roles,
    tocText: $('#tocInput').value,
    tocItems: state.analysis?.pasted_toc || [],
    metadataDraft: state.metadataDraft,
    presets: state.presets,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function setStatus(msg, kind = 'muted') {
  const box = $('#statusBox');
  box.textContent = msg;
  box.className = `status ${kind}`;
}

function renderRoles() {
  const list = $('#roleList');
  list.innerHTML = '';
  state.roles.forEach((role) => {
    const chip = el('div', 'role-chip');
    chip.append(el('span', '', role));
    const btn = el('button', '', 'Xóa');
    btn.type = 'button';
    btn.addEventListener('click', () => {
      state.roles = state.roles.filter((r) => r !== role);
      if (state.analysis?.pasted_toc) {
        state.analysis.pasted_toc.forEach((row) => {
          if (row.role === role) row.role = '';
        });
      }
      renderRoles();
      renderTocRows();
      renderBulkRoleOptions();
      persistState();
    });
    chip.append(btn);
    list.append(chip);
  });
}

function chapterLike(text) {
  return /^(?:ch(?:apter)?|chương|chuong|phần|phan|part|section)\s*([0-9ivxlcdm]+)/i.test(String(text || '').trim());
}

function parseClientToc(text) {
  const rows = [];
  const chapterRole = state.roles.find((r) => /^(chapter|chuong|chương)$/i.test(r)) || 'chapter';
  text.split(/\r?\n/).forEach((line) => {
    if (!line.trim()) return;
    const leadingSpaces = line.length - line.replace(/^[ \t]+/, '').length;
    const tabs = line.length - line.replace(/^\t+/, '').length;
    const level = tabs ? tabs + 1 : Math.floor(leadingSpaces / 2) + 1;
    const title = line.trim().replace(/^[\-•–—]+\s*/, '');
    rows.push({
      title,
      level,
      role: chapterLike(title) ? chapterRole : '',
      href: '',
      chapter_number: extractChapterNumber(title),
    });
  });
  return rows;
}

function extractChapterNumber(text) {
  const m = String(text || '').trim().match(/^(?:ch(?:apter)?|chương|chuong|phần|phan|part|section)\s*([0-9ivxlcdm]+)/i);
  return m ? m[1] : '';
}

function ensureAnalysisToc() {
  if (!state.analysis) {
    state.analysis = { pasted_toc: parseClientToc($('#tocInput').value) };
  }
  if (!state.analysis.pasted_toc) state.analysis.pasted_toc = [];
}

function renderBulkRoleOptions() {
  const target = $('#bulkRoleSelect');
  target.innerHTML = '<option value="">-- chọn role --</option>';
  state.roles.forEach((role) => {
    const opt = document.createElement('option');
    opt.value = role;
    opt.textContent = role;
    target.append(opt);
  });
}

function applyBulkRole(mode) {
  ensureAnalysisToc();
  const role = $('#bulkRoleSelect').value;
  const rows = state.analysis.pasted_toc || [];
  if (!role || !rows.length) return;

  if (mode === 'all') {
    rows.forEach((row) => { row.role = role; });
  } else if (mode === 'empty') {
    rows.forEach((row) => { if (!row.role) row.role = role; });
  } else if (mode === 'level') {
    const level = Math.max(1, parseInt($('#bulkLevelInput').value || '1', 10));
    rows.forEach((row) => { if (Number(row.level) === level) row.role = role; });
  } else if (mode === 'chapter') {
    rows.forEach((row) => { if (chapterLike(row.title)) row.role = role; });
  }

  renderTocRows();
  persistState();
  setStatus('Đã apply role hàng loạt.', 'good');
}

function renderTocRows() {
  const box = $('#tocRows');
  ensureAnalysisToc();
  const rows = state.analysis.pasted_toc || [];
  box.innerHTML = '';
  if (!rows.length) {
    box.className = 'toc-rows empty';
    box.textContent = 'Chưa có TOC.';
    return;
  }
  box.className = 'toc-rows';
  rows.forEach((row, idx) => {
    const wrap = el('div', 'toc-row');

    const select = document.createElement('select');
    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = '-- chọn role --';
    select.append(emptyOpt);
    state.roles.forEach((role) => {
      const opt = document.createElement('option');
      opt.value = role;
      opt.textContent = role;
      if (row.role === role) opt.selected = true;
      select.append(opt);
    });
    select.addEventListener('change', (e) => {
      row.role = e.target.value;
      persistState();
    });

    const title = el('div', 'toc-title');
    title.style.paddingLeft = `${(row.level - 1) * 18}px`;
    const chapterBadge = row.chapter_number ? ` <span class="badge">Chương ${escapeHtml(row.chapter_number)}</span>` : '';
    title.innerHTML = `<strong>${escapeHtml(row.title)}</strong>${chapterBadge}<div class="toc-level">Level ${row.level}</div>`;

    const levelInput = document.createElement('input');
    levelInput.type = 'number';
    levelInput.min = '1';
    levelInput.value = row.level;
    levelInput.addEventListener('change', (e) => {
      row.level = Math.max(1, parseInt(e.target.value || '1', 10));
      persistState();
      renderTocRows();
    });

    const removeBtn = el('button', '', 'Xóa');
    removeBtn.addEventListener('click', () => {
      rows.splice(idx, 1);
      persistState();
      renderTocRows();
    });

    wrap.append(select, title, levelInput, removeBtn);
    box.append(wrap);
  });
}

function renderBookInfo(book) {
  const box = $('#bookInfo');
  if (!book) {
    box.textContent = 'Chưa có dữ liệu sách.';
    return;
  }
  box.innerHTML = `
    <div><strong>${escapeHtml(book.title || '')}</strong></div>
    <div>Tác giả: ${escapeHtml(book.author || '') || '—'}</div>
    <div>Ngôn ngữ: ${escapeHtml(book.language || '') || '—'}</div>
    <div>Book ID: <span class="badge">${escapeHtml(book.book_id || '')}</span></div>
  `;
}

function renderSimpleList(target, items, type) {
  const box = $(target);
  box.innerHTML = '';
  if (!items || !items.length) {
    box.className = 'simple-list muted';
    box.textContent = 'Không có dữ liệu.';
    return;
  }
  box.className = 'simple-list';
  items.forEach((item) => {
    const row = el('div', 'simple-item');
    if (type === 'epubToc') {
      const chapterBadge = item.chapter_number ? ` <span class="badge">Chương ${escapeHtml(item.chapter_number)}</span>` : '';
      row.innerHTML = `<div style="padding-left:${(item.level - 1) * 18}px"><strong>${escapeHtml(item.title)}</strong>${chapterBadge} <span class="badge">L${item.level}</span></div>`;
    } else {
      row.innerHTML = `<strong>${escapeHtml(item.file_name)}</strong><div class="muted">${escapeHtml(item.preview || '').slice(0, 180)}</div>`;
    }
    box.append(row);
  });
}

function escapeHtml(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderPresetHints() {
  $('#groupHint').textContent = state.presets.groups.length ? `Đã lưu: ${state.presets.groups.join(', ')}` : 'Chưa có nhóm sách đã lưu.';
  $('#topicHint').textContent = state.presets.topics.length ? `Đã lưu: ${state.presets.topics.join(', ')}` : 'Chưa có chủ đề sách đã lưu.';
  $('#authorHint').textContent = state.presets.authors.length ? `Đã lưu: ${state.presets.authors.join(', ')}` : 'Chưa có tên tác giả đã lưu.';
  $('#seriesHint').textContent = state.presets.series.length ? `Đã lưu: ${state.presets.series.join(', ')}` : 'Chưa có series đã lưu.';
}

function renderMetadataInputs() {
  $('#metaTitle').value = state.metadataDraft.title || '';
  $('#metaAuthor').value = state.metadataDraft.author || '';
  $('#metaLanguage').value = state.metadataDraft.language || '';
  $('#metaGroups').value = tagsToCsv(state.metadataDraft.groups);
  $('#metaTopics').value = tagsToCsv(state.metadataDraft.topics);
  $('#metaSeries').value = state.metadataDraft.series || '';

  const setDatalist = (id, items) => {
    const dl = $(id);
    dl.innerHTML = '';
    items.forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item;
      dl.append(opt);
    });
  };
  setDatalist('#groupList', state.presets.groups);
  setDatalist('#topicList', state.presets.topics);
  setDatalist('#authorList', state.presets.authors);
  setDatalist('#seriesList', state.presets.series);
  renderPresetHints();
}

function captureMetadataDraft() {
  state.metadataDraft = {
    title: $('#metaTitle')?.value.trim() || '',
    author: $('#metaAuthor')?.value.trim() || '',
    language: $('#metaLanguage')?.value.trim() || '',
    groups: parseCsvTags($('#metaGroups')?.value || ''),
    topics: parseCsvTags($('#metaTopics')?.value || ''),
    series: $('#metaSeries')?.value.trim() || '',
  };
  mergeDraftIntoPresets();
}

function mergeDraftIntoPresets() {
  state.presets.groups = uniqStrings([...(state.presets.groups || []), ...(state.metadataDraft.groups || [])]);
  state.presets.topics = uniqStrings([...(state.presets.topics || []), ...(state.metadataDraft.topics || [])]);
  state.presets.authors = uniqStrings([...(state.presets.authors || []), state.metadataDraft.author || '']);
  state.presets.series = uniqStrings([...(state.presets.series || []), state.metadataDraft.series || '']);
  renderMetadataInputs();
}

function applyBookToMetadata(book, { keepExisting = true } = {}) {
  if (!book) return;
  const next = { ...state.metadataDraft };
  if (!keepExisting || !next.title) next.title = book.title || next.title;
  if (!keepExisting || !next.author) next.author = book.author || next.author;
  if (!keepExisting || !next.language) next.language = book.language || next.language;
  if ((!keepExisting || !next.series) && book.series) next.series = book.series;
  next.groups = uniqStrings([...(next.groups || []), ...((Array.isArray(book.group) ? book.group : (book.group ? [book.group] : [])))]);
  next.topics = uniqStrings([...(next.topics || []), ...((Array.isArray(book.topics) ? book.topics : (book.topics ? [book.topics] : [])))]);
  state.metadataDraft = next;
  mergeDraftIntoPresets();
}

async function fileToBase64(file) {
  const arrayBuffer = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function analyze() {
  const file = $('#epubFile').files[0];
  if (!file) {
    setStatus('Anh chọn file text hoặc ebook trước đã.', 'bad');
    return;
  }
  const tocText = $('#tocInput').value;
  if (!tocText.trim()) {
    setStatus('Anh paste TOC trước đã.', 'bad');
    return;
  }
  ensureAnalysisToc();
  captureMetadataDraft();
  setStatus('Đang phân tích file ebook/text...', 'muted');
  const form = new FormData();
  form.append('epub', file);
  form.append('toc_text', tocText);
  form.append('roles_json', JSON.stringify(state.roles));
  form.append('toc_items_json', JSON.stringify(state.analysis?.pasted_toc || []));
  const res = await fetch('/analyze', { method: 'POST', body: form });
  const data = await res.json();
  if (!data.ok) {
    setStatus(data.error || 'Phân tích thất bại.', 'bad');
    console.error(data.details || '');
    return;
  }
  state.analysis = data;
  state.epubFileBase64 = await fileToBase64(file);
  applyBookToMetadata(data.book, { keepExisting: true });
  renderBookInfo(data.book);
  renderSimpleList('#epubToc', data.epub_toc, 'epubToc');
  renderSimpleList('#textFiles', data.text_files, 'textFiles');
  renderTocRows();
  $('#exportBtn').disabled = false;
  persistState();
  setStatus('Phân tích xong. Metadata filter sẽ đi vào gói export để reader đọc được.', 'good');
}

async function pickExportFolder() {
  if (!window.showDirectoryPicker) {
    setStatus('Trình duyệt này chưa hỗ trợ chọn folder trực tiếp. App vẫn có thể tải file như bình thường.', 'bad');
    return;
  }
  try {
    state.exportDirHandle = await window.showDirectoryPicker();
    state.exportDirName = state.exportDirHandle.name || 'folder đã chọn';
    $('#exportFolderLabel').textContent = state.exportDirName;
    setStatus('Đã chọn folder xuất file.', 'good');
  } catch (err) {
    if (err?.name !== 'AbortError') {
      console.error(err);
      setStatus('Không chọn được folder.', 'bad');
    }
  }
}

async function saveBlobToPickedFolder(blob, fileName) {
  if (!state.exportDirHandle) return false;
  const fileHandle = await state.exportDirHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
  return true;
}

async function exportData() {
  const file = $('#epubFile').files[0];
  if (!file || !state.analysis) {
    setStatus('Chưa có dữ liệu để export.', 'bad');
    return;
  }
  ensureAnalysisToc();
  captureMetadataDraft();
  const payload = {
    filename: file.name,
    epub_bytes_b64: state.epubFileBase64,
    role_options: state.roles,
    toc_items: state.analysis.pasted_toc,
    metadata_overrides: state.metadataDraft,
    metadata_presets: state.presets,
  };
  setStatus('Đang đóng gói file export...', 'muted');
  const res = await fetch('/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    setStatus(data.error || 'Export thất bại.', 'bad');
    console.error(data.details || '');
    return;
  }
  const fileName = data.file_name || 'metadata-export.zip';
  const zipBase64 = data.zip_base64 || '';
  const binary = atob(zipBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: 'application/zip' });

  try {
    if (state.exportDirHandle) {
      await saveBlobToPickedFolder(blob, fileName);
      setStatus(`Đã export xong vào folder: ${state.exportDirName}`, 'good');
      return;
    }
  } catch (err) {
    console.error(err);
    setStatus('Lưu vào folder đã chọn không thành công, app sẽ chuyển sang tải file.', 'bad');
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  setStatus('Đã export xong.', 'good');
}

$('#addRoleBtn').addEventListener('click', () => {
  const input = $('#newRoleInput');
  const value = input.value.trim();
  if (!value) return;
  if (!state.roles.includes(value)) state.roles.push(value);
  input.value = '';
  renderRoles();
  renderTocRows();
  renderBulkRoleOptions();
  persistState();
});

['#metaTitle', '#metaAuthor', '#metaLanguage', '#metaGroups', '#metaTopics', '#metaSeries'].forEach((sel) => {
  $(sel).addEventListener('input', () => {
    captureMetadataDraft();
    persistState();
  });
  $(sel).addEventListener('change', () => {
    captureMetadataDraft();
    persistState();
  });
});

$('#tocInput').addEventListener('input', () => {
  state.analysis = { pasted_toc: parseClientToc($('#tocInput').value) };
  renderTocRows();
  persistState();
});

$('#analyzeBtn').addEventListener('click', analyze);
$('#exportBtn').addEventListener('click', exportData);
$('#pickFolderBtn').addEventListener('click', pickExportFolder);
$('#bulkApplyAllBtn').addEventListener('click', () => applyBulkRole('all'));
$('#bulkApplyEmptyBtn').addEventListener('click', () => applyBulkRole('empty'));
$('#bulkApplyLevelBtn').addEventListener('click', () => applyBulkRole('level'));
$('#bulkApplyChapterBtn').addEventListener('click', () => applyBulkRole('chapter'));

restoreState();
state.analysis = { pasted_toc: parseClientToc($('#tocInput').value) };
renderRoles();
renderBulkRoleOptions();
renderMetadataInputs();
renderTocRows();
