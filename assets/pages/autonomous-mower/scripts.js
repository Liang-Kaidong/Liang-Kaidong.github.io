document.querySelectorAll('.mower-page main section:not(.mower-hero) .section-kicker').forEach((label, index) => {
  label.textContent = label.textContent.replace(/^\d+(?=\s*\/)/, String(index + 1).padStart(2, '0'));
});
