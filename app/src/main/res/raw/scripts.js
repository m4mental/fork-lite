
// ============================================================================
// Fork Lite Data Saver Engine: Unlock & Enable Data Saver on Wi-Fi and Cellular
// ============================================================================
(function() {
  // 1. Spoof Network Information API so Facebook enables Data Saver even on Wi-Fi
  try {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      Object.defineProperty(conn, 'saveData', {
        get: () => true,
        configurable: true
      });
      Object.defineProperty(conn, 'type', {
        get: () => 'cellular',
        configurable: true
      });
      Object.defineProperty(conn, 'effectiveType', {
        get: () => '3g',
        configurable: true
      });
    }
  } catch (e) {}

  // 2. Proactively find and unlock any disabled/greyed-out Data Saver toggles
  function unlockDataSaver() {
    const candidates = document.querySelectorAll(
      '[aria-label*="Data saver" i], [aria-label*="Data Saver" i], [data-sigil*="data_saver"], [data-testid*="data_saver"], div[role="menuitem"], div[role="radio"], div[role="switch"], div[role="checkbox"], label'
    );

    candidates.forEach(el => {
      const text = (el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '');
      if (/data\s*saver|डेटा\s*सेवर/i.test(text)) {
        el.removeAttribute('disabled');
        el.setAttribute('aria-disabled', 'false');
        el.classList.remove('disabled', '_disabled', 'inactive', 'x17qophe');
        el.style.setProperty('pointer-events', 'auto', 'important');
        el.style.setProperty('opacity', '1', 'important');
        el.style.setProperty('filter', 'none', 'important');
        el.style.setProperty('cursor', 'pointer', 'important');

        el.querySelectorAll('input, [role="switch"], [role="radio"], [role="checkbox"], div').forEach(child => {
          child.removeAttribute('disabled');
          child.setAttribute('aria-disabled', 'false');
          child.style.setProperty('pointer-events', 'auto', 'important');
          child.style.setProperty('opacity', '1', 'important');
          child.style.setProperty('filter', 'none', 'important');
        });
      }
    });

    // Also scan all dialogs / popup menus for disabled video setting items
    document.querySelectorAll('div[role="dialog"], div[role="menu"], div[role="region"]').forEach(dialog => {
      dialog.querySelectorAll('[aria-disabled="true"], [disabled]').forEach(item => {
        const text = (item.textContent || '') + ' ' + (item.getAttribute('aria-label') || '');
        if (/data\s*saver|डेटा\s*सेवर|quality|गुणवत्ता/i.test(text)) {
          item.removeAttribute('disabled');
          item.setAttribute('aria-disabled', 'false');
          item.style.setProperty('pointer-events', 'auto', 'important');
          item.style.setProperty('opacity', '1', 'important');
          item.style.setProperty('filter', 'none', 'important');
          item.style.setProperty('cursor', 'pointer', 'important');
        }
      });
    });
  }

  unlockDataSaver();

  const dsObserver = new MutationObserver(() => {
    unlockDataSaver();
  });

  dsObserver.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-disabled', 'disabled', 'class', 'style']
  });
})();

// desktop mode identifier
(() => {
    window.isDesktopMode = () => {
        return document.querySelector('html[id="facebook"]') !== null;
    }
})();

// Feed identifier
(() => {
    window.isFeed = () => {
        const isHomeUrl = window.location.pathname === '/' &&
            (window.location.hostname === 'm.facebook.com' || window.location.hostname === 'www.facebook.com');

        if (window.isDesktopMode()) return isHomeUrl;

        const hasSpecialButton = Array.from(document.querySelectorAll('[role="button"] span'))
            .some(span => span.textContent === '󱥆');

        return isHomeUrl && hasSpecialButton;
    };
})();





(function() {
    if (!window.isDesktopMode()) return;

    document.documentElement.style.fontSize = '18px';


    // do not stick the navbar by default
    (() => {
      const waitForBanner = () => new Promise(resolve => {
        const existing = document.querySelector('div[role="banner"]');
        if (existing) return resolve(existing);

        new MutationObserver((mutations, obs) => {
          for (const { addedNodes } of mutations) {
            for (const node of addedNodes) {
              if (node.nodeType === 1 && node.matches('div[role="banner"]')) {
                obs.disconnect();
                return resolve(node);
              }
            }
          }
        }).observe(document.body, { childList: true, subtree: true });
      });

      const forceAbsolute = el => {
        if (el?.classList.contains('xixxii4')) {
          el.style.setProperty('position', 'absolute', 'important');
        }
      };

      waitForBanner().then(banner => {
        const style = document.createElement('style');
        style.textContent = `
          div[role="banner"].xixxii4,
          div[role="banner"] .xixxii4 {
            position: absolute !important;
          }
        `;
        document.head.appendChild(style);

        forceAbsolute(banner);
        banner.querySelectorAll('.xixxii4').forEach(forceAbsolute);

        new MutationObserver(mutations => {
          for (const m of mutations) {
            if (m.type === 'childList') {
              m.addedNodes.forEach(n => {
                forceAbsolute(n);
                n.querySelectorAll?.('.xixxii4')?.forEach(forceAbsolute);
              });
            } else if (m.type === 'attributes' && m.attributeName === 'class') {
              forceAbsolute(m.target);
            }
          }
        }).observe(banner, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
      });
    })();


    // remove "send" button to save space
    // remove the third element in the interaction bar if nb is 4
    (function() {
      const parentSelector = '.xbmvrgn.x1diwwjn';
      const childSelector = '.x10b6aqq.x1yrsyyn.xs83m0k';

      function checkAndRemoveThird(parent) {
        const children = parent.querySelectorAll(childSelector);
        if (children.length === 4) children[2].remove();
      }

      document.querySelectorAll(parentSelector).forEach(checkAndRemoveThird);

      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              if (node.matches(parentSelector)) {
                checkAndRemoveThird(node);
              }
              node.querySelectorAll(parentSelector).forEach(checkAndRemoveThird);
            }
          });
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    })();
})();


// Scroll to top on back-press at feed.
(() => {
    window.backHandlerNB = () => {

        const dialogs = document.querySelectorAll('div[role="dialog"]');
        const isMenu = document.querySelector('div[role="menu"]')

        function scrollToTop() {
            if (window.scrollY !== 0) {
              // to interrupt any current scroll event.
              document.body.style.overflow = 'hidden';
              setTimeout(() => {
                 document.body.style.overflow = '';
                 window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 30);
              return "scrolling";
           } else return "exit";
        }

        if (window.isDesktopMode()) {
            if (window.isFeed() && !isMenu && dialogs.length === 1)
                return scrollToTop();
            else if (isMenu || dialogs.length > 1) {
                const escapeEvent = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true,
                    cancelable: true
                });
                window.dispatchEvent(escapeEvent);
                return "true";
            } else return "false"
        } else if (window.isFeed() && !isMenu && !dialogs.length) {
            return scrollToTop();
        } else return "false";
    }
})();

// Enable press and hold caption selection and apply custom selection color.
(() => {
  const makeSelectable = (el) => {
    if (el.closest('div[role="button"]')) return;
    el.style.userSelect = 'text';
    el.style.pointerEvents = 'auto';
  };

  const updateText = () => {
    document.querySelectorAll('.native-text').forEach(makeSelectable);
  };

  const selectionStyle = document.createElement('style');
  selectionStyle.textContent = `
    .native-text::selection {
      background: #ccc;
      color: black;
    }
  `;
  document.head.appendChild(selectionStyle);

  updateText();

  new MutationObserver(updateText).observe(document.body, {
    childList: true,
    subtree: true
  });
})();

// Enhance Loading Overlay Script
(function() {
    function applyOverlayStyle() {
        const overlays = document.querySelectorAll('.loading-overlay');
        overlays.forEach(overlay => {
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        });
    }
    applyOverlayStyle();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length)
                applyOverlayStyle();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

// Hide facebook download button at login page.
(function() {
    const element = document.querySelector('div[data-bloks-name="bk.components.Flexbox"].wbloks_1');
    if (element) element.remove();
})();

// Hide annoying bottom banners
const observer = new MutationObserver(() => {

  if (location.pathname === '/'
  && document.querySelector('div[role="button"][aria-label*="Facebook"]') === null) return;

  const element = document.querySelector('.bottom.fixed-container');
  if (
    element &&
    !element.hasAttribute('data-shift-on-keyboard-shown')
  ) {
    const heightAttr = element.getAttribute('data-actual-height');
    if (heightAttr && parseInt(heightAttr, 10) < 80) {
      element.style.display = 'none';
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });


// Native App Feel & Touch Optimization
(function() {
  const style = document.createElement('style');
  style.id = 'forklite-native-app-styles';
  style.textContent = `
    * {
      -webkit-tap-highlight-color: transparent !important;
      -webkit-touch-callout: none !important;
      outline: none !important;
    }
    body, div, p, span, a, img, video {
      -webkit-user-select: none;
      user-select: none;
    }
    button, label, [role="button"], [role="switch"], [role="radio"], [role="checkbox"], [role="menuitem"], input, select {
      pointer-events: auto !important;
      cursor: pointer !important;
    }
    input, textarea, [contenteditable="true"], .native-text, .native-text * {
      -webkit-user-select: text !important;
      user-select: text !important;
    }
    /* Hide all browser scrollbars for native app look */
    ::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
    * {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    /* Smooth native momentum scrolling */
    html, body {
      -webkit-overflow-scrolling: touch !important;
      overscroll-behavior-y: contain !important;
    }
    /* Suppress circular loading spinner in reels for instant transitions */
    div.vertically-snappable [role="progressbar"],
    div.vertically-snappable [aria-label*="Loading" i],
    div.vertically-snappable [aria-label*="loading" i],
    div.vertically-snappable [data-sigil*="loading"],
    div.vertically-snappable .loading-overlay,
    div.vertically-snappable svg circle[stroke-dasharray],
    div.vertically-snappable div:has(> svg circle[stroke-dasharray]) {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
})();


/* The below scripts are specific to com.ycngmn.Nobook application. */

(() => {
  const onReady = (fn) => {
    if (document.readyState === 'loading')
      document.addEventListener('DOMContentLoaded', fn);
     else fn();
  };

  onReady(() => {
    const BUTTON_ID = 'custom-settings-btn';
    const ICON_SVG = `
      <svg width="28" height="28" fill="%FILL%" viewBox="0 0 24 24">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2.002 2.002 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2.002 2.002 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"/>
      </svg>`;

    const getFillColor = () => {
      const color = document.querySelector('meta[name="theme-color"]')?.content?.toLowerCase();
      return color === '#ffffff' ? '#242526' : '#d0d0d0';
    };

    const updateButtonColor = () => {
      const svg = document.querySelector(`#${BUTTON_ID} svg`);
      if (svg) svg.setAttribute('fill', getFillColor());
    };

    const findInsertionPoint = () => {
      const iconSpan = Array.from(document.querySelectorAll('span'))
        .find(span => span.textContent === '󱥊');
      const container = iconSpan?.closest('div[role="button"]')?.parentNode;

      const desktopTarget = document.querySelector(
        '.x6s0dn4.x78zum5.x1s65kcs.x1n2onr6.x1ja2u2z'
      );

      return { container, desktopTarget };
    };

    const createButton = () => {
      const btn = document.createElement('button');
      btn.id = BUTTON_ID;
      btn.setAttribute('style', `
        position: ${findInsertionPoint().desktopTarget === null ? 'fixed' : 'block'};
        top: 8px;
        right: 100px;
        background: transparent;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        pointer-events: auto;
      `);
      btn.innerHTML = ICON_SVG.replace('%FILL%', getFillColor());
      btn.onclick = () => SettingsBridge?.onSettingsToggle?.();
      return btn;
    };

    const insertButton = () => {
      if (document.getElementById(BUTTON_ID)) return;

      const { container, desktopTarget } = findInsertionPoint();
      const button = createButton();

      if (desktopTarget) desktopTarget.insertBefore(button, desktopTarget.firstChild);
      else if (container) container.insertBefore(button, container.firstChild);
    };

    insertButton();

    const observer = new MutationObserver(() => {
      if (!document.getElementById(BUTTON_ID) && isFeed()) {
        insertButton();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Observer for theme-color changes
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      new MutationObserver(updateButtonColor).observe(themeMeta, {
        attributes: true,
        attributeFilter: ['content'],
      });
    }
  });
})();


// Color Extraction Script
(function() {
    const meta = document.querySelector('meta[name="theme-color"]');
    const notify = () => window.ThemeBridge?.onThemeColorChanged?.(meta?.content ?? "null");
    if (meta) {
        notify();
        new MutationObserver(() => notify())
            .observe(meta, { attributes: true, attributeFilter: ['content'] });
    }
})();

// File Download Script
(function() {
    if (window._downloadBridgeInitialized) return;
    window._downloadBridgeInitialized = true;
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function(blob) {
        const reader = new FileReader();
        reader.onloadend = function() {
            if (reader.result)
                DownloadBridge.downloadBase64File(reader.result, blob.type);
        };
        reader.readAsDataURL(blob);
        return originalCreateObjectURL(blob);
    };
})();

// ============================================================================
// Fork Lite Video Turbo Engine: Instant Play & Spinner-Free Preloading
// ============================================================================
(function() {
  const processedVideos = new WeakSet();

  function hideSpinners(root) {
    if (!root) return;
    const spinners = root.querySelectorAll(
      '[role="progressbar"], [aria-label*="Loading" i], [aria-label*="loading" i], .loading-overlay, [data-sigil*="loading"]'
    );
    spinners.forEach(s => {
      s.style.setProperty('display', 'none', 'important');
      s.style.setProperty('opacity', '0', 'important');
      s.style.setProperty('visibility', 'hidden', 'important');
    });
  }

  function optimizeVideo(video) {
    if (!video || processedVideos.has(video)) return;
    processedVideos.add(video);

    try {
      video.preload = 'auto';
      video.setAttribute('preload', 'auto');
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-video-player-type', 'h5');
      video.disableRemotePlayback = true;

      // When video is ready or playing, immediately dismiss any circular spinner
      const onReady = () => {
        const reelContainer = video.closest('div.vertically-snappable');
        if (reelContainer) hideSpinners(reelContainer);
      };

      video.addEventListener('canplay', onReady, { passive: true });
      video.addEventListener('playing', onReady, { passive: true });
      video.addEventListener('loadeddata', onReady, { passive: true });

      // Rapid resumption without pause
      video.addEventListener('waiting', () => {
        if (video.paused && video.currentTime > 0) {
          video.play().catch(() => {});
        }
      }, { passive: true });
    } catch (e) {}
  }

  // Optimize all initial video tags
  document.querySelectorAll('video').forEach(optimizeVideo);

  // Monitor DOM for new videos (feed posts, reels, stories)
  const videoObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.tagName === 'VIDEO') {
          optimizeVideo(node);
        } else if (node.querySelectorAll) {
          node.querySelectorAll('video').forEach(optimizeVideo);
        }
      }
    }
  });

  videoObserver.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });

  // Next-Reel Pre-buffer: Proactively warm up to 5 adjacent reels ahead in cache
  const PRELOAD_REEL_AHEAD_COUNT = 5;
  const preloadedUrls = new Set();
  let currentActiveReel = null;

  function prebufferVideoUrl(url) {
    if (!url || preloadedUrls.has(url) || url.startsWith('blob:')) return;
    preloadedUrls.add(url);
    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = url;
      document.head.appendChild(link);
    } catch (e) {}
  }

  function handleReelsTransition() {
    const reels = document.querySelectorAll('div.vertically-snappable');
    if (!reels || reels.length === 0) return;

    const vh = window.innerHeight;
    let activeIdx = -1;

    for (let i = 0; i < reels.length; i++) {
      const rect = reels[i].getBoundingClientRect();
      if (rect.top >= -vh * 0.45 && rect.top <= vh * 0.45) {
        activeIdx = i;
        break;
      }
    }

    if (activeIdx !== -1) {
      const activeReel = reels[activeIdx];

      // Instant Playback on active reel change (eliminates wait spinner)
      if (activeReel !== currentActiveReel) {
        currentActiveReel = activeReel;
        hideSpinners(activeReel);

        const activeVideo = activeReel.querySelector('video');
        if (activeVideo) {
          optimizeVideo(activeVideo);
          if (activeVideo.paused) {
            const playPromise = activeVideo.play();
            if (playPromise !== undefined) {
              playPromise.then(() => hideSpinners(activeReel)).catch(() => {});
            }
          }
        }
      }

      // Proactively buffer 5 reels ahead safely without resetting elements
      for (let offset = -1; offset <= PRELOAD_REEL_AHEAD_COUNT; offset++) {
        if (offset === 0) continue;
        const targetReel = reels[activeIdx + offset];
        if (targetReel) {
          const videos = targetReel.querySelectorAll('video');
          videos.forEach(v => {
            optimizeVideo(v);
            if (v.src) prebufferVideoUrl(v.src);
            if (v.currentSrc) prebufferVideoUrl(v.currentSrc);
          });

          targetReel.querySelectorAll('[data-video-url], [data-src], source').forEach(el => {
            const u = el.getAttribute('data-video-url') || el.getAttribute('data-src') || el.src;
            if (u) prebufferVideoUrl(u);
          });
        }
      }
    }
  }

  let scrollThrottle = null;
  const onReelScroll = () => {
    if (scrollThrottle) return;
    scrollThrottle = setTimeout(() => {
      scrollThrottle = null;
      handleReelsTransition();
    }, 60);
  };

  window.addEventListener('scroll', onReelScroll, { passive: true });
  window.addEventListener('touchmove', onReelScroll, { passive: true });

  setTimeout(handleReelsTransition, 500);
})();