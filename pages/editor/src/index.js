import { enablePreview } from './preview.js'

const canvasInit = async () => {
    await window.img.init()
}
canvasInit()

document.getElementById('test-btn').addEventListener('click', () => {
    window.img.open()
})