# Repository Structure Guide

A guest-first educational guide to **why files and folders belong where they do**. Start with a short, self-explaining directory story. Follow a simple link to examples and deeper explanations when you want more.

**Status: the initial foundation is published; the visual introduction and focused learning routes are under review on development.** This is not a finished curriculum. The working name remains provisional; coordinated renaming and the specification update are reserved for a later approved main release. Git history and the existing license remain intact.

## What is implemented

- A static-first, layered project illustration with a calm repeating emphasis loop, a schematic checks connection, compact Web/Data previews, persistent pause/resume, and complete reduced-motion/no-JavaScript alternatives
- Separate routes for examples, Astro and Go explanations, Naming Lab, and sources; known earlier section links forward to their new location

- Plain-language descriptions of six project capabilities, with honest feedback for combinations outside the authored curriculum
- Ten original teaching cards: Go CLI, Astro web app, FastAPI backend, Python data analysis and library, Rust/Cargo CLI, PHP/Composer CLI, static HTML & CSS website, JavaScript/Node CLI, and Java/Maven library
- Language/technology and project-type filters with result counts, reset and empty-state recovery
- A deeper Astro page journey with six explained files, five build/delivery steps, and static-versus-hydrated React comparison
- A two-case Go rename-and-explain simulation with preview, cancel, apply and undo
- One deeper illustrative Go photo-renaming CLI lesson with two layout options
- A keyboard-accessible native disclosure outline and a linear alternative
- Node explanations covering purpose, names, locations, contents, alternatives, boundaries, costs, and change triggers
- Claim-level sources and explicit distinctions between tool rules, conventions, and the guide's judgment
- Stable-node comparison, preview/cancel, option selection, and one-step undo
- Deterministic text tree/rationale and versioned JSON-record downloads
- Strict typed content contracts, build-time content validation, unit tests, browser checks, and a CI workflow

The collection and lesson are **source-reviewed drafts**. The rename lab is a documentation-based simulation, not a Go runtime experiment. Its state and the Astro page journey are separate from the Go layout workspace and are not included in layout exports. The Astro fixture is also source-reviewed and unrun; it is not a captured build or network trace. The Go experiment has not been run. The example trees and downloads are explanatory plans, not runnable photo-renaming software. App tests do not establish the lesson's language-runtime behavior or educational effectiveness.

## Deliberately not implemented

No application login, authentication, collaborative workspaces, backend API, database, AI/model calls, telemetry, remote repository imports, or uploaded files. No photo files are read or changed. Shared editing is a later product decision.

This checkpoint is memory-only: choices reset on reload. Persistent local saves, concurrent-tab behavior, JSON restore, arbitrary editing, full requirement-driven transformations, broader curriculum, and learner research remain future work. The interface and exports disclose these limits.

## Local setup

Use **Node 24.21.0 LTS** and **npm 12.2.0**. `.nvmrc`, `engines`, `packageManager`, and the lockfile record the baseline. If using nvm:

```sh
nvm install
nvm use
npm install --global npm@12.2.0
npm ci
npm run dev
```

Then open the localhost address printed by Astro. No environment variables or account credentials are required. Developers can opt out of Astro's tool telemetry with `ASTRO_TELEMETRY_DISABLED=1`.

```sh
npm run check             # Astro diagnostics and TypeScript
npm test                  # Node's built-in test runner
npm run content:validate  # Content schemas, paths, references, and digest
npm run build             # Validates content and produces static dist/
npx playwright install chromium
npm run test:e2e          # Desktop and emulated-mobile Chromium flows
npm run verify            # All of the checks above except browser installation
npm audit --audit-level=high
```

Browser tests use Playwright's pinned Chromium by default. For a managed environment with a preinstalled browser, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its absolute executable path and record the actual browser version in the test report. This override does not prove compatibility with Playwright's bundled browser, Safari, Firefox, or a real mobile device.

## Why this toolchain

Astro builds the static educational shell; React powers the separate optional learning tools; a small native element progressively enhances the landing story; TypeScript checks authoring contracts; Zod validates content/project records; Node supplies the development/build runtime and test runner; npm resolves the locked dependencies. The production output needs only static hosting.

Exact baseline: Astro **7.3.8**, `@astrojs/react` **7.0.1**, React/React DOM **19.3.0**, TypeScript **6.0.3**, Zod **4.6.7**, `@astrojs/check` **0.9.10**, Playwright **1.64.0**. TypeScript 7.0.2 was current when checked but outside the checker's declared peer range; 6.0.3 is the selected compatible stable release. There are no forced peer-dependency overrides. Bun was not admitted or benchmarked: this foundation has no demonstrated need for another runtime/package manager.

See [the checkpoint decision](docs/foundation-decision.md), [verification record](docs/verification.md), and [deployment gate](docs/deployment-gate.md).

## Source map

```text
src/content/       Authored lesson, claims, sources, and layout options
src/domain/        UI-independent schemas, invariants, paths, diffs, and exports
src/components/    Original story and optional React learning tools
src/layouts/       Shared static page shell
src/pages/         Introduction, examples, focused lessons, lab, sources
src/styles/        Local CSS; no remote fonts or component framework
scripts/           Build-time content checks
tests/             Unit and browser regression tests
docs/              Decisions, verification, limitations, and release gates
```

Content is trusted authored data, validated before build. There is no remote-content loader or user import parser. Exports resolve explanations and sources from this content bundle. Schema version and content version are distinct; changing their meaning requires explicit review.

## Hosting and release

The initial foundation was released through PR #2 at `aa04e0c21eda47523631aa59e7a5d6dbe40351a9`. Its public site is [directory-structure-generator.vercel.app](https://directory-structure-generator.vercel.app/). Main CI, Vercel publication, public content/assets/headers and key browser interactions were verified at that release. `development` began at the same commit.

This branch’s Astro journey and redesigned visual introduction are for review only. Main production remains on the approved release until a separately approved merge. The existing project/domain and `vercel.json` are unchanged. Branch pushes can publish protected previews automatically; CI results and preview identity belong to the exact draft-PR head. See [the Astro checkpoint](docs/astro-flow-checkpoint.md) and [visual introduction/route checkpoint](docs/landing-routes-checkpoint.md).

The noindex directive is a search-engine hint, not access control. This static guest experience requires no secrets or database. No hosting permissions, service connections, credentials, GitHub/Vercel names or portfolio references are changed in this checkpoint.

## License and attribution

The existing [MIT license](LICENSE), copyright Sebastian Torres, is preserved unchanged. Historical application/template attribution is recorded in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Lesson prose is original paraphrase with primary-source links, not copied documentation. Additional lesson/fixture licensing and the final release audience remain review decisions.
