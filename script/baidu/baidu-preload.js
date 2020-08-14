// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const path = require('path')
const os = require('os')
const fs = require('fs'); // 引入fs模块
const electron = require('electron')
const { ipcRenderer } = require('electron')
const{makeDir} = require('../../common/util')
const http = require("http");
const fetch = require('../../common/fetch')
const request = require('request')
const config = require('../../common/config')

window.addEventListener('DOMContentLoaded', () => {
});
// 生产pdf的浏览器
let browser
// 文件产出路径
const outputDir = `${config.outputDir}/baidu1`
makeDir(outputDir);


window.onload = async ()=>{
  console.log('baidu-preload.js')
  let search = '美女';
  // getSearchData(search)
};

// async function getSearchData (search) {
//   let url = `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=search&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=&z=&ic=&word=%E5%A4%B4%E5%83%8F&s=&se=&tab=&width=&height=&face=&istype=&qc=&nc=&fr=&cg=head&pn=60&rn=30&gsm=3c&1505874585547=`;
// }

async function timeOut(t) {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve();
    },t)
  })
}

// 获取文件夹所有文件名
function getDirFile (dir) {
  return new Promise((resolve)=>{
    fs.readdir(dir, function(err, files) {
      resolve(files)
    })
  })
}

ipcRenderer.on('main-to-win-msg',(e,data)=>{
  console.log(`====main-to-win-msg===`);
  console.log(data);
  if(data && data.data.length) {
    downloadFile(data.data)
  }
})
async function downloadFile (list) {
  for(let i = 0;i<list.length;i++) {
    console.log(list[i]);
    let item = list[i];
    let url = item.thumbURL;

    if(url) {
      let imgType = url.substring(url.lastIndexOf('.')+ 1)
      let stream = fs.createWriteStream(path.join(outputDir,`${1000+i}.${imgType}`));
      request(url).pipe(stream).on('close',()=>{
        console.log(`${url}--下载完毕`)
      })
    }
  }
}
ipcRenderer.send('baidu-preloadjs-msg', '哈哈')



