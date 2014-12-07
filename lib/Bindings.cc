#include "Bindings.h"
#include <set>

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

// equals(bindingA, bindingB)
// Checks whether both bindings have the exact same keys and values.
NAN_METHOD(Bindings::Equals) {
  NanScope();
  if (args.Length() != 2 || !args[0]->IsObject() || !args[1]->IsObject())
    ThrowException(Exception::Error(NanNew<String>("equals requires two Object arguments.")));

  const Local<Object>& objectA = Local<Object>::Cast(args[0]);
  const Local<Object>& objectB = Local<Object>::Cast(args[1]);
  if (!objectA->GetConstructorName()->StrictEquals(constructor->GetName()) ||
      !objectB->GetConstructorName()->StrictEquals(constructor->GetName()))
    NanReturnValue(NanFalse());

  const Bindings* bindingsA = Unwrap<Bindings>(objectA);
  const Bindings* bindingsB = Unwrap<Bindings>(objectB);
  NanReturnValue(*bindingsA == *bindingsB ? NanTrue() : NanFalse());
}

// merge(array_of_bindings)
// merge(bindings1, ..., bindingsN)
// Creates a binding that combines the given bindings
NAN_METHOD(Bindings::Merge) {
  NanScope();
  // Create merged bindings
  Local<Object> mergedObject = constructor->NewInstance();
  Bindings* merged = Unwrap<Bindings>(mergedObject);
  // Add all bindings
  for (int i = 0; i < args.Length(); i++) {
    // If the argument is a Bindings object, add its bindings
    if (!args[i]->IsArray()) {
      const Bindings* bindings = Unwrap<Bindings>(Local<Object>::Cast(args[i]));
      merged->insert(bindings->begin(), bindings->end());
    }
    // If the argument is an array of Bindings objects, add the bindings of all items
    else {
      const Local<Array>& bindingsArray = Local<Array>::Cast(args[i]);
      for (uint32_t j = 0; j < bindingsArray->Length(); j++) {
        const Bindings* bindings = Unwrap<Bindings>(Local<Object>::Cast(bindingsArray->Get(j)));
        merged->insert(bindings->begin(), bindings->end());
      }
    }
  }
  NanReturnValue(mergedObject);
}

// uniqueValues(array_of_bindings, key)
// Gets the unique values associated with the key in the given objects.
NAN_METHOD(Bindings::UniqueValues) {
  NanScope();
  Local<Array> keyArray = NanNew<Array>();
  if (args.Length() == 2 && args[0]->IsArray()) {
    const Local<Array>& bindingsArray = Local<Array>::Cast(args[0]);
    const string& key = *NanUtf8String(args[1]->ToString());
    // Store unique values in a set
    set<string> keys;
    for (uint32_t i = 0, count = 0; i < bindingsArray->Length(); i++) {
      const Bindings* bindings = Unwrap<Bindings>(Local<Object>::Cast(bindingsArray->Get(i)));
      const Bindings::const_iterator value = bindings->find(key);
      if (value != bindings->end() && keys.insert(value->second).second)
        keyArray->Set(count++, NanNew<String>(value->second));
    }
  }
  NanReturnValue(keyArray);
}

// Initializes the Bindings module
void Bindings::Init(const Handle<Object> exports, Handle<Object> module) {
  // Create the constructor
  Local<FunctionTemplate> constructorTemplate = NanNew<FunctionTemplate>(New);
  constructorTemplate->SetClassName(NanNew<String>("Bindings"));
  constructorTemplate->InstanceTemplate()->SetInternalFieldCount(1);
  constructorTemplate->InstanceTemplate()->SetNamedPropertyHandler(
    GetNamedProperty, SetNamedProperty, QueryNamedProperty,
    DeleteNamedProperty, EnumerateNamedProperties);
  constructor = Persistent<Function>::New(constructorTemplate->GetFunction());

  // Export the constructor and static member functions
  module->Set(NanNew<String>("exports"), constructor);
  constructor->Set(NanNew<String>("equals"),
                   NanNew<FunctionTemplate>(Equals)->GetFunction());
  constructor->Set(NanNew<String>("merge"),
                   NanNew<FunctionTemplate>(Merge)->GetFunction());
  constructor->Set(NanNew<String>("uniqueValues"),
                   NanNew<FunctionTemplate>(UniqueValues)->GetFunction());
}

NODE_MODULE(bindy, Bindings::Init)
