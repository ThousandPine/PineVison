# PineVision

基于Electron和OpenCV的简易图像编辑程序

包括以下几种图像处理功能

- 构图：裁剪、旋转、翻转
- 光照：亮度、对比度、曝光、直方图均衡化
- 色彩：饱和度、色温、色调
- 曲线：RGB、R、G、B四种曲线调整
- 后处理：平滑、锐化
- 水印：添加水印并设置显示效果

## 项目构建

### 开发环境

- Node.js
- node-gyp
- OpenCV (C++)
- MSVC (Windows)

### OpenCV路径设置

构建之前请先确保已经安装了OpenCV库，并添加bin目录等环境变量

之后需要在以下配置文件中设置对应的OpenCV路径

binding.gyp：设置Addons编译依赖
```python
{
    "targets": [{
        # ......
        "include_dirs": [
            # 添加OpenCV头文件路径
            # 例如"<!(echo %OPENCV_HOME%/include)", 

            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        "libraries": [
            # 添加OpenCV lib文件路径
            # 例如"<!(echo %OPENCV_HOME%/x64/vc15/lib/opencv_world454.lib)",
        ],
        # ......
    }]
}
```

forge.config.js：用于打包时将OpenCV的dll文件复制到程序目录下，防止程序找不到dll，出现`Error: The specified module could not be found.`错误
```js
module.exports = {
  // ......
  hooks: {
    packageAfterExtract: async (config, buildPath, electronVersion, platform, arch) => {
      const path = require('path');
      const fs = require('fs-extra');
      const src = ... // src修改为对应的dll路径，若有多个dll请改为循环拷贝
      const dest = path.join(buildPath, 'opencv_world454.dll');
      await fs.copy(src, dest);
    }
  },
  // ......
};
```

### 构建命令

C++ Addons使用node-gyp构建

```
node-gyp configure rebuild
```

Electron程序采用Electron Forge构建框架，命令如下

```
npm start       # 运行程序
npm run package # 打包程序
npm run make    # 打包安装包
```
