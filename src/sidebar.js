const navigationBar = document.getElementById('navigation-bar')
const commitBar = document.getElementById('commit-bar')

let close

export function openPanel(openFunc, closeFunc) {
    // 记录关闭方法
    close = closeFunc

    // 打开面版
    openFunc()
    window.state.new()

    // 切换侧栏
    navigationBar.style.display = 'none'
    commitBar.style.display = ''
}

document.getElementById('apply-btn').addEventListener('click', () => {
    close()
    window.state.save()
    navigationBar.style.display = ''
    commitBar.style.display = 'none'
})
document.getElementById('cancel-btn').addEventListener('click', () => {
    close()
    window.state.cancel()
    window.img.get()
    navigationBar.style.display = ''
    commitBar.style.display = 'none'
})
