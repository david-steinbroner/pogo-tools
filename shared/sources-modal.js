/**
 * Sources Modal
 * Shows citation sources used by PoGO Tools
 * Can be triggered from any page
 */

(function() {
  'use strict';

  let sourcesData = null;
  let modalElement = null;

  /**
   * Load sources data from JSON file
   */
  async function loadSources() {
    if (sourcesData) return sourcesData;

    try {
      // Determine path based on current location
      const basePath = getBasePath();
      const response = await fetch(basePath + 'data/sources.json');
      if (!response.ok) throw new Error('Failed to load sources');
      sourcesData = await response.json();
      return sourcesData;
    } catch (err) {
      console.error('Error loading sources:', err);
      return null;
    }
  }

  /**
   * Get base path for data files based on current URL
   */
  function getBasePath() {
    const path = window.location.pathname;
    // Count directory depth and build relative path
    const depth = (path.match(/\//g) || []).length - 1;
    if (depth <= 0) return './';
    return '../'.repeat(depth);
  }

  /**
   * Create and show the sources modal
   */
  async function showSourcesModal() {
    const data = await loadSources();
    if (!data) {
      alert('Unable to load sources data.');
      return;
    }

    // Remove existing modal if present
    if (modalElement) {
      modalElement.remove();
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sources-modal-overlay';
    overlay.onclick = function(e) {
      if (e.target === overlay) {
        hideSourcesModal();
      }
    };

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'sources-modal';

    let html = '<h2>Sources & Citations</h2>';
    html += '<p>PoGO Tools uses data from these community resources:</p>';
    html += '<ul>';

    for (const [key, source] of Object.entries(data.sources)) {
      html += `<li>
        <strong><a href="${source.url}" target="_blank" rel="noopener">${source.name}</a></strong>
        <br><span style="color: #666; font-size: 13px;">${source.description}</span>
      </li>`;
    }

    html += '</ul>';
    html += `<div class="disclaimer">${data.disclaimer}</div>`;
    html += '<button class="close-btn" onclick="PogoSources.hideSourcesModal()">Close</button>';

    modal.innerHTML = html;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    modalElement = overlay;

    // Handle escape key
    document.addEventListener('keydown', handleEscapeKey);
  }

  /**
   * Hide the sources modal
   */
  function hideSourcesModal() {
    if (modalElement) {
      modalElement.remove();
      modalElement = null;
    }
    document.removeEventListener('keydown', handleEscapeKey);
  }

  /**
   * Handle escape key to close modal
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape') {
      hideSourcesModal();
    }
  }

  /**
   * Create the trigger link HTML
   */
  function createSourcesLink() {
    return '<a href="#" onclick="PogoSources.showSourcesModal(); return false;" class="sources-link">Sources & Citations</a>';
  }

  /**
   * Auto-inject into elements with class "sources-placeholder"
   */
  function initSourcesLinks() {
    const placeholders = document.querySelectorAll('.sources-placeholder');
    placeholders.forEach(function(el) {
      el.innerHTML = createSourcesLink();
    });
  }

  // Export for use by other modules
  window.PogoSources = {
    showSourcesModal: showSourcesModal,
    hideSourcesModal: hideSourcesModal,
    createSourcesLink: createSourcesLink,
    initSourcesLinks: initSourcesLinks,
    loadSources: loadSources
  };

})();
