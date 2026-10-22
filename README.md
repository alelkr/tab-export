# Tab Export

Eine kleine Chrome-Erweiterung, um alle offenen Tabs als Markdown-Liste zu kopieren oder als CSV zu exportieren – und aus einer solchen CSV-Datei die Tabs (gruppiert nach Fenster) wieder zu öffnen.

## Funktionen

- **Alle Tabs kopieren (Markdown)** – kopiert alle offenen Tabs (über alle Fenster hinweg) als Markdown-Linkliste in die Zwischenablage.
- **Nur aktuelles Fenster kopieren** – wie oben, aber nur die Tabs des gerade aktiven Fensters.
- **Als CSV exportieren** – lädt alle offenen Tabs als CSV-Datei herunter (`title,url,window`).
- **Nur aktuelles Fenster als CSV** – wie oben, aber nur für das aktuelle Fenster.
- **CSV importieren & Fenster öffnen** – liest eine zuvor exportierte CSV-Datei ein und öffnet die enthaltenen Tabs wieder, gruppiert in die ursprünglichen Fenster.

## Installation in Google Chrome

Die Erweiterung ist nicht im Chrome Web Store veröffentlicht und muss daher als "entpackte Erweiterung" (unpacked extension) im Entwicklermodus geladen werden:

1. Dieses Repository herunterladen bzw. klonen:
   ```bash
   git clone https://github.com/alelkr/tab-export.git
   ```
2. In Chrome die Adresse `chrome://extensions` öffnen.
3. Oben rechts den **Entwicklermodus** aktivieren.
4. Auf **"Entpackte Erweiterung laden"** klicken.
5. Den heruntergeladenen Ordner `tab-export` (der die Datei `manifest.json` enthält) auswählen.
6. Die Erweiterung erscheint nun in der Liste und ihr Icon in der Symbolleiste von Chrome (ggf. über das Puzzle-Symbol anheften).

Nach Änderungen am Code genügt ein Klick auf das Aktualisieren-Symbol (↻) der Erweiterung in `chrome://extensions`, damit die Änderungen übernommen werden.

## Hinweise

- Exportierte CSV-Dateien enthalten die Titel und URLs eurer offenen Tabs – diese Dateien sind in `.gitignore` ausgeschlossen und sollten nicht geteilt oder committet werden, da sie persönliche Browsing-Daten enthalten können.
- Für den Import wird eine CSV mit den Spalten `title,url,window` erwartet (wie sie von diesem Tool exportiert wird). Fehlt die `window`-Spalte, werden alle Tabs in einem einzigen neuen Fenster geöffnet.
