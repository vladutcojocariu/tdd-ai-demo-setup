---
name: batch-execution
description: >
  Use when implementing a plan with three or more phases. Executes in batches of three with
  verification after each task and a batch report after each batch. Trigger on "work through the plan",
  "implement the phases", "next batch". Do NOT trigger for a single-file change (see solo-dev).
---

# Batch Execution

## Model

```
For each batch of 3 tasks:
  Task → implement → verify → mark done
  Task → implement → verify → mark done
  Task → implement → verify → mark done
  Batch report → continue with the next batch
```

Per-task verification is `npx vitest run <file>`, `npx tsc -b`, and lint on the changed files. Fix a
failing task before starting the next one in the batch.

## Batch report

```markdown
## Batch N complete

**Tasks:** 1. {phase} — {status} 2. {phase} — {status} 3. {phase} — {status}
**Verification:** tests {n} passing / {n} failing; types {pass|fail}; lint {pass|fail}
**Files modified:** {list}
**Concerns:** {issues discovered, or none}
**Next batch:** {preview}
**Suggested commit:** {type}: {subject}
```

## Stop conditions

Stop and ask for guidance on: a blocker outside the plan, a plan too vague to implement confidently,
three failed verification cycles on one task, or scope that turns out much larger than planned.

## Anti-rationalization

| Thought                                    | Reality                                                      |
| ------------------------------------------ | ------------------------------------------------------------ |
| "I'll do everything and verify at the end" | Errors compound silently. Verify per task, report per batch. |
