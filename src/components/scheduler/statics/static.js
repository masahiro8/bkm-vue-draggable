/*
  予約属性を定義 TODO:最終的にはapiから取得
*/

const TYPES = [
  { type_id: 100, name: "予定", isDropTarget: false },
  { type_id: 101, name: "実績", isDropTarget: true },
];

/**
 * チケット属性
 */
const TAGS = [
  { ticketId: 90000, title: "設計", color: "#eecc00" },
  { ticketId: 90001, title: "資料作成", color: "#ff8800" },
  { ticketId: 90002, title: "調書作成", color: "#ff0000" },
];

/**
 * スケジュールヘッダーテーブルのラベル
 */
const SCHEDULE_HEADER_TABLE_LABELS = [
  { id: 100, name: "申請" },
  { id: 101, name: "勤務" },
];

export { TYPES, TAGS, SCHEDULE_HEADER_TABLE_LABELS };
