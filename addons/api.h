#include <napi.h>

Napi::Value crop(const Napi::CallbackInfo &info);
Napi::Value rotate(const Napi::CallbackInfo &info);
Napi::Value flip(const Napi::CallbackInfo &info);
Napi::Value light(const Napi::CallbackInfo &info);
Napi::Value saturation(const Napi::CallbackInfo &info);
Napi::Value colorTemp(const Napi::CallbackInfo &info);
Napi::Value colorHue(const Napi::CallbackInfo &info);
Napi::Value sharpen(const Napi::CallbackInfo &info);
Napi::Value blur(const Napi::CallbackInfo &info);
Napi::Value curve(const Napi::CallbackInfo &info);