# Prüfprotokoll

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
