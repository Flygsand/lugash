'use strict';

var expect = require('chai').expect
  , _ = require('highland')
  , elasticsearch = require('../../../encoders/elasticsearch');

describe('encoders/elasticsearch', function() {
  it('encodes events to index operations (defaults)', function(done) {
    _([
      {
        '@timestamp': '2016-04-05T15:21:09.169Z',
        message: 'foo bar'
      }
    ])
    .pipe(elasticsearch())
    .toArray(function(ops) {
      expect(ops).to.eql(['{"index":{"_index":"lugash-2016.04.05","_type":"logs"}}\n{"@timestamp":"2016-04-05T15:21:09.169Z","message":"foo bar"}\n']);
      done();
    });
  });
});
