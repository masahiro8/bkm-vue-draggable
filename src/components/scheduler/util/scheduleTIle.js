/**
 * A:グループに分類する
 * 1.開始時間順で全体並び替え
 * 2.最初に登場するアイテムと時間がかぶるアイテムをグループ化
 * 3.アイテム全体からグループ内のアイテムを削除
 * 4.2に戻る
 *
 * B:グループ内で横幅を決める
 * 1.グループの中で時間帯がかぶる最大数を算出
 * (あるアイテムの中にアイテムがまるごと収まる時間は１つと考える)
 * 2.グループ内のアイテムの横幅(%)を決定
 */

export const scheduleTile = () => {
  //指定キーで並び替え
  const sortedList = (list, key) => {
    const _list = [...list];
    _list.sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    return _list;
  };

  const getSameTimeItems = (me, list) => {
    const group = list.filter((element) => {
      //自分と同じか後に開始して、かつ
      //相手の開始が自分の終了より前
      return element.start >= me.start && me.end >= element.start;
    });
    return [me, ...group];
  };

  //グループと重複idはリストから削除
  const removeGroupFromList = (group, list) => {
    const _list = [...list];
    const filterd = _list.filter((item) => {
      const result = group.find((_item) => {
        return _item.id === item.id;
      });
      return result ? false : true;
    });
    return filterd;
  };

  const getGroups = (list) => {
    let _list = [...list];
    let resultList = [];
    let index = 1;
    const recal = (__list) => {
      if (!__list.length) return resultList;
      const item = __list.shift();
      //2.最初に登場するアイテムと時間がかぶるアイテムをグループ化
      const group = getSameTimeItems(item, __list);
      //2.グループ内のアイテムの横幅(%)を決定
      const group_width = Math.floor(100 / group.length);
      let group_index = 0;
      const _group = group.map((item) => {
        item["group_id"] = index;
        item["group_width"] = group_width;
        item["group_index"] = group_index;
        group_index++;
        return item;
      });
      resultList = [...resultList, ..._group];
      //3.アイテム全体からグループ内のアイテムを削除
      const ___list = removeGroupFromList(_group, __list);
      index++;
      return recal(___list);
    };
    return recal(_list);
  };

  const sortAll = (list) => {
    //1.開始時間順で全体並び替え
    let _list = sortedList(
      //deepcopyする
      list.map((item) => {
        return { ...item };
      }),
      "end"
    );
    _list = sortedList([..._list], "start");
    //2.最初に登場するアイテムと時間がかぶるアイテムをグループ化
    const result = getGroups(_list);
    return result;
  };

  return {
    sortAll,
  };
};
