document.getElementById('read-btn').addEventListener('click', async () => {
    window.img.open()
})

document.getElementById('save-btn').addEventListener('click', async () => {
    window.img.save()
})

const canvasInit = async () => {
    window.img.init()
}
canvasInit()