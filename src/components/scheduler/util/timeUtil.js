/**
 *
 * ピクセル数から時間を返す
 * @param {Number} pixel
 * @param {Number} grid15min
 *
 * @return {h:String,m:String}
 */

const getTimeFromYpx = ({ pixel, grid15min }) => {
  const MIN_RATE = 60 / 100;
  const getTime = (val) => {
    const r = val / 4;
    return {
      h: `${Math.floor(r)}`.padStart(2, "0"),
      m: `${Math.ceil((r - Math.floor(r)) * MIN_RATE * 100)}`.padStart(2, "0")
    };
  };
  const index = pixel / grid15min;
  return getTime(index);
};

/**
 * 開始時間と経過時間から終了時間を返す
 * @param {h:String,m:String} startTime
 * @param {h:String,m:String} expandTime
 *
 * @return {h:String,m:String}
 */
const getEndTime = ({ startTime, expandTime }) => {
  if (!startTime || !expandTime) return { h: null, m: null };
  const startMin = +startTime.h * 60 + +startTime.m;
  const totalMin = +expandTime.h * 60 + +expandTime.m;
  const endMin = startMin + totalMin;
  const h = Math.floor(endMin / 60);
  const m = endMin / 60 - h;
  return {
    h: `${h}`.padStart(2, "0"),
    m: `${m * 60}`.padStart(2, "0")
  };
};

/**
 *
 * 時間からピクセルのY座標を返す
 * @param {h:String,m:String} time // {h:"01",m:"11"}
 * @param {Number} grid15min //
 *
 * @return {Number}
 */
const getYpxFromTime = ({ time, grid15min }) => {
  const totalMin = +time.h * 4 * 15 + +time.m;
  return (totalMin / 15) * grid15min;
};

export { getTimeFromYpx, getEndTime, getYpxFromTime };
