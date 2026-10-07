import {sharePayload,shareCardSvg} from './share-card.js';
import {download} from './ui.js';

async function pngFile(svg){
 const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
 try {
  const image=new Image();image.src=url;await image.decode();
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
  const context=canvas.getContext('2d');if(!context)throw new Error('Canvas unavailable');
  context.drawImage(image,0,0);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob)throw new Error('PNG unavailable');
  return new File([blob],'mein-duedingen-check.png',{type:'image/png'});
 }finally{URL.revokeObjectURL(url);}
}

// Prepare files before the click to preserve native share's user activation.
export function mountSharing(element,data,result){
 const toggle=element.querySelector('#include-results');
 const preview=element.querySelector('#share-preview');
 const status=element.querySelector('#share-status');
 const save=element.querySelector('[data-share-action="save"]');
 const native=element.querySelector('[data-share-action="native"]');
 const copy=element.querySelector('[data-share-action="copy"]');
 const fallback=element.querySelector('#share-copy-fallback');
 let file=null,previewUrl=null,sequence=0,alive=true,payload;
 const plain=()=>`${payload.text}\n\n${payload.url}`;
 function refresh(){
  const request=++sequence,personal=toggle.checked;file=null;save.disabled=true;status.textContent='';fallback.hidden=true;
  payload=sharePayload(data,result,personal);
  element.querySelector('#share-caption').textContent=plain();
  element.querySelector('#share-privacy').textContent=personal?'Du teilst deine Listen-Ratings mit Belegbasis. Einzelantworten bleiben bei dir.':'Du teilst eine Einladung zum Check. Deine Resultate und Antworten bleiben bei dir.';
  preview.alt=personal?'Vorschau deiner Ergebniskarte mit allen Listen, Passung und Belegbasis':'Einladung zum Düdingen-Check: Deine Gemeinde. Deine Haltung. Deine Wahl.';
  const svg=shareCardSvg(data,result,personal);
  if(previewUrl)URL.revokeObjectURL(previewUrl);
  previewUrl=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));preview.src=previewUrl;
  pngFile(svg).then(value=>{if(alive&&request===sequence){file=value;save.disabled=false;}}).catch(()=>{if(alive&&request===sequence)status.textContent='Die Bildkarte konnte nicht erstellt werden. Die Einladung kannst du weiterhin als Text mit Link teilen.';});
 }
 toggle.addEventListener('change',refresh);
 if(!navigator.share)native.textContent='Einladung kopieren';
 async function copyText(){
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(plain());if(alive)status.textContent='Text und Link kopiert. Du kannst sie jetzt in deine Nachricht einfügen.';}
  catch{if(alive){fallback.hidden=false;fallback.value=plain();fallback.focus();fallback.select();status.textContent='Kopiere den markierten Text und füge ihn in deine Nachricht ein.';}}
 }
 copy.addEventListener('click',copyText);
 native.addEventListener('click',async()=>{
  if(!navigator.share){await copyText();return;}
  native.disabled=true;status.textContent='';
  try{
   const candidate={...payload,files:file?[file]:[]};
   const canAttach=file&&navigator.canShare?.(candidate);
   await navigator.share(canAttach?candidate:payload);
   if(alive)status.textContent='Teilen-Dialog geöffnet. Ob Karte, Text und Link übernommen werden, hängt von der gewählten App ab.';
  }catch(error){if(alive&&error.name!=='AbortError')status.textContent='Teilen ist auf diesem Gerät gerade nicht möglich. Du kannst Text und Link kopieren oder die Karte speichern.';}
  finally{if(alive)native.disabled=false;}
 });
 save.addEventListener('click',()=>{if(file){download('duedingen-check.png',file,'image/png');status.textContent='Karte gespeichert. Füge beim Versenden auch den Link zur App hinzu.';}});
 refresh();
 return ()=>{alive=false;sequence++;if(previewUrl)URL.revokeObjectURL(previewUrl);};
}
