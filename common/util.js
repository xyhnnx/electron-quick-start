const fs = require('fs');
const path = require('path');


// 删除文件夹下的文件
function delPath(path) {
  // 删除文件
  const files = fs.readdirSync(path);
  // 遍历读取到的文件列表
  files.forEach(function (filename) {
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
    dirpath.split('/').forEach(function (dirname) {
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
    if (delExists) {
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

// img转base64
function getBase64Image(imgSrc) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.setAttribute('crossOrigin', 'Anonymous')
    img.src = imgSrc
    img.onload = () => {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      let dataURL = canvas.toDataURL('image/png')
      resolve(dataURL)
    }
  })
}
function remoteJs (url, key) {
  return new Promise((resolve => {
    if (window[key]) {
      resolve()
    } else {
      let script = window.document.createElement('script')
      script.src = `${url}`
      window.document.getElementsByTagName('head')[0].appendChild(script)
      script.onload = () => {
        resolve()
      }
    }
  }))
}

module.exports = {
  getDirFile,
  remoteJs,
  makeDir,
  timeOut
}
