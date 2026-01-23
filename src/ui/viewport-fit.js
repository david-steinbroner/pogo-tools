/**
 * Viewport Fit - Scale app to fit short in-app browser viewports
 * Handles Reddit/Twitter/etc in-app browsers where chrome reduces viewport height
 *
 * iOS Keyboard Guard:
 * When an input is focused on iOS Safari, the visualViewport.height shrinks to
 * account for the on-screen keyboard. Without a guard, this would trigger scaling
 * and cause the "shrink + fly up" effect. We set a global __keyboardMode flag
 * during input focus to disable scaling while typing.
 */

const SAFE_PADDING = 0; // rely on offsetTop accounting only

let baseHeight = null; // Cached design height (measured once at scale=1)

/**
 * Global keyboard mode flag
 * When true, viewport scaling is disabled to prevent iOS keyboard shrink effect
 */
window.__keyboardMode = false;

// Timeout ID for delayed keyboard mode reset (allows selecting autocomplete options)
let keyboardModeTimeout = null;

/**
 * Get available viewport height, preferring visualViewport for in-app browsers.
 * Subtracts offsetTop to handle shifted viewports (e.g., in-app browser address bars).
 */
function getAvailableHeight() {
  const vv = window.visualViewport;
  // offsetTop accounts for browser chrome shifting the viewport down
  return vv ? (vv.height - vv.offsetTop) : window.innerHeight;
}

/**
 * Measure base height of app frame (only when unscaled)
 */
function measureBaseHeight(app) {
  // Temporarily reset scale to measure true height
  app.style.transform = 'none';
  const rect = app.getBoundingClientRect();
  baseHeight = rect.height;
  return baseHeight;
}

/**
 * Check if a text input or textarea is currently focused
 * Used as a fallback check for iOS keyboard detection
 */
function isTextInputFocused() {
  const el = document.activeElement;
  if (!el) return false;
  if (el.tagName === 'TEXTAREA') return true;
  if (el.tagName === 'INPUT') {
    const type = el.type || 'text';
    const textTypes = ['text', 'search', 'email', 'url', 'tel', 'password', 'number'];
    return textTypes.includes(type);
  }
  return false;
}

/**
 * Compute and apply scale to fit app in viewport
 * Skipped when __keyboardMode is true (iOS keyboard open)
 */
function fitToViewport() {
  // iOS Keyboard Guard: Skip scaling when an input is focused
  // This prevents the "shrink + fly up" effect when the keyboard opens
  // Check both the flag AND activeElement (handles race condition where
  // visualViewport resize fires before focusin event)
  if (window.__keyboardMode || isTextInputFocused()) {
    return;
  }

  const wrapper = document.getElementById('appScaleWrapper');
  const app = document.querySelector('.app');

  if (!wrapper || !app) return;

  const availableHeight = getAvailableHeight() - SAFE_PADDING;

  // Measure base height if not cached or if we have room to remeasure
  if (baseHeight === null || availableHeight >= baseHeight) {
    measureBaseHeight(app);
  }

  // Compute scale: fit design height into available space
  const scale = Math.min(1, availableHeight / baseHeight);

  if (scale < 1) {
    // Apply scaling
    app.style.setProperty('--app-scale', scale.toFixed(4));
    app.style.transform = `scale(var(--app-scale))`;
    app.style.transformOrigin = 'top center';
    wrapper.style.height = `${baseHeight * scale}px`;
    wrapper.style.overflow = 'hidden';
  } else {
    // No scaling needed - reset
    app.style.setProperty('--app-scale', '1');
    app.style.transform = '';
    app.style.transformOrigin = '';
    wrapper.style.height = '100%';
    wrapper.style.overflow = '';
  }
}

/**
 * Enter keyboard mode - disable viewport scaling
 * Called when a text input or textarea is focused
 */
function enterKeyboardMode() {
  // Clear any pending exit timeout
  if (keyboardModeTimeout) {
    clearTimeout(keyboardModeTimeout);
    keyboardModeTimeout = null;
  }
  window.__keyboardMode = true;
}

/**
 * Exit keyboard mode after a delay - re-enable viewport scaling
 * Delay allows selecting autocomplete options without flicker
 */
function exitKeyboardMode() {
  // Delay exit to handle autocomplete selection (tap result → focus briefly lost)
  keyboardModeTimeout = setTimeout(() => {
    window.__keyboardMode = false;
    keyboardModeTimeout = null;
    // Recompute fit now that keyboard is closed
    fitToViewport();
  }, 200);
}

/**
 * Initialize viewport fitting
 */
export function initViewportFit() {
  // Initial fit after a short delay to ensure layout is stable
  requestAnimationFrame(() => {
    fitToViewport();
  });

  // Recompute on window resize
  window.addEventListener('resize', fitToViewport);

  // Recompute on visualViewport changes (iOS in-app browser chrome)
  // But NOT when keyboard mode is active
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fitToViewport);
    window.visualViewport.addEventListener('scroll', fitToViewport);
  }

  // iOS Keyboard Guard: Track input focus to prevent shrink effect
  // Listen at document level to catch all inputs (including dynamically added ones)
  document.addEventListener('focusin', (e) => {
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      // Text-like inputs that trigger the keyboard
      const type = target.type || 'text';
      const textTypes = ['text', 'search', 'email', 'url', 'tel', 'password', 'number'];
      if (target.tagName === 'TEXTAREA' || textTypes.includes(type)) {
        enterKeyboardMode();
      }
    }
  });

  document.addEventListener('focusout', (e) => {
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      exitKeyboardMode();
    }
  });
}
