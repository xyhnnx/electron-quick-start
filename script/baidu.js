

const electron = require('electron');
const {BrowserWindow,ipcMain} = require('electron')
const path = require('path');
const fetch = require('./fetch')
ipcMain.on('baidu-preloadjs-msg', function (event,data) {
  console.log(`----baidu-preloadjs-msg----`)
  console.log(data)
})
setTimeout(()=>{
  // mainWindow.webContents.send('main-to-win-msg',{
  //   data: '主进程主动给渲染进程的信息'
  // })
},3000)
let mainWindow;
async function createWindow () {
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
    mainWindow.webContents.openDevTools ()
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
    getSearchData('mm');
  }

  async function getSearchData (search) {
    let url = `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=&cl=2&lm=&ie=utf-8&oe=utf-8&adpicid=&st=&z=&ic=&word=${search}&s=&se=&tab=&width=&height=&face=&istype=&qc=&nc=&fr=&cg=head&pn=&rn=&gsm=3c&1505874585547=`;
    let res = await fetch({
      url
    })
    console.log('----fetch---')
    mainWindow.webContents.send('main-to-win-msg',res)
  }


  module.exports = {
    createWindow,
    mainWindow
  }