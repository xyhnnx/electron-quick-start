

const electron = require('electron');
const {BrowserWindow} = require('electron')
const path = require('path');
console.log(electron);
let mainWindow;
function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        devTools: true, //  Boolean (可选) - 是否开启 DevTools. 如果设置为 false, 则无法使用
        // Boolean (可选) - 是否集成Node，默认为false
        nodeIntegration: true,
        preload: path.join(__dirname, 'zhihu-preload.js'),
        webviewTag: true
      }
    })
  
      // 打开控制台
    mainWindow.webContents.openDevTools ()
      // and load the index.html of the app.
    // mainWindow.loadFile('index.html')
    mainWindow.loadURL('https://www.zhihu.com')
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
  
    setTimeout(()=>{
      mainWindow.webContents.send('main-to-win-msg',{
        data: '主进程主动给渲染进程的信息'
      })
    },3000)
  }

  module.exports = {
    createWindow,
    mainWindow
  }