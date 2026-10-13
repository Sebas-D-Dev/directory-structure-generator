# Foundation checkpoint decision

Date: 2026-10-13. Based on Technical Specification v0.2 and the subsequent instruction to begin cleanup and updates.

## Scope and status

This is a bounded implementation foundation spanning parts of CP01–CP03 and a CP05 scaffold. It does **not** close the full specification checkpoints or authorize CP08/public release.

Confirmed direction: clean application rebuild, no authentication, preserve Git history and the existing Vercel hosting target. Collaboration belongs later in the product plan. Original base: `fcdfe59b27c3b3dfd433cdc63621bc903b621a45`. Local working branch: `rebuild/educational-foundation`.

Selected engineering baseline: static Astro + React + TypeScript, Node 24 LTS, npm. The user permitted compatible minimal tooling; current package metadata and actual install/type/test/build results support this choice. Node runs authoring and builds; npm is the package manager; Astro is the static framework; React supplies client interaction. Vercel is the retained managed host, not a package to version. No Bun compatibility or speed result is asserted.

## First illustrative chapter

One small Go CLI example explains a flat command and optional extracted internal package. It exposes three distinct mechanisms with little infrastructure: main.go/cmd conventions, go.mod module configuration, and internal import enforcement. The language-neutral capability chooser precedes technical detail. All other capability combinations are explicitly unsupported by the current lesson.

This selection is an implementation proposal for review, not approval of a complete first-release curriculum. Python packaging, Next.js routing, API/pipeline lessons, and broader portfolio selection remain open. The working name and audience also remain provisional.

## Included acceptance evidence

- Typed bundle, source, claim, explanation, node, variant, and project contracts
- Invalid names, duplicates, cycles, missing references, unsafe URLs, empty content, unknown fields, and unearned experiment results rejected
- Every included node has an explanation and source-linked claims
- Static guest workspace, native disclosure/linear navigation, local option preview/cancel/undo
- Deterministic record exports; no imported or user-authored evidence
- CI prepared without deployment credentials or deploy steps

## Explicit deferrals

CP04 runtime experiments remain planned/unrun. CP05 requires learner and assistive-technology review before closure. The small comparison is not the full CP06 transformation engine. CP07 persistence, quota/corruption/concurrency recovery and optional restore are absent, visibly disclosed. CP08 browser matrix, real-device performance, release licensing, hosting checks, rollback rehearsal and release approval remain open.

## Architecture

UI imports domain helpers/contracts and authored content. Domain code imports no React, browser API, storage, or network library. Browser download handling is in the presentation adapter. Build-time validation is separate from subject-matter approval. Stable node IDs survive comparison moves. There is one small content bundle; no speculative service layer, database abstraction, plugin system or state-management dependency.

## Evidence sources

- [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Astro static Vercel deployment](https://docs.astro.build/en/guides/deploy/vercel/)
- [Node 24.21.0 LTS](https://nodejs.org/en/blog/release/v24.21.0)
- [Astro security advisories](https://github.com/withastro/astro/security/advisories)
- Package versions and peer ranges read from the official npm registry on 2026-10-13
- Claim-level Go sources are in `src/content/foundation.ts`
