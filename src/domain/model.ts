import { projectSchema, type Capability, type ContentBundle, type Project, type Variant } from './contracts.ts';

export const initialProject: Project = {
  projectSchemaVersion: 1, contentVersion: '2026.10-foundation.1', lessonId: 'go-photo-cli',
  capabilities: ['cli'], capabilityOrigin: 'example-default', uncertain: false, variantId: 'flat-command',
};
export function supportsCapabilities(capabilities: Capability[], uncertain: boolean): boolean {
  return !uncertain && capabilities.length === 1 && capabilities[0] === 'cli';
}
export function getVariant(bundle: ContentBundle, id: string): Variant {
  const variant = bundle.variants.find((item) => item.id === id);
  if (!variant) throw new Error('Unknown layout option');
  return variant;
}
export function pathFor(variant: Variant, id: string): string {
  const parts: string[] = [];
  const seen = new Set<string>();
  let node = variant.nodes.find((item) => item.id === id);
  if (!node) throw new Error('Unknown node');
  while (node) {
    if (seen.has(node.id)) throw new Error('Cyclic tree');
    seen.add(node.id);
    parts.unshift(node.name);
    if (node.parentId === null) break;
    node = variant.nodes.find((item) => item.id === node?.parentId);
    if (!node) throw new Error('Missing parent');
  }
  return parts.join('/');
}
export function treeText(variant: Variant): string {
  const root = variant.nodes.find((node) => node.id === variant.rootNodeId);
  if (!root) throw new Error('Missing root');
  const lines = [root.name + '/'];
  function visit(id: string, indent: string): void {
    const children = variant.nodes.filter((node) => node.parentId === id);
    children.forEach((node, index) => {
      const last = index === children.length - 1;
      lines.push(`${indent}${last ? '└── ' : '├── '}${node.name}${node.kind === 'directory' ? '/' : ''}`);
      visit(node.id, indent + (last ? '    ' : '│   '));
    });
  }
  visit(root.id, '');
  return lines.join('\n') + '\n';
}
export type Change = {id: string; kind: 'added' | 'removed' | 'moved'; from?: string; to?: string};
export function compareVariants(before: Variant, after: Variant): Change[] {
  const changes: Change[] = [];
  for (const node of before.nodes) {
    if (!after.nodes.some((other) => other.id === node.id)) changes.push({id: node.id, kind: 'removed', from: pathFor(before, node.id)});
    else if (pathFor(before, node.id) !== pathFor(after, node.id)) changes.push({id: node.id, kind: 'moved', from: pathFor(before, node.id), to: pathFor(after, node.id)});
  }
  for (const node of after.nodes)
    if (!before.nodes.some((other) => other.id === node.id)) changes.push({id: node.id, kind: 'added', to: pathFor(after, node.id)});
  return changes;
}
export function exportProject(input: Project, bundle: ContentBundle): {json: string; text: string} {
  const parsed = projectSchema.parse(input);
  const project = {...parsed, capabilities: [...parsed.capabilities].sort()};
  if (project.contentVersion !== bundle.contentVersion || project.lessonId !== bundle.lesson.id)
    throw new Error('Unsupported content version');
  const variant = getVariant(bundle, project.variantId);
  const text = [
    'Repository Structure Guide — explanatory plan',
    'Not a runnable application. No photo files have been read or modified.',
    `Content: ${bundle.contentVersion} (${bundle.status})`,
    `Lesson: ${bundle.lesson.title}`, `Option: ${variant.title}`, '',
    'Capabilities: ' + (project.capabilities.join(', ') || 'none'),
    'Capability origin: ' + project.capabilityOrigin,
    'Uncertain: ' + (project.uncertain ? 'yes' : 'no'),
    supportsCapabilities(project.capabilities, project.uncertain) ? 'The example fits the selected CLI capability.' : 'This is a nearby CLI example, not a design for the selected capability combination.',
    '', 'Example assumptions:', ...bundle.lesson.assumptions.map((s) => '- ' + s),
    '', 'Still unknown:', ...bundle.lesson.unknowns.map((s) => '- ' + s),
    '', treeText(variant), 'Reasons and alternatives:',
    ...variant.nodes.flatMap((node) => [
      '', pathFor(variant, node.id), node.explanation.summary,
      `Name (${node.explanation.nameKind}): ${node.explanation.nameRule}`,
      `Location (${node.explanation.locationKind}): ${node.explanation.locationRule}`,
      `Contents: ${node.explanation.contents.join(' ')}`,
      `Alternatives: ${node.explanation.alternatives}`,
      `Boundary: ${node.explanation.boundary}`, `Tradeoff: ${node.explanation.tradeoff}`,
      `Counterexample: ${node.explanation.counterexample}`, `Change trigger: ${node.explanation.evolution}`,
      `Claims: ${node.explanation.claimIds.join(', ')}`,
    ]),
    '', 'Claims:', ...bundle.claims.flatMap((claim) => [
      `${claim.id} [${claim.provenance}; ${claim.verification}]: ${claim.statement}`,
      `Scope: ${claim.scope} Sources: ${claim.sourceIds.join(', ') || 'Guide design judgment'}. Checked: ${claim.checkedAt}. Reviewer: ${claim.reviewer}.`,
    ]),
    '', 'Sources:', ...bundle.sources.map((source) => `${source.id}: ${source.title}. ${source.publisher}. ${source.url}\nSection: ${source.section}. ${source.version}. Checked ${source.checkedAt}; review after ${source.reviewAfter}.`),
    '', 'Evidence limitation: the Go experiment is planned and unrun. App tests do not verify Go behavior.',
    'JSON export is a versioned record; this foundation has no restore feature or persistent local save.',
  ].join('\n') + '\n';
  return {json: JSON.stringify(project, null, 2) + '\n', text};
}
