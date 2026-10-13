import { z } from 'zod';
import { sourceSchema } from './contracts.ts';

const text = z.string().trim().min(1).max(2000);
const id = z.string().regex(/^[a-z][a-z0-9-]+$/);
const refs = z.array(id).min(1).max(8);
export const pageModes = ['static', 'interactive'] as const;
export type PageMode = typeof pageModes[number];
const viewSchema = z.strictObject({title: text, input: text, output: text, explanation: text, caveat: text});
export const pageFlowSchema = z.strictObject({
  version: z.literal('2026.10-astro-flow.1'),
  origin: z.literal('Original teaching illustration'),
  verification: z.literal('Source-reviewed; illustrative fixture not executed'),
  reuse: z.literal('Original prose and diagrams; official documentation linked for facts; no third-party material reproduced'),
  assumptions: z.array(text).min(3),
  sources: z.array(sourceSchema).min(1),
  files: z.array(z.strictObject({
    id, path: text, kind: z.enum(['Source', 'Configuration', 'Public asset', 'Generated output']),
    nameKind: z.enum(['Tool rule', 'Configured default', 'Convention', 'Author choice']),
    role: text, naming: text, contents: z.array(text).min(2), alternatives: text,
    boundary: text, tradeoff: text, evolution: text, sourceIds: refs, preferredStep: id,
  })).min(1),
  steps: z.array(z.strictObject({
    id, phase: z.enum(['Build time', 'Request / browser time']),
    label: text, fileIds: refs, sourceIds: refs,
    static: viewSchema, interactive: viewSchema,
  })).min(2),
});
export type PageFlow = z.infer<typeof pageFlowSchema>;
export function validatePageFlow(input: unknown): PageFlow {
  const lesson = pageFlowSchema.parse(input);
  const fileIds = new Set(lesson.files.map((file) => file.id));
  const stepIds = new Set(lesson.steps.map((step) => step.id));
  const sourceIds = new Set(lesson.sources.map((source) => source.id));
  if (fileIds.size !== lesson.files.length || stepIds.size !== lesson.steps.length || sourceIds.size !== lesson.sources.length)
    throw new Error('Duplicate page-flow identity');
  const checkRefs = (ids: string[], available: Set<string>) => {
    if (new Set(ids).size !== ids.length || ids.some((key) => !available.has(key))) throw new Error('Invalid page-flow reference');
  };
  let reachedBrowser = false;
  for (const step of lesson.steps) {
    checkRefs(step.fileIds, fileIds); checkRefs(step.sourceIds, sourceIds);
    if (step.phase === 'Request / browser time') reachedBrowser = true;
    else if (reachedBrowser) throw new Error('Build steps cannot follow browser steps');
  }
  for (const file of lesson.files) {
    checkRefs(file.sourceIds, sourceIds);
    const step = lesson.steps.find((item) => item.id === file.preferredStep);
    if (!step?.fileIds.includes(file.id)) throw new Error('File must be connected to its preferred step');
  }
  if (!reachedBrowser || lesson.steps[0]?.phase !== 'Build time') throw new Error('Both flow phases are required');
  for (const source of lesson.sources)
    if (source.reviewAfter < source.checkedAt) throw new Error('Invalid page-flow review date');
  return lesson;
}

export function getFlowStep(lesson: PageFlow, stepId: string, mode: PageMode) {
  const step = lesson.steps.find((item) => item.id === stepId);
  if (!step) throw new Error('Unknown page-flow step');
  return {...step, view: step[mode]};
}
export function stepIndex(lesson: PageFlow, current: number, direction: -1 | 1): number {
  return Math.max(0, Math.min(lesson.steps.length - 1, current + direction));
}
