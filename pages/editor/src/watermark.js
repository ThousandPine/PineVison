import { openPanel } from "./sidebar.js"

const pathInput = document.getElementById('watermark-path-input')
const posInput = document.getElementById('watermark-pos-select')
const zoomInput = document.getElementById('watermark-zoom-input')
const zoomValue = document.getElementById('watermark-zoom-value')

pathInput.addEventListener('change', apply)
posInput.addEventListener('change', apply)
zoomInput.addEventListener('change', function() {
    zoomValue.innerHTML = getZoom() + '%'
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
        zoom: getZoom()
    }

    console.log(args)
        
    // window.img.watermark(args)
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
        },
        () => {
            panel.style.display = 'none'
        })
})