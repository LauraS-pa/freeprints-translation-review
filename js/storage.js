(function () {
  const STORAGE_KEY = "freeprints-translation-review-v2";
  const LEGACY_KEY = "freeprints-translation-review-v1";

  const EMPTY_REVIEW = {
    status: null,
    correctedGerman: "",
    notes: "",
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      /* fall through to migration */
    }

    const migrated = migrateLegacyState();
    if (migrated) {
      saveState(migrated);
      return migrated;
    }

    return { english: {}, reviews: {} };
  }

  function migrateLegacyState() {
    try {
      const raw = localStorage.getItem(LEGACY_KEY);
      if (!raw) return null;

      const legacy = JSON.parse(raw);
      const screenshots = window.SCREENSHOTS ?? [];
      const english = {};
      const reviews = {};

      for (const screenshot of screenshots) {
        const blocks = screenshot.textBlocks ?? [];
        if (!blocks.length) continue;

        const englishParts = blocks
          .map((block) => legacy.english?.[`${screenshot.id}:${block.id}`] ?? "")
          .filter(Boolean);
        if (englishParts.length) {
          english[screenshot.id] = englishParts.join("\n\n");
        }

        const blockReviews = blocks.map((block) => {
          return (
            legacy.reviews?.[`${screenshot.id}:${block.id}`] ?? { ...EMPTY_REVIEW }
          );
        });

        const hasChanges = blockReviews.some((r) => r.status === "needs-changes");
        const allCorrect =
          blockReviews.length > 0 &&
          blockReviews.every((r) => r.status === "correct");
        const anyReviewed = blockReviews.some(
          (r) => r.status === "correct" || r.status === "needs-changes"
        );

        if (!anyReviewed) continue;

        if (hasChanges) {
          const corrections = blockReviews
            .map((r, i) => {
              const text = r.correctedGerman?.trim();
              if (!text) return "";
              const label = blocks[i]?.label;
              return label ? `${label}: ${text}` : text;
            })
            .filter(Boolean);

          const notes = blockReviews
            .map((r, i) => {
              const text = r.notes?.trim();
              if (!text) return "";
              const label = blocks[i]?.label;
              return label ? `${label}: ${text}` : text;
            })
            .filter(Boolean);

          reviews[screenshot.id] = {
            status: "needs-changes",
            correctedGerman: corrections.join("\n\n"),
            notes: notes.join("\n\n"),
          };
        } else if (allCorrect) {
          reviews[screenshot.id] = { ...EMPTY_REVIEW, status: "correct" };
        }
      }

      return { english, reviews };
    } catch {
      return null;
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getEnglish(state, screenshotId) {
    return state.english[screenshotId] ?? "";
  }

  function setEnglish(state, screenshotId, value) {
    state.english[screenshotId] = value;
  }

  function getReview(state, screenshotId) {
    return state.reviews[screenshotId] ?? { ...EMPTY_REVIEW };
  }

  function setReview(state, screenshotId, review) {
    state.reviews[screenshotId] = review;
  }

  function isReviewed(review) {
    return review.status === "correct" || review.status === "needs-changes";
  }

  function exportReviews(state, screenshots) {
    return screenshots.map((screenshot) => {
      const review = getReview(state, screenshot.id);
      return {
        screenshot: screenshot.title,
        screenshotId: screenshot.id,
        germanTexts: screenshot.germanTexts ?? [],
        originalEnglish: getEnglish(state, screenshot.id) || screenshot.originalEnglish || "",
        status: review.status ?? "pending",
        correctedGerman: review.correctedGerman,
        notes: review.notes,
      };
    });
  }

  window.ReviewStorage = {
    loadState,
    saveState,
    getEnglish,
    setEnglish,
    getReview,
    setReview,
    isReviewed,
    exportReviews,
  };
})();
