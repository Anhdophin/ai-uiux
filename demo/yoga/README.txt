LOTUS YOGA TEMPLATE

Cấu trúc chính:
- index.html
- css/base.css
- css/layout.css
- css/components.css
- css/page-home.css
- js/main.js
- partials/header.html
- partials/footer.html
- assets/images/

Lưu ý:
- Header và footer đang là partial riêng, được nạp bằng fetch trong js/main.js.
- Khi chạy thử, nên mở bằng localhost hoặc Live Server.
- Không nên mở trực tiếp bằng file:// vì fetch partial có thể bị chặn.


Update V2:
- Added /about/index.html using shared css/js
- Learn More button changed to About Me
- Header/footer partials now support reusable relative base path


UPDATE V3
- Added price/index.html
- Added css/page-price.css
- Added Price link to shared header menu
- Price page includes top pricing section and detail section below
