---
name: Unit tests
description: Rules for writing and changing Vitest unit tests.
applyTo: 'src/**/*.test.ts,src/**/*.test.tsx,src/**/*.spec.ts,src/**/*.spec.tsx'
---

When you create or modify test files:

- Load the `tdd-requirement` and `test-doubles-policy` skills.
- Never replace these with a test double: `src/config.ts`, `src/types/**`, the mapping and validation
  helpers in `src/api/**`, and the hooks in `src/hooks/**`. Stub `fetch` instead — it is the only
  boundary that gets faked — and restore mocks between tests.
- `describe`, `it`, `expect`, and `vi` are globals. There is no need to import them.
- Query rendered output by accessible role and name, not by test ID or CSS class.
- Cover the error and empty responses, not only the happy path.
- Name tests by behavior, one behavior per test, and assert observable results — never only that a
  double was called.
- A new test that passes before you change production code is not testing anything. Make it fail first.
