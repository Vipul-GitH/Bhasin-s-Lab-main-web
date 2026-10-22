(() => {
  // Mobile menu and dropdown behaviour live in /assets/js/site-header.js.
  // Do not bind .mobile-nav-toggle here as well: two handlers on the same
  // button open and immediately close the menu.

  document.querySelectorAll(".portfolio-filters li").forEach((item) => {
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    const activate = () => {
      document
        .querySelectorAll(".portfolio-filters li")
        .forEach((other) => other.classList.remove("active"));
      item.classList.add("active");
      const filter = item.dataset.filter;
      document.querySelectorAll(".portfolio-card").forEach((card) => {
        card.style.display =
          !filter || filter === "all" || card.dataset.category === filter
            ? ""
            : "none";
      });
    };
    item.addEventListener("click", activate);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });
})();
