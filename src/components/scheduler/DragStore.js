import { hitArea } from "./util/hitArea";

const _dragStore = () => {
  let callbacks = [];
  let updateCallbacks = [];

  let targets = [];
  let targetsItems = {};
  let allItems = [];

  const setTarget = ({ id, date, ref, items }) => {
    const find = targets.find((t) => {
      return t.id === id;
    });
    if (!find) {
      targets.push({
        id,
        date,
        ref: ref,
      });
      targetsItems[`${id}`] = [];
    }
    if (items && items.length) {
      allItems = allItems.concat(items);
      targetsItems[`${id}`] = items.map((item) => item.itemId);
      publishCallbacks();
    }
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
  const putOnTarget = ({ itemId, targetId, date, startTime, endTime }) => {
    //検索
    const find = targetsItems[`${targetId}`].find((item) => {
      return item === itemId;
    });

    //なかったら追加
    if (!find) {
      targetsItems[`${targetId}`].push(itemId);

      //他のターゲットから削除
      Object.keys(targetsItems).forEach((key) => {
        //他のリスト
        if (targetId !== +key) {
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
        targetId,
        startTime,
        endTime,
        date,
      });
    } else {
      //あれば更新
      allItems = allItems.map((item) => {
        return item.itemId === itemId
          ? { itemId, targetId, startTime, endTime, date }
          : item;
      });
    }
    publishCallbacks();
  };

  const getSelfTarget = ({ itemId }) => {
    const id = Object.keys(targetsItems).find((key) => {
      return targetsItems[key].indexOf(itemId) > -1;
    });
    if (id) {
      const find = targets.find((t) => {
        return t.id === +id;
      });
      return find ? find : null;
    }
    return null;
  };

  const getTargets = () => {
    return {
      targets,
      targetsItems,
    };
  };

  const getTarget = ({ targetId }) => {
    return targets.find((t) => {
      return t.id === targetId;
    });
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
      const items = Object.keys(targetsItems).map((key) => {
        return targetsItems[key].map((itemId) => {
          return getItemById(itemId);
        });
      });
      callback({
        items: items,
      });
    });
  };

  return {
    setTarget,
    setCallback,
    setUpdateCallback,
    hitTarget,
    putOnTarget,
    getSelfTarget,
    getTargets,
    getTarget,
    getItemById,
  };
};

export const dragStore = _dragStore();
