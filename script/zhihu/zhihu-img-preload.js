// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const path = require('path')
const os = require('os')
const fs = require('fs'); // 引入fs模块
const electron = require('electron')
const { ipcRenderer } = require('electron')
const { makeDir } = require('../../common/util')
const http = require("http");
const fetch = require('../../common/fetch')
const request = require('request')
const { timeOut } = require('../../common/util')
const config = require('../../common/config')
const {addDataToCloud}  = require('../../common/weixin-cloud')

window.addEventListener('DOMContentLoaded', async () => {
  let res = await addDataToCloud({
    dbName: 'zhihuImgAnswer',
    primaryKey: 'answerId',
    list: [
      {
        answerId:'test2',
        questionId: 'test2---',
      }
    ]
  })
  console.log(res, 'sssss')
});
// 生产pdf的浏览器
let browser
// 文件产出路径
const outputDir = `${config.outputDir}/zhuhu-img/`
makeDir(outputDir);

window.onload = async () => {

};


ipcRenderer.send('baidu-img-preloadjs-msg', '哈哈')



