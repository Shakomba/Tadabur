/**
 * Audio Synchronization Utilities
 */

/**
 * Audio sync manager for verse highlighting
 */
export const AudioSync = {
  _audioElement: null,
  _verses: [],
  _onVerseChange: null,
  _animationFrame: null,
  _lastVerseIndex: -1,

  /**
   * Initialize audio sync with verses
   * @param {HTMLAudioElement} audioElement - The audio element
   * @param {Array} verses - Array of verse objects with timestamps
   * @param {Function} onVerseChange - Callback when active verse changes
   */
  init(audioElement, verses, onVerseChange) {
    this._audioElement = audioElement;
    this._verses = verses;
    this._onVerseChange = onVerseChange;
    this._lastVerseIndex = -1;

    // Set up event listeners
    this._setupListeners();
  },

  /**
   * Set up audio element event listeners
   */
  _setupListeners() {
    if (!this._audioElement) return;

    this._audioElement.addEventListener('play', () => this._startSync());
    this._audioElement.addEventListener('pause', () => this._stopSync());
    this._audioElement.addEventListener('ended', () => this._stopSync());
    this._audioElement.addEventListener('seeked', () => this._checkSync());
  },

  /**
   * Find the active verse index based on current time
   * @param {number} currentTime - Current playback time in seconds
   * @returns {number} Index of active verse, or -1 if none
   */
  findActiveVerseIndex(currentTime) {
    for (let i = 0; i < this._verses.length; i++) {
      const verse = this._verses[i];
      if (currentTime >= verse.audioTimestamp &&
          currentTime < verse.audioEndTimestamp) {
        return i;
      }
    }

    // If past all verses, return last one
    if (this._verses.length > 0 &&
        currentTime >= this._verses[this._verses.length - 1].audioTimestamp) {
      return this._verses.length - 1;
    }

    return -1;
  },

  /**
   * Check sync and notify if verse changed
   */
  _checkSync() {
    if (!this._audioElement || !this._verses.length) return;

    const currentIndex = this.findActiveVerseIndex(this._audioElement.currentTime);

    if (currentIndex !== this._lastVerseIndex) {
      this._lastVerseIndex = currentIndex;
      if (this._onVerseChange) {
        this._onVerseChange(currentIndex);
      }
    }
  },

  /**
   * Start sync loop using requestAnimationFrame
   */
  _startSync() {
    const sync = () => {
      this._checkSync();
      if (this._audioElement && !this._audioElement.paused) {
        this._animationFrame = requestAnimationFrame(sync);
      }
    };
    this._animationFrame = requestAnimationFrame(sync);
  },

  /**
   * Stop sync loop
   */
  _stopSync() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
  },

  /**
   * Seek to a specific verse
   * @param {number} verseIndex - Index of verse to seek to
   */
  seekToVerse(verseIndex) {
    if (!this._audioElement || verseIndex < 0 || verseIndex >= this._verses.length) {
      return;
    }

    const verse = this._verses[verseIndex];
    this._audioElement.currentTime = verse.audioTimestamp;
  },

  /**
   * Get timestamp for a verse
   * @param {number} verseIndex - Index of verse
   * @returns {number} Timestamp in seconds
   */
  getVerseTimestamp(verseIndex) {
    if (verseIndex < 0 || verseIndex >= this._verses.length) {
      return 0;
    }
    return this._verses[verseIndex].audioTimestamp;
  },

  /**
   * Update verses (when surah changes)
   * @param {Array} verses - New array of verses
   */
  updateVerses(verses) {
    this._verses = verses;
    this._lastVerseIndex = -1;
  },

  /**
   * Cleanup
   */
  destroy() {
    this._stopSync();
    this._audioElement = null;
    this._verses = [];
    this._onVerseChange = null;
    this._lastVerseIndex = -1;
  }
};

/**
 * Format timestamp markers for progress bar
 * @param {Array} verses - Array of verse objects
 * @param {number} totalDuration - Total audio duration
 * @returns {Array} Array of marker positions (0-100%)
 */
export function getVerseMarkers(verses, totalDuration) {
  if (!verses || !totalDuration) return [];

  return verses.map((verse, index) => ({
    index,
    position: (verse.audioTimestamp / totalDuration) * 100,
    verseNumber: verse.number
  }));
}

/**
 * Calculate progress percentage
 * @param {number} currentTime - Current time in seconds
 * @param {number} duration - Total duration in seconds
 * @returns {number} Progress percentage (0-100)
 */
export function calculateProgress(currentTime, duration) {
  if (!duration) return 0;
  return Math.min((currentTime / duration) * 100, 100);
}

/**
 * Calculate time from progress percentage
 * @param {number} percentage - Progress percentage (0-100)
 * @param {number} duration - Total duration in seconds
 * @returns {number} Time in seconds
 */
export function calculateTimeFromProgress(percentage, duration) {
  return (percentage / 100) * duration;
}

export default AudioSync;
