# App Engines

Thư mục này chứa backend engine dùng chung cho các app.

Quy ước:
- Mỗi app có một thư mục riêng, ví dụ `swot/`, `wheel-of-life/`, `ebook-reader/`.
- Logic backend và API nên đặt ở đây thay vì trong thư mục public của từng app.
- Thư mục `apps/<app-name>/` chỉ nên giữ UI public, assets và file launcher mỏng nếu cần tương thích.

Chuẩn đề xuất:
- `app_engines/<app>/server.py`: entrypoint server/backend chính của app.
- `app_engines/<app>/services.py`: business logic hoặc orchestration nếu app lớn dần.
- `app_engines/<app>/schemas.py`: kiểu dữ liệu request/response nếu cần.
- `app_engines/_template/`: mẫu khởi tạo cho app engine mới.

Nguyên tắc bảo mật tối thiểu:
- Không serve trực tiếp thư mục `app_engines/` ra ngoài.
- Không để file `.py`, `.md`, `.bat`, `.ps1` truy cập trực tiếp qua HTTP.
- Chỉ expose HTML/CSS/JS/images public và các endpoint API cần thiết.
