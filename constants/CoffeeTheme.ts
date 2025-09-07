// クラシカルな喫茶店風のカラーテーマ
export const CoffeeColors = {
  // メインカラー（深いブラウン系）
  primary: '#3C2415',
  primaryDark: '#2E1A0F',
  primaryLight: '#5D4037',

  // アクセントカラー（ゴールド系）
  accent: '#D4AF37',
  accentDark: '#B8860B',
  accentLight: '#F4E4BC',

  // 背景色（アイボリー/ベージュ系）
  background: '#FFF8DC',
  backgroundDark: '#F5F5DC',
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

// タイポグラフィスタイル
export const CoffeeTypography = {
  // ヘッダー
  headerLarge: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: CoffeeColors.primary,
    letterSpacing: 0.5,
  },
  headerMedium: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: CoffeeColors.primary,
  },
  headerSmall: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: CoffeeColors.primaryDark,
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
  // カード
  card: {
    backgroundColor: CoffeeColors.surface,
    borderRadius: 12,
    elevation: 3,
    shadowColor: CoffeeColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: CoffeeColors.border,
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
