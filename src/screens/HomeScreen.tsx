import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEntries } from '../hooks/useEntries';
import { EntryCard } from '../components/EntryCard';
import { CoffeeColors, CoffeeTypography, CoffeeStyles } from '../../constants/CoffeeTheme';

const { height } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { entries } = useEntries();

  const recentEntries = entries.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* 背景画像セクション（タイトル上部のみ） */}
      <View style={[styles.backgroundSection, {height: height * 0.5}]}>
        <ImageBackground
          source={require('../../assets/images/main.png')}
          style={styles.backgroundImage}
          resizeMode="cover">
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 248, 220, 0.6)',
              'rgba(255, 248, 220, 0.9)',
              '#FFF8DC',
            ]}
            style={[styles.gradient, {bottom: (height * 0.5 - height * 0.2) * -1, height: height * 0.2}]}
          />
        </ImageBackground>
      </View>

      {/* 固定ヘッダーセクション */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>コーヒー日記</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsEmoji}>☕</Text>
            <Text style={styles.statsText}>記録件数：{entries.length}件</Text>
          </View>
          <Text style={styles.subtitle}>今日も素敵なコーヒータイムを</Text>
        </View>
      </View>

      {/* メインコンテンツセクション */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 最近の記録 */}
        {recentEntries.length > 0 && (
          <View style={styles.recentEntriesContainer}>
            <Text style={styles.recentEntriesTitle}>最近の記録</Text>
            {recentEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onPress={() => router.push(`/entryDetail/${entry.id}`)}
              />
            ))}
          </View>
        )}

        {/* 下部スペーサー（ボタン用の余白） */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 固定ボタンセクション（画面下部） */}
      <View style={styles.fixedButtons}>
        {/* メインボタンセクション */}
        <View style={styles.mainButtonsRow}>
          <TouchableOpacity
            style={styles.newEntryButton}
            onPress={() => router.push('/newEntry')}>
            <Text style={styles.buttonEmoji}>📝</Text>
            <Text style={styles.newEntryButtonTitle}>新規記録</Text>
            <Text style={styles.newEntryButtonSubtitle}>今日の一杯を記録する</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.entryListButton}
            onPress={() => router.push('/entryList')}>
            <Text style={styles.buttonEmoji}>📚</Text>
            <Text style={styles.entryListButtonTitle}>記録一覧</Text>
            <Text style={styles.entryListButtonSubtitle}>過去の記録を見る</Text>
          </TouchableOpacity>
        </View>

        {/* 抽出機能ボタン */}
        <TouchableOpacity
          style={styles.extractionButton}
          onPress={() => router.push('/extraction')}>
          <Text style={styles.extractionButtonEmoji}>⏱️</Text>
          <Text style={styles.extractionButtonText}>抽出機能</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  backgroundSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
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
  headerContent: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3C2415',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#3C2415',
  },
  subtitle: {
    fontSize: 14,
    fontStyle: 'italic',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    color: '#3C2415',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 280,
    paddingBottom: 200,
  },
  recentEntriesContainer: {
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  recentEntriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#6B4423',
  },
  bottomSpacer: {
    height: 50,
  },
  fixedButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    backgroundColor: '#FFF8DC',
    borderTopColor: 'rgba(139, 69, 19, 0.1)',
    zIndex: 3,
  },
  mainButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  newEntryButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#6B4423',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  entryListButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#D2B48C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  newEntryButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  newEntryButtonSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#8B4513',
  },
  entryListButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#6B4423',
  },
  entryListButtonSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#8B4513',
  },
  extractionButton: {
    marginHorizontal: 20,
    marginBottom: 28,
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5DEB3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  extractionButtonEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  extractionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B4423',
  },
});

