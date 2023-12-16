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
    console.log(args)
    window.img.light(args)
}