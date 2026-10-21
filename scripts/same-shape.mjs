// Checks that a rewritten content file changed only its prose: node scripts/same-shape.mjs <file>
// Compares the file's exports with the committed version (git HEAD). Object keys, array lengths, numbers, booleans and
// every string WITHOUT a space (ids, speaker ids, backdrops, flags, quest ids) must be identical. Strings with a space
// (dialogue, narration, titles, descriptions) may change. Prints the differences; exits 1 if there are any.
import {execFileSync} from 'node:child_process';
import {writeFileSync,unlinkSync} from 'node:fs';
import {dirname,basename,join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const file=process.argv[2];if(!file){console.error('usage: node scripts/same-shape.mjs <file>');process.exit(2)}
const head=execFileSync('git',['show','HEAD:'+file.replace(/\\/g,'/')],{encoding:'utf8'});
const tmp=join(dirname(file),'.head-'+basename(file));writeFileSync(tmp,head);
let before,after;
try{before=await import(pathToFileURL(resolve(tmp)).href);after=await import(pathToFileURL(resolve(file)).href+'?now='+Date.now())}finally{unlinkSync(tmp)}
const errs=[];
function cmp(a,b,path){
 if(typeof a!==typeof b||Array.isArray(a)!==Array.isArray(b)||(a===null)!==(b===null))return errs.push(path+': type changed');
 if(typeof a==='string'){if(!a.includes(' ')||!b.includes(' ')){if(a!==b)errs.push(`${path}: "${a}" → "${b}" (ids and keys must not change)`)}return}
 if(typeof a!=='object'||a===null){if(a!==b)errs.push(`${path}: ${a} → ${b}`);return}
 if(Array.isArray(a)){if(a.length!==b.length)errs.push(`${path}: ${a.length} items → ${b.length} (keep the same number of lines and options)`);for(let i=0;i<Math.min(a.length,b.length);i++)cmp(a[i],b[i],path+'['+i+']');return}
 const ka=Object.keys(a).sort().join(','),kb=Object.keys(b).sort().join(',');if(ka!==kb)errs.push(`${path}: keys {${ka}} → {${kb}}`);
 for(const k of Object.keys(a))if(k in b)cmp(a[k],b[k],path+'.'+k);
}
for(const k of Object.keys(before))if(typeof before[k]!=='function')cmp(before[k],after[k],k);
if(errs.length){console.log(errs.slice(0,60).join('\n')+(errs.length>60?`\n…and ${errs.length-60} more`:''));process.exit(1)}else console.log('Same shape: OK');
