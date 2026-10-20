// Records where each character figure sits inside its 1024x1536 portrait, so the character screen can zoom
// a wide pose (lightsaber, crouch) to fill the stage. Run after adding or changing cast art:
//   node scripts/art-bounds.mjs
// Needs sharp; it uses the copy in ../imgtools (or set SHARP_DIR). Writes lib/art-bounds.json as
// {"cast/<id>.webp":[left, top, right, bottom, bodyLeft, bodyRight]} in fractions of the image. The body columns
// are those where the figure is at least a quarter of its height tall, so lightsabers and outstretched arms don't count.
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
 out['cast/'+f]=[x0/W,y0/H,(x1+1)/W,(y1+1)/H,b0/W,(b1+1)/W].map(v=>Math.round(v*1000)/1000);
}
writeFileSync('lib/art-bounds.json',JSON.stringify(out,null,0).replace(/\],/g,'],\n'));
console.log(Object.keys(out).length,'portraits');
