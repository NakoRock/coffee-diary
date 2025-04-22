import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { CoffeeEntry } from '../types';

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
  const [ratio, setRatio] = useState(initialValues?.ratio || '');
  const [acidity, setAcidity] = useState(initialValues?.taste.acidity?.toString() || '3');
  const [sweetness, setSweetness] = useState(initialValues?.taste.sweetness?.toString() || '3');
  const [bitterness, setBitterness] = useState(initialValues?.taste.bitterness?.toString() || '3');
  const [notes, setNotes] = useState(initialValues?.notes || '');

  const handleSubmit = () => {
    const entry: Omit<CoffeeEntry, 'id'> = {
      date: initialValues?.date || new Date().toISOString(),
      beanType,
      extractionSteps,
      temperature: Number(temperature),
      ratio,
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
      ratio.trim() &&
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

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="豆の種類"
        value={beanType}
        onChangeText={setBeanType}
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>抽出ステップ</Text>
      {extractionSteps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
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
              style={styles.deleteStepButton}
            />
          )}
        </View>
      ))}
      <Button mode="outlined" onPress={handleAddStep} style={styles.addStepButton}>
        ステップを追加
      </Button>

      <TextInput
        label="温度 (℃)"
        value={temperature}
        onChangeText={setTemperature}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="比率 (例: 1:15)"
        value={ratio}
        onChangeText={setRatio}
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>味の評価 (1-5)</Text>
      <View style={styles.ratingContainer}>
        <TextInput
          label="酸味"
          value={acidity}
          onChangeText={setAcidity}
          keyboardType="numeric"
          style={styles.ratingInput}
        />
        <TextInput
          label="甘み"
          value={sweetness}
          onChangeText={setSweetness}
          keyboardType="numeric"
          style={styles.ratingInput}
        />
        <TextInput
          label="苦味"
          value={bitterness}
          onChangeText={setBitterness}
          keyboardType="numeric"
          style={styles.ratingInput}
        />
      </View>

      <TextInput
        label="メモ"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!isValidForm()}
        style={styles.button}>
        {submitLabel}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  deleteStepButton: {
    margin: 0,
  },
  addStepButton: {
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratingInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});
