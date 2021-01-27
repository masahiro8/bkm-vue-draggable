import { hitArea } from "./util/hitArea";

const _dragStore = () => {
  let callbacks = [];
  let updateCallbacks = [];

  let targets = [];
  let targetsItems = {};
  let allItems = [];

  const setTarget = ({ id, date, ref, items }) => {
    const find = targets.find((t) => {
      return t.date === date;
    });
    if (!find) {
      targets.push({
        id,
        date,
        ref: ref,
      });
      targetsItems[`${date}`] = [];
    }
    if (items && items.length) {
      allItems = allItems.concat(items);
      targetsItems[`${date}`] = items.map((item) => item.itemId);
    }
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
    setCallback,
    setUpdateCallback,
    hitTarget,
    putOnTarget,
    getSelfTarget,
    getItemById,
  };
};

export const dragStore = _dragStore();
