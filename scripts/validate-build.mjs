import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const csp = html.match(/<meta\s+http-equiv="content-security-policy"\s+content="([^"]+)"/i)?.[1]
  .replaceAll('&#39;', "'").replaceAll('&#x27;', "'").replaceAll('&amp;', '&');
assert.ok(csp, 'Static HTML must include the generated CSP');
for (const directive of ["default-src 'self'", "object-src 'none'", "form-action 'none'", "connect-src 'self'"])
  assert.ok(csp.includes(directive), `Missing ${directive}`);
assert.ok(!csp.includes("'unsafe-inline'") && !csp.includes("'unsafe-eval'"), 'Do not weaken script policy');
let inlineScripts = 0;
for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)) {
  if (/\bsrc=/.test(match[1])) continue;
  const hash = createHash('sha256').update(match[2]).digest('base64');
  assert.ok(csp.includes(`'sha256-${hash}'`), 'An inline bootstrap script is missing its CSP hash');
  inlineScripts++;
}
for (const match of html.matchAll(/<(?:script|link|img)\b[^>]*\b(?:src|href)="([^"]+)"/gi))
  assert.ok(!/^(?:https?:)?\/\//i.test(match[1]), 'Unexpected remote asset');
assert.ok(!/<form\b/i.test(html), 'No submission form belongs in this foundation');
const files = readdirSync(new URL('../dist/_astro/', import.meta.url)).filter((file) => file.endsWith('.js'));
const gzipBytes = files.reduce((sum, file) => sum + gzipSync(readFileSync(new URL(`../dist/_astro/${file}`, import.meta.url))).length, 0);
console.log(`Static artifact checks passed: ${inlineScripts} hashed inline scripts; no remote asset URLs or forms.`);
console.log(`All emitted JavaScript gzip total: ${gzipBytes} bytes (artifact size only, not a device-performance result).`);
