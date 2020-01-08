(()=>{

const { remote } = require('electron')
const { Menu, MenuItem } = remote


// 方式1
// const menu = new Menu()
// menu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked') } }))
// menu.append(new MenuItem({ type: 'separator' }))
// menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
// 方式2
const tem = [
    { role: 'reload' },
    { 
        label: 'MenuItem1', 
        click() {
            console.log('item 1 clicked')
         } 
    },
    {
        label: '菜单二',
        click () {

        }
    },
    {
        label: 'View',
        submenu: [
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
]
const menu = Menu.buildFromTemplate(tem)
window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  menu.popup({ window: remote.getCurrentWindow() })
}, false)




})()