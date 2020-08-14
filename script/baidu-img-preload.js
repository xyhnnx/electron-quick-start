// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const path = require('path')
const os = require('os')
const fs = require('fs'); // 引入fs模块
const electron = require('electron')
const { ipcRenderer } = require('electron')
const { makeDir } = require('./util')
const http = require("http");
const fetch = require('./fetch')
const request = require('request')
const { timeOut } = require('./util')

window.addEventListener('DOMContentLoaded', () => {
});
// 生产pdf的浏览器
let browser
// 文件产出路径
const outputDir = '/xyh-out-put/baidu-img/'
makeDir(outputDir);

let imgCount = 100
let search = ''
window.onload = async () => {
  console.log('xxxxx')
  console.log(document.getElementsByClassName('s_btn')[0])
  let val = document.getElementById('kw').value
  if(val) {
    search = val
    loadPageImg()
  }
};


async function loadPageImg () {
  // document.getElementById('search').style.display = 'none'
  let currImgCount = 0
  let list = []
  while (currImgCount < imgCount) {
    list = document.querySelectorAll('.main_img')
    currImgCount = list.length
    await timeOut(500)
    window.scroll({ top: 900000000, left: 0, behavior: 'smooth' });
    console.log(currImgCount)
    // 如果已经加载所有图片
    if (document.getElementById('resultInfo').style.display === 'block') {
      break
    }
  }
  console.log(`共加载${currImgCount}张图片`)
  downloadListImg(Array.from(list))
}

 function downloadListImg(list) {
  list.forEach(async(e, i) => {
    let base64 = await getBase64Image(e.src)
    base64 = base64.replace(/^data:image\/\w+;base64,/, "")
    const dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
    fs.writeFile(`${outputDir}${search}${100000+i}.png`, dataBuffer, function (err) {//用fs写入文件
      if (err) {
        console.log(err);
      } else {
        console.log(`写入成功！第${i+1}张`);
      }
    })
  })
}


// img转base64
function getBase64Image (imgSrc) {
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


ipcRenderer.send('baidu-img-preloadjs-msg', '哈哈')



