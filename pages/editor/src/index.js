import { enablePreview } from './preview.js'

const canvasInit = async () => {
    await window.img.init()
    enablePreview()
}
canvasInit()