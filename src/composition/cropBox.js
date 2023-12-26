/// 裁剪框行为

import { enablePreview, disablePreview } from '../preview.js'
import { updatePanel } from './panel.js'

const cropCanvas = document.querySelector('.cropper')
const cropBox = document.querySelector('.cropper-crop-box')
const cropBoxImg = document.querySelector('.crop-box-img')
const cropMaskImg = document.querySelector('.bg-mask-img')

const CROP_RESERVE = 10 // 最小裁剪区域百分比
const cropMargin = { top: 0, right: 0, bottom: 0, left: 0 } // 记录裁剪框边界距离（百分比）
let curImage = window.img.curImage

// 添加图像更新事件
window.img.addImgLoadListener(() => {
    cropBoxImg.src = cropMaskImg.src = curImage.src
    updatePanel(getCropInfo())
})

window.img.get()

/* 显示裁剪框 */
export function enableCropBox() {
    cropCanvas.style.display = ''
    disablePreview()
    applyCropMargin()
}

/* 关闭裁剪框 */
export function disableCropBox() {
    cropCanvas.style.display = 'none'
    enablePreview()
}

/* 设置裁剪框位置 */
export function setCropPos(x, y) {
    // 转换为界面坐标
    const canvasPos = {
        x: x * cropCanvas.clientWidth / curImage.width,
        y: y * cropCanvas.clientHeight / curImage.height
    }
    // 计算界面偏移
    const offset = {
        x: canvasPos.x - cropMargin.left * cropCanvas.clientWidth / 100,
        y: canvasPos.y - cropMargin.top * cropCanvas.clientHeight / 100
    }
    // 使用偏移函数
    offsetCropper(offset)
}

/* 设置裁剪框大小 */
export function setCropSize(height, width) {
    const vRate = Math.max(CROP_RESERVE, Math.min(100, 100 * height / curImage.height)) // 调整上下限为[CROP_RESERVE, 100]
    const vDelta = vRate - (100 - cropMargin.top - cropMargin.bottom)

    // 增加长度
    if (vDelta > 0) {
        if (cropMargin.top < vDelta / 2) {
            cropMargin.bottom -= vDelta - cropMargin.top
            cropMargin.top = 0
        }
        else if (cropMargin.bottom < vDelta / 2) {
            cropMargin.top -= vDelta - cropMargin.bottom
            cropMargin.bottom = 0
        }
        else {
            cropMargin.top -= vDelta / 2
            cropMargin.bottom -= vDelta / 2
        }
    }
    // 减少长度
    else if (vDelta < 0) {
        cropMargin.top -= vDelta / 2
        cropMargin.bottom -= vDelta / 2
    }

    const hRate = Math.max(CROP_RESERVE, Math.min(100, 100 * width / curImage.width)) // 调整上下限为[CROP_RESERVE, 100]
    const hDelta = hRate - (100 - cropMargin.left - cropMargin.right)

    // 增加宽度
    if (hDelta > 0) {
        if (cropMargin.left < hDelta / 2) {
            cropMargin.right -= hDelta - cropMargin.left
            cropMargin.left = 0
        }
        else if (cropMargin.right < hDelta / 2) {
            cropMargin.left -= hDelta - cropMargin.right
            cropMargin.right = 0
        }
        else {
            cropMargin.left -= hDelta / 2
            cropMargin.right -= hDelta / 2
        }
    }
    // 减少宽度
    else if (hDelta < 0) {
        cropMargin.left -= hDelta / 2
        cropMargin.right -= hDelta / 2
    }

    // 应用修改
    applyCropMargin()
}

/* 裁剪框信息 */
export const getCropInfo = () => ({
    x: parseInt(cropMargin.left * curImage.width / 100),
    y: parseInt(cropMargin.top * curImage.height / 100),
    height: parseInt((100 - cropMargin.top - cropMargin.bottom) * curImage.height / 100),
    width: parseInt((100 - cropMargin.left - cropMargin.right) * curImage.width / 100)
})

/* 应用裁剪框设置 */
function applyCropMargin() {
    // 设置裁剪框大小
    cropBox.style.top = cropMargin.top + '%'
    cropBox.style.left = cropMargin.left + '%'
    cropBox.style.bottom = cropMargin.bottom + '%'
    cropBox.style.right = cropMargin.right + '%'
    // 设置内部图像显示区域
    cropBoxImg.style.clipPath = `inset(${cropMargin.top}% ${cropMargin.right}% ${cropMargin.bottom}% ${cropMargin.left}%)`
    // 更新面版信息
    const crop = getCropInfo()
    updatePanel(crop)
}

/* 通过偏移量调整裁剪框（用于鼠标拖拽） */
function offsetCropper(offset) {
    // 上边距
    if (offset.n) {
        cropMargin.top += 100 * offset.n / cropCanvas.clientHeight
        cropMargin.top = Math.min(cropMargin.top, 100 - CROP_RESERVE - cropMargin.bottom)
    }
    // 下边距
    if (offset.s) {
        cropMargin.bottom += 100 * -offset.s / cropCanvas.clientHeight
        cropMargin.bottom = Math.min(cropMargin.bottom, 100 - CROP_RESERVE - cropMargin.top)
    }
    // 左边距
    if (offset.w) {
        cropMargin.left += 100 * offset.w / cropCanvas.clientWidth
        cropMargin.left = Math.min(cropMargin.left, 100 - CROP_RESERVE - cropMargin.right)
    }
    // 右边距
    if (offset.e) {
        cropMargin.right += 100 * -offset.e / cropCanvas.clientWidth
        cropMargin.right = Math.min(cropMargin.right, 100 - CROP_RESERVE - cropMargin.left)
    }
    // 水平位置
    if (offset.x) {
        let rate = 100 * offset.x / cropCanvas.clientWidth
        rate = Math.max(rate, -cropMargin.left)
        rate = Math.min(rate, cropMargin.right)
        cropMargin.left += rate
        cropMargin.right -= rate
    }
    // 垂直位置
    if (offset.y) {
        let rate = 100 * offset.y / cropCanvas.clientHeight
        rate = Math.max(rate, -cropMargin.top)
        rate = Math.min(rate, cropMargin.bottom)
        cropMargin.top += rate
        cropMargin.bottom -= rate
    }

    // 四边距下限为0
    for (let key in cropMargin) {
        cropMargin[key] = Math.max(cropMargin[key], 0)
    }

    // 应用调整
    applyCropMargin()
}

/* 鼠标按下事件函数模板 */
function mouseDownFunc(event, getOffset) {
    let pre = event

    document.onmousemove = (event) => {
        offsetCropper(getOffset(event, pre))
        pre = event
    }
    document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
    }
}

// 添加鼠标按下事件
document.querySelector('.line-n').addEventListener('mousedown', (event) => {
    mouseDownFunc(event, (now, pre) => ({ n: now.clientY - pre.clientY }))
})
document.querySelector('.line-s').addEventListener('mousedown', (event) => {
    mouseDownFunc(event, (now, pre) => ({ s: now.clientY - pre.clientY }))
})
document.querySelector('.line-w').addEventListener('mousedown', (event) => {
    mouseDownFunc(event, (now, pre) => ({ w: now.clientX - pre.clientX }))
})
document.querySelector('.line-e').addEventListener('mousedown', (event) => {
    mouseDownFunc(event, (now, pre) => ({ e: now.clientX - pre.clientX }))
})
document.querySelector('.point-nw').addEventListener('mousedown', (event) => {
    mouseDownFunc(event, (now, pre) => ({ n: now.clientY - pre.clientY, w: now.clientX - pre.clientX }))
})
document.querySelector('.point-ne').addEventListener('mousedown', (event) => {
    mouseDownFunc(event, (now, pre) => ({ n: now.clientY - pre.clientY, e: now.clientX - pre.clientX }))
})
document.querySelector('.point-sw').addEventListener('mousedown', (event) => {
    mouseDownFunc(event, (now, pre) => ({ s: now.clientY - pre.clientY, w: now.clientX - pre.clientX }))
})
document.querySelector('.point-se').addEventListener('mousedown', (event) => {
    mouseDownFunc(event, (now, pre) => ({ s: now.clientY - pre.clientY, e: now.clientX - pre.clientX }))
})
document.querySelector('.cropper-move').addEventListener('mousedown', (event) => {
    mouseDownFunc(event, (now, pre) => ({ x: now.clientX - pre.clientX, y: now.clientY - pre.clientY }))
})
