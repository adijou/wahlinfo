import {esc} from './ui.js';

// A public landing page, never the current result URL or locally entered answers.
export const SHARE_URL='https://wahlinfo.netlify.app/';
const blue='#244bc4', ink='#141414';
const text=(x,y,size,value,fill=ink,weight=400)=>`<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(value)}</text>`;
const line=(y,color='#d7dce5')=>`<path d="M64 ${y}H1016" stroke="${color}"/>`;
const dateLabel=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')?value.split('-').reverse().join('.'):'Termin siehe Website';
const wrap=(value,max=36)=>{
 const words=String(value).split(/\s+/),lines=[];let current='';
 for(const word of words){if(current&&(current+' '+word).length>max){lines.push(current);current=word;}else current+=(current?' ':'')+word;}
 if(current)lines.push(current);return lines;
};

export function sharePayload(data,result,personal=false){
 let message=`5 Fragen. 3 Minuten. Dein Düdingen. 🗳️\nWelche Listen passen zu deinen Ansichten? Mach den Düdingen-Check und finde es heraus.\n\nGeneralratswahl am ${dateLabel(data.election?.date)}. Informieren. Mitreden. Wählen.`;
 if(personal){
  const rows=result.rows.map(p=>`${p.score===null?'–':Math.round(p.score)+' %'} · ${p.name}${p.joint?'*':''}: ${p.rating?.label||'zu wenig Belege'} (${p.coverage}/${result.answered} belegt${p.range&&p.missing?`; mögliche Spanne ${Math.floor(p.range.min)}–${Math.ceil(p.range.max)} %`:''})`);
  message=`Mein Düdingen-Check 🗳️\n${result.answered} Fragen beantwortet. Nähe zu belegten Positionen:\n\n${rows.join('\n')}\n\n${result.rows.some(p=>p.joint)?'* Gemeinsames Fraktionsprofil, keine getrennten Parteibeschlüsse.\n':''}Unterschiedliche Belegbasis; bei Lücken vorläufig. Orientierung, keine Wahlempfehlung. ${data.release==='published'?'':'Rechercheversion. '}Daten: ${data.version}.\n\nUnd du? Mach deinen eigenen Check. Generalratswahl am ${dateLabel(data.election?.date)}.`;
 }
 return {title:'Düdingen im Blick · Dein Düdingen-Check',text:message,url:SHARE_URL};
}

export function shareCardSvg(data,result,personal=false){
 const publicHost=new URL(SHARE_URL).host;
 let body=`<rect width="1080" height="1350" fill="white"/><rect width="1080" height="16" fill="${blue}"/>${text(64,87,24,'DÜDINGEN IM BLICK',blue,700)}${text(64,130,20,'GENERALRATSWAHL · '+dateLabel(data.election?.date))}`;
 if(!personal){
  body+=`${text(58,304,106,'Deine Gemeinde.',ink,700)}${text(58,423,106,'Deine Haltung.',ink,700)}${text(58,542,106,'Deine Wahl.',blue,700)}
   <rect x="64" y="646" width="952" height="276" fill="#eef2ff"/>
   ${text(100,716,35,'Welche Listen passen zu dir?',blue,700)}${text(100,780,29,'5 Fragen zu Entscheidungen in Düdingen.')}${text(100,829,29,'Mit Rating und Originalquellen.')}${text(100,880,26,'Etwa 3 Minuten · ohne Anmeldung')}
   <path d="M72 1032H232M190 990l42 42-42 42" fill="none" stroke="${blue}" stroke-width="12"/>
   ${text(274,1044,45,'Mach deinen Check.',blue,700)}
   ${line(1135)}${text(64,1195,33,publicHost,ink,700)}${text(64,1251,24,'Informieren. Mitreden. Wählen.')}`;
 }else{
  body+=`${text(64,223,68,'Mein Düdingen-Check',ink,700)}${text(64,277,25,`${result.answered} Fragen beantwortet · Nähe auf belegten Positionen`)}`;
  result.rows.forEach((p,i)=>{
   const y=320+i*126;
   const names=wrap(p.name+(p.joint?'*':''),37);
   body+=line(y)+names.slice(0,2).map((s,n)=>text(64,y+38+n*30,29,s,ink,700)).join('');
   body+=text(907,y+47,44,p.score===null?'—':Math.round(p.score)+' %',blue,700);
   body+=text(64,y+names.slice(0,2).length*30+38,21,`${p.rating?.label||'Zu wenig Belege'} · ${p.coverage}/${result.answered} Antworten belegt${p.missing&&p.score!==null?' · vorläufig':''}`);
   if(p.range&&p.missing)body+=text(64,y+112,19,`Mit offenen Positionen möglich: ${Math.floor(p.range.min)}–${Math.ceil(p.range.max)} %`,'#5c626d');
  });
  body+=line(1076)+text(64,1115,21,'Unterschiedliche Belegbasis; keine gesicherte Gesamtrangfolge.');
  if(result.rows.some(p=>p.joint))body+=text(64,1148,20,'* FWD und Mitte Links/Grüne/glp: gemeinsames Fraktionsprofil.');
  body+=text(64,1213,36,'Und du? Mach deinen Check.',blue,700)+text(64,1257,27,publicHost,ink,700);
 }
 body+=text(64,1310,18,`Orientierung, keine Wahlempfehlung. ${data.release==='published'?'':'Rechercheversion · '}Daten ${data.version}`,'#5c626d');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" role="img">${body}</svg>`;
}

export function socialPreviewSvg(data){
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${blue}"/>${text(62,70,23,'DÜDINGEN IM BLICK','white',700)}${text(62,199,78,'Deine Gemeinde.','white',700)}${text(62,286,78,'Deine Haltung.','white',700)}${text(62,373,78,'Deine Wahl.','white',700)}<path d="M862 206H1088M1030 148l58 58-58 58" fill="none" stroke="white" stroke-width="16"/><rect x="64" y="425" width="1072" height="97" fill="white"/>${text(91,484,32,'Welche Listen passen zu dir? 5 Fragen. 3 Minuten.',blue,700)}${text(64,581,23,'GENERALRATSWAHL · '+dateLabel(data.election?.date),'white')}${text(790,581,21,'Orientierung, keine Wahlempfehlung.','white')}</svg>`;
}
