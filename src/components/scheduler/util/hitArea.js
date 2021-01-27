//点がリアに入っているか判定
const hitArea = (point, area) => {
  if (
    point.x > area.x &&
    point.y > area.y &&
    point.x < area.x + area.width &&
    point.y < area.y + area.height
  ) {
    return true;
  } else {
    return false;
  }
};

// 矩形同士の当たり判定を検出する。
const hitRect = (rect1, rect2) => {
  // console.log(rect1, rect2);
  if (!rect1 || !rect2) return null;
  const horizontal =
    rect2.x < rect1.x + rect1.width && rect1.x < rect2.x + rect2.width;
  const vertical =
    rect2.y < rect1.y + rect1.height && rect1.y < rect2.y + rect2.height;
  return horizontal && vertical;
};

export { hitArea, hitRect };
