#include "tools.h"

/* 添加水印 */
Napi::Value watermark(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 3)
    {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    // 读取图像
    cv::Mat img = NapiBuffer2Mat(info[0].As<Napi::Buffer<uint8_t>>());
    cv::Mat watermark = NapiBuffer2Mat(info[1].As<Napi::Buffer<uint8_t>>());

    // 读取参数
    const Napi::Object &obj = info[2].As<Napi::Object>();
    const int pos = obj.Get("pos").ToNumber().Int32Value();
    const double zoom = obj.Get("zoom").ToNumber().Int32Value() / 100.0;
    const double alpha = obj.Get("opacity").ToNumber().Int32Value() / 100.0;


    if (watermark.empty())
    {
        return Mat2NapiBuffer(env, img);
    }

    // 缩放水印图像
    cv::resize(watermark, watermark, cv::Size(watermark.cols * zoom, watermark.rows * zoom), 0, 0, cv::INTER_LINEAR);

    // 限制尺寸不得超过背景图像
    const double scale = cv::min((double)img.cols / watermark.cols, (double)img.rows / watermark.rows);
    if (scale < 1)
    {
        cv::resize(watermark, watermark, cv::Size(), scale, scale, cv::INTER_LINEAR);
    }

    // 计算位置
    cv::Rect roi;
    switch (pos)
    {
    // 居中
    case 0:
        roi = cv::Rect((img.cols - watermark.cols) / 2, (img.rows - watermark.rows) / 2, watermark.cols, watermark.rows);
        break;
    // 左上
    case 1:
        roi = cv::Rect(0, 0, watermark.cols, watermark.rows);
        break;
    // 右上
    case 2:
        roi = cv::Rect(img.cols - watermark.cols, 0, watermark.cols, watermark.rows);
        break;
    // 右下
    case 3:
        roi = cv::Rect(img.cols - watermark.cols, img.rows - watermark.rows, watermark.cols, watermark.rows);
        break;
    // 左下
    case 4:
        roi = cv::Rect(0, img.rows - watermark.rows, watermark.cols, watermark.rows);
        break;

    default:
        break;
    }

    // 叠加水印
    cv::Mat imgRoi = img(roi);
    cv::addWeighted(watermark, alpha, imgRoi, 1.0 - alpha, 0, imgRoi);

    return Mat2NapiBuffer(env, img);
}
