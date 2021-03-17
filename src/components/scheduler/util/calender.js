export const Calender = ({ year, month, day }) => {
  const weeks = ["日", "月", "火", "水", "木", "金", "土"];
  const date = new Date(`${year}-${month}-${day}`);
  const _year = date.getFullYear();
  const _month = date.getMonth() + 1;
  // 月の最初の日を取得
  const startDate = new Date(_year, _month - 1, 1);
  // 月の最後の日を取得
  const endDate = new Date(_year, _month, 0);
  // 月の末日
  const endDayCount = endDate.getDate();
  // 月の最初の日の曜日を取得
  const startDay = startDate.getDay();
  // 前月の最後の日の情報
  const lastMonthEndDate = new Date(year, month - 1, 0);
  // 前月の末日
  const lastMonthendDayCount = lastMonthEndDate.getDate();

  const getDayOfWeekLabel = () => {
    return weeks;
  };
  const getDaysOfMonth = () => {
    let dayCount = 1;
    let cal = [];

    for (let w = 0; w < 6; w++) {
      cal[w] = [];
      for (let d = 0; d < 7; d++) {
        if (w == 0 && d < startDay) {
          // 前月
          let n = lastMonthendDayCount - startDay + d + 1;
          cal[w][d] = {
            day: n,
            enable: false,
          };
        } else if (dayCount > endDayCount) {
          //次月
          let n = dayCount - endDayCount;
          cal[w][d] = {
            day: n,
            enable: false,
          };
          dayCount++;
        } else {
          cal[w][d] = {
            day: dayCount,
            enable: true,
          };
          dayCount++;
        }
      }
    }
    return cal;
  };

  return {
    getDayOfWeekLabel,
    getDaysOfMonth,
  };
};
