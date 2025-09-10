// モダンなコーヒー風のカラーテーマ（グラデーション対応）
export const CoffeeColors = {
  // メインカラー（深いブラウン系）
  primary: '#3C2415',
  primaryDark: '#2E1A0F',
  primaryLight: '#5D4037',

  // アクセントカラー（ゴールド系）
  accent: '#D4AF37',
  accentDark: '#B8860B',
  accentLight: '#F4E4BC',

  // グラデーション背景色（ラテ→深煎り）
  gradientStart: '#F5E6D3', // ラテカラー
  gradientMid: '#E6D7C3',   // 中間色
  gradientEnd: '#8B4513',   // 深煎りブラウン

  // 背景色（ソフトラテ系）
  background: '#F5E6D3',
  backgroundDark: '#E6D7C3',
  backgroundLight: '#FFFEF7',

  // テキストカラー
  text: '#2E1A0F',
  textSecondary: '#5D4037',
  textLight: '#8D6E63',

  // カードとサーフェース
  surface: '#FFFEF7',
  surfaceVariant: '#F5F5DC',

  // 状態色（コーヒーテーマに調和）
  success: '#6B5B73',
  warning: '#D4AF37',
  error: '#8D4E3C',

  // その他
  border: '#D7CCC8',
  shadow: 'rgba(62, 36, 21, 0.15)',

  // 透明度付きカラー
  overlayLight: 'rgba(255, 248, 220, 0.9)',
  overlayDark: 'rgba(62, 36, 21, 0.1)',
};

// タイポグラフィスタイル（コーヒーテーマ）
export const CoffeeTypography = {
  // ヘッダー
  headerLarge: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: CoffeeColors.primary,
    letterSpacing: 0.8,
    fontFamily: 'serif', // 温かみのあるセリフ体
  },
  headerMedium: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: CoffeeColors.primary,
    fontFamily: 'serif',
  },
  headerSmall: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: CoffeeColors.primaryDark,
    fontFamily: 'serif',
  },

  // ボディテキスト
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: CoffeeColors.text,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: CoffeeColors.textSecondary,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: CoffeeColors.textLight,
    lineHeight: 18,
  },

  // 特殊用途
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: CoffeeColors.textLight,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  timer: {
    fontSize: 48,
    fontWeight: '300' as const,
    color: CoffeeColors.primary,
    fontFamily: 'monospace',
  },
};

// 共通のスタイルコンポーネント
export const CoffeeStyles = {
  // カード（モダンなデザイン）
  card: {
    backgroundColor: CoffeeColors.surface,
    borderRadius: 10, // より丸みを帯びた角
    elevation: 6,     // より強い影
    shadowColor: CoffeeColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(42, 33, 33, 0.3)',
  },

  // 透明感のあるカード
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    elevation: 8,
    shadowColor: CoffeeColors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // ボタン
  primaryButton: {
    backgroundColor: CoffeeColors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 2,
  },

  accentButton: {
    backgroundColor: CoffeeColors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 2,
  },

  outlinedButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: CoffeeColors.primary,
  },

  // 入力フィールド
  input: {
    backgroundColor: CoffeeColors.surfaceVariant,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CoffeeColors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // コンテナ
  container: {
    backgroundColor: CoffeeColors.background,
  },

  section: {
    backgroundColor: CoffeeColors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: CoffeeColors.border,
  },
};
