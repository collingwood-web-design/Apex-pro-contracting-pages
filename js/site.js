(() => {
  const header = document.querySelector(".site-header--over-hero");
  if (header) {
    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  const mobileNav = window.matchMedia("(max-width: 860px)");

  document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("click", (event) => {
      if (!mobileNav.matches) return;
      if (event.target.closest(".nav-dropdown-menu a")) return;
      event.preventDefault();
      dropdown.classList.toggle("is-open");
    });

    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("is-open");
      }
    });
  });

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target instanceof HTMLDetailsElement) {
      target.open = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
})();
