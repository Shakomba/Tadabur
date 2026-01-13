/**
 * Persistent Audio Player Component
 */

import State from '../state.js';
import { AudioSync, calculateProgress, getVerseMarkers } from '../utils/audio.js';
import { icon, $ } from '../utils/dom.js';
import { formatDuration, toKurdishNumber } from '../utils/formatters.js';

const AudioPlayer = {
  container: null,
  audioElement: null,
  isVisible: false,
  speedOptions: [0.5, 0.75, 1, 1.25, 1.5, 2],
  currentSpeed: 1,

  /**
   * Mount audio player component
   * @param {Element} container - Container element
   */
  mount(container) {
    this.container = container;
    this.audioElement = document.getElementById('audio-element');
    this.render();
    this._setupEventListeners();

    // Subscribe to audio state changes
    State.subscribe('audioState', (state) => this._onAudioStateChange(state));
  },

  /**
   * Render audio player HTML
   */
  render() {
    const strings = State.get('appData')?.uiStrings || {};

    this.container.innerHTML = `
      <div class="audio-bar py-3 px-4">
        <div class="max-w-7xl mx-auto">
          <!-- Progress Bar -->
          <div class="progress-track h-1 bg-emerald-800 rounded-full mb-3 relative" id="progress-track">
            <div class="progress-fill h-full bg-gold-400 rounded-full" id="progress-fill" style="width: 0%"></div>
            <div class="progress-handle absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gold-400 rounded-full shadow-md"
                 id="progress-handle" style="left: 0%"></div>
            <!-- Verse Markers -->
            <div id="verse-markers" class="absolute inset-0"></div>
          </div>

          <div class="flex items-center justify-between gap-4">
            <!-- Surah Info -->
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="w-10 h-10 bg-emerald-800 rounded-lg flex items-center justify-center flex-shrink-0">
                ${icon('volume', 'w-5 h-5 text-gold-400')}
              </div>
              <div class="min-w-0">
                <div class="text-white font-medium truncate" id="surah-name">—</div>
                <div class="text-emerald-300 text-sm" id="verse-info">—</div>
              </div>
            </div>

            <!-- Controls -->
            <div class="flex items-center gap-2 md:gap-4">
              <!-- Skip Backward -->
              <button id="skip-backward" class="p-2 text-white hover:text-gold-400 transition-colors"
                      title="١٠ چرکە بۆ پاش">
                <div class="relative">
                  ${icon('skipBackward', 'w-5 h-5')}
                  <span class="absolute -bottom-1 -right-1 text-[10px] text-gold-400">١٠</span>
                </div>
              </button>

              <!-- Play/Pause -->
              <button id="play-pause" class="w-12 h-12 bg-gold-500 hover:bg-gold-400 rounded-full
                                              flex items-center justify-center transition-colors">
                <span id="play-icon">${icon('play', 'w-6 h-6 text-emerald-900')}</span>
                <span id="pause-icon" class="hidden">${icon('pause', 'w-6 h-6 text-emerald-900')}</span>
              </button>

              <!-- Skip Forward -->
              <button id="skip-forward" class="p-2 text-white hover:text-gold-400 transition-colors"
                      title="١٠ چرکە بۆ پێش">
                <div class="relative">
                  ${icon('skipForward', 'w-5 h-5')}
                  <span class="absolute -bottom-1 -left-1 text-[10px] text-gold-400">١٠</span>
                </div>
              </button>
            </div>

            <!-- Time & Speed -->
            <div class="flex items-center gap-4 text-sm">
              <!-- Time Display -->
              <div class="text-white hidden sm:block">
                <span id="current-time">٠٠:٠٠</span>
                <span class="text-emerald-400 mx-1">/</span>
                <span id="duration" class="text-emerald-300">٠٠:٠٠</span>
              </div>

              <!-- Speed Control -->
              <div class="speed-dropdown relative">
                <button id="speed-btn" class="px-3 py-1 bg-emerald-800 rounded-lg text-gold-400
                                              hover:bg-emerald-700 transition-colors text-sm font-medium">
                  <span id="speed-value">١x</span>
                </button>
                <div class="speed-options" id="speed-options">
                  ${this.speedOptions.map(speed => `
                    <div class="speed-option ${speed === 1 ? 'active' : ''}" data-speed="${speed}">
                      ${speed}x
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Set up event listeners
   */
  _setupEventListeners() {
    if (!this.audioElement) return;

    // Audio element events
    this.audioElement.addEventListener('loadedmetadata', () => {
      this._updateDuration();
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this._updateProgress();
    });

    this.audioElement.addEventListener('play', () => {
      this._updatePlayState(true);
    });

    this.audioElement.addEventListener('pause', () => {
      this._updatePlayState(false);
    });

    this.audioElement.addEventListener('ended', () => {
      this._updatePlayState(false);
    });

    // Play/Pause button
    const playPauseBtn = $('#play-pause', this.container);
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => this.togglePlay());
    }

    // Skip buttons
    const skipForward = $('#skip-forward', this.container);
    const skipBackward = $('#skip-backward', this.container);

    if (skipForward) {
      skipForward.addEventListener('click', () => this.skip(10));
    }
    if (skipBackward) {
      skipBackward.addEventListener('click', () => this.skip(-10));
    }

    // Progress bar seeking
    const progressTrack = $('#progress-track', this.container);
    if (progressTrack) {
      progressTrack.addEventListener('click', (e) => this._seekFromClick(e));
    }

    // Speed control
    const speedOptions = this.container.querySelectorAll('.speed-option');
    speedOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const speed = parseFloat(e.target.dataset.speed);
        this.setSpeed(speed);
      });
    });
  },

  /**
   * Load audio for a surah
   * @param {Object} surah - Surah object with audioUrl
   */
  loadSurah(surah) {
    if (!this.audioElement || !surah.audioUrl) return;

    this.audioElement.src = surah.audioUrl;
    this.audioElement.load();

    // Update UI
    const surahName = $('#surah-name', this.container);
    if (surahName) {
      surahName.textContent = `سورەتی ${surah.nameKurdish}`;
    }

    // Update state
    State.updateAudioState({
      surahId: surah.id,
      loaded: true,
      playing: false,
      currentTime: 0,
      duration: surah.audioDuration || 0
    });

    // Set up verse markers
    this._renderVerseMarkers(surah.verses, surah.audioDuration);

    // Initialize audio sync
    AudioSync.updateVerses(surah.verses);

    // Show player
    this.show();
  },

  /**
   * Render verse markers on progress bar
   * @param {Array} verses - Verses with timestamps
   * @param {number} duration - Total duration
   */
  _renderVerseMarkers(verses, duration) {
    const container = $('#verse-markers', this.container);
    if (!container || !verses || !duration) return;

    const markers = getVerseMarkers(verses, duration);

    container.innerHTML = markers.map(marker => `
      <div class="absolute top-0 bottom-0 w-0.5 bg-emerald-600 opacity-50 hover:opacity-100
                  cursor-pointer transition-opacity group"
           style="left: ${marker.position}%"
           data-verse="${marker.index}"
           title="${toKurdishNumber(marker.verseNumber)} :ئایەتی">
        <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-800 text-white
                    text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          ئایەتی ${toKurdishNumber(marker.verseNumber)}
        </div>
      </div>
    `).join('');

    // Add click handlers for markers
    container.querySelectorAll('[data-verse]').forEach(marker => {
      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        const verseIndex = parseInt(marker.dataset.verse);
        AudioSync.seekToVerse(verseIndex);
        this.play();
      });
    });
  },

  /**
   * Toggle play/pause
   */
  togglePlay() {
    if (!this.audioElement) return;

    if (this.audioElement.paused) {
      this.play();
    } else {
      this.pause();
    }
  },

  /**
   * Play audio
   */
  play() {
    if (!this.audioElement) return;
    this.audioElement.play().catch(err => {
      console.error('Error playing audio:', err);
    });
  },

  /**
   * Pause audio
   */
  pause() {
    if (!this.audioElement) return;
    this.audioElement.pause();
  },

  /**
   * Skip forward/backward
   * @param {number} seconds - Seconds to skip (positive or negative)
   */
  skip(seconds) {
    if (!this.audioElement) return;
    this.audioElement.currentTime = Math.max(0,
      Math.min(this.audioElement.duration, this.audioElement.currentTime + seconds)
    );
  },

  /**
   * Set playback speed
   * @param {number} speed - Playback speed (0.5 to 2)
   */
  setSpeed(speed) {
    if (!this.audioElement) return;
    this.audioElement.playbackRate = speed;
    this.currentSpeed = speed;

    // Update UI
    const speedValue = $('#speed-value', this.container);
    if (speedValue) {
      speedValue.textContent = `${speed}x`;
    }

    // Update active state
    this.container.querySelectorAll('.speed-option').forEach(option => {
      option.classList.toggle('active', parseFloat(option.dataset.speed) === speed);
    });

    State.updateAudioState({ speed });
  },

  /**
   * Seek audio from click on progress bar
   * @param {MouseEvent} e - Click event
   */
  _seekFromClick(e) {
    if (!this.audioElement || !this.audioElement.duration) return;

    const track = $('#progress-track', this.container);
    const rect = track.getBoundingClientRect();
    // RTL: calculate from right side
    const clickPosition = rect.right - e.clientX;
    const percentage = (clickPosition / rect.width) * 100;
    const newTime = (percentage / 100) * this.audioElement.duration;

    this.audioElement.currentTime = Math.max(0, Math.min(this.audioElement.duration, newTime));
  },

  /**
   * Seek to a specific time
   * @param {number} time - Time in seconds
   */
  seekTo(time) {
    if (!this.audioElement) return;
    this.audioElement.currentTime = Math.max(0, Math.min(this.audioElement.duration || 0, time));
  },

  /**
   * Update progress bar
   */
  _updateProgress() {
    if (!this.audioElement) return;

    const progress = calculateProgress(this.audioElement.currentTime, this.audioElement.duration);

    const progressFill = $('#progress-fill', this.container);
    const progressHandle = $('#progress-handle', this.container);
    const currentTimeEl = $('#current-time', this.container);

    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    if (progressHandle) {
      progressHandle.style.left = `${progress}%`;
    }
    if (currentTimeEl) {
      currentTimeEl.textContent = formatDuration(this.audioElement.currentTime);
    }

    State.updateAudioState({
      currentTime: this.audioElement.currentTime
    });
  },

  /**
   * Update duration display
   */
  _updateDuration() {
    if (!this.audioElement) return;

    const durationEl = $('#duration', this.container);
    if (durationEl) {
      durationEl.textContent = formatDuration(this.audioElement.duration);
    }

    State.updateAudioState({
      duration: this.audioElement.duration
    });
  },

  /**
   * Update play/pause button state
   * @param {boolean} playing - Whether audio is playing
   */
  _updatePlayState(playing) {
    const playIcon = $('#play-icon', this.container);
    const pauseIcon = $('#pause-icon', this.container);

    if (playIcon && pauseIcon) {
      playIcon.classList.toggle('hidden', playing);
      pauseIcon.classList.toggle('hidden', !playing);
    }

    State.updateAudioState({ playing });
  },

  /**
   * Update verse info display
   * @param {number} verseIndex - Current verse index
   * @param {Object} surah - Current surah
   */
  updateVerseInfo(verseIndex, surah) {
    const verseInfo = $('#verse-info', this.container);
    if (!verseInfo || verseIndex < 0 || !surah) return;

    const verse = surah.verses[verseIndex];
    if (verse) {
      verseInfo.textContent = `ئایەتی ${toKurdishNumber(verse.number)} لە ${toKurdishNumber(surah.verseCount)}`;
    }
  },

  /**
   * Show audio player
   */
  show() {
    if (this.isVisible) return;
    this.container.classList.add('visible');
    this.isVisible = true;

    // Add padding to main content
    const mainContent = document.getElementById('app-content');
    if (mainContent) {
      mainContent.style.paddingBottom = '100px';
    }
  },

  /**
   * Hide audio player
   */
  hide() {
    if (!this.isVisible) return;
    this.container.classList.remove('visible');
    this.isVisible = false;

    // Remove padding from main content
    const mainContent = document.getElementById('app-content');
    if (mainContent) {
      mainContent.style.paddingBottom = '';
    }
  },

  /**
   * Handle audio state changes
   * @param {Object} state - New audio state
   */
  _onAudioStateChange(state) {
    // Handle state updates from other components
  },

  /**
   * Unmount component
   */
  unmount() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }
    this.container.innerHTML = '';
  }
};

export default AudioPlayer;
