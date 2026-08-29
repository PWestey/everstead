import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','..');
const read=path=>readFileSync(resolve(root,path));
const hash=value=>createHash('sha256').update(value).digest('hex');
const frozen=JSON.parse(read('qa/phase-10b/phase10a-successor-hashes.json'));

if(frozen.manifestVersion!==1||frozen.phase!=='10B-1'||frozen.sourcePhase!=='10A'||frozen.historicalRows!==188||frozen.phaseTenAOwnedRows!==15||frozen.rowCount!==203||Object.keys(frozen.files).length!==203){
  throw new Error('Frozen Phase 10A successor registry is invalid');
}

const rows=Object.entries(frozen.files).map(([path,expected])=>{
  let actual=null,error='';
  try{actual=hash(read(path))}catch(reason){error=String(reason.message||reason)}
  return{id:`successor-${path}`,pass:actual===expected,detail:error||actual};
});

if(rows.length!==203||new Set(rows.map(row=>row.id)).size!==203)throw new Error('Phase 10A successor row registry must contain exactly 203 unique file rows');
const failures=rows.filter(row=>!row.pass);
console.log(JSON.stringify({total:rows.length,passed:rows.length-failures.length,failed:failures.length,failures},null,2));
if(failures.length)process.exitCode=1;
