const brightInput = document.getElementById('bright-input')
const contrastInput = document.getElementById('contrast-input')
const exposureInput = document.getElementById('exposure-input')
const saturationInput = document.getElementById('saturation-input')
const colorTempInput = document.getElementById('colorTemp-input')
const colorHueInput = document.getElementById('colorHue-input')
const sharpenInput = document.getElementById('sharpen-input')
const blurInput = document.getElementById('blur-input')
const equalizeHistBtn = document.getElementById('equalizeHist-btn')

function updateBC() {
    window.img.brightContrast(parseInt(brightInput.value), parseInt(contrastInput.value))
}

brightInput.addEventListener('change', updateBC)
contrastInput.addEventListener('change', updateBC)
exposureInput.addEventListener('change', () => {
    window.img.exposure(parseInt(exposureInput.value))
})
saturationInput.addEventListener('change', () => {
    window.img.saturation(parseInt(saturationInput.value))
})
colorTempInput.addEventListener('change', () => {
    window.img.colorTemp(parseInt(colorTempInput.value))
})
colorHueInput.addEventListener('change', () => {
    window.img.colorHue(parseInt(colorHueInput.value))
})
sharpenInput.addEventListener('change', () => {
    window.img.sharpen(parseInt(sharpenInput.value))
})
blurInput.addEventListener('change', () => {
    window.img.blur(parseInt(blurInput.value))
})
equalizeHistBtn.addEventListener('click', () => {
    window.img.equalizeHist()
})