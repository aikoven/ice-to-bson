const test = require('tape');
const {Ice} = require('ice');
const {isEqualWith} = require('lodash');
const {BSON} = require('bson');

const {iceToBson, bsonToIce} = require('../index');
const {Test} = require('./Test');

const isEqualCustomizer = (first, second) => {
  if (first instanceof Ice.HashMap) {
    return first.equals(second, (v1, v2) =>
      isEqualWith(v1, v2, isEqualCustomizer)
    );
  }

  if (first instanceof Map) {
    for (const key of first.keys()) {
      if (!isEqualWith(first.get(key), second.get(key), isEqualCustomizer)) {
        return false;
      }
    }
    return true;
  }
};

test('dump', assert => {
  const obj = new Test.TestObj(
    42,
    new Ice.Long(Ice.Long.MAX_UINT32, Ice.Long.MAX_UINT32),
    new Test.SomeStruct(true),
    'foo',
    ['bar', 'baz'],
    new Test.Base(24, new Ice.Long(Ice.Long.MAX_UINT32, 0)),
    new Test.SomeStruct(true),
    [1, 2, 3]
  );

  const hashMap = new Ice.HashMap();
  hashMap.set('lol', obj);
  hashMap.set('wtf', obj);

  const map = new Map();
  map.set('lol', obj);
  map.set('wtf', obj);

  const writeObject = {
    long: new Ice.Long(Ice.Long.MAX_UINT32, Ice.Long.MAX_UINT32),
    long2: new Ice.Long(Ice.Long.MAX_UINT32, 0),
    obj,
    hashMap,
    map,
    array: [obj, obj],
    nested: {
      obj,
    },
    primitive: 'lel',
  };

  const instance = new BSON();

  const bson = iceToBson(writeObject);
  const serialized = instance.serialize(bson);
  const deserialized = instance.deserialize(serialized);
  const readObject = bsonToIce(deserialized);

  // lodash `isEqual` checks prototypes, tape `assert.deepEqual` does not
  assert.true(isEqualWith(writeObject, readObject, isEqualCustomizer));

  assert.throws(() => iceToBson(new Test.SomeStruct(true)));

  assert.end();
});
