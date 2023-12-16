import { togglePanel } from "./navigation.js"


const keys = ['saturation', 'temp', 'hue']
const inputs = {}
const values = {}

for (let key of keys) {
    inputs[key] = document.getElementById(key + '-input')
    values[key] = document.getElementById(key + '-value')

    inputs[key].addEventListener('change', () => {
        values[key].innerHTML = inputs[key].value
        applyColor()
    })
}

/**
 * 应用色调调节
 */
function applyColor() {
    const args = {}
    for (let key of keys) {
        args[key] = parseInt(inputs[key].value)
    }
    console.log(args)
    window.img.color(args)
}