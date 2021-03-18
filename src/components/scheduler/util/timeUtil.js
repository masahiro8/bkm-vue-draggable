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
      m: `${Math.ceil((r - Math.floor(r)) * MIN_RATE * 100)}`.padStart(2, "0"),
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
    m: `${m * 60}`.padStart(2, "0"),
  };
};

/**
 *
 * ２つの時刻から経過時間を返す
 * @param {String,String} {startTime, endTime}
 * @returns { String } hh:mm
 */
const getRangeFromStartEnd = ({ startTime, endTime }) => {
  if (!startTime || !endTime) return { h: null, m: null };
  const startMin = getMinFromTimeStr(startTime);
  const endMin = getMinFromTimeStr(endTime);
  const range = endMin - startMin;
  return getTimeStrFromMin(range);
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
    const ndate = new Date(_date[0], +_date[1] - 1, _date[2]);
    const year = ndate.getFullYear();
    const month = ndate.getMonth();
    const day = ndate.getDate();
    const dayofweekindex = ndate.getDay();
    return {
      yyyymmdd: `${year}年${month}月${day}日`,
      mmdd: `${month}月${day}日`,
      dd: `${day}日`,
      dayofweek: `${dayOfWeekStrJP[dayofweekindex]}`,
    };
  }
};

/**
 *
 * 日付文字列からオブジェクトに変換
 * @param {String} date // 2020-01-22
 */
const getDateObjectFromString = (date) => {
  let _today;

  if (date) {
    const _ndate = date.split("-");
    _today = new Date(_ndate[0], _ndate[1] - 1, _ndate[2]);
  } else {
    _today = new Date();
  }

  return {
    year: _today.getFullYear(),
    month: _today.getMonth() + 1,
    day: _today.getDate(),
    dayofweek: _today.getDay(),
  };
};

/**
 * 今日の日付
 * @returns {Object} {year,month,day,dayofweek}
 */

const getToday = () => {
  const d = new Date();
  return {
    year: `${d.getFullYear()}`,
    month: `${d.getMonth() + 1}`.padStart(2, "0"),
    day: `${d.getDate()}`.padStart(2, "0"),
    dayofweek: d.getDay(),
  };
};

/**
 * 日付に対してパディング0
 * @param {Object} {year,month,day}
 * @returns {Object} {year,month,day}
 */

const convertPadStartedObject = ({ year, month, day }) => {
  return {
    year: `${year}`,
    month: `${month}`.padStart(2, "0"),
    day: `${day}`.padStart(2, "0"),
  };
};

/**
 *
 * 日付オブジェクトから文字列に変換
 * @param {Object} param0
 * @returns {String} yyyy-mm-dd
 */
const getDateStringFromObject = ({ year, month, day }) => {
  if (year && month && day) {
    const converted = convertPadStartedObject({ year, month, day });
    return `${converted.year}-${converted.month}-${converted.day}`;
  } else {
    const today = getToday();
    return `${today.year}-${today.month}-${today.day}`;
  }
};

/**
 * DateからObjectを返す
 * @param {Date} dateFormat
 * @returns {Object} {year,month,day,dayofweek}
 */
const getDateObjectFromDateFormat = (dateFormat) => {
  return {
    year: dateFormat.getFullYear(),
    month: dateFormat.getMonth() + 1,
    day: dateFormat.getDate(),
    dayofweek: dateFormat.getDay(),
  };
};

/**
 * DateからStringを返す
 * @param {Date} dateFormat
 * @returns {String} yyyy-mm-dd
 */
const getDateStringFromDateFormat = (dateFormat) => {
  const today = getDateObjectFromDateFormat(dateFormat);
  return getDateStringFromObject(today);
};

/**
 * 時間を15分単位の時間にまるめる
 * @param {String} time //12:11
 * @returns {Object} {h,m,hm}
 */
const roundTo15min = (time) => {
  const _time = time.split(":");
  const min = `${Math.floor(+_time[1] / 15) * 15}`.padStart(2, "0");
  return {
    h: _time[0],
    m: min,
    hm: `${_time[0]}:${min}`,
  };
};

/**
 * 日付からその週を取得
 * @param //yyyy-mm-dd
 * @returns {Array} [{year,month,day,dayofweek}]
 */
const getWeekFromDate = (date) => {
  //Objectに変換
  const today = getDateObjectFromString(date);

  //正常月からjs月に変換してNewする
  const sundateDate = new Date(today.year, today.month - 1, today.day);
  sundateDate.setDate(sundateDate.getDate() - today.dayofweek);

  const sunday = {
    year: sundateDate.getFullYear(),
    month: sundateDate.getMonth() + 1, //js月から正常月に変換
    day: sundateDate.getDate(),
    dayofweek: sundateDate.getDay(),
  };

  const _weekDay = [...new Array(7)].map((n, index) => {
    const d = new Date(sunday.year, sunday.month - 1, sunday.day);
    d.setDate(d.getDate() + index);
    const data = {
      year: `${d.getFullYear()}`,
      month: `${d.getMonth() + 1}`.padStart(2, "0"),
      day: `${d.getDate()}`.padStart(2, "0"),
      dayofweek: d.getDay(),
    };
    return data;
  });

  const weekDay = _weekDay
    .sort((day) => day.dayofweek)
    .map((day) => `${day.year}-${day.month}-${day.day}`);
  return weekDay;
};

/**
 *
 * "hh:mm"形式の時間を0:00からの経過分に変換する
 * @param {string} str "12:00"
 * @returns {Number}
 */
const getMinFromTimeStr = (str) => {
  const t = str.split(":");
  return +t[0] * 60 + +t[1];
};

/**
 * 経過分から時刻を求める
 * @param {Number} min
 * @returns { String } hh:mm
 */
const getTimeStrFromMin = (min) => {
  const h = `${Math.floor(min / 60)}`.padStart(2, "0");
  const m = `${min % 60}`.padStart(2, "0");
  return `${h}:${m}`;
};

/**
 * 00:00から{h:00,m:00}を返す
 * @param {String} "00:00"
 * @returns
 */
const getTimeObjectFromString = (str) => {
  const t = str.split(":");
  return {
    h: `${t[0]}`.padStart(2, "0"),
    m: `${t[1]}`.padStart(2, "0"),
  };
};

/**
 * 昨日の日付を取得
 * @param {String} date yyyy-mm-dd
 * @returns {String} yyyy-mm-dd
 */
const getYesturday = (date) => {
  const _date = new Date(date);
  _date.setDate(_date.getDate() - 1);
  const m = `${_date.getMonth() + 1}`.padStart(2, "0");
  const d = `${_date.getDate()}`.padStart(2, "0");
  return `${_date.getFullYear()}-${m}-${d}`;
};

/**
 * 明日の日付を取得
 * @param {String} date yyyy-mm-dd
 * @returns {String} yyyy-mm-dd
 */
const getTommorow = (date) => {
  const _date = new Date(date);
  _date.setDate(_date.getDate() + 1);
  const m = `${_date.getMonth() + 1}`.padStart(2, "0");
  const d = `${_date.getDate()}`.padStart(2, "0");
  return `${_date.getFullYear()}-${m}-${d}`;
};

/**
 * 日付から曜日を取得
 * @param {string} date yyyy-mm-dd
 */
const getDayFromDate = (date) => {
  const d = new Date(date);
  return d.getDay();
};

export {
  roundTo15min,
  //ピクセル数から時間を返す
  getTimeFromYpx,
  //開始時間と経過時間から終了時間を返す
  getEndTime,
  //２つの時刻から経過時間を返す
  getRangeFromStartEnd,
  //時間からピクセルのY座標を返す
  getYpxFromTime,
  //YYYY-MM-DD形式から日本語に変更
  getLangDateFromDateFormat,
  //日付からその週を取得
  getWeekFromDate,
  //日付文字列からオブジェクトに変換
  getDateObjectFromString,
  //日付オブジェクトから文字列に変換
  getDateStringFromObject,
  //DateからObjectを返す
  getDateObjectFromDateFormat,
  //DateからStringを返す
  getDateStringFromDateFormat,
  //"hh:mm"形式の時間を0:00からの経過分に変換する
  getMinFromTimeStr,
  //昨日の日付を取得
  getYesturday,
  //明日の日付を取得
  getTommorow,
  //経過分から時刻を求める
  getTimeStrFromMin,
  //00:00から{h:00,m:00}を返す
  getTimeObjectFromString,
  //日付から曜日を取得
  getDayFromDate,
};
