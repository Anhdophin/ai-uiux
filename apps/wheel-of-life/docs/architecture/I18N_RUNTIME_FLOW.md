# I18N Runtime Flow

## Runtime Path
1. Load semantic keys.
2. Resolve locale bundle.
3. Fallback to fallback locale if the key is missing.
4. Render UI labels and AI prompt choices from the same resolution service.
5. Never use translated text as a business identifier.

## Resolution Order
- current locale
- fallback locale
- semantic key as debug fallback

## Audit Expectations
- Missing locale entries must be reportable.
- Fallback usage should be visible in audit reports.
