# Prüfprotokoll

## Direkter Abschluss und Teilen · 07.10.2026

Frage fünf führt mit «Abschluss» direkt zu den Resultaten. Auch Überspringen beendet den Durchlauf ohne Pflichtübersicht. «Antworten bearbeiten» bleibt erreichbar; «Übernehmen» aktualisiert das Resultat direkt. Im Browser mit künstlichen Antworten geprüft: Fehlermeldung bei leerer Auswahl, vollständiger Durchlauf, Überspringen, Bearbeiten und Verlust der Antworten beim Neuladen.

33 automatische Tests erfolgreich (28 bestehende und fünf neue Prüfungen). Die neuen Prüfungen sichern die private Voreinstellung, den öffentlichen Link ohne Antwortparameter, vollständige Listen samt Belegbasis und offenen Spannen, unveränderte Gleichstände, fehlende Ratings, HTML-/SVG-Escaping sowie Format und Abmessungen der Linkgrafik. Statischer Build und Syntaxprüfung erfolgreich. Die politischen Daten und die Berechnung bleiben unverändert.

Browserprüfung in Chromium: sichtbarer Teilen-Bereich, Sprung vom Ergebnisanfang, Einladungs- und Ergebniskarte, explizites Zuschalten der persönlichen Ratings, deaktivierte Auswahl ohne berechenbares Rating, kopierter Text mit richtigem öffentlichem Link und lokal erzeugte PNG-Karte. Einladungskarte tatsächlich im Downloadordner geprüft (1080 × 1350 px); Linkgrafik 1200 × 630 px als echte PNG-Datei geprüft. Der Automationsbefehl zum Download-Warten lief in ein Timeout; die erzeugten Dateien wurden separat verifiziert. Desktop und schmale Ansicht (390 px Fensterbreite) ohne horizontale Überbreite; keine Browserwarnungen oder -fehler. Lokale Aufnahme: `output/teilen-ergebnis.jpg`.

Die native Übergabe an WhatsApp, iOS/Android und andere Empfänger-Apps wurde nicht durch tatsächlichen Versand getestet. Datei-Teilen verwendet die Browser-Fähigkeitsprüfung, Text/Link und Bilddownload stehen separat bereit. Gespeicherte Linkvorschauen können nach der nächsten Netlify-Veröffentlichung noch einen älteren Stand zeigen. Keine direkte Netlify-Bereitstellung im Rahmen dieser Änderung.

## Persönlicher Editor und Verantwortlichkeit · 07.10.2026

Der Editor liegt in `local-editor/` und wird ausschliesslich über den lokalen Server mit `--editor` an `127.0.0.1:4174` ausgeliefert. Öffentliche Builds enthalten weder die HTML-Seite noch das Editor-Skript. Der Build ersetzt seine Ausgabe vollständig, damit auch bei einem erneuten lokalen Build keine alten Editor-Dateien zurückbleiben. Die Quelldateien sind weiterhin Teil des öffentlichen Repositories; geschützt wird hier die Trennung der ausgelieferten Website, nicht der Quellcode.

28 automatische Tests erfolgreich. Zwei zusätzliche Prüfungen kontrollieren den Ausschluss des Editors, das Entfernen alter Ausgabedateien und den Erhalt der lokalen Redaktion. Statischer Build und Syntaxprüfung erfolgreich. HTTP-Prüfung der gebauten Website: `/editor.html`, `/editor.js` und `/local-editor/editor.html` liefern 404; die beiden Editor-Dateien am persönlichen lokalen Server liefern 200. Das mitgelieferte Favicon liefert ebenfalls 200.

Browserprüfung: öffentliche Projektseite und Seitenfuss nennen Adrian Schwaller mit dem gewünschten LinkedIn-Link sowie digitalbell.ch mit Original-Favicon. Kein öffentlicher Editor-Link; keine nachgeladenen Drittanbieter-Bilder. Der persönliche Editor lädt erfolgreich und bestätigt sechs auswertbare Listen bei der Datenprüfung. Lokale Aufnahme: `output/projekt-verantwortlichkeit.png`.

Favicon-Original: `https://digitalbell.ch/favicon-32x32.png`, im HTML der Website als Icon ausgewiesen, abgerufen am 07.10.2026. Unverändert lokal gespeichert; SHA-256 `3b9ec90f885cfbd238facbed15f788d9760df77e756377ce8d8d138a4bff2156`. Die fachlichen Positionen, Berechnung und der Quellenstand 2026-10-06.4 bleiben unverändert; lediglich die Verantwortlichkeit wurde in den Metadaten ergänzt.

## Quellen-Nachprüfung · Datenversion 2026-10-06.4

26 automatische Tests erfolgreich, einschliesslich der unabhängigen Nachrechnung aller 7’776 Antwort-/Überspringen-Kombinationen. Die neue Regression prüft, dass die ausdrücklich im Namen der FDP-Fraktion eingereichte Ampelmotion in beide Richtungen in das Rating eingeht: Zustimmung erhöht, Ablehnung senkt die Nähe. Die FDP hat nun drei belegte Fragen. Das Rechercheverzeichnis wird auf konsistente Version, eindeutige Dokumente, Prüfsummen und gültige gelesene Seiten sowie die ersten Quellenfundstellen aller Positionen geprüft.

Datenprüfung, statischer Build und Syntaxprüfung erfolgreich. Im lokalen Chromium-Browser kontrolliert: FDP/Ampelversuch zeigt «Dafür»; der Originalmotionslink führt zu PDF-Seite 4; Protokoll und Botschaft sind separat verlinkt. Der neue Abschnitt «Unterlagen zu diesem Geschäft» enthält die passenden Originale. Die Methodenseite zeigt 26/30 Felder, vier verbleibende Lücken, die dokumentierte Korrektur und Datenversion .4. Keine Browserwarnungen oder -fehler. Quellenansicht visuell geprüft; lokale Aufnahme unter `output/ampel-position-korrigiert.png`.

Die fachliche Nachprüfung, gelesene Seiten und Grenzen stehen in `DATENPRUEFUNG.md` und `public/data/source-review.json`. Automatische Tests überprüfen die Datenverwendung; die inhaltliche Zuordnung beruht auf der dokumentierten Quellenlektüre. Eine unabhängige menschliche Gegenprüfung bleibt offen. Diese Aktualisierung wurde nicht direkt zu Netlify bereitgestellt.

## Historisch: Rating-Update · Datenversion 2026-10-06.3

24 automatische Tests erfolgreich. Darin werden alle 7’776 Kombinationen aus fünf Antworten und Überspringen über die fünf Fragen geprüft: unabhängige Nachrechnung, Grenzen 0–100, Gleichheit der gemeinsamen Fraktionsprofile, Mindestumfang je Liste und ein Rating für alle sechs Listen bei vollständiger Beantwortung. Zusätzlich geprüft: feste Stufen und Rundungsgrenzen, Dezimalgewichte, neutrale Antworten ohne künstlichen Gewinner, unterschiedliche Belegabdeckung, Spannen einschliesslich übersprungener Fragen, Export mit Herkunft und Grenzen sowie Ablehnung widersprüchlicher gemeinsamer Profile im Editor.

Browserprüfung der aktualisierten Ergebnisansicht in Chromium: vollständiger Fragebogen; alle sechs Ratings sichtbar; «Warum dieses Rating?» mit passenden Quellen und gemeinsamen Fraktionshinweisen; Änderung einer Antwort; Überspringen der Referendumsfrage lässt fünf andere Ratings stehen, während nur die FDP wegen eines verbleibenden Belegs kein Rating erhält. Neuladen verwirft Antworten. Keine Warnungen oder Fehler im Browserprotokoll.

Responsive Prüfung bei 320, 390, 768, 1280 und 1440 px: keine horizontale Überbreite; Rating und Belegabdeckung sichtbar; Originalquellen und Details bedienbar. Die kompakte Darstellung zeigt Erklärungen und Einzelwerte auf Anfrage. Die Desktopvorschau verwendet künstlich gewählte Testantworten, keine Antworten des Auftraggebers.

Editor: gültiger Datensatz meldet «6 von 6 Listen»; abweichender Wert nur bei einer Hälfte der gemeinsamen Fraktion wird abgewiesen; nach Rückkorrektur wieder gültig. Keine Veröffentlichung durch den Editor.

Build und Syntaxprüfung erfolgreich. Der nachfolgende Abschnitt dokumentiert den ursprünglichen Stand und seine damalige, inzwischen ersetzte Gesamtsperre. Methodische Grenzen des neuen Ratings stehen in `DATENPRUEFUNG.md` und direkt in der App.

## Historisch: erste Rechercheversion · Datenversion 2026-10-06.2

06.10.2026 · Gestaltung C «Klartext» · lokale Rechercheversion.

## Automatische Prüfungen

16 Tests erfolgreich: symmetrische und begrenzte Abstandsberechnung; Unterschied zwischen neutral und übersprungen; gleiche Vergleichsbasis; Ausschluss tiefer Evidenz, Einzelpersonen und gemeinsamer Fraktionen; Mindestanzahl Themen; Unabhängigkeit von Parteireihenfolge; Gewichtungen; Datenlücken; importierte Fehlstrukturen; notwendige Kontroverse; HTML-Escaping und URL-Prüfung; Export ohne Einzelantworten; sechs amtliche Listen; keine Übertragung historischer JLD-Positionen; Freigabesicherung; genaue Quellenfundstellen.

`npm run build` validiert die Daten und erstellt die statische Ausgabe. Erfolgreicher lokaler Build; keine Runtime-Abhängigkeiten. Syntaxprüfung der Anwendung erfolgreich. GitHub Actions wiederholt Tests und Build bei Push/PR; der tatsächliche Cloud-Lauf ist separat zu kontrollieren.

## Browserprüfung

Geprüft im Codex-Browser (Chromium) auf Windows:

- 1440 × 900/1000, 1280 × 720, 768 × 1024, 390 × 844 und 320 × 760: Startseite und zentrale Ansichten visuell geprüft; keine horizontale Überbreite nach Korrektur.
- Smartphone: Kopfbereich, mobile Navigation, lesbare Fragen, Antwortflächen mindestens 57 px hoch; lange Wörter und Grid-Spalten korrigiert.
- Vollständiger Ablauf mit Zustimmung, Ablehnung, mittlerer Antwort und Überspringen.
- «Weiter» ohne Antwort meldet einen verständlichen Fehler. Antworten ändern führt zurück zur Übersicht; die geänderte Antwort erscheint im Vergleich.
- Radiogruppe mit Pfeiltaste bedient; Antwortwechsel von 100 auf 75 bestätigt. Fokusmarkierungen und native Schaltflächen vorhanden.
- Resultat zeigt alle sechs Listen, lokale Datenlücken, konkrete Belege und die gesperrte Gesamtrangfolge. Keine künstlichen Prozentwerte für fehlende Positionen.
- Quellenfilter: Archiv + Jahr 2025 + «Mai» liefert die Sitzung vom 12.05.2025. Unpassende Suche zeigt einen Leerzustand.
- Editor: gültiger Datensatz akzeptiert, Gewicht 0 abgefangen, Korrektur übernommen. Export erzeugte `politics.json` im Downloadverzeichnis. Der Browser-Automationsbefehl zum Warten auf den Download lief in ein Timeout; die Datei und der erfolgreiche UI-Status wurden anschliessend separat bestätigt.
- Neuladen setzt Antworten zurück. Keine Fehler/Warnungen im geprüften Browserprotokoll.

Vorschaubilder: `screenshots/desktop.jpg` und `screenshots/mobile-frage.jpg`.

## Grenzen dieser Prüfung

Keine Prüfung auf physischen iPhones/Android-Geräten, in Safari/Firefox oder mit Screenreader. Keine förmliche WCAG-Konformitätsprüfung. Reduced Motion ist im Stylesheet berücksichtigt; die Browser-Emulation dieser Einstellung wurde nicht durchgeführt. Die native Geräte-Teilen-Funktion hängt vom Browser ab; Fallbacks sind implementiert. Kein öffentlicher Netlify-Deploy, daher noch keine Prüfung der produktiven TLS-/Header-Auslieferung.

Die fachliche Freigabe der politischen Daten bleibt unabhängig von bestandenen technischen Tests offen; siehe `DATENPRUEFUNG.md`.
