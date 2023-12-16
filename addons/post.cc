#include "tools.h"

/* 平滑 */
void blur(cv::Mat &img, int n)
{
    if (n <= 0)
    {
        return;
    }
    n = n * 2 - 1;
    // 高斯模糊
    cv::GaussianBlur(img, img, cv::Size(n, n), 0);
}

/* 锐化 */
void sharpen(cv::Mat &img, int n)
{
    // 定义核
    cv::Mat kernel = (cv::Mat_<float>(3, 3) << 0, -1, 0,
                      -1, 4, -1,
                      0, -1, 0);

    // 使用filter2D函数应用拉普拉斯滤波器
    cv::Mat imgLaplacian;
    filter2D(img, imgLaplacian, CV_32F, kernel);
    // 将滤波结果乘上锐化值
    imgLaplacian *= n / 100.0;

    // 将源图像与滤波结果叠加进行锐化
    img.convertTo(img, CV_32F);
    img += imgLaplacian;
}

/* 后处理 */
Napi::Value post(const Napi::CallbackInfo &info)
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

    const Napi::Object &obj = info[1].As<Napi::Object>();

    blur(img, obj.Get("blur").ToNumber().Int32Value());

    sharpen(img, obj.Get("sharpen").ToNumber().Int32Value());

    return Mat2NapiBuffer(env, img);
}