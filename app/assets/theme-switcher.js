/* ============================================================
   VRF KITCHEN — THEME SWITCHER
   Floating control that lets any page change theme + mode live.
   Reads the registry from themes.js; no per-page wiring needed.

   Hide it on a page with:  <body data-no-theme-switcher>
   ============================================================ */
(function () {
  "use strict";

  const MODES = [
    { id: "light", label: "Light", icon: "sun" },
    { id: "dark", label: "Dark", icon: "moon" },
    { id: "auto", label: "Auto", icon: "monitor" },
  ];

  function build() {
    if (!window.VRFTheme || document.getElementById("tsw-fab")) return;
    if (document.body.hasAttribute("data-no-theme-switcher")) return;

    const fab = document.createElement("button");
    fab.id = "tsw-fab";
    fab.className = "tsw-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Change theme");
    fab.setAttribute("aria-expanded", "false");
    fab.innerHTML = '<i data-lucide="palette"></i>';

    const scrim = document.createElement("div");
    scrim.className = "tsw-scrim";
    scrim.hidden = true;

    const panel = document.createElement("div");
    panel.className = "tsw-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Theme settings");
    panel.hidden = true;

    const themes = window.VRFTheme.list();
    panel.innerHTML =
      '<p class="tsw-head">Appearance</p>' +
      '<div class="tsw-modes" role="group" aria-label="Colour mode">' +
        MODES.map((m) =>
          `<button type="button" class="tsw-mode" data-mode="${m.id}">
             <i data-lucide="${m.icon}"></i>${m.label}
           </button>`
        ).join("") +
      "</div>" +
      '<p class="tsw-head" style="margin-top:1rem">Theme</p>' +
      '<div class="tsw-grid" role="group" aria-label="Colour theme">' +
        themes.map((t) =>
          `<button type="button" class="tsw-opt" data-theme="${t.id}">
             <span class="tsw-dots">${t.swatch.map((c) => `<span style="background:${c}"></span>`).join("")}</span>
             ${t.label}
           </button>`
        ).join("") +
      "</div>";

    document.body.append(fab, scrim, panel);

    /* ---- open / close ---- */
    let open = false;
    function setOpen(next) {
      open = next;
      fab.setAttribute("aria-expanded", String(open));
      if (open) {
        scrim.hidden = panel.hidden = false;
        // let the browser register the initial state before transitioning
        requestAnimationFrame(() => {
          scrim.classList.add("is-open");
          panel.classList.add("is-open");
        });
      } else {
        scrim.classList.remove("is-open");
        panel.classList.remove("is-open");
        setTimeout(() => {
          if (!open) scrim.hidden = panel.hidden = true;
        }, 240);
      }
    }

    fab.addEventListener("click", () => setOpen(!open));
    scrim.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    });

    /* ---- selection ----
       Match on the button classes, not on [data-theme]/[data-mode]:
       themes.js stamps those same attributes onto <html>, and closest()
       walks up to it — so a bare [data-theme] lookup hits the document
       element and swallows every click. */
    panel.addEventListener("click", (e) => {
      const themeBtn = e.target.closest(".tsw-opt");
      if (themeBtn) {
        window.VRFTheme.setTheme(themeBtn.dataset.theme);
        return;
      }
      const modeBtn = e.target.closest(".tsw-mode");
      if (modeBtn) window.VRFTheme.setMode(modeBtn.dataset.mode);
    });

    /* ---- keep the panel's checked state in sync ---- */
    function sync() {
      const theme = window.VRFTheme.getTheme();
      const mode = window.VRFTheme.getMode();
      panel.querySelectorAll("[data-theme]").forEach((b) =>
        b.classList.toggle("is-on", b.dataset.theme === theme)
      );
      panel.querySelectorAll("[data-mode]").forEach((b) =>
        b.classList.toggle("is-on", b.dataset.mode === mode)
      );
    }
    window.addEventListener("themechange", sync);
    sync();

    if (window.lucide) lucide.createIcons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
