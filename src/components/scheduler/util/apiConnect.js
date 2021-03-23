// import { initFirebase, Reserves } from "@/api/Firebase/api";

//モック
import { initFirebase, Reserves } from "./apiMockup";

const padStartDate = ({ year, month, day }) => {
  return {
    year: year ? `${year}`.padStart(2, "0") : null,
    month: month ? `${month}`.padStart(2, "0") : null,
    day: day ? `${year}`.padStart(2, "0") : null,
  };
};

/**
 * Firebase
 */
const _fbConnect = () => {
  let initialized = false;

  const init = () => {
    initFirebase();
    initialized = true;
  };

  const setItem = async ({ date, startTime, endTime, type_id, tag_id }) => {
    const params = {
      email: "kurokawa@backham",
      reserve_date: date,
      start_time: startTime,
      end_time: endTime,
      type_id: type_id || 0,
      tag_id: tag_id || 0,
    };
    const result = await Reserves().setNewReserve(params);
    return result;
  };

  const getItems = async ({ year, month, day }) => {
    const items = await Reserves().getReserves(
      padStartDate({ year, month, day })
    );
    const _items = items
      .map((item) => {
        const { date, id, end_time, start_time, type_id, tag_id } = item;
        return {
          date,
          delete: item["delete"], //lintエラーになるので
          itemId: +id,
          startTime: start_time,
          endTime: end_time,
          type_id: type_id || 0,
          tag_id: tag_id || 0,
        };
      })
      .filter((item) => {
        return item.delete === false;
      });
    return _items;
  };

  const deleteItem = async (itemId) => {
    const result = await Reserves().deleteReserve({ id: `${itemId}` });
    return result;
  };

  const updateItem = async ({
    itemId,
    date,
    startTime,
    endTime,
    type_id,
    tag_id,
  }) => {
    const params = {
      id: itemId,
      email: "kurokawa@backham",
      reserve_date: date,
      start_time: startTime,
      end_time: endTime,
      type_id: type_id || 0,
      tag_id: tag_id || 0,
    };
    const result = await Reserves().updateReserve(params);
    return result;
  };

  initialized || init();

  return {
    init,
    setItem,
    getItems,
    deleteItem,
    updateItem,
  };
};

/**
 *
 * @param {*} server
 */
const wrapper = (server) => {
  const connecter = server;

  return {
    setItem: connecter.setItem,
    getItems: connecter.getItems,
    deleteItem: connecter.deleteItem,
    updateItem: connecter.updateItem,
  };
};

//Firebaseに接続
const apiConnect = wrapper(_fbConnect());

export { apiConnect };
