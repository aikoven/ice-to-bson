# Ice To BSON [![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

## Deprecated — use [ice-to-plain](https://github.com/aikoven/ice-to-plain) instead.

Encode and decode ZeroC Ice objects into BSON objects.

## Installation

```bash
npm install ice-to-bson
```

## Usage

```js
import {iceToBson, bsonToIce} from 'ice-to-bson';

// Convert any JS object containing Ice Object values somewhere in the tree.
// Converting Ice Structs not contained inside Ice Objects is not supported
// due to Ice limitations.
const bson = iceToBson(iceObject);

const readIceObject = bsonToIce(bson);
```

[npm-image]: https://badge.fury.io/js/ice-to-bson.svg
[npm-url]: https://badge.fury.io/js/ice-to-bson
[travis-image]: https://travis-ci.org/aikoven/ice-to-bson.svg?branch=master
[travis-url]: https://travis-ci.org/aikoven/ice-to-bson
