//gridsizeで数値をまるめる
const roundGrid = (gridsize, position) => {
  return Math.floor(position / gridsize) * gridsize;
};
export { roundGrid };
