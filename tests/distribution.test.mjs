import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,access,rm} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {buildSite} from '../scripts/build.mjs';

test('public builds remove stale editor files and preserve the local editor',async()=>{
 const workspace=await mkdtemp(path.join(os.tmpdir(),'wahlinfo-build-'));
 try {
  await Promise.all(['public','local-editor','dist'].map(dir=>mkdir(path.join(workspace,dir))));
  await writeFile(path.join(workspace,'public/index.html'),'Public website');
  await writeFile(path.join(workspace,'local-editor/editor.html'),'Personal editor');
  for(const file of ['editor.html','editor.js','obsolete.html'])await writeFile(path.join(workspace,'dist',file),'Old published file');
  await buildSite(workspace);
  assert.equal(await readFile(path.join(workspace,'dist/index.html'),'utf8'),'Public website');
  for(const file of ['editor.html','editor.js','obsolete.html'])await assert.rejects(access(path.join(workspace,'dist',file)),{code:'ENOENT'});
  assert.equal(await readFile(path.join(workspace,'local-editor/editor.html'),'utf8'),'Personal editor');
  await buildSite(workspace);
  assert.equal(await readFile(path.join(workspace,'dist/index.html'),'utf8'),'Public website');
 } finally {
  if(path.dirname(workspace)!==path.resolve(os.tmpdir())||!path.basename(workspace).startsWith('wahlinfo-build-'))throw new Error('Unexpected test directory');
  await rm(workspace,{recursive:true,force:true});
 }
});

test('repository serves no editor in public files',async()=>{
 const root=new URL('../',import.meta.url);
 for(const file of ['editor.html','editor.js']){
  await assert.rejects(access(new URL('public/'+file,root)),{code:'ENOENT'});
  await access(new URL('local-editor/'+file,root));
 }
 const index=await readFile(new URL('public/index.html',root),'utf8');
 assert.ok(!index.includes('editor.html'));
});
