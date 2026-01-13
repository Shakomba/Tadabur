/**
 * About Page Component
 */

import State from '../state.js';
import { icon } from '../utils/dom.js';

const AboutPage = {
  container: null,

  /**
   * Mount about page
   * @param {Element} container - Container element
   */
  mount(container) {
    this.container = container;
    this.render();
  },

  /**
   * Render about page HTML
   */
  render() {
    const appData = State.get('appData');
    const meta = appData?.meta || {};
    const teacher = appData?.teacher || {};
    const socialLinks = appData?.socialLinks || {};
    const strings = appData?.uiStrings || {};

    this.container.innerHTML = `
      <div class="min-h-screen bg-cream-50">
        <!-- Header -->
        <div class="bg-cream-50 text-white py-12 md:py-16">
          <div class="max-w-4xl mx-auto px-4 text-center">
            <img src="assets/images/TadabburLogo.png" alt="${meta.appName}"
                 class="w-24 h-24 mx-auto mb-6">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">
              ${strings.aboutProject || 'دەربارەی پڕۆژەکە'}
            </h1>
            <p class="text-emerald-200 text-lg max-w-xl mx-auto">
              ${meta.tagline || ''}
            </p>
          </div>
        </div>

        <div class="max-w-4xl mx-auto px-4 py-12 ">
          <!-- Mission Section -->
          <section class="mb-16">
            <h2 class="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <span class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                ${icon('star', 'w-5 h-5 text-emerald-700')}
              </span>
              ئامانجی پڕۆژەکە
            </h2>

            <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-cream-200">
              <p class="text-gray-700 text-lg leading-relaxed mb-6">
                پڕۆژەی <strong class="text-emerald-800">${meta.appName}</strong> هەوڵێکی زانستییە بۆ
                تەفسیرکردن و تەدەبوری قوڕئانی پیرۆز بە زمانی کوردی، بە پشتبەستن بە مەنهەجی سەلەف
                و بنەماکانی زمانی عەرەبی.
              </p>

              <div class="grid md:grid-cols-2 gap-6">
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-1">تەفسیری ڕاست</h3>
                    <p class="text-gray-600 text-sm">تەفسیرکردنی قوڕئان بە قوڕئان و فەرموودە</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <div class="w-3 h-3 bg-gold-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-1">زمانی عەرەبی</h3>
                    <p class="text-gray-600 text-sm">فێربوونی زمانی عەرەبی لە ڕێگەی قوڕئانەوە</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-1">تێگەیشتنی سەلەف</h3>
                    <p class="text-gray-600 text-sm">گەڕانەوە بۆ تێگەیشتنی سەلەف لە قوڕئان</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 mb-1">قیرائاتی عەشر</h3>
                    <p class="text-gray-600 text-sm">گرنگیدان بە قیرائاتەکان بۆ تەفسیر</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Teacher Section -->
          <section class="mb-16">
            <h2 class="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <span class="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                ${icon('info', 'w-5 h-5 text-gold-600')}
              </span>
              ${strings.aboutTeacher || 'دەربارەی ماموستا'}
            </h2>

            <div class="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-2xl p-6 md:p-8 text-white">
              <div class="flex flex-col md:flex-row items-center gap-6">
                <!-- Avatar Placeholder -->
                <div class="w-24 h-24 bg-emerald-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-4xl font-bold text-gold-400">س</span>
                </div>

                <div class="text-center md:text-right flex-1">
                  <h3 class="text-2xl font-bold text-gold-400 mb-2">
                    ${teacher.name || ''}
                  </h3>
                  <p class="text-emerald-200 leading-relaxed">
                    ${teacher.bio || ''}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Methodology Section -->
          <section class="mb-16">
            <h2 class="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <span class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                ${icon('book', 'w-5 h-5 text-emerald-700')}
              </span>
              ${strings.methodology || 'مەنهەجمان'}
            </h2>

            <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-cream-200">
              <p class="text-gray-700 text-lg leading-relaxed">
                ${teacher.methodology || ''}
              </p>
            </div>
          </section>

          <!-- Lesson Style Section -->
          <section class="mb-16">
            <h2 class="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <span class="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                ${icon('headphones', 'w-5 h-5 text-gold-600')}
              </span>
              ${strings.lessonStyle || 'شێوازی وانەکان'}
            </h2>

            <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-cream-200">
              <ul class="space-y-4">
                ${(teacher.lessonStyle || []).map((item, index) => `
                  <li class="flex items-start gap-4">
                    <span class="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full
                                flex items-center justify-center font-bold flex-shrink-0">
                      ${index + 1}
                    </span>
                    <p class="text-gray-700 leading-relaxed pt-1">${item}</p>
                  </li>
                `).join('')}
              </ul>
            </div>
          </section>

          <!-- Contact Section -->
          <section>
            <h2 class="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <span class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </span>
              پەیوەندی
            </h2>

            <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-cream-200">
              <p class="text-gray-600 mb-6">
                بۆ پەیوەندیکردن و بەدواداچوونی نوێترین نەوتارەکان، بەدوایماندا بێ لە:
              </p>

              <div class="flex flex-wrap gap-4">
                <!-- Telegram -->
                <a href="${socialLinks.telegram || '#'}" target="_blank" rel="noopener noreferrer"
                   class="social-btn telegram flex items-center gap-3 px-6 py-3 rounded-xl text-white">
                  ${icon('telegram', 'w-6 h-6')}
                  <span class="font-medium">تێلەگرام</span>
                </a>

                <!-- YouTube -->
                <a href="${socialLinks.youtube || '#'}" target="_blank" rel="noopener noreferrer"
                   class="social-btn youtube flex items-center gap-3 px-6 py-3 rounded-xl text-white">
                  ${icon('youtube', 'w-6 h-6')}
                  <span class="font-medium">یوتیوب</span>
                </a>
              </div>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <footer class="bg-emerald-950 text-white py-8 mt-16">
          <div class="max-w-4xl mx-auto px-4 text-center">
            <img src="assets/images/TadabburLogo.png" alt="${meta.appName}" class="w-12 h-12 mx-auto mb-4 opacity-75">
            <p class="text-emerald-300 text-sm">
              ${meta.appName || 'تەدەبوری قورئان'} © ${new Date().getFullYear()}
            </p>
          </div>
        </footer>
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

export default AboutPage;
