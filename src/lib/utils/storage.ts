/**
 * Local storage utilities for saving user preferences and data
 */

export interface SavedSearch {
  id: string;
  name: string;
  filters: any;
  createdAt: string;
  alertEnabled: boolean;
}

export interface ComparedProperty {
  id: string;
  addedAt: string;
}

const STORAGE_KEYS = {
  SAVED_PROPERTIES: 'realtycheq_saved_properties',
  SAVED_SEARCHES: 'realtycheq_saved_searches', 
  COMPARED_PROPERTIES: 'realtycheq_compared_properties',
  USER_PREFERENCES: 'realtycheq_user_preferences',
  RECENT_SEARCHES: 'realtycheq_recent_searches',
} as const;

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Saved Properties
export function getSavedProperties(): string[] {
  return getFromStorage(STORAGE_KEYS.SAVED_PROPERTIES, []);
}

export function saveProperty(propertyId: string): void {
  const saved = getSavedProperties();
  if (!saved.includes(propertyId)) {
    saveToStorage(STORAGE_KEYS.SAVED_PROPERTIES, [...saved, propertyId]);
  }
}

export function removeSavedProperty(propertyId: string): void {
  const saved = getSavedProperties();
  saveToStorage(STORAGE_KEYS.SAVED_PROPERTIES, saved.filter(id => id !== propertyId));
}

export function isPropertySaved(propertyId: string): boolean {
  return getSavedProperties().includes(propertyId);
}

// Saved Searches
export function getSavedSearches(): SavedSearch[] {
  return getFromStorage(STORAGE_KEYS.SAVED_SEARCHES, []);
}

export function saveSearch(search: Omit<SavedSearch, 'id' | 'createdAt'>): SavedSearch {
  const searches = getSavedSearches();
  const newSearch: SavedSearch = {
    ...search,
    id: `search_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEYS.SAVED_SEARCHES, [...searches, newSearch]);
  return newSearch;
}

export function removeSavedSearch(searchId: string): void {
  const searches = getSavedSearches();
  saveToStorage(STORAGE_KEYS.SAVED_SEARCHES, searches.filter(s => s.id !== searchId));
}

// Property Comparison
export function getComparedProperties(): ComparedProperty[] {
  return getFromStorage(STORAGE_KEYS.COMPARED_PROPERTIES, []);
}

export function addToComparison(propertyId: string): void {
  const compared = getComparedProperties();
  if (!compared.find(p => p.id === propertyId)) {
    const newCompared: ComparedProperty = {
      id: propertyId,
      addedAt: new Date().toISOString(),
    };
    // Limit to maximum 4 properties for comparison
    const updatedCompared = [...compared, newCompared].slice(-4);
    saveToStorage(STORAGE_KEYS.COMPARED_PROPERTIES, updatedCompared);
  }
}

export function removeFromComparison(propertyId: string): void {
  const compared = getComparedProperties();
  saveToStorage(STORAGE_KEYS.COMPARED_PROPERTIES, compared.filter(p => p.id !== propertyId));
}

export function clearComparison(): void {
  saveToStorage(STORAGE_KEYS.COMPARED_PROPERTIES, []);
}

export function isInComparison(propertyId: string): boolean {
  return getComparedProperties().some(p => p.id === propertyId);
}

// User Preferences
export interface UserPreferences {
  viewMode: 'list' | 'map';
  currency: 'INR';
  language: 'en-IN';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export function getUserPreferences(): UserPreferences {
  return getFromStorage(STORAGE_KEYS.USER_PREFERENCES, {
    viewMode: 'list',
    currency: 'INR',
    language: 'en-IN',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  });
}

export function saveUserPreferences(preferences: Partial<UserPreferences>): void {
  const current = getUserPreferences();
  saveToStorage(STORAGE_KEYS.USER_PREFERENCES, { ...current, ...preferences });
}

// Recent Searches
export function getRecentSearches(): string[] {
  return getFromStorage(STORAGE_KEYS.RECENT_SEARCHES, []);
}

export function addRecentSearch(query: string): void {
  const recent = getRecentSearches();
  const updated = [query, ...recent.filter(q => q !== query)].slice(0, 10);
  saveToStorage(STORAGE_KEYS.RECENT_SEARCHES, updated);
}