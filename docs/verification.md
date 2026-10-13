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

## Browser checks blocked, not passed

Playwright 1.64.0's Chromium download returned an invalid/truncated archive in this environment. The available system Chromium 154.0.8037.57 could not start: its process-singleton socket operation was not permitted. An independent reviewer hit the same restriction. The attempted eight-test desktop/mobile run failed before browser startup, not at application assertions. The suite was subsequently expanded to ten cases with focus and true Tab/disclosure regression coverage; those browser cases remain unrun.

The supported cloud-browser route was not used to get around a previously denied localhost route. No browser screenshot, responsive visual result, browser network result, or accessibility pass is claimed. `npm run verify` therefore has **not passed end to end**.

To close this gate, run the documented browser suite in a supported development/CI environment and fix any failures. In particular, verify hydration under CSP, desktop/mobile reflow, every node's keyboard path, disclosure behavior, preview/cancel/apply/undo focus, repeated exports, unsupported combinations, reload behavior, and explicit source navigation. Inspect actual network requests and served hosting headers in an authorized preview.

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
- GitHub Actions on a remote commit and an authorized Vercel preview
- Hosting Git/build/visibility settings, served production identity, deployed headers, rollback rehearsal
- Local persistence, JSON restore and their recovery tests; they are not features in this checkpoint
- Full checkpoint acceptance, release audience, additional lesson/fixture licensing, and public launch approval

The existing LICENSE and historical Git source remain intact. At the initial local checkpoint no remote changes had been made. On 2026-10-13 the owner subsequently authorized a review-branch push, a new PR, ordinary preview effects, and closing the obsolete dependency PR. Main merge, production publication, and a development branch after verified publication remain separate gated steps. Service disconnection and credential changes remain excluded.
