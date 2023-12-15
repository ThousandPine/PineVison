document.getElementById('frame-min-btn').addEventListener('click', () => {
    window.win.minimize()
})


document.getElementById('frame-max-btn').addEventListener('click', async function () {
    if (await window.win.maximize()) {
        this.innerHTML = 'res'
    } else {
        this.innerHTML = 'max'
    }
})

document.getElementById('frame-close-btn').addEventListener('click', () => {
    window.win.close()
})