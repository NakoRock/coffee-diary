# ☕ Coffee Diary

コーヒー愛好家のためのモバイル記録アプリ

## 📱 概要

Coffee Diaryは、コーヒーの抽出記録を管理するためのモバイルアプリケーションです。豆の種類、抽出方法、味の評価を記録し、あなたのコーヒー体験を向上させます。

### 主な機能

- ☕ **コーヒー記録管理** - 豆の種類、抽出条件、味の評価を記録
- ⏱️ **抽出タイマー** - 段階的な抽出プロセスをサポート
- 📊 **記録一覧** - 過去の記録を閲覧・編集
- 📝 **味の評価** - 酸味、甘み、苦味、香り、総合評価を5段階で記録
- 💾 **オフライン対応** - インターネット接続不要でデータ保存

## 🛠️ 技術スタック

- **Expo** (v53.0.22) - React Nativeアプリ開発フレームワーク
- **React Native** (0.79.5) - クロスプラットフォームモバイル開発
- **TypeScript** (v5.8.3) - 型安全なJavaScript
- **NativeWind** (v4.1.23) - TailwindCSS for React Native
- **React Native Paper** (v5.13.3) - Material Design UI コンポーネント
- **AsyncStorage** (v2.1.2) - ローカルデータ保存
- **Expo Router** (v5.1.5) - ファイルベースナビゲーション

## 🚀 セットアップ

### 必要な環境

- Node.js (v18以上)
- npm または yarn
- Expo CLI

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/coffee-diary.git
cd coffee-diary

# 依存関係をインストール
npm install

# Expo CLIをグローバルインストール（未インストールの場合）
npm install -g @expo/cli
```

### 開発サーバーの起動

```bash
# 開発サーバーを起動
npm start
```

### プラットフォーム別実行

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web版
npm run web
```

## 📁 プロジェクト構造

```
coffee-diary/
├── app/                    # Expo Routerによる画面管理
│   ├── index.tsx          # ホーム画面
│   ├── entryList.tsx      # 記録一覧画面
│   ├── newEntry.tsx       # 新規記録画面
│   ├── extraction.tsx     # 抽出タイマー画面
│   └── editEntry/         # 記録編集画面
├── src/                   # メインソースコード
│   ├── components/        # 再利用可能UIコンポーネント
│   ├── screens/          # 画面コンポーネント
│   ├── hooks/            # カスタムフック
│   ├── services/         # データ管理ロジック
│   └── types/            # TypeScript型定義
├── constants/            # テーマ・設定ファイル
├── assets/              # 画像・フォントリソース
└── 設定ファイル群         # Expo、TypeScript、ESLint等
```

## 🎯 主要画面

### ホーム画面

- 今週のコーヒー杯数表示
- 新規記録、記録一覧、抽出タイマーへのクイックアクセス
- 直近の記録表示

### 記録作成・編集

- 豆の種類、温度、豆の量の入力
- 段階的な抽出ステップの記録
- 5段階評価による味の記録（酸味、甘み、苦味、香り、総合）
- メモ欄での詳細記録

### 抽出タイマー

- リアルタイムタイマー機能
- 段階的な湯量記録
- 抽出完了時の自動記録保存

### 記録一覧

- 過去の記録を時系列で表示
- 各記録の詳細表示・編集機能
- 削除機能

## 📱 ビルド・デプロイ

このプロジェクトはEAS Build（Expo Application Services）に対応しています。

```bash
# 開発ビルド
eas build --profile development

# プレビュービルド
eas build --profile preview

# プロダクションビルド
eas build --profile production
```

## 🧪 開発

### 利用可能なスクリプト

- `npm start` - 開発サーバー起動
- `npm run android` - Android版実行
- `npm run ios` - iOS版実行
- `npm run web` - Web版実行
- `npm run lint` - ESLintによるコードチェック

### 開発時の注意点

- TypeScriptの型チェックを有効活用してください
- NativeWindによるスタイリングを使用しています
- カスタムテーマは `constants/CoffeeTheme.ts` で管理されています
- データ永続化には AsyncStorage を使用しています

## 📄 ライセンス

このプロジェクトはプライベートリポジトリです。

## 🤝 コントリビューション

プロジェクトの改善提案やバグ報告は Issues でお知らせください。

---

_コーヒーを愛するすべての人のために_ ☕
