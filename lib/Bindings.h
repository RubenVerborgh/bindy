#ifndef BINDINGS_H
#define BINDINGS_H

#include <node.h>
#include <nan.h>
#include <map>
#include <string>

class Bindings : public node::ObjectWrap, private std::map<const std::string, std::string> {
  public:
    static void Init(v8::Handle<v8::Object> target, v8::Handle<v8::Object> module);
    static NAN_METHOD(Create);

    static NAN_METHOD(Equals);
    static NAN_METHOD(UniqueValues);

    friend inline bool operator==(const Bindings& a, const Bindings& b) {
      return ((std::map<const std::string, std::string>)a) == b;
    }

  private:
    static v8::Persistent<v8::Function> constructor;
    static v8::Handle<v8::Value> New(const v8::Arguments& args);

    static NAN_PROPERTY_GETTER(GetNamedProperty);
    static NAN_PROPERTY_SETTER(SetNamedProperty);
    static NAN_PROPERTY_QUERY(QueryNamedProperty);
    static NAN_PROPERTY_DELETER(DeleteNamedProperty);
    static NAN_PROPERTY_ENUMERATOR(EnumerateNamedProperties);
};

#endif
