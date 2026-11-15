// How Everstead writes numbers. Nothing in the game caps, so gold and Power pass a quadrillion within a
// few laps and `Intl` compact notation runs out of letters at T. Two registers, both here:
//  - abbrev(x): the in-flow register for pills, buttons and stat lines. Exact with commas under 100,000
//    (23,519), then three significant digits and a unit: 123K, 1.23M, 45.6B, 7.89T, then the idle-game
//    letters aa (1e15), ab (1e18), ac ... az, ba ... so the string never grows past about six characters.
//  - exact(x): the audit register for detail dialogs, tooltips and messages. Every digit with commas up
//    to a quadrillion, then the same letters with six significant digits (316.91aa) so a tooltip stays
//    readable instead of showing twenty digits.
const UNITS=['','K','M','B','T'];
export function unitAt(i){if(i<UNITS.length)return UNITS[i];const k=i-UNITS.length;return String.fromCharCode(97+Math.floor(k/26))+String.fromCharCode(97+k%26)}
export function abbrev(x,digits=3,plain=1e5){
 let v=Math.floor(Number(x)||0);if(!isFinite(v))return v>0?'∞':'-∞';const sign=v<0?'-':'';v=Math.abs(v);
 if(v<plain)return sign+v.toLocaleString('en-US');
 let i=0;while(v>=1000){v/=1000;i++}
 let s=Number(v.toPrecision(digits));if(s>=1000){s/=1000;i++}
 return sign+String(s)+unitAt(i);
}
export function exact(x){const v=Math.round(Number(x)||0);return Math.abs(v)<1e15?v.toLocaleString('en-US'):abbrev(v,6)}
