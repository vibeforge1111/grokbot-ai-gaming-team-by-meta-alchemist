# Deliberate BREAK fixture for compat-check

Created by @meta_alchemist (https://x.com/meta_alchemist).

Three made-up templates that exist only to test `scripts/compat-check.mjs`. They are not installable.

- `90-widget-maker` writes `widget-list` 2.0.0 (a breaking change from 1.x).
- `91-widget-reader` still accepts `widget-list` `^1.0.0`: this pair must report BREAK.
- `92-widget-viewer` accepts `widget-list` `^2.0.0`: this pair must report OK.
