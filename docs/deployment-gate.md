# Retained Vercel target and release gate

Target: existing `directory-structure-generator` project in `sebas-d-devs-projects`, ID `prj_cHTJq4Zp01Ci1PEqRKaABtCHxkcR`, intended domain `directory-structure-generator.vercel.app`.

The review branch is linked to this retained project. Its first previews failed at **Provisioning Integrations**, where the owner's deployment screenshots showed the retained `supabase-nextjs` resource in error. On 2026-10-13 the owner reported disconnecting that resource connection. A source-identical retry commit, `e3a14baa679e9ec647eeb7abaaf99c5408ed213f`, then produced a [Ready preview](https://vercel.com/sebas-d-devs-projects/directory-structure-generator/9x4tbAiGxo1Z9p6rPqDkuFLVrEg6), confirmed by Vercel's GitHub status and bot comment.

[Open the branch preview](https://directory-structure-generator-git-af53ea-sebas-d-devs-projects.vercel.app). An unauthenticated HTTP request redirected to Vercel SSO. This is hosting-level preview protection, not application authentication. Hosted interactive flows and response headers behind that protection have not been verified. Project-detail/log access previously returned 403 and was not bypassed. No deployment protection or credentials were changed. The reported resource disconnection was not independently inspected; the successful retry is the observed outcome.

## Review-branch authorization and promotion gate

The owner authorized the new review PR and its ordinary automatic preview effects on 2026-10-13. This supersedes the earlier local-only hold for the review branch. It does not authorize merging main, changing hosting access settings, or creating development before main publication is confirmed.

1. Verify the linked GitHub repository, production branch, automatic branch/PR triggers, and preview visibility.
2. Confirm build root, framework preset, install/build commands, output directory, Node runtime, and relevant environment variable **names only**. Never include values in screenshots or review notes.
3. Reconcile dashboard overrides with this branch's proposed static settings: Astro, repository root, Node 24.x satisfying package engines, `npx --yes npm@12.2.0 ci`, `npx --yes npm@12.2.0 run build`, `dist`.
4. Keep the authorized review branch separate from main. A draft PR is not deployment isolation; inspect any actual preview checks and report their visibility and outcome.

`vercel.json` supplies the static settings used by the successful preview. Its header configuration still needs verification on the served application response. Explicit pinned npm install and build commands avoid assuming the platform defaults select npm 12.2.0. See [Vercel package managers](https://vercel.com/docs/package-managers).

## Before production

- Complete the agreed checkpoint/release review and separately approve production publication.
- Verify exact team, project, branch/commit, content digest, target domain, and visibility.
- Run the guest flows and exports in the authorized preview; inspect headers and actual network activity there.
- Confirm static output and no obsolete auth/API endpoints or user-facing sign-in requirement.
- Record the previous served deployment and demonstrate the approved rollback path using retained Git/deployment history.

The historical main commit is a source rollback reference, **not** a verified live-deployment identity. No production push, merge, manual redeploy, project disconnection, environment-variable deletion, or credential cleanup is part of this review foundation. No service or credential changes were performed through this PR; the owner separately reported removing the obsolete Supabase resource connection.
