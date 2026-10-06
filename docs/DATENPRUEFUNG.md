# Quellen- und Kodierungsprüfung

Stand: 06.10.2026, Datensatz 2026-10-06.4. KI-gestützter Abgleich mit extrahiertem Originaltext; unabhängige redaktionelle Gegenprüfung offen.

## Rechercheumfang

Das kommunale [Publikationsregister](https://www.duedingen.ch/publikationengeneralrat) lieferte 88 Einträge im Publikationszeitraum Januar 2021 bis 6. Oktober 2026. Daraus wurden 28 vollständige Protokolle heruntergeladen, textlich erschlossen und mit SHA-256-Prüfsumme inventarisiert. Eines betrifft Dezember 2020 und wurde 2021 publiziert. `public/data/archive.json` enthält das prüfbare Verzeichnis. Erfassung und Textextraktion bedeuten ausdrücklich keine vollständige inhaltliche Auswertung.

Zusätzlich wurden 46 ausgewählte Botschaften, Originalvorstösse, Einladungen und Beilagen heruntergeladen, extrahiert und inventarisiert. Die Auswahl schliesst die allgemein betitelten Bündel parlamentarischer Vorstösse ein, damit ein fehlendes Themenwort im Dateinamen nicht zum Ausschluss führt. Zusammen umfassen diese Dokumente 1’031 PDF-Seiten. Alle 74 Dokumente wurden nach den fünf Themen durchsucht. [Rechercheverzeichnis mit Suchbegriffen, Treffern und vertieft gelesenen Seiten](../public/data/source-review.json). Suchtreffer sind nur eine Vorauswahl; Antrags- und Fraktionszuordnung erfordern die zusammenhängende Lektüre.

Erneut vertieft gelesen wurden die relevanten Geschäfte in den Protokollen vom 09.12.2024, 24.02.2025, 12.05.2025, 15.12.2025, 20.04.2026 und 29.06.2026. Die Originalmotionen, Botschaften und sechs Einladungen wurden zur Identifikation des Geschäfts, seiner Urheberschaft und der Beratungsfolge beigezogen. Bei der Ampelmotion wurden Begehren und Fraktionsauftrag zusätzlich am gerenderten Original geprüft. Andere Auszüge dienten der Vorauswahl. Das Register enthält auch Botschaften/Beschlüsse vom 05.10.2026; ein entsprechendes vollständiges Protokoll war bei der Erfassung noch nicht enthalten. Ältere Jahrgänge sind für die Fortsetzung offen.

Die Auswahl ist keine repräsentative Zufallsstichprobe: vier Bereiche, darunter zwei Bildungsfragen, mit je einer Gewichtung von 1. Mehrjährige Entwicklung einer Position wird bislang nicht modelliert. Der Anspruch «systematische vollständige Analyse der letzten fünf Jahre» ist mit diesem Stand noch nicht erfüllt.

## Aktuelle Listen

Amtliche Quelle: [Bereinigte Wahlvorschläge, 21.09.2026](https://www.duedingen.ch/_doc/7241566), 12 PDF-Seiten.

| Nr. | Liste | PDF-Seiten |
|---|---|---|
| 1 | Die Mitte | 1–2 |
| 2 | Sozialdemokratische Partei | 3–4 |
| 3 | FDP. Die Liberalen | 5–7 |
| 4 | Freie Wähler Düdingen | 8–9 |
| 5 | Schweizerische Volkspartei | 10–11 |
| 7 | Mitte Links, Grüne, glp | 12 |

Das [Mitteilungsblatt Oktober 2026](https://www.duedingen.ch/_doc/7263406), Seite 3, bestätigt den 25.10.2026 und verlinkt die Wahlseite `/wahlergebnisse/2962723`. Im ersten Arbeitsstand waren sieben historische Listen berücksichtigt. Nach amtlichem Abgleich wurde die Junge Liste aus dem aktuellen Vergleich entfernt. Ihre früheren Positionen bleiben lediglich im Metadatenfeld `historicalProfiles` archiviert und werden nicht auf Parteien früherer Mitglieder übertragen.

## Kodierungsmatrix

Ja/Nein beziehen sich ausschliesslich auf die konkrete Aussage samt Hintergrund im Fragebogen. «Gemeinsam» bedeutet: für beide Listen verwendetes gemeinsames Fraktionsprofil, kein separat belegter Parteibeschluss. «Offen» ist keine neutrale politische Position.

| Frage | Mitte | FDP | FWD | Mitte Links / Grüne / glp | SP | SVP |
|---|---|---|---|---|---|---|
| Mietzuschuss bis CHF 300 | Nein | Offen | Nein (gemeinsam) | Nein (gemeinsam) | Ja | Offen |
| Vier Basisstufenklassen | Ja | Ja | Ja (gemeinsam) | Ja (gemeinsam) | Ja | Nein |
| Versuch Fussgängerampel | Nein | Ja (Fraktionsmotion) | Nein (gemeinsam) | Nein (gemeinsam) | Nein | Ja |
| Referendumsschwelle CHF 250’000 | Nein | Ja | Nein (gemeinsam) | Nein (gemeinsam) | Nein | Offen |
| Schulplanung zurückstellen | Nein | Offen | Nein (gemeinsam) | Nein (gemeinsam) | Nein (2024) | Ja |

26 von 30 Feldern sind auswertbar: 16 eigene Positionen und 10 Zuordnungen aus fünf gemeinsamen Fraktionspositionen. Diese zehn Felder sind keine zehn unabhängigen Belege. Alle verwendeten Positionen haben **mittlere Evidenz**. Vier Felder bleiben offen (FDP: Wohnen, Schulplanung; SVP: Wohnen, Referendum).

## Fundstellen und kritische Abgrenzungen

- **Mietzuschüsse:** [24.02.2025](https://www.duedingen.ch/_doc/6933562), Geschäft 147/5.1, gedruckte S. 570–574, PDF-S. 14–18. Gemeinsame Motion der acht SP-Mitglieder; Mitte kündigt einstimmige Ablehnung an. Das separate Postulat zu bezahlbarem Wohnraum wird nicht mit der Mietsubvention vermischt. Sandro Tissi bezeichnet seine Wortmeldung ausdrücklich als persönlich. [Originalmotion](https://www.duedingen.ch/_doc/5506873), PDF-S. 1–2, und [Botschaft](https://www.duedingen.ch/_doc/5506870), PDF-S. 1–2, bestätigen Begehren und SP-Urheberschaft. Für FDP und SVP ergeben sich daraus keine eigenen Fraktionspositionen.
- **Basisstufe:** [12.05.2025](https://www.duedingen.ch/_doc/6933574), Geschäft 155, S. 609–613, PDF-S. 25–29. Mitte und SP unterstützen, FDP mehrheitlich; SVP fordert vor der vorgelegten Einführung weitere Grundlagen. Das ist keine grundsätzliche Ablehnung altersgemischten Lernens. Kredit: jährlich maximal CHF 260’000 und einmalig CHF 30’000. Ein Zwischenentwurf enthielt irrtümlich CHF 130’000; gegen den Beschlusstext auf PDF-S. 29 korrigiert. Erneut gegen die [Botschaft](https://www.duedingen.ch/_doc/5652190), PDF-S. 1–3, abgeglichen. Diese beschreibt die Vorlage und die Position der Exekutive; die Parteihaltungen stammen aus der Debatte.
- **Ampelversuch:** [29.06.2026](https://www.duedingen.ch/_doc/7272157), Geschäft 5.1, S. 34–38, PDF-S. 19–23. SP und Mitte lehnen ab, SVP stimmt zu. **FDP klar dafür:** Die [Originalmotion vom 16.01.2026](https://www.duedingen.ch/_doc/7052704#page=4) verlangt auf PDF-S. 1 einen Versuch von mindestens sechs Monaten. PDF-S. 4 nennt ausdrücklich «Im Namen der Fraktion FDP.Die Liberalen». Herbert Stadler handelt damit als Verfasser einer Fraktionsmotion. Die [Botschaft vom 29.06.2026](https://www.duedingen.ch/_doc/7052701), PDF-S. 1–2, erläutert den Antrag und die Vertagung vom April auf Juni auf FDP-Antrag. Das Protokoll hält auf PDF-S. 20 den Versand der Erläuterungen durch den FDP-Präsidenten fest; auf PDF-S. 22 heisst es ausdrücklich Motion der FDP. Der Originalanhang war in Version .3 übersehen worden. Die Korrektur beruht auf dieser eindeutigen Urheberschaft, nicht auf einer Lockerung der Kriterien, dem Vertagungsantrag oder einem allgemeinen Parteiprogramm.
- **Referendum:** [15.12.2025](https://www.duedingen.ch/_doc/6933583), Geschäft 174, S. 674, 677–679, PDF-S. 27, 30–32. Fraktionsvernehmlassung FDP: CHF 250’000; SP: CHF 2,5 Mio.; Mitte bezeichnet CHF 250’000 ausdrücklich als zu tief und beantragt CHF 3 Mio. «Nein» zur exakt abgefragten Schwelle ist eine transparente redaktionelle Kodierung. Die Zustimmung zu einer allgemeinen Senkung wird nicht mit Zustimmung zu CHF 250’000 gleichgesetzt. Abstimmungsresultate über CHF 1 bzw. 3 Mio. liefern keine separaten Parteistimmen. Die [Originalmotion](https://www.duedingen.ch/_doc/5419264), PDF-S. 1, ist ausdrücklich im Namen der FDP-Fraktion eingereicht. Die [Botschaft](https://www.duedingen.ch/_doc/6372593), PDF-S. 2, bestätigt die drei Vernehmlassungen. Ergänzend begründet Patrick Schneuwly am 09.12.2024, PDF-S. 33–34, die grossmehrheitliche SP-Ablehnung ausdrücklich am Beispiel von CHF 250’000. Die spätere Unterstützung eines Kompromisses von CHF 1 Mio. durch Herbert Stadler ersetzt nicht die dokumentierte FDP-Präferenz.
- **Schulplanung:** [20.04.2026](https://www.duedingen.ch/_doc/7090243), Geschäft 188, S. 748–751, PDF-S. 28–31. SVP verlangt Rückweisung für eine Gesamtstrategie zu Sporthallen. Mitte unterstützt sofortige Weiterplanung. Die FDP äussert Bedenken, ohne eindeutige Aussage zur Rückweisung. Ergänzung: [09.12.2024](https://www.duedingen.ch/_doc/6933559), Geschäft 137, S. 533–534, PDF-S. 15–16: Eliane Aebischer spricht ausdrücklich im Namen der SP und erklärt die geschlossene Unterstützung der Planung sowie Ablehnung der Rückweisung. Dieser frühere Fraktionsstandpunkt stützt den Wert 0 zur grundsätzlichen Reihenfolge der Planung; er wird nicht als Abstimmungsnachweis für April 2026 ausgegeben. Die Frage und ihr Kontext nennen beide Beratungszeitpunkte. Die Botschaften [2024](https://www.duedingen.ch/_doc/5419237), PDF-S. 1–3, und [2026](https://www.duedingen.ch/_doc/6910852), PDF-S. 1–2, klären die verschiedenen Planungsschritte. Die FDP erklärt am 09.12.2024, PDF-S. 17, ausdrücklich Stimmfreigabe; die Wortmeldung vom April 2026, PDF-S. 30–31, liefert keinen eindeutigen Fraktionsentscheid zur Rückweisung.

Die zu jeder einzelnen Position gespeicherte Fundstelle und Begründung ist die massgebliche Arbeitsgrundlage. Gemeinsame Fraktionsaussagen zählen seit Version .3 als explizit gekennzeichnetes gemeinsames Profil. Die Fraktionsablehnung einer Grenze von CHF 250’000 ist zusätzlich am 09.12.2024, S. 551, PDF-S. 33 ausdrücklich dokumentiert (Philippe Bossart). Identische Profilwerte und Belege werden technisch erzwungen. Bei der Schulplanung zählt für das gemeinsame Profil der aktuellere Stand 2026 (Ablehnung der Rückweisung), nicht die 2024 noch gespaltene Haltung.

## Ergebnis der Nachprüfung .4

Alle 30 Listen-Frage-Felder wurden erneut beurteilt. Geändert wurde ein Wert: FDP/Ampelversuch von `null` auf `100`, Herkunft von Einzelperson auf Fraktionsmotion. Die übrigen 25 auswertbaren Werte bleiben bestehen. Die vier offenen Felder erhalten nun konkrete Such- und Fundstellen statt einer pauschalen Meldung. Sie bleiben offen, weil weder Schweigen, Stimmfreigabe noch eine Aussage der Exekutive eine klare Parteiposition ersetzen.

Die Einladungen bestätigen Termine und Traktanden, nicht die politische Haltung. Botschaften belegen die Vorlage und ausdrücklich referierte Stellungnahmen; eine Empfehlung des Gemeinderats gilt nicht automatisch für dessen Parteien. Wiederabdrucke derselben Motion und die Übernahme der Botschaft ins Protokoll sind keine unabhängigen zweiten Beweise. Die Korrektur verändert ausschliesslich die Datengrundlage und Herleitung, nicht die Bewertungsformel.

## Änderung der Auswertung in .3

Die frühere Sperre bis zu vier für alle Listen gemeinsam belegten Fragen verhinderte jedes Gesamtergebnis. Jetzt erhält jede Liste ab zwei belegten Antworten aus zwei Themen ein Rating. Unbekannte Felder werden ausgelassen, nicht politisch interpretiert. Abdeckung und mögliche Spanne über die vollständige beantwortete Auswahl erscheinen neben dem Rating. Die Sortierung auf unterschiedlicher Belegbasis ist vorläufig; sie ist keine gesicherte Rangfolge auf identischen Fragen. Die Schwellen 80/60/40/20 sind offengelegte redaktionelle Stufen.

## Weiterarbeit und Korrekturen

Für jede neue Zuordnung: vollständiges Geschäft samt zugehöriger Originalmotion und Botschaft lesen; Einladungen und Vertagungen abgleichen; Antrag und Änderungsantrag unterscheiden, Sprecherrolle prüfen, Seiten und Quelle dokumentieren, Evidenz bewerten, Gegenprüfung festhalten, Version erhöhen. Ein Parteiprofil darf nicht anhand des individuellen Parteiwechsels eines früheren Sprechers übertragen werden. Ein fehlender Beleg kann dauerhaft fehlen; dann muss die Methodik diese Grenze weiterhin sichtbar halten.

Nicht in GitHub übernommen werden die kompletten Protokollkopien und Kandidierendenverzeichnisse. Die öffentlich verlinkten Originale enthalten unter anderem personenbezogene Angaben, die für den Parteienvergleich nicht benötigt werden. Das Repository enthält die fachlichen Herleitungen und Original-Links.
