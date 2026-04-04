Đã fix app Robot trong Icon App Hub:
- thay toàn bộ apps/robot bằng bản audit fixed mới
- thêm app-states.css và app-utilities.css vào apps/robot
- sửa data/apps.json để title robot hiện đúng
- bỏ file apps/robot.zip lồng bên trong để tránh nhầm

FIX bổ sung rất quan trọng:
- app Robot bị trắng/không load được vì trùng class `app-page`
- body cũng dùng `app-page`
- article page bên trong cũng dùng `app-page`
- CSS `.app-page:not(.is-current){display:none}` đã làm ẩn luôn cả body

Đã sửa:
- đổi article page class thành `app-page-view`
- cập nhật CSS tương ứng trong apps/robot/styles/app-layout.css
