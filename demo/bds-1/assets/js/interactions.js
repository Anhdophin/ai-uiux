window.interactionsModule = (function () {
  const pageDepth = window.location.pathname.includes('/pages/') ? '..' : '.';

  function imagePath(fileName) {
    return `${pageDepth}/assets/images/${fileName}`;
  }

  function renderProperties(limit) {
    const container = document.querySelector('[data-properties-grid]');
    if (!container || !window.siteContent) return;
    const data = limit ? window.siteContent.featuredProperties.slice(0, limit) : window.siteContent.featuredProperties;

    container.innerHTML = data
      .map(
        (item) => `
        <article class="property-card">
          <div class="property-card__media">
            <span class="badge property-card__badge">${item.badge}</span>
            <img src="${imagePath(item.image)}" alt="${item.title}">
          </div>
          <div class="property-card__body">
            <p class="card__eyebrow">${item.type}</p>
            <h3>${item.title}</h3>
            <p>${item.location}</p>
            <div class="property-meta">
              <span class="meta-pill">${item.area}</span>
              <span class="meta-pill">${item.direction}</span>
              <span class="meta-pill">Hướng ${item.facing}</span>
            </div>
            <p class="mt-md">${item.fengShui}</p>
            <div class="property-card__footer">
              <span class="price-tag">Từ ${item.price.toFixed(1)} tỷ</span>
              <a class="button-link button--secondary" href="${pageDepth}/pages/properties.html">Xem chi tiết</a>
            </div>
          </div>
        </article>`
      )
      .join('');
  }

  function renderBlogs(limit) {
    const container = document.querySelector('[data-blog-grid]');
    if (!container || !window.siteContent) return;
    const data = limit ? window.siteContent.blogPosts.slice(0, limit) : window.siteContent.blogPosts;

    container.innerHTML = data
      .map(
        (post) => `
        <article class="blog-card">
          <div class="blog-card__media">
            <img src="${imagePath(post.image)}" alt="${post.title}">
          </div>
          <div class="blog-card__body stack">
            <p class="card__eyebrow">${post.category}</p>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <a class="button-link button--secondary" href="${pageDepth}/pages/blog.html">Đọc bài viết</a>
          </div>
        </article>`
      )
      .join('');
  }

  function renderExperts() {
    const container = document.querySelector('[data-team-grid]');
    if (!container || !window.siteContent) return;
    container.innerHTML = window.siteContent.experts
      .map(
        (person) => `
        <article class="team-card">
          <div class="team-card__media">
            <img src="${imagePath(person.image)}" alt="${person.name}">
          </div>
          <div class="team-card__body stack">
            <h3>${person.name}</h3>
            <p class="card__eyebrow">${person.role}</p>
            <p>${person.experience}</p>
          </div>
        </article>`
      )
      .join('');
  }

  function renderTestimonials() {
    const container = document.querySelector('[data-testimonial-grid]');
    if (!container || !window.siteContent) return;
    container.innerHTML = window.siteContent.testimonials
      .map(
        (item) => `
        <article class="testimonial-card stack">
          <p>“${item.quote}”</p>
          <strong>${item.author}</strong>
        </article>`
      )
      .join('');
  }

  function renderFaq() {
    const container = document.querySelector('[data-faq-grid]');
    if (!container || !window.siteContent) return;
    container.innerHTML = window.siteContent.faq
      .map(
        (item, index) => `
        <article class="faq-item ${index === 0 ? 'is-open' : ''}">
          <button class="faq-item__button" type="button" aria-expanded="${index === 0 ? 'true' : 'false'}">
            <span>${item.question}</span>
            <span class="faq-item__icon">+</span>
          </button>
          <div class="faq-item__answer">
            <p>${item.answer}</p>
          </div>
        </article>`
      )
      .join('');

    container.querySelectorAll('.faq-item__button').forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const isOpen = item.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(isOpen));
        button.querySelector('.faq-item__icon').textContent = isOpen ? '–' : '+';
      });
    });
  }

  function renderStats() {
    const container = document.querySelector('[data-stats-grid]');
    if (!container || !window.siteContent) return;
    container.innerHTML = window.siteContent.stats
      .map(
        (stat) => `
        <article class="stat-card">
          <strong>${stat.value}</strong>
          <p>${stat.label}</p>
        </article>`
      )
      .join('');
  }

  function enablePropertyFilter() {
    const grid = document.querySelector('[data-properties-grid]');
    const form = document.querySelector('[data-filter-form]');
    if (!grid || !form || !window.siteContent) return;

    form.addEventListener('input', () => {
      const formData = new FormData(form);
      const type = formData.get('type');
      const direction = formData.get('direction');
      const budget = Number(formData.get('budget') || 999);
      const keyword = String(formData.get('keyword') || '').toLowerCase();

      const filtered = window.siteContent.featuredProperties.filter((item) => {
        const matchesType = !type || item.type === type;
        const matchesDirection = !direction || item.direction === direction;
        const matchesBudget = item.price <= budget;
        const haystack = `${item.title} ${item.location} ${item.fengShui}`.toLowerCase();
        const matchesKeyword = !keyword || haystack.includes(keyword);
        return matchesType && matchesDirection && matchesBudget && matchesKeyword;
      });

      grid.innerHTML = filtered.length
        ? filtered
            .map(
              (item) => `
              <article class="property-card">
                <div class="property-card__media">
                  <span class="badge property-card__badge">${item.badge}</span>
                  <img src="${imagePath(item.image)}" alt="${item.title}">
                </div>
                <div class="property-card__body">
                  <p class="card__eyebrow">${item.type}</p>
                  <h3>${item.title}</h3>
                  <p>${item.location}</p>
                  <div class="property-meta">
                    <span class="meta-pill">${item.area}</span>
                    <span class="meta-pill">${item.direction}</span>
                    <span class="meta-pill">Hướng ${item.facing}</span>
                  </div>
                  <p class="mt-md">${item.fengShui}</p>
                  <div class="property-card__footer">
                    <span class="price-tag">Từ ${item.price.toFixed(1)} tỷ</span>
                    <a class="button-link button--secondary" href="#contact-form">Nhận tư vấn</a>
                  </div>
                </div>
              </article>`
            )
            .join('')
        : '<div class="surface-card surface-card--padded"><p>Chưa có bất động sản phù hợp bộ lọc hiện tại.</p></div>';
    });
  }

  function setupFengShuiLookup() {
    const form = document.querySelector('[data-lookup-form]');
    const result = document.querySelector('[data-lookup-result]');
    if (!form || !result) return;

    const westDirections = ['Tây', 'Tây Bắc', 'Tây Nam', 'Đông Bắc'];
    const eastDirections = ['Đông', 'Đông Nam', 'Bắc', 'Nam'];
    const menWest = [2, 6, 7, 8];
    const womenWest = [2, 6, 7, 8];
    const napAm = {
      0: 'Kim', 1: 'Kim', 2: 'Thủy', 3: 'Thủy', 4: 'Hỏa', 5: 'Hỏa', 6: 'Thổ', 7: 'Thổ', 8: 'Mộc', 9: 'Mộc'
    };

    function digitSum(value) {
      return String(value).split('').reduce((sum, char) => sum + Number(char), 0);
    }

    function reduceToOne(value) {
      let current = value;
      while (current > 9) current = digitSum(current);
      return current;
    }

    function calculateKua(year, gender) {
      const shortYear = Number(String(year).slice(-2));
      const reduced = reduceToOne(shortYear);
      let kua;
      if (gender === 'male') {
        kua = 11 - reduced;
      } else {
        kua = reduced + 4;
      }
      while (kua > 9) kua = reduceToOne(kua);
      if (kua === 5) kua = gender === 'male' ? 2 : 8;
      return kua;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const birthdate = new FormData(form).get('birthdate');
      const gender = new FormData(form).get('gender');
      if (!birthdate || !gender) return;

      const year = new Date(String(birthdate)).getFullYear();
      const kua = calculateKua(year, gender);
      const isWest = (gender === 'male' ? menWest : womenWest).includes(kua);
      const directionGroup = isWest ? 'Tây tứ trạch' : 'Đông tứ trạch';
      const suitableDirections = (isWest ? westDirections : eastDirections).join(', ');
      const element = napAm[year % 10];
      const buildYear = year % 3 === 0 ? year + 1 : year + 2;

      result.innerHTML = `
        <div class="lookup-result__item">
          <strong>Cung mệnh tham khảo</strong>
          <span>${element}</span>
        </div>
        <div class="lookup-result__item">
          <strong>Nhóm hướng hợp</strong>
          <span>${directionGroup}</span>
        </div>
        <div class="lookup-result__item">
          <strong>Hướng ưu tiên</strong>
          <span>${suitableDirections}</span>
        </div>
        <div class="lookup-result__item">
          <strong>Số quái</strong>
          <span>${kua}</span>
        </div>
        <div class="lookup-result__item">
          <strong>Năm nên khảo sát mua/xây</strong>
          <span>${buildYear}</span>
        </div>
        <div class="lookup-result__item">
          <strong>Lưu ý</strong>
          <span>Kết quả dùng để tham khảo nhanh trên website, nên kết hợp tư vấn chuyên gia trước khi quyết định.</span>
        </div>`;

      result.classList.add('is-visible');
    });
  }

  function setupParallax() {
    const section = document.querySelector('[data-parallax]');
    if (!section) return;
    const layers = section.querySelectorAll('[data-depth]');

    const update = () => {
      const rect = section.getBoundingClientRect();
      const progress = rect.top / window.innerHeight;
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 0);
        layer.style.transform = `translate3d(0, ${progress * depth * -80}px, 0) scale(1.08)`;
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function enableHorizontalGallery() {
    document.querySelectorAll('[data-gallery-track]').forEach((track) => {
      track.addEventListener('wheel', (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        event.preventDefault();
        track.scrollBy({ left: event.deltaY, behavior: 'smooth' });
      }, { passive: false });
    });
  }

  function syncHeroStats() {
    const container = document.querySelector('[data-hero-stats]');
    if (!container || !window.siteContent) return;
    container.innerHTML = window.siteContent.stats.slice(0, 3).map((item) => `
      <article class="kpi-card">
        <strong>${item.value}</strong>
        <p>${item.label}</p>
      </article>`).join('');
  }

  function init() {
    renderProperties(document.body.dataset.page === 'home' ? 3 : 0);
    renderBlogs(document.body.dataset.page === 'home' ? 4 : 0);
    renderExperts();
    renderTestimonials();
    renderFaq();
    renderStats();
    syncHeroStats();
    enablePropertyFilter();
    setupFengShuiLookup();
    setupParallax();
    enableHorizontalGallery();
  }

  return { init };
})();
