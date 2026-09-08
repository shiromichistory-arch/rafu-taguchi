(() => {
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  const reveal = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    reveal.forEach((el) => io.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add("is-visible"));
  }

  const messageFor = (remaining, capacity) => {
    if (remaining <= 0) return "満席です";
    if (remaining === 1) return "あと1人入れます";
    if (remaining === capacity) return `あと${remaining}人入れます（空きあり）`;
    return `あと${remaining}人入れます`;
  };

  const statusClass = (remaining) => {
    if (remaining <= 0) return "is-full";
    if (remaining === 1) return "is-almost";
    return "is-open";
  };

  const renderSlot = (block, key, data) => {
    const rem = Math.max(0, Number(data.remaining) || 0);
    const cap = Number(data.capacity) || 0;
    const filled = Math.max(0, cap - rem);
    const el = block.querySelector(`[data-kind="${key}"]`);
    if (!el) return;

    el.classList.remove("is-full", "is-almost", "is-open");
    el.classList.add(statusClass(rem));

    const remainEl = el.querySelector("[data-remain]");
    const msgEl = el.querySelector("[data-msg]");
    const metaEl = el.querySelector("[data-meta]");
    const dots = el.querySelector("[data-dots]");

    if (remainEl) remainEl.textContent = rem > 0 ? String(rem) : "0";
    if (msgEl) msgEl.textContent = messageFor(rem, cap);
    if (metaEl) metaEl.textContent = `定員 ${cap}名 / 利用中 ${filled}名`;

    if (dots) {
      dots.innerHTML = "";
      for (let i = 0; i < cap; i++) {
        const span = document.createElement("span");
        span.className = i < filled ? "dot is-filled" : "dot is-free";
        span.title = i < filled ? "利用中" : "空き";
        dots.appendChild(span);
      }
    }
  };

  const renderAvailability = () => {
    const root = document.querySelector("[data-availability]");
    const data = window.RAFU_AVAILABILITY;
    if (!root || !data) return;

    const note = root.querySelector("[data-avail-note]");
    if (note && data.updatedLabel) note.textContent = data.updatedLabel;

    Object.entries(data.slots || {}).forEach(([period, slot]) => {
      const block = root.querySelector(`[data-period="${period}"]`);
      if (!block) return;
      const title = block.querySelector("[data-period-label]");
      if (title && slot.label) title.textContent = slot.label;
      renderSlot(block, "craft", slot.craft || {});
      renderSlot(block, "exercise", slot.exercise || {});

      const craftRem = Number(slot.craft?.remaining) || 0;
      const exRem = Number(slot.exercise?.remaining) || 0;
      const totalRem = craftRem + exRem;
      const summary = block.querySelector("[data-period-summary]");
      if (summary) {
        summary.textContent =
          totalRem > 0
            ? totalRem === 1
              ? "この時間帯はあと1人入れます"
              : `この時間帯はあと${totalRem}人入れます`
            : "この時間帯は満席です";
      }
    });
  };

  renderAvailability();

  const qr = document.querySelector("[data-instagram-qr]");
  if (qr) {
    const url = "https://www.instagram.com/raf.ryoiku";
    qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(url)}`;
    qr.alt = "らふ Instagram（raf.ryoiku）のQRコード";
  }

  const gallery = document.querySelector("[data-gallery-track]");
  const prevBtn = document.querySelector("[data-gallery-prev]");
  const nextBtn = document.querySelector("[data-gallery-next]");
  if (gallery && prevBtn && nextBtn) {
    const scrollBy = () => Math.min(gallery.clientWidth * 0.8, 360);
    prevBtn.addEventListener("click", () => {
      gallery.scrollBy({ left: -scrollBy(), behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      gallery.scrollBy({ left: scrollBy(), behavior: "smooth" });
    });
  }
})();
