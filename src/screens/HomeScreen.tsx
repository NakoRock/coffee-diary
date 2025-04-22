import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useEntries } from '../hooks/useEntries';
import { EntryCard } from '../components/EntryCard';

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { entries } = useEntries();

  const recentEntries = entries.slice(0, 3);

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text style={styles.headerText}>コーヒー日記</Text>
          <Text style={styles.subHeaderText}>記録件数: {entries.length}件</Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => router.push('/newEntry')} style={styles.button}>
          新規記録
        </Button>
        <Button mode="outlined" onPress={() => router.push('/entryList')} style={styles.button}>
          記録一覧
        </Button>
      </View>

      {recentEntries.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>最近の記録</Text>
          {recentEntries.map(entry => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onPress={() => router.push(`/entryDetail/${entry.id}`)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  recentSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
