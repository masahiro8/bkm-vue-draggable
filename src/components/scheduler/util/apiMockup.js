const JSONData = () => {
  let list = [];

  const init = (data) => {
    list = Object.keys(data).map((key) => {
      return data[key];
    });
  };
  const get = () => {
    const _items = list.filter((item) => {
      return item.delete === false;
    });
    return _items;
  };

  const add = (params) => {
    let _list = [...list];
    _list.id = Math.random() * 99999 + 900000;
    _list.push(params);
    list = _list;
    return list;
  };

  const up = (params) => {
    list = list.map((item) => {
      if (item.id === params.id) {
        return params;
      } else {
        return item;
      }
    });
    return list;
  };

  const del = (id) => {
    list = list.filter((item) => {
      return item.itemId !== id;
    });
    return list;
  };

  return {
    init,
    get,
    add,
    up,
    del,
  };
};

const json = JSONData();

const Reserves = () => {
  const setNewReserve = (params) => {
    return new Promise((resolved) => {
      const result = json.add(params);
      resolved(result);
    });
  };

  const getReserves = () => {
    return new Promise((resolved) => {
      const result = json.get();
      resolved(result);
    });
  };

  const deleteReserve = (id) => {
    return new Promise((resolved) => {
      const result = json.del(id);
      resolved(result);
    });
  };

  const updateReserve = (params) => {
    return new Promise((resolved) => {
      const result = json.up(params);
      resolved(result);
    });
  };

  const getReservableTime = () => {};

  return {
    getReserves,
    setNewReserve,
    updateReserve,
    deleteReserve,
    getReservableTime,
  };
};

const initFirebase = () => {
  json.init({
    "91858520008763": {
      date: "2021-03-17",
      date_yyyy: "2021",
      date_yyyymm: "202103",
      date_yyyymmdd: "20210317",
      delete: false,
      end_time: "04:15",
      end_time_day: "15",
      end_time_hour: "04",
      id: "91858520008763",
      start_time: "03:45",
      start_time_day: "45",
      start_time_hour: "03",
      tag_id: 90001,
      type_id: 101,
      user_mail: "kurokawa@backham",
    },
    "91858520009235": {
      date: "2021-03-17",
      date_yyyy: "2021",
      date_yyyymm: "202103",
      date_yyyymmdd: "20210317",
      delete: false,
      end_time: "05:00",
      end_time_day: "00",
      end_time_hour: "05",
      id: "91858520009235",
      start_time: "04:30",
      start_time_day: "30",
      start_time_hour: "04",
      tag_id: 90002,
      type_id: 101,
      user_mail: "kurokawa@backham",
    },
    "91858520009940": {
      date: "2021-03-16",
      date_yyyy: "2021",
      date_yyyymm: "202103",
      date_yyyymmdd: "20210316",
      delete: false,
      end_time: "03:30",
      end_time_day: "30",
      end_time_hour: "03",
      id: "91858520009940",
      start_time: "03:00",
      start_time_day: "00",
      start_time_hour: "03",
      tag_id: 90001,
      type_id: 101,
      user_mail: "kurokawa@backham",
    },
  });
};

export { initFirebase, Reserves };
