import { hitArea } from "./util/hitArea";

const _dragStore = () => {
  let callbacks = [];
  let updateCallbacks = [];

  let targets = [];
  let targetsItems = {};
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
      targetsItems[`${date}`] = [];
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

  const setAllItems = ({ schedule }) => {
    //全ての予定を取り出す
    const items = schedule
      .filter((scheduleitem) => {
        return scheduleitem.items;
      })
      .map((scheduleitem) => {
        return scheduleitem.items;
      })
      .flat(Infinity);

    //クロス検索して更新
    items.forEach((item) => {
      const result = allItems.find((tItem) => {
        return tItem.itemId === item.itemId;
      });
      if (result) {
        //あれば書き換え
        allItems = allItems.map((tItem) => {
          if (tItem.itemId === item.itemId) {
            return item;
          }
        });
      } else {
        //なければ追加
        allItems.push(item);
      }
      allItems = allItems.filter((v) => v);
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

  //ターゲットに追加
  const putOnTarget = ({ itemId, date, startTime, endTime }) => {
    //検索
    const find = targetsItems[`${date}`].find((item) => {
      return item === itemId;
    });

    //なかったら追加
    if (!find) {
      targetsItems[`${date}`].push(itemId);

      //他のターゲットから削除
      Object.keys(targetsItems).forEach((key) => {
        //他のリスト
        if (date !== key) {
          const index = targetsItems[key].indexOf(itemId);
          //みつかれば削除
          if (index > -1) {
            targetsItems[key].splice(index, 1);
          }
        }
      });
    }

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
      allItems = allItems.map((item) => {
        return item.itemId === itemId
          ? { itemId, startTime, endTime, date }
          : item;
      });
    }
    publishCallbacks();
  };

  const getSelfTarget = ({ itemId }) => {
    const date = Object.keys(targetsItems).find((key) => {
      return targetsItems[key].indexOf(itemId) > -1;
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
    // console.log(dateString, targetsItems, targetsItems[dateString]);
    return targetsItems[dateString];
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
        targetsItems,
        allItems,
      });
    });
    updateCallbacks.forEach((callback) => {
      const schedule = Object.keys(targetsItems).map((key) => {
        const items = targetsItems[key].map((itemId) => {
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
  };
};

export const dragStore = _dragStore();
