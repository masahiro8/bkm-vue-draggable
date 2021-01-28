const req = (ar) => {
  if (ar.length === 1) return ar;
  return ar.reverse().map((item) => {
    return req(item);
  });
};
const mnumber = 2;

//暗号化
/**
 *
 * @param {number} n unixタイムスタンプ 秒 > Date.getTime()
 */
export const encrypt = (n) => {
  const _n = `${n}`;
  const id = `${
    [1, 3, 9][Math.floor(Math.random() * [1, 3, 9].length)]
  }${_n.substr(mnumber, _n.length - mnumber * 2)}`;
  const arr = id
    .substr(1, id.length)
    .match(new RegExp(".{" + id.substr(0, 1) + "}", "g"))
    .map((item) => {
      return item.match(/.{1}/g);
    })
    .reverse();
  return `${id.substr(0, 1)}${req(arr).flat().join("")}`;
};

//復号化
export const decrypt = (n) => {
  const id = `${n}`;
  const _enc = id
    .substr(1, id.length)
    .match(new RegExp(".{" + n.substr(0, 1) + "}", "g"))
    .map((item) => {
      return item.match(/.{1}/g);
    })
    .reverse();
  return `${id.substr(0, 1)}${req(_enc).flat().join("")}`;
};

//時間化
export const dateTime = (n) => {
  const _n = `${n}`;
  let unix = `15${_n.substr(1, _n.length)}00`;
  return new Date(+unix);
};
