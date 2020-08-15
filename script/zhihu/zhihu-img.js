const electron = require('electron');
const { BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const fetch = require('../../common/fetch')
let mainWindow;

async function createWindow() {
  const Menu = electron.Menu
  Menu.setApplicationMenu(null)
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: '100%',
    height: '100%',
    webPreferences: {
      devTools: true, //  Boolean (可选) - 是否开启 DevTools. 如果设置为 false, 则无法使用
      // Boolean (可选) - 是否集成Node，默认为false
      nodeIntegration: true,
      preload: path.join(__dirname, 'zhihu-img-preload.js'),
      webviewTag: true,
    }
  })

  // 打开控制台
  mainWindow.webContents.openDevTools()
  await mainWindow.loadURL(`https://www.zhihu.com/question/311387348/answer/1091144825`)

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
