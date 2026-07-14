/* ============================================================
   VRF KITCHEN — DYNAMIC THEME ENGINE
   ------------------------------------------------------------
   Every colour in the app resolves from the tokens below.
   Swap a preset (or inject a merchant's brand at runtime) and
   the entire site re-skins instantly — no CSS edits needed.

   Usage:
     setTheme("slate")            // switch preset
     setMode("dark")              // "light" | "dark" | "auto"
     registerTheme("acme", {...}) // inject a brand at runtime
     getTheme() / getMode()

   Load this BEFORE theme.css-dependent paint (it is inlined in
   <head>, so the saved theme is applied with zero flash).
   ============================================================ */
(function (root) {
  "use strict";

  /* ----------------------------------------------------------
     TOKEN CONTRACT
     Each theme supplies a `light` and a `dark` ramp. Keys map
     1:1 to the CSS custom properties consumed by theme.css.
     ---------------------------------------------------------- */
  const THEMES = {
    /* ---- DEFAULT: refined, editorial. Forest-green primary +
           warm brass accent on a soft bone canvas.
           Reads as premium hospitality, not fast-food. ---- */
    atelier: {
      label: "Atelier",
      swatch: ["#0F5132", "#B4874B", "#F7F5F1"],
      light: {
        primary: "#0F5132",   /* deep forest green — buttons, active nav.
                                 The original #1D2B26 was only 19% saturated
                                 and read as plain black on every button. */
        primary2: "#0B3F27",  /* hover / pressed */
        accent: "#B4874B",      /* warm brass — badges, icons, hairlines */
        accentOn: "#946F3D",    /* accent as a SOLID FILL: darkened so white
                                   text on it clears 4.5:1 (the raw accent
                                   only manages ~3.2:1) */
        accent2: "#866131",
        accentSoft: "#F3E9DA",
        gold: "#C9A55F",
        goldSoft: "#F4EADA",
        canvas: "#F7F5F1",    /* page background */
        canvas2: "#EFEBE3",   /* recessed surfaces, skeletons */
        surface: "#FFFFFF",   /* cards */
        ink: "#16211D",       /* primary text */
        ink2: "#67716C",      /* secondary text */
        line: "#E4E0D7",      /* hairlines */
        shadowRgb: "22,33,29",
      },
      dark: {
        primary: "#3E9C6B",   /* forest green, lifted for a dark canvas */
        primary2: "#4FAF7C",
        accent: "#C4924F",
        accentOn: "#C4924F",
        accent2: "#D3A365",
        accentSoft: "#2E2418",
        gold: "#C9A55F",
        goldSoft: "#2C2519",
        canvas: "#121512",
        canvas2: "#1A1F1C",
        surface: "#191E1B",
        ink: "#ECEFEC",
        ink2: "#9AA5A0",
        line: "#2A312D",
        shadowRgb: "0,0,0",
      },
    },

    /* ---- Original VRF brand, preserved as a preset ---- */
    heritage: {
      label: "Heritage",
      swatch: ["#0E4D31", "#E8590C", "#FBF7EF"],
      light: {
        primary: "#0E4D31", primary2: "#13603D",
        accent: "#E8590C",
        accentOn: "#C84D0A", accent2: "#B44509", accentSoft: "#FBEAD9",
        gold: "#E9C877", goldSoft: "#F4E3B8",
        canvas: "#FBF7EF", canvas2: "#F4ECDD", surface: "#FFFFFF",
        ink: "#20180F", ink2: "#6B5D4C", line: "#EBE2D2",
        shadowRgb: "32,24,15",
      },
      dark: {
        primary: "#59B98A", primary2: "#6FC99B",
        accent: "#F97A33",
        accentOn: "#F97A33", accent2: "#FB8F52", accentSoft: "#33200F",
        gold: "#E9C877", goldSoft: "#2E2616",
        canvas: "#14110C", canvas2: "#1C1811", surface: "#1B1710",
        ink: "#F2EDE4", ink2: "#A79C8B", line: "#2E281E",
        shadowRgb: "0,0,0",
      },
    },

    /* ---- Cool, corporate, precise ---- */
    slate: {
      label: "Slate",
      swatch: ["#1E3A5F", "#2E9E8F", "#F5F7FA"],
      light: {
        primary: "#1E3A5F", primary2: "#2A4E7C",
        accent: "#2E9E8F",
        accentOn: "#268275", accent2: "#207369", accentSoft: "#DCF0EC",
        gold: "#5B8FC7", goldSoft: "#E2ECF7",
        canvas: "#F5F7FA", canvas2: "#EBEFF5", surface: "#FFFFFF",
        ink: "#131C28", ink2: "#66717F", line: "#E1E6EE",
        shadowRgb: "19,28,40",
      },
      dark: {
        primary: "#7FA9DA", primary2: "#98BCE6",
        accent: "#4FC4B2",
        accentOn: "#4FC4B2", accent2: "#6AD3C3", accentSoft: "#14302C",
        gold: "#8AB4E0", goldSoft: "#17263A",
        canvas: "#0E141C", canvas2: "#151D27", surface: "#141C26",
        ink: "#E8EDF3", ink2: "#94A1B1", line: "#242E3B",
        shadowRgb: "0,0,0",
      },
    },

    /* ---- Warm, appetite-forward, still restrained ---- */
    saffron: {
      label: "Saffron",
      swatch: ["#7A3E12", "#D98324", "#FCF7F0"],
      light: {
        primary: "#7A3E12", primary2: "#94501C",
        accent: "#D98324",
        accentOn: "#A9661C", accent2: "#9A5A14", accentSoft: "#FBEBD5",
        gold: "#E0A950", goldSoft: "#F8ECD6",
        canvas: "#FCF7F0", canvas2: "#F4EADC", surface: "#FFFFFF",
        ink: "#241708", ink2: "#7A6650", line: "#EDE1CE",
        shadowRgb: "36,23,8",
      },
      dark: {
        primary: "#E2A76B", primary2: "#EDBB86",
        accent: "#F0A03C",
        accentOn: "#F0A03C", accent2: "#F6B45E", accentSoft: "#3A2610",
        gold: "#E7BE72", goldSoft: "#33260F",
        canvas: "#16110A", canvas2: "#1F1810", surface: "#1D170F",
        ink: "#F4EDE2", ink2: "#AC9C86", line: "#31281C",
        shadowRgb: "0,0,0",
      },
    },

    /* ---- Deep, luxurious, evening-dining ---- */
    plum: {
      label: "Plum",
      swatch: ["#3D2352", "#C08A4E", "#F8F5F9"],
      light: {
        primary: "#3D2352", primary2: "#4E2F67",
        accent: "#C08A4E",
        accentOn: "#966C3D", accent2: "#885F32", accentSoft: "#F4E8D8",
        gold: "#C9A55F", goldSoft: "#F3EAD9",
        canvas: "#F8F5F9", canvas2: "#EFE9F1", surface: "#FFFFFF",
        ink: "#1C1424", ink2: "#6E6478", line: "#E7E0EA",
        shadowRgb: "28,20,36",
      },
      dark: {
        primary: "#B593D2", primary2: "#C6ABDE",
        accent: "#D6A369",
        accentOn: "#D6A369", accent2: "#E2B884", accentSoft: "#2F2318",
        gold: "#D6B478", goldSoft: "#2C2418",
        canvas: "#130F17", canvas2: "#1B1620", surface: "#19141E",
        ink: "#EEEAF2", ink2: "#A096A9", line: "#2B2433",
        shadowRgb: "0,0,0",
      },
    },
  };

  const STORE_THEME = "vrf_theme";
  const STORE_MODE = "vrf_mode";
  const DEFAULT_THEME = "atelier";
  const DEFAULT_MODE = "light";

  /* CSS custom-property name for each token key */
  const CSSVAR = {
    primary: "--primary", primary2: "--primary-2",
    accent: "--accent", accent2: "--accent-2", accentSoft: "--accent-soft",
    accentOn: "--accent-on",
    gold: "--gold", goldSoft: "--gold-soft",
    canvas: "--canvas", canvas2: "--canvas-2", surface: "--surface",
    ink: "--ink", ink2: "--ink-2", line: "--line",
    shadowRgb: "--shadow-rgb",
  };

  function read(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* private mode */ }
  }

  function prefersDark() {
    return !!(root.matchMedia && root.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  /** Resolve "auto" against the OS preference. */
  function resolveMode(mode) {
    return mode === "auto" ? (prefersDark() ? "dark" : "light") : mode;
  }

  function getTheme() {
    const t = read(STORE_THEME, DEFAULT_THEME);
    return THEMES[t] ? t : DEFAULT_THEME;
  }
  function getMode() {
    const m = read(STORE_MODE, DEFAULT_MODE);
    return ["light", "dark", "auto"].indexOf(m) > -1 ? m : DEFAULT_MODE;
  }

  /** Paint the resolved token set onto :root. */
  function apply() {
    const name = getTheme();
    const mode = getMode();
    const effective = resolveMode(mode);
    const tokens = THEMES[name][effective] || THEMES[name].light;

    const el = document.documentElement;
    for (const key in CSSVAR) {
      if (tokens[key]) el.style.setProperty(CSSVAR[key], tokens[key]);
    }
    el.setAttribute("data-theme", name);
    el.setAttribute("data-mode", effective);
    el.style.colorScheme = effective;

    // keep the mobile browser chrome in sync with the canvas
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = tokens.canvas;

    root.dispatchEvent(new CustomEvent("themechange", {
      detail: { theme: name, mode: mode, effective: effective, tokens: tokens },
    }));
  }

  function setTheme(name) {
    if (!THEMES[name]) return false;
    write(STORE_THEME, name);
    apply();
    return true;
  }

  function setMode(mode) {
    if (["light", "dark", "auto"].indexOf(mode) === -1) return false;
    write(STORE_MODE, mode);
    apply();
    return true;
  }

  function toggleMode() {
    return setMode(resolveMode(getMode()) === "dark" ? "light" : "dark");
  }

  /**
   * Inject a brand at runtime (e.g. from a merchant dashboard).
   * Only `light` is required — the dark ramp is derived if omitted.
   */
  function registerTheme(name, def) {
    if (!name || !def || !def.light) return false;
    THEMES[name] = {
      label: def.label || name,
      swatch: def.swatch || [def.light.primary, def.light.accent, def.light.canvas],
      light: def.light,
      dark: def.dark || deriveDark(def.light),
    };
    return true;
  }

  /* Reasonable dark ramp from a light one: lift the brand colours
     so they stay legible on a dark canvas, invert the neutrals. */
  function deriveDark(l) {
    return {
      primary: lighten(l.primary, 0.45), primary2: lighten(l.primary, 0.58),
      accent: lighten(l.accent, 0.18), accent2: lighten(l.accent, 0.3),
      accentSoft: darken(l.accent, 0.72),
      gold: lighten(l.gold || l.accent, 0.1), goldSoft: darken(l.gold || l.accent, 0.75),
      canvas: "#111312", canvas2: "#191C1A", surface: "#181B19",
      ink: "#ECEFEC", ink2: "#98A19C", line: "#2A2F2C",
      shadowRgb: "0,0,0",
    };
  }

  function hexToRgb(hex) {
    const h = String(hex).replace("#", "");
    const s = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  }
  function toHex(rgb) {
    return "#" + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  }
  function lighten(hex, amt) { return toHex(hexToRgb(hex).map((c) => c + (255 - c) * amt)); }
  function darken(hex, amt) { return toHex(hexToRgb(hex).map((c) => c * (1 - amt))); }

  /* Follow the OS when the user is on "auto" */
  if (root.matchMedia) {
    const mq = root.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => { if (getMode() === "auto") apply(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* Keep tabs in sync */
  root.addEventListener("storage", (e) => {
    if (e.key === STORE_THEME || e.key === STORE_MODE) apply();
  });

  root.VRFTheme = {
    themes: THEMES, apply: apply,
    getTheme: getTheme, setTheme: setTheme,
    getMode: getMode, setMode: setMode, toggleMode: toggleMode,
    resolveMode: resolveMode, registerTheme: registerTheme,
    list: () => Object.keys(THEMES).map((k) => ({ id: k, label: THEMES[k].label, swatch: THEMES[k].swatch })),
  };
  root.setTheme = setTheme;
  root.setMode = setMode;
  root.registerTheme = registerTheme;

  /* Paint immediately — this file runs in <head>, before first paint,
     so there is no flash of the wrong theme. */
  apply();
})(window);
