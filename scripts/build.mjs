import { mkdir, cp } from 'node:fs/promises';
import { checkDataFile } from './check-data.mjs';
await checkDataFile();
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
console.log('Statische Website in dist erstellt.');
