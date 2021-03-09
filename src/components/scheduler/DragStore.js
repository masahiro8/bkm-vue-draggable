import { hitArea } from "./util/hitArea";
import { apiConnect } from "./util/apiConnect";

const TAGS = [
  { ticketId: 90000, title: "設計", color: "#ffff00" },
  { ticketId: 90001, title: "資料作成", color: "#ff8800" },
  { ticketId: 90002, title: "調書作成", color: "#ff0000" },
];

const _dragStore = () => {
  let callbacks = [];

  let targets = [];
  let targetsItemIds = {};
  let allItems = [];

  const setTarget = ({ date, ref, type_id }) => {
    const find = targets.find((t) => {
      return t.date === date && t.type_id === type_id;
    });
    if (!find) {
      //追加
      targets.push({
        date,
        type_id,
        ref: ref,
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
    const hits = targets.filter((tgt) => {
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
    console.log("AddNew = ", tag_id);
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
    console.log("------- putOnTarget", tag_id);
    //検索
    const find = targetsItemIds[`${date}`].find((item) => {
      return item === itemId;
    });

    //なかったら追加
    if (!find) {
      targetsItemIds[`${date}`].push(itemId);

      //他のターゲットから削除
      Object.keys(targetsItemIds).forEach((key) => {
        //他のリスト
        if (date !== key) {
          const index = targetsItemIds[key].indexOf(itemId);
          //みつかれば削除
          if (index > -1) {
            targetsItemIds[key].splice(index, 1);
          }
        }
      });
    }

    if (startTime == "NaN:NaN" || endTime === "NaN:NaN") return;

    //全アイテムを検索
    const result = allItems.find((item) => {
      return item.itemId === itemId;
    });

    if (!result) {
      //なければ追加
      allItems.push({
        itemId,
        startTime,
        endTime,
        date,
        type_id,
        tag_id,
      });
    } else {
      //あれば更新
      //変更があった場合だけ更新
      if (
        result.itemId !== itemId ||
        result.date !== date ||
        result.startTime !== startTime ||
        result.endTime !== endTime ||
        result.type_id !== type_id ||
        result.tag_id !== tag_id
      ) {
        const result = await updateItem({
          itemId,
          date,
          startTime,
          endTime,
          type_id,
          tag_id,
        });
        if (result) {
          allItems = allItems.map((item) => {
            return item.itemId === itemId
              ? {
                  itemId,
                  startTime,
                  endTime,
                  date,
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

  const getSelfTarget = ({ itemId, type_id }) => {
    const date = Object.keys(targetsItemIds).find((key) => {
      return targetsItemIds[key].indexOf(itemId) > -1;
    });
    if (date) {
      const find = targets.find((t) => {
        return t.date === date && t.type_id === type_id;
      });
      return find ? find : null;
    }
    return null;
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
    return TAGS;
  };

  return {
    setTarget,
    setAllItems,
    setCallback,
    hitTarget,
    putOnTarget,
    getSelfTarget,
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
