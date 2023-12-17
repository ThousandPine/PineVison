import { openPanel } from "./sidebar.js"

const pathInput = document.getElementById('watermark-path-input')
const posInput = document.getElementById('watermark-pos-select')
const zoomInput = document.getElementById('watermark-zoom-input')
const zoomValue = document.getElementById('watermark-zoom-value')
const opacityInput = document.getElementById('watermark-opacity-input')
const opacityValue = document.getElementById('watermark-opacity-value')

pathInput.addEventListener('change', apply)
posInput.addEventListener('change', apply)
zoomInput.addEventListener('change', function() {
    zoomValue.innerHTML = getZoom() + '%'
    apply()
})
opacityInput.addEventListener('change', function() {
    opacityValue.innerHTML = this.value + '%'
    apply()
})

function getZoom() {
    return 100 + parseInt(zoomInput.value)
}

/**
 * TODO: 应用水印设置
 */
function apply() {
    const args = {
        path: pathInput.value,
        pos: posInput.value,
        zoom: getZoom(),
        opacity: parseInt(opacityInput.value)
    }
    window.img.watermark(args)
}


document.getElementById('watermark-btn').addEventListener('click', () => {
    const panel = document.getElementById('watermark-panel')
    openPanel(
        () => {
            panel.style.display = ''

            pathInput.value = ''
            posInput.value = 0
            zoomInput.value = 0
            zoomValue.innerHTML = getZoom() + '%'
            zoomInput.value = 50
            zoomValue.innerHTML = opacityInput.value + '%'
        },
        () => {
            panel.style.display = 'none'
        })
})