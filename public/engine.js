export const ANSWERS = [
  { value: 100, label: 'Stimme voll zu', short: 'Ja' },
  { value: 75, label: 'Stimme eher zu', short: 'Eher ja' },
  { value: 50, label: 'Teils / teils', short: 'Teils / teils' },
  { value: 25, label: 'Stimme eher nicht zu', short: 'Eher nein' },
  { value: 0, label: 'Stimme überhaupt nicht zu', short: 'Nein' },
];
export const answerLabel = value => ANSWERS.find(a => a.value === value)?.short ?? 'Übersprungen';
export const isAnswer = v => ANSWERS.some(a => a.value === v);
export const similarity = (a, b) => isAnswer(a) && isAnswer(b) ? 100 - Math.abs(a - b) : null;
export const safeUrl = url => { try { const u = new URL(url); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; } };
export const RATINGS = [
  { min:80, label:'Sehr gut passend', key:'very-good' },
  { min:60, label:'Gut passend', key:'good' },
  { min:40, label:'Teilweise passend', key:'partial' },
  { min:20, label:'Wenig passend', key:'low' },
  { min:0, label:'Gar nicht passend', key:'none' },
];
export const rating = score => Number.isFinite(score) && score>=0 && score<=100 ? RATINGS.find(r=>Math.round(score)>=r.min) : null;
const percentage = value => Math.min(100,Math.max(0,value));
export function usable(position) {
  return Boolean(position && isAnswer(position.value) && ['high','medium'].includes(position.evidence) && position.status === 'checked' && (position.scope === 'party' || position.scope === 'joint-faction' && position.jointGroup) && Array.isArray(position.sources) && position.sources.length > 0);
}
export function calculate(data, answers) {
  const questions = data.questions.filter(q => q.active);
  const group = data.parties.filter(p => p.comparable);
  const common = questions.filter(q => group.length >= 2 && group.every(p => usable(q.positions[p.id])));
  const used = questions.filter(q => isAnswer(answers[q.id]));
  const topics = new Set(used.map(q => q.topic));
  const totalWeight = used.reduce((s,q)=>s+(q.weight??1),0);
  const rows = data.parties.map(p => {
    const known = used.filter(q=>usable(q.positions[p.id]));
    const missing = used.filter(q=>!usable(q.positions[p.id]));
    const coverageTopics = new Set(known.map(q=>q.topic)).size;
    const weight = known.reduce((s,q)=>s+(q.weight??1),0);
    const sum = known.reduce((s,q)=>s+similarity(answers[q.id],q.positions[p.id].value)*(q.weight??1),0);
    const enough = p.comparable && known.length>=data.method.minQuestions && coverageTopics>=data.method.minTopics;
    const score = enough ? percentage(sum/weight) : null;
    // Bounds enumerate possible missing positions; they do not impute a position.
    const bound = extreme => percentage((sum+missing.reduce((s,q)=>s+extreme(...ANSWERS.map(a=>similarity(answers[q.id],a.value)))*(q.weight??1),0))/totalWeight);
    const range = score===null ? null : {min:bound(Math.min),max:bound(Math.max)};
    const joint = known.filter(q=>q.positions[p.id].scope==='joint-faction').length;
    return { ...p, score, rating:rating(score), range, coverage:known.length, direct:known.length-joint, joint, coverageTopics, missing:missing.length, weightedCoverage:totalWeight?weight/totalWeight:0, details:questions.map(q=>({question:q,position:q.positions[p.id]||null,answer:answers[q.id]??null,similarity:usable(q.positions[p.id])?similarity(answers[q.id],q.positions[p.id].value):null})) };
  });
  const scored = rows.filter(r => r.score !== null).sort((a,b) => Math.round(b.score)-Math.round(a.score) || a.name.localeCompare(b.name,'de'));
  const unscored = rows.filter(r => r.score === null).sort((a,b) => a.name.localeCompare(b.name,'de'));
  scored.forEach((r,i) => {r.rank=i>0 && Math.round(r.score)===Math.round(scored[i-1].score) ? scored[i-1].rank : i+1;});
  const answered = questions.filter(q => isAnswer(answers[q.id])).length;
  return { ready:scored.length>0, rows:[...scored,...unscored], common, used, answered, total:questions.length, topics:topics.size, group, version:data.version };
}
export function validateData(data) {
  const errors=[];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['Die Datei muss ein Datenobjekt enthalten.'];
  if (data.schemaVersion !== 1) errors.push('Unbekannte Datenformat-Version.');
  for (const key of ['version','updated','title']) if(typeof data[key]!=='string'||!data[key].trim()) errors.push(`${key}: Text fehlt.`);
  for(const key of ['parties','questions','sources']) if(!Array.isArray(data[key])||!data[key].length) errors.push(`${key}: Liste fehlt oder ist leer.`);
  if(errors.length) return errors;
  const jointGroups = data.jointGroups ?? [];
  if(!data.method || !Number.isInteger(data.method.minQuestions) || data.method.minQuestions<1 || !Number.isInteger(data.method.minTopics) || data.method.minTopics<1) errors.push('Mindestumfang der Berechnung ist ungültig.');
  const ids = {};
  for(const key of ['parties','questions','sources']) {
    ids[key]=new Set();
    for(const item of data[key]) {
      if(!item || typeof item.id!=='string' || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(item.id) || ['constructor','prototype'].includes(item.id) || ids[key].has(item.id)) errors.push(`${key}: ungültige oder doppelte Kennung.`);
      ids[key].add(item?.id);
    }
  }
  if(errors.length) return errors;
  if(!Array.isArray(jointGroups) || jointGroups.some((g,i)=>!g || typeof g.id!=='string' || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(g.id) || typeof g.name!=='string' || !g.name.trim() || !Array.isArray(g.members) || g.members.length<2 || new Set(g.members).size!==g.members.length || g.members.some(id=>!ids.parties.has(id)) || jointGroups.slice(0,i).some(x=>x.id===g.id))) return [...errors,'Gemeinsame Fraktionen: gültige Kennungen, Namen und mindestens zwei unterschiedliche Listen nötig.'];
  if(data.answerLabels && (!Array.isArray(data.answerLabels)||data.answerLabels.length!==5||data.answerLabels.some(x=>typeof x!=='string'||!x.trim()))) errors.push('Es sind genau fünf Antworttexte erforderlich.');
  for(const p of data.parties) if(typeof p.name!=='string'||!p.name.trim()||typeof p.comparable!=='boolean') errors.push(`Partei ${p.id}: Name oder Vergleichsstatus fehlt.`);
  for(const s of data.sources) {
    if(!safeUrl(s.url)) errors.push(`Quelle ${s.id}: sichere HTTPS-Adresse fehlt.`);
    if(typeof s.title!=='string'||!s.title.trim()||typeof s.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s.date)) errors.push(`Quelle ${s.id}: Titel oder Datum fehlt.`);
  }
  for(const q of data.questions) {
    if(typeof q.text!=='string'||!q.text.trim()||typeof q.topic!=='string'||!q.topic.trim()||typeof q.context!=='string'||typeof q.active!=='boolean'||!q.positions||typeof q.positions!=='object') {errors.push(`Frage ${q.id}: Pflichtangaben fehlen.`);continue;}
    if(q.weight!==undefined && (!Number.isFinite(q.weight)||q.weight<=0||q.weight>10)) errors.push(`Frage ${q.id}: Gewicht muss grösser als 0 und höchstens 10 sein.`);
    if(q.sources!==undefined&&(!Array.isArray(q.sources)||q.sources.some(s=>!ids.sources.has(s)))) errors.push(`Frage ${q.id}: unbekannte Hintergrundquelle.`);
    for(const [id,pos] of Object.entries(q.positions)) {
      if(!ids.parties.has(id)) errors.push(`Frage ${q.id}: unbekannte Partei ${id}.`);
      if(!pos || typeof pos!=='object') {errors.push(`Frage ${q.id}: ungültige Position.`);continue;}
      if(pos.value!==null&&!isAnswer(pos.value)) errors.push(`Frage ${q.id}: ungültiger Antwortwert für ${id}.`);
      if(!['high','medium','low','none'].includes(pos.evidence)||!['checked','draft'].includes(pos.status)||!['party','joint-faction','individual','unknown'].includes(pos.scope)) errors.push(`Frage ${q.id}: Evidenz/Status/Zuordnung ungültig.`);
      if(!Array.isArray(pos.sources)||pos.sources.some(s=>!ids.sources.has(s))) errors.push(`Frage ${q.id}: unbekannte Quellen.`);
      if(typeof pos.reason!=='string') errors.push(`Frage ${q.id}: Erläuterung fehlt.`);
      if(pos.pdfPage!=null && (!Number.isInteger(pos.pdfPage)||pos.pdfPage<1)) errors.push(`Frage ${q.id}: PDF-Seite ungültig.`);
      const jointGroup = jointGroups.find(g=>g.id===pos.jointGroup && g.members.includes(id));
      if(pos.status==='checked'&&pos.value!==null && (!Array.isArray(pos.sources) || !pos.sources.length || !pos.locator || !['high','medium'].includes(pos.evidence)||!(pos.scope==='party'||pos.scope==='joint-faction'&&jointGroup))) errors.push(`Frage ${q.id}: Wert ohne ausreichenden Beleg für ${id}.`);
      if(pos.scope==='joint-faction'&&pos.value!==null&&jointGroup) {
        for(const member of jointGroup.members) {
          const other=q.positions[member];
          if(!other || other.scope!=='joint-faction'||other.jointGroup!==pos.jointGroup||other.value!==pos.value||other.status!==pos.status||other.evidence!==pos.evidence||JSON.stringify(other.sources)!==JSON.stringify(pos.sources)||other.locator!==pos.locator) errors.push(`Frage ${q.id}: gemeinsame Fraktion ${jointGroup.id} muss für ihre Listen identisch belegt sein.`);
        }
      }
    }
    if(q.active) {
      const vals = new Set(Object.values(q.positions).filter(usable).map(p=>p.value));
      if(vals.size<2) errors.push(`Aktive Frage ${q.id}: mindestens zwei unterschiedliche belegte Positionen nötig.`);
    }
  }
  if(!data.questions.some(q=>q.active)) errors.push('Mindestens eine aktive, belegte Frage nötig.');
  if(data.release==='published') {
    if(typeof data.operator?.name!=='string'||!data.operator.name.trim()||typeof data.operator?.contact!=='string'||!data.operator.contact.trim()) errors.push('Freigabe: verantwortliche Person und Kontakt fehlen.');
    if(!data.election?.verified||!data.election?.listsVerified) errors.push('Freigabe: amtlichen Wahltermin und Listen bestätigen.');
    if(!data.review?.reviewer||!data.review?.date) errors.push('Freigabe: dokumentierte redaktionelle Gegenprüfung fehlt.');
    if(!errors.length && calculate(data,Object.fromEntries(data.questions.map(q=>[q.id,100]))).rows.some(p=>p.comparable&&p.score===null)) errors.push('Freigabe: nicht jede Liste hat eine ausreichende Vergleichsgrundlage.');
  }
  return errors;
}
export function resultText(data, answers) {
  const r=calculate(data,answers);
  return `${data.title}\nDatenversion: ${data.version}\nStand: ${data.updated}\n\n${r.answered} beantwortete Fragen. Rating je Liste auf ihren belegten Positionen; unterschiedliche Belegbasis.\n${r.rows.map(p=>`${p.name}: ${p.score===null?'zu wenig Belege für ein Rating':Math.round(p.score)+' % – '+p.rating.label+(p.missing?' (vorläufig)':'')} (${p.coverage}/${r.answered} Antworten belegt${p.joint?'; davon '+p.joint+' gemeinsame Fraktionspositionen':''})${p.range&&p.missing?'; mögliche Spanne mit offenen Positionen: '+Math.floor(p.range.min)+'–'+Math.ceil(p.range.max)+' %':''}`).join('\n')}\n\nRangfolge nach gerundeter Nähe auf belegten Antworten, keine gesicherte Reihenfolge bei Datenlücken. Gemeinsame Fraktionsprofile unterscheiden die beteiligten Listen nicht. Orientierung, keine Wahlempfehlung. Die persönlichen Einzelantworten sind in diesem Export nicht enthalten.`;
}
