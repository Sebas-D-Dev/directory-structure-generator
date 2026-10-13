import { createHash } from 'node:crypto';
import { content } from '../src/content/foundation.ts';
import { validateBundle } from '../src/domain/validate.ts';
const validated = validateBundle(content);
console.log(`Valid content ${validated.contentVersion}: ${validated.variants.length} options, ${validated.claims.length} claims, ${validated.sources.length} sources.`);
console.log(`Content SHA-256: ${createHash('sha256').update(JSON.stringify(content)).digest('hex')}`);
console.log('Status: source-reviewed draft. Curriculum experiment: planned and unrun.');
