/**
 * 3D Book Card Component
 */

import State from '../state.js';
import { icon } from '../utils/dom.js';
import { toKurdishNumber } from '../utils/formatters.js';

const BookCard = {
  /**
   * Create a 3D book card
   * @param {Object} book - Book object
   * @returns {string} HTML string
   */
  create(book) {
    const strings = State.get('appData')?.uiStrings || {};
    const stars = this._generateStars(book.rating || 0);
    const spineColor = this._darkenColor(book.coverColor);

    return `
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-cream-200">
        <div class="flex gap-6">
          <!-- 3D Book Cover -->
          <div class="book-card flex-shrink-0">
            <div class="book-cover w-32 h-44 rounded-md overflow-hidden relative"
                 style="background-color: ${book.coverColor}">
              <!-- Book spine -->
              <div class="book-spine" style="background-color: ${spineColor}"></div>

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
   * Create a compact book card for grid display
   * @param {Object} book - Book object
   * @returns {string} HTML string
   */
  createCompact(book) {
    const spineColor = this._darkenColor(book.coverColor);

    return `
      <div class="bg-white rounded-xl p-4 shadow-sm border border-cream-200 hover:shadow-md transition-shadow">
        <div class="flex gap-4">
          <!-- Mini 3D Book -->
          <div class="book-card flex-shrink-0">
            <div class="book-cover w-16 h-24 rounded overflow-hidden relative"
                 style="background-color: ${book.coverColor}">
              <div class="book-spine" style="background-color: ${spineColor}"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                ${icon('book', 'w-4 h-4 text-white')}
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="min-w-0">
            <h4 class="font-bold text-gray-900 text-sm mb-1 truncate">${book.title}</h4>
            <p class="text-gray-500 text-xs mb-2">${book.author}</p>
            <div class="flex gap-1">
              ${this._generateStars(book.rating || 0, 'w-3 h-3')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Generate star rating HTML
   * @param {number} rating - Rating (0-5)
   * @param {string} size - Size class
   * @returns {string} HTML string
   */
  _generateStars(rating, size = 'w-4 h-4') {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating
        ? `<svg class="${size} text-gold-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`
        : `<svg class="${size} text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`
    ).join('');
  },

  /**
   * Darken a hex color for book spine
   * @param {string} color - Hex color
   * @returns {string} Darkened hex color
   */
  _darkenColor(color) {
    if (!color || !color.startsWith('#')) return '#333333';

    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 30);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 30);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 30);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
};

export default BookCard;
