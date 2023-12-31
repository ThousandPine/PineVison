const { ipcMain, BrowserWindow, Menu } = require('electron')
const { dialog } = require('electron')
const path = require('node:path')
const fs = require('fs')
const addon = require('./build/Release/addon')
const { send, eventNames } = require('node:process')

let state

function setMenu() {
    let menu = Menu.buildFromTemplate([
        {
            label: '文件',
            submenu: [
                { label: '打开', accelerator: 'CmdOrCtrl+O', click: () => openImage() },
                { label: '保存', accelerator: 'CmdOrCtrl+S', click: () => saveImage() }
            ]
        },
        {
            label: '编辑',
            submenu: [
                {
                    label: '撤销', accelerator: 'CmdOrCtrl+Z', click: () => {
                        state.back()
                        sendImageData(BrowserWindow.getFocusedWindow().webContents)
                    }
                },
                {
                    label: '重做', accelerator: 'CmdOrCtrl+R', click: () => {
                        state.forward()
                        sendImageData(BrowserWindow.getFocusedWindow().webContents)
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { label: 'Reload', accelerator: 'CmdOrCtrl+Shift+R', click: () => BrowserWindow.getFocusedWindow().reload() },
                { label: 'Toggle Developer Tools', accelerator: 'CmdOrCtrl+Shift+I', click: () => BrowserWindow.getFocusedWindow().webContents.toggleDevTools() }
            ]
        },
    ])

    Menu.setApplicationMenu(menu)
}

let counter = 0
function sendImageData(sender, data) {
    console.log('send img ', ++counter)
    sender.send('image:update', data ? data : state.current())
}

function saveImage() {
    const options = {
        filters: [{ name: 'Images', extensions: ['jpg', 'png'] }]
    }
    const path = dialog.showSaveDialogSync(options)
    if (path) {
        fs.writeFileSync(path, state.current())
    }

    ipcMain.on('image:get', (event) => {
        sendImageData(event.sender)
    })
}

function openImage(sender) {
    const options = {
        title: '选择图片',
        filters: [
            { name: 'Images', extensions: ['jpg', 'png'] }
        ],
        properties: ['openFile']
    }
    const path = dialog.showOpenDialogSync(options)
    if (path) {
        state = new State(fs.readFileSync(path[0]))
        sendImageData(sender ? sender : BrowserWindow.getFocusedWindow().webContents)
        return true
    }
    return false
}

ipcMain.handle('image:open', (event) => {
    if (openImage()) {
        setMenu()
        return true
    }
    return false
})

ipcMain.on('image:get', (event) => {
    sendImageData(event.sender)
})

ipcMain.handle('image:selectWatermark', (event) => {
    const options = {
        title: '选择水印图片',
        filters: [
            { name: 'Images', extensions: ['jpg', 'png'] }
        ],
        properties: ['openFile']
    }
    const path = dialog.showOpenDialogSync(options)[0]
    state.watermark = fs.readFileSync(path)
    return path
})

/* 图像处理事件 */
const processNames = ['crop', 'rotate', 'flip', 'light', 'color', 'curve', 'post']

for (const name of processNames) {
    ipcMain.on('image:' + name, (event, args) => {
        state.temp = addon[name](state.current(), args)
        sendImageData(event.sender, state.temp)
    })
}

ipcMain.on('image:watermark', (event, args) => {
    if (!state.watermark) {
        return
    }
    state.temp = addon.watermark(state.current(), state.watermark, args)
    sendImageData(event.sender, state.temp)
})

/*  */
ipcMain.on('state:new', (event) => {
    state.temp = state.current()
})
ipcMain.on('state:save', (event) => {
    state.save()
    state.temp = state.watermark = null
})
ipcMain.on('state:cancel', (event) => {
    state.temp = state.watermark = null
})

class State {
    constructor(img) {
        this.stack = [img]
        this.index = 0
    }

    current() {
        return this.stack[this.index]
    }

    save() {
        if (this.index < this.stack.length - 1) {
            this.stack.splice(this.index + 1, this.stack.length - 1 - this.index)
        }

        if (this.temp) {
            this.stack.push(this.temp)
            ++this.index
        }
        return
    }

    back() {
        if (this.index > 0) {
            --this.index
        }
    }

    forward() {
        if (this.index < this.stack.length - 1) {
            ++this.index
        }
    }
}