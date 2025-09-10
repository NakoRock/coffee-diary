export interface CoffeeEntry {
  id: string;
  date: string;
  beanType: string;
  extractionSteps: {
    time: number; // 秒数
    grams: number; // グラム値
  }[];
  temperature: number;
  beanAmount: number; // 豆の量（グラム）
  waterAmount: number; // 湯量（グラム）
  extractionEndTime?: number; // 抽出完了時間（秒数）
  taste: {
    acidity: number; // 1-5の評価
    sweetness: number; // 1-5の評価
    bitterness: number; // 1-5の評価
    aroma: number; // 1-5の評価
    overall?: number; // 1-5の評価（美味しさ）
  };
  notes: string;
}

export type RootStackParamList = {
  Home: undefined;
  EntryList: undefined;
  NewEntry: undefined;
  EditEntry: { entryId: string };
};
