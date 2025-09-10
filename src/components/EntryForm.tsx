import { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, IconButton, Chip } from 'react-native-paper';
import { CoffeeEntry } from '../types';
import { CoffeeColors, CoffeeTypography } from '../../constants/CoffeeTheme';

interface EntryFormProps {
  initialValues?: Omit<CoffeeEntry, 'id'>;
  onSubmit: (entry: Omit<CoffeeEntry, 'id'>) => void;
  newEntry?: boolean;
  submitLabel?: string;
  readonly?: boolean;
  hideSubmitButton?: boolean;
  onValidityChange?: (isValid: boolean) => void;
  onFormDataChange?: (formData: Omit<CoffeeEntry, 'id'>) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({
  initialValues,
  onSubmit,
  submitLabel = '保存',
  readonly = false,
  hideSubmitButton = false,
  onValidityChange,
  onFormDataChange,
  newEntry = false,
}) => {
  const [beanType, setBeanType] = useState(initialValues?.beanType || '');
  const [extractionSteps, setExtractionSteps] = useState<Array<{ time: number; grams: number }>>(
    initialValues?.extractionSteps || [{ time: 0, grams: 0 }],
  );
  const [temperature, setTemperature] = useState(initialValues?.temperature?.toString() || '');
  const [beanAmount, setBeanAmount] = useState(initialValues?.beanAmount?.toString() || '');
  const [acidity, setAcidity] = useState(initialValues?.taste.acidity?.toString() || '3');
  const [sweetness, setSweetness] = useState(initialValues?.taste.sweetness?.toString() || '3');
  const [bitterness, setBitterness] = useState(initialValues?.taste.bitterness?.toString() || '3');
  const [aroma, setAroma] = useState(initialValues?.taste.aroma?.toString() || '3');
  const [overall, setOverall] = useState(initialValues?.taste.overall?.toString() || '3');
  const [notes, setNotes] = useState(initialValues?.notes || '');

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValidForm());
    }

    if (onFormDataChange) {
      const waterAmount = calculateWaterAmount();
      const formData: Omit<CoffeeEntry, 'id'> = {
        date: initialValues?.date || new Date().toISOString(),
        beanType,
        extractionSteps,
        temperature: Number(temperature),
        beanAmount: Number(beanAmount),
        waterAmount,
        taste: {
          acidity: Number(acidity),
          sweetness: Number(sweetness),
          bitterness: Number(bitterness),
          aroma: Number(aroma),
          overall: Number(overall),
        },
        notes,
      };
      onFormDataChange(formData);
    }
  }, [
    beanType,
    extractionSteps,
    temperature,
    beanAmount,
    acidity,
    sweetness,
    bitterness,
    aroma,
    overall,
    notes,
    onValidityChange,
    onFormDataChange,
    initialValues?.date,
  ]);

  const calculateWaterAmount = () => {
    if (extractionSteps.length === 0) return 0;
    return extractionSteps[extractionSteps.length - 1]?.grams || 0;
  };

  const handleSubmit = () => {
    const waterAmount = calculateWaterAmount();
    const entry: Omit<CoffeeEntry, 'id'> = {
      date: initialValues?.date || new Date().toISOString(),
      beanType,
      extractionSteps,
      temperature: Number(temperature),
      beanAmount: Number(beanAmount),
      waterAmount,
      taste: {
        acidity: Number(acidity),
        sweetness: Number(sweetness),
        bitterness: Number(bitterness),
        aroma: Number(aroma),
        overall: Number(overall),
      },
      notes,
    };
    onSubmit(entry);
  };

  const isValidForm = () => {
    return (
      beanType.trim() !== '' &&
      extractionSteps.length > 0 &&
      extractionSteps.every((step) => step.time >= 0 && step.grams > 0) &&
      temperature !== '' &&
      !isNaN(Number(temperature)) &&
      beanAmount.trim() !== '' &&
      !isNaN(Number(beanAmount)) &&
      !isNaN(Number(acidity)) &&
      !isNaN(Number(sweetness)) &&
      !isNaN(Number(bitterness)) &&
      !isNaN(Number(aroma)) &&
      !isNaN(Number(overall))
    );
  };

  const handleUpdateStep = (index: number, field: 'time' | 'grams', value: string) => {
    const newSteps = [...extractionSteps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: parseInt(value) || 0,
    };
    setExtractionSteps(newSteps);
  };

  const handleAddStep = () => {
    setExtractionSteps([...extractionSteps, { time: 0, grams: 0 }]);
  };

  const handleRemoveStep = (index: number) => {
    if (extractionSteps.length > 1) {
      setExtractionSteps(extractionSteps.filter((_, i) => i !== index));
    }
  };

  const scrollToInput = (yPosition: number) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: Math.max(0, yPosition - 100),
        animated: true,
      });
    }, 200);
  };

  const renderRatingChips = (label: string, value: string, setValue: (value: string) => void) => {
    if (readonly) {
      return (
        <View style={styles.tasteItemReadonly}>
          <Text style={styles.tasteLabel}>{label}</Text>
          <Text style={styles.tasteStars}>{renderTasteStars(parseInt(value))}</Text>
        </View>
      );
    }

    return (
      <View className="mb-2">
        <Text style={styles.ratingLabel}>{label}</Text>
        <View className="flex flex-row justify-between">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Chip
              key={rating}
              className="mx-1"
              selected={parseInt(value) === rating}
              onPress={() => setValue(rating.toString())}
              showSelectedCheck={false}
              style={[styles.ratingChip, parseInt(value) === rating && styles.selectedChip]}
              textStyle={[styles.chipText, parseInt(value) === rating && styles.selectedChipText]}>
              {rating}
            </Chip>
          ))}
        </View>
      </View>
    );
  };

  const renderTasteStars = (rating: number) => {
    return '●'.repeat(rating) + '○'.repeat(5 - rating);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      enabled={true}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {readonly ? (
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyLabel}>豆の種類</Text>
            <Text style={styles.readonlyValue}>{beanType}</Text>
          </View>
        ) : (
          <TextInput
            label="豆の種類"
            value={beanType}
            onChangeText={setBeanType}
            onFocus={() => scrollToInput(50)}
            style={styles.input}
          />
        )}

        {readonly ? (
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyLabel}>温度</Text>
            <Text style={styles.readonlyValue}>{temperature}℃</Text>
          </View>
        ) : (
          <TextInput
            label="温度 (℃)"
            value={temperature}
            onChangeText={setTemperature}
            keyboardType="numeric"
            onFocus={() => scrollToInput(90)}
            style={styles.input}
          />
        )}

        {readonly ? (
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyLabel}>豆の量</Text>
            <Text style={styles.readonlyValue}>{beanAmount}g</Text>
          </View>
        ) : (
          <TextInput
            label="豆の量 (g)"
            value={beanAmount}
            onChangeText={setBeanAmount}
            keyboardType="numeric"
            onFocus={() => scrollToInput(100)}
            style={styles.input}
          />
        )}

        <Text style={styles.sectionTitle}>抽出ステップ</Text>
        {readonly ? (
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyValue}>
              {extractionSteps.map((step) => `${step.time}秒: ${step.grams}g`).join(' → ')}
            </Text>
          </View>
        ) : (
          <>
            {extractionSteps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <TextInput
                  label="時間 (秒)"
                  value={step.time.toString()}
                  onChangeText={(value) => handleUpdateStep(index, 'time', value)}
                  keyboardType="numeric"
                  onFocus={() => scrollToInput(300 + index * 45)}
                  style={styles.stepInput}
                />
                <TextInput
                  label="グラム"
                  value={step.grams.toString()}
                  onChangeText={(value) => handleUpdateStep(index, 'grams', value)}
                  keyboardType="numeric"
                  onFocus={() => scrollToInput(300 + index * 45)}
                  style={styles.stepInput}
                />
                <IconButton
                  icon="delete"
                  mode="outlined"
                  onPress={() => handleRemoveStep(index)}
                  style={styles.deleteButton}
                  disabled={extractionSteps.length === 1}
                />
              </View>
            ))}
            <Button mode="outlined" className="mb-5" onPress={handleAddStep}>
              ステップを追加
            </Button>
          </>
        )}

        <Text style={styles.sectionTitle}>味の評価 (1-5)</Text>
        {readonly ? (
          <View>
            <View className="flex flex-row justify-venters mb-4">
              {renderRatingChips('美味しさ', overall, setOverall)}
              {renderRatingChips('甘み', sweetness, setSweetness)}
              {renderRatingChips('苦味', bitterness, setBitterness)}
            </View>
            <View className="flex flex-row justify-center px-11">
              {renderRatingChips('酸味', acidity, setAcidity)}
              {renderRatingChips('香り', aroma, setAroma)}
            </View>
          </View>
        ) : (
          <View className="mb-5">
            {renderRatingChips('美味しさ', overall, setOverall)}
            {renderRatingChips('甘み', sweetness, setSweetness)}
            {renderRatingChips('苦味', bitterness, setBitterness)}
            {renderRatingChips('酸味', acidity, setAcidity)}
            {renderRatingChips('香り', aroma, setAroma)}
          </View>
        )}

        {readonly ? (
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyLabel}>メモ</Text>
            <Text style={styles.readonlyValue}>{notes || '記録なし'}</Text>
          </View>
        ) : (
          <TextInput
            label="メモ"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            onFocus={() => scrollToInput(600 + extractionSteps.length * 60)}
            style={styles.input}
          />
        )}

        {!readonly && (!hideSubmitButton || newEntry) && (
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!isValidForm()}
            style={styles.submitButton}>
            {submitLabel}
          </Button>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 90,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...CoffeeTypography.bodyLarge,
    fontWeight: 'bold',
    marginBottom: 8,
    color: CoffeeColors.text,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  deleteButton: {
    margin: 0,
  },
  ratingLabel: {
    ...CoffeeTypography.bodyMedium,
    color: CoffeeColors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  ratingChip: {
    flex: 1,
    backgroundColor: 'transparent',
    borderColor: '#333',
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: CoffeeColors.primary,
  },
  chipText: {
    color: CoffeeColors.text,
    fontSize: 14,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  selectedChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  // readonly表示用のスタイル
  readonlyField: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  readonlyLabel: {
    ...CoffeeTypography.bodySmall,
    color: CoffeeColors.textSecondary,
    marginBottom: 4,
  },
  readonlyValue: {
    ...CoffeeTypography.bodyLarge,
    color: CoffeeColors.text,
    fontWeight: '500',
  },
  tasteItemReadonly: {
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
