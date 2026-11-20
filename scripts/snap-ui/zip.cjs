// node zip.cjs ls <zip> [regex]            list entries (size, name)
// node zip.cjs x <zip> <outdir> [regex]    extract matching entries (stored or deflated)
const fs=require('fs'),path=require('path'),zlib=require('zlib');
const [mode,file,a3,a4]=process.argv.slice(2);
const fd=fs.openSync(file,'r');const size=fs.fstatSync(fd).size;
const tail=Buffer.alloc(Math.min(size,70000));fs.readSync(fd,tail,0,tail.length,size-tail.length);
const e=tail.lastIndexOf(Buffer.from([0x50,0x4b,0x05,0x06]));let cdSize=tail.readUInt32LE(e+12),cdOff=tail.readUInt32LE(e+16);
if(cdOff===0xffffffff||cdSize===0xffffffff){const l=tail.lastIndexOf(Buffer.from([0x50,0x4b,0x06,0x06]));cdSize=Number(tail.readBigUInt64LE(l+40));cdOff=Number(tail.readBigUInt64LE(l+48))}
const cd=Buffer.alloc(cdSize);fs.readSync(fd,cd,0,cdSize,cdOff);let p=0;const rows=[];
while(p<cd.length&&cd.readUInt32LE(p)===0x02014b50){const method=cd.readUInt16LE(p+10),comp=cd.readUInt32LE(p+20),unc=cd.readUInt32LE(p+24),fn=cd.readUInt16LE(p+28),ex=cd.readUInt16LE(p+30),cm=cd.readUInt16LE(p+32);let off=cd.readUInt32LE(p+42);const name=cd.toString('utf8',p+46,p+46+fn);
 if(off===0xffffffff){let q=p+46+fn;const end=q+ex;while(q<end){const id=cd.readUInt16LE(q),sz=cd.readUInt16LE(q+2);if(id===1){let r=q+4;if(unc===0xffffffff)r+=8;if(comp===0xffffffff)r+=8;off=Number(cd.readBigUInt64LE(r))}q+=4+sz}}
 rows.push({name,method,comp,unc,off});p+=46+fn+ex+cm}
const re=(mode==='ls'?a3:a4)?new RegExp(mode==='ls'?a3:a4,'i'):null;
if(mode==='ls'){for(const r of rows)if(!re||re.test(r.name))console.log(r.unc,r.name);process.exit()}
const out=a3;let n=0;
for(const r of rows){if(re&&!re.test(r.name))continue;if(r.name.endsWith('/'))continue;
 const lh=Buffer.alloc(30);fs.readSync(fd,lh,0,30,r.off);const fn=lh.readUInt16LE(26),ex=lh.readUInt16LE(28);const start=r.off+30+fn+ex;
 const buf=Buffer.alloc(r.comp);fs.readSync(fd,buf,0,r.comp,start);const data=r.method===8?zlib.inflateRawSync(buf):buf;
 const dest=path.join(out,r.name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data);n++}
console.log('extracted',n);
