import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CoffeeEntry } from '../types';
import { useEntries } from '../hooks/useEntries';
import { EntryForm } from '../components/EntryForm';

export const NewEntryScreen: React.FC = () => {
  const router = useRouter();
  const { saveEntry } = useEntries();

  const handleSubmit = async (entry: Omit<CoffeeEntry, 'id'>) => {
    await saveEntry(entry);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <EntryForm onSubmit={handleSubmit} submitLabel="記録する" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
