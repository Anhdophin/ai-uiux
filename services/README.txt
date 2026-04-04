CẤU TRÚC CHÍNH
- index.html                : trang chủ
- partials/header.html      : header dùng chung
- partials/footer.html      : footer dùng chung
- css/base.css              : style global
- js/app.js                 : bootstrap trang chủ
- js/home.js                : render UI icon shelf + search
- apps/<ten-app>/index.html : từng mini app
- assets/icons/<ten-app>.png: icon tương ứng với tên folder app
- tools/scan_apps.py        : scan app + icon để cập nhật data/apps.json

CÁCH DÙNG
1. Thêm mini app mới vào folder /apps, ví dụ /apps/task-board/index.html
2. Thêm icon cùng tên vào /assets/icons/task-board.png
3. Chạy file update_apps.bat
4. Chạy run_localhost.bat rồi mở http://localhost:5057

GHI CHÚ
- Trang chủ đã là PWA cơ bản.
- Mini app chỉ là mẫu placeholder, anh thay bằng app thật sau này.
- Nếu muốn đổi nội dung header/footer cho toàn bộ site, chỉ cần sửa trong /partials.
