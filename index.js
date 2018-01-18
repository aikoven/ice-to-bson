var Ice = require('ice').Ice;
var BSON = require('bson');
var iceDump = require('ice-dump');

var dummyStruct = Ice.Slice.defineStruct(function() {});

function isStruct(object) {
  return object != null && object.clone === dummyStruct.prototype.clone;
}

var hashMapKey = '@@iceHashMap';
var mapKey = '@@iceMap';
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

  if (object instanceof Ice.HashMap || object instanceof Map) {
    var entries = [];

    object.forEach(function(value, key) {
      entries.push([iceToBson(key), iceToBson(value)]);
    });

    var ret = {entries};
    ret[object instanceof Ice.HashMap ? hashMapKey : mapKey] = true;

    return ret;
  }

  if (object instanceof Ice.Value) {
    return new BSON.Binary(iceDump.valueToBuffer(object));
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

  if (object[hashMapKey] || object[mapKey]) {
    var map = object[hashMapKey] ? new Ice.HashMap() : new Map();

    for (var entry of object.entries) {
      map.set(bsonToIce(entry[0]), bsonToIce(entry[1]));
    }

    return map;
  }

  if (object instanceof BSON.Binary) {
    return iceDump.bufferToValue(object.read(0, object.length()));
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