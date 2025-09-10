import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useEntries } from '../hooks/useEntries';
import { useStats } from '../hooks/useStats';
import { EntryCard } from '../components/EntryCard';
import { DashboardWidget } from '../components/DashboardWidget';
import { CoffeeColors, CoffeeTypography, CoffeeStyles } from '../../constants/CoffeeTheme';
import { CoffeeAssets } from '../../constants/CoffeeIcons';

const { height } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { entries, loadEntries } = useEntries();
  const stats = useStats(entries);

  // 動的スクロール制御用のstate
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleEdit = (entryId: string) => {
    router.push(`/editEntry/${entryId}`);
  };

  // コンテンツサイズ変更時の処理
  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
  };

  // ScrollViewレイアウト変更時の処理
  const handleScrollViewLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };

  // スクロール有効/無効の制御
  useEffect(() => {
    setScrollEnabled(contentHeight > containerHeight);
  }, [contentHeight, containerHeight]);

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [loadEntries]),
  );

  const recentEntries = entries.slice(0, 1);

  return (
    <View className="flex-1" style={styles.container}>
      {/* 背景画像セクション */}
      <View style={styles.backgroundSection}>
        <ImageBackground
          source={require('../../assets/images/main.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>

      {/* スクロール可能なコンテンツ */}
      <ScrollView
        style={styles.scrollView}
        className="pt-10"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleScrollViewLayout}>
        {/* ダッシュボード統計 */}
        <View style={styles.dashboardContainer}>
          <View style={styles.statsGrid}>
            <DashboardWidget
              title="今週の杯数"
              value={`${stats.weeklyCount}杯`}
              icon="coffee"
              color={CoffeeColors.accent}
            />
          </View>

          {/* メインボタンセクション */}
          <View style={styles.buttonsContainer}>
            <View className="flex-row justify-center">
              <TouchableOpacity
                style={styles.extractionCard}
                className="flex-1 mr-2"
                onPress={() => router.push('/newEntry')}>
                <Image
                  source={CoffeeAssets.pen}
                  style={[styles.buttonEmoji, { width: 50, height: 50 }]}
                  resizeMode="contain"
                />
                <Text style={styles.extractionCardTitle}>新規記録</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 flex items-center"
                style={styles.entryListCard}
                onPress={() => router.push('/entryList')}>
                <Image
                  source={CoffeeAssets.note}
                  style={[styles.buttonEmoji, { width: 50, height: 50 }]}
                  resizeMode="contain"
                />
                <Text style={styles.entryListCardTitle}>記録一覧</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.extractionCard}
              className="mt-4"
              onPress={() => router.push('/extraction')}>
              <Image
                source={CoffeeAssets.extraction}
                style={[styles.buttonEmoji, { width: 65, height: 65 }]}
                resizeMode="contain"
              />
              <Text style={styles.extractionCardTitle}>抽出する</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 直近の記録セクション */}
        <View style={styles.recentEntriesSection}>
          <Text style={styles.recentEntriesTitle}>直近の記録</Text>
          <View style={styles.recentEntriesList}>
            {recentEntries.length > 0 && (
              <View>
                {recentEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} onEdit={handleEdit} />
                ))}
              </View>
            )}
            {recentEntries.length === 0 && (
              <Text className="mx-auto pb-3" style={CoffeeTypography.bodyMedium}>
                まだ記録がありません
              </Text>
            )}
          </View>
        </View>

        {/* 下部余白 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CoffeeColors.background,
  },
  backgroundSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    zIndex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  statsEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  statsText: {
    ...CoffeeTypography.bodyLarge,
    fontWeight: '600',
  },
  recentEntriesTitle: {
    ...CoffeeTypography.headerMedium,
    textAlign: 'center',
    marginBottom: 16,
  },
  // ダッシュボードスタイル
  dashboardContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
    ...CoffeeStyles.glassCard,
    padding: 20,
  },
  dashboardTitle: {
    ...CoffeeTypography.headerMedium,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  // ボタンコンテナ
  buttonsContainer: {
    paddingHorizontal: 8,
  },
  // 直近記録セクション
  recentEntriesSection: {
    marginHorizontal: 10,
    marginBottom: 16,
    ...CoffeeStyles.glassCard,
    padding: 16,
  },
  recentEntriesList: {
    gap: 8,
  },
  bottomSpacer: {
    height: 50,
  },
  entryListCard: {
    ...CoffeeStyles.card,
    paddingVertical: 20,
    backgroundColor: CoffeeColors.accentLight,
  },
  buttonEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  newEntryCardTitle: {
    ...CoffeeTypography.headerSmall,
    fontSize: 16,
    marginBottom: 4,
    color: '#FFFFFF',
  },
  entryListCardTitle: {
    ...CoffeeTypography.headerSmall,
    fontSize: 16,
    marginBottom: 4,
    color: CoffeeColors.primary,
  },
  extractionCard: {
    ...CoffeeStyles.card,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: CoffeeColors.gradientMid,
  },
  extractionCardTitle: {
    ...CoffeeTypography.headerSmall,
    fontSize: 16,
    marginBottom: 4,
    color: CoffeeColors.primary,
  },
});
