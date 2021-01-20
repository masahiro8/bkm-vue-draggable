import { hitArea } from "../../util/hitArea";

const _dragStore = () => {
  let callbacks = [];
  let initialCallbacks = [];

  let targets = [];
  let targetsItems = {};
  let initialTargetItems = {};

  let lastPutItem = {
    id: null,
    targetId: null,
    position: { x: null, y: null }
  };

  let prevCallbackValues = "";

  const setTarget = ({ id, ref }) => {
    const find = targets.find((t) => {
      return t.id === id;
    });
    if (!find) {
      targets.push({
        id,
        ref: ref
      });
      targetsItems[`${id}`] = [];
      initialTargetItems[`${id}`] = [];
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

  //配列でアイテムをまとめてターゲットに設定
  const setItemsOnTarget = ({ targetId, items }) => {
    initialTargetItems[`${targetId}`] = items;
    initialCallbacks.forEach((callback) => {
      callback(initialTargetItems);
    });
  };

  //ターゲットに追加
  const putOnTarget = ({ itemId, targetId, position, margin }) => {
    //検索
    const find = targetsItems[`${targetId}`].find((item) => {
      return item === itemId;
    });

    //なかったら追加
    if (!find) {
      lastPutItem = {
        id: itemId,
        targetId,
        position,
        margin
      };
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
    } else {
      lastPutItem = {
        id: null,
        targetId: null,
        position: { x: null, y: null },
        margin: { x: null, y: null }
      };
    }
    publishCallbacks();
  };

  const publishCallbacks = () => {
    callbacks.forEach((callback) => {
      callback({
        targets,
        targetsItems,
        lastPutItem
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

  const clearLastItem = () => {
    lastPutItem = {
      id: null,
      targetId: null,
      position: { x: null, y: null }
    };
    publishCallbacks();
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
    clearLastItem,
    setItemsOnTarget
  };
};

export const dragStore = _dragStore();
