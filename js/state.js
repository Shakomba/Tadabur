/**
 * Global State Management
 * Simple pub/sub pattern for reactive state updates
 */

const State = {
  _data: {
    appData: null,
    currentRoute: '/',
    currentSurah: null,
    currentVerseIndex: -1,
    audioState: {
      playing: false,
      currentTime: 0,
      duration: 0,
      speed: 1,
      loaded: false,
      surahId: null
    },
    searchQuery: '',
    searchResults: [],
    isLoading: true,
    mobileMenuOpen: false
  },

  _listeners: {},

  /**
   * Get a state value
   * @param {string} key - The state key to get
   * @returns {*} The state value
   */
  get(key) {
    if (key.includes('.')) {
      const keys = key.split('.');
      let value = this._data;
      for (const k of keys) {
        value = value?.[k];
      }
      return value;
    }
    return this._data[key];
  },

  /**
   * Set a state value and notify listeners
   * @param {string} key - The state key to set
   * @param {*} value - The value to set
   */
  set(key, value) {
    if (key.includes('.')) {
      const keys = key.split('.');
      const lastKey = keys.pop();
      let obj = this._data;
      for (const k of keys) {
        if (!obj[k]) obj[k] = {};
        obj = obj[k];
      }
      obj[lastKey] = value;
    } else {
      this._data[key] = value;
    }
    this._notify(key, value);
  },

  /**
   * Update audio state partially
   * @param {Object} updates - Partial audio state updates
   */
  updateAudioState(updates) {
    this._data.audioState = { ...this._data.audioState, ...updates };
    this._notify('audioState', this._data.audioState);
  },

  /**
   * Subscribe to state changes
   * @param {string} key - The state key to watch
   * @param {Function} callback - Callback function when state changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this._listeners[key]) {
      this._listeners[key] = [];
    }
    this._listeners[key].push(callback);

    // Return unsubscribe function
    return () => {
      this._listeners[key] = this._listeners[key].filter(cb => cb !== callback);
    };
  },

  /**
   * Notify all listeners for a key
   * @param {string} key - The state key that changed
   * @param {*} value - The new value
   */
  _notify(key, value) {
    // Notify exact key listeners
    if (this._listeners[key]) {
      this._listeners[key].forEach(callback => callback(value));
    }

    // Notify parent key listeners (e.g., 'audioState' when 'audioState.playing' changes)
    const parentKey = key.split('.')[0];
    if (parentKey !== key && this._listeners[parentKey]) {
      this._listeners[parentKey].forEach(callback => callback(this._data[parentKey]));
    }
  },

  /**
   * Load application data from data.json
   * @returns {Promise<Object>} The loaded data
   */
  async loadData() {
    try {
      const response = await fetch('data/data.json');
      if (!response.ok) {
        throw new Error('Failed to load data');
      }
      const data = await response.json();
      this.set('appData', data);
      return data;
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  },

  /**
   * Get a surah by ID
   * @param {number} id - The surah ID
   * @returns {Object|null} The surah object
   */
  getSurah(id) {
    const surahs = this.get('appData')?.surahs || [];
    return surahs.find(s => s.id === parseInt(id)) || null;
  },

  /**
   * Get surahs with available lessons
   * @returns {Array} Array of surahs with lessons
   */
  getSurahsWithLessons() {
    const surahs = this.get('appData')?.surahs || [];
    return surahs.filter(s => s.hasLessons && s.verses.length > 0);
  },

  /**
   * Search through surahs and tafsir books
   * @param {string} query - Search query
   * @returns {Object} Search results
   */
  search(query) {
    if (!query || query.length < 2) {
      return { surahs: [], books: [] };
    }

    const appData = this.get('appData');
    if (!appData) return { surahs: [], books: [] };

    const normalizedQuery = query.toLowerCase();

    // Search surahs
    const surahs = appData.surahs.filter(surah =>
      surah.nameArabic.includes(query) ||
      surah.nameKurdish.includes(query) ||
      surah.meaningKurdish?.includes(query) ||
      surah.verses.some(v =>
        v.textArabic.includes(query) ||
        v.tafsirKurdish.includes(query)
      )
    );

    // Search tafsir books
    const books = appData.tafsirBooks.filter(book =>
      book.title.includes(query) ||
      book.author.includes(query) ||
      book.description.includes(query)
    );

    return { surahs, books };
  },

  /**
   * Reset state to initial values
   */
  reset() {
    this.set('currentSurah', null);
    this.set('currentVerseIndex', -1);
    this.set('searchQuery', '');
    this.set('searchResults', []);
  }
};

export default State;
