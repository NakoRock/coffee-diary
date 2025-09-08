# 📱 コーヒー日記アプリ - プロジェクト構造解説

## 🎯 プロジェクト概要

このプロジェクトは、コーヒー愛好家のための**デジタルコーヒー日記アプリ**です。スマートフォンで以下の機能を提供します：

- ☕ コーヒーの抽出記録の管理
- 📝 豆の種類、抽出方法、味の評価を記録
- ⏱️ 抽出タイマー機能
- 📊 過去の記録の閲覧・編集

### 主な特徴

- **モバイルファースト**: iOSとAndroid両対応
- **オフライン機能**: インターネット不要でデータ保存
- **美しいUI**: コーヒーをテーマにした温かいデザイン
- **型安全**: TypeScriptによる安全なコード開発

---

## 🛠️ 技術スタック

このアプリで使用している主要な技術を初心者にも分かりやすく説明します：

### 📱 **Expo** (v52.0.46)

- **何？**: React Nativeアプリ開発を簡単にするフレームワーク
- **なぜ？**: 複雑な設定なしにモバイルアプリを作れる
- **メリット**: iOS・Android両方で動く、開発が早い

### ⚛️ **React Native** (0.76.9)

- **何？**: JavaScriptでネイティブアプリを作る技術
- **なぜ？**: ウェブ技術でモバイルアプリが作れる
- **メリット**: 一度のコード記述で複数プラットフォーム対応

### 📝 **TypeScript** (v5.3.3)

- **何？**: JavaScriptに型システムを追加した言語
- **なぜ？**: バグを減らし、開発効率を向上させる
- **メリット**: エラーを事前に発見、コードの品質向上

### 🎨 **NativeWind** (v4.1.23)

- **何？**: TailwindCSSをReact Nativeで使えるライブラリ
- **なぜ？**: スタイリングを効率化
- **メリット**: 短いクラス名でデザイン可能

### 💾 **AsyncStorage** (v2.1.2)

- **何？**: アプリ内でデータを保存する仕組み
- **なぜ？**: オフラインでもデータを保持
- **メリット**: インターネット不要でデータ管理

---

## 📁 ディレクトリ構造詳細

```
coffee-diary/
├── app/                    # 🗺️  ナビゲーション（画面遷移）
├── src/                    # 🎯  メインのソースコード
├── constants/              # ⚙️   設定・定数ファイル
├── components/             # 🧩  再利用可能なUIパーツ
├── assets/                 # 🖼️  画像・フォントなど
├── node_modules/           # 📦  外部ライブラリ（自動生成）
└── 設定ファイル群           # ⚙️   プロジェクト設定
```

### 🗺️ **app/ ディレクトリ**

**役割**: アプリの画面構成とナビゲーション管理

```
app/
├── _layout.tsx            # メインレイアウト設定
├── index.tsx              # ホーム画面
├── entryList.tsx          # 記録一覧画面
├── newEntry.tsx           # 新規記録画面
├── extraction.tsx         # 抽出タイマー画面
├── (tabs)/                # タブナビゲーション
└── editEntry/             # 記録編集画面
```

**なぜ必要？**

- Expo Router v4のファイルベースルーティング
- ファイル名 = URL構造（例：`entryList.tsx` → `/entryList`）
- 直感的で管理しやすい画面構成

**初心者Tip**:
新しい画面を追加したい時は、このフォルダに新しい `.tsx` ファイルを作成するだけ！

---

### 🎯 **src/ ディレクトリ**

**役割**: アプリのメインロジックとコンポーネント

```
src/
├── components/            # 再利用可能なUIコンポーネント
│   ├── EntryCard.tsx     # コーヒー記録カード
│   └── EntryForm.tsx     # 記録入力フォーム
├── screens/               # 画面コンポーネント
│   ├── HomeScreen.tsx    # ホーム画面の内容
│   ├── EntryListScreen.tsx # 一覧画面の内容
│   └── ...               # その他画面
├── services/              # データ管理ロジック
│   └── storage.ts        # データ保存・読み込み
├── hooks/                 # カスタムフック
│   └── useEntries.ts     # 記録データ管理
└── types/                 # TypeScript型定義
    └── index.ts          # データ構造定義
```

**なぜこの構成？**

- **責任分離**: 各フォルダが明確な役割を持つ
- **再利用性**: コンポーネントを他の画面でも使える
- **保守性**: コードの場所が予測しやすい

**初心者Tip**:
新しい機能を追加する時は、まず `types/` で型を定義してから実装を始めましょう！

---

### ⚙️ **constants/ ディレクトリ**

**役割**: アプリ全体で使用する設定値やスタイル

```
constants/
├── CoffeeTheme.ts         # カスタムテーマ（色・フォント等）
└── Colors.ts              # Expoデフォルト色設定
```

**CoffeeTheme.ts の特徴**:

- 🎨 コーヒーをイメージした温かい色合い
- 📱 統一されたデザインシステム
- 🔧 簡単にテーマ変更可能

**なぜ必要？**

- デザインの一貫性を保つ
- 色やスタイルの変更を一箇所で管理
- ブランドイメージの統一

---

### 🧩 **components/ ディレクトリ**

**役割**: Expoプロジェクトのテンプレートコンポーネント

```
components/
├── EditScreenInfo.tsx     # 情報表示コンポーネント
├── ExternalLink.tsx       # 外部リンクコンポーネント
├── StyledText.tsx         # カスタムテキスト
├── Themed.tsx             # テーマ対応コンポーネント
├── useClientOnlyValue.ts  # クライアント専用Hook
├── useColorScheme.ts      # カラーテーマHook
└── __tests__/             # テストファイル
```

**注意**:
この `components/` フォルダは Expo テンプレートのもので、`src/components/` とは別物です。

**初心者Tip**:
自分で作るコンポーネントは `src/components/` に入れましょう！

---

### 🖼️ **assets/ ディレクトリ**

**役割**: 画像、アイコン、フォントなどの静的ファイル

```
assets/
├── fonts/
│   └── SpaceMono-Regular.ttf  # カスタムフォント
└── images/
    ├── icon.png               # アプリアイコン
    ├── splash-icon.png        # 起動画面
    ├── main.png               # メイン背景画像
    ├── favicon.png            # Web版アイコン
    └── adaptive-icon.png      # Android適応アイコン
```

**なぜ必要？**

- アプリのビジュアルアイデンティティ
- 各プラットフォームに最適化されたアイコン
- ユーザー体験の向上

---

### 📦 **node_modules/ ディレクトリ**

**役割**: 外部ライブラリの保存場所（自動生成）

**初心者向け注意事項**:

- 🚫 **このフォルダは編集しない**
- 🤖 `npm install` で自動生成される
- 📁 `.gitignore` で除外されている（Gitに含めない）
- 💾 容量が大きいので注意

---

## ⚙️ 設定ファイル解説

### 📋 **package.json**

```json
{
  "name": "coffee-diary",           // プロジェクト名
  "main": "expo-router/entry",      // エントリーポイント
  "scripts": {
    "start": "expo start",          // 開発サーバー起動
    "android": "expo start --android", // Android実行
    "ios": "expo start --ios"       // iOS実行
  },
  "dependencies": { ... },          // 使用ライブラリ一覧
  "devDependencies": { ... }        // 開発時のみのライブラリ
}
```

### 🎯 **app.json**

```json
{
  "expo": {
    "name": "coffee-diary", // アプリ表示名
    "slug": "coffee-diary", // URL用識別子
    "version": "1.0.0", // アプリバージョン
    "orientation": "portrait", // 画面向き固定
    "icon": "./assets/images/icon.png", // アプリアイコン
    "plugins": ["expo-router"] // 使用プラグイン
  }
}
```

### 📝 **tsconfig.json**

```json
{
  "extends": "expo/tsconfig.base", // Expo基本設定を継承
  "compilerOptions": {
    "strict": true, // 厳格な型チェック
    "paths": {
      "@/*": ["./*"] // パスエイリアス設定
    },
    "types": ["nativewind/types"] // NativeWind型サポート
  }
}
```

### 🎨 **tailwind.config.js**

```javascript
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}, // カスタムテーマ拡張
  },
  plugins: [],
};
```

### 🔧 **babel.config.js**

```javascript
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: ['nativewind/babel'], // NativeWind対応
};
```

---

## 🚀 開発環境セットアップガイド

### 1. 必要なツール

```bash
# Node.js (推奨: v18以上)
# npm または yarn
# Expo CLI
npm install -g @expo/cli
```

### 2. プロジェクト起動

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm start
```

### 3. アプリ確認方法

- 📱 **スマホ**: Expo GoアプリでQRコード読み取り
- 🌐 **ブラウザ**: `w` キーでWeb版起動
- 🤖 **Android**: `a` キーでエミュレーター起動
- 🍎 **iOS**: `i` キーでシミュレーター起動

---

## 💡 初心者向けTips

### 🎯 **開発の進め方**

1. まず `src/types/` で型定義を確認
2. `src/screens/` で画面の基本構造を理解
3. `src/components/` で再利用パーツを確認
4. `constants/CoffeeTheme.ts` でスタイルを確認

### 🔍 **デバッグ方法**

- `console.log()` でログ出力
- React Native Debuggerの使用
- Expo Dev Toolsでリアルタイム確認

### 📚 **学習リソース**

- [Expo公式ドキュメント](https://docs.expo.dev/)
- [React Native公式ガイド](https://reactnative.dev/)
- [TypeScript入門](https://www.typescriptlang.org/docs/)

### 🚨 **よくあるエラーと対処法**

```bash
# モジュールが見つからないエラー
npm install

# キャッシュクリア
expo start --clear

# 型エラーの確認
npx tsc --noEmit
```

---

## 🎉 まとめ

このプロジェクトは、モダンなReact Native開発のベストプラクティスを採用しています：

- ✅ **ファイルベースルーティング**: 直感的な画面管理
- ✅ **型安全なコード**: TypeScriptによるバグ予防
- ✅ **コンポーネント指向**: 再利用可能な設計
- ✅ **テーマシステム**: 統一されたデザイン
- ✅ **オフライン対応**: ローカルデータ保存

初心者の方でも、この構造を理解することで効率的にReact Nativeアプリを開発できるようになります！

---

_📝 このドキュメントは、コーヒー日記アプリの構造を理解するためのガイドです。質問や改善提案がある場合は、お気軽にお声がけください！_
