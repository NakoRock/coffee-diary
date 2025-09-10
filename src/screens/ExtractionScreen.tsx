import React, { useState, useEffect } from 'react';
import { View, Alert, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, Card, TextInput, Divider, Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { CoffeeColors, CoffeeTypography, CoffeeStyles } from '../../constants/CoffeeTheme';

export const ExtractionScreen: React.FC = () => {
  const router = useRouter();

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [laps, setLaps] = useState<{ time: number; waterAmount: number }[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastLapTime, setLastLapTime] = useState(0);
  const [currentWaterAmount, setCurrentWaterAmount] = useState(0);
  const [showWaterInput, setShowWaterInput] = useState(false);

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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const remainingMilliseconds = Math.floor((milliseconds % 1000) / 100);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    const now = Date.now();
    setStartTime(now);
    setLastLapTime(now);
    setIsTimerRunning(true);
    setCurrentTime(0);
    setLaps([]);
  };

  const recordLap = () => {
    if (startTime && lastLapTime) {
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
    setCurrentWaterAmount(laps[laps.length - 1].waterAmount);
  };

  const confirmLap = () => {
    if (startTime && lastLapTime && currentWaterAmount > 0) {
      const now = Date.now();
      const cumulativeTime = now - startTime;

      setLaps((prev) => [...prev, { time: cumulativeTime, waterAmount: currentWaterAmount }]);
      setLastLapTime(now);
      setCurrentWaterAmount(0);
      setShowWaterInput(false);
    }
  };

  const cancelLap = () => {
    setCurrentWaterAmount(0);
    setShowWaterInput(false);
  };

  const finishExtraction = () => {
    setIsTimerRunning(false);
    const totalWaterUsed = laps.reduce((sum, lap) => sum + lap.waterAmount, 0);
    const extractionData = {
      totalTime: currentTime,
      laps: laps,
      totalWaterUsed,
      timestamp: new Date().toISOString(),
    };

    console.log('抽出記録:', extractionData);
    alert(
      `抽出完了!\n総時間: ${formatTime(currentTime)}\nラップ数: ${laps.length}\n総湯量: ${totalWaterUsed}g`,
    );

    setCurrentTime(0);
    setLaps([]);
    setStartTime(null);
    setLastLapTime(0);
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
      default:
        return {};
    }
  };

  return (
    <View className="flex-1">
      <Appbar.Header style={{ backgroundColor: CoffeeColors.primary, elevation: 4 }}>
        <Appbar.BackAction onPress={() => router.back()} color={CoffeeColors.surface} />
        <Appbar.Content
          title="抽出機能"
          titleStyle={{ ...CoffeeTypography.headerMedium, color: CoffeeColors.surface }}
        />
      </Appbar.Header>

      <ScrollView
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* タイマーセクション */}
        <View style={[styles.section, styles.timerSection]} className="mb-5 items-center py-8">
          <View className="items-center mb-6">
            <Text style={styles.timerText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timerLabel}>経過時間</Text>
          </View>

          {!isTimerRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={startTimer}>
              <Text style={styles.startButtonText}>🚀 抽出開始</Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row w-full justify-between">
              <TouchableOpacity
                style={styles.lapButton}
                className="flex-1 mr-2 py-4 items-center"
                onPress={recordLap}>
                <Text style={styles.lapButtonText}>💧 次の注湯</Text>
                <Text style={styles.lapCountText}>ラップ: {laps.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.finishButton}
                className="flex-1 ml-2 py-4 items-center"
                onPress={finishExtraction}>
                <Text style={styles.finishButtonText}>✨ フィニッシュ</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 注湯記録 */}
        {laps.length > 0 && (
          <View style={[styles.section]} className="mb-5">
            <Text style={styles.sectionTitle}>注湯記録</Text>
            <View style={styles.divider} />
            {laps.map((lap, index) => (
              <View
                key={index}
                style={styles.lapRecord}
                className="flex-row justify-between items-center rounded-lg py-3 px-4 my-1">
                <Text style={styles.lapIndex}>#{index + 1}</Text>
                <Text style={styles.lapTime} className="flex-1 text-center">
                  {formatTime(lap.time)}
                </Text>
                <Text style={styles.lapAmount} className="text-right w-[60px]">
                  {lap.waterAmount}g
                </Text>
              </View>
            ))}
          </View>
        )}

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
                <TouchableOpacity style={styles.resetButton} onPress={resetWaterAmount}>
                  <Text style={styles.resetButtonText}>リセット</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row flex-wrap justify-between mb-5">
                {[100, 50, 10, 5, 1].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[styles.incrementButton, getIncrementButtonStyle(amount)]}
                    className="w-[48%] py-3 px-4 rounded-lg items-center mb-2"
                    onPress={() => addWaterAmount(amount)}>
                    <Text style={styles.incrementButtonText}>+{amount}g</Text>
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
                  style={[styles.modalConfirmButton, currentWaterAmount === 0 && { opacity: 0.5 }]}
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
    </View>
  );
};

const styles = StyleSheet.create({
  // CoffeeStyles.sectionから継承する必要があるスタイル
  section: {
    ...CoffeeStyles.section,
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
});
