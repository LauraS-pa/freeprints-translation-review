(function () {

  const SCREENSHOTS = window.SCREENSHOTS;

  const {

    loadState,

    saveState,

    getEnglish,

    setEnglish,

    getReview,

    setReview,

    isReviewed,

    exportReviews,

  } = window.ReviewStorage;



  const appEl = document.getElementById("app");

  const navEl = document.getElementById("screenshot-nav");

  const ownerToggle = document.getElementById("owner-mode-toggle");

  const exportBtn = document.getElementById("export-btn");



  let state = loadState();

  let activeScreenshotId = SCREENSHOTS[0]?.id ?? null;



  function persist() {

    saveState(state);

    render();

  }



  function setOwnerMode(enabled) {

    document.body.classList.toggle("owner-mode", enabled);

    localStorage.setItem("freeprints-owner-mode", enabled ? "1" : "0");

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



  function renderGermanReference(screenshot) {

    const texts = screenshot.germanTexts ?? [];

    if (!texts.length) {

      return `

        <div class="field">

          <span class="field-label">German shown in app</span>

          <p class="field-hint">Refer to the screenshot for German text on this screen.</p>

        </div>

      `;

    }



    const items = texts

      .map(

        (entry) => `

          <li class="german-item">

            <span class="german-item-label">${escapeHtml(entry.label)}</span>

            <span class="german-item-text" lang="de">${escapeHtml(entry.german)}</span>

          </li>

        `

      )

      .join("");



    return `

      <div class="field">

        <span class="field-label">German shown in app</span>

        <ul class="german-reference" lang="de">${items}</ul>

      </div>

    `;

  }



  function renderScreenshot(screenshot) {

    const review = getReview(state, screenshot.id);

    const english =

      getEnglish(state, screenshot.id) || screenshot.originalEnglish || "";

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

          <div class="screenshot-frame">

            <img

              src="${escapeAttr(screenshot.image)}"

              alt="${escapeAttr(`${screenshot.title} screenshot`)}"

              onerror="this.onerror=null; this.src='images/placeholder.svg'; this.alt='Screenshot placeholder — add image to images/';"

            />

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

            Review this entire screen as one page.

          </p>



          <div class="progress-bar" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">

            <div class="progress-fill" style="width: ${percent}%"></div>

          </div>

          <p class="progress-caption">

            Progress: ${done} of ${total} pages reviewed

          </p>



          <div class="field owner-only">

            <label class="field-label" for="english-page">

              Original English

              <span class="field-label-sub">(editable by project owner — full page copy)</span>

            </label>

            <textarea

              id="english-page"

              data-english-for="page"

              rows="8"

              placeholder="Paste or type the full English copy for this screen…"

            >${escapeHtml(english)}</textarea>

          </div>



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

    const englishEl = appEl.querySelector("[data-english-for]");

    if (englishEl) {

      englishEl.addEventListener("input", () => {

        setEnglish(state, screenshot.id, englishEl.value);

        persist();

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



  ownerToggle.addEventListener("change", () => setOwnerMode(ownerToggle.checked));

  exportBtn.addEventListener("click", exportData);



  const savedOwnerMode = localStorage.getItem("freeprints-owner-mode");

  if (savedOwnerMode === "0") {

    ownerToggle.checked = false;

  }

  setOwnerMode(ownerToggle.checked);

  render();

})();

