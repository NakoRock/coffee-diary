import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { Card, Title, Paragraph, Text, IconButton } from 'react-native-paper';
import { CoffeeEntry } from '../types';
import { CoffeeColors, CoffeeTypography, CoffeeStyles } from '../../constants/CoffeeTheme';
import { CoffeeIcons } from '../../constants/CoffeeIcons';

interface EntryCardProps {
  entry: CoffeeEntry;
  onPress?: () => void;
  onEdit?: (entryId: string) => void;
  onDelete?: (entryId: string) => void;
  expandable?: boolean;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onPress,
  onEdit,
  onDelete,
  expandable = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const formatExtractionSteps = (steps: CoffeeEntry['extractionSteps']) => {
    if (!steps || steps.length === 0) return 'データなし';
    return steps.map((step) => `${step.time}秒: ${step.grams}g`).join(' → ');
  };

  const renderTasteStars = (rating: number) => {
    return '●'.repeat(rating) + '○'.repeat(5 - rating);
  };

  const toggleExpansion = () => {
    if (!expandable) return;

    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(entry.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(entry.id);
    }
  };

  const renderExpandedContent = () => {
    const animatedHeight = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100],
    });

    const opacity = animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
    });

    return (
      <Animated.View style={[styles.expandedContent, { height: animatedHeight }]}>
        <Animated.View style={[styles.expandedInner, { opacity }]}>
          {/* メモセクション */}
          <View style={styles.noteSection}>
            <Text style={styles.sectionLabel}>メモ</Text>
            <View style={styles.divider} />
            <Text style={styles.noteText}>{entry.notes || '記録なし'}</Text>
          </View>

          {/* アクションボタン */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <Text style={styles.actionIcon}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <Text style={styles.actionIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  const handleCardPress = () => {
    if (expandable) {
      toggleExpansion();
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={handleCardPress}>
        {/* ヘッダー部分 */}
        <View style={styles.cardHeader}>
          <View style={styles.beanIconContainer}>
            <Text style={styles.beanIcon}>{CoffeeIcons.coffeeBean}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.beanType}>{entry.beanType}</Text>
            <Text style={styles.dateText}>{new Date(entry.date).toLocaleDateString('ja-JP')}</Text>
          </View>
          <Text style={styles.brewIcon}>{CoffeeIcons.coffeeCup}</Text>
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
              <Text style={styles.parameterLabel}>豆の量</Text>
              <Text style={styles.parameterValue}>{entry.beanAmount}g</Text>
            </View>
            <View style={styles.parameter}>
              <Text style={styles.parameterLabel}>湯量</Text>
              <Text style={styles.parameterValue}>{entry.waterAmount}g</Text>
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
        {/* 展開コンテンツ */}
        {expandable && renderExpandedContent()}
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

  // 展開コンテンツ
  expandedContent: {
    backgroundColor: CoffeeColors.surface,
    marginHorizontal: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: CoffeeColors.border,
    overflow: 'hidden',
  },
  expandedInner: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  // メモセクション
  noteSection: {
    flex: 1,
    marginRight: 16,
  },
  noteText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.textSecondary,
    fontStyle: 'italic',
  },

  // アクションボタン
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CoffeeColors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: CoffeeColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  actionIcon: {
    fontSize: 18,
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
