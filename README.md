# Rake for Raycast

RaycastからRakeタスクを検索して実行するmacOS向けExtensionです。
ホームディレクトリで実行した `rake -T` の結果を一覧表示し、引数のあるタスクには入力フォームを表示します。

## 必要な環境

- macOS版Raycast
- Node.jsとnpm
- RubyとRake
- ホームディレクトリで `rake -T` を実行して取得できるタスク

タスクの取得と実行では、シェルを起動せずに `rake` を直接呼び出します。
Raycastの実行環境の `PATH` から、使用するRubyとRakeを見つけられる必要があります。
シェルの設定ファイルは読み込まないため、ターミナルとは実行環境が異なる場合があります。

ホームディレクトリでのタスク一覧は、ターミナルで次のコマンドを実行して確認できます。

```sh
cd ~
rake -T
```

## インストール

リポジトリを取得して依存パッケージをインストールし、Extensionをビルドします。

```sh
git clone https://github.com/kdmsnr/raycast_rake.git
cd raycast_rake
npm install
npm run build
```

1. Raycastで `Import Extension` コマンドを開きます。
2. 取得した `raycast_rake` ディレクトリ（`package.json` があるディレクトリ）を指定します。
3. インポート後、Raycastで `rake` コマンドを開きます。

## 使い方

1. Raycastで `rake` コマンドを開き、タスクを検索します。
2. 引数のないタスクは、選択してEnterを押すと実行します。
3. 引数のあるタスクは、Enterでフォームを開き、値を入力して「Run Rake Task」で実行します。

実行中の状態と成功または失敗をトーストで表示します。
成功時には標準出力を表示し、標準出力が空なら標準エラー出力、それも空なら `Done` を表示します。

タスクを変更したら、一覧の「Reload Tasks」または `⌘R` で再読み込みできます。
一覧が空の場合は、Raycastの `rake` コマンドを開き直してください。

すべてのタスクはホームディレクトリで実行します。
プロジェクトのディレクトリを選択する機能はありません。
引数はタスクの定義順にカンマで連結して渡すため、値にカンマを含む引数には対応していません。

## 開発

```sh
npm run dev   # 開発モードで起動
npm run build # Extensionをビルド
```

コマンドの実装は `src/rake.tsx`、Extensionの定義は `package.json` にあります。

## ライセンス

[MIT](LICENSE)
