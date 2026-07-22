# JSON Schema Guide

## 1. Goal
The Dynamic CV frontend should be data-driven. Core content must not be hard-coded into HTML. Roles, groups, bars, and rich details should be loaded from JSON so the site can be expanded without rebuilding the structure.

---

## 2. Data Layers
Recommended data layers:
- `profile.json` — site identity and top-level text
- `roles.json` — position cards and their metadata
- `groups.json` — reusable content block definitions
- `items.json` — info bars assigned to roles and groups
- `details.json` — detailed rich content opened from bars
- `ui-config.json` — motion, layout, and interface configuration

---

## 3. File Purposes
### 3.1 profile.json
Purpose:
- owner name
- hero line
- optional intro
- CTA links
- language labels if needed

### 3.2 roles.json
Purpose:
- define each role card
- tell frontend which groups belong to each role
- set ordering, summaries, and optional tags

### 3.3 groups.json
Purpose:
- define block containers reused across roles
- specify captions and display behavior

### 3.4 items.json
Purpose:
- define each info bar
- connect bars to group and role
- determine whether detail content exists

### 3.5 details.json
Purpose:
- define rich-detail content for bars
- allow formatted text, image blocks, and custom sections

### 3.6 ui-config.json
Purpose:
- animation ranges
- layout mode
- panel preferences
- feature flags

---

## 4. Recommended Schemas

## 4.1 profile.json
```json
{
  "site_title": "Dynamic Career Profile",
  "owner_name": "Anhdophin",
  "hero_title": "Role-based Dynamic CV",
  "hero_subtitle": "Select a position to view the related information system.",
  "primary_cta": {
    "label": "Contact",
    "href": "mailto:hello@example.com"
  },
  "secondary_cta": {
    "label": "Download PDF CV",
    "href": "assets/files/cv.pdf"
  }
}
```

### Required fields
- `site_title`
- `owner_name`
- `hero_title`

---

## 4.2 roles.json
```json
[
  {
    "id": "workflow-domain-translator",
    "title": "Workflow Domain Translator",
    "summary": "Bridges business context and execution structure through workflow, information, and system logic.",
    "tags": ["workflow", "translation", "execution"],
    "group_ids": [
      "role-focus",
      "problems",
      "methods",
      "outputs",
      "skills"
    ],
    "order": 1,
    "featured": true
  }
]
```

### Required fields
- `id`
- `title`
- `group_ids`

### Notes
- `id` must be unique
- `group_ids` defines what blocks appear for this role
- `order` controls sorting

---

## 4.3 groups.json
```json
[
  {
    "id": "problems",
    "title": "Problems",
    "caption": "Các dạng vấn đề anh chuyên xử lý",
    "layout_type": "bars",
    "style_variant": "default",
    "order": 2
  }
]
```

### Required fields
- `id`
- `title`
- `caption`

### Notes
- `layout_type` can later support variants such as `bars`, `chips`, `media`, `mixed`
- `style_variant` can control color or emphasis

---

## 4.4 items.json
```json
[
  {
    "id": "item-flow-chaotic",
    "role_ids": ["workflow-domain-translator", "product-workflow-designer"],
    "group_id": "problems",
    "label": "Flow rối / khó vận hành",
    "short_note": "Nhiều bước, thiếu logic, khó theo dõi.",
    "has_detail": true,
    "detail_id": "detail-flow-chaotic",
    "weight": 2,
    "style_variant": "problem"
  }
]
```

### Required fields
- `id`
- `role_ids`
- `group_id`
- `label`

### Notes
- one item may belong to multiple roles
- `weight` can influence item sorting or visual emphasis
- `style_variant` lets bars use different appearance presets

---

## 4.5 details.json
```json
[
  {
    "id": "detail-flow-chaotic",
    "title": "Flow rối / khó vận hành",
    "content_type": "rich_blocks",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Phù hợp với các hệ thống có nhiều bước và nhiều vai trò nhưng chưa có logic chuyển trạng thái rõ ràng."
      },
      {
        "type": "image",
        "src": "assets/images/example-flow.png",
        "alt": "Example workflow image",
        "caption": "Ví dụ khối thông tin có hình minh hoạ"
      },
      {
        "type": "quote",
        "text": "Từ dữ liệu rời rạc sang flow có thể vận hành.",
        "author": "Dynamic CV"
      }
    ]
  }
]
```

### Required fields
- `id`
- `title`
- `content_type`

### Notes
- `content_type` can be `rich_blocks` or `html`
- `blocks` is the preferred safe structured format
- if `content_type` is `html`, use a controlled rendering strategy

---

## 4.6 ui-config.json
```json
{
  "animation": {
    "group_stagger_ms": 140,
    "item_stagger_ms": 70,
    "group_translate_y_min": 24,
    "group_translate_y_max": 48,
    "item_translate_y_min": 16,
    "item_translate_y_max": 36,
    "allow_controlled_random": true
  },
  "detail_panel": {
    "mode": "side-panel",
    "close_on_backdrop": true,
    "close_on_escape": true
  },
  "layout": {
    "desktop_group_columns": 3,
    "mobile_role_cards_scroll": true
  }
}
```

---

## 5. Data Relationships
Relationship model:
- one `role` has many `groups`
- one `group` contains many `items`
- one `item` can appear in many `roles`
- one `item` may link to one `detail`

This means the frontend should filter items by:
1. selected role
2. current group
3. optional sorting by weight/order

---

## 6. Minimal Validation Rules
### roles.json
- role IDs must be unique
- all `group_ids` referenced must exist in `groups.json`

### groups.json
- group IDs must be unique
- order should be numeric

### items.json
- item IDs must be unique
- all `group_id` references must exist
- all `role_ids` references must exist
- if `has_detail` is true, `detail_id` must exist in `details.json`

### details.json
- detail IDs must be unique
- image paths should be valid if images are used

---

## 7. Recommended Authoring Rules
- keep labels short enough for bar UI
- keep captions short and descriptive
- do not put long essays into `label`
- place deep explanation only in `details.json`
- reuse groups across roles where possible
- reuse items across roles when the same skill or problem truly applies

---

## 8. Extension Path
Later the schema can extend to include:
- multiple languages
- audience modes (`recruiter`, `partner`, `client`)
- visual themes
- case studies linked to items
- CTA variations per role
- downloadable PDF links per role

---

## 9. Sample Starter Dataset
The `data/` folder in this bundle includes starter sample files built from this schema so frontend work can begin immediately.
