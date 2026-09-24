# Testing Strategy

What this project has decided about testing. Skills reference this file so an agent inherits the
strategy instead of re-deriving it.

## Unit tests

Vitest 5 runs in a jsdom environment with React Testing Library and `@testing-library/jest-dom`
matchers, loaded by `src/test/setup.ts`. Test functions are globals — `describe`, `it`, `expect`, and
`vi` need no import.

Tests live **next to the code they cover**: `src/api/posts.ts` is tested by `src/api/posts.test.ts`.
The `src/__tests__/` directory is a leftover scaffold placeholder; prefer co-location. Vitest collects
`src/**/*.{test,spec}.{ts,tsx}`, so both locations run, but new tests go beside their source file.

What is unit-tested: API request building and response mapping, hooks, and component behaviour as a
user perceives it — rendered output and interaction results, not internal state or implementation
details. Query by accessible role and name.

The single boundary that is faked is the network. Stub `fetch` (or `vi.spyOn(globalThis, 'fetch')`) to
return the HTTP responses the JSONPlaceholder API would return, including error and empty-list cases.
Everything inside that boundary runs for real.

**Protected dependencies — never replaced by a mock, stub, or spy:**

| Module                                      | Why                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| `src/config.ts`                             | Resolves `API_BASE_URL` with its env-var fallback. Mocking it hides real bugs. |
| `src/types/**`                              | Type contracts. Never stubbed.                                                 |
| `src/api/**` mapping and validation helpers | Pure transforms — this is the logic under test.                                |
| `src/hooks/**`                              | Test through the real hook, never a fake implementation of it.                 |

Mocking any of these is a review failure. See the `test-doubles-policy` skill for the full reasoning.

## End-to-end tests

Not in use yet. No E2E runner is installed and no specs exist.

To add them: install a runner, write at least one spec, then re-run `ai-tests-bootstrap`. It will
generate the E2E skills, the `e2e-journey` agent, and `e2e.instructions.md` from the saved stack
profile. Until then, do not write E2E tests — there is nothing to run them.

## Deliberately not covered

- `src/main.tsx` — the application entry point. It only mounts the React root; there is no logic worth
  asserting and no seam to render it through.
- `src/index.css` and generated build output under `dist/`.

## Known flaky areas

Nothing recorded yet.
