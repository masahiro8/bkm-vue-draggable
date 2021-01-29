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
/components/scheduler/util/ -> 時間変換、api接続などの関数
/components/scheduler/assets/ ->　アイコンファイル
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
