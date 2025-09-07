import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { CoffeeEntry } from '../types';
import { useEntries } from '../hooks/useEntries';
import { EntryForm } from '../components/EntryForm';
import { CoffeeColors, CoffeeTypography } from '../../constants/CoffeeTheme';

export const NewEntryScreen: React.FC = () => {
  const router = useRouter();
  const { saveEntry } = useEntries();

  const handleSubmit = async (entry: Omit<CoffeeEntry, 'id'>) => {
    await saveEntry(entry);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color={CoffeeColors.surface} />
        <Appbar.Content title="新規記録" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      <View style={styles.content}>
        <EntryForm onSubmit={handleSubmit} submitLabel="記録する" />
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

