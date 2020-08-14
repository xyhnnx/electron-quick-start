// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const path = require('path')
const os = require('os')
const fs = require('fs'); // 引入fs模块
const electron = require('electron')
const puppeteer = require('puppeteer');
const { ipcRenderer } = require('electron')
const{makeDir} = require('../../common/util')
const config = require('../../common/config')
window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('preload-js-msg', 'DOMContentLoaded')
});
// 生产pdf的浏览器
let browser
// pdf 文件产出路径
const outputDir = `${config.outputDir}/zhihu`
makeDir(outputDir + '/html');
makeDir(outputDir + '/pdf');
// 生产pdf文件的数量
const pdfCount = 100;

window.onload = async ()=>{
  let res = await getDirFile(`${outputDir}/pdf`);
console.log(res);
  browser = await puppeteer.launch();
  generatePdf();
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
      console.log(`开始生成第${overCount}/${boxList.length}条`)
      more[0].click();
      await timeOut(50);
      try
      {
         // 等待dom生成html
        console.log('正在生成html文件');
        let {filePath, fileName} = await DOMToHtml(e, i);
        if(fs.existsSync(filePath)) {
          // html转pdf
          console.log('正在生成pdf文件');
          await downloadPdf(filePath,`${outputDir}/pdf/`,`${fileName}`)
        }
      }finally {
      }
      if(overCount === boxList.length) {
        let res = await getDirFile(`${outputDir}/pdf`);
        console.log(`已生成${res.length}条pdf文件`);
        browser.close();
        if(res.length <pdfCount) {
          console.log('本页面生成pdf完毕。开始刷新页面 reload');
          location.reload()
        }
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

async function DOMToHtml(box,key) {
  let str1 = document.getElementsByTagName('head')[0].innerHTML;
  let str2 = box.outerHTML;
  let nameDom = box.getElementsByClassName('ContentItem-title')[0].getElementsByTagName('a')[0];
  let name = nameDom.innerText + '__' + nameDom.href.substr(nameDom.href.lastIndexOf('/')+1);
  // name = encodeURI(name);
  name = name.replace(/\\/g,'')
  console.log(name);
  await writeFile(`${outputDir}/html/${name}.html`, str1+str2);
  let p = path.join(__dirname.substring(0,2), `${outputDir}/html/${name}.html`)
  return new Promise((resolve)=>{
    resolve({
      filePath: p,
      fileName: name
    });
  })
};
// html转pdf
async function downloadPdf(url, path, name) {
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
        console.log(`文件写入失败-${err}`)
        resolve(false);
    }
    console.log('写入文件成功');
    resolve(true);
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

ipcRenderer.on('main-to-win-msg',(e,data)=>{
  console.log(data);
})
