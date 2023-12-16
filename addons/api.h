#include <napi.h>

Napi::Value crop(const Napi::CallbackInfo &info);
Napi::Value rotate(const Napi::CallbackInfo &info);
Napi::Value flip(const Napi::CallbackInfo &info);
Napi::Value light(const Napi::CallbackInfo &info);
Napi::Value color(const Napi::CallbackInfo &info);
Napi::Value sharpen(const Napi::CallbackInfo &info);
Napi::Value blur(const Napi::CallbackInfo &info);
Napi::Value curve(const Napi::CallbackInfo &info);