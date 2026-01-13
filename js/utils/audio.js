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
    const hasTiming = this._verses.some((verse) => {
      const start = Number.isFinite(verse.audioTimestamp) ? verse.audioTimestamp : verse.startTime;
      const end = Number.isFinite(verse.audioEndTimestamp) ? verse.audioEndTimestamp : verse.endTime;
      return Number.isFinite(start) && (start > 0 || Number.isFinite(end));
    });
    if (!hasTiming) return -1;

    let lastTimedIndex = -1;
    for (let i = 0; i < this._verses.length; i++) {
      const verse = this._verses[i];
      const start = Number.isFinite(verse.audioTimestamp) ? verse.audioTimestamp : verse.startTime;
      let end = Number.isFinite(verse.audioEndTimestamp) ? verse.audioEndTimestamp : verse.endTime;
      if (!Number.isFinite(start)) {
        continue;
      }
      if (!Number.isFinite(end) || end <= start) {
        const nextVerse = this._verses[i + 1];
        const nextStart = nextVerse
          ? (Number.isFinite(nextVerse.audioTimestamp) ? nextVerse.audioTimestamp : nextVerse.startTime)
          : null;
        if (Number.isFinite(nextStart) && nextStart > start) {
          end = nextStart;
        }
      }

      lastTimedIndex = i;
      if (Number.isFinite(end) && end > start && currentTime >= start && currentTime < end) {
        return i;
      }
    }

    // If past all timed verses, return the last timed one
    if (lastTimedIndex >= 0) {
      const lastStart = Number.isFinite(this._verses[lastTimedIndex].audioTimestamp)
        ? this._verses[lastTimedIndex].audioTimestamp
        : this._verses[lastTimedIndex].startTime;
      if (Number.isFinite(lastStart) && currentTime >= lastStart) {
        return lastTimedIndex;
      }
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
    const start = Number.isFinite(verse.audioTimestamp) ? verse.audioTimestamp : verse.startTime;
    if (Number.isFinite(start)) {
      this._audioElement.currentTime = start;
    }
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
    const verse = this._verses[verseIndex];
    const timestamp = Number.isFinite(verse.audioTimestamp) ? verse.audioTimestamp : verse.startTime;
    return Number.isFinite(timestamp) ? timestamp : 0;
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

  const hasTiming = verses.some((verse) => {
    const timestamp = Number.isFinite(verse.audioTimestamp) ? verse.audioTimestamp : verse.startTime;
    return Number.isFinite(timestamp) && timestamp > 0;
  });
  if (!hasTiming) return [];

  const markers = [];
  verses.forEach((verse, index) => {
    const timestamp = Number.isFinite(verse.audioTimestamp) ? verse.audioTimestamp : verse.startTime;
    if (!Number.isFinite(timestamp)) return;
    markers.push({
      index,
      position: (timestamp / totalDuration) * 100,
      verseNumber: verse.number ?? verse.numberInSurah ?? index + 1
    });
  });
  return markers;
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
