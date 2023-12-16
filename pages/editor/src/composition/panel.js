const heightValue = document.getElementById('crop-height-value')
const widthValue = document.getElementById('crop-width-value')
const xValue = document.getElementById('crop-x-value')
const yValue = document.getElementById('crop-y-value')
const rotateValue = document.getElementById('rotate-value')
let rotateTimes = 0

export function updatePanel(crop) {
    heightValue.innerHTML = crop.height
    widthValue.innerHTML = crop.width
    xValue.innerHTML = crop.x
    yValue.innerHTML = crop.y
}


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
