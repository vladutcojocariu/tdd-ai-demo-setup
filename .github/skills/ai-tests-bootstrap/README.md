# ai-tests-bootstrap

A GitHub Copilot skill that sets up AI-assisted testing and TDD in any repository: root instructions,
auto-loading instructions files, skills, custom agents, and a memory bank, all generated from the
repository's own stack.

## Install

Copy this whole folder into the target repository as:

```
.github/skills/ai-tests-bootstrap/
```

`.claude/skills/ai-tests-bootstrap/` also works; Copilot reads both.

## Run

In VS Code, open Copilot Chat in **Agent** mode and type:

```
/ai-tests-bootstrap
```

or `/ai-tests-bootstrap minimal` for the reduced install. The skill only runs when invoked this way.

It detects the stack, asks one batch of questions with a list of files it will write, waits for your
reply, then generates and verifies everything. It does not commit. Review the diff when it finishes.

Once the setup is generated and committed, the bootstrap folder can be deleted from the target
repository, or kept for re-runs. A re-run resumes from the saved stack profile.
