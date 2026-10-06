import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { validateData, calculate } from '../public/engine.js';
export async function checkDataFile() {
  const data=JSON.parse(await readFile('public/data/politics.json','utf8'));
  const errors=validateData(data);
  if(errors.length) throw new Error(errors.join('\n'));
  const r=calculate(data,Object.fromEntries(data.questions.map(q=>[q.id,100])));
  console.log(`${data.questions.filter(q=>q.active).length} aktive Fragen, ${data.parties.length} Parteien/Listen, ${data.sources.length} Quellen. Gemeinsame Vergleichsbasis: ${r.common.length} Fragen.`);
  return data;
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) await checkDataFile();
