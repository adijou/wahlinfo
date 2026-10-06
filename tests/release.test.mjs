import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateData} from '../public/engine.js';
const data=JSON.parse(await readFile(new URL('../public/data/politics.json',import.meta.url),'utf8'));
test('official 2026 candidate list defines six current lists; no transferred JLD positions',()=>{
 assert.deepEqual(data.parties.map(p=>p.listNumber).sort((a,b)=>a-b),[1,2,3,4,5,7]);
 assert.equal(data.election.verified,true);
 assert.equal(data.election.listsVerified,true);
 assert.ok(data.questions.every(q=>!Object.hasOwn(q.positions,'jld')));
 assert.equal(data.historicalProfiles[0].id,'jld');
});
test('publication requires editorial review and sufficient evidence per list',()=>{
 const d=structuredClone(data);d.release='published';
 assert.ok(validateData(d).some(e=>e.includes('Gegenprüfung')));
 d.operator={name:'Test',contact:'test@example.org'};d.review={reviewer:'Test',date:'2026-10-06'};
 assert.deepEqual(validateData(d),[]);
 d.method.minQuestions=4;
 assert.ok(validateData(d).some(e=>e.includes('Vergleichsgrundlage')));
});
test('all coded positions carry exact locators and working source references',()=>{
 for(const q of data.questions)for(const p of Object.values(q.positions))if(p.value!==null){
  assert.ok(p.locator.includes('PDF-S.'));assert.ok(p.pdfPage>0);assert.ok(p.reason.length>30);
  assert.ok(p.sources.every(id=>data.sources.some(s=>s.id===id)));assert.ok(['party','joint-faction'].includes(p.scope));
 }
});
