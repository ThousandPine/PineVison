#include "tools.h"

/* 裁剪图像 */
Napi::Value crop(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 2)
    {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    // 读取图像
    cv::Mat img = NapiBuffer2Mat(info[0].As<Napi::Buffer<uint8_t>>());

    // 读取裁剪参数
    Napi::Object cropInfo = info[1].As<Napi::Object>();

    int x = cropInfo.Get("x").As<Napi::Number>().Int32Value();
    int y = cropInfo.Get("y").As<Napi::Number>().Int32Value();
    int width = cropInfo.Get("width").As<Napi::Number>().Int32Value();
    int height = cropInfo.Get("height").As<Napi::Number>().Int32Value();

    // 裁剪图像
    cv::Rect roi(x, y, width, height);
    return Mat2NapiBuffer(env, img(roi));
}

/* 旋转图像 */
Napi::Value rotate(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 2)
    {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    // 读取图像
    cv::Mat img = NapiBuffer2Mat(info[0].As<Napi::Buffer<uint8_t>>());

    // 读取旋转方向
    bool clockwish = info[1].As<Napi::Boolean>().Value();

    // 旋转图像
    cv::rotate(img, img, clockwish ? cv::ROTATE_90_CLOCKWISE : cv::ROTATE_90_COUNTERCLOCKWISE);

    return Mat2NapiBuffer(env, img);
}

/* 翻转图像 */
Napi::Value flip(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 2)
    {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    // 读取图像
    cv::Mat img = NapiBuffer2Mat(info[0].As<Napi::Buffer<uint8_t>>());

    // 读取翻转方向
    int flipType = info[1].As<Napi::Number>().Int32Value();

    // 旋转图像
    cv::Mat result;
    cv::flip(img, result, flipType);

    return Mat2NapiBuffer(env, result);
}
