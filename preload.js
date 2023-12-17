const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('state', {
    back: () => ipcRenderer.send('state:back'),
    forward: () =>  ipcRenderer.send('state:forward'),
    save: () => ipcRenderer.send('state:save')
})

const img = new Image()

contextBridge.exposeInMainWorld('img', {
    curImage: img,
    init: () => ipcRenderer.send('image:init'),
    open: () => ipcRenderer.send('image:open'),
    save: () => ipcRenderer.send('image:save'),
    get: () => ipcRenderer.send('image:get'),
    addImgLoadListener: (listener) => img.addEventListener('load', listener),
    crop: (crop) => ipcRenderer.send('image:crop', crop),
    rotate: (clockwish) => ipcRenderer.send('image:rotate', clockwish),
    flip: (flipType) => ipcRenderer.send('image:flip', flipType),
    light: (light) => ipcRenderer.send('image:light', light),
    color: (color) => ipcRenderer.send('image:color', color),
    curve: (curves) => ipcRenderer.send('image:curve', curves),
    post: (post) => ipcRenderer.send('image:post', post),
})

ipcRenderer.addListener('image:update', (event, imgBuffer) => {
    const blob = new Blob([imgBuffer], { type: 'image' })
    img.src = URL.createObjectURL(blob)
})