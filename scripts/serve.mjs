import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
const production=process.argv.includes('--dist');
const editor=process.argv.includes('--editor')&&!production;
const root = path.resolve(production ? 'dist' : 'public');
const port = Number(process.env.PORT || (editor?4174:4173));
const editorFiles=new Map([['/editor.html','editor.html'],['/editor.js','editor.js']]);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png'};
http.createServer(async (req,res) => {
  try {
    const pathname=decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const privateFile=editor&&editorFiles.get(pathname);
    const file=privateFile?path.resolve('local-editor',privateFile):path.resolve(root, '.'+pathname+(pathname.endsWith('/')?'index.html':''));
    if (!privateFile&&!file.startsWith(root+path.sep)) { res.writeHead(403); res.end(); return; }
    const body=await readFile(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(body);
  } catch {
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
    try {res.end(await readFile(path.join(root,'404.html')));} catch {res.end('Nicht gefunden');}
  }
}).listen(port,'127.0.0.1',()=>console.log(`${editor?'Persönlicher Inhaltseditor':'Vorschau'}: http://127.0.0.1:${port}${editor?'/editor.html':''}`));
