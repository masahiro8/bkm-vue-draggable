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

/**
 * YYYY-MM-DD形式から日本語に変更
 */
const getLangDateFromDateFormat = ({ lang, date }) => {
  const _date = date.split("-");

  if (lang === "ja") {
    const dayOfWeekStrJP = ["日", "月", "火", "水", "木", "金", "土"];
    const ndate = new Date(_date[0], _date[1], _date[2]);
    const year = ndate.getFullYear();
    const month = ndate.getMonth();
    const day = ndate.getDay();
    const dayofweekindex = ndate.getDay();
    return {
      yyyymmdd: `${year}年${month}月${day}日`,
      mmdd: `${month}月${day}日`,
      dd: `${day}日`,
      dayofweek: `${dayOfWeekStrJP[dayofweekindex]}`
    };
  }
};

/**
 * 時間を15分単位の時間にまるめる
 * @param {String} time //12:11
 */
const roundTo15min = (time) => {
  const _time = time.split(":");
  const min = `${Math.floor(+_time[1] / 15) * 15}`.padStart(2, "0");
  return {
    h: _time[0],
    m: min,
    hm: `${_time[0]}:${min}`
  };
};

export {
  getTimeFromYpx,
  getEndTime,
  getYpxFromTime,
  getLangDateFromDateFormat,
  roundTo15min
};
