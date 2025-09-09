import React, { useState, useEffect } from 'react';
import { View, Alert, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, Card, TextInput, Divider, Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { CoffeeColors, CoffeeTypography, CoffeeStyles } from '../../constants/CoffeeTheme';

export const ExtractionScreen: React.FC = () => {
  const router = useRouter();

  const [bloomTime, setBloomTime] = useState('30');
  const [bloomWater, setBloomWater] = useState('50');
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
      setShowWaterInput(true);
    }
  };

  const addWaterAmount = (amount: number) => {
    setCurrentWaterAmount((prev) => prev + amount);
  };

  const resetWaterAmount = () => {
    setCurrentWaterAmount(0);
  };

  const confirmLap = () => {
    if (startTime && lastLapTime && currentWaterAmount > 0) {
      const now = Date.now();
      const lapTime = now - lastLapTime;

      setLaps((prev) => [...prev, { time: lapTime, waterAmount: currentWaterAmount }]);
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
    const totalWaterUsed =
      parseInt(bloomWater) + laps.reduce((sum, lap) => sum + lap.waterAmount, 0);
    const extractionData = {
      bloomTime: parseInt(bloomTime),
      bloomWater: parseInt(bloomWater),
      totalTime: currentTime,
      laps: laps,
      totalWaterUsed,
      timestamp: new Date().toISOString(),
    };

    console.log('抽出記録:', extractionData);
    alert(
      `抽出完了!\n蒸らし時間: ${bloomTime}秒\n蒸らし湯量: ${bloomWater}g\n総時間: ${formatTime(currentTime)}\nラップ数: ${laps.length}\n総湯量: ${totalWaterUsed}g`,
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
        {/* ヘッダー部分 */}

        {/* 設定セクション */}
        <View style={[styles.section, styles.marginBottom]}>
          <Text style={styles.sectionTitle}>抽出設定</Text>

          <View style={styles.settingsRow}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>蒸らし時間</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={bloomTime}
                  onChangeText={setBloomTime}
                  keyboardType="numeric"
                  style={styles.textInput}
                  disabled={isTimerRunning}
                />
                <Text style={styles.unitText}>秒</Text>
              </View>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>蒸らし湯量</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={bloomWater}
                  onChangeText={setBloomWater}
                  keyboardType="numeric"
                  style={styles.textInput}
                  disabled={isTimerRunning}
                />
                <Text style={styles.unitText}>g</Text>
              </View>
            </View>
          </View>
        </View>

        {/* タイマーセクション */}
        <View style={[styles.section, styles.timerSection, styles.marginBottom]}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timerLabel}>経過時間</Text>
          </View>

          {!isTimerRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={startTimer}>
              <Text style={styles.startButtonText}>🚀 抽出開始</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.lapButton} onPress={recordLap}>
                <Text style={styles.lapButtonText}>💧 次の注湯</Text>
                <Text style={styles.lapCountText}>ラップ: {laps.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.finishButton} onPress={finishExtraction}>
                <Text style={styles.finishButtonText}>✨ フィニッシュ</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 注湯記録 */}
        {laps.length > 0 && (
          <View style={[styles.section, styles.marginBottom]}>
            <Text style={styles.sectionTitle}>注湯記録</Text>
            <View style={styles.divider} />
            {laps.map((lap, index) => (
              <View key={index} style={styles.lapRecord}>
                <Text style={styles.lapIndex}>#{index + 1}</Text>
                <Text style={styles.lapTime}>{formatTime(lap.time)}</Text>
                <Text style={styles.lapAmount}>{lap.waterAmount}g</Text>
              </View>
            ))}
          </View>
        )}

        {/* 注湯量入力モーダル */}
        {showWaterInput && (
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={cancelLap} />
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>注湯量を設定</Text>

              <View style={styles.currentAmountContainer}>
                <Text style={styles.currentAmountLabel}>現在の設定</Text>
                <Text style={styles.currentAmountText}>{currentWaterAmount}g</Text>
                <TouchableOpacity style={styles.resetButton} onPress={resetWaterAmount}>
                  <Text style={styles.resetButtonText}>リセット</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.incrementButtons}>
                {[100, 50, 10, 5, 1].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[styles.incrementButton, getIncrementButtonStyle(amount)]}
                    onPress={() => addWaterAmount(amount)}>
                    <Text style={styles.incrementButtonText}>+{amount}g</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={cancelLap}>
                  <Text style={styles.modalCancelButtonText}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalConfirmButton, currentWaterAmount === 0 && { opacity: 0.5 }]}
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
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: CoffeeColors.primary,
    elevation: 4,
  },
  headerTitle: {
    ...CoffeeTypography.headerMedium,
    color: CoffeeColors.surface,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    ...CoffeeStyles.section,
  },
  marginBottom: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...CoffeeTypography.caption,
    color: CoffeeColors.primary,
    marginBottom: 8,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingItem: {
    flex: 1,
    marginHorizontal: 8,
  },
  settingLabel: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CoffeeColors.surfaceVariant,
    borderColor: CoffeeColors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  textInput: {
    ...CoffeeTypography.bodyLarge,
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    height: 50,
    backgroundColor: 'transparent',
  },
  unitText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.textLight,
    marginLeft: 8,
  },
  timerSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  lapButton: {
    ...CoffeeStyles.outlinedButton,
    flex: 1,
    marginRight: 8,
    paddingVertical: 16,
    alignItems: 'center',
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
    flex: 1,
    marginLeft: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  finishButtonText: {
    ...CoffeeTypography.bodyLarge,
    color: CoffeeColors.surface,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: CoffeeColors.accent,
    marginBottom: 16,
  },
  lapRecord: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CoffeeColors.overlayDark,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  lapIndex: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.accent,
    fontWeight: 'bold',
    width: 40,
  },
  lapTime: {
    ...CoffeeTypography.bodyMedium,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'monospace',
    color: CoffeeColors.text,
  },
  lapAmount: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.primary,
    fontWeight: '600',
    textAlign: 'right',
    width: 60,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    ...CoffeeStyles.section,
    backgroundColor: CoffeeColors.surface,
    width: '91.666667%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: CoffeeColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    ...CoffeeTypography.headerMedium,
    textAlign: 'center',
    marginBottom: 20,
  },
  currentAmountContainer: {
    alignItems: 'center',
    backgroundColor: CoffeeColors.overlayDark,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 20,
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
  incrementButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  incrementButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
  },
  incrementButtonText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.surface,
    fontWeight: '600',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    ...CoffeeStyles.outlinedButton,
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.primary,
    fontWeight: '600',
  },
  modalConfirmButton: {
    ...CoffeeStyles.primaryButton,
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.surface,
    fontWeight: '600',
  },
});
