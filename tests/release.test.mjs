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

test('source review distinguishes searched documents from read pages and covers cited positions',async()=>{
 const review=JSON.parse(await readFile(new URL('../public/data/source-review.json',import.meta.url),'utf8'));
 assert.equal(review.version,data.version);
 assert.equal(new Set(review.documents.map(d=>d.url)).size,review.documents.length);
 for(const d of review.documents){
  assert.match(d.sha256,/^[a-f0-9]{64}$/);
  assert.ok(d.readPages.every(p=>Number.isInteger(p)&&p>0&&p<=d.pages));
 }
 for(const q of data.questions)for(const p of Object.values(q.positions))if(p.sources.length){
  const source=data.sources.find(s=>s.id===p.sources[0]);
  const entry=review.documents.find(d=>d.url===source.url);
  assert.ok(entry,source.url);assert.ok(entry.readPages.includes(p.pdfPage));
 }
});
