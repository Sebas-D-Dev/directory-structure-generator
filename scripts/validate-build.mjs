import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const dist = new URL('../dist/', import.meta.url);
const routes = ['/', '/examples/', '/examples/astro/', '/examples/go/', '/lab/', '/sources/'];
const pages = new Map(readdirSync(dist, {recursive:true}).filter((file) => file.endsWith('.html')).map((file) => [`/${file.replace(/index\.html$/, '')}`, readFileSync(new URL(file, dist), 'utf8')]));
assert.deepEqual([...pages.keys()].sort(), [...routes].sort(), 'Build exactly the planned static routes');
let inlineScripts = 0;
for (const [route, html] of pages) {
  const csp = html.match(/<meta\s+http-equiv="content-security-policy"\s+content="([^"]+)"/i)?.[1]
    .replaceAll('&#39;', "'").replaceAll('&#x27;', "'").replaceAll('&amp;', '&');
  assert.ok(csp, `${route}: static HTML must include the generated CSP`);
  for (const directive of ["default-src 'self'", "object-src 'none'", "form-action 'none'", "connect-src 'self'"])
    assert.ok(csp.includes(directive), `${route}: missing ${directive}`);
  assert.ok(!csp.includes("'unsafe-inline'") && !csp.includes("'unsafe-eval'"), 'Do not weaken script policy');
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc=/.test(match[1])) continue;
    const hash = createHash('sha256').update(match[2]).digest('base64');
    assert.ok(csp.includes(`'sha256-${hash}'`), `${route}: an inline script is missing its CSP hash`);
    inlineScripts++;
  }
  for (const match of html.matchAll(/<(?:script|link|img)\b[^>]*\b(?:src|href)="([^"]+)"/gi)) {
    assert.ok(!/^(?:https?:)?\/\//i.test(match[1]), `${route}: unexpected remote asset`);
    if (match[1].startsWith('/')) assert.ok(existsSync(new URL(match[1].slice(1), dist)), `${route}: missing local asset ${match[1]}`);
  }
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
    if (!/^(?:\/|#)/.test(match[1])) continue;
    const target = new URL(match[1], `https://guide.invalid${route}`);
    assert.equal(target.origin, 'https://guide.invalid', 'Local links must stay local');
    const destination = pages.get(target.pathname);
    assert.ok(destination, `${route}: unknown local route ${target.pathname}`);
    if (target.hash) assert.ok(destination.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${route}: missing target ${target.href}`);
  }
  assert.ok(!/<form\b/i.test(html), 'No submission form belongs in this foundation');
}
const home = pages.get('/');
assert.ok(!home.includes('<astro-island'), 'Landing must not load an interactive learning workspace');
for (const id of ['examples', 'astro-flow', 'rename-lab', 'lesson']) assert.ok(!home.includes(`id="${id}"`), 'Keep deeper tools off the landing');
const files = readdirSync(new URL('_astro/', dist)).filter((file) => file.endsWith('.js'));
const gzipBytes = files.reduce((sum, file) => sum + gzipSync(readFileSync(new URL(`_astro/${file}`, dist))).length, 0);
console.log(`Static artifact checks passed: ${pages.size} routes, ${inlineScripts} hashed inline scripts; local links/assets resolve; no remote assets or forms.`);
console.log(`External JavaScript files gzip total: ${gzipBytes} bytes (artifact size only, not a device-performance result).`);
