---
name: Source changes
description: Test-first and static-analysis rules for any change to {{LANG}} source files.
applyTo: '{{SRC_GLOBS}}'
---

When you create or modify these files:

- Load the `tdd-requirement` and `static-analysis-gates` skills before writing code.
- Write the failing test first and run `{{TEST_ONE_CMD}}`. It must fail for the reason you predicted
  before you write production code.
- Before claiming completion, follow `verification-before-completion`: fresh `{{TEST_CMD}}`,
  `{{TYPECHECK_CMD}}`, and `{{LINT_CMD}}` output produced after your last edit.
