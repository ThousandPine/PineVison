import { setCropSize, setCropPos } from "./cropBox.js";

const heightInput = document.getElementById('h-input')
const widthInput = document.getElementById('w-input')
const xInput = document.getElementById('x-input')
const yInput = document.getElementById('y-input')

export function updatePanel(crop) {
    heightInput.value = crop.height
    widthInput.value = crop.width
    xInput.value = crop.x
    yInput.value = crop.y
}

function updateSize () {
    setCropSize(heightInput.value, widthInput.value)
}

function updatePos () {
    setCropPos(xInput.value, yInput.value)
}

// 输入框事件
heightInput.addEventListener('change', updateSize)
widthInput.addEventListener('change', updateSize)
xInput.addEventListener('change', updatePos)
yInput.addEventListener('change', updatePos)

// 按钮事件
document.getElementById('left-rot-btn').addEventListener('click', () => window.img.rotate(false))
document.getElementById('right-rot-btn').addEventListener('click', () => window.img.rotate(true))
document.getElementById('vertical-flip-btn').addEventListener('click', () => window.img.flip(0))
document.getElementById('horizontal-flip-btn').addEventListener('click', () => window.img.flip(1))
