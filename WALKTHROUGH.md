# FreePrints Translation Review — Walkthrough

To back up or share this project on GitHub, see [GITHUB.md](GITHUB.md).

## Step 1: Open the project folder

In File Explorer, go to:

`C:\Users\LSmith\freeprints-translation-review`

You should see folders like `images`, `js`, `css`, and files like `index.html`.

## Step 2: Save your screenshot

1. Open the `images` folder.
2. Save the FreePrints splash screenshot as:

   `01-splash-landing.png`

The name must match exactly — the site is already set up to look for that file.

## Step 3: Open the site

**Easiest way:** double-click `index.html` in the project folder.

**Or with a local server:**

```powershell
cd $HOME\freeprints-translation-review
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then open **http://localhost:8765** in your browser.

You should see the screenshot on the left (or a placeholder until you add the image).

## Step 4: Add the original English

1. Leave **Owner mode** turned on (top of the page).
2. Find the **Original English** text area on the right.
3. Paste the English version of everything on that screen, for example:

```
YOUR MOST BEAUTIFUL SMILE

Immortalize your favorite photos on FREE 10x15 prints of the highest quality and have them delivered directly to your home within a few days at the cost of shipping.

What do I get for FREE?

Get started
```

4. Turn **Owner mode** off before sharing with Daniela — that hides the English field from her view.

## Step 5: Daniela reviews the page

She looks at the screenshot and answers one question:

**"Is this page correct as shown?"**

- **Yes, correct** → page is marked done
- **No, needs changes** → she fills in:
  - Corrected German translation (for the whole page)
  - Notes (optional)

Her answers save automatically in the browser.

## Step 6: Export her feedback

When she's finished, click **Export review** at the top. That downloads a JSON file with her responses.

---

## Adding a second screenshot later

You do **not** need to edit any code. You only add two plain files in the `images` folder, then run one small update step.

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

Here is a complete example you can copy and change:

```
Onboarding — Welcome screen

Headline: WILLKOMMEN BEI FREEPRINTS
Body text: Drucken Sie Ihre Fotos kostenlos aus.
Button: Weiter
```

3. Change only the parts that apply to **your** screen (title, labels, and German words).
4. Save the file (**File → Save**) and close Notepad.

### 3. Add the screenshot image

1. Save your new app screenshot in the same `images` folder.
2. Name it **exactly the same** as the text file, but with `.png` or `.jpg` instead of `.txt`. For example:

   `02-onboarding.png`

### 4. Tell the site about the new screenshot

1. Go back to the main project folder (`freeprints-translation-review`).
2. Double-click **`update-screenshots.bat`**.
3. A small window will open and say something like “Updated js/data.js with 2 screenshot(s).” Press any key to close it.

   **Tip:** If you start the site with `serve.ps1`, this update runs automatically — you can skip this step.

### 5. Refresh the site

1. Open the review site in your browser (or switch to the tab if it is already open).
2. Press **F5** or click the browser’s refresh button.
3. You should see a **new tab** at the top for your screenshot (e.g. “Onboarding — Welcome screen”).

**Troubleshooting:** If you do not see the new tab, make sure the image and `.txt` files share the same name (e.g. both `02-onboarding`), you ran `update-screenshots.bat`, and you refreshed the page.

### 6. Add the original English (same as before)

1. Turn **Owner mode** on.
2. Click the new tab.
3. Paste the English text for that screen into **Original English**.
4. Turn **Owner mode** off before Daniela reviews.

