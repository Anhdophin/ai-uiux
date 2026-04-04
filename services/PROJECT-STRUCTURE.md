# iAppLab Structure

Flow mới:
- `/` = trang chủ iAppLab
- `/services/` = dịch vụ cá nhân của Anhdophin
- `/apps/` = bộ sưu tập apps + micro tools
- `/shop/` = shop public
- `/services/about/` = about chính

Header/footer dùng chung:
- `partials/header.html`
- `partials/footer.html`
- Root pages: `js/modules.js`
- Page con: `shared/subpage-components.js` hoặc `services/shared/subpage-components.js`
- Micro tools: `services/micro-tools/shared/common-ui.js` + `footer.js`

Rule sửa nhanh:
- Nếu sửa portal nav: `partials/header.html`, `partials/footer.html`, `js/modules.js`
- Nếu sửa home portal: `index.html`, `js/portal-home.js`
- Nếu sửa apps collection: `apps/index.html`, `js/apps-page.js`, `data/apps.json`, `data/micro-tools.json`
- Nếu sửa service: `services/`
- Nếu sửa shop: `shop/`
