import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import { CoffeeEntry } from '../types';
import { CoffeeColors, CoffeeTypography, CoffeeStyles } from '../../constants/CoffeeTheme';

interface EntryCardProps {
  entry: CoffeeEntry;
  onPress?: () => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onPress }) => {
  const formatExtractionSteps = (steps: CoffeeEntry['extractionSteps']) => {
    if (!steps || steps.length === 0) return 'データなし';
    return steps.map((step) => `${step.time}秒: ${step.grams}g`).join(' → ');
  };

  const renderTasteStars = (rating: number) => {
    return '●'.repeat(rating) + '○'.repeat(5 - rating);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* ヘッダー部分 */}
      <View style={styles.cardHeader}>
        <View style={styles.beanIconContainer}>
          <Text style={styles.beanIcon}>🌱</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.beanType}>{entry.beanType}</Text>
          <Text style={styles.dateText}>{new Date(entry.date).toLocaleDateString('ja-JP')}</Text>
        </View>
        <Text style={styles.brewIcon}>☕</Text>
      </View>

      {/* 抽出情報 */}
      <View style={styles.extractionInfo}>
        <Text style={styles.sectionLabel}>抽出データ</Text>
        <View style={styles.divider} />
        <Text style={styles.extractionSteps}>{formatExtractionSteps(entry.extractionSteps)}</Text>
        <View style={styles.parameterRow}>
          <View style={styles.parameter}>
            <Text style={styles.parameterLabel}>温度</Text>
            <Text style={styles.parameterValue}>{entry.temperature}℃</Text>
          </View>
          <View style={styles.parameter}>
            <Text style={styles.parameterLabel}>比率</Text>
            <Text style={styles.parameterValue}>{entry.ratio}</Text>
          </View>
        </View>
      </View>

      {/* 味覚情報 */}
      <View style={styles.tasteSection}>
        <Text style={styles.sectionLabel}>味覚プロフィール</Text>
        <View style={styles.divider} />
        <View style={styles.tasteGrid}>
          <View style={styles.tasteItem}>
            <Text style={styles.tasteLabel}>酸味</Text>
            <Text style={styles.tasteStars}>{renderTasteStars(entry.taste.acidity)}</Text>
          </View>
          <View style={styles.tasteItem}>
            <Text style={styles.tasteLabel}>甘み</Text>
            <Text style={styles.tasteStars}>{renderTasteStars(entry.taste.sweetness)}</Text>
          </View>
          <View style={styles.tasteItem}>
            <Text style={styles.tasteLabel}>苦味</Text>
            <Text style={styles.tasteStars}>{renderTasteStars(entry.taste.bitterness)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...CoffeeStyles.card,
    marginVertical: 12,
    marginHorizontal: 4,
    padding: 16,
  },

  // ヘッダー部分
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: CoffeeColors.border,
  },
  beanIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CoffeeColors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  beanIcon: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  beanType: {
    ...CoffeeTypography.headerSmall,
    marginBottom: 4,
  },
  dateText: {
    ...CoffeeTypography.bodySmall,
    color: CoffeeColors.textLight,
  },
  brewIcon: {
    fontSize: 24,
    color: CoffeeColors.accent,
  },

  // 抽出情報
  extractionInfo: {
    marginBottom: 16,
  },
  sectionLabel: {
    ...CoffeeTypography.caption,
    marginBottom: 8,
    color: CoffeeColors.primary,
  },
  divider: {
    width: 30,
    height: 1,
    backgroundColor: CoffeeColors.accent,
    marginBottom: 12,
  },
  extractionSteps: {
    ...CoffeeTypography.bodyMedium,
    fontFamily: 'monospace',
    backgroundColor: CoffeeColors.overlayDark,
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  parameterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  parameter: {
    alignItems: 'center',
  },
  parameterLabel: {
    ...CoffeeTypography.bodySmall,
    color: CoffeeColors.textLight,
    marginBottom: 4,
  },
  parameterValue: {
    ...CoffeeTypography.bodyLarge,
    fontWeight: '600',
    color: CoffeeColors.primary,
  },

  // 味覚セクション
  tasteSection: {
    marginTop: 8,
  },
  tasteGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tasteItem: {
    flex: 1,
    alignItems: 'center',
  },
  tasteLabel: {
    ...CoffeeTypography.bodySmall,
    color: CoffeeColors.textSecondary,
    marginBottom: 6,
  },
  tasteStars: {
    ...CoffeeTypography.bodyMedium,
    fontFamily: 'monospace',
    color: CoffeeColors.accent,
    letterSpacing: 2,
  },
});