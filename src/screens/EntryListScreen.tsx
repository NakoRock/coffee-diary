import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Searchbar, Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useEntries } from '../hooks/useEntries';
import { EntryCard } from '../components/EntryCard';
import { CoffeeColors, CoffeeTypography } from '../../constants/CoffeeTheme';

export const EntryListScreen: React.FC = () => {
  const router = useRouter();
  const { entries, deleteEntry, loadEntries } = useEntries();
  const [searchQuery, setSearchQuery] = useState('');

  // 画面がフォーカスされた時にエントリ一覧を再読み込み
  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries]),
  );

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter((entry) => entry.beanType.toLowerCase().includes(query));
  }, [entries, searchQuery]);

  const handleEdit = (entryId: string) => {
    router.push(`/editEntry/${entryId}`);
  };

  const handleDelete = (entryId: string) => {
    Alert.alert('記録を削除', 'この記録を削除しますか？この操作は元に戻せません。', [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          deleteEntry(entryId);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color={CoffeeColors.surface} />
        <Appbar.Content title="記録一覧" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      <View style={styles.content}>
        <Searchbar
          placeholder="豆の種類で検索"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <ScrollView style={styles.scrollView}>
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
              expandable={true}
            />
          ))}
        </ScrollView>
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
  searchbar: {
    margin: 16,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
});
