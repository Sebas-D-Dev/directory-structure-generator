# Repository Structure Guide

A guest-first educational guide to **why files and folders belong where they do**. Start with project purpose, inspect a concrete example, compare a simpler layout with an alternative, and follow the evidence behind each choice.

**Status: clean-rebuild foundation under review, not a finished product or an approved public release.** The working name is provisional. This branch replaces the old application implementation; Git history and the existing license remain intact.

## What is implemented

- Plain-language descriptions of six project capabilities, with honest feedback for combinations outside the authored curriculum
- Five original teaching cards: Go CLI, Astro web app, FastAPI backend, Python data analysis, and Python library
- Language/project-type filters with result counts, reset and empty-state recovery
- A two-case Go rename-and-explain simulation with preview, cancel, apply and undo
- One deeper illustrative Go photo-renaming CLI lesson with two layout options
- A keyboard-accessible native disclosure outline and a linear alternative
- Node explanations covering purpose, names, locations, contents, alternatives, boundaries, costs, and change triggers
- Claim-level sources and explicit distinctions between tool rules, conventions, and the guide's judgment
- Stable-node comparison, preview/cancel, option selection, and one-step undo
- Deterministic text tree/rationale and versioned JSON-record downloads
- Strict typed content contracts, build-time content validation, unit tests, browser checks, and a CI workflow

The collection and lesson are **source-reviewed drafts**. The rename lab is a documentation-based simulation, not a Go runtime experiment. Its state is separate from the layout workspace and is not included in layout exports. Its Go experiment has not been run. The example trees and downloads are explanatory plans, not runnable photo-renaming software. App tests do not establish the lesson's language-runtime behavior or educational effectiveness.

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

Astro builds the static educational shell; React owns one coherent interactive workspace; TypeScript checks authoring contracts; Zod validates content/project records; Node supplies the development/build runtime and test runner; npm resolves the locked dependencies. The production output needs only static hosting.

Exact baseline: Astro **7.3.8**, `@astrojs/react` **7.0.1**, React/React DOM **19.3.0**, TypeScript **6.0.3**, Zod **4.6.7**, `@astrojs/check` **0.9.10**, Playwright **1.64.0**. TypeScript 7.0.2 was current when checked but outside the checker's declared peer range; 6.0.3 is the selected compatible stable release. There are no forced peer-dependency overrides. Bun was not admitted or benchmarked: this foundation has no demonstrated need for another runtime/package manager.

See [the checkpoint decision](docs/foundation-decision.md), [verification record](docs/verification.md), and [deployment gate](docs/deployment-gate.md).

## Source map

```text
src/content/       Authored lesson, claims, sources, and layout options
src/domain/        UI-independent schemas, invariants, paths, diffs, and exports
src/components/    React learning workspace
src/pages/         Static Astro document and source register
src/styles/        Local CSS; no remote fonts or component framework
scripts/           Build-time content checks
tests/             Unit and browser regression tests
docs/              Decisions, verification, limitations, and release gates
```

Content is trusted authored data, validated before build. There is no remote-content loader or user import parser. Exports resolve explanations and sources from this content bundle. Schema version and content version are distinct; changing their meaning requires explicit review.

## Hosting and release

The existing Vercel project and domain are retained. The authorized review branch now has a [successful Vercel preview](https://directory-structure-generator-git-af53ea-sebas-d-devs-projects.vercel.app), protected by Vercel SSO. `vercel.json` supplies static build settings and headers. See the [verification record](docs/verification.md) for the exact tested commit and remaining hosted checks. Production settings, served identity and release approval remain separate gates before merging main. A branch push can publish a preview automatically.

The noindex directive is only a search-engine hint, not access control. The existing production site stays unchanged until a separately approved release. The new guest experience needs no secrets or database. The owner separately reported disconnecting the obsolete Supabase resource connection; no credentials or databases were changed through this PR.

## License and attribution

The existing [MIT license](LICENSE), copyright Sebastian Torres, is preserved unchanged. Historical application/template attribution is recorded in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Lesson prose is original paraphrase with primary-source links, not copied documentation. Additional lesson/fixture licensing and the final release audience remain review decisions.
