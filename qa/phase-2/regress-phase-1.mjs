import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot=resolve(new URL('../..',import.meta.url).pathname);
let source=readFileSync(resolve(repoRoot,'qa/phase-1/verify.mjs'),'utf8');
source=source.replace(/const qaRoot =[^\n]+\nconst repoRoot =[^\n]+/,`const qaRoot=${JSON.stringify(resolve(repoRoot,'qa/phase-1'))};\nconst repoRoot=${JSON.stringify(repoRoot)};`);
source=source.replaceAll('value?.schemaVersion === 2','value?.schemaVersion === 3');

const expectedSupersessions=new Map([
  ['artifact-sha256','phase2-artifact-sha256'],
  ['artifact-byte-length','phase2-artifact-byte-length'],
  ['schema-2-static','schema-3-static'],
  ['backup-v1-static','v2-checkpoint-static'],
  ['fresh-schema-2','fresh-schema-3'],
  ['v1-migration-schema-2','schema1-migrates-to-3'],
  ['legacy-migration-receipts','legacy-receipt-order'],
  ['pre-v2-only-backup-recovers','missing-active-v1-third'],
  ['legacy-interrupted-t2-recovers','phase2-staging-later-clock-recovers'],
  ['lineaged-pre-v2-recovery-candidate-current','missing-active-v1-third'],
  ['interrupted-staging-recovered','phase2-staging-later-clock-recovers'],
  ['schema-2-safe-recovery','corrupt-unattested-schema2-staging-not-used']
]);
const phaseTwoVerifier=readFileSync(resolve(repoRoot,'qa/phase-2/verify.mjs'),'utf8');
const captured=[];
const originalLog=console.log;
const originalExitCode=process.exitCode;
console.log=(...args)=>captured.push(args.join(' '));
try{await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))}finally{console.log=originalLog;process.exitCode=originalExitCode}
const failures=captured.filter(line=>line.startsWith('FAIL ')).map(line=>line.slice(5).split(' :: ')[0]);
const unexpected=failures.filter(id=>!expectedSupersessions.has(id));
const missingReplacements=[...new Set(failures)].filter(id=>!phaseTwoVerifier.includes(`'${expectedSupersessions.get(id)}'`)&&!phaseTwoVerifier.includes('`'+expectedSupersessions.get(id)+'`'));
for(const id of failures)originalLog(`EXPECTED_SUPERSESSION ${id} -> ${expectedSupersessions.get(id)}`);
if(unexpected.length)originalLog('UNEXPECTED_FAILURES '+unexpected.join(','));
if(missingReplacements.length)originalLog('MISSING_REPLACEMENTS '+missingReplacements.join(','));
const semanticPasses=captured.filter(line=>line.startsWith('PASS ')).length;
originalLog(`${semanticPasses} inherited Phase 1 assertions passed; ${failures.length} expected supersessions; ${unexpected.length} unexpected failures; ${missingReplacements.length} missing replacements`);
if(unexpected.length||missingReplacements.length)process.exitCode=1;
