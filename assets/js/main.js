(() => {
  const nav = document.querySelector(".navmenu");
  const toggle = document.querySelector(".mobile-nav-toggle");

  const setMenuState = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle("mobile-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    const icon = toggle.querySelector("i");
    if (icon) icon.className = open ? "bi bi-x-lg" : "bi bi-list";
  };

  if (nav && toggle) {
    toggle.addEventListener("click", () =>
      setMenuState(!nav.classList.contains("mobile-open")),
    );
  }

  document.querySelectorAll(".dropdown > a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const item = link.parentElement;
      const isOpen = item.classList.contains("open");

      event.preventDefault();
      document.querySelectorAll(".dropdown.open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("open", !isOpen);
      link.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".dropdown")) return;
    document.querySelectorAll(".dropdown.open").forEach((item) => {
      item.classList.remove("open");
      item.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) setMenuState(false);
  });

  

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
