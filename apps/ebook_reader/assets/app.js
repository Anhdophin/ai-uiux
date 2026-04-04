const STORAGE_KEYS = {
  preferences: 'anhdophin.reader.preferences',
  bookmarks: 'anhdophin.reader.bookmarks',
  progress: 'anhdophin.reader.progress',
  highlights: 'anhdophin.reader.highlights',
};

const state = {
  index: null,
  books: [],
  filtered: [],
  currentBook: null,
  currentScreen: 'home',
  currentFile: null,
  currentSection: null,
  deferredPrompt: null,
  lastPosition: null,
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  textCache: new Map(),
  preferences: loadJson(STORAGE_KEYS.preferences, {
    bg: 'paper',
    font: 'system-serif',
    scale: 100,
  }),
  bookmarks: loadJson(STORAGE_KEYS.bookmarks, {}),
  progress: loadJson(STORAGE_KEYS.progress, {}),
  highlights: loadJson(STORAGE_KEYS.highlights, {}),
  libraryFilters: { group: '', topic: '', series: '', statuses: [] },
  homeFilters: { group: '', topic: '', author: '' },
  downloads: [],
  downloadsFolderName: 'DownloadLibrary',
  supportsDownloadsScan: true,
};

const BG_OPTIONS = {
  paper: { label: 'Paper trắng', paper: '#ffffff', bg: '#edf1ff', ink: '#1d2433' },
  warm: { label: 'Kem ấm', paper: '#fbf4e6', bg: '#f1e8d9', ink: '#3b2f24' },
  mist: { label: 'Xanh sương', paper: '#eef4f7', bg: '#dde8ed', ink: '#20303a' },
  night: { label: 'Dark night', paper: '#151922', bg: '#0d1017', ink: '#e7edf7' },
};

const SYSTEM_FONTS = [
  { id: 'system-serif', name: 'System Serif', family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
  { id: 'system-sans', name: 'System Sans', family: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { id: 'system-reading', name: 'Book Serif', family: 'Charter, "Iowan Old Style", Georgia, serif' },
];

const els = {
  libraryCount: document.getElementById('libraryCount'),
  newBooks: document.getElementById('newBooks'),
  forYouBooks: document.getElementById('forYouBooks'),
  libraryGrid: document.getElementById('libraryGrid'),
  libraryStatus: document.getElementById('libraryStatus'),
  filterGroup: document.getElementById('filterGroup'),
  filterTopic: document.getElementById('filterTopic'),
  filterSeries: document.getElementById('filterSeries'),
  filterChips: document.getElementById('filterChips'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  searchInput: document.getElementById('searchInput'),
  searchMeta: document.getElementById('searchMeta'),
  homeGroupFilters: document.getElementById('homeGroupFilters'),
  homeTopicFilters: document.getElementById('homeTopicFilters'),
  homeAuthorFilters: document.getElementById('homeAuthorFilters'),
  homeFilterResetBtn: document.getElementById('homeFilterResetBtn'),
  refreshBtn: document.getElementById('refreshBtn'),
  detailTitle: document.getElementById('detailTitle'),
  detailAuthor: document.getElementById('detailAuthor'),
  detailChapters: document.getElementById('detailChapters'),
  detailFiles: document.getElementById('detailFiles'),
  detailDescription: document.getElementById('detailDescription'),
  detailCover: document.getElementById('detailCover'),
  openBookBtn: document.getElementById('openBookBtn'),
  readerBookTitle: document.getElementById('readerBookTitle'),
  readerSectionTitle: document.getElementById('readerSectionTitle'),
  readerContent: document.getElementById('readerContent'),
  readerArticle: document.getElementById('readerArticle'),
  tocList: document.getElementById('tocList'),
  bookmarkList: document.getElementById('bookmarkList'),
  highlightList: document.getElementById('highlightList'),
  tocToggle: document.getElementById('tocToggle'),
  bookmarkToggle: document.getElementById('bookmarkToggle'),
  prevChapterBtn: document.getElementById('prevChapterBtn'),
  nextChapterBtn: document.getElementById('nextChapterBtn'),
  backToLastBtn: document.getElementById('backToLastBtn'),
  settingsToggle: document.getElementById('settingsToggle'),
  tocDrawer: document.getElementById('tocDrawer'),
  settingsDrawer: document.getElementById('settingsDrawer'),
  addBookmarkBtn: document.getElementById('addBookmarkBtn'),
  addHighlightBtn: document.getElementById('addHighlightBtn'),
  bgSelect: document.getElementById('bgSelect'),
  fontSelect: document.getElementById('fontSelect'),
  scaleRange: document.getElementById('scaleRange'),
  scaleValue: document.getElementById('scaleValue'),
  installBtn: document.getElementById('installBtn'),
  downloadsBtn: document.getElementById('downloadsBtn'),
  downloadsStatus: document.getElementById('downloadsStatus'),
  downloadsGrid: document.getElementById('downloadsGrid'),
  pickDownloadsFolderBtn: document.getElementById('pickDownloadsFolderBtn'),
  clearDownloadsFolderBtn: document.getElementById('clearDownloadsFolderBtn'),
  rescanDownloadsBtn: document.getElementById('rescanDownloadsBtn'),
};

const fontStyleTag = document.createElement('style');
document.head.appendChild(fontStyleTag);

const DOWNLOAD_DOC_EXTENSIONS = ['pdf'];
const DOWNLOAD_IMAGE_EXTENSIONS = ['jpg','jpeg','png','webp','gif','avif'];
const DOWNLOAD_INDEX_PATH = 'DownloadLibrary/index.json';

function getExtension(name = '') {
  return String(name).split('.').pop().toLowerCase();
}

function isDownloadDoc(name = '') {
  return DOWNLOAD_DOC_EXTENSIONS.includes(getExtension(name));
}

function isDownloadImage(name = '') {
  return DOWNLOAD_IMAGE_EXTENSIONS.includes(getExtension(name));
}

function fileIconLabel(ext = '') {
  const map = { pdf: 'PDF', epub: 'EPUB', mobi: 'MOBI', azw: 'AZW', azw3: 'AZW3', fb2: 'FB2', txt: 'TXT', md: 'MD', html: 'HTML', htm: 'HTML', doc: 'DOC', docx: 'DOCX', rtf: 'RTF' };
  return map[ext] || ext.toUpperCase() || 'FILE';
}

function formatBytes(bytes = 0) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value >= 10 || unitIndex === 0 ? Math.round(value) : value.toFixed(1)} ${units[unitIndex]}`;
}

function normalizeDownloadItem(item, index = 0) {
  const folder = String(item?.folder || item?.slug || '').trim();
  const title = String(item?.title || folder || `Download ${index + 1}`).trim();
  const basePath = folder ? `DownloadLibrary/${folder}/` : 'DownloadLibrary/';
  const coverName = String(item?.cover || '').trim();
  const files = Array.isArray(item?.files) ? item.files : [];
  const normalizedFiles = files
    .map(file => {
      if (typeof file === 'string') {
        const name = file.trim();
        return name ? { name } : null;
      }
      if (!file || typeof file !== 'object') return null;
      const name = String(file.name || file.file || '').trim();
      if (!name) return null;
      return {
        name,
        size: Number(file.size || 0),
        label: String(file.label || '').trim(),
      };
    })
    .filter(Boolean)
    .filter(file => isDownloadDoc(file.name))
    .map(file => ({
      name: file.name,
      ext: getExtension(file.name),
      size: file.size || 0,
      label: file.label || '',
      url: `${basePath}${file.name}`,
    }));

  if (!normalizedFiles.length) return null;

  return {
    id: String(item?.id || `dl-${folder || index}`),
    title,
    author: String(item?.author || 'Tài liệu tải về').trim() || 'Tài liệu tải về',
    description: String(item?.description || '').trim() || (normalizedFiles.length > 1 ? `${normalizedFiles.length} file sẵn tải về` : '1 file sẵn tải về'),
    coverUrl: coverName && isDownloadImage(coverName) ? `${basePath}${coverName}` : '',
    coverLabel: coverName,
    files: normalizedFiles,
    updatedAt: Number(item?.updatedAt || 0),
    group: String(item?.group || '').trim(),
    topic: String(item?.topic || '').trim(),
  };
}

async function collectDownloadIndexItems() {
  const response = await fetch(DOWNLOAD_INDEX_PATH, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  const books = Array.isArray(data?.books) ? data.books : [];
  return books
    .map((item, index) => normalizeDownloadItem(item, index))
    .filter(Boolean)
    .sort((a, b) => a.title.localeCompare(b.title, 'vi'));
}

function createDownloadCoverMarkup(item) {
  const badge = item.files.length > 1 ? `${item.files.length} file` : fileIconLabel(item.files[0]?.ext || '');
  const media = item.coverUrl
    ? `<img class="cover-media" src="${item.coverUrl}" alt="${escapeHtml(item.title)}">`
    : `<div class="cover-media download-cover-fallback" aria-hidden="true"><span>${escapeHtml((item.title || 'DL').slice(0, 2).toUpperCase())}</span></div>`;
  return `
    <div class="cover-card">
      ${media}
      <span class="book-price">${escapeHtml(badge)}</span>
      <div class="title-layer">
        <p class="eyebrow">Tải về</p>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.description || '')}</p>
      </div>
    </div>
  `;
}

function renderDownloadCard(item) {
  return `
    <article class="book-card download-card">
      ${createDownloadCoverMarkup(item)}
      <div class="card-caption">
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.author || 'Tài liệu tải về')}</p>
        <p class="card-meta">${item.files.map(file => `${escapeHtml(file.label || fileIconLabel(file.ext))}${file.size ? ` • ${formatBytes(file.size)}` : ''}`).join(' • ')}</p>
        <div class="download-actions">
          ${item.files.map((file, index) => `<button class="pill-button small-pill download-pill" type="button" data-download-item="${escapeHtml(item.id)}" data-download-index="${index}">Tải ${escapeHtml(file.label || fileIconLabel(file.ext))}</button>`).join('')}
        </div>
      </div>
    </article>
  `;
}

function renderDownloads() {
  if (!els.downloadsGrid || !els.downloadsStatus) return;
  if (state.downloads.length) {
    els.downloadsStatus.textContent = `Có ${state.downloads.length} tài liệu tải về trong DownloadLibrary.`;
  } else {
    els.downloadsStatus.textContent = 'Chưa có tài liệu tải về. Hãy chạy file update_downloads.bat sau khi thêm PDF vào web/DownloadLibrary/.';
  }
  els.downloadsGrid.innerHTML = state.downloads.length
    ? state.downloads.map(renderDownloadCard).join('')
    : '<div class="empty-state">Chưa có dữ liệu tải về. Hãy đặt PDF vào <code>web/DownloadLibrary/</code> rồi chạy <code>update_downloads.bat</code>.</div>';
  els.downloadsGrid.querySelectorAll('[data-download-item]').forEach(btn => {
    btn.onclick = () => {
      const item = state.downloads.find(entry => entry.id === btn.dataset.downloadItem);
      const file = item?.files?.[Number(btn.dataset.downloadIndex)];
      if (!file?.url) return;
      const anchor = document.createElement('a');
      anchor.href = file.url;
      anchor.download = file.name;
      anchor.target = '_blank';
      anchor.rel = 'noopener';
      anchor.click();
    };
  });
}

async function scanDownloadsFolder() {
  state.downloadsFolderName = 'DownloadLibrary';
  if (els.downloadsStatus) els.downloadsStatus.textContent = 'Đang đọc danh sách PDF trong DownloadLibrary...';
  try {
    state.downloads = await collectDownloadIndexItems();
  } catch {
    state.downloads = [];
    if (els.downloadsStatus) {
      els.downloadsStatus.textContent = 'Không đọc được danh sách tải về. Hãy chạy update_downloads.bat để tạo lại dữ liệu cho DownloadLibrary.';
    }
  }
  renderDownloads();
}

function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

function normalizeMetaArray(book, keys = []) {
  for (const key of keys) {
    const value = book?.[key] ?? book?.meta?.[key] ?? book?.metadata?.[key];
    if (!value) continue;
    if (Array.isArray(value)) return value.map(x => String(x).trim()).filter(Boolean);
    return String(value).split(/[,;|]/).map(x => x.trim()).filter(Boolean);
  }
  return [];
}

function getBookGroups(book) {
  return normalizeMetaArray(book, ['group', 'groups', 'collection']);
}

function getBookTopics(book) {
  return normalizeMetaArray(book, ['topic', 'topics', 'subject', 'subjects', 'theme', 'themes']);
}

function getBookSeries(book) {
  return normalizeMetaArray(book, ['series']).slice(0, 1);
}

function getBookAuthors(book) {
  const author = String(book?.author || book?.meta?.author || book?.metadata?.author || '').trim();
  return author ? [author] : [];
}

function getBookStatusSet(book) {
  const statuses = new Set();
  const progressEntries = Object.entries(state.progress).filter(([key, value]) => key.startsWith(`${book.id}::`) && value);
  const hasProgress = progressEntries.length > 0;
  const bookmarks = state.bookmarks[book.id] || [];
  const highlights = state.highlights[book.id] || [];
  if (!hasProgress && !bookmarks.length && !highlights.length) statuses.add('unread');
  if (hasProgress || bookmarks.length || highlights.length) statuses.add('reading');
  if (bookmarks.length) statuses.add('bookmark');
  if (highlights.length) statuses.add('highlight');
  const latestProgressAt = progressEntries.reduce((max, [, value]) => Math.max(max, value?.savedAt || 0), 0);
  const recentCutoff = Date.now() - 1000 * 60 * 60 * 24 * 14;
  if (latestProgressAt >= recentCutoff) statuses.add('recent');
  return statuses;
}

function getBookMetaSummary(book) {
  const parts = [];
  const groups = getBookGroups(book);
  const topics = getBookTopics(book);
  const series = getBookSeries(book);
  if (groups.length) parts.push(`Nhóm: ${groups.join(', ')}`);
  if (topics.length) parts.push(`Chủ đề: ${topics.join(', ')}`);
  if (series.length) parts.push(`Series: ${series[0]}`);
  return parts.join(' • ');
}

function collectFilterOptions(valuesGetter) {
  const counts = new Map();
  for (const book of state.books) {
    for (const item of valuesGetter(book)) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], 'vi')).map(([label, count]) => ({ label, count }));
}

function bookMatchesHomeFilters(book) {
  const { group, topic, author } = state.homeFilters;
  const groups = getBookGroups(book);
  const topics = getBookTopics(book);
  const authors = getBookAuthors(book);
  if (group && !groups.includes(group)) return false;
  if (topic && !topics.includes(topic)) return false;
  if (author && !authors.includes(author)) return false;
  return true;
}

function renderHomeFilterButtons(container, items, type) {
  if (!container) return;
  const active = state.homeFilters[type];
  container.innerHTML = items.length
    ? items.map(item => `<button class="home-filter-chip ${active === item.label ? 'active' : ''}" type="button" data-home-filter="${type}" data-value="${escapeHtml(item.label)}">${escapeHtml(item.label)} (${item.count})</button>`).join('')
    : '<span class="muted small">Chưa có dữ liệu.</span>';
}

function renderHomeFilters() {
  renderHomeFilterButtons(els.homeGroupFilters, collectFilterOptions(getBookGroups), 'group');
  renderHomeFilterButtons(els.homeTopicFilters, collectFilterOptions(getBookTopics), 'topic');
  renderHomeFilterButtons(els.homeAuthorFilters, collectFilterOptions(getBookAuthors), 'author');

  document.querySelectorAll('[data-home-filter]').forEach(btn => {
    btn.onclick = () => {
      const type = btn.dataset.homeFilter;
      const value = btn.dataset.value;
      state.homeFilters[type] = state.homeFilters[type] === value ? '' : value;
      renderHomeFilters();
      renderHome();
    };
  });
}

function resetHomeFilters() {
  state.homeFilters = { group: '', topic: '', author: '' };
  renderHomeFilters();
  renderHome();
}

function getCurrentChapterFiles(book) {
  if (!book) return [];
  const tocFiles = (book.tocItems || []).map(item => item?.matched_file).filter(Boolean);
  if (tocFiles.length) return [...new Set(tocFiles)];
  return getBookFiles(book);
}

function updateChapterNavButtons() {
  const files = getCurrentChapterFiles(state.currentBook);
  const index = files.indexOf(state.currentFile);
  const hasPrev = index > 0;
  const hasNext = index !== -1 && index < files.length - 1;
  if (els.prevChapterBtn) els.prevChapterBtn.disabled = !hasPrev;
  if (els.nextChapterBtn) els.nextChapterBtn.disabled = !hasNext;
}

function stepChapter(direction = 1) {
  const files = getCurrentChapterFiles(state.currentBook);
  if (!files.length || !state.currentFile) return;
  const index = files.indexOf(state.currentFile);
  if (index === -1) return;
  const target = files[index + direction];
  if (!target) return;
  openTextFile(target, { scrollTop: 0 });
}

function bookMatchesFilters(book) {
  const { group, topic, series, statuses } = state.libraryFilters;
  const groups = getBookGroups(book);
  const topics = getBookTopics(book);
  const seriesList = getBookSeries(book);
  const statusSet = getBookStatusSet(book);
  if (group && !groups.includes(group)) return false;
  if (topic && !topics.includes(topic)) return false;
  if (series && !seriesList.includes(series)) return false;
  if (statuses.length && !statuses.every(status => statusSet.has(status))) return false;
  return true;
}

function applyLibraryFilters() {
  state.filtered = state.books.filter(bookMatchesFilters);
}

function populateLibraryFilters() {
  const groupOptions = collectFilterOptions(getBookGroups);
  const topicOptions = collectFilterOptions(getBookTopics);
  const seriesOptions = collectFilterOptions(getBookSeries);

  const buildOptions = (label, items) => [`<option value="">Tất cả ${label}</option>`, ...items.map(item => `<option value="${escapeHtml(item.label)}">${escapeHtml(item.label)} (${item.count})</option>`)].join('');
  if (els.filterGroup) els.filterGroup.innerHTML = buildOptions('nhóm', groupOptions);
  if (els.filterTopic) els.filterTopic.innerHTML = buildOptions('chủ đề', topicOptions);
  if (els.filterSeries) els.filterSeries.innerHTML = buildOptions('series', seriesOptions);
  if (els.filterGroup) els.filterGroup.value = state.libraryFilters.group;
  if (els.filterTopic) els.filterTopic.value = state.libraryFilters.topic;
  if (els.filterSeries) els.filterSeries.value = state.libraryFilters.series;

  const statusItems = [
    ['unread', 'Chưa đọc'],
    ['reading', 'Đang đọc'],
    ['bookmark', 'Có bookmark'],
    ['highlight', 'Có highlight'],
    ['recent', 'Đọc gần đây'],
  ];
  if (els.filterChips) {
    els.filterChips.innerHTML = statusItems.map(([value, label]) => `
      <button class="filter-chip ${state.libraryFilters.statuses.includes(value) ? 'active' : ''}" type="button" data-status-filter="${value}">${label}</button>
    `).join('');
    els.filterChips.querySelectorAll('[data-status-filter]').forEach(btn => {
      btn.onclick = () => {
        const value = btn.dataset.statusFilter;
        const set = new Set(state.libraryFilters.statuses);
        if (set.has(value)) set.delete(value); else set.add(value);
        state.libraryFilters.statuses = [...set];
        applyLibraryFilters();
        populateLibraryFilters();
        renderLibrary();
      };
    });
  }
}

function resetLibraryFilters() {
  state.libraryFilters = { group: '', topic: '', series: '', statuses: [] };
  applyLibraryFilters();
  populateLibraryFilters();
  renderLibrary();
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
}

function createCoverMarkup(book, large = false) {
  const chapter = book.chapterCount ? `${book.chapterCount} chương` : 'Ebook';
  const cls = large ? 'detail-cover' : 'cover-card';
  const mediaClass = large ? 'detail-cover-media' : 'cover-media';
  const media = book.cover
    ? `<img class="${mediaClass}" src="${book.cover}" alt="${escapeHtml(book.title)}">`
    : `<div class="${mediaClass}" style="background:${coverGradient(book)}"></div>`;
  return `
    <div class="${cls}">
      ${media}
      <span class="book-price">${chapter}</span>
      <div class="title-layer">
        <p class="eyebrow">${escapeHtml(book.author)}</p>
        <${large ? 'h3' : 'h4'}>${escapeHtml(book.title)}</${large ? 'h3' : 'h4'}>
        <p>${escapeHtml(book.description || '')}</p>
      </div>
    </div>
  `;
}

function coverGradient(book) {
  const seeds = [
    'linear-gradient(135deg,#0f172a,#1d4ed8 56%,#f7b84b 120%)',
    'linear-gradient(135deg,#111827,#2956c4 46%,#ff8c5a 120%)',
    'linear-gradient(135deg,#0b1220,#1f3b87 50%,#f0c24f 120%)',
    'linear-gradient(135deg,#151515,#4c4ddc 50%,#77c3ff 120%)',
  ];
  const n = [...(book.identifier || book.id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return seeds[n % seeds.length];
}

function normalizeAssetPath(path = '') {
  const value = String(path || '').trim();
  if (!value) return value;
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith('/')) return `.${value}`;
  return value;
}

function normalizeLibraryIndex(json = {}) {
  const library = json?.library || {};
  const books = Array.isArray(library.books) ? library.books.map(book => ({
    ...book,
    cover: normalizeAssetPath(book.cover),
    metadataPath: normalizeAssetPath(book.metadataPath),
    textsBase: normalizeAssetPath(book.textsBase),
  })) : [];
  const fonts = Array.isArray(json?.fonts) ? json.fonts.map(font => ({
    ...font,
    url: normalizeAssetPath(font.url),
  })) : [];
  return {
    ...json,
    library: {
      ...library,
      books,
    },
    fonts,
  };
}

async function fetchJsonWithFallback(urls = []) {
  let lastError = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);
      return await res.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Không tải được dữ liệu thư viện.');
}

async function loadIndex() {
  const json = await fetchJsonWithFallback([
    `./api/library-index?ts=${Date.now()}`,
    `./.cache/library-index.json?ts=${Date.now()}`,
  ]);
  const normalized = normalizeLibraryIndex(json);
  state.index = normalized;
  state.books = normalized.library.books || [];
  applyLibraryFilters();
  renderHome();
  renderHomeFilters();
  populateLibraryFilters();
  renderLibrary();
  populateSettings();
  if (!state.currentBook && state.books[0]) setCurrentBook(state.books[0].id, false);
}

function renderHome() {
  const homeBooks = state.books.filter(bookMatchesHomeFilters);
  els.libraryCount.textContent = `${homeBooks.length} books`;
  const newest = [...homeBooks].reverse().slice(0, 3);
  els.newBooks.innerHTML = newest.length
    ? newest.map(renderBookCard).join('')
    : '<div class="empty-state">Không có sách mới khớp với bộ lọc hiện tại.</div>';
  els.forYouBooks.innerHTML = homeBooks.length
    ? homeBooks.slice(0, 27).map(renderBookCard).join('')
    : '<div class="empty-state">Không có sách khớp với nhóm / loại / tác giả đang chọn.</div>';
  bindBookButtons();
}

function renderLibrary() {
  if (state.isSearching) {
    els.libraryStatus.textContent = `Đang quét nội dung cho “${state.searchQuery}”...`;
    els.clearSearchBtn.hidden = false;
    els.libraryGrid.innerHTML = `<div class="empty-state">Đang quét toàn bộ thư viện, vui lòng chờ một chút...</div>`;
    return;
  }

  if (state.searchQuery) {
    const total = state.searchResults.length;
    els.libraryStatus.textContent = total
      ? `${total} kết quả nội dung cho “${state.searchQuery}”.`
      : `Không tìm thấy nội dung khớp với “${state.searchQuery}”.`;
    els.clearSearchBtn.hidden = false;
    els.libraryGrid.classList.add('is-search-results');
    els.libraryGrid.innerHTML = total
      ? state.searchResults.map(renderSearchResultCard).join('')
      : `<div class="empty-state">Không có kết quả trong tên sách, mô tả hoặc nội dung text.</div>`;
    bindSearchResultButtons();
    return;
  }

  const activeFilters = [];
  if (state.libraryFilters.group) activeFilters.push(`nhóm: ${state.libraryFilters.group}`);
  if (state.libraryFilters.topic) activeFilters.push(`chủ đề: ${state.libraryFilters.topic}`);
  if (state.libraryFilters.series) activeFilters.push(`series: ${state.libraryFilters.series}`);
  if (state.libraryFilters.statuses.length) activeFilters.push(`trạng thái: ${state.libraryFilters.statuses.join(', ')}`);
  els.libraryStatus.textContent = activeFilters.length
    ? `Hiển thị ${state.filtered.length} / ${state.books.length} tựa sách. Lọc theo ${activeFilters.join(' • ')}.`
    : `Hiển thị ${state.filtered.length} / ${state.books.length} tựa sách trong thư viện.`;
  els.clearSearchBtn.hidden = true;
  els.libraryGrid.classList.remove('is-search-results');
  els.libraryGrid.innerHTML = state.filtered.length
    ? state.filtered.map(renderBookCard).join('')
    : `<div class="empty-state">Không có sách khớp với bộ lọc hiện tại.</div>`;
  bindBookButtons();
}

function renderBookCard(book) {
  return `
    <button class="book-card" data-book-id="${book.id}" aria-label="Mở sách ${escapeHtml(book.title)}">
      ${createCoverMarkup(book)}
      <div class="card-caption">
        <h4>${escapeHtml(book.title)}</h4>
        <p>${escapeHtml(book.author)}</p>
        <p class="card-meta">${escapeHtml(getBookMetaSummary(book))}</p>
      </div>
    </button>
  `;
}

function renderSearchResultCard(result) {
  return `
    <button class="search-result-card" data-search-open="1" data-book-id="${result.bookId}" data-file="${escapeHtml(result.file)}" aria-label="Mở kết quả ${escapeHtml(result.bookTitle)} - ${escapeHtml(result.sectionTitle)}">
      <div class="search-result-cover">${createCoverMarkup(result.book)}</div>
      <div class="search-result-copy">
        <p class="eyebrow">${escapeHtml(result.book.author)}</p>
        <h3>${escapeHtml(result.bookTitle)}</h3>
        <p class="search-result-section">${escapeHtml(result.sectionTitle)}</p>
        <p class="search-result-snippet">${escapeHtml(result.snippet)}</p>
      </div>
    </button>
  `;
}

function bindBookButtons() {
  document.querySelectorAll('[data-book-id]:not([data-search-open])').forEach(btn => {
    btn.onclick = () => setCurrentBook(btn.dataset.bookId, true);
  });
}

function bindSearchResultButtons() {
  document.querySelectorAll('[data-search-open]').forEach(btn => {
    btn.onclick = async () => {
      setCurrentBook(btn.dataset.bookId, false);
      navigateTo('detail');
      await openTextFile(btn.dataset.file, { scrollTop: 0 });
    };
  });
}

function setCurrentBook(bookId, navigate = true) {
  const book = state.books.find(b => b.id === bookId);
  if (!book) return;
  state.currentBook = book;
  els.detailTitle.textContent = book.title;
  els.detailAuthor.textContent = book.author;
  els.detailChapters.textContent = `${book.chapterCount} chương`;
  els.detailFiles.textContent = '';
  els.detailDescription.textContent = book.description || 'Sách đã được export từ EPUB thành metadata + text.';
  els.detailCover.innerHTML = createCoverMarkup(book, true);
  els.readerBookTitle.textContent = book.title;
  renderToc(book);
  renderBookmarks();
  updateChapterNavButtons();
  if (navigate) navigateTo('detail');
}

function renderToc(book) {
  const items = (book.tocItems || []).filter(item => item.matched_file);
  els.tocList.innerHTML = items.map((item, idx) => `
    <button class="toc-item ${item.matched_file === state.currentFile ? 'active' : ''}" data-file="${item.matched_file}">
      <span class="toc-badge">${item.chapter_number || item.level || idx + 1}</span>
      <span>${escapeHtml(item.title)}</span>
    </button>
  `).join('') || `<div class="empty-state">Chưa có TOC match với text file.</div>`;
  document.querySelectorAll('.toc-item').forEach(btn => btn.onclick = () => openTextFile(btn.dataset.file));
}

function currentBookBookmarks() {
  return state.currentBook ? (state.bookmarks[state.currentBook.id] || []) : [];
}

function renderBookmarks() {
  const items = currentBookBookmarks();
  if (!items.length) {
    els.bookmarkList.innerHTML = `<div class="empty-state">Chưa có bookmark nào cho sách này.</div>`;
    return;
  }
  els.bookmarkList.innerHTML = items.map((item, idx) => `
    <button class="bookmark-item" data-bookmark-index="${idx}">
      <span class="toc-badge">${idx + 1}</span>
      <span class="bookmark-copy">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(item.file)} • ${Math.round(item.scrollTop || 0)} px</span>
      </span>
    </button>
  `).join('');
  document.querySelectorAll('[data-bookmark-index]').forEach(btn => {
    btn.onclick = () => goToBookmark(Number(btn.dataset.bookmarkIndex));
  });
}

function currentBookHighlights() {
  return state.currentBook ? (state.highlights[state.currentBook.id] || []) : [];
}

function renderHighlights() {
  const items = currentBookHighlights();
  if (!els.highlightList) return;
  if (!items.length) {
    els.highlightList.innerHTML = `<div class="empty-state">Chưa có highlight nào cho sách này.</div>`;
    return;
  }
  els.highlightList.innerHTML = items.map((item, idx) => `
    <button class="bookmark-item" data-highlight-index="${idx}">
      <span class="toc-badge">✦</span>
      <span class="bookmark-copy">
        <strong>${escapeHtml(item.label || 'Highlight')}</strong>
        <span>${escapeHtml(truncateSnippet(item.text, 120))}</span>
      </span>
    </button>
  `).join('');
  document.querySelectorAll('[data-highlight-index]').forEach(btn => {
    btn.onclick = () => goToHighlight(Number(btn.dataset.highlightIndex));
  });
}

function saveProgress() {
  if (!state.currentBook || !state.currentFile) return;
  const key = `${state.currentBook.id}::${state.currentFile}`;
  state.progress[key] = { scrollTop: els.readerArticle.scrollTop, savedAt: Date.now() };
  saveJson(STORAGE_KEYS.progress, state.progress);
}

function updateLastPosition() {
  if (!state.currentBook || !state.currentFile) return;
  state.lastPosition = {
    bookId: state.currentBook.id,
    file: state.currentFile,
    scrollTop: els.readerArticle.scrollTop,
    label: state.currentSection?.title || state.currentFile,
  };
}

async function openTextFile(fileName, options = {}) {
  if (!state.currentBook || !fileName) return;
  if (state.currentFile && !options.skipHistory) updateLastPosition();
  state.currentFile = fileName;
  document.querySelectorAll('.toc-item').forEach(node => node.classList.toggle('active', node.dataset.file === fileName));
  const item = state.currentBook.tocItems.find(x => x.matched_file === fileName) || { title: fileName, role: 'body' };
  state.currentSection = item;
  els.readerSectionTitle.textContent = item.title || fileName;
  const text = await getBookText(state.currentBook, fileName);
  els.readerContent.innerHTML = renderFormattedText(text, item);
  navigateTo('reader');
  const key = `${state.currentBook.id}::${fileName}`;
  const saved = options.scrollTop != null ? { scrollTop: options.scrollTop } : state.progress[key];
  const top = saved?.scrollTop || 0;
  requestAnimationFrame(() => { els.readerArticle.scrollTop = top; });
  saveProgress();
  renderBookmarks();
  renderHighlights();
  renderToc(state.currentBook);
  updateChapterNavButtons();
}

function renderFormattedText(text, item) {
  const roleClassMap = {
    title: 'format-title',
    chapter: 'format-chapter',
    header_large: 'format-header-large',
    header_medium: 'format-header-medium',
    header_small: 'format-header-small',
  };
  const headingClass = roleClassMap[item.role] || 'format-header-large';
  const clean = (text || '').trim();
  const lines = clean.split(/\n+/).map(x => x.trim()).filter(Boolean);
  const titleLine = lines[0] || item.title || state.currentBook.title;
  const bodyLines = lines.slice(1);
  const bodyMarkup = bodyLines.length
    ? bodyLines.map(p => `<p class="format-body">${escapeHtml(p)}</p>`).join('')
    : `<p class="format-body">${escapeHtml(clean || '(File text rỗng)')}</p>`;
  return `
    <section class="format-standard">
      <h1 class="${headingClass}">${escapeHtml(titleLine)}</h1>
      ${bodyMarkup}
    </section>
  `;
}

function navigateTo(screen) {
  if ((screen === 'detail' || screen === 'reader') && !state.currentBook) return;
  state.currentScreen = screen;
  document.querySelectorAll('.screen').forEach(el => el.classList.toggle('active', el.dataset.screen === screen));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.nav === screen));
}

async function applySearch() {
  const q = els.searchInput.value.trim();
  state.searchQuery = q;

  if (!q) {
    state.searchResults = [];
    state.isSearching = false;
    applyLibraryFilters();
    els.searchMeta.textContent = 'Tìm theo tên sách, tác giả, mô tả và nội dung bên trong file text.';
    renderLibrary();
    return;
  }

  state.filtered = state.books.filter(book => `${book.title} ${book.author} ${book.description || ''}`.toLowerCase().includes(q.toLowerCase()));
  state.isSearching = true;
  els.searchMeta.textContent = `Đang quét nội dung cho “${q}” trong toàn bộ thư viện...`;
  renderLibrary();
  navigateTo('library');

  const results = await searchLibraryContent(q);
  if (state.searchQuery !== q) return;

  state.searchResults = results;
  state.isSearching = false;
  els.searchMeta.textContent = results.length
    ? `Tìm thấy ${results.length} kết quả nội dung cho “${q}”.`
    : `Không có kết quả nội dung cho “${q}”.`;
  renderLibrary();
}

function clearSearch() {
  els.searchInput.value = '';
  state.searchQuery = '';
  state.searchResults = [];
  state.isSearching = false;
  applyLibraryFilters();
  els.searchMeta.textContent = 'Tìm theo tên sách, tác giả, mô tả và nội dung bên trong file text.';
  renderLibrary();
}

async function searchLibraryContent(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results = [];

  for (const book of state.books) {
    const metaHaystack = `${book.title} ${book.author} ${book.description || ''}`.toLowerCase();
    if (metaHaystack.includes(q)) {
      results.push({
        bookId: book.id,
        book,
        bookTitle: book.title,
        file: book.firstText || getBookFiles(book)[0] || '',
        sectionTitle: 'Metadata sách',
        snippet: truncateSnippet(book.description || `${book.title} — ${book.author}`),
      });
    }

    const files = getBookFiles(book);
    for (const file of files) {
      const text = await getBookText(book, file);
      const normalized = text.toLowerCase();
      const idx = normalized.indexOf(q);
      if (idx === -1) continue;
      const tocItem = (book.tocItems || []).find(item => item.matched_file === file);
      results.push({
        bookId: book.id,
        book,
        bookTitle: book.title,
        file,
        sectionTitle: tocItem?.title || file,
        snippet: buildSnippet(text, idx, query.length),
      });
    }
  }

  return results.slice(0, 300);
}

function getBookFiles(book) {
  const candidates = [];
  if (Array.isArray(book.textFiles)) candidates.push(...book.textFiles);
  if (Array.isArray(book.texts)) candidates.push(...book.texts.map(item => typeof item === 'string' ? item : item?.file).filter(Boolean));
  if (Array.isArray(book.files)) candidates.push(...book.files.map(item => typeof item === 'string' ? item : item?.file).filter(Boolean));
  if (Array.isArray(book.tocItems)) candidates.push(...book.tocItems.map(item => item?.matched_file).filter(Boolean));
  if (book.firstText) candidates.push(book.firstText);
  return [...new Set(candidates)];
}

async function getBookText(book, file) {
  const key = `${book.id}::${file}`;
  if (state.textCache.has(key)) return state.textCache.get(key);
  try {
    const res = await fetch(book.textsBase + file);
    const text = await res.text();
    state.textCache.set(key, text);
    return text;
  } catch {
    state.textCache.set(key, '');
    return '';
  }
}

function buildSnippet(text, index, queryLength) {
  const start = Math.max(0, index - 90);
  const end = Math.min(text.length, index + queryLength + 130);
  const slice = text.slice(start, end).replace(/\s+/g, ' ').trim();
  return `${start > 0 ? '…' : ''}${slice}${end < text.length ? '…' : ''}`;
}

function truncateSnippet(text, max = 180) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max).trim()}…`;
}

function getAllFonts() {
  const scanned = (state.index?.fonts || []).map(font => ({ ...font, family: `"font-${font.id}", ${SYSTEM_FONTS[0].family}` }));
  return [...SYSTEM_FONTS, ...scanned];
}

function populateSettings() {
  els.bgSelect.innerHTML = Object.entries(BG_OPTIONS).map(([value, opt]) => `<option value="${value}">${opt.label}</option>`).join('');
  els.fontSelect.innerHTML = getAllFonts().map(font => `<option value="${font.id}">${font.name}</option>`).join('');
  els.bgSelect.value = state.preferences.bg;
  els.fontSelect.value = state.preferences.font;
  els.scaleRange.value = state.preferences.scale;
  els.scaleValue.textContent = `${state.preferences.scale}%`;
  injectFontFaces();
  applyReaderPreferences();
}

function injectFontFaces() {
  const scanned = state.index?.fonts || [];
  fontStyleTag.textContent = scanned.map(font => `@font-face{font-family:"font-${font.id}";src:url("${font.url}");font-display:swap;}`).join('\n');
}

function applyReaderPreferences() {
  const palette = BG_OPTIONS[state.preferences.bg] || BG_OPTIONS.paper;
  const font = getAllFonts().find(x => x.id === state.preferences.font) || SYSTEM_FONTS[0];
  document.documentElement.style.setProperty('--reader-paper', palette.paper);
  document.documentElement.style.setProperty('--reader-ink', palette.ink);
  document.documentElement.style.setProperty('--bg', palette.bg);
  document.documentElement.style.setProperty('--reader-font-family', font.family);
  document.documentElement.style.setProperty('--reader-scale', String(state.preferences.scale / 100));
  els.scaleValue.textContent = `${state.preferences.scale}%`;
  saveJson(STORAGE_KEYS.preferences, state.preferences);
}

function addBookmark() {
  if (!state.currentBook || !state.currentFile) return;
  const bucket = state.bookmarks[state.currentBook.id] || [];
  bucket.unshift({
    file: state.currentFile,
    label: state.currentSection?.title || state.currentFile,
    scrollTop: els.readerArticle.scrollTop,
    savedAt: Date.now(),
  });
  state.bookmarks[state.currentBook.id] = bucket.slice(0, 50);
  saveJson(STORAGE_KEYS.bookmarks, state.bookmarks);
  renderBookmarks();
  applyLibraryFilters();
  populateLibraryFilters();
}

function addHighlight() {
  if (!state.currentBook || !state.currentFile) return;
  const selection = window.getSelection();
  const selectedText = selection ? selection.toString().replace(/\s+/g, ' ').trim() : '';
  const articleText = els.readerArticle?.innerText?.replace(/\s+/g, ' ').trim() || '';
  const text = selectedText || articleText.slice(0, 220);
  if (!text) return;
  const bucket = state.highlights[state.currentBook.id] || [];
  bucket.unshift({
    file: state.currentFile,
    label: state.currentSection?.title || state.currentFile,
    text,
    scrollTop: els.readerArticle.scrollTop,
    savedAt: Date.now(),
  });
  state.highlights[state.currentBook.id] = bucket.slice(0, 80);
  saveJson(STORAGE_KEYS.highlights, state.highlights);
  renderHighlights();
  applyLibraryFilters();
  populateLibraryFilters();
}

function goToHighlight(index) {
  const target = currentBookHighlights()[index];
  if (!target) return;
  openTextFile(target.file, { scrollTop: target.scrollTop });
}

function goToBookmark(index) {
  const target = currentBookBookmarks()[index];
  if (!target) return;
  openTextFile(target.file, { scrollTop: target.scrollTop });
}

function backToLastPosition() {
  if (!state.lastPosition) return;
  const targetBook = state.books.find(book => book.id === state.lastPosition.bookId);
  if (!targetBook) return;
  setCurrentBook(targetBook.id, false);
  openTextFile(state.lastPosition.file, { scrollTop: state.lastPosition.scrollTop, skipHistory: true });
}

function toggleDrawer(which) {
  if (which === 'toc') {
    els.tocDrawer.hidden = !els.tocDrawer.hidden;
    if (!els.tocDrawer.hidden) els.settingsDrawer.hidden = true;
  } else {
    els.settingsDrawer.hidden = !els.settingsDrawer.hidden;
    if (!els.settingsDrawer.hidden) els.tocDrawer.hidden = true;
  }
}

function setupEvents() {
  els.searchInput.addEventListener('input', debounce(applySearch, 350));
  els.searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applySearch();
    }
  });
  els.clearSearchBtn.addEventListener('click', clearSearch);
  els.refreshBtn.addEventListener('click', loadIndex);
  els.downloadsBtn?.addEventListener('click', async () => {
    navigateTo('downloads');
    if (!state.downloads.length) await scanDownloadsFolder();
  });
  els.rescanDownloadsBtn?.addEventListener('click', () => scanDownloadsFolder());
  els.openBookBtn.addEventListener('click', () => openTextFile(state.currentBook?.firstText));
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.nav));
  });
  els.tocToggle.addEventListener('click', () => toggleDrawer('toc'));
  els.bookmarkToggle.addEventListener('click', () => {
    toggleDrawer('toc');
    activateDrawerTab('bookmarks');
  });
  els.prevChapterBtn?.addEventListener('click', () => stepChapter(-1));
  els.nextChapterBtn?.addEventListener('click', () => stepChapter(1));
  els.settingsToggle.addEventListener('click', () => toggleDrawer('settings'));
  els.backToLastBtn.addEventListener('click', backToLastPosition);
  els.addBookmarkBtn.addEventListener('click', addBookmark);
  els.addHighlightBtn?.addEventListener('click', addHighlight);
  els.filterGroup?.addEventListener('change', event => { state.libraryFilters.group = event.target.value; applyLibraryFilters(); renderLibrary(); });
  els.filterTopic?.addEventListener('change', event => { state.libraryFilters.topic = event.target.value; applyLibraryFilters(); renderLibrary(); });
  els.filterSeries?.addEventListener('change', event => { state.libraryFilters.series = event.target.value; applyLibraryFilters(); renderLibrary(); });
  els.resetFiltersBtn?.addEventListener('click', resetLibraryFilters);
  els.homeFilterResetBtn?.addEventListener('click', resetHomeFilters);
  els.bgSelect.addEventListener('change', () => { state.preferences.bg = els.bgSelect.value; applyReaderPreferences(); });
  els.fontSelect.addEventListener('change', () => { state.preferences.font = els.fontSelect.value; applyReaderPreferences(); });
  els.scaleRange.addEventListener('input', () => { state.preferences.scale = Number(els.scaleRange.value); applyReaderPreferences(); });
  els.readerArticle.addEventListener('scroll', debounce(saveProgress, 150));
  document.querySelectorAll('.drawer-tab').forEach(btn => btn.addEventListener('click', () => activateDrawerTab(btn.dataset.drawerTab)));

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    state.deferredPrompt = e;
    els.installBtn.hidden = false;
  });
  els.installBtn.addEventListener('click', async () => {
    if (!state.deferredPrompt) return;
    state.deferredPrompt.prompt();
    await state.deferredPrompt.userChoice;
    state.deferredPrompt = null;
    els.installBtn.hidden = true;
  });
}

function activateDrawerTab(name) {
  document.querySelectorAll('.drawer-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.drawerTab === name));
  document.querySelectorAll('.drawer-panel').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === name));
}

function debounce(fn, wait = 100) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

async function init() {
  setupEvents();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
  }
  await loadIndex();
  await scanDownloadsFolder();
  navigateTo('home');
}

init();
