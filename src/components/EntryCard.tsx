import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { CoffeeEntry } from '../types';
import { CoffeeColors, CoffeeTypography, CoffeeStyles } from '../../constants/CoffeeTheme';
import { CoffeeIcons } from '../../constants/CoffeeIcons';
import { Svg, Polygon, Text as SvgText } from 'react-native-svg';

interface EntryCardProps {
  entry: CoffeeEntry;
  onPress?: () => void;
  onEdit?: (entryId: string) => void;
  onDelete?: (entryId: string) => void;
  expandable?: boolean;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onEdit }) => {
  const renderTastePentagon = () => {
    const { acidity, sweetness, bitterness, aroma, overall } = entry.taste;
    const center = { x: 50, y: 65 };
    const radius = 45;
    const maxValue = 5;

    // 五角形の頂点を計算（上から時計回り）
    const getPoint = (index: number, value: number) => {
      const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2; // 上から開始
      const normalizedValue = (value / maxValue) * radius;
      return {
        x: center.x + Math.cos(angle) * normalizedValue,
        y: center.y + Math.sin(angle) * normalizedValue,
      };
    };

    // ラベル用の外側の点を計算
    const getLabelPoint = (index: number) => {
      const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
      const labelRadius = radius + 8;
      return {
        x: center.x + Math.cos(angle) * labelRadius,
        y: center.y + Math.sin(angle) * labelRadius,
      };
    };

    // 各味覚の値に基づいて点を計算
    const points = [
      getPoint(0, overall || 3), // 美味しさ（上）
      getPoint(1, sweetness), // 甘み（右上）
      getPoint(2, bitterness), // 苦味（右下）
      getPoint(3, acidity), // 酸味（左下）
      getPoint(4, aroma), // 香り（左上）
    ];

    // ラベルの位置
    const labelPoints = [
      getLabelPoint(0), // 美味しさ
      getLabelPoint(1), // 甘み
      getLabelPoint(2), // 苦味
      getLabelPoint(3), // 酸味
      getLabelPoint(4), // 香り
    ];

    const labels = ['美味', '甘', '苦', '酸', '香'];

    const pointsString = points.map((p) => `${p.x},${p.y}`).join(' ');

    return (
      <Svg width="120" height="120" viewBox="0 0 100 120">
        {/* レベルごとのメモリ線（1-5） */}
        {[1, 2, 3, 4, 5].map((level) => {
          const levelPoints = [
            getPoint(0, level),
            getPoint(1, level),
            getPoint(2, level),
            getPoint(3, level),
            getPoint(4, level),
          ];
          const levelPointsString = levelPoints.map((p) => `${p.x},${p.y}`).join(' ');

          return (
            <Polygon
              key={level}
              points={levelPointsString}
              fill="none"
              stroke={level === 5 ? CoffeeColors.accentLight : CoffeeColors.textLight}
              strokeWidth={level === 5 ? '1.7' : '0.8'}
              strokeDasharray={level === 5 ? '3,2' : 'none'}
              opacity={level === 5 ? 1 : 0.3}
            />
          );
        })}
        {/* 実際の味覚データ */}
        <Polygon
          points={pointsString}
          fill={CoffeeColors.accent}
          fillOpacity="0.55"
          stroke={CoffeeColors.accent}
          strokeWidth="1.5"
        />
        {/* ラベル */}
        {labelPoints.map((point, index) => (
          <SvgText
            key={index}
            x={point.x}
            y={point.y}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="9"
            fill={CoffeeColors.textSecondary}
            fontWeight="500">
            {labels[index]}
          </SvgText>
        ))}
      </Svg>
    );
  };

  const handleCardPress = () => {
    if (onEdit) {
      onEdit(entry.id);
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
          <View className="pr-1" style={styles.headerInfo}>
            <Text style={styles.beanType}>{entry.beanType}</Text>
            <Text style={styles.dateText}>{new Date(entry.date).toLocaleDateString('ja-JP')}</Text>
          </View>
          {renderTastePentagon()}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
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
});
