// コーヒーテーマのアイコンセット（統一感のあるデザイン）
export const CoffeeIcons = {
  coffeeBean: '🫘', // コーヒー豆
};

// アセット画像マップ
export const CoffeeAssets = {
  coffee: require('../assets/images/coffeecup.png'),
  note: require('../assets/images/note.png'),
  pen: require('../assets/images/pen.png'),
  extraction: require('../assets/images/extraction.png'),
};

// アイコンカラーパレット
export const CoffeeIconColors = {
  primary: '#3C2415', // メインアイコン
  accent: '#D4AF37', // アクセント
  neutral: '#8D6E63', // ニュートラル
  success: '#6B5B73', // 成功状態
  warning: '#D4AF37', // 警告
  error: '#8D4E3C', // エラー
};

// アセットアイコンの型定義
export type CoffeeAssetKey = keyof typeof CoffeeAssets;
