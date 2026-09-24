(function() {
  const STYLE_ID = 'forklite-amoled-override';

  // Inject persistent CSS variables and overrides for pure AMOLED Black (#000000)
  function ensureAmoledStyle() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        :root {
          --surface-background: #000000 !important;
          --web-wash: #000000 !important;
          --card-background: #000000 !important;
          --nav-bar-background: #000000 !important;
          --header-background: #000000 !important;
          --comment-background: #121212 !important;
          --messenger-card-background: #000000 !important;
        }
        html, body, [data-pagelet], #root, #mount_0_0,
        .__fb-dark-mode, .__fb-dark-mode body,
        div[style*="background-color: rgb(36, 37, 38)"],
        div[style*="background-color: rgb(24, 25, 26)"],
        div[style*="background-color: #242526"],
        div[style*="background-color: #18191a"],
        div[style*="background-color: #1c1e21"] {
          background-color: #000000 !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
  }

  ensureAmoledStyle();

  const colorRegex = /background-color\s*:\s*(#242526|#18191a|#1c1e21|rgba\s*\(\s*36\s*,\s*37\s*,\s*38\s*,\s*1\.?0*\s*\)|rgba\s*\(\s*24\s*,\s*25\s*,\s*26\s*,\s*1\.?0*\s*\)|rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*1\.?0*\s*\)|#([0-9a-fA-F]{6}))\s*;/gi;

  function isLightGray(r, g, b) {
    return r >= 50 && r <= 150 && g >= 50 && g <= 150 && b >= 50 && b <= 150 &&
           Math.abs(r - g) <= 20 && Math.abs(g - b) <= 20 && Math.abs(r - b) <= 20;
  }

  function isDarkTheme() {
    const meta = document.querySelector('meta[name="theme-color"]');
    const c = meta?.getAttribute('content')?.toLowerCase().trim();
    if (c === '#242526' || c === '#18191a' || c === '#1c1e21' || c === '#000000') return true;
    if (document.documentElement.classList.contains('__fb-dark-mode') || document.body?.classList.contains('__fb-dark-mode')) return true;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
    const bodyBg = document.body ? getComputedStyle(document.body).backgroundColor : '';
    if (bodyBg === 'rgb(36, 37, 38)' || bodyBg === 'rgb(24, 25, 26)' || bodyBg === 'rgb(0, 0, 0)') return true;
    return false;
  }

  function processStyles() {
    ensureAmoledStyle();

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && meta.getAttribute('content')?.toLowerCase().trim() !== '#000000') {
      meta.setAttribute('content', '#000000');
    }
    if (window.ThemeBridge?.onThemeColorChanged) {
      window.ThemeBridge.onThemeColorChanged("#000000");
    }

    document.querySelectorAll('[style*="background-color"]').forEach(el => {
      const style = el.getAttribute('style');
      if (!style) return;
      const newStyle = style.replace(colorRegex, (m, g, r, g2, b, hex) => {
        if (g === '#242526' || g === '#18191a' || g === '#1c1e21' || g === 'rgba(36,37,38,1.0)' || g === 'rgba(36,37,38,1)') return 'background-color:#000000;';
        if (r && g2 && b && isLightGray(+r, +g2, +b)) return 'background-color:#121212;';
        if (hex && isLightGray(...[0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)))) {
          return 'background-color:#121212;';
        }
        return m;
      });
      if (style !== newStyle) el.setAttribute('style', newStyle);
    });
  }

  processStyles();

  new MutationObserver(mutations => {
    let shouldProcess = false;
    for (const m of mutations) {
      if (m.type === 'childList' && m.addedNodes.length > 0) {
        shouldProcess = true;
        break;
      }
      if (m.type === 'attributes' && (m.attributeName === 'style' || m.attributeName === 'content')) {
        shouldProcess = true;
        break;
      }
    }
    if (shouldProcess) processStyles();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'content']
  });
})();