# TOOL SETUP - GOOGLE SHEET

## Mục tiêu
Trang `tool/` gửi dữ liệu nhu cầu học viên về Google Sheet của chủ landing page.

## Cách setup nhanh

### 1. Tạo Google Sheet trong tài khoản của chủ landing page
- Ví dụ: `lotus-yoga-leads`
- Sheet tab gợi ý: `Yoga Leads`

### 2. Mở Extensions > Apps Script
Tạo file script mới và dán nội dung trong file:
- `tool/google-apps-script/Code.gs`

### 3. Deploy thành Web App
- Deploy > New deployment
- Type: Web app
- Execute as: Me
- Who has access: Anyone
- Deploy
- Copy **Web App URL**

## 4. Dán URL vào website
Mở file:
- `js/site-config.js`

Dán vào:
```js
window.LOTUS_SITE_CONFIG = {
  googleScriptUrl: "PASTE_WEB_APP_URL_HERE",
  ownerEmail: "owner@example.com"
};
```

## 5. Share Google Sheet cho chủ landing page
Việc **xem dữ liệu** dùng email Gmail của họ.
- Mở Sheet > Share
- Dán Gmail của chủ landing page
- Cấp quyền Viewer hoặc Editor

## Phân biệt 2 thứ
- **Gmail của chủ site**: dùng để họ xem Google Sheet
- **Google Script URL**: dùng để website gửi dữ liệu vào Google Sheet

Không thể chỉ dán email Gmail mà website tự gửi form vào Sheet được. Website cần Web App URL của Google Apps Script.

## File liên quan
- `tool/index.html`
- `css/page-tool.css`
- `js/tool-form.js`
- `js/site-config.js`
- `tool/google-apps-script/Code.gs`

## Gợi ý triển khai thực tế
Nếu làm website cho khách:
1. Tạo Sheet trong tài khoản Google của khách hoặc share lại cho khách
2. Tạo Apps Script gắn với Sheet đó
3. Deploy web app
4. Paste URL vào `js/site-config.js`
5. Share Sheet cho Gmail khách để họ xem dữ liệu
