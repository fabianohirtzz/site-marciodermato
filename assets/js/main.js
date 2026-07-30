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

  /* --- font guard: reveal font-sensitive layout (the stats row) only once
     the webfonts have settled, so it never paints the wider fallback font in a
     wrapped state and then reflows. Safety timeout keeps content from ever
     staying hidden if font loading stalls. ------------------------------- */
  (function dropFontGuard() {
    let done = false;
    const drop = () => {
      if (done) return;
      done = true;
      document.body.classList.remove("fonts-pending");
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(drop);
    } else {
      drop();
    }
    setTimeout(drop, 1500);
  })();

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
  /* Nav sliding indicator (a pill that glides between links)           */
  /* ------------------------------------------------------------------ */
  (function navIndicator() {
    const links = document.querySelector(".nav__links");
    if (!links) return;
    const ind = links.querySelector(".nav__indicator");
    if (!ind) return;
    const items = [...links.querySelectorAll(".nav__link")];
    if (!items.length) return;

    const active = () =>
      links.querySelector('.nav__link[aria-current="page"]') || items[0];
    const moveTo = (el) => {
      if (!el) {
        ind.style.setProperty("--ind-o", "0");
        return;
      }
      ind.style.setProperty("--ind-x", el.offsetLeft + "px");
      ind.style.setProperty("--ind-w", el.offsetWidth + "px");
      ind.style.setProperty("--ind-o", "1");
    };
    const rest = () => moveTo(active());

    items.forEach((a) => {
      a.addEventListener("mouseenter", () => moveTo(a));
      a.addEventListener("focus", () => moveTo(a));
    });
    links.addEventListener("mouseleave", rest);
    links.addEventListener("focusout", rest);

    rest();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(rest);
    window.addEventListener("load", rest);
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(rest, 150);
    });
  })();

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
    /* iOS only honors inline autoplay when muted is set as a property too. */
    video.muted = true;
    video.setAttribute("muted", "");
    const setPaused = (paused) => {
      pauseBtn.classList.toggle("is-paused", paused);
      pauseBtn.setAttribute("aria-label", paused ? "Reproduzir vídeo" : "Pausar vídeo");
    };
    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.then(() => setPaused(false)).catch(() => setPaused(true));
      } else {
        setPaused(video.paused);
      }
    };
    if (reduceMotion()) {
      video.removeAttribute("autoplay");
      video.pause();
      setPaused(true);
    } else {
      tryPlay();
      /* If the browser blocked autoplay, retry once the video can actually play. */
      video.addEventListener("canplay", () => { if (video.paused) tryPlay(); }, { once: true });
    }
    pauseBtn.addEventListener("click", () => {
      if (video.paused) {
        video.muted = true;
        tryPlay();
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
    /* Lock the box to its resting width so the changing digit count — and
       Cormorant's proportional figures, where some intermediate values (e.g.
       1888) are wider than the final one (1993) — can't reflow the stats row
       mid-count. Released when the count finishes so it stays responsive. */
    el.style.width = el.getBoundingClientRect().width + "px";
    const dur = 1400;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.style.width = "";
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

    /* Press-and-drag anywhere on the image (touch + mouse), not just the thumb.
       The range stays for keyboard a11y; pointer events drive the live drag. */
    let dragging = false;
    const setFromX = (clientX) => {
      const rect = ba.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      range.value = pct;
      ba.style.setProperty("--pos", pct + "%");
    };
    ba.addEventListener("pointerdown", (e) => {
      dragging = true;
      if (ba.setPointerCapture) {
        try { ba.setPointerCapture(e.pointerId); } catch (_) {}
      }
      setFromX(e.clientX);
    });
    ba.addEventListener("pointermove", (e) => {
      if (dragging) setFromX(e.clientX);
    });
    const stop = (e) => {
      if (!dragging) return;
      dragging = false;
      if (ba.releasePointerCapture && e.pointerId != null) {
        try { ba.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };
    ba.addEventListener("pointerup", stop);
    ba.addEventListener("pointercancel", stop);
  });

  /* ------------------------------------------------------------------ */
  /* Antes e Depois — full-bleed carousel + tap-to-reveal               */
  /* ------------------------------------------------------------------ */
  (function casos() {
    const track = document.querySelector("[data-casos-track]");
    if (!track) return;
    const prev = document.querySelector("[data-casos-prev]");
    const next = document.querySelector("[data-casos-next]");

    /* one card (width + gap) per arrow click */
    const step = () => {
      const card = track.querySelector(".caso-item");
      if (!card) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };
    const go = (dir) =>
      track.scrollBy({ left: dir * step(), behavior: reduceMotion() ? "auto" : "smooth" });
    prev && prev.addEventListener("click", () => go(-1));
    next && next.addEventListener("click", () => go(1));

    const updateArrows = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    let ticking = false;
    track.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          updateArrows();
          ticking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", updateArrows);
    updateArrows();

    /* hover-less (touch) devices: tap toggles the "depois" persistently */
    track.querySelectorAll(".caso__toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const caso = btn.closest(".caso");
        if (!caso) return;
        const on = caso.classList.toggle("is-revealed");
        btn.setAttribute("aria-pressed", String(on));
      });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Avaliações — manual carousel with arrows (mirrors casos)           */
  /* ------------------------------------------------------------------ */
  (function reviews() {
    const track = document.querySelector("[data-reviews-track]");
    if (!track) return;
    const prev = document.querySelector("[data-reviews-prev]");
    const next = document.querySelector("[data-reviews-next]");

    const step = () => {
      const card = track.querySelector(".review-item");
      if (!card) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };
    const go = (dir) =>
      track.scrollBy({ left: dir * step(), behavior: reduceMotion() ? "auto" : "smooth" });
    prev && prev.addEventListener("click", () => go(-1));
    next && next.addEventListener("click", () => go(1));

    const updateArrows = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    let ticking = false;
    track.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          updateArrows();
          ticking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", updateArrows);
    updateArrows();
  })();

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

  /* ------------------------------------------------------------------ */
  /* Fio de cabelo lateral — um por seção, alternando os lados           */
  /* O fio (símbolo da marca) vive na margem livre de cada seção, longe  */
  /* do texto, desenha conforme a seção cruza a viewport, e encosta/some */
  /* na divisa (graças ao overflow:clip da .section). Inverte para claro */
  /* sobre a faixa teal. Respeita prefers-reduced-motion.                */
  /* ------------------------------------------------------------------ */
  (function fioMotif() {
    const SVGNS = "http://www.w3.org/2000/svg";
    const secs = [...document.querySelectorAll("[data-fio]")];
    if (!secs.length) return;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // defs compartilhados (gradiente teal + leve blur do brilho)
    if (!document.getElementById("fio-defs")) {
      const def = document.createElementNS(SVGNS, "svg");
      def.id = "fio-defs";
      def.setAttribute("width", "0");
      def.setAttribute("height", "0");
      def.setAttribute("aria-hidden", "true");
      def.style.position = "absolute";
      def.innerHTML =
        '<defs><linearGradient id="fio-grad" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#19b3a6"/>' +
        '<stop offset="0.5" stop-color="#057f7f"/>' +
        '<stop offset="1" stop-color="#044d4d"/></linearGradient>' +
        '<filter id="fio-soft" x="-30%" y="-30%" width="160%" height="160%">' +
        '<feGaussianBlur stdDeviation="2"/></filter></defs>';
      document.body.appendChild(def);
    }

    const items = secs.map((sec) => {
      const side = sec.dataset.fio === "right" ? "right" : "left";
      const deep = sec.classList.contains("section--deep");
      const svg = document.createElementNS(SVGNS, "svg");
      svg.setAttribute("class", "fio-sec");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("preserveAspectRatio", "none");
      const main = document.createElementNS(SVGNS, "path");
      main.setAttribute("class", "fio-sec__main");
      main.setAttribute("pathLength", "1");
      main.setAttribute("fill", "none");
      main.style.stroke = deep ? "#dff3ef" : "url(#fio-grad)";
      const sheen = document.createElementNS(SVGNS, "path");
      sheen.setAttribute("class", "fio-sec__sheen");
      sheen.setAttribute("pathLength", "1");
      sheen.setAttribute("fill", "none");
      sheen.style.stroke = deep ? "#f1fffb" : "#1ec7b6";
      svg.appendChild(main);
      svg.appendChild(sheen);
      sec.appendChild(svg); // último filho: fica em z-base, atrás do conteúdo
      return { sec, side, deep, svg, main, sheen };
    });

    let W = 0;
    function build() {
      W = window.innerWidth;
      const tooNarrow = W < 1080;
      items.forEach((o) => {
        const r = o.sec.getBoundingClientRect();
        const h = r.height;
        const cont = o.sec.querySelector(".container");
        const cr = cont ? cont.getBoundingClientRect() : { left: W * 0.08, right: W * 0.92 };
        // margem lateral externa livre (sem texto), no lado escolhido
        const gutter = o.side === "left" ? Math.max(0, cr.left) : Math.max(0, W - cr.right);
        const bandX = o.side === "left" ? gutter * 0.5 : W - gutter * 0.5;
        const amp = Math.max(6, Math.min(gutter * 0.42, 20));
        const hide = tooNarrow || gutter < 26;
        o.svg.style.display = hide ? "none" : "block";
        if (hide) return;
        o.svg.setAttribute("viewBox", "0 0 " + W + " " + h);
        // fio vertical que afunila para um ponto no topo e na base (encosta na divisa)
        const step = Math.max(5, h / 64);
        let d = "";
        for (let y = 0; y <= h; y += step) {
          const t = y / Math.max(1, h);
          const env = Math.sin(Math.PI * t); // 0 nas pontas, 1 no meio
          const wave = Math.sin(t * Math.PI * 1.25 + (o.side === "left" ? 0 : Math.PI));
          const micro = Math.sin(t * Math.PI * 6.5) * 0.16; // micro vida de cabelo
          const x = bandX + (wave + micro) * amp * env;
          d += (y === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
        }
        o.main.setAttribute("d", d);
        o.sheen.setAttribute("d", d);
      });
      onScroll();
    }

    const SEG = 0.08;
    const reduce = reduceMotion();
    function onScroll() {
      const vh = window.innerHeight;
      items.forEach((o) => {
        if (o.svg.style.display === "none") return;
        const r = o.sec.getBoundingClientRect();
        const sp = clamp((vh * 0.82 - r.top) / Math.max(1, r.height), 0, 1);
        const off = reduce ? 0 : (1 - sp).toFixed(4);
        o.main.style.strokeDasharray = 1;
        o.main.style.strokeDashoffset = off;
        if (reduce) {
          o.sheen.style.opacity = 0;
          return;
        }
        o.sheen.style.strokeDasharray = SEG + " " + (1 - SEG);
        o.sheen.style.strokeDashoffset = (SEG / 2 - sp).toFixed(4);
        const edge = Math.min(sp, 1 - sp); // brilho some nas pontas
        o.sheen.style.opacity = (0.9 * clamp(edge / 0.12, 0, 1)).toFixed(3);
      });
    }

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
      },
      { passive: true }
    );
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(build, 150);
    });
    if (document.readyState === "complete") build();
    else window.addEventListener("load", build);
  })();
})();

/* =====================================================================
   Tratamentos — axis filter (índice) + FAQ single-open (sub-páginas)
   Self-contained; honors prefers-reduced-motion via the reveal contract.
   ===================================================================== */
(function () {
  "use strict";

  /* --- axis filter: chips hide/show whole eixo groups ---------------- */
  const filterBar = document.querySelector("[data-treat-filter]");
  if (filterBar) {
    const chips = Array.from(filterBar.querySelectorAll(".filter-chip"));
    const groups = Array.from(document.querySelectorAll("[data-eixo-group]"));

    const apply = (eixo) => {
      groups.forEach((g) => {
        const match = eixo === "all" || g.getAttribute("data-eixo-group") === eixo;
        g.hidden = !match;
        if (match) {
          // guarantee revealed cards never stay invisible after a re-show
          g.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
        }
      });
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
        apply(chip.getAttribute("data-eixo") || "all");
      });
    });
  }

  /* --- FAQ: keep a single item open at a time ------------------------ */
  document.querySelectorAll("[data-accordion]").forEach((acc) => {
    const items = Array.from(acc.querySelectorAll("details.faq__item"));
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  });
})();

/* =====================================================================
   Páginas internas — Método 4D (switcher de eixos), Sobre (lightbox),
   CTAs rastreados (MeuTrack). Self-contained; cada bloco protege-se
   pelos próprios elementos, então roda sem erro em qualquer página.
   ===================================================================== */
(function () {
  "use strict";

  /* --- Método 4D: switcher de eixos (tabs acessíveis) ---------------- */
  document.querySelectorAll("[data-axes-switch]").forEach((root) => {
    const tabs = Array.from(root.querySelectorAll(".axes-switch__tab"));
    const panels = Array.from(root.querySelectorAll(".axis-panel"));
    if (!tabs.length || tabs.length !== panels.length) return;

    const activate = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = j === i;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].classList.toggle("is-active", on);
      });
      if (focus) tabs[i].focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(i));
      tab.addEventListener("keydown", (e) => {
        let ni = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") ni = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") ni = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") ni = 0;
        else if (e.key === "End") ni = tabs.length - 1;
        if (ni !== null) {
          e.preventDefault();
          activate(ni, true);
        }
      });
    });
  });

  /* --- Sobre: lightbox da galeria "Nosso Espaço" --------------------- */
  (function lightbox() {
    const group = document.querySelector("[data-lightbox-group]");
    const box = document.querySelector("[data-lightbox]");
    if (!group || !box) return;
    const items = Array.from(group.querySelectorAll("a[data-lightbox-item]"));
    if (!items.length) return;

    const imgEl = box.querySelector(".lightbox__img");
    const capEl = box.querySelector(".lightbox__cap");
    const btnClose = box.querySelector("[data-lightbox-close]");
    const btnPrev = box.querySelector("[data-lightbox-prev]");
    const btnNext = box.querySelector("[data-lightbox-next]");
    const controls = [btnPrev, btnNext, btnClose].filter(Boolean);
    let idx = 0;
    let lastFocus = null;

    const show = (i) => {
      idx = (i + items.length) % items.length;
      const a = items[idx];
      const img = a.querySelector("img");
      imgEl.src = a.getAttribute("href");
      imgEl.alt = img ? img.alt : "";
      capEl.textContent = img ? img.alt : "";
    };
    const open = (i) => {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add("is-open");
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      btnClose.focus();
    };
    const close = () => {
      box.classList.remove("is-open");
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    items.forEach((a, i) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        open(i);
      })
    );
    btnClose.addEventListener("click", close);
    btnPrev && btnPrev.addEventListener("click", () => show(idx - 1));
    btnNext && btnNext.addEventListener("click", () => show(idx + 1));
    box.addEventListener("click", (e) => {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
      else if (e.key === "Tab") {
        /* simple focus trap among the overlay controls */
        e.preventDefault();
        const pos = controls.indexOf(document.activeElement);
        const nextPos = e.shiftKey
          ? (pos - 1 + controls.length) % controls.length
          : (pos + 1) % controls.length;
        controls[nextPos < 0 ? 0 : nextPos].focus();
      }
    });
  })();

  /* --- CTAs rastreados: repassa origem e visitante ao formulário ----- */
  (function trackedCtas() {
    const BASE = "https://meutrack-ingest.carlosabsj-ti.workers.dev/f/";
    const links = document.querySelectorAll('a[href^="' + BASE + '"]');
    if (!links.length) return;

    // O pixel (t.js) grava o visitorId no nosso domínio; o formulário roda em
    // outra origem e não enxerga esse storage, então mandamos pela querystring.
    const visitorId = () => {
      try {
        return (window.TrackHub && TrackHub.getVisitorId && TrackHub.getVisitorId()) || localStorage.getItem("th_vid") || "";
      } catch (e) {
        return "";
      }
    };

    links.forEach((a) => {
      const href = a.getAttribute("href");
      a.addEventListener("click", () => {
        const url = new URL(href);
        url.searchParams.set("ref", location.href);
        const vid = visitorId();
        if (vid) url.searchParams.set("vid", vid);
        a.setAttribute("href", url.toString());
      });
    });
  })();

  /* --- Popup do formulário: veste o overlay do embed.js -------------
     O embed.js monta o overlay com estilo inline e sem classe; o único
     identificador estável é o z-index. Marcamos com .th-modal para o CSS
     assumir a aparência. Toda a lógica (altura, Escape, redirect final)
     continua sendo do script deles. */
  (function popupDoFormulario() {
    const Z_DO_OVERLAY = "2147483000";

    // Tenta focar o iframe por até ~10 frames: no embed.js atual o iframe já
    // está dentro do overlay quando ele entra no body (montagem síncrona), mas
    // se uma versão futura do script adiar essa inserção, não queremos que o
    // foco se perca em silêncio — e sem observar a subtree, vestir() não seria
    // chamado de novo para o mesmo nó.
    const focarIframe = (no, tentativa) => {
      const frame = no.querySelector("iframe");
      if (frame) {
        frame.focus();
        return;
      }
      if ((tentativa || 0) < 10) requestAnimationFrame(() => focarIframe(no, (tentativa || 0) + 1));
    };

    const vestir = (no) => {
      if (!(no instanceof HTMLElement)) return;
      if (no.style.zIndex !== Z_DO_OVERLAY || no.dataset.thVestido) return;
      no.dataset.thVestido = "1";
      no.classList.add("th-modal");
      no.setAttribute("role", "dialog");
      no.setAttribute("aria-modal", "true");
      no.setAttribute("aria-label", "Agende sua avaliação");
      focarIframe(no);
    };

    new MutationObserver((registros) => {
      for (const reg of registros) reg.addedNodes.forEach(vestir);
    }).observe(document.body, { childList: true });
  })();
})();
