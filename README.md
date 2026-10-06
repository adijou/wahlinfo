# Düdingen im Blick

Web-App zur politischen Standortbestimmung, umgesetzt in der freigegebenen Gestaltung **C – Klartext**. Statische Website für Netlify, ohne externe Laufzeitbibliotheken, Benutzerkonten oder Speicherung politischer Antworten.

**Stand: Rechercheversion mit funktionierendem Rating für alle sechs Listen.** Fünf beantwortete Fragen ergeben je Liste einen Prozentwert und eine Stufe von «Sehr gut passend» bis «Gar nicht passend». Die Belegbasis, gemeinsame Fraktionsprofile und verbleibende Lücken sind direkt sichtbar. Die unabhängige redaktionelle Gegenprüfung ist offen.

## Enthalten

- Startseite, fünf Fragen mit Antwortskala und Überspringen, Antwortübersicht, Änderungen und Zurücksetzen.
- Vergleich aller sechs amtlichen Listen für die Generalratswahl am **25. Oktober 2026**.
- Je Frage: eigene Antwort, belegte Position, Nähe, Herleitung, Evidenzgrad und Originalquelle mit Seitenangabe.
- Quellenansicht mit Such- und Jahresfilter; Verzeichnis von 28 Protokollen sowie ein Rechercheverzeichnis mit 46 zusätzlich erschlossenen Botschaften, Vorstössen, Einladungen und Beilagen; Publikationszeitraum 2021–2026.
- Rating je Liste auf ihren belegten Antworten, feste Bewertungsstufen, Gewichtungen, Mindestumfang, Gleichstände und mögliche Spannen bei Datenlücken.
- Teilen über die Gerätefunktion bzw. Kopieren oder Textdownload. Keine Einzelantworten im Export.
- Persönlicher Inhaltseditor ausserhalb der öffentlichen Website unter `local-editor/`: Fragen, Parteien, Positionen, Belege, Gewichte, Antworttexte und Parameter; JSON-Import und -Export.
- Datenschutz- und Projektseiten, Fehlerseite, Tastaturbedienung, responsive Ansichten, Netlify-Konfiguration und automatische Tests.

## Lokal ansehen

Node.js 22 oder neuer genügt; keine Abhängigkeiten sind zu installieren.

```sh
npm run dev
```

Dann `http://127.0.0.1:4173` öffnen. Die App benötigt einen lokalen Webserver; direktes Öffnen von `index.html` als Datei funktioniert wegen der Datenabrufe nicht zuverlässig.

```sh
npm test
npm run check:data
npm run build
node scripts/serve.mjs --dist
```

## In Netlify veröffentlichen

Das Repository `adijou/wahlinfo` als bestehendes Projekt importieren:

| Einstellung | Wert |
|---|---|
| Branch | `main` |
| Base directory | leer / Repository-Wurzel |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node | `22` (bereits in `netlify.toml`) |
| Umgebungsvariablen / API-Schlüssel | keine |

Die Einstellungen und Sicherheitsheader sind in `netlify.toml` vorbereitet. Alternativ kann der lokal erzeugte Ordner `dist` per manuellem Upload bereitgestellt werden. Netlify-Deployment wurde im Rahmen dieser Umsetzung **nicht** ausgeführt.

Die aktuelle Fassung bleibt sichtbar eine Rechercheversion und enthält `noindex,nofollow`. Eine Veröffentlichung dieser Vorschau ist technisch möglich, erfüllt aber noch nicht die fachlichen Abnahmekriterien des Pflichtenhefts.

Bei einem fehlerhaften Update den betreffenden GitHub-Commit rückgängig machen und den letzten geprüften Stand erneut bauen/veröffentlichen. Daten und Anwendung sollten immer gemeinsam auf einen passenden Stand zurückgesetzt werden.

## Daten pflegen

1. **Inhalte-pflegen.cmd** im Projektordner doppelklicken (Windows), alternativ `npm run editor` ausführen. Danach `http://127.0.0.1:4174/editor.html` öffnen. Das Fenster bleibt während der Bearbeitung offen.
2. Felder anpassen. Neue Fragen zunächst inaktiv lassen, bis unterschiedliche Positionen ausreichend belegt sind.
3. Mit **Daten prüfen** Quellenkennungen, Fundstellen, Gewichte und Zuordnungen kontrollieren.
4. **Geprüfte Datei herunterladen** wählen; `public/data/politics.json` im Repository damit ersetzen.
5. Datenversion aktualisieren, Änderung mit Quelle im Commit beschreiben, Tests und Build ausführen.

Der Editor wird ausschliesslich vom lokalen Server mit `--editor` ausgeliefert, gebunden an `127.0.0.1`. Er befindet sich nicht in `public/` oder `dist/` und ist auf der öffentlichen Website auch über die direkte Adresse `/editor.html` nicht verfügbar. Ein öffentlicher Loginbereich wird nicht betrieben. Der Quellcode bleibt im öffentlichen GitHub-Repository lesbar; die Trennung betrifft die ausgelieferte Website, keine Geheimhaltung des Programmcodes. Der Editor hat keinen Schreibzugriff auf die veröffentlichte Website. Nicht exportierte Änderungen gehen beim Schliessen verloren. **Entwurf sichern** ermöglicht einen Zwischenstand; fehlerhafte Entwürfe müssen vor dem Import bzw. Build korrigiert werden.

`scripts/prepare-data.py` dokumentiert die ursprüngliche redaktionelle Seed-Erstellung. Nach manuellen Änderungen nicht erneut ausführen: Es würde die JSON-Datei mit diesem ursprünglichen Stand überschreiben. Es ist kein Bestandteil des Builds. Die optionale Recherche benötigt Python und `pypdf`; Endnutzer und Netlify benötigen beides nicht.

## Fachlicher Datenstand

Die sechs Listen sind anhand des [amtlichen Kandidierendenverzeichnisses vom 21.09.2026](https://www.duedingen.ch/_doc/7241566) abgeglichen: Die Mitte, SP, FDP, Freie Wähler Düdingen, SVP sowie Mitte Links/Grüne/glp. Der [amtliche Oktober-Mitteilungsblatt, Seite 3](https://www.duedingen.ch/_doc/7263406), bestätigt den Termin. Die frühere Junge Liste ist keine eigene aktuelle Liste; ihre Positionen werden keiner anderen Partei übertragen.

28 Protokolle und 46 ausgewählte Botschaften, Originalvorstösse, Einladungen und Beilagen (1’031 PDF-Seiten) sind erschlossen und nach den fünf Themen durchsucht, **nicht vollständig ausgewertet**. Die einschlägigen Beratungen in sechs Sitzungen von Dezember 2024 bis Juni 2026 wurden mit den Originalunterlagen abgeglichen. Das [Rechercheverzeichnis](public/data/source-review.json) unterscheidet Suchtreffer von vertieft gelesenen Seiten. 26 von 30 Listen-Frage-Feldern sind auswertbar: 16 eigene Positionen und 10 Zuordnungen aus fünf gemeinsamen Fraktionspositionen. Alle verwendeten Kodierungen haben mittlere Evidenz: eindeutige Fraktionsaussagen oder ausdrücklich zugeordnete Anträge/Vernehmlassungen, keine namentlichen Abstimmungsnachweise. Aus Gesamtresultaten werden keine Parteistimmen errechnet.

FWD und Mitte Links/Grüne/glp erhalten dasselbe ausdrücklich gekennzeichnete **gemeinsame Fraktionsprofil**. Das Rating trennt diese beiden Listen nicht. Eigene Positionen sind bei Mitte und SP für fünf, bei SVP für drei und bei FDP für drei Fragen belegt. Die vier fehlenden Felder bleiben offen; Einzelmeinungen und allgemeine Programme werden nicht zu konkreten Beschlüssen umgedeutet. Eine Lücke sperrt nicht mehr die gesamte Auswertung.

**Korrektur in Version 2026-10-06.4:** FDP beim Ampelversuch von offen auf Dafür (100) gesetzt. Die [Originalmotion, PDF-Seite 4](https://www.duedingen.ch/_doc/7052704#page=4), nennt ausdrücklich den Fraktionsauftrag. Dieser Anhang war zuvor übersehen worden. Alle anderen Werte bleiben nach erneuter Prüfung bestehen; die Belege und Herleitungen wurden ergänzt.

Vor einer fachlichen Freigabe fehlen:

- Weiterführende systematische Auswertung, besonders für die offenen Felder bei FDP und SVP. Nicht vorhandene Belege dürfen nicht ergänzt oder aus allgemeinen Parteiprogrammen abgeleitet werden.
- Redaktionelle Gegenprüfung der Fragen, Interpretationen und historischen Zuordnung.
- Ergänzung der Angaben zum konkreten Hostingbetrieb und dessen Aufbewahrung von Verbindungsdaten. Adrian Schwaller ist als Verantwortlicher mit seinem LinkedIn-Profil als Kontakt eingetragen.
- Abschluss der Prüfung in weiteren Browsern und mit Screenreader, falls eine entsprechende Barrierefreiheitszusage gemacht werden soll.

`release: "published"` wird vom Validator nur akzeptiert, wenn Verantwortlichkeit, bestätigte Wahldaten, dokumentierte Gegenprüfung (`review.reviewer`, `review.date`) und der Mindestumfang an Belegen für jede berücksichtigte Liste vorliegt. Eine technische Prüfung ersetzt keine fachliche Freigabe. Nach dieser Freigabe kann auch die Suchmaschinen-Sperre in `public/index.html` entfernt werden.

## Methodik und Prüfung

Antworten: 100 / 75 / 50 / 25 / 0. Nähe: `100 − |Antwort − Parteiposition|`. Passungswert: gewichteter Mittelwert der **je Liste** belegten beantworteten Fragen. Mindestumfang: zwei Fragen aus zwei Bereichen. Alle Gewichte sind zunächst 1. Fehlende Angaben sind `null`, niemals 0 oder 50. Eine Spanne berechnet für alle beantworteten Fragen die extremen möglichen Werte bei unbekannten Positionen; sie ist kein statistisches Vertrauensintervall. Bei Lücken lautet das Rating «vorläufig». Unterschiedliche Fragen können die Sortierung beeinflussen.

Gerundete Prozente: 80–100 sehr gut, 60–79 gut, 40–59 teilweise, 20–39 wenig, 0–19 gar nicht passend. Keine relative Streckung auf 0–100; lauter mittlere Antworten ergeben bei den aktuellen Ja/Nein-Positionen überall 50 %. Gleiche gerundete Werte teilen den Rang und stehen alphabetisch.

Gemeinsame Fraktionen stehen in `jointGroups` mit Kennung, Name und Listenkennungen. Zugehörige Positionen tragen `scope: "joint-faction"` und `jointGroup`. Der Validator verlangt identische Werte und Belege für die beteiligten Listen. Die App benennt diese Herkunft im Rating, in den Details und im Export.

Siehe [Quellen- und Kodierungsprüfung](docs/DATENPRUEFUNG.md), [Prüfprotokoll](docs/QA.md) und [Gestaltung](DESIGN.md).

Verantwortlich: [Adrian Schwaller](https://ch.linkedin.com/in/adrian-schwaller-9ab92769). Erarbeitet mit der Unterstützung von [digitalbell.ch](https://digitalbell.ch); das Original-Favicon wird lokal mitgeliefert.

Die Seite ruft nur eigene statische Dateien ab. Politische Antworten verbleiben im Arbeitsspeicher des aktuellen Browserdokuments. Keine Cookies, kein Local Storage, kein Tracking, keine extern geladenen Schriften oder Bilder.

## Vorschau

![Desktopansicht](docs/screenshots/desktop.jpg)

[Smartphone-Frage ansehen](docs/screenshots/mobile-frage.jpg)
