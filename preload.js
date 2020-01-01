// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const path = require('path')
const os = require('os')
const fs = require('fs'); // 引入fs模块
const { BrowserWindow } = require('electron').remote
const puppeteer = require('puppeteer');
const { ipcRenderer } = require('electron')
window.addEventListener('DOMContentLoaded', () => {
  console.log('---setmesg---')
  ipcRenderer.send('preload-js-msg', 'ping')
  setTimeout(()=>{
    
  }, 5000)
});
// 生产pdf的浏览器
let browser

window.onload = async ()=>{
  browser = await puppeteer.launch();
  generatePdf();
  let res = await getDirFile('./out-test');
  console.log(res);
};

async function timeOut(t) {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve();
    },t)
  })
}
// 生产pdf
async function generatePdf () {
  let boxList = [...document.getElementsByClassName('TopstoryItem')];
  let overCount = 0

  for(let i = 0;i<boxList.length;i++) {
    let e = boxList[i];
    let more =  e.getElementsByClassName('ContentItem-more');
    overCount ++
    if(more[0]) {
      console.log(`${overCount}--${boxList.length}`)
      more[0].click();
      await timeOut(500);
      let innerText = await dowItemToHtml(e, i);
      console.log('click---'+i+'over;')
      if(overCount === boxList.length) {
        console.log('完成了；--');
        browser.close();
      }
    }
  }
}
// 获取文件夹所有文件名
function getDirFile (dir) {
  return new Promise((resolve)=>{
    fs.readdir(dir, function(err, files) {
      resolve(files)
    })
  })
}

async function dowItemToHtml(box,key) {
  let str1 = document.getElementsByTagName('head')[0].innerHTML;
  let str2 = box.outerHTML;
  let nameDom = box.getElementsByClassName('ContentItem-title')[0].getElementsByTagName('a')[0];
  let name = nameDom.innerText + 'xxx' + nameDom.href.substr(nameDom.href.lastIndexOf('/')+1)
  await writeFile(`./out-test/${name}.html`, str1+str2);
  let p = path.join(__dirname, `out-test/${name}.html`)

  await downloadPdf(p,`./out-test/`,`${name}`)
  return new Promise((resolve)=>{
    resolve(box.outerHTML)
  })
};
// html转pdf
async function downloadPdf(url, path, name) {
  await console.log('Save path: ' + path + name + '.pdf');
  const page = await browser.newPage();
  await page.setViewport({
      width: 200,
      height: 1000
  })
  //networkidle2: consider navigation to be finished when there are no more than 2 network connections for at least 500 ms.
  await page.goto(url, {waitUntil: 'networkidle2'});
  await page.pdf({path: path + name + '.pdf', format: 'A4'});
  await page.close()
}



async function writeFile (url,data) {
  return new Promise((resolve)=>{
// 写入文件内容（如果文件不存在会创建一个文件）
// 传递了追加参数 { 'flag': 'w' } console.log(path.join(__dirname, 'out-test/preload.js'))
  fs.writeFile(url, data, { 'flag': 'w',encoding:'utf-8' }, function(err) {
    if (err) {
        throw err;
    }
    console.log('写入文件成功');
    resolve();
    // 写入成功后读取测试
    // fs.readFile('./try4.txt', 'utf-8', function(err, data) {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log(data);
    // });
  });
  })
}

