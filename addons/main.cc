#include "api.h"

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "crop"), Napi::Function::New(env, crop));
    exports.Set(Napi::String::New(env, "rotate"), Napi::Function::New(env, rotate));
    exports.Set(Napi::String::New(env, "flip"), Napi::Function::New(env, flip));
    exports.Set(Napi::String::New(env, "light"), Napi::Function::New(env, light));
    exports.Set(Napi::String::New(env, "saturation"), Napi::Function::New(env, saturation));
    exports.Set(Napi::String::New(env, "colorTemp"), Napi::Function::New(env, colorTemp));
    exports.Set(Napi::String::New(env, "colorHue"), Napi::Function::New(env, colorHue));
    exports.Set(Napi::String::New(env, "sharpen"), Napi::Function::New(env, sharpen));
    exports.Set(Napi::String::New(env, "curve"), Napi::Function::New(env, curve));
    exports.Set(Napi::String::New(env, "blur"), Napi::Function::New(env, blur));
    return exports;
}

NODE_API_MODULE(addon, Init)
