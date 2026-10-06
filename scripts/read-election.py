"""Download only public municipal election information for source verification."""
from urllib.request import urlopen,Request
from urllib.parse import urljoin
from html.parser import HTMLParser
from pathlib import Path
class Links(HTMLParser):
    def __init__(self):super().__init__();self.links=[];self.a=None
    def handle_starttag(self,t,a):
        if t=='a':self.a=[dict(a).get('href',''),'']
    def handle_data(self,t):
        if self.a is not None:self.a[1]+=t
    def handle_endtag(self,t):
        if t=='a' and self.a:
            self.links.append(self.a);self.a=None
url='https://www.duedingen.ch/_rtr/mitteilungsblatt'
with urlopen(Request(url,headers={'User-Agent':'Wahlinfo source verification'}),timeout=30) as r: html=r.read().decode('utf-8')
Path('research/election-bulletins.html').write_text(html,encoding='utf-8')
p=Links();p.feed(html)
for href,title in p.links:
    if '2026' in title or 'Oktober' in title or 'September' in title:print(title.strip(),urljoin(url,href))
from pypdf import PdfReader
import io
bulletin='https://www.duedingen.ch/_rte/publikation/642685'
with urlopen(bulletin,timeout=30) as r: html=r.read().decode('utf-8')
p=Links();p.feed(html)
for href,title in p.links:
    if '/_doc/' not in href and not ('/_docn/' in href and 'Mitteilungsblatt' in href):continue
    link=urljoin(bulletin,href)
    print(title,link)
    with urlopen(link,timeout=30) as r: raw=r.read()
    if raw.startswith(b'%PDF'):
        Path('research/raw/bulletin-october-2026.pdf').write_bytes(raw)
        text='\n\n'.join(f'=== PDF PAGE {i+1} ===\n'+(p.extract_text() or '') for i,p in enumerate(PdfReader(io.BytesIO(raw)).pages))
        Path('research/text/bulletin-october-2026.txt').write_text(text,encoding='utf-8')
        print('Saved October bulletin')
election='https://www.duedingen.ch/wahlergebnisse/2962723'
with urlopen(election,timeout=30) as r: html=r.read().decode('utf-8')
Path('research/election-page.html').write_text(html,encoding='utf-8')
p=Links();p.feed(html)
for href,title in p.links:
    if '/_doc/' not in href and '/_docn/' not in href: continue
    if '5301316' in href:continue
    link=urljoin(election,href);print(title.strip(),link,flush=True)
    if any(word in title.lower() for word in ['liste','kandid']):
        with urlopen(link,timeout=30) as r:raw=r.read()
        if raw.startswith(b'%PDF'):
            key=link.rsplit('/',1)[-1].replace('.pdf','')
            Path('research/raw/election-'+key+'.pdf').write_bytes(raw)
            text='\n\n'.join(f'=== PDF PAGE {i+1} ===\n'+(p.extract_text() or '') for i,p in enumerate(PdfReader(io.BytesIO(raw)).pages))
            Path('research/text/election-'+key+'.txt').write_text(text,encoding='utf-8')
