# Plan: Posts homepage with create and delete (JSONPlaceholder CRUD)

**Status:** Ready for implementation

## Summary

Build the homepage from scratch in the existing empty scaffold: a typed API layer over
`${API_BASE_URL}/posts`, a single `usePosts` hook owning all async state, three presentational
components, and an `App` that wires them together while `main.tsx` shrinks to rendering `<App />`.
Everything is built test-first with Vitest + React Testing Library, faking only `fetch`. One
pre-flight configuration phase is required first: `tsc -b` currently has no Vitest global types, so
the very first test file would break the type-check gate.

## Context

**Files:**

- `tsconfig.app.json`: add `"types": ["vitest/globals"]` so test files type-check under `tsc -b`.
- `src/types/Post.ts` (new): `Post` and `CreatePostInput` contracts.
- `src/api/posts.ts` (new) + `src/api/posts.test.ts` (new): `fetchPosts`, `createPost`, `deletePost`,
  response validation/mapping, thrown errors on non-ok.
- `src/hooks/usePosts.ts` (new) + `src/hooks/usePosts.test.ts` (new): posts array, load/create/delete
  state, per-id delete pending, validation error, optimistic prepend, remove-on-delete-success.
- `src/components/PostForm.tsx`, `PostItem.tsx`, `PostList.tsx` (new) + co-located `.test.tsx` files.
- `src/App.tsx` (new) + `src/App.test.tsx` (new): composition of hook and components.
- `src/main.tsx`: replace inline `<main className="app-shell">` markup with `<App />`.
- `src/index.css`: add minimal classes for the list, item, form, and status text.
- `src/__tests__/.gitkeep`, `src/api/.gitkeep`, `src/hooks/.gitkeep`, `src/components/.gitkeep`,
  `src/types/.gitkeep`: leave in place. Removing scaffold placeholders is out of scope.

**Key symbols:**

- `API_BASE_URL` in `src/config.ts`: the only source of the base URL. Import it; never re-derive or
  hardcode `https://jsonplaceholder.typicode.com` in source or tests.
- `createRoot(...).render(...)` in `src/main.tsx`: the single call site to simplify.
- `.app-shell` in `src/index.css`: existing container class and aesthetic (max-width 48rem, centred,
  grey-on-off-white). New CSS extends this vocabulary rather than replacing it.

**Blast radius:** Entirely additive except `src/main.tsx` (rewritten body), `src/index.css`
(appended rules), and `tsconfig.app.json` (one compiler option). No existing tests exist to break —
the suite currently runs with `passWithNoTests: true`.

**Verified environment facts:**

- Vitest 5, jsdom, `globals: true`, setup file `src/test/setup.ts` importing
  `@testing-library/jest-dom/vitest`. Include glob `src/**/*.{test,spec}.{ts,tsx}`.
- ESLint flat config already declares Vitest globals for `**/*.{test,spec}.{ts,tsx}`, so lint will
  not flag `describe`/`vi`. `react-refresh/only-export-components` is a **warning**, and lint runs at
  `--max-warnings=0` — so a `.tsx` file must export components only. Keep types and helpers in `.ts`
  files.
- `@testing-library/user-event` **is** a dependency (`^14.6.7`, installed by the human). It is the
  standard interaction method for this plan: `const user = userEvent.setup()` in each test, then
  `await user.type(...)` / `await user.click(...)`. Every `userEvent` method is async and **must be
  awaited**. Do not use `fireEvent` unless an interaction genuinely cannot be expressed with
  `userEvent`.
- `tsconfig.app.json` includes all of `src` with `strict`, `noUnusedLocals`, `noUnusedParameters`,
  and no `types` array. This is why Phase 0 exists.

## Phases (7 phases, 5 batches)

### Phase 0: Make test files type-check

**Objective:** `npx tsc -b` passes once test files exist.
**Files:** `tsconfig.app.json`
**Tests:** None — configuration only, and the `tdd-requirement` skill exempts config changes. The
proof is the gate itself: after Phase 1 lands, `npx tsc -b` must pass.
**Depends on:** none
**Batch:** 1
**Steps:**

1. Add `"types": ["vitest/globals"]` to `compilerOptions` in `tsconfig.app.json`.
2. Run `npx tsc -b`. It must still pass on the current (test-free) tree.

**Do not mock:** n/a.
**Acceptance:**

- [ ] `tsconfig.app.json` declares the Vitest global types.
- [ ] `npx tsc -b` passes.
- [ ] No other compiler option changed.

**Note:** If `vitest/globals` types turn out to be unnecessary because Vitest 5 ships ambient globals,
verify by adding a throwaway assertion in Phase 1 and reverting this phase. Do not keep a config
change that is not needed.

---

### Phase 1: Post types

**Objective:** Shared contracts for a post and for the create payload.
**Files:** `src/types/Post.ts`
**Tests:** None of its own. Pure type aliases have no runtime behavior to assert, and
`memory-bank/testing-strategy.md` lists `src/types/**` as a protected contract, not a test target.
**Runtime validation belongs in the API layer, not here** — `src/types/Post.ts` must contain no
executable code beyond `export type` / `export interface`, so the narrowing guard that checks an
unknown JSON body lives in `src/api/posts.ts` and is exercised by `src/api/posts.test.ts`.
**Depends on:** none
**Batch:** 1
**Steps:**

1. Define `Post` with `id: number`, `userId: number`, `title: string`, `body: string`.
2. Define `CreatePostInput` as `{ title: string; body: string }` (the fields the form collects);
   derive it with `Pick<Post, 'title' | 'body'>` rather than restating the shape.
3. `npx tsc -b`, `npm run lint`.

**Do not mock:** n/a — but note for every later phase that `src/types/**` is never stubbed.
**Acceptance:**

- [ ] `Post` and `CreatePostInput` exported from `src/types/Post.ts`.
- [ ] File contains no runtime values.
- [ ] `npx tsc -b` and `npm run lint` pass.

---

### Phase 2: API layer

**Objective:** `fetchPosts`, `createPost`, `deletePost` wrapping `fetch` against
`${API_BASE_URL}/posts`, with validation of the response body and thrown errors on non-ok status.
`fetchPosts` requests `` `${API_BASE_URL}/posts?_limit=10` `` — the ten-post limit is a server-side
query parameter, **not** a client-side `slice(0, 10)`. `fetchPosts` returns the validated array the
API responded with, unsliced.
**Files:** `src/api/posts.ts`, `src/api/posts.test.ts`
**Depends on:** Phase 1
**Batch:** 2

`src/api/posts.test.ts` → `describe('fetchPosts')` → `it('requests the posts endpoint with a
ten-post limit and returns the posts')`.

Key assertions:

- `vi.spyOn(globalThis, 'fetch')` resolves `new Response(JSON.stringify(tenPosts), { status: 200 })`
  where `tenPosts` is 10 posts built from a `makePost` factory. The fake `fetch` does not simulate
  JSONPlaceholder's `_limit` behavior, so the mocked response is already the limited payload.
- The URL passed to `fetch` equals `` `${API_BASE_URL}/posts?_limit=10` `` — `API_BASE_URL` imported
  from `src/config.ts`, not written out as a literal.
- The resolved array deep-equals the mocked array (length 10, first element `makePost({ id: 1 })`) —
  i.e. `fetchPosts` returns what the API returned, with no client-side truncation.

Because no `src/api/posts.ts` exists yet, the first run will fail on module resolution. That does not
count as red. Create the file with an exported `fetchPosts` that throws
`new Error('not implemented')`, re-run, and confirm the failure is now an **assertion** failure.

Remaining tests in this phase, each added red-first:

- `fetchPosts` throws an `Error` whose message names the status when the response is not ok (500).
- `fetchPosts` returns an empty array for a `[]` body.
- `fetchPosts` throws when the body is not an array of valid posts (e.g. `{ oops: true }`) — the
  validation guard, asserted through the public function.
- `createPost` sends `method: 'POST'`, a JSON `Content-Type` header, and a body that JSON-parses to
  exactly the `CreatePostInput`; it returns the mapped post from the 201 response.
- `createPost` throws on a non-ok response.
- `deletePost` sends `method: 'DELETE'` to `` `${API_BASE_URL}/posts/1` `` and resolves `void` on a
  200 with an empty object body.
- `deletePost` throws on a non-ok response.

**Test hygiene:** `afterEach(() => { vi.restoreAllMocks() })`. Fixtures come from a local
`makePost(overrides: Partial<Post> = {}): Post` factory.

**Do not mock in this phase:** `src/config.ts` (import the real `API_BASE_URL`), `src/types/Post.ts`,
and the mapping/validation helpers inside `src/api/posts.ts` — those helpers _are_ the subject under
test. The only double is `globalThis.fetch`.

**Layering:** this file performs requests and mapping only. No React import, no state.

**Steps:** 1. Write the failing test 2. Implement minimally 3. `npx vitest run src/api/posts.test.ts` 4. `npx tsc -b` and `npm run lint`

**Acceptance:**

- [ ] All three functions exported and covered for success, empty, malformed, and non-ok cases.
- [ ] `API_BASE_URL` is imported; no hardcoded host anywhere in `src/api/posts.ts` or its test.
- [ ] The ten-post limit is applied in `fetchPosts` — via the `?_limit=10` query parameter on the
      request URL — and not in the hook, a component, or a client-side `slice`.
- [ ] `npm test`, `npx tsc -b`, `npm run lint` all pass.

---

### Phase 3: `usePosts` hook

**Objective:** One hook owning posts, loading, load error, create pending, create error, per-id
delete pending, delete error, and the empty-field validation error.
**Files:** `src/hooks/usePosts.ts`, `src/hooks/usePosts.test.ts`
**Depends on:** Phase 2
**Batch:** 3

**Proposed surface** (implementer may adjust names, but the semantics are fixed):
`{ posts, isLoading, loadError, createPost, isCreating, createError, validationError, deletePost,
deletingId, deleteError }`.

**First failing test:** `src/hooks/usePosts.test.ts` → `describe('usePosts')` → `it('exposes a
loading state and then the fetched posts')`.

Key assertions, using `renderHook` from `@testing-library/react`:

- Immediately after render, `result.current.isLoading` is `true` and `result.current.posts` is `[]`.
- After `await waitFor(...)`, `isLoading` is `false` and `posts` has the two posts the faked `fetch`
  returned, in order.

Remaining tests, each red-first:

- Sets `loadError` to a non-empty message and leaves `posts` empty when the initial fetch rejects.
- `createPost` prepends the post returned by the API to the top of `posts`.
- `isCreating` is `true` while the POST is in flight and `false` afterwards (resolve a deferred
  promise to observe the intermediate state).
- `createPost` with an empty or whitespace-only title or body sets `validationError`, leaves `posts`
  unchanged, and issues **no** fetch call (assert the observable: `posts` unchanged and
  `validationError` set; the call-count assertion is a supporting check, never the only one).
- `validationError` clears on a subsequent valid submit.
- Sets `createError` and does not change `posts` when the POST rejects.
- `deletePost(id)` removes that post from `posts` on success and leaves the others untouched.
- `deletingId` equals the id under deletion while the DELETE is in flight, then returns to `null`.
- On a rejected DELETE, sets `deleteError` and **keeps** the post in the list.

**React 19 / StrictMode note:** the mount fetch will run twice under StrictMode in the real app. The
effect must tolerate that — guard against setting state after unmount or after a superseded request
(an `AbortController` or an ignore flag). Add a test that asserts the loaded list is not duplicated.

**Do not mock in this phase:** `src/hooks/usePosts.ts` itself, `src/api/posts.ts` (call the real API
module — it is protected), `src/config.ts`, `src/types/**`. Fake `globalThis.fetch` only. Mocking
`src/api/posts.ts` here is a review failure.

**Layering:** state and effects only. No JSX in this file.

**Steps:** 1. Write the failing test 2. Implement minimally 3.
`npx vitest run src/hooks/usePosts.test.ts` 4. `npx tsc -b` and `npm run lint`

**Acceptance:**

- [ ] Loading, success, empty, and error paths covered for all three operations.
- [ ] Optimistic prepend on create and removal on delete-success verified through `posts`.
- [ ] Failed delete leaves the item in the list — asserted.
- [ ] `deletingId` is per-post, not a global boolean.
- [ ] `npm test`, `npx tsc -b`, `npm run lint` pass.

---

### Phase 4: `PostForm`

**Objective:** Presentational create form: title field, body field, submit button, validation
message, disabled-while-pending.
**Files:** `src/components/PostForm.tsx`, `src/components/PostForm.test.tsx`
**Depends on:** Phase 1 (types only — deliberately independent of the hook)
**Batch:** 4 (parallel with Phase 5)

**Props:** `onSubmit(input: CreatePostInput): void`, `isSubmitting: boolean`,
`validationError?: string | null`, `submitError?: string | null`. The component holds only its own
field text; all async state arrives as props.

**Interactions:** use `userEvent` from `@testing-library/user-event`. Each test starts with
`const user = userEvent.setup()`, and every interaction is awaited.

**First failing test:** `it('submits the entered title and body')`.

Key assertions:

- Render with a `vi.fn()` `onSubmit`.
- `await user.type(screen.getByLabelText(/title/i), 'Ada')` and the same for body.
- `await user.click(screen.getByRole('button', { name: /add post/i }))`.
- `onSubmit` received exactly `{ title: 'Ada', body: 'lovelace' }`.

Remaining tests:

- Disables the submit button and exposes a pending affordance when `isSubmitting` is `true` —
  `expect(screen.getByRole('button', { name: /add post/i })).toBeDisabled()`.
- Renders the `validationError` text when provided; renders nothing matching it when `null`.
- Renders the `submitError` text in an element with `role="alert"` when provided.
- **Clears the fields only after a _successful_ submit** — when `isSubmitting` transitions from
  `true` to `false` **and** `submitError` is null/absent. Assert by rerendering with
  `isSubmitting: true`, then `isSubmitting: false, submitError: null`, expecting both inputs empty.
- **Does NOT clear the fields when `submitError` is set after a failed submit** — rerender with
  `isSubmitting: true`, then `isSubmitting: false, submitError: 'Something went wrong'`, and expect
  the title and body inputs to still hold the typed text so the submission can be retried.

**Accessibility:** inputs must be reachable by `getByLabelText`, so use real `<label htmlFor>`
elements. Queries use role and accessible name only — no test IDs, no class selectors.

**Do not mock in this phase:** nothing beyond the `onSubmit` prop spy, which is a collaborator the
component legitimately owns. No module mocks. No `fetch` involvement at all — this component never
performs I/O.

**Layering:** presentation only. No `fetch`, no import of `src/api/**` or `src/hooks/**`.

**Steps:** 1. Write the failing test 2. Implement minimally 3.
`npx vitest run src/components/PostForm.test.tsx` 4. `npx tsc -b` and `npm run lint`

**Acceptance:**

- [ ] Submit, disabled-pending, validation-message, and error-message behaviors are each asserted.
- [ ] Both clearing behaviors asserted: cleared on success, retained on `submitError`.
- [ ] `PostForm.tsx` exports only the component (`react-refresh` runs as a warning and lint is
      `--max-warnings=0`); the props type may be exported as a type-only export.
- [ ] `npm test`, `npx tsc -b`, `npm run lint` pass.

---

### Phase 5: `PostItem` and `PostList`

**Objective:** Render a post's title and body, a per-post delete button with a pending/disabled
state, and the list wrapper with loading, empty, and error states.
**Files:** `src/components/PostItem.tsx`, `src/components/PostItem.test.tsx`,
`src/components/PostList.tsx`, `src/components/PostList.test.tsx`
**Depends on:** Phase 1
**Batch:** 4 (parallel with Phase 4 — no shared files)

**Props:** `PostItem` takes `post: Post`, `onDelete(id: number): void`, `isDeleting: boolean`.
`PostList` takes `posts: Post[]`, `isLoading: boolean`, `error?: string | null`,
`onDelete(id: number): void`, `deletingId: number | null`.

**Interactions:** use `userEvent` from `@testing-library/user-event` — `const user =
userEvent.setup()`, then `await user.click(...)`. Never `fireEvent`.

**First failing test (`PostItem`):** `it('calls onDelete with the post id when the delete button is
clicked')`.

Key assertions: render `makePost({ id: 7 })`, `await user.click(screen.getByRole('button', { name:
/delete/i }))`, expect `onDelete` to have been called with `7`.

Remaining `PostItem` tests:

- Renders the post's title and body as visible text.
- Disables the delete button when `isDeleting` is `true`.
- The delete button's accessible name distinguishes the post (e.g. `Delete "Ada"`) so a list of
  several items has no ambiguous `getByRole` match.

`PostList` tests:

- Shows a loading indicator and no post items while `isLoading`.
- Renders one list item per post, in the given order, inside a `role="list"`.
- Shows an explicit empty-state message when `posts` is `[]` and not loading.
- Shows the `error` text in a `role="alert"` when `error` is set.
- Marks only the post whose id equals `deletingId` as pending — assert the other post's delete button
  is still enabled.

**Do not mock in this phase:** nothing but the `onDelete` prop spy. No module mocks, no `fetch`.
`src/types/Post.ts` is imported for real.

**Layering:** presentation only.

**Steps:** 1. Write the failing test 2. Implement minimally 3.
`npx vitest run src/components` 4. `npx tsc -b` and `npm run lint`

**Acceptance:**

- [ ] Loading, populated, empty, and error states of `PostList` are each asserted.
- [ ] Per-post pending state verified with more than one post rendered.
- [ ] All queries use role/accessible name or visible text.
- [ ] `npm test`, `npx tsc -b`, `npm run lint` pass.

---

### Phase 6: `App` wiring, `main.tsx` simplification, CSS

**Objective:** Compose `usePosts` with the components, render `<App />` from `main.tsx`, and add the
minimal CSS.
**Files:** `src/App.tsx`, `src/App.test.tsx`, `src/main.tsx`, `src/index.css`
**Depends on:** Phases 3, 4, 5
**Batch:** 5

**Interactions:** use `userEvent` from `@testing-library/user-event` — `const user =
userEvent.setup()`, then `await user.type(...)` / `await user.click(...)`. Awaiting the interaction
also flushes the React state updates it triggers.

**First failing test:** `src/App.test.tsx` → `it('loads and displays posts from the API on mount')`.

Key assertions:

- Fake `globalThis.fetch` to return two posts.
- Render `<App />`.
- A loading indicator is visible first.
- `await screen.findByText('Ada')` and the second post's title are both present, and the loading
  indicator is gone.

Remaining `App` tests (integration-level, still faking only `fetch`):

- Shows an error alert when the initial GET fails.
- Filling the form with `await user.type(...)` and submitting with `await user.click(...)` issues a
  POST and puts the returned post at the top of the list — assert order via
  `screen.getAllByRole('listitem')`.
- `await user.click(...)` on a post's delete button issues a DELETE and removes that post from the
  rendered list.
- A failing DELETE shows an alert and leaves the post rendered.

These replace the end-to-end tests the project does not run; user-visible behavior is covered here.

**`main.tsx` changes:** keep `StrictMode`, keep `./index.css`, keep the `createRoot` call, replace
the inline `<main>` markup with `<App />`. `src/main.tsx` remains deliberately untested per
`memory-bank/testing-strategy.md` — do not add `main.test.tsx`.

**CSS changes:** append rules to `src/index.css` for the list, item, form, and status text. Reuse the
existing palette (`#111827` text, `#f9fafb` background) and the `.app-shell` container. No new
dependency, no CSS-in-JS, no Tailwind. `App` renders the `<main className="app-shell">` wrapper so
the existing container styling survives the move.

**Do not mock in this phase:** `src/hooks/usePosts.ts`, `src/api/posts.ts`, `src/components/**`,
`src/config.ts`, `src/types/**`. Render the real tree and fake `globalThis.fetch` only. Mocking
`usePosts` to hand `App` canned state is exactly the review failure the `test-doubles-policy`
describes.

**Steps:** 1. Write the failing test 2. Implement minimally 3. `npx vitest run src/App.test.tsx` 4. `npm test` 5. `npx tsc -b` and `npm run lint`

**Acceptance:**

- [ ] Create and delete both verified end-to-end through the real hook and API layer.
- [ ] `src/main.tsx` contains no markup beyond `<StrictMode><App /></StrictMode>`.
- [ ] `npx prettier --check .` clean, or run `npx prettier --write .`.
- [ ] `npm test`, `npx tsc -b`, `npm run lint` pass.

---

## Batches

| Batch | Phases | Rationale                                                      |
| ----- | ------ | -------------------------------------------------------------- |
| 1     | 0, 1   | Config + pure types; no overlapping files, no runtime behavior |
| 2     | 2      | API layer depends on types                                     |
| 3     | 3      | Hook depends on the API layer                                  |
| 4     | 4, 5   | Components depend only on types; disjoint files, run parallel  |
| 5     | 6      | Wiring depends on everything                                   |

## Open questions

1. **RESOLVED — decision record.** Should the ten-post limit be a `_limit=10` query parameter or a
   client-side `slice(0, 10)`? **Decision: A — `?_limit=10` on the request URL in `fetchPosts`.**
   (The planner had recommended B; the human chose A. Phase 2 reflects the decision.)
2. **RESOLVED — decision record.** Which interaction API should the Phase 4–6 tests use?
   **Decision: B — `@testing-library/user-event`.** The human installed it manually
   (`"@testing-library/user-event": "^14.6.7"`), superseding the planner's earlier recommendation of
   A (`fireEvent`). All interaction tests use `userEvent.setup()` and await every interaction.
3. Phase 0 assumes `tsc -b` fails on Vitest globals without a `types` entry. This was inferred from
   `tsconfig.app.json` having no `types` array and including all of `src` — it was **not** executed,
   because the planner has no terminal. The implementer must confirm empirically in Phase 1 and drop
   Phase 0 if unnecessary.
4. **RESOLVED — decision record.** Should a failed create clear the form fields? **Decision: A —
   keep the entered text so the user can retry.** Fields clear only after a successful submit; when
   `submitError` is set, the values are retained. Asserted by the two Phase 4 clearing tests.

## Risks

- **Risk:** A test file is added before Phase 0 lands and `npx tsc -b` fails on `Cannot find name
'describe'`, which looks like a broken test rather than a config gap. → **Mitigation:** Phase 0
  runs first in batch 1.
- **Risk:** The implementer mocks `src/api/posts.ts` inside `usePosts.test.ts`, or mocks `usePosts`
  inside `App.test.tsx`, because it is the easier path. Both are explicit review failures under
  `memory-bank/testing-strategy.md`. → **Mitigation:** every phase above names its forbidden doubles;
  the reviewer greps changed test files for `vi.mock(` and rejects any hit outside `globalThis.fetch`.
- **Risk:** React 19 StrictMode double-invokes the mount effect, producing a duplicated list or a
  state update after unmount. → **Mitigation:** Phase 3 requires an abort/ignore guard and a test
  asserting no duplication.
- **Risk:** `react-refresh/only-export-components` is a warning and lint runs at `--max-warnings=0`,
  so a non-component export from a `.tsx` file silently fails the build. → **Mitigation:** keep `.tsx`
  files to component exports plus type-only exports; put any helper in a `.ts` file.
- **Risk:** Hand-formatting fights Prettier (single quotes, no semicolons, trailing commas) and lint
  fails on unrelated files. → **Mitigation:** run `npx prettier --write .` before the final gate in
  each phase.
- **Risk:** A `userEvent` interaction is not awaited, so the assertion runs before React has
  re-rendered and the test fails intermittently or passes for the wrong reason. → **Mitigation:**
  every `user.*` call is awaited; the reviewer rejects any unawaited `user.` call in a changed test.
- **Risk:** Asserting a transient pending state (`isCreating`, `deletingId`) is timing-sensitive and
  flaky if it depends on a real resolved promise. → **Mitigation:** use a manually deferred promise in
  the `fetch` fake so the in-flight window is controlled, not raced.
- **Risk:** Scope creep — deleting the `.gitkeep` placeholders or the `src/__tests__/` directory
  because they look redundant. → **Mitigation:** explicitly out of scope; surface as a question.
