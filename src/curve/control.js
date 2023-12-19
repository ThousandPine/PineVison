// 曲线控制

import { openPanel } from "../sidebar.js"
import { calcCurve } from "./calc.js"

const MIN_DIST = 4 // 控制点的最小间距
const container = document.getElementById('curve-canvas-container')
const canvas = document.getElementById('curve-canvas')
const ctx = canvas.getContext("2d")

let curveApplyTimer = null  // 曲线调色定时器
let curves = null           // 二维数组，按照 b,g,r,all 的顺序存储曲线映射
let controls = null         // 二维数组，按照 b,g,r,all 的顺序存储控制点数组
let channel = 3             // 当前通道

// 画布宽高设为255，对应[0~255]的映射
canvas.height = 255
canvas.width = 255

// 上下翻转并移动，使画图原点来到左下角
ctx.scale(1, -1); // 翻转y轴
ctx.translate(0, -canvas.height);

// 画布点击事件：添加控制点
canvas.addEventListener('click', (event) => {
    // 转换坐标
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = rect.bottom - event.clientY

    // 在对应曲线坐标创建控制点
    addControlPoint(controls[channel], x, y)
    // 更新曲线
    updateCurve()
})

// 修改通道
document.getElementById('channel-select').addEventListener('change', function () {
    switchChannel(this.value)
})

// 开/关面版
document.getElementById('curve-btn').addEventListener('click', () => {
    const panel = document.getElementById('curve-panel')
    openPanel(
        () => {
            init()
            panel.style.display = ''
        },
        () => {
            panel.style.display = 'none'

            for (let i = 0; i < controls.length; ++i) {
                for (let j = 0; j < controls[i].length; ++j) {
                    controls[i][j].remove()
                }
            }
        })
})

/**
 * 初始化
 */
function init() {

    channel = 0
    controls = new Array(4)
    curves = new Array(4)

    // 初始化各个通道
    for (let i = 0; i < 4; ++i) {
        // 创建数组
        controls[i] = new Array()
        curves[i] = new Array(256)
        // 切换通道
        switchChannel(i)
        // 创建端点
        addControlPoint(controls[i], 0, 0)
        addControlPoint(controls[i], canvas.width, canvas.height)
        // 初始化曲线
        calcCurve(controls[i], curves[i])
    }

    // 设置初始通道为all
    switchChannel(3)

    // 绘制曲线
    drawCurve()
}

/**
 * 切换当前编辑通道
 */
function switchChannel(ch) {
    // 隐藏原通道的控制点
    for (const point of controls[channel]) {
        point.style.display = 'none'
    }

    // 切换通道
    channel = parseInt(ch)

    // 显示目标通道控制点
    for (const point of controls[channel]) {
        point.style.display = ''
    }


    // 重绘曲线
    drawCurve()
}

/**
 * 查找控制点下标
 * 
 * 根据x坐标进行二分搜索
 * 失败时返回-1
 */
function findPointIndex(controlPoints, target) {
    let left = 0
    let right = controlPoints.length

    while (left < right) {
        const mid = Math.floor((left + right) / 2)

        if (controlPoints[mid] === target) {
            return mid
        }
        if (controlPoints[mid].x < target.x) {
            left = mid + 1
        } else {
            right = mid
        }
    }
    return -1
}

/** 
 * 添加控制点
 * 
 * 根据输入的坐标点创建新的控制点元素
 * x坐标必须满足相邻控制点的最小距离
 */
function addControlPoint(controlPoints, x, y) {
    // 找到第一个x大于该点的记录
    let left = 0
    let right = controlPoints.length

    while (left < right) {
        const mid = Math.floor((left + right) / 2)

        if (controlPoints[mid].x <= x) {
            left = mid + 1
        } else {
            right = mid
        }
    }
    const index = left

    // 判断左右是否符合最小距离
    if ((index > 0 && controlPoints[index - 1].x + MIN_DIST > x)
        || (index < controlPoints.length && controlPoints[index].x - MIN_DIST < x)) {
        return
    }

    // 创建新的控制点元素
    const point = document.createElement('div')

    // 设置参数
    x = parseInt(x)
    y = parseInt(y)
    point.x = x
    point.y = y
    point.className = 'curve-control-point'
    point.style.left = x + 'px'
    point.style.bottom = y + 'px'

    // 添加事件
    point.addEventListener('mousedown', controlPointsMousedownAction)

    // 添加到页面
    container.appendChild(point)

    // 插入元素
    controlPoints.splice(index, 0, point)
}

/**
 * 移除控制点
 */
function removeControlPoint(controlPoints, target) {
    const index = findPointIndex(controlPoints, target)
    // 至少保留两个点
    if (controlPoints.length <= 2 || index == - 1) {
        return
    }

    // 移除对应记录
    controlPoints.splice(index, 1)

    // 移除页面元素
    container.removeChild(target)

    // 更新曲线
    updateCurve()
}

/** 
 * 移动控制点
 */
function offsetControlPoint(controlPoints, index, dx, dy) {
    const target = controlPoints[index]
    // 计算位置
    let x = parseInt(target.style.left) + parseInt(dx)
    let y = parseInt(target.style.bottom) - parseInt(dy)

    // 限制x满足最小相邻距离
    if (index > 0) {
        x = Math.max(x, controlPoints[index - 1].x + MIN_DIST)
    }
    if (index < controlPoints.length - 1) {
        x = Math.min(x, controlPoints[index + 1].x - MIN_DIST)
    }

    // 限制xy不得超过画布边界
    x = Math.max(0, Math.min(canvas.width, x))
    y = Math.max(0, Math.min(canvas.height, y))

    // 设置位置
    target.x = x
    target.y = y
    target.style.left = x + 'px'
    target.style.bottom = y + 'px'

    // 更新曲线
    updateCurve()
}

/**
 * 控制点鼠标按下事件
 */
function controlPointsMousedownAction(event) {
    const controlPoints = controls[channel]
    const target = event.target
    const tarIndex = findPointIndex(controlPoints, target)

    // 按下右键时删除目标
    if (event.button === 2) {
        removeControlPoint(controlPoints, target)
        return
    }

    // 鼠标拖动事件
    document.onmousemove = (event) => {
        const rect = target.getBoundingClientRect()

        offsetControlPoint(controlPoints, tarIndex,
            event.clientX - (rect.left + rect.width / 2),
            event.clientY - (rect.top + rect.height / 2)
        )
    }

    // 按键抬起事件
    document.onmouseup = (event) => {
        document.onmousemove = null
        document.onmouseup = null
    }
}

/**
 * 重绘曲线和应用曲线效果到图像上
 */
function updateCurve() {
    // 计算曲线
    calcCurve(controls[channel], curves[channel])

    // 绘制曲线
    drawCurve()

    // 应用曲线效果
    applyCurve()
}

/**
 * 绘制曲线面版
 */
function drawCurve() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制背景棋盘格
    ctx.lineWidth = 0.5
    ctx.strokeStyle = '#6b968a'
    for (let i = 0, cellSize = canvas.width / 4; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            ctx.beginPath()
            ctx.rect(i * cellSize, j * cellSize, cellSize, cellSize)
            ctx.stroke()
        }
    }

    // 绘制对角线
    ctx.lineWidth = 1
    ctx.strokeStyle = '#6b968a'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(canvas.width, canvas.height)
    ctx.stroke()


    // 四个通道对应的颜色
    const colors = ['blue', '#9ed6a1', 'red', 'white']

    // channel为 b,g,r 时只绘制单一曲线
    if (channel < 3) {
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = colors[channel]

        const points = curves[channel]
        ctx.moveTo(0, points[0])
        for (let i = 1; i < points.length; ++i) {
            ctx.lineTo(i, points[i])
        }
        ctx.stroke()

        return
    }

    // channel为 all 时绘制所有曲线 
    for (let i = 0; i < 4; ++i) {
        ctx.beginPath()
        ctx.lineWidth = (i == 3) ? 1 : 0.5
        ctx.strokeStyle = colors[i]

        // 跳过处于初始状态的单通道曲线
        if (i < 3 && controls[i].length == 2
            && controls[i][0].x == 0 && controls[i][0].y == 0
            && controls[i][1].x == 255 && controls[i][1].y == 255) {
            continue
        }

        // 绘制曲线
        const points = curves[i]
        ctx.moveTo(0, points[0])
        for (let i = 1; i < points.length; ++i) {
            ctx.lineTo(i, points[i])
        }
        ctx.stroke()
    }
}

/**
 * 将曲线效果应用到图像上
 * 
 * 自带触发时间间隔，防止高频率调用带来的卡顿
 */
function applyCurve() {
    if (curveApplyTimer) {
        clearTimeout(curveApplyTimer);  // 清除上一次的定时器
    }

    curveApplyTimer = setTimeout(() => {
        window.img.curve(curves)
        curveApplyTimer = null;
    }, 200);  // 设定最小执行间隔为200毫秒
}