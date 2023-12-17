const { ipcMain, BrowserWindow } = require('electron')
const { dialog } = require('electron')
const path = require('node:path')
const fs = require('fs')
const addon = require('./build/Release/addon')
const { send, eventNames } = require('node:process')

ipcMain.on('win:minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win.minimize()
})

ipcMain.handle('win:maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    if (win.isMaximized()) {
        win.unmaximize()
        return false
    } else {
        win.maximize()
        return true
    }
})

ipcMain.on('win:close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win.close()
})

// 记录当前图像信息
const curImage = {}

function sendImageData(sender, imgBuffer) {
    console.log('send img')
    sender.send('image:update', imgBuffer)
}

function loadImage(path) {
    curImage.path = path
    curImage.data = fs.readFileSync(curImage.path)
    return curImage.data
}

ipcMain.on('image:init', (event) => {
    curImage.data = loadImage(path.join(__dirname, 'test.jpg'))
    sendImageData(event.sender, curImage.data)
})

ipcMain.on('image:open', (event) => {

    const options = {
        title: '选择图片',
        filters: [
            { name: 'Images', extensions: ['jpg', 'png'] }
        ],
        properties: ['openFile']
    }
    const path = dialog.showOpenDialogSync(options)
    curImage.data = loadImage(path[0])
    sendImageData(event.sender, curImage.data)
})

ipcMain.on('image:save', (event) => {
    if (curImage.crop) {
        curImage.data = addon.crop(curImage.data, curImage.crop)
        sendImageData(event.sender, curImage.data)
    }
    fs.writeFileSync(path.join(__dirname, 'out.png'), curImage.data)
})

ipcMain.on('image:crop', (event, crop) => {
    curImage.crop = crop
})

ipcMain.on('image:rotate', (event, clockwish) => {
    curImage.data = addon.rotate(curImage.data, clockwish)
    sendImageData(event.sender, curImage.data)
})

ipcMain.on('image:flip', (event, flipType) => {
    curImage.data = addon.flip(curImage.data, flipType)
    sendImageData(event.sender, curImage.data)
})

/* 处理流水线 */
const processNames = ['light', 'color', 'curve', 'post']
const processInfo = {}

for (const name of processNames) {
    ipcMain.on('image:' + name, (event, info) => {
        // 保存信息
        processInfo[name] = info

        // 遍历处理流程
        let buffer = curImage.data
        for (const name of processNames) {
            if (!processInfo[name])
            {
                continue;
            }
            buffer = addon[name](buffer, processInfo[name])
        }
        sendImageData(event.sender, buffer)
    })
}