# How to add a new screenshot (simple)

You only need two images with matching names. Put both in this folder.

1. Save the German app screenshot as:   03-checkout-de.png
2. Save the US app screenshot as:       03-checkout-us.png
   (Same name except the end: -de vs -us. PNG, JPG, or WebP is fine.)
3. Double-click update-screenshots.bat in the main project folder.
4. Refresh the review site (or push to GitHub so the live link updates).

That is enough. A new tab appears for the screen pair.

## Optional: description file

If you want a nicer tab title and German text lines on the right side,
copy TEMPLATE-new-screenshot.txt, rename it to match (e.g. 03-checkout.txt),
and fill it in with Notepad. Without a .txt, the tab title comes from the
image name and German reference text stays empty until you add one.

## Naming examples

  01-splash-landing-de.png
  01-splash-landing-us.png
  01-splash-landing.txt          ← optional

Until a US or German image exists, the site shows a labeled placeholder.

## Legacy names

A single image named 01-splash-landing.png (no -de/-us) is still treated
as the German screenshot. Prefer -de / -us names going forward.

See WALKTHROUGH.md for full steps.
