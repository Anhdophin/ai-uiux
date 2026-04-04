# HOME INTEGRATION

Nếu muốn show app feed trên trang chủ root, thêm 1 block như sau:

```html
<section class="home-apps">
  <div class="home-apps__head">
    <h2>Apps</h2>
    <a href="apps/">Xem tất cả</a>
  </div>
  <div class="apps-grid" data-apps-home-feed></div>
</section>
<script src="js/apps-home-feed.js"></script>
<script>
  window.IAppLabAppsHomeFeed?.init();
</script>
```

Lưu ý:
- CSS card đang dùng class `.app-card`, `.app-card__media`, `.app-card__title`, ...
- nếu trang chủ chưa có CSS đó, có thể import lại `apps/shared/apps-catalog.css` hoặc copy phần class cần dùng.
