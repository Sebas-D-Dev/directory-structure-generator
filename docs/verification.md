# Foundation verification record

Date: 2026-10-13. This record distinguishes local automated checks from curriculum validation, browser verification, and release approval.

## Tested baseline

- Linux x86_64 cloud command environment
- Node 24.21.0 LTS, official nodejs.org Linux archive, SHA-256 `fd8e59d5a511510f6a298afb548f18c7d2b1be404d8b4a27d94fbe49f56cb2d6`, checked against the vendor's HTTPS SHASUMS256.txt
- npm 12.2.0; exact application/dev dependency versions in package.json and package-lock.json
- Lockfile format 3; no force/legacy-peer-deps or dependency overrides
- TypeScript 6.0.3 selected because @astrojs/check 0.9.10 declares TypeScript ^5 or ^6 support; TypeScript 7.0.2 was not admitted

## Passed locally

- Clean `npm ci`; the lockfile hash remained unchanged after reinstall
- `npm run check`: Astro diagnostics and TypeScript, zero errors/warnings/hints
- `npm test`: all 33 unit/content tests passed
- Content validation: two options, seven claims, four primary sources; safe names, single-root tree, cycles, parent links, references, duplicate IDs/paths, required explanations and evidence states checked
- Static Astro production build: one page; no server functions or application API routes
- Generated-HTML inspection: CSP present, bootstrap-script hashes checked, no remote asset URLs and no submission forms
- Dependency audit: zero reported vulnerabilities across all severity levels on 2026-10-13. This is a point-in-time advisory result, not a security guarantee
- Two independent read-only reviews: content/model correctness and UI/security/CI structure. All reported issues were corrected; no remaining high/medium finding in the reviewed scope

Content digest (SHA-256 of JSON.stringify authored bundle): `d07272c36f11e36749179d5a4eff8935fc96966111eb16113bbd8ca0462f77f4`.
Lockfile SHA-256: `2f23174bdf97d33f192cb078c4a3886530890fa02ce32a4c50f5e1188ca3913d`.

All emitted JavaScript totals roughly 102 KiB gzip. This is a local artifact-size measurement, not a transfer measurement, mobile timing result, or compliance claim for the proposed performance budget.

## Browser checks passed in GitHub Actions

The [PR verification run](https://github.com/Sebas-D-Dev/directory-structure-generator/actions/runs/38428065391) completed successfully on 2026-10-13 for head `4e47088acb2b3546eab9fe06a103d2ebba2639c9` against main `fcdfe59b27c3b3dfd433cdc63621bc903b621a45`. GitHub checked out its synthetic merge commit `a11622113c3358e61dec8591f1a5c46660e3dae9`; this is test machinery, not a merge into main. The push-triggered run also passed.

Runner: Ubuntu 24.04.5; Node 24.21.0; npm 12.2.0; Playwright 1.64.0; Chrome for Testing / Headless Shell 156.0.8078.4 (Chromium revision 1248). All 33 unit/content tests and all ten browser cases passed. The browser cases exercise desktop and Pixel 7-emulated Chromium: guest inspection, option preview/cancel/apply/undo and focus, text export, unsupported combinations, reload behavior, linear/nested navigation, actual Tab reachability and disclosure keyboard behavior, horizontal-overflow checks, and initial local-resource/CSP checks. Type checks, static build/content validation and audit also passed.

This verifies the tested automated flows. It is not a visual-design review, WCAG conformance result, real mobile-device result, Go experiment, or Vercel-hosted preview result.

### Successful Vercel retry

On 2026-10-13, after the owner reported removing the obsolete Supabase resource connection, empty retry commit `e3a14baa679e9ec647eeb7abaaf99c5408ed213f` retained exactly the source tree of `139a806eeb05693121ee073d81a766760c022db7`. Both its [PR verification](https://github.com/Sebas-D-Dev/directory-structure-generator/actions/runs/38443177629) and [push verification](https://github.com/Sebas-D-Dev/directory-structure-generator/actions/runs/38443169277) completed successfully.

Vercel reported the [retry deployment Ready](https://vercel.com/sebas-d-devs-projects/directory-structure-generator/9x4tbAiGxo1Z9p6rPqDkuFLVrEg6). Its [branch preview](https://directory-structure-generator-git-af53ea-sebas-d-devs-projects.vercel.app) redirects unauthenticated requests to Vercel SSO, so deployment success is verified but hosted interactive behavior and served application headers remain unverified. The platform protection was not disabled or bypassed. The reported resource disconnection was not independently inspected. No application database is required for local fixture-based testing.

These run links are evidence for the named commit; later commits must pass their own checks before merge.

### Historical local environment limitation

Playwright 1.64.0's Chromium download returned an invalid/truncated archive in this environment. The available system Chromium 154.0.8037.57 could not start: its process-singleton socket operation was not permitted. An independent reviewer hit the same restriction. The attempted eight-test desktop/mobile run failed before browser startup, not at application assertions. The suite was subsequently expanded to ten cases with focus and true Tab/disclosure regression coverage; they passed in the GitHub run above.

The supported cloud-browser route was not used to get around a previously denied localhost route. No local browser screenshot or visual pass is claimed. The initial local `npm run verify` did not pass end to end; the subsequent GitHub run passed it in a supported runner.

Remaining verification includes independent visual/assistive-technology review, the broader browser/device matrix, repeated and interrupted flows beyond current cases, and the actual hosted preview. Inspect served headers and actual network requests in that authorized preview before production.

## Review fixes covered by local regression tests or prepared browser assertions

- Malformed source URLs now return a schema validation failure rather than leaking a URL-constructor exception
- Lesson variant references must be distinct
- The pinned Go reference now points at its actual Internal packages section
- Preview cancel returns focus to its trigger; apply/undo focus the persistent current-option heading
- Outline toggle uses action labels without a contradictory pressed state
- CI remains read-only with no checkout credential persistence and no deploy step
- Both proposed Vercel install and build invocations select npm 12.2.0 explicitly

## Still unrun or undecided

- Go language/runtime experiments and independent reproduction
- Real learners, screen readers, cross-browser/real-device tests, performance profiling
- Hosted interactive and header verification inside the protected Vercel preview; deployment itself is Ready as recorded above
- Hosting Git/build/visibility settings, served production identity, deployed headers, rollback rehearsal
- Local persistence, JSON restore and their recovery tests; they are not features in this checkpoint
- Full checkpoint acceptance, release audience, additional lesson/fixture licensing, and public launch approval

The existing LICENSE and historical Git source remain intact. At the initial local checkpoint no remote changes had been made. On 2026-10-13 the owner subsequently authorized a review-branch push, a new PR, ordinary preview effects, and closing the obsolete dependency PR. Main merge, production publication, and a development branch after verified publication remain separate gated steps. No service disconnection or credential changes were performed through this PR; the owner separately reported disconnecting the obsolete Supabase resource connection.

## Visual/source checkpoint addition

The next review adds five original illustrative cards (three language labels and five project types), context-sensitive language/type filters, source-specific link-only provenance, and a two-case Go filename simulation. See [content provenance](content-provenance.md) for scope. No dependency or hosting-protection changes were needed. The foundation content/export version remains unchanged; the new catalog has its own revision.

Supplementary checks in the resumed local environment (Node 24.19.0/npm 11.9.0) on 2026-10-13 passed 39 unit/content tests, type validation, both content registries, static build and CSP/hash artifact checks; npm audit reported zero vulnerabilities. The required Node 24.21.0/npm 12.2.0 baseline is verified separately in CI. The final commit’s CI and Vercel outcomes are recorded on PR #2 rather than generating a new commit for every status update. Browser coverage is expanded to desktop/mobile filter and rename flows, keyboard/focus, reduced motion, export regressions, and local-only layout captures for visual inspection. No Go runtime experiment or broad accessibility-conformance pass is implied.
