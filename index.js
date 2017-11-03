var Ice = require('ice').Ice;
var BSON = require('bson');
var iceDump = require('ice-dump');

var dummyStruct = Ice.Slice.defineStruct(function() {});

function isStruct(object) {
  return object != null && object.clone === dummyStruct.prototype.clone;
}

var hashMapKey = '@@iceHashMap';
var longKey = '@@iceLong';

module.exports.iceToBson = iceToBson;
module.exports.bsonToIce = bsonToIce;

function iceToBson(object) {
  if (object == null) {
    return object;
  }

  if (object instanceof Ice.Long) {
    var ret = {low: object.low, high: object.high};
    ret[longKey] = true;
    return ret;
  }

  if (object instanceof Ice.HashMap) {
    var entries = [];

    object.forEach(function(key, value) {
      entries.push([iceToBson(key), iceToBson(value)]);
    });

    var ret = {entries};
    ret[hashMapKey] = true;

    return ret;
  }

  if (object instanceof Ice.Object) {
    return new BSON.Binary(iceDump.objectToBuffer(object));
  }

  if (isStruct(object)) {
    throw new Error('Converting Ice Structures to BSON is not supported');
  }

  if (Array.isArray(object)) {
    return object.map(iceToBson);
  }

  if (typeof object === 'object')  {
    var ret = {};

    for (let key of Object.keys(object)) {
      ret[key] = iceToBson(object[key]);
    }

    return ret;
  }

  return object;
}

function bsonToIce(object) {
  if (object == null) {
    return object;
  }

  if (object[longKey]) {
    return new Ice.Long(object.high, object.low);
  }

  if (object[hashMapKey]) {
    var hashMap = new Ice.HashMap();

    for (var entry of object.entries) {
      hashMap.set(bsonToIce(entry[0]), bsonToIce(entry[1]));
    }

    return hashMap;
  }

  if (object instanceof BSON.Binary) {
    return iceDump.bufferToObject(object.read(0, object.length()));
  }

  if (Array.isArray(object)) {
    return object.map(bsonToIce);
  }

  if (typeof object === 'object')  {
    var ret = {};

    for (let key of Object.keys(object)) {
      ret[key] = bsonToIce(object[key]);
    }

    return ret;
  }

  return object;
}