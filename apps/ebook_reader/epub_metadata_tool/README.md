# EPUB Metadata Tool

Tool local bằng Python + web UI để:
- nhập file EPUB
- paste TOC
- gán role cho từng dòng TOC bằng dropdown
- tự trích text từ EPUB
- export gói dữ liệu gồm metadata JSON và các file TXT

## Chạy nhanh

### Windows
- Cài Python 3.10+
- Double click `start.bat`
- Trình duyệt mở tại `http://127.0.0.1:8765`

### Mac / Linux
```bash
python app.py
```

## Cách dùng
1. Chọn một file EPUB.
2. Paste TOC vào ô bên trái.
3. Dùng dropdown để gán role cho từng dòng.
4. Có thể thêm role mới trong phần role list.
5. Bấm **Phân tích EPUB**.
6. Kiểm tra preview.
7. Bấm **Export gói dữ liệu**.

## Dữ liệu export
Gói ZIP export sẽ chứa:
- `metadata/metadata.json`
- `texts/*.txt`
- `README_EXPORT.txt`

## Ghi chú
- Tool đọc TOC có sẵn trong EPUB nếu EPUB có navigation/toc.
- Tool cũng trích text từ các file XHTML trong spine của EPUB.
- Matching giữa TOC dán tay và heading trong EPUB hiện là bản heuristic để test nhanh.
