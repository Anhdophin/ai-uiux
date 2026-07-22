# Longitudinal Wheel Tracking

Longitudinal tracking lets the system compare wheel evidence over time.

## Goals
- show whether the same life areas stay weak or improve
- preserve evidence linkage back to keyword selections
- create future hooks for progress, stagnation, or regression analysis

## Tracking unit
A longitudinal wheel point contains:
- snapshot id
- captured_at
- wheel preview summary
- evidence keyword ids by life area

## Foundation rules
1. Only derived wheel previews are tracked.
2. Each point must retain source session id and source snapshot id.
3. Trend interpretation stays separate from raw history storage.
4. UI can later graph history without changing memory storage.
