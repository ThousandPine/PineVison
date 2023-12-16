import { enableCropBox, disableCropBox } from "./composition/cropBox.js"

let lastPanel
let open
let close

export function togglePanel(panel, openFunc, closeFunc) {
    if (panel === lastPanel) {
        close()
        lastPanel = null
    } else {
        if (close) {
            close()
        }
        lastPanel = panel
        open = openFunc
        close = closeFunc
        open()
    }
}

document.getElementById('light-btn').addEventListener('click', () => {
    const panel = document.getElementById('light-panel')
    togglePanel(panel,
        () => {
            panel.style.display = ''
        },
        () => {
            panel.style.display = 'none'
        }
    )
})

document.getElementById('color-btn').addEventListener('click', () => {
    const panel = document.getElementById('color-panel')
    togglePanel(panel,
        () => {
            panel.style.display = ''
        },
        () => {
            panel.style.display = 'none'
        }
    )
})

document.getElementById('composition-btn').addEventListener('click', () => {
    const panel = document.getElementById('composition-panel')
    togglePanel(panel,
        () => {
            enableCropBox()
            panel.style.display = ''
        },
        () => {
            disableCropBox()
            panel.style.display = 'none'
        })
})

document.getElementById('curve-btn').addEventListener('click', () => {
    const panel = document.getElementById('curve-panel')
    togglePanel(panel,
        () => {
            enableCropBox()
            panel.style.display = ''
        },
        () => {
            disableCropBox()
            panel.style.display = 'none'
        })
})