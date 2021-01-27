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

#### ファイル

```
/scheduler
/scheduler/UI/ -> デザイン・レイアウトのコンポーネント
/scheduler/draggable/ -> ドラッグ&ドロップと移動の実装部
/scheduler/expand/ -> ドラッグでスケジュール伸縮の実装部
/scheduler/util/
/schedulerDragStore.js
/schedulerScheduleHeader.vue
/schedulerScheduler.vue
```
