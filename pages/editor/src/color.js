import { openPanel } from "./sidebar.js"

const keys = ['saturation', 'temp', 'hue']
const inputs = {}
const values = {}

for (let key of keys) {
    inputs[key] = document.getElementById(key + '-input')
    values[key] = document.getElementById(key + '-value')

    inputs[key].addEventListener('change', () => {
        values[key].innerHTML = inputs[key].value
        applyPost()
    })
}

/**
 * 应用后期处理
 */
function applyPost() {
    const args = {}
    for (let key of keys) {
        args[key] = parseInt(inputs[key].value)
    }
    console.log(args)
    window.img.color(args)
}

document.getElementById('color-btn').addEventListener('click', () => {
    const panel = document.getElementById('color-panel')
    openPanel(
        () => {
            panel.style.display = ''

            for (const key of keys) {
                inputs[key].value = 0
                values[key].innerHTML = 0
            }
        },
        () => {
            panel.style.display = 'none'
        }
    )
})