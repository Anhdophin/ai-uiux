# Session and Trail Rules

- All session writes must go through a typed engine.
- Trail events must be append-only unless an explicit compaction policy is introduced later.
- AI option selections must resolve through the option-resolution contract, not handwritten UI hacks.
- Session state must be reconstructable from persisted payload + deterministic engines.
- Free text must never become the only evidence for a wheel score.
