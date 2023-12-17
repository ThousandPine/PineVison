import { openPanel } from "./sidebar.js"

const keys = ['bright', 'contrast', 'exposure', 'equalize']
const inputs = {}
const values = {}

for (let key of keys) {
    inputs[key] = document.getElementById(key + '-input')
    values[key] = document.getElementById(key + '-value')

    inputs[key].addEventListener('change', () => {
        values[key].innerHTML = inputs[key].value
        applyLight()
    })
}

/**
 * 应用光照调节
 */
function applyLight() {
    const args = {}
    for (let key of keys) {
        args[key] = parseInt(inputs[key].value)
    }
    window.img.light(args)
}

document.getElementById('light-btn').addEventListener('click', () => {
    const panel = document.getElementById('light-panel')
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