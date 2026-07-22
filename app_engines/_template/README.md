# App Engine Template

Mẫu khởi tạo cho một app engine mới.

Cấu trúc tối thiểu:
- `server.py`: entrypoint server và route API.
- `README.md`: ghi chú app engine, port, endpoint, public assets.

Checklist:
- Đặt logic backend ở đây, không đặt trong `apps/<app-name>/`.
- Chặn serve file nhạy cảm như `.py`, `.md`, `.bat`.
- Chỉ expose endpoint API và static file public cần thiết.
