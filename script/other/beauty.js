const electron = require('electron');
const { BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const fetch = require('../../common/fetch')
const config = require('../../common/config')
const {makeDir} =require('../../common/util')
let mainWindow;

async function createWindow() {
    const Menu = electron.Menu
    Menu.setApplicationMenu(null)
    // Create the browser window.
    mainWindow = new BrowserWindow({
        // width: 800,
        // height: 500,
        webPreferences: {
            devTools: true, //  Boolean (可选) - 是否开启 DevTools. 如果设置为 false, 则无法使用
            // Boolean (可选) - 是否集成Node，默认为false
            nodeIntegration: true,
            webviewTag: true,
        }
    })
    mainWindow.webContents.openDevTools()
    await mainWindow.loadFile(path.join(__dirname,'/index.html'))
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

let totalCount = 0
let successCount = 0
function saveImgBase64Data (base_64_url, WH) {
    var fs = require("fs");  // 引入fs模块
    makeDir(`${config.outputDir}/美女`)
    var base64 = base_64_url.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
    var dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象，
    var distPath = `${config.outputDir}/美女/${dataBuffer.length}-${WH}.png`
    if (fs.existsSync(distPath)) {
    } else {
        fs.writeFileSync(distPath,dataBuffer);
        successCount ++
    }
    totalCount ++
    console.log(`${successCount}/${totalCount}`)
}

ipcMain.on('callFunction', function (event, data) {
    if (data.name === 'base64') {
       saveImgBase64Data(data.data, data.WH)
    }
})


module.exports = {
    createWindow,
    mainWindow
}
