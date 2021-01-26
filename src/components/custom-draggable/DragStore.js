import { hitArea } from "../../util/hitArea";

const _dragStore = () => {
  let callbacks = [];
  let initialCallbacks = [];

  let targets = [];
  let targetsItems = {};
  let allItems = [];

  const setTarget = ({ id, ref, items }) => {
    const find = targets.find((t) => {
      return t.id === id;
    });
    if (!find) {
      targets.push({
        id,
        ref: ref
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
          y: itemRect.y + itemRect.height / 2
        },
        {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        }
      );
    });
    return hits[0];
  };

  //ターゲットに追加
  const putOnTarget = ({
    itemId,
    targetId,
    localPosition,
    expand,
    startTime,
    endTime
  }) => {
    console.log("put ", startTime, endTime);
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
        localPosition,
        startTime,
        endTime,
        expand
      });
    } else {
      //あれば更新
      allItems = allItems.map((item) => {
        return item.itemId === itemId
          ? { itemId, targetId, localPosition, startTime, endTime, expand }
          : item;
      });
    }
    publishCallbacks();
  };

  const publishCallbacks = () => {
    callbacks.forEach((callback) => {
      callback({
        targets,
        targetsItems
      });
    });
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
      targetsItems
    };
  };

  const getTarget = ({ targetId }) => {
    return targets.find((t) => {
      return t.id === targetId;
    });
  };

  //初期設定のコールバック
  const setInitialCallback = (callback) => {
    initialCallbacks.push(callback);
  };

  //変更のコールバック
  const setCallback = (callback) => {
    callbacks.push(callback);
  };

  const getItemById = (id) => {
    return allItems.find((item) => item.itemId === id);
  };

  return {
    setTarget,
    setCallback,
    setInitialCallback,
    hitTarget,
    putOnTarget,
    getSelfTarget,
    getTargets,
    getTarget,
    getItemById
  };
};

export const dragStore = _dragStore();
