import { Observer } from "../util/observer";
import { ObserverKeyValue } from "../util/observerKeyValue";
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

/**
 * Bodyのスクロールを返す
 */
const UIObserver = ObserverKeyValue();

/**
 * ツールチップ
 */

const Tooltips = Observer();

export {
  ScheduleTags,
  ScheduleTypes,
  ScheduleHeaderTableData,
  UIObserver,
  Tooltips,
};
