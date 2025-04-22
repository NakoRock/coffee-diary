export interface CoffeeEntry {
  id: string;
  date: string;
  beanType: string;
  extractionSteps: {
    time: number;  // 秒数
    grams: number; // グラム値
  }[];
  temperature: number;
  ratio: string;
  taste: {
    acidity: number;    // 1-5の評価
    sweetness: number;  // 1-5の評価
    bitterness: number; // 1-5の評価
  };
  notes: string;
}

export type RootStackParamList = {
  Home: undefined;
  EntryList: undefined;
  EntryDetail: { entryId: string };
  NewEntry: undefined;
  EditEntry: { entryId: string };
};
