const fs = require('fs');
const path = require('path');


// 删除文件夹下的文件
function delPath(path) {
    // 删除文件
    const files = fs.readdirSync(path);
    // 遍历读取到的文件列表
    files.forEach(function(filename) {
      const filedir = path + '/' + filename;
      fs.unlinkSync(filedir);
    });
    // 删除文件夹
    console.log('------------------')
    fs.rmdirSync(path);
  }
// 创建文件夹
function makeDir(dirpath, delExists = false) {
    if (!fs.existsSync(dirpath)) {
      let pathtmp;
      dirpath.split('/').forEach(function(dirname) {
        if (pathtmp) {
          pathtmp = path.join(pathtmp, dirname);
        } else {
          // 如果在linux系统中，第一个dirname的值为空，所以赋值为"/"
          if (dirname) {
            pathtmp = dirname;
          } else {
            pathtmp = '/';
          }
        }
        if (!fs.existsSync(pathtmp)) {
          if (!fs.mkdirSync(pathtmp)) {
            return false;
          }
        }
      });
    } else {
        if(delExists) {
             // 先删除已有文件夹
            delPath(dirpath);
            // 再重新建文件夹
            makeDir(dirpath)
        }
    }
    return true;
  }


async function timeOut(t) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t)
  })
}

// 获取文件夹所有文件名
function getDirFile(dir) {
  return new Promise((resolve) => {
    fs.readdir(dir, function (err, files) {
      resolve(files)
    })
  })
}
  module.exports = {
    makeDir,
    timeOut
  }
