import fs from 'node:fs';
import assert from 'node:assert/strict';

// Reuse the frozen C1 mobile journey. Rebuilding roster/profile after a spend
// legitimately requests the SAME missing private portraits again. Retain its
// exact path allowlist, all error counts, and every behavioral assertion.
const original=new URL('../phase-24l-c1/browser.mjs',import.meta.url);
let source=fs.readFileSync(original,'utf8');
const once='privateResponses.length===privatePaths.size&&';
assert.equal(source.split(once).length,2,'one frozen request uniqueness assertion');
source=source.replace(once,'privateResponses.length>=privatePaths.size&&');
source=source.replaceAll('import.meta.url',JSON.stringify(original.href));
source=source.replace(/from '([^']+)'/g,(match,specifier)=>specifier.startsWith('.')||specifier.startsWith('/')?`from '${new URL(specifier,original).href}'`:match);
process.env.PHASE24L_C1_SINGLE='ui';
await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
