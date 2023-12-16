import { getCropInfo } from "./composition/cropBox.js"

const canvas = document.getElementById('preview-canvas')
const ctx = canvas.getContext('2d')

// 添加图像更新事件
window.img.addImgLoadListener(updateCanvas)

export function enablePreview() {
    canvas.style.display = ''
    updateCanvas()
}

export function disablePreview() {
    canvas.style.display = 'none'
}

function updateCanvas() {
    const crop = getCropInfo()
    canvas.width = crop.width
    canvas.height = crop.height
    ctx.drawImage(window.img.curImage, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
}