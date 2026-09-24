---
name: verification-before-completion
description: >
  Use BEFORE claiming any work is complete, fixed, done, working, or passing. Universal gate: run fresh
  verification commands and read the output before making any success claim. Triggers on "is it done",
  "did that work", "all green", and on your own urge to summarize. Evidence before assertions, always.
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

| Change type   | Required verification                                                |
| ------------- | -------------------------------------------------------------------- |
| Source code   | `npx vitest run <file>` + `npm test` + `npx tsc -b` + `npm run lint` |
| Configuration | `npm run build`                                                      |
| Bug fix       | The test that proves the fix, plus the full suite                    |

## Read the output, not the exit code

This project sets `passWithNoTests: true`. A run that collected nothing prints
`No test files found, exiting with code 0` and **succeeds**. That is not a green suite — it is an
empty one. Confirm the test count is what you expect before calling anything passing.

Likewise, `npm run lint` runs at `--max-warnings=0`, so a warning is a failure. And `npx tsc -b` is
incremental: if it prints nothing at all on a second run, that is a cache hit, not proof. Both are
still valid evidence, but read what they actually say.

## Evidence table

| Claim            | Sufficient evidence                                 | Not evidence              |
| ---------------- | --------------------------------------------------- | ------------------------- |
| "Tests pass"     | Fresh run showing counts, and the count is non-zero | "They passed earlier"     |
| "Bug is fixed"   | The failing test now passes, suite green            | "I changed the code"      |
| "No type errors" | Fresh `npx tsc -b` output                           | "I checked visually"      |
| "Lint clean"     | Fresh `npm run lint` output                         | "I followed the patterns" |

## Anti-rationalization

| Thought                  | Reality                                          |
| ------------------------ | ------------------------------------------------ |
| "I just ran it"          | You ran it before the last edit. Run it again.   |
| "It's a trivial change"  | One-line changes cause outages. Verify anyway.   |
| "I'll verify later"      | Later never comes. Verify now, before the claim. |
| "The tests are slow"     | A broken deployment is slower.                   |
| "I can see it's correct" | Reading code misses what running it catches.     |
