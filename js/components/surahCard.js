/**
 * Surah Card Component
 */

import State from '../state.js';
import { icon } from '../utils/dom.js';
import { toKurdishNumber, formatDuration } from '../utils/formatters.js';

const SurahCard = {
  /**
   * Create a surah card with lessons available
   * @param {Object} surah - Surah object
   * @returns {string} HTML string
   */
  createWithLessons(surah) {
    const strings = State.get('appData')?.uiStrings || {};

    return `
      <a href="#/surah/${surah.id}"
         class="surah-card bg-white rounded-xl p-6 shadow-sm border border-cream-200 block group">
        <div class="flex items-start gap-4">
          <!-- Surah Number -->
          <div class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl
                      flex items-center justify-center flex-shrink-0 shadow-lg
                      group-hover:scale-105 transition-transform">
            <span class="text-xl font-bold text-white">${toKurdishNumber(surah.number)}</span>
          </div>

          <div class="flex-1 min-w-0">
            <!-- Names -->
            <h3 class="font-bold text-lg text-gray-900 mb-1">${surah.nameKurdish}</h3>
            <p class="text-gray-500 font-quran text-xl mb-2">${surah.nameArabic}</p>

            <!-- Info -->
            <div class="flex flex-wrap items-center gap-2 text-sm">
              <span class="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                ${surah.revelationType}
              </span>
              <span class="text-gray-400">•</span>
              <span class="text-gray-500">
                ${toKurdishNumber(surah.verseCount)} ${strings.verse || 'ئایەت'}
              </span>
              ${surah.audioDuration ? `
                <span class="text-gray-400">•</span>
                <span class="text-gray-500">
                  ${formatDuration(surah.audioDuration)}
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Play Icon -->
          <div class="w-10 h-10 bg-gold-400 rounded-full flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            ${icon('play', 'w-5 h-5 text-emerald-900')}
          </div>
        </div>
      </a>
    `;
  },

  /**
   * Create a surah card without lessons (coming soon)
   * @param {Object} surah - Surah object
   * @returns {string} HTML string
   */
  createComingSoon(surah) {
    return `
      <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 opacity-60">
        <div class="flex items-center gap-3">
          <!-- Surah Number -->
          <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-sm font-medium text-gray-500">${toKurdishNumber(surah.number)}</span>
          </div>

          <div class="min-w-0">
            <h3 class="font-medium text-gray-600 truncate">${surah.nameKurdish}</h3>
            <p class="text-xs text-gray-400 font-quran">${surah.nameArabic}</p>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Create a compact surah card for lists
   * @param {Object} surah - Surah object
   * @returns {string} HTML string
   */
  createCompact(surah) {
    return `
      <a href="#/surah/${surah.id}"
         class="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-100 transition-colors">
        <span class="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full
                    flex items-center justify-center text-sm font-bold">
          ${toKurdishNumber(surah.number)}
        </span>
        <div class="min-w-0">
          <div class="font-medium text-gray-900 truncate">${surah.nameKurdish}</div>
          <div class="text-sm text-gray-500 font-quran">${surah.nameArabic}</div>
        </div>
      </a>
    `;
  }
};

export default SurahCard;
