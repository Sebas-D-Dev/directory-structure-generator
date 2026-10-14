import { z } from 'zod';
import { sourceSchema } from './contracts.ts';
import { validateSegment } from './validate.ts';

const text = z.string().trim().min(1).max(2000);
export const languages = ['Go', 'TypeScript', 'Python', 'Rust', 'PHP', 'HTML & CSS', 'JavaScript', 'Java'] as const;
export const projectTypes = ['CLI', 'Web app', 'Backend API', 'Data analysis', 'Library', 'Static website'] as const;
const reuseSchema = z.strictObject({
  mode: z.literal('reference-only'),
  material: z.literal('No third-party code, prose, tree, artwork or logo reproduced'),
  revision: text,
  sourcePath: text,
  licenseDecision: z.literal('Link and factual reference only; copying requires a separate exact-file license review'),
  notices: z.literal('No third-party material included in this illustration'),
  checkedAt: z.iso.date(), reviewer: text,
});
export const exampleSchema = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9-]+$/), title: text,
  language: z.enum(languages), projectType: z.enum(projectTypes), framework: text,
  purpose: text, tree: z.array(text).min(2).max(12), name: text, nameKind: z.enum(['Tool rule', 'Convention', 'Author choice']),
  reason: text, consequence: text, tradeoff: text,
  fileRoles: z.array(text).min(1).max(12).optional(), assumptions: z.array(text).min(1).max(10).optional(),
  origin: z.literal('Original teaching illustration'), status: z.literal('Illustrative; not a runnable template'),
  sourceIds: z.array(z.string()).min(1),
  reference: z.strictObject({title: text, url: sourceSchema.shape.url, kind: z.enum(['Official example', 'Official template', 'Maintainer template', 'Official documentation']), reuse: reuseSchema}),
});
export const catalogSchema = z.strictObject({
  version: z.literal('2026.10-visual.2'), sources: z.array(sourceSchema).min(1), examples: z.array(exampleSchema).min(1),
});
export type Catalog = z.infer<typeof catalogSchema>;
export type Example = z.infer<typeof exampleSchema>;
export function validateCatalog(input: unknown): Catalog {
  const catalog = catalogSchema.parse(input);
  const sourceIds = new Set(catalog.sources.map((s) => s.id));
  if (sourceIds.size !== catalog.sources.length || new Set(catalog.examples.map((e) => e.id)).size !== catalog.examples.length)
    throw new Error('Duplicate catalog identity');
  for (const source of catalog.sources)
    if (source.reviewAfter < source.checkedAt) throw new Error('Invalid catalog review date');
  for (const example of catalog.examples) {
    if (new Set(example.sourceIds).size !== example.sourceIds.length || example.sourceIds.some((id) => !sourceIds.has(id)))
      throw new Error('Invalid example source references');
  }
  return catalog;
}
export function filterExamples(examples: Example[], language: string, projectType: string): Example[] {
  return examples.filter((e) => (language === 'All' || e.language === language) && (projectType === 'All' || e.projectType === projectType));
}
export type RenameCase = 'entry' | 'test';
export const renameCases = {
  entry: {label: 'An entry file', original: 'main.go', suggested: 'cli.go', kind: 'Convention', command: 'go run .', sourceIds: ['go-code', 'go-files']},
  test: {label: 'A test file', original: 'rename_test.go', suggested: 'rename_checks.go', kind: 'Tool rule', command: 'go test .', sourceIds: ['go-test-command', 'go-files']},
} as const;
export type RenameResult = {valid: boolean; title: string; effect: string; followup: string; tone: 'kept' | 'changed' | 'invalid'};
export function explainRename(kind: RenameCase, name: string): RenameResult {
  const invalid = (effect: string): RenameResult => ({valid: false, title: 'Choose a simple Go filename', effect, followup: 'Try cli.go or rename_checks.go. No files are written.', tone: 'invalid'});
  try { validateSegment(name); } catch { return invalid('Use a single filename, without paths, reserved names or trailing spaces.'); }
  // Keep this teaching model deliberately smaller than Go’s complete build-constraint system.
  if (!/^[a-z][a-z0-9_]*\.go$/.test(name) || name.length > 64)
    return invalid('Use 1–61 lowercase letters, digits or underscores followed by .go, starting with a letter.');
  if (name === 'go.mod' || name === 'rename.go' || (kind === 'entry' && name === 'rename_test.go') || (kind === 'test' && name === 'main.go'))
    return invalid('That name collides with another file in this illustrative tree.');
  if (name === 'cgo.go' || /_(?:aix|android|darwin|dragonfly|freebsd|hurd|illumos|ios|js|linux|nacl|netbsd|openbsd|plan9|solaris|wasip1|windows|zos|386|amd64|amd64p32|arm|arm64|loong64|mips|mips64|mips64le|mipsle|ppc|ppc64|ppc64le|riscv|riscv64|s390|s390x|sparc|sparc64|wasm)(?:_test)?\.go$/.test(name))
    return invalid('Platform-specific and cgo filenames are outside this small model. Choose a platform-neutral filename.');
  const testFile = name.endsWith('_test.go');
  if (kind === 'entry') return testFile
    ? {valid: true, title: 'The command loses its entry file', effect: 'A _test.go file is excluded from a normal package build. In this scenario the only func main is no longer available to go run .', followup: 'Keep executable entry code in a non-test .go file. Test filenames are not ordinary labels.', tone: 'changed'}
    : {valid: true, title: 'The entry point stays the same', effect: 'package main and func main define the entry point. This ordinary filename change does not change go run . in the same package.', followup: 'Update documentation or scripts that explicitly name main.go. Package-based commands and explicit file lists are different.', tone: 'kept'};
  return testFile
    ? {valid: true, title: 'The test file is still discoverable', effect: 'The _test.go suffix keeps this file in Go’s test-file discovery. Test functions still need the correct names and signatures.', followup: 'Update any script or documentation that refers to the old filename. Discovery alone does not prove tests pass.', tone: 'kept'}
    : {valid: true, title: 'The test function is no longer discovered', effect: 'Without _test.go, this becomes ordinary package source. go test . does not discover its TestRename function as a test.', followup: 'This assumes package main and a valid TestRename signature. Other package declarations or imports may also cause build errors; this is not a universal build-success prediction.', tone: 'changed'};
}
