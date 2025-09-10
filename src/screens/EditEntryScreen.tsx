import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CoffeeEntry } from '../types';
import { useEntries } from '../hooks/useEntries';
import { EntryForm } from '../components/EntryForm';
import { CoffeeColors, CoffeeTypography } from '../../constants/CoffeeTheme';

export const EditEntryScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getEntry, updateEntry, deleteEntry } = useEntries();
  const [entry, setEntry] = useState<CoffeeEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    loadEntry();
  }, []);

  const loadEntry = async () => {
    const loadedEntry = await getEntry(id as string);
    setEntry(loadedEntry);
  };

  const [currentFormData, setCurrentFormData] = useState<Omit<CoffeeEntry, 'id'> | null>(null);

  const handleFormSubmit = async (updatedEntry: Omit<CoffeeEntry, 'id'>) => {
    if (entry) {
      await updateEntry({
        ...updatedEntry,
        id: entry.id,
      });
      setIsEditing(false);
      await loadEntry();
    }
  };

  const handleSave = async () => {
    if (currentFormData) {
      await handleFormSubmit(currentFormData);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    Alert.alert('削除の確認', 'この記録を削除しますか？この操作は取り消せません。', [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          if (entry) {
            await deleteEntry(entry.id);
            router.push('/entryList');
          }
        },
      },
    ]);
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
        <Appbar.Content
          title={isEditing ? '記録編集' : '記録確認'}
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>
      <View style={styles.content}>
        <EntryForm
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          submitLabel="保存"
          readonly={!isEditing}
          hideSubmitButton={isEditing}
          onValidityChange={setIsFormValid}
          onFormDataChange={setCurrentFormData}
        />
        {!isEditing ? (
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleEdit} style={styles.editButton}>
              編集
            </Button>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSave}
              disabled={!isFormValid}
              style={styles.saveButton}>
              保存
            </Button>
            <Button
              mode="outlined"
              onPress={handleDelete}
              style={styles.deleteButton}
              textColor={CoffeeColors.error}>
              削除
            </Button>
          </View>
        )}
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
  buttonContainer: {
    padding: 16,
    paddingTop: 4,
  },
  editButton: {
    marginBottom: 8,
  },
  saveButton: {
    marginBottom: 8,
  },
  deleteButton: {
    borderColor: CoffeeColors.error,
  },
});
