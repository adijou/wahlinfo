import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
const root = path.resolve(process.argv.includes('--dist') ? 'dist' : 'public');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png'};
http.createServer(async (req,res) => {
  try {
    const pathname=decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file=path.resolve(root, '.'+pathname+(pathname.endsWith('/')?'index.html':''));
    if (!file.startsWith(root+path.sep)) { res.writeHead(403); res.end(); return; }
    const body=await readFile(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(body);
  } catch {
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
    try {res.end(await readFile(path.join(root,'404.html')));} catch {res.end('Nicht gefunden');}
  }
}).listen(port,'127.0.0.1',()=>console.log(`Vorschau: http://127.0.0.1:${port}`));
