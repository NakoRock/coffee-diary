import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CoffeeEntry } from '../types';
import { useEntries } from '../hooks/useEntries';
import { EntryForm } from '../components/EntryForm';

export const EditEntryScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getEntry, updateEntry } = useEntries();
  const [entry, setEntry] = useState<CoffeeEntry | null>(null);

  useEffect(() => {
    loadEntry();
  }, []);

  const loadEntry = async () => {
    const loadedEntry = await getEntry(id as string);
    setEntry(loadedEntry);
  };

  const handleSubmit = async (updatedEntry: Omit<CoffeeEntry, 'id'>) => {
    if (entry) {
      await updateEntry({
        ...updatedEntry,
        id: entry.id,
      });
      router.push(`/entryDetail/${entry.id}`);
    }
  };

  if (!entry) {
    return null;
  }

  const initialValues: Omit<CoffeeEntry, 'id'> = {
    date: entry.date,
    beanType: entry.beanType,
    extractionSteps: entry.extractionSteps,
    temperature: entry.temperature,
    ratio: entry.ratio,
    taste: entry.taste,
    notes: entry.notes,
  };

  return (
    <View style={styles.container}>
      <EntryForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="更新" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
