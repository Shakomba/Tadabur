/**
 * Audio Lessons Page Component
 */

import State from '../state.js';
import { icon } from '../utils/dom.js';
import { toKurdishNumber, formatDuration } from '../utils/formatters.js';

const AudioLessonsPage = {
  container: null,

  /**
   * Mount audio lessons page
   * @param {Element} container - Container element
   */
  mount(container) {
    this.container = container;
    this.render();
  },

  /**
   * Render audio lessons page HTML
   */
  render() {
    const appData = State.get('appData');
    const strings = appData?.uiStrings || {};
    const surahs = appData?.surahs || [];

    // Separate surahs with and without lessons
    const withLessons = surahs.filter(s => s.hasLessons && s.verses.length > 0);
    const withoutLessons = surahs.filter(s => !s.hasLessons || s.verses.length === 0);

    this.container.innerHTML = `
      <div class="min-h-screen bg-cream-50">
        <div class="max-w-6xl mx-auto px-4 py-8 md:py-12 ">
          <!-- Available Lessons -->
          ${withLessons.length > 0 ? `
          <section class="mb-12">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-700" fill="currentColor" aria-hidden="true" viewBox="0 0 640 640">
                  <path d="M443.6 64.3C434.7 65.5 426.4 70.5 421.2 78.4C414.4 88.8 414.2 102.5 420.8 113C426.4 121.9 436.3 125.7 444.6 131.5C452.1 136.7 462.2 144.7 472.3 155.7C492.3 177.4 511.8 210 511.8 256C511.8 273.7 526.1 288 543.8 288C561.5 288 575.8 273.7 575.8 256C575.8 190 547.3 142.6 519.3 112.3C505.4 97.2 491.5 86.2 481 79C470 71.4 457.5 62.4 443.4 64.3zM304 192C246.4 192 198.9 235.6 192.7 291.5C190.8 309.1 174.9 321.7 157.4 319.8C139.9 317.9 127.2 302 129.1 284.5C138.8 196.5 213.4 128 304 128C401.2 128 480 206.8 480 304C480 350 462.3 391.9 433.4 423.3C421.4 436.3 416 448.1 416 458L416 464.1C416 526 365.9 576.1 304 576.1C286.3 576.1 272 561.8 272 544.1C272 526.4 286.3 512.1 304 512.1C330.5 512.1 352 490.6 352 464.1L352 458C352 425.1 369.4 398.4 386.4 380C404.8 360 416 333.4 416 304.1C416 242.2 365.9 192.1 304 192.1zM64 544C64 526.3 78.3 512 96 512C113.7 512 128 526.3 128 544C128 561.7 113.7 576 96 576C78.3 576 64 561.7 64 544zM224 448C241.7 448 256 433.7 256 416C256 398.3 241.7 384 224 384C206.3 384 192 398.3 192 416C192 433.7 206.3 448 224 448zM150.6 425.4C138.1 412.9 117.8 412.9 105.3 425.4C92.8 437.9 92.8 458.2 105.3 470.7L169.3 534.7C181.8 547.2 202.1 547.2 214.6 534.7C227.1 522.2 227.1 501.9 214.6 489.4L150.6 425.4zM304 272C286.3 272 272 286.3 272 304C272 317.3 261.3 328 248 328C234.7 328 224 317.3 224 304C224 259.8 259.8 224 304 224C348.2 224 384 259.8 384 304C384 317.3 373.3 328 360 328C346.7 328 336 317.3 336 304C336 286.3 321.7 272 304 272z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-emerald-900">
                ${strings.availableLessons || 'وانەی بەردەستە'}
                <span class="text-emerald-600 font-normal text-base mr-2">
                  (${toKurdishNumber(withLessons.length)})
                </span>
              </h3>
            </div>

            <!-- Section Label with Decorative Lines -->
            <div class="flex items-center justify-center mt-4 mb-8">
              <div class="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-300 to-emerald-300 max-w-xs"></div>
              <h2 class="px-6 text-3xl md:text-4xl font-bold text-emerald-800" style="font-family: 'Vazirmatn', sans-serif;">
                جوزئی عم
              </h2>
              <div class="flex-1 h-px bg-gradient-to-l from-transparent via-emerald-300 to-emerald-300 max-w-xs"></div>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              ${withLessons.map(surah => this._renderSurahCard(surah, true)).join('')}
            </div>
          </section>
          ` : ''}

          <!-- Coming Soon -->
          ${withoutLessons.length > 0 ? `
          <section>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                ${icon('book', 'w-5 h-5 text-gray-500')}
              </div>
              <h2 class="text-xl font-bold text-gray-600">
                ${strings.comingSoon || 'بەم زووانە'}
                <span class="font-normal text-base mr-2">
                  (${toKurdishNumber(withoutLessons.length)})
                </span>
              </h2>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              ${withoutLessons.map(surah => this._renderSurahCard(surah, false)).join('')}
            </div>
          </section>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render a surah card
   * @param {Object} surah - Surah object
   * @param {boolean} hasLessons - Whether surah has lessons
   * @returns {string} HTML string
   */
  _renderSurahCard(surah, hasLessons) {
    const strings = State.get('appData')?.uiStrings || {};

    if (hasLessons) {
      // Calculate total duration
      const totalDuration = this._calculateTotalDuration(surah);

      return `
        <a href="#/surah/${surah.id}"
           class="surah-card bg-white rounded-xl p-4 shadow-sm border border-cream-200 block group hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3">
            <!-- Surah Number (Right side) -->
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl
                        flex items-center justify-center flex-shrink-0 shadow-lg">
              <span class="text-lg font-bold text-white">${toKurdishNumber(surah.number)}</span>
            </div>

            <div class="flex-1 min-w-0 text-right">
              <!-- Surah Name -->
              <h3 class="font-bold text-lg text-gray-900 mb-1" style="font-family: 'Vazirmatn', sans-serif;">${surah.nameArabic}</h3>

              <!-- Info -->
              <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 justify-end">
                <span class="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                  ${surah.revelationType}
                </span>
                <span>•</span>
                <span>${toKurdishNumber(surah.verseCount)} ${strings.verse || 'ئایەت'}</span>
                ${totalDuration ? `
                  <span>•</span>
                  <span>${formatDuration(totalDuration)}</span>
                ` : ''}
              </div>
            </div>
          </div>
        </a>
      `;
    } else {
      return `
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 opacity-60">
          <div class="flex items-center gap-3">
            <!-- Surah Number -->
            <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-medium text-gray-500">${toKurdishNumber(surah.number)}</span>
            </div>

            <div class="min-w-0 text-right">
              <h3 class="font-medium text-gray-600 truncate">${surah.nameKurdish}</h3>
              <p class="text-xs text-gray-400 font-quran">${surah.nameArabic}</p>
            </div>
          </div>
        </div>
      `;
    }
  },

  /**
   * Calculate total duration for a surah
   * @param {Object} surah - Surah object
   * @returns {number} Total duration in seconds
   */
  _calculateTotalDuration(surah) {
    // If surah has lectures, sum their durations
    if (surah.lectures && Array.isArray(surah.lectures)) {
      return surah.lectures.reduce((total, lecture) => {
        return total + (lecture.audioDuration || 0);
      }, 0);
    }
    // Otherwise return the surah's own duration
    return surah.audioDuration || 0;
  },

  /**
   * Unmount component
   */
  unmount() {
    this.container.innerHTML = '';
  }
};

export default AudioLessonsPage;
