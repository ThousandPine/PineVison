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