// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, BrowserView, shell} = require('electron')
const path = require('path')
const os = require('os')
const {spawn} = require('child_process')
const { ipcMain } = require('electron')
// const shell = electron.shell
require('./script/main-menu');

// spawn('www.exe',['D:\英雄联盟\TCLS'])

// Menu.setApplicationMenu(null);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      devTools: true, //  Boolean (可选) - 是否开启 DevTools. 如果设置为 false, 则无法使用
      // Boolean (可选) - 是否集成Node，默认为false
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
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
    // 
    mainWindow.webContents.send('main-to-win-msg',{
      data: '主进程主动给渲染进程的信息'
    })
  },3000)
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// 在主进程中.

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})
ipcMain.on('preload-js-msg', function (event) {
  console.log('preload-js-msg')
})