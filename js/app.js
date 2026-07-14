(function () {
  const SCREENSHOTS = window.SCREENSHOTS;

  const {
    loadState,
    saveState,
    getReview,
    setReview,
    isReviewed,
    exportReviews,
  } = window.ReviewStorage;

  const appEl = document.getElementById("app");
  const navEl = document.getElementById("screenshot-nav");
  const exportBtn = document.getElementById("export-btn");

  let state = loadState();
  let activeScreenshotId = SCREENSHOTS[0]?.id ?? null;

  function persist() {
    saveState(state);
    render();
  }

  function overallProgress() {
    const total = SCREENSHOTS.length;
    const done = SCREENSHOTS.filter((screenshot) =>
      isReviewed(getReview(state, screenshot.id))
    ).length;
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  function screenshotReviewed(screenshot) {
    return isReviewed(getReview(state, screenshot.id));
  }

  function statusLabel(status) {
    if (status === "correct") return { text: "Correct", className: "correct" };
    if (status === "needs-changes") {
      return { text: "Needs changes", className: "needs-changes" };
    }
    return { text: "Pending", className: "pending" };
  }

  function imageSrc(screenshot, locale) {
    if (locale === "en") {
      return screenshot.imageEn || screenshot.imageUs || "images/placeholder-us.svg";
    }
    return (
      screenshot.imageDe ||
      screenshot.image ||
      "images/placeholder-de.svg"
    );
  }

  async function copyText(text) {
    const value = String(text ?? "");
    if (!value) return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {
      /* fall through */
    }
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function flashCopyButton(btn, ok) {
    const original = btn.textContent;
    btn.textContent = ok ? "Copied" : "Failed";
    btn.classList.add("is-copied");
    window.setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("is-copied");
    }, 1400);
  }

  function renderNav() {
    navEl.innerHTML = SCREENSHOTS.map((screenshot) => {
      const reviewed = screenshotReviewed(screenshot);
      const active = screenshot.id === activeScreenshotId ? "is-active" : "";
      const status = reviewed ? "is-reviewed" : "";
      return `
        <button
          type="button"
          class="nav-pill ${active} ${status}"
          data-screenshot-id="${screenshot.id}"
        >
          ${escapeHtml(screenshot.title)}${reviewed ? " ✓" : ""}
        </button>
      `;
    }).join("");

    navEl.querySelectorAll("[data-screenshot-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeScreenshotId = btn.dataset.screenshotId;
        render();
      });
    });
  }

  function renderPhoneFrame(screenshot, locale) {
    const isUs = locale === "en";
    const label = isUs ? "English / US" : "German";
    const src = imageSrc(screenshot, locale);
    const fallback = isUs
      ? "images/placeholder-us.svg"
      : "images/placeholder-de.svg";
    const alt = isUs
      ? `${screenshot.title} — US app screenshot`
      : `${screenshot.title} — German app screenshot`;

    return `
      <figure class="phone-card">
        <figcaption class="phone-label">${label}</figcaption>
        <div class="screenshot-frame">
          <img
            src="${escapeAttr(src)}"
            alt="${escapeAttr(alt)}"
            onerror="this.onerror=null; this.src='${fallback}'; this.alt='${isUs ? "US screenshot placeholder" : "German screenshot placeholder"}';"
          />
        </div>
      </figure>
    `;
  }

  function renderGermanReference(screenshot) {
    const texts = screenshot.germanTexts ?? [];
    if (!texts.length) {
      return `
        <div class="field">
          <div class="field-label-row">
            <span class="field-label">German shown in app</span>
          </div>
          <p class="field-hint">Refer to the German screenshot for text on this screen.</p>
        </div>
      `;
    }

    const allGerman = texts.map((entry) => entry.german).join("\n");

    const items = texts
      .map(
        (entry, index) => `
          <li class="german-item">
            <div class="german-item-header">
              <span class="german-item-label">${escapeHtml(entry.label)}</span>
              <button
                type="button"
                class="btn btn-copy"
                data-copy-index="${index}"
                title="Copy this German string"
              >
                Copy
              </button>
            </div>
            <p class="german-item-text" lang="de" tabindex="0">${escapeHtml(entry.german)}</p>
          </li>
        `
      )
      .join("");

    return `
      <div class="field">
        <div class="field-label-row">
          <span class="field-label">German shown in app</span>
          <button
            type="button"
            class="btn btn-copy"
            data-copy-all
            title="Copy all German strings"
          >
            Copy all
          </button>
        </div>
        <ul class="german-reference" lang="de">${items}</ul>
        <textarea class="sr-only" id="german-all-clipboard" readonly>${escapeHtml(allGerman)}</textarea>
      </div>
    `;
  }

  function renderScreenshot(screenshot) {
    const review = getReview(state, screenshot.id);
    const badge = statusLabel(review.status);
    const { done, total, percent } = overallProgress();
    const showCorrections = review.status === "needs-changes";
    const panelClass =
      review.status === "correct"
        ? "is-correct"
        : review.status === "needs-changes"
          ? "needs-changes"
          : "";

    appEl.innerHTML = `
      <div class="review-layout">
        <aside class="panel screenshot-panel">
          <div class="screens-compare">
            ${renderPhoneFrame(screenshot, "en")}
            ${renderPhoneFrame(screenshot, "de")}
          </div>
          <p class="screenshot-caption">
            ${escapeHtml(screenshot.title)}
          </p>
        </aside>

        <section class="panel review-panel page-review ${panelClass}" aria-labelledby="review-heading">
          <div class="block-header">
            <h2 class="section-heading" id="review-heading">Page review</h2>
            <span class="status-badge ${badge.className}">${badge.text}</span>
          </div>
          <p class="section-subheading">
            Compare the US and German screens, then review this page as a whole.
          </p>

          <div class="progress-bar" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-fill" style="width: ${percent}%"></div>
          </div>
          <p class="progress-caption">
            Progress: ${done} of ${total} pages reviewed
          </p>

          ${renderGermanReference(screenshot)}

          <p class="review-question">
            Is this page correct as shown?
          </p>

          <div class="choice-row" role="group" aria-label="Review ${escapeAttr(screenshot.title)}">
            <button
              type="button"
              class="choice-btn yes ${review.status === "correct" ? "is-selected" : ""}"
              data-action="correct"
            >
              Yes, correct
            </button>
            <button
              type="button"
              class="choice-btn no ${review.status === "needs-changes" ? "is-selected" : ""}"
              data-action="needs-changes"
            >
              No, needs changes
            </button>
          </div>

          <div class="correction-fields ${showCorrections ? "" : "hidden"}" data-corrections-for="page">
            <div class="field">
              <label class="field-label" for="correction-page">
                Corrected German translation
              </label>
              <textarea
                id="correction-page"
                data-correction-for="page"
                rows="6"
                placeholder="Your improved wording for any part of the page"
              >${escapeHtml(review.correctedGerman)}</textarea>
            </div>
            <div class="field">
              <label class="field-label" for="notes-page">
                Other notes
              </label>
              <textarea
                id="notes-page"
                data-notes-for="page"
                rows="3"
                placeholder="Optional: tone, length, terminology…"
              >${escapeHtml(review.notes)}</textarea>
            </div>
          </div>

          <div class="footer-note">
            Your answers are saved automatically in this browser.
          </div>
        </section>
      </div>
    `;

    bindPageEvents(screenshot);
  }

  function bindPageEvents(screenshot) {
    const texts = screenshot.germanTexts ?? [];

    appEl.querySelectorAll("[data-copy-index]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const index = Number(btn.dataset.copyIndex);
        const ok = await copyText(texts[index]?.german ?? "");
        flashCopyButton(btn, ok);
      });
    });

    const copyAllBtn = appEl.querySelector("[data-copy-all]");
    if (copyAllBtn) {
      copyAllBtn.addEventListener("click", async () => {
        const all = texts.map((entry) => entry.german).join("\n");
        const ok = await copyText(all);
        flashCopyButton(copyAllBtn, ok);
      });
    }

    appEl.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const review = getReview(state, screenshot.id);
        const nextStatus = btn.dataset.action;

        setReview(state, screenshot.id, {
          ...review,
          status: nextStatus,
          correctedGerman: nextStatus === "correct" ? "" : review.correctedGerman,
          notes: nextStatus === "correct" ? "" : review.notes,
        });
        persist();
      });
    });

    const correctionEl = appEl.querySelector("[data-correction-for]");
    if (correctionEl) {
      correctionEl.addEventListener("input", () => {
        const review = getReview(state, screenshot.id);
        setReview(state, screenshot.id, {
          ...review,
          correctedGerman: correctionEl.value,
        });
        saveState(state);
      });
    }

    const notesEl = appEl.querySelector("[data-notes-for]");
    if (notesEl) {
      notesEl.addEventListener("input", () => {
        const review = getReview(state, screenshot.id);
        setReview(state, screenshot.id, {
          ...review,
          notes: notesEl.value,
        });
        saveState(state);
      });
    }
  }

  function exportData() {
    const rows = exportReviews(state, SCREENSHOTS);
    const blob = new Blob([JSON.stringify(rows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `freeprints-reviews-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function render() {
    renderNav();
    const screenshot = SCREENSHOTS.find((s) => s.id === activeScreenshotId);
    if (screenshot) {
      renderScreenshot(screenshot);
    } else {
      appEl.innerHTML = "<p>No screenshots configured.</p>";
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  exportBtn.addEventListener("click", exportData);
  render();
})();
