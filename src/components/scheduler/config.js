let _CONFIG_SCHEDULER = {
  hour: 24, //1日の時間数
  targetWidth: 86, //幅ピクセル
  gideWidth: 46, //時間ガイドの幅
  grid15min: 16, //15分ごとのグリッドのピクセル数
  isClickToAdd: false, //クリックして新規予定の作成
};

//スケジューラー画面の選択肢
let SCHEDULER_TYPE = {
  LIST: { id: 1, title: "一覧", to: "list" },
  MONTH: { id: 2, title: "月", to: "month" },
  WEEK: { id: 3, title: "週", to: "week" },
  DAY: { id: 4, title: "日", to: "day" },
};

//休日
let HOLIDAY_TYPE = {
  WEE: { id: 0, title: "平日", color: null, textColor: null },
  SUN: { id: 1, title: "日曜日", color: "#FCE9F0", textColor: "#DD2667" },
  SAT: { id: 2, title: "土曜日", color: "#E5E5FF", textColor: "#0000FF" },
  HOL: { id: 3, title: "祝日", color: "#FCE9F0", textColor: "#0000FF" },
};

//内部の高さを計算しておく
_CONFIG_SCHEDULER.innerHeight =
  _CONFIG_SCHEDULER.hour * _CONFIG_SCHEDULER.grid15min * 4;

const CONFIG_SCHEDULER = _CONFIG_SCHEDULER;
export { CONFIG_SCHEDULER, SCHEDULER_TYPE, HOLIDAY_TYPE };
