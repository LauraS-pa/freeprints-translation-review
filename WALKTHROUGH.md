# FreePrints Translation Review — Walkthrough

To back up or share this project on GitHub, see [GITHUB.md](GITHUB.md).

## Share this link with Daniela (no localhost needed)

Anyone with this link can open the review site in a normal web browser:

**https://lauras-pa.github.io/freeprints-translation-review/**

You do not need to run `serve.ps1` or open `index.html` on your computer for Daniela to use the site. After you add screenshots on your PC, run `update-screenshots.bat`, then push updates to GitHub (see [GITHUB.md](GITHUB.md)) — the link above will show the latest version within a minute or two.

---

## Step 1: Open the project folder

In File Explorer, go to:

`C:\Users\LSmith\freeprints-translation-review`

You should see folders like `images`, `js`, `css`, and files like `index.html`.

## Step 2: Add a screenshot pair (the usual way)

1. Open the `images` folder.
2. Save **both** screenshots with the **same name**, except the end:

   - German app: `03-checkout-de.png`
   - US app: `03-checkout-us.png`

3. Double-click **`update-screenshots.bat`** in the main project folder.
4. Refresh the review site in your browser (or push to GitHub so Daniela sees it live).

That is enough — a new page tab appears for that pair.

**(Optional)** Add a matching `.txt` file (e.g. `03-checkout.txt`) if you want a nicer tab title and German reference lines on the right. Copy `TEMPLATE-new-screenshot.txt` and edit it in Notepad. Without a `.txt`, the title comes from the file name.

If one image is not ready yet, the site shows a labeled placeholder until you add it.

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

## Optional: nicer title and German text lines

Only if you want them — not required for the page to appear.

1. In `images`, copy `TEMPLATE-new-screenshot.txt` and rename it to match your pair (e.g. `03-checkout.txt`).
2. Open it in Notepad. The **first line** is the tab title. Lines after that are German text from the screen.

Example:

```
Checkout

Headline: ZUR KASSE
Button: Bestellen
```

3. Save, run `update-screenshots.bat` again, and refresh.

---

## Push so Daniela sees the update

```powershell
cd C:\Users\LSmith\freeprints-translation-review
git add .
git commit -m "Add checkout screenshot pair"
git push
```

Wait 1–2 minutes, then refresh the live link.
