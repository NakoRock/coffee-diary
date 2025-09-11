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

- **Expo** (v53.0.22) 
- **React Native** (0.79.5)
- **TypeScript** (v5.8.3) 
- **NativeWind** (v4.1.23)
- **React Native Paper** (v5.13.3)
- **AsyncStorage** (v2.1.2)
- **Expo Router** (v5.1.5)

## 🚀 セットアップ

### 必要な環境

- Node.js (v18以上)
- npm または yarn
- Expo CLI

### インストール

```bash
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

---

_コーヒーを愛するすべての人のために_ ☕

※READMEは一部Claude Codeで生成しています。
