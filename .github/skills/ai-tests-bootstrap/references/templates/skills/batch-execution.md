---
name: batch-execution
description: >
  Use when implementing a plan with three or more phases. Executes in batches of three with
  verification after each task and a mandatory human checkpoint after each batch.
---

# Batch Execution

## Model

```
For each batch of 3 tasks:
  Task → implement → verify → mark done
  Task → implement → verify → mark done
  Task → implement → verify → mark done
  Batch report → MANDATORY STOP → wait for human
```

Per-task verification is `{{TEST_ONE_CMD}}`, `{{TYPECHECK_CMD}}`, and lint on the changed files. Fix a
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

| Thought                                    | Reality                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| "I'll do everything and verify at the end" | Errors compound silently. Verify per task, report per batch.             |
| "This batch is small, skip the checkpoint" | Every batch gets a checkpoint. Pausing is cheap; unreviewed code is not. |
| "The human trusts me to continue"          | Trust is maintained by reporting, not by skipping the report.            |
| "One more task before stopping"            | The boundary exists so a human can catch a wrong direction early.        |
