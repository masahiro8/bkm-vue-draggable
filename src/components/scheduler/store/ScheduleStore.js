import { Observer } from "../util/observer";
import { TYPES, TAGS } from "../statics/static";

/**
 * Observerのインスタンス作成
 */

/**
 * チケットの属性タグを管理
 */
const _ScheduleTags = Observer();
//初期化メソッドを生やす
_ScheduleTags.init = () => {
  _ScheduleTags.setValues(TAGS);
};
const ScheduleTags = _ScheduleTags;
ScheduleTags.init();

/**
 * スケジュールのタイプを管理
 */
const _ScheduleTypes = Observer();
_ScheduleTypes.init = () => {
  _ScheduleTypes.setValues(TYPES);
};
const ScheduleTypes = _ScheduleTypes;
ScheduleTypes.init();

/**
 * スケジュールヘッダーのテーブルデータを管理
 */
const ScheduleHeaderTableData = Observer();

export { ScheduleTags, ScheduleTypes, ScheduleHeaderTableData };
