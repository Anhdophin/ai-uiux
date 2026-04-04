(function(){
  const items = [
    { href: './', label: 'Workflow' },
    { href: 'website-design/', label: 'Thiết kế website' }
  ];

  function normalize(path){
    return path.replace(/index\.html$/,'').replace(/\/+$|$/,'/');
  }

  function renderNav(container){
    const root = container.getAttribute('data-workflow-root') || './';
    const links = items.map(item => {
      const href = new URL(item.href, new URL(root, window.location.href)).href;
      return `<a href="${href}">${item.label}</a>`;
    }).join('');

    const options = items.map(item => {
      const href = new URL(item.href, new URL(root, window.location.href)).href;
      return `<option value="${href}">${item.label}</option>`;
    }).join('');

    container.innerHTML = `
      <div class="workflow-tabbar-inner">
        <span class="workflow-tabbar-label">iAppLab Workflow</span>
        <nav class="workflow-tabbar-links" aria-label="Các workflow">${links}</nav>
        <select class="workflow-tabbar-select" aria-label="Chọn workflow">${options}</select>
      </div>
    `;

    const current = normalize(window.location.pathname);
    container.querySelectorAll('.workflow-tabbar-links a').forEach(a=>{
      const url = new URL(a.getAttribute('href'), window.location.href);
      if(normalize(url.pathname) === current) a.classList.add('is-active');
    });

    const select = container.querySelector('.workflow-tabbar-select');
    Array.from(select.options).forEach(opt=>{
      if(!opt.value) return;
      const url = new URL(opt.value, window.location.href);
      if(normalize(url.pathname) === current) opt.selected = true;
    });
    select.addEventListener('change', e=>{
      if(e.target.value) window.location.href = e.target.value;
    });
  }

  document.querySelectorAll('.workflow-tabbar').forEach(renderNav);
})();
