---
name: tdd-requirement
description: >
  Every change to TypeScript source MUST be accompanied by tests, written first. Use when implementing
  any feature or bug fix, when adding a component, hook, or API function, and when the user mentions
  tests, TDD, coverage, red-green-refactor, or "write a test". Do NOT trigger for pure documentation,
  configuration, or dependency changes, and do NOT trigger when the task is only to run or fix an
  already-written failing test (see verification-before-completion).
---

# Test-Driven Development Requirement

## The iron law

**NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.**

Any code written before its test must be deleted entirely — not kept as reference, not adapted, not
examined. Start over with the test. This is not ceremony: tests written first discover edge cases and
force a clean interface, while tests written after only re-describe what was already built.

## Red-green-refactor

| Phase        | Action                              | Verification                                                                                         |
| ------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **RED**      | Write one minimal failing test      | Run `npx vitest run <file>`. The test **fails**, not errors. The message matches what you predicted. |
| **GREEN**    | Write the simplest code that passes | Run `npx vitest run <file>`. Target passes, everything else still passes.                            |
| **REFACTOR** | Remove duplication, improve naming  | Run `npm test`. All pass. No new behavior added during refactor.                                     |

One cycle per behavior. Not one cycle per file.

A test that **errors** is not a red test. `Cannot find module './posts'` means the module does not
exist yet — that is a missing import, not a failing assertion. Create the module with a stub export so
the test runs and fails on its assertion, then proceed to GREEN.

## Anti-rationalization

| Thought                                    | Reality                                                                                       |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| "Delete hours of work? That's wasteful"    | Sunk cost. Tests-first catch bugs tests-after miss. Delete and restart.                       |
| "Tests after give identical results"       | No. Tests-before shape the interface. Tests-after memorialize whatever you happened to build. |
| "Too simple to need a test"                | Simple code still breaks. The test takes thirty seconds.                                      |
| "Just this once"                           | There is no just-this-once. Exceptions compound into a codebase with no safety net.           |
| "The test is obvious, I'll write it after" | If it is obvious, writing it first costs the same.                                            |

## Red flags requiring restart

Go back to RED if any of these is true:

- You wrote production code before its test.
- A new test passed immediately with no code change. It is not testing anything.
- You cannot state what the failure message will say before running it.

## What to test

**Must:** happy path, edge cases (empty list, missing field, boundary values), error conditions
(non-2xx responses, network rejection), business rules, user-visible behavior.
**Skip:** third-party library internals, pure pass-through wrappers, type declarations, `src/main.tsx`.

## Test structure

- **Name tests by behavior**, not by method: "returns an empty list when the API responds with `[]`",
  not "test fetchPosts".
- **One behavior per test case.** A test that checks five things tells you nothing useful when it fails.
- **Test behavior, not implementation.** Never assert on private state, internal call counts, or
  framework internals. For components, query by accessible role and name, not by class or test ID.
- **Never assert only that a mock was called.** Assert the observable result.
- **Test functions are globals.** `describe`, `it`, `expect`, `vi`, `beforeEach` need no import —
  `vitest.config.ts` sets `globals: true`. Importing them is not an error, but it is noise.
- **Use factory functions with partial overrides** for test data. Each test states only what matters:

```ts
import type { Post } from '../types/post'

function makePost(overrides: Partial<Post> = {}): Post {
  return { id: 1, userId: 1, title: 'Ada', body: 'lovelace', ...overrides }
}

it('renders the post title', () => {
  render(<PostCard post={makePost({ title: 'Analytical Engine' })} />)
  expect(screen.getByRole('heading', { name: 'Analytical Engine' })).toBeInTheDocument()
})
```

Duplicated inline fixtures drift, and drifting fixtures hide real failures.

## File placement

Co-located next to the source file: `src/api/posts.ts` is tested by `src/api/posts.test.ts`, and
`src/components/PostList.tsx` by `src/components/PostList.test.tsx`. The empty `src/__tests__/`
directory is a scaffold leftover — do not add to it, and do not introduce a second convention.

## Faking the network

The only thing you fake is `fetch`. `src/config.ts`, `src/types/**`, the mapping helpers in
`src/api/**`, and the hooks in `src/hooks/**` are never mocked. See the `test-doubles-policy` skill.

## Workflows

**New feature:** write the tests for the behavior, implement until green, refactor.
**Bug fix:** reproduce the bug in a failing test first. See the `bugfix-tdd` skill.

## Verification

```bash
npx vitest run <file>   # the file you changed
npm test                # no regressions
```
