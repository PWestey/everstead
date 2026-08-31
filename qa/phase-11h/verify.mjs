import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {existsSync,readFileSync,statSync} from 'node:fs';
import {basename,resolve} from 'node:path';
import {inflateSync} from 'node:zlib';
import vm from 'node:vm';

const ROOT=resolve(new URL('../..',import.meta.url).pathname),NODE=process.execPath;
const read=path=>readFileSync(resolve(ROOT,path)),sha=value=>createHash('sha256').update(value).digest('hex');
const rows=[],record=(id,pass,detail='')=>rows.push({id,pass:Boolean(pass),detail:typeof detail==='string'?detail:JSON.stringify(detail)});
const artifact=read('index.html'),html=artifact.toString('utf8'),application=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
const cutoutNames=['kaladin','tavi','grog','saradomin','geralt','xaden','zamorak','darrow','star-lord'];
const originalPortraitHashes={
  'anakin.webp':'39be9726cc338765230d18f31b33753f6e48cfccd53a426796e92ff2b7dff803',
  'captain-america.webp':'42f43b61eed8651ea25748e6a93768c33c3b75469a470e8ec273be8368bd3c61',
  'daredevil.webp':'683babcc8471bd1dc69d3445279bc839f58f63a7d245ddb404dd5e4951930752',
  'darrow.webp':'c6c296c19add0fb602527af6691f9b1764d08e0d67d1bb7547e19807ef9eed05',
  'deadpool.webp':'fc361ea2a377f8cb230ba9ea3c9421c6abfa9c1e8cb6659b911fd9c2ed655db2',
  'geralt.webp':'e4fdfe155aca233011583298c542c89de96dba57776d6c1a2fde0582a4835d68',
  'grog.webp':'73fa1809a2f779b090e992be5ecf84b51a0f9ddc9ef8aa520aef355f112e644d',
  'iron-man.webp':'7e3bde80d86fda9a9a9c61e9e48dd4b2171cefb8623d3f9e2ca78309bb73a756',
  'kaladin.webp':'f7654c6955eb9dda03101a309e671834269a74be250c745737e0deb18bad644a',
  'obi-wan.webp':'dc6288321fdffc9866812b2bd4e9b17ced3d9a3e4139d2d5c9c741f43d5f54b5',
  'saradomin.webp':'56bbc88cf90b382babbc77a6fe49c1a535cc06c4f50e7921fe2dbdec5ddca383',
  'spider-man.webp':'d9fd22ca6e265fb32b3ea4106c621be37f9f53e9f3796988a5f9a7a1362505ce',
  'star-lord.webp':'8248e194258555ecf0136776af05dfb8c210eddb8942bf1179bbe881f60e761b',
  'tavi.webp':'9ff00826073c135c801e1141f581341ded70e61556b66a4b44c8838269a30f06',
  'thor.webp':'56654e5d4fc3c89173a26fe9134eb00d78d3ce27eb337275971f8685d2a7cb54',
  'wolverine.webp':'6a5f07d540372cfdf8cb4bb7b45ccc5ed5cf28064a483eb975c2d327b48d798b',
  'xaden.webp':'ff3e07c7e50bd3b083f2a7b7903a6479fce0ace38e65acbb4f339405a731c92a',
  'zamorak.webp':'277ab7a6c000c66822b7b4b889037e4b7a54eadc54574f8f80a1a2c56b742ad7'
};

function paeth(a,b,c){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c}
function pngAlphaSummary(path){
  const buffer=read(path),signature=buffer.subarray(0,8).toString('hex');
  if(signature!=='89504e470d0a1a0a')throw new Error('not PNG');
  let offset=8,ihdr=null;const idat=[];
  while(offset<buffer.length){const length=buffer.readUInt32BE(offset),type=buffer.subarray(offset+4,offset+8).toString('ascii'),data=buffer.subarray(offset+8,offset+8+length);offset+=12+length;if(type==='IHDR')ihdr=data;if(type==='IDAT')idat.push(data);if(type==='IEND')break}
  if(!ihdr)throw new Error('missing IHDR');
  const width=ihdr.readUInt32BE(0),height=ihdr.readUInt32BE(4),bitDepth=ihdr[8],colorType=ihdr[9],interlace=ihdr[12];
  if(bitDepth!==8||colorType!==6||interlace!==0)throw new Error(`unsupported PNG ${bitDepth}/${colorType}/${interlace}`);
  const bpp=4,stride=width*bpp,inflated=inflateSync(Buffer.concat(idat)),previous=Buffer.alloc(stride),current=Buffer.alloc(stride);let cursor=0,transparent=0,visible=0,alphaMax=0;
  for(let y=0;y<height;y++){
    const filter=inflated[cursor++];
    for(let x=0;x<stride;x++){
      const raw=inflated[cursor++],left=x>=bpp?current[x-bpp]:0,up=previous[x],upperLeft=x>=bpp?previous[x-bpp]:0;
      current[x]=(raw+(filter===0?0:filter===1?left:filter===2?up:filter===3?Math.floor((left+up)/2):filter===4?paeth(left,up,upperLeft):(()=>{throw new Error(`filter ${filter}`)})()))&255;
    }
    for(let x=3;x<stride;x+=4){const alpha=current[x];if(alpha===0)transparent++;if(alpha>=128)visible++;if(alpha>alphaMax)alphaMax=alpha}
    current.copy(previous);
  }
  const pixels=width*height;return{width,height,bitDepth,colorType,interlace,bytes:buffer.length,transparent,visible,alphaMax,transparentRatio:transparent/pixels,visibleRatio:visible/pixels};
}

record('application-script-present',Boolean(application));
try{new vm.Script(application);record('application-script-syntax',true)}catch(error){record('application-script-syntax',false,error.message)}
record('release-identity',html.includes("RELEASE_VERSION='1.0.0-rc.3'")&&html.includes("VERSION='0.1.0'")&&html.includes("NS='oathforge_new_world_proto_v01'"));
record('schema-twelve-preserved',html.includes('CURRENT_SCHEMA_VERSION=12')&&!html.includes('CURRENT_SCHEMA_VERSION=13'));
record('phase11h-contract-source',html.includes("VILLAGE_CUTOUT_CONFIG_ID='phase-11h-village-cutout-speakers-v1'")&&html.includes('VILLAGE_CUTOUT_ART=new Set'));
record('village-uses-dedicated-cutout',html.includes('<div class="village-character">${villageCutout(ff)}')&&!html.includes('<div class="village-character">${atlas(\'fellow\',ff.idx,\'figure\')}'));
record('profile-keeps-full-art',html.includes("openFellow(id){const f=fellow(id)")&&html.includes("<div class=\"profile-stage\">${atlas('fellow',f.idx,'figure')}"));
record('rotation-filters-to-cutout-ready-joined-fellows',html.includes('const candidates=villageSpeakerDefs(S).map')&&html.includes('phaseElevenGFellowAvailable(def.id,state)'));
record('save-neutral-presentation',!html.includes("CURRENT_TRANSACTION_SOURCES.add('village-cutout")&&!html.includes('schemaVersion=13'));
record('quote-bubble-mobile-fix',html.includes('.speech{position:absolute;right:calc(50% + 4px)'));
record('external-art-preserved',!/data:image\/(?:png|jpe?g|webp);base64,/i.test(html));
record('artifact-under-two-megabytes',artifact.length<2*1024*1024,artifact.length);

let cutoutBytes=0;
for(const name of cutoutNames){
  const path=`assets/portraits/fellows/village/${name}.png`;
  record(`cutout-exists-${name}`,existsSync(resolve(ROOT,path)));
  if(!existsSync(resolve(ROOT,path)))continue;
  try{const summary=pngAlphaSummary(path);cutoutBytes+=summary.bytes;record(`cutout-rgba-${name}`,summary.colorType===6&&summary.bitDepth===8&&summary.interlace===0,summary);record(`cutout-transparent-${name}`,summary.transparentRatio>.05&&summary.visibleRatio>.05&&summary.alphaMax>=254,summary);record(`cutout-resolution-${name}`,summary.width>=900&&summary.height>=1200&&summary.bytes<3*1024*1024,summary)}catch(error){record(`cutout-rgba-${name}`,false,error.message)}
}
record('cutout-library-bounded',cutoutBytes>0&&cutoutBytes<20*1024*1024,cutoutBytes);

for(const [name,expected] of Object.entries(originalPortraitHashes)){const path=`assets/portraits/fellows/${name}`;record(`original-portrait-${name}`,existsSync(resolve(ROOT,path))&&sha(read(path))===expected,existsSync(resolve(ROOT,path))?sha(read(path)):'missing')}
for(const path of ['docs/PHASE_11H_DIALOGUE_CUTOUT_CONTRACT.md','docs/PHASE_11H_RESULT.md','qa/phase-11h/current-manifest.json','README.md'])record(`document-${path}`,existsSync(resolve(ROOT,path)));
const readme=read('README.md').toString('utf8');
record('readme-current',readme.includes('schema-12')&&readme.includes('Phase 11H')&&readme.includes('assets/portraits/fellows/village/'));

const probe=spawnSync(NODE,['qa/phase-11g/probe.mjs'],{cwd:ROOT,encoding:'utf8',maxBuffer:256*1024*1024}),summary=(probe.stdout||'').trim().split('\n').at(-1)||'',failures=(probe.stdout||'').split('\n').filter(line=>line.startsWith('FAIL '));
record('phase11g-focused',probe.status===0&&summary==='Phase 11G focused probe: 28/28'&&failures.length===0,{status:probe.status,summary,failures:failures.slice(0,30),stderr:(probe.stderr||'').trim().slice(-3000)});

let manifest=null;try{manifest=JSON.parse(read('qa/phase-11h/current-manifest.json').toString('utf8'))}catch{}
const expectedPassedBeforeManifest=rows.length,expectedTotal=expectedPassedBeforeManifest+1;
record('manifest-current',manifest?.phase==='11H'&&manifest?.status==='PASS_LOCAL'&&manifest?.schemaVersion===12&&manifest?.releaseVersion==='1.0.0-rc.3'&&manifest?.artifact?.sha256===sha(artifact)&&manifest?.artifact?.byteLength===artifact.length&&manifest?.artifact?.embeddedRasterCount===0&&manifest?.cutouts?.count===cutoutNames.length&&manifest?.cutouts?.totalBytes===cutoutBytes&&manifest?.cutouts?.allRgba===true&&manifest?.cutouts?.allTransparent===true&&manifest?.focusedProbe?.passed===28&&manifest?.focusedProbe?.failed===0&&manifest?.successorGate?.passed===expectedTotal&&manifest?.successorGate?.failed===0,manifest);

const passed=rows.filter(row=>row.pass).length,failed=rows.length-passed,result={phase:'11H',status:failed?'FAIL':'PASS',artifact:{sha256:sha(artifact),byteLength:artifact.length},cutouts:{count:cutoutNames.length,totalBytes:cutoutBytes},focused:summary,total:rows.length,passed,failed,rows};
console.log(JSON.stringify(result,null,2));
if(failed)process.exitCode=1;
