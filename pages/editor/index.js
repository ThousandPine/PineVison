// document.getElementById('read-btn').addEventListener('click', async () => {
//     window.img.open()
// })

// document.getElementById('save-btn').addEventListener('click', async () => {
//     window.img.save()
// })
import { enableCropBox, disableCropBox } from './cropper/cropBox.js'

const canvasInit = async () => {
    window.img.init()
    enableCropBox()
}
canvasInit()

let a = 0
document.getElementById('test-btn').addEventListener('click', () => {
    if(a) {
        enableCropBox()
        a = 0
    } else {
        disableCropBox()
        a = 1
    }

})