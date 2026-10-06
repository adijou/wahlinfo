"""Read-only retrieval of the public Generalrat archive. No political coding is automatic."""
from pathlib import Path
from html import unescape
from html.parser import HTMLParser
from urllib.request import urlopen, Request
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor
import json, re, hashlib, time
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
R=ROOT/'research'; (R/'raw').mkdir(parents=True,exist_ok=True); (R/'text').mkdir(exist_ok=True)
BASE='https://www.duedingen.ch'
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.links=[]; self.entities=[]; self.a=None; self.parts=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if 'data-entities' in d: self.entities.append(d['data-entities'])
        if tag=='a': self.a=[d.get('href',''),'']
    def handle_data(self,t):
        self.parts.append(t)
        if self.a is not None: self.a[1]+=t
    def handle_endtag(self,tag):
        if tag=='a' and self.a is not None: self.links.append(self.a); self.a=None
def fetch(url):
    if urlparse(url).hostname!='www.duedingen.ch': raise ValueError('Only municipality documents allowed')
    for attempt in range(3):
        try:
            with urlopen(Request(url,headers={'User-Agent':'Wahlinfo source research / public documents'}),timeout=45) as res: return res.read()
        except Exception:
            if attempt==2: raise
            time.sleep(1+attempt)
def parse(b):
    p=Parser(); p.feed(b.decode('utf-8')); return p

registry=R/'registry.html'
if not registry.exists(): registry.write_bytes(fetch(BASE+'/publikationengeneralrat'))
p=parse(registry.read_bytes())
entries=[]
for entity in p.entities:
    obj=json.loads(entity)
    for row in obj.get('data',[]):
        if not '2021-01-01'<=row.get('_datum','')<='2026-10-06': continue
        a=Parser(); a.feed(row['name'])
        if a.links:
            href,title=a.links[0]; entries.append({'title':title,'published':row['_datum'],'url':urljoin(BASE,href)})
print('Archive entries:',len(entries),flush=True)
def process(e):
    try:
        ident=e['url'].rsplit('/',1)[-1]; file=R/'raw'/f'{ident}.html'
        if not file.exists(): file.write_bytes(fetch(e['url']))
        p=parse(file.read_bytes()); e['documents']=[]
        (R/'text'/f'page-{ident}.txt').write_text('\n'.join(p.parts),encoding='utf-8')
        seen=set()
        for href,title in p.links:
            if not ('/_doc/' in href or '/_docn/' in href) or '5301316' in href or href in seen: continue
            seen.add(href); e['documents'].append({'title':title.strip(),'url':urljoin(BASE,href)})
        # Protocol publications have one full protocol PDF. Other attachment links are inventoried.
        if e['title'].startswith('Protokoll'):
            for d in e['documents']:
                if d['title'].lower()=='download': continue
                did=re.sub(r'[^a-zA-Z0-9_-]','_',d['url'].split('/')[-1])
                pdf=R/'raw'/f'{did}.pdf'
                if not pdf.exists(): pdf.write_bytes(fetch(d['url']))
                if not pdf.read_bytes().startswith(b'%PDF'): continue
                d['sha256']=hashlib.sha256(pdf.read_bytes()).hexdigest()
                pages=PdfReader(pdf).pages
                texts=[x.extract_text() or '' for x in pages]
                d['pages']=len(pages)
                d['textFile']=f'research/text/{did}.txt'
                (R/'text'/f'{did}.txt').write_text('\n\n'.join(f'=== PDF PAGE {i+1} ===\n{t}' for i,t in enumerate(texts)),encoding='utf-8')
        e['retrieved']='2026-10-06'; e['status']='inventoried'
        print(e['title'],len(e['documents']),flush=True)
    except Exception as ex: e['error']=str(ex); print('ERROR',e['title'],str(ex),flush=True)
    return e
with ThreadPoolExecutor(max_workers=3) as pool: inventory=list(pool.map(process,entries))
(R/'inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')
print('Saved inventory',len(inventory),'entries',sum(bool(e.get('error')) for e in inventory),'errors',flush=True)
