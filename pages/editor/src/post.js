import { openPanel } from "./sidebar.js"

const keys = ['blur', 'sharpen']
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
 * 应用色调调节
 */
function applyPost() {
    const args = {}
    for (let key of keys) {
        args[key] = parseInt(inputs[key].value)
    }
    console.log(args)
    window.img.post(args)
}


document.getElementById('post-btn').addEventListener('click', () => {
    const panel = document.getElementById('post-panel')
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
        })
})