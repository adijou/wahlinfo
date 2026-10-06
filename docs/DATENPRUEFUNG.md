# Quellen- und Kodierungsprüfung

Stand: 06.10.2026, Datensatz 2026-10-06.3. KI-gestützter Abgleich mit extrahiertem Originaltext; unabhängige redaktionelle Gegenprüfung offen.

## Rechercheumfang

Das kommunale [Publikationsregister](https://www.duedingen.ch/publikationengeneralrat) lieferte 88 Einträge im Publikationszeitraum Januar 2021 bis 6. Oktober 2026. Daraus wurden 28 vollständige Protokolle heruntergeladen, textlich erschlossen und mit SHA-256-Prüfsumme inventarisiert. Eines betrifft Dezember 2020 und wurde 2021 publiziert. `public/data/archive.json` enthält das prüfbare Verzeichnis. Erfassung und Textextraktion bedeuten ausdrücklich keine vollständige inhaltliche Auswertung.

Vertieft gelesen wurden die relevanten Geschäfte in den Protokollen vom 09.12.2024, 24.02.2025, 12.05.2025, 15.12.2025, 20.04.2026 und 29.06.2026. Andere Auszüge dienten der Vorauswahl. Das Register enthält auch Botschaften/Beschlüsse vom 05.10.2026; ein entsprechendes vollständiges Protokoll war bei der Erfassung noch nicht enthalten. Ältere Jahrgänge sind für die Fortsetzung offen.

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
| Versuch Fussgängerampel | Nein | Offen / Einzelperson | Nein (gemeinsam) | Nein (gemeinsam) | Nein | Ja |
| Referendumsschwelle CHF 250’000 | Nein | Ja | Nein (gemeinsam) | Nein (gemeinsam) | Nein | Offen |
| Schulplanung zurückstellen | Nein | Offen | Nein (gemeinsam) | Nein (gemeinsam) | Nein (2024) | Ja |

25 von 30 Feldern sind auswertbar: 15 eigene Positionen und 10 Zuordnungen aus fünf gemeinsamen Fraktionspositionen. Diese zehn Felder sind keine zehn unabhängigen Belege. Alle verwendeten Positionen haben **mittlere Evidenz**. Fünf Felder bleiben offen (FDP: Wohnen, Ampelversuch, Schulplanung; SVP: Wohnen, Referendum).

## Fundstellen und kritische Abgrenzungen

- **Mietzuschüsse:** [24.02.2025](https://www.duedingen.ch/_doc/6933562), Geschäft 147/5.1, gedruckte S. 570–574, PDF-S. 14–18. Gemeinsame Motion der acht SP-Mitglieder; Mitte kündigt einstimmige Ablehnung an. Das separate Postulat zu bezahlbarem Wohnraum wird nicht mit der Mietsubvention vermischt. Sandro Tissi bezeichnet seine Wortmeldung ausdrücklich als persönlich.
- **Basisstufe:** [12.05.2025](https://www.duedingen.ch/_doc/6933574), Geschäft 155, S. 609–613, PDF-S. 25–29. Mitte und SP unterstützen, FDP mehrheitlich; SVP fordert vor der vorgelegten Einführung weitere Grundlagen. Das ist keine grundsätzliche Ablehnung altersgemischten Lernens. Kredit: jährlich maximal CHF 260’000 und einmalig CHF 30’000. Ein Zwischenentwurf enthielt irrtümlich CHF 130’000; gegen den Beschlusstext auf PDF-S. 29 korrigiert.
- **Ampelversuch:** [29.06.2026](https://www.duedingen.ch/_doc/7272157), Geschäft 5.1, S. 34–38, PDF-S. 19–23. SP und Mitte lehnen ab, SVP stimmt zu. Die Motion von Herbert Stadler allein belegt keine inhaltliche Position der gesamten FDP; auch deren Antrag auf Verschiebung ist keine Sachzustimmung. Keine Umdeutung zu einer generellen Position zu VALTRALOC. Die [lokale FDP-Website](https://www.fdp-sense.ch/sektionen/duedingen), Wahlthemen vom 02.09.2026, will die Ampel weiterverfolgen, nennt aber keinen sechsmonatigen Versuch vor VALTRALOC. Als ergänzende Quelle erfasst, ohne den fehlenden konkreten Fraktionsbeleg zu ersetzen.
- **Referendum:** [15.12.2025](https://www.duedingen.ch/_doc/6933583), Geschäft 174, S. 674, 677–679, PDF-S. 27, 30–32. Fraktionsvernehmlassung FDP: CHF 250’000; SP: CHF 2,5 Mio.; Mitte bezeichnet CHF 250’000 ausdrücklich als zu tief und beantragt CHF 3 Mio. «Nein» zur exakt abgefragten Schwelle ist eine transparente redaktionelle Kodierung. Die Zustimmung zu einer allgemeinen Senkung wird nicht mit Zustimmung zu CHF 250’000 gleichgesetzt. Abstimmungsresultate über CHF 1 bzw. 3 Mio. liefern keine separaten Parteistimmen.
- **Schulplanung:** [20.04.2026](https://www.duedingen.ch/_doc/7090243), Geschäft 188, S. 748–751, PDF-S. 28–31. SVP verlangt Rückweisung für eine Gesamtstrategie zu Sporthallen. Mitte unterstützt sofortige Weiterplanung. Die FDP äussert Bedenken, ohne eindeutige Aussage zur Rückweisung. Ergänzung: [09.12.2024](https://www.duedingen.ch/_doc/6933559), Geschäft 137, S. 533–534, PDF-S. 15–16: Eliane Aebischer spricht ausdrücklich im Namen der SP und erklärt die geschlossene Unterstützung der Planung sowie Ablehnung der Rückweisung. Dieser frühere Fraktionsstandpunkt stützt den Wert 0 zur grundsätzlichen Reihenfolge der Planung; er wird nicht als Abstimmungsnachweis für April 2026 ausgegeben. Die Frage und ihr Kontext nennen beide Beratungszeitpunkte.

Die zu jeder einzelnen Position gespeicherte Fundstelle und Begründung ist die massgebliche Arbeitsgrundlage. Gemeinsame Fraktionsaussagen zählen seit Version .3 als explizit gekennzeichnetes gemeinsames Profil. Die Fraktionsablehnung einer Grenze von CHF 250’000 ist zusätzlich am 09.12.2024, S. 551, PDF-S. 33 ausdrücklich dokumentiert (Philippe Bossart). Identische Profilwerte und Belege werden technisch erzwungen. Bei der Schulplanung zählt für das gemeinsame Profil der aktuellere Stand 2026 (Ablehnung der Rückweisung), nicht die 2024 noch gespaltene Haltung.

## Änderung der Auswertung

Die frühere Sperre bis zu vier für alle Listen gemeinsam belegten Fragen verhinderte jedes Gesamtergebnis. Jetzt erhält jede Liste ab zwei belegten Antworten aus zwei Themen ein Rating. Unbekannte Felder werden ausgelassen, nicht politisch interpretiert. Abdeckung und mögliche Spanne über die vollständige beantwortete Auswahl erscheinen neben dem Rating. Die Sortierung auf unterschiedlicher Belegbasis ist vorläufig; sie ist keine gesicherte Rangfolge auf identischen Fragen. Die Schwellen 80/60/40/20 sind offengelegte redaktionelle Stufen.

## Weiterarbeit und Korrekturen

Für jede neue Zuordnung: vollständiges Geschäft lesen, Antrag und Änderungsantrag unterscheiden, Sprecherrolle prüfen, Seiten und Quelle dokumentieren, Evidenz bewerten, Gegenprüfung festhalten, Version erhöhen. Ein Parteiprofil darf nicht anhand des individuellen Parteiwechsels eines früheren Sprechers übertragen werden. Ein fehlender Beleg kann dauerhaft fehlen; dann muss die Methodik diese Grenze weiterhin sichtbar halten.

Nicht in GitHub übernommen werden die kompletten Protokollkopien und Kandidierendenverzeichnisse. Die öffentlich verlinkten Originale enthalten unter anderem personenbezogene Angaben, die für den Parteienvergleich nicht benötigt werden. Das Repository enthält die fachlichen Herleitungen und Original-Links.
