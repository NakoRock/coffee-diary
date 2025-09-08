import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CoffeeEntry } from '../types';
import { useEntries } from '../hooks/useEntries';
import { EntryForm } from '../components/EntryForm';
import { CoffeeColors, CoffeeTypography } from '../../constants/CoffeeTheme';

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
    beanAmount: entry.beanAmount,
    waterAmount: entry.waterAmount,
    taste: entry.taste,
    notes: entry.notes,
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color={CoffeeColors.surface} />
        <Appbar.Content title="記録編集" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      <View style={styles.content}>
        <EntryForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="更新" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CoffeeColors.surface,
  },
  header: {
    backgroundColor: CoffeeColors.primary,
    elevation: 4,
  },
  headerTitle: {
    ...CoffeeTypography.headerMedium,
    color: CoffeeColors.surface,
  },
  content: {
    flex: 1,
  },
});
