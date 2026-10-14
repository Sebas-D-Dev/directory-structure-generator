# Visual introduction and focused routes

## Decision and scope

The owner’s 2026-10-14 correction replaces the long, controls-heavy entry page with a concise visual introduction. The opening should explain itself before asking for interaction. This checkpoint stays on development / draft PR #3; main publication and the coordinated naming/specification update remain separate release decisions.

The landing contains an original, partial TypeScript-style directory map and one primary Explore examples link. All file roles are visible on first paint. A single 9.6-second sequence highlights source, checks and guidance in turn, then holds the complete map. Pause freezes progression, Resume continues the remaining beat, and Replay is optional. Background/page-hide pauses do not automatically resume. Reduced motion and JavaScript-disabled visits receive the complete static map. Switching motion preferences while playing stops the sequence; switching motion back on leaves replay optional.

The names are illustrative conventions rather than universal requirements. The checks → source-behavior relationship describes a responsibility, not an implied import or automatic test discovery. Folders do not enforce connections. No third-party prose, tree, artwork or animation has been copied. See the on-site source register for primary references and scope.

## Routes

- `/`: brief introduction and one-pass directory story; no React learning workspace
- `/examples/`: five original cards, contextual filters, sources and reuse records
- `/examples/astro/`: existing focused build-time versus browser-time Astro journey
- `/examples/go/`: existing capability descriptions, Go tree inspection, comparison/undo and exports
- `/lab/`: existing optional two-case Go naming exercise
- `/sources/`: combined reference register, original-authorship and verification limits

Shared navigation keeps Examples and Sources prominent. A quieter footer and contextual links make the optional tools reachable. Known earlier root fragments map through a fixed, same-origin allowlist using `location.replace`; malformed/unknown fragments remain on the introduction. Without JavaScript the introduction includes explicit links to earlier destinations. Native page navigation supplies URL history rather than a client-side router.

## Preserved learning contract

The source-reviewed catalog, Go content and Astro lesson data are unchanged. Interactions stay in memory on their own page. Navigation/reload can reset them; no saved-state promise is made. Go exports still include the current Go layout, rationale, assumptions and sources only. The story, filters, Astro journey and rename lab are not part of that record. The illustrated Go and Astro runtime experiments remain unrun.

## Acceptance and evidence

Automated coverage includes initial meaning/CTA visibility, a complete 320px map without document overflow, one-pass/pause/resume/replay timing, runtime reduced-motion changes, page-hide suspension, keyboard/touch activation, default no-JavaScript reading, all legacy targets, back/forward, all local route/asset links, all-route CSP hashes and the existing learning/export regressions. Layout captures include initial/final desktop/mobile, 320px and static reduced-motion/no-JavaScript views.

Supplementary local checks use the available Node 24.19.0/npm 11.9.0 environment. The required Node 24.21.0/npm 12.2.0 baseline and actual browser assertions run in GitHub Actions. Do not interpret local static checks or test discovery as a browser pass. Exact-head CI, Vercel deployment and independent pixel-review results are recorded in PR #3 after execution, without a self-changing status-commit loop.

The protected preview may require Vercel SSO. Its deployment status does not establish hosted browser behavior or served application headers. No protection changes or alternate access route are included. Real devices, screen readers, broad browser coverage, learner studies and runtime lesson fixtures remain unverified.
