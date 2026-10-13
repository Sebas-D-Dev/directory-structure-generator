# Visual checkpoint: provenance and scope

Revision: `2026.10-visual.1`, reviewed 2026-10-13. Source records are in `src/content/examples.ts`; strict contracts and reference validation are in `src/domain/learning.ts`.

## Published material

Five independently authored, illustrative trees cover three language labels (Go, TypeScript, Python) and five project types (CLI, web app, backend API, data analysis, library). They are small teaching sketches, not complete runnable applications. The four broader cards are not four additional deep lessons. The full layout inspector remains the Go example.

The rename lab contrasts an ordinary Go entry filename with the `_test.go` rule. It models one simple filename in one package and explicitly excludes platform-specific files, build tags, cgo, filename collisions and additional entry points. Predictions are sourced, not claims of a completed Go experiment. Preview/apply/undo affect the teaching model only. Lab changes are not part of the older layout export record; both areas reset on reload.

## Specific-use decisions

Every card separates:

1. The original illustration and original explanatory prose, distributed under this repository's existing MIT license.
2. Factual references to official/maintainer documentation, with exact URL, topic, reviewed version/date and next review date.
3. A related, external example/template repository, linked only. The entry includes source path, moving-reference disclosure, review date, reviewer, intended use and explicit copying restrictions. No revision is approved for reproduction.

No third-party code, documentation passage, tree, diagram, screenshot, logo or asset was copied. The card's tree is not the linked repository's tree. A real-world repository case study has not been added. Original authorship and link-only records must not be relabeled as “official template” or as broad reuse permission.

Before reproducing anything, pin the exact upstream revision and paths, inspect file headers and asset-specific terms, record applicable license/copyright/notices and modifications, then approve only the assessed publication/download use. Unresolved reproduction stays out of the published collection. Repository visibility and attribution alone are not copying permission. See [GitHub licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).

## Interaction design and verification

Native selects implement single-choice facets with AND across language/type. Counts and empty states stay visible; Clear filters resets both. Native details make consequences and provenance available by keyboard and touch. Hover only enhances card borders/shadows; it reveals no exclusive information.

The rename reveal uses one 180ms opacity/transform transition, with no recurring animation. Reduced-motion preferences disable animation, transitions and smooth scrolling without hiding information. Automated tests cover filters, reset, invalid input, case switching, preview/cancel/apply/undo, reload, keyboard navigation and reduced-motion. CI validates the final branch commit; the PR records its exact results. Visual review and automated behavior checks are distinct from WCAG conformance or real-device performance measurements.

## Astro page journey development increment

The separate `2026.10-astro-flow.1` registry adds six fully explained files and five build/delivery steps for the Astro card. It is original illustrative content, with per-step and per-file references to official Astro docs and explicit static-output assumptions. The flow is not a network capture, executed fixture or copied template. The existing five-card catalog and Go export content versions are unchanged. See [the checkpoint record](astro-flow-checkpoint.md).
