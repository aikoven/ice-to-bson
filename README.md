# Ice To BSON [![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

Encode and decode ZeroC Ice objects into BSON objects.

## Installation

```bash
npm install ice-to-bson
```

## Usage

```js
import {iceToBson, bsonToIce} from 'ice-to-bson';

const bson = iceToBson(iceObject);

const readIceObject = bsonToIce(bson);
```

[npm-image]: https://badge.fury.io/js/ice-to-bson.svg
[npm-url]: https://badge.fury.io/js/ice-to-bson
[travis-image]: https://travis-ci.org/aikoven/ice-to-bson.svg?branch=master
[travis-url]: https://travis-ci.org/aikoven/ice-to-bson