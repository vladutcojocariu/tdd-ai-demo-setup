---
name: regression-risk
description: >
  Score a diff on five risk dimensions to direct review attention. Use during review or pre-PR, and
  when asked "how risky is this change", "what could this break", or "what should I look at first".
  Do NOT trigger for the go/no-go decision itself (see pr-readiness).
---

# Regression Risk

Score 0 to 100. The number is a focusing device, not a gate.

| Dimension         | Weight | How to measure                                                                                                                                              |
| ----------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blast radius      | 25     | How many modules import the changed code                                                                                                                    |
| Test coverage gap | 25     | Share of changed source files whose co-located `.test.ts`/`.test.tsx` was not also changed                                                                  |
| Hotspot proximity | 20     | Whether changed files appear in recent bug-fix commits                                                                                                      |
| Complexity delta  | 15     | Lines changed, weighted toward new branching and async work                                                                                                 |
| Shared contract   | 15     | Whether `src/config.ts` or a type in `src/types/**` changed. Both are imported everywhere, so score high unless every consuming module has an updated test. |

| Score  | Label  | Guidance                                   |
| ------ | ------ | ------------------------------------------ |
| 0-30   | Low    | Routine review                             |
| 31-60  | Medium | Focused review on the flagged areas        |
| 61-100 | High   | Careful review; list the specific hotspots |

Output a short table with the score per dimension and the evidence for each.
