import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculate,validateData,similarity,usable,resultText,safeUrl,rating} from '../public/engine.js';
import {esc} from '../public/ui.js';
const seed=JSON.parse(await readFile(new URL('../public/data/politics.json',import.meta.url),'utf8'));
// Synthetic positions exist only in tests and never in the published data.
function fixture(){return {schemaVersion:1,title:'Test',version:'test',updated:'2026-10-06',method:{minQuestions:2,minTopics:2},parties:[{id:'a',name:'Alpha',comparable:true},{id:'b',name:'Beta',comparable:true}],sources:[{id:'s',title:'Testquelle',date:'2026-01-01',url:'https://example.org/source'}],questions:[0,1,2].map((i)=>({id:'q'+i,text:'Aussage '+i,topic:'Thema '+i,context:'Kontext',weight:1,active:true,positions:{a:{value:100,evidence:'medium',status:'checked',scope:'party',sources:['s'],locator:'Seite 1',reason:'Test'},b:{value:0,evidence:'medium',status:'checked',scope:'party',sources:['s'],locator:'Seite 2',reason:'Test'}}}))};}
test('distance is symmetric, bounded, and does not coerce missing values',()=>{for(const a of [0,25,50,75,100])for(const b of [0,25,50,75,100]){assert.equal(similarity(a,b),similarity(b,a));assert.ok(similarity(a,b)>=0&&similarity(a,b)<=100);}assert.equal(similarity(75,100),75);assert.equal(similarity(null,0),null);assert.equal(similarity('0',0),null);});
test('neutral and skip have different effects',()=>{let d=fixture();const neutral=calculate(d,{q0:50,q1:50});assert.equal(neutral.ready,true);assert.deepEqual(neutral.rows.map(p=>p.score),[50,50]);assert.deepEqual(neutral.rows.map(p=>p.rank),[1,1]);const skip=calculate(d,{q0:100,q1:null});assert.equal(skip.ready,false);assert.equal(skip.answered,1);});
test('a gap affects its own list, never erases other evidence or becomes a position',()=>{const d=fixture();d.questions[0].positions.b.value=null;const r=calculate(d,{q0:0,q1:100,q2:100});assert.equal(r.used.length,3);assert.equal(r.rows[0].score,200/3);assert.equal(r.rows[1].score,0);assert.equal(r.rows[1].coverage,2);assert.deepEqual(r.rows[1].range,{min:0,max:100/3});});
test('evidence and attribution gate the calculation',()=>{const p=fixture().questions[0].positions.a;for(const change of [{evidence:'low'},{status:'draft'},{scope:'individual'},{scope:'joint-faction'},{sources:[]},{value:null}])assert.equal(usable({...p,...change}),false);});
test('minimum breadth is required, not just answer count',()=>{const d=fixture();d.questions.forEach(q=>q.topic='Ein Thema');assert.equal(calculate(d,{q0:100,q1:100,q2:100}).ready,false);});
test('ranking cannot depend on party order',()=>{const d=fixture();const a={q0:25,q1:75,q2:50};const first=calculate(d,a).rows;d.parties.reverse();assert.deepEqual(calculate(d,a).rows,first);});
test('weights affect all parties identically',()=>{const d=fixture();d.questions[0].weight=3;const r=calculate(d,{q0:100,q1:0});assert.equal(r.rows[0].score,75);assert.equal(r.rows[1].score,25);});
test('decimal weights cannot create a value above 100 or remove its rating',()=>{const d=fixture();d.questions.forEach(q=>q.weight=.3);const r=calculate(d,{q0:100,q1:100,q2:100});assert.equal(r.rows[0].score,100);assert.equal(r.rows[0].rating.label,'Sehr gut passend');assert.deepEqual(r.rows[0].range,{min:100,max:100});});
test('partial coverage and excluded parties are never promoted to a total score',()=>{const d=fixture();d.parties.push({id:'c',name:'Gamma',comparable:false});const r=calculate(d,{q0:100,q1:100});assert.equal(r.rows.at(-1).score,null);assert.equal(r.rows.at(-1).coverage,0);});
test('seed rates all six lists while preserving four open cells and shared provenance',()=>{assert.deepEqual(validateData(seed),[]);assert.equal(seed.questions.length,5);assert.equal(seed.parties.length,6);const r=calculate(seed,Object.fromEntries(seed.questions.map(q=>[q.id,100])));assert.equal(r.ready,true);assert.ok(r.rows.every(p=>p.score!==null));assert.equal(r.rows.reduce((n,p)=>n+p.coverage,0),26);assert.equal(r.rows.find(p=>p.id==='fwd').joint,5);assert.equal(r.rows.find(p=>p.id==='fwd').score,r.rows.find(p=>p.id==='gemeinsam').score);assert.equal(seed.questions.find(q=>q.id==='ampelversuch').positions.fdp.scope,'party');});
test('rejects malformed imports without throwing',()=>{const cases=[null,[],{}, {schemaVersion:1,title:'x',version:'x',updated:'x',parties:[null],sources:[null],questions:[null]}];for(const item of cases)assert.ok(validateData(item).length);for(const field of ['sources','value','evidence','status','scope']){const d=fixture();d.questions[0].positions.a[field]=undefined;assert.ok(validateData(d).length);}const d=fixture();d.questions[0].positions.a.sources=['missing'];assert.ok(validateData(d).length);d.questions[0].weight=NaN;assert.ok(validateData(d).length);});
test('active questions need contrasting evidence, not two agreeing positions',()=>{const d=fixture();d.questions[0].positions.b.value=100;assert.ok(validateData(d).some(s=>s.includes('unterschiedliche')));});
test('unsafe links and content cannot produce markup',()=>{assert.equal(safeUrl('javascript:alert(1)'),false);assert.equal(safeUrl('https://user:secret@example.org'),false);assert.equal(safeUrl('https://www.duedingen.ch/_doc/6933574#page=27'),true);assert.equal(esc('<script>"&'), '&lt;script&gt;&quot;&amp;');});
test('shared result identifies version and contains no individual answer values',()=>{const d=fixture();const text=resultText(d,{q0:75,q1:25});assert.ok(text.includes('Datenversion: test'));assert.ok(text.includes('Alpha: 50 %'));assert.ok(!text.includes('q0'));assert.ok(!text.includes('75'));});
test('fixed rating bands use the displayed rounded percentage and never rescale',()=>{for(const [score,label] of [[0,'Gar nicht passend'],[19,'Gar nicht passend'],[20,'Wenig passend'],[39,'Wenig passend'],[40,'Teilweise passend'],[59,'Teilweise passend'],[60,'Gut passend'],[79,'Gut passend'],[79.5,'Sehr gut passend'],[100,'Sehr gut passend']])assert.equal(rating(score).label,label);for(const x of [null,undefined,NaN,Infinity,-1,101])assert.equal(rating(x),null);});
test('an unscorable list does not suppress other ratings',()=>{const d=fixture();d.questions.forEach(q=>q.positions.b.value=null);const r=calculate(d,{q0:100,q1:100,q2:0});assert.equal(r.ready,true);assert.equal(r.rows[0].score,200/3);assert.equal(r.rows[1].score,null);assert.equal(r.rows[1].rating,null);});
test('uncertainty bounds enumerate possible positions and exclude skipped questions',()=>{const d=fixture();d.questions[2].positions.a.value=null;const r=calculate(d,{q0:100,q1:0,q2:75}).rows.find(p=>p.id==='a');assert.equal(r.score,50);assert.deepEqual(r.range,{min:125/3,max:200/3});const skip=calculate(d,{q0:100,q1:0,q2:null}).rows.find(p=>p.id==='a');assert.deepEqual(skip.range,{min:50,max:50});assert.equal(skip.missing,0);});
test('complete coverage has an exact range; neutral answers create no false winner',()=>{const r=calculate(seed,Object.fromEntries(seed.questions.map(q=>[q.id,50])));assert.ok(r.rows.every(p=>p.score===50&&p.rank===1&&p.rating.label==='Teilweise passend'));assert.deepEqual(r.rows.find(p=>p.id==='mitte').range,{min:50,max:50});});
test('all 7776 answer/skip profiles yield finite, bounded, independently reproducible scores',()=>{
 const options=[null,0,25,50,75,100];
 for(let n=0;n<6**5;n++){
  let code=n;const answers=Object.fromEntries(seed.questions.map(q=>{const value=options[code%6];code=Math.floor(code/6);return [q.id,value];}));
  const result=calculate(seed,answers);
  for(const p of result.rows){
   const entries=seed.questions.filter(q=>answers[q.id]!==null&&usable(q.positions[p.id]));
   const expected=entries.length>=2&&new Set(entries.map(q=>q.topic)).size>=2?entries.reduce((s,q)=>s+100-Math.abs(answers[q.id]-q.positions[p.id].value),0)/entries.length:null;
   assert.equal(p.score,expected);assert.equal(p.coverage,entries.length);
   if(p.score!==null){assert.ok(p.score>=0&&p.score<=100);assert.ok(p.range.min>=0&&p.range.max<=100&&p.range.min<=p.range.max);}
  }
  assert.equal(result.rows.find(p=>p.id==='fwd').score,result.rows.find(p=>p.id==='gemeinsam').score);
  if(result.answered===5)assert.ok(result.rows.every(p=>p.rating));
 }
});
test('shared profiles cannot be recoded differently or assigned to an unrelated list',()=>{
 for(const mutate of [d=>d.questions[0].positions.fwd.value=100,d=>d.questions[0].positions.fwd.jointGroup='missing',d=>d.jointGroups[0].members=['mitte','gemeinsam'],d=>d.questions[0].positions.fwd.sources=[],d=>d.jointGroups=null,d=>d.jointGroups=[null]]){
  const d=structuredClone(seed);mutate(d);assert.ok(validateData(d).length);
 }
});
test('exports carry rating, shared attribution, coverage and missing-evidence range',()=>{const text=resultText(seed,Object.fromEntries(seed.questions.map(q=>[q.id,100])));assert.ok(text.includes('gemeinsame Fraktionspositionen'));assert.ok(text.includes('3/5'));assert.ok(text.includes('mögliche Spanne'));assert.ok(text.includes('passend'));assert.ok(!text.includes('mietzuschuss'));});

test('documented FDP traffic-light motion contributes to the rating in both directions',()=>{
 const motion=seed.questions.find(q=>q.id==='ampelversuch').positions.fdp;
 assert.equal(motion.value,100);
 assert.equal(motion.scope,'party');
 assert.equal(seed.sources.find(s=>s.id===motion.sources[0]).url,'https://www.duedingen.ch/_doc/7052704');
 assert.equal(motion.pdfPage,4);
 for(const [answer,expected] of [[100,100],[0,50]]){
  const fdp=calculate(seed,{basisstufe:100,ampelversuch:answer}).rows.find(p=>p.id==='fdp');
  assert.equal(fdp.coverage,2);assert.equal(fdp.score,expected);
 }
});
