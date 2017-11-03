const test = require('tape');
const {Ice} = require('ice');
const {isEqualWith} = require('lodash');
const {BSON} = require('bson');

const {iceToBson, bsonToIce} = require('../index');
const {Test} = require('./Test');

function resetAddresses(object) {
  if (object == null) {
    return;
  }

  if (object.__address) {
    object.__address = 0;
  }

  if (Array.isArray(object)) {
    for (const child of object) {
      resetAddresses(child);
    }
  }

  if (typeof object === 'object') {
    for (const value of Object.values(object)) {
      resetAddresses(value);
    }
  }
}

const isEqualCustomizer = (first, second) => {
  if (first instanceof Ice.HashMap) {
    return first.equals(second, (v1, v2) =>
      isEqualWith(v1, v2, isEqualCustomizer)
    );
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
    [1, 2, 3],
  );

  const dict = new Ice.HashMap();
  dict.set('lol', obj);
  dict.set('wtf', obj);

  const writeObject = {
    long: new Ice.Long(Ice.Long.MAX_UINT32, Ice.Long.MAX_UINT32),
    long2: new Ice.Long(Ice.Long.MAX_UINT32, 0),
    obj,
    dict,
    array: [obj, obj],
    nested: {
      obj,
    },
    primitive: 'lel',
  };
  resetAddresses(writeObject);

  const instance = new BSON();

  const bson = iceToBson(writeObject);
  const serialized = instance.serialize(bson);
  const deserialized = instance.deserialize(serialized);
  const readObject = bsonToIce(deserialized);

  resetAddresses(readObject);

  // lodash `isEqual` checks prototypes, tape `assert.deepEqual` does not
  assert.true(isEqualWith(writeObject, readObject, isEqualCustomizer));

  assert.throws(() => iceToBson(new Test.SomeStruct(true)));

  assert.end();
});
