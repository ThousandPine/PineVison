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
    cv::Mat croppedImg = img(roi);

    return Mat2NapiBuffer(env, croppedImg);
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
    cv::Mat result;
    cv::rotate(img, result, clockwish ? cv::ROTATE_90_CLOCKWISE : cv::ROTATE_90_COUNTERCLOCKWISE);

    return Mat2NapiBuffer(env, result);
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

/* 锐化 */
Napi::Value sharpen(const Napi::CallbackInfo &info)
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

    // 读取锐化值
    float sharpen = info[1].As<Napi::Number>().Int32Value() / 100.0;

    // 定义核
    cv::Mat kernel = (cv::Mat_<float>(3, 3) << 0, -1, 0,
                      -1, 4, -1,
                      0, -1, 0);

    // 使用filter2D函数应用拉普拉斯滤波器
    cv::Mat imgLaplacian;
    filter2D(img, imgLaplacian, CV_32F, kernel);
    // 将滤波结果乘上锐化值
    imgLaplacian *= sharpen;

    // 将源图像与滤波结果叠加进行锐化
    img.convertTo(img, CV_32F);
    cv::Mat result = img + imgLaplacian;

    // 将结果转换回8位灰度图像
    result.convertTo(result, CV_8U);
    imgLaplacian.convertTo(imgLaplacian, CV_8U);

    return Mat2NapiBuffer(env, result);
}

/* 平滑 */
Napi::Value blur(const Napi::CallbackInfo &info)
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

    // 值
    int sigma = info[1].As<Napi::Number>().Int32Value();

    cv::Mat result;
    cv::GaussianBlur(img, result, cv::Size(5, 5), sigma);
    return Mat2NapiBuffer(env, result);
}
