import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, IconButton, Chip } from 'react-native-paper';
import { CoffeeEntry } from '../types';
import { CoffeeColors, CoffeeTypography } from '../../constants/CoffeeTheme';

interface EntryFormProps {
  initialValues?: Omit<CoffeeEntry, 'id'>;
  onSubmit: (entry: Omit<CoffeeEntry, 'id'>) => void;
  submitLabel?: string;
}

export const EntryForm: React.FC<EntryFormProps> = ({
  initialValues,
  onSubmit,
  submitLabel = '保存',
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
  const [notes, setNotes] = useState(initialValues?.notes || '');

  const scrollViewRef = useRef<ScrollView>(null);

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
      },
      notes,
    };
    onSubmit(entry);
  };

  const isValidForm = () => {
    return (
      beanType.trim() &&
      extractionSteps.length > 0 &&
      extractionSteps.every((step) => step.time >= 0 && step.grams > 0) &&
      temperature &&
      !isNaN(Number(temperature)) &&
      beanAmount.trim() &&
      !isNaN(Number(beanAmount)) &&
      !isNaN(Number(acidity)) &&
      !isNaN(Number(sweetness)) &&
      !isNaN(Number(bitterness))
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
        <TextInput
          label="豆の種類"
          value={beanType}
          onChangeText={setBeanType}
          onFocus={() => scrollToInput(50)}
          style={styles.input}
        />

        <Text style={styles.sectionTitle}>抽出ステップ</Text>
        {extractionSteps.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <TextInput
              label="時間 (秒)"
              value={step.time.toString()}
              onChangeText={(value) => handleUpdateStep(index, 'time', value)}
              keyboardType="numeric"
              style={styles.stepInput}
            />
            <TextInput
              label="グラム"
              value={step.grams.toString()}
              onChangeText={(value) => handleUpdateStep(index, 'grams', value)}
              keyboardType="numeric"
              style={styles.stepInput}
            />
            {extractionSteps.length > 1 && (
              <IconButton
                icon="delete"
                mode="outlined"
                onPress={() => handleRemoveStep(index)}
                style={styles.deleteButton}
              />
            )}
          </View>
        ))}
        <Button mode="outlined" className="mb-5" onPress={handleAddStep}>
          ステップを追加
        </Button>

        <TextInput
          label="温度 (℃)"
          value={temperature}
          onChangeText={setTemperature}
          keyboardType="numeric"
          onFocus={() => scrollToInput(200)}
          style={styles.input}
        />

        <TextInput
          label="豆の量 (g)"
          value={beanAmount}
          onChangeText={setBeanAmount}
          keyboardType="numeric"
          onFocus={() => scrollToInput(200)}
          style={styles.input}
        />

        <Text style={styles.sectionTitle}>味の評価 (1-5)</Text>
        <View className="mb-5">
          {renderRatingChips('酸味', acidity, setAcidity)}
          {renderRatingChips('甘み', sweetness, setSweetness)}
          {renderRatingChips('苦味', bitterness, setBitterness)}
        </View>

        <TextInput
          label="メモ"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          onFocus={() => scrollToInput(550)}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!isValidForm()}
          style={styles.submitButton}>
          {submitLabel}
        </Button>
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
});
