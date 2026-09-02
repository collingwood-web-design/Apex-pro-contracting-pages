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

  const initServiceAreaMarquee = () => {
    const area = document.querySelector(".service-area");
    const track = area?.querySelector(".service-area-track");
    if (!area || !track) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const seed = track.querySelector(".service-area-group");
    if (!seed) return;

    const template = seed.cloneNode(true);
    track.replaceChildren();
    track.style.removeProperty("--marquee-distance");

    const appendGroup = (hidden) => {
      const group = template.cloneNode(true);
      if (hidden) group.setAttribute("aria-hidden", "true");
      else group.removeAttribute("aria-hidden");
      track.appendChild(group);
    };

    appendGroup(false);
    while (track.scrollWidth < area.clientWidth + 1) {
      appendGroup(true);
    }

    const loopWidth = track.scrollWidth;
    [...track.children].forEach((child) => {
      const clone = child.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    track.style.setProperty("--marquee-distance", `${loopWidth}px`);
  };

  initServiceAreaMarquee();
  window.addEventListener("resize", initServiceAreaMarquee);

  const viewers = [...document.querySelectorAll(".project-gallery-viewer")];
  if (viewers.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Project image gallery");
  lightbox.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Close gallery">&times;</button>
    <button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">&lsaquo;</button>
    <button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">&rsaquo;</button>
    <figure class="lightbox-figure">
      <img src="" alt="" />
    </figure>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox-figure img");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  let activeViewer = null;
  let galleryItems = [];
  let currentIndex = 0;
  let lastFocus = null;

  const setActiveThumb = (viewer, index) => {
    const leadImg = viewer.querySelector(".project-gallery-lead-btn img");
    const thumbs = [...viewer.querySelectorAll(".project-gallery-thumb")];
    const item = galleryItems[index];
    if (!leadImg || !item) return;

    if (!viewer.dataset.defaultAlt) {
      viewer.dataset.defaultAlt = leadImg.alt;
    }

    currentIndex = index;
    leadImg.src = item.src;
    leadImg.alt = item.alt || viewer.dataset.defaultAlt;

    thumbs.forEach((thumb, thumbIndex) => {
      const isActive = thumbIndex === index;
      thumb.classList.toggle("is-active", isActive);
      thumb.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  const setLightboxImage = (index) => {
    if (!galleryItems.length) return;
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    const defaultAlt = activeViewer?.dataset.defaultAlt ?? "";
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt || defaultAlt;
    if (activeViewer) setActiveThumb(activeViewer, currentIndex);
  };

  const openLightbox = (viewer, index) => {
    activeViewer = viewer;
    galleryItems = [...viewer.querySelectorAll(".project-gallery-thumb img")];
    if (!galleryItems.length) {
      const leadImg = viewer.querySelector(".project-gallery-lead-btn img");
      if (!leadImg) return;
      galleryItems = [leadImg];
    }

    const showNav = galleryItems.length > 1;
    prevBtn.hidden = !showNav;
    nextBtn.hidden = !showNav;

    lastFocus = document.activeElement;
    setLightboxImage(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
    activeViewer = null;
    galleryItems = [];
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  };

  viewers.forEach((viewer) => {
    const leadBtn = viewer.querySelector(".project-gallery-lead-btn");
    const thumbs = [...viewer.querySelectorAll(".project-gallery-thumb")];

    if (leadBtn) {
      leadBtn.addEventListener("click", () => {
        const activeThumbIndex = thumbs.findIndex((thumb) => thumb.classList.contains("is-active"));
        openLightbox(viewer, activeThumbIndex >= 0 ? activeThumbIndex : 0);
      });
    }

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        galleryItems = [...viewer.querySelectorAll(".project-gallery-thumb img")];
        setActiveThumb(viewer, index);
      });
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => setLightboxImage(currentIndex - 1));
  nextBtn.addEventListener("click", () => setLightboxImage(currentIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft" && galleryItems.length > 1) setLightboxImage(currentIndex - 1);
    if (event.key === "ArrowRight" && galleryItems.length > 1) setLightboxImage(currentIndex + 1);
  });
  }

  const contactForm = document.getElementById("contact-form");
  const contactSuccessModal = document.getElementById("contact-success-modal");

  if (contactForm && contactSuccessModal) {
    const closeBtn = contactSuccessModal.querySelector(".contact-success-close");
    let lastFocus = null;

    const openSuccessModal = () => {
      lastFocus = document.activeElement;
      contactSuccessModal.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn?.focus();
    };

    const closeSuccessModal = () => {
      contactSuccessModal.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus instanceof HTMLElement) lastFocus.focus();
    };

    contactForm.addEventListener("cwd-contact:success", () => {
      contactForm.reset();
      openSuccessModal();
    });

    closeBtn?.addEventListener("click", closeSuccessModal);

    contactSuccessModal.addEventListener("click", (event) => {
      if (event.target === contactSuccessModal) closeSuccessModal();
    });

    document.addEventListener("keydown", (event) => {
      if (contactSuccessModal.hidden) return;
      if (event.key === "Escape") closeSuccessModal();
    });
  }
})();
