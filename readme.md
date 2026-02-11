[![CI](https://github.com/RyokaNAKAI/OkaZooo2/actions/workflows/ci.yml/badge.svg)](https://github.com/RyokaNAKAI/OkaZooo2/actions/workflows/ci.yml)

# Electron React TS Vite Tailwind ボイラープレート

このプロジェクトは、**Electron（エレクトロン）**、**React（リアクト）**、**TypeScript（タイプスクリプト）** を用いたデスクトップアプリケーション開発のための **ボイラープレート** です。**Vite（ヴィート）** による高速バンドル、**Tailwind CSS（テイルウィンドCSS）** によるスタイリング、**ESLint（イーエスリント）** によるコード品質維持を特徴としています。

---

## 主な特徴

- **Electron**：クロスプラットフォームなデスクトップアプリを構築できます。
- **React & TypeScript**：堅牢で型安全なユーザーインターフェースを開発できます。
- **Vite**：超高速な開発サーバー＆バンドラー。
- **Tailwind CSS**：モダンでレスポンシブなデザインのためのユーティリティファーストCSSフレームワーク。
- **ESLint**：クリーンで一貫性のあるコードを強制します。

---

## 必要要件

- **Node.js**（バージョン20以上）
- **bun（バン）**

---

## インストール方法

1. **依存パッケージのインストール：**

bunを使う場合：

```bash
bun install
```

yarnを使う場合：

```bash
yarn install
```

---

## 使い方

### 開発モード

開発モード（ホットリロード対応）でアプリを起動します：

```bash
bun run dev
```

このコマンドで **Vite** の開発サーバー（レンダラープロセス用）が起動し、Electronウィンドウが開きます。

### 本番ビルド

本番用に最適化されたファイルを生成します：

```bash
bun run build
```

### パッケージング

パッケージングツール（例：Electron Builder）を利用する場合：

```bash
bun run package
```

### リンティング（Lint）

ESLintでコードをチェックします：

```bash
bun run lint
```

自動修正可能な問題を修正する場合：

```bash
bun run lint -- --fix
```

---

## プロジェクト構成

このボイラープレートの主なフォルダ・ファイル構成は以下の通りです：

```plaintext
.
├── main/
│   ├── lib/
│   ├── index.ts
│   ├── preload.ts
│   └── tsconfig.json
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── .gitkeep
│   │   ├── CloseButtons.tsx
│   │   ├── Header.tsx
│   │   └── Main.tsx
│   ├── hooks/
│   ├── lib/
│   ├── model/
│   ├── App.tsx
│   ├── electron.tsx
│   └── main.tsx
├── .env.example
├── .gitignore
├── bun.lockb
├── electron-builder.config.js
├── esbuild.config.mjs
├── eslint.config.js
├── package.json
├── postcss.config.cjs
├── readme.md
├── vite-env.d.ts
└── vite.config.js
```

- **main/**：Electronのメインプロセス用コード（`index.ts`, `preload.ts` など）
- **src/**：レンダラープロセス用のReact & TypeScriptコード
- **public/**：静的ファイル
- **.env.example**：環境変数のサンプル
- **electron-builder.config.js**：アプリのパッケージング設定（Electron Builder利用時）
- **esbuild.config.mjs**, **eslint.config.js**, **postcss.config.cjs**, **vite.config.js**：各種設定ファイル
- **package.json**：スクリプトや依存関係
- **readme.md**：このファイル

---

## ESLint 設定

本プロジェクトには **ESLint** 設定が含まれており、コードの一貫性や一般的なエラー防止に役立ちます。ルールは `eslint.config.js` で自由に変更できます。

---

## コントリビューション

コントリビューション（貢献）は大歓迎です！ご提案やバグ報告があれば、Issueの作成やプルリクエストをお送りください。

---

## ライセンス

このプロジェクトは [MITライセンス](./LICENSE) のもとで公開されています。

---

Electron + React アプリ開発をお楽しみください！

---

## 開発環境・品質管理ツール

- **Prettier**: コード自動整形
  - `bun run format` で全ファイル整形
  - `bun run format:check` でフォーマット検証
- **ESLint**: 静的解析・コード品質チェック
  - `bun run lint` で全ファイル検証
- **Vitest**: Vite ネイティブテストフレームワーク
  - `bun test` でテスト実行
  - `bun run test:ui` でUIダッシュボード
  - `bun run test:coverage` でカバレッジレポート
- **@testing-library/react**: React UI テスト
  - `src/__tests__/components/` 配下にサンプルテストあり
- **husky + lint-staged**: Pre-commit hooks
  - コミット前に自動で ESLint/Prettier を実行
- **Storybook**: コンポーネントカタログ
  - `bun run storybook` でポート6006に起動

## 開発フロー例

1. `bun dev` でアプリ開発サーバー起動
2. `bun run storybook` でUIカタログ確認
3. `bun test` でテスト実行
4. `git commit` 時に自動で品質チェック
