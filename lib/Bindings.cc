#include "Bindings.h"

using namespace std;
using namespace v8;

Persistent<Function> Bindings::constructor;

// Creates a new Bindings object
Handle<Value> Bindings::New(const Arguments& args) {
  NanScope();
  // Ensure the object is constructed with `new`
  if (!args.IsConstructCall()) {
    const int argc = 1;
    Local<Value> argv[argc] = { args.Length() ? args[0] : (Local<Value>)NanUndefined() };
    NanReturnValue(constructor->NewInstance(argc, argv));
  }
  // Wrap the internal Bindings class around the object
  Bindings* bindings = new Bindings();
  bindings->Wrap(args.This());
  // If an initializer object is specified, take over its properties
  if (args.Length() && args[0]->IsObject()) {
    const Local<Object>& defaults = Local<Object>::Cast(args[0]);
    // Take over properties from a Bindings object
    if (defaults->GetConstructorName()->StrictEquals(constructor->GetName())) {
      const Bindings* defaultBindings = Unwrap<Bindings>(defaults);
      bindings->insert(defaultBindings->begin(), defaultBindings->end());
    }
    // Take over properties from an arbitrary object
    else {
      const Local<Array>& properties = defaults->GetPropertyNames();
      for (uint32_t i = 0, l = properties->Length(); i < l; i++) {
        const Local<Value>& key = properties->Get(i);
        (*bindings)[*NanUtf8String(key)] = *NanUtf8String(defaults->Get(key));
      }
    }
  }
  NanReturnValue(args.This());
}

// Gets the value of a property
NAN_PROPERTY_GETTER(Bindings::GetNamedProperty) {
  NanScope();
  const Bindings* bindings = Unwrap<Bindings>(args.This());
  const Bindings::const_iterator it = bindings->find(*NanUtf8String(property));
  if (it == bindings->end()) NanReturnUndefined();
  NanReturnValue(NanNew<String>(it->second));
}

// Sets the value of a property
NAN_PROPERTY_SETTER(Bindings::SetNamedProperty) {
  NanScope();
  Bindings* bindings = Unwrap<Bindings>(args.This());
  (*bindings)[*NanUtf8String(property)] = *NanUtf8String(value->ToString());
  NanReturnValue(value);
}

// Verifies whether a property exists
NAN_PROPERTY_QUERY(Bindings::QueryNamedProperty) {
  NanScope();
  const Bindings* bindings = Unwrap<Bindings>(args.This());
  const Bindings::const_iterator it = bindings->find(*NanUtf8String(property));
  NanReturnValue(it != bindings->end() ? NanNew<Integer>(None) : Local<Integer>());
}

// Deletes a property
NAN_PROPERTY_DELETER(Bindings::DeleteNamedProperty) {
  NanScope();
  Bindings* bindings = Unwrap<Bindings>(args.This());
  bindings->erase(*NanUtf8String(property));
  NanReturnValue(NanTrue());
}

// Returns an array with property names
NAN_PROPERTY_ENUMERATOR(Bindings::EnumerateNamedProperties) {
  NanScope();
  size_type index = 0;
  const Bindings* bindings = Unwrap<Bindings>(args.This());
  Local<Array> names = NanNew<Array>(bindings->size());
  for (Bindings::const_iterator it = bindings->begin(); it != bindings->end(); it++)
    names->Set(index++, NanNew<String>(it->first));
  NanReturnValue(names);
}

// Initializes the Bindings module
void Bindings::Init(Handle<Object> exports, Handle<Object> module) {
  Local<FunctionTemplate> constructorTemplate = NanNew<FunctionTemplate>(New);
  constructorTemplate->SetClassName(NanNew<String>("Bindings"));
  constructorTemplate->InstanceTemplate()->SetInternalFieldCount(1);
  constructorTemplate->InstanceTemplate()->SetNamedPropertyHandler(
    GetNamedProperty, SetNamedProperty, QueryNamedProperty,
    DeleteNamedProperty, EnumerateNamedProperties);
  constructor = Persistent<Function>::New(constructorTemplate->GetFunction());

  module->Set(NanNew<String>("exports"), constructor);
}

NODE_MODULE(bindy, Bindings::Init)
