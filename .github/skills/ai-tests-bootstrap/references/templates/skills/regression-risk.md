---
name: regression-risk
description: Score a diff on five risk dimensions to direct review attention. Use during review or pre-PR.
---

# Regression Risk

Score 0 to 100. The number is a focusing device, not a gate.

| Dimension                   | Weight | How to measure                                                                                                                                                                                                   |
| --------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blast radius                | 25     | How many modules import the changed code                                                                                                                                                                         |
| Test coverage gap           | 25     | Share of changed source files whose tests were not also changed                                                                                                                                                  |
| Hotspot proximity           | 20     | Whether changed files appear in recent bug-fix commits                                                                                                                                                           |
| Complexity delta            | 15     | Lines changed, weighted toward new branching and async work                                                                                                                                                      |
| <<FILL: project dimension>> | 15     | <<FILL: how to measure it, e.g. shared code changed without coverage in every consuming mode. If the project has no such dimension, use "Public API or schema change" measured by changed exported signatures.>> |

| Score  | Label  | Guidance                                   |
| ------ | ------ | ------------------------------------------ |
| 0-30   | Low    | Routine review                             |
| 31-60  | Medium | Focused review on the flagged areas        |
| 61-100 | High   | Careful review; list the specific hotspots |

Output a short table with the score per dimension and the evidence for each.
