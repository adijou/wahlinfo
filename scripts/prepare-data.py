"""Reproducible editorial seed. Positions below were compared with original minutes.
No text extraction or party inference runs in the public application.
"""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'public/data'; out.mkdir(exist_ok=True)
inventory=json.loads((ROOT/'research/inventory.json').read_text(encoding='utf-8'))
protocols=[]
used={'6933562','6933574','6933583','7090243','7272157'}
for item in inventory:
    if not item['title'].startswith('Protokoll'): continue
    for doc in item['documents']:
        if '/_doc/' not in doc['url'] or 'pages' not in doc: continue
        ident=doc['url'].rsplit('/',1)[-1]
        protocols.append({'id':'archiv-'+ident,'title':item['title'],'date':item['published'],'url':doc['url'],'publicationUrl':item['url'],'pages':doc['pages'],'sha256':doc['sha256'],'review':'Ausgewählte Geschäfte im Detail ausgewertet' if ident in used else 'Erfasst; noch nicht vollständig inhaltlich ausgewertet'})
(out/'archive.json').write_text(json.dumps({'updated':'2026-10-06','note':'Das Datum ist das Publikationsdatum im Register. Erfassung bedeutet keine vollständige Inhaltsprüfung. Ein Ende 2020 abgehaltenes Protokoll wurde 2021 publiziert.','documents':protocols},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
parties=[('mitte','Die Mitte'),('fdp','FDP. Die Liberalen'),('fwd','Freie Wähler Düdingen'),('gemeinsam','Gemeinsam weiter (ML-CSP, GLP, Grüne)'),('jld','Junge Liste Düdingen'),('sp','SP Düdingen'),('svp','SVP Düdingen')]
sources=[{'id':'p-'+ident,'title':title,'date':date,'url':'https://www.duedingen.ch/_doc/'+ident,'type':'Generalratsprotokoll','publisher':'Gemeinde Düdingen','retrieved':'2026-10-06'} for ident,date,title in [
('6933562','2025-02-24','Generalratsprotokoll vom 24. Februar 2025'),
('6933574','2025-05-12','Generalratsprotokoll vom 12. Mai 2025'),
('6933583','2025-12-15','Generalratsprotokoll vom 15. Dezember 2025'),
('7090243','2026-04-20','Generalratsprotokoll vom 20. April 2026'),
('7272157','2026-06-29','Generalratsprotokoll vom 29. Juni 2026')]]
sources += [{'id':'listen-2021','title':'Mitteilungsblatt April 2021: Wahllisten und Sitzverteilung','date':'2021-04-01','url':'https://www.duedingen.ch/_docn/3040054/Mitteilungsblatt_April_2021.pdf','type':'Amtliches Mitteilungsblatt','publisher':'Gemeinde Düdingen','retrieved':'2026-10-06'}, {'id':'wahl-faq','title':'FAQ zur Wiederholungswahl am 25. Oktober 2026','date':'2026-10-06','url':'https://www.freie-waehler.ch/faq','type':'Parteiwebsite; Datum des Abrufs','publisher':'Freie Wähler Düdingen','retrieved':'2026-10-06'}]
def unknown(reason='Im ausgewerteten Geschäft fehlt eine eindeutig zuordenbare Fraktionsposition.',scope='unknown',source=None,locator='',page=None):
    return {'value':None,'evidence':'none','status':'checked','scope':scope,'sources':[source] if source else [],'locator':locator,'pdfPage':page,'reason':reason}
def pos(value,reason,source,locator,page):
    return {'value':value,'evidence':'medium','status':'checked','scope':'party','sources':[source],'locator':locator,'pdfPage':page,'reason':reason}
questions=[]
def question(id,topic,text,context,business,source,positions,joint):
    p={k:unknown() for k,n in parties}; p.update(positions)
    for k in ['fwd','gemeinsam']: p[k]=unknown('Nur die gemeinsame Fraktion FWD/glp/ML-CSP/Grüne ist dokumentiert. Daraus wird kein eigener Parteiwert abgeleitet. '+joint['reason'],'joint-faction',source,joint['locator'],joint['pdfPage'])
    questions.append({'id':id,'topic':topic,'text':text,'context':context,'business':business,'active':True,'weight':1,'sources':[source],'positions':p})
question('mietzuschuss','Wohnen', 'Düdingen soll Mietzuschüsse von bis zu 300 Franken pro Monat einführen.',
    'Anspruch hätten Menschen mit Krankenkassen-Prämienverbilligung und mindestens fünf Jahren Wohnsitz in Düdingen. Die Motion von Februar 2025 sah eine Überprüfung nach fünf Jahren vor. Als Finanzierung wurde beispielsweise ein Fonds aus der Liegenschaftssteuer genannt.',
    'Geschäft 147, Ziffer 5.1 · Motion Mietzinsverbilligung','p-6933562',{
    'sp':pos(100,'Die acht SP-Mitglieder reichten die Motion gemeinsam ein; Sandy Weder begründete sie ausdrücklich für die SP.','p-6933562','S. 570–572; PDF-S. 14–16; gemeinsame Motion und Einleitung Sandy Weder',14),
    'mitte':pos(0,'Manuel Aebischer kündigte eine einstimmige Ablehnung der Mitte-Fraktion an. Genannt wurden unter anderem Zuständigkeit, Gleichbehandlung und Finanzierung.','p-6933562','S. 572; PDF-S. 16; Fraktionswortmeldung Manuel Aebischer',16),
    'jld':pos(0,'Sven Krattinger kündigte eine grossmehrheitliche Ablehnung der JLD an. Die Fraktion unterstützte stattdessen den separaten Prüfauftrag zu bezahlbarem Wohnraum. Die persönliche Gegenposition von Sandro Tissi wird nicht der JLD zugerechnet.','p-6933562','S. 572–573; PDF-S. 16–17; Fraktionswortmeldung Sven Krattinger',16)},
    {'reason':'Nathalie Schneuwly kündigte für die gemeinsame Fraktion eine grossmehrheitliche Ablehnung an.','locator':'S. 573; PDF-S. 17','pdfPage':17})
question('basisstufe','Bildung','Düdingen soll ab 2027/28 vier Basisstufenklassen einführen.',
    'In der Basisstufe lernen Kinder aus Kindergarten und den ersten zwei Primarschuljahren gemeinsam. Das Geschäft sah vier Klassen, zusätzliche Lehrpersonen und jährlich höchstens 260’000 Franken sowie einmalig 30’000 Franken vor. Andere Klassen bleiben im bisherigen Modell.',
    'Geschäft 155 · Einführung der Basisstufe','p-6933574',{
    'mitte':pos(100,'Antonietta Burri kündigte die einstimmige Zustimmung der Mitte zum Verpflichtungskredit an.','p-6933574','S. 609–610; PDF-S. 25–26; Fraktionswortmeldung Antonietta Burri',25),
    'jld':pos(100,'Carole Fasel sprach sich im Namen der Jungen Liste ausdrücklich für die Einführung aus.','p-6933574','S. 610–611; PDF-S. 26–27; Fraktionswortmeldung Carole Fasel',26),
    'fdp':pos(100,'David Bossart kündigte eine mehrheitliche Zustimmung der FDP an; die Fraktion verlangte Begleitung und Auswertung und verwies auf wiederkehrende Kosten.','p-6933574','S. 611; PDF-S. 27; Fraktionswortmeldung David Bossart',27),
    'svp':pos(0,'Jürg Mosimann verlangte für die SVP, auf die vorgelegte Einführung zu verzichten und zuerst finanzielle, personelle und räumliche Grundlagen zu schaffen. Dies ist keine generelle Ablehnung des pädagogischen Modells.','p-6933574','S. 611; PDF-S. 27; Fraktionswortmeldung Jürg Mosimann',27),
    'sp':pos(100,'Katharina Dällenbach hielt ausdrücklich fest, dass die SP das Geschäft geschlossen unterstützt.','p-6933574','S. 612–613; PDF-S. 28–29; Fraktionswortmeldung Katharina Dällenbach',28)},
    {'reason':'Die gemeinsame Fraktion unterstützte die Einführung in ihrer Wortmeldung.','locator':'S. 613; PDF-S. 29','pdfPage':29})
question('ampelversuch','Verkehr','Zwischen Bahnhof und Bahnhofzentrum soll eine Fussgängerampel für mindestens sechs Monate getestet werden.',
    'Düdingen sollte diesen Versuch beim Kanton beantragen. Die Motion wurde im Juni 2026 beraten; der Versuch war vor der Umsetzung von VALTRALOC vorgesehen. Zur Debatte standen ein rascher Test, zusätzlicher Aufwand und die Abstimmung mit dem beschlossenen Verkehrsprojekt.',
    'Geschäft 5, Ziffer 5.1 · Motion Ampeln beim Bahnhofzentrum','p-7272157',{
    'mitte':pos(0,'Kuno Werro kündigte eine mehrheitliche Ablehnung durch die Mitte an. Zuerst solle VALTRALOC umgesetzt und danach der Anpassungsbedarf geprüft werden.','p-7272157','S. 36–37; PDF-S. 21–22; Fraktionswortmeldung Kuno Werro',21),
    'sp':pos(0,'Anton Haymoz erklärte die Ablehnung durch die SP. Die Fraktion verwies auf VALTRALOC und die Kosten einer aussagekräftigen Versuchsauswertung.','p-7272157','S. 36; PDF-S. 21; Fraktionswortmeldung Anton Haymoz',21),
    'svp':pos(100,'Adrian Brügger kündigte eine einstimmige Zustimmung der SVP-Fraktion zum Ampelversuch an.','p-7272157','S. 37–38; PDF-S. 22–23; Fraktionswortmeldung Adrian Brügger',22),
    'fdp':unknown('Herbert Stadler (FDP) reichte die Motion ein und begründete sie. Der Text weist diese inhaltliche Position jedoch nicht ausdrücklich als Beschluss der ganzen FDP-Fraktion aus. Der Verschiebungsantrag der Fraktion belegt keine Zustimmung zum Inhalt.','individual','p-7272157','S. 34–35 und 38; PDF-S. 19–20 und 23',19)},
    {'reason':'Die gemeinsame Fraktion lehnte den Versuch in der vorgelegten Form ab.','locator':'S. 37; PDF-S. 22','pdfPage':22})
question('referendum','Mitbestimmung','Bei neuen Gemeindeausgaben soll ein Referendum bereits bei einem Nettobetrag über 250’000 Franken möglich sein.',
    'Im Dezember 2025 wurde die bisherige Grenze von 5 Millionen Franken diskutiert. Ein Referendum ermöglicht eine Volksabstimmung, wenn genügend gültige Unterschriften gesammelt werden. Es löst nicht automatisch eine Abstimmung aus. Gefragt ist hier der konkrete Schwellenwert von 250’000 Franken.',
    'Geschäft 174 · Teilrevision Finanzreglement, Artikel 13','p-6933583',{
    'fdp':pos(100,'Die im Protokoll zusammengefasste Vernehmlassung nennt ausdrücklich den Vorschlag der FDP, die Schwelle auf 250’000 Franken zu senken. Die spätere Wortmeldung des Motionärs befürwortete als Kompromiss auch eine Million.','p-6933583','S. 674 und 677; PDF-S. 27 und 30; dokumentierte Vernehmlassung der FDP',27),
    'sp':pos(0,'Die dokumentierte Vernehmlassung der SP schlug 2,5 Millionen Franken vor und somit nicht die hier abgefragten 250’000 Franken. Der konkrete Schwellenwert ist eine redaktionelle Ja/Nein-Kodierung dieses Vorschlags.','p-6933583','S. 674; PDF-S. 27; dokumentierte Vernehmlassung der SP',27),
    'mitte':pos(0,'Nicolas Bapst bezeichnete 250’000 Franken ausdrücklich als zu tief. Die Mitte-Fraktion beantragte eine Grenze von 3 Millionen Franken.','p-6933583','S. 678–679; PDF-S. 31–32; Änderungsantrag der Mitte-Fraktion',31)},
    {'reason':'In der Vernehmlassung sprach sich die Mehrheit für 5 Millionen oder allenfalls 2 bis 2,5 Millionen Franken aus. Einzelne Mitglieder befürworteten eine Million.','locator':'S. 674; PDF-S. 27','pdfPage':27})
question('schulplanung','Bildung','Die Schulhausplanung Wolfacker soll warten, bis eine Gesamtstrategie für die Sporthallen vorliegt.',
    'Im April 2026 ging es um den Projektierungskredit für ein Schulhaus mit ausserschulischer Betreuung und Einfachsporthalle. Die SVP verlangte eine Rückweisung wegen der noch offenen Sporthallenstrategie. Der Bedarf an zusätzlichen Schulräumen war dabei unbestritten.',
    'Geschäft 188 · Rückweisungsantrag zum Projektierungskredit Wolfacker','p-7090243',{
    'svp':pos(100,'Marco Zbinden beantragte namens der SVP-Fraktion die Rückweisung. Die Sporthallenstrategie solle zuerst die mögliche kantonale Sonderschule berücksichtigen.','p-7090243','S. 748–749; PDF-S. 28–29; Rückweisungsantrag SVP',28),
    'mitte':pos(0,'Patrick Bächler unterstützte für die Mitte die sofortige Weiterplanung inklusive Einfachsporthalle und kündigte Zustimmung zum Projektierungskredit an.','p-7090243','S. 749; PDF-S. 29; Fraktionswortmeldung Patrick Bächler',29),
    'sp':unknown('Eliane Aebischer sprach sich gegen die Rückweisung aus. Ihre Aussage über die gesamte SP-Fraktion bezieht sich ausdrücklich auf zusätzliche Hallen; eine verbindliche Fraktionsposition zur konkreten Rückweisung wird daraus nicht abgeleitet.','individual','p-7090243','S. 749–750; PDF-S. 29–30',29),
    'fdp':unknown('David Bossart äusserte Vorbehalte der FDP zum Umfang des Neubaus, aber keine eindeutige Position der Fraktion zur Rückweisung wegen der Sporthallenstrategie.','unknown','p-7090243','S. 750; PDF-S. 30',30)},
    {'reason':'Benedikt Fasel lehnte für die gemeinsame Fraktion die Rückweisung ab und kündigte einstimmige Zustimmung zum Kredit an.','locator':'S. 750–751; PDF-S. 30–31','pdfPage':30})
data={'schemaVersion':1,'version':'2026-10-06.1','updated':'2026-10-06','title':'Düdingen im Blick','release':'research-preview','operator':{'name':'','contact':''},'election':{'date':'2026-10-25','note':'Termin gemäss Auftrag und FAQ der Freien Wähler. Amtliche Wahlanordnung und definitive Listen zur Wiederholungswahl sind vor Freigabe noch abzugleichen.','source':'wahl-faq'},'method':{'minQuestions':4,'minTopics':3},'answerLabels':['Stimme voll zu','Stimme eher zu','Teils / teils','Stimme eher nicht zu','Stimme überhaupt nicht zu'],'parties':[{'id':k,'name':n,'comparable':True,'note':'Historische Wahlliste 2021; Teilnahme und Bezeichnung im Oktober 2026 noch zu bestätigen.'} for k,n in parties],'sources':sources,'questions':questions}
data['version']='2026-10-06.2'
data['sources']=[s for s in data['sources'] if s['id']!='wahl-faq']
data['sources'] += [
    {'id':'wahl-2026','title':'Bereinigte Wahlvorschläge: Generalrat am 25. Oktober 2026','date':'2026-09-21','url':'https://www.duedingen.ch/_doc/7241566','type':'Amtliches Kandidierendenverzeichnis','publisher':'Gemeinde Düdingen','retrieved':'2026-10-06'},
    {'id':'wahltermin-2026','title':'Mitteilungsblatt Oktober 2026: Generalratswahlen (Seite 3)','date':'2026-10-01','url':'https://www.duedingen.ch/_doc/7263406','type':'Amtliches Mitteilungsblatt','publisher':'Gemeinde Düdingen','retrieved':'2026-10-06'}]
data['election']={'date':'2026-10-25','verified':True,'listsVerified':True,'note':'Termin im amtlichen Mitteilungsblatt Oktober 2026, Seite 3, bestätigt. Die sechs Listen wurden mit den bereinigten Wahlvorschlägen vom 21. September 2026 abgeglichen.','source':'wahl-2026','dateSource':'wahltermin-2026'}
data['historicalProfiles']=[{'id':'jld','name':'Junge Liste Düdingen','note':'In der amtlichen Liste für den 25. Oktober 2026 keine eigene Wahlliste. Frühere Positionen werden keiner anderen Partei übertragen.','positions':{q['id']:q['positions'].pop('jld') for q in data['questions']}}]
data['parties']=[p for p in data['parties'] if p['id']!='jld']
for p in data['parties']:
    p['listNumber']={'mitte':1,'sp':2,'fdp':3,'fwd':4,'svp':5,'gemeinsam':7}[p['id']]
    p['sources']=['wahl-2026'];p['note']=f"Liste {p['listNumber']} der Generalratswahl vom 25. Oktober 2026. Verglichen werden dokumentierte frühere Positionen, keine Wahlversprechen."
    if p['id']=='gemeinsam':p['name']='Mitte Links, Grüne, glp';p['note']+=' Historische Liste 2021: Gemeinsam weiter (ML-CSP, GLP, GP).'
(out/'politics.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f"{len(questions)} questions, {len(data['parties'])} current parties, {len(protocols)} protocol entries")
