const formatDate = (date) => {
  const year = date.getFullYear();
  const month = formatMonth(date.getMonth());
  const day = formatDay(date.getDate());
  return `${year}-${month}-${day}`;
};

const formatDateObject = (date) => {
  const year = date.getFullYear();
  const month = formatMonth(date.getMonth());
  const day = formatDay(date.getDate());
  return {
    year,
    month,
    day
  };
};

const formatMonth = (dateMonth) => {
  return ("00" + (dateMonth + 1)).slice(-2);
};

const formatDay = (dateDay) => {
  return ("00" + dateDay).slice(-2);
};

const getToday = () => {
  const today = new Date();
  return formatDate(today);
};

const getTodayObject = () => {
  const today = new Date();
  return formatDateObject(today);
};

export {
  formatDate,
  formatDateObject,
  formatMonth,
  formatDay,
  getToday,
  getTodayObject
};
