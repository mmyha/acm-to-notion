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
|メイン|設定|
|---|---|
|![スクリーンショット 2025-06-02 23 52 50](https://github.com/user-attachments/assets/06fb38da-e5dc-4a69-bca8-314f179f4b86)|![スクリーンショット 2025-06-02 23 52 33](https://github.com/user-attachments/assets/c906bdd3-f776-4312-a9a7-60f2c5165cbf)|

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
     <img width="866" alt="スクリーンショット 2025-06-02 23 56 41" src="https://github.com/user-attachments/assets/f82f2382-a3dd-49cb-969f-a6057509dbdb" />

4. 「Add to Notion」ボタンを押すと、現在表示中の論文情報が Notion データベースに追加されます。
5. ステータスメッセージで成功・失敗が表示されます。

> [!WARNING]
>
> - Notion データベースのプロパティ名・型が一致していない場合、正常に登録できません。
> - Integration Token にはデータベースへの編集権限が必要です。
