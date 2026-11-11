import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,act,valid,migrate,snapGold,SNAP_GOLD,SNAP_DECK,TITLES,titlesEarned} from '../lib/game.mjs';
import {goldUnit} from '../lib/modes.mjs';
import {CARDS,POOL_IDS} from '../lib/snap/cards.mjs';
import * as E from '../lib/snap/engine.mjs';
import {AIS} from '../lib/snap/ai.mjs';
import {DECKS} from '../lib/snap/decks.mjs';
const T=Date.UTC(2026,0,10,12);

/** A whole match through the copied engine, both seats played by an AI tier. */
function play(a,b,seed,deckA='kazoo',deckB='destroy'){let s=E.startTurn(E.createGame({decks:[DECKS[deckA],DECKS[deckB]],seed}));
 while(!s.over){const subs=[a,b].map((ai,p)=>{const r=AIS[ai].choose(E.viewFor(s,p),p);return {plays:r.plays,moves:r.moves||[],activates:r.activates||[],action:r.action}});s=E.resolveTurn(s,subs);if(!s.over)s=E.startTurn(s)}return s}

test('the synced Snap engine plays a match to the end, and every deck is 12 real cards',()=>{
 for(const [name,ids] of Object.entries(DECKS)){assert.equal(ids.length,SNAP_DECK,name);assert.ok(ids.every(id=>CARDS[id]&&!CARDS[id].token),name)}
 assert.ok(POOL_IDS.length>=500,'the whole pool is here');
 for(const seed of [1,2,3]){const s=play('greedy','greedy',seed);assert.ok(s.over&&s.result);assert.ok(Math.abs(E.cubesFor(s,0))<=8);assert.equal(E.cubesFor(s,0),-E.cubesFor(s,1))}
 const s=play('lookahead','greedy',11,'ongoing','move');assert.ok(s.over)});

test('a won match pays gold per cube at SNAP_GOLD of the gold unit; losses cost nothing but go on the ledger',()=>{
 let s=fresh(T);const u=goldUnit(s);assert.equal(snapGold(s,4),Math.round(u*SNAP_GOLD*4));assert.equal(snapGold(s,-2),0);
 const w=act(s,'snapResult',T,null,{cubes:4});assert.ok(!w.error);assert.equal(w.state.gold,s.gold+snapGold(s,4));assert.equal(w.gold,snapGold(s,4));
 assert.deepEqual(w.state.snap,{decks:{},cubes:4,played:1,won:1,best:4});
 const l=act(w.state,'snapResult',T,null,{cubes:-2});assert.equal(l.state.gold,w.state.gold);assert.deepEqual(l.state.snap,{decks:{},cubes:2,played:2,won:1,best:4});
 assert.ok(valid(l.state));const old={...fresh(T)};delete old.snap;assert.ok(valid(migrate(old)),'old saves get a fresh ledger');assert.deepEqual(migrate(old).snap,{decks:{},cubes:0,played:0,won:0,best:0})});

test('decks are saved by name, must be 12 different cards, and can be forgotten',()=>{
 const s=fresh(T),ids=DECKS.kazoo;const ok=act(s,'snapDeckSave',T,'Mine',ids);assert.ok(!ok.error);assert.deepEqual(ok.state.snap.decks,{Mine:ids});assert.ok(valid(ok.state));
 assert.ok(act(s,'snapDeckSave',T,'',ids).error);assert.ok(act(s,'snapDeckSave',T,'Short',ids.slice(0,11)).error);assert.ok(act(s,'snapDeckSave',T,'Dupes',[...ids.slice(0,11),ids[0]]).error);
 const gone=act(ok.state,'snapDeckDelete',T,'Mine');assert.deepEqual(gone.state.snap.decks,{});assert.ok(act(s,'snapDeckDelete',T,'Mine').error);
 assert.ok(!valid({...s,snap:{...s.snap,decks:{Mine:ids.slice(0,3)}}}),'a short deck fails the save check')});

test('Cardsharp is earned at 100 cubes',()=>{
 const s=fresh(T);assert.ok(!titlesEarned(s).some(t=>t.id==='cardsharp'));assert.ok(titlesEarned({...s,snap:{...s.snap,cubes:100}}).some(t=>t.id==='cardsharp'));assert.ok(TITLES.some(t=>t.id==='cardsharp'))});
