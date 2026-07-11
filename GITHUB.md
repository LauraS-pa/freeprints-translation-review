# Push this project to GitHub

## Live site (GitHub Pages) â€” share with Daniela

**Share this link:** [https://lauras-pa.github.io/freeprints-translation-review/](https://lauras-pa.github.io/freeprints-translation-review/)

Daniela and anyone else can open that URL in Chrome, Edge, or Safari. No install, no localhost, no Cursor.

After you change files on your computer, upload again so the live site updates:

```powershell
cd C:\Users\LSmith\freeprints-translation-review
git add .
git commit -m "Update screenshots or copy"
git push
```

Wait 1â€“2 minutes, then refresh the link above.

Repository on GitHub: [https://github.com/LauraS-pa/freeprints-translation-review](https://github.com/LauraS-pa/freeprints-translation-review)

---
This guide is for non-developers. You only need Git (already used in this folder) and a free GitHub account.

---

## Your project right now (snapshot)

Use this to see which step you are on. Re-run the commands in PowerShell if you want a fresh check.

| Check | Result |
|--------|--------|
| **Branch** | `main` |
| **Commits** | Yes â€” project is on GitHub |
| **Remote (GitHub link)** | `origin` â†’ https://github.com/LauraS-pa/freeprints-translation-review |
| **Untracked files** | `.gitignore`, `README.md`, `WALKTHROUGH.md`, `css/`, `images/`, `index.html`, `js/`, `package.json`, `serve.ps1`, `update-screenshots.bat`, `update-screenshots.ps1` |
| **Git Credential Manager** | Installed â€” easiest login is a browser window on your first `git push` |
| **GitHub CLI (`gh`)** | Not installed on this machine (optional; see "Connect your GitHub account" below) |

**What that means:** The site is live on GitHub Pages (link at the top). Use **Updating GitHub** below when you change files locally.

---\r\n\r\n## Connect your GitHub account (login)

You already have a GitHub account. On this Windows PC, **Git** and **Git Credential Manager** are installed. You do **not** need to "log in" inside Cursor separately for pushing code â€” Git handles that when you run `git push` in PowerShell (or in Cursor's terminal).

### Easiest way: sign in when you push (recommended)

Do this the first time you send your project to GitHub (after **Part A**, using **Part B** or **Part C**).

1. In PowerShell, go to your project folder (if you are not already there):

   ```powershell
   cd C:\Users\LSmith\freeprints-translation-review
   ```

2. Run the `git push` command from Part B or Part C (for example `git push -u origin master`).

3. Watch for a sign-in step â€” usually one of these:
   - A small window titled **Git Credential Manager** asking you to sign in, **or**
   - Your **web browser** opening to a GitHub page.

4. In the browser (or sign-in window):
   - Sign in with your **GitHub username and password** if asked.
   - If you see **Authorize Git Credential Manager** (or similar), click **Authorize** or **Continue**.

5. When the browser says you can close the tab or return to the app, go back to **PowerShell**. The push should finish on its own.

6. If PowerShell asks **Username for 'https://github.com':**, type your **GitHub username** and press Enter. You usually do **not** need to type your GitHub website password â€” Credential Manager fills that in after the browser step.

7. After this works once, Windows typically **remembers** you. Later pushes often need no browser window.

**Tip:** Use the same push URL GitHub gives you (`https://github.com/...`). That is what triggers the normal browser login on this machine.

### Alternative: install GitHub CLI and log in once

Choose this only if the browser window never appears or login keeps failing.

1. Download **GitHub CLI** for Windows: [https://cli.github.com/](https://cli.github.com/) â€” run the installer (default options are fine).
2. **Close and reopen** PowerShell (and Cursor if you use its built-in terminal).
3. Run:

   ```powershell
   gh auth login
   ```

4. Use these choices when prompted (use arrow keys and Enter):
   - **GitHub.com**
   - **HTTPS**
   - **Yes** to authenticate Git with your GitHub credentials (if asked)
   - **Login with a web browser**

5. Copy the **one-time code** shown in the terminal, press Enter, and complete sign-in in the browser window that opens.

6. Try `git push` again from your project folder.

### If Git still asks for a password (fallback)

GitHub does **not** accept your normal website password for Git over HTTPS anymore. If Credential Manager does not help and Git keeps asking for a **Password**, create a **Personal Access Token** on GitHub (**Settings** â†’ **Developer settings** â†’ **Personal access tokens**), give it **repo** access, and paste the token when Git asks for a password. Treat it like a secret; this is optional if browser login works.

---

## Before you start

1. **Install Git** if you do not have it: [https://git-scm.com/download/win](https://git-scm.com/download/win) (default options are fine).
2. **Create a GitHub account** at [https://github.com/signup](https://github.com/signup) if you do not have one.
3. Open **PowerShell** and go to this folder:

   ```powershell
   cd C:\Users\LSmith\freeprints-translation-review
   ```

---

## Part A â€” Save a first copy on your computer (required once)

These commands take a snapshot of the project Git can upload.

```powershell
cd C:\Users\LSmith\freeprints-translation-review
git add .
git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>" -m "Initial commit: FreePrints translation review site"
```

If Git asks for your name and email the first time, follow the on-screen hints, then run the `git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>"` line again.

To confirm it worked:

```powershell
git log -1 --oneline
```

You should see one line starting with a short code and â€œInitial commitâ€¦â€.

---

## Part B â€” New repository on GitHub (you create it on the website)

Use this when GitHub does **not** already have a repo for this project.

1. In your browser, sign in to GitHub.
2. Click the **+** (top right) â†’ **New repository**.
3. **Repository name:** e.g. `freeprints-translation-review` (any name you like).
4. Leave it **Public** or choose **Private**.
5. **Important:** Do **not** check â€œAdd a READMEâ€, â€œAdd .gitignoreâ€, or â€œChoose a licenseâ€ â€” leave the repo **empty**.
6. Click **Create repository**.
7. On the new page, find **â€œâ€¦or push an existing repository from the command lineâ€** and copy the two lines that look like:

   ```text
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin master
   ```

   Replace with **your** URL if GitHub shows a different one (some accounts use `main` instead of `master` â€” use the branch name GitHub shows).

8. In PowerShell (same folder as above), paste and run those commands.

9. If Git asks you to sign in, follow **Connect your GitHub account (login)** above (browser window). Use a Personal Access Token only if that section's fallback steps are needed.

10. Refresh the repo page on GitHub â€” your files should appear.

---

## Part C â€” Existing empty repository on GitHub

Use this when someone already created a repo for you and it has **no files** (no README on GitHub).

1. Open the empty repo on GitHub and click the green **Code** button.
2. Copy the **HTTPS** URL (looks like `https://github.com/Someone/some-repo.git`).
3. In PowerShell:

   ```powershell
   cd C:\Users\LSmith\freeprints-translation-review
   git remote add origin PASTE_YOUR_URL_HERE
   git push -u origin master
   ```

   If GitHubâ€™s instructions say `main` instead of `master`, use:

   ```powershell
   git push -u origin master:main
   ```

   or rename your branch to match what the empty repo expects (GitHub usually shows the exact commands).

4. Sign in if prompted (token as password â€” see Part B, step 9).

**If you see â€œremote origin already existsâ€:** You already linked a URL. Check it with `git remote -v`. To change it:

```powershell
git remote set-url origin PASTE_YOUR_URL_HERE
git push -u origin master
```

---

## Updating GitHub after you change files

Whenever you edit the project and want GitHub to match your computer:

```powershell
cd C:\Users\LSmith\freeprints-translation-review
git add .
git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>" -m "Describe what you changed in plain English"
git push
```

---

## Quick checks

| Goal | Command |
|------|---------|
| See what changed | `git status` |
| See linked GitHub repo | `git remote -v` |
| See last saved snapshot | `git log -1 --oneline` |

---

## Optional: GitHub CLI (`gh`)

This computer does not have `gh` installed. You do **not** need it if browser login on `git push` works (see **Connect your GitHub account**). To install later: [https://cli.github.com/](https://cli.github.com/), then `gh auth login` â€” full steps are in that section.

---

## Help

- [GitHub: Adding an existing project](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github)
- If `git push` fails with â€œrejectedâ€ and mentions unrelated histories, the GitHub repo is **not** empty â€” ask whoever owns the repo whether to merge or use a fresh empty repo.
