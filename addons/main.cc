#include "api.h"

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "crop"), Napi::Function::New(env, crop));
    exports.Set(Napi::String::New(env, "rotate"), Napi::Function::New(env, rotate));
    exports.Set(Napi::String::New(env, "flip"), Napi::Function::New(env, flip));
    exports.Set(Napi::String::New(env, "light"), Napi::Function::New(env, light));
    exports.Set(Napi::String::New(env, "color"), Napi::Function::New(env, color));
    exports.Set(Napi::String::New(env, "curve"), Napi::Function::New(env, curve));
    exports.Set(Napi::String::New(env, "post"), Napi::Function::New(env, post));
    return exports;
}

NODE_API_MODULE(addon, Init)
