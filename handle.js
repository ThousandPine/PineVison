const { ipcMain, BrowserWindow } = require('electron')
const { dialog } = require('electron')
const path = require('node:path')
const fs = require('fs')
const addon = require('./build/Release/addon')
const { send, eventNames } = require('node:process')

let state

function sendImageData(sender, data) {
    console.log('send img')
    sender.send('image:update', data ? data : state.current())
}

ipcMain.handle('image:open', (event) => {
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
        sendImageData(event.sender)
        return true
    }
    return false
})

// TODO: 
ipcMain.on('image:save', (event) => {
    const options = {
        filters: [{ name: 'Images', extensions: ['jpg', 'png'] }]
      }
    const path = dialog.showSaveDialogSync(options)
    console.log(path)
    if (path) {
        fs.writeFileSync(path, state.current())
    }
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
ipcMain.on('state:back', (event) => {
    state.back()
    sendImageData(event.sender)
})
ipcMain.on('state:forward', (event) => {
    state.forward()
    sendImageData(event.sender)
})
ipcMain.on('state:save', (event) => {
    state.save()
    state.watermark = null
})

class State {
    constructor(img) {
        this.temp = img
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