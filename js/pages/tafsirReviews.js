/**
 * Tafsir Reviews Page Component
 */

import State from '../state.js';
import { icon } from '../utils/dom.js';
import { toKurdishNumber } from '../utils/formatters.js';

const TafsirReviewsPage = {
  container: null,

  /**
   * Mount tafsir reviews page
   * @param {Element} container - Container element
   */
  mount(container) {
    this.container = container;
    this.render();
  },

  /**
   * Render tafsir reviews page HTML
   */
  render() {
    const appData = State.get('appData');
    const strings = appData?.uiStrings || {};
    const books = appData?.tafsirBooks || [];

    this.container.innerHTML = `
      <div class="min-h-screen bg-cream-50">
        <!-- Header -->
        <div class="bg-cream-50 text-white py-12 md:py-16">
          <div class="max-w-6xl mx-auto px-4">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">
              ناساندنی تەفسیرەکان
            </h1>
            <p class="text-emerald-200 text-lg">
              ناساندن و پێداچوونەوە بە کتێبە تەفسیرییە ناوداڕەکان
            </p>
          </div>
        </div>

        <!-- Books Grid -->
        <div class="max-w-6xl mx-auto px-4 py-12 ">
          <div class="grid md:grid-cols-2 gap-8">
            ${books.map(book => this._renderBookCard(book)).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render a 3D book card
   * @param {Object} book - Book object
   * @returns {string} HTML string
   */
  _renderBookCard(book) {
    const strings = State.get('appData')?.uiStrings || {};

    // Generate stars
    const stars = Array.from({ length: 5 }, (_, i) =>
      i < book.rating
        ? `<svg class="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`
        : `<svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`
    ).join('');

    return `
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-cream-200">
        <div class="flex gap-6">
          <!-- 3D Book Cover -->
          <div class="book-card flex-shrink-0">
            <div class="book-cover w-32 h-44 rounded-md overflow-hidden relative"
                 style="background-color: ${book.coverColor}">
              <!-- Book spine -->
              <div class="book-spine" style="background-color: ${this._darkenColor(book.coverColor)}"></div>

              <!-- Book edge -->
              <div class="book-edge"></div>

              <!-- Book front -->
              <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  ${icon('book', 'w-5 h-5')}
                </div>
                <div class="text-center">
                  <h4 class="text-sm font-bold leading-tight">${book.title}</h4>
                </div>
              </div>
            </div>
          </div>

          <!-- Book Info -->
          <div class="flex-1 min-w-0">
            <h3 class="text-xl font-bold text-gray-900 mb-2">${book.title}</h3>
            <p class="text-emerald-700 font-medium mb-3">${book.author}</p>

            <!-- Rating -->
            <div class="flex items-center gap-1 mb-4">
              ${stars}
            </div>

            <!-- Description -->
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              ${book.description}
            </p>

            <!-- Meta Info -->
            <div class="flex flex-wrap gap-3 text-sm">
              <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg">
                ${toKurdishNumber(book.pageCount)} ${strings.pages || 'پەڕە'}
              </span>
              <span class="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                ${book.language}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Darken a hex color for book spine
   * @param {string} color - Hex color
   * @returns {string} Darkened hex color
   */
  _darkenColor(color) {
    // Simple darkening by reducing RGB values
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 30);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 30);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 30);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },

  /**
   * Unmount component
   */
  unmount() {
    this.container.innerHTML = '';
  }
};

export default TafsirReviewsPage;
