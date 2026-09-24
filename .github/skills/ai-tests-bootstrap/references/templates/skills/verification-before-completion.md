---
name: verification-before-completion
description: >
  Use BEFORE claiming any work is complete, fixed, or passing. Universal gate: run fresh verification
  commands and read the output before making any success claim. Evidence before assertions, always.
---

# Verification Before Completion

## The iron law

**NO COMPLETION CLAIM WITHOUT FRESH EVIDENCE.**

Never claim success from memory of an earlier run, from confidence that the change is trivial, or from
partial verification. Claim success only from output produced **after your last edit**.

## The five-step gate

1. **Identify what needs verifying** using the table below.
2. **Run every required command**, after the last change, not before.
3. **Read the actual output.** An exit code is not evidence; a suite that silently skipped every test
   exits zero.
4. **Confirm the output matches expectations**: all tests pass, zero type errors, zero lint findings,
   no unexpected skips.
5. **Only now claim completion**, and include the evidence in the claim.

| Change type     | Required verification                                                      |
| --------------- | -------------------------------------------------------------------------- |
| Source code     | `{{TEST_ONE_CMD}}` + `{{TEST_CMD}}` + `{{TYPECHECK_CMD}}` + `{{LINT_CMD}}` |
| End-to-end test | `{{E2E_CMD}}` scoped to the changed spec                                   |
| Configuration   | The relevant build or compile command                                      |
| Bug fix         | The test that proves the fix, plus the full suite                          |

## Evidence table

| Claim            | Sufficient evidence                      | Not evidence              |
| ---------------- | ---------------------------------------- | ------------------------- |
| "Tests pass"     | Fresh run showing counts                 | "They passed earlier"     |
| "Bug is fixed"   | The failing test now passes, suite green | "I changed the code"      |
| "No type errors" | Fresh `{{TYPECHECK_CMD}}` output         | "I checked visually"      |
| "Lint clean"     | Fresh `{{LINT_CMD}}` output              | "I followed the patterns" |

## Anti-rationalization

| Thought                  | Reality                                          |
| ------------------------ | ------------------------------------------------ |
| "I just ran it"          | You ran it before the last edit. Run it again.   |
| "It's a trivial change"  | One-line changes cause outages. Verify anyway.   |
| "I'll verify later"      | Later never comes. Verify now, before the claim. |
| "The tests are slow"     | A broken deployment is slower.                   |
| "I can see it's correct" | Reading code misses what running it catches.     |
