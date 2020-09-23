// Modules to control application life and create native browser window
const {app, ipcMain, BrowserWindow, Menu, BrowserView, shell, globalShortcut } = require('electron')
const path = require('path')
const os = require('os')
const {spawn} = require('child_process')
// const shell = electron.shell
// 菜单
// require('./script/main-menu');

// Menu.setApplicationMenu(null);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let {createWindow, mainWindow} = require('./script/other/beauty')
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

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl + p', () => {
    console.log('CommandOrControl+X is pressed')
  })
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
ipcMain.on('preload-js-msg', function (event,data) {
  console.log(`preload-js-msg:${data}`)
  console.log(data)
})
