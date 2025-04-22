import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useEntries } from '../hooks/useEntries';
import { EntryCard } from '../components/EntryCard';

export const EntryListScreen: React.FC = () => {
  const router = useRouter();
  const { entries } = useEntries();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter((entry) => entry.beanType.toLowerCase().includes(query));
  }, [entries, searchQuery]);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="豆の種類で検索"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <ScrollView style={styles.list}>
        {filteredEntries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onPress={() => router.push(`/entryDetail/${entry.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    margin: 16,
    elevation: 4,
  },
  list: {
    flex: 1,
  },
});
