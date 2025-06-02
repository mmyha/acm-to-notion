# ACM-to-Notion chrome 拡張

[ACM](https://dl.acm.org/)の論文ページから Notion のデータベースに論文情報を送信します。

## Getting Started

### 初期化

```
npm install
```

### ビルド

```
npm run build

// firefox
npm run build:firefox
```

### ＊デバッグ

```
npm run dev

// firefox
npm run dev:firefox
```

### ブラウザに追加

#### chrome

- ビルドを行う

- `chrome://extensions/`を開く

      デベロッパーモードを ON

      「パッケージ化されていない拡張機能を読み込む」で

  `.output/chrome-mv3`を選択

#### firefox

- zip 化する
  ```
  npm run zip:firefox
  ```
- https://addons.mozilla.org/ja/developers/addon/submit/distribution を開く

  `On your own`を選択

  `firefox.zip`の方をアップロード

  「あなたの拡張機能で以下のいずれかを使っていますか？ 」で「はい」を選択し、`sources.zip`をアップロード

  メールに来たリンクからインストール

## 使い方

1. [ACM Digital Library](https://dl.acm.org/) の論文詳細ページを開きます。
2. ブラウザの拡張機能アイコンをクリックしてポップアップを開きます。
3. 初回は「Settings」ボタンから Notion の「Integration Token」と「Database ID」を入力し、保存してください。
   - Notion データベースには以下のプロパティが必要です（すべてプロパティ名は日本語）:
     - 名前（タイトル型）
     - 著者（マルチセレクト型）
     - 学会（マルチセレクト型）
     - PDF（ファイル型）
     - HTML（URL 型）
     - DOI（URL 型）
4. 「Add to Notion」ボタンを押すと、現在表示中の論文情報が Notion データベースに追加されます。
5. ステータスメッセージで成功・失敗が表示されます。

> [!WARNING]
>
> - Notion データベースのプロパティ名・型が一致していない場合、正常に登録できません。
> - Integration Token にはデータベースへの編集権限が必要です。
