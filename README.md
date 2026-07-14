# FreePrints Translation Review

A lightweight review site for Daniela (native German speaker) to check German FreePrints app screenshots against the US app and provide translation feedback. No backend required — reviews are saved in the browser via `localStorage`.

For a step-by-step walkthrough, see [WALKTHROUGH.md](WALKTHROUGH.md).

## Live site

**https://lauras-pa.github.io/freeprints-translation-review/**

## Quick start

**Easiest — open directly**

Double-click `index.html` in File Explorer, or open it in your browser. No install required.

**Windows — PowerShell server** (no Node/Python needed):

```powershell
cd $HOME\freeprints-translation-review
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then open [http://localhost:8765](http://localhost:8765).

## How it works

- **Side-by-side screenshots** — English / US on the left, German on the right (stacks on narrow screens).
- **German reference** — selectable text with a **Copy** button per string and **Copy all**.
- **Review workflow** — one question per page:
  - *Is this page correct as shown?*
  - **Yes, correct** → page marked as correct
  - **No, needs changes** → corrected German + optional notes
- **Progress** — tracks pages reviewed.
- **Export** — **Export review** downloads a JSON file with all page-level reviews.

Progress and answers persist automatically in the browser.

## Add screenshot pairs (no code editing)

1. Put both images in `images/` with matching names ending in `-de` and `-us`:
   - `03-checkout-de.png` (German)
   - `03-checkout-us.png` (US)
2. *(Optional)* Add `03-checkout.txt` for a nicer title and German reference lines.
3. Double-click **`update-screenshots.bat`** (or start with `serve.ps1`, which updates automatically).
4. Refresh the browser (or push to GitHub for the live site).

If a US or German image is missing, a labeled placeholder is shown until you drop the file in.

**Legacy:** a bare `01-splash-landing.png` (no `-de`/`-us`) is still treated as the German image.

See [WALKTHROUGH.md](WALKTHROUGH.md) for non-developer steps.

## File structure

```
freeprints-translation-review/
├── index.html              # Page shell
├── css/styles.css          # Layout and styling
├── js/
│   ├── app.js              # UI and interactions
│   ├── data.js             # Auto-generated screenshot list (do not edit by hand)
│   └── storage.js          # localStorage helpers
├── images/                 # Paired -de/-us screenshots (+ optional .txt)
├── update-screenshots.bat  # Double-click after adding screenshots
├── update-screenshots.ps1  # Used by the .bat file and serve.ps1
└── README.md
```

## Sharing with Daniela

1. Add German and US screenshot pairs, then run `update-screenshots.bat`.
2. Push to GitHub (see [GITHUB.md](GITHUB.md)) so the live link updates.
3. Share **https://lauras-pa.github.io/freeprints-translation-review/**
4. When she is done, use **Export review** to download feedback.

## Export format

Each screenshot exports as one row:

```json
{
  "screenshot": "Splash / Landing Screen",
  "screenshotId": "01-splash-landing",
  "germanTexts": [ { "label": "Main title", "german": "…" } ],
  "status": "correct",
  "correctedGerman": "",
  "notes": ""
}
```

## Current content (screenshot 01)

| Label | German (in app) |
|-------|-----------------|
| Main title | IHR SCHÖNSTES LÄCHELN |
| Body text | Verewigen Sie Ihre Lieblingsfotos auf KOSTENLOSEN 10x15-Abzügen … |
| Link | Was erhalte ich GRATIS? |
| CTA button | Loslegen |
