import { ANSWERS, validateData, calculate } from './engine.js';
import { esc as e, download } from './ui.js';
let data,tab='questions',selected=0,dirty=false;
const main=document.querySelector('#editor-main');
const status=document.querySelector('#editor-status');
const input=(key,label,value,type='text',extra='')=>`<label class="field">${e(label)}<input data-key="${e(key)}" type="${type}" value="${e(value)}" ${extra}></label>`;
const area=(key,label,value)=>`<label class="field">${e(label)}<textarea data-key="${e(key)}">${e(value)}</textarea></label>`;
const select=(key,label,value,options)=>`<label class="field">${e(label)}<select data-key="${e(key)}">${options.map(([v,n])=>`<option value="${e(v)}" ${String(value)===String(v)?'selected':''}>${e(n)}</option>`).join('')}</select></label>`;
const blank=()=>({value:null,evidence:'none',status:'draft',scope:'unknown',sources:[],locator:'',reason:''});
function mark(){dirty=true;status.textContent='Änderungen im Browser – noch nicht heruntergeladen.';}
function show(){
  document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('selected',b.dataset.tab===tab);b.setAttribute('aria-current',b.dataset.tab===tab?'page':'false');});
  if(tab==='questions'){
    selected=Math.min(selected,data.questions.length-1);const q=data.questions[selected];
    main.innerHTML=`<h2>Fragen &amp; Positionen</h2><label class="field">Frage auswählen<select id="question-select">${data.questions.map((x,i)=>`<option value="${i}" ${selected===i?'selected':''}>${i+1}. ${e(x.topic)} – ${e(x.text.slice(0,75))}</option>`).join('')}</select></label><button class="button small" data-action="new-question">Neue Frage anlegen</button><section class="editor-panel">${input('id','Kennung (stabil halten)',q.id)}${input('topic','Themenbereich',q.topic)}${area('text','Aussage',q.text)}${area('context','Verständlicher Hintergrund',q.context)}${input('business','Geschäft / Traktandum',q.business)}<div class="editor-columns">${input('weight','Gewicht (0 < Gewicht ≤ 10)',q.weight??1,'number','min="0.1" max="10" step="0.1"')}${input('sources','Quellen-Kennungen, mit Komma getrennt',(q.sources||[]).join(', '))}</div><label class="check-label"><input data-key="active" type="checkbox" ${q.active?'checked':''}>Im Fragebogen verwenden</label></section><h2 class="editor-section-title">Positionen zu dieser Frage</h2><p class="neutral-info">Einzelpersonen und gemeinsame Fraktionen erhalten keinen Parteiwert. «Geprüft» bestätigt den Abgleich mit dem Original, keine namentliche Abstimmung.</p>${data.parties.map(p=>{const pos=q.positions[p.id]||blank();return `<details data-party="${e(p.id)}"><summary>${e(p.name)}</summary><div class="details-body"><div class="editor-columns">${select('value','Belegte Position',pos.value??'',[['','Kein Wert'],...ANSWERS.map(a=>[a.value,a.short])])}${select('evidence','Evidenz',pos.evidence,[['none','Fehlt'],['low','Tief'],['medium','Mittel'],['high','Hoch']])}${select('scope','Wem ist die Aussage zugeordnet?',pos.scope,[['unknown','Unklar'],['party','Partei / eigene Fraktion'],['joint-faction','Gemeinsame Fraktion'],['individual','Einzelperson']])}${select('status','Prüfstatus',pos.status,[['draft','Entwurf'],['checked','Am Original geprüft']])}</div>${area('reason','Herleitung und Einschränkungen',pos.reason)}${input('sources','Quellen-Kennungen, mit Komma getrennt',(pos.sources||[]).join(', '))}${input('locator','Genaue Fundstelle und Art des Belegs',pos.locator)}${input('pdfPage','PDF-Startseite (optional)',pos.pdfPage??'','number','min="1" step="1"')}</div></details>`;}).join('')}`;
    main.querySelector('#question-select').addEventListener('change',ev=>{selected=Number(ev.target.value);show();});
  }else if(tab==='sources'){
    main.innerHTML=`<h2>Quellen</h2><p class="neutral-info">Nur öffentliche HTTPS-Originalquellen verwenden. Bei veränderter Kennung müssen die Verweise in den Fragen angepasst werden.</p><button class="button small" data-action="new-source">Quelle ergänzen</button>${data.sources.map((s,i)=>`<details data-source="${i}"><summary>${e(s.title)}</summary><div class="details-body">${input('id','Kennung',s.id)}${input('title','Titel',s.title)}${input('url','Original-Link',s.url,'url')}${input('date','Sitzungs- oder Publikationsdatum',s.date,'date')}${input('type','Art der Quelle',s.type)}${input('publisher','Herausgeber',s.publisher)}${input('retrieved','Zuletzt abgerufen',s.retrieved,'date')}</div></details>`).join('')}`;
  }else if(tab==='parties'){
    main.innerHTML=`<h2>Parteien und Listen</h2><p class="neutral-info">Die feste Vergleichsgruppe wird vor den Antworten definiert. Parteien wegen unpassender Resultate auszuschliessen wäre methodisch unzulässig. Neue Parteien benötigen eigene Belege.</p><button class="button small" data-action="new-party">Partei ergänzen</button>${data.parties.map((p,i)=>`<section class="editor-panel" data-party-index="${i}">${input('id','Kennung (Verweise mitanpassen)',p.id)}${input('name','Angezeigter Name',p.name)}${area('note','Einordnung',p.note)}<label class="check-label"><input data-key="comparable" type="checkbox" ${p.comparable?'checked':''}>In der festen Gruppe für Gesamtvergleiche berücksichtigen</label></section>`).join('')}`;
  }else if(tab==='method'){
    main.innerHTML=`<h2>Methode &amp; Angaben</h2>${input('title','Titel der Anwendung',data.title)}<div class="editor-columns">${input('version','Datenversion',data.version)}${input('updated','Datenstand',data.updated,'date')}</div><div class="editor-columns">${input('method.minQuestions','Mindestzahl gemeinsam belegter Antworten',data.method.minQuestions,'number','min="1" step="1"')}${input('method.minTopics','Mindestzahl Themenbereiche',data.method.minTopics,'number','min="1" step="1"')}</div><h3>Antworttexte (Reihenfolge: 100 bis 0)</h3><p class="neutral-info">Nur die Formulierung ändern, nicht die Bedeutung der Skala. «Keine Meinung» bleibt eine separate Option ohne Wert.</p>${(data.answerLabels||ANSWERS.map(a=>a.label)).map((label,i)=>input('answerLabels.'+i,'Antwort '+(i+1),label)).join('')}<h3>Verantwortlichkeit</h3>${input('operator.name','Verantwortliche Person / Organisation',data.operator?.name||'')}${input('operator.contact','Kontakt für Korrekturen',data.operator?.contact||'')}<h3>Freigabe</h3><p class="neutral-info">Diese Fassung ist eine Rechercheversion. Der Status lässt sich im vollständigen Datensatz ändern, nachdem Belege, Wahllisten, Verantwortlichkeit und Gegenprüfung abgeschlossen sind. Die Datei wird vor dem Export erneut geprüft.</p>`;
  }else{
    main.innerHTML=`<h2>Gesamter Datensatz</h2><p class="neutral-info">Hier lassen sich auch weitere Metadaten und Strukturänderungen bearbeiten. «Übernehmen» liest den Text ein. Fehlerhafte Daten können als Entwurf gesichert werden.</p><label class="field">JSON<textarea class="code" id="raw-json" spellcheck="false">${e(JSON.stringify(data,null,2))}</textarea></label><button class="button" data-action="apply-json">Änderungen übernehmen</button>`;
    main.querySelector('#raw-json').addEventListener('input',mark);
  }
}
main.addEventListener('input',event=>{
  const el=event.target,key=el.dataset.key;if(!key)return;
  let target=data;
  if(tab==='questions'){target=data.questions[selected];const group=el.closest('[data-party]');if(group){target.positions[group.dataset.party]??=blank();target=target.positions[group.dataset.party];}}
  if(tab==='sources')target=data.sources[Number(el.closest('[data-source]').dataset.source)];
  if(tab==='parties')target=data.parties[Number(el.closest('[data-party-index]').dataset.partyIndex)];
  const segments=key.split('.');const final=segments.pop();for(const segment of segments){target[segment]??={};target=target[segment];}
  let value=el.type==='checkbox'?el.checked:el.value;
  if(el.type==='number')value=el.value===''?null:Number(el.value);
  if(final==='value')value=el.value===''?null:Number(el.value);
  if(final==='sources')value=el.value.split(',').map(s=>s.trim()).filter(Boolean);
  target[final]=value;mark();
});
function importText(text){
  try{const incoming=JSON.parse(text);const errors=validateData(incoming);if(errors.length){document.querySelector('#validation').innerHTML='<h2>Bitte zuerst korrigieren</h2><ul class="validation-list">'+errors.map(x=>`<li>${e(x)}</li>`).join('')+'</ul>';status.textContent='Nicht übernommen: Die vorhandenen Daten bleiben erhalten.';return false;}data=incoming;selected=0;mark();show();return true;}catch(error){status.textContent='Nicht übernommen: ungültige JSON-Datei. '+error.message;return false;}
}
function check(){
  if(tab==='json'&&!importText(main.querySelector('#raw-json').value))return false;
  const errors=validateData(data);const result=errors.length?null:calculate(data,{});
  document.querySelector('#validation').innerHTML=errors.length?`<h2>${errors.length} Prüfhinweise</h2><ul class="validation-list">${errors.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`:`<div class="notice"><strong>Struktur und Belegregeln sind gültig.</strong><p>${result.common.length} Fragen sind für die gesamte Vergleichsgruppe belegt. Eine technische Prüfung ersetzt keine fachliche Gegenprüfung der Quellen.</p></div>`;
  return errors.length===0;
}
main.addEventListener('click',event=>{
  const action=event.target.closest('[data-action]')?.dataset.action;if(!action)return;
  if(action==='apply-json'){importText(main.querySelector('#raw-json').value);return;}
  if(action==='new-question'){data.questions.push({id:'frage-'+Date.now(),topic:'Neues Thema',text:'Neue Aussage',context:'',business:'',weight:1,active:false,sources:[],positions:Object.fromEntries(data.parties.map(p=>[p.id,blank()]))});selected=data.questions.length-1;}
  if(action==='new-source')data.sources.push({id:'quelle-'+Date.now(),title:'Neue Quelle',url:'',date:data.updated,type:'',publisher:'',retrieved:data.updated});
  if(action==='new-party')data.parties.push({id:'partei-'+Date.now(),name:'Neue Partei',note:'Belege noch ergänzen',comparable:true});
  mark();show();
});
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{if(!data)return;if(tab==='json'&&!importText(main.querySelector('#raw-json').value))return;tab=b.dataset.tab;show();main.focus();}));
document.querySelector('#validate').addEventListener('click',()=>data&&check());
document.querySelector('#export').addEventListener('click',()=>{if(data&&check()){download('politics.json',JSON.stringify(data,null,2)+'\n','application/json');dirty=false;status.textContent='Geprüfte Datei heruntergeladen. Das Repository wurde noch nicht verändert.';}});
document.querySelector('#draft').addEventListener('click',()=>{if(!data)return;const content=tab==='json'?main.querySelector('#raw-json').value:JSON.stringify(data,null,2);download('politics-entwurf.json',content,'application/json');dirty=false;status.textContent='Entwurf gesichert – vor Verwendung alle Prüfhinweise beheben.';});
document.querySelector('#import-file').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;if(file.size>2_000_000){status.textContent='Die Datei ist grösser als 2 MB.';event.target.value='';return;}importText(await file.text());event.target.value='';});
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
try{const response=await fetch('/data/politics.json');if(!response.ok)throw Error();data=await response.json();const errors=validateData(data);if(errors.length)throw Error(errors[0]);show();}catch{data=null;main.innerHTML='<p class="error-message">Der Datensatz konnte nicht geöffnet werden. Importiere eine gültige Datei oder lade die Seite erneut.</p>';}
