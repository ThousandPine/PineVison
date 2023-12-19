const canvas = document.getElementById('preview-canvas')
const ctx = canvas.getContext('2d')

window.img.get()

// 添加图像更新事件
window.img.addImgLoadListener(() => {
    canvas.width = window.img.curImage.width
    canvas.height = window.img.curImage.height
    ctx.drawImage(window.img.curImage, 0, 0)
})

export function enablePreview() {
    canvas.style.display = ''
}

export function disablePreview() {
    canvas.style.display = 'none'
}