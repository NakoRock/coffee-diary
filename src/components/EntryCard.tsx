import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { CoffeeEntry } from '../types';

interface EntryCardProps {
  entry: CoffeeEntry;
  onPress?: () => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onPress }) => {
  const formatExtractionSteps = (steps: CoffeeEntry['extractionSteps']) => {
    if (!steps || steps.length === 0) return 'データなし';
    return steps.map((step) => `${step.time}秒: ${step.grams}g`).join(' → ');
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <Title>{entry.beanType}</Title>
        <Paragraph>{new Date(entry.date).toLocaleDateString('ja-JP')}</Paragraph>
        <Paragraph>抽出ステップ: {formatExtractionSteps(entry.extractionSteps)}</Paragraph>
        <Paragraph>
          温度: {entry.temperature}℃ / 比率: {entry.ratio}
        </Paragraph>
        <Paragraph style={styles.tasteInfo}>
          酸味: {'★'.repeat(entry.taste.acidity)}
          {'☆'.repeat(5 - entry.taste.acidity)}
          {'\n'}
          甘み: {'★'.repeat(entry.taste.sweetness)}
          {'☆'.repeat(5 - entry.taste.sweetness)}
          {'\n'}
          苦味: {'★'.repeat(entry.taste.bitterness)}
          {'☆'.repeat(5 - entry.taste.bitterness)}
        </Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
  },
  tasteInfo: {
    marginTop: 8,
    fontFamily: 'monospace',
  },
});
