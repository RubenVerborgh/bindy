#include "Bindings.h"

using namespace std;
using namespace v8;

Persistent<Function> Bindings::constructor;

// Creates a new Bindings object (with or without the `new` operator)
Handle<Value> Bindings::New(const Arguments& args) {
  HandleScope scope;
  // Invoked as constructor
  if (args.IsConstructCall()) {
    Bindings* bindings = new Bindings();
    bindings->Wrap(args.This());
    return args.This();
  }
  // Invoked as function; turn into construct call
  else {
    const int argc = 0;
    Local<Value> argv[argc] = {};
    return scope.Close(constructor->NewInstance(argc, argv));
  }
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
