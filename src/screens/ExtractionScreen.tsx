import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Text, Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { CoffeeColors, CoffeeTypography, CoffeeStyles } from '../../constants/CoffeeTheme';

export const ExtractionScreen: React.FC = () => {
  const router = useRouter();

  // タイマー関連のstate
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [laps, setLaps] = useState<{ time: number; waterAmount: number }[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentWaterAmount, setCurrentWaterAmount] = useState(0);
  const [recordStartTime, setRecordStartTime] = useState<number | null>(null);

  const WATER_MIN = 0;
  const WATER_MAX = 500;

  useEffect(() => {
    let interval: number;
    if (isTimerRunning && startTime) {
      interval = setInterval(() => {
        setCurrentTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, startTime]);

  const formatDigitalTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const startTimer = () => {
    const now = Date.now();
    setStartTime(now);
    setIsTimerRunning(true);
    setCurrentTime(0);
    setLaps([]);
    setRecordStartTime(null);
    setCurrentWaterAmount(0);
  };

  const recordLap = () => {
    if (!startTime) {
      return;
    }

    const now = Date.now();

    setLaps((prevLaps) => {
      if (recordStartTime && currentWaterAmount > 0) {
        const cumulativeTime = prevLaps.length === 0 ? 0 : recordStartTime - startTime;
        return [...prevLaps, { time: cumulativeTime, waterAmount: currentWaterAmount }];
      }
      return prevLaps;
    });

    if (!recordStartTime) {
      if (laps.length > 0) {
        setCurrentWaterAmount(laps[laps.length - 1].waterAmount);
      } else {
        setCurrentWaterAmount(0);
      }
    }

    setRecordStartTime(now);
  };

  const finishExtraction = () => {
    setIsTimerRunning(false);
    if (!startTime) {
      return;
    }

    const lapsIncludingPending =
      recordStartTime && currentWaterAmount > 0
        ? [
            ...laps,
            {
              time: laps.length === 0 ? 0 : recordStartTime - startTime,
              waterAmount: currentWaterAmount,
            },
          ]
        : laps;

    const totalWaterUsed = lapsIncludingPending.reduce((sum, lap) => sum + lap.waterAmount, 0);

    // laps配列をCoffeeEntry.extractionStepsフォーマットに変換
    const extractionSteps = lapsIncludingPending.map((lap) => ({
      time: Math.floor(lap.time / 1000), // ミリ秒を秒に変換
      grams: lap.waterAmount, // waterAmount -> grams
    }));

    // NewEntryScreenに渡すデータを構築
    const extractionData = {
      date: new Date().toISOString(),
      extractionSteps: extractionSteps,
      waterAmount: totalWaterUsed,
      extractionEndTime: Math.floor(currentTime / 1000), // ミリ秒を秒に変換
    };

    console.log('抽出記録:', extractionData);

    // 状態をリセット
    setCurrentTime(0);
    setLaps([]);
    setStartTime(null);
    setRecordStartTime(null);
    setCurrentWaterAmount(0);

    // NewEntryScreenにデータを渡してナビゲート
    router.push({
      pathname: '/newEntry',
      params: {
        extractionData: JSON.stringify(extractionData),
      },
    });
  };

  const latestRecordedWater = laps.length > 0 ? laps[laps.length - 1].waterAmount : 0;
  const displayWaterAmount = recordStartTime ? currentWaterAmount : latestRecordedWater;

  const clamp = useCallback((value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  }, []);

  const adjustWaterAmount = useCallback(
    (delta: number) => {
      setCurrentWaterAmount((prev) => clamp(prev + delta, WATER_MIN, WATER_MAX));
    },
    [WATER_MIN, WATER_MAX, clamp],
  );

  const resetWaterAmount = useCallback(() => {
    if (laps.length > 0) {
      setCurrentWaterAmount(laps[laps.length - 1].waterAmount);
    } else {
      setCurrentWaterAmount(0);
    }
  }, [laps]);

  const pendingLapCount = recordStartTime ? 1 : 0;
  return (
    <View className="flex-1">
      <Appbar.Header style={{ backgroundColor: CoffeeColors.primary, elevation: 4 }}>
        <Appbar.BackAction onPress={() => router.push('/')} color={CoffeeColors.surface} />
        <Appbar.Content
          title="抽出機能"
          titleStyle={{ ...CoffeeTypography.headerMedium, color: CoffeeColors.surface }}
        />
      </Appbar.Header>

      <View className="flex-1">
        <ScrollView
          className="flex-1 p-5"
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* 抽出手順説明セクション（タイマー実行中のみ表示） */}
          {isTimerRunning && (
            <View style={[styles.section]} className="mb-5">
              <Text style={styles.sectionTitle}>抽出設定</Text>
              <View style={styles.divider} />

              <View style={styles.extractionSteps}>
                <Text style={styles.extractionStepsTitle}>抽出手順</Text>
                <Text style={styles.extractionStepItem}>
                  • 追加でお湯を注ぐ前に「注湯開始」をタップ。
                </Text>
                <Text style={styles.extractionStepItem}>
                  • 注湯中はボタンで注湯量を調整。
                </Text>
                <Text style={styles.extractionStepItem}>
                  • 次の「注湯開始」または「完了」を押すと前回の記録が保存されます。
                </Text>
                <Text style={styles.extractionStepItem}>• 抽出が終わったら「完了」をタップ。</Text>
              </View>
            </View>
          )}

          {/* タイマーセクション */}
          <View style={[styles.section, styles.timerSection]} className="mb-5 items-center py-8">
            <View style={styles.scaleDisplayWrapper}>
              <View style={styles.scaleDisplayTop}>
                <Text style={styles.scaleBrand}>COFFEE SCALE</Text>
              </View>
              <View style={styles.scaleDisplayBottom}>
                <View style={styles.displayColumn}>
                  <Text style={styles.digitalValue}>{formatDigitalTime(currentTime)}</Text>
                  <Text style={styles.displayLabel}>TIMER</Text>
                </View>
                <View style={[styles.displayColumn, styles.displaySeparator]}>
                  <Text style={styles.digitalValue}>
                    {displayWaterAmount.toString().padStart(4, '0')}
                  </Text>
                  <Text style={styles.displayLabel}>GRAM</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.section, styles.controlSection]} className="mb-5 items-center">
            <Text style={styles.controlTitle}>注湯量コントロール</Text>
            <Text style={styles.controlDescription}>
              ボタンで次の注湯量を調整できます。リセットで直前の値に戻ります。
            </Text>
            <View style={styles.controlWrapper}>
              <View style={styles.amountDisplay}>
                <Text style={styles.amountValue}>{currentWaterAmount}</Text>
                <Text style={styles.amountUnit}>g</Text>
              </View>
              <View style={styles.adjustGrid}>
                {[100, 10, 1].map((step) => (
                  <View key={step} style={styles.adjustColumn}>
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => adjustWaterAmount(step)}
                      accessibilityLabel={`${step}グラム増やす`}>
                      <Text style={styles.adjustButtonText}>+{step}g</Text>
                    </TouchableOpacity>
                    <Text style={styles.adjustStepLabel}>{step}g</Text>
                    <TouchableOpacity
                      style={[styles.adjustButton, styles.adjustButtonSecondary]}
                      onPress={() => adjustWaterAmount(-step)}
                      accessibilityLabel={`${step}グラム減らす`}>
                      <Text style={styles.adjustButtonText}>-{step}g</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.resetButton} onPress={resetWaterAmount}>
                <Text style={styles.resetButtonText}>リセット</Text>
              </TouchableOpacity>
              <Text style={styles.controlInfoText}>
                最新の記録: {latestRecordedWater}g
                {recordStartTime ? '（計測中）' : ''}
              </Text>
            </View>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          {!isTimerRunning ? (
            <TouchableOpacity style={styles.footerStartButton} onPress={startTimer}>
              <Text style={styles.startButtonText}>抽出を開始</Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row justify-between">
              <TouchableOpacity
                style={styles.footerLapButton}
                className="flex-1 mr-2"
                onPress={recordLap}>
                <Text style={styles.lapButtonText}>注湯開始</Text>
                <Text style={styles.lapCountText}>
                  注湯回数: {laps.length + pendingLapCount}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerFinishButton}
                className="flex-1 ml-2 flex-column justify-center"
                onPress={finishExtraction}>
                <Text style={styles.finishButtonText}>完了</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // CoffeeStyles.sectionから継承する必要があるスタイル
  section: {
    ...CoffeeStyles.section,
  },
  scrollContainer: {
    paddingBottom: 160, // フッター分の余白
  },
  // カスタムカラーと複雑なスタイルのみ保持
  sectionTitle: {
    ...CoffeeTypography.caption,
    color: CoffeeColors.primary,
    marginBottom: 8,
  },
  timerSection: {
    paddingVertical: 32,
  },
  scaleDisplayWrapper: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#060606',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  scaleDisplayTop: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#0C0C0E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  scaleBrand: {
    fontSize: 12,
    letterSpacing: 4,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  scaleDisplayBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 28,
    paddingHorizontal: 28,
    backgroundColor: '#060606',
  },
  displayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  displaySeparator: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
    marginLeft: 24,
    paddingLeft: 24,
  },
  digitalValue: {
    fontSize: 48,
    color: '#3DD9FF',
    letterSpacing: 6,
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    textShadowColor: 'rgba(61, 217, 255, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  displayLabel: {
    marginTop: 8,
    fontSize: 12,
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  startButton: {
    ...CoffeeStyles.accentButton,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
  },
  startButtonText: {
    ...CoffeeTypography.bodyLarge,
    color: CoffeeColors.primaryDark,
    fontWeight: 'bold',
  },
  lapButton: {
    ...CoffeeStyles.outlinedButton,
  },
  lapButtonText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  lapCountText: {
    ...CoffeeTypography.bodySmall,
    color: CoffeeColors.textLight,
  },
  finishButton: {
    ...CoffeeStyles.primaryButton,
  },
  finishButtonText: {
    ...CoffeeTypography.bodyLarge,
    color: CoffeeColors.surface,
    fontWeight: 'bold',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: CoffeeColors.accent,
    marginBottom: 16,
  },
  lapRecord: {
    backgroundColor: CoffeeColors.overlayDark,
  },
  lapIndex: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.accent,
    fontWeight: 'bold',
    width: 40,
  },
  lapTime: {
    ...CoffeeTypography.bodyMedium,
    fontFamily: 'monospace',
    color: CoffeeColors.text,
  },
  lapAmount: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.primary,
    fontWeight: '600',
  },
  resetButton: {
    ...CoffeeStyles.outlinedButton,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  resetButtonText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.primary,
    fontWeight: '600',
  },
  controlSection: {
    alignItems: 'center',
  },
  controlTitle: {
    ...CoffeeTypography.bodyLarge,
    color: CoffeeColors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  controlDescription: {
    ...CoffeeTypography.bodySmall,
    color: CoffeeColors.textLight,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  controlWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    backgroundColor: CoffeeColors.overlayDark,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 20,
    minWidth: 200,
  },
  amountValue: {
    ...CoffeeTypography.headerLarge,
    color: CoffeeColors.primary,
    marginRight: 8,
  },
  amountUnit: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.textLight,
  },
  adjustButton: {
    ...CoffeeStyles.primaryButton,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 72,
    alignItems: 'center',
  },
  adjustButtonSecondary: {
    backgroundColor: CoffeeColors.overlayDark,
    borderWidth: 1,
    borderColor: CoffeeColors.primary,
  },
  adjustButtonText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.surface,
    fontWeight: '600',
  },
  adjustGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
  },
  adjustColumn: {
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: CoffeeColors.overlayDark,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  adjustStepLabel: {
    ...CoffeeTypography.bodySmall,
    color: CoffeeColors.textLight,
    marginVertical: 6,
  },
  controlInfoText: {
    ...CoffeeTypography.bodySmall,
    color: CoffeeColors.textLight,
    marginTop: 12,
  },
  // 固定フッター用スタイル
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CoffeeColors.surface,
    borderTopWidth: 1,
    borderTopColor: CoffeeColors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 8,
    shadowColor: CoffeeColors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  footerStartButton: {
    ...CoffeeStyles.accentButton,
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerLapButton: {
    ...CoffeeStyles.outlinedButton,
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerFinishButton: {
    ...CoffeeStyles.primaryButton,
    paddingVertical: 16,
    alignItems: 'center',
  },
  // 抽出情報表示用スタイル
  extractionInfo: {
    marginBottom: 20,
  },
  extractionInfoItem: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.text,
    marginBottom: 8,
    paddingLeft: 8,
  },
  extractionSteps: {
    marginTop: 8,
  },
  extractionStepsTitle: {
    ...CoffeeTypography.bodyLarge,
    color: CoffeeColors.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  extractionStepItem: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.textLight,
    marginBottom: 6,
    paddingLeft: 8,
    lineHeight: 20,
  },
});
