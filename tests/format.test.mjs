import test from 'node:test';
import assert from 'node:assert/strict';
import {abbrev,exact,unitAt} from '../lib/format.mjs';

test('abbrev: exact with commas under 100,000, then three significant digits and K/M/B/T',()=>{
 assert.equal(abbrev(0),'0');assert.equal(abbrev(999.9),'999');assert.equal(abbrev(23519.74),'23,519');assert.equal(abbrev(99999),'99,999');
 assert.equal(abbrev(100000),'100K');assert.equal(abbrev(123456),'123K');assert.equal(abbrev(1234567),'1.23M');assert.equal(abbrev(45_600_000_000),'45.6B');assert.equal(abbrev(7.89e12),'7.89T');
 assert.equal(abbrev(999_600_000),'1B','rounding carries into the next unit');assert.equal(abbrev(1_000_000),'1M','no trailing zeros');assert.equal(abbrev(-1234567),'-1.23M');assert.equal(abbrev(NaN),'0');
});
test('abbrev: idle-game letters after T, two letters each, so the string never grows',()=>{
 assert.equal(unitAt(5),'aa');assert.equal(unitAt(6),'ab');assert.equal(unitAt(30),'az');assert.equal(unitAt(31),'ba');
 assert.equal(abbrev(1e15),'1aa');assert.equal(abbrev(2.5e21),'2.5ac');assert.equal(abbrev(316_910_179.19e9),'317aa');assert.equal(abbrev(1e18),'1ab');
 for(const e of [5,8,11,14,17,20,30,60,90])assert.ok(abbrev(1.2345*10**e).length<=7,'short at 1e'+e+': '+abbrev(1.2345*10**e));
});
test('exact: every digit with commas up to a quadrillion, then six significant digits with the letters',()=>{
 assert.equal(exact(23519.74),'23,520');assert.equal(exact(316_910_179_190_000),'316,910,179,190,000');
 assert.equal(exact(316_910_179.19e9),'316.91aa');assert.equal(exact(1e18),'1ab');assert.equal(exact(-5),'-5');
});
