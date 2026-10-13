import { bundleSchema, type ContentBundle, type Variant } from './contracts.ts';

export function validateSegment(name: string): void {
  if (name !== name.normalize('NFC') || name.length > 255 || !name || name === '.' || name === '..'
    || /[\\/:\x00-\x1f\x7f<>"|?*]/.test(name) || /[. ]$/.test(name)
    || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name)) {
    throw new Error(`Unsafe or non-normalized node name: ${JSON.stringify(name)}`);
  }
}
function unique(values: string[], label: string): void {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}`);
}
export function validateTree(variant: Variant): void {
  unique(variant.nodes.map((n) => n.id), 'node ID');
  const index = new Map(variant.nodes.map((n) => [n.id, n]));
  const roots = variant.nodes.filter((n) => n.parentId === null);
  if (roots.length !== 1 || roots[0]?.id !== variant.rootNodeId || roots[0]?.kind !== 'directory')
    throw new Error('Exactly one directory root is required');
  const siblingKeys: string[] = [];
  for (const node of variant.nodes) {
    validateSegment(node.name);
    siblingKeys.push(`${node.parentId ?? ''}/${node.name.toLowerCase()}`);
    const seen = new Set<string>();
    let cursor = node;
    while (true) {
      if (seen.has(cursor.id)) throw new Error('Cyclic tree');
      seen.add(cursor.id);
      if (seen.size > 20) throw new Error('Tree exceeds maximum depth');
      if (cursor.parentId === null) break;
      const parent = index.get(cursor.parentId);
      if (!parent || parent.kind !== 'directory') throw new Error('Missing or non-directory parent');
      cursor = parent;
    }
  }
  unique(siblingKeys, 'case-insensitive sibling path');
}
export function validateBundle(input: unknown): ContentBundle {
  const bundle = bundleSchema.parse(input);
  unique(bundle.sources.map((s) => s.id), 'source ID');
  unique(bundle.claims.map((c) => c.id), 'claim ID');
  unique(bundle.variants.map((v) => v.id), 'variant ID');
  const sources = new Set(bundle.sources.map((s) => s.id));
  const claims = new Set(bundle.claims.map((c) => c.id));
  const variants = new Set(bundle.variants.map((v) => v.id));
  for (const source of bundle.sources)
    if (source.reviewAfter < source.checkedAt) throw new Error('Source review date precedes check');
  for (const claim of bundle.claims)
    for (const ref of claim.sourceIds) if (!sources.has(ref)) throw new Error(`Dangling source ${ref}`);
  unique(bundle.lesson.variantIds, 'lesson variant ID');
  for (const ref of bundle.lesson.variantIds)
    if (!variants.has(ref)) throw new Error(`Dangling variant ${ref}`);
  for (const variant of bundle.variants) {
    validateTree(variant);
    for (const node of variant.nodes)
      for (const ref of node.explanation.claimIds) if (!claims.has(ref)) throw new Error(`Dangling claim ${ref}`);
  }
  return bundle;
}
