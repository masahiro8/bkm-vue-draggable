const CONFIG_SCHEDULER = {
  hour: 24, //1日の時間数
  targetWidth: 128, //幅ピクセル
  gideWidth: 32, //時間ガイドの幅
  grid15min: 16, //15分ごとのグリッドのピクセル数
  isClickToAdd: true, //クリックして新規予定の作成
};

/*
  予約属性を定義 TODO:最終的にはapiから取得
*/

const CONFIG_TYPE_IDS = [
  { type_id: 100, name: "予定" },
  { type_id: 101, name: "実績" },
];

export { CONFIG_SCHEDULER, CONFIG_TYPE_IDS };
