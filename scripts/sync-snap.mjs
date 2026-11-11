// Copies the Marvel Snap rules engine and the base card art from the snap-proto checkout into Everstead.
//   node scripts/sync-snap.mjs [path-to-snap-proto]     (default: ~/Documents/snap-proto, or $SNAP_PROTO)
// Engine modules land in lib/snap/ (with VERSION.json naming the source commit); base card and location
// renders in public/assets/snap/ with a trimmed index.json (variants stay out: 420 MB). Re-run after the
// weekly snap-proto update; unchanged files are skipped.
import {readFile,writeFile,copyFile,mkdir,stat,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execSync} from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
const src=path.resolve(process.argv[2]||process.env.SNAP_PROTO||path.join(os.homedir(),'Documents','snap-proto'));
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')),'..');
const ENGINE=['engine.mjs','ai.mjs','calibration.mjs','cards.mjs','cards-series3.mjs','cards-series4.mjs','cards-series5.mjs','locations.mjs','decks.mjs'];
const hash=async f=>{try{return createHash('sha256').update(await readFile(f)).digest('hex')}catch{return null}};
async function sync(from,to){if(await hash(from)===await hash(to))return false;await mkdir(path.dirname(to),{recursive:true});await copyFile(from,to);return true}
let copied=0;
for(const f of ENGINE)if(await sync(path.join(src,f),path.join(root,'lib/snap',f)))copied++;
let commit='unknown';try{commit=execSync('git rev-parse --short HEAD',{cwd:src}).toString().trim()}catch{}
await writeFile(path.join(root,'lib/snap/VERSION.json'),JSON.stringify({commit,synced:new Date().toISOString().slice(0,10),source:'github.com/PWestey/snap-proto'})+'\n');
// Art: base renders only.
const artDir=path.join(src,'art');let art=null;try{art=JSON.parse(await readFile(path.join(artDir,'index.json'),'utf8'))}catch{}
if(art){const index={cards:{},locations:{}};let n=0;
 for(const [id,info] of Object.entries(art.cards)){if(!info.base)continue;try{await stat(path.join(artDir,info.base))}catch{continue}if(await sync(path.join(artDir,info.base),path.join(root,'public/assets/snap',info.base)))n++;index.cards[id]={base:info.base,artist:info.artist||''}}
 for(const [id,info] of Object.entries(art.locations||{})){if(!info.base)continue;try{await stat(path.join(artDir,info.base))}catch{continue}if(await sync(path.join(artDir,info.base),path.join(root,'public/assets/snap',info.base)))n++;index.locations[id]={base:info.base}}
 await writeFile(path.join(root,'public/assets/snap/index.json'),JSON.stringify(index));
 console.log(`art: ${Object.keys(index.cards).length} cards, ${Object.keys(index.locations).length} locations (${n} files copied)`)}
else console.log('art: none found at '+artDir+' (cards will show as text)');
console.log(`engine: ${copied} of ${ENGINE.length} files copied from snap-proto ${commit}`);
