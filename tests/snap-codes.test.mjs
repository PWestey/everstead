import test from 'node:test';
import assert from 'node:assert/strict';
import {encodeDeck,decodeDeck,hasKeyword,sortIds,curve,KEYWORDS} from '../lib/snap-codes.mjs';
import {CARDS} from '../lib/snap/cards.mjs';
import {META_DECKS} from '../lib/snap-decks.mjs';

test('deck codes round-trip in the game’s format and read names, ids or bare JSON',()=>{
 const ids=Object.values(META_DECKS)[0].ids;
 const code=encodeDeck(ids);
 assert.equal(JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(code),c=>c.charCodeAt(0)))).Cards[0].CardDefId,ids[0]);
 assert.deepEqual(decodeDeck(code),{ids,unknown:[]});
 assert.deepEqual(decodeDeck(' '+code+'\n'),{ids,unknown:[]},'whitespace around a code is fine');
 assert.deepEqual(decodeDeck(JSON.stringify({Cards:ids.map(id=>({CardDefId:id}))})).ids,ids);
 const r=decodeDeck('Mister Sinister, iron man\nMRSINISTER; Nobody At All');
 assert.deepEqual(r,{ids:['MrSinister','IronMan'],unknown:['Nobody At All']},'names match by id or name, case and punctuation ignored, no duplicates');
 assert.deepEqual(decodeDeck(''),{ids:[],unknown:[]});
});
test('keyword filter reads the card text, and Skill / No ability read the card',()=>{
 assert.ok(hasKeyword(CARDS.IronMan,'ongoing'));assert.ok(!hasKeyword(CARDS.IronMan,'onreveal'));
 assert.ok(hasKeyword(CARDS.Hulk,'vanilla'));assert.ok(!hasKeyword(CARDS.Hulk,'skill'));
 assert.ok(hasKeyword(CARDS.IronMan,''),'no keyword means everything');
 for(const [k] of KEYWORDS)assert.ok(Object.values(CARDS).some(d=>!d.token&&hasKeyword(d,k)),k+' matches at least one card');
});
test('sorts and the energy curve',()=>{
 const ids=['Hulk','IronMan','MrSinister','Wasp'];
 assert.deepEqual(sortIds(ids,'cost'),['Wasp','MrSinister','IronMan','Hulk']);
 assert.deepEqual(sortIds(ids,'name'),['Hulk','IronMan','MrSinister','Wasp']);
 assert.equal(sortIds(ids,'power')[0],'Hulk');
 assert.deepEqual(sortIds(ids,'tier',{Hulk:5,Wasp:1})[0],'Wasp');
 const c=curve(ids);assert.deepEqual(c.counts,[1,0,1,0,0,1,1]);assert.equal(c.avg,(0+5+2+6)/4);
 assert.deepEqual(curve([]),{counts:[0,0,0,0,0,0,0],avg:0});
});
