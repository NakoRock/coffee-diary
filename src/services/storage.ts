import AsyncStorage from '@react-native-async-storage/async-storage';
import { CoffeeEntry } from '../types';

const STORAGE_KEY = 'coffee_entries';

export const storageService = {
  async saveEntry(entry: CoffeeEntry): Promise<void> {
    try {
      const entries = await this.getEntries();
      entries.push(entry);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entry:', error);
      throw error;
    }
  },

  async updateEntry(entry: CoffeeEntry): Promise<void> {
    try {
      const entries = await this.getEntries();
      const index = entries.findIndex(e => e.id === entry.id);
      if (index !== -1) {
        entries[index] = entry;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      }
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  },

  async deleteEntry(id: string): Promise<void> {
    try {
      const entries = await this.getEntries();
      const filteredEntries = entries.filter(entry => entry.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  },

  async getEntries(): Promise<CoffeeEntry[]> {
    try {
      const entriesJson = await AsyncStorage.getItem(STORAGE_KEY);
      return entriesJson ? JSON.parse(entriesJson) : [];
    } catch (error) {
      console.error('Error getting entries:', error);
      return [];
    }
  },

  async getEntry(id: string): Promise<CoffeeEntry | null> {
    try {
      const entries = await this.getEntries();
      return entries.find(entry => entry.id === id) || null;
    } catch (error) {
      console.error('Error getting entry:', error);
      return null;
    }
  }
};
