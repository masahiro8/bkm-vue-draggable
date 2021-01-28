import { hitArea } from "./util/hitArea";
import { apiConnect } from "./util/apiConnect";

const _dragStore = () => {
  let callbacks = [];
  let updateCallbacks = [];

  let targets = [];
  let targetsItemIds = {};
  let allItems = [];

  const setTarget = ({ id, date, ref }) => {
    const find = targets.find((t) => {
      return t.date === date;
    });
    if (!find) {
      //追加
      targets.push({
        id,
        date,
        ref: ref,
      });
      targetsItemIds[`${date}`] = [];
    } else {
      //更新
      targets = targets.map((target) => {
        if (target.date === date) {
          return {
            id,
            date,
            ref: ref,
          };
        } else {
          return target;
        }
      });
    }
    // publishCallbacks();
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
      const rect = tgt.ref.getBoundingClientRect();
      return hitArea(
        {
          x: itemRect.x + itemRect.width / 2,
          y: itemRect.y + itemRect.height / 2,
        },
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

  const addNew = async ({ date, startTime, endTime }) => {
    //Firebaseに新規追加
    const result = await apiConnect.setItem({
      date,
      startTime,
      endTime,
    });
    if (result) {
      //新規追加
      putOnTarget({
        itemId: +result.id,
        date,
        startTime,
        endTime,
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

  const updateItem = async ({ itemId, date, startTime, endTime }) => {
    return await apiConnect.updateItem({ itemId, date, startTime, endTime });
  };

  //ターゲットに追加
  const putOnTarget = async ({ itemId, date, startTime, endTime }) => {
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
      });
    } else {
      //あれば更新
      //変更があった場合だけ更新
      if (
        result.itemId !== itemId ||
        result.date !== date ||
        result.startTime !== startTime ||
        result.endTime !== endTime
      ) {
        const result = await updateItem({ itemId, date, startTime, endTime });
        if (result) {
          allItems = allItems.map((item) => {
            return item.itemId === itemId
              ? {
                  itemId,
                  startTime,
                  endTime,
                  date,
                }
              : item;
          });
        }
      }
    }
    publishCallbacks();
  };

  const getSelfTarget = ({ itemId }) => {
    const date = Object.keys(targetsItemIds).find((key) => {
      return targetsItemIds[key].indexOf(itemId) > -1;
    });
    if (date) {
      const find = targets.find((t) => {
        return t.date === date;
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

  const setUpdateCallback = (callback) => {
    updateCallbacks.push(callback);
  };

  const publishCallbacks = () => {
    callbacks.forEach((callback) => {
      callback({
        targets,
        allItems,
      });
    });
    updateCallbacks.forEach((callback) => {
      const schedule = Object.keys(targetsItemIds).map((key) => {
        const items = targetsItemIds[key].map((itemId) => {
          return getItemById(itemId);
        });
        return {
          date: key,
          items,
        };
      });
      callback({ schedule });
    });
  };

  return {
    setTarget,
    setAllItems,
    setCallback,
    setUpdateCallback,
    hitTarget,
    putOnTarget,
    getSelfTarget,
    getItemById,
    getItemsIdFromDate,
    getAllItemsFromDate,
    addNew,
    deleteItem,
    resetTargets,
  };
};

export const dragStore = _dragStore();
