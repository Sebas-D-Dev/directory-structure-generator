# Development checkpoint: follow an Astro page

Selected 2026-10-13, following the published foundation at `aa04e0c21eda47523631aa59e7a5d6dbe40351a9`. Work is on `development`; main publication is not part of this checkpoint.

## Scope and specification fit

This is a bounded extension of CP03 (claim-backed lessons) and CP05 (learning-interface vertical slice) in the v0.2 specification. It does not close those entire chapters or claim CP04 experiments have run. One original Astro example gets depth rather than expanding every language superficially.

- Five explicit steps: route recognition, source composition, output publication, later request delivery and browser use.
- Build-time and request/browser phases are visibly separate. No runtime source-tree traversal is implied.
- Six complete file explanations: page, layout, React component, public icon, configuration and generated HTML.
- Two comparison views: prerendered React markup without hydration, or `client:load` with initial HTML plus browser hydration of that component instance.
- Stable step/file selection, previous/next, return-to-start, explanation focus actions, source details and linear file outline.
- Accessible native radios/buttons/details; no autoplay, drag-only operation, color-only meaning, or required hover.
- Existing Go lessons, filters and exports remain intact. The page-flow comparison is explicitly excluded from the older Go export record.

No authentication, database, adapter, server rendering, external requests, library dependency or runtime content importer is added. No repository/hosting/portfolio rename or formal specification-document edit occurs here. Those remain coordinated decisions for the next substantial release.

## Evidence and authorship

`src/content/astro-flow.ts` contains original explanations and diagrams plus nine official Astro documentation references. `src/domain/page-flow.ts` validates complete fields, unique IDs, safe source URLs, cross-references, connected files, phase order and review dates. `scripts/validate-content.ts` reports the separate content digest.

The model assumes static output, root deployment, default source/output paths and configured React integration. It never claims all Astro projects prerender, that all pages ship zero JavaScript, or that an organizational folder automatically wires a component into a route. UI comparison does not disable this guide's own JavaScript.

The illustrative fixture is not executed. Documentation-backed behavior is distinct from observed app-test results. Diagrams, prose and one-line component-use examples are original; no upstream template, repository tree, artwork or documentation passage is reproduced. Links do not grant reuse permission. Existing MIT and historical notices remain unchanged.

## Acceptance and remaining gates

Run unit, content, type, static build/CSP, browser and dependency-audit checks on the final PR head. Browser coverage includes both views, all six file connections, phase navigation, keyboard focus, reload, 320px touch/pointer paths, reduced motion and previous Go/filter/export regressions. CI captures local-page screenshots for independent desktop/narrow visual inspection; those captures contain no learner data.

The exact final commit, CI counts, review outcome and Vercel preview are recorded in the draft PR rather than changing source after every check. Supplementary local checks use the available Node 24.19.0/npm 11.9.0 environment; release CI uses pinned Node 24.21.0/npm 12.2.0. No browser bypass is used for the known local environment restriction or protected previews.

This is not a real-device/screen-reader assessment, learner study, network-performance measurement, or reproduction of the illustrative Astro project. Those limitations remain visible and are not replaced by green app tests.
