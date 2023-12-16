#include "tools.h"

/* 饱和度 */
void saturation(cv::Mat &img, int n)
{
    // 读取饱和度
    float saturation = 1 + n / 100.0;

    // 从BGR转到HSV
    cv::cvtColor(img, img, cv::COLOR_BGR2HSV);

    // 拆分通道
    std::vector<cv::Mat> channels;
    cv::split(img, channels);

    // 修改S通道后合并
    channels.at(1) *= saturation;
    cv::merge(channels, img);

    // 转回BGR图像
    cv::cvtColor(img, img, cv::COLOR_HSV2BGR);
}

/* 色温 */
void colorTemp(cv::Mat &img, int n)
{
    // 拆分通道
    std::vector<cv::Mat> channels;
    cv::split(img, channels);

    // 调整B通道
    channels.at(0) -= n;

    // 合并
    cv::merge(channels, img);
}

/* 色调 */
void colorHue(cv::Mat &img, int n)
{
    // 拆分通道
    std::vector<cv::Mat> channels;
    cv::split(img, channels);

    // 调整G通道
    channels.at(1) += n;

    // 合并
    cv::merge(channels, img);
}

Napi::Value color(const Napi::CallbackInfo &info)
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

    saturation(img, obj.Get("saturation").ToNumber().Int32Value());

    colorTemp(img, obj.Get("temp").ToNumber().Int32Value());

    colorHue(img, obj.Get("hue").ToNumber().Int32Value());

    return Mat2NapiBuffer(env, img);
}