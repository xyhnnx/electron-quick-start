const electron = require('electron');
const { BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const fetch = require('../../common/fetch')
ipcMain.on('baidu-preloadjs-msg', function (event, data) {
  console.log(`----baidu-preloadjs-msg----`)
  console.log(data)
})
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
      preload: path.join(__dirname, 'baidu-img-preload.js'),
      webviewTag: true,
    }
  })

  // 打开控制台
  mainWindow.webContents.openDevTools()
  let word = '美女'
  await mainWindow.loadURL(`https://image.baidu.com/search/index?tn=baiduimage&ipn=r&ct=201326592&cl=2&lm=-1&st=-1&sf=1&fmq=&pv=&ic=0&nc=1&z=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&fm=index&pos=history&word=${word}`)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


module.exports = {
  createWindow,
  mainWindow
}
