import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculate} from '../public/engine.js';
import {SHARE_URL,sharePayload,shareCardSvg,socialPreviewSvg} from '../public/share-card.js';

const data=JSON.parse(await readFile(new URL('../public/data/politics.json',import.meta.url),'utf8'));
const answered=Object.fromEntries(data.questions.filter(q=>q.active).map((q,i)=>[q.id,[100,0,100,0,75][i]]));
const result=calculate(data,answered);

test('default invitation is independent of private answers and contains only a public landing URL',()=>{
 const empty=calculate(data,{});
 assert.deepEqual(sharePayload(data,result),sharePayload(data,empty));
 assert.equal(shareCardSvg(data,result),shareCardSvg(data,empty));
 const payload=sharePayload(data,result);
 assert.equal(payload.url,SHARE_URL);
 assert.equal(payload.url,'https://duedingen-wahlen.ch/');
 for(const personal of [false,true]){
  const card=shareCardSvg(data,result,personal);
  assert.ok(card.includes('duedingen-wahlen.ch'));
  assert.ok(!card.includes('wahlinfo.netlify.app'));
 }
 assert.equal(new URL(payload.url).search,'');assert.equal(new URL(payload.url).hash,'');
 assert.match(payload.text,/25\.10\.2026/);
 for(const party of data.parties)assert.ok(!payload.text.includes(party.name));
 assert.ok(!payload.text.includes('%'));
});

test('explicit personal sharing retains every list, its rating, coverage and uncertainty',()=>{
 const text=sharePayload(data,result,true).text;
 for(const row of result.rows){
  assert.ok(text.includes(row.name));
  assert.ok(text.includes(`${Math.round(row.score)} %`));
  assert.ok(text.includes(`${row.coverage}/${result.answered} belegt`));
  assert.ok(text.includes(row.rating.label));
  if(row.missing)assert.ok(text.includes(`${Math.floor(row.range.min)}–${Math.ceil(row.range.max)} %`));
 }
 assert.match(text,/Gemeinsames Fraktionsprofil/);
 assert.match(text,/keine Wahlempfehlung/);assert.match(text,/Rechercheversion/);
 assert.ok(text.includes(data.version));
 for(const question of data.questions)assert.ok(!text.includes(question.text));
});

test('sharing does not invent ratings when there are too few answers or break ties',()=>{
 const empty=calculate(data,{});
 const payload=sharePayload(data,empty,true);
 assert.ok(!payload.text.includes('%'));
 assert.ok(!shareCardSvg(data,empty,true).includes('NaN'));
 const neutral=calculate(data,Object.fromEntries(data.questions.filter(q=>q.active).map(q=>[q.id,50])));
 assert.equal((sharePayload(data,neutral,true).text.match(/50 %/g)||[]).length,6);
 assert.equal((shareCardSvg(data,neutral,true).match(/>50 %</g)||[]).length,6);
});

test('personal SVG escapes dataset strings and never includes raw question answers',()=>{
 const custom=structuredClone(result);custom.rows[0].name='<script>unsafe & "name"</script>';
 const svg=shareCardSvg(data,custom,true);
 assert.ok(!svg.includes('<script>'));assert.ok(svg.includes('&lt;script&gt;'));
 assert.ok(svg.includes('&amp;'));assert.ok(svg.includes('&quot;'));
 for(const question of data.questions)assert.ok(!svg.includes(question.text));
 const before=JSON.stringify(result);sharePayload(data,result,true);shareCardSvg(data,result,true);
 assert.equal(JSON.stringify(result),before);
});

test('recipient preview has an absolute image URL and a real 1200 by 630 PNG',async()=>{
 const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
 const imageUrl=html.match(/property="og:image" content="([^"]+)"/)[1];
 assert.equal(new URL(imageUrl).origin,new URL(SHARE_URL).origin);
 assert.ok(html.includes(`rel="canonical" href="${SHARE_URL}"`));
 assert.ok(html.includes(`property="og:url" content="${SHARE_URL}"`));
 assert.ok(!html.includes('wahlinfo.netlify.app'));
 assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
 const png=await readFile(new URL('../public'+new URL(imageUrl).pathname,import.meta.url));
 assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
 const svg=await readFile(new URL('../public/assets/share-preview.svg',import.meta.url),'utf8');
 assert.equal(svg,socialPreviewSvg(data),'Regenerate recipient artwork after changing the election date.');
});
