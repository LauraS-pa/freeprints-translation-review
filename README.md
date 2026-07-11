# FreePrints Translation Review



A lightweight review site for Daniela (native German speaker) to check German FreePrints app screenshots and provide translation feedback. No backend required — reviews are saved in the browser via `localStorage`.

For a step-by-step walkthrough, see [WALKTHROUGH.md](WALKTHROUGH.md).

## Quick start



**Easiest — open directly**



Double-click `index.html` in File Explorer, or open it in your browser. No install required.



**Optional — local dev server** (if you have Node.js):



```bash

cd ~/freeprints-translation-review

npm install

npm run dev

```



Open the URL shown in the terminal (usually `http://localhost:5173`).



**Windows — PowerShell server** (no Node/Python needed):



```powershell

cd $HOME\freeprints-translation-review

powershell -ExecutionPolicy Bypass -File .\serve.ps1

```



Then open [http://localhost:8080](http://localhost:8080).



**Optional — PowerShell server** (included, no install):



```powershell

cd ~/freeprints-translation-review

powershell -File serve.ps1

```



Then open `http://localhost:8765/`.



## How it works



- **Screenshot panel** — shows the current app screen in a phone-style frame.

- **Original English** — one editable text area per page (visible when **Owner mode** is on). Turn this off before sharing with Daniela so she only sees German reference text and the review question.

- **German reference** — read-only list of German strings on the screen (or rely on the screenshot alone).

- **Review workflow** — one question per page:

  - *Is this page correct as shown?*

  - **Yes, correct** → page marked as correct

  - **No, needs changes** → one field for corrected German and one for notes (for the whole page)

- **Progress** — tracks pages/screenshots reviewed, not individual text blocks.

- **Export** — **Export review** downloads a JSON file with all page-level reviews.



Progress and answers persist automatically in the browser.



## Add the first screenshot image



1. Save your German FreePrints splash/landing screenshot as:



   `images/01-splash-landing.png`



2. Refresh the page. Until the file exists, a placeholder SVG is shown.



Supported formats: PNG, JPG, WebP.



## Add Original English text



Run the site locally, enable **Owner mode**, paste the full English copy for the page, and leave it saved in your browser. Turn **Owner mode** off before sharing with Daniela.



## Add more screenshots (no code editing)



For each new screen, add **two files** in `images/` with the same name:

1. A description file, e.g. `02-onboarding.txt` (copy `images/TEMPLATE-new-screenshot.txt` and edit in Notepad).
2. The screenshot image, e.g. `02-onboarding.png`.

Then double-click **`update-screenshots.bat`** in the project folder (or start the site with `serve.ps1`, which runs the update automatically). Refresh the browser — a new tab appears.

See [WALKTHROUGH.md](WALKTHROUGH.md) for step-by-step instructions written for non-developers.



## File structure



```

freeprints-translation-review/

├── index.html          # Page shell

├── css/styles.css      # Layout and styling

├── js/

│   ├── app.js          # UI and interactions

│   ├── data.js         # Auto-generated screenshot list (do not edit by hand)

│   └── storage.js      # localStorage helpers

├── images/             # Screenshot images + .txt descriptions (you edit these)

├── update-screenshots.bat  # Double-click after adding screenshots

├── update-screenshots.ps1  # Used by the .bat file and serve.ps1

├── package.json

└── README.md

```



## Sharing with Daniela



1. Add screenshots and English originals on your machine.

2. Turn off **Owner mode**.

3. Share the running local URL, or deploy the `dist/` folder to any static host (Netlify, GitHub Pages, internal server).

4. When she is done, use **Export review** to download feedback, or copy from your browser’s localStorage on the same machine.



## Export format



Each screenshot exports as one row:



```json

{

  "screenshot": "Splash / Landing Screen",

  "screenshotId": "01-splash-landing",

  "germanTexts": [ { "label": "Main title", "german": "…" } ],

  "originalEnglish": "…",

  "status": "correct",

  "correctedGerman": "",

  "notes": ""

}

```



## Current content (screenshot 01)



| Label      | German (in app) |

|------------|-----------------|

| Main title | IHR SCHÖNSTES LÄCHELN |

| Body text  | Verewigen Sie Ihre Lieblingsfotos auf KOSTENLOSEN 10x15-Abzügen … |

| Link       | Was erhalte ich GRATIS? |

| CTA button | Loslegen |

