import CharacterArtwork from './character-artwork';
import {useState} from 'react';
import {ImageIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
export default function CharacterShowcase({person}:any){const [open,setOpen]=useState(false);return <><div className="character-showcase"><CharacterArtwork key={person.id+'-'+(person.art||'')} person={person}/><Button variant="outline" aria-label={'View '+person.name+' artwork'} onClick={()=>setOpen(true)}><ImageIcon aria-hidden="true"/><span>Art</span></Button></div><Dialog open={open} onOpenChange={setOpen}><DialogContent className="save-dialog character-art-view"><DialogTitle>{person.name}</DialogTitle><DialogDescription>{person.title}</DialogDescription><CharacterArtwork key={person.id+'-large'} person={person} large/></DialogContent></Dialog></>}
