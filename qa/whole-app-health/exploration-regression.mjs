import fs from 'node:fs';
// Freeze wall time only for the existing exact-cost assertions: passive Gold now
// changes the wallet between user actions. Live accrual is tested separately.
let source=fs.readFileSync(new URL('./browser.mjs',import.meta.url),'utf8');
source=source.replaceAll("from '/Users/","from 'file:///Users/");
source=source.replace('const page=await context.newPage(),errors=[];','await context.addInitScript(()=>{Date.now=()=>1815000000000});const page=await context.newPage(),errors=[];');
try{await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))}catch(error){console.error(error.message);process.exitCode=1}
