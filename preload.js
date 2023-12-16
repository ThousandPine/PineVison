const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('win', {
    minimize: () => ipcRenderer.send('win:minimize'),
    maximize: () =>  ipcRenderer.invoke('win:maximize'),
    close: () => ipcRenderer.send('win:close')
})

const img = new Image()

contextBridge.exposeInMainWorld('img', {
    curImage: img,
    init: () => ipcRenderer.send('image:init'),
    open: () => ipcRenderer.send('image:open'),
    save: () => ipcRenderer.send('image:save'),
    addImgLoadListener: (listener) => img.addEventListener('load', listener),
    crop: (crop) => ipcRenderer.send('image:crop', crop),
    rotate: (clockwish) => ipcRenderer.send('image:rotate', clockwish),
    flip: (flipType) => ipcRenderer.send('image:flip', flipType),
    light: (light) => ipcRenderer.send('image:light', light),
    color: (color) => ipcRenderer.send('image:color', color),
    curve: (curves) => ipcRenderer.send('image:curve', curves),
})

ipcRenderer.addListener('image:update', (evnet, imgBuffer) => {
    const blob = new Blob([imgBuffer], { type: 'image' })
    img.src = URL.createObjectURL(blob)
})