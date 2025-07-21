  document.addEventListener("DOMContentLoaded", () => {
    const rows = document.querySelectorAll("table tbody tr");
    rows.forEach((row, index) => {
      row.style.opacity = 0; // start hidden
      setTimeout(() => {
        row.classList.add("table-row-animate");
      }, index * 100); // delay for stacking effect
    });
  });

