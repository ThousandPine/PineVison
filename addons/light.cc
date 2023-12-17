#include "tools.h"

/* 亮度 对比度 */
inline void brightContrast(cv::Mat &img, int bright, int contrast)
{
    img.convertTo(img, -1, 1 + contrast / 100.0, bright);
}

/* 曝光 */
inline void exposure(cv::Mat &img, int n)
{
    // 计算gamma
    float gamma = 1 + n / 100.0;
    float gamma_ = 1 / gamma;

    // 通过gamma变换调整曝光
    cv::Mat lut(1, 256, CV_8U);
    uchar *p = lut.ptr();
    for (int i = 0; i < 256; ++i)
        p[i] = cv::saturate_cast<uchar>(pow(i / 255.0, gamma_) * 255.0);

    cv::LUT(img, lut, img);
}

/* 直方图均衡化 */
inline void equalizeHist(cv::Mat &img, int n)
{
    if (!n)
    {
        return;
    }

    // 转为hls图像
    cv::cvtColor(img, img, cv::COLOR_BGR2HLS);

    // 拆分通道
    std::vector<cv::Mat> channels;
    cv::split(img, channels);

    // 对l通道进行直方图均衡化
    cv::equalizeHist(channels[1], channels[1]);
    cv::merge(channels, img);

    // 转回bgr图像
    cv::cvtColor(img, img, cv::COLOR_HLS2BGR);
}

Napi::Value light(const Napi::CallbackInfo &info)
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

    brightContrast(img,
                   obj.Get("bright").ToNumber().Int32Value(),
                   obj.Get("contrast").ToNumber().Int32Value());

    exposure(img, obj.Get("exposure").ToNumber().Int32Value());

    equalizeHist(img, obj.Get("equalize").ToNumber().Int32Value());

    return Mat2NapiBuffer(env, img);
}