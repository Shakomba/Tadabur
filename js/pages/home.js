/**
 * Home Page Component
 */

import State from '../state.js';
import { icon } from '../utils/dom.js';
import { toKurdishNumber } from '../utils/formatters.js';
import BookCard from '../components/bookCard.js';

const HomePage = {
  container: null,

  mount(container) {
    this.container = container;
    this.render();
  },

  render() {
    const appData = State.get('appData');
    const meta = appData?.meta || {};
    const teacher = appData?.teacher || {};
    const socialLinks = appData?.socialLinks || {};
    const strings = appData?.uiStrings || {};
    const tafsirBooks = appData?.tafsirBooks || [];

    // Get first 3 books for teaser
    const featuredBooks = tafsirBooks.slice(0, 3);

    // Define lesson style icons
    const lessonIcons = [
      { icon: 'book', color: 'text-gold-500' },
      { icon: 'star', color: 'text-gold-500' },
      { icon: 'check', color: 'text-gold-500' },
      { icon: 'sparkles', color: 'text-gold-500' }
    ];

    this.container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-gradient min-h-[75vh] flex items-center justify-center relative overflow-hidden">
        <!-- Enhanced Spotlight Effect -->
        <div class="hero-spotlight"></div>

        <!-- Decorative Elements -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-10 right-10 w-72 h-72 bg-gold-400 rounded-full blur-3xl"></div>
          <div class="absolute bottom-10 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>

        <div class="relative z-10 text-center px-4 py-16">
          <!-- Logo -->
          <div class="mb-8 animate-fade-in">
            <img src="assets/images/TadabburLogo.png" alt="${meta.appName}"
                 class="w-40 h-40 md:w-48 md:h-48 mx-auto hero-logo">
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in stagger-1">
            ${meta.appName || 'تەدەبوری قورئان'}
          </h1>

          <!-- Tagline -->
          <p class="text-lg md:text-xl text-cream-200 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in stagger-2">
            ${meta.tagline || ''}
          </p>

          <!-- Arrow pointing DOWN to button -->
          <div class="mb-4 animate-fade-in stagger-3">
            <svg class="w-12 h-12 mx-auto text-gold-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>

          <!-- CTA Button -->
          <div class="animate-fade-in stagger-4 mb-12">
            <a href="#/audio-lessons"
               class="btn-primary inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-medium text-emerald-900 bg-white hover:bg-cream-50 transition-colors shadow-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 0112.728 0"></path>
              </svg>
              <span>${strings.toTheLessons || 'بۆ وانەکان'}</span>
            </a>
          </div>

          <!-- Social Links -->
          <div class="animate-fade-in stagger-5">
            <h2 class="text-lg font-medium text-emerald-200 mb-4">${strings.followUs || 'بەدوایماندا بێ لە'}</h2>
            <div class="flex justify-center gap-4">
              <!-- Telegram -->
              <a href="${socialLinks.telegram || '#'}" target="_blank" rel="noopener noreferrer"
                 class="social-btn telegram flex items-center gap-3 px-6 py-3 rounded-xl text-white bg-blue-500 hover:bg-blue-600 transition-colors">
                <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img src="assets/images/telegram.png" alt="Telegram" class="w-5 h-5" />
                </div>
                <span class="font-medium">تێلەگرام</span>
              </a>

              <!-- YouTube -->
              <a href="${socialLinks.youtube || '#'}" target="_blank" rel="noopener noreferrer"
                 class="social-btn youtube flex items-center gap-3 px-6 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors">
                ${icon('youtube', 'w-6 h-6')}
                <span class="font-medium">یوتیوب</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Methodology Section -->
      <section class="py-16 md:py-24 bg-white">
        <div class="max-w-6xl mx-auto px-4">
          <div class="grid md:grid-cols-2 gap-12">
            <!-- Methodology -->
            <div class="bg-gradient-to-br from-emerald-50 to-cream-100 rounded-2xl p-8 md:p-10">
              <div class="w-14 h-14 bg-emerald-900 rounded-xl flex items-center justify-center mb-6">
                ${icon('book', 'w-7 h-7 text-gold-400')}
              </div>
              <h2 class="text-2xl font-bold text-emerald-900 mb-4">
                ${strings.methodology || 'مەنهەجمان'}
              </h2>
              <p class="text-gray-700 leading-relaxed text-lg">
                ${teacher.methodology || ''}
              </p>
            </div>

            <!-- Lesson Style with Icons -->
            <div class="bg-gradient-to-br from-gold-300/20 to-cream-100 rounded-2xl p-8 md:p-10">
              <div class="w-14 h-14 bg-gold-500 rounded-xl flex items-center justify-center mb-6">
                ${icon('star', 'w-7 h-7 text-emerald-900')}
              </div>
              <h2 class="text-2xl font-bold text-emerald-900 mb-4">
                ${strings.lessonStyle || 'شێوازی وانەکان'}
              </h2>
              <ul class="space-y-4 text-gray-700">
                ${(teacher.lessonStyle || []).map((item, index) => `
                  <li class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      ${icon(lessonIcons[index]?.icon || 'check', 'w-4 h-4 ' + (lessonIcons[index]?.color || 'text-gold-500'))}
                    </div>
                    <span class="leading-relaxed">${item}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Teacher Profile Card -->
      <section class="py-20 bg-white">
        <div class="max-w-4xl mx-auto px-4">
          <div class="text-center mb-12">
            <div class="inline-block">
              <h2 class="text-3xl md:text-4xl font-bold text-emerald-900 mb-3">
                ${strings.aboutTeacher || 'دەربارەی ماموستا'}
              </h2>
              <div class="h-1 bg-gold-400 rounded-full"></div>
            </div>
          </div>

          <div class="teacher-card bg-gradient-to-br from-cream-50 to-white rounded-3xl p-8 md:p-12 shadow-lg border border-cream-200">
            <div class="flex flex-col items-center text-center">
              <!-- Teacher Image -->
              <div class="mb-8">
                <div class="relative">
                  <!-- Circular frame with gradient border -->
                  <div class="w-48 h-48 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-1.5 shadow-xl">
                    <div class="w-full h-full rounded-full bg-gradient-to-br from-emerald-100 to-cream-100 flex items-center justify-center overflow-hidden">
                      <div class="w-36 h-36 rounded-full bg-emerald-900/10 flex items-center justify-center">
                        ${icon('user', 'w-20 h-20 text-emerald-700')}
                      </div>
                    </div>
                  </div>
                  <!-- Decorative ring -->
                  <div class="absolute -inset-2 rounded-full border-2 border-gold-400/20"></div>
                </div>
              </div>

              <!-- Teacher Info -->
              <h3 class="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
                ${teacher.name || ''}
              </h3>

              <p class="text-gray-600 text-lg leading-relaxed max-w-2xl">
                ${teacher.bio || ''}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Tafsir Books Teaser -->
      <section class="py-20 bg-emerald-900 relative overflow-hidden">
        <!-- Decorative Background -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute top-10 left-10 w-72 h-72 bg-gold-400 rounded-full blur-3xl"></div>
          <div class="absolute bottom-10 right-10 w-96 h-96 bg-gold-400 rounded-full blur-3xl"></div>
        </div>

        <div class="max-w-6xl mx-auto px-4 relative z-10">
          <div class="text-center mb-16">
            <div class="inline-block">
              <h2 class="text-3xl md:text-4xl font-bold text-white mb-3">
                ناساندنی تەفسیرەکان
              </h2>
              <div class="h-1 bg-gold-400 rounded-full"></div>
            </div>
          </div>

          <div class="grid md:grid-cols-3 gap-12 mb-12">
            ${featuredBooks.map(book => {
              const spineColor = this._darkenColor(book.coverColor);
              return `
                <a href="#/tafsir-reviews" class="group block">
                  <div class="relative">
                    <!-- Book Spines Container (Wide format for multi-volume sets) -->
                    <div class="aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-cream-100 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-3">
                      <!-- Placeholder for book spines image -->
                      <div class="w-full h-full relative" style="background: linear-gradient(135deg, ${book.coverColor} 0%, ${spineColor} 100%);">
                        <!-- Multi-volume spine effect -->
                        <div class="absolute inset-0 flex">
                          ${Array.from({length: 5}, (_, i) => `
                            <div class="flex-1 relative border-l border-white/10 flex items-center justify-center">
                              <div class="transform -rotate-90 text-white/70 text-xs font-bold whitespace-nowrap">
                                ${book.title}
                              </div>
                            </div>
                          `).join('')}
                        </div>

                        <!-- Decorative overlay -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                        <!-- Icon -->
                        <div class="absolute top-4 right-4">
                          <div class="w-10 h-10 bg-white/25 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            ${icon('book', 'w-5 h-5 text-white')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Book Title -->
                    <div class="mt-5 text-center">
                      <h3 class="text-xl font-bold text-white mb-1 group-hover:text-gold-300 transition-colors">
                        ${book.title}
                      </h3>
                      <p class="text-emerald-200 text-sm">${book.author}</p>
                    </div>
                  </div>
                </a>
              `;
            }).join('')}
          </div>

          <div class="text-center">
            <a href="#/tafsir-reviews"
               class="inline-flex items-center gap-3 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-emerald-900 rounded-xl font-bold transition-all hover:-translate-y-1 shadow-xl text-lg">
              <span>بینینی زیاتر</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-emerald-950 text-white py-8">
        <div class="max-w-6xl mx-auto px-4">
          <!-- Main Footer Content -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <!-- Right Side: Logo & Mission -->
            <div class="text-center md:text-right">
              <img src="assets/images/TadabburLogo.png" alt="${meta.appName}" class="w-12 h-12 mx-auto md:mr-0 mb-3 opacity-90">
              <p class="text-cream-200 text-sm leading-relaxed">
                ${meta.tagline || 'تەفسیرکردنی قوڕئان بەپێی مەنهەجی سەلەف و زمانی عەرەبی'}
              </p>
            </div>

            <!-- Center: Quick Links -->
            <div class="text-center md:text-right">
              <h3 class="text-gold-400 font-bold mb-3">بەستەرە خێراکان</h3>
              <nav class="flex flex-col gap-1.5">
                <a href="#/" class="text-cream-200 hover:text-gold-300 transition-colors text-sm">سەرەکی</a>
                <a href="#/audio-lessons" class="text-cream-200 hover:text-gold-300 transition-colors text-sm">وانە دەنگییەکان</a>
                <a href="#/books" class="text-cream-200 hover:text-gold-300 transition-colors text-sm">کتێب</a>
                <a href="#/tafsir-reviews" class="text-cream-200 hover:text-gold-300 transition-colors text-sm">ناساندنی تەفسیرەکان</a>
                <a href="#/about" class="text-cream-200 hover:text-gold-300 transition-colors text-sm">دەربارە</a>
              </nav>
            </div>

            <!-- Left Side: Social & Contact -->
            <div class="text-center md:text-left">
              <h3 class="text-gold-400 font-bold mb-3">پەیوەندی</h3>
              <!-- Social Links -->
              <div class="flex gap-2.5 items-center justify-center md:justify-start mb-2">
                <a href="${socialLinks.telegram || '#'}" target="_blank" rel="noopener noreferrer"
                   class="w-8 h-8 bg-cream-100/10 hover:bg-cream-100/20 rounded-lg flex items-center justify-center transition-colors">
                  <img src="assets/images/telegram.png" alt="Telegram" class="w-4 h-4" />
                </a>
                <a href="${socialLinks.youtube || '#'}" target="_blank" rel="noopener noreferrer"
                   class="w-8 h-8 bg-cream-100/10 hover:bg-cream-100/20 rounded-lg flex items-center justify-center transition-colors">
                  ${icon('youtube', 'w-4 h-4 text-cream-200')}
                </a>
              </div>
              <!-- Contact Email on new line -->
              <a href="mailto:info@tadabur.com" class="text-cream-200 text-sm hover:text-gold-300 transition-colors block">
                info@tadabur.com
              </a>
            </div>
          </div>

          <!-- Bottom Line: Copyright & Attribution -->
          <div class="border-t border-cream-100/20 pt-4 text-center">
            <p class="text-cream-200 text-xs mb-1.5">
              ${meta.appName || 'تەدەبوری قورئان'} © ${new Date().getFullYear()}
            </p>
            <a href="https://newhalabja.org" target="_blank" rel="noopener noreferrer"
               class="text-gold-400 hover:text-gold-300 transition-colors text-xs font-medium inline-flex items-center gap-1.5">
              <span>ئەم پڕۆژەیە بەشێکە لە بنکەی نوێی هەڵەبجە</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    `;
  },

  unmount() {
    this.container.innerHTML = '';
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

export default HomePage;
