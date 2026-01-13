/**
 * Hash-based SPA Router
 */

import State from './state.js';

const Router = {
  routes: [],
  currentPage: null,
  contentContainer: null,

  /**
   * Initialize router
   * @param {Element} container - Container element for routed content
   */
  init(container) {
    this.contentContainer = container;

    // Listen for hash changes
    window.addEventListener('hashchange', () => this._onRouteChange());

    // Handle initial route
    this._onRouteChange();
  },

  /**
   * Register a route
   * @param {string} path - Route path (e.g., '/', '/audio-lessons', '/surah/:id')
   * @param {Object} pageModule - Page module with mount/unmount methods
   */
  register(path, pageModule) {
    const pattern = this._pathToPattern(path);
    this.routes.push({ path, pattern, pageModule });
  },

  /**
   * Convert path to regex pattern
   * @param {string} path - Route path
   * @returns {Object} Pattern object with regex and param names
   */
  _pathToPattern(path) {
    const paramNames = [];
    const regexStr = path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
      });

    return {
      regex: new RegExp(`^${regexStr}$`),
      paramNames
    };
  },

  /**
   * Navigate to a route
   * @param {string} path - Path to navigate to
   */
  navigate(path) {
    window.location.hash = path;
  },

  /**
   * Handle route change
   */
  async _onRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    const { route, params } = this._matchRoute(hash);

    // Update state
    State.set('currentRoute', hash);

    // Unmount current page
    if (this.currentPage && this.currentPage.unmount) {
      this.currentPage.unmount();
    }

    // Clear container
    this.contentContainer.innerHTML = '';

    // Mount new page
    if (route) {
      this.currentPage = route.pageModule;
      if (route.pageModule.mount) {
        await route.pageModule.mount(this.contentContainer, params);
      }
    } else {
      // 404 - Show not found
      this._showNotFound();
    }

    // Scroll to top
    window.scrollTo(0, 0);
  },

  /**
   * Match a path to a route
   * @param {string} path - Path to match
   * @returns {Object} Matched route and params
   */
  _matchRoute(path) {
    for (const route of this.routes) {
      const match = path.match(route.pattern.regex);
      if (match) {
        const params = {};
        route.pattern.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { route, params };
      }
    }
    return { route: null, params: {} };
  },

  /**
   * Show 404 page
   */
  _showNotFound() {
    const strings = State.get('appData')?.uiStrings || {};
    this.contentContainer.innerHTML = `
      <div class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-6xl font-bold text-emerald-900 mb-4">٤٠٤</h1>
          <p class="text-xl text-gray-600 mb-6">پەڕەکە نەدۆزرایەوە</p>
          <a href="#/" class="btn-primary inline-block px-6 py-3 rounded-lg text-white">
            ${strings.back || 'گەڕانەوە'} بۆ سەرەکی
          </a>
        </div>
      </div>
    `;
  },

  /**
   * Get current route path
   * @returns {string} Current path
   */
  getCurrentPath() {
    return window.location.hash.slice(1) || '/';
  },

  /**
   * Check if current route matches path
   * @param {string} path - Path to check
   * @returns {boolean}
   */
  isActive(path) {
    const current = this.getCurrentPath();
    if (path === '/') {
      return current === '/';
    }
    return current.startsWith(path);
  }
};

export default Router;
