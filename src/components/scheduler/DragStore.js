import { hitArea } from "./util/hitArea";
import { apiConnect } from "./util/apiConnect";
//Drag & Dropに関連したいデータストア
import { ScheduleTags } from "./store/ScheduleStore";
import {
  getMinFromTimeStr,
  getYesturday,
  getTimeStrFromMin,
} from "./util/timeUtil";

const _dragStore = () => {
  let callbacks = [];

  //日付ターゲットを登録
  let targets = [];

  //日付ターゲットごとに紐づくアイテムidを登録
  let targetsItemIds = {};

  //全てのアイテム
  let allItems = [];

  const setTarget = ({ date, ref, type_id, isDropTarget }) => {
    const find = targets.find((t) => {
      return t.date === date && t.type_id === type_id;
    });
    if (!find) {
      //追加
      targets.push({
        date,
        type_id,
        ref: ref,
        isDropTarget,
      });
      targetsItemIds[`${date}`] = [];
    } else {
      //更新
      targets = targets.map((target) => {
        if (target.date === date && target.type_id === type_id) {
          return {
            date,
            type_id,
            ref: ref,
            isDropTarget,
          };
        } else {
          return target;
        }
      });
    }
  };

  const resetTargets = () => {
    targets = [];
    targetsItemIds = {};
  };

  /**
   *
   * 配列に存在する場合は更新、ない場合は追加
   * @param {*} arr
   * @param {*} item
   */
  const pushOrUpdateItem = (arr, item) => {
    let _arr = [...arr];
    const result = _arr.find((tItem) => {
      return tItem.itemId === item.itemId;
    });
    if (result) {
      //allItemsにあれば書き換え
      _arr = _arr.map((tItem) => {
        if (tItem.itemId === item.itemId) {
          return item;
        }
      });
    } else {
      //allItemsになければ追加
      _arr.push(item);
    }
    return _arr;
  };

  const setAllItems = ({ schedule }) => {
    //クロス検索して更新
    schedule.forEach((item) => {
      let arr = pushOrUpdateItem(allItems, item);
      arr = arr.filter((v) => v);
      allItems = arr;

      Object.keys(targetsItemIds).map((key) => {
        const result = targetsItemIds[key].find((itemid) => {
          return item.itemId === itemid;
        });
        if (!result && item.date === key) {
          targetsItemIds[key].push(item.itemId);
        }
      });
    });

    publishCallbacks();
  };

  const hitTarget = (itemRect) => {
    const hits = targets
      .filter((tgt) => tgt.isDropTarget == true)
      .filter((tgt) => {
        //エリア
        const rect = tgt.ref.getBoundingClientRect();
        //点がエリアに入っているか判定
        return hitArea(
          //点
          {
            x: itemRect.x + itemRect.width / 2,
            y: itemRect.y + itemRect.height / 2,
          },
          //エリア
          {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          }
        );
      });
    return hits[0];
  };

  const addNew = async ({ date, startTime, endTime, type_id, tag_id }) => {
    //Firebaseに新規追加
    const result = await apiConnect.setItem({
      date,
      startTime,
      endTime,
      type_id,
      tag_id,
    });
    if (result) {
      //新規追加
      putOnTarget({
        itemId: +result.id,
        date,
        startTime,
        endTime,
        type_id,
        tag_id,
      });
    }
  };

  const deleteItem = async ({ itemId }) => {
    const result = await apiConnect.deleteItem(itemId);
    if (result) {
      //削除
      allItems = allItems.filter((item) => item.itemId !== itemId);
      publishCallbacks();
    }
  };

  const updateItem = async ({
    itemId,
    date,
    startTime,
    endTime,
    type_id,
    tag_id,
  }) => {
    return await apiConnect.updateItem({
      itemId,
      date,
      startTime,
      endTime,
      type_id,
      tag_id,
    });
  };

  //ターゲットに追加
  const putOnTarget = async ({
    itemId,
    date,
    startTime,
    endTime,
    type_id,
    tag_id,
  }) => {
    //登録時刻を取得
    let time = {
      date,
      startTime,
      endTime,
    };

    /**
     * 1.日跨ぎ予定を検出
     * 2.前日から開始の場合は、日付を前日に変えて、日跨ぎは全て翌日跨ぎに変えて揃える
     */
    //開始時間、終了時間が0-24以内か
    let startMin = getMinFromTimeStr(time.startTime);
    let endMin = getMinFromTimeStr(time.endTime);
    const h0Min = getMinFromTimeStr("0:0");
    const h24Min = getMinFromTimeStr("24:00");
    // console.log("min", startMin, endMin, h0Min, h24Min);

    //開始が前日の場合は、日付を前日に変える
    if (startMin < h0Min) {
      const _date = getYesturday(time.date);
      const _startMin = h24Min + startMin;
      const _endMin = h24Min + endMin;
      time.date = _date;
      time.startTime = getTimeStrFromMin(_startMin);
      time.endTime = getTimeStrFromMin(_endMin);
      startMin = getMinFromTimeStr(time.startTime);
      endMin = getMinFromTimeStr(time.endTime);
      // console.log("updated ", time.date, time.startTime, time.endTime);
    }

    //検索
    let find = null;
    if (`${time.date}` in targetsItemIds) {
      find = targetsItemIds[`${time.date}`].find((item) => {
        return item === itemId;
      });
    }

    //なかったら追加
    if (!find) {
      targetsItemIds[`${time.date}`].push(itemId);

      //他のターゲットから削除
      Object.keys(targetsItemIds).forEach((key) => {
        //他のリスト
        if (time.date !== key) {
          const index = targetsItemIds[key].indexOf(itemId);
          //みつかれば削除
          if (index > -1) {
            targetsItemIds[key].splice(index, 1);
          }
        }
      });
    }

    if (time.startTime == "NaN:NaN" || time.endTime === "NaN:NaN") return;

    //全アイテムを検索
    const result = allItems.find((item) => {
      return item.itemId === itemId;
    });

    if (!result) {
      //なければ追加
      allItems.push({
        itemId,
        date: time.date,
        startTime: time.startTime,
        endTime: time.endTime,
        type_id,
        tag_id,
      });
    } else {
      //あれば更新
      //変更があった場合だけ更新
      if (
        result.itemId !== itemId ||
        result.date !== time.date ||
        result.startTime !== time.startTime ||
        result.endTime !== time.endTime ||
        result.type_id !== type_id ||
        result.tag_id !== tag_id
      ) {
        const result = await updateItem({
          itemId,
          date: time.date,
          startTime: time.startTime,
          endTime: time.endTime,
          type_id,
          tag_id,
        });
        if (result) {
          allItems = allItems.map((item) => {
            return item.itemId === itemId
              ? {
                  itemId,
                  date: time.date,
                  startTime: time.startTime,
                  endTime: time.endTime,
                  type_id,
                  tag_id,
                }
              : item;
          });
        }
      }
    }
    publishCallbacks();
  };

  /**
   * 自分のターゲットを取得
   *
   * @param {Object} { itemId, type_id }
   * @returns {Object}
   */
  const getSelfTarget = ({ itemId, type_id }) => {
    const date = Object.keys(targetsItemIds).find((key) => {
      return targetsItemIds[key].indexOf(itemId) > -1;
    });
    if (date) {
      return targets.find((t) => {
        return t.date === date && t.type_id === type_id;
      });
    }
    return null;
  };

  /**
   * ゴーストのターゲットを取得
   * @param {Object} { type_id, date }
   * @returns
   */
  const getGoastTarget = ({ type_id, date }) => {
    return targets.find((t) => {
      return t.date === date && t.type_id === type_id;
    });
  };

  const getItemById = (id) => {
    return allItems.find((item) => item.itemId === id);
  };

  const getItemsIdFromDate = (dateString) => {
    return targetsItemIds[dateString];
  };

  const getAllItemsFromDate = (dateString) => {
    return allItems.filter((item) => {
      return item.date == dateString;
    });
  };

  //変更のコールバック
  const setCallback = (callback) => {
    callbacks.push(callback);
  };

  const publishCallbacks = () => {
    callbacks.forEach((callback) => {
      callback({
        targets,
        allItems,
      });
    });
  };

  //TODO 最終的にapiから取得する
  const getTags = () => {
    return ScheduleTags.getValues();
  };

  return {
    setTarget,
    setAllItems,
    setCallback,
    hitTarget,
    putOnTarget,
    getSelfTarget,
    getGoastTarget,
    getItemById,
    getItemsIdFromDate,
    getAllItemsFromDate,
    addNew,
    deleteItem,
    resetTargets,
    getTags,
  };
};

export const dragStore = _dragStore();
