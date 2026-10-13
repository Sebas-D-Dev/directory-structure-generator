import { z } from 'zod';

const text = z.string().trim().min(1).max(10000);
const id = z.string().regex(/^[a-z][a-z0-9-]{0,63}$/);
const refs = z.array(id).min(1).max(50);
const date = z.iso.date();
export const capabilitySchema = z.enum(['website', 'web-app', 'api', 'library', 'cli', 'pipeline']);
export type Capability = z.infer<typeof capabilitySchema>;
export const provenanceSchema = z.enum(['tool-rule', 'configured-behavior', 'maintainer-advice', 'design-judgment']);
export const sourceSchema = z.strictObject({
  id, title: text, publisher: text,
  url: z.url().refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password;
    } catch { return false; }
  }, 'Sources must use HTTPS without embedded credentials'),
  section: text, version: text, checkedAt: date, reviewAfter: date,
});
export const claimSchema = z.strictObject({
  id, statement: text, provenance: provenanceSchema, scope: text,
  sourceIds: z.array(id).max(10), checkedAt: date, reviewer: text,
  verification: z.enum(['source-reviewed', 'reasoned-proposal']),
}).superRefine((claim, ctx) => {
  if (claim.provenance !== 'design-judgment' && claim.sourceIds.length === 0)
    ctx.addIssue({code: 'custom', message: 'Behavioral claims require a source'});
  if (claim.provenance === 'design-judgment' && claim.verification !== 'reasoned-proposal')
    ctx.addIssue({code: 'custom', message: 'Design judgment must remain a reasoned proposal'});
});
export const explanationSchema = z.strictObject({
  summary: text, nameRule: text, locationRule: text,
  nameKind: z.enum(['tool-rule', 'convention', 'author-choice']),
  locationKind: z.enum(['tool-rule', 'configured', 'author-choice']),
  contents: z.array(text).min(2).max(5), alternatives: text,
  boundary: text, tradeoff: text, counterexample: text, evolution: text,
  claimIds: refs,
});
export const nodeSchema = z.strictObject({
  id, parentId: id.nullable(), name: z.string().min(1).max(255),
  kind: z.enum(['directory', 'file']),
  origin: z.enum(['source', 'configuration', 'documentation']),
  explanation: explanationSchema,
});
export const variantSchema = z.strictObject({
  id, revision: z.literal(1), title: text, summary: text, fit: text, cost: text,
  rootNodeId: id, nodes: z.array(nodeSchema).min(1).max(500),
});
export const bundleSchema = z.strictObject({
  schemaVersion: z.literal(1), contentVersion: z.literal('2026.10-foundation.1'),
  status: z.literal('source-reviewed-draft'), createdAt: date,
  sources: z.array(sourceSchema).min(1), claims: z.array(claimSchema).min(1),
  lesson: z.strictObject({
    id, title: text, purpose: text, audience: text, prerequisites: text,
    assumptions: z.array(text).min(1), unknowns: z.array(text).min(1),
    applicability: text, counterexample: text,
    experiment: z.strictObject({id, status: z.literal('planned-unrun'), hypothesis: text, protocol: z.array(text).min(1)}),
    variantIds: z.array(id).min(2),
  }),
  variants: z.array(variantSchema).min(2),
});
export type ContentBundle = z.infer<typeof bundleSchema>;
export type StructureNode = z.infer<typeof nodeSchema>;
export type Variant = z.infer<typeof variantSchema>;
export type Source = z.infer<typeof sourceSchema>;

export const projectSchema = z.strictObject({
  projectSchemaVersion: z.literal(1), contentVersion: z.literal('2026.10-foundation.1'),
  lessonId: z.literal('go-photo-cli'),
  capabilities: z.array(capabilitySchema).max(6),
  capabilityOrigin: z.enum(['example-default', 'learner-selection']),
  uncertain: z.boolean(), variantId: z.enum(['flat-command', 'internal-package']),
}).superRefine((project, ctx) => {
  if (new Set(project.capabilities).size !== project.capabilities.length)
    ctx.addIssue({code: 'custom', message: 'Duplicate capabilities'});
});
export type Project = z.infer<typeof projectSchema>;
