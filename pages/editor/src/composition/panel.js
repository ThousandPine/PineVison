import { openPanel } from "../sidebar.js"
import { enableCropBox, disableCropBox } from "./cropBox.js"

const heightValue = document.getElementById('crop-height-value')
const widthValue = document.getElementById('crop-width-value')
const xValue = document.getElementById('crop-x-value')
const yValue = document.getElementById('crop-y-value')
let cropInfo

export function updatePanel(crop) {
    cropInfo = crop
    heightValue.innerHTML = crop.height
    widthValue.innerHTML = crop.width
    xValue.innerHTML = crop.x
    yValue.innerHTML = crop.y
}


document.getElementById('rotate-left-btn').addEventListener('click', () => {
    window.img.rotate(false)
    window.state.save()
})
document.getElementById('rotate-right-btn').addEventListener('click', () => {
    window.img.rotate(true)
    window.state.save()
})

document.getElementById('flip-h-btn').addEventListener('click', () => {
    window.img.flip(0)
    window.state.save()
})
document.getElementById('flip-v-btn').addEventListener('click', () => {
    window.img.flip(1)
    window.state.save()
})

document.getElementById('composition-btn').addEventListener('click', () => {
    const panel = document.getElementById('composition-panel')
    openPanel(
        () => {
            enableCropBox()
            panel.style.display = ''
        },
        () => {
            disableCropBox()
            window.img.crop(cropInfo)
            panel.style.display = 'none'
        })
})