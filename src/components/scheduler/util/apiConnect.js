import { initFirebase, Reserves } from "@/api/api";

/**
 * Firebase
 */
const _fbConnect = () => {
  let initialized = false;

  const init = () => {
    initFirebase();
    initialized = true;
  };

  const setItem = async ({ date, startTime, endTime }) => {
    const params = {
      email: "kurokawa@backham",
      reserve_date: date,
      start_time: startTime,
      end_time: endTime,
    };
    const result = await Reserves().setNewReserve(params);
    return result;
  };

  const getItems = async ({ year, month, day }) => {
    const result = await Reserves().getReserves({ year, month, day });
    return result;
  };

  const deleteItem = async (itemId) => {
    const result = await Reserves().deleteReserve({ id: `${itemId}` });
    return result;
  };

  initialized || init();

  return {
    init,
    setItem,
    getItems,
    deleteItem,
  };
};

/**
 *
 * @param {*} server
 */
const wrapper = (server) => {
  const connecter = server;

  const padStartDate = ({ year, month, day }) => {
    return {
      year: year ? `${year}`.padStart(2, "0") : null,
      month: month ? `${month}`.padStart(2, "0") : null,
      day: day ? `${year}`.padStart(2, "0") : null,
    };
  };

  const getItems = async ({ year, month, day }) => {
    const items = await connecter.getItems(padStartDate({ year, month, day }));
    const _items = items
      .map((item) => {
        const { date, id, end_time, start_time } = item;
        return {
          date,
          delete: item["delete"], //lintエラーになるので
          itemId: +id,
          startTime: start_time,
          endTime: end_time,
        };
      })
      .filter((item) => {
        return item.delete === false;
      });
    return _items;
  };
  return {
    setItem: connecter.setItem,
    getItems,
    deleteItem: connecter.deleteItem,
  };
};

//Firebaseに接続
const apiConnect = wrapper(_fbConnect());

export { apiConnect };
