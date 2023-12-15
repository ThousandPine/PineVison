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
    save: (crop) => ipcRenderer.send('image:save', crop),
    addImgLoadListener: (listener) => img.addEventListener('load', listener),
    rotate: (clockwish) => ipcRenderer.send('image:rotate', clockwish),
    flip: (flipType) => ipcRenderer.send('image:flip', flipType),
    brightContrast: (bright, contrast) => ipcRenderer.send('image:bc', bright, contrast),
    exposure: (exposure) => ipcRenderer.send('image:exposure', exposure),
    saturation: (saturation) => ipcRenderer.send('image:saturation', saturation),
    colorTemp: (colorTemp) => ipcRenderer.send('image:colorTemp', colorTemp),
    colorHue: (colorHue) => ipcRenderer.send('image:colorHue', colorHue),
    sharpen: (sharpen) => ipcRenderer.send('image:sharpen', sharpen),
    blur: (blur) => ipcRenderer.send('image:blur', blur),
    equalizeHist: () => ipcRenderer.send('image:equalizeHist'),
    curve: (curves) => ipcRenderer.send('image:curve', curves),
    // 
    getImage: (layerIndex) => ipcRenderer.invoke('image:get', layerIndex)
})

ipcRenderer.addListener('image:update', (evnet, imgBuffer) => {
    const blob = new Blob([imgBuffer], { type: 'image' })
    img.src = URL.createObjectURL(blob)
})