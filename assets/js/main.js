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
      if (window.innerWidth > 1080) return;
      const item = link.parentElement;
      if (!item.classList.contains("open")) {
        event.preventDefault();
        document.querySelectorAll(".dropdown.open").forEach((other) => {
          if (other !== item) other.classList.remove("open");
        });
        item.classList.add("open");
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) setMenuState(false);
  });

  document
    .querySelectorAll("form[data-draft-form]")
    .forEach((form, formIndex) => {
      form
        .querySelectorAll("input, select, textarea")
        .forEach((control, controlIndex) => {
          if (control.type === "submit" || control.type === "button") return;
          const field = control.closest(".field");
          const label = field?.querySelector("label");
          const id = control.id || `enquiry-${formIndex}-${controlIndex}`;
          control.id = id;
          if (label && !label.htmlFor) label.htmlFor = id;
          if (!control.name) {
            const key = (
              label?.textContent || `${control.tagName}-${controlIndex}`
            )
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
            control.name = key || `field-${controlIndex}`;
          }
        });

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const fields = [...new FormData(form).entries()]
          .filter(([, value]) => String(value).trim())
          .map(([key, value]) => `${key.replace(/-/g, " ")}: ${value}`);
        const message = [
          "Hello Dr Bhasin's Lab, I would like assistance with an enquiry.",
          "",
          ...fields,
        ].join("\n");
        const status = form.querySelector(".form-status");
        if (status)
          status.textContent =
            "Your enquiry is ready. Opening WhatsApp securely…";
        window.open(
          `https://wa.me/919311193111?text=${encodeURIComponent(message)}`,
          "_blank",
          "noopener",
        );
      });
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
