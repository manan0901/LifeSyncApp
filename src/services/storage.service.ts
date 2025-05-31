// Storage service for handling local data persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Service for handling local data persistence
 * This is a wrapper around AsyncStorage with type safety
 */
class StorageService {
  /**
   * Save data to storage
   * @param key Storage key
   * @param value Data to store (will be JSON stringified)
   */
  async saveData<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error('Error saving data', e);
      throw e;
    }
  }

  /**
   * Load data from storage
   * @param key Storage key
   * @returns The stored data or null if not found
   */
  async loadData<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) as T : null;
    } catch (e) {
      console.error('Error loading data', e);
      throw e;
    }
  }

  /**
   * Remove data from storage
   * @param key Storage key
   */
  async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing data', e);
      throw e;
    }
  }

  /**
   * Clear all app data from storage
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Error clearing storage', e);
      throw e;
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();
