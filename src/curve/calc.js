// 曲线计算

/**
 * 计算曲线
 * 
 * @param {{x: number, y: number}[]} points 控制点
 * @param {[]} output 在下标x中存储曲线f(x)的值
 */
export function calcCurve(points, output) {
    if (points.length < 2) {
        return null
    }

    // 端点未在边界时用横线代替
    for (let x = 0, point = points[0]; x < point.x; ++x) {
        output[x] = point.y
    }
    for (let x = 255, point = points[points.length - 1]; x > point.x; --x) {
        output[x] = point.y
    }

    // 只有两个点时绘制直线
    if (points.length == 2) {
        const k = (points[1].y - points[0].y) / (points[1].x - points[0].x)

        for (let x = points[0].x, y = points[0].y; x <= points[1].x; ++x, y += k) {
            output[x] = y
        }

        return
    }

    // 计算曲线系数
    const { a, b, c, d } = calcCoeffs(points)
    
    // 计算曲线坐标点
    for (let i = 0; i < points.length - 1; ++i) {
        for (let x = points[i].x, dx = 0; x <= points[i + 1].x; ++x, ++dx) {
            output[x] = Math.max(0, Math.min(255, a[i] + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx))
        }
    }
}

/**
 * 计算 三次样条插值曲线 的系数
 * 
 * NOTE:
 * 这段代码由Bing AI生成
 * 用于计算自然边界的三次样条插值曲线系数
 * 
 * @param {{x: number, y: number}[]} points 控制点
 * 
 * @returns {{a: [], b: [], c: [], d: []}} 三次函数系数
 */
function calcCoeffs(points) {
    // 定义数组
    let n = points.length - 1;
    let a = new Array(n + 1).fill(0);
    let b = new Array(n).fill(0);
    let d = new Array(n).fill(0);
    let h = new Array(n).fill(0);
    let alpha = new Array(n).fill(0);
    let c = new Array(n + 1).fill(0);
    let l = new Array(n + 1).fill(0);
    let mu = new Array(n + 1).fill(0);
    let z = new Array(n + 1).fill(0);

    // 初始化a和h
    for (let i = 0; i <= n; i++) {
        a[i] = points[i].y;
    }
    for (let i = 0; i < n; i++) {
        h[i] = points[i + 1].x - points[i].x;
    }

    // 计算alpha
    for (let i = 1; i < n; i++) {
        alpha[i] = (3 / h[i]) * (a[i + 1] - a[i]) - (3 / h[i - 1]) * (a[i] - a[i - 1]);
    }

    // 初始化l、mu和z
    l[0] = 1;
    mu[0] = 0;
    z[0] = 0;

    // 迭代计算l、mu和z
    for (let i = 1; i < n; i++) {
        l[i] = 2 * (points[i + 1].x - points[i - 1].x) - h[i - 1] * mu[i - 1];
        mu[i] = h[i] / l[i];
        z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
    }

    // 计算系数
    l[n] = 1;
    z[n] = 0;
    c[n] = 0;
    for (let j = n - 1; j >= 0; j--) {
        c[j] = z[j] - mu[j] * c[j + 1];
        b[j] = (a[j + 1] - a[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3;
        d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
    }

    // 返回结果
    return { a, b, c, d };
}