import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
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

  const handleEdit = (entryId: string) => {
    router.push(`/editEntry/${entryId}`);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [loadEntries]),
  );

  const recentEntries = entries.slice(0, 1);

  return (
    <View className="flex-1" style={styles.container}>
      {/* 背景画像セクション（タイトル上部のみ） */}
      <View style={[styles.backgroundSection, { height: height }]}>
        <ImageBackground
          source={require('../../assets/images/main.jpg')}
          className="flex-1"
          style={styles.backgroundImage}></ImageBackground>
      </View>

      {/* 固定ヘッダーセクション */}
      <View className="flex-col justify-end mt-2" style={styles.fixedHeader}>
        {/* ダッシュボード統計 */}
        <View className="" style={styles.dashboardContainer}>
          <View style={styles.statsGrid}>
            <DashboardWidget
              title="今週の杯数"
              value={`${stats.weeklyCount}杯`}
              icon="coffee"
              color={CoffeeColors.accent}
            />
          </View>

          {/* 固定ボタンセクション（画面下部） */}
          <View className="p-2" style={styles.fixedButtons}>
            {/* メインボタンセクション */}
            <View style={styles.mainCardsRow}>
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
                  className="flex-1"
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
                className="mt-4 "
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: CoffeeColors.background,
  },
  backgroundSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'relative',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    zIndex: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  statsEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  statsText: {
    ...CoffeeTypography.bodyLarge,
    fontWeight: '600',
  },
  scrollView: {
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 280,
    paddingBottom: 200,
  },
  recentEntriesContainer: {
    marginHorizontal: 10,
    ...CoffeeStyles.glassCard,
    padding: 20,
  },
  recentEntriesTitle: {
    ...CoffeeTypography.headerMedium,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardsContainer: {
    gap: 12,
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
  fixedButtons: {
    zIndex: 3,
  },
  mainCardsRow: {},
  entryListCard: {
    ...CoffeeStyles.card,
    paddingVertical: 20,

    alignItems: 'center',
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
  newEntryCardSubtitle: {
    ...CoffeeTypography.bodySmall,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  entryListCardTitle: {
    ...CoffeeTypography.headerSmall,
    fontSize: 16,
    marginBottom: 4,
    color: CoffeeColors.primary,
  },
  entryListCardSubtitle: {
    ...CoffeeTypography.bodySmall,
    textAlign: 'center',
    color: CoffeeColors.textSecondary,
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
  extractionCardSubtitle: {
    ...CoffeeTypography.bodySmall,
    textAlign: 'center',
    color: CoffeeColors.textSecondary,
  },
  // FAB スタイル
  fabContainer: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    zIndex: 10,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: CoffeeColors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    position: 'absolute',
  },
});
