import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CoffeeEntry } from '../types';
import { useEntries } from '../hooks/useEntries';
import { EntryForm } from '../components/EntryForm';
import { CoffeeColors, CoffeeTypography } from '../../constants/CoffeeTheme';

export const NewEntryScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { saveEntry } = useEntries();

  // ExtractionScreenからのデータを解析
  const getInitialValues = (): Omit<CoffeeEntry, 'id'> | undefined => {
    try {
      if (params.extractionData) {
        const data = JSON.parse(params.extractionData as string);
        return {
          date: data.date || new Date().toISOString(),
          beanType: data.beanType || '',
          extractionSteps: data.extractionSteps || [],
          temperature: data.temperature || 0,
          beanAmount: data.beanAmount || 0,
          waterAmount: data.waterAmount || 0,
          extractionEndTime: data.extractionEndTime,
          taste: {
            acidity: 3,
            sweetness: 3,
            bitterness: 3,
            aroma: 3,
            overall: 3,
          },
          notes: '',
        };
      }
    } catch (error) {
      console.error('抽出データの解析に失敗しました:', error);
    }
    return undefined;
  };

  const initialValues = getInitialValues();

  const handleSubmit = async (entry: Omit<CoffeeEntry, 'id'>) => {
    await saveEntry(entry);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.push('/')} color={CoffeeColors.surface} />
        <Appbar.Content title="新規記録" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      <View style={styles.content}>
        <EntryForm
          onSubmit={handleSubmit}
          submitLabel="記録する"
          newEntry={true}
          initialValues={initialValues}
        />
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
