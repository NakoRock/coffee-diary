import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Dialog, Portal } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CoffeeEntry } from '../types';
import { useEntries } from '../hooks/useEntries';

export const EntryDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getEntry, deleteEntry } = useEntries();
  const [entry, setEntry] = useState<CoffeeEntry | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  useEffect(() => {
    loadEntry();
  }, []);

  const loadEntry = async () => {
    const loadedEntry = await getEntry(id as string);
    setEntry(loadedEntry);
  };

  const handleDelete = async () => {
    if (entry) {
      setDeleteDialogVisible(false); // 先にダイアログを閉じる
      await deleteEntry(entry.id);
      router.push('/');
    }
  };

  if (!entry) {
    return null;
  }

  const formatExtractionSteps = (steps: CoffeeEntry['extractionSteps']) => {
    if (!steps || steps.length === 0) {
      return [
        <View key="no-data" style={styles.stepItem}>
          <Text style={styles.stepDetail}>データなし</Text>
        </View>,
      ];
    }
    return steps.map((step, index) => (
      <View key={index} style={styles.stepItem}>
        <Text style={styles.stepNumber}>ステップ {index + 1}</Text>
        <Text style={styles.stepDetail}>時間: {step.time}秒</Text>
        <Text style={styles.stepDetail}>注水量: {step.grams}g</Text>
        {index < steps.length - 1 && (
          <Text style={styles.totalGrams}>
            累計: {steps.slice(0, index + 1).reduce((sum, s) => sum + s.grams, 0)}g
          </Text>
        )}
      </View>
    ));
  };

  const totalGrams = entry.extractionSteps?.reduce((sum, step) => sum + step.grams, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>豆の種類</Text>
        <Text style={styles.value}>{entry.beanType}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>記録日</Text>
        <Text style={styles.value}>{new Date(entry.date).toLocaleDateString('ja-JP')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>抽出ステップ</Text>
        <View style={styles.stepsContainer}>{formatExtractionSteps(entry.extractionSteps)}</View>
        <Text style={styles.totalGrams}>総注水量: {totalGrams}g</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>温度</Text>
        <Text style={styles.value}>{entry.temperature}℃</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>比率</Text>
        <Text style={styles.value}>{entry.ratio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>味の評価</Text>
        <Text style={styles.value}>
          酸味: {'★'.repeat(entry.taste.acidity)}
          {'☆'.repeat(5 - entry.taste.acidity)}
        </Text>
        <Text style={styles.value}>
          甘み: {'★'.repeat(entry.taste.sweetness)}
          {'☆'.repeat(5 - entry.taste.sweetness)}
        </Text>
        <Text style={styles.value}>
          苦味: {'★'.repeat(entry.taste.bitterness)}
          {'☆'.repeat(5 - entry.taste.bitterness)}
        </Text>
      </View>

      {entry.notes && (
        <View style={styles.section}>
          <Text style={styles.label}>メモ</Text>
          <Text style={styles.value}>{entry.notes}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => router.push(`/editEntry/${entry.id}`)}
          style={styles.button}
        >
          編集
        </Button>
        <Button
          mode="outlined"
          onPress={() => setDeleteDialogVisible(true)}
          style={[styles.button, styles.deleteButton]}
          textColor="red"
        >
          削除
        </Button>
      </View>

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>削除の確認</Dialog.Title>
          <Dialog.Content>
            <Text>この記録を削除してもよろしいですか？</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>キャンセル</Button>
            <Button onPress={handleDelete} textColor="red">
              削除
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 4,
  },
  stepsContainer: {
    marginTop: 8,
  },
  stepItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stepDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
  totalGrams: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  deleteButton: {
    borderColor: 'red',
  },
});
