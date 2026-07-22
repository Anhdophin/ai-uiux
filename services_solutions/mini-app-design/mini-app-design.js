const fallbackData = {
  site_profile: {
    brand_name: "iAppLab",
    hero_eyebrow: "Hello, I'm Anhdophin - Solution Artchitecture",
    hero_title: "i Make Mini App",
    hero_subtitle: "Thiết Kế Công Cụ Hỗ Trợ Công Việc",
    hero_body: "Chuyên tư vấn, nghiên cứu thiết kế công cụ theo nhu cầu thực tế.",
    header_cta_label: "Let's talk",
    hero_secondary_cta_label: "Workflow",
    hero_secondary_cta_href: "workflow/workflow.html",
    about_title: "Tôi Làm Gì",
    about_skill_label: "Thiết kế giải pháp cho 80% việc vặt và lặp lại",
    about_skill_percent: 80,
    about_body: "Trong thực tế, nhiều việc đang được làm theo thói quen: làm tay, lặp lại, xử lý qua nhiều file, nhiều bước. Việc vẫn hoạt động nhưng tốn thời gian và dễ sai ở những chỗ nhỏ. Tôi không thay đổi cách việc hoạt động. Tôi nhìn vào đó, và thiết kế Mini App để xử lý đúng phần cần thiết, giúp công việc gọn lại và rõ ràng hơn.",
    about_card_title: "About Me",
    services_title: "Tôi cung cấp giải pháp sáng tạo cho ngách.",
    portfolio_title: "Audit Workflow",
    testimonial_title: "Clients are satisfied for our work, view feedback",
    contact_title: "Dịch vụ này chưa khớp nhu cầu của bạn? Tôi còn nhiều sự sáng tạo và cách giải quyết vấn đề khác. Liên hệ để trao đổi thêm.",
    contact_subtitle: "Book 30 phút gặp google meet ->",
    contact_primary_label: "Let's Meet On Google",
    contact_primary_href: "https://tally.so/r/RGRE2P",
    contact_secondary_label: "Dịch Vụ Khác",
    contact_secondary_href: "../../services/",
    footer_copy: "iLabApp chuyên thiết kế phần mềm mini giúp workflow chuyên môn chạy hiệu quả và có tính tự động.",
    hero_image_url: "assets/portrait-1.png",
    about_image_url: "assets/portrait-2.png"
  },
  site_nav: [
    { label: "Top", href: "#hero", sort_order: 1 },
    { label: "About", href: "#about", sort_order: 2 },
    { label: "Services", href: "#services", sort_order: 3 },
    { label: "Steps", href: "#portfolio", sort_order: 4 },
    { label: "Bottom", href: "#contact", sort_order: 5 }
  ],
  site_socials: [
    { label: "FB", href: "https://www.facebook.com/anhdophin/#", icon_text: "Fb", sort_order: 1 },
    { label: "INS", href: "https://www.instagram.com/anhdophin/?hl=en", icon_text: "in", sort_order: 2 },
    { label: "YT", href: "https://www.youtube.com/@anhdophin", icon_text: "Yt", sort_order: 3 }
  ],
  site_services: [
    { title: "Workflow-based Tools", body: "Thiết kế cho các công việc thường vận hành theo kinh nghiệm.\nPhân tích cách vận hành thực tế và làm công cụ phù hợp, giúp chuẩn hóa thao tác và tăng năng xuất", icon_text: "⚙", accent_color: "#9b4dff", sort_order: 1 },
    { title: "Work Support Tools", body: "Thiết kế cho nghiệp vụ chuyên môn cần tự động hóa. - Thiết kế tools chuyên môn để xử lý trực tiếp, giảm sai số và rút ngắn thời gian.", icon_text: "</>", accent_color: "#f6b400", sort_order: 2 },
    { title: "Batch Content & Data", body: "Thiết kế giúp xử lý files số lượng lớn. - Thiết kế tool xử lý hàng loạt, nhanh, ổn định và đồng bộ.", icon_text: "✦", accent_color: "#ff5a7a", sort_order: 3 },
    { title: "Internal Tools", body: "Dữ liệu nội bộ hỗn loạn và phân tán gây khó khăn theo dõi & kiểm soát. - Thiết kế tools hỗ trợ quản lý.", icon_text: "∞", accent_color: "#0fa8b8", sort_order: 4 },
  ],
  site_projects: [
    { title: "Workflow Audit", body: "Nhìn cách doanh nghiệp đang làm bằng tay, tách bước có thể tự động hóa.", tag: "Step 1: Discovery", image_url: "assets/project-1.png", sort_order: 1 },
    { title: "Logic Mapping", body: "Biến rule vận hành thành logic xử lý rõ ràng để AI và tool có thể đọc được.", tag: "Step 2: Structure", image_url: "assets/project-2.svg", sort_order: 2 },
    { title: "Micro Tool Delivery", body: "Thiết kế Mini App dùng nội bộ, phù hợp với quy trình sẵn có, loại bỏ thời gian.", tag: "Step 3: Delivery", image_url: "assets/project-3.svg", sort_order: 3 }
  ],
  site_testimonials: [
    { name: "A. Nguyen", role: "Operations", body: "Flow được bóc lại rất dễ hiểu. Cảm giác như công việc cũ được sắp hàng lại thành một hệ chạy được.", rating: 5, image_url: "assets/avatar-1.svg", sort_order: 1 },
    { name: "B. Tran", role: "Founder", body: "Điểm tốt là không sa vào dev nặng. Tập trung đúng vào workflow lặp lại nên đội nội bộ dễ hiểu và test nhanh.", rating: 5, image_url: "assets/avatar-2.svg", sort_order: 2 }
  ],
  site_downloads: [
    { title: "My Portfolio PDF", description: "My Portfolio", file_url: "../../services/downloads/", button_label: "Tải PDF", sort_order: 1 },
    { title: "Supabase SQL Setup", description: "Schema để tạo bảng demo", file_url: "../supabase/schema.sql", button_label: "Open", sort_order: 2 },
    { title: "Content Seed JSON", description: "Dữ liệu mẫu để import", file_url: "../data/content-seed1.json", button_label: "Open", sort_order: 3 }
  ]
};

const els = {
  brandName: document.getElementById('brandName'),
  footerBrandName: document.getElementById('footerBrandName'),
  headerCta: document.getElementById('headerCta'),
  heroEyebrow: document.getElementById('heroEyebrow'),
  heroTitle: document.getElementById('heroTitle'),
  heroSubtitle: document.getElementById('heroSubtitle'),
  heroBody: document.getElementById('heroBody'),
  heroImage: document.getElementById('heroImage'),
  heroSecondaryCta: document.getElementById('heroSecondaryCta'),
  servicesTitle: document.getElementById('servicesTitle'),
  aboutTitle: document.getElementById('aboutTitle'),
  aboutSkillLabel: document.getElementById('aboutSkillLabel'),
  aboutSkillMeter: document.getElementById('aboutSkillMeter'),
  aboutSkillTag: document.getElementById('aboutSkillTag'),
  aboutCardTitle: document.getElementById('aboutCardTitle'),
  aboutBody: document.getElementById('aboutBody'),
  aboutImage: document.getElementById('aboutImage'),
  portfolioTitle: document.getElementById('portfolioTitle'),
  testimonialTitle: document.getElementById('testimonialTitle'),
  contactTitle: document.getElementById('contactTitle'),
  contactSubtitle: document.getElementById('contactSubtitle'),
  contactPrimary: document.getElementById('contactPrimary'),
  contactSecondary: document.getElementById('contactSecondary'),
  footerCopy: document.getElementById('footerCopy'),
  mainNav: document.getElementById('mainNav'),
  mobileNav: document.getElementById('mobileNav'),
  footerNav: document.getElementById('footerNav'),
  socialRow: document.getElementById('socialRow'),
  footerSocial: document.getElementById('footerSocial'),
  serviceGrid: document.getElementById('serviceGrid'),
  portfolioGrid: document.getElementById('portfolioGrid'),
  testimonialGrid: document.getElementById('testimonialGrid'),
  downloadList: document.getElementById('downloadList'),
};

function sortByOrder(arr = []) {
  return [...arr].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
}

function textToRatingStars(count = 5) {
  return '★'.repeat(Math.max(0, Math.min(5, count))) + '☆'.repeat(5 - Math.max(0, Math.min(5, count)));
}

function setText(el, value) {
  if (el && typeof value === 'string') el.textContent = value;
}

function setLink(el, label, href) {
  if (!el) return;
  if (label) el.textContent = label;
  if (href) el.setAttribute('href', href);
}

function renderNav(items) {
  const html = sortByOrder(items).map(item => `<a href="${item.href}">${item.label}</a>`).join('');
  els.mainNav.innerHTML = html;
  els.mobileNav.innerHTML = html;
  els.footerNav.innerHTML = html;
}

function renderSocial(items) {
  const html = sortByOrder(items).map(item => `<a class="social-pill" href="${item.href}" aria-label="${item.label}">${item.icon_text || item.label}</a>`).join('');
  els.socialRow.innerHTML = html;
  els.footerSocial.innerHTML = html;
}

function renderServices(items) {
  els.serviceGrid.innerHTML = sortByOrder(items).map(item => `
    <article class="service-card">
      <div class="service-icon" style="background:${item.accent_color || '#b83f0f'}">${item.icon_text || '•'}</div>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </article>
  `).join('');
}

function renderProjects(items) {
  els.portfolioGrid.innerHTML = sortByOrder(items).map(item => `
    <article class="portfolio-card">
      <div class="portfolio-thumb"><img src="${item.image_url}" alt="${item.title}"></div>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
      <div class="portfolio-meta"><span class="meta-tag">${item.tag || 'Case'}</span></div>
    </article>
  `).join('');
}

function renderTestimonials(items) {
  els.testimonialGrid.innerHTML = sortByOrder(items).map(item => `
    <article class="testimonial-card">
      <div class="testimonial-avatar"><img src="${item.image_url}" alt="${item.name}"></div>
      <div>
        <h3>${item.name}</h3>
        <p>${item.body}</p>
        <div class="testimonial-meta">
          <small>${item.role || ''}</small>
          <div class="rating">${textToRatingStars(item.rating)}</div>
        </div>
      </div>
    </article>
  `).join('');
}

function renderDownloads(items) {
  els.downloadList.innerHTML = sortByOrder(items).map(item => `
    <div class="download-item">
      <div>
        <strong>${item.title}</strong>
        <small>${item.description || ''}</small>
      </div>
      <a class="btn btn-secondary" href="${item.file_url}" target="_blank" rel="noopener">${item.button_label || 'Open'}</a>
    </div>
  `).join('');
}

function applyProfile(profile) {
  setText(els.brandName, profile.brand_name);
  setText(els.footerBrandName, profile.brand_name);
  setText(els.heroEyebrow, profile.hero_eyebrow);
  setText(els.heroTitle, profile.hero_title);
  setText(els.heroSubtitle, profile.hero_subtitle);
  setText(els.heroBody, profile.hero_body);
  setText(els.servicesTitle, profile.services_title);
  setText(els.aboutTitle, profile.about_title);
  setText(els.aboutSkillLabel, profile.about_skill_label);
  if (els.aboutSkillMeter && typeof profile.about_skill_percent === 'number') {
    els.aboutSkillMeter.style.width = `${profile.about_skill_percent}%`;
    setText(els.aboutSkillTag, `${profile.about_skill_percent}%`);
  }
  setText(els.aboutCardTitle, profile.about_card_title);
  setText(els.aboutBody, profile.about_body);
  setText(els.portfolioTitle, profile.portfolio_title);
  setText(els.testimonialTitle, profile.testimonial_title);
  setText(els.contactTitle, profile.contact_title);
  setText(els.contactSubtitle, profile.contact_subtitle);
  setText(els.footerCopy, profile.footer_copy);
  setLink(els.headerCta, profile.header_cta_label, 'workflow/workflow.html');
  setLink(els.heroSecondaryCta, profile.hero_secondary_cta_label, profile.hero_secondary_cta_href);
  setLink(els.contactPrimary, profile.contact_primary_label, profile.contact_primary_href);
  setLink(els.contactSecondary, profile.contact_secondary_label, profile.contact_secondary_href);
  if (profile.hero_image_url) els.heroImage.src = profile.hero_image_url;
  if (profile.about_image_url) els.aboutImage.src = profile.about_image_url;
}

async function loadFromSupabase() {
  if (!window.SUPABASE_CONFIG || !window.supabase || !window.SUPABASE_CONFIG.url || !window.SUPABASE_CONFIG.anonKey) {
    return null;
  }

  const client = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);

  const [profileRes, navRes, socialsRes, servicesRes, projectsRes, testimonialsRes, downloadsRes] = await Promise.all([
    client.from('site_profile').select('*').limit(1).maybeSingle(),
    client.from('site_nav').select('*').order('sort_order'),
    client.from('site_socials').select('*').order('sort_order'),
    client.from('site_services').select('*').order('sort_order'),
    client.from('site_projects').select('*').order('sort_order'),
    client.from('site_testimonials').select('*').order('sort_order'),
    client.from('site_downloads').select('*').order('sort_order'),
  ]);

  const hasError = [profileRes, navRes, socialsRes, servicesRes, projectsRes, testimonialsRes, downloadsRes].some(r => r.error);
  if (hasError) {
    console.warn('Supabase load failed, fallback to local seed.', [profileRes, navRes, socialsRes, servicesRes, projectsRes, testimonialsRes, downloadsRes]);
    return null;
  }

  return {
    site_profile: profileRes.data,
    site_nav: navRes.data,
    site_socials: socialsRes.data,
    site_services: servicesRes.data,
    site_projects: projectsRes.data,
    site_testimonials: testimonialsRes.data,
    site_downloads: downloadsRes.data,
  };
}

function renderAll(data) {
  applyProfile(data.site_profile || fallbackData.site_profile);
  renderNav(data.site_nav || fallbackData.site_nav);
  renderSocial(data.site_socials || fallbackData.site_socials);
  renderServices(data.site_services || fallbackData.site_services);
  renderProjects(data.site_projects || fallbackData.site_projects);
  renderTestimonials(data.site_testimonials || fallbackData.site_testimonials);
  renderDownloads(data.site_downloads || fallbackData.site_downloads);
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function setupParallax() {
  const items = [...document.querySelectorAll('[data-parallax]')];
  if (!items.length) return;
  const onScroll = () => {
    const y = window.scrollY;
    items.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.04;
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function setupMenu() {
  const toggle = document.getElementById('menuToggle');
  const panel = document.getElementById('mobileNavPanel');
  toggle?.addEventListener('click', () => panel.classList.toggle('open'));
  panel?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') panel.classList.remove('open');
  });
}

function setupForm() {
  const form = document.getElementById('requestForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    const saved = JSON.parse(localStorage.getItem('demo_requests') || '[]');
    saved.push({ ...formData, created_at: new Date().toISOString() });
    localStorage.setItem('demo_requests', JSON.stringify(saved));
    const success = document.getElementById('requestSuccess');
    if (success) success.hidden = false;
    alert('Đã lưu demo request vào localStorage để anh test trên localhost.');
    form.reset();
  });
}

async function init() {
  const supabaseData = await loadFromSupabase();
  renderAll(supabaseData || fallbackData);
  setupReveal();
  setupParallax();
  setupMenu();
  setupForm();
}

init();


async function loadBMTools(){
  const track = document.getElementById('bmTrack');
  if(!track) return;
  const tools = [
    {slug:'Business Model Canvas', title:'Business Model Canvas', icon:'assets/icons/tool1.svg'},
    {slug:'SWOT', title:'SWOT Analysis', icon:'assets/icons/tool2.svg'},
  ];
  tools.forEach(t=>{
    const a = document.createElement('a');
    const routeMap = {'Business Model Canvas':'../apps/business-canvas/','SWOT':'../apps/swot/','Form Builder':'../apps/robot/'};
    a.href = routeMap[t.slug] || '../apps/';
    a.className = 'bm-card';
    a.innerHTML = `<img src="${t.icon}" alt=""><h4>${t.title}</h4>`;
    track.appendChild(a);
  });
  const prev = document.getElementById('bmPrev');
  const next = document.getElementById('bmNext');
  prev && prev.addEventListener('click', ()=> track.scrollBy({left:-240, behavior:'smooth'}));
  next && next.addEventListener('click', ()=> track.scrollBy({left:240, behavior:'smooth'}));
}
document.addEventListener('DOMContentLoaded', loadBMTools);


