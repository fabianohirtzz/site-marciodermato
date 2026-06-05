/* =====================================================================
   Dr. Márcio Teixeira — main.js
   Calm, accessible behavior. Every effect respects prefers-reduced-motion.
   ===================================================================== */
(function () {
  "use strict";

  const reduceMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- boot: drop the loading guard so transitions can run ---------- */
  function boot() {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.body.classList.remove("is-loading"))
    );
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  /* ------------------------------------------------------------------ */
  /* Gentle reveal (one-shot IntersectionObserver)                      */
  /* ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting && e.intersectionRatio > 0.12) {
              e.target.classList.add("is-in");
              io.unobserve(e.target);
            }
          }
        },
        { threshold: [0, 0.12], rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-in"));
    }
  }

  /* Curve draw (signature gesture) */
  const curveEls = document.querySelectorAll(".curve-draw");
  if (curveEls.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            cio.unobserve(e.target);
          }
        }
      },
      { threshold: 0.4 }
    );
    curveEls.forEach((el) => cio.observe(el));
  }

  /* ------------------------------------------------------------------ */
  /* Nav scrolled state                                                 */
  /* ------------------------------------------------------------------ */
  const nav = document.querySelector("[data-nav]");
  if (nav && !nav.classList.contains("nav--solid")) {
    let navTicking = false;
    const onNavScroll = () => {
      if (navTicking) return;
      navTicking = true;
      requestAnimationFrame(() => {
        nav.classList.toggle("is-solid", window.scrollY > 60);
        navTicking = false;
      });
    };
    window.addEventListener("scroll", onNavScroll, { passive: true });
    onNavScroll();
  }

  /* ------------------------------------------------------------------ */
  /* Mobile drawer                                                      */
  /* ------------------------------------------------------------------ */
  const drawer = document.querySelector("[data-drawer]");
  const scrim = document.querySelector("[data-drawer-scrim]");
  const openBtn = document.querySelector("[data-drawer-open]");
  const closeBtn = document.querySelector("[data-drawer-close]");

  if (drawer && scrim && openBtn) {
    const setDrawer = (open) => {
      drawer.classList.toggle("is-open", open);
      scrim.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      openBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    openBtn.addEventListener("click", () => setDrawer(true));
    closeBtn && closeBtn.addEventListener("click", () => setDrawer(false));
    scrim.addEventListener("click", () => setDrawer(false));
    drawer.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setDrawer(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setDrawer(false);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Hero video — autoplay (motion-safe) + pause control                */
  /* ------------------------------------------------------------------ */
  const video = document.getElementById("hero-video");
  const pauseBtn = document.querySelector("[data-hero-pause]");
  if (video && pauseBtn) {
    const setPaused = (paused) => {
      pauseBtn.classList.toggle("is-paused", paused);
      pauseBtn.setAttribute("aria-label", paused ? "Reproduzir vídeo" : "Pausar vídeo");
    };
    if (reduceMotion()) {
      video.removeAttribute("autoplay");
      video.pause();
      setPaused(true);
    } else {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => setPaused(true));
      setPaused(video.paused);
    }
    pauseBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        setPaused(false);
      } else {
        video.pause();
        setPaused(true);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Soft hero parallax                                                 */
  /* ------------------------------------------------------------------ */
  const heroMedia = document.querySelector(".hero__media.parallax");
  if (heroMedia) {
    let ticking = false;
    const onScroll = () => {
      if (ticking || reduceMotion()) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroMedia.style.transform = `translate3d(0, ${(y * 0.06).toFixed(2)}px, 0)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* Count-up                                                           */
  /* ------------------------------------------------------------------ */
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (reduceMotion()) {
      el.textContent = prefix + target + suffix;
      return;
    }
    const dur = 1400;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const statNums = document.querySelectorAll(".stat__num[data-count]");
  if (statNums.length && "IntersectionObserver" in window) {
    const sio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            countUp(e.target);
            sio.unobserve(e.target);
          }
        }
      },
      { threshold: 0.6 }
    );
    statNums.forEach((el) => sio.observe(el));
  } else {
    statNums.forEach((el) => countUp(el));
  }

  /* ------------------------------------------------------------------ */
  /* Before / after comparison slider                                   */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll("[data-ba]").forEach((ba) => {
    const range = ba.querySelector(".ba__range");
    if (!range) return;
    const apply = () => ba.style.setProperty("--pos", range.value + "%");
    range.addEventListener("input", apply);
    apply();
  });

  /* ------------------------------------------------------------------ */
  /* Smooth anchor scroll (closes drawer, respects reduced motion)      */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion() ? "auto" : "smooth",
        block: "start",
      });
    });
  });
})();
