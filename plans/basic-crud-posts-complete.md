# Complete: Posts homepage with create and delete (JSONPlaceholder CRUD)

**Plan:** [plans/basic-crud-posts-plan.md](basic-crud-posts-plan.md)
**Status:** Done — all 7 phases implemented, reviewed, and merged into the working tree.

## Phases delivered

1. **Phase 0 — `tsc -b` type-check config.** Added `"types": ["vitest/globals"]` to
   `tsconfig.app.json` so Vitest globals (`describe`, `it`, `vi`, etc.) type-check without imports.
2. **Phase 1 — Post types.** `src/types/Post.ts`: `Post` (`id`, `userId`, `title`, `body`) and
   `CreatePostInput` derived via `Pick<Post, 'title' | 'body'>`. No runtime code.
3. **Phase 2 — API layer.** `src/api/posts.ts`: `fetchPosts`, `createPost`, `deletePost` over
   `${API_BASE_URL}/posts`, with response validation/mapping and thrown errors on non-ok status.
   `fetchPosts` requests `` `${API_BASE_URL}/posts?_limit=10` `` — a server-side query parameter, not
   a client-side slice.
4. **Phase 3 — `usePosts` hook.** `src/hooks/usePosts.ts`: owns `posts`, `isLoading`, `loadError`,
   `isCreating`, `createError`, `validationError`, `deletingId`, `deleteError`. Optimistic prepend on
   create, removal on delete-success, retained item on delete failure. Mount effect guarded against
   React 19 StrictMode double-invoke with an ignore-flag closure.
5. **Phase 4 — `PostForm`.** `src/components/PostForm.tsx`: controlled title/body inputs, disabled
   submit while pending, validation and submit error display, fields cleared only on successful
   submit (retained on failure so the user can retry).
6. **Phase 5 — `PostItem` and `PostList`.** `src/components/PostItem.tsx` (title, body, per-post
   delete button with disabled/pending state) and `src/components/PostList.tsx` (loading, populated,
   empty, and error states; per-post `deletingId` pending marker).
7. **Phase 6 — `App` wiring, `main.tsx`, CSS.** `src/App.tsx` composes `usePosts` with the
   components; `src/main.tsx` reduced to `<StrictMode><App /></StrictMode>`; `src/index.css` extended
   with list/item/form/status-text rules reusing the existing `.app-shell` palette.

## Final stats

- 6 test files, 40 tests passing (`npm test`).
- `npx tsc -b` clean.
- `npm run lint` clean at `--max-warnings=0`.
- `npm run build` succeeds.

## Confirmed human decisions applied

1. **Ten-post limit** implemented via the `?_limit=10` query parameter on the `fetchPosts` request
   URL, not a client-side `slice(0, 10)`.
2. **`@testing-library/user-event`** used for all interaction tests (`userEvent.setup()`, every
   interaction awaited); installed by the human and moved to `devDependencies` as a pre-merge fix.
3. **`PostForm` clears its fields only on a successful submit** — retained on `submitError` so a
   failed submission can be retried without retyping.

## Code review verdict: APPROVED

One pre-merge fix applied: `@testing-library/user-event` moved from `dependencies` to
`devDependencies` in `package.json`.

Low-priority follow-up notes recorded, none blocking — left for the human to prioritize:

- `PostList` can show a contradictory error state and empty state simultaneously on a GET failure.
- `deletingId` is a single scalar, so concurrent deletes on different posts can interleave.
- Missing `aria-live`/`aria-describedby` on some status text.
- Heading level skip (`h1` → `h3`).
- Missing malformed-body test for `createPost`.
