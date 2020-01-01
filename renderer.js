// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer,remote } = require('electron')
// 按钮
let btn1 = document.querySelector('#btn1');
btn1.addEventListener('click',()=>{
    //在渲染器进程 (网页) 中。
    console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
    ipcRenderer.send('asynchronous-message', 'ping')
})


// 按钮
let btn2 = document.querySelector('#btn2');
btn2.addEventListener('click',()=>{
    console.log(remote.getCurrentWindow().openDevTools())
})

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg) // prints "pong"
    })
ipcRenderer.on('main-to-win-msg',(e,data)=>{
    console.log(data);
})


// 
const webview = document.querySelector('#webview');
console.log(webview.webContents)
const loadstart = () => {
  console.log('webview-loadstart')
}
const loadstop = () => {
    console.log('webview-loadstop')
}
webview.addEventListener('did-start-loading', loadstart)
webview.addEventListener('did-stop-loading', loadstop)