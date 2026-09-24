---
name: End-to-end tests
description: Rules for writing, running, and fixing {{E2E_RUNNER}} end-to-end tests.
applyTo: '{{E2E_TEST_GLOBS}}'
---

When you create or modify end-to-end tests:

- Load `e2e-fundamentals`. Load `e2e-selector-conventions` when a selector is missing,
  `e2e-environment-and-auth` for login or environment issues, and `e2e-test-triage` when a test fails.
- Never use fixed sleeps or wait for network idle. Use auto-retrying assertions on a specific element.
- Never use positional or styling selectors. Prefer test ids.
- A failing test is most often stale data or selector drift, not a code regression. Check those first.
