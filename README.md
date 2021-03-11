#スケジューラ

スケジューラのコンポーネントをまるごと実装しているプロジェクトです。
汎用度をあげるために極力外部のライブラリを使わずに実装しています。

##構成

Vue 2 + vue-router

### スケジューラ

スケジューラに関するコンポーネント、関数は全て以下に入ってます。

```
src/components/scheduler
```

#### スケジューラーコンポーネント

```
/components/scheduler
/components/scheduler/UI/ -> デザイン・レイアウトのコンポーネント
/components/scheduler/draggable/ -> ドラッグ&ドロップと移動の実装部
/components/scheduler/expand/ -> ドラッグでスケジュール伸縮の実装部
/components/scheduler/util/ -> 時間変換、などの関数
/components/scheduler/util/apiConnect.js -> api接続
/components/scheduler/store/ ->　Drag&Dropと関係しないスケジューラー情報をラップしてコールバックで返す
/components/scheduler/assets/ ->　アイコンファイル
/components/scheduler/config.js -> テーブル設定ファイル - レイアウトなどの調整
/components/scheduler/statics/ -> キー名やラベルの設定
/components/scheduler/DragStore.js -> vuex的なストア関数
/components/scheduler/CalenderHeader.vue
/components/scheduler/ScheduleHeader.vue
/components/scheduler/Scheduler.vue
```

#### スケジューラー画面レイアウト

```
/components/pages
/components/pages/UI -> ページで使用するデザイン・レイアウトのコンポーネント
/components/pages/SchedulerWeek.vue -> 週間のスケジューラー
```

#### Firebase 接続

リポジトリ
https://github.com/masahiro8/facy-cms-api

同じディレクトリに上記をクローンして、

```
node updateapi.js
```

を実行

## 予定コンポーネントの構造

基本的なコンポーネントの構成

```
<DragTarget> --- 1日の領域
  <ListBox/> --- 曜日ごとの縦線
  <GridFrame/> --- 時間のグリッド線
  <DraggableItem> --- 予定コンポーネント : 予定情報の管理、開始時間位置、移動ドラッグ、を担う
    <DraggableExpandBox> --- 予定コンポーネントの入れ子 : 終了時間位置、枠の拡大ドラッグ、を担う。値はDraggableItemにコールバックする
      <ItemBox /> --- 予定内部に表示する領域にラッパー : ここに表示したいものを入れる
    </DraggableExpandBox>
  </DraggableItem>
</DragTarget>
```
