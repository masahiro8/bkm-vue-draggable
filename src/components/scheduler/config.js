let _CONFIG_SCHEDULER = {
  hour: 24, //1日の時間数
  targetWidth: 86, //幅ピクセル
  gideWidth: 46, //時間ガイドの幅
  grid15min: 16, //15分ごとのグリッドのピクセル数
  isClickToAdd: false, //クリックして新規予定の作成
};

//内部の高さを計算しておく
_CONFIG_SCHEDULER.innerHeight =
  _CONFIG_SCHEDULER.hour * _CONFIG_SCHEDULER.grid15min * 4;

const CONFIG_SCHEDULER = _CONFIG_SCHEDULER;
export { CONFIG_SCHEDULER };
