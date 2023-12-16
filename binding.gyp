{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "./addons/main.cc", "./addons/api.cc", "./addons/light.cc" ],
      "defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ], # node-addon-api关闭C++异常
      # "msvs_settings": {
      #   "VCCLCompilerTool": {
      #     "ExceptionHandling": 1
      #   }
      # },
      "include_dirs": [
          "D:/A/OpenCV/opencv/build/include",
          "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "libraries": [
          "D:/A/OpenCV/opencv/build/x64/vc15/lib/opencv_world454.lib",
      ],
    }
  ]
}