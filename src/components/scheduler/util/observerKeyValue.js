export const ObserverKeyValue = () => {
  let values = {};
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
      callback(values);
    });
  };

  /**
   *
   * @param {Object} val
   */
  const putValue = (key, val) => {
    values[key] = val;
    publish();
  };

  /**
   *
   * @returns {Array}
   */
  const getValues = () => {
    return values;
  };

  return {
    getCallback,
    getValues,
    putValue,
  };
};
