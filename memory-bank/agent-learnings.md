# Agent Learnings

Retrospectives from completed multi-phase work. **Maintenance is not optional:** keep at most twenty
recent entries; when a pattern appears three or more times, promote it to Consolidated Patterns and
delete the individual entries. An unpruned learnings file stops being read, and a file that is not read
is not memory.

## Consolidated Patterns

### Planning

### Implementation

### Review

## Recent Entries

<!-- Newest first, in the retrospective format defined by the conductor agent. -->

### 2026-09-24 — Posts homepage with create/delete (JSONPlaceholder CRUD)

**Phases:** 7 planned, 7 executed, 0 revised
**Review cycles:** 1 architect review (PROCEED_WITH_RISKS, no CRITICAL findings), 1 final code review (APPROVED)
**What worked:** Batching disjoint-file phases (PostForm vs PostItem/PostList) in parallel implement-subagent dispatches saved a round trip with zero file collisions. Deferred/controlled promises for asserting transient pending state (isCreating, deletingId) avoided flaky timing-based tests. An ignore-flag closure cleanly guarded the mount effect against React 19 StrictMode's double-invoke, verified by a dedicated test.
**What didn't:** Two of three subagents in this task lacked file-edit tools when asked to amend an already-created plan/context file (only file-creation, not in-place edit) — had to redispatch as implement-subagent, which does have edit tools, for what was pure documentation work. A blanket `npx prettier --write .` during the final phase touched three unrelated pre-existing files outside the task's scope; had to detect via `git status` and revert.
**File assumptions wrong:** planning-subagent claimed `.context/current-task.md` did not exist during a second dispatch when it in fact did (created by the first planning-subagent dispatch) — always verify file existence directly rather than trusting a stateless subagent's negative claim.
**Skills most useful:** tdd-requirement, test-doubles-policy (kept every phase's tests down to a single `globalThis.fetch` double, zero `vi.mock` violations across 40 tests), static-analysis-gates.
**Gaps:** No accessibility-specific gate in the pipeline — the final review caught missing aria-live/aria-describedby/heading-level issues only at the very end, after all components were built. A lighter a11y check earlier (e.g. during Phase 4/5 verification) could catch these before they compound across components.
**Test patterns:** Local `makePost` factory per test file (no shared fixture module) worked fine at this scale and avoided premature cross-file coupling.
**Recommendation:** When amending an already-approved plan or context file mid-task, dispatch straight to implement-subagent rather than planning-subagent — the latter may only have file-creation tools. Add a scope-check step (`git status --short`) immediately after any phase that runs a repo-wide formatter command.
