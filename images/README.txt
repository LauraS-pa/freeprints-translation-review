# Screenshot images and descriptions go in this folder.

## Naming (paired US + German)

For each app page, use the same base name with three files:

1. German screenshot:  `01-splash-landing-de.png`
2. US screenshot:      `01-splash-landing-us.png`
3. Description:        `01-splash-landing.txt`

Supported image formats: PNG, JPG, JPEG, WebP.

Until a US or German image exists, the site shows a labeled placeholder
(`placeholder-us.svg` or `placeholder-de.svg`).

## Legacy names

A single image named `01-splash-landing.png` (no -de/-us) is still treated
as the German screenshot. Prefer renaming to `01-splash-landing-de.png`
when you can.

## First screenshot (already set up)

- Description: 01-splash-landing.txt
- German image: 01-splash-landing.png (or rename to 01-splash-landing-de.png)
- US image: add 01-splash-landing-us.png

## Add another screenshot

1. Copy TEMPLATE-new-screenshot.txt and rename it (e.g. 02-onboarding.txt).
2. Open the copy in Notepad, change the title and German lines.
3. Save both screenshots with matching names:
   - 02-onboarding-de.png  (German app)
   - 02-onboarding-us.png  (US / English app)
4. Double-click update-screenshots.bat in the main project folder.
5. Refresh the review site in your browser.

See WALKTHROUGH.md for step-by-step instructions.
