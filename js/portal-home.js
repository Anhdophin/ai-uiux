import { rootPath, setupSharedShell } from './modules.js';

const services = [
  {
    index: '01',
    name: 'COMPANY PROFILE DESIGN',
    heading: 'MAKE YOUR BUSINESS EASIER TO UNDERSTAND.',
    description:
      'Tu van noi dung va thiet ke ho so nang luc, catalogue, proposal, presentation va bo tai lieu giup khach hang, doi tac nhanh chong hieu doanh nghiep cua ban dang co gi dang quan tam.',
    tags: ['Company Profile', 'Catalogue', 'Proposal', 'Presentation', 'Sales Kit'],
    linkLabel: 'VIEW SERVICE ->',
    href: '/services/document-design/',
  },
  {
    index: '02',
    name: 'CREATIVE MEDIA',
    heading: 'MAKE YOUR MESSAGE WORTH WATCHING.',
    description:
      'Video ngan, creative shot, motion va visual storytelling giup san pham, khong gian va cau chuyen thuong hieu duoc the hien ro rang, sinh dong va de nho hon.',
    tags: ['Short Video', 'Creative Shot', 'Motion Content', 'Visual Storytelling', '360 Experience'],
    linkLabel: 'VIEW SERVICE ->',
    href: '/services/creative-media/',
  },
  {
    index: '03',
    name: 'INVENTION THINKING MENTOR',
    heading: 'MAKE YOUR IDEA POSSIBLE TO TRY.',
    description:
      'Dong hanh cung nguoi co y tuong nhung chua biet cach to chuc suy nghi, chon huong thuc hien hoac tao ra phien ban dau tien de kiem chung trong thuc te.',
    tags: ['Idea Development', 'Creative Thinking', 'Rapid Prototype', 'Creative Workflow', 'Digital Creation'],
    linkLabel: 'VIEW PROGRAM ->',
    href: '/services/mini-app-design/',
  },
];

const projects = [
  {
    title: 'COMPANY STORY SYSTEM',
    description:
      'He thong lai thong tin doanh nghiep thanh ho so nang luc, presentation va bo tai lieu giup doi tac nhanh chong hieu nang luc cot loi.',
    category: 'Corporate Design',
    image: '/demo/profile-anhdophin/assets/img_1.webp',
    alt: 'Business document layout and company profile system on a workshop desk',
    href: '/work/document-design/',
  },
  {
    title: 'CONTENT EXPERIENCE SET',
    description:
      'Mot buoi quay duoc phat trien thanh nhieu dau ra: creative short video, goc quay dac biet, video 360 va trai nghiem virtual tour.',
    category: 'Creative Media',
    image: '/demo/profile-anhdophin/assets/img_2.webp',
    alt: 'Media shooting setup with lighting and camera for brand content',
    href: '/work/creative-media/',
  },
  {
    title: 'CREATIVE DISCOVERY PROGRAM',
    description:
      'He thong mentoring va trai nghiem thuc hanh giup nguoi tham gia kham pha so thich, phat trien ky nang va tao ra san pham dau tien.',
    category: 'Creation Mentor',
    image: '/demo/profile-anhdophin/assets/img_3.webp',
    alt: 'Creative workshop with notes and ideation sketches',
    href: '/work/mini-apps/',
  },
  {
    title: 'MODULAR PRODUCT CONCEPT',
    description:
      'Tu y tuong so khai den logic cau tao, prototype, hinh anh trinh bay va huong phat trien thanh he san pham.',
    category: 'Product Creation',
    image: '/demo/profile-anhdophin/assets/img4.webp',
    alt: 'Modular product prototype with structure notes',
    href: '/work/',
  },
];

const apps = [
  {
    title: 'BRAND STORY MAPPER',
    description:
      'Sap xep thong tin doanh nghiep thanh mot cau truc de hieu truoc khi viet profile hoac presentation.',
    href: '/apps/',
  },
  {
    title: 'CREATIVE BRIEF BUILDER',
    description:
      'Bien mot y tuong noi dung thanh brief gom thong diep, doi tuong, tinh huong va huong the hien.',
    href: '/apps/',
  },
  {
    title: 'IDEA PROTOTYPE PLANNER',
    description:
      'Tach mot y tuong lon thanh phien ban nho hon de co the bat dau lam va kiem chung.',
    href: '/apps/',
  },
  {
    title: 'CREATIVE SHOT PLANNER',
    description:
      'Xay dung chuoi goc quay, chuyen dong va nhip dung cho mot video ngan.',
    href: '/apps/',
  },
];

function linkWithRoot(root, path) {
  return `${root}${path}`;
}

function serviceCard(item, root) {
  return `
    <article class="landing-card landing-service" data-reveal>
      <p class="landing-service__eyebrow">${item.index} / ${item.name}</p>
      <h3 class="landing-service__title">${item.heading}</h3>
      <p class="landing-service__description">${item.description}</p>
      <ul class="landing-tags">
        ${item.tags.map((tag) => `<li>${tag}</li>`).join('')}
      </ul>
      <a class="landing-link" href="${linkWithRoot(root, item.href)}">${item.linkLabel}</a>
    </article>`;
}

function projectCard(item, root) {
  return `
    <article class="landing-card landing-project" data-reveal>
      <a class="landing-project__media" href="${linkWithRoot(root, item.href)}" aria-label="${item.title}">
        <img src="${linkWithRoot(root, item.image)}" alt="${item.alt}" loading="lazy">
        <span class="landing-project__arrow" aria-hidden="true">-></span>
      </a>
      <div class="landing-project__body">
        <p class="landing-project__category">${item.category}</p>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    </article>`;
}

function appCard(item, root, isFeatured = false) {
  return `
    <article class="landing-card landing-app${isFeatured ? ' is-featured' : ''}" data-reveal>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <a class="landing-link" href="${linkWithRoot(root, item.href)}">OPEN APP -></a>
    </article>`;
}

function initLandingReveal() {
  const revealNodes = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!revealNodes.length || !('IntersectionObserver' in window)) return;

  document.body.classList.add('reveal-ready');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -10% 0px' },
  );

  revealNodes.forEach((node) => observer.observe(node));
}

async function setupHome() {
  const root = rootPath();
  document.body.classList.add('home-landing-mode');

  try {
    await setupSharedShell(root);
  } catch (error) {
    // Home landing can still render even if shared shell partials fail.
  }

  const mount = document.querySelector('#page-root');
  if (!mount) return;

  mount.innerHTML = `
    <main class="landing-home">
      <section class="landing-hero" data-reveal>
        <div class="landing-hero__backdrop" aria-hidden="true"></div>
        <div class="landing-hero__content container-wide">
          <div class="landing-hero__center">
            <p class="landing-hero__label">ANHDOPHIN</p>
            <p class="landing-hero__sub">Indie Creative Creation</p>
            <h1>I MAKE CREATIVE MEDIA<br>FOR BRAND STORIES.</h1>
            <p>Toi giup doanh nghiep trinh bay nang luc ro rang hon, tao noi dung de nho hon va bien nhung y tuong moi thanh phien ban co the thu nghiem.</p>
            <a class="landing-btn" href="${root}/work/">EXPLORE MY WORK</a>
          </div>
        </div>
      </section>

      <section class="landing-section landing-services container-content" data-reveal>
        <header class="landing-section__header">
          <h2>THREE WAYS<br>I HELP IDEAS MOVE FORWARD.</h2>
          <p>Tu viec gioi thieu nang luc doanh nghiep, tao noi dung media den dong hanh phat trien y tuong, moi dich vu giai quyet mot giai doan khac nhau cua qua trinh sang tao.</p>
        </header>
        <div class="landing-services__grid">
          ${services.map((item) => serviceCard(item, root)).join('')}
        </div>
      </section>

      <section class="landing-section landing-manifesto" data-reveal>
        <div class="container-reading">
          <p class="landing-manifesto__quote" aria-hidden="true">"</p>
          <h2>GOOD IDEAS<br>DO NOT NEED<br>MORE DECORATION.</h2>
          <p class="landing-manifesto__line">They need the right form.</p>
          <p>Mot doanh nghiep can cach gioi thieu de hieu.<br>Mot thuong hieu can noi dung dang xem.<br>Mot y tuong can phuong phap de tro thanh thu co the lam thu.</p>
          <p>Do la noi cong viec cua toi bat dau.</p>
          <p class="landing-manifesto__signature">ANHDOPHIN</p>
          <p class="landing-manifesto__sub">Indie Creative Creation</p>
        </div>
      </section>

      <section class="landing-section landing-projects container-content" data-reveal>
        <header class="landing-section__header">
          <h2>SELECTED<br>CREATIVE WORK.</h2>
          <p>Mot so du an the hien cach toi bien thong tin, cau chuyen va y tuong thanh nhung thu co the doc, xem, su dung hoac trai nghiem.</p>
        </header>
        <div class="landing-projects__grid">
          ${projects.map((item) => projectCard(item, root)).join('')}
        </div>
        <a class="landing-link landing-section__cta" href="${root}/work/">VIEW ALL PROJECTS -></a>
      </section>

      <section class="landing-section landing-apps container-content" data-reveal>
        <header class="landing-section__header">
          <h2>TRY THE WAY<br>I THINK.</h2>
          <p>Nhung mini app nay bien cac phuong phap sap xep thong tin, xay dung y tuong va lap ke hoach sang tao thanh cong cu co the dung ngay tren trinh duyet.</p>
        </header>
        <div class="landing-apps__grid">
          ${apps.map((item, idx) => appCard(item, root, idx === 1)).join('')}
        </div>
        <a class="landing-link landing-section__cta" href="${root}/apps/">EXPLORE ALL MINI APPS -></a>
      </section>

      <section class="landing-section landing-about container-content" data-reveal>
        <div class="landing-about__media">
          <img src="${root}/assets/portrait-2.png" alt="Anhdophin in a creative workshop" loading="lazy">
        </div>
        <div class="landing-about__copy">
          <h2>I AM<br>ANHDOPHIN.</h2>
          <p>Toi la mot independent creator lam viec giua thiet ke thong tin, truyen thong thi giac, san xuat media, cong cu so va thu nghiem san pham.</p>
          <p>Toi bat dau tu thiet ke do hoa, nhung thuong tham gia som hon phan thiet ke va di xa hon phan ban giao hinh anh: nghien cuu, to chuc noi dung, phat trien y tuong, tao prototype, quay dung va xay dung cach de nguoi khac co the hieu hoac su dung ket qua.</p>
          <h3>INDIE CREATIVE CREATION.</h3>
          <p>Khong bi gioi han trong mot dinh dang.<br>Khong bat dau bang phan mem.<br>Bat dau bang thu dang can duoc lam ro hoac tao ra.</p>
          <a class="landing-link" href="${root}/about/">MORE ABOUT ME -></a>
        </div>
      </section>

      <section class="landing-section landing-cta" data-reveal>
        <div class="container-reading">
          <h2>HAVE SOMETHING<br>WORTH MAKING?</h2>
          <p>Co the do la mot doanh nghiep can duoc gioi thieu ro hon.<br>Mot san pham can noi dung khien nguoi khac muon xem.<br>Hoac mot y tuong anh muon bien thanh phien ban dau tien.<br>Gui cho toi nhung gi anh dang co. Chung ta se tim ra cach phu hop de phat trien no.</p>
          <a class="landing-btn landing-btn--light" href="${root}/contact/">START A CONVERSATION</a>
        </div>
      </section>

      <footer class="landing-footer" data-reveal>
        <div class="container-content landing-footer__grid">
          <div>
            <p class="landing-footer__brand">ANHDOPHIN</p>
            <p><em>Indie Creative Creation</em></p>
            <p>I Make Creative Media for Brand Stories.</p>
          </div>
          <div class="landing-footer__links">
            <a href="${root}/services/document-design/">Company Profile Design</a>
            <a href="${root}/services/creative-media/">Creative Media</a>
            <a href="${root}/services/mini-app-design/">Invention Thinking Mentor</a>
            <a href="${root}/work/">Projects</a>
            <a href="${root}/apps/">Mini Apps</a>
          </div>
          <div>
            <p>Email: hello@anhdophin.com</p>
            <p>Social Links</p>
            <p>© Anhdophin</p>
          </div>
        </div>
      </footer>
    </main>`;

  initLandingReveal();
}

setupHome();
