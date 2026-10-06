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
export function usable(position) {
  return Boolean(position && isAnswer(position.value) && ['high','medium'].includes(position.evidence) && position.status === 'checked' && position.scope === 'party' && Array.isArray(position.sources) && position.sources.length > 0);
}
export function calculate(data, answers) {
  const questions = data.questions.filter(q => q.active);
  const group = data.parties.filter(p => p.comparable);
  const common = questions.filter(q => group.length >= 2 && group.every(p => usable(q.positions[p.id])));
  const used = common.filter(q => isAnswer(answers[q.id]));
  const topics = new Set(used.map(q => q.topic));
  const ready = used.length >= data.method.minQuestions && topics.size >= data.method.minTopics && group.length >= 2;
  const rows = data.parties.map(p => {
    const own = questions.filter(q => usable(q.positions[p.id]) && isAnswer(answers[q.id]));
    const score = ready && p.comparable ? used.reduce((s,q) => s + similarity(answers[q.id],q.positions[p.id].value)*(q.weight??1),0) / used.reduce((s,q)=>s+(q.weight??1),0) : null;
    return { ...p, score, coverage: own.length, details: questions.map(q => ({ question:q, position:q.positions[p.id] || null, answer:answers[q.id] ?? null, similarity:usable(q.positions[p.id]) ? similarity(answers[q.id],q.positions[p.id].value) : null })) };
  });
  const scored = rows.filter(r => r.score !== null).sort((a,b) => b.score-a.score || a.name.localeCompare(b.name,'de'));
  const unscored = rows.filter(r => r.score === null).sort((a,b) => a.name.localeCompare(b.name,'de'));
  scored.forEach((r,i) => {r.rank=i>0 && Math.round(r.score)===Math.round(scored[i-1].score) ? scored[i-1].rank : i+1;});
  const answered = questions.filter(q => isAnswer(answers[q.id])).length;
  return { ready, rows:[...scored,...unscored], common, used, answered, total:questions.length, topics:topics.size, group, version:data.version };
}
export function validateData(data) {
  const errors=[];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['Die Datei muss ein Datenobjekt enthalten.'];
  if (data.schemaVersion !== 1) errors.push('Unbekannte Datenformat-Version.');
  for (const key of ['version','updated','title']) if(typeof data[key]!=='string'||!data[key].trim()) errors.push(`${key}: Text fehlt.`);
  for(const key of ['parties','questions','sources']) if(!Array.isArray(data[key])||!data[key].length) errors.push(`${key}: Liste fehlt oder ist leer.`);
  if(errors.length) return errors;
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
      if(pos.status==='checked'&&pos.value!==null && (!Array.isArray(pos.sources) || !pos.sources.length || !pos.locator || !['high','medium'].includes(pos.evidence)||pos.scope!=='party')) errors.push(`Frage ${q.id}: Wert ohne ausreichenden Beleg für ${id}.`);
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
    if(!errors.length && !calculate(data,Object.fromEntries(data.questions.map(q=>[q.id,100]))).ready) errors.push('Freigabe: keine ausreichend breite gemeinsame Vergleichsgrundlage.');
  }
  return errors;
}
export function resultText(data, answers) {
  const r=calculate(data,answers);
  return `${data.title}\nDatenversion: ${data.version}\nStand: ${data.updated}\n\n${r.ready?`Vergleich auf ${r.used.length} gemeinsam belegten Antworten.\n`:'Keine Gesamtrangfolge: zu wenig gemeinsam belegte Antworten.\n'}${r.rows.map(p=>`${p.name}: ${p.score===null?'kein vergleichbarer Gesamtwert':Math.round(p.score)+' % Übereinstimmung'} (${p.coverage} belegte beantwortete Themen)`).join('\n')}\n\nOrientierung, keine Wahlempfehlung. Die persönlichen Einzelantworten sind in diesem Export nicht enthalten.`;
}
