/** Known links from the earlier single-page guide. Never accept arbitrary redirect targets. */
export const legacySections: Readonly<Record<string, string>> = {
  examples: '/examples/#examples',
  'astro-flow': '/examples/astro/#astro-flow',
  'rename-lab': '/lab/#rename-lab',
  'project-types': '/examples/go/#project-types',
  lesson: '/examples/go/#lesson',
  compare: '/examples/go/#compare',
  inspector: '/examples/go/#inspector',
  'export-heading': '/examples/go/#export-heading',
  sources: '/sources/#sources',
};
export function legacyDestination(hash: string): string | undefined {
  let section: string;
  try { section = decodeURIComponent(hash.replace(/^#/, '')); } catch { return undefined; }
  return Object.hasOwn(legacySections, section) ? legacySections[section] : undefined;
}
