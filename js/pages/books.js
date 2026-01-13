/**
 * Books Page Component (Coming Soon)
 */

import State from '../state.js';
import { icon } from '../utils/dom.js';

const BooksPage = {
  container: null,

  /**
   * Mount books page
   * @param {Element} container - Container element
   */
  mount(container) {
    this.container = container;
    this.render();
  },

  /**
   * Render books page HTML
   */
  render() {
    const appData = State.get('appData');
    const strings = appData?.uiStrings || {};
    const meta = appData?.meta || {};

    this.container.innerHTML = `
      <div class="min-h-screen bg-cream-50">
        <!-- Header -->
        <div class="bg-cream-50 text-white py-12 md:py-16">
          <div class="max-w-6xl mx-auto px-4">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">
              کتێب
            </h1>
            <p class="text-emerald-200 text-lg">
              کتێبەکانی تەفسیر و تەدەبوری قوڕئان
            </p>
          </div>
        </div>

        <!-- Coming Soon Content -->
        <div class="max-w-4xl mx-auto px-4 py-16 md:py-24 ">
          <div class="text-center">
            <!-- Illustration -->
            <div class="relative w-48 h-48 mx-auto mb-8">
              <!-- Stacked Books Illustration -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="relative">
                  <!-- Book 3 (back) -->
                  <div class="absolute -top-4 -right-4 w-32 h-40 bg-emerald-700 rounded-lg shadow-lg transform rotate-6"></div>
                  <!-- Book 2 (middle) -->
                  <div class="absolute -top-2 -right-2 w-32 h-40 bg-emerald-800 rounded-lg shadow-lg transform rotate-3"></div>
                  <!-- Book 1 (front) -->
                  <div class="relative w-32 h-40 bg-cream-50 rounded-lg shadow-xl flex items-center justify-center">
                    ${icon('book', 'w-12 h-12 text-gold-400')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-medium mb-6">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>${strings.comingSoon || 'بەم زووانە'}</span>
            </div>

            <!-- Title -->
            <h2 class="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
              کتێبەکان بەم زووانە
            </h2>

            <!-- Description -->
            <p class="text-gray-600 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              خەریکین کار لەسەر ئامادەکردنی کتێبەکانی تەفسیر و تەدەبور دەکەین.
              زوو بەردەست دەبێت بۆ خوێندنەوە و داگرتن.
            </p>

            <!-- Features Coming -->
            <div class="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
              <div class="bg-white rounded-xl p-6 shadow-sm border border-cream-200">
                <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  ${icon('book', 'w-6 h-6 text-emerald-700')}
                </div>
                <h3 class="font-bold text-gray-900 mb-2">خوێندنەوە</h3>
                <p class="text-gray-500 text-sm">خوێندنەوەی کتێبەکان بە شێوەی ئۆنلاین</p>
              </div>

              <div class="bg-white rounded-xl p-6 shadow-sm border border-cream-200">
                <div class="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-gray-900 mb-2">داگرتن</h3>
                <p class="text-gray-500 text-sm">داگرتنی کتێبەکان بە فۆرماتی PDF</p>
              </div>

              <div class="bg-white rounded-xl p-6 shadow-sm border border-cream-200">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-gray-900 mb-2">نیشانەکردن</h3>
                <p class="text-gray-500 text-sm">نیشانەکردنی پەڕەکان و تێبینی</p>
              </div>
            </div>

            <!-- CTA -->
            <div class="mt-12">
              <a href="#/audio-lessons"
                 class="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-emerald-900">
                ${icon('headphones', 'w-5 h-5')}
                <span>گوێبیستی لە وانەکان بکە</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Unmount component
   */
  unmount() {
    this.container.innerHTML = '';
  }
};

export default BooksPage;
