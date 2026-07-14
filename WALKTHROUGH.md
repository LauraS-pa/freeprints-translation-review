# FreePrints Translation Review — Walkthrough

To back up or share this project on GitHub, see [GITHUB.md](GITHUB.md).

## Share this link with Daniela (no localhost needed)

Anyone with this link can open the review site in a normal web browser:

**https://lauras-pa.github.io/freeprints-translation-review/**

You do not need to run `serve.ps1` or open `index.html` on your computer for Daniela to use the site. After you add screenshots or change text on your PC, run `update-screenshots.bat`, then push updates to GitHub (see [GITHUB.md](GITHUB.md)) — the link above will show the latest version within a minute or two.

---

## Step 1: Open the project folder

In File Explorer, go to:

`C:\Users\LSmith\freeprints-translation-review`

You should see folders like `images`, `js`, `css`, and files like `index.html`.

## Step 2: Save paired screenshots

1. Open the `images` folder.
2. For each app page, save **two** screenshots with matching names:

   - German app: `01-splash-landing-de.png`
   - US app: `01-splash-landing-us.png`

3. Keep (or edit) the description file: `01-splash-landing.txt`

If the US screenshot is not ready yet, the site shows a labeled **US screenshot** placeholder until you add `01-splash-landing-us.png`.

**Note:** An older German file named `01-splash-landing.png` (without `-de`) still works as the German image. Renaming to `01-splash-landing-de.png` is clearer when you add the US pair.

## Step 3: Open the site

**Easiest way:** double-click `index.html` in the project folder.

**Or with a local server:**

```powershell
cd $HOME\freeprints-translation-review
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then open **http://localhost:8765** in your browser.

You should see the US and German screens side by side (or placeholders until images are added).

## Step 4: Daniela reviews the page

She compares the US and German screenshots and answers one question:

**"Is this page correct as shown?"**

- **Yes, correct** → page is marked done
- **No, needs changes** → she fills in:
  - Corrected German translation (for the whole page)
  - Notes (optional)

German reference text on the right is selectable. Use **Copy** next to a line, or **Copy all**, when editing.

Her answers save automatically in the browser.

## Step 5: Export her feedback

When she's finished, click **Export review** at the top. That downloads a JSON file with her responses.

---

## Adding a second screenshot later

You do **not** need to edit any code. Add three plain files in the `images` folder, then run one small update step.

### 1. Copy the template file

1. Open the `images` folder in File Explorer.
2. Find the file `TEMPLATE-new-screenshot.txt`.
3. Right-click it → **Copy**.
4. Right-click in empty space → **Paste**.
5. Rename the copy to match your new screen. Use a number and a short name, for example:

   `02-onboarding.txt`

   (Use `.txt` at the end. No spaces in the name.)

### 2. Fill in the description (Notepad)

1. Right-click `02-onboarding.txt` → **Open with** → **Notepad**.
2. Change the text to describe your new screen. The **first line** is the title Daniela will see in the tab. Every line after that is German text from the screenshot.

Example:

```
Onboarding — Welcome screen

Headline: WILLKOMMEN BEI FREEPRINTS
Body text: Drucken Sie Ihre Fotos kostenlos aus.
Button: Weiter
```

3. Save the file (**File → Save**) and close Notepad.

### 3. Add both screenshot images

In the same `images` folder, save:

- `02-onboarding-de.png` — German FreePrints app
- `02-onboarding-us.png` — US / English FreePrints app

Names must match the `.txt` base name, with `-de` and `-us` before the extension.

### 4. Tell the site about the new screenshot

1. Go back to the main project folder (`freeprints-translation-review`).
2. Double-click **`update-screenshots.bat`**.
3. A small window will open and say something like “Updated js/data.js with 2 screenshot pair(s).” Press any key to close it.

   **Tip:** If you start the site with `serve.ps1`, this update runs automatically — you can skip this step.

### 5. Refresh the site

1. Open the review site in your browser (or switch to the tab if it is already open).
2. Press **F5** or click the browser’s refresh button.
3. You should see a **new tab** at the top for your screenshot.

**Troubleshooting:** If you do not see the new tab, make sure the image and `.txt` files share the same base name (e.g. `02-onboarding`), you ran `update-screenshots.bat`, and you refreshed the page.

### 6. Push so Daniela sees the update

```powershell
cd C:\Users\LSmith\freeprints-translation-review
git add .
git commit -m "Add onboarding screenshot pair"
git push
```

Wait 1–2 minutes, then refresh the live link.
