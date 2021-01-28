const fs = require("fs");
const path = require("path");

//なければディレクトリ作成
const dirCrt = (_path) => {
  if (!fs.existsSync(_path)) {
    console.log("create  new  directory ", _path);
    fs.mkdirSync(_path);
  }
};

//ファイル一覧を取得
const getFileNameList = (dirPath) => {
  return new Promise(async (resolved) => {
    const list = await fs.readdirSync(dirPath);
    resolved(list);
  });
};

//再帰でディレクトリをあ
const reqDirCtr = async (src, target) => {
  const list = await getFileNameList(path.resolve(src) + "/");
  list.forEach((item) => {
    //jsファイルを判定
    if (!item.match(/.*(\.js)$/)) {
      //ディレクトリの場合はディレクトリをコピー
      const _path = `${path.resolve(target)}/${item}`;
      dirCrt(_path);
      reqDirCtr(`${path.resolve(src)}/${item}`, _path);
    } else {
      //jsの場合はファイルをコピー
      fs.copyFile(
        `${path.resolve(src)}/${item}`,
        `${path.resolve(target)}/${item}`,
        (err) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log("Copy to", `${path.resolve(target)}/${item}`);
          }
        }
      );
    }
  });
};

const copyAPI = async ({ from, to }) => {
  reqDirCtr(from, to);
};

copyAPI({
  from: "../facy-cms-api/src/api",
  to: "./src/api",
});
