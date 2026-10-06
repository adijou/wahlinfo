import { mkdir, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { checkDataFile } from './check-data.mjs';
export async function buildSite(workspace=process.cwd()) {
  const output=path.resolve(workspace,'dist');
  // Only the generated dist directory below this workspace may be replaced.
  if(path.dirname(output)!==path.resolve(workspace)||path.basename(output)!=='dist') throw new Error('Ungültiges Ausgabeverzeichnis.');
  await rm(output,{recursive:true,force:true});
  await mkdir(output,{recursive:true});
  await cp(path.join(workspace,'public'),output,{recursive:true});
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(import.meta.dirname,'build.mjs')) {
  await checkDataFile();
  await buildSite();
  console.log('Öffentliche Website in dist erstellt. Der lokale Editor wird nicht veröffentlicht.');
}
