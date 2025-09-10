import React, { useState, useEffect } from 'react';
import { View, Alert, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, Card, TextInput, Divider, Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { CoffeeColors, CoffeeTypography, CoffeeStyles } from '../../constants/CoffeeTheme';

export const ExtractionScreen: React.FC = () => {
  const router = useRouter();

  // タイマー関連のstate
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [laps, setLaps] = useState<{ time: number; waterAmount: number }[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastLapTime, setLastLapTime] = useState(0);
  const [currentWaterAmount, setCurrentWaterAmount] = useState(0);
  const [showWaterInput, setShowWaterInput] = useState(false);
  const [recordStartTime, setRecordStartTime] = useState<number | null>(null);

  // 入力フォーム関連のstate
  const [beanType, setBeanType] = useState('');
  const [beanAmount, setBeanAmount] = useState('');
  const [temperature, setTemperature] = useState('');
  const [steamAmount, setSteamAmount] = useState('');

  useEffect(() => {
    let interval: number;
    if (isTimerRunning && startTime) {
      interval = setInterval(() => {
        setCurrentTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, startTime]);

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    return `${seconds}秒`;
  };

  const startTimer = () => {
    // 基本入力項目のバリデーション
    if (!beanType.trim()) {
      alert('豆の種類を入力してください');
      return;
    }
    if (!beanAmount.trim() || parseFloat(beanAmount) <= 0) {
      alert('豆の量を正しく入力してください');
      return;
    }
    if (!temperature.trim() || parseFloat(temperature) <= 0) {
      alert('お湯の温度を正しく入力してください');
      return;
    }

    const now = Date.now();
    setStartTime(now);
    setLastLapTime(now);
    setIsTimerRunning(true);
    setCurrentTime(0);

    // 蒸らし湯量が入力されている場合は初期ステップとして追加
    if (steamAmount && parseFloat(steamAmount) > 0) {
      setLaps([{ time: 0, waterAmount: parseFloat(steamAmount) }]);
    } else {
      setLaps([]);
    }
  };

  const recordLap = () => {
    if (startTime && lastLapTime) {
      // 注湯開始時の時間を記録
      const now = Date.now();
      setRecordStartTime(now);

      // 直前のラップの注湯量を初期値として設定
      if (laps.length > 0) {
        const lastLapAmount = laps[laps.length - 1].waterAmount;
        setCurrentWaterAmount(lastLapAmount);
      } else {
        setCurrentWaterAmount(0);
      }
      setShowWaterInput(true);
    }
  };

  const addWaterAmount = (amount: number) => {
    setCurrentWaterAmount((prev) => prev + amount);
  };

  const resetWaterAmount = () => {
    if (laps.length > 0) {
      setCurrentWaterAmount(laps[laps.length - 1].waterAmount);
    } else {
      setCurrentWaterAmount(0);
    }
  };

  const confirmLap = () => {
    if (startTime && recordStartTime && currentWaterAmount > 0) {
      const cumulativeTime = recordStartTime - startTime;
      setLaps((prev) => [...prev, { time: cumulativeTime, waterAmount: currentWaterAmount }]);
      setLastLapTime(Date.now());
      setCurrentWaterAmount(0);
      setShowWaterInput(false);
      setRecordStartTime(null); // 使用後にリセット
    }
  };

  const cancelLap = () => {
    setCurrentWaterAmount(0);
    setShowWaterInput(false);
    setRecordStartTime(null); // キャンセル時もリセット
  };

  const finishExtraction = () => {
    setIsTimerRunning(false);
    const totalWaterUsed = laps.reduce((sum, lap) => sum + lap.waterAmount, 0);

    // laps配列をCoffeeEntry.extractionStepsフォーマットに変換
    const extractionSteps = laps.map((lap) => ({
      time: Math.floor(lap.time / 1000), // ミリ秒を秒に変換
      grams: lap.waterAmount, // waterAmount -> grams
    }));

    // NewEntryScreenに渡すデータを構築
    const extractionData = {
      date: new Date().toISOString(),
      beanType: beanType,
      extractionSteps: extractionSteps,
      temperature: parseFloat(temperature) || 0,
      beanAmount: parseFloat(beanAmount) || 0,
      waterAmount: totalWaterUsed,
      extractionEndTime: Math.floor(currentTime / 1000), // ミリ秒を秒に変換
    };

    console.log('抽出記録:', extractionData);

    // 状態をリセット
    setCurrentTime(0);
    setLaps([]);
    setStartTime(null);
    setLastLapTime(0);

    // NewEntryScreenにデータを渡してナビゲート
    router.push({
      pathname: '/newEntry',
      params: {
        extractionData: JSON.stringify(extractionData),
      },
    });
  };

  const getIncrementButtonStyle = (amount: number) => {
    switch (amount) {
      case 100:
        return { backgroundColor: CoffeeColors.error };
      case 50:
        return { backgroundColor: CoffeeColors.warning };
      case 10:
        return { backgroundColor: CoffeeColors.success };
      case 5:
        return { backgroundColor: CoffeeColors.primary };
      case 1:
        return { backgroundColor: CoffeeColors.primaryLight };
      case -10:
        return { backgroundColor: CoffeeColors.accentDark };
      default:
        return {};
    }
  };

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
          {/* 入力フォームセクション（タイマー停止時のみ表示） */}
          {!isTimerRunning && (
            <View style={[styles.section]} className="mb-5">
              <Text style={styles.sectionTitle}>抽出設定</Text>
              <View style={styles.divider} />

              <TextInput
                label="豆の種類"
                value={beanType}
                onChangeText={setBeanType}
                style={styles.input}
              />

              <View className="flex-row justify-between">
                <TextInput
                  label="豆の量 (g)"
                  value={beanAmount}
                  onChangeText={setBeanAmount}
                  keyboardType="numeric"
                  style={[styles.input, styles.halfInput]}
                />
                <TextInput
                  label="お湯の温度 (℃)"
                  value={temperature}
                  onChangeText={setTemperature}
                  keyboardType="numeric"
                  style={[styles.input, styles.halfInput]}
                />
              </View>

              <TextInput
                label="蒸らし湯量 (g)"
                value={steamAmount}
                onChangeText={setSteamAmount}
                keyboardType="numeric"
                style={styles.input}
                placeholder="例: 50"
              />
            </View>
          )}

          {/* 抽出手順説明セクション（タイマー実行中のみ表示） */}
          {isTimerRunning && (
            <View style={[styles.section]} className="mb-5">
              <Text style={styles.sectionTitle}>抽出設定</Text>
              <View style={styles.divider} />

              <View style={styles.extractionSteps}>
                <Text style={styles.extractionStepsTitle}>抽出手順</Text>
                <Text style={styles.extractionStepItem}>
                  • お湯を注ぐ前に「お湯を注ぐ」をタップ。
                </Text>
                <Text style={styles.extractionStepItem}>
                  • 注いだ後に、注湯量を入力して「記録」。
                </Text>
                <Text style={styles.extractionStepItem}>• 上記の作業を繰り返す。</Text>
                <Text style={styles.extractionStepItem}>• 抽出が終わったら「完了」をタップ。</Text>
              </View>
            </View>
          )}

          {/* タイマーセクション */}
          <View style={[styles.section, styles.timerSection]} className="mb-5 items-center py-8">
            <View className="items-center mb-6">
              <Text style={styles.timerText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timerLabel}>経過時間</Text>
            </View>
          </View>

          {/* 注湯量入力モーダル */}
          {showWaterInput && (
            <View
              style={styles.modalOverlay}
              className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center z-[1000]">
              <TouchableOpacity
                style={styles.modalBackdrop}
                className="absolute top-0 left-0 right-0 bottom-0"
                activeOpacity={1}
                onPress={cancelLap}
              />
              <View style={styles.modal} className="w-11/12 max-w-[400px]">
                <Text style={styles.modalTitle} className="text-center mb-5">
                  注湯量を設定
                </Text>

                <View
                  style={styles.currentAmountContainer}
                  className="items-center py-4 rounded-lg mb-5">
                  <Text style={styles.currentAmountLabel}>現在の設定</Text>
                  <Text style={styles.currentAmountText}>{currentWaterAmount}g</Text>
                  <Text style={styles.currentTimeText}>現在時間: {formatTime(currentTime)}</Text>
                  <TouchableOpacity style={styles.resetButton} onPress={resetWaterAmount}>
                    <Text style={styles.resetButtonText}>リセット</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap justify-between mb-5">
                  {[100, 50, 10, 5, 1, -10].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={[styles.incrementButton, getIncrementButtonStyle(amount)]}
                      className="w-[48%] py-3 px-4 rounded-lg items-center mb-2"
                      onPress={() => addWaterAmount(amount)}>
                      {amount > 0 && <Text style={styles.incrementButtonText}>+{amount}g</Text>}
                      {amount < 0 && <Text style={styles.incrementButtonText}>{amount}g</Text>}
                    </TouchableOpacity>
                  ))}
                </View>

                <View className="flex-row justify-between">
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    className="flex-1 mr-2 py-3 items-center"
                    onPress={cancelLap}>
                    <Text style={styles.modalCancelButtonText}>キャンセル</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalConfirmButton,
                      currentWaterAmount === 0 && { opacity: 0.5 },
                    ]}
                    className="flex-1 ml-2 py-3 items-center"
                    onPress={confirmLap}
                    disabled={currentWaterAmount === 0}>
                    <Text style={styles.modalConfirmButtonText}>記録 ({currentWaterAmount}g)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* 固定フッター - 注湯量入力モーダル表示中は非表示 */}
        {!showWaterInput && (
          <View style={styles.footer}>
            {!isTimerRunning ? (
              <TouchableOpacity style={styles.footerStartButton} onPress={startTimer}>
                <Text style={styles.startButtonText}>抽出開始</Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row justify-between">
                <TouchableOpacity
                  style={styles.footerLapButton}
                  className="flex-1 mr-2"
                  onPress={recordLap}>
                  <Text style={styles.lapButtonText}>注湯開始</Text>
                  <Text style={styles.lapCountText}>注湯回数: {laps.length}</Text>
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
        )}
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
    paddingBottom: 90, // フッターの高さ分の余白
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
  timerText: {
    ...CoffeeTypography.timer,
    marginBottom: 8,
  },
  timerLabel: {
    ...CoffeeTypography.caption,
    color: CoffeeColors.textLight,
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
  modalOverlay: {
    backgroundColor: 'transparent', // 透明度はclassNameで管理
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    ...CoffeeStyles.section,
    backgroundColor: CoffeeColors.surface,
    elevation: 8,
    shadowColor: CoffeeColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    ...CoffeeTypography.headerMedium,
  },
  currentAmountContainer: {
    backgroundColor: CoffeeColors.overlayDark,
  },
  currentAmountLabel: {
    ...CoffeeTypography.bodySmall,
    color: CoffeeColors.textLight,
    marginBottom: 8,
  },
  currentAmountText: {
    ...CoffeeTypography.timer,
    fontSize: 32,
    marginBottom: 8,
  },
  currentTimeText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  resetButton: {
    ...CoffeeStyles.outlinedButton,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resetButtonText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.primary,
    fontWeight: '600',
  },
  incrementButton: {
    elevation: 2,
  },
  incrementButtonText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.surface,
    fontWeight: '600',
  },
  modalCancelButton: {
    ...CoffeeStyles.outlinedButton,
  },
  modalCancelButtonText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.primary,
    fontWeight: '600',
  },
  modalConfirmButton: {
    ...CoffeeStyles.primaryButton,
  },
  modalConfirmButtonText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.surface,
    fontWeight: '600',
  },
  // 入力フォーム用スタイル
  input: {
    marginBottom: 16,
  },
  halfInput: {
    width: '48%',
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
