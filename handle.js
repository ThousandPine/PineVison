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

    const buffer = loadImage(path.join(__dirname, 'test.jpg'))
    sendImageData(event.sender, buffer)
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
    const buffer = loadImage(path[0])

    sendImageData(event.sender, buffer)
})

ipcMain.on('image:save', (event, crop) => {
    if (crop) {
        curImage.data = addon.crop(curImage.data, crop)
        sendImageData(event.sender, curImage.data)
    }
    fs.writeFileSync(path.join(__dirname, 'out.png'), curImage.data)
})

ipcMain.on('image:rotate', (evnet, clockwish) => {
    curImage.data = addon.rotate(curImage.data, clockwish)
    sendImageData(evnet.sender, curImage.data)
})

ipcMain.on('image:flip', (evnet, flipType) => {
    curImage.data = addon.flip(curImage.data, flipType)
    sendImageData(evnet.sender, curImage.data)
})

ipcMain.on('image:light', (event, light) => {
    sendImageData(event.sender, addon.light(curImage.data, light))
})

ipcMain.on('image:saturation', (event, saturation) => {
    sendImageData(event.sender, addon.saturation(curImage.data, saturation))
})

ipcMain.on('image:colorTemp', (event, colorTemp) => {
    sendImageData(event.sender, addon.colorTemp(curImage.data, colorTemp))
})

ipcMain.on('image:colorHue', (event, colorHue) => {
    sendImageData(event.sender, addon.colorHue(curImage.data, colorHue))
})

ipcMain.on('image:sharpen', (event, sharpen) => {
    sendImageData(event.sender, addon.sharpen(curImage.data, sharpen))
})

ipcMain.on('image:blur', (event, blur) => {
    sendImageData(event.sender, addon.blur(curImage.data, blur))
})

ipcMain.on('image:curve', (event, curves) => {
    sendImageData(event.sender, addon.curve(curImage.data, curves))
})