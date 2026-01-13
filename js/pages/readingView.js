/**
 * Reading View Page Component
 * Core feature: Audio-synced verse display
 */

import State from '../state.js';
import Router from '../router.js';
import AudioPlayer from '../components/audioPlayer.js';
import { AudioSync } from '../utils/audio.js';
import { icon, $, scrollIntoView } from '../utils/dom.js';
import { toKurdishNumber } from '../utils/formatters.js';

const ReadingViewPage = {
  container: null,
  surah: null,
  currentVerseIndex: -1,
  unsubscribers: [],

  /**
   * Mount reading view page
   * @param {Element} container - Container element
   * @param {Object} params - Route params (surahId)
   */
  async mount(container, params) {
    this.container = container;
    this.currentVerseIndex = -1;

    // Get surah data
    const surahId = parseInt(params.id);
    this.surah = State.getSurah(surahId);

    if (!this.surah || this.surah.verses.length === 0) {
      this._renderNotFound();
      return;
    }

    // Set current surah in state
    State.set('currentSurah', this.surah);

    // Render page
    this.render();

    // Load audio and set up sync
    this._setupAudio();
  },

  /**
   * Render reading view page HTML
   */
  render() {
    const appData = State.get('appData');
    const strings = appData?.uiStrings || {};

    this.container.innerHTML = `
      <div class="min-h-screen bg-cream-50">
        <!-- Header -->
        <div class="bg-cream-50 text-white py-6">
          <div class="max-w-4xl mx-auto px-4">
            <div class="flex items-center gap-4">
              <!-- Back Button -->
              <a href="#/audio-lessons"
                 class="w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-lg
                        flex items-center justify-center transition-colors">
                ${icon('chevronRight', 'w-5 h-5')}
              </a>

              <div class="flex-1">
                <h1 class="text-2xl font-bold">سورەتی ${this.surah.nameKurdish}</h1>
                <div class="flex items-center gap-3 text-emerald-200 text-sm mt-1">
                  <span class="font-quran text-lg">${this.surah.nameArabic}</span>
                  <span>•</span>
                  <span>${this.surah.revelationType}</span>
                  <span>•</span>
                  <span>${toKurdishNumber(this.surah.verseCount)} ${strings.verse || 'ئایەت'}</span>
                </div>
              </div>

              <!-- Surah Number Badge -->
              <div class="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center">
                <span class="text-xl font-bold text-emerald-900">${toKurdishNumber(this.surah.number)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Verses Container -->
        <div class="max-w-4xl mx-auto px-4 py-8 ">
          <div class="verse-container rounded-2xl p-6 md:p-8 shadow-sm" id="verses-container">
            ${this.surah.verses.map((verse, index) => this._renderVerse(verse, index)).join('')}
          </div>
        </div>
      </div>
    `;

    // Set up verse click handlers
    this._setupVerseClickHandlers();
  },

  /**
   * Render a single verse
   * @param {Object} verse - Verse object
   * @param {number} index - Verse index
   * @returns {string} HTML string
   */
  _renderVerse(verse, index) {
    return `
      <div class="verse-item p-4 md:p-6 rounded-xl cursor-pointer mb-4 last:mb-0"
           data-verse-index="${index}"
           id="verse-${index}">
        <div class="flex items-start gap-4">
          <!-- Verse Number -->
          <div class="verse-number w-10 h-10 md:w-12 md:h-12 bg-emerald-100 text-emerald-800
                      rounded-full flex items-center justify-center font-bold text-lg
                      flex-shrink-0 transition-colors">
            ${toKurdishNumber(verse.number)}
          </div>

          <div class="flex-1 min-w-0">
            <!-- Arabic Text -->
            <p class="quran-text text-quran-md md:text-quran-lg text-gray-900 mb-4 leading-loose">
              ${verse.textUthmani || verse.textArabic}
            </p>

            <!-- Tafsir -->
            <p class="text-gray-600 text-base md:text-lg leading-relaxed">
              ${verse.tafsirKurdish}
            </p>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Set up audio player and sync
   */
  _setupAudio() {
    if (!this.surah.audioUrl) return;

    // Load audio in player
    AudioPlayer.loadSurah(this.surah);

    // Set up audio sync
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      AudioSync.init(audioElement, this.surah.verses, (verseIndex) => {
        this._onVerseChange(verseIndex);
      });
    }
  },

  /**
   * Set up click handlers for verses
   */
  _setupVerseClickHandlers() {
    const verses = this.container.querySelectorAll('.verse-item');
    verses.forEach(verse => {
      verse.addEventListener('click', () => {
        const index = parseInt(verse.dataset.verseIndex);
        this._seekToVerse(index);
      });
    });
  },

  /**
   * Handle verse change from audio sync
   * @param {number} verseIndex - New verse index
   */
  _onVerseChange(verseIndex) {
    if (verseIndex === this.currentVerseIndex) return;

    // Remove highlight from previous verse
    if (this.currentVerseIndex >= 0) {
      const prevVerse = $(`#verse-${this.currentVerseIndex}`, this.container);
      if (prevVerse) {
        prevVerse.classList.remove('highlighted');
      }
    }

    // Highlight new verse
    if (verseIndex >= 0) {
      const newVerse = $(`#verse-${verseIndex}`, this.container);
      if (newVerse) {
        newVerse.classList.add('highlighted');

        // Auto-scroll to verse
        this._scrollToVerse(newVerse);
      }
    }

    this.currentVerseIndex = verseIndex;
    State.set('currentVerseIndex', verseIndex);

    // Update audio player verse info
    AudioPlayer.updateVerseInfo(verseIndex, this.surah);
  },

  /**
   * Seek audio to a specific verse
   * @param {number} verseIndex - Verse index to seek to
   */
  _seekToVerse(verseIndex) {
    AudioSync.seekToVerse(verseIndex);
    AudioPlayer.play();
  },

  /**
   * Scroll to a verse element
   * @param {Element} verseElement - Verse element to scroll to
   */
  _scrollToVerse(verseElement) {
    // Check if element is in viewport
    const rect = verseElement.getBoundingClientRect();
    const audioPlayerHeight = 100; // Approximate height of audio player
    const headerHeight = 80; // Approximate header height
    const viewportHeight = window.innerHeight - audioPlayerHeight - headerHeight;

    if (rect.top < headerHeight || rect.bottom > viewportHeight + headerHeight) {
      verseElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  },

  /**
   * Render not found state
   */
  _renderNotFound() {
    const strings = State.get('appData')?.uiStrings || {};

    this.container.innerHTML = `
      <div class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center px-4">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            ${icon('book', 'w-10 h-10 text-gray-400')}
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">
            ${strings.noLessonsYet || 'هێشتا وانەی ئامادە نییە'}
          </h2>
          <p class="text-gray-500 mb-6">
            ئەم سورەیە هێشتا وانەی بۆ ئامادە نەکراوە
          </p>
          <a href="#/audio-lessons"
             class="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white">
            ${icon('chevronRight', 'w-5 h-5')}
            <span>${strings.back || 'گەڕانەوە'}</span>
          </a>
        </div>
      </div>
    `;
  },

  /**
   * Unmount component
   */
  unmount() {
    // Clean up audio sync
    AudioSync.destroy();

    // Unsubscribe from state changes
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];

    // Clear state
    State.set('currentSurah', null);
    State.set('currentVerseIndex', -1);

    this.container.innerHTML = '';
  }
};

export default ReadingViewPage;
