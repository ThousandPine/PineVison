{
    "targets": [{
        "target_name":
        "addon",
        "sources": [
            "./addons/main.cc", "./addons/composition.cc", "./addons/light.cc",
            "./addons/color.cc", "./addons/curve.cc", "./addons/post.cc",
            "./addons/watermark.cc"
        ],
        "defines": ['NAPI_DISABLE_CPP_EXCEPTIONS'],  # node-addon-api关闭C++异常
        "msvs_settings": {
            "VCCLCompilerTool": {
                "AdditionalOptions": ["/utf-8"]
            }
        },
        "include_dirs": [
            "D:/A/OpenCV/opencv/build/include",
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        "libraries": [
            "D:/A/OpenCV/opencv/build/x64/vc15/lib/opencv_world454.lib",
        ],
    }]
}
