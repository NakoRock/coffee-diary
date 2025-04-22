import { useState, useCallback, useEffect } from 'react';
import { CoffeeEntry } from '../types';
import { storageService } from '../services/storage';

export const useEntries = () => {
  const [entries, setEntries] = useState<CoffeeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const loadedEntries = await storageService.getEntries();
      setEntries(loadedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const saveEntry = async (entry: Omit<CoffeeEntry, 'id'>) => {
    const newEntry: CoffeeEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    await storageService.saveEntry(newEntry);
    await loadEntries();
    return newEntry;
  };

  const updateEntry = async (entry: CoffeeEntry) => {
    await storageService.updateEntry(entry);
    await loadEntries();
  };

  const deleteEntry = async (id: string) => {
    await storageService.deleteEntry(id);
    await loadEntries();
  };

  const getEntry = async (id: string): Promise<CoffeeEntry | null> => {
    return await storageService.getEntry(id);
  };

  return {
    entries,
    loading,
    saveEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    loadEntries,
  };
};
