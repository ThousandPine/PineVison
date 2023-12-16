#include "tools.h"

/* 曲线调色 */
Napi::Value curve(const Napi::CallbackInfo &info)
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

    // 读取4个通道的转换表数组
    cv::Mat lookUpTables[4];
    const Napi::Array &arrays = info[1].As<Napi::Array>();

    for (int i = 0; i < 4; ++i)
    {
        const Napi::Array &array = arrays.Get(i).As<Napi::Array>();
        const int N = array.Length();
        lookUpTables[i] = cv::Mat(1, N, CV_8U);
        for (int j = 0; j < N; ++j)
        {
            lookUpTables[i].at<uchar>(j) = array.Get(j).As<Napi::Number>().Uint32Value();
        }
    }

    std::vector<cv::Mat> channels;
    cv::split(img, channels);
    // b, g, r
    for (int i = 0; i < 3; ++i)
    {
        cv::LUT(channels[i], lookUpTables[i], channels[i]);
    }
    // all
    cv::merge(channels, img);
    cv::LUT(img, lookUpTables[3], img);

    return Mat2NapiBuffer(env, img);
}
