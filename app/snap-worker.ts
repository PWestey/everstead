// The Card Parlour's opponent thinks off the main thread: a hidden-information view goes in, a submission comes out.
import * as E from '@/lib/snap/engine.mjs';
import {AIS} from '@/lib/snap/ai.mjs';
void E;
self.onmessage=(e:MessageEvent)=>{const {id,view,p,ai}=e.data;
 try{const r=(AIS as any)[ai].choose(view,p);(self as any).postMessage({id,r})}catch(err:any){(self as any).postMessage({id,error:String(err?.message||err)})}};
