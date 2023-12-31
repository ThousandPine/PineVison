const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('state', {
    new: () => ipcRenderer.send('state:new'),
    save: () => ipcRenderer.send('state:save'),
    cancel: () => ipcRenderer.send('state:cancel')
})

const img = new Image()

contextBridge.exposeInMainWorld('img', {
    curImage: img,
    open: () => ipcRenderer.invoke('image:open'),
    get: () => ipcRenderer.send('image:get'),
    addImgLoadListener: (listener) => img.addEventListener('load', listener),
    crop: (crop) => ipcRenderer.send('image:crop', crop),
    rotate: (clockwish) => ipcRenderer.send('image:rotate', clockwish),
    flip: (flipType) => ipcRenderer.send('image:flip', flipType),
    light: (light) => ipcRenderer.send('image:light', light),
    color: (color) => ipcRenderer.send('image:color', color),
    curve: (curves) => ipcRenderer.send('image:curve', curves),
    post: (post) => ipcRenderer.send('image:post', post),
    watermark: (watermark) => ipcRenderer.send('image:watermark', watermark),
    selectWatermark: () => ipcRenderer.invoke('image:selectWatermark'),
})

ipcRenderer.addListener('image:update', (event, imgBuffer) => {
    const blob = new Blob([imgBuffer], { type: 'image' })
    img.src = URL.createObjectURL(blob)
})