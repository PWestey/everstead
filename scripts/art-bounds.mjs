// Records where each character figure sits inside its 1024x1536 portrait, so the character screen can zoom
// a wide pose (lightsaber, crouch) to fill the stage. Run after adding or changing cast art:
//   node scripts/art-bounds.mjs
// Needs sharp; it uses the copy in ../imgtools (or set SHARP_DIR). Writes lib/art-bounds.json as
// {"cast/<id>.webp":[left, top, right, bottom, bodyLeft, bodyRight, headX, headTop]} in fractions of the image.
// Body columns: where the figure is at least a quarter of its height tall, so lightsabers and arms don't count.
// Head: the first row (from the top) with a solid run wider than 5% of the image (a lightsaber is ~1.5%), and the
// middle of the wide runs just below it. Cards and small portraits frame on the head.
import {createRequire} from 'node:module';
import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const sharp=require((process.env.SHARP_DIR||new URL('../../imgtools/node_modules/sharp',import.meta.url).pathname.replace(/^\/(\w:)/,'$1')));
const out={};
for(const f of readdirSync('public/assets/cast').filter(x=>x.endsWith('.webp')).sort()){
 const {data,info}=await sharp(readFileSync('public/assets/cast/'+f)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const W=info.width,H=info.height;let x0=W,y0=H,x1=0,y1=0;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(data[(y*W+x)*4+3]>24){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
 const col=new Array(W).fill(0);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(data[(y*W+x)*4+3]>24)col[x]++;
 const need=(y1-y0)*0.25;let b0=x0,b1=x1;while(b0<x1&&col[b0]<need)b0++;while(b1>b0&&col[b1]<need)b1--;
 // Search only the middle half of the body columns, so a raised hammer or staff off to one side isn't taken for the head.
 const m0=Math.round(b0+(b1-b0)*0.25),m1=Math.round(b1-(b1-b0)*0.25);
 const runs=y=>{const out=[];let s=-1;for(let x=m0;x<=m1+1;x++){const on=x<=m1&&data[(y*W+x)*4+3]>200;if(on&&s<0)s=x;if(!on&&s>=0){out.push([s,x]);s=-1}}return out};
 const minRun=W*0.04;let headTop=y0;while(headTop<y1&&!runs(headTop).some(([a,z])=>z-a>=minRun))headTop++;
 let hs=0,hn=0;for(let y=headTop;y<Math.min(y1,headTop+H*0.04);y++)for(const [a,z] of runs(y))if(z-a>=minRun){hs+=(a+z)/2*(z-a);hn+=z-a}
 const hx=hn?hs/hn:(b0+b1)/2;
 out['cast/'+f]=[x0/W,y0/H,(x1+1)/W,(y1+1)/H,b0/W,(b1+1)/W,hx/W,headTop/H].map(v=>Math.round(v*1000)/1000);
}
writeFileSync('lib/art-bounds.json',JSON.stringify(out,null,0).replace(/\],/g,'],\n'));
console.log(Object.keys(out).length,'portraits');
