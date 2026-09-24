---
name: Unit tests
description: Rules for writing and changing {{UNIT_RUNNER}} unit tests.
applyTo: '{{TEST_GLOBS}}'
---

When you create or modify test files:

- Load the `tdd-requirement` and `test-doubles-policy` skills.
- Never replace these with a test double: <<FILL: the protected dependencies, comma-separated>>.
  Configure the real thing and reset it between tests.
- Name tests by behavior, one behavior per test, and assert observable results — never only that a
  double was called.
- A new test that passes before you change production code is not testing anything. Make it fail first.
