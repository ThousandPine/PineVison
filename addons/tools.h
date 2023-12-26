#include <napi.h>
#include <opencv2/opencv.hpp>

#define print(x) std::cout << x << std::endl
#define debug(x) std::cout << #x << "::" << x << std::endl 

/* 从Napi::Buffer构建cv::Mat */
inline cv::Mat NapiBuffer2Mat(const Napi::Buffer<uint8_t> &buffer)
{
    const std::vector<uint8_t> imgData(buffer.Data(), buffer.Data() + buffer.Length());
    return cv::imdecode(imgData, cv::IMREAD_COLOR);
}

/* 从cv::Mat构建Napi::Buffer */
inline Napi::Buffer<uint8_t> Mat2NapiBuffer(const Napi::Env &env, const cv::Mat &mat)
{
    std::vector<uint8_t> buffer;
    cv::imencode(".png", mat, buffer);
    return Napi::Buffer<uint8_t>::Copy(env, buffer.data(), buffer.size());
}