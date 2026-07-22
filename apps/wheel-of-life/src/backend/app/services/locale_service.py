"""Locale and semantic label resolution service.

This service keeps semantic keys separate from visible text.
AI and UI should resolve labels through this module instead of hard-coding text.
"""

from __future__ import annotations

from app.services.content_loader import get_locale_entry_map, get_locale_settings


class LocaleResolver:
    def __init__(self, locale: str):
        settings = get_locale_settings()
        self.locale = (locale or settings.get('default_locale', 'vi')).lower()
        self.fallback_locale = settings.get('fallback_locale', 'en')
        self.entry_map = get_locale_entry_map(self.locale)
        self.fallback_map = get_locale_entry_map(self.fallback_locale)

    def resolve(self, key: str, field: str = 'label') -> str:
        entry = self.entry_map.get(key) or self.fallback_map.get(key)
        if entry:
            return entry.get(field) or entry.get('label') or key
        return key

    def resolve_many(self, keys: list[str], field: str = 'label') -> list[str]:
        return [self.resolve(key, field=field) for key in keys]


def resolve_label(locale: str, key: str, field: str = 'label') -> str:
    return LocaleResolver(locale).resolve(key, field=field)
