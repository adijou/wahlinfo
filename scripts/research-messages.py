"""Retrieve public source attachments relevant to the five questions, without coding positions.

Inputs: municipality inventory from research.py. Outputs remain in ignored research/.
Includes parliamentary-motion bundles to catch source texts whose title omits the topic.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor
from pypdf import PdfReader
import json, re, hashlib

ROOT=Path(__file__).resolve().parents[1]
R=ROOT/'research'
inventory=json.loads((R/'inventory.json').read_text(encoding='utf-8'))
selected={}
dates=['241209','250224','250512','251215','260420','260629']
for entry in inventory:
    for doc in entry.get('documents',[]):
        title=doc['title']
        relevant=re.search(r'Ampel|Mietzins|Basisstuf|Volksrecht|Finanzreglement|Wolfacker|Parlamentar',title,re.I)
        agenda='Traktandenliste' in title and any(date in title for date in dates)
        if not (relevant or agenda) or re.search(r'Photovoltaik|Protokoll|\.zip|5301316',title,re.I): continue
        url=doc['url']
        if urlparse(url).hostname!='www.duedingen.ch' or not re.search(r'/_doc/\d+$',url): continue
        selected[url]={'title':title,'url':url,'published':entry['published'],'publicationUrl':entry['url']}

def retrieve(record):
    ident=record['url'].rsplit('/',1)[-1]
    path=R/'raw'/f'{ident}.pdf'
    try:
        if not path.exists():
            with urlopen(Request(record['url'],headers={'User-Agent':'Wahlinfo public source review'}),timeout=20) as response:
                content=response.read()
            if not content.startswith(b'%PDF'): raise ValueError('Not a PDF')
            path.write_bytes(content)
        pages=PdfReader(path).pages
        parts=[p.extract_text() or '' for p in pages]
        output=R/'text'/f'{ident}.txt'
        output.write_text('\n\n'.join(f'=== PDF PAGE {n+1} ===\n{s}' for n,s in enumerate(parts)),encoding='utf-8')
        record.update(id=ident,pages=len(pages),sha256=hashlib.sha256(path.read_bytes()).hexdigest(),textFile=output.relative_to(ROOT).as_posix(),emptyPages=[n+1 for n,s in enumerate(parts) if len(s.strip())<40])
        print(f'{ident}: {len(pages)} pages; nearly empty {record["emptyPages"]}',flush=True)
    except Exception as exc:
        record['error']=str(exc)
        print(f'ERROR {ident}: {exc}',flush=True)
    return record

print(f'Selected {len(selected)} source documents',flush=True)
with ThreadPoolExecutor(max_workers=3) as pool:
    results=list(pool.map(retrieve,selected.values()))
(R/'messages-inventory.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
failures=sum('error' in x for x in results)
print(f'Completed: {len(results)-failures} documents, {sum(x.get("pages",0) for x in results)} pages, {failures} failures',flush=True)
if failures: raise SystemExit(1)
