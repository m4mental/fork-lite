(function() {
  const STYLE_ID = 'forklite-amoled-override';

  const amoledCss = `
    :root, html, body, .__fb-dark-mode, ._dark-mode {
      color-scheme: dark !important;
      --primary-background: #000000 !important;
      --secondary-background: #000000 !important;
      --surface-background: #000000 !important;
      --card-background: #000000 !important;
      --nav-bar-background: #000000 !important;
      --header-background: #000000 !important;
      --wash: #000000 !important;
      --web-wash: #000000 !important;
      --background-flat: #000000 !important;
      --comment-background: #0a0a0a !important;
      --popover-background: #000000 !important;
      --messenger-card-background: #000000 !important;
      --overlay-alpha-80: rgba(0, 0, 0, 0.85) !important;
      --divider: #1c1c1c !important;
      --border-color: #1c1c1c !important;
      --primary-text: #ffffff !important;
      --secondary-text: #b0b3b8 !important;
      --placeholder-text: #8a8d91 !important;
    }

    /* Force pure pitch black on all containers, cards, feed, headers, navigation */
    html, body, #root, #viewport, #screen-root, [data-pagelet], #mount_0_0,
    div[data-mcomponent="MContainer"],
    div[data-type="vscroller"],
    div[data-tracking-duration-id],
    div[role="feed"],
    div[role="main"],
    div[role="banner"],
    div[role="navigation"],
    div[role="region"],
    div[role="article"],
    article,
    header, footer, nav,
    .m.bg-s1, .m.bg-s2, .m.bg-s3, .m.bg-s4,
    .bg-s1, .bg-s2, .bg-s3, .bg-s4,
    .bg-s0, .bg-s5,
    ._12-, ._1-q, ._4-u2, ._4-u8, ._5rgr,
    div[class*="bg-s"],
    div[class*="surface"],
    div[class*="card"] {
      background-color: #000000 !important;
      background: #000000 !important;
    }

    /* Ensure text readability */
    body, div, p, span, h1, h2, h3, h4, h5, h6 {
      color: #e4e6eb;
    }
    a {
      color: #4599ff;
    }

    /* Card borders and dividers in subtle dark tone */
    div, hr, article {
      border-color: #1c1c1c !important;
    }
  `;

  function ensureAmoledStyle() {
    // 1. Force Facebook into dark mode classes so text/icons are white
    try {
      if (!document.documentElement.classList.contains('__fb-dark-mode')) {
        document.documentElement.classList.add('__fb-dark-mode', '_dark-mode');
      }
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.setProperty('color-scheme', 'dark');
      if (document.body && !document.body.classList.contains('__fb-dark-mode')) {
        document.body.classList.add('__fb-dark-mode', '_dark-mode');
      }
    } catch (e) {}

    // 2. Inject or ensure #forklite-amoled-override is present
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = amoledCss;
      const target = document.head || document.documentElement;
      if (target) target.appendChild(style);
    }
  }

  function processStyles() {
    ensureAmoledStyle();

    // Enforce theme color for Android system bars
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && meta.getAttribute('content')?.toLowerCase().trim() !== '#000000') {
      meta.setAttribute('content', '#000000');
    }
    if (window.ThemeBridge?.onThemeColorChanged) {
      window.ThemeBridge.onThemeColorChanged("#000000");
    }

    // Force inline background colors that Facebook injects to pitch black
    document.querySelectorAll('[style*="background-color"]').forEach(el => {
      const s = el.style.backgroundColor;
      if (s && (s.includes('36, 37, 38') || s.includes('24, 25, 26') || s.includes('28, 30, 33') ||
                s.includes('240, 242, 245') || s === 'white' || s === '#fff' || s === '#ffffff' ||
                s === '#242526' || s === '#18191a' || s === '#1c1e21')) {
        el.style.setProperty('background-color', '#000000', 'important');
      }
    });
  }

  // Run immediately
  processStyles();

  // Continuously ensure AMOLED stays active during SPA navigations & React re-renders
  const observer = new MutationObserver(() => {
    processStyles();
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'content']
  });
})();