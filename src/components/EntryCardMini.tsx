import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { Card, Title, Paragraph, Text, IconButton } from 'react-native-paper';
import { CoffeeEntry } from '../types';
import { CoffeeColors, CoffeeTypography, CoffeeStyles } from '../../constants/CoffeeTheme';
import { CoffeeIcons } from '../../constants/CoffeeIcons';

interface EntryCardProps {
  entry: CoffeeEntry;
  onPress?: () => void;
}

export const EntryCardMini: React.FC<EntryCardProps> = ({ entry, onPress }) => {
  const renderTasteStars = (rating: number) => {
    return '●'.repeat(rating) + '○'.repeat(5 - rating);
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={handleCardPress}>
        <View className="flex flex-row mb-2 pb-2" style={styles.cardHeader}>
          <View style={styles.beanIconContainer}>
            <Text style={styles.beanIcon}>{CoffeeIcons.coffeeBean}</Text>
          </View>
          <View className="flex flex-row items-center justify-between flex-1">
            <Text style={styles.beanType}>{entry.beanType}</Text>
            <Text style={styles.dateText}>{new Date(entry.date).toLocaleDateString('ja-JP')}</Text>
          </View>
        </View>
        {/* 味覚情報 */}
        <View style={styles.tasteSection}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 6,
    marginHorizontal: 4,
  },
  card: {
    ...CoffeeStyles.card,
    marginVertical: 0,
    marginHorizontal: 0,
    padding: 16,
  },

  // ヘッダー部分
  cardHeader: {
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

  beanType: {
    ...CoffeeTypography.headerSmall,
    marginBottom: 4,
  },
  dateText: {
    ...CoffeeTypography.bodySmall,
    color: CoffeeColors.textLight,
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
