import { Observer } from "./observer";
import { CONFIG_TYPE_IDS, TAGS } from "./static";

/**
 * Observerのインスタンス作成
 */

/**
 * チケットの属性タグを管理
 */
const ScheduleTags = Observer();
ScheduleTags.setValues(TAGS);

/**
 * スケジュールのタイプを管理
 */
const ScheduleTypes = Observer();
ScheduleTypes.setValues(CONFIG_TYPE_IDS);

/**
 * スケジュールヘッダーのテーブルデータを管理
 */
const ScheduleHeaderTableData = Observer();

export { ScheduleTags, ScheduleTypes, ScheduleHeaderTableData };
