export const Observer = () => {
  let values = [];
  let callbacks = [];

  /**
   *
   * @param {Function} callback
   */
  const getCallback = (callback) => {
    callbacks.push(callback);
    publish();
  };

  //配信
  /**
   * @return {Array, Array} 新しいデータ,古いデータ
   */
  const publish = () => {
    callbacks.forEach((callback) => {
      callback(values[0], values[1]);
    });
  };

  /**
   *
   * @param {Array} vals
   */
  const setValues = (vals) => {
    const prv = values.map((value) => {
      return { ...value };
    });
    values = [[...vals], prv];

    publish();
  };

  /**
   *
   * @param {Object} val
   */
  const putValue = (val) => {
    const prv = values.map((value) => {
      return { ...value };
    });
    const nw = values.map((value) => {
      return { ...value };
    });
    nw.push(val);
    values = [nw, prv];

    publish();
  };

  /**
   *
   * @param {Object} query >> { id: 234 }形式で指定
   * @param {Object} value
   */
  const updateValue = (query, value) => {
    const prv = values.map((value) => {
      return { ...value };
    });
    const nw = values.map((value) => {
      return { ...value };
    });

    const result = nw.map((item) => {
      Object.keys(query).map((key) => {
        if (item[key] === query[key]) {
          return value;
        } else {
          return item;
        }
      });
    });

    values = [result, prv];
    publish();
  };

  /**
   *
   * @returns {Array}
   */
  const getValues = () => {
    return values[0];
  };

  return {
    getCallback,
    getValues,
    setValues,
    putValue,
    updateValue,
  };
};
