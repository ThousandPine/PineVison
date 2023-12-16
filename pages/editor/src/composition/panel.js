import { setCropSize, setCropPos, enableCropBox, disableCropBox } from "./cropBox.js";
import { togglePanel } from "../navigation.js";

const panel = document.getElementById('composition-panel')

document.getElementById('composition-btn').addEventListener('click', () => {
    togglePanel(panel,
        () => {
            enableCropBox()
            panel.style.display = ''
        },
        () => {
            disableCropBox()
            panel.style.display = 'none'
        })
})

const heightInput = document.getElementById('crop-height-input')
const widthInput = document.getElementById('crop-width-input')
const xInput = document.getElementById('crop-x-input')
const yInput = document.getElementById('crop-y-input')
const rotateValue = document.getElementById('rotate-value')
let rotateTimes = 0

export function updatePanel(crop) {
    heightInput.value = crop.height
    widthInput.value = crop.width
    xInput.value = crop.x
    yInput.value = crop.y
}

function updateSize() {
    setCropSize(heightInput.value, widthInput.value)
}

function updatePos() {
    setCropPos(xInput.value, yInput.value)
}

heightInput.addEventListener('change', updateSize)
widthInput.addEventListener('change', updateSize)

xInput.addEventListener('change', updatePos)
yInput.addEventListener('change', updatePos)

document.getElementById('rotate-left-btn').addEventListener('click', () => {
    window.img.rotate(false)
    rotateTimes = (rotateTimes + 3) % 4
    rotateValue.innerHTML = 90 * rotateTimes + '°'
})
document.getElementById('rotate-right-btn').addEventListener('click', () => {
    window.img.rotate(true)
    rotateTimes = ++rotateTimes % 4
    rotateValue.innerHTML = 90 * rotateTimes + '°'
})

document.getElementById('flip-h-btn').addEventListener('click', () => window.img.flip(0))
document.getElementById('flip-v-btn').addEventListener('click', () => window.img.flip(1))
