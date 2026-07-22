# Architecture Overview

## High-level shape
- Frontend: card journey + trail + reflection + wheel preview + AI panel.
- Backend: API + services + engines + validators.
- Data: curated seed JSON, schema, tests, audit scripts.
- AI layer: context engine -> prompt builder -> provider adapter -> output validator.

## Golden rule
Không có tuyến nào đi thẳng từ UI tới AI provider.

## Request flow
User interaction -> API route -> service -> engine -> validator -> response -> UI render
