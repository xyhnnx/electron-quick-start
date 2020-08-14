const electron = require('electron');
const { BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const fetch = require('./fetch')
ipcMain.on('baidu-preloadjs-msg', function (event, data) {
  console.log(`----baidu-preloadjs-msg----`)
  console.log(data)
})
setTimeout(() => {
  // mainWindow.webContents.send('main-to-win-msg',{
  //   data: '主进程主动给渲染进程的信息'
  // })
}, 3000)
let mainWindow;

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      devTools: true, //  Boolean (可选) - 是否开启 DevTools. 如果设置为 false, 则无法使用
      // Boolean (可选) - 是否集成Node，默认为false
      nodeIntegration: true,
      preload: path.join(__dirname, 'baidu-preload.js'),
      webviewTag: true
    }
  })

  // 打开控制台
  mainWindow.webContents.openDevTools()
  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  await mainWindow.loadURL('https://www.baidu.com')
  // let view = new BrowserView()
  // mainWindow.setBrowserView(view)
  // view.setBounds({ x: 0, y: 0, width: 500, height: 500 })
  // view.webContents.loadURL('https://www.zhihu.com')
  // console.log('-------------');
  // console.log(view);


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  getSearchData('图片');
}

async function getSearchData(search) {
  // http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=%E5%9B%BE%E7%89%87&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=&z=&ic=&hd=&latest=&copyright=&word=%E5%9B%BE%E7%89%87&s=&se=&tab=&width=&height=&face=&istype=&qc=&nc=1&fr=&expermode=&force=&pn=270&rn=30&gsm=10e&1583982272355=
  let url = `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord${search}&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=9&ic=&hd=&latest=&copyright=&word=%E7%BE%8E%E5%A5%B3&s=&se=&tab=&width=0&height=0&face=0&istype=2&qc=&nc=1&fr=&expermode=&force=&pn=1&rn=1000&gsm=&1578714473113=`;
  let res = await fetch({
    url
  })
  console.log('----fetch---')
  mainWindow.webContents.send('main-to-win-msg', res)
}


module.exports = {
  createWindow,
  mainWindow
}
